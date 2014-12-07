var mongoose = require('mongoose');

var FoodItemSchema = new mongoose.Schema({
  category: String,
  name: String,
  calories: Number,
  cost: Number,
  restaurant: String,
  hasFish: {type: Number, default: 0},
  hasNuts: {type: Number, default: 0},
  hasLactose: {type: Number, default: 0},
  hasMeat: {type: Number, default: 0},
  typeOfMeal: String
});

mongoose.model('FoodItem', FoodItemSchema);