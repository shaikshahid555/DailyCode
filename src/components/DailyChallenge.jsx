import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { 
  ExternalLink, 
  CheckCircle2, 
  Calendar, 
  Tag, 
  BookOpen, 
  Clock, 
  Award, 
  Sparkles,
  Loader2 
} from 'lucide-react';
import { formatDisplayDate } from '../utils/dateUtils';
import { useToast } from '../context/ToastContext';

export default function DailyChallenge({ 
  challenge, 
  isCompleted, 
  onMarkCompleted 
}) {
  const { showSuccess, showError } = useToast();
  const [submitting, setSubmitting] = useState(false);

  if (!challenge) return null;

  const handleCompleteClick = async () => {
    if (isCompleted || submitting) return;

    setSubmitting(true);
    try {
      await onMarkCompleted(challenge);
      
      // Fire confetti celebration
      try {
        confetti({
          particleCount: 80,
          spread: 70,
          origin: { y: 0.65 },
          colors: ['#8B5CF6', '#6366F1', '#22C55E', '#EC4899']
        });
      } catch (e) {
        // Confetti is decorative
      }

      showSuccess('Challenge marked as completed! Streak updated.');
    } catch (err) {
      console.error(err);
      showError(err.message || 'Failed to record completion.');
    } finally {
      setSubmitting(false);
    }
  };

  const difficultyStyles = {
    Easy: 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30',
    Medium: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    Hard: 'bg-rose-500/15 text-rose-400 border-rose-500/30'
  };

  const diffBadgeClass = difficultyStyles[challenge.difficulty] || difficultyStyles.Medium;

  return (
    <div className="relative bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 shadow-2xl overflow-hidden group">
      {/* Top subtle decorative accent glow */}
      <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-brand-purple via-brand-blue to-emerald-500" />
      
      {/* Background glow circle */}
      <div className="absolute -bottom-24 -right-24 w-72 h-72 rounded-full bg-brand-purple/5 blur-3xl pointer-events-none" />

      {/* Header Meta: Date & Badges */}
      <div className="flex flex-wrap items-center justify-between gap-3 mb-5">
        <div className="flex items-center gap-2 text-xs font-mono text-brand-subtext bg-dark-muted/80 px-3 py-1.5 rounded-lg border border-dark-border">
          <Calendar className="w-3.5 h-3.5 text-brand-purple-light" />
          <span>{formatDisplayDate(challenge.date)}</span>
        </div>

        <div className="flex items-center gap-2">
          {/* DSA Topic Badge */}
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-medium bg-brand-blue/10 text-brand-blue-light border border-brand-blue/20">
            <Tag className="w-3 h-3" />
            {challenge.topic}
          </span>

          {/* Difficulty Badge */}
          <span className={`inline-flex items-center px-3 py-1 rounded-lg text-xs font-semibold border ${diffBadgeClass}`}>
            {challenge.difficulty}
          </span>
        </div>
      </div>

      {/* Problem Title */}
      <div className="mb-4">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-xs uppercase font-mono tracking-wider text-brand-purple-light font-semibold">
            Today's Mission
          </span>
          {isCompleted && (
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[11px] font-semibold bg-brand-success/15 text-brand-success border border-brand-success/30">
              <CheckCircle2 className="w-3 h-3" /> Solved Today
            </span>
          )}
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight leading-snug">
          {challenge.title}
        </h2>
      </div>

      {/* Problem Description */}
      <div className="mb-8 p-4 rounded-2xl bg-dark-bg/60 border border-dark-border/60 text-sm sm:text-base text-zinc-300 leading-relaxed font-sans">
        <p className="whitespace-pre-line">{challenge.description}</p>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 pt-2 border-t border-dark-border/60">
        {/* SOLVE ON LEETCODE BUTTON */}
        <a
          href={challenge.leetcodeURL}
          target="_blank"
          rel="noopener noreferrer"
          className="flex-1 inline-flex items-center justify-center gap-2.5 px-6 py-3.5 rounded-xl font-semibold text-sm bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple-dark hover:to-brand-blue-dark text-white transition-all shadow-glow-purple hover:scale-[1.01] active:scale-[0.99] focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
        >
          <BookOpen className="w-4 h-4" />
          <span>Solve on LeetCode</span>
          <ExternalLink className="w-4 h-4 opacity-80" />
        </a>

        {/* MARK AS COMPLETED BUTTON */}
        {isCompleted ? (
          <div className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-brand-success/15 border border-brand-success/40 text-brand-success cursor-default">
            <CheckCircle2 className="w-5 h-5" />
            <span>Completed Today</span>
          </div>
        ) : (
          <button
            onClick={handleCompleteClick}
            disabled={submitting}
            className="flex-1 inline-flex items-center justify-center gap-2 px-6 py-3.5 rounded-xl font-semibold text-sm bg-dark-muted hover:bg-zinc-800 text-white border border-dark-border hover:border-brand-purple/50 transition-all hover:scale-[1.01] active:scale-[0.99] disabled:opacity-50 disabled:cursor-not-allowed focus:outline-none focus:ring-2 focus:ring-brand-purple/50"
          >
            {submitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-brand-purple" />
                <span>Marking...</span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-brand-subtext group-hover:text-brand-success transition-colors" />
                <span>Mark as Completed</span>
              </>
            )}
          </button>
        )}
      </div>

      {/* Self-reported honor system note */}
      <div className="mt-3 text-center sm:text-right">
        <span className="text-[11px] text-zinc-500 font-mono">
          * Self-reported completion on the developer honor system.
        </span>
      </div>
    </div>
  );
}
