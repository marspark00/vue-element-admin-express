const { querySql, queryOne } = require('../db')

function login(username, password) {
  const sql = `select * from admin_user where username='${username}' and password='${password}'`
  return querySql(sql)
}

function findUser(username) {
  const sql = `select * from admin_user where username='${username}'`
  return queryOne(sql)
}

module.exports = {
  login,
  findUser
}
