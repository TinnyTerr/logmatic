export interface options {
    logLevel?: Level;
    suppressWarnings?: boolean;
    quitOnFatal?: boolean;
    format?: boolean;
    indent?: number | boolean;
}
export interface config {
    options: {
        logLevel: Level;
        suppressWarnings: boolean;
        quitOnFatal: boolean;
        format: boolean;
        indent: number;
    };
}
interface devConfig {
    options: {
        logLevel: Level;
        suppressWarnings: boolean;
        quitOnFatal: boolean;
        format: boolean;
        indent: number;
    };
    files: {
        path: string;
        naming: string;
        type: 'json' | 'txt' | 'log';
    };
}
export enum Level {
    trace,
    debug,
    info,
    warn,
    error,
    fatal,
}
