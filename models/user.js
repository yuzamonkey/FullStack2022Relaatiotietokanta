const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class User extends Model { }

User.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    name: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    username: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    password: {
        type: DataTypes.TEXT,
        allowNull: false,
        defaultValue: 'password'
    }
}, {
    sequelize,
    underscored: true,
    modelName: 'user'
})

module.exports = User
