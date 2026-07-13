// ─── API Service – Client-side API calls ────────────────────────────────────
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: { 'Content-Type': 'application/json' },
});

// ── Campaigns ───────────────────────────────────────────────────────────────
export async function createCampaign(data) {
  const res = await api.post('/campaigns', data);
  return res.data;
}

export async function getCampaigns() {
  const res = await api.get('/campaigns');
  return res.data;
}

export async function getCampaign(id) {
  const res = await api.get(`/campaigns/${id}`);
  return res.data;
}

// ── AI Agents ───────────────────────────────────────────────────────────────
export async function triggerAgents(id) {
  const res = await api.post(`/campaigns/${id}/agents`);
  return res.data;
}

export async function getConsensus(id) {
  const res = await api.post(`/campaigns/${id}/consensus`);
  return res.data;
}

// ── Approval ────────────────────────────────────────────────────────────────
export async function approveCampaign(id) {
  const res = await api.post(`/campaigns/approve/${id}`);
  return res.data;
}

export async function rejectCampaignApi(id) {
  const res = await api.post(`/campaigns/reject/${id}`);
  return res.data;
}

export default api;
