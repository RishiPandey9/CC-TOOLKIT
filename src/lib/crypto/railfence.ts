export interface RailFenceResult {
  text: string;
  rails: number;
  matrix: string[][];
  zigzagPattern: number[];
}

/**
 * Encrypt text using Rail Fence (Zigzag) cipher
 */
export function railfenceEncrypt(text: string, key: number | string): RailFenceResult {
  const numRails = Math.max(2, parseInt(String(key), 10) || 2);
  if (!text) return { text, rails: numRails, matrix: [], zigzagPattern: [] };

  const len = text.length;
  const matrix: string[][] = Array.from({ length: numRails }, () => Array(len).fill(''));
  const zigzagPattern: number[] = [];

  let rail = 0;
  let dir = 1;

  for (let col = 0; col < len; col++) {
    matrix[rail][col] = text[col];
    zigzagPattern.push(rail);

    rail += dir;
    if (rail === 0 || rail === numRails - 1) {
      dir *= -1;
    }
  }

  let cipher = '';
  for (let r = 0; r < numRails; r++) {
    for (let c = 0; c < len; c++) {
      if (matrix[r][c] !== '') {
        cipher += matrix[r][c];
      }
    }
  }

  return { text: cipher, rails: numRails, matrix, zigzagPattern };
}

/**
 * Decrypt text using Rail Fence cipher
 */
export function railfenceDecrypt(text: string, key: number | string): RailFenceResult {
  const numRails = Math.max(2, parseInt(String(key), 10) || 2);
  if (!text) return { text, rails: numRails, matrix: [], zigzagPattern: [] };

  const len = text.length;
  const matrix: string[][] = Array.from({ length: numRails }, () => Array(len).fill(''));
  const zigzagPattern: number[] = [];

  // Determine zigzag placement markers
  let rail = 0;
  let dir = 1;
  for (let col = 0; col < len; col++) {
    matrix[rail][col] = '*';
    zigzagPattern.push(rail);
    rail += dir;
    if (rail === 0 || rail === numRails - 1) {
      dir *= -1;
    }
  }

  // Fill in the characters row-by-row
  let charIdx = 0;
  for (let r = 0; r < numRails; r++) {
    for (let c = 0; c < len; c++) {
      if (matrix[r][c] === '*' && charIdx < len) {
        matrix[r][c] = text[charIdx++];
      }
    }
  }

  // Read out following zigzag column-by-column
  let plain = '';
  rail = 0;
  dir = 1;
  for (let col = 0; col < len; col++) {
    plain += matrix[rail][col];
    rail += dir;
    if (rail === 0 || rail === numRails - 1) {
      dir *= -1;
    }
  }

  return { text: plain, rails: numRails, matrix, zigzagPattern };
}

/**
 * Generate random rail fence key (2–6)
 */
export function generateRandomRailfenceKey(): number {
  return Math.floor(Math.random() * 5) + 2;
}
