var mysql = require('mysql')
var models = require('./db')
var sqlMap = require('./sqlMap')
let webconnect = function () {
  console.log(mysql)
  console.log(models.mysql)
  var conn = mysql.createConnection(models.mysql)
  conn.query(
    sqlMap.select,
    function selectCb (err, results, fields) {
      if (err) {
        throw err
      }
      console.log(results[0].nickname)
      console.log(fields)
      conn.end()
    }
  )
  let setEvent = new Event('updateTaskMsg')
  window.dispatchEvent(setEvent)
}
export default {
  webconnect
}
