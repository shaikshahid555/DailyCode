import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  Code2, 
  Flame, 
  TrendingUp, 
  ShieldCheck, 
  LogOut, 
  Menu, 
  X, 
  Sparkles,
  ExternalLink 
} from 'lucide-react';

export default function Navbar() {
  const { currentUser, userProfile, isAdmin, logout } = useAuth();
  const { showSuccess, showError } = useToast();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await logout();
      showSuccess('Successfully signed out.');
      navigate('/');
    } catch (err) {
      showError('Failed to sign out. Please try again.');
    }
  };

  const isActive = (path) => location.pathname === path;

  return (
    <header className="sticky top-0 z-40 w-full border-b border-dark-border/80 bg-dark-bg/80 backdrop-blur-md">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <Link 
          to={currentUser ? "/dashboard" : "/"} 
          className="flex items-center gap-3 group focus:outline-none"
        >
          <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-brand-purple to-brand-blue p-[1px] shadow-glow-purple/50 group-hover:scale-105 transition-transform duration-200">
            <div className="w-full h-full bg-dark-card rounded-[11px] flex items-center justify-center">
              <Code2 className="w-5 h-5 text-brand-purple-light group-hover:text-white transition-colors" />
            </div>
          </div>
          <div className="flex flex-col">
            <div className="flex items-center gap-1.5">
              <span className="font-bold text-lg text-white tracking-tight font-sans">
                Daily<span className="text-gradient">Code</span>
              </span>
              <span className="text-[10px] font-mono font-bold tracking-wider px-1.5 py-0.5 rounded bg-brand-purple/20 text-brand-purple-light border border-brand-purple/30">
                PRO
              </span>
            </div>
          </div>
        </Link>

        {/* Desktop Navigation Links */}
        {currentUser && (
          <nav className="hidden md:flex items-center gap-1">
            <Link
              to="/dashboard"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                isActive('/dashboard')
                  ? 'bg-brand-purple/15 text-brand-purple-light border border-brand-purple/30 shadow-sm'
                  : 'text-brand-subtext hover:text-white hover:bg-dark-card'
              }`}
            >
              Daily Challenge
            </Link>

            <Link
              to="/progress"
              className={`px-3.5 py-2 rounded-lg text-sm font-medium transition-all flex items-center gap-1.5 ${
                isActive('/progress')
                  ? 'bg-brand-purple/15 text-brand-purple-light border border-brand-purple/30 shadow-sm'
                  : 'text-brand-subtext hover:text-white hover:bg-dark-card'
              }`}
            >
              <TrendingUp className="w-4 h-4" />
              My Progress
            </Link>

            {isAdmin && (
              <Link
                to="/admin"
                className={`px-3.5 py-2 rounded-lg text-sm font-semibold transition-all flex items-center gap-1.5 ${
                  isActive('/admin')
                    ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-sm'
                    : 'text-amber-400/90 hover:text-amber-200 hover:bg-amber-950/30'
                }`}
              >
                <ShieldCheck className="w-4 h-4 text-amber-400" />
                Admin Console
              </Link>
            )}
          </nav>
        )}

        {/* User Profile & Actions */}
        <div className="flex items-center gap-3">
          {currentUser ? (
            <div className="relative">
              <button
                onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                className="flex items-center gap-3 p-1.5 rounded-xl border border-dark-border hover:border-dark-border/80 bg-dark-card/60 hover:bg-dark-card transition-all focus:outline-none focus:ring-2 focus:ring-brand-purple/40"
                aria-expanded={userDropdownOpen}
              >
                {currentUser.photoURL ? (
                  <img
                    src={currentUser.photoURL}
                    alt={currentUser.displayName || 'User'}
                    className="w-8 h-8 rounded-lg object-cover border border-brand-purple/30"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-lg bg-brand-purple/20 text-brand-purple-light flex items-center justify-center font-bold text-xs uppercase border border-brand-purple/40">
                    {(currentUser.displayName || currentUser.email || 'U')[0]}
                  </div>
                )}
                <div className="hidden sm:flex flex-col text-left pr-1">
                  <span className="text-xs font-semibold text-white leading-tight truncate max-w-[120px]">
                    {currentUser.displayName || 'Developer'}
                  </span>
                  <span className="text-[10px] text-brand-subtext font-mono truncate max-w-[120px]">
                    {userProfile?.role === 'ADMIN' ? 'Administrator' : 'LeetCode Solver'}
                  </span>
                </div>
              </button>

              {/* User Dropdown */}
              {userDropdownOpen && (
                <>
                  <div 
                    className="fixed inset-0 z-40" 
                    onClick={() => setUserDropdownOpen(false)}
                  />
                  <div className="absolute right-0 mt-2 w-64 rounded-xl bg-dark-card border border-dark-border shadow-2xl z-50 p-2 divide-y divide-dark-border">
                    <div className="px-3 py-2.5">
                      <p className="text-xs font-medium text-brand-subtext">Signed in as</p>
                      <p className="text-sm font-semibold text-white truncate">{currentUser.displayName}</p>
                      <p className="text-xs text-brand-subtext font-mono truncate">{currentUser.email}</p>
                      {isAdmin && (
                        <span className="mt-2 inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30">
                          <ShieldCheck className="w-3 h-3" /> ADMIN PRIVILEGES
                        </span>
                      )}
                    </div>

                    <div className="py-1">
                      <Link
                        to="/dashboard"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-brand-subtext hover:text-white hover:bg-dark-muted rounded-lg transition-colors"
                      >
                        <Code2 className="w-4 h-4 text-brand-purple" />
                        Today's Challenge
                      </Link>
                      <Link
                        to="/progress"
                        onClick={() => setUserDropdownOpen(false)}
                        className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-brand-subtext hover:text-white hover:bg-dark-muted rounded-lg transition-colors"
                      >
                        <TrendingUp className="w-4 h-4 text-brand-blue" />
                        My Streak & History
                      </Link>
                      {isAdmin && (
                        <Link
                          to="/admin"
                          onClick={() => setUserDropdownOpen(false)}
                          className="flex items-center gap-2 px-3 py-2 text-xs font-medium text-amber-400 hover:text-amber-200 hover:bg-amber-950/30 rounded-lg transition-colors"
                        >
                          <ShieldCheck className="w-4 h-4 text-amber-400" />
                          Publish / Manage Challenges
                        </Link>
                      )}
                    </div>

                    <div className="pt-1">
                      <button
                        onClick={() => {
                          setUserDropdownOpen(false);
                          handleLogout();
                        }}
                        className="w-full flex items-center gap-2 px-3 py-2 text-xs font-medium text-brand-danger hover:bg-brand-danger/10 rounded-lg transition-colors"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          ) : (
            <Link
              to="/"
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold bg-brand-purple hover:bg-brand-purple-dark text-white transition-all shadow-glow-purple"
            >
              Sign In
            </Link>
          )}

          {/* Mobile menu toggle */}
          {currentUser && (
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="md:hidden p-2 rounded-lg text-brand-subtext hover:text-white hover:bg-dark-card border border-dark-border"
              aria-label="Toggle navigation"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          )}
        </div>
      </div>

      {/* Mobile Menu Drawer */}
      {currentUser && mobileMenuOpen && (
        <div className="md:hidden border-t border-dark-border bg-dark-bg/95 backdrop-blur-xl px-4 pt-3 pb-5 space-y-1">
          <Link
            to="/dashboard"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/dashboard')
                ? 'bg-brand-purple/20 text-brand-purple-light border border-brand-purple/30'
                : 'text-brand-subtext hover:text-white hover:bg-dark-card'
            }`}
          >
            Daily Challenge
          </Link>
          <Link
            to="/progress"
            onClick={() => setMobileMenuOpen(false)}
            className={`block px-3 py-2.5 rounded-lg text-sm font-medium ${
              isActive('/progress')
                ? 'bg-brand-purple/20 text-brand-purple-light border border-brand-purple/30'
                : 'text-brand-subtext hover:text-white hover:bg-dark-card'
            }`}
          >
            My Progress & Streaks
          </Link>
          {isAdmin && (
            <Link
              to="/admin"
              onClick={() => setMobileMenuOpen(false)}
              className={`block px-3 py-2.5 rounded-lg text-sm font-semibold ${
                isActive('/admin')
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-amber-400 hover:bg-amber-950/30'
              }`}
            >
              Admin Challenge Console
            </Link>
          )}
          <div className="pt-2 border-t border-dark-border/60">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                handleLogout();
              }}
              className="w-full flex items-center gap-2 px-3 py-2.5 rounded-lg text-sm font-medium text-brand-danger hover:bg-brand-danger/10"
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </button>
          </div>
        </div>
      )}
    </header>
  );
}
