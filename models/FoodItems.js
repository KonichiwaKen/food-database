var mongoose = require('mongoose');

var FoodItemSchema = new mongoose.Schema({
  name: String,
  cost: Number,
  restaurant: String,

  hasFish: {type: Boolean, default: false},
  hasNuts: {type: Boolean, default: false},
  hasLactose: {type: Boolean, default: false},
  hasMeat: {type: Boolean, default: false},
  
  typeOfMeal: String
});

mongoose.model('FoodItem', FoodItemSchema);