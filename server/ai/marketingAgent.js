// ─── Marketing Agent (Gemini) ───────────────────────────────────────────────
import { GoogleGenAI } from '@google/genai';

/**
 * Analyze campaign from a marketing strategy perspective.
 * Returns { recommendedBudget, status, reason, confidence }
 */
export async function runMarketingAgent(campaign) {
  // ── Mock mode ─────────────────────────────────────────────────────────────
  if (process.env.MOCK_AI === 'true') {
    return {
      recommendedBudget: Math.round(campaign.budget * 1.15),
      status: 'approve',
      reason: `The campaign "${campaign.name}" targeting ${campaign.audience || 'broad audience'} aligns well with current market trends. A 15% budget increase is recommended to maximize reach and engagement for the ${campaign.product || 'product'} launch.`,
      confidence: 0.87,
    };
  }

  // ── Real Gemini call ──────────────────────────────────────────────────────
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `You are a senior marketing strategist. Analyze this campaign and provide your recommendation.

Campaign Details:
- Name: ${campaign.name}
- Product: ${campaign.product}
- Objective: ${campaign.objective}
- Target Audience: ${campaign.audience}
- Proposed Budget: ₹${campaign.budget}
- Duration: ${campaign.startDate} to ${campaign.endDate}

Respond ONLY with valid JSON (no markdown, no code fences):
{
  "recommendedBudget": <number>,
  "status": "approve" | "suggest" | "reject",
  "reason": "<2-3 sentence explanation>",
  "confidence": <0.0 to 1.0>
}`;

  const response = await ai.models.generateContent({
    model: 'gemini-2.0-flash',
    contents: prompt,
    config: {
      temperature: 0.7,
      maxOutputTokens: 300,
      responseMimeType: 'application/json',
    },
  });

  const text = response.text.trim();
  return JSON.parse(text);
}
