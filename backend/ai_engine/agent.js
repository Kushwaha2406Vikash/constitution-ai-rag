import * as dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { transformQuery } from "./queryRewriter.js";
import { fetchContext } from "./ragEngine.js";
import { SYSTEM_PROMPT } from "./systemPrompt.js";

dotenv.config();
if (!process.env.GEMINI_API_KEY) {
  console.log("Api key is not valid");
}

const History = [];
const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Parse AI response into structured JSON
function parseStructuredAnswer(answerText) {
  const result = {
    shortAnswer: "",
    detailedExplanation: "",
    references: [],
  };

  const shortAnswerMatch = answerText.match(
    /\*\*Short Answer:\*\*\s*(.*?)(?=\*\*Detailed Explanation:\*\*|$)/s
  );
  if (shortAnswerMatch) {
    result.shortAnswer = shortAnswerMatch[1].trim();
  }

  const detailedAnswerMatch = answerText.match(
    /\*\*Detailed Explanation:\*\*\s*(.*?)(?=\*\*References:\*\*|$)/s
  );
  if (detailedAnswerMatch) {
    result.detailedExplanation = detailedAnswerMatch[1].trim();
  }

  const referencesMatch = answerText.match(
    /\*\*References:\*\*\s*((?:.|\n)*)$/s
  );
  if (referencesMatch) {
    const referencesText = referencesMatch[1].trim();
    result.references = referencesText
      .split(/\n\s*\*\s+/)
      .map((ref) => ref.trim())
      .filter((ref) => ref.length > 0 && !ref.includes("**"));
  }

  return result;
}

export async function chatting(question) {
  try {
    const query = await transformQuery(question);
    const context = await fetchContext(query);

    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });

    History.push({
      role: "user",
      parts: [{ text: query }],
    });

    const response = await model.generateContent({
      contents: History,
      systemInstruction: `
${SYSTEM_PROMPT}

Context:
${context}

⚠️ IMPORTANT:
- Always respond in the SAME language as the user’s question.  
- Output format must follow strictly:

**Short Answer:** <short answer in user’s language>  
**Detailed Explanation:** <detailed explanation in user’s language>  
**References:** <reference in user’s language > 
`,
    });

    const finalAnswer = response.response.text();
    console.log("AI Raw Answer:\n", finalAnswer);

    const parsedResponse = parseStructuredAnswer(finalAnswer);
    History.pop();
    return {
      shortAnswer: parsedResponse.shortAnswer,
      detailedExplanation: parsedResponse.detailedExplanation,
      references: parsedResponse.references,
    };
  } catch (error) {
    console.error("Error in chatting function:", error);
    return {
      shortAnswer:
        "I encountered an error while trying to generate a response. Please try again.",
      detailedExplanation: "",
      references: [],
    };
  }
}
