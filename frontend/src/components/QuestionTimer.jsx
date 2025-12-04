import { useEffect, useState } from "react";

function QuestionTimer({ durationSeconds = 60, onExpire, resetKey, onTick }) {
  const [remaining, setRemaining] = useState(durationSeconds);

  useEffect(() => {
    setRemaining(durationSeconds);
  }, [durationSeconds, resetKey]);

  useEffect(() => {
    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    const id = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1;
        if (next >= 0 && onTick) {
          onTick(next);
        }
        return next;
      });
    }, 1000);
    return () => clearInterval(id);
  }, [remaining, onExpire, onTick]);

  const progress = (remaining / durationSeconds) * 100;

  return (
    <div className="w-full mb-3">
      <div className="flex justify-between text-xs text-slate-400 mb-1">
        <span>Time left</span>
        <span>{remaining}s</span>
      </div>
      <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden">
        <div
          className={`h-full bg-emerald-400 transition-all duration-300 ${
            remaining < durationSeconds / 3 ? "bg-red-500" : ""
          }`}
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}

export default QuestionTimer;


