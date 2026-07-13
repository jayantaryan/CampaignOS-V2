import { useEffect, useState } from 'react';
import { History as HistoryIcon, Activity, RefreshCw } from 'lucide-react';
import RecentTable from '../components/RecentTable';
import { getCampaigns } from '../services/api';

export default function History() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    loadCampaigns();
  }, []);

  const loadCampaigns = async () => {
    setLoading(true);
    try {
      const data = await getCampaigns();
      setCampaigns(data);
    } catch {
      setCampaigns([]);
    } finally {
      setLoading(false);
    }
  };

  const filtered = filter === 'all'
    ? campaigns
    : campaigns.filter(c => c.status === filter);

  const filterButtons = [
    { key: 'all',       label: 'All' },
    { key: 'pending',   label: 'Pending' },
    { key: 'approved',  label: 'Approved' },
    { key: 'rejected',  label: 'Rejected' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-accent-600/20">
            <HistoryIcon className="h-5 w-5 text-accent-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Campaign History</h1>
            <p className="text-sm text-gray-400">{campaigns.length} total campaigns</p>
          </div>
        </div>

        <button
          onClick={loadCampaigns}
          disabled={loading}
          className="btn-ghost text-xs"
          id="refresh-history"
        >
          <RefreshCw className={`h-3.5 w-3.5 ${loading ? 'animate-spin' : ''}`} />
          Refresh
        </button>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2">
        {filterButtons.map(({ key, label }) => (
          <button
            key={key}
            onClick={() => setFilter(key)}
            className={`rounded-lg px-4 py-2 text-sm font-medium transition-all duration-200 ${
              filter === key
                ? 'bg-accent-600/20 text-accent-400 ring-1 ring-accent-500/30'
                : 'text-gray-400 hover:bg-surface-600/40 hover:text-white'
            }`}
          >
            {label}
            <span className="ml-2 text-xs text-gray-500">
              ({key === 'all' ? campaigns.length : campaigns.filter(c => c.status === key).length})
            </span>
          </button>
        ))}
      </div>

      {/* Table */}
      {loading ? (
        <div className="glass rounded-xl p-12 text-center">
          <Activity className="mx-auto h-8 w-8 text-accent-500 animate-spin" />
          <p className="mt-3 text-sm text-gray-500">Loading history...</p>
        </div>
      ) : (
        <RecentTable campaigns={filtered} />
      )}
    </div>
  );
}
