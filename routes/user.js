const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const User = mongoose.model("User")
const Post = mongoose.model("Post")

router.get('/user/:username', requireLogin, (req, res) => {

    const username = req.params.username
    console.log("/user/" + username)

    User.findOne({ _id: username })
    .lean()
    .then(
        savedUser => {

            const user  = savedUser
            user.password = undefined
            user.__v = undefined

            Post.find({ postedBy: user._id })
            .then(posts => {

            posts.forEach(result => {
                result.updatedAt = undefined
                result.__v = undefined
            })
            res.json({ 
                
                user,
                posts

            })
        }).catch(error => {
            console.log(error)
            res.status(500).json({ error: "Internal Server error" })

        })

        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: "Internal Server error" })

        })

})

module.exports = router