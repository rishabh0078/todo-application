require('dotenv').config()
const mongoose = require('mongoose')
const app = require('./src/app')

const PORT = process.env.PORT || 5000
const MONGODB_URI = process.env.MONGODB_URI

mongoose
  .connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB')
    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
    process.exit(1)
  })
