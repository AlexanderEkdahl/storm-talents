require 'json'

file = File.read('heroes.json')
heroes = JSON.parse(file)
paths = []

`mkdir -p ../dist/data/`

File.open("../src/heroes.ts", "w") do |f|
    index = heroes.map { |hero| { name: hero["name"], id: hero["id"] }}
    f.write("/* tslint:disable */\nexport default #{JSON.pretty_generate(index)}")
end

heroes.each do |hero|
    hero["talents"].each do |talents|
        talents.each do |talent|
            paths.push(talent["icon"])
        end
    end

    File.open("../dist/data/#{hero["id"]}.json", "w") do |f|
        f.write(hero.to_json)
    end
end

`mkdir -p ../dist/icons/`

paths.uniq.each do |path|
    `convert ./out/mods/heroes.stormmod/base.stormassets/Assets/Textures/#{path} ../dist/icons/#{path}.png`
end
