var sqlMap = {
  getUsers: 'SELECT * FROM account_users',
  getUsersByProjectId: 'SELECT * FROM account_project_users where projectId = ?',
  getbugsByProjectIdAndUid: 'SELECT * FROM bugs where projectId = ?',
  getVersionsByProjectId: 'SELECT * FROM versions where projectId = ?',
  getbugsByVersionId: 'SELECT * FROM bugs WHERE executeUid = ? AND projectId = ? AND taskId IN (SELECT taskId FROM tasks WHERE versionId = ? )',
  getTaskByProjectIdAndUid: 'SELECT * FROM subtasks where projectId = ? And executeUid = ?',
  getTaskByVersionId: 'SELECT * FROM subtasks WHERE executeUid = ? AND projectId = ? AND taskId IN (SELECT taskId FROM tasks WHERE versionId = ? )',
  getProjects: 'SELECT * FROM projects',
  getAllTasks: 'SELECT * FROM tasks'
}
module.exports = sqlMap
