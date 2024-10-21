/**
 * The Level enum is here to set the levels of logs that can be thrown.
 */
export enum Level {
	Trace = 0,
	Debug = 1,
	Info = 2,
	Warn = 3,
	Error = 4,
	Fatal = 5,
	Internal = 6,
	None = 7,
}

export interface UserOptions extends Options {
	/**
	 * The number of spaces to use for indentation in formatted logs.
	 * @type {number | boolean}
	 * @default 0
	 */
	indent?: number | boolean;
}

export interface ClassOptions extends Options {
	/**
	 * The number of spaces to use for indentation in formatted logs.
	 * @type {number}
	 * @default 0
	 */
	indent?: number;
}

export interface Options {
	/**
	 * The level of logging to be used.
	 * @type {Level}
	 * @default 1
	 */
	logLevel?: Level;
	/**
	 * Whether to suppress warnings in the loggers warnings.
	 * @type {boolean}
	 * @default false
	 */
	suppressLoggerWarning?: boolean;
	/**
	 * Whether to format the logs.
	 * @type {boolean}
	 * @default false
	 */
	format?: boolean;
}
export interface FilesOptions {
	/**
	 * Whether file logging is enabled.
	 * @type {boolean}
	 * @default false
	 */
	enabled?: boolean;
	/**
	 * Whether to disable console logging when file logging is enabled.
	 * @type {boolean | null}
	 * @default false
	 */
	noConsole?: boolean | null;
	/**
	 * The path where log files will be saved.
	 * MUST be fufilled if enabled is true
	 * @type {string | null}
	 * @default null
	 * @
	 */
	path?: string;
	/**
	 * Naming is the format of each filename.
	 * If the format is not set, the logs will be saved in the default format.
	 * The file extention *WILL* be put on the file no matter what
	 *
	 * The following terms will be replaced with the following values:
	 * - `{time}` - The time the log was created
	 * - `{date}` - The date the log was created
	 *
	 * @example `log{date}-{time}` = `log2024-10-21-14:30:15.123.(json|log|txt)`
	 * @default `{date}-{time}`
	 */
	naming?: string | null;
	/**
	 * The format is the format of each line in the log file.
	 * If the format is not set, the logs will be saved in the default format.
	 *
	 * The following terms will be replaced with the following values (ONLY FOR TXT AND LOG FORMATS):
	 * - `{time}` - The time the log was created
	 * - `{level}` - The level of the log
	 * - `{message}` - The message of the log
	 * - `{date}` - The date the log was created
	 *
	 * @default `{date}{time} [{level}] {message}`
	 * @note Does not do anything when type is json
	 * @example
	 * ```txt
	 * 2021-09-01T00:00:00.000 [INFO] This is a log message```
	 * @example
	 * ```log
	 * 2021-09-01T00:00:00.000 [INFO] This is a log message```
	 */
	format?: string | null;
	/**
	 * The type is the type of file that the logs will be saved to.
	 * @default "json"
	 */
	type?: "json" | "txt" | "log" | null;
}

export interface Config {
	options: Options;
	files:
	| FilesOptions
	| {
		enabled: false;
	};
}
