import { logger } from "../dist/index.js";

const log = new logger("test");

log.info("auuuh");
log.info("auuuh", { auuuh: { test: 4 }, why: 3 });
