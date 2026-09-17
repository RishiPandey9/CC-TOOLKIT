import { caesarEncrypt, caesarDecrypt } from '../crypto/caesar';
import { monoEncrypt, monoDecrypt, generateMonoKey } from '../crypto/monoalphabetic';
import { vigenereEncrypt, vigenereDecrypt } from '../crypto/vigenere';
import { playfairEncrypt, playfairDecrypt } from '../crypto/playfair';
import { railfenceEncrypt, railfenceDecrypt } from '../crypto/railfence';
import { rowEncrypt, rowDecrypt } from '../crypto/rowcolumn';
import { hillEncrypt, hillDecrypt, SAMPLE_HILL_KEYS } from '../crypto/hill';
import { affineEncrypt, affineDecrypt } from '../crypto/affine';
import { sdesEncryptBlock, sdesDecryptBlock } from '../crypto/sdes';
import { Trie } from './trie';
import { WORDS } from '../crypto/words';
import { extendedGcd } from './extended-gcd';

export interface BenchmarkItemResult {
  name: string;
  category: 'Classical Cipher' | 'Modern Block Cipher' | 'DSA Data Structure' | 'Math Algorithm';
  operationsPerSecond: number;
  avgLatencyMs: number;
  totalOps: number;
  timeComplexity: string;
  memoryComplexity: string;
  notes: string;
}

export function runFullCryptoBenchmark(): BenchmarkItemResult[] {
  const results: BenchmarkItemResult[] = [];
  const testTextShort = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG 12345';
  const testTextLong = testTextShort.repeat(50); // ~2500 chars

  // 1. Caesar Cipher
  {
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < 100) {
      caesarEncrypt(testTextLong, 7);
      caesarDecrypt(testTextLong, 7);
      ops += 2;
    }
    const elapsed = performance.now() - start;
    const opsPerSec = Math.round((ops / elapsed) * 1000);
    results.push({
      name: 'Caesar Cipher (Shift modulo 26)',
      category: 'Classical Cipher',
      operationsPerSecond: opsPerSec,
      avgLatencyMs: Math.round((elapsed / ops) * 1000) / 1000,
      totalOps: ops,
      timeComplexity: 'O(N)',
      memoryComplexity: 'O(N)',
      notes: 'Direct modular character mapping using ASCII arithmetic.'
    });
  }

  // 2. Monoalphabetic Cipher
  {
    const key = generateMonoKey('upper');
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < 100) {
      monoEncrypt(testTextLong, key);
      monoDecrypt(testTextLong, key);
      ops += 2;
    }
    const elapsed = performance.now() - start;
    const opsPerSec = Math.round((ops / elapsed) * 1000);
    results.push({
      name: 'Monoalphabetic Substitution (O(1) Hash Map)',
      category: 'Classical Cipher',
      operationsPerSecond: opsPerSec,
      avgLatencyMs: Math.round((elapsed / ops) * 1000) / 1000,
      totalOps: ops,
      timeComplexity: 'O(N)',
      memoryComplexity: 'O(1) auxiliary state',
      notes: '26-element dictionary hash table lookup per character.'
    });
  }

  // 3. Vigenère Cipher
  {
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < 100) {
      vigenereEncrypt(testTextLong, 'CIPHERKEY');
      vigenereDecrypt(testTextLong, 'CIPHERKEY');
      ops += 2;
    }
    const elapsed = performance.now() - start;
    const opsPerSec = Math.round((ops / elapsed) * 1000);
    results.push({
      name: 'Vigenère Cipher (Polyalphabetic Stream)',
      category: 'Classical Cipher',
      operationsPerSecond: opsPerSec,
      avgLatencyMs: Math.round((elapsed / ops) * 1000) / 1000,
      totalOps: ops,
      timeComplexity: 'O(N)',
      memoryComplexity: 'O(K) where K = key length',
      notes: 'Periodic shift stream modulo 26.'
    });
  }

  // 4. Playfair Cipher
  {
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < 100) {
      playfairEncrypt(testTextLong, 'SECURITY');
      playfairDecrypt(testTextLong, 'SECURITY');
      ops += 2;
    }
    const elapsed = performance.now() - start;
    const opsPerSec = Math.round((ops / elapsed) * 1000);
    results.push({
      name: 'Playfair Cipher (5x5 Matrix Digraph Rules)',
      category: 'Classical Cipher',
      operationsPerSecond: opsPerSec,
      avgLatencyMs: Math.round((elapsed / ops) * 1000) / 1000,
      totalOps: ops,
      timeComplexity: 'O(N)',
      memoryComplexity: 'O(1) 5x5 grid',
      notes: 'Digraph grouping, matrix coordinate search, and rule resolution.'
    });
  }

  // 5. Rail Fence Cipher
  {
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < 100) {
      railfenceEncrypt(testTextLong, 5);
      railfenceDecrypt(testTextLong, 5);
      ops += 2;
    }
    const elapsed = performance.now() - start;
    const opsPerSec = Math.round((ops / elapsed) * 1000);
    results.push({
      name: 'Rail Fence (Zigzag Wave Matrix)',
      category: 'Classical Cipher',
      operationsPerSecond: opsPerSec,
      avgLatencyMs: Math.round((elapsed / ops) * 1000) / 1000,
      totalOps: ops,
      timeComplexity: 'O(N)',
      memoryComplexity: 'O(R * N) grid buffer',
      notes: 'Zigzag rail oscillation and transposition reconstruction.'
    });
  }

  // 6. Row-Column Transposition
  {
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < 100) {
      rowEncrypt(testTextLong, '41325');
      rowDecrypt(testTextLong, '41325');
      ops += 2;
    }
    const elapsed = performance.now() - start;
    const opsPerSec = Math.round((ops / elapsed) * 1000);
    results.push({
      name: 'Row-Column Transposition (Permutation Matrix)',
      category: 'Classical Cipher',
      operationsPerSecond: opsPerSec,
      avgLatencyMs: Math.round((elapsed / ops) * 1000) / 1000,
      totalOps: ops,
      timeComplexity: 'O(N)',
      memoryComplexity: 'O(N) 2D Grid',
      notes: 'Key-ordered column flattening and padding generation.'
    });
  }

  // 7. Hill Cipher (Matrix Math)
  {
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < 100) {
      hillEncrypt(testTextLong, SAMPLE_HILL_KEYS.matrix2x2_standard, 2);
      hillDecrypt(testTextLong, SAMPLE_HILL_KEYS.matrix2x2_standard, 2);
      ops += 2;
    }
    const elapsed = performance.now() - start;
    const opsPerSec = Math.round((ops / elapsed) * 1000);
    results.push({
      name: 'Hill Cipher (2x2 Matrix Linear Algebra mod 26)',
      category: 'Classical Cipher',
      operationsPerSecond: opsPerSec,
      avgLatencyMs: Math.round((elapsed / ops) * 1000) / 1000,
      totalOps: ops,
      timeComplexity: 'O(M^3 + N*M^2)',
      memoryComplexity: 'O(M^2) for M x M matrix',
      notes: 'Modular determinant, adjugate inversion, and vector dot products.'
    });
  }

  // 8. Affine Cipher
  {
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < 100) {
      affineEncrypt(testTextLong, 7, 11);
      affineDecrypt(testTextLong, 7, 11);
      ops += 2;
    }
    const elapsed = performance.now() - start;
    const opsPerSec = Math.round((ops / elapsed) * 1000);
    results.push({
      name: 'Affine Cipher (ax + b mod 26)',
      category: 'Classical Cipher',
      operationsPerSecond: opsPerSec,
      avgLatencyMs: Math.round((elapsed / ops) * 1000) / 1000,
      totalOps: ops,
      timeComplexity: 'O(N)',
      memoryComplexity: 'O(1)',
      notes: 'Extended Euclidean modular inverse precomputation + linear transform.'
    });
  }

  // 9. S-DES (Simplified DES Block Cipher)
  {
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < 100) {
      sdesEncryptBlock('10101010', '1010000010');
      sdesDecryptBlock('10001101', '1010000010');
      ops += 2;
    }
    const elapsed = performance.now() - start;
    const opsPerSec = Math.round((ops / elapsed) * 1000);
    results.push({
      name: 'Simplified DES (S-DES Feistel Round Engine)',
      category: 'Modern Block Cipher',
      operationsPerSecond: opsPerSec,
      avgLatencyMs: Math.round((elapsed / ops) * 1000) / 1000,
      totalOps: ops,
      timeComplexity: 'O(B * R) for B blocks, R rounds',
      memoryComplexity: 'O(1)',
      notes: 'P10/P8 Key Schedule, Expansion Permutation, S0/S1 non-linear S-Boxes, P4.'
    });
  }

  // 10. Trie (Prefix Tree) DSA
  {
    const trie = new Trie();
    for (const w of WORDS) {
      trie.insert(w);
    }
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < 100) {
      trie.search('AUTHENTICITY');
      trie.startsWith('ABER');
      trie.search('CRYPTOGRAPHY');
      ops += 3;
    }
    const elapsed = performance.now() - start;
    const opsPerSec = Math.round((ops / elapsed) * 1000);
    results.push({
      name: 'Trie Prefix Tree (Dictionary Cryptanalysis)',
      category: 'DSA Data Structure',
      operationsPerSecond: opsPerSec,
      avgLatencyMs: Math.round((elapsed / ops) * 1000) / 1000,
      totalOps: ops,
      timeComplexity: 'O(L) where L = word length',
      memoryComplexity: 'O(Alphabet * Total Nodes)',
      notes: 'Constant time lookup independent of dictionary size (1200+ words).'
    });
  }

  // 11. Extended Euclidean Algorithm
  {
    const start = performance.now();
    let ops = 0;
    while (performance.now() - start < 100) {
      extendedGcd(1048576, 26);
      extendedGcd(7, 26);
      ops += 2;
    }
    const elapsed = performance.now() - start;
    const opsPerSec = Math.round((ops / elapsed) * 1000);
    results.push({
      name: 'Extended Euclidean Algorithm (Bézout coefficients)',
      category: 'Math Algorithm',
      operationsPerSecond: opsPerSec,
      avgLatencyMs: Math.round((elapsed / ops) * 1000) / 1000,
      totalOps: ops,
      timeComplexity: 'O(log(min(A, B)))',
      memoryComplexity: 'O(1) recursion/iteration',
      notes: 'Computes gcd(a, b) and modular multiplicative inverse.'
    });
  }

  return results;
}
