const express = require('express');
const cors = require('cors');
const Routes = require('./routes/index.js');
const morgan = require('morgan');
require('dotenv').config(); // Load environment variables

const app = express();
const PORT = process.env.PORT || 3000;
const NODE_ENV = process.env.NODE_ENV || 'dev';
const morganFormat = NODE_ENV === 'production' ? 'combined' : 'dev';

// Middleware for parsing JSON and URL-encoded bodies
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));
app.use(morgan(morganFormat));

// Enable CORS
app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));

// Routes
app.get('/', (req, res) => {
  return res.send("It's working 🙌");
});
app.use('/api', Routes);

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('Error:', err.message);

  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ error: 'File size exceeds the allowed limit' });
  }

  res.status(500).json({ error: err.message || 'Something went wrong!' });
});

app.listen(PORT, () => {
  console.log(`🚀 Server is running on port ${PORT}`);
});
