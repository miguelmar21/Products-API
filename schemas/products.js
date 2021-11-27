const mongoose = require('mongoose');
const { awaitProducts } = require('../csv-parser.js')

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
  }],
  related: [Number]
})

var Product = mongoose.model("products", productSchema)

async function addProductCollection() {
  awaitProducts()
  .then(async products => {
    var toInsert = [];
    const lastItem = products.length - 1;
    for (let i = 0; i < products.length; i++) {
      toInsert.push(products[i]);
      if (i % 1000 === 0) {
        await Product.insertMany(toInsert);
        toInsert = []
        console.log('There goes another 1000')
      } else if (i === lastItem) {
        await Product.insertMany(toInsert);
        console.log('Done')
      }
    }
  })
}

addProductCollection()

