import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton.jsx";
import client from "../api/client.js";
import { useAuth } from "../context/AuthContext.jsx";

function LandingPage() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [recentQuizzes, setRecentQuizzes] = useState([]);
  const [loadingQuizzes, setLoadingQuizzes] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalQuizzes, setTotalQuizzes] = useState(0);
  const [selectedQuiz, setSelectedQuiz] = useState(null);
  const itemsPerPage = 6;

  useEffect(() => {
    loadRecentQuizzes();
  }, [currentPage]);

  const loadRecentQuizzes = async () => {
    try {
      setLoadingQuizzes(true);
      const res = await client.get(`/recent-quizzes?page=${currentPage}&limit=${itemsPerPage}`);
      setRecentQuizzes(res.data.quizzes || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalQuizzes(res.data.totalQuizzes || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoadingQuizzes(false);
    }
  };

  const getDifficultyColor = (difficulty) => {
    switch (difficulty) {
      case "easy":
        return "bg-emerald-500/20 text-emerald-300 border-emerald-500/30";
      case "medium":
        return "bg-yellow-500/20 text-yellow-300 border-yellow-500/30";
      case "hard":
        return "bg-red-500/20 text-red-300 border-red-500/30";
      default:
        return "bg-slate-500/20 text-slate-300 border-slate-500/30";
    }
  };

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-white via-slate-50 to-white dark:from-slate-950 dark:via-slate-900 dark:to-slate-950 transition-colors duration-300">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/10 dark:bg-slate-900/70 px-3 py-1 text-[11px] text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI-powered quiz generator · 1 min per question
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4 text-slate-900 dark:text-slate-100">
            Turn any{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              content
            </span>{" "}
            into a gamified quiz in seconds.
          </h1>
          <p className="text-sm md:text-base text-slate-600 dark:text-slate-400 mb-6 max-w-xl">
            Paste text, upload PDFs or slides, or drop in a YouTube link. Our AI creates timed MCQ
            quizzes with instant feedback and coin rewards to keep learners engaged.
          </p>
          <div className="flex flex-wrap items-center justify-around sm:justify-normal sm:gap-5 mb-8">
            <PrimaryButton
              className="px-5 py-2.5 text-sm md:text-base"
              onClick={() => {
                if (!isAuthenticated) {
                  alert("Please login to create a quiz!");
                  return;
                }
                navigate("/create")
              }}
            >
              Get Started
            </PrimaryButton>
            <button
              className="text-xs md:text-sm text-slate-300 hover:text-primary transition-colors"
              onClick={() => {
                const el = document.getElementById("features");
                if (el) el.scrollIntoView({ behavior: "smooth" });
              }}
            >
              Learn how it works →
            </button>
          </div>
          <div className="flex flex-wrap gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div>
              <div className="text-slate-900 dark:text-slate-100 font-semibold">Multi-source</div>
              <div>Text · PDF · DOCX · Images · YouTube</div>
            </div>
            <div>
              <div className="text-slate-900 dark:text-slate-100 font-semibold">Smart scoring</div>
              <div>Timer, coins, and history tracking</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-10 rounded-3xl bg-primary/20 blur-3xl opacity-40" />
          <div className="relative rounded-3xl border border-slate-200 dark:border-slate-800/80 bg-white dark:bg-slate-900/80 shadow-2xl shadow-primary/10 p-5 md:p-6 backdrop-blur">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-xs text-slate-500 dark:text-slate-400">Live session</div>
                <div className="text-sm font-medium text-slate-900 dark:text-slate-100">AI Quiz Demo</div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-yellow-400/10 text-yellow-600 dark:text-yellow-300 px-2 py-0.5 border border-yellow-400/40">
                  Coins: 24
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/70 p-4 mb-3">
              <div className="flex justify-between text-[11px] text-slate-500 dark:text-slate-400 mb-1">
                <span>Question 2 · Medium</span>
                <span>00:45 left</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-200 dark:bg-slate-800 overflow-hidden mb-3">
                <div className="h-full w-2/3 bg-gradient-to-r from-emerald-400 to-primary animate-pulse" />
              </div>
              <p className="text-xs md:text-sm text-slate-900 dark:text-slate-100 mb-3">
                Which statement best describes the role of AI in modern learning experiences?
              </p>
              <div className="space-y-1.5 text-[11px] md:text-xs">
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-3 py-2 text-slate-700 dark:text-slate-300">
                  It replaces teachers entirely in all scenarios.
                </div>
                <div className="rounded-lg border border-emerald-500 bg-emerald-500/10 px-3 py-2 flex justify-between items-center">
                  <span className="text-slate-700 dark:text-emerald-200">It augments learning with personalization and instant feedback.</span>
                  <span className="text-[10px] text-emerald-600 dark:text-emerald-300 font-medium">+4 coins</span>
                </div>
                <div className="rounded-lg border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 px-3 py-2 text-slate-700 dark:text-slate-300">
                  It is only useful for grading exams.
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-500 dark:text-slate-400 mt-2">
              <span>Auto-next in 3s after each answer</span>
              <span>History & analytics included</span>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Quizzes Section */}
      {recentQuizzes.length > 0 && (
        <section className="max-w-6xl mx-auto px-4 py-12">
          <div className="mb-6">
            <h2 className="text-2xl md:text-3xl font-bold mb-2 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Recent Quizzes
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">
              Explore recently created quizzes by the community
            </p>
          </div>
          {loadingQuizzes ? (
            <div className="text-center py-8">
              <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
              <p className="text-slate-500 dark:text-slate-400 text-sm">Loading quizzes...</p>
            </div>
          ) : (
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
              {recentQuizzes.map((quiz) => (
                <div
                  key={quiz._id}
                  className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4 hover:shadow-lg hover:scale-[1.02] transition-all duration-300 cursor-pointer"
                  onClick={() => setSelectedQuiz(quiz)}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex-1">
                      <div className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-1">
                        {quiz.numQuestions} Questions
                      </div>
                      <div className="text-xs text-slate-500 dark:text-slate-400">
                        {new Date(quiz.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-lg text-xs font-medium border capitalize ${getDifficultyColor(
                        quiz.difficulty
                      )}`}
                    >
                      {quiz.difficulty}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs text-slate-600 dark:text-slate-400">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                      />
                    </svg>
                    Created {new Date(quiz.createdAt).toLocaleDateString()}
                  </div>
                  <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700">
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedQuiz(quiz);
                      }}
                      className="text-xs text-primary hover:underline"
                    >
                      View Details →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="mt-6 flex items-center justify-center gap-2">
              <button
                onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Previous
              </button>
              <div className="flex items-center gap-1">
                {[...Array(Math.min(5, totalPages))].map((_, i) => {
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  return (
                    <button
                      key={pageNum}
                      onClick={() => setCurrentPage(pageNum)}
                      className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-300 ${currentPage === pageNum
                          ? "bg-primary text-white shadow-lg shadow-primary/30"
                          : "border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800"
                        }`}
                    >
                      {pageNum}
                    </button>
                  );
                })}
              </div>
              <button
                onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed text-sm"
              >
                Next
              </button>
            </div>
          )}
        </section>
      )}

      <section id="features" className="max-w-6xl mx-auto px-4 pb-14">
        <div className="grid md:grid-cols-3 gap-4 text-xs md:text-sm">
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4">
            <div className="text-slate-900 dark:text-slate-100 font-semibold mb-1">One-question focus</div>
            <p className="text-slate-600 dark:text-slate-400">
              Prevent overwhelm with a single question view, per-question timer, and clean feedback
              highlighting correct and wrong options.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4">
            <div className="text-slate-900 dark:text-slate-100 font-semibold mb-1">Gamified coins</div>
            <p className="text-slate-600 dark:text-slate-400">
              Earn coins for correct answers and see them instantly added to your balance with smooth
              animations.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-4">
            <div className="text-slate-900 dark:text-slate-100 font-semibold mb-1">Replay anytime</div>
            <p className="text-slate-600 dark:text-slate-400">
              All attempts are stored so you can revisit performance, difficulty, and progress over time.
            </p>
          </div>
        </div>
      </section>

      {/* Quiz Detail Modal */}
      {selectedQuiz && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-2xl w-full shadow-xl animate-scale-in max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Quiz Details</h3>
              <button
                onClick={() => setSelectedQuiz(null)}
                className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <svg
                  className="w-5 h-5 text-slate-600 dark:text-slate-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Number of Questions</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">{selectedQuiz.numQuestions}</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Difficulty</div>
                  <div className="text-2xl font-bold text-slate-900 dark:text-slate-100 capitalize">{selectedQuiz.difficulty}</div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Created Date</div>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {new Date(selectedQuiz.createdAt).toLocaleDateString()}
                  </div>
                </div>
                <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
                  <div className="text-xs text-slate-600 dark:text-slate-400 mb-1">Created Time</div>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">
                    {new Date(selectedQuiz.createdAt).toLocaleTimeString()}
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-lg bg-primary/10 border border-primary/30">
                <h4 className="text-sm font-semibold text-primary mb-2">Quiz Information</h4>
                <ul className="text-xs text-slate-700 dark:text-slate-300 space-y-1">
                  <li>• This quiz contains {selectedQuiz.numQuestions} multiple-choice questions</li>
                  <li>• Difficulty level: <span className="capitalize font-medium">{selectedQuiz.difficulty}</span></li>
                  <li>• Each question has a 60-second time limit</li>
                  <li>• Earn 4 coins for each correct answer</li>
                  <li>• Questions will automatically advance after selection</li>
                </ul>
              </div>

              {isAuthenticated ? (
                <div className="flex gap-3">
                  <PrimaryButton
                    onClick={() => {
                      setSelectedQuiz(null);
                      navigate("/create");
                    }}
                    className="flex-1"
                  >
                    Create Similar Quiz
                  </PrimaryButton>
                  <button
                    onClick={() => setSelectedQuiz(null)}
                    className="px-4 py-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
                  >
                    Close
                  </button>
                </div>
              ) : (
                <div className="p-4 rounded-lg bg-yellow-500/10 border border-yellow-500/30">
                  <p className="text-sm text-yellow-700 dark:text-yellow-300 text-center">
                    Please <span className="font-medium">login</span> to create and take quizzes!
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default LandingPage;


