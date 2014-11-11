angular.module('snackTrack', ['ui.router'])
.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl'
      })
      .state('dataInput', {
        url: '/dataInput',
        templateUrl: '/dataInput.html',
        controller: 'MainCtrl'
      });

    $urlRouterProvider.otherwise('home');
  }])
.factory('balances', [function() {
  var o = {
    balances: []
  };

  return o;
}])
.factory('foodData', [function() {
  var o = {
    foodData: []
  };

  return o;
}])
.controller('MainCtrl', [
	'$scope',
  'balances',
  'foodData',
	function($scope, balances, foodData) {
    $scope.balances = balances.balances;
    $scope.foodData = foodData.foodData;

    $scope.addBalance = function() {
      if(!$scope.balance || $scope.balance === '' ||
         !$scope.netid || $scope.netid === '')
        { return; }
      $scope.balances.push({netid: $scope.netid, balance: $scope.balance});
      $scope.netid = '';
      $scope.balance = '';
    };

    $scope.addFood = function() {
      $scope.foodData.push({name: $scope.foodName,
                            cost: $scope.foodCost,
                            restaurant: $scope.restaurant});
      $scope.foodName = '';
      $scope.foodCost = '';
      $scope.restaurant = '';
    };
  }])
.controller('HeaderCtrl', [
  '$scope',
  '$location',
  function($scope, $location) {
    $scope.isActive = function (viewLocation) {
      return viewLocation === $location.path();
    };
  }]);