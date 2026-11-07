import React, { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Code2, 
  Flame, 
  Trophy, 
  TrendingUp, 
  Sparkles, 
  CheckCircle2, 
  ArrowRight,
  Shield, 
  Zap, 
  Terminal,
  Loader2,
  AlertTriangle 
} from 'lucide-react';
import { isFirebaseConfigured } from '../firebase/config';

export default function LandingPage() {
  const { currentUser, loginWithGoogle, loading } = useAuth();
  const { showSuccess, showError } = useToast();
  const [signingIn, setSigningIn] = useState(false);
  const navigate = useNavigate();

  // If already logged in, redirect straight to user dashboard
  if (!loading && currentUser) {
    return <Navigate to="/dashboard" replace />;
  }

  const handleGoogleLogin = async () => {
    if (signingIn) return;
    setSigningIn(true);
    try {
      await loginWithGoogle();
      showSuccess('Welcome back to DailyCode!');
      navigate('/dashboard');
    } catch (err) {
      console.error(err);
      showError(err.message || 'Failed to sign in with Google.');
    } finally {
      setSigningIn(false);
    }
  };

  return (
    <div className="min-h-screen bg-dark-bg text-brand-text flex flex-col justify-between selection:bg-brand-purple/30 selection:text-white">
      {/* Background Decorative Gradients */}
      <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
        <div className="absolute -top-40 left-1/2 -translate-x-1/2 w-[700px] h-[450px] bg-gradient-to-b from-brand-purple/20 via-brand-blue/10 to-transparent blur-[120px] rounded-full" />
        <div className="absolute top-1/3 -left-48 w-96 h-96 bg-brand-blue/10 blur-[130px] rounded-full" />
        <div className="absolute bottom-10 -right-48 w-96 h-96 bg-brand-purple/10 blur-[130px] rounded-full" />
      </div>

      {/* Live Firebase Configuration Notice */}
      {!isFirebaseConfigured && (
        <div className="relative z-30 w-full bg-amber-500/10 border-b border-amber-500/30 text-amber-200 px-4 py-2.5 text-xs font-mono flex items-center justify-center gap-2 text-center">
          <AlertTriangle className="w-4 h-4 text-amber-400 flex-shrink-0" />
          <span>
            <strong className="text-amber-400 font-semibold">Firebase Configuration:</strong> To activate live Google OAuth &amp; Cloud Firestore, populate your keys in <code className="bg-amber-950/60 px-1.5 py-0.5 rounded text-amber-300">.env</code> (or Vercel Environment Variables).
          </span>
        </div>
      )}

      {/* Top Navbar */}
      <header className="relative z-10 w-full border-b border-dark-border/60 bg-dark-bg/60 backdrop-blur-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue p-[1px] shadow-glow-purple/40">
              <div className="w-full h-full bg-dark-card rounded-[11px] flex items-center justify-center">
                <Code2 className="w-5 h-5 text-brand-purple-light" />
              </div>
            </div>
            <span className="font-bold text-lg text-white tracking-tight">
              Daily<span className="text-gradient">Code</span>
            </span>
          </div>

          <div>
            <button
              onClick={handleGoogleLogin}
              disabled={signingIn}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-dark-card hover:bg-dark-muted border border-dark-border hover:border-brand-purple/50 text-white transition-all shadow-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/40 disabled:opacity-50"
            >
              {signingIn ? <Loader2 className="w-4 h-4 animate-spin text-brand-purple" /> : null}
              <span>Sign In</span>
            </button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <main className="relative z-10 flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-20 flex flex-col items-center justify-center text-center">
        {/* Subtle pill tag */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-purple/10 border border-brand-purple/30 text-brand-purple-light text-xs font-mono mb-8 animate-fade-in shadow-sm">
          <Sparkles className="w-3.5 h-3.5 text-brand-purple" />
          <span>Curated Daily LeetCode Challenges</span>
        </div>

        {/* Main Heading */}
        <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl leading-[1.15] mb-6">
          One Problem a Day. <br />
          <span className="text-gradient">One Step Closer to Mastery.</span>
        </h1>

        {/* Supporting Description */}
        <p className="text-base sm:text-lg md:text-xl text-brand-subtext max-w-2xl leading-relaxed mb-10 font-sans">
          Consistency beats intensity in coding interviews. Solve hand-picked daily LeetCode challenges, build unstoppable streaks, and master Data Structures & Algorithms one day at a time.
        </p>

        {/* Google Sign-In Primary CTA */}
        <div className="flex flex-col sm:flex-row items-center gap-4 w-full sm:w-auto mb-16">
          <button
            onClick={handleGoogleLogin}
            disabled={signingIn}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-4 rounded-2xl font-bold text-base bg-white hover:bg-zinc-100 text-zinc-950 transition-all duration-200 shadow-xl hover:shadow-2xl hover:scale-[1.02] active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed group focus:outline-none focus:ring-4 focus:ring-brand-purple/40"
          >
            {signingIn ? (
              <Loader2 className="w-5 h-5 animate-spin text-zinc-950" />
            ) : (
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
            )}
            <span>Continue with Google</span>
            <ArrowRight className="w-4 h-4 text-zinc-600 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Interactive Code Preview Card */}
        <div className="w-full max-w-3xl bg-dark-card border border-dark-border rounded-2xl shadow-2xl p-4 sm:p-6 text-left relative overflow-hidden mb-20">
          <div className="flex items-center justify-between pb-4 border-b border-dark-border/60 mb-4">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 rounded-full bg-rose-500/80" />
              <div className="w-3 h-3 rounded-full bg-amber-500/80" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/80" />
              <span className="ml-2 text-xs font-mono text-zinc-500">daily_challenge.js</span>
            </div>
            <div className="flex items-center gap-1.5 px-2.5 py-1 rounded bg-brand-purple/10 text-brand-purple-light text-xs font-mono">
              <Flame className="w-3.5 h-3.5 text-amber-500 fill-amber-500" />
              <span>Streak: 14 Days</span>
            </div>
          </div>

          <pre className="font-mono text-xs sm:text-sm text-zinc-300 overflow-x-auto leading-relaxed">
            <code>
              <span className="text-purple-400">const</span> dailyCode = <span className="text-blue-400">new</span> DailyChallenge({`{`}
              <br />
              &nbsp;&nbsp;topic: <span className="text-emerald-400">'Arrays & Two Pointers'</span>,
              <br />
              &nbsp;&nbsp;difficulty: <span className="text-amber-400">'Medium'</span>,
              <br />
              &nbsp;&nbsp;target: <span className="text-indigo-400">'Consistency & Interview Readiness'</span>,
              <br />
              {`}`});
              <br />
              <br />
              <span className="text-zinc-500">// Mark today complete on honor system</span>
              <br />
              <span className="text-purple-400">await</span> dailyCode.<span className="text-blue-400">markCompleted</span>();
              <br />
              <span className="text-emerald-400">console</span>.log(<span className="text-emerald-400">'🔥 Streak extended! Keep coding tomorrow.'</span>);
            </code>
          </pre>
        </div>

        {/* Feature Highlights Grid */}
        <div className="w-full max-w-5xl grid grid-cols-1 md:grid-cols-3 gap-6 text-left">
          {/* Feature 1 */}
          <div className="bg-dark-card border border-dark-border/80 hover:border-brand-purple/40 rounded-2xl p-6 transition-all duration-300 group hover:shadow-glow-purple/20">
            <div className="w-12 h-12 rounded-xl bg-brand-purple/10 border border-brand-purple/20 flex items-center justify-center text-brand-purple-light mb-4 group-hover:scale-105 transition-transform">
              <Code2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-sans">
              1. Daily Coding Challenges
            </h3>
            <p className="text-sm text-brand-subtext leading-relaxed">
              Curated daily LeetCode problems covering key DSA patterns, from Arrays and Trees to Graphs and Dynamic Programming.
            </p>
          </div>

          {/* Feature 2 */}
          <div className="bg-dark-card border border-dark-border/80 hover:border-amber-500/40 rounded-2xl p-6 transition-all duration-300 group hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.25)]">
            <div className="w-12 h-12 rounded-xl bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400 mb-4 group-hover:scale-105 transition-transform">
              <Flame className="w-6 h-6 fill-amber-400" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-sans">
              2. Build Daily Streaks
            </h3>
            <p className="text-sm text-brand-subtext leading-relaxed">
              Maintain your momentum with continuous streak tracking, grace period handling, and personal record recognition.
            </p>
          </div>

          {/* Feature 3 */}
          <div className="bg-dark-card border border-dark-border/80 hover:border-brand-blue/40 rounded-2xl p-6 transition-all duration-300 group hover:shadow-glow-blue/20">
            <div className="w-12 h-12 rounded-xl bg-brand-blue/10 border border-brand-blue/20 flex items-center justify-center text-brand-blue-light mb-4 group-hover:scale-105 transition-transform">
              <TrendingUp className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2 font-sans">
              3. Track Your Progress
            </h3>
            <p className="text-sm text-brand-subtext leading-relaxed">
              Visual weekly activity tracker and comprehensive completion archives to reflect on your problem-solving growth.
            </p>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="relative z-10 border-t border-dark-border/60 py-8 bg-dark-bg/80">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500 font-mono">
          <div className="flex items-center gap-2">
            <span>DailyCode © {new Date().getFullYear()}</span>
            <span>•</span>
            <span>One problem a day. One step closer to mastery.</span>
          </div>
          <div>
            Built with React, Tailwind CSS, & Firebase
          </div>
        </div>
      </footer>
    </div>
  );
}
