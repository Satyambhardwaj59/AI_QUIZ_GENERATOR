import fs from "fs";
import path from "path";
import pdfParse from "pdf-parse";
import mammoth from "mammoth";
import Tesseract from "tesseract.js";
import { YoutubeTranscript } from "youtube-transcript";
import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function extractFromFile(file) {
  const ext = path.extname(file.originalname).toLowerCase();

  if (ext === ".pdf") {
    const dataBuffer = fs.readFileSync(file.path);
    const data = await pdfParse(dataBuffer);
    return data.text;
  }

  if (ext === ".docx") {
    const data = await mammoth.extractRawText({ path: file.path });
    return data.value;
  }

  if ([".png", ".jpg", ".jpeg"].includes(ext)) {
    const result = await Tesseract.recognize(file.path, "eng");
    return result.data.text;
  }

  // Fallback: treat as plain text file
  const data = fs.readFileSync(file.path, "utf8");
  return data;
}

export async function extractFromYoutube(url) {
  const videoIdMatch = url.match(/(?:v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
  const videoId = videoIdMatch ? videoIdMatch[1] : null;
  if (!videoId) {
    throw new Error("Invalid YouTube URL");
  }
  const transcript = await YoutubeTranscript.fetchTranscript(videoId);
  return transcript.map((t) => t.text).join(" ");
}

export async function generateQuizWithAI({ text, difficulty, numQuestions, allowImages }) {
  const clampedNum = Math.max(1, Math.min(20, Number(numQuestions) || 5));
  const trimmedText = text.slice(0, 6000);

  const systemPrompt = `
You are an AI that generates multiple-choice quiz questions.
You MUST return ONLY valid JSON in the following structure (no markdown, no comments):
{
  "questions": [
    {
      "question": "string",
      "image": "string or null",
      "options": [
        { "text": "string", "image": "string or null" },
        { "text": "string", "image": "string or null" },
        { "text": "string", "image": "string or null" },
        { "text": "string", "image": "string or null" }
      ],
      "correctAnswer": "option text, must exactly match one of the option.text values"
    }
  ]
}
Difficulty: ${difficulty}.
Images are optional; if unsure, set image fields to null or empty string.
`;

  const userPrompt = `
Source content:
${trimmedText}

Generate exactly ${clampedNum} multiple-choice questions from the above content.
Each with exactly 4 options and exactly one correct answer.
Allow image-based questions or options if it makes sense (set image to a short description or URL placeholder).
Return pure JSON, no markdown, no comments, matching the JSON schema described.
`;

  let response;
  try {
    response = await openai.chat.completions.create({
      model: process.env.OPENAI_MODEL || "gpt-4.1-mini",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: userPrompt },
      ],
      temperature: 0.3,
      response_format: { type: "json_object" },
    });
  } catch (err) {
    // Surface quota / rate-limit errors in a friendlier way to the route handler
    if (err?.status === 429 || err?.code === "insufficient_quota") {
      const wrapped = new Error("AI_QUOTA_EXCEEDED");
      wrapped.status = 429;
      wrapped.originalMessage =
        err?.error?.message || err?.message || "AI provider quota exceeded";
      throw wrapped;
    }
    throw err;
  }

  const content = response.choices[0]?.message?.content || "{}";

  let parsed = {};
  try {
    parsed = JSON.parse(content);
  } catch (e) {
    console.error("Failed to parse AI JSON:", e);
    parsed = {};
  }

  let questions = Array.isArray(parsed) ? parsed : parsed.questions;
  if (!Array.isArray(questions)) {
    questions = [];
  }

  return questions.map((q) => ({
    question: q.question || "",
    image: q.image || "",
    options: (q.options || []).slice(0, 4).map((opt) => ({
      text: opt.text || "",
      image: opt.image || "",
    })),
    correctAnswer: q.correctAnswer || (q.options?.[0]?.text || ""),
  }));
}


