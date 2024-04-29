import * as core from "@actions/core";

import { run } from "../action";
import * as outputs from "../outputs";
import * as pkg from "../pkg";

jest.mock("@actions/core");

jest.mock("../outputs/version");
jest.mock("../pkg");

describe("run", () => {
	test("path input", async () => {
		// Arrange.
		jest.spyOn(core, "getInput").mockReturnValue("test.json");
		const spyOnGetPackage = jest.spyOn(pkg, "getPackage").mockReturnValue(
			Promise.resolve({
				version: "1.2.3-beta.0",
			}),
		);

		// Act.
		await run();

		expect(spyOnGetPackage).toHaveBeenCalledTimes(1);
		expect(spyOnGetPackage).toHaveBeenCalledWith("test.json");
	});

	test("set version output", async () => {
		// Arrange.
		const spyOnSetVersionOutput = jest.spyOn(outputs, "setVersionOutput");
		jest.spyOn(pkg, "getPackage").mockReturnValue(
			Promise.resolve({
				version: "1.2.3-beta.0",
			}),
		);

		// Act.
		await run();

		// Assert.
		expect(spyOnSetVersionOutput).toHaveBeenCalledTimes(1);
		expect(spyOnSetVersionOutput).toHaveBeenCalledWith({
			version: "1.2.3-beta.0",
		});
	});

	test("invalid package", async () => {
		// Arrange.
		const spyOnSetVersionOutput = jest.spyOn(outputs, "setVersionOutput");
		jest.spyOn(pkg, "getPackage").mockReturnValue(Promise.reject(new Error("Mocked error")));

		// Act.
		await run();

		// Assert.
		expect(spyOnSetVersionOutput).toHaveBeenCalledTimes(0);
		expect(core.setFailed).toHaveBeenCalledTimes(1);
		expect(core.setFailed).toHaveBeenCalledWith(new Error("Mocked error"));
	});
});
