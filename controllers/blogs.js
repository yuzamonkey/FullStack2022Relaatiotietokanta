const router = require('express').Router()

const { response } = require('express')
const { Op } = require('sequelize')
const { Blog } = require('../models')
const { User } = require('../models')

const jwt = require('jsonwebtoken')
const { SECRET } = require('../util/config')

const blogFinder = async (req, res, next) => {
    req.blog = await Blog.findByPk(req.params.id)
    if (req.blog) {
        next()
    } else {
        response.status(404).end()
    }
}

const tokenExtractor = (req, res, next) => {
    const authorization = req.get('authorization')
    if (authorization && authorization.toLowerCase().startsWith('bearer ')) {
        try {
            console.log(authorization.substring(7))
            req.decodedToken = jwt.verify(authorization.substring(7), SECRET)
        } catch (error) {
            console.log(error)
            return res.status(401).json({ error: 'token invalid' })
        }
    } else {
        return res.status(401).json({ error: 'token missing' })
    }
    next()
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

router.post('/', tokenExtractor, async (req, res) => {
    try {
        const user = await User.findByPk(req.decodedToken.id)
        const blog = await Blog.create({ ...req.body, userId: user.id })
        res.json(blog)
    } catch (error) {
        return res.status(400).json({ error })
    }
})

router.get('/:id', blogFinder, async (req, res) => {
    res.json(req.blog)
})

router.put('/:id', blogFinder, async (req, res) => {
    req.blog.likes = req.body.likes
    await req.blog.save()
    res.json(req.blog)
})

router.delete('/:id', [tokenExtractor, blogFinder], async (req, res) => {
    if (req.blog.userId === req.decodedToken.id) {
        req.blog.destroy()
        res.status(200).end()
    } else {
        res.status(401).end()
    }
})

module.exports = router