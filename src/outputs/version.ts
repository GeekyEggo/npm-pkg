import * as core from "@actions/core";
import semver from "semver";

import type { Package } from "../pkg";

/**
 * Sets the outputs associated with the package's version field.
 * @param pkg Package information.
 */
export function setVersionOutput(pkg: Package): void {
	// Parse and validate the version.
	const version = semver.parse(pkg.version);
	if (version === null) {
		throw new TypeError(`Failed to parse version: ${pkg.version}`);
	}

	// Output the version information.
	core.setOutput("version-major", version.major);
	core.setOutput("version-minor", version.minor);
	core.setOutput("version-patch", version.patch);

	// Output the tag (first preid).
	const [tag] = version.prerelease;
	core.setOutput("version-tag", tag !== undefined ? tag : "latest");
}
