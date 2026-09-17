/**
 * Extended Euclidean Algorithm & Modular Arithmetic DSA Utilities
 */

export interface ExtendedGcdResult {
  gcd: number;
  x: number;
  y: number;
  steps: Array<{
    step: number;
    a: number;
    b: number;
    quotient: number;
    remainder: number;
  }>;
}

/**
 * Standard Euclidean Algorithm for greatest common divisor
 */
export function gcd(a: number, b: number): number {
  a = Math.abs(a);
  b = Math.abs(b);
  while (b !== 0) {
    const temp = b;
    b = a % b;
    a = temp;
  }
  return a;
}

/**
 * Extended Euclidean Algorithm: finds x and y such that a*x + b*y = gcd(a, b)
 */
export function extendedGcd(a: number, b: number): ExtendedGcdResult {
  let r0 = a, r1 = b;
  let s0 = 1, s1 = 0;
  let t0 = 0, t1 = 1;
  const steps: ExtendedGcdResult['steps'] = [];
  let stepCount = 0;

  while (r1 !== 0) {
    const q = Math.floor(r0 / r1);
    const r2 = r0 - q * r1;
    const s2 = s0 - q * s1;
    const t2 = t0 - q * t1;

    steps.push({
      step: ++stepCount,
      a: r0,
      b: r1,
      quotient: q,
      remainder: r2,
    });

    r0 = r1; r1 = r2;
    s0 = s1; s1 = s2;
    t0 = t1; t1 = t2;
  }

  return {
    gcd: r0,
    x: s0,
    y: t0,
    steps,
  };
}

/**
 * Computes modular multiplicative inverse: x such that (a * x) % m === 1
 * Returns null if inverse doesn't exist (i.e. gcd(a, m) !== 1)
 */
export function modInverse(a: number, m: number): number | null {
  const normalizedA = ((a % m) + m) % m;
  const res = extendedGcd(normalizedA, m);
  if (res.gcd !== 1) return null;
  return ((res.x % m) + m) % m;
}

/**
 * Checks if a and m are coprime (gcd(a, m) === 1)
 */
export function isCoprime(a: number, m: number): boolean {
  return gcd(a, m) === 1;
}

/**
 * Helper to get proper positive modulo: ((n % m) + m) % m
 */
export function mod(n: number, m: number): number {
  return ((n % m) + m) % m;
}
