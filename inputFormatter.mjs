import fs from "fs";

/**
 * Reads text file using fs.readFileSync, then removes white-space and converts each string to number
 */
export function inputFormatter(input) {
	const data = fs.readFileSync(input, "utf-8");

	return data
		.split(/\s/gm)
		.filter((num) => num !== "")
		.map((num) => Number(num));
}
