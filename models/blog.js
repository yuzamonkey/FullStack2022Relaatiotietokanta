const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model { }

Blog.init({
    id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true
    },
    author: {
        type: DataTypes.TEXT,
    },
    url: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    title: {
        type: DataTypes.TEXT,
        allowNull: false
    },
    likes: {
        type: DataTypes.INTEGER,
        defaultValue: 0,
    },
    year: {
        type: DataTypes.INTEGER,
        allowNull: false,
        validate: {
            isValidYear(value) {
                if (!Number.isInteger(value)) {
                    throw new Error('Year is not a number')
                }
                if (value < 1991 || value > new Date().getFullYear()) {
                    throw new Error('Year must be greater than or equal to 1991 and less than or equal to ', new Date().getFullYear())
                }
            }
        }
    },
}, {
    sequelize,
    underscored: true,
    // timestamps: false,
    modelName: 'blog'
})

module.exports = Blog
