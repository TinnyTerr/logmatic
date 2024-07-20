const { logger } = require("logmatic");

const log = new logger("test", { logLevel:0 });

log.trace("test trace");
log.trace("test trace with data", { thisIs:true, andNot:false });

log.debug("test debug");
log.debug("test debug with data", { thisIs:true, andNot:false });

log.info("test info");
log.info("test info with data", { thisIs:true, andNot:false });

log.warn("test warn");
log.warn("test warn with data", { thisIs:true, andNot:false });

log.error("test error");
log.error("test error with data", { thisIs:true, andNot:false });

log.fatal("test fatal");
log.fatal("test fatal with data", { thisIs:true, andNot:false });

const logIndent = new logger("test", { indent:4 });

logIndent.trace("test trace");
logIndent.trace("test trace with data", { thisIs:true, andNot:false });

logIndent.debug("test debug");
logIndent.debug("test debug with data", { thisIs:true, andNot:false });

logIndent.info("test info");
logIndent.info("test info with data", { thisIs:true, andNot:false });

logIndent.warn("test warn");
logIndent.warn("test warn with data", { thisIs:true, andNot:false });

logIndent.error("test error");
logIndent.error("test error with data", { thisIs:true, andNot:false });

logIndent.fatal("test fatal");
logIndent.fatal("test fatal with data", { thisIs:true, andNot:false });