const { flow, filter, map } = require('lodash/fp');

const { urlify, getCategoryByLink, getEpicByCategory } = require('../helpers');
const { enumCategory } = require('../dtos/enums');

const DEFAULT_MAX_RESULTS = 100;

class JiraService {
  /**
   * @param {*} jiraClient
   * @param {*} logger
   */
  constructor(jiraClient, logger) {
    this.jiraClient = jiraClient;
    this.logger = logger;
  }

  /**
   * @param {string} boardId
   */
  async getActiveSprint(boardId) {
    const { values } = await this.jiraClient.getAllSprints(boardId, 0, 1, 'active');

    return values[0];
  }

  /**
   * @param {String} boardId
   * @param {String} sprintId
   * @param {number} startAt
   * @param {number} maxResults
   * @param {String} jql
   * @param {boolean} validateQuery
   * @param {String} fields
   */
  async getBoardIssuesForSprint(
    boardId,
    sprintId,
    startAt = 0,
    maxResults = DEFAULT_MAX_RESULTS,
    jql = null,
    validateQuery = true,
    fields = null,
  ) {
    this.logger.info(`Fetching issues for Board [${boardId}] and Sprint [${sprintId}]`);

    const { issues } = await this.jiraClient.getBoardIssuesForSprint(
      boardId,
      sprintId,
      startAt,
      maxResults,
      jql,
      validateQuery,
      fields,
    );

    return flow(
      map(x => {
        const link = urlify(x.fields.description);
        const category = getCategoryByLink(link);
        const epic = getEpicByCategory(category);

        return {
          id: x.id,
          key: x.key,
          status: x.fields.status,
          created: x.fields.created,
          updated: x.fields.updated,
          description: x.fields.description,
          summary: x.fields.summary,
          labels: x.fields.labels,
          worklogs: x.fields.worklog.worklogs,

          link,
          category,
          epic,
        };
      }),
      filter(this.isNotProcessed),
    )(issues);
  }

  /**
   * @param {String} issueId
   * @param {Object} issueUpdate
   * @param {Object} query
   * @returns {Promise<*>}
   */
  updateIssue(issueId, issueUpdate, query = null) {
    this.logger.info(`Updating issueId [${issueId}]`);

    return this.jiraClient.updateIssue(issueId, issueUpdate, query);
  }

  /**
   * @param {String} epicIdOrKey
   * @param {[String]} issues
   * @returns {Promise<*>}
   */
  moveIssuesToEpic(epicIdOrKey, issues) {
    this.logger.info(`Moving issue [${issues}] to epic [${epicIdOrKey}]`);

    return this.jiraClient.moveIssuesToEpic(epicIdOrKey, issues);
  }

  /**
   * @param {String} issueId
   * @param {String} worklogId
   * @returns {Promise<*>}
   */
  deleteWorklog(issueId, worklogId) {
    this.logger.info(`Deleting worklogId [${worklogId}] for issue [${issueId}]`);

    return this.jiraClient.deleteWorklog(issueId, worklogId);
  }

  /**
   * @param {String} issueId
   * @param {Object} worklog
   * @returns {Promise<*>}
   */
  addWorklog(issueId, worklog) {
    this.logger.info(`Adding timeSpent [${worklog.timeSpent}] for issue [${issueId}]`);

    return this.jiraClient.addWorklog(issueId, worklog);
  }

  isNotProcessed(issue) {
    return issue.labels.indexOf(enumCategory.PROCESSED) === -1;
  }

  isTest(issue) {
    return issue.labels.indexOf(enumCategory.TEST) > -1;
  }
}

module.exports = {
  JiraService,
  DEFAULT_MAX_RESULTS,
};
