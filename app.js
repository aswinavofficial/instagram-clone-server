const express = require('express')
const mongoose = require('mongoose')
const bodyParser = require('body-parser');


require('./models/user')
require('./models/post')
var cors = require('cors');
const app = express()
const http = require('http').Server(app);
const io = require('socket.io')(http);



app.use(cors());
// https://medium.com/@alexishevia/using-cors-in-express-cac7e29b005b

app.use(express.json())

app.use(bodyParser.urlencoded({
    extended: true,
}));

app.use(bodyParser.json({
    limit: '5mb'
}));

const port = process.env.PORT || 5000
const { MONGOURL } = require('./keys')

mongoose.connect(MONGOURL, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,

})


mongoose.connection.on('connected', () => {
    console.log('Mongodb connected')
})


mongoose.connection.on('error', () => {
    console.log('Mongodb connection error ')
})



app.use(require('./routes/auth'))
app.use(require('./routes/post'))
app.use(require('./routes/user'))


app.get('/', (req, res) => {
    res.json({ message: "Instagram Clone" })
})



http.listen(port, () => {
    console.log("Server is running on", port)
})

io.on('connection', function(socket) {
    console.log('Client connected to the WebSocket');
  
    socket.on('disconnect', () => {
      console.log('Client disconnected');
    });
  
    socket.on('chat message', function(msg) {
      console.log("Received a chat message");
      io.emit('chat message', msg);
    });

});