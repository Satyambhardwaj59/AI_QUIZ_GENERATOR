import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import client from "../api/client.js";
import PrimaryButton from "../components/PrimaryButton.jsx";

function ProfilePage() {
  const { user } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userRank, setUserRank] = useState(null);
  const [quizzesCreated, setQuizzesCreated] = useState(0);

  // useEffect(() => {
  //   loadProfileData();
  // }, [user]);

  useEffect(() => {
  if (!user || !user.id) return;
  loadProfileData();
}, [user]);


  const loadProfileData = async () => {
    try {
      setLoading(true);
      
      // Get user's results
      const resultsRes = await client.get(`/history/${user.id}`);
      const results = resultsRes.data.results || [];
      
      // Calculate stats
      const totalScore = results.reduce((sum, r) => sum + r.score, 0);
      const totalCoins = results.reduce((sum, r) => sum + r.coinsEarned, 0);
      const quizzesCompleted = results.length;
      const totalQuestions = results.reduce((sum, r) => sum + (r.perQuestionStatus?.length || 0), 0);
      const correctAnswers = results.reduce(
        (sum, r) =>
          sum +
          (r.perQuestionStatus?.filter((q) => q.isCorrect).length || 0),
        0
      );
      const averageAccuracy = totalQuestions > 0 ? (correctAnswers / totalQuestions) * 100 : 0;

      // Get user's rank
      const leaderboardRes = await client.get("/leaderboard?page=1&limit=1000");
      const leaderboard = leaderboardRes.data.leaderboard || [];
      const rankIndex = leaderboard.findIndex((entry) => entry.userId === user.id);
      const rank = rankIndex >= 0 ? rankIndex + 1 : null;

      // Get quizzes created by user (if we track creator)
      // For now, we'll use quizzes completed as a proxy
      setQuizzesCreated(quizzesCompleted);

      setProfileData({
        totalScore,
        totalCoins,
        quizzesCompleted,
        averageAccuracy,
      });
      setUserRank(rank);
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl md:text-4xl font-bold mb-2 bg-gradient-to-r from-primary to-emerald-400 bg-clip-text text-transparent">
          My Profile
        </h2>
        <p className="text-slate-600 dark:text-slate-400 text-sm">View your profile and statistics</p>
      </div>

      {/* Profile Card */}
      <div className="rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 md:p-8 mb-6 shadow-xl">
        <div className="flex flex-col md:flex-row items-center md:items-start gap-6">
          {/* Profile Image */}
          <div className="relative">
            <img
              src={user.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=256`}
              alt={user.name}
              className="w-32 h-32 rounded-full border-4 border-primary/20 object-cover shadow-lg"
              onError={(e) => {
                e.target.src = `https://ui-avatars.com/api/?name=${encodeURIComponent(user.name)}&background=6366F1&color=fff&size=256`;
              }}
            />
            {userRank && userRank <= 3 && (
              <div className="absolute -top-2 -right-2 text-4xl">
                {getRankIcon(userRank)}
              </div>
            )}
          </div>

          {/* User Info */}
          <div className="flex-1 text-center md:text-left">
            <h3 className="text-2xl font-bold text-slate-900 dark:text-slate-100 mb-2">
              {user.name}
            </h3>
            <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 mb-4">
              <div className="px-3 py-1 rounded-lg bg-primary/10 border border-primary/30">
                <span className="text-xs text-slate-600 dark:text-slate-400">Role</span>
                <div className="text-sm font-semibold text-primary capitalize">{user.role}</div>
              </div>
              {user.email && (
                <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Email</span>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.email}</div>
                </div>
              )}
              {user.mobile && (
                <div className="px-3 py-1 rounded-lg bg-slate-100 dark:bg-slate-800/50">
                  <span className="text-xs text-slate-600 dark:text-slate-400">Mobile</span>
                  <div className="text-sm font-medium text-slate-900 dark:text-slate-100">{user.mobile}</div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-lg">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Total Score
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {profileData?.totalScore || 0}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-lg">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Total Coins
          </div>
          <div className="text-3xl font-bold text-yellow-500">
            {profileData?.totalCoins || 0}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-lg">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
            </svg>
            Quizzes Completed
          </div>
          <div className="text-3xl font-bold text-slate-900 dark:text-slate-100">
            {profileData?.quizzesCompleted || 0}
          </div>
        </div>

        <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6 shadow-lg">
          <div className="text-xs text-slate-600 dark:text-slate-400 mb-2 flex items-center gap-2">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
            Average Accuracy
          </div>
          <div className="text-3xl font-bold text-emerald-500">
            {profileData?.averageAccuracy ? Math.round(profileData.averageAccuracy) : 0}%
          </div>
        </div>
      </div>

      {/* Rank Card */}
      {userRank && (
        <div className="rounded-xl border border-primary/30 bg-gradient-to-r from-primary/10 to-emerald-400/10 p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Your Rank</div>
              <div className="text-4xl font-bold text-primary flex items-center gap-3">
                {getRankIcon(userRank)}
                {/* <span>{userRank}</span> */}
              </div>
            </div>
            <div className="text-right">
              <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Leaderboard Position</div>
              <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
                Top {Math.round((userRank / (userRank + 10)) * 100)}%
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Quizzes Created */}
      <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/70 p-6">
        <h4 className="text-lg font-semibold text-slate-900 dark:text-slate-100 mb-4">
          Quiz Activity
        </h4>
        <div className="grid md:grid-cols-2 gap-4">
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Quizzes Completed</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {profileData?.quizzesCompleted || 0}
            </div>
          </div>
          <div className="p-4 rounded-lg bg-slate-50 dark:bg-slate-800/50">
            <div className="text-sm text-slate-600 dark:text-slate-400 mb-1">Total Questions Answered</div>
            <div className="text-2xl font-bold text-slate-900 dark:text-slate-100">
              {profileData?.quizzesCompleted
                ? profileData.quizzesCompleted * 5
                : 0}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProfilePage;

