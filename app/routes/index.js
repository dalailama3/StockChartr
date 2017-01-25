'use strict';
var StockController = require('../controllers/stockController.server.js')


module.exports = function (app, io) {
  var stockController = new StockController(io)

  app.get('/', function (req, res) {
    res.sendFile('/public/index.html')
  })

  app.route('/api/stocks')
    .get(stockController.getStocks)
    .post(stockController.addStock)

  app.delete('/api/stocks/:stock', stockController.deleteStock)




}
