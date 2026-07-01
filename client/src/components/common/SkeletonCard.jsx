/**
 * @file SkeletonCard.jsx
 * @description Animated skeleton placeholder shown while tasks are loading.
 * Matches the exact dimensions of TaskCard to prevent layout shift.
 */

const SkeletonCard = () => (
  <div className="flex flex-col rounded-xl bg-white border border-slate-100 shadow-sm overflow-hidden animate-pulse">
    {/* Accent bar */}
    <div className="h-1 w-full bg-slate-200" />

    <div className="flex flex-col flex-1 p-5">
      {/* Badge row */}
      <div className="mb-3 flex items-center gap-2">
        <div className="h-5 w-20 rounded-full bg-slate-200" />
        <div className="h-5 w-14 rounded-full bg-slate-200" />
      </div>

      {/* Title */}
      <div className="h-4 w-4/5 rounded-md bg-slate-200" />
      <div className="mt-1.5 h-4 w-3/5 rounded-md bg-slate-200" />

      {/* Description */}
      <div className="mt-3 space-y-1.5">
        <div className="h-3 w-full rounded bg-slate-100" />
        <div className="h-3 w-5/6 rounded bg-slate-100" />
      </div>

      <div className="flex-1 py-4" />

      {/* Footer */}
      <div className="mt-2 flex items-center justify-between">
        <div className="h-3 w-24 rounded bg-slate-200" />
        <div className="h-6 w-16 rounded-lg bg-slate-200" />
      </div>
    </div>
  </div>
);

/**
 * Renders a grid of N skeleton cards.
 * @param {number} [count=9]
 */
export const SkeletonGrid = ({ count = 9 }) => (
  <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
    {Array.from({ length: count }).map((_, i) => (
      <SkeletonCard key={i} />
    ))}
  </div>
);

export default SkeletonCard;
