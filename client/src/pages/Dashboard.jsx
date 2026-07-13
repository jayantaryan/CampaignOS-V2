import { useEffect, useState } from 'react';
import { BarChart3, Clock, CheckCircle2, XCircle, Activity } from 'lucide-react';
import StatsCard from '../components/StatsCard';
import RecentTable from '../components/RecentTable';
import AITimeline from '../components/AITimeline';
import { getCampaigns } from '../services/api';

const sampleTimeline = [
  { title: 'Campaign Submitted',  description: 'New campaign created and queued for AI analysis.',          status: 'completed' },
  { title: 'Marketing Agent',     description: 'Evaluating audience reach, channel strategy, and creative approach.', status: 'completed' },
  { title: 'Finance Agent',       description: 'Analyzing budget allocation, ROI projections, and cost efficiency.',   status: 'completed' },
  { title: 'Sales Agent',         description: 'Assessing pipeline impact, lead generation potential, and revenue.',   status: 'active' },
  { title: 'AI Consensus',        description: 'Aggregating all agent recommendations into a final decision.',         status: 'pending' },
];

export default function Dashboard() {
  const [campaigns, setCampaigns] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getCampaigns()
      .then(data => setCampaigns(data))
      .catch(() => setCampaigns([]))
      .finally(() => setLoading(false));
  }, []);

  // Compute stats from real data (fallback to demo values)
  const total    = campaigns.length || 12;
  const pending  = campaigns.filter(c => c.status === 'pending').length  || 4;
  const approved = campaigns.filter(c => c.status === 'approved').length || 6;
  const rejected = campaigns.filter(c => c.status === 'rejected' || c.status === 'needs_review').length || 2;

  // Use real campaigns or demo data
  const tableData = campaigns.length > 0 ? campaigns.slice(0, 8) : [
    { id: 1, name: 'Summer Flash Sale',       product: 'SaaS Pro',      budget: 120000, status: 'approved', createdAt: '2026-07-10' },
    { id: 2, name: 'Product Hunt Launch',      product: 'DevKit',        budget: 85000,  status: 'pending',  createdAt: '2026-07-11' },
    { id: 3, name: 'Enterprise Webinar Series', product: 'Cloud Suite',  budget: 200000, status: 'approved', createdAt: '2026-07-09' },
    { id: 4, name: 'Social Media Blitz',       product: 'Mobile App',   budget: 50000,  status: 'rejected', createdAt: '2026-07-12' },
    { id: 5, name: 'Q3 Brand Campaign',        product: 'Platform X',   budget: 300000, status: 'pending',  createdAt: '2026-07-13' },
  ];

  return (
    <div className="space-y-6 animate-fade-in">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          CampaignOS Dashboard
        </h1>
        <p className="mt-1 text-sm text-gray-400">
          AI Marketing Decision Center – Real-time campaign intelligence
        </p>
      </div>

      {/* Stats grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          icon={BarChart3}
          value={total}
          label="Total Campaigns"
          trend="up"
          trendValue="+18%"
          color="accent"
        />
        <StatsCard
          icon={Clock}
          value={pending}
          label="Pending Approval"
          trend="neutral"
          trendValue="—"
          color="amber"
        />
        <StatsCard
          icon={CheckCircle2}
          value={approved}
          label="Approved"
          trend="up"
          trendValue="+24%"
          color="emerald"
        />
        <StatsCard
          icon={XCircle}
          value={rejected}
          label="Rejected / Review"
          trend="down"
          trendValue="-8%"
          color="red"
        />
      </div>

      {/* Main content: Table + Timeline */}
      <div className="grid gap-6 lg:grid-cols-3">
        {/* Recent campaigns – 2 cols */}
        <div className="lg:col-span-2 space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-white">Recent Campaigns</h2>
            <span className="text-xs text-gray-500">{tableData.length} campaigns</span>
          </div>
          {loading ? (
            <div className="glass rounded-xl p-12 text-center">
              <Activity className="mx-auto h-8 w-8 text-accent-500 animate-spin" />
              <p className="mt-3 text-sm text-gray-500">Loading campaigns...</p>
            </div>
          ) : (
            <RecentTable campaigns={tableData} />
          )}
        </div>

        {/* AI Workflow Timeline – 1 col */}
        <div className="space-y-3">
          <h2 className="text-lg font-semibold text-white">AI Workflow</h2>
          <div className="glass rounded-xl p-5">
            <AITimeline steps={sampleTimeline} />
          </div>
        </div>
      </div>
    </div>
  );
}
