import * as fs from "node:fs/promises";

import { getPackage } from "../pkg";

jest.mock("node:fs/promises");

describe("getPackage", () => {
	test("success", async () => {
		// Arrange.
		const spyOnReadFile = jest.spyOn(fs, "readFile").mockReturnValue(
			Promise.resolve(
				JSON.stringify({
					version: "1.2.3",
				}),
			),
		);

		// Act, assert.
		expect(getPackage()).resolves.toEqual({
			version: "1.2.3",
		});
	});

	test("default path (undefined)", async () => {
		// Arrange.
		const spyOnReadFile = jest.spyOn(fs, "readFile").mockReturnValue(
			Promise.resolve(
				JSON.stringify({
					version: "1.2.3",
				}),
			),
		);

		// Act.
		await getPackage("./other.json");

		// Assert.
		expect(spyOnReadFile).toHaveBeenCalledTimes(1);
		expect(spyOnReadFile).toHaveBeenCalledWith("./other.json", { encoding: "utf-8" });
	});

	test("default path (empty)", async () => {
		// Arrange.
		const spyOnReadFile = jest.spyOn(fs, "readFile").mockReturnValue(
			Promise.resolve(
				JSON.stringify({
					version: "1.2.3",
				}),
			),
		);

		// Act.
		await getPackage("");

		// Assert.
		expect(spyOnReadFile).toHaveBeenCalledTimes(1);
		expect(spyOnReadFile).toHaveBeenCalledWith("./package.json", { encoding: "utf-8" });
	});

	test("invalid json fails", async () => {
		// Arrange.
		jest.spyOn(fs, "readFile").mockReturnValue(Promise.resolve('{"invalid"'));

		// Act, assert.
		await expect(getPackage()).rejects.toThrow("Failed to read contents of ./package.json");
	});

	test("missing version fails", async () => {
		// Arrange.
		jest.spyOn(fs, "readFile").mockReturnValue(Promise.resolve(JSON.stringify({})));

		// Act, assert.
		await expect(getPackage()).rejects.toThrow("Failed to read contents of ./package.json");
	});
});
