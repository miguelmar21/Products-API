const mongoose = require('mongoose')
const dbUrl = process.env.DB_URL || 'mongodb+srv://sdc:Password123@cluster0.y1apv.mongodb.net/overview'
mongoose.connect(dbUrl)
const db = mongoose.connection

db.on('error', (error) => console.error(error))
db.once('open', () => console.log('Connected to DB!'))

module.exports = db;