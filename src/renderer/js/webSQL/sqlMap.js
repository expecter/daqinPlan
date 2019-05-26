var sqlMap = {
  getUsers: 'SELECT * FROM account_users',
  getRoles: 'SELECT * FROM account_roles where projectId = ?',
  getAllVersions: 'SELECT * FROM versions',
  getUsersByProjectId: 'SELECT * FROM account_user_role where projectId = ?',
  getUsersByProjectIdAndRid: 'SELECT * FROM account_user_role where projectId = ? AND roleId = ?',
  getbugsByProjectIdAndUid: 'SELECT * FROM bugs where projectId = ?',
  getVersionsByProjectId: 'SELECT * FROM versions where projectId = ?',
  getbugsByVersionId: 'SELECT * FROM bugs WHERE executeUid = ? AND projectId = ? AND taskId IN (SELECT taskId FROM tasks WHERE versionId = ? )',
  getTaskByProjectIdAndUid: 'SELECT * FROM subtasks where projectId = ? And executeUid = ?',
  getTaskByVersionId: 'SELECT * FROM subtasks WHERE executeUid = ? AND projectId = ? AND taskId IN (SELECT taskId FROM tasks WHERE versionId = ? )',
  getProjects: 'SELECT * FROM projects',
  getAllTasks: 'SELECT * FROM tasks',
  getAllBugs: 'SELECT * FROM bugs',
  getAllRoles: 'SELECT * FROM account_roles',
  getAllSubTasks: 'SELECT * FROM subtasks'
}
module.exports = sqlMap
