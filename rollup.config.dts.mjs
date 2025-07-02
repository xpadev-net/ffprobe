import dts from "rollup-plugin-dts";
import { typescriptPaths } from "rollup-plugin-typescript-paths";
import { banner } from "./rollup.banner.mjs";

export default {
  input: "./dist/dts/main.d.ts",
  output: [
    {
      file: "dist/bundle.d.ts",
      format: "es",
      banner,
    },
  ],
  plugins: [
    typescriptPaths(),
    dts({
      respectExternal: true,
    }),
  ],
};
