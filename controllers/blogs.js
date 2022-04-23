const router = require('express').Router()

const { response } = require('express')
const { Blog } = require('../models')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    if (req.blog) {
        next()
    } else {
        response.status(404).end()
    }
}

router.get('/', async (req, res) => {
    const blogs = await Blog.findAll()
    res.json(blogs)
})

router.post('/', async (req, res) => {
    const blog = await Blog.create(req.body)
    res.json(blog)
})

router.get('/:id', blogFinder, async (req, res) => {
    res.json(req.blog)
})

router.put('/:id', blogFinder, async (req, res) => {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
})

router.delete('/:id', blogFinder, async (req, res) => {
    req.blog.destroy()
    res.status(200).end()
})

module.exports = router