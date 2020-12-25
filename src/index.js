#!/usr/bin/env node

require('../config');

const config = require('../config');
const { logger } = require('./logger');
const { issueProcessor } = require('./services');

exports.handler = async () => {
  try {
    await issueProcessor.processBoard(config.jiraBoardId);
  } catch (e) {
    logger.error(e);
  }
};
