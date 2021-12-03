const fs = require("fs");
const csv = require("@fast-csv/parse");
const mongoose = require("mongoose");
const Style = require("../schemas/styles.js");
const db = require("../database.js");

var photosSkipped = 0;
var skusSkipped = 0;
var stylesSkipped = 0;
var lastStyle = 5000; //4660354 - last style in style.csv
var batches = 101;

//The mother of all parsers.

async function readPhotos2(toSkip) {
  toSkip = toSkip ? toSkip : 0;
  let data = {};
  var readStream = fs.createReadStream("./csv_files/photos.csv")
    .pipe(csv.parse({ headers: true, skipRows: toSkip }))
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
      var styleId = parseInt(row.style_id);
      var rowId = parseInt(row.id);
      if (!data[styleId]) {
        data[styleId] = [row];
      } else {
        data[styleId].push(row);
      }

      if (styleId > batches - 1) {
        photosSkipped = rowId;
        readSkus2(data, skusSkipped);
        data = {};
        readStream.destroy();
      }
    })
    .on("end", (rowCount) => console.log("done with photos"));
}

function readSkus2(photos, toSkip) {
  toSkip = toSkip ? toSkip : 0;
  let data = {};
  var readStream = fs.createReadStream("./csv_files/skus.csv")
    .pipe(csv.parse({ headers: true, skipRows: toSkip }))
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
      var styleId = parseInt(row.style_id);
      var skuId = parseInt(row.sku_id);
      row.sku_id = skuId;
      row.style_id = styleId;
      function addToSkuObject() {
        data[row.style_id][row.sku_id] = {};
        data[row.style_id][row.sku_id].size = row.size;
        data[row.style_id][row.sku_id].quantity = row.quantity;
      }
      if (!data[row.style_id]) {
        data[row.style_id] = {};
        addToSkuObject(photos, data, skusSkipped);
      } else {
        addToSkuObject();
      }

      if (styleId > batches || styleId === lastStyle) {
        skusSkipped = skuId;
        readStyles2(photos, data, stylesSkipped);
        data = {};
        readStream.destroy();
      }
    })
    .on("end", (rowCount) => console.log("done with skus"));
}

function readStyles2(photos, skus, toSkip) {
  toSkip = toSkip ? toSkip : 0;
  let data = [];
  var readStream = fs.createReadStream("./csv_files/styles.csv")
    .pipe(csv.parse({ headers: true, skipRows: toSkip }))
    .on("error", (error) => console.error(error))
    .on("data", async (row) => {
      var styleId = parseInt(row.style_id);
      row.style_id = styleId;
      row.product_id = parseInt(row.product_id);
      row.default = row.default === "1" ? true : false;
      row.photos = photos[row.style_id];
      row.skus = skus[row.style_id];
      data.push(row);
      if (styleId === batches) {
        stylesSkipped = styleId;
        console.log(data);
        Style.insertMany(data)
          .then(response => {
            batches += 100;
            console.log("There goes another 100");
            data = [];
            console.log(data);
            readPhotos2(photosSkipped);
            readStream.destroy();
          })
          .catch(err => {
            console.log(err);
          })
      } else if (styleId === lastStyle) {
        Style.insertMany(data)
          .then(response => {
            console.log("done");
            process.exit();
          })
          .catch(err => {
            console.log(err);
          })
      }
    })
    .on("end", (rowCount) => console.log("end"));
}

readPhotos2(photosSkipped);

