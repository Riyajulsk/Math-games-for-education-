
import { GoogleGenAI } from "@google/genai";

export async function getStepByStepSolution(question: string, answer: number) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Explain the step-by-step logic to solve this math problem: ${question}. The answer is ${answer}. Make it simple and educational.`,
      config: {
        temperature: 0.7,
        maxOutputTokens: 500,
        thinkingConfig: { thinkingBudget: 100 },
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Could not generate explanation at this time. Try again later.";
  }
}

export async function getCustomMathTrick(topic: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Provide a clever mental math trick or shortcut for ${topic}. Include an example.`,
      config: {
        temperature: 1,
        maxOutputTokens: 300,
        thinkingConfig: { thinkingBudget: 50 },
      }
    });
    return response.text;
  } catch (error) {
    console.error("Gemini Error:", error);
    return "Keep practicing to find your own patterns!";
  }
}
