
import { GoogleGenAI } from "@google/genai";

export const getSmartSummary = async (title: string, description: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `请简要分析并扩充以下资源（${title}：${description}）的优势和适用场景。
      请直接输出三点关键内容，使用中文，总字数在 100 字以内。`,
    });
    return response.text;
  } catch (error) {
    console.error("Gemini summary failed:", error);
    return "无法加载 AI 总结。请直接访问该资源以获取详情。";
  }
};
