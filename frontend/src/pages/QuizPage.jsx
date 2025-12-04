import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import PrimaryButton from "../components/PrimaryButton.jsx";
import QuestionTimer from "../components/QuestionTimer.jsx";

function QuizPage() {
  const navigate = useNavigate();
  const { session, setSession } = useQuiz();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [timerKey, setTimerKey] = useState(0);
  const [startTime, setStartTime] = useState(Date.now());
  const autoNextTimeoutRef = useRef(null);
  const [coinAnim, setCoinAnim] = useState(null);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const audioCtxRef = useRef(null);
  const [questionAnim, setQuestionAnim] = useState(true);
  const [timerStopped, setTimerStopped] = useState(false);

  const questions = session.questions || [];

  useEffect(() => {
    if (!session.quizId || questions.length === 0) {
      navigate("/");
    }
  }, [session.quizId, questions.length, navigate]);

  const currentQuestion = useMemo(
    () => (questions.length > 0 ? questions[currentIndex] : null),
    [questions, currentIndex]
  );

  const isLast = currentIndex === questions.length - 1;

  // Clear any pending auto-next when question changes/unmounts
  useEffect(() => {
    return () => {
      if (autoNextTimeoutRef.current) {
        clearTimeout(autoNextTimeoutRef.current);
        autoNextTimeoutRef.current = null;
      }
    };
  }, [currentIndex]);

  const scheduleAutoNext = () => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
    }
    autoNextTimeoutRef.current = setTimeout(() => {
      autoNextTimeoutRef.current = null;
      goNext();
    }, 3000);
  };

  const playTick = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return;
      if (!audioCtxRef.current) {
        audioCtxRef.current = new AudioCtx();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.frequency.value = 900;
      gain.gain.value = 0.08;
      osc.connect(gain);
      gain.connect(ctx.destination);
      const now = ctx.currentTime;
      osc.start(now);
      osc.stop(now + 0.07);
    } catch {
      // ignore audio errors
    }
  };

  const handleTimerTick = (nextValue) => {
    if (nextValue > 0) {
      playTick();
    }
  };

  const handleAnswer = (optionText, event) => {
    if (answered) return;
    
    // Stop timer and sound immediately
    setTimerStopped(true);
    
    const correct = currentQuestion.correctAnswer === optionText;
    const timeTaken = Math.round((Date.now() - startTime) / 1000);

    setSelected(optionText);
    setAnswered(true);

    setSession((prev) => {
      const newAnswers = [...(prev.answers || [])];
      newAnswers[currentIndex] = optionText;

      const newPerStatus = [...(prev.perQuestionStatus || [])];
      newPerStatus[currentIndex] = {
        questionIndex: currentIndex,
        isCorrect: correct,
        selectedAnswer: optionText,
        correctAnswer: currentQuestion.correctAnswer,
        timeTakenSeconds: timeTaken,
      };

      const additionalScore = correct ? 1 : 0;
      const additionalCoins = correct ? 4 : 0;

      return {
        ...prev,
        answers: newAnswers,
        perQuestionStatus: newPerStatus,
        score: (prev.score || 0) + additionalScore,
        coins: (prev.coins || 0) + additionalCoins,
      };
    });

    // trigger coin animation from click position on correct answer
    if (correct && event?.currentTarget) {
      const rect = event.currentTarget.getBoundingClientRect();
      setCoinAnim({
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        key: Date.now(),
      });
    }

    // auto move to next question after a short delay
    scheduleAutoNext();
  };

  const handleExpire = () => {
    if (answered || !currentQuestion) return;
    setTimerStopped(true);
    const timeTaken = Math.round((Date.now() - startTime) / 1000);
    setAnswered(true);
    setSelected(null);

    setSession((prev) => {
      const newPerStatus = [...(prev.perQuestionStatus || [])];
      newPerStatus[currentIndex] = {
        questionIndex: currentIndex,
        isCorrect: false,
        selectedAnswer: null,
        correctAnswer: currentQuestion.correctAnswer,
        timeTakenSeconds: timeTaken,
      };
      return {
        ...prev,
        perQuestionStatus: newPerStatus,
      };
    });

    // auto move to next question after a short delay when time expires
    scheduleAutoNext();
  };

  const goNext = () => {
    if (autoNextTimeoutRef.current) {
      clearTimeout(autoNextTimeoutRef.current);
      autoNextTimeoutRef.current = null;
    }
    if (!isLast) {
      setQuestionAnim(false);
      setTimeout(() => {
        setCurrentIndex((i) => i + 1);
        setSelected(null);
        setAnswered(false);
        setTimerKey((k) => k + 1);
        setStartTime(Date.now());
        setQuestionAnim(true);
        setTimerStopped(false); // Reset timer stopped state
      }, 300);
    } else {
      navigate("/result");
    }
  };

  if (!currentQuestion) {
    return null;
  }

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      {coinAnim && (
        <div
          key={coinAnim.key}
          className="pointer-events-none fixed z-40 coin-fly"
          style={{ top: coinAnim.y, left: coinAnim.x }}
          onAnimationEnd={() => setCoinAnim(null)}
        >
          <div className="w-7 h-7 md:w-8 md:h-8 rounded-full bg-yellow-400 shadow-lg shadow-yellow-400/60 border border-yellow-300 flex items-center justify-center text-xs font-bold text-yellow-900">
            +4
          </div>
        </div>
      )}

      <div className="flex flex-col gap-2 mb-3 sm:flex-row sm:items-center sm:justify-between text-xs md:text-sm text-slate-400">
        <span>
          Question {currentIndex + 1} / {questions.length}
        </span>
        <div className="flex items-center gap-3 justify-between sm:justify-end">
          <span>
            Score: <span className="text-emerald-400 font-medium">{session.score}</span> | Coins:{" "}
            <span className="text-yellow-400 font-medium">{session.coins}</span>
          </span>
          <button
            type="button"
            onClick={() => setSoundEnabled((v) => !v)}
            className="inline-flex items-center gap-1 rounded-full border border-slate-700 bg-slate-900/60 px-2 py-1 text-[11px] text-slate-300 hover:border-slate-500 transition-colors"
          >
            <span
              className={`w-1.5 h-1.5 rounded-full ${
                soundEnabled ? "bg-emerald-400" : "bg-slate-500"
              }`}
            />
            {soundEnabled ? "Sound on" : "Sound off"}
          </button>
        </div>
      </div>

      <QuestionTimer
        durationSeconds={60}
        onExpire={handleExpire}
        resetKey={timerKey}
        onTick={handleTimerTick}
        stop={timerStopped}
      />

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className="h-full bg-gradient-to-r from-primary to-emerald-400 transition-all duration-500 ease-out"
            style={{ width: `${((currentIndex + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div
        className={`rounded-xl border border-slate-800 bg-gradient-to-br from-slate-900/80 to-slate-900/40 p-6 mb-6 shadow-xl transition-all duration-300 ${
          questionAnim ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-4"
        }`}
      >
        <div className="text-base md:text-lg text-slate-200 mb-2 font-medium leading-relaxed">
          {currentQuestion.question}
        </div>
        {currentQuestion.image && (
          <div className="mt-4 mb-2 animate-fade-in">
            <img
              src={currentQuestion.image}
              alt="Question visual"
              className="max-h-48 rounded-lg object-contain border border-slate-800 shadow-lg"
            />
          </div>
        )}
      </div>

      <div
        className={`space-y-3 mb-6 transition-all duration-300 ${
          questionAnim ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"
        }`}
      >
        {currentQuestion.options.map((opt, index) => {
          const isCorrect = opt.text === currentQuestion.correctAnswer;
          const isSelected = selected === opt.text;

          let style =
            "border-slate-800 hover:border-slate-600 bg-slate-900/40 text-slate-200 hover:bg-slate-900/70";
          if (answered) {
            if (isSelected && isCorrect) {
              style = "border-emerald-500 bg-emerald-500/10 text-emerald-200";
            } else if (isSelected && !isCorrect) {
              style = "border-red-500 bg-red-500/10 text-red-200";
            } else if (!isSelected && isCorrect) {
              style = "border-emerald-500/70 bg-emerald-500/5 text-emerald-200";
            }
          }

          return (
            <button
              key={opt.text + index}
              onClick={(e) => handleAnswer(opt.text, e)}
              disabled={answered}
              className={`w-full rounded-xl border px-4 py-3 text-left text-sm transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] ${
                !answered ? "hover:shadow-lg hover:shadow-primary/10 cursor-pointer" : "cursor-not-allowed"
              } ${style}`}
              style={{
                transitionDelay: `${index * 50}ms`,
              }}
            >
              <div className="flex items-start gap-3">
                <div
                  className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold flex-shrink-0 transition-all ${
                    answered && isCorrect
                      ? "bg-emerald-500 text-white"
                      : answered && isSelected && !isCorrect
                      ? "bg-red-500 text-white"
                      : answered && !isSelected && isCorrect
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
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
                {answered && isCorrect && (
                  <svg
                    className="w-5 h-5 text-emerald-400 flex-shrink-0 animate-scale-in"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                )}
                {answered && isSelected && !isCorrect && (
                  <svg
                    className="w-5 h-5 text-red-400 flex-shrink-0 animate-scale-in"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
            </button>
          );
        })}
      </div>

      <div className="flex justify-end">
        <PrimaryButton onClick={goNext} disabled={!answered}>
          {isLast ? "Finish Quiz" : "Next Question"}
        </PrimaryButton>
      </div>
    </div>
  );
}

export default QuizPage;


