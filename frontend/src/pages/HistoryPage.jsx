import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import client from "../api/client.js";

function ensureUserId(user) {
  if (user?.id) {
    return user.id;
  }
  let id = localStorage.getItem("ai_quiz_user_id");
  if (!id) {
    id = `user_${Math.random().toString(36).slice(2, 10)}`;
    localStorage.setItem("ai_quiz_user_id", id);
  }
  return id;
}

function HistoryPage() {
  const { user } = useAuth();
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userId = ensureUserId(user);
    async function load() {
      try {
        const res = await client.get(`/history/${userId}`);
        setResults(res.data.results || []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h2 className="text-2xl font-semibold mb-4">Quiz History</h2>
      {loading && <p className="text-sm text-slate-400">Loading...</p>}
      {!loading && results.length === 0 && (
        <p className="text-sm text-slate-400">No past attempts yet. Go generate your first quiz!</p>
      )}

      <div className="space-y-3">
        {results.map((r) => (
          <div
            key={r._id}
            className="rounded-lg border border-slate-800 bg-slate-900/60 p-3 text-sm flex justify-between"
          >
            <div>
              <div className="text-slate-100 mb-1">
                {r.quizId?.difficulty?.toUpperCase() || "QUIZ"} ·{" "}
                {new Date(r.createdAt).toLocaleString()}
              </div>
              <div className="text-xs text-slate-400">
                Score: {r.score} | Coins:{" "}
                <span className="text-yellow-400 font-medium">{r.coinsEarned}</span> | Questions:{" "}
                {r.quizId?.numQuestions ?? r.perQuestionStatus?.length ?? "-"}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default HistoryPage;


