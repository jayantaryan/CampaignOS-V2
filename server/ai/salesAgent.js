// ─── Sales Agent (Gemini) ───────────────────────────────────────────────────
// server/ai/salesAgent.js
import { GoogleGenAI } from '@google/genai';
import { SALES_PROMPT } from '../services/agentPrompts.js';
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

// 👇 Notice this is now runSalesAgent
export const runSalesAgent = async (campaign) => {
  if (process.env.MOCK_AI === 'true') {
    return { decision: "Approve", reason: "Mock AI: Sales sees high conversion potential.", recommended_budget: campaign.budget, confidence: 0.88 };
  }

  try {
    const prompt = SALES_PROMPT
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
    console.error("Sales Agent Error:", error);
    return { decision: "Error", reason: "AI generation failed.", recommended_budget: 0, confidence: 0 };
  }
};