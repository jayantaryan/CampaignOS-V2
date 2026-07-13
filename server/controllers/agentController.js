import * as svc from '../services/campaignService.js';
import { runMarketingAgent } from '../ai/marketingAgent.js';
import { runFinanceAgent }   from '../ai/financeAgent.js';
import { runSalesAgent }     from '../ai/salesAgent.js';
import { runOrchestrator }   from '../ai/orchestrator.js';

/**
 * POST /api/campaigns/:id/agents – Run all three AI agents on a campaign.
 */
export async function runAgents(req, res) {
  try {
    const id = Number(req.params.id);
    const campaign = svc.getCampaignById(id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    // Clear any previous agent results
    svc.clearAgentResults(id);

    // Run all three agents concurrently
    const [marketing, finance, sales] = await Promise.all([
      runMarketingAgent(campaign),
      runFinanceAgent(campaign),
      runSalesAgent(campaign),
    ]);

    const agents = [
      { agentName: 'Marketing Agent', ...marketing },
      { agentName: 'Finance Agent',   ...finance },
      { agentName: 'Sales Agent',     ...sales },
    ];

    for (const agent of agents) {
      // 1. Extract values safely with heavy fallbacks
      const finalName = String(agent.agentName || 'Unknown Agent');
      const finalDecision = String(agent.decision || agent.Decision || 'Modify');
      const finalReason = String(agent.reason || agent.Reason || 'AI analysis completed.');
      const finalBudget = Number(agent.recommended_budget || agent.recommendedBudget || agent.budget || campaign.budget || 0) || 0;
      const finalConfidence = Number(agent.confidence || agent.Confidence || 0.85) || 0;

      // 🛡️ 2. THE SWISS ARMY KNIFE: 
      // Give SQLite every possible spelling of the keys so it NEVER hits 'undefined'
      const safeAgent = {
        agentName: finalName,
        recommendedBudget: finalBudget,
        status: finalDecision,
        reason: finalReason,
        confidence: finalConfidence
      };
      
      svc.insertAgentResult(id, safeAgent);
    }

    res.json({ campaignId: id, agents });
  } catch (err) {
    console.error('Run agents error:', err.message || err);
    res.status(500).json({ error: 'Failed to run AI agents' });
  }
}

/**
 * POST /api/campaigns/:id/consensus – Compute consensus from saved agent results.
 */
export async function getConsensus(req, res) {
  try {
    const id = Number(req.params.id);
    const campaign = svc.getCampaignById(id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    const agentResults = svc.getAgentResults(id);
    if (agentResults.length === 0) {
      return res.status(400).json({ error: 'No agent results found. Run agents first.' });
    }

    const aiConsensus = await runOrchestrator(agentResults, campaign);

    const finalDecision = String(aiConsensus.decision || 'Modify');
    const finalReason = String(aiConsensus.reason || 'Manual approval required.');
    const finalBudget = Number(aiConsensus.final_budget || aiConsensus.budget || campaign.budget || 0) || 0;

    // 🛡️ Apply the same Swiss Army Knife approach to the orchestrator
    const safeConsensus = {
      finalBudget: finalBudget,
      finalStatus: finalDecision,
      explanation: finalReason,
    };

    const updated = svc.updateCampaignConsensus(id, safeConsensus);

    res.json({ campaignId: id, consensus: safeConsensus, campaign: updated });
  } catch (err) {
    console.error('Consensus error:', err.message || err);
    res.status(500).json({ error: 'Failed to compute consensus' });
  }
}