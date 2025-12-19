
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
    return "无法加载 AI 总结。";
  }
};

export const generateAIDescription = async (title: string, url: string) => {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `我正在添加一个名为 "${title}" (URL: ${url}) 的资源到我的导航站。
      请为这个资源写一段简洁的中文介绍。
      要求：字数在 50 字以内，语气专业且客观，直接返回内容，不要带引号。`,
    });
    return response.text.replace(/^["']|["']$/g, '');
  } catch (error) {
    console.error("Gemini description generation failed:", error);
    return "";
  }
};
