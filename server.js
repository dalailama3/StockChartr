var express = require('express')
var app = express()

// app.set('views', process.cwd() + '/views')

// app.set('view engine', 'html')


app.use(express.static(__dirname + '/public'))
var routes = require('./app/routes/index.js')



routes(app)


app.listen(process.env.PORT || '8080')
