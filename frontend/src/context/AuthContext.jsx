import { createContext, useContext, useState, useEffect } from "react";
import client from "../api/client.js";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is logged in from localStorage
    const savedUser = localStorage.getItem("ai_quiz_user");
    if (savedUser) {
      try {
        const parsedUser = JSON.parse(savedUser);
        setUser(parsedUser);
        // Verify user still exists
        if (parsedUser.id) {
          client
            .get(`/auth/user/${parsedUser.id}`)
            .then((res) => {
              setUser(res.data.user);
              localStorage.setItem("ai_quiz_user", JSON.stringify(res.data.user));
            })
            .catch(() => {
              // User might not exist anymore
              logout();
            });
        }
      } catch (e) {
        localStorage.removeItem("ai_quiz_user");
      }
    }
    setIsLoading(false);
  }, []);


  const signup = async (userData) => {
    try {
      const res = await client.post("/auth/signup", userData);
      const newUser = {
        id: res.data.user.id,
        email: res.data.user.email,
        name: res.data.user.name,
        mobile: res.data.user.mobile,
        image: res.data.user.image,
        role: res.data.user.role,
      };
      setUser(newUser);
      localStorage.setItem("ai_quiz_user", JSON.stringify(newUser));
      localStorage.setItem("ai_quiz_user_id", newUser.id);
      return { success: true, user: newUser };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to sign up",
      };
    }
  };

  const login = async (email, password) => {
    try {
      const res = await client.post("/auth/login", { email, password });
      const userData = {
        id: res.data.user.id,
        email: res.data.user.email,
        name: res.data.user.name,
        mobile: res.data.user.mobile,
        image: res.data.user.image,
        role: res.data.user.role,
      };
      setUser(userData);
      localStorage.setItem("ai_quiz_user", JSON.stringify(userData));
      localStorage.setItem("ai_quiz_user_id", userData.id);
      return { success: true, user: userData };
    } catch (error) {
      return {
        success: false,
        error: error.response?.data?.error || "Failed to login",
      };
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("ai_quiz_user");
    localStorage.removeItem("ai_quiz_user_id");
  };

  const value = {
    user,
    isLoading,
    signup,
    login,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}

