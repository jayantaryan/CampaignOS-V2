// ─── Agent Routes ───────────────────────────────────────────────────────────
import { Router } from 'express';
import * as ctrl from '../controllers/agentController.js';

const router = Router();

// POST /api/campaigns/:id/agents    – trigger all AI agents
router.post('/:id/agents',    ctrl.runAgents);

// POST /api/campaigns/:id/consensus – compute final consensus
router.post('/:id/consensus', ctrl.getConsensus);

export default router;
