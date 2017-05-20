const storm = require('storm-extract');
const libxml = require("libxmljs");
const path = require("path");
const fs = require("fs");
const jsen = require("jsen");
const flattenArray = require("flatten-array");
const spawn = require( 'child_process' ).spawnSync;
const tmp = require('tmp');

const TIERS = ["1", "2", "3", "4", "5", "6", "7"];

const validator = jsen({
    "$schema": "http://json-schema.org/draft-04/schema#",
    "properties": {
        "name": {
            "id": "/properties/name",
            "type": "string"
        },
        "search": {
            "id": "/properties/search",
            "items": {
                "id": "/properties/search/items",
                "type": "string"
            },
            "type": "array"
        },
        "talents": {
            "id": "/properties/talents",
            "items": {
                "id": "/properties/talents/items",
                "items": {
                    "id": "/properties/talents/items/items",
                    "properties": {
                        "id": {
                            "id": "/properties/talents/items/items/properties/id",
                            "type": "string"
                        },
                        "description": {
                            "id": "/properties/talents/items/items/properties/description",
                            "type": "string"
                        },
                        "icon": {
                            "id": "/properties/talents/items/items/properties/icon",
                            "type": "string"
                        },
                        "name": {
                            "id": "/properties/talents/items/items/properties/name",
                            "type": "string"
                        },
                        "prerequisite": {
                            "id": "/properties/talents/items/items/properties/prerequisite",
                            "type": "string"
                        }
                    },
                    "required": [
                        "id",
                        "icon",
                        "name",
                        "description"
                    ],
                    "type": "object"
                },
                "minItems": 2,
                "maxItems": 5,
                "type": "array"
            },
            "minItems": 7,
            "maxItems": 7,
            "type": "array"
        },
        "title": {
            "id": "/properties/title",
            "type": "string"
        }
    },
    "required": [
        "id",
        "search",
        "talents",
        "name",
        "title"
    ],
    "type": "object"
});

const tmpDir = tmp.dirSync().name;
console.log(`Extracting files to: ${tmpDir}`)

const files = storm
    .listFiles('/Applications/Heroes of the Storm/')
    .filter((file) => file.endsWith(".xml") || file.endsWith("GameStrings.txt"));

storm.extractFiles('/Applications/Heroes of the Storm/', tmpDir, files);

const readFile = (file) => fs.readFileSync(path.join(tmpDir, file), { encoding: "utf8" })

const heroes = {};
libxml.parseXmlString(readFile('mods/heroesdata.stormmod/base.stormdata/GameData/ConfigData.xml'))
    .find('//HeroArray')
    .map((node) => attributeValue(node, 'value'))
    .forEach((id) => {
        heroes[id] = { id }
    })

const documents = files
    .filter((file) => file.endsWith(".xml"))
    .map(readFile)
    .map(libxml.parseXmlString);

const strings = {};

files
    .filter((file) => file.endsWith("GameStrings.txt"))
    .map(readFile)
    .forEach((data) => {
        data.split("\n").forEach(function (line) {
            strings[line.substring(0, line.indexOf("="))] = line.substring(line.indexOf("=") + 1).trim();
        });
    });

const talents = {};
const icons = {};

documents.forEach((document) => {
    document.find('CHero').forEach((node) => {
        const hero = heroes[attributeValue(node, 'id')];

        if (!hero) {
            return;
        }

        if (!hero.name) {
            hero.name = strings[`Unit/Name/${getValue(node, "Unit") || `Hero${hero.id}`}`];
        }

        hero.title = strings[`Hero/Title/${hero.id}`];
        hero.search = strings[`Hero/AdditionalSearchText/${hero.id}`].split(' ');

        if (!hero.talents) {
            hero.talents = {};
            TIERS.forEach((x) => hero.talents[x] = []);
        }

        talentNodes = node
            .find("TalentTreeArray")
            .forEach((talentNode) => {
                const talentId = attributeValue(talentNode, "Talent");

                if (!talentId) {
                    return;
                }

                const tier = attributeValue(talentNode, "Tier");
                const column = attributeValue(talentNode, "Column");
                const talent = {
                    id: talentId,
                    column: column,
                };
                const prerequisite = getValue(talentNode, "PrerequisiteTalentArray");

                if (prerequisite) {
                    talent.prerequisite = prerequisite;
                }

                hero.talents[tier].push(talent);
            });
    });

    document.find('CTalent').forEach((node) => {
        const talentId = attributeValue(node, 'id');

        if (!talentId) {
            return;
        }

        const face = getValue(node, 'Face');
        const name = strings[`Button/Name/${face}`];

        talents[talentId] = {
            name: name,
            face: face,
        }
    });

    document.find('CButton').forEach((node) => {
        const buttonId = attributeValue(node, 'id');

        if (!buttonId) {
            return;
        }

        const icon = getValue(node, 'Icon');

        if (!icon) {
            return;
        }
        const textPath = getValue(node, 'SimpleDisplayText');

        icons[buttonId] = {
            icon: icon.replace('Assets\\Textures\\', '').toLowerCase(),
            textPath: textPath,
        };
    });
});

const output = Object.keys(heroes).map((id) => {
    return {
        id: id,
        name: heroes[id].name,
        title: heroes[id].title,
        search: heroes[id].search,
        talents: TIERS.map((tier) => {
            return heroes[id].talents[tier].map((talentTier) => {
                const talent = {
                    id: talentTier.id,
                    name: talents[talentTier.id].name,
                    icon: icons[talents[talentTier.id].face].icon,
                }

                if (icons[talents[talentTier.id].face].textPath) {
                    talent.description = strings[icons[talents[talentTier.id].face].textPath];
                } else {
                    talent.description = strings[`Button/SimpleDisplayText/${talents[talentTier.id].face}`];
                }

                if (talentTier.prerequisite) {
                    talent.prerequisite = talentTier.prerequisite;
                }

                return talent;
            })
        })
    };
}).map((hero) => {
    if (!validator(hero)) {
        console.error(hero.id, validator.errors);
    }

    return hero;
});

const outputList = output.map((hero) => {
    return { id: hero.id, name: hero.name };
})

// fs.writeFileSync('heroes.json', JSON.stringify(output, undefined, '\t'), { encoding: "utf8" });
fs.writeFileSync('../src/heroes.ts', `/* tslint:disable */\nexport default ${JSON.stringify(outputList, undefined, '  ')}`, { encoding: "utf8" })

const dist = path.join(__dirname, '..', 'dist');

spawn('mkdir', [path.join(dist, 'heroes')]);
spawn('mkdir', [path.join(dist, 'icons')]);

output.forEach((hero) => {
    const destPath = path.join(dist, 'heroes', `${hero.id}.json`)
    fs.writeFileSync(destPath, JSON.stringify(hero), { encoding: "utf8" });
});

const images = flattenArray(output.map((hero) => hero.talents.map((talents) => talents.map((x) => x.icon))));

storm.extractFiles('/Applications/Heroes of the Storm/', tmpDir,
    images.map((image) => `mods/heroes.stormmod/base.stormassets/Assets/Textures/${image}`));

images.forEach((image) => {
    const fromPath = path.join(tmpDir, 'mods/heroes.stormmod/base.stormassets/Assets/Textures', image);
    const destPath = path.join(dist, 'icons', `${image}.jpg`);

    spawn('convert', [fromPath, '-quality', '85%', destPath]);
});

function getValue(node, subnodeName) {
    if (!node) {
        return;
    }

    var subnode = node.get(subnodeName);
    if (!subnode) {
        return;
    }

    return attributeValue(subnode, "value");
}

function attributeValue(node, attrName) {
    if (!node) {
        return;
    }

    var attr = node.attr(attrName);
    if (!attr) {
        return;
    }

    return attr.value();
}
