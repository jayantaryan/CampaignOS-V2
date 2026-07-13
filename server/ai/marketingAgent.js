// ─── Marketing Agent (Gemini) ───────────────────────────────────────────────
// server/ai/marketingAgent.js
import { GoogleGenAI } from '@google/genai';
import { MARKETING_PROMPT } from '../services/agentPrompts.js';
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const runMarketingAgent = async (campaign) => {
  // Fallback if we want to test without using API credits
  if (process.env.MOCK_AI === 'true') {
    return { decision: "Approve", reason: "Mock AI: Marketing loves the broad reach.", recommended_budget: campaign.budget + 5000, confidence: 0.85 };
  }

  try {
    // 1. Inject the real campaign data into the prompt
    const prompt = MARKETING_PROMPT
      .replace('{{name}}', campaign.name)
      .replace('{{budget}}', campaign.budget)
      .replace('{{objective}}', campaign.objective || 'N/A')
      .replace('{{audience}}', campaign.audience || 'N/A');

    // 2. Call Gemini
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    // 3. Parse and return the JSON
    return JSON.parse(response.text);
  } catch (error) {
    console.error("Marketing Agent Error:", error);
    return { decision: "Error", reason: "AI generation failed.", recommended_budget: 0, confidence: 0 };
  }
};