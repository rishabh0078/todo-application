const User = require('../models/User')
const Todo = require('../models/Todo')

const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select('-password').sort({ createdAt: -1 })
    res.json(users)
  } catch (err) {
    console.error('Get users error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

const updateUserRole = async (req, res) => {
  try {
    const { role } = req.body

    if (!['user', 'admin'].includes(role)) {
      return res.status(400).json({ message: 'Role must be either user or admin' })
    }

    const user = await User.findByIdAndUpdate(
      req.params.id,
      { role },
      { new: true }
    ).select('-password')

    if (!user) {
      return res.status(404).json({ message: 'User not found' })
    }

    res.json(user)
  } catch (err) {
    console.error('Update role error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

const getAllTodos = async (req, res) => {
  try {
    const todos = await Todo.find()
      .populate('user', 'username email')
      .sort({ createdAt: -1 })

    res.json(todos)
  } catch (err) {
    console.error('Admin get todos error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { getAllUsers, updateUserRole, getAllTodos }
