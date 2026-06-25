const express = require("express");

const cors = require("cors");

require("dotenv").config();

const { GoogleGenerativeAI } = require("@google/generative-ai");

// rate limiter for stopping API abuse
const rateLimit = require("express-rate-limit");
const app = express();
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.use(cors());

app.use(express.json());

// set up rate limiting: max 20 requests per 15 minutes, per IP address
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes, in milliseconds
  max: 20, // limit each IP to 20 requests per window
  message: { error: "Too many requests, please try again later." },
});

app.use(limiter);

// route check to confirm the server is alive
app.get("/", (req, res) => {
  res.send("EmoTracker backend is running");
});

app.post("/api/insight", async (req, res) => {
  try {
    const { emotion, journalText } = req.body;

    if (!emotion || !journalText) {
      return res.status(400).json({ error: "Missing emotion or journalText" });
    }

    const model = genAI.getGenerativeModel({ model: "gemini-2.5-flash" });

    // build prompt
    const prompt = `
You are a supportive journaling companion inside a mood tracking app.

The user selected this emotion: ${emotion}

Their journal entry for today:
"${journalText}"

Based on BOTH the emotion and what they wrote, respond with:
1. encouragement — a short, warm, specific message (1-2 sentences) that responds to what they actually wrote, not generic praise.
2. reflection — one sentence offering a thoughtful observation about their entry.
3. suggestion — one small, realistic action they could take tomorrow related to what they wrote.

Keep the tone natural and human, not robotic or overly cheerful.
Keep each field under 40 words.

Respond ONLY with valid JSON in exactly this format, with no extra text before or after:
{
  "encouragement": "...",
  "reflection": "...",
  "suggestion": "..."
}
`;

    const result = await model.generateContent(prompt);
    const rawText = result.response.text();
    // strip any markdown code fences, same safety net as before
    const cleanedText = rawText.replace(/```json|```/g, "").trim();

    // parse the cleaned text into a real JS object
    const parsed = JSON.parse(cleanedText);

    // send the clean object back to the frontend
    res.json(parsed);
  } 
  // catch (error) {
  //   console.error("Error generating AI insight:", error);

  //   //send a generic error back to the frontend — no internal details leaked
  //   res.status(500).json({ error: "Failed to generate AI insight" });
  // }

  catch (error) {
  console.error(error);

  res.status(500).json({
    error: error.message,
  });
}
});

const PORT = process.env.PORT || 5000;

// start listening for requests
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
