const { validationResult } = require('express-validator')
const Todo = require('../models/Todo')

const getTodos = async (req, res) => {
  try {
    const filter = req.user.role === 'admin' ? {} : { user: req.user.id }

    const todos = await Todo.find(filter)
      .populate('user', 'username email')
      .sort({ createdAt: -1 })

    res.json(todos)
  } catch (err) {
    console.error('Get todos error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

const createTodo = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg })
  }

  try {
    const { title, description, dueDate, category } = req.body

    const todo = await Todo.create({
      title,
      description,
      dueDate,
      category,
      user: req.user.id,
    })

    await todo.populate('user', 'username email')

    res.status(201).json(todo)
  } catch (err) {
    console.error('Create todo error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

const updateTodo = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg })
  }

  try {
    const todo = await Todo.findById(req.params.id)

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' })
    }

    const isOwner = todo.user.toString() === req.user.id
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Access denied' })
    }

    const updated = await Todo.findByIdAndUpdate(req.params.id, req.body, { new: true }).populate('user', 'username email')

    res.json(updated)
  } catch (err) {
    console.error('Update todo error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

const deleteTodo = async (req, res) => {
  try {
    const todo = await Todo.findById(req.params.id)

    if (!todo) {
      return res.status(404).json({ message: 'Todo not found' })
    }

    const isOwner = todo.user.toString() === req.user.id
    if (req.user.role !== 'admin' && !isOwner) {
      return res.status(403).json({ message: 'Access denied' })
    }

    await todo.deleteOne()

    res.json({ message: 'Todo deleted successfully' })
  } catch (err) {
    console.error('Delete todo error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getTodos, createTodo, updateTodo, deleteTodo }
