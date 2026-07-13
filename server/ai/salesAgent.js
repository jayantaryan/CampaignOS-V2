// ─── Sales Agent (Gemini) ───────────────────────────────────────────────────
import { GoogleGenAI } from '@google/genai';

/**
 * Analyze campaign from a sales/revenue growth perspective.
 * Returns { recommendedBudget, status, reason, confidence }
 */
export async function runSalesAgent(campaign) {
  // ── Mock mode ─────────────────────────────────────────────────────────────
  if (process.env.MOCK_AI === 'true') {
    return {
      recommendedBudget: Math.round(campaign.budget * 1.05),
      status: 'approve',
      reason: `The "${campaign.name}" campaign has strong potential for pipeline growth in the ${campaign.audience || 'target'} segment. A modest 5% budget increase to ₹${Math.round(campaign.budget * 1.05)} would help capture additional market share for ${campaign.product || 'the product'}.`,
      confidence: 0.82,
    };
  }

  // ── Real Gemini call ──────────────────────────────────────────────────────
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `You are a senior sales strategist. Evaluate this campaign from a revenue and pipeline growth perspective.

Campaign Details:
- Name: ${campaign.name}
- Product: ${campaign.product}
- Objective: ${campaign.objective}
- Target Audience: ${campaign.audience}
- Proposed Budget: ₹${campaign.budget}
- Duration: ${campaign.startDate} to ${campaign.endDate}

Consider lead generation, conversion potential, and market penetration.
Respond ONLY with valid JSON (no markdown):
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
      temperature: 0.6,
      maxOutputTokens: 300,
      responseMimeType: 'application/json',
    },
  });

  const text = response.text.trim();
  return JSON.parse(text);
}
