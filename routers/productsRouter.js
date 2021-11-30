const routes = require("express").Router();
const { findProduct, findStyles } = require ('../mongoHelperFunc/productHelper.js')


routes.get(`/:product_id`, (req, res) => {
  var productId = req.params.product_id;
  findProduct(productId)
    .then(results => {
      res.status(200).send(results);
    })
    .catch(err => {
      console.log(err)
    })
});

routes.get('/:product_id/styles', (req, res) => {
  var productId = req.params.product_id;
  findStyles(productId)
    .then(results => {
      res.status(200).send(results);
    })
    .catch(err => {
      console.log(err)
    })
})

module.exports = routes;