'use strict';

var mongoose = require('mongoose')
var Schema = mongoose.Schema

var Stock = new Schema({
  ticker: { type: String, unique: true }
})


module.exports = mongoose.model('Stock', Stock)
