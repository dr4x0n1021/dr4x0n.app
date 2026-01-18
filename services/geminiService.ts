
import { GoogleGenAI } from "@google/genai";

export const getHackingAdvice = async (topic: string): Promise<string> => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Kiberxavfsizlik bo'yicha qisqa va qiziqarli maslahat bering (o'zbek tilida). Mavzu: ${topic}`,
    });
    return response.text || "Yangi ma'lumot yuklanmoqda...";
  } catch (error) {
    return "Tizimda vaqtinchalik uzilish...";
  }
};
