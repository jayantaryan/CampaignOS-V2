import { Bell, Search, Menu, User } from 'lucide-react';

export default function Navbar({ onMenuToggle }) {
  return (
    <header className="fixed left-0 right-0 top-0 z-20 h-16 lg:left-64">
      <div className="flex h-full items-center justify-between gap-4 border-b border-surface-500/20 bg-surface-900/80 px-4 backdrop-blur-xl sm:px-6">
        {/* Left: Hamburger (mobile) + Search */}
        <div className="flex items-center gap-3 flex-1">
          <button
            onClick={onMenuToggle}
            className="rounded-lg p-2 text-gray-400 hover:bg-surface-600/50 hover:text-white lg:hidden"
            id="mobile-menu-toggle"
          >
            <Menu className="h-5 w-5" />
          </button>

          {/* Search bar */}
          <div className="relative hidden sm:block sm:max-w-md sm:flex-1">
            <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
            <input
              type="text"
              placeholder="Search campaigns, agents, results..."
              className="w-full rounded-lg border border-surface-500/30 bg-surface-800/60 py-2 pl-10 pr-4 text-sm text-gray-300 placeholder-gray-500 outline-none transition-all duration-200 focus:border-accent-500/50 focus:ring-1 focus:ring-accent-500/20"
              id="global-search"
            />
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-2">
          {/* Notification bell */}
          <button
            className="relative rounded-lg p-2 text-gray-400 transition-colors hover:bg-surface-600/50 hover:text-white"
            id="notifications-btn"
          >
            <Bell className="h-5 w-5" />
            {/* Notification dot */}
            <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-accent-500 animate-pulse-soft" />
          </button>

          {/* Divider */}
          <div className="mx-1 h-6 w-px bg-surface-500/30" />

          {/* User avatar */}
          <button
            className="flex items-center gap-2.5 rounded-lg p-1.5 transition-colors hover:bg-surface-600/50"
            id="user-menu-btn"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-gradient-to-br from-accent-500 to-accent-700 text-sm font-semibold text-white shadow-lg shadow-accent-600/20">
              <User className="h-4 w-4" />
            </div>
            <div className="hidden md:block text-left">
              <p className="text-sm font-medium text-gray-200">Admin</p>
              <p className="text-[11px] text-gray-500">admin@campaignos.ai</p>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
}
