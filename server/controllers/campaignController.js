// ─── Campaign Controller ────────────────────────────────────────────────────
import * as svc from '../services/campaignService.js';
import { sendToNotion }  from '../integrations/notion.js';
import { sendToSlack }   from '../integrations/slack.js';
import { sendApprovalEmail } from '../integrations/email.js';

/**
 * POST /api/campaigns – Create a new campaign.
 */
export async function create(req, res) {
  try {
    const { name, product, objective, audience, budget, startDate, endDate } = req.body;

    if (!name) {
      return res.status(400).json({ error: 'Campaign name is required' });
    }

    const campaign = svc.insertCampaign({
      name,
      product:   product   || '',
      objective: objective || '',
      audience:  audience  || '',
      budget:    Number(budget) || 0,
      startDate: startDate || '',
      endDate:   endDate   || '',
    });

    // 👇 NEW: Force the status to pending and log it to Notion immediately
    campaign.status = 'pending'; 
    sendToNotion(campaign).catch(err => console.error('Notion pending log failed:', err.message));

    res.status(201).json(campaign);
  } catch (err) {
    console.error('Create campaign error:', err);
    res.status(500).json({ error: 'Failed to create campaign' });
  }
}

/**
 * GET /api/campaigns – List all campaigns.
 */
export function list(_req, res) {
  try {
    const campaigns = svc.getAllCampaigns();
    res.json(campaigns);
  } catch (err) {
    console.error('List campaigns error:', err);
    res.status(500).json({ error: 'Failed to list campaigns' });
  }
}

/**
 * GET /api/campaigns/:id – Get a single campaign with agent results.
 */
export function getById(req, res) {
  try {
    const campaign = svc.getCampaignById(Number(req.params.id));
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });
    res.json(campaign);
  } catch (err) {
    console.error('Get campaign error:', err);
    res.status(500).json({ error: 'Failed to get campaign' });
  }
}

/**
 * POST /api/approve/:id – Approve a campaign and fire integrations.
 */
export async function approve(req, res) {
  try {
    const id = Number(req.params.id);
    const campaign = svc.getCampaignById(id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    // Update status to approved
    const updated = svc.updateCampaignStatus(id, 'approved');

    // Fire-and-forget integrations (don't block the response)
    Promise.allSettled([
      sendToNotion(updated),
      sendToSlack(updated),
      sendApprovalEmail(updated),
    ]).then(results => {
      results.forEach((r, i) => {
        const names = ['Notion', 'Slack', 'Email'];
        if (r.status === 'rejected') {
          console.warn(`⚠️  ${names[i]} integration failed:`, r.reason?.message || r.reason);
        } else {
          console.log(`✅  ${names[i]} integration succeeded`);
        }
      });
    });

    res.json({ message: 'Campaign approved', campaign: updated });
  } catch (err) {
    console.error('Approve campaign error:', err);
    res.status(500).json({ error: 'Failed to approve campaign' });
  }
}

/**
 * POST /api/campaigns/reject/:id – Reject a campaign.
 */
export async function rejectCampaign(req, res) {
  try {
    const id = Number(req.params.id);
    const campaign = svc.getCampaignById(id);
    if (!campaign) return res.status(404).json({ error: 'Campaign not found' });

    // Update status to rejected
    const updated = svc.updateCampaignStatus(id, 'rejected');

    // 👇 NEW: Fire integrations for the rejection!
    Promise.allSettled([
      sendToNotion(updated),
      sendToSlack(updated),
      sendApprovalEmail(updated),
    ]).then(results => {
      results.forEach((r, i) => {
        const names = ['Notion', 'Slack', 'Email'];
        if (r.status === 'rejected') {
          console.warn(`⚠️  ${names[i]} integration failed:`, r.reason?.message || r.reason);
        } else {
          console.log(`✅  ${names[i]} integration succeeded (Rejected)`);
        }
      });
    });

    res.json({ message: 'Campaign rejected', campaign: updated });
  } catch (err) {
    console.error('Reject campaign error:', err);
    res.status(500).json({ error: 'Failed to reject campaign' });
  }
}