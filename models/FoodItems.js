var mongoose = require('mongoose');

var FoodItemSchema = new mongoose.Schema({
  name: String,
  balance: Number,
  restaurant: String
});

mongoose.model('FoodItem', FoodItemSchema);