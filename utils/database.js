const Sequelize = require("sequelize")
const sequelize = new Sequelize('tasks','root','',{
    dialect:'mysql'
})

module.exports = {sequelize}