import { h } from "preact";
import { ITalent, TIERS } from "../interfaces";
import Paths from "./Paths";
import TalentRow from "./TalentRow";

export interface ITreeProps {
    talents: ITalent[][];
    onClick: (i: number, j: number) => void;
    selections: number[];
    height: number;
    width: number;
    tierOffset: number;
}

export default (props: ITreeProps) => {
    const { talents, onClick, selections, height, width, tierOffset } = props;
    const outerPadding = 50;
    const verticalPadding = 20;
    const iconSize = 80;
    const scaleX = (i: number) =>
        Math.round(outerPadding + ((width - outerPadding * 2 - iconSize * 7) / 6 + iconSize) * i);
    const scaleY = (i: number, j: number) =>
        Math.round(height - outerPadding -
            (talents[i].length - j) * iconSize - (talents[i].length - j - 1) * verticalPadding);

    const row = TIERS.map((_, i) => TalentRow({
        height,
        i,
        iconSize,
        onClick,
        scaleX,
        scaleY,
        selections: selections[i],
        talents: talents[i],
        tierOffset,
    }));

    return (
        <svg width={width} height={height} style={{ display: "block" }}>
            {Paths({ iconSize, scaleX, scaleY, selections })}
            {row}
        </svg >
    );
};
