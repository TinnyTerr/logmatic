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
	suppressWarnings?: boolean;
	/**
	 * Whether to quit the application on a fatal error.
	 * @type {boolean}
	 */
	quitOnFatal?: boolean;
	/**
	 * Whether to format the logs.
	 * @type {boolean}
	 */
	format?: boolean;
	/**
	 * The number of spaces to use for indentation in formatted logs.
	 * @type {number}
	 */
	indent?: number | boolean;
	/**
	 * If the logger should log what it is doing
	 *
	 */
	loggerVerbose?: boolean;
}
/**
 * The files object is here to set the default options for file logging.
 */

export interface FileOptions {
	/**
	 * Whether file logging is enabled.
	 * @type {boolean}
	 */
	enabled?: boolean;
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
	 * The naming convention for log files.
	 * @type {string | null}
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
	 * @example
	 * ```json
	 * [
	 *  {
	 *   "time": "2021-09-01T00:00:00.000Z",
	 *   "level": "info",
	 *   "message": "This is a log message"
	 *  }
	 * ]```
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

export interface UserOptions {
	options?: Options;
	files?: FileOptions;
}

export interface Config {
	/**
	 * The options object is here to set the default options for the logger.
	 *
	 * The above options interface is not used as the options object is optional where the config is filled if values are empty in the class.
	 * @see {@link Options}
	 */
	options: {
		/**
		 * The level of logging to be used.
		 * @type {Level}
		 */
		logLevel: Level;
		/**
		 * Whether to suppress warnings in the loggers warnings.
		 * @type {boolean}
		 */
		suppressWarnings: boolean;
		/**
		 * Whether to quit the application on a fatal error.
		 * @type {boolean}
		 */
		quitOnFatal: boolean;
		/**
		 * Whether to format the logs.
		 * @type {boolean}
		 */
		format: boolean;
		/**
		 * The number of spaces to use for indentation in formatted logs.
		 * @type {number}
		 */
		indent: number;
		loggerVerbose: boolean;
	};
	/**
	 * The files object is here to set the default options for file logging.
	 */
	files: {
		/**
		 * Whether file logging is enabled.
		 * @type {boolean}
		 */
		enabled: boolean;
		/**
		 * Whether to disable console logging when file logging is enabled.
		 * @type {boolean | null}
		 */
		noConsole: boolean | null;
		/**
		 * The path where log files will be saved.
		 * @type {string | null}
		 */
		path: string | null;
		/**
		 * The naming convention for log files.
		 * @type {string | null}
		 */
		naming: string | null;
		/**
		 * The format is the format of each line in the log file.
		 * If the format is not set, the logs will be saved in the default format.
		 *
		 * The following terms will be replaced with the following values (ONLY FOR TXT AND LOG FORMATS):
		 * - `{time}` - The time the log was created
		 * - `{level}` - The level of the log
		 * - `{message}` - The message of the log
		 *
		 * @example
		 * ```json
		 * [
		 *  {
		 *   "time": "2021-09-01T00:00:00.000Z",
		 *   "level": "info",
		 *   "message": "This is a log message"
		 *  }
		 * ]```
		 * @example
		 * ```txt
		 * 2021-09-01T00:00:00.000Z [INFO] This is a log message```
		 * @example
		 * ```log
		 * 2021-09-01T00:00:00.000Z [INFO] This is a log message```
		 */
		format?: string | null;
		/**
		 * The type of log files to be generated.
		 * @type {'json' | 'txt' | 'log' | null}
		 */
		type: "json" | "txt" | "log" | null;
	};
}
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
}
