const express = require('express');
const { upload, uploadInvoiceImage, getAllInvoice, deleteInvoice, getInvoice } = require('../controllers/InvoiceController');
const router = express.Router();

// GET endpoint to fetch all documents
router.get('/doc', getAllInvoice);

// GET endpoint to fetch a specific invoice
router.get('/doc/:id', getInvoice);

// POST endpoint for image upload (JPEG/PNG only)
router.post('/doc/upload', upload.single('image'), uploadInvoiceImage);

// DELETE endpoint to delete a specific document
router.delete('/doc/delete/:id', deleteInvoice);

module.exports = router;
