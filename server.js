const express = require('express');
const app = express()
const mongoose = require('mongoose')
const Product = require('./products.js')

mongoose.connect('mongodb://localhost/testdb')
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to DB!'))

app.listen(3000, () => console.log('Listening on port 3000'))

async function run() {
  const product = await Product.create({
    product_id: 1,
    name: "Camo onesie",
    slogan: "It's just camo, chill.",
    features: [{
      feature_id: 1,
      product_id: 1,
      fabric: "milk",
      canvas: "eggs",
    }, {
      feature_id: 2,
      product_id: 1,
      fabric: "poop",
      canvas: "pee",
    }]
  })
  console.log(product);
}

// run();
// Parse through features first and add them somewhere. Maybe an object
// Next, parse through the products csv. Here, you will create a new document
// for each line in the csv but make sure to add features based on product_id