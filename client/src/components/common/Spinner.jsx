/**
 * @file Spinner.jsx
 * @description Accessible loading spinner with size variants.
 */

const SIZES = {
  sm: "h-4 w-4 border-2",
  md: "h-8 w-8 border-2",
  lg: "h-12 w-12 border-[3px]",
  xl: "h-16 w-16 border-4",
};

/**
 * @param {'sm'|'md'|'lg'|'xl'} [size='md']
 * @param {string} [label='Loading…']
 * @param {boolean} [fullPage=false]  - Centers in the full viewport
 */
const Spinner = ({ size = "md", label = "Loading…", fullPage = false }) => {
  const spinner = (
    <div
      role="status"
      className={fullPage ? "flex flex-col items-center justify-center gap-3 h-64" : "flex items-center justify-center"}
    >
      <div
        className={[
          "rounded-full border-slate-200 border-t-blue-600 animate-spin",
          SIZES[size] ?? SIZES.md,
        ].join(" ")}
        aria-hidden="true"
      />
      <span className={fullPage ? "text-sm text-slate-500" : "sr-only"}>
        {label}
      </span>
    </div>
  );

  if (fullPage) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        {spinner}
      </div>
    );
  }

  return spinner;
};

export default Spinner;
