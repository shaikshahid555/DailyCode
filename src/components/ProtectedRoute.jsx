import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2 } from 'lucide-react';

export default function ProtectedRoute({ children }) {
  const { currentUser, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
        <div className="relative">
          <div className="w-14 h-14 rounded-2xl bg-dark-card border border-brand-purple/40 flex items-center justify-center animate-pulse">
            <Code2 className="w-7 h-7 text-brand-purple" />
          </div>
          <div className="absolute inset-0 rounded-2xl bg-brand-purple/20 blur-xl animate-pulse"></div>
        </div>
        <p className="mt-4 text-sm text-brand-subtext font-mono tracking-wide">
          Verifying developer session...
        </p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" state={{ from: location }} replace />;
  }

  return children;
}
