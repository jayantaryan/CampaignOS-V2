import { X, Brain, DollarSign, Target, FileText } from 'lucide-react';

/**
 * ExplainDecisionModal – displays AI consensus breakdown.
 *
 * @param {{ isOpen: boolean, onClose: () => void, decision: { finalBudget, finalStatus, explanation } | null }} props
 */
export default function ExplainDecisionModal({ isOpen, onClose, decision }) {
  if (!isOpen || !decision) return null;

  const statusLabel = {
    approve:      { text: 'Approved',      class: 'badge-approved' },
    suggest:      { text: 'Suggest Changes', class: 'badge-suggest' },
    needs_review: { text: 'Needs Review',  class: 'badge-needs_review' },
    reject:       { text: 'Rejected',      class: 'badge-rejected' },
  };

  const badge = statusLabel[decision.finalStatus] || statusLabel.suggest;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm animate-fade-in"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-lg glass rounded-2xl border border-accent-500/20 shadow-glow-lg animate-slide-up">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-surface-500/20 px-6 py-4">
          <div className="flex items-center gap-3">
            <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-600/20">
              <Brain className="h-5 w-5 text-accent-400" />
            </div>
            <div>
              <h2 className="text-base font-semibold text-white">AI Consensus Decision</h2>
              <p className="text-xs text-gray-500">Multi-agent analysis result</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-400 hover:bg-surface-600/50 hover:text-white transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="px-6 py-5 space-y-4">
          {/* Status + Budget */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Target className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-400">Final Status</span>
            </div>
            <span className={badge.class}>{badge.text}</span>
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <DollarSign className="h-4 w-4 text-gray-500" />
              <span className="text-sm text-gray-400">Recommended Budget</span>
            </div>
            <span className="text-lg font-bold text-accent-400">
              ₹{(decision.finalBudget || 0).toLocaleString('en-IN')}
            </span>
          </div>

          {/* Explanation */}
          <div className="mt-2">
            <div className="flex items-center gap-2 mb-2">
              <FileText className="h-4 w-4 text-gray-500" />
              <span className="text-sm font-medium text-gray-400">Explanation</span>
            </div>
            <div className="rounded-lg bg-surface-800/80 p-4 text-xs leading-relaxed text-gray-300 whitespace-pre-line max-h-60 overflow-y-auto">
              {decision.explanation || 'No detailed explanation available.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 border-t border-surface-500/20 px-6 py-4">
          <button onClick={onClose} className="btn-ghost">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
