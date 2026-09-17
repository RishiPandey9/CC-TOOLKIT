const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const LOWER = 'abcdefghijklmnopqrstuvwxyz';

export interface MonoStep {
  originalChar: string;
  mappedChar: string;
  isMapped: boolean;
}

export interface MonoResult {
  text: string;
  key: string;
  mapping: Record<string, string>;
  steps: MonoStep[];
}

/**
 * Generate a random 26-letter Monoalphabetic key using Fisher-Yates shuffle
 */
export function generateMonoKey(caseType: 'upper' | 'lower' = 'upper'): string {
  const chars = (caseType === 'lower' ? LOWER : UPPER).split('');
  for (let i = chars.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [chars[i], chars[j]] = [chars[j], chars[i]];
  }
  return chars.join('');
}

/**
 * Validate whether a key is a valid 26-character permutation of the alphabet
 */
export function isValidMonoKey(key: string): boolean {
  if (!key || key.length !== 26) return false;
  const upper = key.toUpperCase();
  const set = new Set(upper.split(''));
  if (set.size !== 26) return false;
  for (const c of UPPER) {
    if (!set.has(c)) return false;
  }
  return true;
}

/**
 * Encrypt plaintext using Monoalphabetic substitution cipher
 */
export function monoEncrypt(text: string, key: string): MonoResult {
  const cleanKey = (key || UPPER).toUpperCase();
  const lowerKey = cleanKey.toLowerCase();

  const mapUpper: Record<string, string> = {};
  const mapLower: Record<string, string> = {};

  for (let i = 0; i < 26; i++) {
    mapUpper[UPPER[i]] = cleanKey[i] || UPPER[i];
    mapLower[LOWER[i]] = lowerKey[i] || LOWER[i];
  }

  const steps: MonoStep[] = [];
  let result = '';

  for (const char of text) {
    if (UPPER.includes(char)) {
      const mapped = mapUpper[char];
      steps.push({ originalChar: char, mappedChar: mapped, isMapped: true });
      result += mapped;
    } else if (LOWER.includes(char)) {
      const mapped = mapLower[char];
      steps.push({ originalChar: char, mappedChar: mapped, isMapped: true });
      result += mapped;
    } else {
      steps.push({ originalChar: char, mappedChar: char, isMapped: false });
      result += char;
    }
  }

  return { text: result, key: cleanKey, mapping: mapUpper, steps };
}

/**
 * Decrypt ciphertext using Monoalphabetic substitution cipher
 */
export function monoDecrypt(text: string, key: string): MonoResult {
  const cleanKey = (key || UPPER).toUpperCase();
  const lowerKey = cleanKey.toLowerCase();

  const reverseUpper: Record<string, string> = {};
  const reverseLower: Record<string, string> = {};

  for (let i = 0; i < 26; i++) {
    const kU = cleanKey[i] || UPPER[i];
    const kL = lowerKey[i] || LOWER[i];
    reverseUpper[kU] = UPPER[i];
    reverseLower[kL] = LOWER[i];
  }

  const steps: MonoStep[] = [];
  let result = '';

  for (const char of text) {
    if (UPPER.includes(char)) {
      const mapped = reverseUpper[char] || char;
      steps.push({ originalChar: char, mappedChar: mapped, isMapped: true });
      result += mapped;
    } else if (LOWER.includes(char)) {
      const mapped = reverseLower[char] || char;
      steps.push({ originalChar: char, mappedChar: mapped, isMapped: true });
      result += mapped;
    } else {
      steps.push({ originalChar: char, mappedChar: char, isMapped: false });
      result += char;
    }
  }

  return { text: result, key: cleanKey, mapping: reverseUpper, steps };
}
