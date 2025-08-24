import React, { useState } from "react";

// Function to clean and format response text with highlighted text
const formatResponseText = (text) => {
  if (!text) return "";

  let formattedText = text.replace(
    /\*\*\*(.*?)\*\*\*/g,
    '<strong class="text-slate-800 font-bold">$1</strong>'
  );

  formattedText = formattedText.replace(/\*/g, "");

  const lines = formattedText.split("\n").filter((line) => line.trim() !== "");

  let result = "";
  lines.forEach((line) => {
    const headingMatch = line.match(/^(\d+\.\s+)(.*)/);
    if (headingMatch) {
      result += `<p class="mt-4 mb-2 font-bold text-lg">${headingMatch[1]} ${headingMatch[2]}</p>`;
    } else {
      result += `<p class="my-1">${line}</p>`;
    }
  });

  return result;
};

const formatReferences = (refs) => {
  if (!Array.isArray(refs) || refs.length === 0)
    return "The related constitutional articles and sections will appear here. Click to view in detail.";

  return refs.map((ref) => `• ${ref.trim()}`).join("\n");
};

const ResponseSection = ({ response }) => {
  const [expandedCard, setExpandedCard] = useState("");
  const [modalContent, setModalContent] = useState(null);
  const [copied, setCopied] = useState("");

  if (!response) return null;

  const short_answer = response.shortAnswer
    ? formatResponseText(response.shortAnswer)
    : "";

  const detailed_answer = response.detailedExplanation
    ? formatResponseText(response.detailedExplanation)
    : "";

  const references = formatReferences(response.references);

  const toggleCard = (card) => {
    setExpandedCard(expandedCard === card ? "" : card);
  };

  const copyToClipboard = (text, cardKey) => {
    navigator.clipboard.writeText(text).then(() => {
      setCopied(cardKey);
      setTimeout(() => setCopied(""), 2000);
    });
  };

  const renderCard = (title, content, cardKey, isHTML = false) => (
    <div
      onClick={() => toggleCard(cardKey)}
      className="bg-slate-50 border border-slate-200 rounded-2xl p-6 transition-all duration-500 cursor-pointer hover:shadow-lg relative"
    >
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-bold text-slate-800 mb-2">{title}</h3>
        <div className="flex items-center gap-3">
          <button
            onClick={(e) => {
              e.stopPropagation();
              copyToClipboard(
                isHTML ? content.replace(/<[^>]+>/g, "") : content,
                cardKey
              );
            }}
            className="px-3 py-1 bg-slate-200 text-slate-700 rounded-lg text-sm hover:bg-slate-300 transition"
          >
            {copied === cardKey ? "✅ Copied!" : "📋 Copy"}
          </button>
          <span
            className={`text-slate-800 text-xl font-bold transition-transform duration-300 ${
              expandedCard === cardKey ? "rotate-180" : "rotate-0"
            }`}
          >
            ▼
          </span>
        </div>
      </div>

      {isHTML ? (
        <div
          className={`text-slate-700 text-base sm:text-lg leading-relaxed overflow-hidden transition-all duration-500 ${
            expandedCard === cardKey ? "max-h-[2000px]" : "line-clamp-3"
          }`}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      ) : (
        <div
          className={`text-slate-700 text-base sm:text-lg leading-relaxed overflow-hidden transition-all duration-500 whitespace-pre-line ${
            expandedCard === cardKey ? "max-h-[3000px]" : "line-clamp-3"
          }`}
        >
          {content}
        </div>
      )}
    </div>
  );

  return (
    <div className="space-y-6 px-4 sm:px-8 md:px-12 lg:px-24 py-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderCard("📖 Short Answer", short_answer, "short", true)}
        {renderCard("🔗 Reference", references, "reference")}
      </div>

      {renderCard("📜 Detailed Explanation", detailed_answer, "detailed", true)}

      {modalContent && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-white rounded-2xl p-6 max-w-lg w-full shadow-xl relative">
            <h2 className="text-2xl font-bold mb-4">{modalContent.title}</h2>
            <p className="text-slate-700 text-base leading-relaxed whitespace-pre-line">
              {modalContent.content}
            </p>
            <button
              onClick={() => setModalContent(null)}
              className="mt-6 px-6 py-2 bg-slate-800 text-white rounded-xl hover:bg-slate-700 transition"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ResponseSection;
