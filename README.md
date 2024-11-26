# Logmatic

An overly complicated yet functional logger.

## Installation

For all systems, please use:
```bash
npm i logmatic --save-exact
```
As logmatic is currently in a very unstable state, many items may change in the future.

## Usage

To get started, import the project into your file and initialise the logger:

```javascript
const { Logger } = require('logmatic');
// OR
// import { Logger } from 'logmatic';

const log = new Logger("name");
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

#### Enabled

Whether console logging is enabled

Default: `true`

```javascript
const log = new Logger("name", { console: { enabled: true }})
```

#### Log Level

The minimum level to log. This corresponds with the position in the array the level is. See [Levels](#levels).

Default: `1`

```javascript
const log = new Logger("name", { console: { logLevel: 1 }})
```

#### Suppress Warnings

Whether to suppress warnings or errors emitted by the logger

Default: `false`

**WARNING:** This option is currently not in use.

```javascript
const log = new Logger("name", { console: { supressWarnings: 1 }})
```

#### Format

Whether to format and colourise any JSON output

Default: `false`

```javascript
const log = new Logger("name", { console: { format: false }})
```

#### Indent

Whether to indent any JSON output

Default: `false`

```javascript
const log = new Logger("name", { console: { indent: 4 }})
```

### Files

**WARNING:** This option is currently not in use.
*Note:* This module requires that several options are filled in tandem. 

#### Enabled

Whether file logging is enabled

Default: `false`

```javascript
const log = new Logger("name", { files: { enabled: false }})
```

#### Path

The log directory

In depth: if path = `/path/to/dir/` then logs will be stored as `/path/to/dir/log.txt` etc.

Default `null`

```javascript
const log = new Logger("name", { files: { path: null }})
```

#### Naming

How to name the files

Default: `null`

**WARNING:** No example for this option as it is undetermined how it will be parsed.

#### File type

The type of file stored

Default: `json`

```javascript
const log = new Logger("name", { files: { type: "json" }})
```



### Web

#### Enabled

Whether web (POST) logging is enabled

Default: `false`

```javascript
const log = new Logger("name", { web: { enabled: false }})
```

#### URL

The URL to post to

Default: `null`

```javascript
const log = new Logger("name", { web: { url: null }})
```

#### Data Type

The data type sent

Default: `json`

```javascript
const log = new Logger("name", { web: { type: "json" }})
```

#### Every number

How many logs to store before POSTing to avoid getting ratelimited

Default: `5`

```javascript
const log = new Logger("name", { web: { every: 5 }})
```


### Levels

This logger allows you to add your own levels, following out format. Formatted the following:
```javascript
const log = new Logger("name", { levels: { name: "level", colour:"red" }})
// **OR**
const log = new Logger("name", { levels: [{ name: "level", colour:"red" }]})
```

The colour should be derived from the package [console-log-colors](https://www.npmjs.com/package/console-log-colors) or from a slimmed list included in the types.

### Functions

The logger allows you to pass custom functions or callbacks to handle the logs on your own.

```javascript
const function = (level: number, ...data: any[]) => {
    return { level, data }
}

const log = new Logger("name", { funcs: function});
// **OR**
const log = new Logger("name", { funcs: [function]});

```