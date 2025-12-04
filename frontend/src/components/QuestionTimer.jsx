import { useEffect, useState, useRef } from "react";

function QuestionTimer({ durationSeconds = 60, onExpire, resetKey, onTick, stop = false }) {
  const [remaining, setRemaining] = useState(durationSeconds);
  const intervalRef = useRef(null);

  useEffect(() => {
    setRemaining(durationSeconds);
  }, [durationSeconds, resetKey]);

  useEffect(() => {
    // Stop timer if stop prop is true
    if (stop) {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      return;
    }

    if (remaining <= 0) {
      onExpire?.();
      return;
    }
    
    intervalRef.current = setInterval(() => {
      setRemaining((r) => {
        const next = r - 1;
        if (next >= 0 && onTick) {
          onTick(next);
        }
        return next;
      });
    }, 1000);
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, [remaining, onExpire, onTick, stop]);

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


