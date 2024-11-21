const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/route')
const cookieParser = require('cookie-parser')
require('dotenv').config()

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection

mongoose.connect(process.env.DB_URI)
  .then((result) => app.listen(3000), console.log('listening'))
  .catch((err) => console.log(err));

// routes
app.get('/', (req, res) => res.render('home'));
app.get('/smoothies', (req, res) => res.render('smoothies'));
app.use(authRoutes)

app.get('/set-cake', (req, res) => {
  res.redirect(301, '/set-cookies')
})

app.get('/set-cookies', (req, res) => {
  //res.setHeader('Set-Cookie', 'username=john')
  res.cookie('isEmployee', 'false', { httpOnly: true})

  res.send('Cookie Domain')
})

app.get('/create-cookie', (req, res) => {
  req.cookie()
})