import commonjs from "@rollup/plugin-commonjs";
import nodeResolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";

export default {
	input: "./src/index.ts",
	output: {
		file: "./dist/index.js",
		format: "commonjs",
	},
	plugins: [
		typescript(),
		nodeResolve(),
		commonjs(),
	],
};
