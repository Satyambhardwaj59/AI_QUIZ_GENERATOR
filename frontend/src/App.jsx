import { useState } from "react";
import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import QuizDetailPage from "./pages/QuizDetailPage.jsx";
import CountdownPage from "./pages/CountdownPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import ReviewQuestionPage from "./pages/ReviewQuestionPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";
import LeaderboardPage from "./pages/LeaderboardPage.jsx";
import ProfilePage from "./pages/ProfilePage.jsx";
import { useAuth } from "./context/AuthContext.jsx";
import { useTheme } from "./context/ThemeContext.jsx";
import AuthModal from "./components/AuthModal.jsx";
import ProtectedRoute from "./components/ProtectedRoute.jsx";

function App() {
  const { user, logout } = useAuth();
  const { theme, toggleTheme, isDark } = useTheme();
  const [showAuthModal, setShowAuthModal] = useState(false);
  
  return (
    <div className="min-h-screen flex flex-col bg-white dark:bg-slate-950 text-slate-900 dark:text-slate-100 transition-colors duration-300">
      <header className="border-b border-slate-200 dark:border-slate-800/80 bg-white/70 dark:bg-slate-950/70 backdrop-blur sticky top-0 z-30 transition-colors duration-300">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
            <div className="w-7 h-7 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-xs font-bold text-white dark:text-slate-950 shadow-lg shadow-primary/40">
              AQ
            </div>
            <span className="text-lg md:text-xl font-semibold text-slate-900 dark:text-slate-50 tracking-tight">
              AI Quiz
            </span>
          </Link>
          <nav className="flex items-center gap-3 md:gap-4 text-xs md:text-sm">
            <Link to="/" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/create" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors hidden sm:inline-flex">
              Create quiz
            </Link>
            <Link to="/history" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
              History
            </Link>
            <Link to="/leaderboard" className="text-slate-700 dark:text-slate-300 hover:text-primary transition-colors">
              Leaderboard
            </Link>
            {user ? (
              <div className="flex items-center gap-2">
                <Link
                  to="/profile"
                  className="flex items-center gap-2 hover:opacity-80 transition-opacity"
                >
                  <img
                    src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=128`}
                    alt={user.name}
                    className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 object-cover"
                    onError={(e) => {
                      e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=128`;
                    }}
                  />
                  {/* <div className="hidden md:flex flex-col items-start">
                    <span className="text-slate-700 dark:text-slate-300 font-medium text-xs">
                      {user.name}
                    </span>
                    <span className="text-slate-500 dark:text-slate-400 text-[10px] capitalize">
                      {user.role}
                    </span>
                  </div> */}
                </Link>
                <button
                  onClick={logout}
                  className="px-3 py-1.5 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/60 text-slate-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300 text-xs"
                >
                  Logout
                </button>
              </div>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="px-3 py-1.5 rounded-lg bg-primary text-white hover:bg-primary/90 transition-all duration-300 text-xs font-medium"
              >
                Login
              </button>
            )}
            <button
              onClick={toggleTheme}
              className="p-2 rounded-lg border border-slate-300 dark:border-slate-700 bg-slate-100 dark:bg-slate-900 hover:bg-slate-200 dark:hover:bg-slate-800 transition-all duration-300"
              aria-label="Toggle theme"
            >
              {isDark ? (
                <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              ) : (
                <svg className="w-4 h-4 text-slate-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z" />
                </svg>
              )}
            </button>
          </nav>
        </div>
      </header>
      <AuthModal isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route
            path="/create"
            element={
              <ProtectedRoute>
                <HomePage />
              </ProtectedRoute>
            }
          />
          <Route
            path="/settings"
            element={
              <ProtectedRoute>
                <SettingsPage />
              </ProtectedRoute>
            }
          />
          <Route path="/quiz-detail" element={<QuizDetailPage />} />
          <Route path="/countdown" element={<CountdownPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/review" element={<ReviewQuestionPage />} />
          <Route path="/history" element={<HistoryPage />} />
          <Route path="/leaderboard" element={<LeaderboardPage />} />
          <Route
            path="/profile"
            element={
              <ProtectedRoute>
                <ProfilePage />
              </ProtectedRoute>
            }
          />
        </Routes>
      </main>
    </div>
  );
}

export default App;


