const express = require('express')
const router = express.Router()
const { getAllUsers, updateUserRole, getAllTodos } = require('../controllers/admin.controller')
const authMiddleware = require('../middleware/auth.middleware')
const roleMiddleware = require('../middleware/role.middleware')

router.use(authMiddleware, roleMiddleware('admin'))

router.get('/users', getAllUsers)
router.patch('/users/:id/role', updateUserRole)
router.get('/todos', getAllTodos)

module.exports = router
