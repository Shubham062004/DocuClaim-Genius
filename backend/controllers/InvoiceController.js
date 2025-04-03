const multer = require('multer')
const { lcProcessInvoice } = require('../utils/LcProcessInvoice')

// Multer setup: store file in memory as Buffer, accept images only
const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith('image/')) {
      return cb(new Error('Only JPEG and PNG images are allowed'), false)
    }
    cb(null, true)
  }
})

const processInvoiceImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' })
    }
    // Process image using LLM
    const processedData = await lcProcessInvoice(req.file)

    res.json({
      message: 'Invoice image processed successfully',
      processedData
    })
  } catch (error) {
    console.error('Error processing invoice image:', error)
    res.status(500).json({ error: 'Error processing invoice image' })
  }
}

module.exports = {
  upload,
  processInvoiceImage
}
