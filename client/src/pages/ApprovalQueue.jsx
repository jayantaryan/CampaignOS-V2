import { useEffect, useState } from 'react';
import { ClipboardCheck, Play, Brain, CheckCircle, Activity, AlertTriangle, XCircle, RefreshCw } from 'lucide-react';
import AgentCard from '../components/AgentCard';
import ExplainDecisionModal from '../components/ExplainDecisionModal';
import { getCampaigns, triggerAgents, getConsensus, approveCampaign, rejectCampaignApi } from '../services/api';

export default function ApprovalQueue() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState({});  // { [campaignId]: 'agents' | 'consensus' | 'approving' }
  const [agentResults, setAgentResults] = useState({}); // { [campaignId]: [agents] }
  const [consensusData, setConsensusData] = useState({}); // { [campaignId]: consensus }
  const [modalOpen, setModalOpen] = useState(false);
  const [modalDecision, setModalDecision] = useState(null);
  const [errors, setErrors] = useState({});

  // Fetch pending campaigns
  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    try {
      const all = await getCampaigns();
      setCampaigns(all.filter(c => c.status === 'pending'));
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  // Run AI agents on a campaign
  const handleRunAgents = async (id) => {
    setProcessing(p => ({ ...p, [id]: 'agents' }));
    setErrors(e => ({ ...e, [id]: null }));
    try {
      const data = await triggerAgents(id);
      setAgentResults(r => ({ ...r, [id]: data.agents }));
    } catch (err) {
      setErrors(e => ({ ...e, [id]: 'Failed to run agents. Is the server running?' }));
    } finally {
      setProcessing(p => ({ ...p, [id]: null }));
    }
  };

  // Get consensus
  const handleConsensus = async (id) => {
    setProcessing(p => ({ ...p, [id]: 'consensus' }));
    setErrors(e => ({ ...e, [id]: null }));
    try {
      const data = await getConsensus(id);
      setConsensusData(c => ({ ...c, [id]: data.consensus }));
    } catch (err) {
      setErrors(e => ({ ...e, [id]: 'Failed to get consensus.' }));
    } finally {
      setProcessing(p => ({ ...p, [id]: null }));
    }
  };

  // Approve campaign
  const handleApprove = async (id) => {
    setProcessing(p => ({ ...p, [id]: 'approving' }));
    setErrors(e => ({ ...e, [id]: null }));
    try {
      await approveCampaign(id);
      // Remove from list
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setErrors(e => ({ ...e, [id]: 'Failed to approve.' }));
    } finally {
      setProcessing(p => ({ ...p, [id]: null }));
    }
  };

  // Reject campaign
  const handleReject = async (id) => {
    setProcessing(p => ({ ...p, [id]: 'rejecting' }));
    setErrors(e => ({ ...e, [id]: null }));
    try {
      await rejectCampaignApi(id);
      // Remove from list
      setCampaigns(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      setErrors(e => ({ ...e, [id]: 'Failed to reject.' }));
    } finally {
      setProcessing(p => ({ ...p, [id]: null }));
    }
  };

  // Re-evaluate campaign
  const handleReEvaluate = async (id) => {
    // Clear consensus and re-run agents
    setConsensusData(c => {
      const newData = { ...c };
      delete newData[id];
      return newData;
    });
    await handleRunAgents(id);
  };

  // Show consensus modal
  const showDecision = (id) => {
    setModalDecision(consensusData[id] || null);
    setModalOpen(true);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Activity className="h-8 w-8 text-accent-500 animate-spin" />
      </div>
    );
  }

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex items-center gap-3">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-600/20">
          <ClipboardCheck className="h-5 w-5 text-accent-400" />
        </div>
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-white">Approval Queue</h1>
          <p className="text-sm text-gray-400">{campaigns.length} campaigns pending review</p>
        </div>
      </div>

      {/* Empty state */}
      {campaigns.length === 0 && (
        <div className="glass rounded-2xl p-12 text-center">
          <CheckCircle className="mx-auto h-12 w-12 text-emerald-500/50" />
          <p className="mt-4 text-lg font-medium text-gray-300">All caught up!</p>
          <p className="mt-1 text-sm text-gray-500">No campaigns pending approval.</p>
        </div>
      )}

      {/* Campaign cards */}
      {campaigns.map(campaign => (
        <div key={campaign.id} className="glass rounded-2xl p-6 space-y-4 animate-slide-up">
          {/* Campaign info */}
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <h2 className="text-lg font-semibold text-white">{campaign.name}</h2>
              <div className="mt-1 flex flex-wrap gap-3 text-sm text-gray-400">
                {campaign.product && <span>📦 {campaign.product}</span>}
                <span>💰 ₹{(campaign.budget || 0).toLocaleString('en-IN')}</span>
                {campaign.audience && <span>🎯 {campaign.audience}</span>}
              </div>
              {campaign.objective && (
                <p className="mt-2 text-xs text-gray-500 max-w-lg">{campaign.objective}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex flex-wrap gap-2">
              {/* Step 1: Run agents */}
              {!agentResults[campaign.id] && (
                <button
                  onClick={() => handleRunAgents(campaign.id)}
                  disabled={!!processing[campaign.id]}
                  className="btn-primary text-xs"
                  id={`run-agents-${campaign.id}`}
                >
                  {processing[campaign.id] === 'agents' ? (
                    <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Analyzing...</>
                  ) : (
                    <><Play className="h-3.5 w-3.5" /> Run AI Agents</>
                  )}
                </button>
              )}

              {/* Step 2: Get consensus */}
              {agentResults[campaign.id] && !consensusData[campaign.id] && (
                <button
                  onClick={() => handleConsensus(campaign.id)}
                  disabled={!!processing[campaign.id]}
                  className="btn-primary text-xs"
                  id={`get-consensus-${campaign.id}`}
                >
                  {processing[campaign.id] === 'consensus' ? (
                    <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Computing...</>
                  ) : (
                    <><Brain className="h-3.5 w-3.5" /> Get Consensus</>
                  )}
                </button>
              )}

              {/* Step 3: View Decision + Approve */}
              {consensusData[campaign.id] && (
                <>
                  <button
                    onClick={() => showDecision(campaign.id)}
                    className="btn-ghost text-xs border border-accent-500/20"
                  >
                    <Brain className="h-3.5 w-3.5 text-accent-400" /> View Decision
                  </button>
                  <button
                    onClick={() => handleApprove(campaign.id)}
                    disabled={!!processing[campaign.id]}
                    className="btn-primary text-xs bg-emerald-600 shadow-emerald-600/25 hover:bg-emerald-500"
                    id={`approve-${campaign.id}`}
                  >
                    {processing[campaign.id] === 'approving' ? (
                      <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Approving...</>
                    ) : (
                      <><CheckCircle className="h-3.5 w-3.5" /> Approve</>
                    )}
                  </button>
                  <button
                    onClick={() => handleReject(campaign.id)}
                    disabled={!!processing[campaign.id]}
                    className="btn-primary text-xs bg-red-600 shadow-red-600/25 hover:bg-red-500"
                    id={`reject-${campaign.id}`}
                  >
                    {processing[campaign.id] === 'rejecting' ? (
                      <><span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/30 border-t-white" /> Rejecting...</>
                    ) : (
                      <><XCircle className="h-3.5 w-3.5" /> Reject</>
                    )}
                  </button>
                  <button
                    onClick={() => handleReEvaluate(campaign.id)}
                    disabled={!!processing[campaign.id]}
                    className="btn-ghost text-xs border border-surface-500/50"
                    id={`reevaluate-${campaign.id}`}
                  >
                    <RefreshCw className={`h-3.5 w-3.5 ${processing[campaign.id] === 'agents' ? 'animate-spin' : ''}`} /> Re-evaluate
                  </button>
                </>
              )}
            </div>
          </div>

          {/* Error */}
          {errors[campaign.id] && (
            <div className="flex items-center gap-2 rounded-lg bg-red-500/10 border border-red-500/20 px-4 py-2.5 text-sm text-red-400">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              {errors[campaign.id]}
            </div>
          )}

          {/* Agent results grid */}
          {agentResults[campaign.id] && (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {agentResults[campaign.id].map((agent, i) => (
                <AgentCard key={i} {...agent} />
              ))}
            </div>
          )}
        </div>
      ))}

      {/* Decision Modal */}
      <ExplainDecisionModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        decision={modalDecision}
      />
    </div>
  );
}
