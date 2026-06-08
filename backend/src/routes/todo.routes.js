const express = require('express')
const router = express.Router()
const { getTodos, createTodo, updateTodo, deleteTodo } = require('../controllers/todo.controller')
const authMiddleware = require('../middleware/auth.middleware')
const { createTodoValidator, updateTodoValidator } = require('../validators/todo.validator')

router.use(authMiddleware)

router.get('/', getTodos)
router.post('/', createTodoValidator, createTodo)
router.put('/:id', updateTodoValidator, updateTodo)
router.delete('/:id', deleteTodo)

module.exports = router
