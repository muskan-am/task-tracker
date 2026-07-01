/**
 * @file NotFound.jsx
 * @description 404 page shown for any unmatched routes.
 */

import { Link } from "react-router-dom";
import { ArrowLeft, FileQuestion } from "lucide-react";
import Button from "../components/common/Button";

const NotFound = () => {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-slate-50 px-4 text-center">
      {/* Illustration */}
      <div className="mb-6 flex h-28 w-28 items-center justify-center rounded-full bg-blue-50">
        <FileQuestion size={56} className="text-blue-400" strokeWidth={1.2} />
      </div>

      {/* Code */}
      <p className="text-7xl font-extrabold tracking-tight text-blue-600">404</p>

      {/* Message */}
      <h1 className="mt-4 text-2xl font-bold text-slate-900">
        Page not found
      </h1>
      <p className="mt-2 max-w-sm text-sm text-slate-500">
        The page you're looking for doesn't exist or has been moved. Let's get
        you back on track.
      </p>

      {/* CTA */}
      <div className="mt-8">
        <Link to="/">
          <Button leftIcon={<ArrowLeft size={16} />} size="lg">
            Back to Dashboard
          </Button>
        </Link>
      </div>
    </div>
  );
};

export default NotFound;
