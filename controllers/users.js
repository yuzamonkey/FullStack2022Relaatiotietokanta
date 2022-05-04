const router = require('express').Router()

const { User } = require('../models')
const { Blog } = require('../models')


const findUserByUsername = async (req, res, next) => {
    req.user = await User.findOne({ where: { username: req.params.username } })
    if (req.user) {
        next()
    } else {
        res.status(404).end()
    }
}

router.get('/', async (req, res) => {
    const users = await User.findAll({
        include: {
            model: Blog,
            attributes: { exclude: ['userId'] }
        }
    })
    res.json(users)
})

router.get('/:id', async (req, res) => {
    const user = await User.findByPk(req.params.id, {
        include: [{
            model: Blog,
            as: 'readings',
            attributes: { exclude: ['userId'] },
            through: {
                attributes: ['read', 'id'],
                where: req.query.read ? { read: req.query.read } : {}
            }
        }]
    })
    res.send(user)
})

router.post('/', async (req, res) => {
    const user = await User.create(req.body)
    res.json(user)
})

router.put('/:username', findUserByUsername, async (req, res) => {
    req.user.username = req.body.username
    await req.user.save()
    res.json(req.user)
})

router.delete('/', async (req, res) => {
    await User.destroy({
        where: {},
        truncate: true
    })
    res.status(200).end()
})

module.exports = router