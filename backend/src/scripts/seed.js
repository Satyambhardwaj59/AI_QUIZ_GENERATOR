import mongoose from "mongoose";
import dotenv from "dotenv";
import User from "../models/User.js";
import Quiz from "../models/Quiz.js";
import Result from "../models/Result.js";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "mongodb://127.0.0.1:27017/ai_quiz";

// Sample questions for dummy quizzes
const sampleQuestions = [
  {
    question: "What is the capital of France?",
    options: [
      { text: "London" },
      { text: "Berlin" },
      { text: "Paris" },
      { text: "Madrid" },
    ],
    correctAnswer: "Paris",
  },
  {
    question: "Which programming language is known for web development?",
    options: [
      { text: "Python" },
      { text: "JavaScript" },
      { text: "C++" },
      { text: "Java" },
    ],
    correctAnswer: "JavaScript",
  },
  {
    question: "What is 2 + 2?",
    options: [
      { text: "3" },
      { text: "4" },
      { text: "5" },
      { text: "6" },
    ],
    correctAnswer: "4",
  },
  {
    question: "Which planet is known as the Red Planet?",
    options: [
      { text: "Venus" },
      { text: "Mars" },
      { text: "Jupiter" },
      { text: "Saturn" },
    ],
    correctAnswer: "Mars",
  },
  {
    question: "What is the largest ocean on Earth?",
    options: [
      { text: "Atlantic Ocean" },
      { text: "Indian Ocean" },
      { text: "Arctic Ocean" },
      { text: "Pacific Ocean" },
    ],
    correctAnswer: "Pacific Ocean",
  },
];

const difficulties = ["easy", "medium", "hard"];
const roles = ["student", "teacher", "institute"];

// Generate dummy users
const generateUsers = () => {
  const users = [];
  const firstNames = [
    "John", "Jane", "Mike", "Sarah", "David", "Emily", "Chris", "Lisa",
    "Tom", "Anna", "James", "Maria", "Robert", "Emma", "William", "Olivia",
    "Richard", "Sophia", "Joseph", "Isabella"
  ];
  const lastNames = [
    "Smith", "Johnson", "Williams", "Brown", "Jones", "Garcia", "Miller",
    "Davis", "Rodriguez", "Martinez", "Hernandez", "Lopez", "Wilson",
    "Anderson", "Thomas", "Taylor", "Moore", "Jackson", "Martin", "Lee"
  ];

  for (let i = 0; i < 20; i++) {
    const firstName = firstNames[i % firstNames.length];
    const lastName = lastNames[i % lastNames.length];
    users.push({
      email: `user${i + 1}@example.com`,
      password: "password123",
      name: `${firstName} ${lastName}`,
      mobile: `+1${Math.floor(Math.random() * 9000000000) + 1000000000}`,
      image: `https://i.pravatar.cc/150?img=${i + 1}`,
      role: roles[i % roles.length],
    });
  }
  return users;
};

// Generate dummy quizzes
const generateQuizzes = () => {
  const quizzes = [];
  const topics = [
    "General Knowledge", "Mathematics", "Science", "History", "Geography",
    "Literature", "Technology", "Sports", "Music", "Art", "Biology",
    "Chemistry", "Physics", "Computer Science", "Languages"
  ];

  for (let i = 0; i < 20; i++) {
    const numQuestions = Math.floor(Math.random() * 10) + 5; // 5-15 questions
    const questions = [];
    for (let j = 0; j < numQuestions; j++) {
      questions.push(sampleQuestions[j % sampleQuestions.length]);
    }
    
    quizzes.push({
      inputText: `Sample text for ${topics[i % topics.length]} quiz ${i + 1}`,
      difficulty: difficulties[i % difficulties.length],
      numQuestions: numQuestions,
      aiResponse: questions,
    });
  }
  return quizzes;
};

// Generate dummy results
const generateResults = async (users, quizzes) => {
  const results = [];
  for (let i = 0; i < 30; i++) {
    const user = users[Math.floor(Math.random() * users.length)];
    const quiz = quizzes[Math.floor(Math.random() * quizzes.length)];
    const score = Math.floor(Math.random() * quiz.aiResponse.length);
    const perQuestionStatus = quiz.aiResponse.map((q, idx) => ({
      questionIndex: idx,
      isCorrect: idx < score,
      selectedAnswer: idx < score ? q.correctAnswer : q.options[0].text,
      correctAnswer: q.correctAnswer,
      timeTakenSeconds: Math.floor(Math.random() * 60) + 10,
    }));

    results.push({
      userId: user._id.toString(),
      quizId: quiz._id,
      score: score,
      coinsEarned: score * 4,
      perQuestionStatus: perQuestionStatus,
    });
  }
  return results;
};

async function seed() {
  try {
    await mongoose.connect(MONGO_URI, { dbName: "ai_quiz" });
    console.log("Connected to MongoDB");

    // Clear existing data
    console.log("Clearing existing data...");
    await User.deleteMany({});
    await Quiz.deleteMany({});
    await Result.deleteMany({});

    // Create users
    console.log("Creating users...");
    const userData = generateUsers();
    const users = await User.insertMany(userData);
    console.log(`Created ${users.length} users`);

    // Create quizzes
    console.log("Creating quizzes...");
    const quizData = generateQuizzes();
    const quizzes = await Quiz.insertMany(quizData);
    console.log(`Created ${quizzes.length} quizzes`);

    // Create results
    console.log("Creating results...");
    const resultData = await generateResults(users, quizzes);
    await Result.insertMany(resultData);
    console.log(`Created ${resultData.length} results`);

    console.log("Seed data created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("Error seeding database:", error);
    process.exit(1);
  }
}

seed();

