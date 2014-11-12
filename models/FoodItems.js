var mongoose = require('mongoose');

var FoodItemSchema = new mongoose.Schema({
  name: String,
  cost: Number,
  restaurant: String
});

mongoose.model('FoodItem', FoodItemSchema);