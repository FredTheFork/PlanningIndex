'use client';

import { useState } from 'react';
import { ThumbsUp, ThumbsDown } from 'lucide-react';

export function ArticleFeedback() {
  const [response, setResponse] = useState<'yes' | 'no' | null>(null);

  return (
    <div className="border-t border-primary-200 pt-8 mt-12">
      <p className="font-sans font-semibold text-primary-900 text-sm mb-4">Was this helpful?</p>
      <div className="flex gap-3">
        <button
          onClick={() => setResponse('yes')}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 font-sans text-sm font-medium transition-colors ${
            response === 'yes'
              ? 'border-emerald-300 bg-emerald-50 text-emerald-700'
              : 'border-primary-200 bg-white text-primary-600 hover:border-primary-300'
          }`}
        >
          <ThumbsUp size={16} /> Yes
        </button>
        <button
          onClick={() => setResponse('no')}
          className={`inline-flex items-center gap-2 rounded-lg border px-4 py-2.5 font-sans text-sm font-medium transition-colors ${
            response === 'no'
              ? 'border-danger-300 bg-danger-50 text-danger-700'
              : 'border-primary-200 bg-white text-primary-600 hover:border-primary-300'
          }`}
        >
          <ThumbsDown size={16} /> No
        </button>
      </div>
      {response && (
        <p className="font-sans text-primary-500 text-sm mt-3">
          {response === 'yes' ? 'Thank you for your feedback.' : 'Thank you — we will use this to improve our content.'}
        </p>
      )}
    </div>
  );
}
