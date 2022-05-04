const router = require('express').Router()

const { tokenExtractor } = require('../middleware/token_extractor')
const { userFinder } = require('../middleware/user_finder')
const { sessionFinder } = require('../middleware/session_finder')

router.delete('/', tokenExtractor, userFinder, sessionFinder, async (req, res) => {
    req.sessions.forEach(async s => {
        await s.destroy()
    })
    res.status(200).end()
})

module.exports = router