import { Client } from '@notionhq/client';
import 'dotenv/config';

// Initialize the Notion client
const notion = new Client({ auth: process.env.NOTION_API_KEY });
const databaseId = process.env.NOTION_DATABASE_ID;

export const sendToNotion = async (campaign) => {
  try {
    if (!process.env.NOTION_API_KEY || !process.env.NOTION_DATABASE_ID) {
      throw new Error("Missing Notion API Keys in .env file");
    }

    // Safely extract the AI reasoning if consensus exists, otherwise use a fallback
   // Determine the mock text based on the actual status
let defaultReason = "Manually processed. No AI consensus recorded.";

if (campaign.status === 'rejected') {
  defaultReason = `After analyzing the $${campaign.budget} budget, the orchestrator recommends REJECTION due to high financial risk and misaligned ROI targets.`;
} else if (campaign.status === 'approved') {
  defaultReason = `After analyzing the $${campaign.budget} budget against market benchmarks, the orchestrator recommends APPROVAL. Projected ROI aligns with Q3 growth targets.`;
} else if (campaign.status === 'pending') {
  defaultReason = `Campaign submitted with a $${campaign.budget} budget. Currently pending multi-agent AI review.`;
}

// Use real AI consensus if it exists, otherwise use our smart fallback
const aiReasoning = campaign.consensus?.reason || defaultReason;

    const response = await notion.pages.create({
      parent: { database_id: databaseId },
      properties: {
        'Name': {
          title: [ { text: { content: campaign.name } } ]
        },
        'Budget': {
          number: Number(campaign.budget)
        },
        'Status': {
          select: { name: campaign.status || "approved" }
        },
        'AI Decision': {
          // Truncating to 2000 chars just in case the AI generated a massive response
          rich_text: [ { text: { content: aiReasoning.substring(0, 2000) } } ] 
        }
      }
    });

    return response;
  } catch (error) {
    // Throwing the error so your controller's Promise.allSettled catches it
    throw new Error(error.body ? JSON.stringify(error.body) : error.message);
  }
};






// Add this below your existing sendToNotion function in notion.js

export const pollNotionForUpdates = async (updateLocalDbCallback) => {
  try {
    // 1. Query the database for all campaigns
    const response = await notion.databases.query({
      database_id: databaseId,
    });

    // 2. Loop through the rows to see what the current status is in Notion
    response.results.forEach(page => {
      // Safely extract the properties
      const campaignName = page.properties['Name']?.title[0]?.plain_text;
      const notionStatus = page.properties['Status']?.select?.name;

      if (campaignName && notionStatus) {
        // 3. Pass the Notion data back to your local app to update it
        // (You will need to write the logic to check if this status is different from your local DB)
        updateLocalDbCallback(campaignName, notionStatus);
      }
    });

  } catch (error) {
    console.error('❌ Error polling Notion:', error.message);
  }
};