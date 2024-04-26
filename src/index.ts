import * as core from "@actions/core";
import semver from "semver";

import { getVersion } from "./pkg";

/**
 * Runs the action.
 */
export async function run() {
	// Get the version from the package.
	const pkgVersion = await getVersion();
	if (pkgVersion === undefined) {
		return;
	}

	// Parse and validate the version.
	const version = semver.parse(pkgVersion);
	if (version === null) {
		core.setFailed(`Failed to parse version: ${pkgVersion}`);
		return;
	}

	// Output the version information.
	core.setOutput("version.major", version.major);
	core.setOutput("version.minor", version.minor);
	core.setOutput("version.patch", version.patch);

	// Output the prerelease identifier
	const [maybeTag] = version.prerelease;
	const tag = typeof maybeTag === "string" ? maybeTag : "latest";
	core.setOutput("version.tag", tag);
}

run();
