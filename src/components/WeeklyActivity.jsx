import React from 'react';
import { Check, Flame, CalendarDays } from 'lucide-react';
import { getCurrentWeekDates } from '../utils/dateUtils';

export default function WeeklyActivity({ completedDatesSet = new Set() }) {
  const weekDays = getCurrentWeekDates();

  const completedCountInWeek = weekDays.filter(day => completedDatesSet.has(day.dateStr)).length;

  return (
    <div className="bg-dark-card border border-dark-border rounded-2xl p-5 sm:p-6 shadow-xl">
      <div className="flex items-center justify-between mb-5">
        <div className="flex items-center gap-2">
          <CalendarDays className="w-5 h-5 text-brand-purple" />
          <h3 className="text-base font-bold text-white tracking-tight">
            Weekly Activity
          </h3>
        </div>
        <div className="flex items-center gap-1.5 text-xs font-mono">
          <span className="text-brand-purple-light font-bold">{completedCountInWeek}</span>
          <span className="text-zinc-500">/ 7 days active</span>
        </div>
      </div>

      {/* 7 Days Grid */}
      <div className="grid grid-cols-7 gap-2 sm:gap-4">
        {weekDays.map((day) => {
          const isDone = completedDatesSet.has(day.dateStr);

          return (
            <div 
              key={day.dateStr} 
              className={`flex flex-col items-center p-2.5 sm:p-3 rounded-xl border transition-all ${
                day.isToday 
                  ? 'border-brand-purple/50 bg-brand-purple/10 shadow-sm' 
                  : isDone
                  ? 'border-brand-success/30 bg-dark-card-hover'
                  : 'border-dark-border/60 bg-dark-bg/40'
              }`}
            >
              {/* Day abbreviation */}
              <span className={`text-[11px] font-mono uppercase tracking-wider font-semibold ${
                day.isToday ? 'text-brand-purple-light' : 'text-brand-subtext'
              }`}>
                {day.dayAbbr}
              </span>

              {/* Day number */}
              <span className={`text-xs font-mono my-1 ${
                day.isToday ? 'text-white font-bold' : 'text-zinc-400'
              }`}>
                {day.dayNumber}
              </span>

              {/* Status Circle Indicator */}
              <div 
                className={`mt-1 w-7 h-7 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                  isDone
                    ? 'bg-gradient-to-br from-brand-success to-emerald-600 text-white shadow-glow-success scale-105'
                    : day.isToday
                    ? 'border-2 border-dashed border-brand-purple/60 text-brand-purple-light'
                    : 'bg-dark-muted border border-dark-border text-zinc-600'
                }`}
                title={`${day.dayName}: ${isDone ? 'Completed' : 'Not completed'}`}
              >
                {isDone ? (
                  <Check className="w-4 h-4 stroke-[2.5]" />
                ) : (
                  <div className={`w-1.5 h-1.5 rounded-full ${day.isToday ? 'bg-brand-purple-light animate-ping' : 'bg-zinc-700'}`} />
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
