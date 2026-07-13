// ─── Slack Webhook Integration ──────────────────────────────────────────────

/**
 * Send a notification to Slack via incoming webhook.
 * Gracefully skips if webhook URL is not configured.
 */
export async function sendToSlack(campaign) {
  const webhookUrl = process.env.SLACK_WEBHOOK_URL;

  if (!webhookUrl || webhookUrl.includes('YOUR')) {
    console.log('ℹ️  Slack integration skipped (no webhook URL configured)');
    return null;
  }

  const message = {
    text: `✅ *Campaign Approved*`,
    blocks: [
      {
        type: 'header',
        text: { type: 'plain_text', text: '🚀 Campaign Approved in CampaignOS', emoji: true },
      },
      {
        type: 'section',
        fields: [
          { type: 'mrkdwn', text: `*Campaign:*\n${campaign.name}` },
          { type: 'mrkdwn', text: `*Product:*\n${campaign.product || 'N/A'}` },
          { type: 'mrkdwn', text: `*Budget:*\n₹${(campaign.finalBudget || campaign.budget).toLocaleString()}` },
          { type: 'mrkdwn', text: `*Audience:*\n${campaign.audience || 'N/A'}` },
        ],
      },
      {
        type: 'context',
        elements: [
          { type: 'mrkdwn', text: `Approved at ${new Date().toISOString()}` },
        ],
      },
    ],
  };

  const response = await fetch(webhookUrl, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(message),
  });

  if (!response.ok) {
    throw new Error(`Slack webhook failed: ${response.status} ${response.statusText}`);
  }

  console.log('💬  Slack notification sent');
  return true;
}
