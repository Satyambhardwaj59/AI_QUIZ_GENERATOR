import { useNavigate } from "react-router-dom";
import PrimaryButton from "../components/PrimaryButton.jsx";

function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-[calc(100vh-56px)] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950">
      <div className="max-w-6xl mx-auto px-4 py-16 md:py-20 grid md:grid-cols-2 gap-10 items-center">
        <div>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-slate-900/70 px-3 py-1 text-[11px] text-primary mb-4">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            AI-powered quiz generator · 1 min per question
          </div>
          <h1 className="text-3xl md:text-5xl font-semibold tracking-tight mb-4">
            Turn any{" "}
            <span className="bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              content
            </span>{" "}
            into a gamified quiz in seconds.
          </h1>
          <p className="text-sm md:text-base text-slate-400 mb-6 max-w-xl">
            Paste text, upload PDFs or slides, or drop in a YouTube link. Our AI creates timed MCQ
            quizzes with instant feedback and coin rewards to keep learners engaged.
          </p>
          <div className="flex flex-wrap items-center gap-3 mb-8">
            <PrimaryButton
              className="px-5 py-2.5 text-sm md:text-base"
              onClick={() => navigate("/create")}
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
          <div className="flex flex-wrap gap-4 text-xs text-slate-400">
            <div>
              <div className="text-slate-100 font-semibold">Multi-source</div>
              <div>Text · PDF · DOCX · Images · YouTube</div>
            </div>
            <div>
              <div className="text-slate-100 font-semibold">Smart scoring</div>
              <div>Timer, coins, and history tracking</div>
            </div>
          </div>
        </div>

        <div className="relative">
          <div className="pointer-events-none absolute -inset-10 rounded-3xl bg-primary/20 blur-3xl opacity-40" />
          <div className="relative rounded-3xl border border-slate-800/80 bg-slate-900/80 shadow-2xl shadow-primary/10 p-5 md:p-6 backdrop-blur">
            <div className="flex justify-between items-center mb-4">
              <div>
                <div className="text-xs text-slate-400">Live session</div>
                <div className="text-sm font-medium text-slate-100">AI Quiz Demo</div>
              </div>
              <div className="flex items-center gap-2 text-xs">
                <span className="rounded-full bg-yellow-400/10 text-yellow-300 px-2 py-0.5 border border-yellow-400/40">
                  Coins: 24
                </span>
              </div>
            </div>
            <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4 mb-3">
              <div className="flex justify-between text-[11px] text-slate-400 mb-1">
                <span>Question 2 · Medium</span>
                <span>00:45 left</span>
              </div>
              <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden mb-3">
                <div className="h-full w-2/3 bg-gradient-to-r from-emerald-400 to-primary animate-pulse" />
              </div>
              <p className="text-xs md:text-sm text-slate-100 mb-3">
                Which statement best describes the role of AI in modern learning experiences?
              </p>
              <div className="space-y-1.5 text-[11px] md:text-xs">
                <div className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">
                  It replaces teachers entirely in all scenarios.
                </div>
                <div className="rounded-lg border border-emerald-500 bg-emerald-500/10 px-3 py-2 flex justify-between items-center">
                  <span>It augments learning with personalization and instant feedback.</span>
                  <span className="text-[10px] text-emerald-300 font-medium">+4 coins</span>
                </div>
                <div className="rounded-lg border border-slate-800 bg-slate-900/70 px-3 py-2">
                  It is only useful for grading exams.
                </div>
              </div>
            </div>
            <div className="flex justify-between items-center text-[11px] text-slate-400 mt-2">
              <span>Auto-next in 3s after each answer</span>
              <span>History & analytics included</span>
            </div>
          </div>
        </div>
      </div>

      <section id="features" className="max-w-6xl mx-auto px-4 pb-14">
        <div className="grid md:grid-cols-3 gap-4 text-xs md:text-sm">
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="text-slate-100 font-semibold mb-1">One-question focus</div>
            <p className="text-slate-400">
              Prevent overwhelm with a single question view, per-question timer, and clean feedback
              highlighting correct and wrong options.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="text-slate-100 font-semibold mb-1">Gamified coins</div>
            <p className="text-slate-400">
              Earn coins for correct answers and see them instantly added to your balance with smooth
              animations.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-800 bg-slate-900/70 p-4">
            <div className="text-slate-100 font-semibold mb-1">Replay anytime</div>
            <p className="text-slate-400">
              All attempts are stored so you can revisit performance, difficulty, and progress over time.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

export default LandingPage;


