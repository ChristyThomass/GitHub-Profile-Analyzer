import React from 'react';
import { AlertTriangle, RefreshCw, Key, ArrowLeft, Github } from 'lucide-react';
import { RateLimitInfo } from '../types';

interface ErrorMessageProps {
  message: string;
  onRetry: () => void;
  rateLimit: RateLimitInfo;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message, onRetry, rateLimit }) => {
  const isRateLimitError = message.toLowerCase().includes('rate limit');
  const isNotFound = message.toLowerCase().includes('not found');

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 sm:p-8 border border-red-200 dark:border-red-900/60 shadow-xl space-y-6 max-w-2xl mx-auto text-center">
      <div className="w-14 h-14 rounded-2xl bg-red-50 dark:bg-red-950/60 text-red-600 dark:text-red-400 flex items-center justify-center mx-auto shadow-xs">
        <AlertTriangle className="w-7 h-7" />
      </div>

      <div className="space-y-2">
        <h3 className="text-xl font-extrabold text-slate-900 dark:text-white">
          {isNotFound ? 'GitHub User Not Found' : isRateLimitError ? 'API Rate Limit Exceeded' : 'Unable to Fetch Profile'}
        </h3>
        <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
          {message}
        </p>
      </div>

      {/* Helpful context block */}
      {isRateLimitError && (
        <div className="p-4 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800 text-xs text-amber-800 dark:text-amber-200 text-left space-y-2">
          <div className="flex items-center gap-2 font-bold">
            <Key className="w-4 h-4 text-amber-600 dark:text-amber-400" />
            <span>How to bypass the 60 requests/hour limit:</span>
          </div>
          <ul className="list-disc list-inside space-y-1 text-slate-700 dark:text-slate-300">
            <li>Click the 🔑 icon in the top header to input a GitHub Personal Access Token.</li>
            <li>This instantly unlocks 5,000 API requests per hour.</li>
            {rateLimit.resetTime && (
              <li>
                Unauthenticated rate limit resets at:{' '}
                <strong className="font-mono">{rateLimit.resetTime.toLocaleTimeString()}</strong>
              </li>
            )}
          </ul>
        </div>
      )}

      {isNotFound && (
        <div className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-2xl text-xs text-slate-600 dark:text-slate-400 space-y-1">
          <p>Common causes for "Not Found":</p>
          <p className="font-mono text-slate-800 dark:text-slate-200">
            Check for typos in spelling, spaces, or deleted GitHub accounts.
          </p>
        </div>
      )}

      <div className="flex items-center justify-center gap-3 pt-2">
        <button
          onClick={onRetry}
          className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-semibold text-xs sm:text-sm rounded-xl shadow-md flex items-center gap-2 transition-all cursor-pointer"
        >
          <RefreshCw className="w-4 h-4" />
          <span>Try Again</span>
        </button>
      </div>
    </div>
  );
};
