/**
 * @file Input.jsx
 * @description Accessible controlled input with label, error, and helper text.
 * Designed to work seamlessly with React Hook Form via forwardRef.
 */

import { forwardRef } from "react";

const Input = forwardRef(
  (
    {
      label,
      id,
      error,
      helperText,
      leftIcon,
      rightIcon,
      className = "",
      required,
      type = "text",
      as: Tag = "input",
      rows = 3,
      ...rest
    },
    ref
  ) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, "-");

    const baseClasses = [
      "block w-full rounded-lg border px-3.5 py-2.5 text-sm text-slate-900",
      "placeholder:text-slate-400",
      "transition-colors duration-150",
      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-0",
      error
        ? "border-red-400 bg-red-50 focus:ring-red-400"
        : "border-slate-200 bg-white hover:border-slate-300 focus:border-blue-400",
      leftIcon ? "pl-10" : "",
      rightIcon ? "pr-10" : "",
      className,
    ]
      .filter(Boolean)
      .join(" ");

    return (
      <div className="flex flex-col gap-1.5">
        {label && (
          <label
            htmlFor={inputId}
            className="text-sm font-medium text-slate-700"
          >
            {label}
            {required && (
              <span className="ml-1 text-red-500" aria-hidden="true">
                *
              </span>
            )}
          </label>
        )}

        <div className="relative">
          {leftIcon && (
            <span
              className="pointer-events-none absolute inset-y-0 left-3 flex items-center text-slate-400"
              aria-hidden="true"
            >
              {leftIcon}
            </span>
          )}

          {Tag === "textarea" ? (
            <textarea
              id={inputId}
              ref={ref}
              rows={rows}
              aria-invalid={!!error}
              aria-describedby={
                error
                  ? `${inputId}-error`
                  : helperText
                  ? `${inputId}-helper`
                  : undefined
              }
              className={`${baseClasses} resize-none`}
              {...rest}
            />
          ) : (
            <input
              id={inputId}
              type={type}
              ref={ref}
              aria-invalid={!!error}
              aria-describedby={
                error
                  ? `${inputId}-error`
                  : helperText
                  ? `${inputId}-helper`
                  : undefined
              }
              className={baseClasses}
              {...rest}
            />
          )}

          {rightIcon && (
            <span
              className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-slate-400"
              aria-hidden="true"
            >
              {rightIcon}
            </span>
          )}
        </div>

        {error && (
          <p id={`${inputId}-error`} role="alert" className="text-xs text-red-600">
            {error}
          </p>
        )}

        {!error && helperText && (
          <p id={`${inputId}-helper`} className="text-xs text-slate-500">
            {helperText}
          </p>
        )}
      </div>
    );
  }
);

Input.displayName = "Input";

export default Input;
