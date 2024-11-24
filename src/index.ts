import consoleColours from 'console-log-colors';
import { colorize } from 'json-colorizer';
// !Module support!
import pkg from 'lodash';
const { merge } = pkg;

function getTime(): string {
	const now = new Date();
	const date = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
	return date.toISOString().replace(/.*T(.*)Z/, '$1');
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

class Logger {
	[key: string]: ((...data: any[]) => void) | unknown;
	name: string;
	options: Options & {
		levels: customLevel[];
		functions: logFunction[];
	};

	funcs: Array<(level: Level, ...data: any[]) => void> = [];
	constructor(name: string, options: Partial<Options> = {}) {
		const defaults: Options & {
			levels: customLevel[];
			functions: logFunction[];
		} = {
			console: {
				enabled: true,
				format: false,
				indent: 0,
				logLevel: 1,
				suppressWarnings: false,
			},
			files: { enabled: false },
			web: { enabled: false },
			levels: [
				{ name: 'trace', colour: 'cyanBright' },
				{ name: 'debug', colour: 'blueBG' },
				{ name: 'info', colour: 'blue' },
				{ name: 'warn', colour: 'yellow' },
				{ name: 'error', colour: 'red' },
				{ name: 'fatal', colour: 'redBG' },
			],
			functions: [],
		};

		if (options.functions) {
			if (!Array.isArray(options.functions)) {
				options.functions = [options.functions];
			}

			defaults.functions.push(...options.functions);
			options.functions = undefined;
		}
		if (options.levels) {
			if (!Array.isArray(options.levels)) {
				options.levels = [options.levels];
			}

			defaults.levels.push(...options.levels);
			options.levels = undefined;
		}

		// Above we check if options.functions and options.levels are arrays and if not convert them.
		// Due to options.functions being its own individual type {function}, ts realises the change and inserts it.
		// However, with options.levels being a object, this change does not happen and a TypeError is thrown here when we try to redefine the type.
		//@ts-expect-error
		this.options = merge<Options, Partial<Options>>(defaults, options);
		this.name = name;

		for (let i = 0; i < this.options.levels.length; i++) {
			const level = this.options.levels[i];
			this[level.name] = (...data: any[]) => {
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
	}
	/**
	 * Pushes custom handling functions on top of the already selected methods
	 */
	public addFunctions(
		...funcs: Array<(level: Level, ...data: any[]) => void>
	) {
		this.funcs.push(...funcs);
	}
	/**
	 * Sets the array of custom handling functions, replacing existing.
	 */
	public setFunctions(
		...funcs: Array<(level: Level, ...data: any[]) => void>
	) {
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

			let message = '';

			for (let i = 0; i < data.length; i++) {
				const v = data[i];

				if (typeof v === 'string') {
					message += ` ${v}`;
				} else if (typeof v === 'object') {
					const jsonString = JSON.stringify(
						v,
						null,
						this.options.console.indent,
					);

					message += ` ${
						this.options.console.format
							? colorize(jsonString, {
									indent: this.options.console.indent,
								})
							: jsonString
					}`;
				} else {
					message += ` ${String(v)}`;
				}
			}

			// Log the message with the corresponding color and level
			console.log(
				consoleColours.gray(getTime()),
				consoleColours[this.options.levels[level].colour](
					`[${this.options.levels[level].name}]`,
				),
				consoleColours.underline(this.name),
				message.slice(1),
			);
		},
		files: async (level, ...data) => {
			level.toPrecision(2);
			data.at(2);
			return;
		},
		web: async (level, ...data) => {
			level.toPrecision(2);
			data.at(2);
			return;
		},
		funcs: async (level, ...data) => {
			for (let index = 0; index < this.funcs.length; index++) {
				const element = this.funcs[index];

				try {
					element(level, ...data);
				} catch (err) {
					this.internalLogging(
						`Function at index ${index} threw "${err}"`,
						'Removing due to unhandled error',
					);

					this.funcs.splice(index, 1);

					index--;
				}
			}
		},
	};
	private internalLogging(...data: string[]) {
		if (this.options.console.enabled === true) {
			if (this.options.console.logLevel > Level.Trace) {
				return;
			}

			let message = '';

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
	levels: customLevel[] | customLevel;
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
			 * The log directory
			 * @description if path = `/path/to/dir/` then logs will be stored as `/path/to/dir/log.txt` etc.
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
			type: 'json' | 'txt';
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
			 * Url to post to
			 * @default null
			 * @ignore Incomplete section
			 */
			url: string;
			/**
			 * Data type
			 * @default json
			 * @ignore Incomplete section
			 */
			type: 'json' | 'txt';
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
type logFunction = (level: Level, data: string) => void;

/**
 * @see colorList From package console-log-colors
 */
type ColourList =
	| 'black'
	| 'red'
	| 'green'
	| 'yellow'
	| 'blue'
	| 'magenta'
	| 'cyan'
	| 'white'
	| 'gray'
	| 'grey'
	| 'redBright'
	| 'greenBright'
	| 'yellowBright'
	| 'blueBright'
	| 'magentaBright'
	| 'cyanBright'
	| 'whiteBright'
	| 'bgBlack'
	| 'bgRed'
	| 'bgGreen'
	| 'bgYellow'
	| 'bgBlue'
	| 'bgMagenta'
	| 'bgCyan'
	| 'bgWhite'
	| 'blackBG'
	| 'redBG'
	| 'greenBG'
	| 'yellowBG'
	| 'blueBG'
	| 'magentaBG'
	| 'cyanBG'
	| 'whiteBG'
	| 'bgBlackBright'
	| 'bgRedBright'
	| 'bgGreenBright'
	| 'bgYellowBright'
	| 'bgBlueBright'
	| 'bgMagentaBright'
	| 'bgCyanBright'
	| 'bgWhiteBright';
