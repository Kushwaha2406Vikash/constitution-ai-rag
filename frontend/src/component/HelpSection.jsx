import React, { useState, useEffect } from "react";

const HelpSection = () => {
  const exampleQuestions = [
    "What are the fundamental rights outlined in the Constitution?",
    "Explain the role of the President of India.",
    "How can the Indian Constitution be amended?",
  ];

  const [toastMessage, setToastMessage] = useState("");

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setToastMessage("✅ Copied: " + text);

    // Hide toast after 3 seconds
    setTimeout(() => {
      setToastMessage("");
    }, 3000);
  };

  return (
    <div className="mt-8 px-4 sm:px-8 md:px-12 lg:px-24">
      <h3 className="text-lg sm:text-xl md:text-2xl font-bold text-white mb-4 ">
        Need help? Try these questions:
      </h3>
      <ul
        id="example-questions"
        className="space-y-3 text-slate-600 text-sm sm:text-base md:text-lg "
      >
        {exampleQuestions.map((question, index) => (
          <li
            key={index}
            onClick={() => handleCopy(question)}
            className="cursor-pointer hover:text-slate-800 hover:font-semibold 
                       transition-colors duration-200 p-2 rounded-lg bg-amber-100 
                       border border-blue-400 shadow-emerald-800 shadow-2xl select-none"
          >
            {question}
          </li>
        ))}
      </ul>

      {/* ✅ Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 bg-slate-800 text-white px-4 py-2 rounded-xl shadow-lg text-sm sm:text-base animate-fade-in">
          {toastMessage}
        </div>
      )}
    </div>
  );
};

export default HelpSection;
