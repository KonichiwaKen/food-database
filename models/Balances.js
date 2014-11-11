var mongoose = require('mongoose');

var BalanceSchema = new mongoose.Schema({
  netid: String,
  balance: {type: Number, default: 0}
});

mongoose.model('Balance', BalanceSchema);