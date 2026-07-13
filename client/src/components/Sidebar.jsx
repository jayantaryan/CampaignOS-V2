import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  PlusCircle,
  ClipboardCheck,
  History,
  Settings,
  Zap,
  X,
} from 'lucide-react';

const navItems = [
  { to: '/',               icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/new-campaign',   icon: PlusCircle,      label: 'New Campaign' },
  { to: '/approval-queue', icon: ClipboardCheck,   label: 'Approval Queue' },
  { to: '/history',        icon: History,          label: 'History' },
];

export default function Sidebar({ isOpen, onClose }) {
  return (
    <aside
      className={`
        fixed inset-y-0 left-0 z-40 flex w-64 flex-col
        glass border-r border-surface-500/20
        transition-transform duration-300 ease-in-out
        lg:translate-x-0
        ${isOpen ? 'translate-x-0' : '-translate-x-full'}
      `}
    >
      {/* ── Logo / Brand ──────────────────────────────────────────────────── */}
      <div className="flex h-16 items-center justify-between px-5">
        <div className="flex items-center gap-3">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-accent-600 shadow-lg shadow-accent-600/30">
            <Zap className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white">CampaignOS</h1>
            <p className="text-[10px] font-medium uppercase tracking-widest text-accent-400">AI Decision Engine</p>
          </div>
        </div>
        {/* Close button – mobile only */}
        <button
          onClick={onClose}
          className="rounded-lg p-1.5 text-gray-400 hover:bg-surface-600/50 hover:text-white lg:hidden"
        >
          <X className="h-5 w-5" />
        </button>
      </div>

      {/* ── Navigation ────────────────────────────────────────────────────── */}
      <nav className="mt-4 flex-1 space-y-1 px-3">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            end={to === '/'}
            onClick={onClose}
            className={({ isActive }) => `
              group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium
              transition-all duration-200
              ${isActive
                ? 'bg-accent-600/15 text-accent-400 shadow-inner-glow'
                : 'text-gray-400 hover:bg-surface-600/40 hover:text-white'
              }
            `}
          >
            {({ isActive }) => (
              <>
                <Icon
                  className={`h-[18px] w-[18px] flex-shrink-0 transition-colors ${
                    isActive ? 'text-accent-400' : 'text-gray-500 group-hover:text-gray-300'
                  }`}
                />
                <span>{label}</span>
                {isActive && (
                  <span className="ml-auto h-1.5 w-1.5 rounded-full bg-accent-400 animate-pulse-soft" />
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* ── Bottom section ────────────────────────────────────────────────── */}
      <div className="border-t border-surface-500/20 p-3">
        <button className="group flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-gray-400 transition-all duration-200 hover:bg-surface-600/40 hover:text-white">
          <Settings className="h-[18px] w-[18px] text-gray-500 group-hover:text-gray-300" />
          <span>Settings</span>
        </button>

        {/* Version tag */}
        <div className="mt-3 rounded-lg bg-surface-800/50 px-3 py-2">
          <p className="text-[10px] font-medium uppercase tracking-widest text-gray-600">
            Hackathon MVP v1.0
          </p>
        </div>
      </div>
    </aside>
  );
}
