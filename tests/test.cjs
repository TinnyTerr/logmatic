const { logger } = require('../dist/commonjs/index.cjs');

const log = new logger('log', { logLevel: 0 });

log.trace('test trace');
log.trace('test trace with data', { thisIs: true, andNot: false });

log.debug('test debug');
log.debug('test debug with data', { thisIs: true, andNot: false });

log.info('test info');
log.info('test info with data', { thisIs: true, andNot: false });

log.warn('test warn');
log.warn('test warn with data', { thisIs: true, andNot: false });

log.error('test error');
log.error('test error with data', { thisIs: true, andNot: false });

log.fatal('test fatal');
log.fatal('test fatal with data', { thisIs: true, andNot: false });

const logIndent = new logger('logIndent', { logLevel: 0, indent: 4 });

logIndent.trace('test trace');
logIndent.trace('test trace with data', { thisIs: true, andNot: false });

logIndent.debug('test debug');
logIndent.debug('test debug with data', { thisIs: true, andNot: false });

logIndent.info('test info');
logIndent.info('test info with data', { thisIs: true, andNot: false });

logIndent.warn('test warn');
logIndent.warn('test warn with data', { thisIs: true, andNot: false });

logIndent.error('test error');
logIndent.error('test error with data', { thisIs: true, andNot: false });

logIndent.fatal('test fatal');
logIndent.fatal('test fatal with data', { thisIs: true, andNot: false });

const formatLog = new logger('formatLog', { logLevel: 0, format: true });

formatLog.trace('test trace');
formatLog.trace('test trace with data', { thisIs: true, andNot: false });

formatLog.debug('test debug');
formatLog.debug('test debug with data', { thisIs: true, andNot: false });

formatLog.info('test info');
formatLog.info('test info with data', { thisIs: true, andNot: false });

formatLog.warn('test warn');
formatLog.warn('test warn with data', { thisIs: true, andNot: false });

formatLog.error('test error');
formatLog.error('test error with data', { thisIs: true, andNot: false });

formatLog.fatal('test fatal');
formatLog.fatal('test fatal with data', { thisIs: true, andNot: false });

const formatLogIndent = new logger('formatLogIndent', {
    logLevel: 0,
    indent: 4,
    format: true,
});

formatLogIndent.trace('test trace');
formatLogIndent.trace('test trace with data', { thisIs: true, andNot: false });

formatLogIndent.debug('test debug');
formatLogIndent.debug('test debug with data', { thisIs: true, andNot: false });

formatLogIndent.info('test info');
formatLogIndent.info('test info with data', { thisIs: true, andNot: false });

formatLogIndent.warn('test warn');
formatLogIndent.warn('test warn with data', { thisIs: true, andNot: false });

formatLogIndent.error('test error');
formatLogIndent.error('test error with data', { thisIs: true, andNot: false });

formatLogIndent.fatal('test fatal');
formatLogIndent.fatal('test fatal with data', { thisIs: true, andNot: false });
