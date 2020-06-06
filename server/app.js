const express = require('express')
const mongoose = require('mongoose')

require('./models/user')
const app = express()


app.use(express.json())
app.use(require('./routes/auth'))



const port = 5000
const { MONGOURL } = require('./keys')

mongoose.connect(MONGOURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true

})


mongoose.connection.on('connected', () => {
    console.log('Mongodb connected')
})


mongoose.connection.on('error', () => {
    console.log('Mongodb connection error ')
})

const customMiddleWare = (req, res, next) => {
    console.log("Middleware")
    next()
}


// app.get('/', (req, res) => {
//     res.send("HelloWorld")
// })

app.get('/home', customMiddleWare, (req, res) => {
    res.send("home")
})

app.listen(port, () => {
    console.log("Server is running on", port)
})