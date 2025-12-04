import { createContext, useContext, useState } from "react";

const QuizContext = createContext(null);

export function QuizProvider({ children }) {
  const [input, setInput] = useState({
    sourceType: "text",
    text: "",
    youtubeUrl: "",
    file: null,
  });

  const [settings, setSettings] = useState({
    difficulty: "easy",
    numQuestions: 5,
    allowImages: true,
  });

  const [session, setSession] = useState({
    quizId: null,
    questions: [],
    answers: [],
    score: 0,
    coins: 0,
    perQuestionStatus: [],
  });

  const value = {
    input,
    setInput,
    settings,
    setSettings,
    session,
    setSession,
  };

  return <QuizContext.Provider value={value}>{children}</QuizContext.Provider>;
}

export function useQuiz() {
  const ctx = useContext(QuizContext);
  if (!ctx) throw new Error("useQuiz must be used within QuizProvider");
  return ctx;
}


