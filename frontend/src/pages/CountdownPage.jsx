import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";

function CountdownPage() {
  const navigate = useNavigate();
  const { session } = useQuiz();
  const [countdown, setCountdown] = useState(3);
  const [isAnimating, setIsAnimating] = useState(false);

  useEffect(() => {
    if (!session.quizId || !session.questions?.length) {
      navigate("/");
      return;
    }
  }, [session, navigate]);

  useEffect(() => {
    if (countdown === 0) {
      setTimeout(() => {
        navigate("/quiz");
      }, 500);
      return;
    }

    setIsAnimating(true);
    const timer = setTimeout(() => {
      setIsAnimating(false);
      setTimeout(() => {
        setCountdown((prev) => prev - 1);
      }, 100);
    }, 900);

    return () => clearTimeout(timer);
  }, [countdown, navigate]);

  if (!session.quizId || !session.questions?.length) {
    return null;
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950">
      <div className="text-center space-y-8">
        {/* Countdown Number */}
        <div className="relative">
          <div
            className={`text-9xl md:text-[12rem] font-bold bg-gradient-to-r from-primary via-emerald-400 to-primary bg-clip-text text-transparent transition-all duration-300 ${
              isAnimating ? "scale-150 opacity-0" : "scale-100 opacity-100"
            }`}
            style={{
              backgroundSize: "200% 200%",
              animation: countdown > 0 ? "gradient-shift 2s ease infinite" : "none",
            }}
          >
            {countdown > 0 ? countdown : "GO!"}
          </div>
          
          {/* Pulse Ring Effect */}
          {isAnimating && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="w-64 h-64 md:w-96 md:h-96 rounded-full border-4 border-primary/30 animate-ping"></div>
            </div>
          )}
        </div>

        {/* Message */}
        <div className="space-y-2 animate-fade-in">
          <h2 className="text-2xl md:text-3xl font-semibold text-slate-100">
            {countdown > 0 ? "Get Ready!" : "Let's Begin!"}
          </h2>
          <p className="text-slate-400 text-sm md:text-base">
            {countdown > 0
              ? "The quiz is about to start..."
              : "Good luck! Answer each question carefully."}
          </p>
        </div>

        {/* Progress Indicator */}
        <div className="flex justify-center gap-2">
          {[3, 2, 1].map((num) => (
            <div
              key={num}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                countdown >= num ? "bg-primary w-8" : "bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Background Particles Effect */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(20)].map((_, i) => (
          <div
            key={i}
            className="absolute w-1 h-1 bg-primary/20 rounded-full animate-float"
            style={{
              left: `${Math.random() * 100}%`,
              top: `${Math.random() * 100}%`,
              animationDelay: `${Math.random() * 3}s`,
              animationDuration: `${3 + Math.random() * 2}s`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

export default CountdownPage;

