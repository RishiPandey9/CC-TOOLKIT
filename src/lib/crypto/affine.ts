import { isCoprime, mod, modInverse } from '../dsa/extended-gcd';

export interface AffineStep {
  char: string;
  isAlphabet: boolean;
  x: number;
  a: number;
  b: number;
  calc: string;
  resultNum: number;
  resultChar: string;
}

export interface AffineResult {
  text: string;
  a: number;
  b: number;
  aInverse: number | null;
  isCoprime: boolean;
  steps: AffineStep[];
}

/**
 * Valid 'a' multipliers coprime with 26: [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25]
 */
export const VALID_AFFINE_A = [1, 3, 5, 7, 9, 11, 15, 17, 19, 21, 23, 25];

/**
 * Encrypt plaintext using Affine Cipher: E(x) = (a*x + b) mod 26
 */
export function affineEncrypt(text: string, aKey: number | string, bKey: number | string): AffineResult {
  const a = parseInt(String(aKey), 10) || 5;
  const b = mod(parseInt(String(bKey), 10) || 8, 26);
  const coprime = isCoprime(a, 26);

  if (!coprime) {
    throw new Error(`Key 'a' (${a}) is not coprime with 26. Must be one of: ${VALID_AFFINE_A.join(', ')}`);
  }

  const aInv = modInverse(a, 26);
  const steps: AffineStep[] = [];
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isUpper = char >= 'A' && char <= 'Z';
    const isLower = char >= 'a' && char <= 'z';

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const x = char.charCodeAt(0) - base;
      const resNum = (a * x + b) % 26;
      const resChar = String.fromCharCode(base + resNum);

      steps.push({
        char,
        isAlphabet: true,
        x,
        a,
        b,
        calc: `(${a} * ${x} + ${b}) mod 26 = ${resNum}`,
        resultNum: resNum,
        resultChar: resChar
      });

      result += resChar;
    } else {
      steps.push({
        char,
        isAlphabet: false,
        x: -1,
        a,
        b,
        calc: 'Non-alphabet',
        resultNum: -1,
        resultChar: char
      });
      result += char;
    }
  }

  return {
    text: result,
    a,
    b,
    aInverse: aInv,
    isCoprime: coprime,
    steps
  };
}

/**
 * Decrypt ciphertext using Affine Cipher: D(y) = a^-1 * (y - b) mod 26
 */
export function affineDecrypt(text: string, aKey: number | string, bKey: number | string): AffineResult {
  const a = parseInt(String(aKey), 10) || 5;
  const b = mod(parseInt(String(bKey), 10) || 8, 26);
  const coprime = isCoprime(a, 26);

  if (!coprime) {
    throw new Error(`Key 'a' (${a}) is not coprime with 26.`);
  }

  const aInv = modInverse(a, 26);
  if (aInv === null) {
    throw new Error(`No modular inverse exists for a=${a} mod 26`);
  }

  const steps: AffineStep[] = [];
  let result = '';

  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const isUpper = char >= 'A' && char <= 'Z';
    const isLower = char >= 'a' && char <= 'z';

    if (isUpper || isLower) {
      const base = isUpper ? 65 : 97;
      const y = char.charCodeAt(0) - base;
      const resNum = mod(aInv * (y - b), 26);
      const resChar = String.fromCharCode(base + resNum);

      steps.push({
        char,
        isAlphabet: true,
        x: y,
        a,
        b,
        calc: `${aInv} * (${y} - ${b}) mod 26 = ${resNum}`,
        resultNum: resNum,
        resultChar: resChar
      });

      result += resChar;
    } else {
      steps.push({
        char,
        isAlphabet: false,
        x: -1,
        a,
        b,
        calc: 'Non-alphabet',
        resultNum: -1,
        resultChar: char
      });
      result += char;
    }
  }

  return {
    text: result,
    a,
    b,
    aInverse: aInv,
    isCoprime: coprime,
    steps
  };
}

/**
 * Generate random valid Affine keys (a in VALID_AFFINE_A, b in 0..25)
 */
export function generateRandomAffineKeys(): { a: number; b: number } {
  const a = VALID_AFFINE_A[Math.floor(Math.random() * VALID_AFFINE_A.length)];
  const b = Math.floor(Math.random() * 26);
  return { a, b };
}
