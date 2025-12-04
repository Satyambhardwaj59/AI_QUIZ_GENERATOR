import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";

function ReviewQuestionPage() {
  const navigate = useNavigate();
  const { session } = useQuiz();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!session.quizId || !session.questions?.length) {
      navigate("/result");
      return;
    }
    setIsVisible(true);
  }, [session, navigate]);

  if (!session.quizId || !session.questions?.length) {
    return null;
  }

  const questions = session.questions;
  const currentQuestion = questions[currentIndex];
  const status = session.perQuestionStatus[currentIndex];
  const isCorrect = status?.isCorrect;

  const goNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex((i) => i + 1);
    }
  };

  const goPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((i) => i - 1);
    }
  };

  const goToQuestion = (index) => {
    setCurrentIndex(index);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-6 text-center">
        <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
          Review Questions
        </h2>
        <p className="text-slate-400 text-sm">
          Review all questions and your answers ({currentIndex + 1} of {questions.length})
        </p>
      </div>

      {/* Question Navigation */}
      <div className="mb-6 flex flex-wrap gap-2 justify-center">
        {questions.map((_, idx) => {
          const qStatus = session.perQuestionStatus[idx];
          return (
            <button
              key={idx}
              onClick={() => goToQuestion(idx)}
              className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-300 hover:scale-110 ${
                idx === currentIndex
                  ? "bg-primary text-white shadow-lg shadow-primary/30 scale-110"
                  : qStatus?.isCorrect
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}
            >
              {idx + 1}
            </button>
          );
        })}
      </div>

      {/* Question Card */}
      <div
        className={`rounded-2xl border bg-gradient-to-br from-slate-900/90 to-slate-900/60 p-6 md:p-8 mb-6 shadow-xl transition-all duration-500 ${
          isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        } ${
          isCorrect ? "border-emerald-500/50 shadow-emerald-500/10" : "border-red-500/50 shadow-red-500/10"
        }`}
      >
        {/* Question Header */}
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <div
              className={`w-12 h-12 rounded-xl flex items-center justify-center font-bold text-lg ${
                isCorrect
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                  : "bg-red-500/20 text-red-300 border border-red-500/30"
              }`}
            >
              {currentIndex + 1}
            </div>
            <div>
              <div className="text-xs text-slate-400 mb-1">Question {currentIndex + 1}</div>
              <div
                className={`text-sm font-semibold ${
                  isCorrect ? "text-emerald-300" : "text-red-300"
                }`}
              >
                {isCorrect ? "Correct Answer" : "Incorrect Answer"}
              </div>
            </div>
          </div>
          {isCorrect ? (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/20 border border-emerald-500/30">
              <svg className="w-5 h-5 text-emerald-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span className="text-sm font-medium text-emerald-300">+4 Coins</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-500/20 border border-red-500/30">
              <svg className="w-5 h-5 text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
              <span className="text-sm font-medium text-red-300">0 Coins</span>
            </div>
          )}
        </div>

        {/* Question Text */}
        <div className="mb-6">
          <h3 className="text-lg md:text-xl font-semibold text-slate-100 mb-4 leading-relaxed">
            {currentQuestion.question}
          </h3>
          {currentQuestion.image && (
            <div className="mt-4 mb-4">
              <img
                src={currentQuestion.image}
                alt="Question visual"
                className="max-h-64 rounded-lg object-contain border border-slate-800 shadow-lg"
              />
            </div>
          )}
        </div>

        {/* Options */}
        <div className="space-y-3 mb-6">
          {currentQuestion.options.map((opt, index) => {
            const isCorrectOption = opt.text === currentQuestion.correctAnswer;
            const isSelectedOption = status?.selectedAnswer === opt.text;

            let optionStyle = "border-slate-700 bg-slate-800/40 text-slate-300";
            if (isCorrectOption) {
              optionStyle = "border-emerald-500 bg-emerald-500/10 text-emerald-200";
            }
            if (isSelectedOption && !isCorrectOption) {
              optionStyle = "border-red-500 bg-red-500/10 text-red-200";
            }

            return (
              <div
                key={opt.text + index}
                className={`rounded-xl border px-4 py-3 transition-all duration-300 ${optionStyle}`}
              >
                <div className="flex items-start gap-3">
                  <div
                    className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 ${
                      isCorrectOption
                        ? "bg-emerald-500 text-white"
                        : isSelectedOption && !isCorrectOption
                        ? "bg-red-500 text-white"
                        : "bg-slate-700 text-slate-400"
                    }`}
                  >
                    {String.fromCharCode(65 + index)}
                  </div>
                  <div className="flex-1">
                    <div className="text-slate-200">{opt.text}</div>
                    {opt.image && (
                      <img
                        src={opt.image}
                        alt="Option visual"
                        className="mt-2 max-h-24 rounded-md border border-slate-800 object-contain"
                      />
                    )}
                  </div>
                  {isCorrectOption && (
                    <svg
                      className="w-5 h-5 text-emerald-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                  )}
                  {isSelectedOption && !isCorrectOption && (
                    <svg
                      className="w-5 h-5 text-red-400 flex-shrink-0"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Answer Summary */}
        <div className="grid md:grid-cols-2 gap-4 pt-4 border-t border-slate-700/50">
          <div className="p-4 rounded-lg bg-slate-800/40">
            <div className="text-xs text-slate-400 mb-1">Your Answer</div>
            <div className={`text-sm font-medium ${isCorrect ? "text-emerald-300" : "text-red-300"}`}>
              {status?.selectedAnswer || "No answer"}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/40">
            <div className="text-xs text-slate-400 mb-1">Correct Answer</div>
            <div className="text-sm font-medium text-emerald-300">{status?.correctAnswer}</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/40">
            <div className="text-xs text-slate-400 mb-1">Time Taken</div>
            <div className="text-sm font-medium text-slate-300">{status?.timeTakenSeconds ?? 0} seconds</div>
          </div>
          <div className="p-4 rounded-lg bg-slate-800/40">
            <div className="text-xs text-slate-400 mb-1">Status</div>
            <div className={`text-sm font-medium ${isCorrect ? "text-emerald-300" : "text-red-300"}`}>
              {isCorrect ? "Correct" : "Incorrect"}
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-between">
        <button
          onClick={goPrev}
          disabled={currentIndex === 0}
          className="px-6 py-3 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-900/60"
        >
          <span className="flex items-center gap-2 justify-center">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </span>
        </button>
        <div className="flex gap-3">
          <PrimaryButton
            onClick={() => navigate("/result")}
            className="bg-slate-800 hover:bg-slate-700 text-slate-100"
          >
            Back to Results
          </PrimaryButton>
          <button
            onClick={goNext}
            disabled={currentIndex === questions.length - 1}
            className="px-6 py-3 rounded-lg border border-slate-700 bg-slate-900/60 text-slate-300 hover:bg-slate-800 hover:border-slate-600 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:bg-slate-900/60"
          >
            <span className="flex items-center gap-2 justify-center">
              Next
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

export default ReviewQuestionPage;

