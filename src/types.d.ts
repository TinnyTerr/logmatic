import { Level } from './index';

interface Options {
	console: console;
	files: files;
	web: web;
	levels: customLevel[];
}

export type customLevel = {
	name: string;
	colour: ColourList;
};

type console =
	| {
			/**
			 * Whether console logging is enabled
			 * @default true
			 */
			enabled: true;
			/**
			 * The minimum level to log
			 * @see {Level}
			 * @default Level.Debug
			 */
			logLevel: Level;
			/**
			 * Whether to suppress warnings or errors emitted by the logger
			 * @default false
			 */
			suppressWarnings: boolean;
			/**
			 * Whether to format any JSON output
			 * @default false
			 */
			format: boolean;
			/**
			 * Whether to indent any JSON output
			 * @default false
			 */
			indent: number;
	  }
	| {
			/**
			 * Whether console logging is enabled
			 * @default true
			 */
			enabled: false;
	  };

type files =
	| {
			/**
			 * Whether file logging is enabled
			 * @default false
			 * @ignore Incomplete section
			 */
			enabled: true;
			/**
			 * Log directory
			 * @description if path = `/path/to/dir/` then logs will be stored as `/path/to/dir/log.txt` etc.
			 * @default null
			 * @ignore Incomplete section
			 */
			path: string;
			/**
			 * How to name the files
			 * @default null
			 * @ignore Incomplete section
			 */
			name: string;
			/**
			 * Whether console logging is enabled
			 * @default json
			 * @ignore Incomplete section
			 */
			type: 'json' | 'txt';
	  }
	| {
			/**
			 * Whether file logging is enabled
			 * @default false
			 * @ignore Incomplete section
			 */
			enabled: false;
	  };

type web =
	| {
			/**
			 * Whether web (POST) logging is enabled
			 * @default false
			 * @ignore Incomplete section
			 */
			enabled: true;
			/**
			 * Url to post to
			 * @default null
			 * @ignore Incomplete section
			 */
			url: string;
			/**
			 * Data type
			 * @default json
			 * @ignore Incomplete section
			 */
			type: 'json' | 'txt';
	  }
	| {
			/**
			 * Whether web (POST) logging is enabled
			 * @default false
			 * @ignore Incomplete section
			 */
			enabled: false;
	  };

/**
 * A custom function ran for every log.
 */
type logFunction = (level: Level, data: string) => void;

/**
 * @see colorList From package console-log-colors
 */
type ColourList =
	| 'black'
	| 'red'
	| 'green'
	| 'yellow'
	| 'blue'
	| 'magenta'
	| 'cyan'
	| 'white'
	| 'gray'
	| 'grey'
	| 'redBright'
	| 'greenBright'
	| 'yellowBright'
	| 'blueBright'
	| 'magentaBright'
	| 'cyanBright'
	| 'whiteBright'
	| 'bgBlack'
	| 'bgRed'
	| 'bgGreen'
	| 'bgYellow'
	| 'bgBlue'
	| 'bgMagenta'
	| 'bgCyan'
	| 'bgWhite'
	| 'blackBG'
	| 'redBG'
	| 'greenBG'
	| 'yellowBG'
	| 'blueBG'
	| 'magentaBG'
	| 'cyanBG'
	| 'whiteBG'
	| 'bgBlackBright'
	| 'bgRedBright'
	| 'bgGreenBright'
	| 'bgYellowBright'
	| 'bgBlueBright'
	| 'bgMagentaBright'
	| 'bgCyanBright'
	| 'bgWhiteBright';

export { Level, Options, logFunction };
