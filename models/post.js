const mongoose = require('mongoose')
const { ObjectId } = mongoose.Schema.Types


const postSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    body: {
        type: String,
        required: true
    },
    photo: {
        type: String,
        required: true,
        default : 'https://res.cloudinary.com/dzfjtvyhe/image/upload/v1605724756/wiqmxswe04bvl6xj7su7.jpg'
    },
    postedBy: {
        type: ObjectId,
        ref: 'User'
    },
    likedBy : [{
        type : ObjectId,
        ref : 'User'
    }]
}, { timestamps: true })


mongoose.model("Post", postSchema)

