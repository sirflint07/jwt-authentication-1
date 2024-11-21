const express = require('express');
const mongoose = require('mongoose');
const authRoutes = require('./routes/route')
const cookieParser = require('cookie-parser')

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json())
app.use(cookieParser())

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb+srv://fajobimichael123:Oluwaseun2001@smoothie-users.xvsh3.mongodb.net/?retryWrites=true&w=majority&appName=smoothie-users'
mongoose.connect(dbURI)
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