var mongoose = require('mongoose');

var BalanceSchema = new mongoose.Schema({
  netid: String,
  balance: {type: Number, default: 0},
  fishAll: {type: Boolean, default: false},
  nutAll: {type: Boolean, default: false},
  lactoseAll: {type: Boolean, default: false},
  meatAll: {type: Boolean, default: false}
});

mongoose.model('Balance', BalanceSchema);