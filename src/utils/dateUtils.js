/**
 * Date utility helpers for DailyCode.
 * Always respects the user's local calendar date to avoid timezone shift bugs.
 */

/**
 * Returns a date formatted as YYYY-MM-DD using local time
 * @param {Date|string|number} [dateInput] - optional date
 * @returns {string} YYYY-MM-DD
 */
export function formatLocalDate(dateInput = new Date()) {
  const date = dateInput instanceof Date ? dateInput : new Date(dateInput);
  if (isNaN(date.getTime())) {
    const fallback = new Date();
    return `${fallback.getFullYear()}-${String(fallback.getMonth() + 1).padStart(2, '0')}-${String(fallback.getDate()).padStart(2, '0')}`;
  }
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

/**
 * Today's local date as YYYY-MM-DD
 * @returns {string}
 */
export function getTodayString() {
  return formatLocalDate(new Date());
}

/**
 * Yesterday's local date as YYYY-MM-DD
 * @returns {string}
 */
export function getYesterdayString() {
  const d = new Date();
  d.setDate(d.getDate() - 1);
  return formatLocalDate(d);
}

/**
 * Format a YYYY-MM-DD string into a human-readable display string
 * e.g., "Saturday, Nov 7, 2026" or "Nov 7, 2026"
 * @param {string} dateStr 
 * @param {boolean} [includeWeekday=true]
 * @returns {string}
 */
export function formatDisplayDate(dateStr, includeWeekday = true) {
  if (!dateStr) return '';
  const [year, month, day] = dateStr.split('-').map(Number);
  const date = new Date(year, month - 1, day);
  
  if (includeWeekday) {
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  }
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
}

/**
 * Get the 7 days of the current week (starting Monday through Sunday)
 * @returns {Array<{dateStr: string, dayAbbr: string, dayName: string, dayNumber: number, isToday: boolean, isPast: boolean, isFuture: boolean}>}
 */
export function getCurrentWeekDates() {
  const now = new Date();
  const currentDayOfWeek = now.getDay(); // 0 is Sunday, 1 is Monday...
  // Calculate distance from Monday (Monday = 0, Tuesday = 1, ..., Sunday = 6)
  const distanceToMonday = (currentDayOfWeek + 6) % 7;
  
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - distanceToMonday);
  const todayStr = getTodayString();
  const week = [];

  for (let i = 0; i < 7; i++) {
    const dayDate = new Date(monday.getFullYear(), monday.getMonth(), monday.getDate() + i);
    const dateStr = formatLocalDate(dayDate);
    
    const dayAbbr = dayDate.toLocaleDateString('en-US', { weekday: 'short' }); // Mon, Tue...
    const dayName = dayDate.toLocaleDateString('en-US', { weekday: 'long' });
    const dayNumber = dayDate.getDate();

    week.push({
      dateStr,
      dayAbbr,
      dayName,
      dayNumber,
      isToday: dateStr === todayStr,
      isPast: dateStr < todayStr,
      isFuture: dateStr > todayStr
    });
  }

  return week;
}

/**
 * Calculate difference in calendar days between two YYYY-MM-DD dates
 * (date2 - date1)
 * @param {string} dateStr1 
 * @param {string} dateStr2 
 * @returns {number}
 */
export function daysBetween(dateStr1, dateStr2) {
  const [y1, m1, d1] = dateStr1.split('-').map(Number);
  const [y2, m2, d2] = dateStr2.split('-').map(Number);
  const date1 = new Date(y1, m1 - 1, d1);
  const date2 = new Date(y2, m2 - 1, d2);
  const diffTime = date2.getTime() - date1.getTime();
  return Math.round(diffTime / (1000 * 60 * 60 * 24));
}
