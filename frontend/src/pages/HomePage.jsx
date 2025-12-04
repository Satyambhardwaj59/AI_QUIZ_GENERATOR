import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useQuiz } from "../context/QuizContext.jsx";
import client from "../api/client.js";
import PrimaryButton from "../components/PrimaryButton.jsx";

function HomePage() {
  const navigate = useNavigate();
  const { input, setInput } = useQuiz();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError("");
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const res = await client.post("/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setInput((prev) => ({
        ...prev,
        sourceType: "file",
        text: res.data.text,
        file,
      }));
    } catch (err) {
      console.error(err);
      setError("Failed to extract text from file.");
    } finally {
      setLoading(false);
    }
  };

  const handleContinue = () => {
    if (input.sourceType === "text" && !input.text.trim()) {
      setError("Please enter some text or choose another source.");
      return;
    }
    if (input.sourceType === "youtube" && !input.youtubeUrl.trim()) {
      setError("Please enter a YouTube URL.");
      return;
    }
    setError("");
    navigate("/settings");
  };

  return (
    <div className="max-w-5xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-2xl md:text-3xl font-semibold mb-2 tracking-tight">
          Choose your quiz source
        </h1>
        <p className="text-slate-400 text-xs md:text-sm">
          Generate MCQ quizzes from text, PDFs, DOCX, images, or YouTube videos. One question at a
          time with timer and coins.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-4 mb-6">
        {[
          { id: "text", label: "Plain Text" },
          { id: "file", label: "PDF / DOCX / Image" },
          { id: "youtube", label: "YouTube URL" },
        ].map((opt) => (
          <button
            key={opt.id}
            onClick={() => setInput((prev) => ({ ...prev, sourceType: opt.id }))}
            className={`rounded-xl border px-4 py-3 text-left text-sm transition-all duration-200 hover:-translate-y-0.5 hover:shadow-md hover:shadow-primary/10 ${
              input.sourceType === opt.id
                ? "border-primary bg-primary/10 shadow-primary/20 shadow-md"
                : "border-slate-800 hover:border-slate-600 bg-slate-900/40"
            }`}
          >
            <div className="font-medium mb-1">{opt.label}</div>
            <div className="text-xs text-slate-400">
              {opt.id === "text" && "Paste or type any text content."}
              {opt.id === "file" && "Upload PDF, DOCX, or image. Text will be auto-extracted."}
              {opt.id === "youtube" && "We use the video transcript to build questions."}
            </div>
          </button>
        ))}
      </div>

      {input.sourceType === "text" && (
        <div className="mb-6">
          <label className="block text-sm mb-2 text-slate-300">Source Text</label>
          <textarea
            className="w-full min-h-[180px] rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            placeholder="Paste content here..."
            value={input.text}
            onChange={(e) => setInput((prev) => ({ ...prev, text: e.target.value }))}
          />
        </div>
      )}

      {input.sourceType === "file" && (
        <div className="mb-6">
          <label className="block text-sm mb-2 text-slate-300">Upload file</label>
          <div className="flex items-center gap-3">
            <input
              type="file"
              accept=".pdf,.docx,.png,.jpg,.jpeg,.txt"
              onChange={handleFileChange}
              className="text-sm text-slate-300"
            />
            {loading && <span className="text-xs text-slate-400">Extracting...</span>}
          </div>
          {input.text && (
            <p className="mt-2 text-xs text-emerald-400">
              Text extracted. You can proceed to settings.
            </p>
          )}
        </div>
      )}

      {input.sourceType === "youtube" && (
        <div className="mb-6">
          <label className="block text-sm mb-2 text-slate-300">YouTube URL</label>
          <input
            type="url"
            placeholder="https://www.youtube.com/watch?v=..."
            className="w-full rounded-lg border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/60"
            value={input.youtubeUrl}
            onChange={(e) =>
              setInput((prev) => ({
                ...prev,
                youtubeUrl: e.target.value,
              }))
            }
          />
        </div>
      )}

      {error && <p className="text-sm text-red-400 mb-4">{error}</p>}

      <PrimaryButton onClick={handleContinue}>Continue to Settings</PrimaryButton>
    </div>
  );
}

export default HomePage;


