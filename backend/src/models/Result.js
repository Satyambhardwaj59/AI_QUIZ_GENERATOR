import mongoose from "mongoose";

const perQuestionStatusSchema = new mongoose.Schema(
  {
    questionIndex: { type: Number, required: true },
    isCorrect: { type: Boolean, required: true },
    selectedAnswer: { type: String },
    correctAnswer: { type: String, required: true },
    timeTakenSeconds: { type: Number, required: true },
  },
  { _id: false }
);

const resultSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true },
    quizId: { type: mongoose.Schema.Types.ObjectId, ref: "Quiz", required: true },
    score: { type: Number, required: true },
    coinsEarned: { type: Number, required: true },
    perQuestionStatus: { type: [perQuestionStatusSchema], required: true },
  },
  { timestamps: true }
);

const Result = mongoose.model("Result", resultSchema);

export default Result;


