import consoleColours from 'console-log-colors';

export type options = {
    logLevel?: Level; // default 1
    suppressWarnings?: boolean;
    quitOnFatal?: boolean;
    useBackgroundColours?: boolean;
    indent?: number
};

enum Level {
    trace = 0,
    debug = 1,
    info = 2,
    warn = 3,
    error = 4,
    fatal = 5,
}

export class logger {
    options: options = {};
    indent: number = 0

    constructor(name: string, options?: options) {
        let lvlIndent:number = 0;

        if (!options) options = {logLevel:Level.debug}
        else {
            if (!options.logLevel === undefined) options.logLevel === Level.debug
            if (options.indent === undefined) lvlIndent === 0;
            else this.internalLogging(`Indentation is not available in the current version`)
        }
        if (options.suppressWarnings === true) {
            if (name.length > 15) throw new Error('Name invalid. Check the FAQ');
            const ansiRegex: RegExp = /\x1b\[[0-9;]*m/g;
            const matches = name.match(ansiRegex) ?? [];
            if (matches.length > 0) throw new Error('ANSI characters in name found.');
        }

        this.options = options
        this.indent = lvlIndent
    }

    public trace(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        console.log(consoleColours.blue`[Trace]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`));
    }
    public debug(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        console.log(consoleColours.cyan`[Debug]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`));
    }
    public info(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        console.log(consoleColours.blueBright`[Info]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`));
    }
    public warn(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        console.log(consoleColours.yellow`[Warn]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`));
    }
    public error(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        console.log(consoleColours.red`[Error]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`));
    }
    public fatal(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        console.log(consoleColours.redBG`[Fatal]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`));
    }
    private internalLogging(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        console.log(`\n` + consoleColours.greenBright`[Internal]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`) + `\n`);
    }
}
