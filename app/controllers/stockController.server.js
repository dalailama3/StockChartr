'use strict';

var STOCKS = require('../models/stocks.js')

module.exports = function StockController () {

  this.getStocks = function (req, res) {

  }

  this.addStock = function (req, res) {
    var tickerSymbol = req.body.ticker
    var newStock = new STOCKS({
      ticker: tickerSymbol
    })

    newStock.save(function (err, result) {
      if (err) { throw err; }
      res.json(result)
    })


  }

  this.deleteStock = function (req, res) {

  }





}
