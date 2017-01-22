'use strict';

(function () {

angular
  .module('stocks', [])
  .controller('stocksController',
    ['$scope','$http', function ($scope, $http) {

    $scope.stockDatas = []
    $scope.newStock = ""
    $scope.stockList = []
    $scope.seriesOptions = []
    $scope.seriesCounter = 0
    $scope.errorMsg = ""
    $scope.colors = ["#e41a1c","#377eb8","#4daf4a","#984ea3","#ff7f00","#a65628","#f781bf",'#492970', '#f28f43', '#77a1e5', '#c42525', '#a6c96a','#7cb5ec', '#434348', '#90ed7d', '#f7a35c', '#8085e9',
'#f15c80', '#e4d354', '#8085e8', '#8d4653', '#91e8e1','#4572A7', '#AA4643', '#89A54E', '#80699B', '#3D96AE',
   '#DB843D', '#92A8CD', '#A47D7C', '#B5CA92']

    $scope.updateStocks = function (stock) {
        var ticker = stock.toUpperCase()
        var url = `https://www.quandl.com/api/v3/datasets/WIKI/${stock}.json?api_key=qAY7XBnmZQbJfSrr-tyK`
        $http.get(url)
        .then(function successCallback (res) {
          console.log(res)
          $scope.errorMsg = ""
          var data = res.data.dataset.data.reverse().map((arr)=> {
            return [new Date(arr[0]).getTime(), arr[4]]
          })
          $scope.seriesOptions.push({
            name: ticker,
            data: data,
            color: $scope.colors[$scope.seriesCounter]
          })
          $scope.seriesCounter += 1
          $scope.stockList.push(res.data.dataset.name);

          $scope.addStockToDB(ticker)
          $scope.newStock = ""


          createChart($scope.seriesOptions)

        }, function errorCallback (res) {
          console.log(res)
          $scope.errorMsg = res.data.quandl_error.message
          $scope.newStock = ""


        });


    }

    $scope.addStock = function () {
      var stock = this.newStock

      if (this.stockList.indexOf(stock) === -1) {
        this.updateStocks(stock)
      }
    }

    $scope.addStockToDB = function (ticker) {

      var url = 'http://localhost:8080/api/stocks'
      $http.post(url, {ticker: ticker}).then(function (res) {
        console.log(res)

      }, function (res) {
        console.log(res)
      }
      })
    }



    function createChart(seriesOptions) {
        Highcharts.stockChart('container', {

            rangeSelector: {
                selected: 4
            },

            title: {
              text: 'StockChartr'
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

  }])

}())
