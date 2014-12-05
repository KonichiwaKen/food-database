var mongoose = require('mongoose');

var TransactionSchema = new mongoose.Schema({
  foodId: String,
  date: Date
});

mongoose.model('Transaction', TransactionSchema);