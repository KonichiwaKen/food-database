var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  foodId: String,
  date: Date,
  restaurant: String
});

mongoose.model('Transaction', TransactionSchema);