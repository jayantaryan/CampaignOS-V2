// ─── AI Orchestrator – Multi-Agent Consensus Engine ─────────────────────────

/**
 * Takes an array of agent results and the original campaign,
 * then computes a weighted consensus decision.
 *
 * @param {Array} agentResults  – rows from agent_results table
 * @param {Object} campaign     – the campaign record
 * @returns {{ finalBudget: number, finalStatus: string, explanation: string }}
 */
export function runOrchestrator(agentResults, campaign) {
  // ── Guard ─────────────────────────────────────────────────────────────────
  if (!agentResults || agentResults.length === 0) {
    return {
      finalBudget:  campaign.budget,
      finalStatus:  'needs_review',
      explanation:  'No agent results available for consensus.',
    };
  }

  // ── Weighted average budget (confidence-weighted) ─────────────────────────
  let totalWeight = 0;
  let weightedBudgetSum = 0;
  const statuses = [];

  for (const result of agentResults) {
    const weight = result.confidence || 0.5;
    totalWeight += weight;
    weightedBudgetSum += (result.recommendedBudget || campaign.budget) * weight;
    statuses.push(result.status);
  }

  const finalBudget = Math.round(weightedBudgetSum / totalWeight);

  // ── Determine final status ────────────────────────────────────────────────
  // If ANY agent rejects → needs_review
  // If ALL agents approve → approve
  // Otherwise → suggest (mixed signals)
  let finalStatus;
  if (statuses.includes('reject')) {
    finalStatus = 'needs_review';
  } else if (statuses.every(s => s === 'approve')) {
    finalStatus = 'approve';
  } else {
    finalStatus = 'suggest';
  }

  // ── Build explanation ─────────────────────────────────────────────────────
  const agentSummaries = agentResults.map(r =>
    `• ${r.agentName}: ₹${r.recommendedBudget?.toLocaleString()} (${r.status}, ${Math.round((r.confidence || 0) * 100)}% confident) – ${r.reason}`
  ).join('\n');

  const budgetDelta = finalBudget - campaign.budget;
  const deltaLabel  = budgetDelta >= 0
    ? `+₹${budgetDelta.toLocaleString()}`
    : `-₹${Math.abs(budgetDelta).toLocaleString()}`;

  const explanation = [
    `AI Consensus: ${finalStatus.toUpperCase()}`,
    `Original Budget: ₹${campaign.budget.toLocaleString()} → Recommended: ₹${finalBudget.toLocaleString()} (${deltaLabel})`,
    '',
    'Agent Breakdown:',
    agentSummaries,
    '',
    finalStatus === 'needs_review'
      ? '⚠️  One or more agents flagged concerns. Manual review recommended.'
      : finalStatus === 'approve'
        ? '✅  All agents agree – campaign is good to go.'
        : '💡  Mixed signals from agents. Consider adjustments before approval.',
  ].join('\n');

  return { finalBudget, finalStatus, explanation };
}
