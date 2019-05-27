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
  this.SubTaskDict = {}
  this.SubTaskPidDict = {}
  var self = this
  let searchFunc = function (results, fields) {
    for (let index in results) {
      var Uid = results[index].executeUid
      if (!self.SubTaskDict[Uid]) {
        self.SubTaskDict[Uid] = []
      }
      self.SubTaskDict[Uid].push(results[index])
    }
  }
  this.webconnect(sqlMap.getAllSubTasks, null, searchFunc)
}
let getAllBugs = function () {
  this.BugsDict = {}
  this.BugsPidDict = {}
  var self = this
  let searchFunc = function (results, fields) {
    for (let index in results) {
      var Uid = results[index].executeUid
      if (!self.BugsDict[Uid]) {
        self.BugsDict[Uid] = []
      }
      self.BugsDict[Uid].push(results[index])
    }
  }
  this.webconnect(sqlMap.getAllBugs, null, searchFunc)
}

let getAllRoles = function (allRoles, projectType) {
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
let getUsers = function (tlMember, projectType, roleType, callback) {
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
      if (callback) {
        callback()
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

let getBugs = function (tlBugs, projectId, Uid, Vid) {
  for (let index in this.BugsDict[Uid]) {
    var results = this.BugsDict[Uid][index]
    var curTask = this.getTaskById(results.taskId)
    var condition1 = projectId ? results.projectId === projectId : true
    var condition2 = Uid ? results.executeUid === Uid : true
    var conditon3 = true
    if (Vid) {
      conditon3 = false
      if (curTask.versionId === Vid) {
        conditon3 = true
      }
    }
    if (condition1 && condition2 && conditon3) {
      tlBugs.push(results)
    }
  }
}

let getSubTasks = function (tlTask, projectId, Uid, Vid) {
  for (let index in this.SubTaskDict[Uid]) {
    var results = this.SubTaskDict[Uid][index]
    var curTask = this.getTaskById(results.taskId)
    results.title = this.getTaskById(results.taskId).title
    var condition1 = projectId ? results.projectId === projectId : true
    // var condition2 = Uid ? results.executeUid === Uid : true
    var conditon3 = true
    if (Vid) {
      conditon3 = false
      if (curTask.versionId === Vid) {
        conditon3 = true
      }
    }
    if (condition1 && conditon3) {
      tlTask.push(results)
    }
  }
}

let getTaskNumByType = function (tlMember, taskType, projectType, Vid) {
  console.log(taskType, projectType, Vid)
  for (let index in tlMember) {
    var member = tlMember[index]
    if (taskType === '1') {
      var subTasks = []
      this.getSubTasks(subTasks, member.uid, projectType, Vid)
      tlMember[index]['taskNum'] = subTasks.length
    } else {
      var bugs = []
      this.getBugs(bugs, member.uid, projectType, Vid)
      tlMember[index]['taskNum'] = bugs.length
    }
  }
  console.log(tlMember)
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
  getAllTasks,
  getTaskById,
  getAllRoles,
  loadSQLData,
  getAllBugs,
  getBugs,
  getSubTasks,
  getTaskNumByType,
  getAllSubTasks
}
