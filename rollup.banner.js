import pkg from "./package.json" with { type: "json" };

export const banner = `/*!
  ${pkg.name} v${pkg.version}
  (c) ${new Date().getFullYear()} xpadev-net https://xpa.dev
  Released under the ${pkg.license} License.
*/`;
