import { CheckCircle, Circle, Loader2 } from 'lucide-react';

/**
 * AITimeline – vertical timeline showing workflow steps.
 *
 * @param {{ steps: Array<{ title: string, description?: string, status: 'completed'|'active'|'pending' }> }} props
 */
export default function AITimeline({ steps = [] }) {
  const statusConfig = {
    completed: {
      icon: CheckCircle,
      nodeClass: 'bg-emerald-500 text-white shadow-lg shadow-emerald-500/30',
      lineClass: 'bg-emerald-500',
      titleClass: 'text-emerald-400',
    },
    active: {
      icon: Loader2,
      nodeClass: 'bg-accent-500 text-white shadow-lg shadow-accent-500/40 animate-pulse-soft',
      lineClass: 'bg-accent-500/30',
      titleClass: 'text-accent-400',
    },
    pending: {
      icon: Circle,
      nodeClass: 'bg-surface-600 text-gray-500 border border-surface-500',
      lineClass: 'bg-surface-500/30',
      titleClass: 'text-gray-500',
    },
  };

  return (
    <div className="space-y-0">
      {steps.map((step, i) => {
        const config = statusConfig[step.status] || statusConfig.pending;
        const Icon = config.icon;
        const isLast = i === steps.length - 1;

        return (
          <div key={i} className="relative flex gap-4 animate-fade-in" style={{ animationDelay: `${i * 100}ms` }}>
            {/* Vertical line + node */}
            <div className="flex flex-col items-center">
              <div className={`z-10 flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full ${config.nodeClass} transition-all duration-300`}>
                <Icon className={`h-4 w-4 ${step.status === 'active' ? 'animate-spin' : ''}`} />
              </div>
              {!isLast && (
                <div className={`w-0.5 flex-1 min-h-[32px] ${config.lineClass} transition-colors duration-300`} />
              )}
            </div>

            {/* Content */}
            <div className={`pb-6 ${isLast ? 'pb-0' : ''}`}>
              <p className={`text-sm font-semibold ${config.titleClass} transition-colors`}>
                {step.title}
              </p>
              {step.description && (
                <p className="mt-1 text-xs text-gray-500 leading-relaxed max-w-sm">
                  {step.description}
                </p>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}
