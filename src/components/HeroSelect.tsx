import { h } from "preact";
import { IHero } from "../interfaces.js";

export interface IHeroSelectProps {
    selected: string;
    heroes: Array<{ name: string; id: string }>;
    onSelection: (heroId: string) => void;
    height: number;
}

const option = (selected: string) => (hero: IHero) =>
    <option value={hero.id} selected={selected === hero.id}>
        {hero.name}
    </option>;

export default (props: IHeroSelectProps) => {
    const { selected, heroes, onSelection, height } = props;
    return (
        <div style={{ height }}>
            <select
                onChange={e => onSelection((e.target as HTMLSelectElement).value)} // tslint:disable-line
                style={selectStyle}
            >
                {heroes.map(option(selected))}
            </select>
        </div>
    );
};

const selectStyle = {
    fontSize: 20,
    margin: 20,
    outline: "none",
};
