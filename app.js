const db = require('mongoose')
const express = require('express');
const app = express();

const booksRoute = require('./routeHandler/routes/books')
const authRoute = require('./routeHandler/routes/auth')

db.connect("mongodb+srv://cylian91:cannelle@cluster0.ominbpx.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {useNewUrlParser: true, useUnifiedTopology: true })

app.use(express.json())

app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content, Accept, Content-Type, Authorization');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, PATCH, OPTIONS')
  next()
});

app.use('/api/books', booksRoute)
app.use('/api/auth', authRoute)

module.exports = app;