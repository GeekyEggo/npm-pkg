import * as core from "@actions/core";

import { setVersionOutput } from "./outputs";
import { getPackage } from "./pkg";

/**
 * Runs the action.
 */
export async function run() {
	try {
		const path = core.getInput("path", { required: false });
		const pkg = await getPackage(path);

		setVersionOutput(pkg);
	} catch (err) {
		core.setFailed(err as Error);
	}
}
