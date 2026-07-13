// ─── Campaign Service – Database Operations ────────────────────────────────
import { run, all, get } from '../db/database.js';

/**
 * Insert a new campaign and return the created record.
 */
export function insertCampaign({ name, product, objective, audience, budget, startDate, endDate }) {
  const { lastId } = run(
    `INSERT INTO campaigns (name, product, objective, audience, budget, startDate, endDate)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
    [name, product, objective, audience, budget, startDate, endDate]
  );
  return getCampaignById(lastId);
}

/**
 * Retrieve all campaigns, newest first.
 */
export function getAllCampaigns() {
  return all('SELECT * FROM campaigns ORDER BY id DESC');
}

/**
 * Retrieve a single campaign by ID, with its agent results attached.
 */
export function getCampaignById(id) {
  const campaign = get('SELECT * FROM campaigns WHERE id = ?', [id]);
  if (!campaign) return null;

  campaign.agentResults = all(
    'SELECT * FROM agent_results WHERE campaignId = ? ORDER BY id',
    [id]
  );

  return campaign;
}

/**
 * Update campaign status (pending → approved / rejected / needs_review).
 */
export function updateCampaignStatus(id, status) {
  run(
    `UPDATE campaigns SET status = ?, updatedAt = datetime('now') WHERE id = ?`,
    [status, id]
  );
  return getCampaignById(id);
}

/**
 * Store consensus results on the campaign record.
 */
export function updateCampaignConsensus(id, { finalBudget, finalStatus, explanation }) {
  run(
    `UPDATE campaigns
        SET finalBudget  = ?,
            finalStatus  = ?,
            explanation  = ?,
            updatedAt    = datetime('now')
      WHERE id = ?`,
    [finalBudget, finalStatus, explanation, id]
  );
  return getCampaignById(id);
}

/**
 * Insert a single agent result row.
 */
export function insertAgentResult(campaignId, { agentName, recommendedBudget, status, reason, confidence }) {
  run(
    `INSERT INTO agent_results (campaignId, agentName, recommendedBudget, status, reason, confidence)
     VALUES (?, ?, ?, ?, ?, ?)`,
    [campaignId, agentName, recommendedBudget, status, reason, confidence]
  );
}

/**
 * Retrieve all agent results for a campaign.
 */
export function getAgentResults(campaignId) {
  return all('SELECT * FROM agent_results WHERE campaignId = ? ORDER BY id', [campaignId]);
}

/**
 * Clear previous agent results for a campaign (useful when re-running agents).
 */
export function clearAgentResults(campaignId) {
  run('DELETE FROM agent_results WHERE campaignId = ?', [campaignId]);
}
