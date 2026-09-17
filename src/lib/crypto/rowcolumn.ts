export interface RowColumnResult {
  text: string;
  key: string;
  rows: number;
  cols: number;
  grid: string[][];
  paddedText: string;
  readOrder: Array<{ digit: number; colIndex: number }>;
}

/**
 * Encrypt text using Row-Column Transposition Cipher
 */
export function rowEncrypt(text: string, key: string | number): RowColumnResult {
  if (!text) {
    return { text: '', key: String(key), rows: 0, cols: 0, grid: [], paddedText: '', readOrder: [] };
  }

  const processedText = text.replace(/\s+/g, '');
  const keyStr = String(key || '3142').replace(/[^0-9]/g, '');
  const cols = keyStr.length || 4;
  const textLen = processedText.length;

  const rows = Math.max(1, Math.ceil(textLen / cols));
  const gridSize = rows * cols;
  const paddingNeeded = gridSize - textLen;

  const paddingChars = ['X', 'Y', 'Z'];
  let paddedText = processedText;
  for (let i = 0; i < paddingNeeded; i++) {
    paddedText += paddingChars[i % 3];
  }

  // Populate grid row-wise
  const grid: string[][] = Array.from({ length: rows }, () => Array(cols).fill(''));
  let idx = 0;
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      grid[r][c] = paddedText[idx++] || 'X';
    }
  }

  // Column order based on ascending key digits
  const readOrder = keyStr.split('').map((digit, colIndex) => ({
    digit: parseInt(digit, 10),
    colIndex
  })).sort((a, b) => a.digit - b.digit);

  // Read columns in specified order
  let result = '';
  for (const { colIndex } of readOrder) {
    for (let r = 0; r < rows; r++) {
      result += grid[r][colIndex];
    }
  }

  return {
    text: result,
    key: keyStr,
    rows,
    cols,
    grid,
    paddedText,
    readOrder
  };
}

/**
 * Decrypt text using Row-Column Transposition Cipher
 */
export function rowDecrypt(text: string, key: string | number): RowColumnResult {
  if (!text) {
    return { text: '', key: String(key), rows: 0, cols: 0, grid: [], paddedText: '', readOrder: [] };
  }

  const keyStr = String(key || '3142').replace(/[^0-9]/g, '');
  const cols = keyStr.length || 4;
  const textLen = text.length;

  const rows = Math.max(1, Math.ceil(textLen / cols));

  const readOrder = keyStr.split('').map((digit, colIndex) => ({
    digit: parseInt(digit, 10),
    colIndex
  })).sort((a, b) => a.digit - b.digit);

  // Fill grid column-wise in the sorted key order
  const grid: string[][] = Array.from({ length: rows }, () => Array(cols).fill(''));
  let textIndex = 0;

  for (const { colIndex } of readOrder) {
    for (let r = 0; r < rows; r++) {
      if (textIndex < textLen) {
        grid[r][colIndex] = text[textIndex++];
      }
    }
  }

  // Read grid row-wise to get plaintext
  const plaintext = grid.flat().join('');

  return {
    text: plaintext,
    key: keyStr,
    rows,
    cols,
    grid,
    paddedText: text,
    readOrder
  };
}

/**
 * Generate random Row Transposition key (permutation of 1..N where N in 2..6)
 */
export function generateRandomRowKey(): string {
  const n = Math.floor(Math.random() * 5) + 2; // 2..6 columns
  const digits = Array.from({ length: n }, (_, i) => i + 1);

  for (let i = n - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [digits[i], digits[j]] = [digits[j], digits[i]];
  }

  return digits.join('');
}
