import fs from "node:fs";
import path from "node:path";
import consoleColours from "console-log-colors";
import { colorize } from "json-colorizer";
import fs from "node:fs";
import path from "node:path";
import {
	type ClassOptions,
	type Config,
	type FilesOptions,
	Level,
	type UserOptions,
} from "./types";

function getTime(): string {
	const now = new Date();
	const date = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
	return date.toISOString().replace(/.*T(.*)Z/, "$1");
}

export class Logger implements Config {
	name: string;
	fileWriter?: fs.WriteStream;
	options: Required<ClassOptions> = {
		format: false,
		indent: 0,
		logLevel: 1,
		suppressLoggerWarning: false,
	};
	files: FilesOptions = { enabled: false };
	constructor(
		name: string,
		options?: Partial<UserOptions>,
		files?: Partial<FilesOptions> | { enabled: false },
	) {
		this.name = name;

		if (!options && !files) {
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
			this.internal(
				"Warning, name has ansi control characters and colouring may be malformed.",
			);
		}

		if (this.files.enabled === true) {
			if (typeof this.files.format === "undefined")
				this.files.format === "{time} {level} {message}";
			if (typeof this.files.naming === "undefined")
				this.files.naming === "json";
			if (typeof this.files.noConsole === "undefined")
				this.files.noConsole === false;
			if (typeof this.files.path === "undefined") this.files.path === "json";
			if (typeof this.files.type === "undefined") this.files.type === "json";

			if (!path.isAbsolute(this.files.path)) {
				this.internal(
					"Presuming that path provided is from project root. Using following path:",
					path.join(process.cwd(), this.files.path),
				);
				this.files.path = path.join(process.cwd(), this.files.path);

				this.fileWriter = fs.createWriteStream(this.files.path, {
					flags: "a",
				});
				this.fileWriter.write("[");
			}

			process.on("beforeExit", () => {
				if (this.files.type === "json") {
					this.fileWriter.write("]");
				}

				this.fileWriter.close();
			});
		}
	}
	private writeFile(level: Level, ...data: any[]) {
		let Data = "";

		data.forEach((v) => {
			if (typeof v === "object") {
				Data += JSON.stringify(v);
			} else {
				Data += `${v}`;
			}
			Data += " ";
		});

		if (this.files.type === "json") {
			this.fileWriter.write(
				`${JSON.stringify({
					level: `${Level[level]}`,
					time: `${getTime()}`,
					data: `${Data}`,
				})},`,
			);
		} else {
			this.fileWriter.write();
		}
	}

	private log(prefix: string, ...data: any[]) {
		let Data = "";

		data.forEach((v) => {
			if (typeof v === "object") {
				if (this.options.format === true) {
					Data += colorize(v, { indent: this.options.indent });
				} else {
					Data += JSON.stringify(v, null, this.options.indent);
				}
			} else {
				Data += `${v}`;
			}
			Data += " ";
		});

		return console.log(prefix, consoleColours.white(Data.trim()));
	}
	/**
	 * Log data as trace
	 * @param data Any information to be logged
	 */
	public trace(...data: any[]) {
		return this.log(
			`${consoleColours.grey(getTime())} ${consoleColours.underline(this.name)} ${consoleColours.blue("[Trace]")}`,
			...data,
		);
	}
	/**
	 * Log data as debug
	 * @param data Any information to be logged
	 */
	public debug(...data: any[]) {
		return this.log(
			`${consoleColours.grey(getTime())} ${consoleColours.underline(this.name)} ${consoleColours.cyan("[Debug]")}`,
			...data,
		);
	}
	/**
	 * Log data as info
	 * @param data Any information to be logged
	 */
	public info(...data: any[]) {
		return this.log(
			`${consoleColours.grey(getTime())} ${consoleColours.underline(this.name)} ${consoleColours.blueBright("[Info]")}`,
			...data,
		);
	}
	/**
	 * Log data as warning
	 * @param data Any information to be logged
	 */
	public warn(...data: any[]) {
		return this.log(
			`${consoleColours.grey(getTime())} ${consoleColours.underline(this.name)} ${consoleColours.yellow("[Warning]")}`,
			...data,
		);
	}
	/**
	 * Log data as error
	 * @param data Any information to be logged
	 */
	public error(...data: any[]) {
		return this.log(
			`${consoleColours.grey(getTime())} ${consoleColours.underline(this.name)} ${consoleColours.redBright("[Error]")}`,
			...data,
		);
	}
	/**
	 * Log data as fatal
	 * @param data Any information to be logged
	 */
	public fatal(...data: any[]) {
		return this.log(
			`${consoleColours.grey(getTime())} ${consoleColours.underline(this.name)} ${consoleColours.bgRed("[Fatal]")}`,
			...data,
		);
	}
	/**
	 * Internal logging to pass to the user.
	 * @todo Add a option to disable this logging
	 * @param data Any information to be logged
	 */
	private internal(...data: any[]) {
		return this.log(
			`${consoleColours.grey(getTime())} ${consoleColours.underline("Logger")} ${consoleColours.green("[Internal]")}`,
			...data,
		);
	}
}
