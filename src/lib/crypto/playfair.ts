import { WORDS } from './words';

export interface PlayfairDigraphStep {
  pairIndex: number;
  originalPair: [string, string];
  posA: [number, number];
  posB: [number, number];
  rule: 'same-row' | 'same-col' | 'rectangle';
  resultPair: [string, string];
  explanation: string;
}

export interface PlayfairResult {
  text: string;
  matrix: string[][];
  digraphs: Array<[string, string]>;
  steps: PlayfairDigraphStep[];
}

/**
 * Generate 5x5 Playfair matrix from a keyword (I/J combined)
 */
export function getPlayfairMatrix(key: string): string[][] {
  const matrix: string[][] = [];
  const usedChars = new Set<string>();
  const alphabet = 'ABCDEFGHIKLMNOPQRSTUVWXYZ'; // 'J' merged with 'I'

  const cleanKey = (key || 'KEYWORD').toUpperCase().replace(/J/g, 'I');

  // Insert key letters
  for (const char of cleanKey) {
    if (char >= 'A' && char <= 'Z' && !usedChars.has(char)) {
      usedChars.add(char);
    }
  }

  // Fill remaining letters
  for (const char of alphabet) {
    if (!usedChars.has(char)) {
      usedChars.add(char);
    }
  }

  const letters = Array.from(usedChars);
  for (let i = 0; i < 5; i++) {
    matrix.push(letters.slice(i * 5, i * 5 + 5));
  }

  return matrix;
}

/**
 * Locate coordinates of a character in the 5x5 matrix
 */
export function findPosition(matrix: string[][], char: string): [number, number] {
  const target = char === 'J' ? 'I' : char;
  for (let r = 0; r < 5; r++) {
    for (let c = 0; c < 5; c++) {
      if (matrix[r][c] === target) return [r, c];
    }
  }
  return [0, 0];
}

/**
 * Format plaintext into digraph pairs, inserting 'X' between duplicates and padding at end
 */
export function preparePlayfairDigraphs(plaintext: string): Array<[string, string]> {
  const clean = plaintext.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  const pairs: Array<[string, string]> = [];
  let i = 0;

  while (i < clean.length) {
    const a = clean[i];
    let b = clean[i + 1] || 'X';

    if (a === b) {
      pairs.push([a, 'X']);
      i += 1;
    } else {
      pairs.push([a, b]);
      i += 2;
    }
  }

  return pairs;
}

/**
 * Encrypt plaintext using Playfair Cipher with step tracing
 */
export function playfairEncrypt(plaintext: string, key: string): PlayfairResult {
  const matrix = getPlayfairMatrix(key);
  const digraphs = preparePlayfairDigraphs(plaintext);
  const steps: PlayfairDigraphStep[] = [];
  let cipher = '';

  for (let idx = 0; idx < digraphs.length; idx++) {
    const [a, b] = digraphs[idx];
    const posA = findPosition(matrix, a);
    const posB = findPosition(matrix, b);
    let resultPair: [string, string];
    let rule: PlayfairDigraphStep['rule'];
    let explanation: string;

    if (posA[0] === posB[0]) {
      // Same row: shift right (wrap around)
      rule = 'same-row';
      const c1 = matrix[posA[0]][(posA[1] + 1) % 5];
      const c2 = matrix[posB[0]][(posB[1] + 1) % 5];
      resultPair = [c1, c2];
      explanation = `Same row (${posA[0] + 1}): shift columns right → ${c1}${c2}`;
    } else if (posA[1] === posB[1]) {
      // Same column: shift down (wrap around)
      rule = 'same-col';
      const c1 = matrix[(posA[0] + 1) % 5][posA[1]];
      const c2 = matrix[(posB[0] + 1) % 5][posB[1]];
      resultPair = [c1, c2];
      explanation = `Same column (${posA[1] + 1}): shift rows down → ${c1}${c2}`;
    } else {
      // Rectangle: swap column coordinates
      rule = 'rectangle';
      const c1 = matrix[posA[0]][posB[1]];
      const c2 = matrix[posB[0]][posA[1]];
      resultPair = [c1, c2];
      explanation = `Rectangle: corners at (${posA[0] + 1},${posB[1] + 1}) & (${posB[0] + 1},${posA[1] + 1}) → ${c1}${c2}`;
    }

    steps.push({
      pairIndex: idx + 1,
      originalPair: [a, b],
      posA,
      posB,
      rule,
      resultPair,
      explanation,
    });
    cipher += resultPair[0] + resultPair[1];
  }

  // Preserve case matching key if lower
  if (key && key === key.toLowerCase()) {
    cipher = cipher.toLowerCase();
  }

  return { text: cipher, matrix, digraphs, steps };
}

/**
 * Decrypt ciphertext using Playfair Cipher
 */
export function playfairDecrypt(ciphertext: string, key: string): PlayfairResult {
  const matrix = getPlayfairMatrix(key);
  const clean = ciphertext.toUpperCase().replace(/J/g, 'I').replace(/[^A-Z]/g, '');
  const digraphs: Array<[string, string]> = [];
  const steps: PlayfairDigraphStep[] = [];
  let plain = '';

  for (let i = 0; i < clean.length; i += 2) {
    const a = clean[i];
    const b = clean[i + 1] || 'X';
    digraphs.push([a, b]);
  }

  for (let idx = 0; idx < digraphs.length; idx++) {
    const [a, b] = digraphs[idx];
    const posA = findPosition(matrix, a);
    const posB = findPosition(matrix, b);
    let resultPair: [string, string];
    let rule: PlayfairDigraphStep['rule'];
    let explanation: string;

    if (posA[0] === posB[0]) {
      // Same row: shift left
      rule = 'same-row';
      const p1 = matrix[posA[0]][(posA[1] + 4) % 5];
      const p2 = matrix[posB[0]][(posB[1] + 4) % 5];
      resultPair = [p1, p2];
      explanation = `Same row (${posA[0] + 1}): shift columns left → ${p1}${p2}`;
    } else if (posA[1] === posB[1]) {
      // Same column: shift up
      rule = 'same-col';
      const p1 = matrix[(posA[0] + 4) % 5][posA[1]];
      const p2 = matrix[(posB[0] + 4) % 5][posB[1]];
      resultPair = [p1, p2];
      explanation = `Same column (${posA[1] + 1}): shift rows up → ${p1}${p2}`;
    } else {
      // Rectangle: swap columns
      rule = 'rectangle';
      const p1 = matrix[posA[0]][posB[1]];
      const p2 = matrix[posB[0]][posA[1]];
      resultPair = [p1, p2];
      explanation = `Rectangle: corners at (${posA[0] + 1},${posB[1] + 1}) & (${posB[0] + 1},${posA[1] + 1}) → ${p1}${p2}`;
    }

    steps.push({
      pairIndex: idx + 1,
      originalPair: [a, b],
      posA,
      posB,
      rule,
      resultPair,
      explanation,
    });
    plain += resultPair[0] + resultPair[1];
  }

  if (key && key === key.toLowerCase()) {
    plain = plain.toLowerCase();
  }

  return { text: plain, matrix, digraphs, steps };
}

/**
 * Generate random single-word Playfair key from dictionary
 */
export function generatePlayfairKey(): string {
  const word = WORDS[Math.floor(Math.random() * WORDS.length)];
  return word.toUpperCase();
}
