const path = require('path');
const fs = require('fs').promises;
const { nanoid } = require("nanoid");
require('colors');

const contactsPath = path.relative(__dirname, __dirname + '/db/contacts.json');
// const contactsPath = './db/contacts.json';

async function listContacts() {
  return fs.readFile(contactsPath)
    .then(JSON.parse)
    .catch(() => console.log('Hmm, something went wrong'.red))
}

async function getContactById(contactId) {
  listContacts().then((data) => {
    const contact = data.find((item) => item.id === contactId);
    console.log(`There is a contact ${contact.name}`.green);
    console.log(contact);
  }).catch(() => console.log('Hmm, contact not found'.red));
}

async function removeContact(contactId) {
  listContacts().then((data) => {
    const deletedName = data.find((item) => item.id === contactId);
    const updatedContactList = data.filter((item) => item.id !== contactId);
    fs.writeFile(contactsPath, JSON.stringify(updatedContactList))
      .then(() => console.log(`Successfully deleted contact "${deletedName.name}"`.green))
  }).catch(() => console.log('Hmm, contact not found'.red));
}

async function addContact(name, email, phone) {
  const newContact = { name, email, phone, id: nanoid() }

  listContacts().then((data) => {
    data.push(newContact);
    fs.writeFile(contactsPath, JSON.stringify(data))
      .then(() => console.log(`"${newContact.name}" successfully added`.green))
  }).catch(() => console.log('Hmm, something went wrong'.red));
}

module.exports = {
  contactsPath,
  listContacts,
  getContactById,
  removeContact,
  addContact
}