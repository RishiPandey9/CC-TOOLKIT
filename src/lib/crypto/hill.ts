import { Matrix2x2, Matrix3x3, det2x2, det3x3, inverse2x2, inverse3x3, multiplyMatrixVector2x2, multiplyMatrixVector3x3 } from '../dsa/matrix-math';
import { isCoprime, mod } from '../dsa/extended-gcd';

export interface HillStep {
  vectorIndex: number;
  inputChars: string[];
  inputVector: number[];
  outputVector: number[];
  outputChars: string[];
}

export interface HillResult {
  text: string;
  matrix: number[][];
  dimension: 2 | 3;
  determinant: number;
  isInvertible: boolean;
  inverseMatrix: number[][] | null;
  steps: HillStep[];
}

/**
 * Validate and parse a 2x2 or 3x3 key matrix
 */
export function parseHillMatrix(input: string | number[][], dimension: 2 | 3 = 2): {
  matrix: number[][];
  determinant: number;
  isInvertible: boolean;
} {
  let mat: number[][];

  if (Array.isArray(input)) {
    mat = input;
  } else {
    // If string, parse numbers or letters (e.g. "HILL" -> [[7, 8], [11, 11]] or "3 3 2 5")
    const clean = input.trim();
    if (/^[a-zA-Z]+$/.test(clean)) {
      const nums = clean.toUpperCase().split('').map(c => c.charCodeAt(0) - 65);
      if (dimension === 2) {
        mat = [
          [nums[0] || 0, nums[1] || 0],
          [nums[2] || 0, nums[3] || 0]
        ];
      } else {
        mat = [
          [nums[0] || 0, nums[1] || 0, nums[2] || 0],
          [nums[3] || 0, nums[4] || 0, nums[5] || 0],
          [nums[6] || 0, nums[7] || 0, nums[8] || 0]
        ];
      }
    } else {
      const nums = clean.split(/[\s,]+/).map(n => parseInt(n, 10) || 0);
      if (dimension === 2) {
        mat = [
          [nums[0] || 0, nums[1] || 0],
          [nums[2] || 0, nums[3] || 0]
        ];
      } else {
        mat = [
          [nums[0] || 0, nums[1] || 0, nums[2] || 0],
          [nums[3] || 0, nums[4] || 0, nums[5] || 0],
          [nums[6] || 0, nums[7] || 0, nums[8] || 0]
        ];
      }
    }
  }

  const d = dimension === 2 ? det2x2(mat as Matrix2x2) : det3x3(mat as Matrix3x3);
  const isInvertible = isCoprime(d, 26);

  return { matrix: mat, determinant: d, isInvertible };
}

/**
 * Encrypt plaintext using 2x2 or 3x3 Hill Cipher
 */
export function hillEncrypt(plaintext: string, keyMatrix: number[][], dimension: 2 | 3 = 2): HillResult {
  const { matrix, determinant, isInvertible } = parseHillMatrix(keyMatrix, dimension);
  if (!isInvertible) {
    throw new Error(`Matrix is not invertible mod 26 (det=${determinant}, gcd(${determinant}, 26) != 1)`);
  }

  const clean = plaintext.toUpperCase().replace(/[^A-Z]/g, '');
  let padded = clean;
  while (padded.length % dimension !== 0) {
    padded += 'X';
  }

  const steps: HillStep[] = [];
  let cipher = '';

  for (let i = 0; i < padded.length; i += dimension) {
    if (dimension === 2) {
      const c1 = padded[i];
      const c2 = padded[i + 1];
      const v: [number, number] = [c1.charCodeAt(0) - 65, c2.charCodeAt(0) - 65];
      const out = multiplyMatrixVector2x2(matrix as Matrix2x2, v);
      const outChars = [String.fromCharCode(out[0] + 65), String.fromCharCode(out[1] + 65)];

      steps.push({
        vectorIndex: Math.floor(i / 2) + 1,
        inputChars: [c1, c2],
        inputVector: v,
        outputVector: out,
        outputChars: outChars
      });

      cipher += outChars.join('');
    } else {
      const c1 = padded[i];
      const c2 = padded[i + 1];
      const c3 = padded[i + 2];
      const v: [number, number, number] = [c1.charCodeAt(0) - 65, c2.charCodeAt(0) - 65, c3.charCodeAt(0) - 65];
      const out = multiplyMatrixVector3x3(matrix as Matrix3x3, v);
      const outChars = [
        String.fromCharCode(out[0] + 65),
        String.fromCharCode(out[1] + 65),
        String.fromCharCode(out[2] + 65)
      ];

      steps.push({
        vectorIndex: Math.floor(i / 3) + 1,
        inputChars: [c1, c2, c3],
        inputVector: v,
        outputVector: out,
        outputChars: outChars
      });

      cipher += outChars.join('');
    }
  }

  const invMat = dimension === 2 ? inverse2x2(matrix as Matrix2x2) : inverse3x3(matrix as Matrix3x3);

  return {
    text: cipher,
    matrix,
    dimension,
    determinant,
    isInvertible,
    inverseMatrix: invMat,
    steps
  };
}

/**
 * Decrypt ciphertext using Hill Cipher
 */
export function hillDecrypt(ciphertext: string, keyMatrix: number[][], dimension: 2 | 3 = 2): HillResult {
  const { matrix, determinant, isInvertible } = parseHillMatrix(keyMatrix, dimension);
  if (!isInvertible) {
    throw new Error(`Matrix is not invertible mod 26 (det=${determinant})`);
  }

  const invMat = dimension === 2 ? inverse2x2(matrix as Matrix2x2) : inverse3x3(matrix as Matrix3x3);
  if (!invMat) {
    throw new Error('Could not calculate modular matrix inverse.');
  }

  const clean = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
  let padded = clean;
  while (padded.length % dimension !== 0) {
    padded += 'X';
  }

  const steps: HillStep[] = [];
  let plain = '';

  for (let i = 0; i < padded.length; i += dimension) {
    if (dimension === 2) {
      const c1 = padded[i];
      const c2 = padded[i + 1];
      const v: [number, number] = [c1.charCodeAt(0) - 65, c2.charCodeAt(0) - 65];
      const out = multiplyMatrixVector2x2(invMat as Matrix2x2, v);
      const outChars = [String.fromCharCode(out[0] + 65), String.fromCharCode(out[1] + 65)];

      steps.push({
        vectorIndex: Math.floor(i / 2) + 1,
        inputChars: [c1, c2],
        inputVector: v,
        outputVector: out,
        outputChars: outChars
      });

      plain += outChars.join('');
    } else {
      const c1 = padded[i];
      const c2 = padded[i + 1];
      const c3 = padded[i + 2];
      const v: [number, number, number] = [c1.charCodeAt(0) - 65, c2.charCodeAt(0) - 65, c3.charCodeAt(0) - 65];
      const out = multiplyMatrixVector3x3(invMat as Matrix3x3, v);
      const outChars = [
        String.fromCharCode(out[0] + 65),
        String.fromCharCode(out[1] + 65),
        String.fromCharCode(out[2] + 65)
      ];

      steps.push({
        vectorIndex: Math.floor(i / 3) + 1,
        inputChars: [c1, c2, c3],
        inputVector: v,
        outputVector: out,
        outputChars: outChars
      });

      plain += outChars.join('');
    }
  }

  return {
    text: plain,
    matrix,
    dimension,
    determinant,
    isInvertible,
    inverseMatrix: invMat,
    steps
  };
}

/**
 * Pre-configured invertible Hill matrices
 */
export const SAMPLE_HILL_KEYS = {
  matrix2x2_standard: [[3, 3], [2, 5]], // det = 9 (coprime to 26)
  matrix2x2_classic: [[6, 24], [1, 13]], // "HILL" -> [[7,8],[11,11]] det = 77-88 = -11 = 15
  matrix3x3_standard: [[6, 24, 1], [13, 16, 10], [20, 17, 15]]
};
