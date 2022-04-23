const router = require('express').Router()

const { Blog } = require('../models')

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})

router.get('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        res.json(blog)
    } else {
        res.status(404).end()
    }
})

router.post('/', async (req, res) => {
    try {
        const blog = await Blog.create(req.body)
        res.json(blog)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.delete('/:id', async (req, res) => {
    const blog = await Blog.findByPk(req.params.id)
    if (blog) {
        blog.destroy()
        return res.status(200).json('ok')
    } else {
        return res.status(400).json(`id ${req.params.id} not valid`)
    }
})

module.exports = router