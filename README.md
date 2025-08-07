# HTML Template Generator

https://ai-sdk-node.vercel.app/

A specialized web application that generates HTML templates using AI. Built with Hono, TypeScript, and Google's Gemini AI model. The application is designed to create HTML templates with 5 predefined variables: order_id, customer_id, quantity, order_date, and price.

## Features

- 🎨 Modern, responsive UI with beautiful gradient design
- 🤖 AI-powered HTML template generation using Google Gemini
- 📡 Real-time streaming responses
- 💻 HTML template generation with 5 predefined variables
- 📧 Specialized for email templates, invoices, receipts, and notifications
- ⚡ Fast and lightweight server built with Hono

## Setup

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Set up environment variables:**
   Create a `.env` file in the root directory:
   ```env
   GOOGLE_GENERATIVE_AI_API_KEY=your_google_ai_api_key_here
   PORT=3005
   ```

3. **Get a Google AI API Key:**
   - Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
   - Create a new API key
   - Add it to your `.env` file

## Running the Application

**Development mode:**
```bash
npm run dev
```

**Production mode:**
```bash
npm run build
npm start
```

The application will be available at `http://localhost:3005`

## Usage

1. Open your browser and navigate to `http://localhost:3005`
2. View the available variables: `{{order_id}}`, `{{customer_id}}`, `{{quantity}}`, `{{order_date}}`, `{{price}}`
3. Enter a description of the HTML template you want to create
4. Click "Generate HTML Template" to start the AI generation
5. Watch as the AI streams the HTML response in real-time
6. Copy the generated HTML template for your use

## Available Variables

The application uses 5 predefined variables that will be automatically included in your HTML templates:

- `{{order_id}}` - The order identifier
- `{{customer_id}}` - The customer identifier  
- `{{quantity}}` - The quantity of items
- `{{order_date}}` - The date when the order was placed
- `{{price}}` - The total price of the order

## Example Prompts

- "Create an order confirmation email template"
- "Generate an invoice HTML template"
- "Create a shipping notification email"
- "Generate a receipt template"
- "Create a customer order summary page"
- "Generate an order tracking email template"

## API Endpoints

- `GET /` - Serves the main HTML interface
- `POST /api/generate` - Generates HTML templates based on prompts

### API Request Format
```json
{
  "prompt": "Your prompt here",
  "system": "Optional system message"
}
```

## Technologies Used

- **Backend:** Hono, TypeScript, Node.js
- **AI:** Google Gemini 2.5 Flash via AI SDK
- **Frontend:** Vanilla HTML, CSS, JavaScript
- **Streaming:** Server-Sent Events (SSE)
- **Template Variables:** Handlebars-style syntax ({{variable_name}})

## Project Structure

```
ai-sdk-node/
├── src/
│   └── server.ts          # Backend server logic
├── public/
│   └── index.html         # Frontend HTML interface
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
└── README.md             # This file
```

## Development

The application uses:
- **tsx** for TypeScript execution in development
- **Hono** for the web framework
- **AI SDK** for Google Gemini integration
- **CORS** enabled for cross-origin requests

## License

ISC 
