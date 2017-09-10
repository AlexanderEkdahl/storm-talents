import { h, render } from "preact";
import Application from "./components/Application.js";

render(<Application />, document.body);

import { IEncoding, pack, unpack } from "./encode.js";

// const test = (input: string) => `${input} -> ${str2values(input)}`;
// console.log(test("A"));
// console.log(test("B"));
// console.log(test("AA"));
// console.log(test("BA"));
// console.log(test("BC"));
// console.log(test("99999"));

const encoding = {
    hero: 10,
    tier0: 5,
};

const values = {
    hero: 1,
    tier0: 1,
};

console.log(pack(encoding, values));
console.log(unpack(encoding, 6));
