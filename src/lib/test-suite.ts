/**
 * Automated Verification Test Suite for CC-Toolkit
 * Tests all ciphers, S-DES, cryptanalysis heuristics, multi-layer pipelines, and DSA math engines.
 */

import { caesarEncrypt, caesarDecrypt, crackCaesarChiSquared } from './crypto/caesar';
import { monoEncrypt, monoDecrypt, generateMonoKey, isValidMonoKey } from './crypto/monoalphabetic';
import { playfairEncrypt, playfairDecrypt, getPlayfairMatrix } from './crypto/playfair';
import { vigenereEncrypt, vigenereDecrypt, calculateIoC, estimateVigenereKeyLength } from './crypto/vigenere';
import { railfenceEncrypt, railfenceDecrypt } from './crypto/railfence';
import { rowEncrypt, rowDecrypt } from './crypto/rowcolumn';
import { hillEncrypt, hillDecrypt, parseHillMatrix, SAMPLE_HILL_KEYS } from './crypto/hill';
import { affineEncrypt, affineDecrypt, generateRandomAffineKeys } from './crypto/affine';
import { rot13, atbash } from './crypto/atbash';
import { sdesEncryptBlock, sdesDecryptBlock, generateSDesKeys, sdesEncryptText, sdesDecryptText } from './crypto/sdes';
import { executeMultiLayerPipeline, CipherLayer } from './crypto/multilayer';
import { analyzeFrequencies, evaluateDecryptionFitness, crackMonoWithHillClimbing, crackKnownPlaintext } from './crypto/monocracker';
import { extendedGcd, modInverse, isCoprime } from './dsa/extended-gcd';
import { det2x2, det3x3, inverse2x2, inverse3x3 } from './dsa/matrix-math';
import { Trie } from './dsa/trie';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

export interface TestCaseResult {
  suite: string;
  testName: string;
  passed: boolean;
  message?: string;
  durationMs: number;
}

export function runAllAutomatedTests(): { results: TestCaseResult[]; total: number; passed: number; failed: number } {
  const results: TestCaseResult[] = [];

  function test(suite: string, name: string, fn: () => void) {
    const start = performance.now();
    try {
      fn();
      results.push({
        suite,
        testName: name,
        passed: true,
        durationMs: Math.round((performance.now() - start) * 100) / 100
      });
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      results.push({
        suite,
        testName: name,
        passed: false,
        message: msg,
        durationMs: Math.round((performance.now() - start) * 100) / 100
      });
    }
  }

  function assert(condition: boolean, msg: string) {
    if (!condition) throw new Error(msg);
  }

  function assertEqual<T>(actual: T, expected: T, desc: string) {
    if (actual !== expected) {
      throw new Error(`${desc} failed: Expected "${expected}", got "${actual}"`);
    }
  }

  // --- Suite 1: DSA Math & Number Theory ---
  test('DSA Math', 'Extended Euclidean Algorithm computes gcd & Bézout coefficients', () => {
    const res = extendedGcd(240, 46);
    assert(res.gcd === 2, `gcd(240, 46) should be 2, got ${res.gcd}`);
    assert(240 * res.x + 46 * res.y === 2, 'Bézout identity must hold: 240*x + 46*y = 2');
  });

  test('DSA Math', 'Modular multiplicative inverse mod 26', () => {
    assertEqual(modInverse(3, 26), 9, '3^-1 mod 26 should be 9');
    assertEqual(modInverse(5, 26), 21, '5^-1 mod 26 should be 21');
    assertEqual(modInverse(7, 26), 15, '7^-1 mod 26 should be 15');
    assertEqual(modInverse(2, 26), null, 'Even numbers cannot have inverse mod 26');
  });

  test('DSA Math', 'Coprime verification', () => {
    assert(isCoprime(7, 26), '7 and 26 are coprime');
    assert(!isCoprime(13, 26), '13 and 26 are NOT coprime (share factor 13)');
  });

  test('DSA Math', '2x2 and 3x3 Modular Matrix Inversion', () => {
    const mat2 = SAMPLE_HILL_KEYS.matrix2x2_standard as [[number, number], [number, number]];
    const det = det2x2(mat2, 26);
    assert(isCoprime(det, 26), `Determinant ${det} should be coprime with 26`);

    const inv2 = inverse2x2(mat2, 26);
    assert(inv2 !== null, 'Matrix inverse should exist');
    if (inv2) {
      const i00 = (mat2[0][0] * inv2[0][0] + mat2[0][1] * inv2[1][0]) % 26;
      const i01 = (mat2[0][0] * inv2[0][1] + mat2[0][1] * inv2[1][1]) % 26;
      const i10 = (mat2[1][0] * inv2[0][0] + mat2[1][1] * inv2[1][0]) % 26;
      const i11 = (mat2[1][0] * inv2[0][1] + mat2[1][1] * inv2[1][1]) % 26;
      assertEqual(i00, 1, 'Identity [0,0]');
      assertEqual(i01, 0, 'Identity [0,1]');
      assertEqual(i10, 0, 'Identity [1,0]');
      assertEqual(i11, 1, 'Identity [1,1]');
    }
  });

  test('DSA Data Structures', 'Trie Prefix Tree inserts, searches, and matches words', () => {
    const trie = new Trie();
    trie.insert('CIPHER');
    trie.insert('CRYPTOGRAPHY');
    trie.insert('CODE');

    assert(trie.search('CIPHER'), 'Search CIPHER should be true');
    assert(trie.search('CODE'), 'Search CODE should be true');
    assert(!trie.search('CIPH'), 'Search CIPH should be false (prefix only)');
    assert(trie.startsWith('CIPH'), 'StartsWith CIPH should be true');
    assert(!trie.search('UNKNOWN'), 'Search UNKNOWN should be false');

    const evalRes = trie.countRecognizedWords('THECIPHERCODEISSECRET');
    assert(evalRes.wordCount >= 2, 'Should recognize multiple words in stream');
  });

  // --- Suite 2: Classical Ciphers ---
  test('Classical Ciphers', 'Caesar Cipher Encrypt / Decrypt Round-Trip', () => {
    const text = 'Hello, Cryptography World! 2026';
    const enc = caesarEncrypt(text, 5);
    assertEqual(enc.text, 'Mjqqt, Hwduytlwfumd Btwqi! 2026', 'Caesar shift 5');
    const dec = caesarDecrypt(enc.text, 5);
    assertEqual(dec.text, text, 'Caesar decrypt must match original');
  });

  test('Classical Ciphers', 'Caesar Chi-Squared Cracker finds optimal shift', () => {
    const text = 'THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG IN THE PARK';
    const enc = caesarEncrypt(text, 14).text;
    const candidates = crackCaesarChiSquared(enc);
    assert(candidates.length > 0, 'Candidates should be generated');
    assertEqual(candidates[0].shift, 14, 'Best chi-squared match should find shift 14');
  });

  test('Classical Ciphers', 'Monoalphabetic Substitution Encrypt / Decrypt Round-Trip', () => {
    const key = generateMonoKey('upper');
    assert(isValidMonoKey(key), 'Generated key must be valid 26-char permutation');

    const text = 'Secret Message with UPPER & lower Cases!';
    const enc = monoEncrypt(text, key);
    const dec = monoDecrypt(enc.text, key);
    assertEqual(dec.text, text, 'Monoalphabetic decrypt must restore exact text and casing');
  });

  test('Classical Ciphers', 'Playfair Cipher 5x5 Matrix & Digraph Processing', () => {
    const key = 'MONARCHY';
    const matrix = getPlayfairMatrix(key);
    assertEqual(matrix[0].join(''), 'MONAR', 'First row of MONARCHY matrix');
    assertEqual(matrix[1].join(''), 'CHYBD', 'Second row');

    const text = 'INSTRUMENTS';
    const enc = playfairEncrypt(text, key);
    assert(enc.text.length >= text.length, 'Cipher length should accommodate digraphs');
    const dec = playfairDecrypt(enc.text, key);
    assert(dec.text.startsWith('INSTRUMENTS') || dec.text.includes('INSTRUMENT'), 'Decrypted text should match');
  });

  test('Classical Ciphers', 'Vigenère Cipher Encrypt / Decrypt & IoC Analysis', () => {
    const text = 'ATTACKATDAWN';
    const key = 'LEMON';
    const enc = vigenereEncrypt(text, key);
    assertEqual(enc.text, 'LXFOPVEFRNHR', 'Vigenere classic LEMON test vector');
    const dec = vigenereDecrypt(enc.text, key);
    assertEqual(dec.text, text, 'Vigenere decrypt round-trip');

    const ioc = calculateIoC(text);
    assert(ioc > 0, 'IoC calculation must return valid positive index');
  });

  test('Classical Ciphers', 'Rail Fence (Zigzag) Cipher Encrypt / Decrypt', () => {
    const text = 'WE ARE DISCOVERED FLEE AT ONCE';
    const rails = 3;
    const enc = railfenceEncrypt(text, rails);
    const dec = railfenceDecrypt(enc.text, rails);
    assertEqual(dec.text, text, 'Rail fence decrypt round-trip');
  });

  test('Classical Ciphers', 'Row-Column Transposition Encrypt / Decrypt', () => {
    const text = 'CRYPTOGRAPHY IS POWERFUL';
    const key = '3142';
    const enc = rowEncrypt(text, key);
    const dec = rowDecrypt(enc.text, key);
    assert(dec.text.startsWith('CRYPTOGRAPHYISPOWERFUL'), 'Row-column decrypt should match without spaces');
  });

  test('Classical Ciphers', 'Hill Cipher 2x2 & 3x3 Modular Matrix Encryption', () => {
    const mat2 = SAMPLE_HILL_KEYS.matrix2x2_standard;
    const text = 'HELP';
    const enc = hillEncrypt(text, mat2, 2);
    const dec = hillDecrypt(enc.text, mat2, 2);
    assertEqual(dec.text, 'HELP', 'Hill 2x2 decrypt round-trip');

    const mat3 = SAMPLE_HILL_KEYS.matrix3x3_standard;
    const text3 = 'PAYMOREMONEY';
    const enc3 = hillEncrypt(text3, mat3, 3);
    const dec3 = hillDecrypt(enc3.text, mat3, 3);
    assertEqual(dec3.text, 'PAYMOREMONEY', 'Hill 3x3 decrypt round-trip');
  });

  test('Classical Ciphers', 'Affine Cipher (ax + b mod 26)', () => {
    const text = 'AFFINE CIPHER TEST';
    const enc = affineEncrypt(text, 7, 11);
    const dec = affineDecrypt(enc.text, 7, 11);
    assertEqual(dec.text, text, 'Affine decrypt round-trip');
  });

  test('Classical Ciphers', 'ROT13 & Atbash Symmetric Involutions', () => {
    const text = 'Testing Rot13 And Atbash Ciphers!';
    assertEqual(rot13(rot13(text)), text, 'ROT13 is its own inverse');
    assertEqual(atbash(atbash(text)), text, 'Atbash is its own inverse');
  });

  // --- Suite 3: S-DES (Simplified DES) ---
  test('S-DES Engine', 'Key Schedule Subkeys K1 and K2 generation', () => {
    const { K1, K2 } = generateSDesKeys('1010000010');
    assertEqual(K1, '10100100', 'S-DES K1 for key 1010000010');
    assertEqual(K2, '01000011', 'S-DES K2 for key 1010000010');
  });

  test('S-DES Engine', '8-bit Block Encrypt and Decrypt Known Academic Vector', () => {
    const key = '1010000010';
    const plaintext = '10101010';
    const { ciphertext } = sdesEncryptBlock(plaintext, key);
    const { plaintext: decrypted } = sdesDecryptBlock(ciphertext, key);
    assertEqual(decrypted, plaintext, 'S-DES Decrypt(Encrypt(P)) must equal P');
  });

  test('S-DES Engine', 'Multi-Block ASCII Text Encryption & Decryption (ECB Mode)', () => {
    const key = '1010000010';
    const text = 'Crypto 2026';
    const { binaryOutput } = sdesEncryptText(text, key);
    const restored = sdesDecryptText(binaryOutput, key);
    assertEqual(restored, text, 'S-DES ECB text decryption round-trip');
  });

  // --- Suite 4: Multi-Layer Cipher Pipeline ---
  test('Multi-Layer Pipeline', 'Chain 3 Layers (Caesar -> Vigenère -> Rail Fence) and reverse decrypt', () => {
    const layers: CipherLayer[] = [
      { id: '1', algorithm: 'caesar', key: '3' },
      { id: '2', algorithm: 'vigenere', key: 'SECRET' },
      { id: '3', algorithm: 'railfence', key: '3' }
    ];

    const input = 'CONFIDENTIAL DATA TRANSMISSION';
    const encRes = executeMultiLayerPipeline(input, layers, 'encrypt');
    assert(encRes.finalText !== input, 'Encrypted output must be modified');
    assertEqual(encRes.logs.length, 3, 'Must record 3 layer executions');

    const decRes = executeMultiLayerPipeline(encRes.finalText, layers, 'decrypt');
    assertEqual(decRes.finalText, input, 'Multi-layer inverse pipeline must restore original text');
  });

  // --- Suite 5: Cryptanalysis & AI Heuristic Cracker ---
  test('Cryptanalysis', 'Frequency Analysis accurately counts letter distribution', () => {
    const sample = 'EEEEETTTTAA';
    const { frequencies } = analyzeFrequencies(sample);
    const e = frequencies.find(f => f.char === 'E');
    assertEqual(e?.count, 5, 'E count should be 5');
    const t = frequencies.find(f => f.char === 'T');
    assertEqual(t?.count, 4, 'T count should be 4');
  });

  test('Cryptanalysis', 'Known-Plaintext Attack reconstructs partial key mapping', () => {
    const key = 'QWERTYUIOPASDFGHJKLZXCVBNM';
    const plain = 'SECRET';
    const cipher = monoEncrypt(plain, key).text;

    const kpa = crackKnownPlaintext(cipher, plain);
    assert(kpa.mappedCount >= 5, 'KPA should map all distinct letters');
    assertEqual(kpa.mapping['S'], key[UPPER.indexOf('S')], 'Mapping for S must be exact');
    assertEqual(kpa.mapping['E'], key[UPPER.indexOf('E')], 'Mapping for E must be exact');
  });

  test('Cryptanalysis', 'Hill Climbing Heuristic produces valid candidate keys', () => {
    const key = generateMonoKey('upper');
    const original = 'THE ATTACK WILL COMMENCE AT DAWN ON THE BRIDGE';
    const cipher = monoEncrypt(original, key).text;

    const candidates = crackMonoWithHillClimbing(cipher, 100);
    assert(candidates.length > 0, 'Should return top candidates');
    assert(isValidMonoKey(candidates[0].key), 'Candidate key must be a valid 26-char permutation');
  });

  const total = results.length;
  const passed = results.filter(r => r.passed).length;
  const failed = total - passed;

  return { results, total, passed, failed };
}
