angular.module('snackTrack', ['ui.router'])
.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider
      .state('home', {
        url: '/home',
        templateUrl: '/home.html',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['validFoodItems', function(validFoodItems) {
            return validFoodItems.getAll();
          }]
        }
      })
      .state('dataInput', {
        url: '/dataInput',
        templateUrl: '/dataInput.html',
        controller: 'MainCtrl',
        resolve: {
          postPromise: ['foodItems', function(foodItems) {
            return foodItems.getAll();
          }]
        }
      })
      .state('trends', {
        url: '/trends',
        templateUrl: '/trends.html',
        controller: 'TrendsCtrl',
        resolve: {
          postPromise: ['transactions', function(transactions) {
            return transactions.getAll();
          }]
        }
      });

    $urlRouterProvider.otherwise('home');
  }])
.factory('balances', ['$http', function($http) {
  var o = {
    balances: []
  };

  o.getAll = function() {
    return $http.get('/balances').success(function(data) {
      angular.copy(data, o.balances);
    });
  };

  o.create = function(balance) {
    return $http.post('/balances', balance).success(function(data) {
      o.balances.push(data);
    });
  };

  return o;
}])
.factory('foodItems', ['$http', function($http) {
  var o = {
    foodItems: []
  };

  o.getAll = function() {
    return $http.get('/food').success(function(data) {
      angular.copy(data, o.foodItems);
    });
  };

  o.create = function(foodItem) {
    return $http.post('/food', foodItem).success(function(data) {
      o.foodItems.push(data);
    });
  };

  return o;
}])
.factory('validFoodItems', ['$http', function($http) {
  var o = {
    validFoodItems: []
  };

  o.getAll = function() {
    return o.validFoodItems;
  };

  o.getValid = function(mealAmount) {
    return $http({
      url: '/validFood',
      method: "GET",
      params: {amount: mealAmount}}).success(function(data) {
      angular.copy(data, o.validFoodItems);
    });
  };

  return o;
}])
.factory('transactions', ['$http', function($http) {
  var o = {
    transactions: []
  };

  o.getAll = function() {
    return $http.get('/transactions').success(function(data) {
      angular.copy(data, o.transactions);
    });
  };

  o.create = function() {
    return $http.post('/transactions', transaction).success(function(data) {
      o.transactions.push(data);
    });
  };

  return o;
}])
.controller('MainCtrl', [
	'$scope',
  'balances',
  'foodItems',
  'validFoodItems',
	function($scope, balances, foodItems, validFoodItems) {
    $scope.balances = balances.balances;
    $scope.foodItems = foodItems.foodItems;
    $scope.validFoodItems = validFoodItems.validFoodItems;

    $scope.getValidFoods = function() {
      if (!$scope.netid || $scope.netid === '') { return; }

      var mealAmount = $scope.balance / 30 / 3;

      validFoodItems.getValid(mealAmount);

      balances.create({
        netid: $scope.netid,
        balance: $scope.balance
      });

      $scope.netid = '';
      $scope.balance = '';
    };

    $scope.addFood = function() {
      if (!$scope.foodName || $scope.foodName === '' ||
          !$scope.foodCost || $scope.foodCost === '' ||
          !$scope.restaurant || $scope.restaurant === '')
        { return; }

      foodItems.create({
        name: $scope.foodName,
        cost: $scope.foodCost,
        restaurant: $scope.restaurant
      });

      $scope.foodName = '';
      $scope.foodCost = '';
      $scope.restaurant = '';
    };
  }])
.controller('TrendsCtrl', [
  '$scope',
  'transactions',
  function($scope, transactions) {
    $scope.transactions = transactions.transactions;
  }])
.controller('HeaderCtrl', [
  '$scope',
  '$location',
  function($scope, $location) {
    $scope.isActive = function(viewLocation) {
      return viewLocation === $location.path();
    };
  }]);