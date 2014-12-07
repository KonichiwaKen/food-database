var mongoose = require('mongoose');

var BalanceSchema = new mongoose.Schema({
  netid: String,
  balance: {type: Number, default: 0},
  fishAll: {type: Number, default: 0},
  nutAll: {type: Number, default: 0},
  lactoseAll: {type: Number, default: 0},
  meatAll: {type: Number, default: 0}
});

mongoose.model('Balance', BalanceSchema);