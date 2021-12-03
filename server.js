const express = require('express');
const app = express()
const cors = require ('cors');
const db = require ('./database')
const products = require("./routers/productsRouter.js")
const path = require('path')

app.use(express.static(__dirname + '/./FEC-Project-main/dist'))
app.use(express.json());
app.use(cors());

app.use('/products', products);

app.listen(4000, () => console.log('Listening on port 4000'))