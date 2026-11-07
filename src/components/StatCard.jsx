import React from 'react';

export default function StatCard({ 
  title, 
  value, 
  icon: Icon, 
  accentColor = 'purple', 
  subtitle, 
  badge,
  badgeType = 'neutral' 
}) {
  const colorStyles = {
    purple: {
      border: 'border-brand-purple/20 hover:border-brand-purple/50',
      iconBg: 'bg-brand-purple/10 text-brand-purple-light border-brand-purple/20',
      glow: 'hover:shadow-glow-purple',
      accentText: 'text-brand-purple-light'
    },
    blue: {
      border: 'border-brand-blue/20 hover:border-brand-blue/50',
      iconBg: 'bg-brand-blue/10 text-brand-blue-light border-brand-blue/20',
      glow: 'hover:shadow-glow-blue',
      accentText: 'text-brand-blue-light'
    },
    orange: {
      border: 'border-amber-500/20 hover:border-amber-500/50',
      iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
      glow: 'hover:shadow-[0_0_25px_-5px_rgba(245,158,11,0.25)]',
      accentText: 'text-amber-400'
    },
    green: {
      border: 'border-brand-success/20 hover:border-brand-success/50',
      iconBg: 'bg-brand-success/10 text-brand-success border-brand-success/20',
      glow: 'hover:shadow-glow-success',
      accentText: 'text-brand-success'
    }
  };

  const style = colorStyles[accentColor] || colorStyles.purple;

  const badgeStyles = {
    success: 'bg-brand-success/15 text-brand-success border-brand-success/30',
    warning: 'bg-amber-500/15 text-amber-400 border-amber-500/30',
    purple: 'bg-brand-purple/15 text-brand-purple-light border-brand-purple/30',
    neutral: 'bg-zinc-800 text-zinc-400 border-zinc-700'
  };

  return (
    <div 
      className={`relative bg-dark-card border ${style.border} rounded-2xl p-5 sm:p-6 transition-all duration-300 ${style.glow} group overflow-hidden`}
    >
      {/* Background subtle radial glow */}
      <div className="absolute -top-12 -right-12 w-32 h-32 rounded-full bg-white/[0.02] blur-xl pointer-events-none group-hover:bg-white/[0.04] transition-all" />

      <div className="flex items-center justify-between mb-4">
        <span className="text-xs sm:text-sm font-medium text-brand-subtext tracking-wide uppercase font-mono">
          {title}
        </span>
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center border ${style.iconBg} transition-transform group-hover:scale-110 duration-200`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      <div className="flex items-baseline gap-2">
        <span className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight font-sans">
          {value}
        </span>
        {badge && (
          <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-[11px] font-semibold border ${badgeStyles[badgeType]}`}>
            {badge}
          </span>
        )}
      </div>

      {subtitle && (
        <p className="mt-2 text-xs text-zinc-400 flex items-center gap-1 font-sans">
          {subtitle}
        </p>
      )}
    </div>
  );
}
