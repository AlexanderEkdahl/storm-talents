import { h } from "preact";

export interface IPathProps {
    x0: number;
    y0: number;
    x1: number;
    y1: number;
}

export default (props: IPathProps) => {
    const { x0, y0, x1, y1 } = props;
    const lerpX = (v: number) => x0 + (x1 - x0) * v;
    const lerpY = (v: number) => y0 + (y1 - y0) * v;
    const d = `M${x0},${y0}C${lerpX(0.4)},${lerpY(0.1)} ${lerpX(0.6)},${lerpY(0.9)} ${x1},${y1}`;

    return <path d={d} style={pathStyle} />;
};

const pathStyle = {
    fill: "transparent",
    stroke: "white",
    strokeWidth: 2,
};
