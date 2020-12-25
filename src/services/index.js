const JiraApi = require('jira-client');

const config = require('../../config');
const { getLogger } = require('../logger');
const { JiraService } = require('./jiraService');
const { IssueProcessor } = require('./issueProcessor');
const httpClient = require('../clients');
const { parserFactory } = require('../parsers');

const jiraClient = new JiraApi({
  protocol: 'https',
  host: config.jira.host,
  username: config.jira.username,
  password: config.jira.password,
  apiVersion: '2',
  strictSSL: true,
});

const jiraService = new JiraService(jiraClient, getLogger('JiraService'));

const issueProcessor = new IssueProcessor(jiraService, parserFactory, httpClient, getLogger('IssueProcessor'));

module.exports = {
  jiraService,
  issueProcessor,
};
