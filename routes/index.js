var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Balance = mongoose.model('Balance');
var FoodItem = mongoose.model('FoodItem');
var Transaction = mongoose.model('Transaction');

/* Preloading balances */
router.param('balance', function(req, res, next, id) {
  var query = Balance.findById(id);

  query.exec(function (err, balance) {
    if (err) { return next(err); }
    if (!balance) { return next(new Error("can't find balance\n")); }

    req.balance = balance;
    return next();
  });
});

/* Preloading food items */
router.param('foodItem', function(req, res, next, id) {
  var query = FoodItem.findById(id);

  query.exec(function (err, foodItem) {
    if (err) { return next(err); }
    if (!foodItem) { return next(new Error("can't find food item\n")); }

    req.foodItem = foodItem;
    return next();
  });
});

/* GET home page. */
router.get('/', function(req, res) {
  res.render('index', { title: 'Express' });
});

/* GET all balances */
router.get('/balances', function(req, res, next) {
  Balance.find(function(err, balances) {
    if (err) { return next(err); }

    res.json(balances);
  });
});

/* GET a balance */
router.get('/balances/:balance', function(req, res) {
  res.json(req.balance);
});

/* DELETE a balance */
router.delete('/balances/:balance', function(req, res) {
  var deletedId = req.balance._id;
  var query = Balance.findByIdAndRemove(deletedId);

  query.exec(function(err) {
    if (err) { return next(err); }

    res.send('Deleted ' + deletedId + '\n');
  });
});

/* DELETE all balances */
router.delete('/balances', function(req, res, next) {
  Balance.remove(function(err) {
    if (err) { return next(err); }

    res.send('Deleted all balances\n');
  });
});

/* POST new balance */
router.post('/balances', function(req, res, next) {
  var balance = new Balance(req.body);

  balance.save(function(err, balance){
    if(err) { return next(err); }

    res.json(balance);
  });
});

/* GET all food items */
router.get('/food', function(req, res, next) {
  FoodItem.find(function(err, foodItems) {
    if (err) { return next(err); }

    res.json(foodItems);
  });
});

/* GET a food item */
router.get('/food/:foodItem', function(req, res) {
  res.json(req.foodItem);
});

/* DELETE a food item */
router.delete('/food/:foodItem', function(req, res) {
  var deletedId = req.foodItem._id;
  var query = FoodItem.findByIdAndRemove(deletedId);

  query.exec(function(err) {
    if (err) { return next(err); }

    res.send('Deleted ' + deletedId + '\n');
  });
});

/* DELETE all food items */
router.delete('/food', function(req, res, next) {
  FoodItem.remove(function(err) {
    if (err) { return next(err); }

    res.send('Deleted all food items\n');
  });
});

/* POST new food item */
router.post('/food', function(req, res, next) {
  var foodItem = new FoodItem(req.body);

  foodItem.save(function(err, foodItem){
    if(err) { return next(err); }

    res.json(foodItem);
  });
});

/* GET valid food items */
router.get('/validFood', function(req, res, next) {
  FoodItem.find({ cost: {$lte: req.query.amount}, $or:[{hasFish:{$ne: req.query.hasFish}}, {hasFish:{$ne:1}}], $or:[{hasNuts:{$ne: req.query.hasNuts}}, {hasNuts:{$ne:1}}], $or:[{hasLactose:{$ne: req.query.hasLactose}}, {hasLactose:{$ne:1}}], $or:[{hasMeat:{$ne: req.query.hasMeat}}, {hasMeat:{$ne:1}}] }, function(err, foodItems) {
    if (err) { return next(err); }

    res.json(foodItems);
  });
});

/* GET all food transactions */
router.get('/transactions', function(req, res, next) {
  Transaction.find(function(err, transactions) {
    if (err) { return next(err); }

    res.json(transactions);
  });
});

/* POST new food transaction */
router.post('/transactions', function(req, res, next) {
  var transaction = new Transaction(req.body);

  transaction.save(function(err, transaction) {
    if (err) { return next(err); }

    res.json(transaction);
  });
});

/* DELETE all food transactions */
router.delete('/transactions', function(req, res, next) {
  Transaction.remove(function(err) {
    if (err) { return next(err); }

    res.send('Deleted all transactions');
  })
})

module.exports = router;
