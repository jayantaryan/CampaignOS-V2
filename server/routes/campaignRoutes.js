// ─── Campaign Routes ────────────────────────────────────────────────────────
import { Router } from 'express';
import * as ctrl from '../controllers/campaignController.js';

const router = Router();

// CRUD
router.post('/',    ctrl.create);
router.get('/',     ctrl.list);
router.get('/:id',  ctrl.getById);

// Approval (mounted under /api/campaigns but uses /approve/:id path via server.js)
router.post('/approve/:id', ctrl.approve);

// Reject route
router.post('/reject/:id', ctrl.rejectCampaign);

export default router;
