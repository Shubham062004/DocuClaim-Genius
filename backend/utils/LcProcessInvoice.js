require('dotenv').config();
const { HumanMessage } = require('@langchain/core/messages');
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai');
const { z } = require('zod');

// Function to convert image file buffer to Base64 Data URL format
function fileToGenerativePart(imageFile) {
  return `data:${imageFile.mimetype};base64,${imageFile.buffer.toString('base64')}`;
}

async function lcProcessInvoice(image) {
  console.log('🔍 Processing invoice image...');

  // Define the schema for invoice data extraction
  const InvoiceSchema = z.object({
    is_mock_data: z.boolean().describe('Whether the data is mock data or not.'),
    invoice_id: z.string().describe('Invoice number as a string'),
    items: z.array(
      z.object({
        item_description: z.string().describe('Description of item/service'),
        quantity: z.number().describe('Quantity of the item'),
        unit_price: z.number().describe('Price per unit'),
        total: z.number().describe('Total price for this line item'),
      })
    )
  });

  // Initialize the ChatGoogleGenerativeAI model
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-1.5-pro',
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY || 'your-fallback-api-key'
  });

  // Convert image file to Base64 Data URL format
  const imagePart = fileToGenerativePart(image);

  // Construct structured prompt
  const prompt = `Extract structured data from this medical invoice:
  - Invoice number (keep the exact format)
  - Is Mock Data (true/false)
  - For each line item:
    - Item description
    - Quantity
    - Unit price
    - Total price
  
  The invoice image is attached. Return only valid JSON output.`;

  // Create message with both text and image
  const message = new HumanMessage({
    content: [
      { type: 'text', text: prompt },
      { type: 'image_url', image_url: { url: imagePart } }
    ]
  });

  try {
    // Create structured output chain
    const invoiceExtractor = model.withStructuredOutput(InvoiceSchema);

    const result = await invoiceExtractor.invoke([message]);

    return result;
  } catch (error) {
    console.error('❌ Error processing invoice:', error);
    throw error;
  }
}

module.exports = {
  lcProcessInvoice
};
