import "dotenv/config";
import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { streamSSE } from "hono/streaming";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { streamText } from "ai";
const app = new Hono();

app.use("*", logger());
app.use(
  "*",
  cors({
    origin: "*",
    allowMethods: ["GET", "POST", "OPTIONS"],
    allowHeaders: ["Content-Type"],
  })
);

// Serve the HTML file at root
app.get("/", async (c) => {
  // Check if we're in development (local) or production (Vercel)
  const isDevelopment = process.env.NODE_ENV !== 'production';
  
  if (isDevelopment) {
    // In development, read and serve the HTML file
    const fs = await import('fs/promises');
    const path = await import('path');
    const { fileURLToPath } = await import('url');
    
    try {
      // Get the directory of the current module
      const __filename = fileURLToPath(import.meta.url);
      const __dirname = path.dirname(__filename);
      
      // Construct absolute path to the HTML file
      const htmlPath = path.join(__dirname, '..', 'public', 'index.html');
      const html = await fs.readFile(htmlPath, 'utf-8');
      return c.html(html);
    } catch (error) {
      console.error('Error reading HTML file:', error);
      return c.text('HTML file not found', 404);
    }
  } else {
    // In production (Vercel), redirect to the static file
    return c.redirect("/index.html");
  }
});

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

// API endpoint for generating HTML templates
app.post("/api/generate", async (c) => {
  const body = await c.req.json();
  
  const { prompt, system } = (body ?? {}) as {
    prompt?: string;
    system?: string;
  };

  if (!prompt || typeof prompt !== "string") {
    return c.json({ error: "Missing prompt" }, 400);
  }

  // Define the available variables for HTML templates
  const templateVariables = {
    order_id: "{{order_id}}",
    customer_id: "{{customer_id}}", 
    quantity: "{{quantity}}",
    order_date: "{{order_date}}",
    price: "{{price}}"
  };

  const systemPrompt = system ?? `You are an expert HTML template generator. Your job is to create HTML templates that use the following 5 variables:

Available Variables:
- {{order_id}} - The order identifier
- {{customer_id}} - The customer identifier  
- {{quantity}} - The quantity of items
- {{order_date}} - The date when the order was placed
- {{price}} - The total price of the order

Instructions:
1. Generate complete, valid HTML markup
2. Use the variables above with the {{variable_name}} syntax
3. Create responsive, modern designs with CSS
4. Include proper styling and layout
5. Make the templates professional and user-friendly
6. Use semantic HTML elements where appropriate
7. Include comments explaining the structure if needed

Example usage: If user asks for an order confirmation email, create HTML that displays order details using {{order_id}}, {{customer_id}}, etc.

Always respond with complete, ready-to-use HTML code.`;

  return streamSSE(c, async (stream) => {
    const result = await streamText({
      model: google("gemini-2.5-flash"),
      system: systemPrompt,
      prompt: `Generate an HTML template for: ${prompt}\n\nUse the available variables: {{order_id}}, {{customer_id}}, {{quantity}}, {{order_date}}, {{price}}`,
    });

    for await (const chunk of result.textStream) {
      await stream.write(`${chunk}`);
    }

    await stream.write(`\n\nFinished`);
  });
});

const port = Number(process.env.PORT ?? 3005);
console.log(`Server listening on http://localhost:${port}`);
serve({ fetch: app.fetch, port });