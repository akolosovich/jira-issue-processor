const { enumCategory } = require('../dtos/enums');

class IssueProcessor {
  constructor(jiraService, parserFactory, httpClient, logger) {
    this.jiraService = jiraService;
    this.parserFactory = parserFactory;
    this.httpClient = httpClient;
    this.logger = logger;
  }

  /**
   * @param {String} boardId
   * @returns {Promise<*>}
   */
  async processBoard(boardId) {
    const sprint = await this.jiraService.getActiveSprint(boardId);

    if (!sprint) {
      this.logger.warn('No active Sprints.');

      return;
    }

    const issues = await this.jiraService.getBoardIssuesForSprint(boardId, sprint.id);

    if (!issues || !issues.length) {
      this.logger.warn('No issues to process.');

      return;
    }

    return Promise.all(issues.map(issue => this.processIssue(issue)));
  }

  async processIssue(issue) {
    try {
      this.logger.info(`Processing issue [${issue.id}] and key [${issue.key}]`);

      if (!issue.category) {
        this.logger.warn(`Unknown category for issue [${issue.key}]. Skipping.`);

        return;
      }

      const parser = this.parserFactory.createByType(issue.category);

      if (!parser) {
        this.logger.warn(`No parser for issue [${issue.key}]. Skipping.`);

        return;
      }

      const pageContent = await this.getUrl(issue);

      const props = parser.parse(issue.link, pageContent);

      await this.updateIssue(issue, props);
      await this.processWorklog(issue, props.runtime);
      await this.moveToEpic(issue);

      this.logger.info(`Successfully updated issue [${issue.id}]`);
    } catch (e) {
      this.logger.error(`${e.message} with issue [${issue.key}]`);
    }
  }

  updateIssue(issue, props) {
    return this.jiraService.updateIssue(issue.id, {
      fields: {
        summary: props.summary,
        description: props.description,
        labels: [enumCategory.PROCESSED].concat(props.labels),
      },
    });
  }

  async getUrl(issue) {
    const { data } = await this.httpClient.getUrl(issue.link);

    return data;
  }

  moveToEpic(issue) {
    if (!issue.epic) {
      return;
    }

    return this.jiraService.moveIssuesToEpic(issue.epic, [issue.id]);
  }

  /**
   * @param {*} issue
   * @param {String} runtime
   * @returns {Promise<void>}
   */
  async processWorklog(issue, runtime) {
    if (!runtime) {
      return;
    }
    const worklog = issue.worklogs[0];

    if (worklog) {
      await this.jiraService.deleteWorklog(issue.id, worklog.id);
    }

    return this.jiraService.addWorklog(issue.id, {
      timeSpent: runtime,
    });
  }
}

module.exports = {
  IssueProcessor,
};
