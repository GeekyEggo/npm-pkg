import * as core from "@actions/core";

import { setVersionOutput } from "..";

jest.mock("@actions/core");

describe("setVersionOutput", () => {
	const testCases = [
		{
			name: "success",
			version: "1.2.3",
			expect: {
				major: 1,
				minor: 2,
				patch: 3,
				tag: "latest",
			},
		},
		{
			name: "success (with preid string)",
			version: "4.5.6-beta",
			expect: {
				major: 4,
				minor: 5,
				patch: 6,
				tag: "beta",
			},
		},
		{
			name: "success (with preid number)",
			version: "4.5.6-1",
			expect: {
				major: 4,
				minor: 5,
				patch: 6,
				tag: 1,
			},
		},
		{
			name: "success (with preid and version)",
			version: "7.8.9-beta.1",
			expect: {
				major: 7,
				minor: 8,
				patch: 9,
				tag: "beta",
			},
		},
	];

	test.each(testCases)("$name", ({ version, expect: { major, minor, patch, tag } }) => {
		// Arrange, act.
		const pkg = { version };
		setVersionOutput(pkg);

		// Assert.
		expect(core.setOutput).toHaveBeenCalledTimes(4);
		expect(core.setOutput).toHaveBeenNthCalledWith(1, "version-major", major);
		expect(core.setOutput).toHaveBeenNthCalledWith(2, "version-minor", minor);
		expect(core.setOutput).toHaveBeenNthCalledWith(3, "version-patch", patch);
		expect(core.setOutput).toHaveBeenNthCalledWith(4, "version-tag", tag);
	});

	test("undefined version fails", async () => {
		// Arrange, act, assert.
		expect(() => {
			// @ts-expect-error Test undefined version.
			setVersionOutput({ version: undefined });
		}).toThrow("Failed to parse version: undefined");
	});

	test("invalid version fails", async () => {
		// Arrange, act, assert.
		expect(() => {
			setVersionOutput({ version: "a.b.c" });
		}).toThrow("Failed to parse version: a.b.c");
	});
});
