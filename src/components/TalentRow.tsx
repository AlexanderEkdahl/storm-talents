import { h } from "preact";
import { ITalent } from "../interfaces";
import { TIERS } from "../interfaces";
import Talent from "./Talent";

export interface ITalentRowProps {
    i: number;
    scaleX: (i: number) => number;
    scaleY: (i: number, j: number) => number;
    talents: ITalent[];
    iconSize: number;
    onClick: (i: number, j: number) => void;
    selections: number;
    height: number;
    tierOffset: number;
    onMouseEnter: (i: number, j: number) => void;
    onMouseLeave: () => void;
}

export default (props: ITalentRowProps) => {
    const { i, scaleX, scaleY, iconSize, onClick, selections, talents,
        height, tierOffset, onMouseEnter, onMouseLeave } = props;

    const row = talents.map((talent, j) => (
        <Talent
            x={scaleX(i)}
            y={scaleY(i, j)}
            iconSize={iconSize}
            onClick={() => onClick(i, j)}
            onMouseEnter={() => onMouseEnter(i, j)}
            onMouseLeave={onMouseLeave}
            selected={selections === j}
            j={j}
            talent={talent}
        />
    ));

    return (
        <g>
            {row}
            <text
                style={{ textAnchor: "middle", fontSize: 28, fill: "white" }}
                x={scaleX(i) + iconSize / 2}
                y={height - 25}
                dy=".32em"
            >
                {i === 0 ? 1 : TIERS[i] + tierOffset}
            </text>
        </g>
    );
};
