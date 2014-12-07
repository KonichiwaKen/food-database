var module = angular.module('snackTrack', ['ui.router']);

module.config([
  '$stateProvider',
  '$urlRouterProvider',
  function($stateProvider, $urlRouterProvider) {
    $stateProvider.state('home', {
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
  }
  ]);

module.factory('balances', [
  '$http',
  function($http) {
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
  }
  ]);

module.factory('foodItems', [
  '$http',
  function($http) {
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
  }
  ]);


module.factory('validFoodItems', [
  '$http',
  function($http) {
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
    }
    ]);

module.factory('transactions', [
  '$http',
  function($http) {
    var o = {
      transactions: []
    };

    o.getAll = function() {
      return $http.get('/transactions').success(function(data) {
        angular.copy(data, o.transactions);
      });
    };

    o.create = function(transaction) {
      return $http.post('/transactions', transaction).success(function(data) {
        o.transactions.push(data);
      });
    };

    return o;
  }
  ]);

module.controller('MainCtrl', [
	'$scope',
	'balances',
	'foodItems',
	'validFoodItems',
  'transactions',
  function($scope, balances, foodItems, validFoodItems, transactions) {
    $scope.balances = balances.balances;
    $scope.foodItems = foodItems.foodItems;
    $scope.validFoodItems = validFoodItems.validFoodItems;
    $scope.transactions = transactions.transactions;




    $scope.food_selection = [];
    $scope.total = 0;



    $scope.getValidFoods = function() {
      if (!$scope.netid || $scope.netid === '') { return; }


      var currentDate = new Date();
      var endDate = new Date("12/15/2014");

      var timeDiff = Math.abs(endDate.getTime() - currentDate.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      var mealAmount = $scope.balance / (diffDays*2.5);
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

    $scope.addToMenu = function(foodID, name, cost, restaurant){
      var food_selected = {foodID: foodID, name: name, restaurant: restaurant, cost: cost};
      $scope.total += cost;
      $scope.food_selection.push(food_selected);
    }

    $scope.remFromMenu = function(foodID, cost){

      $scope.total -= cost;
      $scope.food_selection.push(food_selected);
    }


    $scope.addTransaction = function() {
      var currentDate = new Date();

      console.log('test');

      for(var i = 0; i < $scope.food_selection.length; i++) {
        transactions.create({
          foodId: $scope.food_selection[i]._id,
          date: currentDate
        });
      }

      $scope.food_selection = [];

    }
  }
  ]);

module.controller('TrendsCtrl', [
  '$scope',
  '$http',
  'transactions',
  function($scope, $http, transactions) {
    $scope.transactions = transactions.transactions;

    $scope.allTransactions = function() {
      $scope.trends = [];
      for(var i = 0; i < $scope.transactions.length; i++) {
        createTrend($scope.transactions[i].foodId, $scope.transactions[i].date);
      }
    }

    createTrend = function(foodId, date) {
      $http.get('/food/' + foodId).success(function(data) {
        var trend = data;
        trend.date = date;
        $scope.trends.push(trend);
      });
    }
  }
  ]);

module.controller('HeaderCtrl', [
  '$scope',
  '$location',
  function($scope, $location) {
    $scope.isActive = function(viewLocation) {
      return viewLocation === $location.path();
    };
  }]);
