/**
 * @file Sidebar.jsx
 * @description Responsive sidebar with navigation links and task stats summary.
 * On mobile it slides in as a drawer; on desktop it's always visible.
 */

import { NavLink } from "react-router-dom";
import {
  LayoutDashboard,
  CheckSquare,
  Clock,
  CircleDot,
  BarChart2,
  X,
} from "lucide-react";
import { useTaskContext } from "../../context/TaskContext";

const NAV_LINKS = [
  { to: "/", label: "Dashboard", icon: LayoutDashboard },
];

const Sidebar = ({ isOpen, onClose }) => {
  const { stats } = useTaskContext();

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-20 bg-slate-900/40 backdrop-blur-sm lg:hidden"
          onClick={onClose}
          aria-hidden="true"
        />
      )}

      {/* Sidebar panel */}
      <aside
        className={[
          "fixed top-0 left-0 z-30 h-full w-64 bg-white border-r border-slate-100 shadow-xl",
          "flex flex-col transition-transform duration-300 ease-in-out",
          "lg:static lg:translate-x-0 lg:shadow-none lg:z-auto",
          isOpen ? "translate-x-0" : "-translate-x-full",
        ].join(" ")}
        aria-label="Sidebar navigation"
      >
        {/* Sidebar header */}
        <div className="flex h-16 items-center justify-between px-5 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600">
              <CheckSquare size={17} className="text-white" />
            </div>
            <span className="font-bold text-slate-900 tracking-tight">
              TaskTracker
            </span>
          </div>
          {/* Close button — mobile only */}
          <button
            onClick={onClose}
            aria-label="Close sidebar"
            className="rounded-lg p-1.5 text-slate-400 hover:text-slate-600 hover:bg-slate-100 transition-colors lg:hidden"
          >
            <X size={18} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 overflow-y-auto px-3 py-4">
          <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
            Menu
          </p>
          <ul className="space-y-0.5">
            {NAV_LINKS.map(({ to, label, icon: Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  end
                  onClick={onClose}
                  className={({ isActive }) =>
                    [
                      "flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors",
                      isActive
                        ? "bg-blue-50 text-blue-700"
                        : "text-slate-600 hover:bg-slate-50 hover:text-slate-900",
                    ].join(" ")
                  }
                >
                  {({ isActive }) => (
                    <>
                      <Icon
                        size={18}
                        className={isActive ? "text-blue-600" : "text-slate-400"}
                      />
                      {label}
                    </>
                  )}
                </NavLink>
              </li>
            ))}
          </ul>

          {/* Stats summary */}
          <div className="mt-6">
            <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-400">
              Overview
            </p>
            <div className="space-y-1">
              <StatItem
                icon={<BarChart2 size={16} className="text-slate-400" />}
                label="Total Tasks"
                value={stats.total}
                color="text-slate-700"
              />
              <StatItem
                icon={<Clock size={16} className="text-amber-500" />}
                label="Pending"
                value={stats.pending}
                color="text-amber-600"
              />
              <StatItem
                icon={<CircleDot size={16} className="text-blue-500" />}
                label="In Progress"
                value={stats.inProgress}
                color="text-blue-600"
              />
              <StatItem
                icon={<CheckSquare size={16} className="text-emerald-500" />}
                label="Completed"
                value={stats.completed}
                color="text-emerald-600"
              />
            </div>
          </div>
        </nav>

        {/* Footer */}
        <div className="px-4 py-4 border-t border-slate-100">
          <div className="flex items-center gap-3 rounded-lg bg-slate-50 px-3 py-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-600 text-xs font-bold text-white">
              U
            </div>
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">User</p>
              <p className="truncate text-xs text-slate-500">user@example.com</p>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

const StatItem = ({ icon, label, value, color }) => (
  <div className="flex items-center justify-between rounded-lg px-3 py-2 hover:bg-slate-50 transition-colors">
    <div className="flex items-center gap-2.5">
      {icon}
      <span className="text-sm text-slate-600">{label}</span>
    </div>
    <span className={`text-sm font-semibold tabular-nums ${color}`}>{value}</span>
  </div>
);

export default Sidebar;
