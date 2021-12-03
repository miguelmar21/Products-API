const fs = require("fs");
const csv = require("@fast-csv/parse");
const mongoose = require("mongoose");
const Style = require("../schemas/styles.js");
const db = require("../database.js");

//use these functions if your csvs are small! Much easier to use, but won't work with large files.

function readPhotos(toSkip) {
  return new Promise((resolve, reject) => {
    toSkip = toSkip ? toSkip : 0
    var data = {};
    fs.createReadStream("./csv_files/photos-copy.csv")
      .pipe(csv.parse({ headers: true, skipRows: toSkip }))
      .on("error" , (error) => console.error(error))
      .on("data", (row) => {
        var styleId = parseInt(row.style_id)
        delete row.style_id;
        delete row.id;
        if (!data[styleId]) {
          data[styleId] = [row];
        } else {
          data[styleId].push(row);
        }
      })
      .on("end", (rowCount) => resolve(data));
  });
}

function readSkus(toSkip) {
  return new Promise((resolve, reject) => {
    toSkip = toSkip ? toSkip : 0
    var data = {};
    fs.createReadStream("./csv_files/skus-copy.csv")
      .pipe(csv.parse({ headers: true, skipRows: toSkip}))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        row.sku_id = parseInt(row.sku_id);
        row.style_id = parseInt(row.style_id);
        function addToSkuObject() {
          data[row.style_id][row.sku_id] = {}
          data[row.style_id][row.sku_id].size = row.size;
          data[row.style_id][row.sku_id].quantity = row.quantity;
        }
        if (!data[row.style_id]) {
          data[row.style_id] = {}
          addToSkuObject()
        } else {
          addToSkuObject()
        }
      })
      .on("end", (rowCount) => resolve(data));
  })
}

function readStyles(photos, skus, toSkip) {
  return new Promise((resolve, reject) => {
    toSkip = toSkip ? toSkip : 0
    var data = [];
    fs.createReadStream("./csv_files/styles-copy.csv")
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        row.style_id = parseInt(row.style_id);
        row.product_id = parseInt(row.product_id);
        row.default = row.default === '1' ? true : false;
        row.photos = photos[row.style_id];
        row.skus = skus[row.style_id];
        data.push(row);
      })
      .on("end", (rowCount) => resolve(data));
  })
}

async function awaitStyles() {
  var photos = await readPhotos();
  var skus = await readSkus();
  var styles = await readStyles(photos, skus);
  return styles;
}

//Only use this if you have small csv files.
async function addStylesCollection() {
  awaitStyles().then(async (styles) => {
    var toInsert = [];
    const lastItem = styles.length - 1;
    for (let i = 0; i < styles.length; i++) {
      toInsert.push(styles[i]);
      if (i % 1000 === 0) {
        await Style.insertMany(toInsert);
        toInsert = [];
        console.log("There goes another 1000");
      } else if (i === lastItem) {
        await Style.insertMany(toInsert);
        console.log("Done");
      }
    }
  });
}

addStylesCollection()