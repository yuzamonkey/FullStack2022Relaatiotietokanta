const router = require('express').Router()
const { Readinglist } = require('../models')

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

module.exports = router