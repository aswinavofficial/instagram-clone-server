const express = require('express')
const mongoose = require('mongoose')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const { JWT_SECRET } = require('../keys')

const router = express.Router()
const User = mongoose.model('User')

router.get('/', (req, res) => {
    res.send("/auth")
})

router.post('/signup', (req, res) => {
    console.log(req.body)
    const { name, email, password } = req.body

    if (!name || !email || !password) {
        return res.status(422).json({ error: "Please enter all required  fields" })

    }
    User.findOne({ email: email }).then(
        savedUser => {
            if (savedUser) {
                return res.status(422).json({ error: "User having given email id already already " })

            }

            bcrypt.hash(password, 15).
                then(hashedPassword => {
                    const user = new User(
                        { name, email, password: hashedPassword }
                    )

                    user.save().then(user => {
                        res.json({ message: "SUCCESS" })
                    }).catch(err => {

                        console.log(err)
                        res.status(500).json({ error: "Internal Server error" })

                    })

                })

        }
    ).catch(err => {

        console.log(err)
        res.status(500).json({ error: "Internal Server error" })

    })



})



router.post('/signin', (req, res) => {
    const { email, password } = req.body

    if (!email || !password) {

        return res.status(422).json({ error: "Please enter all required  fields" })
    }

    User.findOne(
        { email: email }
    ).then(savedUser => {
        if (!savedUser) {
            console.log("User not valid")
            return res.status(422).json({ error: "Invalid username or password" })
        }

        bcrypt.compare(password, savedUser.password).then(doMatch => {

            if (doMatch) {
                const token = jwt.sign({ _id: savedUser._id }, JWT_SECRET)

                const { _id, name, email } = savedUser
                res.json({
                    token, user: {
                        _id, name, email
                    },
                    message: "Signedin Successfully"
                })
            }
            else {
                console.log("Invalid password")
                return res.status(422).json({ error: "Invalid username or password" })

            }

        }).catch(err => {

            console.log(err)
            res.status(500).json({ error: "Internal Server error" })

        })


    }).catch(err => {

        console.log(err)
        res.status(500).json({ error: "Internal Server error" })

    })



})

module.exports = router

