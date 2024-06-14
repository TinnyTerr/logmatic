import { Options, ChalkInstance, ColorInfo, ColorName } from 'chalk';
import { Modifier, ForegroundColor, BackgroundColor } from 'chalk/source/vendor/ansi-styles';

let chalk: { hex?: any; whiteBright?: any; Chalk?: new (options?: Options | undefined) => ChalkInstance; supportsColor?: ColorInfo; chalkStderr?: ChalkInstance; supportsColorStderr?: ColorInfo; modifierNames?: any; foregroundColorNames?: any; backgroundColorNames?: any; colorNames?: any; modifiers?: readonly (keyof Modifier)[]; foregroundColors?: readonly (keyof ForegroundColor)[]; backgroundColors?: readonly (keyof BackgroundColor)[]; colors?: readonly ColorName[]; default?: any; };

(async () => {
    chalk = await import('chalk');
})

export type options = {
    logLevel?: Level,
    colours?: colours,
    suppressWarnings?: boolean
    quitOnFatal?: boolean
    expandedFatal?: boolean
};

type hex = `#${string}`

type colours = {
    trace?: hex | `#42ecff`
    debug?: hex | `#008504`
    info?:  hex | `#00c1d6`
    warn?:  hex | `#ffee00`
    error?: hex | `#ff5e00`
    fatal?: hex | `#ff0000`
}

enum Level {
    trace = 0,
    debug = 1,
    info = 2,
    warn = 3,
    error = 4,
    fatal = 5,
}

export default class logger {
    readonly defaultTraceColour: hex = `#42ecff`
    readonly defaultDebugColour: hex = `#008504`
    readonly defaultInfoColour: hex = `#00c1d6`
    readonly defaultWarnColour: hex = `#ffee00`
    readonly defaultErrorColour: hex = `#ff5e00`
    readonly defaultFatalColour: hex = `#ff0000`
    options : options = {}
    
    constructor(name:string, options?:options) {
        if (options?.suppressWarnings === true) {
            if (name.length > 15) throw new Error("Name invalid. Check the FAQ");
            const ansiRegex: RegExp = /\x1b\[[0-9;]*m/g;
            const matches = name.match(ansiRegex) ?? [];
            if (matches.length > 0) throw new Error("ANSI characters in name found.");

            this.options = options
        }
                
    }
    /**
     * Calls the log to output
     * @internal
     * @param message The error/log message
     * @param level The level to log at
     * @param data Extra data that came along
     */
    private async log(message: string, level: Level, ...data: Array<unknown>) {
        const colours = this.options.colours

        if (level === 5) {
            if (this.options.expandedFatal) {
                console.log(chalk.hex(colours?.fatal ?? this.defaultFatalColour) + `--- FATAL ERROR --- \n` + chalk.whiteBright + message + `\n`, ...data)
            }
        }
    }

    /**
     * Logs a fatal message to the console
     * @optional quits the process on call set in options
     * @param message 
     * @param data 
     */
    async fatal(message: string, ...data:Array<unknown>) {
        this.log(message, Level.fatal, data);
        if (this.options.quitOnFatal) process.exit(1);
    }
    /**
     * Logs a trace to the console
     * @param message 
     * @param data 
     */
    async trace(message: string, ...data:Array<unknown>) {
        this.log(message, Level.trace, data);
    }
    /**
     * Logs a trace to the console
     * @param message 
     * @param data 
     */
    async debug(message: string, ...data:Array<unknown>) {
        this.log(message, Level.debug, data);
    }
    /**
     * Logs a message to the console
     * @param message 
     * @param data 
     */
    async info(message: string, ...data:Array<unknown>) {
        this.log(message, Level.info, data);
    }
    /**
     * Logs a warning to the console
     * @param message 
     * @param data 
     */
    async warn(message: string, ...data:Array<unknown>) {
        this.log(message, Level.warn, data);
    }
    /**
     * Logs a error to the console
     * @param message 
     * @param data 
     */
    async error(message: string, ...data:Array<unknown>) {
        this.log(message, Level.error, data);
    }
}