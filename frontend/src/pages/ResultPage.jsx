import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import client from "../api/client.js";
import PrimaryButton from "../components/PrimaryButton.jsx";

function ensureUserId() {
  let id = localStorage.getItem("ai_quiz_user_id");
  if (!id) {
    id = `user_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("ai_quiz_user_id", id);
  }
  return id;
}

function ResultPage() {
  const navigate = useNavigate();
  const { session } = useQuiz();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!session.quizId || !session.questions.length) {
      navigate("/");
      return;
    }

    const userId = ensureUserId();

    async function save() {
      try {
        await client.post("/save-result", {
          userId,
          quizId: session.quizId,
          score: session.score,
          coinsEarned: session.coins,
          perQuestionStatus: session.perQuestionStatus,
        });
        setSaved(true);
      } catch (err) {
        console.error(err);
      }
    }
    save();
  }, [session, navigate]);

  if (!session.quizId || !session.questions.length) {
    return null;
  }

  const total = session.questions.length;
  const percent = total > 0 ? Math.round((session.score / total) * 100) : 0;

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-2">Quiz Results</h2>
      <p className="text-slate-400 text-sm mb-6">
        You answered {session.score} out of {total} questions correctly.
      </p>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs text-slate-400 mb-1">Score</div>
          <div className="text-2xl font-semibold">{session.score}</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs text-slate-400 mb-1">Accuracy</div>
          <div className="text-2xl font-semibold">{percent}%</div>
        </div>
        <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
          <div className="text-xs text-slate-400 mb-1">Coins earned</div>
          <div className="text-2xl font-semibold text-yellow-400">{session.coins}</div>
        </div>
      </div>

      <div className="mb-4 text-xs text-emerald-400">{saved ? "Result saved to history." : "Saving result..."}</div>

      <div className="space-y-3 mb-8">
        {session.questions.map((q, idx) => {
          const status = session.perQuestionStatus[idx];
          const isCorrect = status?.isCorrect;

          return (
            <div
              key={idx}
              className={`rounded-lg border p-3 text-sm ${
                isCorrect
                  ? "border-emerald-500/60 bg-emerald-500/5"
                  : "border-red-500/60 bg-red-500/5"
              }`}
            >
              <div className="flex justify-between items-start mb-1">
                <div className="text-slate-100">
                  Q{idx + 1}. {q.question}
                </div>
                <div className={`text-xs font-medium ${isCorrect ? "text-emerald-300" : "text-red-300"}`}>
                  {isCorrect ? "+4 coins" : "0 coins"}
                </div>
              </div>
              <div className="text-xs text-slate-400 mb-1">
                Your answer:{" "}
                <span className={isCorrect ? "text-emerald-300" : "text-red-300"}>
                  {status?.selectedAnswer || "No answer"}
                </span>
                {" · "}
                Correct: <span className="text-emerald-300">{status?.correctAnswer}</span>
              </div>
              <div className="text-[11px] text-slate-500">
                Time: {status?.timeTakenSeconds ?? 0}s
              </div>
            </div>
          );
        })}
      </div>

      <div className="flex gap-3">
        <PrimaryButton onClick={() => navigate("/")}>Create New Quiz</PrimaryButton>
        <PrimaryButton
          className="bg-slate-800 hover:bg-slate-700 text-slate-100"
          onClick={() => navigate("/history")}
        >
          View History
        </PrimaryButton>
      </div>
    </div>
  );
}

export default ResultPage;


