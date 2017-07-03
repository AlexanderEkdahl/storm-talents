import { Component, h } from "preact";
import { ITalent, TIERS } from "../interfaces";
import Paths from "./Paths";
import TalentRow from "./TalentRow";
import Tooltip from "./Tooltip";

export interface ITreeProps {
    talents: ITalent[][];
    onClick: (i: number, j: number) => void;
    selections: number[];
    height: number;
    width: number;
    tierOffset: number;
}

interface ITreeState {
    hovering: false | [number, number];
}

export default class Tree extends Component<ITreeProps, ITreeState> {
    public state: ITreeState = {
        hovering: false,
    };

    public render() {
        const { talents, onClick, selections, height, width, tierOffset } = this.props;
        const outerPadding = 50;
        const verticalPadding = 20;
        const iconSize = 80;
        const scaleX = (i: number) => Math.round(outerPadding + ((width - outerPadding * 2 - iconSize * 7) / 6 + iconSize) * i);
        const scaleY = (i: number, j: number) =>
            Math.round(height - outerPadding - (talents[i].length - j) * iconSize - (talents[i].length - j - 1) * verticalPadding);

        const row = TIERS.map((_, i) =>
            TalentRow({
                onMouseEnter: this.onMouseEnter,
                onMouseLeave: this.onMouseLeave,
                height,
                i,
                iconSize,
                onClick,
                scaleX,
                scaleY,
                selections: selections[i],
                talents: talents[i],
                tierOffset,
            }),
        );

        let tooltip;
        if (this.state.hovering) {
            const [i, j] = this.state.hovering;

            tooltip = <Tooltip i={i} j={j} iconSize={iconSize} talent={talents[i][j]} scaleX={scaleX} scaleY={scaleY} />;
        }

        return (
            <svg width={width} height={height} style={{ display: "block" }}>
                {Paths({ iconSize, scaleX, scaleY, selections })}
                {row}
                {tooltip}
            </svg>
        );
    }

    private onMouseEnter = (i: number, j: number) => {
        this.setState({
            hovering: [i, j],
        });
    };

    private onMouseLeave = () => {
        this.setState({
            hovering: false,
        });
    };
}
