import express from "express";
import cors from "cors";
import OpenAI from "openai";

const app = express();
app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.AI_INTEGRATIONS_OPENAI_API_KEY,
  baseURL: process.env.AI_INTEGRATIONS_OPENAI_BASE_URL,
});

const SYSTEM_PROMPT = `You are KwikM AI, a friendly and knowledgeable solar energy assistant for KwikM Solar (Kwizar Infotech Pvt. Ltd.).

Your role:
- Help customers understand solar energy benefits, costs, and savings
- Provide information about PM Surya Ghar Muft Bijli Yojana government subsidies
- Explain subsidy amounts: Up to ₹1,08,000 for UP & Chhattisgarh, ₹78,000 for other states
- Guide customers on solar panel sizing based on their electricity bills
- Explain EMI and financing options
- Share information about KwikM Solar's services, warranty (25 years), and after-sales support

Company details:
- Company: KwikM Solar (Kwizar Infotech Pvt. Ltd.)
- Corporate Office: Mira Road, Mumbai
- Registered Office: Near Geeta Vatika, Jangal Matadin, Gorakhpur
- Contact: info@kwikm.in | www.kwikm.in | +91 70808 53434
- Services: Residential & Commercial solar installations, government subsidy assistance, financing

Guidelines:
- Be helpful, concise, and professional
- Use Indian Rupee (₹) for all pricing
- Recommend customers use the Subsidy Calculator or Customized Calculator on the website for detailed quotes
- If unsure about specific pricing, suggest contacting KwikM Solar directly
- Keep responses brief and focused (2-3 paragraphs max)`;

const conversationHistory: Map<string, Array<{role: string, content: string}>> = new Map();

app.post("/api/chat", async (req, res) => {
  try {
    const { message, sessionId } = req.body;

    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const sid = sessionId || "default";
    if (!conversationHistory.has(sid)) {
      conversationHistory.set(sid, []);
    }
    const history = conversationHistory.get(sid)!;
    history.push({ role: "user", content: message });

    if (history.length > 20) {
      history.splice(0, history.length - 20);
    }

    res.setHeader("Content-Type", "text/event-stream");
    res.setHeader("Cache-Control", "no-cache");
    res.setHeader("Connection", "keep-alive");

    const stream = await openai.chat.completions.create({
      model: "gpt-5-nano",
      messages: [
        { role: "system", content: SYSTEM_PROMPT },
        ...history.map(m => ({ role: m.role as "user" | "assistant", content: m.content })),
      ],
      stream: true,
      max_completion_tokens: 8192,
    });

    let fullResponse = "";

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content || "";
      if (content) {
        fullResponse += content;
        res.write(`data: ${JSON.stringify({ content })}\n\n`);
      }
    }

    history.push({ role: "assistant", content: fullResponse });

    res.write(`data: ${JSON.stringify({ done: true })}\n\n`);
    res.end();
  } catch (error) {
    console.error("Chat error:", error);
    if (res.headersSent) {
      res.write(`data: ${JSON.stringify({ error: "Failed to get response" })}\n\n`);
      res.end();
    } else {
      res.status(500).json({ error: "Failed to process chat message" });
    }
  }
});

app.post("/api/leads/chat-lead", async (req, res) => {
  try {
    console.log("Chat lead received:", req.body);
    res.status(201).json({ success: true, id: Date.now() });
  } catch (error) {
    console.error("Lead error:", error);
    res.status(500).json({ error: "Failed to create lead" });
  }
});

app.post("/api/conversations", async (req, res) => {
  try {
    const id = Date.now();
    res.status(201).json({ id });
  } catch (error) {
    res.status(500).json({ error: "Failed to create conversation" });
  }
});

const PORT = 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`Server running on port ${PORT}`);
});
