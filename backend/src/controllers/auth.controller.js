const jwt = require('jsonwebtoken')
const { validationResult } = require('express-validator')
const User = require('../models/User')

const register = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg })
  }

  const { email, username, password, role } = req.body

  try {
    const existingUser = await User.findOne({ $or: [{ email }, { username }] })
    if (existingUser) {
      const field = existingUser.email === email ? 'Email' : 'Username'
      return res.status(400).json({ message: `${field} is already taken` })
    }

    const user = await User.create({ email, username, password, role })

    res.status(201).json({ message: 'Account created successfully. Please sign in.' })
  } catch (err) {
    console.error('Register error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

const login = async (req, res) => {
  const errors = validationResult(req)
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array()[0].msg })
  }

  const { identifier, password } = req.body

  try {
    const user = await User.findOne({
      $or: [{ email: identifier.toLowerCase() }, { username: identifier }],
    })

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' })
    }

    const token = jwt.sign(
      { id: user._id, username: user.username, email: user.email, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: process.env.JWT_EXPIRES_IN }
    )

    res.json({ token })
  } catch (err) {
    console.error('Login error:', err)
    res.status(500).json({ message: 'Server error' })
  }
}

module.exports = { register, login }
