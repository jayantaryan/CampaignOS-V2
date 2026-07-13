// ─── AI Orchestrator – Multi-Agent Consensus Engine ─────────────────────────

// server/ai/orchestrator.js
import { GoogleGenAI } from '@google/genai';
import 'dotenv/config';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const runOrchestrator = async (agentResults, campaign) => {
  if (process.env.MOCK_AI === 'true') {
    return { decision: "Approve", reason: "Mock AI: Executive consensus reached.", final_budget: campaign.budget };
  }

  const prompt = `
  You are the CEO (Orchestrator) of a company. 
  Review the following campaign proposal and the conflicting feedback from your 3 department heads (Marketing, Finance, Sales).
  
  Campaign Name: ${campaign.name}
  Original Budget: $${campaign.budget}
  
  Department Feedback:
  ${JSON.stringify(agentResults, null, 2)}
  
  Make a final executive decision. Respond ONLY in valid JSON format matching this structure:
  {
    "decision": "Approve" | "Reject" | "Modify",
    "reason": "Your final executive reasoning explaining how you resolved the conflict.",
    "final_budget": number
  }`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      }
    });

    return JSON.parse(response.text);
  } catch (error) {
    console.error("Orchestrator Error:", error);
    return { decision: "Error", reason: "Consensus failed.", final_budget: campaign.budget };
  }
};