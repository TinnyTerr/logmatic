/**
 * The Level enum is here to set the levels of logs that can be thrown.
 */
enum Level {
	Trace = 0,
	Debug = 1,
	Info = 2,
	Warn = 3,
	Error = 4,
	Fatal = 5,
}

export interface UserOptions extends Options {
	/**
	 * The number of spaces to use for indentation in formatted logs.
	 * @type {number | boolean}
	 */
	indent?: number | boolean;
}

export interface ClassOptions extends Options {
	/**
	 * The number of spaces to use for indentation in formatted logs.
	 * @type {number}
	 */
	indent?: number;
}

export interface Options {
	/**
	 * The level of logging to be used.
	 * @type {Level}
	 */
	logLevel?: Level;
	/**
	 * Whether to suppress warnings in the loggers warnings.
	 * @type {boolean}
	 */
	suppressLoggerWarning?: boolean;
	/**
	 * Whether to format the logs.
	 * @type {boolean}
	 */
	format?: boolean;
}
export interface FilesOptions {
	/**
	 * Whether file logging is enabled.
	 * @type {boolean}
	 */
	enabled?: true;
	/**
	 * Whether to disable console logging when file logging is enabled.
	 * @type {boolean | null}
	 */
	noConsole?: boolean | null;
	/**
	 * The path where log files will be saved.
	 * @type {string | null}
	 */
	path?: string | null;
	/**
	 * Naming is the format of each file.
	 * If the format is not set, the logs will be saved in the default format.
	 *
	 * The following terms will be replaced with the following values:
	 * - `{time}` - The time the log was created
	 *
	 * @example `{time}` = `2021-09-0100:00:00.000`
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
	 *
	 * @note Does not do anything when type is json
	 * @example
	 * ```txt
	 * 2021-09-01T00:00:00.000Z [INFO] This is a log message```
	 * @example
	 * ```log
	 * 2021-09-01T00:00:00.000Z [INFO] This is a log message```
	 */
	format?: string | null;
	/**
	 * The type is the type of file that the logs will be saved to.
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
