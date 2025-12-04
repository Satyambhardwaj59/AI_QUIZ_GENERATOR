import { Routes, Route, Link } from "react-router-dom";
import LandingPage from "./pages/LandingPage.jsx";
import HomePage from "./pages/HomePage.jsx";
import SettingsPage from "./pages/SettingsPage.jsx";
import QuizPage from "./pages/QuizPage.jsx";
import ResultPage from "./pages/ResultPage.jsx";
import HistoryPage from "./pages/HistoryPage.jsx";

function App() {
  return (
    <div className="min-h-screen flex flex-col bg-slate-950 text-slate-100">
      <header className="border-b border-slate-800/80 bg-slate-950/70 backdrop-blur">
        <div className="max-w-6xl mx-auto px-4 py-3 flex items-center justify-between">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-2xl bg-gradient-to-tr from-primary to-emerald-400 flex items-center justify-center text-xs font-bold text-slate-950 shadow-lg shadow-primary/40">
              AQ
            </div>
            <span className="text-lg md:text-xl font-semibold text-slate-50 tracking-tight">
              AI Quiz
            </span>
          </Link>
          <nav className="flex items-center gap-4 text-xs md:text-sm">
            <Link to="/" className="hover:text-primary transition-colors">
              Home
            </Link>
            <Link to="/create" className="hover:text-primary transition-colors hidden sm:inline-flex">
              Create quiz
            </Link>
            <Link to="/history" className="hover:text-primary transition-colors">
              History
            </Link>
          </nav>
        </div>
      </header>
      <main className="flex-1">
        <Routes>
          <Route path="/" element={<LandingPage />} />
          <Route path="/create" element={<HomePage />} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/quiz" element={<QuizPage />} />
          <Route path="/result" element={<ResultPage />} />
          <Route path="/history" element={<HistoryPage />} />
        </Routes>
      </main>
    </div>
  );
}

export default App;


