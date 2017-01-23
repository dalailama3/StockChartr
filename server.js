var express = require('express')
var app = express()
var bodyParser = require('body-parser')
var mongoose = require('mongoose')
// app.set('views', process.cwd() + '/views')

// app.set('view engine', 'html')

mongoose.connect(process.env.MONGO_URI)
app.use(express.static(__dirname + '/public'))
app.use('/controllers', express.static(process.cwd() + '/app/controllers'))
app.use(bodyParser.json())
var routes = require('./app/routes/index.js')



routes(app)


app.listen(process.env.PORT || '8080')
