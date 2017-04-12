import typescript from "rollup-plugin-typescript";
import nodeResolve from "rollup-plugin-node-resolve";
import uglify from "rollup-plugin-uglify";
import serve from "rollup-plugin-serve";

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
  configuration.plugins.push(
    uglify({
      mangle: {
        toplevel: true,
      },
    })
  );
}

if (process.env.DEV) {
  console.log("http://localhost:8080/")
  configuration.plugins.push(
    serve({
      contentBase: "dist",
      historyApiFallback: false,
      port: 8080
    })
  );
}

export default configuration;
