const express = require('express')
const cors = require('cors')
const morgan = require('morgan')

const authRoutes = require('./routes/auth.routes')
const todoRoutes = require('./routes/todo.routes')
const adminRoutes = require('./routes/admin.routes')

const app = express()

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

app.get('/', (req, res) => {
  res.json({ message: 'TaskFlow API is running' })
})

app.use('/api/auth', authRoutes)
app.use('/api/todos', todoRoutes)
app.use('/api/admin', adminRoutes)

app.use((req, res) => {
  res.status(404).json({ message: 'Route not found' })
})

module.exports = app
