import type { Options } from './types.d.ts';
import consoleColours from 'console-log-colors';
import { colorize } from 'json-colorizer';
import { merge } from 'lodash';

function getTime(): string {
	const now = new Date();
	const date = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
	return date.toISOString().replace(/.*T(.*)Z/, '$1');
}

export enum Level {
	Trace = 0,
	Debug = 1,
	Info = 2,
	Warn = 3,
	Error = 4,
	Fatal = 5,
}

export default class Logger {
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
	}
	/**
	 * addFunctions
	 */
	public addFunctions(
		...funcs: Array<(level: Level, ...data: any[]) => void>
	) {
		this.funcs = funcs;
	}
	private logs: {
		console: (level: Level, ...data: any[]) => void;
		files: (level: Level, ...data: any[]) => void;
		web: (level: Level, ...data: any[]) => void;
		funcs: (level: Level, ...data: any[]) => void;
	} = {
		console: (level, ...data) => {
			if (!this.options.console.enabled === true) {
				return;
			}

			let message = '';

			Array(...data).forEach((v) => {
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
			});

			console.log();
		},
		files: (level, ...data) => {
			return;
		},
		web: (level, ...data) => {
			return;
		},
		funcs: (level, ...data) => {
			return;
		},
	};
	private internalLogging(...data: string[]) {
		if (this.options.console.enabled === true) {
			if (this.options.console.logLevel > Level.Trace) {
				return;
			}

			let message = '';

			new Map(Object.entries(data)).forEach((v) => {
				message += v;
			});

			console.log(
				consoleColours.greenBright`[Internal]` +
					message +
					consoleColours.green(
						` ${JSON.stringify(data, null, this.options.console.indent)}`,
					),
			);
		}
	}
}
