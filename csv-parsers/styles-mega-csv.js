const fs = require("fs");
const csv = require("@fast-csv/parse");

var photosSkipped = 0;
var skusSkipped = 0;
var stylesSkipped = 0;
var batches = 1;
//last style_id in styles.csv
var lastStyle = 4660355;

// async function megaParser(photosToSkip, skusToSkip, stylesToSkip, lastStyleRow) {
//   var styles = readPhotos2();
//   console.log(styles)
// }

function readPhotos2(toSkip) {
  toSkip = toSkip ? toSkip : 0
  var data = {};
  var readStream = fs.createReadStream("./csv_files/photos-copy.csv")
    .pipe(csv.parse({ headers: true, skipRows: toSkip }))
    .on("error" , (error) => console.error(error))
    .on("data", (row) => {
      var styleId = parseInt(row.style_id)
      var rowId = parseInt(row.id)
      delete row.style_id;
      delete row.id;
      if (styleId === batches + 1) {
        console.log('PHOTOS WORKS')
        photosSkipped = rowId;
        readSkus2(data, skusSkipped)
        readStream.destroy()
      } else if (!data[styleId]) {
        data[styleId] = [row];
      } else {
        data[styleId].push(row);
      }
    })
    .on("end", (rowCount) => console.log('done with photos'));
}

function readSkus2(photos, toSkip) {
  toSkip = toSkip ? toSkip : 0
  var data = {};
  var readStream = fs.createReadStream("./csv_files/skus-copy.csv")
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
      if (parseInt(row.style_id) === batches + 1) {
        readStyles2(photos, data)
        readStream.destroy()
      } else if (!data[row.style_id]) {
        data[row.style_id] = {}
        addToSkuObject(photos, data, skusSkipped)
      } else {
        addToSkuObject()
      }
    })
    .on("end", (rowCount) => console.log('done with skus'));
}

function readStyles2(photos, skus, toSkip) {
  toSkip = toSkip ? toSkip : 0
  var data = [];
  var readStream = fs.createReadStream("./csv_files/styles-copy.csv")
    .pipe(csv.parse({ headers: true }))
    .on("error", (error) => console.error(error))
    .on("data", (row) => {
      row.style_id = parseInt(row.style_id);
      row.product_id = parseInt(row.product_id);
      row.default = row.default === '1' ? true : false;
      row.photos = photos[row.style_id];
      row.skus = skus[row.style_id];
      data.push(row);
      if (parseInt(row.style_id) === batches) {
        console.log(row);
        readStream.destroy();
      }
    })
    .on("end", (rowCount) => console.log(rowCount));
}

console.log(readPhotos2());
// megaParser();