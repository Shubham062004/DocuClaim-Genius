const express = require('express');
const { upload, processInvoiceImage } = require('../controllers/InvoiceController');
const router = express.Router();

// POST endpoint for image upload (JPEG/PNG only)
router.post('/doc/upload', upload.single('image'), processInvoiceImage);

module.exports = router;
