const express = require('express');
const app = express()
const mongoose = require('mongoose')
// const Product = require('./schemas/products.js')
// const Style = require('./schemas/styles.js')

mongoose.connect('mongodb://localhost/overview')
const db = mongoose.connection
db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to DB!'))

app.listen(3000, () => console.log('Listening on port 3000'))