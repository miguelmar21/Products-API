const mongoose = require('mongoose');
const db = require("../database.js")
const Product = require('../schemas/products.js');
const Style = require('../schemas/styles.js');

async function findProduct(productId) {
  try {
    const product = await Product.find({ product_id: productId })
    return product;
  } catch {
    return 'Could not find product.'
  }
}

async function findStyles(productId){
  try {
    const styles = await Style.find({ product_id: productId })
    return styles;
  } catch {
    return 'Could not find styles.'
  }
}

module.exports = {
  findProduct,
  findStyles
};