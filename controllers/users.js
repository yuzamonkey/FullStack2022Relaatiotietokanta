const router = require('express').Router()

const { response } = require('express')
const { User } = require('../models')

const userFinder = async (req, res, next) => {
    console.log("••• PARAM", req.params.username)
    req.user = await User.findOne({ where: { username: req.params.username } })
    if (req.user) {
        next()
    } else {
        response.status(404).end()
    }
}

router.get('/', async (req, res) => {
    const users = await User.findAll()
    res.json(users)
})

router.post('/', async (req, res) => {
    const user = await User.create(req.body)
    res.json(user)
})

router.put('/:username', userFinder, async (req, res) => {
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