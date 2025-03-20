const express = require("express");
const router = express.Router();
const fetch = require("node-fetch");
require("dotenv").config();

router.post("/", async (req, res) => {
  try {
    const { message } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const response = await fetch("https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.GOOGLE_AI_API_KEY}`,
      },
      body: JSON.stringify({
        contents: [{ role: "user", parts: [{ text: message }] }],
        generationConfig: { temperature: 0.7, maxOutputTokens: 500 },
      }),
    });

    if (!response.ok) {
      throw new Error("Failed to get AI response");
    }

    const data = await response.json();
    const aiMessage = data?.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, I couldn't process your request.";

    res.json({ message: aiMessage });
  } catch (error) {
    console.error("AI API Error:", error);
    res.status(500).json({ error: "AI service is not responding. Try again later." });
  }
});

module.exports = router;
