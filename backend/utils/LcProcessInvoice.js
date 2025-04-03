const { HumanMessage } = require('@langchain/core/messages')
const { ChatGoogleGenerativeAI } = require('@langchain/google-genai')
const { z } = require('zod')

// Function to convert image file buffer to Base64 Data URL format
function fileToGenerativePart(imageFile) {
  return `data:${imageFile.mimetype};base64,${imageFile.buffer.toString(
    'base64'
  )}`
}

async function lcProcessInvoice(image) {
  console.log('Processing invoice images')

  // Define the schema for invoice data extraction
  const InvoiceSchema = z.object({
    is_mock_data: z
      .boolean()
      .describe(
        'Whether the data is mock data or not. Mark it yes only if the image is not provided by the user'
      ),
    invoice_id: z
      .number()
      .describe(
        'The invoice number or ID. Provide the ID/number as it is, i.e. if it is - 0078 then return 0078 not 78'
      ),
    items: z.array(
      z.object({
        item_description: z
          .string()
          .describe('Description of the medical item or service'),
        quantity: z.number().describe('Quantity of the item'),
        unit_price: z.number().describe('Price per unit'),
        total: z.number().describe('Total price for this line item')
      })
    )
  })

  // Initialize the ChatGoogleGenerativeAI model
  const model = new ChatGoogleGenerativeAI({
    model: 'gemini-1.5-pro',
    temperature: 0,
    apiKey: process.env.GOOGLE_API_KEY // Use env variable for security
  })

  // Create the structured output chain
  const invoiceExtractor = model.withStructuredOutput(InvoiceSchema)

  try {
    // Convert image file to Base64 Data URL format
    const imagePart = fileToGenerativePart(image)

    // Construct prompt
    const prompt = `Extract the following information from this medical invoice image:
    - Invoice number (as a number)
    - Is Mock Data (as a boolean - true/false)
    - For each line item:
      - Item description
      - Quantity
      - Unit price
      - Total price
    
    The invoice image is attached. Please extract and format the information according to the schema.
    `

    // Create message with both text and image
    const message = new HumanMessage({
      content: [
        { type: 'text', text: prompt },
        { type: 'image_url', image_url: { url: imagePart } }
      ]
    })

    const result = await invoiceExtractor.invoke([message])

    return result
  } catch (error) {
    console.error('Error processing invoice:', error)
    throw error
  }
}

module.exports = {
  lcProcessInvoice
}
