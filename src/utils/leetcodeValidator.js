/**
 * Validates whether a given URL is a valid LeetCode problem URL.
 * Accepts formats such as:
 * - https://leetcode.com/problems/two-sum/
 * - https://leetcode.com/problems/two-sum/description/
 * - http://leetcode.com/problems/two-sum
 * - leetcode.com/problems/two-sum
 * 
 * @param {string} urlString 
 * @returns {{isValid: boolean, error?: string, normalizedUrl?: string, slug?: string}}
 */
export function validateLeetCodeUrl(urlString) {
  if (!urlString || typeof urlString !== 'string') {
    return { isValid: false, error: 'LeetCode URL is required.' };
  }

  let trimmed = urlString.trim();
  if (!/^https?:\/\//i.test(trimmed)) {
    trimmed = 'https://' + trimmed;
  }

  try {
    const url = new URL(trimmed);
    const host = url.hostname.toLowerCase();

    if (!host.endsWith('leetcode.com') && !host.endsWith('leetcode.cn')) {
      return { 
        isValid: false, 
        error: 'URL must belong to leetcode.com (e.g., https://leetcode.com/problems/...)' 
      };
    }

    const pathParts = url.pathname.split('/').filter(Boolean);
    // Typical path: ['problems', 'two-sum'] or ['problems', 'two-sum', 'description']
    if (pathParts[0] !== 'problems' || !pathParts[1]) {
      return {
        isValid: false,
        error: 'URL must link to a specific problem (e.g., https://leetcode.com/problems/<problem-slug>/)'
      };
    }

    const slug = pathParts[1].toLowerCase();
    const normalizedUrl = `https://leetcode.com/problems/${slug}/`;

    return {
      isValid: true,
      normalizedUrl,
      slug
    };
  } catch (err) {
    return { isValid: false, error: 'Invalid URL format.' };
  }
}

/**
 * Derives a human-friendly title from a LeetCode slug
 * e.g., "two-sum" -> "Two Sum"
 * @param {string} slug 
 * @returns {string}
 */
export function slugToTitle(slug) {
  if (!slug) return '';
  return slug
    .split('-')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}
