import Path from "./Path.js";

export interface IPathProps {
    iconSize: number;
    scaleX: (i: number) => number;
    scaleY: (i: number, j: number) => number;
    selections: number[];
}

export default (props: IPathProps) => {
    const { scaleX, scaleY, iconSize, selections } = props;
    const paths = [];

    for (let i = 1; i < selections.length; i++) {
        if (selections[i - 1] > -1 && selections[i] > -1) {
            paths.push(
                Path({
                    x0: scaleX(i - 1) + iconSize,
                    x1: scaleX(i),
                    y0: scaleY(i - 1, selections[i - 1]) + iconSize / 2,
                    y1: scaleY(i, selections[i]) + iconSize / 2,
                }),
            );
        }
    }

    return paths;
};
