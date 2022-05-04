const router = require('express').Router()
const { Readinglist } = require('../models')
const { tokenExtractor } = require('../middleware/token_extractor')
const { sessionFinder } = require('../middleware/session_finder')

router.get('/', async (req, res) => {
    const lists = await Readinglist.findAll({
        attributes: ['id', 'user_id', 'blog_id']
    })
    res.send(lists)
})

router.post('/', async (req, res) => {
    const blogId = req.body.blog_id
    const userId = req.body.user_id
    const item = await Readinglist.create({ blogId, userId })
    res.send(item)
})

router.put('/:id', [tokenExtractor, sessionFinder], async (req, res) => {
    try {
        const item = await Readinglist.findByPk(req.params.id)
        item.read = req.body.read
        await item.save()
        res.send(item)
    } catch (err) {
        res.status(400).json({ error })
    }
})

module.exports = router