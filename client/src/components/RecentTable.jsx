import { ExternalLink } from 'lucide-react';

/**
 * RecentTable – displays campaign rows with status badges.
 *
 * @param {{ campaigns: Array<{ id, name, budget, status, createdAt }>, onRowClick?: (id) => void }} props
 */
export default function RecentTable({ campaigns = [], onRowClick }) {
  const statusBadgeClass = (status) => {
    const map = {
      pending:      'badge-pending',
      approved:     'badge-approved',
      rejected:     'badge-rejected',
      suggest:      'badge-suggest',
      needs_review: 'badge-needs_review',
    };
    return map[status] || 'badge-pending';
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '—';
    try {
      return new Date(dateStr).toLocaleDateString('en-IN', {
        day: '2-digit', month: 'short', year: 'numeric',
      });
    } catch {
      return dateStr;
    }
  };

  const formatBudget = (budget) => {
    if (!budget && budget !== 0) return '—';
    return `₹${Number(budget).toLocaleString('en-IN')}`;
  };

  if (campaigns.length === 0) {
    return (
      <div className="glass rounded-xl p-8 text-center">
        <p className="text-gray-500">No campaigns yet. Create your first one!</p>
      </div>
    );
  }

  return (
    <div className="glass rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-surface-500/20">
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Campaign
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Budget
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Status
              </th>
              <th className="px-5 py-3.5 text-left text-xs font-semibold uppercase tracking-wider text-gray-500">
                Date
              </th>
              <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-gray-500">
                Action
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-surface-500/10">
            {campaigns.map((campaign, i) => (
              <tr
                key={campaign.id || i}
                className="group transition-colors hover:bg-surface-600/20"
              >
                <td className="whitespace-nowrap px-5 py-4">
                  <div>
                    <p className="font-medium text-gray-200 group-hover:text-white transition-colors">
                      {campaign.name}
                    </p>
                    {campaign.product && (
                      <p className="mt-0.5 text-xs text-gray-500">{campaign.product}</p>
                    )}
                  </div>
                </td>
                <td className="whitespace-nowrap px-5 py-4 font-medium text-gray-300">
                  {formatBudget(campaign.budget)}
                </td>
                <td className="whitespace-nowrap px-5 py-4">
                  <span className={statusBadgeClass(campaign.status)}>
                    {campaign.status || 'pending'}
                  </span>
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-gray-400">
                  {formatDate(campaign.createdAt)}
                </td>
                <td className="whitespace-nowrap px-5 py-4 text-right">
                  {onRowClick && (
                    <button
                      onClick={() => onRowClick(campaign.id)}
                      className="inline-flex items-center gap-1 text-xs text-accent-400 hover:text-accent-300 transition-colors"
                    >
                      View <ExternalLink className="h-3 w-3" />
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
