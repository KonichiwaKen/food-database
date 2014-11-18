var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  foodId: String,
  date: String,
  time: Number
});

mongoose.model('Transaction', TransactionSchema);