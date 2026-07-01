/**
 * @file TaskStats.jsx
 * @description Four statistics cards: Total, Pending, In Progress, Completed.
 * Shows skeleton placeholders during initial load.
 * Shows an error alert when the API call fails.
 */

import { memo } from "react";
import { CheckCircle2, Clock, CircleDot, LayoutList, AlertTriangle } from "lucide-react";
import { useTaskContext } from "../../context/TaskContext";

const CARDS = [
  {
    key: "total",
    label: "Total Tasks",
    icon: LayoutList,
    iconBg: "bg-slate-100",
    iconColor: "text-slate-600",
    valueColor: "text-slate-900",
    barColor: null,
    border: "border-slate-100",
  },
  {
    key: "pending",
    label: "Pending",
    icon: Clock,
    iconBg: "bg-amber-50",
    iconColor: "text-amber-600",
    valueColor: "text-amber-700",
    barColor: "bg-amber-500",
    border: "border-amber-100",
  },
  {
    key: "inProgress",
    label: "In Progress",
    icon: CircleDot,
    iconBg: "bg-blue-50",
    iconColor: "text-blue-600",
    valueColor: "text-blue-700",
    barColor: "bg-blue-500",
    border: "border-blue-100",
  },
  {
    key: "completed",
    label: "Completed",
    icon: CheckCircle2,
    iconBg: "bg-emerald-50",
    iconColor: "text-emerald-600",
    valueColor: "text-emerald-700",
    barColor: "bg-emerald-500",
    border: "border-emerald-100",
  },
];

const StatCardSkeleton = () => (
  <div className="animate-pulse rounded-xl bg-white border border-slate-100 p-5 shadow-sm">
    <div className="mb-3 h-10 w-10 rounded-lg bg-slate-200" />
    <div className="h-8 w-16 rounded-md bg-slate-200" />
    <div className="mt-2 h-4 w-24 rounded bg-slate-100" />
  </div>
);

const TaskStats = () => {
  const { stats, error, loading } = useTaskContext();

  return (
    <div className="space-y-4">
      {/* Error banner */}
      {error && !loading && (
        <div
          role="alert"
          className="flex items-center gap-3 rounded-xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
          <AlertTriangle size={16} className="shrink-0" aria-hidden="true" />
          <span>
            <span className="font-semibold">Could not load tasks — </span>
            {error}
          </span>
        </div>
      )}

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        {loading
          ? CARDS.map((c) => <StatCardSkeleton key={c.key} />)
          : CARDS.map(({ key, label, icon: Icon, iconBg, iconColor, valueColor, barColor, border }) => {
              const value = stats[key];
              const pct =
                barColor && stats.total > 0
                  ? Math.round((value / stats.total) * 100)
                  : 0;

              return (
                <div
                  key={key}
                  className={`relative overflow-hidden rounded-xl bg-white border ${border} p-5 shadow-sm hover:shadow-md transition-shadow`}
                >
                  <div className={`mb-3 inline-flex items-center justify-center rounded-lg p-2.5 ${iconBg}`}>
                    <Icon size={20} className={iconColor} aria-hidden="true" />
                  </div>

                  <p className={`text-3xl font-bold tabular-nums ${valueColor}`}>
                    {value}
                  </p>
                  <p className="mt-1 text-sm font-medium text-slate-500">{label}</p>

                  {barColor && stats.total > 0 && (
                    <div className="mt-3">
                      <div className="h-1 w-full rounded-full bg-slate-100">
                        <div
                          className={`h-1 rounded-full transition-all duration-500 ${barColor}`}
                          style={{ width: `${pct}%` }}
                          role="progressbar"
                          aria-valuenow={pct}
                          aria-valuemin={0}
                          aria-valuemax={100}
                          aria-label={`${label}: ${pct}% of total`}
                        />
                      </div>
                      <p className="mt-1 text-xs text-slate-400 tabular-nums">{pct}% of total</p>
                    </div>
                  )}

                  {/* Decorative background circle */}
                  <div
                    className={`pointer-events-none absolute -right-4 -top-4 h-20 w-20 rounded-full opacity-10 ${iconBg}`}
                    aria-hidden="true"
                  />
                </div>
              );
            })}
      </div>
    </div>
  );
};

export default memo(TaskStats);
