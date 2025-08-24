import { useState } from "react";
import ResponseSection from "./ResponseSection";
const API_BASE_URL = import.meta.env.VITE_API_URL;
const ConstitutionQuery = () => {
  const [question, setQuestion] = useState("");
  const [responseData, setResponseData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleAsk = async () => {
    if (!question.trim()) {
      setError("Please enter a question before submitting.");
      return;
    }

    setLoading(true);
    setError("");
    setResponseData(null);
    

    try {
      const response = await fetch(`${API_BASE_URL}/api/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: question }),
      });

      const aimessage = await response.json();
      const responsedata = aimessage.data;

      if (response.ok && aimessage.success) {
        setResponseData(responsedata);
      } else {
        setError(aimessage.message || "Something went wrong");
      }
    } catch (err) {
      setError("Server error. Please try again later.");
      console.error("Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="space-y-6 px-4 sm:px-8 md:px-16 lg:px-32 xl:px-48 py-6 mt-0">
      {/* Sticky Query Input + Button + Error */}
      <div className="sticky top-0 z-50 bg-[#bfcacb] bg-opacity-90 backdrop-blur-md p-4 rounded-xl ">
        {/* Input Section */}
        <div>
          <label
            htmlFor="query-input"
            className="block text-slate-700 font-semibold mb-2 text-base sm:text-lg md:text-xl"
          >
            Enter your question about the Indian Constitution:
          </label>
          <textarea
            id="query-input"
            rows="2"
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            className="w-full px-4 py-3 rounded-2xl border-2 border-slate-300 
           
            focus:outline-none focus:border-slate-500 
            transition-colors duration-200 resize-none bg-white 
            placeholder-slate-400 text-sm sm:text-base md:text-lg"
            placeholder="e.g., What are the fundamental rights?"
          ></textarea>
        </div>

        {/* Button Section */}
        <div className="text-center mt-4">
          <button
            onClick={handleAsk}
            disabled={loading}
            className="w-full sm:w-auto px-6 sm:px-8 py-3 
  bg-slate-800 text-white font-bold rounded-2xl 
  transition-all duration-200 transform 
  hover:bg-[#0ef] hover:text-slate-900 
  hover:border-2 hover:border-[#0ef] 
  hover:shadow-lg hover:shadow-[#0ef]/70 hover:scale-105
  disabled:opacity-50 disabled:cursor-not-allowed
  text-sm sm:text-base md:text-lg"
          >
            {loading ? "Asking..." : "Ask Constitution AI"}
          </button>
        </div>

        {/* Error Section */}
        {error && (
          <p className="text-red-500 text-center font-medium mt-2">{error}</p>
        )}
      </div>

      {/* Scrollable Response Section */}
      {responseData && (
        <div className="mt-6">
          <ResponseSection response={responseData} />
        </div>
      )}
    </main>
  );
};

export default ConstitutionQuery;
