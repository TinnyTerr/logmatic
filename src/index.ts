import consoleColours from "console-log-colors";
import { colorize } from "json-colorizer";
import axios from "axios";
import fs from "node:fs";
import path from "node:path";

function getTime(): string {
	const now = new Date();
	const date = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
	return date.toISOString().replace(/.*T(.*)Z/, "$1");
}

/**
 * Optional enum of default levels. Corresponds to array
 */
export enum Level {
	Trace = 0,
	Debug = 1,
	Info = 2,
	Warn = 3,
	Error = 4,
	Fatal = 5,
}

const defaultLevels = [
	{ name: "trace", colour: "cyanBright" },
	{ name: "debug", colour: "blueBG" },
	{ name: "info", colour: "blue" },
	{ name: "warn", colour: "yellow" },
	{ name: "error", colour: "red" },
	{ name: "fatal", colour: "redBG" },
] as const;

type DefaultLevels = typeof defaultLevels;

class Logger<const T extends readonly customLevel[] = DefaultLevels> {
	name: string;
	webData: any[] = [];
	options: Options & {
		levels: customLevel[];
		functions: logFunction[];
	};
	webCounter: number = 0;
	funcs: Array<(level: Level, ...data: any[]) => void> = [];
	constructor(name: string, options: Partial<ClassOptions> = {}, levels?: T) {
		this.name = name;

		const normalizedFunctions: logFunction[] = Array.isArray(options.functions)
			? options.functions
			: options.functions
				? [options.functions]
				: [];

		const defaultConsole: console =
			options.console?.enabled === true
				? {
					enabled: true,
					logLevel: options.console?.logLevel ?? Level.Debug,
					suppressWarnings: options.console?.suppressWarnings ?? false,
					format: options.console?.format ?? false,
					indent: options.console?.indent ?? 0,
				}
				: { enabled: false }

		const defaultFiles: files =
			options.files?.enabled === true
				? {
					enabled: true,
					path: options.files?.path ?? "",
					name: options.files?.name ?? "",
					type: options.files?.type ?? "json",
				}
				: { enabled: false };

		const defaultWeb: web =
			options.web?.enabled === true
				? {
					enabled: true,
					url: options.web?.url ?? "",
					type: options.web?.type ?? "json",
					every: options.web?.every ?? 5,
				}
				: { enabled: false };


		const defaultLevels = [
			{ name: "trace", colour: "cyanBright" },
			{ name: "debug", colour: "blueBG" },
			{ name: "info", colour: "blue" },
			{ name: "warn", colour: "yellow" },
			{ name: "error", colour: "red" },
			{ name: "fatal", colour: "redBG" },
		] as const;

		const defaultFunctions: logFunction[] = [];

		this.options = {
			console: { ...defaultConsole, ...(options.console ?? {}) } as console,
			files: { ...defaultFiles, ...(options.files ?? {}) } as files,
			web: { ...defaultWeb, ...(options.web ?? {}) } as web,
			// @ts-expect-error - Type mismatch
			levels: Array.isArray(levels)
				? levels
				: levels
					? [levels]
					: [...defaultLevels],
			functions: Array.isArray(options.functions)
				? options.functions
				: options.functions
					? [options.functions]
					: defaultFunctions,
		};

		this.funcs = normalizedFunctions ?? [];
		this.loggers = {} as {
			[K in T[number]as K['name']]: (...args: any[]) => void;
		}

		// Generate logger functions
		for (let i = 0; i < this.options.levels.length; i++) {
			const level = this.options.levels[i];
			this.loggers[level.name] = (...data: any[]) => {
				try {
					this.logs.console(i, ...data);
					this.logs.files(i, ...data);
					this.logs.funcs(i, ...data);
					this.logs.web(i, ...data);
				} catch (error) {
					this.internalLogging(`threw ${error}`);
				}
			};
		}

		if (this.options.web.enabled) {
			this.webCounter = this.options.web.every;
		}
	}

	loggers: {
		[K in T[number]as K['name']]: (...args: any[]) => void;
	};
	/**
	 * Pushes custom handling functions on top of the already selected methods
	 */
	public addFunctions(...funcs: Array<(level: Level, ...data: any[]) => void>) {
		this.funcs.push(...funcs);
	}
	/**
	 * Sets the array of custom handling functions, replacing existing.
	 */
	public setFunctions(...funcs: Array<(level: Level, ...data: any[]) => void>) {
		this.funcs = funcs;
	}
	private logs: {
		console: (level: number, ...data: any[]) => void;
		files: (level: number, ...data: any[]) => void;
		web: (level: number, ...data: any[]) => void;
		funcs: (level: number, ...data: any[]) => void;
	} = {
			console: async (level: number, ...data) => {
				// Ensure that logging is enabled and the level is allowed by the logLevel
				if (
					!this.options.console.enabled ||
					level < this.options.console.logLevel
				) {
					return;
				}

				let message = "";

				for (let i = 0; i < data.length; i++) {
					const v = data[i];

					if (typeof v === "string") {
						message += ` ${v}`;
					} else if (typeof v === "object") {
						const jsonString = JSON.stringify(
							v,
							null,
							this.options.console.indent,
						);

						message += ` ${this.options.console.format
							? colorize(jsonString, {
								indent: this.options.console.indent,
							})
							: jsonString
							}`;
					} else {
						message += ` ${String(v)}`;
					}
				}

				const time = getTime();

				const title = [
					time,
					`[${this.options.levels[level].name}]`,
					this.name,
				].join(" ");

				// TODO: make this an option
				const indent = `\n${" ".repeat(title.length - 1)}>`;
				message = message.replace(/\n/g, indent);

				// Log the message with the corresponding color and level
				console.log(
					consoleColours.gray(time),
					consoleColours[this.options.levels[level].colour](
						`[${this.options.levels[level].name}]`,
					),
					consoleColours.underline(this.name),
					consoleColours.reset(""),
					message.slice(1),
				);
			},
			//TODO: Test this function.
			files: async (level, ...data) => {
				if (!this.options.files.enabled) {
					return;
				}

				let message = "";

				for (let i = 0; i < data.length; i++) {
					const v = data[i];

					if (typeof v === "string") {
						message += ` ${v}`;
					} else if (typeof v === "object") {
						message += ` ${JSON.stringify(v)}`;
					} else {
						message += ` ${String(v)}`;
					}
				}

				if (this.options.files.type === "json") {
					fs.mkdirSync(path.dirname(this.options.files.path), {
						recursive: true,
					});

					fs.appendFileSync(
						this.options.files.path,
						JSON.stringify({ level, data: message }),
					);
				} else {
					fs.mkdirSync(path.dirname(this.options.files.path), {
						recursive: true,
					});

					// Write data to the file
					fs.appendFileSync(
						this.options.files.path,
						`${getTime()} [${this.options.levels[level].name}] ${this.name} ${message.slice(1)}`,
					);
				}
			},
			//TODO: Test this function.
			web: async (level, ...data) => {
				if (this.options.web.enabled === false) {
					return;
				}

				let message = "";

				for (let i = 0; i < data.length; i++) {
					const v = data[i];

					if (typeof v === "string") {
						message += ` ${v}`;
					} else if (typeof v === "object") {
						message += ` ${JSON.stringify(v)}`;
					} else {
						message += ` ${String(v)}`;
					}
				}

				if (this.options.web.type === "json") {
					this.webData.push({ level, data: message });

					// Check if enough data is collected to send
					if (this.webData.length >= this.options.web.every) {
						await axios
							.post(this.options.web.url, JSON.stringify(this.webData))
							.then((v) => {
								if (v.status.toString().charAt(0) !== "2") {
									this.options.web.enabled = false;
									this.internalLogging(
										`Got ${v.status} (${v.statusText}) and stopping requests.`,
									);
								}
							});

						// Clear the data after sending
						this.webData = [];
					}
				} else {
					this.webData.push(
						`${getTime()} [${this.options.levels[level].name}] ${this.name} ${message.slice(1)}`,
					);

					if (this.webData.length >= this.options.web.every) {
						const data = this.webData.join("\n");

						await axios.post(this.options.web.url, data).then((v) => {
							if (v.status.toString().charAt(0) !== "2") {
								this.options.web.enabled = false;
								this.internalLogging(
									`Got ${v.status} (${v.statusText}) and stopping requests.`,
								);
							}
						});

						// Clear the data after sending
						this.webData = [];
					}
				}
			},
			//TODO: Test this function.
			funcs: async (level, ...data) => {
				for (let index = 0; index < this.funcs.length; index++) {
					const element = this.funcs[index];

					try {
						element(level, ...data);
					} catch (err) {
						this.internalLogging(
							`Function at index ${index} threw "${err}"`,
							"Removing due to unhandled error",
						);

						this.funcs.splice(index, 1);

						index--;
					}
				}
			},
		};
	/**
	 * @internal
	 */
	private internalLogging(...data: string[]) {
		if (this.options.console.enabled === true) {
			if (this.options.console.logLevel > Level.Trace) {
				return;
			}

			let message = "";

			for (let i = 0; i < data.length; i++) {
				message += `${data[i]} `;
			}

			console.log(
				consoleColours.gray(getTime()),
				consoleColours.greenBright(`[Internal]`),
				message,
			);
		}
	}
}

export { Logger };

//* Types

interface Options {
	console: console;
	files: files;
	web: web;
	levels: customLevel[]
	functions: logFunction[] | logFunction;
}

interface ClassOptions {
	console: Partial<console>;
	files: Partial<files>;
	web: Partial<web>;
	functions: logFunction[] | logFunction;
}

export type customLevel = {
	name: string;
	colour: ColourList;
};

type console =
	| {
		/**
		 * Whether console logging is enabled
		 * @default true
		 */
		enabled: true;
		/**
		 * The minimum level to log
		 * @see {Level}
		 * @default Level.Debug
		 */
		logLevel: Level;
		/**
		 * Whether to suppress warnings or errors emitted by the logger
		 * @default false
		 */
		suppressWarnings: boolean;
		/**
		 * Whether to format any JSON output
		 * @default false
		 */
		format: boolean;
		/**
		 * Whether to indent any JSON output
		 *
		 * {@link console.format} must be true if {@link console.indent} is greater than `0`
		 * @default false
		 */
		indent: number;
	}
	| {
		/**
		 * Whether console logging is enabled
		 * @default true
		 */
		enabled: false;
	};

type files =
	| {
		/**
		 * Whether file logging is enabled
		 * @default false
		 * @ignore Incomplete section
		 */
		enabled: true;
		/**
		 * The absolute path to the file to be logged in
		 * @example /path/to/file = /path/to/file.json
		 * @default null
		 * @ignore Incomplete section
		 */
		path: string;
		/**
		 * How to name the files
		 * @default null
		 * @ignore Incomplete section
		 */
		name: string;
		/**
		 * The type of file stored
		 * @default json
		 * @ignore Incomplete section
		 */
		type: "json" | "txt";
	}
	| {
		/**
		 * Whether file logging is enabled
		 * @default false
		 * @ignore Incomplete section
		 */
		enabled: false;
	};

type web =
	| {
		/**
		 * Whether web (POST) logging is enabled
		 * @default false
		 * @ignore Incomplete section
		 */
		enabled: true;
		/**
		 * The URL to post to
		 * @default null
		 * @ignore Incomplete section
		 */
		url: string;
		/**
		 * The data type sent
		 * @default json
		 * @ignore Incomplete section
		 */
		type: "json" | "txt";
		/**
		 * How many logs to store before POSTing to avoid getting ratelimited
		 * @default 5
		 * @ignore Incomplete section
		 */
		every: number;
	}
	| {
		/**
		 * Whether web (POST) logging is enabled
		 * @default false
		 * @ignore Incomplete section
		 */
		enabled: false;
	};

/**
 * A custom function ran for every log.
 */
type logFunction = (level: Level, ...data: any[]) => void;

/**
 * @see colorList From package console-log-colors
 */
type ColourList =
	| "black"
	| "red"
	| "green"
	| "yellow"
	| "blue"
	| "magenta"
	| "cyan"
	| "white"
	| "gray"
	| "grey"
	| "redBright"
	| "greenBright"
	| "yellowBright"
	| "blueBright"
	| "magentaBright"
	| "cyanBright"
	| "whiteBright"
	| "bgBlack"
	| "bgRed"
	| "bgGreen"
	| "bgYellow"
	| "bgBlue"
	| "bgMagenta"
	| "bgCyan"
	| "bgWhite"
	| "blackBG"
	| "redBG"
	| "greenBG"
	| "yellowBG"
	| "blueBG"
	| "magentaBG"
	| "cyanBG"
	| "whiteBG"
	| "bgBlackBright"
	| "bgRedBright"
	| "bgGreenBright"
	| "bgYellowBright"
	| "bgBlueBright"
	| "bgMagentaBright"
	| "bgCyanBright"
	| "bgWhiteBright";
