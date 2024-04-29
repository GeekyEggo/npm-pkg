import { readFile } from "node:fs/promises";
import * as z from "zod";

const DEFAULT_PATH = "./package.json";

/**
 * Gets the package information from the specified path.
 * @param path Path to the package.json file.
 * @returns The package information.
 */
export async function getPackage(path?: string): Promise<Package> {
	path = path === undefined || path === "" ? DEFAULT_PATH : path;
	const pkg = z.object({
		version: z.string(),
	});

	try {
		const contents = await readFile(path, { encoding: "utf-8" });
		const json = JSON.parse(contents);

		return pkg.parse(json);
	} catch (cause) {
		throw new Error(`Failed to read contents of ${path}`, { cause });
	}
}

/**
 * Information parsed from a package.json file.
 */
export type Package = {
	/**
	 * The version of the package.
	 */
	version: string;
};
