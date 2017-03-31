import { h, render } from "preact";
import Application from "./components/Application";

render(
    <Application
        compiler="TypeScript"
        framework="React"
    />,
    document.body,
);
