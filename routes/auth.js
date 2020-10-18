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

    console.time('MONGO_EMAIL_CHECK');
    User.findOne({ email: email })
    .lean()
    .then(
        savedUser => {
            if (savedUser) {
                return res.status(422).json({ error: "User having given email id already already " })

            }

            // Rounds  ->  Time
            // 15 - 3039 ms
            // 14 - 1476 ms
            // 13 - 775 ms
            // 12 - 416 ms
            // 11 - 231 ms
            // 10 - 138 ms
            // 9  - 99 ms
            // 8  - 73 ms
               console.timeEnd('MONGO_EMAIL_CHECK');
               console.time('BCRYPT_HASHING');
           bcrypt.hash(password, 10).
               then(hashedPassword => {
                    const user = new User(
                        { name, email, password: password }
                    )
                console.timeEnd('BCRYPT_HASHING');
                console.time('MONGO_USER_SAVE');
                    user.save()
                    .then(user => {
                        console.timeEnd('MONGO_USER_SAVE'); 
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


    console.time('MONGO_SIGNIN');
    User.findOne(
        { email: email }
    )
    .lean()
    .then(savedUser => {
        if (!savedUser) {
            console.log("User not valid")
            return res.status(422).json({ error: "Invalid username or password" })
        }

        console.timeEnd('MONGO_SIGNIN');
        console.time('MONGO_SIGNIN_BCRYPT');
       bcrypt.compare(password, savedUser.password).then(doMatch => {
            console.timeEnd('MONGO_SIGNIN_BCRYPT');
            if (password === savedUser.password ) {
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

