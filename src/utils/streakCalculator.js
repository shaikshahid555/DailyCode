import { getTodayString, getYesterdayString, daysBetween, formatLocalDate } from './dateUtils.js';

/**
 * Calculates current streak, longest streak, and total completed challenges.
 * 
 * Rules:
 * - Consecutive calendar days increase streak by 1.
 * - Missing a calendar day breaks streak.
 * - If today's challenge is completed, streak includes today.
 * - If yesterday was completed and today is not yet completed, current streak is preserved until end of today.
 * - Longest streak is calculated over the entire history.
 * - Duplicate dates are deduplicated.
 * 
 * @param {Array<string | {date: string}>} completions - array of YYYY-MM-DD strings or completion objects
 * @param {string} [customToday] - optional today override for testing
 * @returns {{
 *   currentStreak: number,
 *   longestStreak: number,
 *   totalCompleted: number,
 *   isCompletedToday: boolean,
 *   isStreakAtRisk: boolean,
 *   completedDatesSet: Set<string>
 * }}
 */
export function calculateStreaks(completions = [], customToday = null) {
  if (!Array.isArray(completions) || completions.length === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCompleted: 0,
      isCompletedToday: false,
      isStreakAtRisk: false,
      completedDatesSet: new Set()
    };
  }

  // Normalize to unique sorted date strings (YYYY-MM-DD)
  const dateStrings = completions.map(item => {
    if (typeof item === 'string') return item.trim();
    if (item && item.date) return item.date.trim();
    return null;
  }).filter(Boolean);

  const uniqueDateSet = new Set(dateStrings);
  const sortedDates = Array.from(uniqueDateSet).sort(); // Lexicographical ISO date sort is chronological

  const totalCompleted = sortedDates.length;
  if (totalCompleted === 0) {
    return {
      currentStreak: 0,
      longestStreak: 0,
      totalCompleted: 0,
      isCompletedToday: false,
      isStreakAtRisk: false,
      completedDatesSet: uniqueDateSet
    };
  }

  // Calculate Longest Streak
  let longestStreak = 1;
  let tempStreak = 1;

  for (let i = 1; i < sortedDates.length; i++) {
    const diff = daysBetween(sortedDates[i - 1], sortedDates[i]);
    if (diff === 1) {
      tempStreak++;
      if (tempStreak > longestStreak) {
        longestStreak = tempStreak;
      }
    } else if (diff > 1) {
      tempStreak = 1;
    }
  }

  // Calculate Current Streak
  const todayStr = customToday || getTodayString();
  const yesterdayStr = (() => {
    if (customToday) {
      const [y, m, d] = customToday.split('-').map(Number);
      const prev = new Date(y, m - 1, d);
      prev.setDate(prev.getDate() - 1);
      return formatLocalDate(prev);
    }
    return getYesterdayString();
  })();

  const isCompletedToday = uniqueDateSet.has(todayStr);
  const isCompletedYesterday = uniqueDateSet.has(yesterdayStr);

  let currentStreak = 0;
  let isStreakAtRisk = false;

  const stepBackward = (startDateStr) => {
    let streakCount = 1;
    let [y, m, d] = startDateStr.split('-').map(Number);
    let checkDate = new Date(y, m - 1, d);

    while (true) {
      checkDate.setDate(checkDate.getDate() - 1);
      const prevStr = formatLocalDate(checkDate);
      if (uniqueDateSet.has(prevStr)) {
        streakCount++;
      } else {
        break;
      }
    }
    return streakCount;
  };

  if (isCompletedToday) {
    currentStreak = stepBackward(todayStr);
    isStreakAtRisk = false;
  } else if (isCompletedYesterday) {
    // Grace period: yesterday completed, today not yet marked -> streak is preserved, but at risk!
    currentStreak = stepBackward(yesterdayStr);
    isStreakAtRisk = true;
  } else {
    // Both today and yesterday missed -> streak broken
    currentStreak = 0;
    isStreakAtRisk = false;
  }

  return {
    currentStreak,
    longestStreak,
    totalCompleted,
    isCompletedToday,
    isStreakAtRisk,
    completedDatesSet: uniqueDateSet
  };
}
