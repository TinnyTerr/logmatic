import chalk from 'chalk'

export type options = {
    logLevel?: Level,
    colours?: colours,
    suppressWarnings?: boolean
    quitOnFatal?: boolean
    expandedFatal?: boolean
};

type hex = string

type colours = {
    trace: hex
    debug: hex
    info: hex
    warn: hex
    error: hex
    fatal: hex
}

enum Level {
    trace = 0,
    debug = 1,
    info = 2,
    warn = 3,
    error = 4,
    fatal = 5,
}

export class logger {
    readonly defaultTraceColour: hex = `#42ecff`
    readonly defaultDebugColour: hex = `#008504`
    readonly defaultInfoColour: hex = `#00c1d6`
    readonly defaultWarnColour: hex = `#ffee00`
    readonly defaultErrorColour: hex = `#ff5e00`
    readonly defaultFatalColour: hex = `#ff0000`
    options: options = {}

    constructor(name: string, options?: options) {
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
    private async log(message: string, level: Level, ...data: Array<unknown>): Promise<void> {
        const colours = this.options.colours

        let colour;

        if (level === 5) {
            if (!colours) colour = this.defaultFatalColour;
            else colour = colours.fatal;

            if (this.options.expandedFatal) {
                // @ts-ignore
                console.log(chalk.hex(colour) + `--- FATAL ERROR --- \n` + chalk.whiteBright + message + `\n` + data)
            } else {
                // @ts-ignore
                console.log(chalk.hex(colour) + `--- FATAL ERROR ---` + chalk.whiteBright + message + data)
            }
        } else {
            if (!colours) {
                if (level === 0) colour = this.defaultTraceColour;
                if (level === 1) colour = this.defaultDebugColour;
                if (level === 2) colour = this.defaultInfoColour;
                if (level === 3) colour = this.defaultWarnColour;
                if (level === 4) colour = this.defaultErrorColour;
            } else {
                if (level === 0) colour = colours.trace;
                if (level === 1) colour = colours.debug;
                if (level === 2) colour = colours.info;
                if (level === 3) colour = colours.warn;
                if (level === 4) colour = colours.error;
            }

            if (!colour) throw new Error(`Colour missing`)

            // @ts-ignore
            console.log(chalk.hex(colour) + Level[level] + chalk.whiteBright + message + data)
        }
    }

    /**
     * Logs a fatal message to the console
     * @optional quits the process on call set in options
     * @param message 
     * @param data 
     */
    public async fatal(message: string, ...data: Array<unknown>): Promise<void> {
        this.log(message, Level.fatal, data);
        if (this.options.quitOnFatal) process.exit(1);
    }
    /**
     * Logs a trace to the console
     * @param message 
     * @param data 
     */
    public async trace(message: string, ...data: Array<unknown>): Promise<void> {
        this.log(message, Level.trace, data);
    }
    /**
     * Logs a trace to the console
     * @param message 
     * @param data 
     */
    public async debug(message: string, ...data: Array<unknown>): Promise<void> {
        this.log(message, Level.debug, data);
    }
    /**
     * Logs a message to the console
     * @param message 
     * @param data 
     */
    public async info(message: string, ...data: Array<unknown>): Promise<void> {
        this.log(message, Level.info, data);
    }
    /**
     * Logs a warning to the console
     * @param message 
     * @param data 
     */
    public async warn(message: string, ...data: Array<unknown>): Promise<void> {
        this.log(message, Level.warn, data);
    }
    /**
     * Logs a error to the console
     * @param message 
     * @param data 
     */
    public async error(message: string, ...data: Array<unknown>): Promise<void> {
        this.log(message, Level.error, data);
    }
}