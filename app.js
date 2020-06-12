const express = require('express')
const mongoose = require('mongoose')

require('./models/user')
require('./models/post')
var cors = require('cors');
const app = express()

app.use(cors());
// https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b

app.use(express.json())



const port = process.env.PORT || 5000
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



app.use(require('./routes/auth'))
app.use(require('./routes/post'))


app.get('/', (req, res) => {
    res.json({ message: "Instagram Clone" })
})



app.listen(port, () => {
    console.log("Server is running on", port)
})