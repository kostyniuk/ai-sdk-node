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

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY!,
});

app.get("/", async (c) => {
  const body = {
    prompt: "Explain Database indexes in one paragraph.",
  };
  
  const { prompt, system } = (body ?? {}) as {
    prompt?: string;
    system?: string;
  };

  if (!prompt || typeof prompt !== "string") {
    return c.json({ error: "Missing prompt" }, 400);
  }

  return streamSSE(c, async (stream) => {
    const result = await streamText({
      model: google("gemini-2.5-flash"),
      system:
        system ??
        "You are a concise, helpful assistant. Keep answers brief and clear.",
      prompt,
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