'use strict';

var STOCKS = require('../models/stocks.js')

module.exports = function StockController (io) {

  this.getStocks = function (req, res) {
    STOCKS.find({}, function (err, results) {
      if (err) { throw err }
      res.json(results)
    })
  }

  this.addStock = function (req, res) {
    var tickerSymbol = req.body.ticker
    var newStock = new STOCKS({
      ticker: tickerSymbol
    })

    newStock.save(function (err, result) {
      if (err) { throw err;}
      res.json(result)
      io.emit('newStock', result)
    })


  }

  this.deleteStock = function (req, res) {
    STOCKS.remove({ticker: req.params.stock}, function (err, result) {
      if (err) { throw err}
      io.emit('deleteStock', req.params.stock)
      res.end()
    })
  }





}
