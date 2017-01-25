'use strict';

(function () {

angular
  .module('stocks', [])
  .controller('stocksController',
    ['$scope','$http', 'socketio', function ($scope, $http, socketio) {

    socketio.on('newStock', function (stock) {
      console.log("updating all clients... a stock has been added")
      $scope.getStocksFromDB("socketio")
    })

    socketio.on('deleteStock', function (stock) {
      console.log("updating all clients... a stock has been removed: ", stock)

      $scope.getStocksFromDB("socketio delete", stock)
    })

    $scope.stockDatas = []
    $scope.newStock = ""
    $scope.stockHash = {}
    $scope.stockDBList = []
    $scope.stockList = []
    $scope.seriesOptions = []
    $scope.seriesCounter = 0
    $scope.errorMsg = ""
    $scope.alreadyHasMsg = ""
    $scope.deletedStock = ""
    $scope.colors = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#a65628","#f781bf",'#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a','#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
'#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1','#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
   '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92']


   function loadStocks(status) {
     if (status === 'loading') {
       $scope.stockList.forEach((stock)=> {
         $scope.updateStocks(stock, status)
       })
     }
   }


    function arrHasObjWithProp (arr, ticker) {
      var found = "no"
      arr.forEach((obj)=> {
        if (obj.name === ticker) {
          found = "yes"
          return true
        }
      })

      if (found === 'no') { return false }
    }

    function stripAwayEnd (string) {
      var regex = /\)\sP/
      var matchObj = string.match(regex)
      return string.slice(0, matchObj.index + 1)
    }


   $scope.updateChart = function(arr) {
     var result = []
     arr.forEach((stock, i)=> {
       var ticker = stock.toUpperCase()

       var url = `https://www.quandl.com/api/v3/datasets/WIKI/${ticker}.json?api_key=qAY7XBnmZQbJfSrr-tyK`
       $http.get(url)
       .then(function successCallback (res) {

         var data = res.data.dataset.data.reverse().map((arr)=> {
           return [new Date(arr[0]).getTime(), arr[4]]
         })
         var obj = {
           name: ticker,
           data: data,
           color: $scope.colors[i]
         }

         console.log(arrHasObjWithProp($scope.seriesOptions, ticker))

         if (arrHasObjWithProp($scope.seriesOptions, ticker) === false) {
           $scope.seriesOptions.push(obj)
           $scope.stockHash[ticker] = stripAwayEnd(res.data.dataset.name);
           createChart($scope.seriesOptions)
         }

      }, function (res) {

      })


     })
   }

    $scope.updateStocks = function (stock, status) {
        var ticker = stock.toUpperCase()
        var url = `https://www.quandl.com/api/v3/datasets/WIKI/${ticker}.json?api_key=qAY7XBnmZQbJfSrr-tyK`
        $http.get(url)
        .then(function successCallback (res) {
          console.log(res)
          $scope.errorMsg = ""
          $scope.alreadyHasMsg = ""
          var data = res.data.dataset.data.reverse().map((arr)=> {
            return [new Date(arr[0]).getTime(), arr[4]]
          })
          var obj = {
            name: ticker,
            data: data,
            color: $scope.colors[$scope.seriesCounter]
          }
          if (!arrHasObjWithProp($scope.seriesOptions, ticker) && status === 'loading') {
            $scope.seriesOptions.push(obj)
            $scope.seriesCounter += 1
            $scope.stockHash[ticker] = stripAwayEnd(res.data.dataset.name);
          }




          if ($scope.stockList.indexOf(ticker) === -1) {
            $scope.addStockToDB(ticker)
          }
          $scope.newStock = ""

          if ($scope.seriesCounter === $scope.stockList.length && status === 'loading') {
            createChart($scope.seriesOptions)

          }

        }, function errorCallback (res) {
          console.log(res)
          $scope.errorMsg = "Invalid ticker"
          $scope.newStock = ""


        });


    }

    $scope.addStock = function () {
      var stock = this.newStock.toUpperCase()

      if ($scope.stockList.indexOf(stock) === -1) {
        this.updateStocks(stock)
      } else {
        $scope.alreadyHasMsg = "Stock is already added"
      }
    }

    $scope.addStockToDB = function (ticker) {

      var url = 'https://fcc-stockchartr.herokuapp.com/api/stocks'
      $http.post(url, {ticker: ticker}).then(function (res) {
        console.log(res)

      }, function (res) {
        console.log(res)
      })
    }


     $scope.deleteStock = function (stock) {

         var url = `https://fcc-stockchartr.herokuapp.com/api/stocks/${stock}`
         $http.delete(url).then(function (res) {

         }, function (res) {
           console.log(res)
         })
     }

     function findAndDeleteStock(arr, stock) {
       var result = arr.filter((obj)=> {
         return obj.name !== stock
       })

       return result

     }


    $scope.getStocksFromDB = function (status, stockToDelete) {
      var url = 'https://fcc-stockchartr.herokuapp.com/api/stocks'
      $http.get(url).then(function (res) {
        $scope.stockDBList = res.data
        $scope.stockList = $scope.stockDBList.map((obj)=> { return obj.ticker })
        if (status === 'loading') {
          loadStocks('loading')
        }

        if (status === "socketio") {
          $scope.updateChart($scope.stockList)
        }

        if (status === "socketio delete") {
          $scope.seriesOptions = findAndDeleteStock($scope.seriesOptions, stockToDelete)

          $scope.stockList = $scope.stockList.filter((el)=> {
            return el !== stockToDelete
          })
          createChart($scope.seriesOptions)
        }
      }, function (res) {
        console.log(res)
      })
    }

    $scope.getStocksFromDB("loading")





    function createChart(seriesOptions) {
        console.log("creating chart now...")
        console.log(seriesOptions)
        Highcharts.stockChart('container', {


            rangeSelector: {
                selected: 4
            },

            title: {
              text: 'Stocks'
            },

            yAxis: {
              labels: {
                  formatter: function () {
                      return (this.value > 0 ? ' + ' : '') + this.value + '%';
                  }
              },
                plotLines: [{
                    value: 0,
                    width: 2,
                    color: 'silver'
                }]
            },
            plotOptions: {
               series: {
                   compare: 'percent',
                   showInNavigator: true
               }
           },

           tooltip: {
               pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
               valueDecimals: 2,
               split: true
           },

            series: seriesOptions
        });
    }

  }]).factory('socketio', ['$rootScope', function ($rootScope) {
      var socket = io.connect();
      return {
        on: function (eventName, callback) {
          socket.on(eventName, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              callback.apply(socket, args);
            });
          });
        },
        emit: function (eventName, data, callback) {
          socket.emit(eventName, data, function () {
            var args = arguments;
            $rootScope.$apply(function () {
              if (callback) {
                callback.apply(socket, args);
              }
            });
          })
        }
      };
    }])

}())
