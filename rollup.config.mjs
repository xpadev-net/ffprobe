import * as path from "node:path";
import { fileURLToPath } from "node:url";
import babel from "@rollup/plugin-babel";
import { nodeResolve } from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { banner } from "./rollup.banner.mjs";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export default {
  input: "src/main.ts",
  output: {
    file: "dist/bundle.js",
    format: "umd",
    name: "NiconiComments",
    banner,
  },
  plugins: [
    typescript(),
    babel({
      babelHelpers: "bundled",
      configFile: path.resolve(__dirname, ".babelrc.js"),
    }),
    nodeResolve(),
  ],
};
