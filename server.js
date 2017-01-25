var express = require('express')
var app = express()
var http = require('http').Server(app)
var io = require('socket.io')(http)
var bodyParser = require('body-parser')
var mongoose = require('mongoose')


mongoose.connect(process.env.MONGO_URI)

app.use(express.static(__dirname + '/public'))
app.use('/controllers', express.static(process.cwd() + '/app/controllers'))
app.use('/node_modules', express.static(process.cwd() + '/node_modules'))
app.use(bodyParser.json())
var routes = require('./app/routes/index.js')

io.on('connection', function (socket) {
  console.log('a user connected')
})

routes(app, io)


http.listen(process.env.PORT || '8080', function () {
  console.log('server is listening on port 8080...')
})
