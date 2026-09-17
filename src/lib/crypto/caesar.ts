import { ENGLISH_LETTER_FREQ } from './words';
import { mod } from '../dsa/extended-gcd';

export interface CaesarStep {
  originalChar: string;
  isAlphabet: boolean;
  baseCode: number;
  originalPos: number;
  shift: number;
  newPos: number;
  newChar: string;
}

export interface CaesarResult {
  text: string;
  shift: number;
  steps: CaesarStep[];
}

/**
 * Encrypt plaintext using Caesar cipher with step-by-step audit
 */
export function caesarEncrypt(text: string, key: number | string): CaesarResult {
  const shift = mod(parseInt(String(key), 10) || 0, 26);
  const steps: CaesarStep[] = [];
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isUpper = char >= 'A' && char <= 'Z';
    const isLower = char >= 'a' && char <= 'z';

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const originalPos = char.charCodeAt(0) - base;
      const newPos = (originalPos + shift) % 26;
      const newChar = String.fromCharCode(base + newPos);

      steps.push({
        originalChar: char,
        isAlphabet: true,
        baseCode: base,
        originalPos,
        shift,
        newPos,
        newChar,
      });
      result += newChar;
    } else {
      steps.push({
        originalChar: char,
        isAlphabet: false,
        baseCode: 0,
        originalPos: -1,
        shift,
        newPos: -1,
        newChar: char,
      });
      result += char;
    }
  }

  return { text: result, shift, steps };
}

/**
 * Decrypt ciphertext using Caesar cipher
 */
export function caesarDecrypt(text: string, key: number | string): CaesarResult {
  const shift = mod(parseInt(String(key), 10) || 0, 26);
  const decryptShift = mod(-shift, 26);
  return caesarEncrypt(text, decryptShift);
}

/**
 * Generate random Caesar key (1..25)
 */
export function generateRandomCaesarKey(): number {
  return Math.floor(Math.random() * 25) + 1;
}

/**
 * Brute force all 25 shifts and score using Chi-Squared (χ²) Goodness of Fit
 */
export function crackCaesarChiSquared(ciphertext: string): Array<{
  shift: number;
  decrypted: string;
  chiSquared: number;
  confidence: number;
}> {
  const clean = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
  const totalLetters = clean.length;
  if (totalLetters === 0) return [];

  const candidates = [];

  for (let shift = 0; shift < 26; shift++) {
    const dec = caesarDecrypt(ciphertext, shift).text;
    const decClean = dec.toUpperCase().replace(/[^A-Z]/g, '');

    // Compute frequencies of decrypted text
    const counts: Record<string, number> = {};
    for (const char of decClean) {
      counts[char] = (counts[char] || 0) + 1;
    }

    // Chi-squared statistic: sum( (observed - expected)^2 / expected )
    let chi2 = 0;
    for (const [letter, expectedPct] of Object.entries(ENGLISH_LETTER_FREQ)) {
      const observed = counts[letter] || 0;
      const expected = (expectedPct / 100) * totalLetters;
      chi2 += Math.pow(observed - expected, 2) / (expected || 0.0001);
    }

    candidates.push({
      shift,
      decrypted: dec,
      chiSquared: chi2,
      confidence: Math.max(0, 100 - chi2 / 5),
    });
  }

  // Sort by lowest chi-squared (closest match to English)
  return candidates.sort((a, b) => a.chiSquared - b.chiSquared);
}
