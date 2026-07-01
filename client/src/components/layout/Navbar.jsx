/**
 * @file Navbar.jsx
 * @description Top navigation bar with logo, title, and mobile menu toggle.
 */

import { CheckSquare, Menu, X, Bell } from "lucide-react";

const Navbar = ({ onMenuToggle, isSidebarOpen }) => {
  return (
    <header className="sticky top-0 z-30 flex h-16 items-center justify-between bg-white px-4 shadow-sm border-b border-slate-100 lg:px-6">
      {/* Left: Logo + Title */}
      <div className="flex items-center gap-3">
        {/* Mobile hamburger */}
        <button
          onClick={onMenuToggle}
          aria-label={isSidebarOpen ? "Close sidebar" : "Open sidebar"}
          className="rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors lg:hidden"
        >
          {isSidebarOpen ? <X size={20} /> : <Menu size={20} />}
        </button>

        {/* Brand */}
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
            <CheckSquare size={18} className="text-white" />
          </div>
          <span className="text-base font-bold text-slate-900 tracking-tight hidden sm:block">
            TaskTracker
          </span>
        </div>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Notification bell (placeholder) */}
        <button
          aria-label="Notifications"
          className="relative rounded-lg p-2 text-slate-500 hover:bg-slate-100 transition-colors"
        >
          <Bell size={18} />
          {/* Unread dot */}
          <span
            className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-blue-600 ring-2 ring-white"
            aria-hidden="true"
          />
        </button>

        {/* Avatar */}
        <button
          aria-label="User menu"
          className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-sm font-semibold text-white ring-2 ring-blue-100 hover:ring-blue-200 transition-all"
        >
          U
        </button>
      </div>
    </header>
  );
};

export default Navbar;
