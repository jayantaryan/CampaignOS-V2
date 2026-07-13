import { TrendingUp, TrendingDown, Minus } from 'lucide-react';

/**
 * StatsCard – glass card showing a metric with icon, value, label, and trend.
 *
 * @param {{ icon: React.ComponentType, value: string|number, label: string, trend?: 'up'|'down'|'neutral', trendValue?: string, color?: string }} props
 */
export default function StatsCard({ icon: Icon, value, label, trend = 'neutral', trendValue, color = 'accent' }) {
  const colorMap = {
    accent:  { bg: 'bg-accent-600/15', text: 'text-accent-400', shadow: 'shadow-accent-600/10' },
    emerald: { bg: 'bg-emerald-600/15', text: 'text-emerald-400', shadow: 'shadow-emerald-600/10' },
    amber:   { bg: 'bg-amber-600/15',   text: 'text-amber-400',   shadow: 'shadow-amber-600/10' },
    red:     { bg: 'bg-red-600/15',     text: 'text-red-400',     shadow: 'shadow-red-600/10' },
  };

  const c = colorMap[color] || colorMap.accent;

  const TrendIcon = trend === 'up' ? TrendingUp : trend === 'down' ? TrendingDown : Minus;
  const trendColor = trend === 'up' ? 'text-emerald-400' : trend === 'down' ? 'text-red-400' : 'text-gray-500';

  return (
    <div className="glass-hover rounded-xl p-5 animate-fade-in">
      <div className="flex items-start justify-between">
        {/* Icon */}
        <div className={`flex h-11 w-11 items-center justify-center rounded-lg ${c.bg} ${c.shadow} shadow-lg`}>
          <Icon className={`h-5 w-5 ${c.text}`} />
        </div>

        {/* Trend */}
        {trendValue && (
          <div className={`flex items-center gap-1 text-xs font-medium ${trendColor}`}>
            <TrendIcon className="h-3.5 w-3.5" />
            <span>{trendValue}</span>
          </div>
        )}
      </div>

      {/* Value */}
      <div className="mt-4">
        <p className="text-2xl font-bold tracking-tight text-white">{value}</p>
        <p className="mt-1 text-sm text-gray-400">{label}</p>
      </div>
    </div>
  );
}
