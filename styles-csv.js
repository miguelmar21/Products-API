const fs = require("fs");
const csv = require("@fast-csv/parse");

function readPhotos() {
  return new Promise((resolve, reject) => {
    var data = {};
    fs.createReadStream("./csv_files/photos.csv")
      .pipe(csv.parse({ headers: true }))
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

function readSkus() {
  return new Promise((resolve, reject) => {
    var data = {};
    fs.createReadStream("./csv_files/skus-copy.csv")
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        row.sku_id = parseInt(row.sku_id);
        row.style_id = parseInt(row.style_id);
        if (!data[row.style_id]) {
          data[row.style_id] = [row]
        } else {
          data[row.style_id].push(row);
        }
      })
      .on("end", (rowCount) => resolve(data));
  })
}

function readStyles(photos, skus) {
  return new Promise((resolve, reject) => {
    var data = [];
    fs.createReadStream("./csv_files/styles-copy.csv")
      .pipe(csv.parse({ headers: true }))
      .on("error", (error) => console.error(error))
      .on("data", (row) => {
        row.style_id = parseInt(row.style_id);
        row.product_id = parseInt(row.product_id);
        row.default = row.default === 1 ? true : false;
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
  console.log(photos);
  return styles;
}

awaitStyles()
module.exports = { awaitStyles };