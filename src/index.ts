import consoleColours from "console-log-colors";
import { colorize } from "json-colorizer";
import { type Config, type FileOptions, Level, type Options } from "./types";

export function getTime(): string {
	const now = new Date();
	const date = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
	return date.toISOString().replace(/.*T(.*)Z/, "$1");
}

export class Logger implements Config {
	name = "";
	options: Config["options"] = {
		logLevel: 1,
		suppressWarnings: false,
		quitOnFatal: false,
		format: false,
		indent: 0,
		loggerVerbose: false,
	};
	files: Config["files"] = {
		enabled: false,
		noConsole: null,
		path: null,
		naming: null,
		type: null,
	};

	constructor(name: string, options?: Options, files?: FileOptions) {
		// Define config
		this.name = `${name}`;

		//* Setback option definitions to set values
		let Options: Options = {};
		let Files: FileOptions = {};

		if (options) {
			Options = {
				logLevel: options.logLevel ?? 1,
				suppressWarnings: options.suppressWarnings ?? false,
				quitOnFatal: options.quitOnFatal ?? false,
				format: options.format ?? false,
				loggerVerbose: options.loggerVerbose ?? false,
			};

			if (options.indent === false) {
				Options.indent = 0;
			} else if (options.indent === true) {
				Options.indent = 4;
			} else if (typeof options.indent === "number") {
				this.options.indent = options.indent;
			} else {
				this.options.indent = 0;
			}
		} else {
			this.options = {
				logLevel: 1,
				suppressWarnings: false,
				quitOnFatal: false,
				format: false,
				indent: 0,
				loggerVerbose: false,
			};
		}

		if (Options.format === true && Options.indent === 0) {
			this.internalLogging("Indent cannot be 0 when formatting is true");
		}

		if (!files || files.enabled === false) {
			this.files = {
				enabled: false,
				noConsole: null,
				path: null,
				naming: null,
				type: null,
			};
		} else {
			Files = {
				enabled: true,
				noConsole: files.noConsole ?? null,
				path: files.path ?? null,
				naming: files.naming ?? "",
				type: files.type ?? "log",
			};
		}

		//@ts-expect-error - Compiler doesn't realise that Options and Files are defined above, no matter what.
		this.options = Options;
		//@ts-expect-error - See above comment
		this.files = Files;

		// biome-ignore lint/suspicious/noControlCharactersInRegex: This form is how ANSI colouring text is input, therefore we must test for it manually
		const ansiRegex: RegExp = /\x1b\[[0-9;]*m/g;
		const matches = name.match(ansiRegex) ?? [];
		if (matches.length > 0 && this.options.suppressWarnings === false) {
			throw new Error("ANSI characters in name found.");
		} else if (matches.length > 0 && this.options.suppressWarnings === true) {
			this.internalLogging(
				"Warning, name contains ANSI characters. May affect colouring in the terminal",
			);
		}
	}

	/**
	 * The logger parser for the data
	 * @param prefix {string} The prefix of the logging
	 * @param data {any[]} User provided data
	 * @internal
	 */
	private log(level: Level, prefix: string, ...data: any[]): void {
		const temp = data
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
			.join(" ");

		const msg = `${prefix} ${temp}`;

		if (level === Level.Fatal && this.options.quitOnFatal === true) {
			console.log(msg);

			// Oooohhh Scaaaryyy!
			process.exit(1);
		}

		return console.log(msg);
	}

	/**
	 * trace
	 * @description Log a trace
	 * @argument data { any[] } Pass data or messages to log
	 */
	public trace(...data: any[]): void {
		return this.log(
			Level.Trace,
			`${consoleColours.grey(
				getTime(),
			)} ${consoleColours.underline(this.name)} ${consoleColours.blue(
				"[Trace]",
			)}`,
			...data,
		);
	}

	/**
	 * Log a debug statement
	 * @param data Any data you want to log
	 * @returns {void} log
	 */
	public debug(...data: any[]): void {
		return this.log(
			Level.Debug,
			`${consoleColours.grey(
				getTime(),
			)} ${consoleColours.underline(this.name)} ${consoleColours.cyan(
				"[Debug]",
			)}`,
			...data,
		);
	}

	/**
	 * Log a info statement
	 * @param data Any data you want to log
	 * @returns {void} log
	 */
	public info(...data: any[]): void {
		return this.log(
			Level.Info,
			`${consoleColours.grey(getTime())} ${consoleColours.underline(
				this.name,
			)} ${consoleColours.blueBright("[Info]")}`,
			...data,
		);
	}

	/**
	 * Log a warning
	 * @param data Any data you want to log
	 * @returns {void} log
	 */
	public warn(...data: any[]): void {
		return this.log(
			Level.Warn,
			`${consoleColours.grey(getTime())} ${consoleColours.underline(
				this.name,
			)} ${consoleColours.yellow("[Warn]")}`,
			...data,
		);
	}

	/**
	 * Log a error
	 * @param data Any data you want to log
	 * @returns {void} log
	 */
	public error(...data: any[]): void {
		return this.log(
			Level.Error,
			`${consoleColours.grey(getTime())} ${consoleColours.underline(
				this.name,
			)} ${consoleColours.redBright("[Error]")}`,
			...data,
		);
	}

	/**
	 * Log a fatal error
	 * @param data Any data you want to log
	 * @returns {void} log
	 */
	public fatal(...data: any[]): void {
		return this.log(
			Level.Fatal,
			`${consoleColours.grey(getTime())} ${consoleColours.underline(
				this.name,
			)} ${consoleColours.bgRed("[Fatal]")}`,
			...data,
		);
	}

	private internalLogging(message: string, ...data: unknown[]) {
		console.log(
			consoleColours.greenBright`[Internal] ` +
				message +
				consoleColours.green(
					` ${JSON.stringify(data, null, this.options.indent)}`,
				),
		);
	}
}
