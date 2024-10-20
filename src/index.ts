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
	/**
	 * Log a trace
	 * @param data Any information to be logged
	 */
	public trace(...data: any[]) {
		let log;
		if (this.files.enabled === true) {
			if (this.files.noConsole === false) {
				log = this.log(
					`${consoleColours.grey(getTime())} ${consoleColours.underline(this.name)}${consoleColours.blue(" [Trace] ")}`,
					data,
				);
			}
		}

		return log;
	}
	/**
	 * Log a debug
	 * @param data Any information to be logged
	 */
	public debug(...data: any[]) {
		return this.log(
			`
		${consoleColours.grey(
			getTime(),
		)} ${consoleColours.underline(this.name)}${consoleColours.cyan(
			" [Debug] ",
		)}`,
			data,
		);
	}
	/**
	 * Log a info
	 * @param data Any information to be logged
	 */
	public info(...data: any[]) {
		return this.log(
			`
		${consoleColours.grey(
			getTime(),
		)} ${consoleColours.underline(this.name)}${consoleColours.blueBright(
			" [Info] ",
		)}`,
			data,
		);
	}
	/**
	 * Log a warning
	 * @param data Any information to be logged
	 */
	public warn(...data: any[]) {
		return this.log(
			`
		${consoleColours.grey(
			getTime(),
		)} ${consoleColours.underline(this.name)}${consoleColours.yellow(
			" [Warning] ",
		)}`,
			data,
		);
	}
	/**
	 * Log a error
	 * @param data Any information to be logged
	 */
	public error(...data: any[]) {
		return this.log(
			`
		${consoleColours.grey(
			getTime(),
		)} ${consoleColours.underline(this.name)}${consoleColours.redBright(
			" [Error] ",
		)}`,
			data,
		);
	}
	/**
	 * Log a fatal
	 * @param data Any information to be logged
	 */
	public fatal(...data: any[]) {
		return this.log(
			`
		${consoleColours.grey(
			getTime(),
		)} ${consoleColours.underline(this.name)}${consoleColours.bgRed(
			" [Fatal] ",
		)}`,
			data,
		);
	}
}
