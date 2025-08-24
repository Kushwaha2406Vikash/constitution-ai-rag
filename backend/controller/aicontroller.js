// backend/controllers/aiController.js
import { chatting } from "../ai_engine/agent.js";

export const airesponse = async (req, res) => {
  try {
    const { text } = req.body; // 👈 expecting a "text" field
    console.log(text);
    if (!text) {
      return res.status(401).json({
        message: "Text is required",
      });
    }

    const finalAnswer = await chatting(text);
    // console.log(finalAnswer);
    return res.status(200).json({
      success: true,
      data: finalAnswer,
    });
  } catch (error) {
    console.error("Error in airesponse:", error);
    return res.status(500).json({
      success: false,
      message: "Internal server error",
      error: error.message,
    });
  }
};

export default airesponse;
