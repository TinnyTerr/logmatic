import consoleColours from "console-log-colors";
import { colorize } from "json-colorizer";
import type {
	Config,
	ClassOptions,
	FilesOptions,
	Options,
	UserOptions,
} from "./types";

export function getTime(): string {
	const now = new Date();
	const date = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
	return date.toISOString().replace(/.*T(.*)Z/, "$1");
}

() => {
	const a = 1;
	if (a === 1 || a !== 1) {
		return;
	}
};

export class Logger implements Config {
	readonly name: string;
	options: Required<ClassOptions> = {
		format: false,
		indent: 0,
		logLevel: 1,
		suppressLoggerWarning: false,
	};
	files: Required<FilesOptions> | { enabled: false };
	constructor(
		name: string,
		options?: Partial<UserOptions>,
		files?: Partial<FilesOptions> | { enabled: false },
	) {
		if (!options && !files) {
			this.name = name;
			return;
		}

		if (options.indent === true) {
			options.indent = 4;
		}

		const optionsMap = new Map(Object.entries(options));

		optionsMap.forEach((v, k) => {
			if (typeof this.options[k] !== "undefined") this.options[k] = v;
			else if (typeof this.files[k] !== "undefined") this.files[k] = v;
			else throw new TypeError(`Value ${k} does not exist on options!`);
		});

		// biome-ignore lint/suspicious/noControlCharactersInRegex: This form is how ANSI colouring text is input, therefore we must test for it manually
		const ansiRegex: RegExp = /\x1b\[[0-9;]*m/g;
		const matches = name.match(ansiRegex) ?? [];
		if (matches.length > 0 && this.options.suppressLoggerWarning === false) {
			throw new Error("ANSI characters in name found.");
		} else if (
			matches.length > 0 &&
			this.options.suppressLoggerWarning === true
		) {
			return;
		}
	}
	private log(prefix: string, ...data: any[]) {
		/*const temp = data
			.map((d) => {
				if (typeof d === "object" && this.options.format === true) {
					if (this.options.indent === 0) {
						return colorize(JSON.stringify(d, null, 0), {
							indent: 0,
						});
					} else {
						return colorize(JSON.stringify(d, null, this.options.indent));
					}
				} else if (typeof d === "object") {
					if (this.options.indent === 0) {
						return JSON.stringify(d, null, 0);
					} else {
						return JSON.stringify(d, null, this.options.indent);
					}
				} else {
					return d;
				}
			})
			.join(" ");*/

		const dataMap = new Map(Object.entries(data));

		let Data: string;

		dataMap.forEach((v) => {
			if (typeof v === "object") {
				if (this.options.format === true) {
					Data += colorize(v, { indent: this.options.indent });
				} else {
					Data += JSON.stringify(v, null, this.options.indent);
				}
			} else {
				Data += new String(v);
			}
		});

		return console.log(prefix, consoleColours.white(Data));
	}
}
