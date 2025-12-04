import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";

import { extractFromFile, extractFromYoutube, generateQuizWithAI } from "../services/quizService.js";
import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const upload = multer({
  dest: path.join(__dirname, "../../uploads"),
  limits: { fileSize: 10 * 1024 * 1024 },
});

router.post("/upload", upload.single("file"), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: "No file uploaded" });
    }
    const text = await extractFromFile(req.file);
    res.json({ text });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to extract text from file" });
  }
});

router.post("/generate-quiz", async (req, res) => {
  try {
    const { sourceType, text, youtubeUrl, difficulty, numQuestions, allowImages } = req.body;

    let baseText = text || "";
    if (sourceType === "youtube" && youtubeUrl) {
      baseText = await extractFromYoutube(youtubeUrl);
    }

    if (!baseText || baseText.trim().length === 0) {
      return res.status(400).json({ error: "No text available for quiz generation" });
    }

    const questions = await generateQuizWithAI({
      text: baseText,
      difficulty,
      numQuestions,
      allowImages: !!allowImages,
    });

    const quiz = await Quiz.create({
      inputText: baseText.slice(0, 5000),
      difficulty,
      numQuestions,
      aiResponse: questions,
    });

    res.json({ quizId: quiz._id, questions });
  } catch (err) {
    console.error(err);
    if (err?.status === 429 || err?.message === "AI_QUOTA_EXCEEDED") {
      return res
        .status(429)
        .json({
          error:
            "AI provider quota or rate limit exceeded. Please update your API plan/keys or try again later.",
        });
    }
    res.status(500).json({ error: "Failed to generate quiz" });
  }
});

router.post("/save-result", async (req, res) => {
  try {
    const { userId, quizId, score, coinsEarned, perQuestionStatus } = req.body;
    if (!userId || !quizId) {
      return res.status(400).json({ error: "userId and quizId are required" });
    }

    const result = await Result.create({
      userId,
      quizId,
      score,
      coinsEarned,
      perQuestionStatus,
    });

    res.json({ resultId: result._id });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to save result" });
  }
});

router.get("/history/:userId", async (req, res) => {
  try {
    const { userId } = req.params;
    const results = await Result.find({ userId })
      .sort({ createdAt: -1 })
      .populate("quizId")
      .lean();
    res.json({ results });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch history" });
  }
});

export default router;


