import { useState } from "react";
import { useAuth } from "../context/AuthContext.jsx";
import PrimaryButton from "./PrimaryButton.jsx";

function AuthModal({ isOpen, onClose }) {
  const { signup, login } = useAuth();
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  // Sign up form fields
  const [signUpData, setSignUpData] = useState({
    email: "",
    password: "",
    name: "",
    mobile: "",
    image: "",
    role: "student",
  });

  // Login form fields
  const [loginData, setLoginData] = useState({
    email: "",
    password: "",
  });

  const handleSignUp = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await signup(signUpData);
    if (result.success) {
      onClose();
      resetForms();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    const result = await login(loginData.email, loginData.password);
    if (result.success) {
      onClose();
      resetForms();
    } else {
      setError(result.error);
    }
    setLoading(false);
  };

  const resetForms = () => {
    setSignUpData({
      email: "",
      password: "",
      name: "",
      mobile: "",
      image: "",
      role: "student",
    });
    setLoginData({
      email: "",
      password: "",
    });
    setError("");
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4 animate-fade-in">
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 p-6 max-w-md w-full shadow-xl animate-scale-in max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            {isSignUp ? "Sign Up" : "Login"}
          </h2>
          <button
            onClick={() => {
              onClose();
              resetForms();
            }}
            className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            <svg
              className="w-5 h-5 text-slate-600 dark:text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-4 p-3 rounded-lg bg-red-500/10 border border-red-500/30 text-red-600 dark:text-red-400 text-sm">
            {error}
          </div>
        )}

        {/* Sign Up Form */}
        {isSignUp ? (
          <form onSubmit={handleSignUp} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Name *
              </label>
              <input
                type="text"
                required
                value={signUpData.name}
                onChange={(e) => setSignUpData({ ...signUpData, name: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                placeholder="Enter your full name"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={signUpData.email}
                onChange={(e) => setSignUpData({ ...signUpData, email: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={signUpData.password}
                onChange={(e) => setSignUpData({ ...signUpData, password: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                placeholder="Enter your password"
                minLength={6}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Mobile Number
              </label>
              <input
                type="tel"
                value={signUpData.mobile}
                onChange={(e) => setSignUpData({ ...signUpData, mobile: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                placeholder="Enter your mobile number"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Profile Image URL
              </label>
              <input
                type="url"
                value={signUpData.image}
                onChange={(e) => setSignUpData({ ...signUpData, image: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                placeholder="Enter image URL (optional)"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Role *
              </label>
              <select
                required
                value={signUpData.role}
                onChange={(e) => setSignUpData({ ...signUpData, role: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
              >
                <option value="student">Student</option>
                <option value="teacher">Teacher</option>
                <option value="institute">Institute</option>
              </select>
            </div>

            <PrimaryButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Creating Account..." : "Sign Up"}
            </PrimaryButton>
          </form>
        ) : (
          /* Login Form */
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Email *
              </label>
              <input
                type="email"
                required
                value={loginData.email}
                onChange={(e) => setLoginData({ ...loginData, email: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1">
                Password *
              </label>
              <input
                type="password"
                required
                value={loginData.password}
                onChange={(e) => setLoginData({ ...loginData, password: e.target.value })}
                className="w-full rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-950/60 px-4 py-2 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-primary/60"
                placeholder="Enter your password"
              />
            </div>

            <PrimaryButton type="submit" className="w-full" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </PrimaryButton>
          </form>
        )}

        {/* Toggle between Sign Up and Login */}
        <div className="mt-6 text-center">
          <p className="text-sm text-slate-600 dark:text-slate-400">
            {isSignUp ? "Already have an account? " : "Don't have an account? "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setError("");
              }}
              className="text-primary font-medium hover:underline"
            >
              {isSignUp ? "Login" : "Sign Up"}
            </button>
          </p>
        </div>

        {/* Demo Credentials */}
        {!isSignUp && (
          <div className="mt-4 p-3 rounded-lg bg-slate-100 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700">
            <p className="text-xs font-medium text-slate-700 dark:text-slate-300 mb-2">Demo Credentials:</p>
            <div className="text-xs text-slate-600 dark:text-slate-400 space-y-1">
              <p>Email: user1@example.com</p>
              <p>Password: password123</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default AuthModal;

