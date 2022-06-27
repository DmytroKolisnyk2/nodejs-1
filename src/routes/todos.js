const express = require('express');
const {
  getAllTodos,
  createTodo,
  getTodoById,
  updateTodo,
  deleteTodo,
  updateTodoCompleted,
} = require('../db/todos')
const router = express.Router();
const Joi = require('joi');

const schema = Joi.object({
  text: Joi.string().required()
})

const schemaCompleted = Joi.object({
  completed: Joi.boolean().required()
})

router.get('/', async (req, res) => {
  try {
    const todos = await getAllTodos()
    if (!todos) throw new Error('Not found');
    res.status(200).json(todos)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

router.get('/:todoId', async (req, res) => {
  try {
    const todo = await getTodoById(req.params.todoId)
    if (!todo) throw new Error('Not found');
    res.status(200).json(todo)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

router.post('/', async (req, res) => {
  try {
    const validatedBody = schema.validate(req.body);
    if (validatedBody.error) throw new Error(`missing required text field`)
    const newTodo = await createTodo(req.body.text)
    if (!newTodo) throw new Error('Not found');
    res.status(201).json(newTodo)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

router.delete('/:todoId', async (req, res) => {
  try {
    if (!getTodoById(req.params.todoId)) throw new Error('Not found');
    const updatedTodos = await deleteTodo(req.params.todoId)

    res.status(200).json(updatedTodos)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

router.put('/:todoId', async (req, res) => {
  try {
    const validatedBody = schema.validate(req.body);
    if (validatedBody.error) throw new Error(`missing required text field`);

    if (!getTodoById(req.params.todoId)) throw new Error('Not found');
    const updatedTodo = await updateTodo(req.params.todoId, req.body.text)

    res.status(200).json(updatedTodo)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

router.patch('/:todoId/completed', async (req, res) => {
  try {
    const validatedBody = schemaCompleted.validate(req.body);
    if (validatedBody.error) throw new Error(`missing required completed field`);

    if (!getTodoById(req.params.todoId)) throw new Error('Not found');
    const updatedTodo = await updateTodoCompleted(req.params.todoId, req.body.completed)

    res.status(200).json(updatedTodo)
  } catch (error) {
    res.status(404).json({ message: error.message })
  }
})

module.exports = router;