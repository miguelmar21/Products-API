const fs = require("fs");
const csv = require("@fast-csv/parse");
const mongoose = require("mongoose");
const Product = require("../schemas/products.js");
const db = require("../database.js");

//Reads features.csv and inserts them into an object based on product_id
function readFeatures() {
  return new Promise((resolve, reject) => {
    var data = {};
    fs.createReadStream("./csv_files/features.csv")
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        row.feature_id = parseInt(row.feature_id);
        row.product_id = parseInt(row.product_id);
        if (!data[row.product_id]) {
          data[row.product_id] = [row];
        } else {
          data[row.product_id].push(row);
        }
      })
      .on("end", (rowCount) => resolve(data));
  });
}

//Reads related.csv and inserts them into an object based on product_id
function readRelated() {
  return new Promise((resolve, reject) => {
    var data = {};
    fs.createReadStream("./csv_files/related.csv")
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        if (!data[row.product_id]) {
          data[row.product_id] = [parseInt(row.related_product_id)];
        } else {
          data[row.product_id].push(parseInt(row.related_product_id));
        }
      })
      .on("end", (rowCount) => resolve(data));
  });
}

//Reads products.csv and inserts both features and related according to product_id
function readProducts(features, related) {
  return new Promise((resolve, reject) => {
    var data = [];
    fs.createReadStream("./csv_files/products.csv")
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        row.product_id = parseInt(row.product_id);
        row.features = features[row.product_id];
        row.related = related[row.product_id];
        data.push(row);
      })
      .on("end", (rowCount) => resolve(data));
  });
}

//Returns products with features and related
async function awaitProducts() {
  var features = await readFeatures();
  var related = await readRelated();
  var products = await readProducts(features, related);
  return products;
}

//Adds all products from CSV to collection in chunks of 1000
async function addProductCollection() {
  console.log('Starting process... Please wait.')
  awaitProducts().then(async (products) => {
    var toInsert = [];
    const lastItem = products.length - 1;
    for (let i = 0; i < products.length; i++) {
      toInsert.push(products[i]);
      if (i % 100 === 0) {
        await Product.insertMany(toInsert);
        toInsert = [];
        console.log("There goes another 100");
      } else if (i === lastItem) {
        await Product.insertMany(toInsert);
        console.log("Done");
      }
    }
  });
}

addProductCollection()

