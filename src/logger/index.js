const log4js = require('log4js');

const config = require('../../config');

const getLogger = name => {
  const inst = log4js.getLogger(name);

  inst.level = config.logLevel;

  return inst;
};
const logger = getLogger('main');

module.exports = {
  logger,
  getLogger,
};
