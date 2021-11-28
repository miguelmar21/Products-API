const mongoose = require("mongoose");
const { awaitStyles } = require("../styles-csv.js")

//Schema for styles
const stylesSchema = new mongoose.Schema({
  style_id: Number,
  product_id: Number,
  name: String,
  sale_price: String,
  original_price: String,
  default: Boolean,
  photos: [
    {
      thumbnail_url: String,
      url: String,
    }
  ],
  skus: [{
    sku_id: Number,
    style_id: Number,
    size: String,
    quantity: String
  }]
})

var Style = mongoose.model("styles", stylesSchema);

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