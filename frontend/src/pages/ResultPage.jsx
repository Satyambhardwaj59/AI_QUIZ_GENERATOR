import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import { useAuth } from "../context/AuthContext.jsx";
import client from "../api/client.js";
import PrimaryButton from "../components/PrimaryButton.jsx";

function ensureUserId(user) {
  if (user?.id) {
    return user.id;
  }
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
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (!session.quizId || !session.questions.length) {
      navigate("/");
      return;
    }

    const userId = ensureUserId(user);

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
  }, [session, navigate, user]);

  if (!session.quizId || !session.questions.length) {
    return null;
  }

  const total = session.questions.length;
  const percent = total > 0 ? Math.round((session.score / total) * 100) : 0;
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setTimeout(() => setIsVisible(true), 100);
  }, []);

  const getPerformanceMessage = () => {
    if (percent >= 90) return { text: "Outstanding!", emoji: "🎉", color: "text-emerald-400" };
    if (percent >= 70) return { text: "Great Job!", emoji: "👏", color: "text-emerald-300" };
    if (percent >= 50) return { text: "Good Effort!", emoji: "👍", color: "text-yellow-400" };
    return { text: "Keep Practicing!", emoji: "💪", color: "text-primary" };
  };

  const performance = getPerformanceMessage();

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header with Animation */}
      <div className={`text-center mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-gradient-to-br from-primary to-emerald-400 mb-4 shadow-lg shadow-primary/30 animate-scale-in">
          <span className="text-4xl">{performance.emoji}</span>
        </div>
        <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
          Quiz Results
        </h2>
        <p className={`text-lg font-semibold ${performance.color} mb-2`}>{performance.text}</p>
        <p className="text-slate-400 text-sm">
          You answered {session.score} out of {total} questions correctly.
        </p>
      </div>

      {/* Stats Cards */}
      <div className={`grid md:grid-cols-3 gap-4 mb-8 transition-all duration-700 delay-100 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-900/60 p-6 shadow-xl hover:scale-105 transition-transform duration-300">
          <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Score
          </div>
          <div className="text-4xl font-bold text-slate-100">{session.score}</div>
          <div className="text-xs text-slate-500 mt-1">out of {total}</div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-900/60 p-6 shadow-xl hover:scale-105 transition-transform duration-300">
          <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Accuracy
          </div>
          <div className="text-4xl font-bold text-emerald-400">{percent}%</div>
          <div className="w-full bg-slate-800 rounded-full h-2 mt-2">
            <div
              className="bg-gradient-to-r from-emerald-400 to-emerald-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${percent}%` }}
            />
          </div>
        </div>
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-900/60 p-6 shadow-xl hover:scale-105 transition-transform duration-300">
          <div className="text-xs text-slate-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Coins Earned
          </div>
          <div className="text-4xl font-bold text-yellow-400">{session.coins}</div>
          <div className="text-xs text-slate-500 mt-1">+{session.coins} total</div>
        </div>
      </div>

      {/* Save Status */}
      <div className={`mb-6 transition-all duration-500 delay-200 ${isVisible ? "opacity-100" : "opacity-0"}`}>
        <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-lg ${
          saved ? "bg-emerald-500/20 border border-emerald-500/30 text-emerald-300" : "bg-slate-800/40 border border-slate-700 text-slate-400"
        }`}>
          {saved ? (
            <>
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm">Result saved to history</span>
            </>
          ) : (
            <>
              <div className="w-4 h-4 border-2 border-slate-400 border-t-transparent rounded-full animate-spin" />
              <span className="text-sm">Saving result...</span>
            </>
          )}
        </div>
      </div>

      {/* Questions Summary */}
      <div className={`space-y-3 mb-8 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
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

      {/* Action Buttons */}
      <div className={`flex flex-col sm:flex-row gap-3 transition-all duration-700 delay-400 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <PrimaryButton onClick={() => navigate("/")} className="flex-1">
          Create New Quiz
        </PrimaryButton>
        <PrimaryButton
          className="bg-slate-800 hover:bg-slate-700 text-slate-100 flex-1"
          onClick={() => navigate("/review")}
        >
          Review Questions
        </PrimaryButton>
        <PrimaryButton
          className="bg-slate-800 hover:bg-slate-700 text-slate-100 flex-1"
          onClick={() => navigate("/history")}
        >
          View History
        </PrimaryButton>
      </div>
    </div>
  );
}

export default ResultPage;


