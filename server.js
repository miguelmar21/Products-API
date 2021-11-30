const express = require('express');
const app = express()
const cors = require ('cors');
const db = require ('./database')
const products = require("./routers/productsRouter.js")

app.use(express.json());
app.use(cors());

app.use('/products', products);

app.listen(4000, () => console.log('Listening on port 4000'))