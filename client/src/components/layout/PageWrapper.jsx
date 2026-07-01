/**
 * @file PageWrapper.jsx
 * @description Consistent page container with max-width, padding, and page title.
 */

const PageWrapper = ({ title, subtitle, actions, children }) => {
  return (
    <main className="flex-1 overflow-y-auto">
      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 lg:px-8">
        {/* Page header */}
        {(title || actions) && (
          <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
            <div>
              {title && (
                <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
                  {title}
                </h1>
              )}
              {subtitle && (
                <p className="mt-1 text-sm text-slate-500">{subtitle}</p>
              )}
            </div>
            {actions && <div className="flex items-center gap-3">{actions}</div>}
          </div>
        )}

        {/* Page content */}
        {children}
      </div>
    </main>
  );
};

export default PageWrapper;
