import React from 'react';
import { Link } from 'react-router-dom';
import { Code2, ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen bg-dark-bg text-brand-text flex flex-col items-center justify-center p-4 selection:bg-brand-purple/30 selection:text-white">
      <div className="max-w-md w-full bg-dark-card border border-dark-border rounded-3xl p-8 text-center shadow-2xl">
        <div className="w-16 h-16 rounded-2xl bg-brand-purple/10 border border-brand-purple/30 text-brand-purple-light flex items-center justify-center mx-auto mb-6">
          <Code2 className="w-8 h-8" />
        </div>
        <h1 className="text-4xl font-extrabold text-white mb-2 font-mono">404</h1>
        <h2 className="text-lg font-bold text-white mb-3">Page Not Found</h2>
        <p className="text-sm text-brand-subtext mb-8">
          The page or challenge you are looking for does not exist or has been relocated.
        </p>
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-sm font-semibold transition-all shadow-glow-purple w-full"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Return Home</span>
        </Link>
      </div>
    </div>
  );
}
