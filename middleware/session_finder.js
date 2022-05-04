const { User } = require('../models')
const { Session } = require('../models')

const sessionFinder = async (req, res, next) => {
    req.sessions = await Session.findAll({
        where: {
            userId: req.user.id
        },
        include: {
            model: User,
            attributes: ['disabled']
        }
    })

    if (req.sessions.length === 0) {
        res.status(401).json('No current sessions for user')
    } else {
        next()
    }
}

module.exports = { sessionFinder }