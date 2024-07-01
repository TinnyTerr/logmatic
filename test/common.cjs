const logger = require("../dist/index");

const log = new logger("test");

try {
    log.info("auuuh", { auuuh: { test: 4 }, why: 3 });
} catch (err) {
    console.log(err.stack);
}
