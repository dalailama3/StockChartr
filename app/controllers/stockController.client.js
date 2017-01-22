'use strict';

(function () {

angular
  .module('stocks', [])
  .controller('stocksController',
    ['$scope', function ($scope) {

    $scope.getStock = function () {
      console.log("geting stock for APPLE...")
    }





  }])





}())
