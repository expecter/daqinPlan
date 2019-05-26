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
let getAllUsers = function () {
  this.allUser = []
  var self = this
  let searchFunc = function (results, fields) {
    for (let index in results) {
      // tlMember.push(results[index])
      self.allUser.push(results[index])
    }
    let setEvent = new Event('updateProjectMember')
    window.dispatchEvent(setEvent)
  }
  this.webconnect(sqlMap.getUsers, null, searchFunc)
}
let loadSQLData = function () {
  this.getAllUsers()
  this.getAllTasks()
  this.getAllSubTasks()
  this.getAllBugs()
  // this.getAllRoles()
  // this.allRoles = []
  var self = this
  this.allRoles = []
  let searchFunc = function (results, fields) {
    for (let index in results) {
      self.allRoles.push(results[index])
    }
  }
  this.webconnect(sqlMap.getAllRoles, null, searchFunc)
  this.tlVersion = []
  searchFunc = function (results, fields) {
    for (let index in results) {
      self.tlVersion.push(results[index])
    }
    let setEvent = new Event('updateProjectMember')
    window.dispatchEvent(setEvent)
  }
  this.webconnect(sqlMap.getAllVersions, [], searchFunc)
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
let getAllSubTasks = function () {
  this.allSubTasks = []
  var self = this
  let searchFunc = function (results, fields) {
    for (let index in results) {
      self.allSubTasks.push(results[index])
    }
  }
  this.webconnect(sqlMap.getAllSubTasks, null, searchFunc)
}
let getAllBugs = function () {
  this.allBugs = []
  var self = this
  let searchFunc = function (results, fields) {
    for (let index in results) {
      self.allBugs.push(results[index])
    }
  }
  this.webconnect(sqlMap.getAllBugs, null, searchFunc)
}

let getAllRoles = function (allRoles, projectType) {
  // this.allRoles = []
  // var self = this
  // let searchFunc = function (results, fields) {
  //   for (let index in results) {
  //     allRoles.push(results[index])
  //   }
  // }
  // this.webconnect(sqlMap.getRoles, projectType, searchFunc)
  for (let index in this.allRoles) {
    var results = this.allRoles[index]
    if (results.projectId === projectType) {
      allRoles.push(results)
    }
  }
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
let getUsers = function (tlMember, projectType, roleType) {
  var self = this
  let searchFunc = function (results, fields) {
    for (let index in results) {
      var user = self.getUserByUid(results[index].uid)
      var needAdd = true
      for (let memberIndex in tlMember) {
        if (tlMember[memberIndex].uid === results[index].uid) {
          needAdd = false
          break
        }
      }
      if (needAdd) {
        tlMember.push(user)
      }
    }
    let setEvent = new Event('updateProjectMember')
    window.dispatchEvent(setEvent)
  }
  if (roleType) {
    this.webconnect(sqlMap.getUsersByProjectIdAndRid, [projectType, roleType], searchFunc)
  } else {
    this.webconnect(sqlMap.getUsersByProjectId, projectType, searchFunc)
  }
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

let getBugs = function (tlBugs, projectId, Uid, Vid) {
  for (let index in this.allBugs) {
    var results = this.allBugs[index]
    var condition1 = projectId ? results.projectId === projectId : true
    var condition2 = Uid ? results.executeUid === Uid : true
    if (condition1 && condition2) {
      tlBugs.push(results)
    }
  }
}

let getSubTasks = function (tlTask, projectId, Uid, Vid) {
  for (let index in this.allSubTasks) {
    var results = this.allSubTasks[index]
    results.title = self.getTaskById(results.taskId).title
    var condition1 = projectId ? results.projectId === projectId : true
    var condition2 = Uid ? results.executeUid === Uid : true
    if (condition1 && condition2) {
      tlTask.push(results)
    }
  }
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
  // let searchFunc = function (results, fields) {
  //   for (let index in results) {
  //     tlVersion.push(results[index])
  //   }
  //   let setEvent = new Event('updateProjectMember')
  //   window.dispatchEvent(setEvent)
  // }
  // this.webconnect(sqlMap.getVersionsByProjectId, projectId, searchFunc)
  for (let index in this.tlVersion) {
    var results = this.tlVersion[index]
    if (results.projectId === projectId) {
      tlVersion.push(results)
    }
  }
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
  getTaskById,
  getAllRoles,
  loadSQLData,
  getAllBugs,
  getBugs,
  getSubTasks,
  getAllSubTasks
}
