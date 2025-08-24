import { GoogleGenerativeAI } from "@google/generative-ai";
import * as dotenv from "dotenv";

dotenv.config();

const ai = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
const model = ai.getGenerativeModel({ model: "gemini-2.5-flash" });
const tempHistory = [];
export async function transformQuery(question) {
  try {
    tempHistory.push({
      role: "user",
      parts: [{ text: question }],
    });

    const response = await model.generateContent({
      contents: tempHistory,
      systemInstruction: {
        role: "system",
        parts: [
          {
            text: `You are a query rewriting expert. Based on the provided chat history, rephrase the "Follow Up user Question" into a complete, standalone question that can be understood without the chat history.
Only output the rewritten question and nothing else.`,
          },
        ],
      },
    });

    tempHistory.pop();

    return response.response.text().trim();
  } catch (err) {
    console.error("❌ Error in transformQuery:", err);
    return question; // fallback to original
  }
}
