import { mod, modInverse } from './extended-gcd';

/**
 * Matrix Mathematical Operations for Cryptography (Hill Cipher & Linear Algebra)
 */

export type Matrix2x2 = [[number, number], [number, number]];
export type Matrix3x3 = [
  [number, number, number],
  [number, number, number],
  [number, number, number]
];

/**
 * 2x2 Matrix Determinant modulo m
 */
export function det2x2(m: Matrix2x2, modulus: number = 26): number {
  const d = m[0][0] * m[1][1] - m[0][1] * m[1][0];
  return mod(d, modulus);
}

/**
 * 3x3 Matrix Determinant modulo m
 */
export function det3x3(m: Matrix3x3, modulus: number = 26): number {
  const d =
    m[0][0] * (m[1][1] * m[2][2] - m[1][2] * m[2][1]) -
    m[0][1] * (m[1][0] * m[2][2] - m[1][2] * m[2][0]) +
    m[0][2] * (m[1][0] * m[2][1] - m[1][1] * m[2][0]);
  return mod(d, modulus);
}

/**
 * 2x2 Matrix Inverse modulo m
 */
export function inverse2x2(m: Matrix2x2, modulus: number = 26): Matrix2x2 | null {
  const d = det2x2(m, modulus);
  const invDet = modInverse(d, modulus);
  if (invDet === null) return null;

  // Adjugate matrix for 2x2: [[d, -b], [-c, a]]
  const a = m[0][0], b = m[0][1], c = m[1][0], dVal = m[1][1];

  const adj: Matrix2x2 = [
    [mod(dVal, modulus), mod(-b, modulus)],
    [mod(-c, modulus), mod(a, modulus)]
  ];

  return [
    [mod(adj[0][0] * invDet, modulus), mod(adj[0][1] * invDet, modulus)],
    [mod(adj[1][0] * invDet, modulus), mod(adj[1][1] * invDet, modulus)]
  ];
}

/**
 * 3x3 Matrix Inverse modulo m
 */
export function inverse3x3(m: Matrix3x3, modulus: number = 26): Matrix3x3 | null {
  const d = det3x3(m, modulus);
  const invDet = modInverse(d, modulus);
  if (invDet === null) return null;

  // Cofactor matrix transposed (adjugate)
  const adj: Matrix3x3 = [
    [
      mod(m[1][1] * m[2][2] - m[1][2] * m[2][1], modulus),
      mod(-(m[0][1] * m[2][2] - m[0][2] * m[2][1]), modulus),
      mod(m[0][1] * m[1][2] - m[0][2] * m[1][1], modulus)
    ],
    [
      mod(-(m[1][0] * m[2][2] - m[1][2] * m[2][0]), modulus),
      mod(m[0][0] * m[2][2] - m[0][2] * m[2][0], modulus),
      mod(-(m[0][0] * m[1][2] - m[0][2] * m[1][0]), modulus)
    ],
    [
      mod(m[1][0] * m[2][1] - m[1][1] * m[2][0], modulus),
      mod(-(m[0][0] * m[2][1] - m[0][1] * m[2][0]), modulus),
      mod(m[0][0] * m[1][1] - m[0][1] * m[1][0], modulus)
    ]
  ];

  const result: Matrix3x3 = [
    [mod(adj[0][0] * invDet, modulus), mod(adj[0][1] * invDet, modulus), mod(adj[0][2] * invDet, modulus)],
    [mod(adj[1][0] * invDet, modulus), mod(adj[1][1] * invDet, modulus), mod(adj[1][2] * invDet, modulus)],
    [mod(adj[2][0] * invDet, modulus), mod(adj[2][1] * invDet, modulus), mod(adj[2][2] * invDet, modulus)]
  ];

  return result;
}

/**
 * Multiply 2x2 matrix by a 2-element column vector modulo m
 */
export function multiplyMatrixVector2x2(m: Matrix2x2, v: [number, number], modulus: number = 26): [number, number] {
  return [
    mod(m[0][0] * v[0] + m[0][1] * v[1], modulus),
    mod(m[1][0] * v[0] + m[1][1] * v[1], modulus)
  ];
}

/**
 * Multiply 3x3 matrix by a 3-element column vector modulo m
 */
export function multiplyMatrixVector3x3(m: Matrix3x3, v: [number, number, number], modulus: number = 26): [number, number, number] {
  return [
    mod(m[0][0] * v[0] + m[0][1] * v[1] + m[0][2] * v[2], modulus),
    mod(m[1][0] * v[0] + m[1][1] * v[1] + m[1][2] * v[2], modulus),
    mod(m[2][0] * v[0] + m[2][1] * v[1] + m[2][2] * v[2], modulus)
  ];
}
