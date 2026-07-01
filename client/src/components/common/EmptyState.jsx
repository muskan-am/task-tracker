/**
 * @file EmptyState.jsx
 * @description Reusable empty/zero-state illustration with optional CTA.
 */

import { ClipboardList } from "lucide-react";
import Button from "./Button";

/**
 * @param {object}  props
 * @param {React.ReactNode} [props.icon]
 * @param {string}  props.title
 * @param {string}  [props.description]
 * @param {string}  [props.actionLabel]
 * @param {function}[props.onAction]
 */
const EmptyState = ({
  icon,
  title = "Nothing here yet",
  description,
  actionLabel,
  onAction,
}) => {
  return (
    <div className="flex flex-col items-center justify-center py-20 px-6 text-center">
      {/* Icon */}
      <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-blue-50 text-blue-400">
        {icon || <ClipboardList size={36} strokeWidth={1.5} />}
      </div>

      {/* Text */}
      <h3 className="text-lg font-semibold text-slate-800">{title}</h3>
      {description && (
        <p className="mt-2 max-w-sm text-sm text-slate-500">{description}</p>
      )}

      {/* CTA */}
      {actionLabel && onAction && (
        <div className="mt-6">
          <Button onClick={onAction} size="md">
            {actionLabel}
          </Button>
        </div>
      )}
    </div>
  );
};

export default EmptyState;
