require('dotenv').config()
const express = require('express')
const Routes = require('./routes/index.js')
const morgan = require('morgan')

const app = express()
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'dev'
const morganFormat = NODE_ENV === 'production' ? 'combined' : 'dev'

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(morgan(morganFormat)) // Logging middleware

// Routes
app.get('/', (req, res) => {
  return res.send("It's working 🙌")
})
app.use('/api', Routes)

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Something went wrong!' })
})

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`)
})
