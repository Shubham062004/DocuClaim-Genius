const multer = require('multer')
const { lcProcessInvoice } = require('../utils/LcProcessInvoice')
const Constants = require('../utils/Constants.js')
const MongoUtils = require('../utils/MongoUtils.js')
const { ObjectId } = require('mongodb')
// Multer mddleware setup: store file in memory as Buffer, accept images only
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

const uploadInvoiceImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No image uploaded' })
    }
    // Process image using LLM
    const processedData = await lcProcessInvoice(req.file)

    // Store in MongoDB
    const docId = await MongoUtils.insert(
      Constants.MONGO_URI,
      Constants.MONGO_DB_NAME,
      Constants.MONGO_COLLECTION,
      {
        ...processedData,
        uploadedAt: new Date()
      }
    )

    res.json({
      message: 'Invoice image processed and stored successfully',
      docId,
      processedData
    })
  } catch (error) {
    console.error('Error processing invoice image:', error)
    res.status(500).json({ error: 'Error processing invoice image' })
  }
}

const getAllInvoice = async (req, res) => {
  try {
    const documents = await MongoUtils.get(
      Constants.MONGO_URI,
      Constants.MONGO_DB_NAME,
      Constants.MONGO_COLLECTION,
      {},
      { uploadedAt: -1 } // Sort by most recent first
    )
    res.json(documents)
  } catch (error) {
    console.error('Error fetching documents:', error)
    res.status(500).json({ error: 'Error fetching documents' })
  }
}

const getInvoice = async (req, res) => {
  try {
    const { id } = req.params
    const documents = await MongoUtils.get(
      Constants.MONGO_URI,
      Constants.MONGO_DB_NAME,
      Constants.MONGO_COLLECTION,
      { _id: new ObjectId(String(id)) }  // Convert to ObjectId
    )
    
    if (documents.length === 0) {
      return res.status(404).json({ error: 'Invoice not found' })
    }
    
    res.json(documents[0])
  } catch (error) {
    console.error('Error fetching invoice:', error)
    res.status(500).json({ error: 'Error fetching invoice' })
  }
}

const deleteInvoice = async (req, res) => {
  try {
    const { id } = req.params
    await MongoUtils.deleteOne(
      Constants.MONGO_URI,
      Constants.MONGO_DB_NAME,
      Constants.MONGO_COLLECTION,
      { _id: new ObjectId(String(id)) } // Convert to ObjectId
    )
    res.json({ message: 'Document deleted successfully' })
  } catch (error) {
    console.error('Error deleting document:', error)
    res.status(500).json({ error: 'Error deleting document' })
  }
}

module.exports = {
  upload,
  uploadInvoiceImage,
  getAllInvoice,
  deleteInvoice,
  getInvoice
}
