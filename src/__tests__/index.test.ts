import * as core from "@actions/core";

import { run } from "../index";
import * as pkg from "../pkg";

jest.mock("../pkg");
jest.mock("@actions/core");

describe("run", () => {
	test("success", async () => {
		// Arrange.
		jest.spyOn(pkg, "getVersion").mockReturnValue(Promise.resolve("1.2.3"));

		// Act.
		await run();

		// Assert.
		expect(core.setOutput).toHaveBeenCalledTimes(4);
		expect(core.setOutput).toHaveBeenNthCalledWith(1, "version.major", 1);
		expect(core.setOutput).toHaveBeenNthCalledWith(2, "version.minor", 2);
		expect(core.setOutput).toHaveBeenNthCalledWith(3, "version.patch", 3);
		expect(core.setOutput).toHaveBeenNthCalledWith(4, "version.tag", "latest");
		expect(core.setFailed).toHaveBeenCalledTimes(0);
	});

	test("success with pre id (beta)", async () => {
		// Arrange.
		jest.spyOn(pkg, "getVersion").mockReturnValue(Promise.resolve("7.8.9-beta"));

		// Act.
		await run();

		// Assert.
		expect(core.setOutput).toHaveBeenCalledTimes(4);
		expect(core.setOutput).toHaveBeenNthCalledWith(1, "version.major", 7);
		expect(core.setOutput).toHaveBeenNthCalledWith(2, "version.minor", 8);
		expect(core.setOutput).toHaveBeenNthCalledWith(3, "version.patch", 9);
		expect(core.setOutput).toHaveBeenNthCalledWith(4, "version.tag", "beta");
		expect(core.setFailed).toHaveBeenCalledTimes(0);
	});

	test("success with pre id and version (beta.0)", async () => {
		// Arrange.
		jest.spyOn(pkg, "getVersion").mockReturnValue(Promise.resolve("0.0.3-rc.1"));

		// Act.
		await run();

		// Assert.
		expect(core.setOutput).toHaveBeenCalledTimes(4);
		expect(core.setOutput).toHaveBeenNthCalledWith(1, "version.major", 0);
		expect(core.setOutput).toHaveBeenNthCalledWith(2, "version.minor", 0);
		expect(core.setOutput).toHaveBeenNthCalledWith(3, "version.patch", 3);
		expect(core.setOutput).toHaveBeenNthCalledWith(4, "version.tag", "rc");
		expect(core.setFailed).toHaveBeenCalledTimes(0);
	});

	test("success with pre version (0)", async () => {
		// Arrange.
		jest.spyOn(pkg, "getVersion").mockReturnValue(Promise.resolve("4.5.0-1"));

		// Act.
		await run();

		// Assert.
		expect(core.setOutput).toHaveBeenCalledTimes(4);
		expect(core.setOutput).toHaveBeenNthCalledWith(1, "version.major", 4);
		expect(core.setOutput).toHaveBeenNthCalledWith(2, "version.minor", 5);
		expect(core.setOutput).toHaveBeenNthCalledWith(3, "version.patch", 0);
		expect(core.setOutput).toHaveBeenNthCalledWith(4, "version.tag", "latest");
		expect(core.setFailed).toHaveBeenCalledTimes(0);
	});

	test("undefined version fails", async () => {
		// Arrange.
		jest.spyOn(pkg, "getVersion").mockReturnValue(Promise.resolve(undefined));

		// Act.
		await run();

		// Assert.
		expect(core.setFailed).toHaveBeenCalledTimes(0);
		expect(core.setOutput).toHaveBeenCalledTimes(0);
	});

	test("invalid version fails", async () => {
		// Arrange.
		jest.spyOn(pkg, "getVersion").mockReturnValue(Promise.resolve("a.b.c"));

		// Act.
		await run();

		// Assert.
		expect(core.setFailed).toHaveBeenCalledTimes(1);
		expect(core.setFailed).toHaveBeenCalledWith("Failed to parse version: a.b.c");
		expect(core.setOutput).toHaveBeenCalledTimes(0);
	});
});
