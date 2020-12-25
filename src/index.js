#!/usr/bin/env node

require('../config');

const { logger } = require('./logger');
const { issueProcessor } = require('./services');

(async () => {
  try {
    const boardId = '1';

    await issueProcessor.processBoard(boardId);
  } catch (e) {
    logger.error(e);
  }
})();
