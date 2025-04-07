require('dotenv').config()
const express = require('express')
const Routes = require('./routes/index.js')
const morgan = require('morgan')
const cors = require('cors');
const Constants = require('./utils/Constants.js')

const app = express()
const PORT = process.env.PORT || 3000
const NODE_ENV = process.env.NODE_ENV || 'dev'
const morganFormat = NODE_ENV === 'production' ? 'combined' : 'dev'


// Setup Environment Variables
Constants.MONGO_URI = process.env.MONGO_URI
Constants.MONGO_DB_NAME = process.env.MONGO_DB_NAME
Constants.MONGO_COLLECTION = process.env.MONGO_COLLECTION
Constants.GEMINI_API_KEY = process.env.GEMINI_API_KEY

if(
  !Constants.MONGO_URI ||
  !Constants.MONGO_DB_NAME ||
  !Constants.MONGO_COLLECTION ||
  !Constants.GEMINI_API_KEY
) {
  console.error('Missing required environment variables.')
  process.exit(1)
} 

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ extended: true, limit: '10mb' }))
app.use(morgan(morganFormat)) // Logging middleware
app.use(cors("*")) // Enable CORS for all origins

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
