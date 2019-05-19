var mysql = require('mysql')
var models = require('./db')
var sqlMap = require('./sqlMap')
let webconnect = function (queryFormula, params, func) {
  var conn = mysql.createConnection(models.mysql)
  conn.query(
    queryFormula, params,
    function selectCb (err, results, fields) {
      if (err) {
        throw err
      }
      if (func) {
        func(results, fields)
      }
      conn.end()
    }
  )
}
let getAllUsers = function (tlMember) {
  this.allUser = []
  var self = this
  let searchFunc = function (results, fields) {
    for (let index in results) {
      tlMember.push(results[index])
      self.allUser.push(results[index])
    }
    let setEvent = new Event('updateProjectMember')
    window.dispatchEvent(setEvent)
  }
  this.webconnect(sqlMap.getUsers, null, searchFunc)
}
let getAllTasks = function () {
  this.allTasks = []
  var self = this
  let searchFunc = function (results, fields) {
    for (let index in results) {
      self.allTasks.push(results[index])
    }
  }
  this.webconnect(sqlMap.getAllTasks, null, searchFunc)
}
let getTaskById = function (taskId) {
  for (let index in this.allTasks) {
    var user = this.allTasks[index]
    if (user.taskId === taskId) {
      return user
    }
  }
  return null
}
let getUserByUid = function (uid) {
  for (let index in this.allUser) {
    var user = this.allUser[index]
    if (user.uid === uid) {
      return user
    }
  }
  return null
}
let getUsers = function (tlMember, projectType) {
  var self = this
  let searchFunc = function (results, fields) {
    for (let index in results) {
      var user = self.getUserByUid(results[index].uid)
      tlMember.push(user)
    }
    let setEvent = new Event('updateProjectMember')
    window.dispatchEvent(setEvent)
  }
  this.webconnect(sqlMap.getUsersByProjectId, projectType, searchFunc)
}
let getProjects = function (tlProject) {
  this.allProject = []
  var self = this
  this.webconnect(sqlMap.getProjects, null, function (results, fields) {
    for (let index in results) {
      tlProject.push(results[index])
      self.allProject.push(results[index])
    }
    let setEvent = new Event('updateProjectMember')
    window.dispatchEvent(setEvent)
  })
}
let getBugsByPidAndUid = function (tlTask, projectId, Uid, callback) {
  this.webconnect(sqlMap.getbugsByProjectIdAndUid, projectId, function (results, fields) {
    for (let index in results) {
      if (results[index].executeUid === Uid) {
        tlTask.push(results[index])
      }
    }
    callback()
    let setEvent = new Event('updateProjectMember')
    window.dispatchEvent(setEvent)
  })
}
let getBugsByPidAndUidAndVid = function (tlTask, projectId, Uid, Vid, callback) {
  var conn = mysql.createConnection(models.mysql)
  conn.query(
    sqlMap.getbugsByVersionId, [Uid, projectId, Vid],
    function selectCb (err, results, fields) {
      if (err) {
        throw err
      }
      for (let index in results) {
        tlTask.push(results[index])
      }
      callback()
      conn.end()
    }
  )
}
let getTaskByPidAndUid = function (tlTask, projectId, Uid, callback) {
  var self = this
  this.webconnect(sqlMap.getTaskByProjectIdAndUid, [projectId, Uid], function (results, fields) {
    for (let index in results) {
      var subTask = results[index]
      subTask.title = self.getTaskById(subTask.taskId).title
      tlTask.push(subTask)
    }
    callback()
    let setEvent = new Event('updateProjectMember')
    window.dispatchEvent(setEvent)
  })
}
let getTaskByPidAndUidAndVid = function (tlTask, projectId, Uid, Vid, callback) {
  var self = this
  this.webconnect(sqlMap.getTaskByVersionId, [Uid, projectId, Vid], function (results, fields) {
    for (let index in results) {
      var subTask = results[index]
      subTask.title = self.getTaskById(subTask.taskId).title
      tlTask.push(subTask)
    }
    callback()
    let setEvent = new Event('updateProjectMember')
    window.dispatchEvent(setEvent)
  })
}
let getVersions = function (tlVersion, projectId) {
  let searchFunc = function (results, fields) {
    for (let index in results) {
      tlVersion.push(results[index])
    }
    let setEvent = new Event('updateProjectMember')
    window.dispatchEvent(setEvent)
  }
  this.webconnect(sqlMap.getVersionsByProjectId, projectId, searchFunc)
}
export default {
  webconnect,
  getUsers,
  getAllUsers,
  getProjects,
  getUserByUid,
  getVersions,
  getBugsByPidAndUid,
  getBugsByPidAndUidAndVid,
  getTaskByPidAndUid,
  getTaskByPidAndUidAndVid,
  getAllTasks,
  getTaskById
}
