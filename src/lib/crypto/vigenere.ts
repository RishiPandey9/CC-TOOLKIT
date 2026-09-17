import { WORDS, ENGLISH_LETTER_FREQ } from './words';
import { mod } from '../dsa/extended-gcd';

export interface VigenereStep {
  char: string;
  isAlphabet: boolean;
  keyChar: string;
  plainCode: number;
  keyCode: number;
  cipherCode: number;
  resultChar: string;
}

export interface VigenereResult {
  text: string;
  key: string;
  steps: VigenereStep[];
}

/**
 * Encrypt plaintext using Vigenère cipher
 */
export function vigenereEncrypt(plainText: string, key: string): VigenereResult {
  const cleanKey = (key || 'KEY').replace(/[^a-zA-Z]/g, '');
  if (!cleanKey) return { text: plainText, key: 'KEY', steps: [] };

  let cipherText = '';
  let keyIndex = 0;
  const steps: VigenereStep[] = [];

  for (let i = 0; i < plainText.length; i++) {
    const char = plainText[i];
    const isUpper = char >= 'A' && char <= 'Z';
    const isLower = char >= 'a' && char <= 'z';

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const p = char.charCodeAt(0) - base;
      const kChar = cleanKey[keyIndex % cleanKey.length];
      const k = kChar.toUpperCase().charCodeAt(0) - 65;
      const c = (p + k) % 26;
      const resultChar = String.fromCharCode(base + c);

      steps.push({
        char,
        isAlphabet: true,
        keyChar: kChar,
        plainCode: p,
        keyCode: k,
        cipherCode: c,
        resultChar,
      });

      cipherText += resultChar;
      keyIndex++;
    } else {
      steps.push({
        char,
        isAlphabet: false,
        keyChar: '',
        plainCode: -1,
        keyCode: -1,
        cipherCode: -1,
        resultChar: char,
      });
      cipherText += char;
    }
  }

  return { text: cipherText, key: cleanKey, steps };
}

/**
 * Decrypt ciphertext using Vigenère cipher
 */
export function vigenereDecrypt(cipherText: string, key: string): VigenereResult {
  const cleanKey = (key || 'KEY').replace(/[^a-zA-Z]/g, '');
  if (!cleanKey) return { text: cipherText, key: 'KEY', steps: [] };

  let plainText = '';
  let keyIndex = 0;
  const steps: VigenereStep[] = [];

  for (let i = 0; i < cipherText.length; i++) {
    const char = cipherText[i];
    const isUpper = char >= 'A' && char <= 'Z';
    const isLower = char >= 'a' && char <= 'z';

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const c = char.charCodeAt(0) - base;
      const kChar = cleanKey[keyIndex % cleanKey.length];
      const k = kChar.toUpperCase().charCodeAt(0) - 65;
      const p = mod(c - k, 26);
      const resultChar = String.fromCharCode(base + p);

      steps.push({
        char,
        isAlphabet: true,
        keyChar: kChar,
        plainCode: p,
        keyCode: k,
        cipherCode: c,
        resultChar,
      });

      plainText += resultChar;
      keyIndex++;
    } else {
      steps.push({
        char,
        isAlphabet: false,
        keyChar: '',
        plainCode: -1,
        keyCode: -1,
        cipherCode: -1,
        resultChar: char,
      });
      plainText += char;
    }
  }

  return { text: plainText, key: cleanKey, steps };
}

/**
 * Generate random single-word Vigenère key
 */
export function generateRandomVigenereKey(): string {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  return word.toUpperCase();
}

/**
 * Calculate Index of Coincidence (IoC) of a text string:
 * IoC = sum( f_i * (f_i - 1) ) / ( N * (N - 1) )
 */
export function calculateIoC(text: string): number {
  const clean = text.toUpperCase().replace(/[^A-Z]/g, '');
  const n = clean.length;
  if (n <= 1) return 0;

  const counts: Record<string, number> = {};
  for (const c of clean) {
    counts[c] = (counts[c] || 0) + 1;
  }

  let sum = 0;
  for (const count of Object.values(counts)) {
    sum += count * (count - 1);
  }

  return sum / (n * (n - 1));
}

/**
 * Friedman test / Kasiski examination to estimate the key length of a Vigenère ciphertext
 */
export function estimateVigenereKeyLength(ciphertext: string, maxLen: number = 10): Array<{ keyLen: number; avgIoC: number; deltaToEnglish: number }> {
  const clean = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
  if (clean.length < 10) return [];

  const results = [];

  for (let len = 1; len <= Math.min(maxLen, Math.floor(clean.length / 2)); len++) {
    let totalIoC = 0;
    for (let offset = 0; offset < len; offset++) {
      let slice = '';
      for (let i = offset; i < clean.length; i += len) {
        slice += clean[i];
      }
      totalIoC += calculateIoC(slice);
    }
    const avgIoC = totalIoC / len;
    results.push({
      keyLen: len,
      avgIoC,
      deltaToEnglish: Math.abs(avgIoC - 0.0667),
    });
  }

  return results.sort((a, b) => a.deltaToEnglish - b.deltaToEnglish);
}
