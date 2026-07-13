import { Bot, TrendingUp, ShieldCheck } from 'lucide-react';

/**
 * AgentCard – displays an AI agent's analysis result.
 *
 * @param {{ agentName: string, recommendedBudget: number, status: string, reason: string, confidence: number }} props
 */
export default function AgentCard({ agentName, recommendedBudget, status, reason, confidence }) {
  const agentIcons = {
    'Marketing Agent': Bot,
    'Finance Agent':   ShieldCheck,
    'Sales Agent':     TrendingUp,
  };

  const agentColors = {
    'Marketing Agent': { bg: 'from-purple-500/20 to-purple-600/5', border: 'border-purple-500/20', icon: 'text-purple-400', bar: 'bg-purple-500' },
    'Finance Agent':   { bg: 'from-emerald-500/20 to-emerald-600/5', border: 'border-emerald-500/20', icon: 'text-emerald-400', bar: 'bg-emerald-500' },
    'Sales Agent':     { bg: 'from-amber-500/20 to-amber-600/5', border: 'border-amber-500/20', icon: 'text-amber-400', bar: 'bg-amber-500' },
  };

  const Icon = agentIcons[agentName] || Bot;
  const colors = agentColors[agentName] || agentColors['Marketing Agent'];
  const confidencePercent = Math.round((confidence || 0) * 100);

  const statusBadge = (s) => {
    const map = {
      approve: 'badge-approved',
      suggest: 'badge-suggest',
      reject:  'badge-rejected',
    };
    return map[s] || 'badge-pending';
  };

  return (
    <div className={`rounded-xl border ${colors.border} bg-gradient-to-br ${colors.bg} p-5 transition-all duration-300 hover:shadow-lg animate-slide-up`}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className={`flex h-10 w-10 items-center justify-center rounded-lg bg-surface-700/80 ${colors.icon}`}>
            <Icon className="h-5 w-5" />
          </div>
          <div>
            <h3 className="text-sm font-semibold text-white">{agentName}</h3>
            <span className={statusBadge(status)}>{status}</span>
          </div>
        </div>
        <div className="text-right">
          <p className="text-lg font-bold text-white">₹{(recommendedBudget || 0).toLocaleString('en-IN')}</p>
          <p className="text-[11px] text-gray-500">Recommended</p>
        </div>
      </div>

      {/* Reason */}
      <p className="mt-3 text-xs leading-relaxed text-gray-400">
        {reason}
      </p>

      {/* Confidence bar */}
      <div className="mt-4">
        <div className="flex items-center justify-between text-xs">
          <span className="text-gray-500">Confidence</span>
          <span className="font-semibold text-gray-300">{confidencePercent}%</span>
        </div>
        <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-surface-700">
          <div
            className={`h-full rounded-full ${colors.bar} transition-all duration-700 ease-out`}
            style={{ width: `${confidencePercent}%` }}
          />
        </div>
      </div>
    </div>
  );
}
