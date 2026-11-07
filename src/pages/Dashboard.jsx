import React, { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import DailyChallenge from '../components/DailyChallenge';
import WeeklyActivity from '../components/WeeklyActivity';
import EmptyState from '../components/EmptyState';
import { 
  Flame, 
  Trophy, 
  Target, 
  Calendar, 
  Sparkles, 
  ShieldAlert, 
  CheckCircle2, 
  AlertTriangle,
  Loader2 
} from 'lucide-react';
import { getTodayString, formatDisplayDate } from '../utils/dateUtils';
import { calculateStreaks } from '../utils/streakCalculator';
import { subscribeToChallenge } from '../services/problemService';
import { 
  subscribeToUserCompletions, 
  markProblemCompleted 
} from '../services/completionService';

export default function Dashboard() {
  const { currentUser, userProfile } = useAuth();
  const { showSuccess, showError } = useToast();

  const [todayChallenge, setTodayChallenge] = useState(null);
  const [completions, setCompletions] = useState([]);
  const [loadingChallenge, setLoadingChallenge] = useState(true);
  const [loadingCompletions, setLoadingCompletions] = useState(true);

  const todayStr = getTodayString();

  // Listen to today's challenge
  useEffect(() => {
    setLoadingChallenge(true);
    const unsubChallenge = subscribeToChallenge(todayStr, (data) => {
      setTodayChallenge(data);
      setLoadingChallenge(false);
    });

    return () => unsubChallenge && unsubChallenge();
  }, [todayStr]);

  // Listen to user's completions
  useEffect(() => {
    if (!currentUser) return;
    setLoadingCompletions(true);
    const unsubCompletions = subscribeToUserCompletions(currentUser.uid, (list) => {
      setCompletions(list);
      setLoadingCompletions(false);
    });

    return () => unsubCompletions && unsubCompletions();
  }, [currentUser]);

  // Calculate streaks and activity
  const streakStats = calculateStreaks(completions);
  const isTodayCompleted = streakStats.completedDatesSet.has(todayStr);

  const handleMarkCompleted = async (problem) => {
    if (!currentUser) return;
    const result = await markProblemCompleted(currentUser.uid, problem);
    return result;
  };

  const displayName = currentUser?.displayName || userProfile?.displayName || 'Developer';
  const firstName = displayName.split(' ')[0];

  return (
    <div className="min-h-screen bg-dark-bg text-brand-text flex flex-col selection:bg-brand-purple/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Welcome Section */}
        <section className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-dark-border/60">
          <div>
            <div className="flex items-center gap-2 text-xs font-mono text-brand-purple-light mb-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>{formatDisplayDate(todayStr)}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight">
              Keep showing up, <span className="text-gradient">{firstName}</span>.
            </h1>
          </div>

          {/* Today's quick status badge */}
          <div>
            {isTodayCompleted ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-brand-success/15 border border-brand-success/30 text-brand-success text-xs font-semibold">
                <CheckCircle2 className="w-4 h-4" />
                <span>Today's Challenge Completed</span>
              </div>
            ) : streakStats.isStreakAtRisk ? (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-amber-500/15 border border-amber-500/30 text-amber-400 text-xs font-semibold animate-pulse">
                <AlertTriangle className="w-4 h-4" />
                <span>Solve today to protect your {streakStats.currentStreak}-day streak!</span>
              </div>
            ) : (
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-dark-card border border-dark-border text-brand-subtext text-xs font-mono">
                <Calendar className="w-3.5 h-3.5 text-brand-purple-light" />
                <span>Pending Today's Solution</span>
              </div>
            )}
          </div>
        </section>

        {/* Statistics Cards (Current Streak, Longest Streak, Problems Completed) */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          {/* Card 1: Current Streak */}
          <StatCard
            title="Current Streak"
            value={`${streakStats.currentStreak} ${streakStats.currentStreak === 1 ? 'Day' : 'Days'}`}
            icon={Flame}
            accentColor="orange"
            badge={
              isTodayCompleted 
                ? 'Active Today' 
                : streakStats.isStreakAtRisk 
                ? 'Needs Action' 
                : streakStats.currentStreak > 0 
                ? 'Active' 
                : 'Start Streak'
            }
            badgeType={isTodayCompleted ? 'success' : streakStats.isStreakAtRisk ? 'warning' : 'neutral'}
            subtitle={
              isTodayCompleted
                ? 'Streak secured for today!'
                : streakStats.isStreakAtRisk
                ? 'Solve today to keep streak alive'
                : 'Complete challenges consecutively'
            }
          />

          {/* Card 2: Longest Streak */}
          <StatCard
            title="Longest Streak"
            value={`${streakStats.longestStreak} ${streakStats.longestStreak === 1 ? 'Day' : 'Days'}`}
            icon={Trophy}
            accentColor="purple"
            badge="Personal Best"
            badgeType="purple"
            subtitle="Your all-time consecutive record"
          />

          {/* Card 3: Problems Completed */}
          <StatCard
            title="Problems Completed"
            value={streakStats.totalCompleted}
            icon={Target}
            accentColor="blue"
            badge="Total Solved"
            badgeType="neutral"
            subtitle="Total daily challenges conquered"
          />
        </section>

        {/* Main Content Grid: Daily Challenge + Weekly Activity */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
          {/* Left Column (2 Cols on lg): Daily Challenge Hero */}
          <div className="lg:col-span-2 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <span>Daily Challenge</span>
                <span className="text-xs font-mono font-normal text-brand-subtext">
                  ({todayStr})
                </span>
              </h2>
            </div>

            {loadingChallenge ? (
              <div className="bg-dark-card border border-dark-border rounded-3xl p-12 flex flex-col items-center justify-center text-center">
                <Loader2 className="w-8 h-8 text-brand-purple animate-spin mb-3" />
                <p className="text-sm text-brand-subtext font-mono">Loading today's challenge...</p>
              </div>
            ) : todayChallenge ? (
              <DailyChallenge
                challenge={todayChallenge}
                isCompleted={isTodayCompleted}
                onMarkCompleted={handleMarkCompleted}
              />
            ) : (
              <EmptyState
                title="No challenge posted yet."
                description="The administrator hasn't published today's LeetCode problem yet. Check back soon or visit your progress page to review completed challenges."
              />
            )}
          </div>

          {/* Right Column: Weekly Activity & Consistency Motivator */}
          <div className="space-y-6">
            {/* Weekly Activity Section */}
            <WeeklyActivity completedDatesSet={streakStats.completedDatesSet} />

            {/* Consistency Quote Card */}
            <div className="bg-gradient-to-br from-dark-card to-[#181822] border border-dark-border/80 rounded-2xl p-6 shadow-xl relative overflow-hidden">
              <div className="flex items-center gap-2 text-xs font-mono text-brand-purple-light uppercase tracking-wider mb-3">
                <Sparkles className="w-4 h-4 text-brand-purple" />
                <span>The DailyCode Philosophy</span>
              </div>
              <blockquote className="text-sm text-zinc-300 italic leading-relaxed mb-4">
                "We are what we repeatedly do. Excellence, then, is not an act, but a habit."
              </blockquote>
              <div className="flex items-center justify-between text-xs text-brand-subtext font-mono border-t border-dark-border/60 pt-3">
                <span>Aristotle</span>
                <span className="text-brand-purple-light font-bold">1% Better Every Day</span>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
