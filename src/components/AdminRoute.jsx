import React, { useState } from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { ShieldAlert, Code2, ShieldCheck, Sparkles, Loader2 } from 'lucide-react';

export default function AdminRoute({ children }) {
  const { currentUser, isAdmin, promoteToAdmin, loading } = useAuth();
  const [claiming, setClaiming] = useState(false);
  const [claimError, setClaimError] = useState('');

  if (loading) {
    return (
      <div className="min-h-screen bg-dark-bg flex flex-col items-center justify-center p-4">
        <div className="w-12 h-12 rounded-xl bg-dark-card border border-brand-purple/30 flex items-center justify-center animate-pulse">
          <Code2 className="w-6 h-6 text-brand-purple" />
        </div>
        <p className="mt-4 text-sm text-brand-subtext font-mono">Checking administrator authorizations...</p>
      </div>
    );
  }

  if (!currentUser) {
    return <Navigate to="/" replace />;
  }

  if (!isAdmin) {
    const handleClaimAdmin = async () => {
      setClaiming(true);
      setClaimError('');
      try {
        await promoteToAdmin();
      } catch (err) {
        console.error(err);
        setClaimError(err.message || 'Failed to claim admin privileges in Firestore.');
      } finally {
        setClaiming(false);
      }
    };

    return (
      <div className="min-h-screen bg-dark-bg flex items-center justify-center p-4">
        <div className="max-w-md w-full bg-dark-card border border-brand-purple/40 rounded-3xl p-6 sm:p-8 text-center shadow-2xl relative overflow-hidden">
          <div className="w-14 h-14 rounded-2xl bg-amber-500/10 border border-amber-500/30 text-amber-400 mx-auto flex items-center justify-center mb-4">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-xl font-bold text-white mb-2">Administrator Access Required</h2>
          <p className="text-sm text-brand-subtext mb-2">
            Signed in as <strong className="text-white">{currentUser.email}</strong>.
          </p>
          <p className="text-xs text-zinc-400 mb-6 leading-relaxed">
            If you are the platform administrator, click below to initialize and activate your <strong className="text-amber-400">ADMIN</strong> privileges in Cloud Firestore.
          </p>

          {claimError && (
            <div className="p-3 mb-4 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-300 text-xs font-mono">
              {claimError}
            </div>
          )}

          <div className="flex flex-col gap-3">
            <button
              onClick={handleClaimAdmin}
              disabled={claiming}
              className="w-full inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple-dark hover:to-brand-blue-dark text-white text-sm font-semibold transition-all shadow-glow-purple disabled:opacity-50"
            >
              {claiming ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Activating Admin in Firestore...</span>
                </>
              ) : (
                <>
                  <ShieldCheck className="w-4 h-4 text-amber-400" />
                  <span>Activate Admin Privileges</span>
                </>
              )}
            </button>
            <a
              href="/dashboard"
              className="text-xs font-mono text-zinc-400 hover:text-white transition-colors py-2"
            >
              ← Return to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
