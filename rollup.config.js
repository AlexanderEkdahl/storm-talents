import closure from 'rollup-plugin-closure-compiler-js';
import nodeResolve from "rollup-plugin-node-resolve";
import serve from "rollup-plugin-serve";
import typescript from "rollup-plugin-typescript";

const configuration = {
  entry: "src/index.tsx",
  dest: "dist/bundle.js",
  format: "es",
  sourceMap: true,
  plugins: [
    typescript({
      typescript: require("typescript"),
    }),
    nodeResolve({ jsnext: true, browser: true }),
  ],
};

if (process.env.PRODUCTION) {
  configuration.sourceMap = false;
  configuration.plugins.push(
    closure()
  );
}

if (process.env.DEV) {
  configuration.plugins.push(
    serve({
      verbose: true,
      contentBase: "dist",
      historyApiFallback: false,
      port: 8080
    })
  );
}

export default configuration;
