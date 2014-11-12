var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var Balance = mongoose.model('Balance');
var FoodItem = mongoose.model('FoodItem');

/* Preloading balances */
router.param('balance', function(req, res, next, id) {
  var query = Balance.findById(id);

  query.exec(function (err, balance) {
    if (err) { return next(err); }
    if (!balance) { return next(new Error("can't find balance")); }

    req.balance = balance;
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

  Balance.remove(function(err, balance) {
    if (err) { return next(err); }

    res.send('Deleted ' + deletedId);
  })
})

/* POST new balance */
router.post('/balances', function(req, res, next) {
  var balance = new Balance(req.body);

  balance.save(function(err, balance){
    if(err) { return next(err); }

    res.json(balance);
  });
});

module.exports = router;
