const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  product_id: Number,
  name: String,
  slogan: String,
  description: String,
  category: String,
  default_price: String,
  features: [{
    feature_id: Number,
    product_id: Number,
    fabric: String,
    canvas: String
  }]
})

module.exports = mongoose.model("products", productSchema);
//id, name, slogan, description,
//category, default_price, features, related