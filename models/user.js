const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types


const userSchema = new mongoose.Schema(
    {
        name: {
            type: String,
            required: true
        },
        email: {
            type: String,
            required: true
        },
        photo: {
            type: String,
            default : 'https://res.cloudinary.com/dzfjtvyhe/image/upload/v1605724756/wiqmxswe04bvl6xj7su7.jpg'
        },
        password: {

            type: String,
            required: true

        },
        followers: [{
            type : ObjectId,
            ref : 'User'
        }],
        following: [{
            type : ObjectId,
            ref : 'User'
        }],

        accountType : {

            type : String,
            default : 'PRIVATE'

        },
        location: {
            type: {
                type: String,
                required: false,
                default: "Point"
            },
            address: { type: String },
            coordinates: [ Number ],
        }

    }
)

userSchema.index({"location": "2dsphere", email: 1});


mongoose.model("User", userSchema)