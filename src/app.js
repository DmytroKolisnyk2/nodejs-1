const express = require('express');
require('dotenv').config();
const volleyball = require('volleyball');
const compression = require('compression');
const path = require('path');
const cookieParser = require('cookie-parser')

const app = express();

app.set('view engine', 'ejs');
app.set('views', path.join(process.cwd(), 'views'));

app.use(express.urlencoded({ extended: false }));
app.use(volleyball);
app.use(compression());
app.use(cookieParser(process.env.COOKIE_SECRET))

app.get('/', (req, res) => {
  res.render('index');
});

app.get('/login', (req, res) => {
  res.render('login');
});

app.get('/profile', (req, res) => {
  res.render('profile', {
    username: req.cookies.username, 
  });
});

app.post('/login', (req, res) => {
  console.log(req);
  res.cookie('username', req.body.username);
  res.redirect('/profile');
});

module.exports = app;
