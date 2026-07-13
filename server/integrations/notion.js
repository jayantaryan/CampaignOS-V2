// ─── Notion Integration ─────────────────────────────────────────────────────
import { Client } from '@notionhq/client';

/**
 * Create a page in Notion database for an approved campaign.
 * Gracefully skips if Notion credentials are not configured.
 */
export async function sendToNotion(campaign) {
  const token = process.env.NOTION_TOKEN;
  const databaseId = process.env.NOTION_DATABASE_ID;

  if (!token || !databaseId) {
    console.log('ℹ️  Notion integration skipped (no token/database ID configured)');
    return null;
  }

  const notion = new Client({ auth: token });

  const response = await notion.pages.create({
    parent: { database_id: databaseId },
    properties: {
      Name: {
        title: [{ text: { content: `Campaign: ${campaign.name}` } }],
      },
      Product: {
        rich_text: [{ text: { content: campaign.product || 'N/A' } }],
      },
      Budget: {
        number: campaign.finalBudget || campaign.budget,
      },
      Status: {
        select: { name: campaign.status || 'approved' },
      },
      Audience: {
        rich_text: [{ text: { content: campaign.audience || 'N/A' } }],
      },
    },
  });

  console.log('📋  Notion page created:', response.id);
  return response;
}
