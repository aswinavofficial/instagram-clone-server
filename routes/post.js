const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const Post = mongoose.model("Post")

router.get('/post', requireLogin, (req, res) => {
    Post.find({ postedBy: req.user._id })
        .populate("postedBy", "_id name")
        .then(results => {

            results.forEach(result => {
                result.createdAt = undefined
                result.updatedAt = undefined
                result.__v = undefined
            })
            res.json({ results })
        }).catch(error => {
            console.log(error)
            res.status(500).json({ error: "Internal Server error" })

        })

})

router.get('/post/all', requireLogin, (req, res) => {

    Post.find()
        .populate("postedBy","_id name")
        .then(posts => {

            posts.forEach(result => {
                result.createdAt = undefined
                result.updatedAt = undefined
                result.__v = undefined
            })
            res.json({ posts })
        }).catch(error => {
            console.log(error)
            res.status(500).json({ error: "Internal Server error" })

        })

})

router.get('/post/latest', requireLogin, (req, res) => {

    const postid = Math.floor(Math.random() * 100)
    const post = {
        _id: postid ,
        title: "Post " + postid ,
        body: "Some more random text",
        postedBy: {
            _id: "5f8c1332114fdd56dd25e65c",
            name: "Aswin",
            email: "aswinavofficial@gmail.com"
        }
    }

    res.json( [post] )
})

router.post('/post', requireLogin, (req, res) => {

    const { title, body,photo } = req.body
    if (!title || !body || !photo ) {
        return res.status(422).json({ error: "Please enter all required  fields" })
    }

    req.user.password = undefined
    const post = new Post({
        title,
        body,
        postedBy: req.user,
        photo
    })

    post.save().then(result => {
        res.json({ post: result })
    }).catch(err => {
        console.log(err)
        res.status(500).json({ error: "Internal Server error" })
    })

})




module.exports = router