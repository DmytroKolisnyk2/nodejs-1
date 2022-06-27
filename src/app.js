const express = require('express')
const logger = require('morgan')
const todosRouter = require('./routes/todos')
require('dotenv').config();

const app = express()

app.use(logger("dev"))
app.use(express.json())

app.use('/api/v1/todos', todosRouter)

app.use((req, res) => {
  res.status(404).json({ message: 'Not found' })
})

app.use((err, req, res, next) => {
  res.status(500).json({ message: err.message })
})

module.exports = app