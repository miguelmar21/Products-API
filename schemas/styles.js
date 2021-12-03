const mongoose = require("mongoose");

//Schema for styles
const stylesSchema = new mongoose.Schema({
  style_id: Number,
  product_id: Number,
  name: String,
  sale_price: String,
  original_price: String,
  default: Boolean,
  photos: [
    {
      thumbnail_url: String,
      url: String,
    },
  ],
  skus: Object,
});

var Style = mongoose.model("styles", stylesSchema);

module.exports = Style;
