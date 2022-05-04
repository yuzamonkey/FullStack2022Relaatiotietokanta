const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const { User } = require('../models')

const userFinder = async (req, res, next) => {
    req.user = await User.findByPk(req.decodedToken.id)

    if (!req.user || req.user.disabled) {
        res.status(204).json('No user found or user is disabled')
    } else {
        next()
    }
}

module.exports = { userFinder }