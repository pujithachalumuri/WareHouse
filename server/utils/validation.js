/**
 * Validation helpers for the Smart Warehouse platform.
 */

/**
 * Validate Indian phone number.
 * Rules: must be +91 optionally, then exactly 10 digits, first digit 6/7/8/9.
 * @returns {boolean}
 */
function isValidIndianPhone(phone) {
  const cleaned = String(phone || '').replace(/[\s-]/g, '');
  const stripped = cleaned.replace(/^\+91/, '').replace(/^91/, '');
  if (!/^\d{10}$/.test(stripped)) return false;
  return /^[6789]/.test(stripped);
}

/**
 * Normalize an Indian phone to canonical +91XXXXXXXXXX form.
 */
function normalizePhone(phone) {
  let cleaned = String(phone || '').replace(/[\s-]/g, '');
  cleaned = cleaned.replace(/^\+/, '');
  if (cleaned.startsWith('91')) {
    cleaned = cleaned.slice(2);
  }
  if (/^\d{10}$/.test(cleaned) && /^[6789]/.test(cleaned)) {
    return '+91' + cleaned;
  }
  return cleaned;
}

/**
 * Password strength rules:
 *  - min 6 chars
 *  - at least one uppercase, one lowercase, one digit, one special char
 * Returns { valid, score, message, requirements }.
 */
function validatePassword(password) {
  const p = String(password || '');
  const checks = {
    length: p.length >= 6,
    upper: /[A-Z]/.test(p),
    lower: /[a-z]/.test(p),
    digit: /\d/.test(p),
    special: /[^A-Za-z0-9]/.test(p),
  };
  const score = Object.values(checks).filter(Boolean).length; // 0..5
  const strength = score <= 2 ? 'Weak' : score <= 4 ? 'Medium' : 'Strong';
  const valid = Object.values(checks).every(Boolean);
  const requirements = [
    'At least 6 characters',
    'One uppercase letter (A-Z)',
    'One lowercase letter (a-z)',
    'One number (0-9)',
    'One special character (!@#$...)',
  ];
  const message = valid
    ? 'Great! Strong password.'
    : 'Password must include: ' + requirements
        .filter((_, i) => !Object.values(checks)[i])
        .join(', ');
  return { valid, score: score * 20, strength, message, requirements };
}

/**
 * Suggest a strong password (uses Web Crypto for randomness when available).
 */
function suggestStrongPassword() {
  const upper = 'ABCDEFGHJKLMNPQRSTUVWXYZ';
  const lower = 'abcdefghijkmnopqrstuvwxyz';
  const digits = '23456789';
  const specials = '!@#$%^&*_-+=?';
  const pick = (set) => set[Math.floor(Math.random() * set.length)];
  let pw = pick(upper) + pick(lower) + pick(digits) + pick(specials);
  const all = upper + lower + digits + specials;
  while (pw.length < 12) pw += pick(all);
  // shuffle
  return pw
    .split('')
    .sort(() => Math.random() - 0.5)
    .join('');
}

module.exports = {
  isValidIndianPhone,
  normalizePhone,
  validatePassword,
  suggestStrongPassword,
};
