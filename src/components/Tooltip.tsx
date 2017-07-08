import { h } from "preact";
import { ITalent } from "../interfaces.js";

export interface ITooltipProps {
    i: number;
    j: number;
    iconSize: number;
    talent: ITalent;
    scaleX: (i: number) => number;
    scaleY: (i: number, j: number) => number;
}

export default (props: ITooltipProps) => {
    const { i, j, scaleX, scaleY, iconSize, talent } = props;

    return (
        <g transform={`translate(${scaleX(i) + iconSize / 2},${scaleY(i, j)})`}>
            <text dy={-5} style={{ fill: "white", textAnchor: "middle" }}>
                {talent.name}
            </text>
        </g>
    );
};
