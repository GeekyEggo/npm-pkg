import * as core from "@actions/core";
import * as fs from "node:fs/promises";
import { ZodError } from "zod";

import { getVersion } from "../pkg";

jest.mock("@actions/core");
jest.mock("node:fs/promises");

describe("getVersion", () => {
	// @ts-expect-error noop process.exit
	beforeAll(() => jest.spyOn(process, "exit").mockImplementation(() => {}));

	test("success", async () => {
		// Arrange.
		jest.spyOn(fs, "readFile").mockReturnValue(
			Promise.resolve(
				JSON.stringify({
					version: "1.2.3",
				}),
			),
		);

		// Act, assert.
		expect(getVersion()).resolves.toBe("1.2.3");
	});

	test("invalid json fails", async () => {
		// Arrange
		jest.spyOn(fs, "readFile").mockReturnValue(Promise.resolve('{"invalid"'));

		// Act.
		await getVersion();

		// Assert.
		expect(core.error).toHaveBeenCalledTimes(1);
		expect(core.error).toHaveBeenCalledWith("Failed to read contents of ./package.json");
		expect(core.setFailed).toHaveBeenCalledTimes(1);
		expect(core.setFailed).toHaveBeenCalledWith(expect.any(SyntaxError));
	});

	test("missing version fails", async () => {
		// Arrange.
		jest.spyOn(fs, "readFile").mockReturnValue(Promise.resolve(JSON.stringify({})));

		// Act.
		await getVersion();

		// Assert.
		expect(core.error).toHaveBeenCalledTimes(1);
		expect(core.error).toHaveBeenCalledWith("Failed to read contents of ./package.json");
		expect(core.setFailed).toHaveBeenCalledTimes(1);
		expect(core.setFailed).toHaveBeenCalledWith(expect.any(ZodError));
	});
});
