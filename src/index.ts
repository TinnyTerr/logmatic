import consoleColours from 'console-log-colors';
import { format as prettyFormat } from 'pretty-format';

let formatOptions: object;

export type options = {
    logLevel?: Level; // default 1
    suppressWarnings?: boolean;
    quitOnFatal?: boolean;
    format?: boolean;
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

function getTime(): string {
    const now = new Date();
    const date = new Date(now.getTime() - (now.getTimezoneOffset() * 60000));
    return date.toISOString().replace(/.*T(.*)Z/, '$1');
}

export class logger {
    name: string = ""
    options: options = {};
    indent: number = 0

    constructor(name: string, options?: options) {
        let lvlIndent: number = 0;

        if (!options) options = { logLevel: Level.debug }
        else {
            if (!options.logLevel === undefined) options.logLevel === Level.debug
            if (options.indent === undefined) lvlIndent === 0;
            // * NO MORE DO WE HAVE THE INDENTATION WARNING WHOOOOOH
        }
        if (options.suppressWarnings === false) {
            if (name.length > 15) throw new Error('Name invalid. Check the FAQ');
            const ansiRegex: RegExp = /\x1b\[[0-9;]*m/g;
            const matches = name.match(ansiRegex) ?? [];
            if (matches.length > 0) throw new Error('ANSI characters in name found.');
        }

        this.options = options
        if (options.indent && options.indent > 0) {
            formatOptions = {
                highlight: true,
                indent: options.indent
            }
        } else {
            formatOptions = {
                highlight: true,
                min: true
            }
        }
        this.name = `${name}`
    }

    log(title: string, message: string, data: Array<unknown> | string) {
        let name = this.name;

        return console.log(consoleColours.grey(getTime()), consoleColours.white(name), title, consoleColours.reset(message), consoleColours.green(prettyFormat(data, formatOptions)));
    }

    public trace(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        this.log(consoleColours.blue`[Trace]`, message, data)
        // console.log(consoleColours.blue`[Trace]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`));
    }
    public debug(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        this.log(consoleColours.cyan`[Debug]`, message, data)
        // console.log(consoleColours.cyan`[Debug]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`));
    }
    public info(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        this.log(consoleColours.blueBright`[Info]`, message, data)
        // console.log(consoleColours.blueBright`[Info]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`));
    }
    public warn(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        this.log(consoleColours.yellow`[Warn]`, message, data)
        // console.log(consoleColours.yellow`[Warn]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`));
    }
    public error(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        this.log(consoleColours.red`[Error]`, message, data)
        // console.log(consoleColours.red`[Error]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`));
    }
    public fatal(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        this.log(consoleColours.redBG`[Fatal]`, message, data)
        // console.log(consoleColours.redBG`[Fatal]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`));
    }
    private internalLogging(message: string, ...data: Array<unknown>) {
        if (this.options.logLevel && this.options.logLevel > Level.trace) return;

        console.log(`\n` + consoleColours.greenBright`[Internal]` + " " + message + " " + consoleColours.green(`${JSON.stringify(data, null, this.indent)}`) + `\n`);
    }
}
