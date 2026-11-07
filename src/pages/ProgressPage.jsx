import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import StatCard from '../components/StatCard';
import { useAuth } from '../context/AuthContext';
import { 
  Flame, 
  Trophy, 
  Target, 
  Search, 
  Calendar, 
  ExternalLink, 
  CheckCircle2, 
  Sparkles,
  BookOpen,
  ArrowRight,
  Filter 
} from 'lucide-react';
import { subscribeToUserCompletions } from '../services/completionService';
import { calculateStreaks } from '../utils/streakCalculator';
import { formatDisplayDate, getTodayString } from '../utils/dateUtils';
import { Link } from 'react-router-dom';

export default function ProgressPage() {
  const { currentUser } = useAuth();
  const [completions, setCompletions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    if (!currentUser) return;
    setLoading(true);
    const unsub = subscribeToUserCompletions(currentUser.uid, (list) => {
      setCompletions(list);
      setLoading(false);
    });
    return () => unsub && unsub();
  }, [currentUser]);

  const streakStats = calculateStreaks(completions);
  const todayStr = getTodayString();
  const isTodayCompleted = streakStats.completedDatesSet.has(todayStr);

  const filteredCompletions = completions.filter((c) => {
    const title = (c.problemTitle || '').toLowerCase();
    const date = (c.date || '').toLowerCase();
    const q = searchQuery.toLowerCase();
    return title.includes(q) || date.includes(q);
  });

  return (
    <div className="min-h-screen bg-dark-bg text-brand-text flex flex-col selection:bg-brand-purple/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-8">
        {/* Title */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-dark-border/60">
          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight flex items-center gap-3">
              <span>My Progress & Streaks</span>
            </h1>
            <p className="text-sm text-brand-subtext font-sans mt-1">
              Analyze your problem-solving consistency, active streaks, and completed challenge history.
            </p>
          </div>

          <Link
            to="/dashboard"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs sm:text-sm font-semibold transition-all shadow-glow-purple"
          >
            <BookOpen className="w-4 h-4" />
            <span>Today's Challenge</span>
          </Link>
        </div>

        {/* Statistics Cards */}
        <section className="grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6">
          <StatCard
            title="Current Streak"
            value={`${streakStats.currentStreak} ${streakStats.currentStreak === 1 ? 'Day' : 'Days'}`}
            icon={Flame}
            accentColor="orange"
            badge={isTodayCompleted ? 'Completed Today' : streakStats.isStreakAtRisk ? 'At Risk' : 'Active'}
            badgeType={isTodayCompleted ? 'success' : streakStats.isStreakAtRisk ? 'warning' : 'neutral'}
            subtitle={isTodayCompleted ? 'Kept alive for today' : 'Solve today to extend your streak'}
          />

          <StatCard
            title="Longest Streak"
            value={`${streakStats.longestStreak} ${streakStats.longestStreak === 1 ? 'Day' : 'Days'}`}
            icon={Trophy}
            accentColor="purple"
            badge="Best Record"
            badgeType="purple"
            subtitle="Maximum consecutive days achieved"
          />

          <StatCard
            title="Total Solved"
            value={streakStats.totalCompleted}
            icon={Target}
            accentColor="blue"
            badge="Milestone"
            badgeType="neutral"
            subtitle="Total verified completed challenges"
          />
        </section>

        {/* Completions Log Table / List */}
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                Completed Challenges History
              </h2>
              <p className="text-xs text-brand-subtext">
                Showing {filteredCompletions.length} of {completions.length} completed records
              </p>
            </div>

            {/* Search filter */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-brand-subtext absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by title or date..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-bg/80 border border-dark-border text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-brand-subtext font-mono text-sm">
              Loading your completion history...
            </div>
          ) : filteredCompletions.length === 0 ? (
            <div className="py-12 text-center max-w-sm mx-auto">
              <div className="w-12 h-12 rounded-2xl bg-dark-muted border border-dark-border flex items-center justify-center text-brand-subtext mx-auto mb-3">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="text-base font-bold text-white mb-1">
                {searchQuery ? 'No matching completions' : 'No challenges completed yet'}
              </h3>
              <p className="text-xs text-brand-subtext mb-5">
                {searchQuery 
                  ? 'Try searching with another keyword.' 
                  : 'Start your streak today by solving and marking your first daily challenge!'}
              </p>
              {!searchQuery && (
                <Link
                  to="/dashboard"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-brand-purple hover:bg-brand-purple-dark text-white text-xs font-semibold transition-all shadow-glow-purple"
                >
                  <span>Go to Today's Challenge</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-dark-border/80 text-brand-subtext font-mono uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Problem Title</th>
                    <th className="py-3 px-4">Status</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/40 font-sans">
                  {filteredCompletions.map((comp) => {
                    return (
                      <tr key={comp.id || comp.date} className="hover:bg-dark-muted/40 transition-colors">
                        <td className="py-3.5 px-4 font-mono text-zinc-300">
                          {formatDisplayDate(comp.date, false)}
                        </td>
                        <td className="py-3.5 px-4 font-semibold text-white">
                          {comp.problemTitle}
                        </td>
                        <td className="py-3.5 px-4">
                          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold bg-brand-success/15 text-brand-success border border-brand-success/30">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            Completed
                          </span>
                        </td>
                        <td className="py-3.5 px-4 text-right">
                          <Link
                            to="/dashboard"
                            className="inline-flex items-center gap-1 text-xs text-brand-purple-light hover:text-white font-mono transition-colors"
                          >
                            <span>View</span>
                            <ArrowRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </main>
    </div>
  );
}
