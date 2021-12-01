const fs = require("fs");
const csv = require("@fast-csv/parse");

var photosSkipped = 38;
var skusSkipped = 38;
var stylesSkipped = 10;
var batches = 15;
//last style_id in styles.csv
var lastStyle = 31;

function readPhotos2(toSkip) {
  toSkip = toSkip ? toSkip : 0
  var data = {};
  var readStream = fs.createReadStream("./csv_files/photos.csv")
    .pipe(csv.parse({ headers: true, skipRows: toSkip }))
    .on("error" , (error) => console.error(error))
    .on("data", (row) => {
      var styleId = parseInt(row.style_id)
      var rowId = parseInt(row.id)
      delete row.style_id;
      delete row.id;
      if (!data[styleId]) {
        data[styleId] = [row];
      } else {
        data[styleId].push(row);
      }

      if (styleId === batches + 1 || styleId === lastStyle) {
        photosSkipped = rowId - 1;
        readSkus2(data, skusSkipped)
        readStream.destroy()
      }
    })
    .on("end", (rowCount) => console.log('done with photos'));
}

function readSkus2(photos, toSkip) {
  toSkip = toSkip ? toSkip : 0
  var data = {};
  var readStream = fs.createReadStream("./csv_files/skus.csv")
    .pipe(csv.parse({ headers: true, skipRows: toSkip}))
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
      var styleId = parseInt(row.style_id);
      var skuId = parseInt(row.sku_id);
      row.sku_id = skuId
      row.style_id = styleId
      function addToSkuObject() {
        data[row.style_id][row.sku_id] = {}
        data[row.style_id][row.sku_id].size = row.size;
        data[row.style_id][row.sku_id].quantity = row.quantity;
      }
      if (!data[row.style_id]) {
        data[row.style_id] = {}
        addToSkuObject(photos, data, skusSkipped)
      } else {
        addToSkuObject()
      }

      if (styleId === batches + 1 || styleId === lastStyle) {
        skusSkipped = skuId - 1;
        readStyles2(photos, data, stylesSkipped)
        readStream.destroy()
      }
    })
    .on("end", (rowCount) => console.log('done with skus'));
}

function readStyles2(photos, skus, toSkip) {
  toSkip = toSkip ? toSkip : 0
  var data = [];
  var readStream = fs.createReadStream("./csv_files/styles.csv")
    .pipe(csv.parse({ headers: true, skipRows: toSkip }))
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
      row.style_id = parseInt(row.style_id);
      row.product_id = parseInt(row.product_id);
      row.default = row.default === '1' ? true : false;
      row.photos = photos[row.style_id];
      row.skus = skus[row.style_id];
      data.push(row);
      if (parseInt(row.style_id) === batches) {
        batches += 15;
        stylesSkipped = parseInt(row.style_id)
        console.log(data)
        data = [];
        console.log(row);
        readPhotos2(photosSkipped)
        readStream.destroy();
      } else if (parseInt(row.style_id) === lastStyle) {
        console.log('done');
        readStream.destroy();
      }
    })
    .on("end", (rowCount) => console.log(rowCount));
}

console.log(readPhotos2(photosSkipped));
// megaParser();