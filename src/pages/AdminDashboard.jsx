import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { 
  ShieldCheck, 
  PlusCircle, 
  Calendar, 
  Link as LinkIcon, 
  Tag, 
  FileText, 
  Layers, 
  Trash2, 
  Edit3, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  Sparkles,
  AlertCircle,
  Loader2,
  RefreshCw,
  Search
} from 'lucide-react';
import { 
  getAllChallenges, 
  saveChallenge, 
  deleteChallenge 
} from '../services/problemService';
import { formatLocalDate, getTodayString, formatDisplayDate } from '../utils/dateUtils';
import { validateLeetCodeUrl, slugToTitle } from '../utils/leetcodeValidator';

const INITIAL_FORM = {
  title: '',
  leetcodeURL: '',
  difficulty: 'Medium',
  topic: 'Arrays & Hashing',
  description: '',
  date: getTodayString()
};

const COMMON_TOPICS = [
  'Arrays & Hashing',
  'Two Pointers',
  'Sliding Window',
  'Stack',
  'Binary Search',
  'Linked List',
  'Trees & Binary Trees',
  'Tries',
  'Backtracking',
  'Heap / Priority Queue',
  'Graphs',
  'Dynamic Programming',
  '1-D Dynamic Programming',
  '2-D Dynamic Programming',
  'Greedy',
  'Intervals',
  'Math & Geometry',
  'Bit Manipulation'
];

export default function AdminDashboard() {
  const { userProfile } = useAuth();
  const { showSuccess, showError, showWarning } = useToast();

  const [challenges, setChallenges] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [formData, setFormData] = useState(INITIAL_FORM);
  const [isEditing, setIsEditing] = useState(false);
  const [urlValidationError, setUrlValidationError] = useState('');
  const [filterQuery, setFilterQuery] = useState('');
  const [deleteConfirmDate, setDeleteConfirmDate] = useState(null);

  const todayStr = getTodayString();

  const fetchChallenges = async () => {
    setLoading(true);
    try {
      const list = await getAllChallenges();
      setChallenges(list);
    } catch (err) {
      showError('Failed to load published challenges.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchChallenges();
  }, []);

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }));

    if (field === 'leetcodeURL') {
      const val = validateLeetCodeUrl(value);
      if (value.trim() && !val.isValid) {
        setUrlValidationError(val.error);
      } else {
        setUrlValidationError('');
        // Suggest title if empty
        if (val.isValid && val.slug && !formData.title) {
          setFormData(prev => ({ ...prev, title: slugToTitle(val.slug) }));
        }
      }
    }
  };

  const handlePublish = async (e) => {
    e.preventDefault();

    // Validation
    if (!formData.title.trim()) {
      showError('Please provide a problem title.');
      return;
    }
    if (!formData.leetcodeURL.trim()) {
      showError('Please provide a LeetCode problem URL.');
      return;
    }
    const urlValidation = validateLeetCodeUrl(formData.leetcodeURL);
    if (!urlValidation.isValid) {
      showError(urlValidation.error || 'Please enter a valid LeetCode URL.');
      return;
    }
    if (!formData.topic.trim()) {
      showError('Please specify a DSA topic.');
      return;
    }
    if (!formData.description.trim()) {
      showError('Please enter a short description for the problem.');
      return;
    }
    if (!formData.date) {
      showError('Please select a challenge date.');
      return;
    }

    setSubmitting(true);
    try {
      await saveChallenge({
        ...formData,
        leetcodeURL: urlValidation.normalizedUrl || formData.leetcodeURL.trim()
      });

      showSuccess(
        isEditing 
          ? `Challenge for ${formData.date} updated successfully!` 
          : `Challenge published for ${formData.date}!`
      );

      // Reset form
      setFormData(INITIAL_FORM);
      setIsEditing(false);
      setUrlValidationError('');
      fetchChallenges();
    } catch (err) {
      console.error(err);
      showError(err.message || 'Failed to publish challenge.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleEdit = (challenge) => {
    setFormData({
      title: challenge.title || '',
      leetcodeURL: challenge.leetcodeURL || '',
      difficulty: challenge.difficulty || 'Medium',
      topic: challenge.topic || 'Arrays & Hashing',
      description: challenge.description || '',
      date: challenge.date || getTodayString()
    });
    setIsEditing(true);
    setUrlValidationError('');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (dateStr) => {
    try {
      await deleteChallenge(dateStr);
      showSuccess(`Challenge for ${dateStr} deleted.`);
      setDeleteConfirmDate(null);
      fetchChallenges();
    } catch (err) {
      showError('Failed to delete challenge.');
    }
  };

  const cancelEdit = () => {
    setFormData(INITIAL_FORM);
    setIsEditing(false);
    setUrlValidationError('');
  };

  const filteredChallenges = challenges.filter(c => {
    const q = filterQuery.toLowerCase();
    return (
      (c.title || '').toLowerCase().includes(q) ||
      (c.topic || '').toLowerCase().includes(q) ||
      (c.date || '').includes(q)
    );
  });

  return (
    <div className="min-h-screen bg-dark-bg text-brand-text flex flex-col selection:bg-brand-purple/30 selection:text-white">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-10">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-dark-border/60">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-mono font-semibold bg-amber-500/15 text-amber-300 border border-amber-500/30 mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>ADMINISTRATOR CONSOLE</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              Challenge Management & Publisher
            </h1>
            <p className="text-sm text-brand-subtext font-sans mt-1">
              Create, edit, schedule, or archive daily LeetCode challenges for the community.
            </p>
          </div>

          <button
            onClick={fetchChallenges}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-dark-card hover:bg-dark-muted border border-dark-border text-xs font-mono text-zinc-300 hover:text-white transition-all self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            <span>Refresh</span>
          </button>
        </div>

        {/* Top Section: Challenge Publisher Form */}
        <section className="bg-dark-card border border-dark-border rounded-3xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-dark-border/60">
            <div className="flex items-center gap-2.5">
              <div className="w-9 h-9 rounded-xl bg-brand-purple/10 border border-brand-purple/30 flex items-center justify-center text-brand-purple-light">
                <PlusCircle className="w-5 h-5" />
              </div>
              <h2 className="text-lg font-bold text-white tracking-tight">
                {isEditing ? `Edit Challenge for ${formData.date}` : 'Publish / Schedule Daily Challenge'}
              </h2>
            </div>

            <div className="flex items-center gap-2">
              {!isEditing && (
                <button
                  type="button"
                  onClick={() => {
                    setFormData({
                      title: 'Two Sum',
                      leetcodeURL: 'https://leetcode.com/problems/two-sum/',
                      difficulty: 'Easy',
                      topic: 'Arrays & Hashing',
                      description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target.\n\nYou may assume that each input would have exactly one solution, and you may not use the same element twice.',
                      date: getTodayString()
                    });
                    setUrlValidationError('');
                  }}
                  className="text-xs font-mono text-brand-purple-light hover:text-white px-3 py-1.5 rounded-lg border border-brand-purple/30 bg-brand-purple/10 hover:bg-brand-purple/20 transition-all flex items-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Fill Sample Challenge</span>
                </button>
              )}

              {isEditing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="text-xs font-mono text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg border border-dark-border hover:bg-dark-muted transition-colors"
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </div>

          <form onSubmit={handlePublish} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Problem Title */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-subtext font-semibold">
                  Problem Title <span className="text-brand-purple-light">*</span>
                </label>
                <input
                  type="text"
                  placeholder="e.g. Two Sum"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-dark-bg/80 border border-dark-border text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-transparent transition-all"
                  required
                />
              </div>

              {/* Challenge Date (Document ID) */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-subtext font-semibold">
                  Challenge Date (YYYY-MM-DD) <span className="text-brand-purple-light">*</span>
                </label>
                <div className="relative">
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => handleInputChange('date', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-bg/80 border border-dark-border text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-transparent transition-all"
                    required
                  />
                </div>
                <span className="text-[11px] text-zinc-500 font-mono">
                  {formData.date === todayStr ? '⭐ Scheduled for Today' : formData.date > todayStr ? '📅 Scheduled for Future Date' : '📜 Past Date Challenge'}
                </span>
              </div>
            </div>

            {/* LeetCode URL */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-subtext font-semibold">
                  LeetCode Problem URL <span className="text-brand-purple-light">*</span>
                </label>
                <span className="text-[11px] text-zinc-500 font-mono">
                  Must link to https://leetcode.com/problems/...
                </span>
              </div>
              <div className="relative">
                <LinkIcon className="w-4 h-4 text-zinc-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="url"
                  placeholder="https://leetcode.com/problems/two-sum/"
                  value={formData.leetcodeURL}
                  onChange={(e) => handleInputChange('leetcodeURL', e.target.value)}
                  className={`w-full pl-10 pr-4 py-2.5 rounded-xl bg-dark-bg/80 border text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:border-transparent transition-all ${
                    urlValidationError 
                      ? 'border-brand-danger/60 focus:ring-brand-danger/40' 
                      : 'border-dark-border focus:ring-brand-purple/50'
                  }`}
                  required
                />
              </div>
              {urlValidationError && (
                <p className="text-xs text-brand-danger flex items-center gap-1 font-mono">
                  <AlertCircle className="w-3.5 h-3.5" />
                  <span>{urlValidationError}</span>
                </p>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Difficulty */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-subtext font-semibold">
                  Difficulty <span className="text-brand-purple-light">*</span>
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {['Easy', 'Medium', 'Hard'].map((diff) => {
                    const isSelected = formData.difficulty === diff;
                    return (
                      <button
                        type="button"
                        key={diff}
                        onClick={() => handleInputChange('difficulty', diff)}
                        className={`py-2 px-3 rounded-xl text-xs font-bold border transition-all ${
                          isSelected
                            ? diff === 'Easy'
                              ? 'bg-emerald-500/20 text-emerald-400 border-emerald-500 shadow-glow-success'
                              : diff === 'Medium'
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500 shadow-[0_0_15px_-3px_rgba(245,158,11,0.3)]'
                              : 'bg-rose-500/20 text-rose-400 border-rose-500 shadow-[0_0_15px_-3px_rgba(244,63,94,0.3)]'
                            : 'bg-dark-bg/80 border-dark-border text-zinc-400 hover:text-white hover:border-zinc-600'
                        }`}
                      >
                        {diff}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* DSA Topic */}
              <div className="space-y-2">
                <label className="block text-xs font-mono uppercase tracking-wider text-brand-subtext font-semibold">
                  DSA Topic <span className="text-brand-purple-light">*</span>
                </label>
                <div className="flex gap-2">
                  <input
                    type="text"
                    list="topics-datalist"
                    placeholder="e.g. Arrays & Hashing"
                    value={formData.topic}
                    onChange={(e) => handleInputChange('topic', e.target.value)}
                    className="w-full px-4 py-2.5 rounded-xl bg-dark-bg/80 border border-dark-border text-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-transparent transition-all"
                    required
                  />
                  <datalist id="topics-datalist">
                    {COMMON_TOPICS.map(topic => (
                      <option key={topic} value={topic} />
                    ))}
                  </datalist>
                </div>
              </div>
            </div>

            {/* Short Description */}
            <div className="space-y-2">
              <label className="block text-xs font-mono uppercase tracking-wider text-brand-subtext font-semibold">
                Short Description / Problem Summary <span className="text-brand-purple-light">*</span>
              </label>
              <textarea
                rows={4}
                placeholder="Briefly state the problem statement, constraints, or key intuition..."
                value={formData.description}
                onChange={(e) => handleInputChange('description', e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-dark-bg/80 border border-dark-border text-white text-sm placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-transparent transition-all"
                required
              />
            </div>

            {/* Submit Button */}
            <div className="flex items-center justify-end gap-3 pt-4 border-t border-dark-border/60">
              {isEditing && (
                <button
                  type="button"
                  onClick={cancelEdit}
                  className="px-5 py-2.5 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:bg-dark-muted transition-colors"
                >
                  Cancel
                </button>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center justify-center gap-2 px-7 py-3 rounded-xl font-bold text-sm bg-gradient-to-r from-brand-purple to-brand-blue hover:from-brand-purple-dark hover:to-brand-blue-dark text-white transition-all shadow-glow-purple disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin text-white" />
                    <span>Publishing to Firestore...</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>{isEditing ? 'Update Challenge' : 'Publish Challenge'}</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </section>

        {/* Bottom Section: Published & Scheduled Challenges Table */}
        <section className="bg-dark-card border border-dark-border rounded-2xl p-6 sm:p-8 shadow-xl">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
                <Layers className="w-5 h-5 text-brand-purple" />
                <span>Published & Scheduled Challenges</span>
              </h2>
              <p className="text-xs text-brand-subtext font-mono mt-0.5">
                Total: {challenges.length} challenges in database
              </p>
            </div>

            {/* Filter Search */}
            <div className="relative w-full sm:w-64">
              <Search className="w-4 h-4 text-brand-subtext absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Filter by title, topic, date..."
                value={filterQuery}
                onChange={(e) => setFilterQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 rounded-xl bg-dark-bg/80 border border-dark-border text-white text-xs placeholder:text-zinc-500 focus:outline-none focus:ring-2 focus:ring-brand-purple/50 focus:border-transparent transition-all"
              />
            </div>
          </div>

          {loading ? (
            <div className="py-12 text-center text-brand-subtext font-mono text-sm">
              Loading challenges from Firestore...
            </div>
          ) : filteredChallenges.length === 0 ? (
            <div className="py-12 text-center text-brand-subtext font-mono text-sm">
              No challenges found. Create one using the form above!
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-dark-border/80 text-brand-subtext font-mono uppercase tracking-wider text-[11px]">
                    <th className="py-3 px-4">Date</th>
                    <th className="py-3 px-4">Problem</th>
                    <th className="py-3 px-4">Topic</th>
                    <th className="py-3 px-4">Difficulty</th>
                    <th className="py-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-dark-border/40 font-sans">
                  {filteredChallenges.map((ch) => {
                    const isToday = ch.date === todayStr;
                    const isFuture = ch.date > todayStr;

                    return (
                      <tr 
                        key={ch.id || ch.date} 
                        className={`hover:bg-dark-muted/40 transition-colors ${
                          isToday ? 'bg-brand-purple/5' : ''
                        }`}
                      >
                        <td className="py-3.5 px-4 font-mono">
                          <div className="flex items-center gap-1.5">
                            <span className="text-white font-semibold">{ch.date}</span>
                            {isToday && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-brand-purple/20 text-brand-purple-light border border-brand-purple/40 font-bold">
                                TODAY
                              </span>
                            )}
                            {isFuture && (
                              <span className="px-1.5 py-0.5 rounded text-[10px] bg-blue-500/15 text-blue-400 border border-blue-500/30">
                                UPCOMING
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-2">
                            <span className="font-semibold text-white">{ch.title}</span>
                            <a
                              href={ch.leetcodeURL}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-500 hover:text-brand-purple-light transition-colors"
                              title="Open on LeetCode"
                            >
                              <ExternalLink className="w-3.5 h-3.5" />
                            </a>
                          </div>
                        </td>

                        <td className="py-3.5 px-4 text-brand-subtext">
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded bg-dark-bg text-zinc-300 text-xs border border-dark-border">
                            {ch.topic}
                          </span>
                        </td>

                        <td className="py-3.5 px-4">
                          <span className={`inline-flex items-center px-2 py-0.5 rounded text-xs font-semibold ${
                            ch.difficulty === 'Easy'
                              ? 'text-emerald-400 bg-emerald-500/10'
                              : ch.difficulty === 'Medium'
                              ? 'text-amber-400 bg-amber-500/10'
                              : 'text-rose-400 bg-rose-500/10'
                          }`}>
                            {ch.difficulty}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              onClick={() => handleEdit(ch)}
                              className="p-1.5 rounded-lg text-zinc-400 hover:text-white hover:bg-dark-muted transition-colors"
                              title="Edit Challenge"
                            >
                              <Edit3 className="w-4 h-4" />
                            </button>

                            {deleteConfirmDate === ch.date ? (
                              <div className="flex items-center gap-1.5">
                                <button
                                  onClick={() => handleDelete(ch.date)}
                                  className="px-2 py-1 rounded bg-brand-danger text-white text-xs font-bold hover:bg-red-600 transition-colors"
                                >
                                  Confirm
                                </button>
                                <button
                                  onClick={() => setDeleteConfirmDate(null)}
                                  className="px-2 py-1 rounded bg-dark-muted text-zinc-300 text-xs hover:text-white"
                                >
                                  Cancel
                                </button>
                              </div>
                            ) : (
                              <button
                                onClick={() => setDeleteConfirmDate(ch.date)}
                                className="p-1.5 rounded-lg text-zinc-500 hover:text-brand-danger hover:bg-brand-danger/10 transition-colors"
                                title="Delete Challenge"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            )}
                          </div>
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
