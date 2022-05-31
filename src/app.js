const express = require('express');
const path = require('path');
const { nanoid } = require('nanoid');

const app = express();

const viewsPath = path.join(process.cwd(), 'views');
app.set('views', viewsPath);
app.set('view engine', 'ejs');

app.use(express.urlencoded({ extended: false }));

let contacts = [];

app.get('/', (req, res) => {
  res.render('index', {
    contacts,
  });
});

app.get('/create', (req, res) => {
  res.render('create');
});

app.post('/create', (req, res) => {
  contacts.push({
    ...req.body,
    id: nanoid(),
  });

  res.redirect('/');
});

app.get('/delete/:contactId', (req, res) => {
  const { contactId } = req.params;

  const filteredContacts = contacts.filter((item) => item.id !== contactId);
  contacts = filteredContacts;

  res.redirect('/');
});

app.get('/contact/:contactId', (req, res) => {
  res.render('details', { contact: contacts.find((item) => item.id === req.params.contactId) })
})

module.exports = app;
