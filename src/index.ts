import consoleColours from 'console-log-colors';
import { colorize } from 'json-colorizer';

let formatOptions: object;

export interface options {
    logLevel?: Level;
    suppressWarnings?: boolean;
    quitOnFatal?: boolean;
    format?: boolean;
    indent?: number | boolean;
}

interface config {
    options: {
        logLevel: Level;
        suppressWarnings: boolean;
        quitOnFatal: boolean;
        format: boolean;
        indent: number;
    };
}

enum Level {
    trace,
    debug,
    info,
    warn,
    error,
    fatal,
}

function getTime(): string {
    const now = new Date();
    const date = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
    return date.toISOString().replace(/.*T(.*)Z/, '$1');
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

    constructor(name: string, options?: options) {
        this.internalLogging('[WARN] ');

        // Define config
        this.name = `${name}`;

        //* Setback option definitions to set values

        if (!options) {
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
        }

        const ansiRegex: RegExp = /\x1b\[[0-9;]*m/g;
        const matches = name.match(ansiRegex) ?? [];
        if (matches.length > 0 && this.options.suppressWarnings === false)
            throw new Error('ANSI characters in name found.');
        else if (matches.length > 0)
            this.internalLogging(
                'Warning, name contains ANSI characters. May affect colouring in the terminal',
            );

        /*let lvlIndent: number = 0;

        this.internalLogging('Log Level is current erroring out and defaults to trace');

        if (!options) options = { logLevel: Level.debug };
        else {
            if (!options.logLevel === undefined) {
                options.logLevel === Level.debug;
            }
            if (options.indent === undefined) lvlIndent === 0;
            // * NO MORE DO WE HAVE THE INDENTATION WARNING WHOOOOOH
        }
        if (options.suppressWarnings === false) {
            if (name.length > 15) throw new Error('Name invalid. Check the FAQ');
            const ansiRegex: RegExp = /\x1b\[[0-9;]*m/g;
            const matches = name.match(ansiRegex) ?? [];
            if (matches.length > 0) throw new Error('ANSI characters in name found.');
        }

        this.options = options?.options;
        if (options.indent && options.indent > 0) {
            formatOptions = {
                highlight: true,
                indent: options.indent,
            };
        } else {
            formatOptions = {
                highlight: true,
                min: true,
            };
        }
        this.name = `${name}`;*/
    }

    private async log(level: Level, ...data: Array<any>): Promise<void> {
        const temp = data
            .map((element) => {
                if (typeof element === 'string') {
                    return element;
                } else if (typeof element === 'object') {
                    return colorize(JSON.stringify(element), {
                        indent: this.options.indent,
                    });
                } else {
                    return String(element);
                }
            })
            .join(' ');

        let msg = '';

        switch (level) {
            case Level.trace:
                msg = `${consoleColours.grey(
                    getTime(),
                )} ${consoleColours.underline(this.name)}${consoleColours.blue(
                    ' [Trace] ',
                )}${temp}`;
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
                break;
            // Additional cases for other levels can be added here
            default:
                return; // Do nothing if level is not handled
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
