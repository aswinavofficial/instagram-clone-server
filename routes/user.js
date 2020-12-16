const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin = require('../middleware/requireLogin')
const User = mongoose.model("User")
const Post = mongoose.model("Post")
const dbOperations = require('../dao/db-operations')

router.get('/user/nearestUsers',requireLogin, async (req, res) => {
    /*
        extract the latitude and longitude info from the request query parameters.
        Then, fetch the nearest users using MongoDB's geospatial queries and return it back to the client.
    */
    const latitude = Number(req.query.lat);
    const longitude = Number(req.query.lng);
    /* MaxDistance in meters */
    const maxDistance = 2000
    const nearestUsers = await dbOperations.fetchNearestUsers([longitude, latitude], maxDistance);

    res.json({
        users: nearestUsers
    });
});

router.get('/user/:username', requireLogin, (req, res) => {

    const username = req.params.username
    console.log("/user/" + username)

    User.findOne({ _id: username })
    .lean()
    .then(
        savedUser => {

            const user  = savedUser

            if(savedUser !=null && savedUser != undefined) {
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

            }

        else {

            console.log('user not found')
            res.status(404).json({ error: "Invalid User" })

        }  

            
        })
        .catch(error => {
            console.log(error)
            res.status(500).json({ error: "Internal Server error" })

        })

})




module.exports = router