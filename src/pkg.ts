import * as core from "@actions/core";
import { readFile } from "node:fs/promises";
import z from "zod";

/**
 * Gets the version from the package specified in the path.
 * @param path Path to the package.json file.
 * @returns The version.
 */
export async function getVersion(path: string = "./package.json"): Promise<string | undefined> {
	const pkg = z.object({
		version: z.string(),
	});

	try {
		const contents = await readFile(path, { encoding: "utf-8" });
		const json = JSON.parse(contents);

		return pkg.parse(json).version;
	} catch (err) {
		core.error(`Failed to read contents of ${path}`);
		core.setFailed(err as Error);
		return undefined;
	}
}
