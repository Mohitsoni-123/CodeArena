import React from "react";
import { Link, useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-[#f6f8fc] flex items-center justify-center px-4">
      <div className="w-full max-w-2xl text-center">

        {/* 404 */}
        <div className="relative mb-8">
          <h1 className="text-[120px] sm:text-[160px] font-black leading-none tracking-tighter text-slate-900">
            404
          </h1>

          <div className="absolute inset-x-0 bottom-2 flex justify-center">
            <div className="h-3 w-32 rounded-full bg-indigo-500/20 blur-md" />
          </div>
        </div>

        {/* Content */}
        <div className="space-y-4">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900">
            Page Not Found
          </h2>

          <p className="max-w-md mx-auto text-slate-500 text-sm sm:text-base leading-7">
            Looks like you've taken a wrong turn. The page you're looking for
            doesn't exist or may have been moved.
          </p>
        </div>

        {/* Buttons */}
        <div className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link
            to="/"
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-slate-900 text-white font-semibold hover:bg-slate-800 transition-all shadow-lg shadow-slate-900/10"
          >
            ← Back to Home
          </Link>

          <button
            onClick={() => navigate(-1)}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-white border border-slate-200 text-slate-700 font-semibold hover:bg-slate-50 transition-all"
          >
            Go Back
          </button>
        </div>

        {/* Branding */}
        <div className="mt-12">
          <span className="text-sm font-bold text-slate-400">
            Code<span className="text-indigo-600">Arena</span>
          </span>
        </div>

      </div>
    </div>
  );
};

export default NotFound;