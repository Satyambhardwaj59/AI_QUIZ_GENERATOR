import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";

function QuizDetailPage() {
  const navigate = useNavigate();
  const { session, settings } = useQuiz();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!session.quizId || !session.questions?.length) {
      navigate("/");
      return;
    }
    setIsVisible(true);
  }, [session, navigate]);

  if (!session.quizId || !session.questions?.length) {
    return null;
  }

  const totalQuestions = session.questions.length;
  const estimatedTime = totalQuestions * 1; // 1 minute per question

  const handleStart = () => {
    navigate("/countdown");
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8">
      <div
        className={`max-w-2xl w-full space-y-6 transition-all duration-700 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-8"
        }`}
      >
        {/* Header Card */}
        <div className="text-center space-y-3 animate-fade-in">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-gradient-to-br from-primary to-emerald-400 mb-4 shadow-lg shadow-primary/30 animate-scale-in">
            <svg
              className="w-10 h-10 text-white"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
              />
            </svg>
          </div>
          <h1 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
            Quiz Ready!
          </h1>
          <p className="text-slate-400 text-sm md:text-base">
            Get ready to test your knowledge. Read the details below before starting.
          </p>
        </div>

        {/* Details Card */}
        <div className="rounded-2xl border border-slate-800 bg-gradient-to-br from-slate-900/90 to-slate-900/60 p-6 md:p-8 shadow-xl shadow-black/40 backdrop-blur-sm space-y-6 animate-slide-up">
          <div className="grid md:grid-cols-2 gap-4">
            {/* Total Questions */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-primary/30 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 rounded-lg bg-primary/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Total Questions</div>
                <div className="text-2xl font-bold text-slate-100">{totalQuestions}</div>
              </div>
            </div>

            {/* Difficulty */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-emerald-400/30 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 rounded-lg bg-emerald-400/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Difficulty</div>
                <div className="text-2xl font-bold text-slate-100 capitalize">{settings.difficulty}</div>
              </div>
            </div>

            {/* Time Limit */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-yellow-400/30 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Time per Question</div>
                <div className="text-2xl font-bold text-slate-100">60s</div>
              </div>
            </div>

            {/* Coins */}
            <div className="flex items-start gap-3 p-4 rounded-xl bg-slate-800/40 border border-slate-700/50 hover:border-yellow-400/30 transition-all duration-300 hover:scale-105">
              <div className="w-10 h-10 rounded-lg bg-yellow-400/20 flex items-center justify-center flex-shrink-0">
                <svg className="w-5 h-5 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <div className="text-xs text-slate-400 mb-1">Coins per Correct</div>
                <div className="text-2xl font-bold text-yellow-400">+4</div>
              </div>
            </div>
          </div>

          {/* Rules Section */}
          <div className="pt-4 border-t border-slate-700/50">
            <h3 className="text-sm font-semibold text-slate-300 mb-3 flex items-center gap-2">
              <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              Rules & Guidelines
            </h3>
            <ul className="space-y-2 text-sm text-slate-400">
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>You have 60 seconds to answer each question</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Earn 4 coins for each correct answer</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Once you select an answer, you cannot change it</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-primary mt-0.5">•</span>
                <span>Questions will automatically advance after 3 seconds</span>
              </li>
            </ul>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-delay">
          <PrimaryButton
            onClick={handleStart}
            className="text-base px-8 py-3 bg-gradient-to-r from-primary to-emerald-400 hover:from-primary/90 hover:to-emerald-400/90 shadow-lg shadow-primary/30 hover:shadow-primary/50 transition-all duration-300 hover:scale-105"
          >
            <span className="flex items-center gap-2">
              Start Quiz
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </span>
          </PrimaryButton>
          <button
            onClick={() => navigate("/")}
            className="px-8 py-3 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 text-base"
          >
            Go Back
          </button>
        </div>
      </div>
    </div>
  );
}

export default QuizDetailPage;

