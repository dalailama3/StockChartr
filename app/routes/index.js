'use strict';
var StockController = require('../controllers/stockController.server.js')
var stockController = new StockController()

module.exports = function (app) {

  app.get('/', function (req, res) {
    res.sendFile('/public/index.html')
  })

  app.route('/api/stocks')
    .get(stockController.getStocks)
    .post(stockController.addStock)

  app.delete('/api/stocks/:stock', stockController.deleteStock)



}
