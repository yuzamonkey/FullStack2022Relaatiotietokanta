const Blog = require('./blog')
const User = require('./user')
const Readinglist = require('./readinglist')

User.hasMany(Blog)
Blog.belongsTo(User)

Readinglist.hasMany(Blog)
Readinglist.belongsTo(User)

module.exports = {
  Blog,
  User,
  Readinglist
}