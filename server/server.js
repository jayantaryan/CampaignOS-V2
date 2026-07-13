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
