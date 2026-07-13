// ─── Finance Agent (Gemini) ─────────────────────────────────────────────────
import { GoogleGenAI } from '@google/genai';

/**
 * Analyze campaign from a financial/budget optimization perspective.
 * Returns { recommendedBudget, status, reason, confidence }
 */
export async function runFinanceAgent(campaign) {
  // ── Mock mode ─────────────────────────────────────────────────────────────
  if (process.env.MOCK_AI === 'true') {
    return {
      recommendedBudget: Math.round(campaign.budget * 0.90),
      status: 'suggest',
      reason: `From a financial standpoint, the proposed budget of ₹${campaign.budget} for "${campaign.name}" could be optimized. Recommend a 10% reduction while maintaining ROI targets. Historical data suggests similar campaigns achieved comparable results at this level.`,
      confidence: 0.78,
    };
  }

  // ── Real Gemini call ──────────────────────────────────────────────────────
  const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

  const prompt = `You are a senior finance analyst. Evaluate the financial viability of this marketing campaign.

Campaign Details:
- Name: ${campaign.name}
- Product: ${campaign.product}
- Objective: ${campaign.objective}
- Target Audience: ${campaign.audience}
- Proposed Budget: ₹${campaign.budget}
- Duration: ${campaign.startDate} to ${campaign.endDate}

Consider ROI, cost efficiency, and budget optimization. 
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
      temperature: 0.5,
      maxOutputTokens: 300,
      responseMimeType: 'application/json',
    },
  });

  const text = response.text.trim();
  return JSON.parse(text);
}
