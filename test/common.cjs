const logger = require("../dist/index")

const log = new logger('test');

log.info("auuuh", {"auuuh":{"test":4}, "why": 3});