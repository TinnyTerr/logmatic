import type { Options } from './types.d.ts';
import consoleColours from 'console-log-colors';
import { colorize } from 'json-colorizer';
import { merge } from 'lodash';

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

export default class Logger {
	[key: string]: ((...data: any[]) => void) | unknown;
	name: string;
	options: Options;
	funcs: Array<(level: Level, ...data: any[]) => void> = [];
	constructor(name: string, options: Partial<Options> = {}) {
		const defaults: Options = {
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
				{ name: 'Trace', colour: 'cyanBright' },
				{ name: 'Debug', colour: 'blueBG' },
				{ name: 'Info', colour: 'blue' },
				{ name: 'Warn', colour: 'yellow' },
				{ name: 'Error', colour: 'red' },
				{ name: 'Fatal', colour: 'redBG' },
			],
		};

		this.options = merge<Options, Partial<Options>>(defaults, options);
		this.name = name;

		for (let i = 0; i < this.options.levels.length; i++) {
			const level = this.options.levels[i];
			this[level.name] = (...data: any[]) => {
				return new Promise<void>((resolve, reject) => {
					try {
						// Assuming logs methods are logging and handling data
						this.logs.console(i, ...data);
						this.logs.files(i, ...data);
						this.logs.funcs(i, ...data);
						this.logs.web(i, ...data);

						// Resolving the promise after the logs
						resolve();
					} catch (error) {
						// Rejecting the promise if there's an error
						reject(error);
					}
				});
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
		console: (level: number, ...data) => {
			if (!this.options.console.enabled === true) {
				return;
			}

			let message = '';

			for (let i = 0; i < data.length; i++) {
				const v = data[i];
				if (!this.options.console.enabled === true) {
					throw Error('Options changed during execution');
				}

				if (typeof v === 'string') {
					message += ` ${v}`;
					return;
				}

				if (typeof v === 'object') {
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
					return;
				}

				message += ` ${String(v)}`;
			}

			console.log(
				consoleColours.gray(getTime()),
				consoleColours[this.options.levels[level].colour](
					this.options.levels[level].name,
				),
				message,
			);
		},
		files: (level, ...data) => {
			level.toPrecision(2);
			data.at(2);
			return;
		},
		web: (level, ...data) => {
			level.toPrecision(2);
			data.at(2);
			return;
		},
		funcs: (level, ...data) => {
			level.toPrecision(2);
			data.at(2);
			return;
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
