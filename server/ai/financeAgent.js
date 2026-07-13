// ─── Finance Agent (Gemini) ─────────────────────────────────────────────────
// server/ai/financeAgent.js
import { GoogleGenAI } from '@google/genai';
import { FINANCE_PROMPT } from '../services/agentPrompts.js';
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 👇 Notice this is now runFinanceAgent
export const runFinanceAgent = async (campaign) => {
  if (process.env.MOCK_AI === 'true') {
    return { decision: "Modify", reason: "Mock AI: Finance recommends a 10% budget cut.", recommended_budget: campaign.budget * 0.9, confidence: 0.90 };
  }

  try {
    const prompt = FINANCE_PROMPT
      .replace('{{name}}', campaign.name)
      .replace('{{budget}}', campaign.budget)
      .replace('{{objective}}', campaign.objective || 'N/A')
      .replace('{{audience}}', campaign.audience || 'N/A');

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Finance Agent Error:", error);
    return { decision: "Error", reason: "AI generation failed.", recommended_budget: 0, confidence: 0 };
  }
};