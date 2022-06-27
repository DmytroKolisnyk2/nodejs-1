const express = require('express')
const { listContacts, getContactById, removeContact, addContact, updateContact } = require('../../models/contacts')
const Joi = require('joi');

const schema = Joi.object({
  name: Joi.required(),
  email: Joi.required(),
  phone: Joi.required()
})

const router = express.Router()

router.get('/', async (req, res) => {
  try {
    const contacts = await listContacts();
    if (!contacts) throw new Error();
    res.status(200).json(contacts)
  } catch (err) {
    res.status(404).json({ "message": "Contacts not found" })
  }
})

router.get('/:contactId', async (req, res) => {
  try {
    const contact = await getContactById(req.params.contactId);
    if (!contact) throw new Error();
    res.status(200).json(contact)
  } catch (err) {
    res.status(404).json({ "message": "Not found" })
  }
})

router.delete('/:contactId', async (req, res) => {
  try {
    const deletedContact = await getContactById(req.params.contactId);
    if (!deletedContact) throw new Error();
    removeContact(req.params.contactId);
    res.status(200).json({ "message": "contact deleted" })
  } catch (err) {
    res.status(404).json({ "message": "Not found" })
  }
})

router.post('/', async (req, res) => {
  try {
    const validatedBody = schema.validate(req.body);
    if (validatedBody.error) throw new Error(`missing required ${validatedBody.error.details[0].path[0]} field`)
    const newContact = await addContact(req.body);
    res.status(201).json(newContact);
  } catch (err) {
    res.status(404).json({ "message": err.message })
  }
})


router.put('/:contactId', async (req, res) => {
  try {
    const validatedBody = schema.validate(req.body);
    if (validatedBody.error) throw new Error(`missing fields`);

    const shouldUpdateContact = await getContactById(req.params.contactId);
    if (!shouldUpdateContact) throw new Error('Not found');

    const newContact = await updateContact(req.params.contactId, req.body);
    res.status(200).json(newContact);
  } catch (err) {
    res.status(404).json({ "message": err.message })
  }
})

module.exports = router
