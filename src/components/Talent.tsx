import { Component, h } from "preact";
import { ITalent } from "../interfaces";

export interface ITalentProps {
    y: number;
    x: number;
    iconSize: number;
    onClick: () => void;
    selected: boolean;
    j: number;
    talent: ITalent;
}

export default class Talent extends Component<ITalentProps, {}> {
    public render() {
        const { x, y, iconSize, talent, onClick, selected, j } = this.props;

        let sign;
        let glow;

        if (selected) {
            glow = (
                <g>
                    <defs>
                        <filter id="glow" x="-30%" y="-30%" width="160%" height="160%">
                            {h("feGaussianBlur", { stdDeviation: "12 12", result: "glow" })}
                            <feMerge>
                                {h("feMergeNode", { in: "glow" })}
                            </feMerge>
                        </filter>
                    </defs>
                    <rect
                        style={{ fill: "rgba(255, 255, 255, 0.35)", filter: "url(#glow)" }}
                        x={x}
                        y={y}
                        height={iconSize}
                        width={iconSize}
                        dy=".32em"
                    />
                </g>
            );

            const baseStyle = { userSelect: "none", textAnchor: "middle", fontSize: 48 };
            sign = (
                <g>
                    <defs>
                        <filter id="shadow" x="-20%" y="-20%" width="140%" height="140%">
                            {h("feGaussianBlur", { stdDeviation: "3 3", result: "shadow" })}
                            <feMerge>
                                {h("feMergeNode", { in: "shadow" })}
                                {h("feMergeNode", { in: "shadow" })}
                                {h("feMergeNode", { in: "shadow" })}
                            </feMerge>
                        </filter>
                    </defs>
                    <text
                        style={{ ...baseStyle, filter: "url(#shadow)" }}
                        x={x + iconSize / 2}
                        y={y + iconSize / 2}
                        dy=".32em"
                    >
                        {j + 1}
                    </text>
                    <text
                        style={{ ...baseStyle, fill: "white" }}
                        x={x + iconSize / 2}
                        y={y + iconSize / 2}
                        dy=".32em"
                    >
                        {j + 1}
                    </text>
                </g>
            );
        }

        return (
            <g onClick={onClick} style={{ cursor: "pointer" }}>
                {glow}
                <image
                    xlinkHref={`/icons/${talent.icon}.png`}
                    x={x}
                    y={y}
                    height={iconSize}
                    width={iconSize}
                />
                {sign}
            </g>
        );
    }
}
