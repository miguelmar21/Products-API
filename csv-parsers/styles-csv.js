const fs = require("fs");
const csv = require("@fast-csv/parse");

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

module.exports = {
  awaitStyles
};