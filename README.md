# CONTRIBUTERS REQUESTED

For anyone interested with supporting this passion project, please check out [Contributing](CONTRIBUTING.md).

# Logmatic

An overly complicated yet functional logger.
Package: [@tinnyterr/logmatic](https://www.npmjs.com/package/@tinnyterr/logmatic)

## Installation

For all systems, please use:
```bash
npm i logmatic --save-exact
```

### For Typescript

Whenever possible, set the following setting in your `tsconfig.json` or such:

```json
{
    "compilerOptions": {
        // ...
        "noPropertyAccessFromIndexSignature": false,
        // ...
    }
}
```

Or you must use the following to access your logging statements:

```ts
log["fatal"]("a");
```
---

As logmatic is currently in a very unstable state, many items may change in the future.

## Usage

To get started, import the project into your file and initialise the logger:

```javascript
const { Logger } = require('@tinnyterr/logmatic');
// OR
// import { Logger } from '@tinnyterr/logmatic';

const log = new Logger("name").loggers;
```

WAIT! If you wish to alter the logger down the line (eg add logger handler functions), you will need to save the Logger class for later. The above code just accesses all the logger function. For example:

```javascript
const { Logger } = require('@tinnyterr/logmatic');
// OR
// import { Logger } from '@tinnyterr/logmatic';

const logClass = new Logger("name");
const log = logClass.loggers

// Do some stuff

log.info("blah blah")

logClass.addFunctions(() => { return })
``` 

For the default added levels, use the following: 

| Function Call | Format | Colour |
|----|----|----|
|`log.trace()`|`{time} [trace] {name} {...data}`|Cyan|
|`log.debug()`|`{time} [debug] {name} {...data}`|Blue Background|
|`log.info()`|`{time} [info] {name} {...data}`|Blue|
|`log.warn()`|`{time} [warn] {name} {...data}`|Yellow|
|`log.error()`|`{time} [error] {name} {...data}`|Red|
|`log.fatal()`|`{time} [fatal] {name} {...data}`|Red Background|

For your custom levels, please see [Levels](#levels) below

## Options

The following section is expecting you have imported the class. It will then demonstrate how to set the option.

### Console
---
#### Enabled

Whether console logging is enabled

Default: `true`

```javascript
const log = new Logger("name", { console: { enabled: true }}).loggers
```
---
#### Log Level

The minimum level to log. This corresponds with the position in the array the level is. See [Levels](#levels).

Default: `1`

```javascript
const log = new Logger("name", { console: { logLevel: 1 }}).loggers
```
---
#### Suppress Warnings

Whether to suppress warnings or errors emitted by the logger

Default: `false`

**WARNING:** This option is currently not in use.

```javascript
const log = new Logger("name", { console: { supressWarnings: false }}).loggers
```
---
#### Format

Whether to format and colourise any JSON output

Default: `false`

```javascript
const log = new Logger("name", { console: { format: false }}).loggers
```
---
#### Indent

Whether to indent any JSON output.
[Console.format](#format) must be true if [Console.indent](#indent) is greater than `0`

Default: `0`

```javascript
const log = new Logger("name", { console: { indent: 0 }}).loggers
```
---
### Files

**WARNING:** This option is currently not in use.
*Note:* This module requires that several options are filled in tandem. 
---
#### Enabled

Whether file logging is enabled

Default: `false`

```javascript
const log = new Logger("name", { files: { enabled: false }}).loggers
```
---
#### Path

The log directory

In-depth: if path = `/path/to/dir/` then logs will be stored as `/path/to/dir/log.txt` etc.

Default `null`

```javascript
const log = new Logger("name", { files: { path: null }}).loggers
```
---
#### Naming

How to name the files

Default: `null`

**WARNING:** No example for this option as it is undetermined how it will be parsed.
---
#### File type

The type of file stored

Default: `json`

```javascript
const log = new Logger("name", { files: { type: "json" }}).loggers
```
---
### Web

**WARNING:** Web is currently in a unstable state and should not be used.

#### Enabled

Whether web (POST) logging is enabled

Default: `false`

```javascript
const log = new Logger("name", { web: { enabled: false }}).loggers
```
---
#### URL

The URL to post to

Default: `null`

```javascript
const log = new Logger("name", { web: { url: null }}).loggers
```
---
#### Data Type

The data type sent

Default: `json`

```javascript
const log = new Logger("name", { web: { type: "json" }}).loggers
```
---
#### Every number

How many logs to store before POSTing to avoid getting ratelimited

Default: `5`

```javascript
const log = new Logger("name", { web: { every: 5 }}).loggers
```

---
### Levels

This logger allows you to add your own levels, following out format. Formatted the following:
```javascript
const log = new Logger("name", {}, { name: "level", colour:"red" }).loggers
// **OR**
const log = new Logger("name", {}, [{ name: "level", colour:"red" }]).loggers
```

The colour should be derived from the package [console-log-colors](https://www.npmjs.com/package/console-log-colors) or from a slimmed list included in the types.

> [!WARNING]
> This will overwrite the default levels, so make sure you redefine them if you need them, and are just making an extra few.

> [!NOTE]
> If you require the default levels back, then use:
> ```javascript
> new Logger("name", {}, [
>	{ name: "trace", colour: "cyanBright" },
>	{ name: "debug", colour: "blueBG" },
>	{ name: "info", colour: "blue" },
>	{ name: "warn", colour: "yellow" },
>	{ name: "error", colour: "red" },
>	{ name: "fatal", colour: "redBG" },
>   // Your levels here...
> ]).loggers
> ```

---
### Functions

The logger allows you to pass custom functions or callbacks to handle the logs on your own.

```javascript
const function = (level: number, ...data: any[]) => {
    return { level, data }
}

const log = new Logger("name", { funcs: function}).loggers
// **OR**
const log = new Logger("name", { funcs: [function]}).loggers

```