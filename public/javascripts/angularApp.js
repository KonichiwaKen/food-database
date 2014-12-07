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
        postPromise: ['transactions', 'foodItems', function(transactions, foodItems) {
          foodItems.getAll();
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
  'restaurants',
  function($http, restaurants) {
  	var o = {
  		foodItems: []
  	};

  	o.getAll = function() {
  		return $http.get('/food').success(function(data) {
  			angular.copy(data, o.foodItems);
        for (var i = 0; i < o.foodItems.length; i++) {
          if (restaurants.contains(o.foodItems[i].restaurant) === -1) {
            restaurants.create(o.foodItems[i].restaurant);
          }
        }
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

module.factory('restaurants', [
  function() {
    var o = {
      restaurants: []
    };

    o.create = function(name) {
      o.restaurants.push(name);
    }

    o.contains = function(name) {
      return o.restaurants.indexOf(name);
    }

    return o;
  }
]);

module.controller('MainCtrl', [
	'$scope',
	'balances',
	'foodItems',
	'validFoodItems',
  'transactions',
  'restaurants',
	function($scope, balances, foodItems, validFoodItems, transactions, restaurants) {
    $scope.balances = balances.balances;
    $scope.foodItems = foodItems.foodItems;
    $scope.validFoodItems = validFoodItems.validFoodItems;
    $scope.transactions = transactions.transactions;
    $scope.restaurants = restaurants.restaurants;

    $scope.getValidFoods = function() {
      if (!$scope.netid || $scope.netid === '') { return; }


      var currentDate = new Date();
      var endDate = new Date("12/15/2014");

      var timeDiff = Math.abs(endDate.getTime() - currentDate.getTime());
      var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));

      // console.log(diffDays);
      //include *3 for 3 meals a day
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

    $scope.addTransaction = function(chosenId, restaurant) {
      var currentDate = new Date();
      transactions.create({
        foodId: chosenId,
        date: currentDate,
        restaurant: restaurant
      });
    };
  }
]);

module.controller('TrendsCtrl', [
  '$scope',
  '$http',
  'transactions',
  'restaurants',
  function($scope, $http, transactions, restaurants) {
    $scope.transactions = transactions.transactions;
    $scope.restaurants = restaurants.restaurants;
    $scope.trends = [];

    $scope.allTransactions = function() {
      $scope.trends = [];

      for(var i = 0; i < $scope.transactions.length; i++) {
        createTrend($scope.transactions[i].foodId, $scope.transactions[i].date);
      }
    }

    $scope.foodTrends = function() {
      $scope.trends = [];

      for (var i = 0; i < $scope.transactions.length; i++) {
        var found = 0;
        var trendId = $scope.transactions[i].foodId;

        for (var j = 0; j < $scope.trends.length; j++) {
          if ($scope.trends[j].foodId === trendId) {
            $scope.trends[j].count++;
            $scope.trends[j].average = $scope.trends[j].count / $scope.transactions.length * 1000; // width is 614
            found = 1;
            break;
          }
        }

        if (!Boolean(found)) {
          $scope.trends.push({foodId: trendId, count: 1, average: 1 / $scope.transactions.length * 1000});
        }
      }

      for (var i = 0; i < $scope.trends.length; i++) {
        getFoodInfo($scope.trends[i]);
      }
    }

    $scope.restaurantTrends = function(restaurant) {
      $scope.trends = [];
      var total = 0;

      for (var i = 0; i < $scope.transactions.length; i++) {
        console.log('Request: ' + restaurant + '; Transaction: ' + $scope.transactions[i].restaurant);
        if ($scope.transactions[i].restaurant === restaurant) {
          var found = 0;
          var trendId = $scope.transactions[i].foodId;
          total++;

          for (var j = 0; j < $scope.trends.length; j++) {
            if ($scope.trends[j].foodId === trendId) {
              $scope.trends[j].count++;
              found = 1;
              break;
            }
          }

          if (!Boolean(found)) {
            $scope.trends.push({foodId: trendId, count: 1});
          }
        }
      }

      for (var i = 0; i < $scope.trends.length; i++) {
        getFoodInfo($scope.trends[i]);
        $scope.trends[i].average = $scope.trends[i].count / total * 800;
      }
    }

    getFoodInfo = function(trend) {
      $http.get('/food/' + trend.foodId).success(function(data) {
        trend.name = data.name;
      });
    }

    createTrend = function(foodId, date) {
      $http.get('/food/' + foodId).success(function(data) {
        var trend = data;
        trend.date = new Date(date);
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
