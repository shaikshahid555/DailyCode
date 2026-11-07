import React from 'react';
import { CalendarClock, Sparkles, BookOpen, Clock } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({ 
  title = "No challenge posted yet.", 
  description = "The administrator hasn't published today's LeetCode problem yet. Check back soon to keep your streak burning!",
  showHistoryLink = true
}) {
  return (
    <div className="bg-dark-card border border-dark-border/80 rounded-3xl p-8 sm:p-12 text-center shadow-xl relative overflow-hidden">
      {/* Background glow */}
      <div className="absolute inset-0 bg-gradient-to-b from-brand-purple/5 to-transparent pointer-events-none" />

      <div className="relative z-10 max-w-md mx-auto flex flex-col items-center">
        {/* Modern Illustration icon */}
        <div className="relative mb-6">
          <div className="w-20 h-20 rounded-3xl bg-dark-card-hover border border-dark-border flex items-center justify-center text-brand-purple-light shadow-glow-purple/30">
            <CalendarClock className="w-10 h-10 stroke-[1.5]" />
          </div>
          <div className="absolute -top-1 -right-1 w-6 h-6 rounded-full bg-brand-purple/20 border border-brand-purple/50 flex items-center justify-center text-brand-purple-light animate-pulse">
            <Sparkles className="w-3.5 h-3.5" />
          </div>
        </div>

        {/* Text */}
        <h3 className="text-xl sm:text-2xl font-bold text-white tracking-tight mb-2">
          {title}
        </h3>
        <p className="text-sm text-brand-subtext leading-relaxed mb-6 font-sans">
          {description}
        </p>

        {/* Action Link */}
        {showHistoryLink && (
          <Link
            to="/progress"
            className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-dark-muted hover:bg-zinc-800 text-brand-purple-light border border-dark-border hover:border-brand-purple/40 text-xs sm:text-sm font-semibold transition-all"
          >
            <BookOpen className="w-4 h-4" />
            <span>Browse Past Completed Problems</span>
          </Link>
        )}
      </div>
    </div>
  );
}
