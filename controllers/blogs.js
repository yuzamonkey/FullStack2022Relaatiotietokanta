const router = require('express').Router()

const { response } = require('express')
const { Op } = require('sequelize')
const { Blog } = require('../models')
const { User } = require('../models')
const { tokenExtractor } = require('../middleware/token_extractor')
const { userFinder } = require('../middleware/user_finder')
const { sessionFinder } = require('../middleware/session_finder')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    if (req.blog) {
        next()
    } else {
        response.status(404).end()
    }
}

router.get('/', async (req, res) => {
    const queryParam = req.query.search ? req.query.search.toLowerCase() : ''
    const blogs = await Blog.findAll({
        attributes: { exclude: ['userId'] },
        include: {
            model: User,
            attributes: ['name']
        },
        where: {
            [Op.or]: {
                title: {
                    [Op.iLike]: `%${queryParam}%`
                },
                author: {
                    [Op.iLike]: `%${queryParam}%`
                }
            }
        },
        order: [
            ['likes', 'DESC']
        ]
    })
    res.json(blogs)
})

router.post('/', [tokenExtractor, userFinder, sessionFinder], async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({ ...req.body, userId: user.id })
        res.json(blog)
    } catch (error) {
        res.status(400).json({ error })
    }
})

router.get('/:id', blogFinder, async (req, res) => {
    res.json(req.blog)
})

router.put('/:id', [tokenExtractor, userFinder, sessionFinder, blogFinder], async (req, res) => {
    if (req.blog.userId === req.decodedToken.id) {
        req.blog.likes = req.body.likes
        await req.blog.save()
        res.json(req.blog)
    } else {
        res.status(401).end()
    }
})

router.delete('/:id', [tokenExtractor, userFinder, sessionFinder, blogFinder], async (req, res) => {
    if (req.blog.userId === req.decodedToken.id) {
        req.blog.destroy()
        res.status(200).end()
    } else {
        res.status(401).end()
    }
})

module.exports = router