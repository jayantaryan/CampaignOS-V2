// ─── Agent Controller ───────────────────────────────────────────────────────
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

    // Clear any previous agent results (allows re-running)
    svc.clearAgentResults(id);

    // Run all three agents concurrently
    const [marketing, finance, sales] = await Promise.all([
      runMarketingAgent(campaign),
      runFinanceAgent(campaign),
      runSalesAgent(campaign),
    ]);

    // Persist results
    const agents = [
      { agentName: 'Marketing Agent', ...marketing },
      { agentName: 'Finance Agent',   ...finance },
      { agentName: 'Sales Agent',     ...sales },
    ];

    for (const agent of agents) {
      svc.insertAgentResult(id, agent);
    }

    res.json({ campaignId: id, agents });
  } catch (err) {
    console.error('Run agents error:', err);
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

    // Run orchestrator
    const consensus = runOrchestrator(agentResults, campaign);

    // Save consensus to campaign
    const updated = svc.updateCampaignConsensus(id, consensus);

    res.json({ campaignId: id, consensus, campaign: updated });
  } catch (err) {
    console.error('Consensus error:', err);
    res.status(500).json({ error: 'Failed to compute consensus' });
  }
}
