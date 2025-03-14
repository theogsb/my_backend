import express from "express";
import dotenv from "dotenv";
import fetch from "node-fetch";

dotenv.config();

const router = express.Router();

const API_URL = `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-pro:generateContent?key=${process.env.GEMINI_KEY}`;

router.post("/generate-text", async (req, res) => {
  try {
    const prompt = req.body.prompt;

    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        contents: [
          {
            parts: [
              {
                text: prompt,
              },
            ],
          },
        ],
      }),
    });

    const data = await response.json();

    res.status(200).json({
      success: true,
      message: "Resposta gerada com sucesso!",
      text: data.candidates[0].content.parts[0].text,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Erro interno no servidor.",
      error: error.message,
    });
  }
});

export default router;
