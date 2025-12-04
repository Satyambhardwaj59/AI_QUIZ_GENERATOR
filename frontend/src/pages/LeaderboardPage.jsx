import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import client from "../api/client.js";

function LeaderboardPage() {
  const { user, isAuthenticated } = useAuth();
  const [leaderboard, setLeaderboard] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isVisible, setIsVisible] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [totalUsers, setTotalUsers] = useState(0);
  const itemsPerPage = 10;

  useEffect(() => {
    loadLeaderboard();
    setTimeout(() => setIsVisible(true), 100);
  }, [currentPage]);

  const loadLeaderboard = async () => {
    try {
      setLoading(true);
      const res = await client.get(`/leaderboard?page=${currentPage}&limit=${itemsPerPage}`);
      setLeaderboard(res.data.leaderboard || []);
      setTotalPages(res.data.totalPages || 1);
      setTotalUsers(res.data.totalUsers || 0);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const getRankIcon = (rank) => {
    if (rank === 1) return "🥇";
    if (rank === 2) return "🥈";
    if (rank === 3) return "🥉";
    return `#${rank}`;
  };

  const getRankColor = (rank) => {
    if (rank === 1) return "from-yellow-500/20 to-yellow-400/10 border-yellow-500/30";
    if (rank === 2) return "from-slate-400/20 to-slate-300/10 border-slate-400/30";
    if (rank === 3) return "from-orange-500/20 to-orange-400/10 border-orange-500/30";
    return "from-slate-800/40 to-slate-800/20 border-slate-700/30";
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      {/* Header */}
      <div className={`mb-8 transition-all duration-700 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-6">
          <div>
            <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
              Leaderboard
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-sm">Top performers in quiz challenges</p>
          </div>
        </div>
      </div>

      {/* Leaderboard Content */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-slate-600 dark:text-slate-400 text-sm">Loading leaderboard...</p>
        </div>
      ) : leaderboard.length === 0 ? (
        <div className="text-center py-12 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60">
          <svg
            className="w-16 h-16 text-slate-400 dark:text-slate-600 mx-auto mb-4"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z"
            />
          </svg>
          <p className="text-slate-600 dark:text-slate-400 text-sm">No leaderboard data yet. Be the first to complete a quiz!</p>
        </div>
      ) : (
        <div className={`space-y-3 transition-all duration-700 delay-200 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          {leaderboard.map((entry, index) => {
            const rank = (currentPage - 1) * itemsPerPage + index + 1;
            const isCurrentUser = isAuthenticated && user?.id === entry.userId;
            return (
              <div
                key={entry._id || index}
                className={`rounded-xl border bg-gradient-to-r p-4 md:p-6 transition-all duration-300 hover:scale-[1.02] hover:shadow-lg ${
                  isCurrentUser ? "ring-2 ring-primary/50" : ""
                } ${getRankColor(rank)}`}
                style={{
                  animationDelay: `${index * 50}ms`,
                }}
              >
                <div className="flex items-center gap-4">
                  {/* Rank */}
                  <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl bg-slate-100 dark:bg-slate-900/60 flex items-center justify-center text-lg md:text-xl font-bold text-slate-700 dark:text-slate-200 flex-shrink-0">
                    {getRankIcon(rank)}
                  </div>

                  {/* User Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {entry.image && (
                        <img
                          src={entry.image}
                          alt={entry.name}
                          className="w-8 h-8 rounded-full border border-slate-300 dark:border-slate-700 flex-shrink-0"
                        />
                      )}
                      <span className="font-semibold text-slate-900 dark:text-slate-100 truncate">
                        {entry.name || `User ${entry.userId?.slice(-6)}`}
                      </span>
                      {isCurrentUser && (
                        <span className="px-2 py-0.5 rounded-full bg-primary/20 text-primary text-xs font-medium border border-primary/30">
                          You
                        </span>
                      )}
                      {entry.role && (
                        <span className="px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs capitalize">
                          {entry.role}
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-3 text-xs text-slate-600 dark:text-slate-400">
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {entry.totalScore || 0} points
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
                        </svg>
                        {entry.quizzesCompleted || 0} quizzes
                      </span>
                      <span className="flex items-center gap-1">
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {entry.totalCoins || 0} coins
                      </span>
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="text-right flex-shrink-0">
                    <div className="text-2xl md:text-3xl font-bold text-slate-900 dark:text-slate-100">
                      {entry.averageAccuracy
                        ? `${Math.round(entry.averageAccuracy)}%`
                        : "-"}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">Avg Accuracy</div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className={`mt-8 flex flex-col sm:flex-row items-center justify-between gap-4 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <div className="text-sm text-slate-500 dark:text-slate-400">
            Showing {((currentPage - 1) * itemsPerPage) + 1} - {Math.min(currentPage * itemsPerPage, totalUsers)} of {totalUsers} users
          </div>
          <div className="flex items-center gap-2">
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
                    className={`w-10 h-10 rounded-lg text-sm font-medium transition-all duration-300 ${
                      currentPage === pageNum
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
        </div>
      )}

      {/* Info Card */}
      {!isAuthenticated && (
        <div className={`mt-8 p-4 rounded-xl border border-primary/30 bg-primary/10 transition-all duration-700 delay-300 ${isVisible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
          <p className="text-sm text-slate-700 dark:text-slate-300 text-center">
            <span className="text-primary font-medium">Sign up or Login</span> to see your position on the leaderboard and compete with others!
          </p>
        </div>
      )}
    </div>
  );
}

export default LeaderboardPage;


