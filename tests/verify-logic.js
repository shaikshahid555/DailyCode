import assert from 'assert';
import { calculateStreaks } from '../src/utils/streakCalculator.js';
import { validateLeetCodeUrl, slugToTitle } from '../src/utils/leetcodeValidator.js';
import { formatLocalDate, getTodayString, getYesterdayString, daysBetween } from '../src/utils/dateUtils.js';

console.log('🧪 Starting DailyCode logic verification tests...\n');

// 1. Test Date Utils
console.log('--- Testing Date Utils ---');
const today = getTodayString();
const yesterday = getYesterdayString();
assert.strictEqual(daysBetween(yesterday, today), 1, 'Difference between yesterday and today must be 1');
console.log('✓ daysBetween passed');

// 2. Test LeetCode URL Validator
console.log('\n--- Testing LeetCode URL Validator ---');
const valid1 = validateLeetCodeUrl('https://leetcode.com/problems/two-sum/');
assert.strictEqual(valid1.isValid, true);
assert.strictEqual(valid1.slug, 'two-sum');
assert.strictEqual(valid1.normalizedUrl, 'https://leetcode.com/problems/two-sum/');

const valid2 = validateLeetCodeUrl('leetcode.com/problems/binary-search/description/');
assert.strictEqual(valid2.isValid, true);
assert.strictEqual(valid2.slug, 'binary-search');

const invalid1 = validateLeetCodeUrl('https://hackerrank.com/challenges/simple-array-sum');
assert.strictEqual(invalid1.isValid, false);

assert.strictEqual(slugToTitle('two-sum'), 'Two Sum');
assert.strictEqual(slugToTitle('course-schedule-ii'), 'Course Schedule Ii');
console.log('✓ LeetCode URL Validator passed');

// 3. Test Streak Calculator
console.log('\n--- Testing Streak Calculator ---');

// Case A: Empty completions
const resEmpty = calculateStreaks([], '2026-11-07');
assert.strictEqual(resEmpty.currentStreak, 0);
assert.strictEqual(resEmpty.longestStreak, 0);
assert.strictEqual(resEmpty.totalCompleted, 0);
assert.strictEqual(resEmpty.isCompletedToday, false);
console.log('✓ Case A (Empty) passed');

// Case B: Completed Today (1-day streak)
const resTodayOnly = calculateStreaks(['2026-11-07'], '2026-11-07');
assert.strictEqual(resTodayOnly.currentStreak, 1);
assert.strictEqual(resTodayOnly.longestStreak, 1);
assert.strictEqual(resTodayOnly.totalCompleted, 1);
assert.strictEqual(resTodayOnly.isCompletedToday, true);
assert.strictEqual(resTodayOnly.isStreakAtRisk, false);
console.log('✓ Case B (Completed Today) passed');

// Case C: Consecutive 3 days up to today ('2026-11-05', '2026-11-06', '2026-11-07')
const resConsecutive = calculateStreaks(['2026-11-05', '2026-11-06', '2026-11-07'], '2026-11-07');
assert.strictEqual(resConsecutive.currentStreak, 3);
assert.strictEqual(resConsecutive.longestStreak, 3);
assert.strictEqual(resConsecutive.totalCompleted, 3);
assert.strictEqual(resConsecutive.isCompletedToday, true);
assert.strictEqual(resConsecutive.isStreakAtRisk, false);
console.log('✓ Case C (Consecutive 3 days to today) passed');

// Case D: Yesterday completed, today pending (Grace period preserved!)
// Completed: '2026-11-05', '2026-11-06'. Today: '2026-11-07'.
const resGracePeriod = calculateStreaks(['2026-11-05', '2026-11-06'], '2026-11-07');
assert.strictEqual(resGracePeriod.currentStreak, 2, 'Current streak should be preserved from yesterday');
assert.strictEqual(resGracePeriod.longestStreak, 2);
assert.strictEqual(resGracePeriod.isCompletedToday, false);
assert.strictEqual(resGracePeriod.isStreakAtRisk, true, 'Streak should be flagged as at risk until today is solved');
console.log('✓ Case D (Yesterday completed, today pending / grace period) passed');

// Case E: Broken streak (missed both today and yesterday)
// Completed: '2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04' (4 days). Today is 2026-11-07.
const resBroken = calculateStreaks(['2026-11-01', '2026-11-02', '2026-11-03', '2026-11-04'], '2026-11-07');
assert.strictEqual(resBroken.currentStreak, 0, 'Current streak should be 0 because yesterday was missed');
assert.strictEqual(resBroken.longestStreak, 4, 'Longest streak should retain 4');
assert.strictEqual(resBroken.totalCompleted, 4);
assert.strictEqual(resBroken.isCompletedToday, false);
assert.strictEqual(resBroken.isStreakAtRisk, false);
console.log('✓ Case E (Broken streak, longest streak retained) passed');

// Case F: Multiple disjoint streaks, longest streak calculation
// Streak 1: '2026-10-01' through '2026-10-05' (5 days)
// Gap
// Streak 2: '2026-11-06', '2026-11-07' (2 days)
const disjoint = [
  '2026-10-01', '2026-10-02', '2026-10-03', '2026-10-04', '2026-10-05',
  '2026-11-06', '2026-11-07'
];
const resDisjoint = calculateStreaks(disjoint, '2026-11-07');
assert.strictEqual(resDisjoint.currentStreak, 2);
assert.strictEqual(resDisjoint.longestStreak, 5, 'Longest streak must be 5');
assert.strictEqual(resDisjoint.totalCompleted, 7);
console.log('✓ Case F (Multiple streaks and longest streak) passed');

// Case G: Deduplication of same date entries
const duplicates = ['2026-11-07', '2026-11-07', '2026-11-06', '2026-11-06'];
const resDedupe = calculateStreaks(duplicates, '2026-11-07');
assert.strictEqual(resDedupe.totalCompleted, 2);
assert.strictEqual(resDedupe.currentStreak, 2);
console.log('✓ Case G (Deduplication) passed');

console.log('\n🎉 ALL TESTS PASSED SUCCESSFULLY! 🚀');
