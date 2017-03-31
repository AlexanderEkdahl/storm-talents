const storm = require('storm-extract');
const libxml = require("libxmljs");
const path = require("path");
const fs = require("fs");
const jsen = require("jsen")

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

const files = storm
    .listFiles('/Applications/Heroes of the Storm/')
    .filter((file) => file.endsWith(".xml") || file.endsWith("GameStrings.txt"));

const readFile = (file) => fs.readFileSync(path.join(__dirname, 'tmp', file), { encoding: "utf8" })

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
            hero.name = strings[`Unit/Name/${getValue(node, "Unit", `Hero${hero.id}`)}`];
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

                hero.talents[tier].push({
                    id: talentId,
                    column: column,
                });
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
            icon: icon.replace('Assets\\Textures\\', ''),
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
            return heroes[id].talents[tier].map((talent) => {
                let talentDescription;
                if (icons[talents[talent.id].face].textPath) {
                    talentDescription = strings[icons[talents[talent.id].face].textPath];
                } else {
                    talentDescription = strings[`Button/SimpleDisplayText/${talents[talent.id].face}`];
                }

                return {
                    id: talent.id,
                    name: talents[talent.id].name,
                    description: talentDescription,
                    icon: icons[talents[talent.id].face].icon,
                };
            })
        })
    };
}).map((hero) => {
    if (!validator(hero)) {
        console.error(hero.id, validator.errors);
    }

    return hero;
});

fs.writeFileSync('heroes.json', JSON.stringify(output, undefined, '\t'), { encoding: "utf8" })

function getValue(node, subnodeName, defaultValue = undefined) {
    if (!node)
        return defaultValue;

    var subnode = node.get(subnodeName);
    if (!subnode)
        return defaultValue;

    return attributeValue(subnode, "value", defaultValue);
}

function attributeValue(node, attrName, defaultValue = undefined) {
    if (!node)
        return defaultValue;

    var attr = node.attr(attrName);
    if (!attr)
        return defaultValue;

    return attr.value();
}
