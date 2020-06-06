const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")


router.get('/post/all', requireLogin, (req, res) => {


    Post.find().then(result => {
        res.json({ result })
    }).catch(error => {
        console.log(error)
        res.status(500).json({ error: "Internal Server error" })

    })

})

router.post('/post', requireLogin, (req, res) => {

    const { title, body } = req.body
    if (!title || !body) {
        return res.status(422).json({ error: "Please enter all required  fields" })
    }

    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy: req.user
    })

    post.save().then(result => {
        res.json({ post: result })
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: "Internal Server error" })
    })

})

module.exports = router