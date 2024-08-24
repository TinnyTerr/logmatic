import consoleColours from 'console-log-colors';
import { colorize } from 'json-colorizer';

export function getTime(): string {
    const now = new Date();
    const date = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return date.toISOString().replace(/.*T(.*)Z/, '$1');
}

export interface options {
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
}

/**
 * The files object is here to set the default options for file logging.
 */
export interface fileOptions {
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
    type?: 'json' | 'txt' | 'log' | null;
}

export interface userOptions {
    options?: options;
    files?: fileOptions;
}

export interface config {
    /**
     * The options object is here to set the default options for the logger.
     *
     * The above options interface is not used as the options object is optional where the config is filled if values are empty in the class.
     * @see {@link options}
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
        type: 'json' | 'txt' | 'log' | null;
    };
}
/**
 * The Level enum is here to set the levels of logs that can be thrown.
 */
export enum Level {
    trace,
    debug,
    info,
    warn,
    error,
    fatal,
}

export class logger implements config {
    name: string = '';
    options: config['options'] = {
        logLevel: 1,
        suppressWarnings: false,
        quitOnFatal: false,
        format: false,
        indent: 0,
    };
    files: {
        enabled: false;
        noConsole: null;
        path: null;
        naming: null;
        type: null;
    };

    constructor(name: string, options?: options, files?: fileOptions) {
        // Define config
        this.name = `${name}`;

        //* Setback option definitions to set values
        let Options: options = {};
        let Files: fileOptions = {};

        if (!options) {
            this.options = {
                logLevel: 1,
                suppressWarnings: false,
                quitOnFatal: false,
                format: false,
                indent: 0,
            };
        } else {
            Options = {
                logLevel: options.logLevel ?? 1,
                suppressWarnings: options.suppressWarnings ?? false,
                quitOnFatal: options.quitOnFatal ?? false,
                format: options.format ?? false,
            };

            if (options.indent === false) Options.indent = 0;
            else if (options.indent === true) Options.indent = 4;
            else if (
                typeof options.indent === 'number' ||
                typeof options.indent === 'undefined'
            )
                this.options.indent = options.indent ?? 0;
            else throw new TypeError('Indentation option is not a valid type');
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
                naming: files.naming ?? '',
                type: files.type ?? 'log',
            };
        }

        //@ts-expect-error - Compiler doesn't realise that Options and Files are defined above, no matter what.
        this.options = Options;
        //@ts-expect-error - See above comment
        this.files = Files;
        /*if (!options) {
            this.options = {
                logLevel: 1,
                suppressWarnings: false,
                quitOnFatal: false,
                format: false,
                indent: 0,
            };
        } else {
            this.options.logLevel = options.logLevel ?? 1;
            this.options.suppressWarnings = options.suppressWarnings ?? false;
            this.options.quitOnFatal = options.quitOnFatal ?? false;
            this.options.format = options.format ?? false;
            if (options.indent === false) this.options.indent = 0;
            else if (options.indent === true) this.options.indent = 4;
            else if (
                typeof options.indent === 'number' ||
                typeof options.indent === 'undefined'
            )
                this.options.indent = options.indent ?? 0;
            else throw new TypeError('Indentation option is not a valid type');
        }*/

        const ansiRegex: RegExp = /\x1b\[[0-9;]*m/g;
        const matches = name.match(ansiRegex) ?? [];
        if (matches.length > 0 && this.options.suppressWarnings === false)
            throw new Error('ANSI characters in name found.');
        else if (matches.length > 0)
            this.internalLogging(
                'Warning, name contains ANSI characters. May affect colouring in the terminal',
            );
    }

    private log(level: Level, ...data: Array<any>): void {
        if (this.options.logLevel > level) return;

        const temp = data
            .map((d) => {
                if (typeof d === 'object' && this.options.format === true) {
                    return colorize(
                        JSON.stringify(d, null, this.options.indent),
                    );
                } else if (typeof d === 'object') {
                    return JSON.stringify(d, null, this.options.indent);
                } else return d;
            })
            .join(' ');

        let msg = '';

        switch (level) {
            case Level.trace:
                msg = `${consoleColours.grey(
                    getTime(),
                )} ${consoleColours.underline(this.name)} ${consoleColours.blue(
                    '[Trace]',
                )} ${temp}`;
                break;

            case Level.debug:
                msg = `${consoleColours.grey(
                    getTime(),
                )} ${consoleColours.underline(this.name)} ${consoleColours.cyan(
                    '[Debug]',
                )} ${temp}`;
                break;

            case Level.info:
                msg = `${consoleColours.grey(
                    getTime(),
                )} ${consoleColours.underline(
                    this.name,
                )} ${consoleColours.blueBright('[Info]')} ${temp}`;
                break;

            case Level.warn:
                msg = `${consoleColours.grey(
                    getTime(),
                )} ${consoleColours.underline(
                    this.name,
                )} ${consoleColours.yellow('[Warn]')} ${temp}`;
                break;

            case Level.error:
                msg = `${consoleColours.grey(
                    getTime(),
                )} ${consoleColours.underline(
                    this.name,
                )} ${consoleColours.redBright('[Error]')} ${temp}`;
                break;

            case Level.fatal:
                msg = `${consoleColours.grey(
                    getTime(),
                )} ${consoleColours.underline(
                    this.name,
                )} ${consoleColours.bgRed('[Fatal]')} ${temp}`;

                if (this.options.quitOnFatal) {
                    console.log(msg);
                    process.exit(1);
                }

                break;
            // Additional cases for other levels can be added here
            default:
                this.internalLogging('No log level provided');
                throw new Error('No log level provided');
        }

        console.log(msg);
    }

    /**
     * trace
     * @description Log a trace
     * @argument data { Array<any> } Pass data or messages to log
     */
    public async trace(...data: Array<any>): Promise<void> {
        return await this.log(Level.trace, ...data);
    }
    /**
     * debug
     * @description Log a debug line
     * @argument data { Array<any> } Pass data or messages to log
     */
    public async debug(...data: Array<any>): Promise<void> {
        return await this.log(Level.debug, ...data);
    }

    /**
     * info
     * @description Log a info line
     * @argument data { Array<any> } Pass data or messages to log
     */
    public async info(...data: Array<any>): Promise<void> {
        return await this.log(Level.info, ...data);
    }

    /**
     * warn
     * @description Log a warning
     * @argument data { Array<any> } Pass data or messages to log
     */
    public async warn(...data: Array<any>): Promise<void> {
        return await this.log(Level.warn, ...data);
    }

    /**
     * error
     * @description Log a error
     * @argument data { Array<any> } Pass data or messages to log
     */
    public async error(...data: Array<any>): Promise<void> {
        return await this.log(Level.error, ...data);
    }

    /**
     * fatal
     * @description Log a fatal error
     * @argument data { Array<any> } Pass data or messages to log
     */
    public async fatal(...data: Array<any>): Promise<void> {
        return await this.log(Level.fatal, ...data);
    }

    private internalLogging(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace)
            return;

        console.log(
            consoleColours.greenBright`[Internal] ` +
                message +
                consoleColours.green(
                    ` ${JSON.stringify(data, null, this.options.indent)}`,
                ),
        );
    }
}
