/**
 * KeyLab — Leet Speak Engine & Password Utilities
 * Implements the transformation hash map and 3 generation algorithms.
 * All operations run in client-side memory (no persistence).
 */

// ============================================================
// 1.1 Leet Hash Map (case-sensitive)
// ============================================================
const LEET_MAP = {
  a: '@',
  A: '4',
  e: '3',
  E: '3',
  i: '1',
  I: '!',
  o: '0',
  O: '0',
  s: '$',
  S: '5',
  t: '7',
  T: '7',
};

/**
 * Sanitize user input: trim whitespace and escape HTML entities
 */
export function sanitize(input) {
  return input
    .trim()
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#x27;');
}

/**
 * Apply Leet substitution to a string using the hash map
 */
export function applyLeet(str) {
  return str
    .split('')
    .map((ch) => LEET_MAP[ch] ?? ch)
    .join('');
}

/**
 * Generate a cryptographically secure random integer in [min, max)
 */
function secureRandomInt(min, max) {
  const range = max - min;
  const array = new Uint32Array(1);
  crypto.getRandomValues(array);
  return min + (array[0] % range);
}

/**
 * Generate a cryptographically secure random alphanumeric string
 */
function secureRandomString(length) {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*';
  let result = '';
  for (let i = 0; i < length; i++) {
    result += chars[secureRandomInt(0, chars.length)];
  }
  return result;
}

// ============================================================
// ALGORITHM 1: Standard (Leet_V1)
// Strict hash map substitution + random numeric suffix
// Min length: 12
// ============================================================
export function generateStandard(basePhrase) {
  const sanitized = sanitize(basePhrase);
  const noSpaces = sanitized.replace(/\s+/g, '');
  let result = applyLeet(noSpaces);

  // Add random year-like suffix
  const suffix = secureRandomInt(1000, 9999).toString();
  result += suffix;

  // Ensure minimum length of 12
  while (result.length < 12) {
    result += secureRandomInt(0, 10).toString();
  }

  // Ensure at least one uppercase, one lowercase, one symbol
  if (!/[A-Z]/.test(result)) {
    result = result[0].toUpperCase() + result.slice(1);
  }
  if (!/[a-z]/.test(result)) {
    const pos = secureRandomInt(1, Math.max(2, result.length - 2));
    result = result.slice(0, pos) + 'x' + result.slice(pos);
  }
  if (!/[!@#$%^&*]/.test(result)) {
    result += '!';
  }

  return result;
}

// ============================================================
// ALGORITHM 2: Passphrase (Leet_V2)
// Replace spaces with delimiters + hash map + symbol suffix
// Min length: 14
// ============================================================
export function generatePassphrase(basePhrase) {
  const sanitized = sanitize(basePhrase);
  const delimiters = ['-', '_', '.', '~'];
  const delimiter = delimiters[secureRandomInt(0, delimiters.length)];

  let result = sanitized.replace(/\s+/g, delimiter);
  result = applyLeet(result);

  // Add symbol suffix
  const symbols = ['!', '#', '$', '@', '&', '*'];
  let suffix = '';
  for (let i = 0; i < 3; i++) {
    suffix += symbols[secureRandomInt(0, symbols.length)];
  }
  result += suffix;

  // Ensure minimum length of 14
  while (result.length < 14) {
    result += secureRandomInt(0, 10).toString();
  }

  // Ensure uppercase and lowercase
  if (!/[A-Z]/.test(result)) {
    result = result[0].toUpperCase() + result.slice(1);
  }
  if (!/[a-z]/.test(result)) {
    const pos = secureRandomInt(1, Math.max(2, result.length - 2));
    result = result.slice(0, pos) + 'k' + result.slice(pos);
  }
  if (!/\d/.test(result)) {
    result += secureRandomInt(10, 99).toString();
  }

  return result;
}

// ============================================================
// ALGORITHM 3: High Entropy (Leet_V3)
// Interleaved upper/lower + hash map + CSPRNG prefix/suffix
// Min length: 16
// ============================================================
export function generateHighEntropy(basePhrase) {
  const sanitized = sanitize(basePhrase);
  const noSpaces = sanitized.replace(/\s+/g, '');

  // Interleave upper/lower case
  let interleaved = '';
  for (let i = 0; i < noSpaces.length; i++) {
    interleaved += i % 2 === 0
      ? noSpaces[i].toUpperCase()
      : noSpaces[i].toLowerCase();
  }

  // Apply leet
  let result = applyLeet(interleaved);

  // CSPRNG prefix and suffix
  const prefix = secureRandomString(3);
  const suffix = secureRandomString(3);
  result = prefix + result + suffix;

  // Ensure minimum length of 16
  while (result.length < 16) {
    result += secureRandomString(1);
  }

  // Final validation pass — ensure all character classes present
  if (!/[A-Z]/.test(result)) result = 'K' + result.slice(1);
  if (!/[a-z]/.test(result)) result += 'z';
  if (!/\d/.test(result)) result += '9';
  if (!/[!@#$%^&*]/.test(result)) result += '#';

  return result;
}

/**
 * Generate all 3 password variants from a base phrase
 * Returns: [standard, passphrase, highEntropy]
 */
export async function generateAllPasswords(basePhrase) {
  // Simulate async processing (as per BDD spec)
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve([
        generateStandard(basePhrase),
        generatePassphrase(basePhrase),
        generateHighEntropy(basePhrase),
      ]);
    }, 300);
  });
}

// ============================================================
// 1.2 Regex Validation Rules
// ============================================================
export const VALIDATION_RULES = [
  {
    id: 'R1',
    label: 'Longitud ≥ 12 caracteres',
    regex: /^.{12,}$/,
    icon: '📏',
  },
  {
    id: 'R2',
    label: 'Letra mayúscula (A-Z)',
    regex: /(?=.*[A-Z])/,
    icon: '🔠',
  },
  {
    id: 'R3',
    label: 'Letra minúscula (a-z)',
    regex: /(?=.*[a-z])/,
    icon: '🔡',
  },
  {
    id: 'R4',
    label: 'Número (0-9)',
    regex: /(?=.*\d)/,
    icon: '🔢',
  },
  {
    id: 'R5',
    label: 'Símbolo especial',
    regex: /(?=.*[!@#$%^&*()_+\[\]{}|;:',.<>?/\\])/,
    icon: '✦',
  },
  {
    id: 'R6',
    label: 'Caracteres Leet',
    regex: /(?=.*[431!0$57@])/,
    icon: '⚡',
  },
];

/**
 * Evaluate a password against all rules
 * Returns { score, passed, results[] }
 */
export function evaluatePassword(password) {
  const results = VALIDATION_RULES.map((rule) => ({
    ...rule,
    passed: rule.regex.test(password),
  }));

  const passedCount = results.filter((r) => r.passed).length;
  const length = password.length;

  // 1.3 Traffic light algorithm
  let score;
  let state;
  let cssClass;

  if (length >= 16 && passedCount === 6) {
    score = 4;
    state = 'Fuerte';
    cssClass = 'strength-strong';
  } else if (length >= 12 && passedCount >= 5) {
    score = 3;
    state = 'Buena';
    cssClass = 'strength-good';
  } else if (length >= 8 && passedCount >= 3) {
    score = 2;
    state = 'Media';
    cssClass = 'strength-medium';
  } else {
    score = length === 0 ? 0 : 1;
    state = length === 0 ? 'Sin evaluar' : 'Débil';
    cssClass = length === 0 ? 'strength-none' : 'strength-weak';
  }

  return {
    score,
    state,
    cssClass,
    passedCount,
    totalRules: VALIDATION_RULES.length,
    results,
  };
}

/**
 * Copy text to clipboard with fallback
 */
export async function copyToClipboard(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Fallback: execCommand
    try {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      textarea.style.position = 'fixed';
      textarea.style.left = '-9999px';
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
      return true;
    } catch {
      return false;
    }
  }
}
