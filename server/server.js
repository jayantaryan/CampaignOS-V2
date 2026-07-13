// ─── CampaignOS Server Entry Point ─────────────────────────────────────────
import 'dotenv/config';
import express from 'express';
import cors    from 'cors';

// Import database initializer
import { initDatabase } from './db/database.js';

// Import route modules
import campaignRoutes from './routes/campaignRoutes.js';
import agentRoutes    from './routes/agentRoutes.js';

const app  = express();
const PORT = process.env.PORT || 5000;

// ─── Middleware ────────────────────────────────────────────────────────────
app.use(cors());
app.use(express.json());

// ─── Request Logger (dev convenience) ─────────────────────────────────────
app.use((req, _res, next) => {
  console.log(`${new Date().toISOString()}  ${req.method}  ${req.url}`);
  next();
});

// ─── Routes ───────────────────────────────────────────────────────────────
app.use('/api/campaigns', campaignRoutes);
app.use('/api/campaigns', agentRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// ─── Initialize DB then Start Server ──────────────────────────────────────
async function start() {
  await initDatabase();

  app.listen(PORT, () => {
    console.log(`\n🚀  CampaignOS server running on http://localhost:${PORT}`);
    console.log(`    Mock AI mode: ${process.env.MOCK_AI === 'true' ? 'ON' : 'OFF'}\n`);
  });
}

start().catch(err => {
  console.error('Failed to start server:', err);
  process.exit(1);
});





// Add these imports at the top of server.js
import { pollNotionForUpdates } from './integrations/notion.js';
import * as svc from './services/campaignService.js';

// ... your existing middleware and routes ...

// Add this right before your app.listen() block:
const START_POLLING = false; // Set to true when you are ready to test!

if (START_POLLING) {
  console.log("⏱️  Notion Polling Engine Started...");
  
  setInterval(() => {
    pollNotionForUpdates((campaignName, notionStatus) => {
      // Find the campaign in your local mock database by its name
      const allCampaigns = svc.getAllCampaigns();
      const localCampaign = allCampaigns.find(c => c.name === campaignName);
      
      // If the status in Notion is different than our local status, update it!
      if (localCampaign && localCampaign.status !== notionStatus) {
        console.log(`🔄 Notion Sync: Updating "${campaignName}" to ${notionStatus}`);
        svc.updateCampaignStatus(localCampaign.id, notionStatus);
      }
    });
  }, 10000); // Runs every 10,000 milliseconds (10 seconds)
}
