import { monoDecrypt } from './monoalphabetic';
import { ENGLISH_LETTER_FREQ, ENGLISH_DIGRAPHS, ENGLISH_TRIGRAPHS, WORDS } from './words';
import { Trie } from '../dsa/trie';

const UPPER = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

// Frequency ordered English alphabet for initial seed
const ENGLISH_FREQ_ORDER = 'ETAOINSHRDLUCMFWYPVBGKJQXZ';

// Pre-build Trie for dictionary recognition
const vocabTrie = new Trie();
for (const word of WORDS) {
  vocabTrie.insert(word);
}

export interface FrequencyAnalysisData {
  char: string;
  count: number;
  observedPct: number;
  expectedPct: number;
  deltaPct: number;
}

export interface CrackCandidate {
  key: string;
  decryptedText: string;
  score: number;
  recognizedWordsCount: number;
  iteration: number;
}

/**
 * Perform single-character unigram frequency analysis on ciphertext
 */
export function analyzeFrequencies(ciphertext: string): {
  frequencies: FrequencyAnalysisData[];
  sortedByObserved: string;
  totalLetters: number;
} {
  const clean = ciphertext.toUpperCase().replace(/[^A-Z]/g, '');
  const totalLetters = clean.length;
  const counts: Record<string, number> = {};

  for (const c of UPPER) {
    counts[c] = 0;
  }
  for (const c of clean) {
    counts[c] = (counts[c] || 0) + 1;
  }

  const frequencies: FrequencyAnalysisData[] = UPPER.split('').map(char => {
    const count = counts[char] || 0;
    const observedPct = totalLetters > 0 ? (count / totalLetters) * 100 : 0;
    const expectedPct = ENGLISH_LETTER_FREQ[char] || 0;
    return {
      char,
      count,
      observedPct: Math.round(observedPct * 100) / 100,
      expectedPct,
      deltaPct: Math.round((observedPct - expectedPct) * 100) / 100
    };
  });

  const sortedByObserved = frequencies
    .slice()
    .sort((a, b) => b.count - a.count)
    .map(f => f.char)
    .join('');

  return { frequencies, sortedByObserved, totalLetters };
}

/**
 * Score a decrypted text candidate using unigram, digraph, trigraph frequencies and dictionary matches
 */
export function evaluateDecryptionFitness(decryptedText: string): number {
  const clean = decryptedText.toUpperCase().replace(/[^A-Z]/g, '');
  if (clean.length === 0) return -999999;

  let score = 0;

  // 1. Trigraph matches (+40 per match)
  for (let i = 0; i < clean.length - 2; i++) {
    const tri = clean.substring(i, i + 3);
    if (ENGLISH_TRIGRAPHS.includes(tri)) {
      score += 40;
    }
  }

  // 2. Digraph matches (+15 per match)
  for (let i = 0; i < clean.length - 1; i++) {
    const di = clean.substring(i, i + 2);
    if (ENGLISH_DIGRAPHS.includes(di)) {
      score += 15;
    }
  }

  // 3. Common vowel / consonant patterns
  const vowelCount = (clean.match(/[AEIOU]/g) || []).length;
  const vowelRatio = vowelCount / clean.length;
  // English vowel ratio is roughly 38-42%
  if (vowelRatio >= 0.30 && vowelRatio <= 0.45) {
    score += 50;
  } else {
    score -= Math.abs(vowelRatio - 0.38) * 100;
  }

  // 4. Trie dictionary word matches (+50 per word)
  const { wordCount, matchedChars } = vocabTrie.countRecognizedWords(clean);
  score += wordCount * 60 + matchedChars * 5;

  return score;
}

/**
 * Seed initial key estimate based on frequency matching
 */
export function generateFrequencyInitialKey(ciphertext: string): string {
  const { sortedByObserved } = analyzeFrequencies(ciphertext);
  const keyChars = new Array(26).fill('');

  // Map most frequent cipher letters to most frequent English letters
  for (let i = 0; i < 26; i++) {
    const cipherLetter = sortedByObserved[i];
    const englishLetter = ENGLISH_FREQ_ORDER[i];
    const idx = UPPER.indexOf(englishLetter);
    if (idx !== -1) {
      keyChars[idx] = cipherLetter;
    }
  }

  // Fill in any unused characters
  const used = new Set(keyChars.filter(Boolean));
  const unused = UPPER.split('').filter(c => !used.has(c));
  let unusedIdx = 0;

  for (let i = 0; i < 26; i++) {
    if (!keyChars[i]) {
      keyChars[i] = unused[unusedIdx++];
    }
  }

  return keyChars.join('');
}

/**
 * DSA Hill Climbing & Simulated Annealing Heuristic Cracker for Monoalphabetic Substitution
 */
export function crackMonoWithHillClimbing(
  ciphertext: string,
  maxIterations: number = 2000,
  onProgress?: (progress: { currentBest: CrackCandidate; iteration: number }) => void
): CrackCandidate[] {
  let currentKey = generateFrequencyInitialKey(ciphertext);
  let currentDec = monoDecrypt(ciphertext, currentKey).text;
  let currentScore = evaluateDecryptionFitness(currentDec);

  let bestKey = currentKey;
  let bestDec = currentDec;
  let bestScore = currentScore;

  const topCandidates: CrackCandidate[] = [];

  let temperature = 20.0;
  const coolingRate = 0.998;

  for (let iter = 1; iter <= maxIterations; iter++) {
    // Generate neighbor key by swapping two random positions
    const i = Math.floor(Math.random() * 26);
    let j = Math.floor(Math.random() * 26);
    while (i === j) j = Math.floor(Math.random() * 26);

    const neighborKeyArr = currentKey.split('');
    const temp = neighborKeyArr[i];
    neighborKeyArr[i] = neighborKeyArr[j];
    neighborKeyArr[j] = temp;
    const neighborKey = neighborKeyArr.join('');

    const neighborDec = monoDecrypt(ciphertext, neighborKey).text;
    const neighborScore = evaluateDecryptionFitness(neighborDec);

    const delta = neighborScore - currentScore;

    // Simulated annealing acceptance probability: P = e^(delta / T)
    if (delta > 0 || Math.exp(delta / Math.max(0.01, temperature)) > Math.random()) {
      currentKey = neighborKey;
      currentDec = neighborDec;
      currentScore = neighborScore;

      if (currentScore > bestScore) {
        bestScore = currentScore;
        bestKey = currentKey;
        bestDec = currentDec;

        const { wordCount } = vocabTrie.countRecognizedWords(bestDec);

        topCandidates.unshift({
          key: bestKey,
          decryptedText: bestDec,
          score: Math.round(bestScore),
          recognizedWordsCount: wordCount,
          iteration: iter
        });

        if (topCandidates.length > 8) {
          topCandidates.pop();
        }

        if (onProgress) {
          onProgress({
            currentBest: topCandidates[0],
            iteration: iter
          });
        }
      }
    }

    temperature *= coolingRate;
  }

  const { wordCount } = vocabTrie.countRecognizedWords(bestDec);
  if (topCandidates.length === 0) {
    topCandidates.push({
      key: bestKey,
      decryptedText: bestDec,
      score: Math.round(bestScore),
      recognizedWordsCount: wordCount,
      iteration: maxIterations
    });
  }

  return topCandidates;
}

/**
 * Known-Plaintext Attack (KPA) for Monoalphabetic Cipher
 */
export function crackKnownPlaintext(
  ciphertext: string,
  knownPlaintext: string
): {
  partialKey: string;
  mappedCount: number;
  decrypted: string;
  mapping: Record<string, string>;
} {
  const cipherUpper = ciphertext.toUpperCase();
  const plainUpper = knownPlaintext.toUpperCase();
  const minLen = Math.min(cipherUpper.length, plainUpper.length);

  const plainToCipher: Record<string, string> = {};
  const cipherToPlain: Record<string, string> = {};

  for (let i = 0; i < minLen; i++) {
    const cChar = cipherUpper[i];
    const pChar = plainUpper[i];

    if (cChar >= 'A' && cChar <= 'Z' && pChar >= 'A' && pChar <= 'Z') {
      plainToCipher[pChar] = cChar;
      cipherToPlain[cChar] = pChar;
    }
  }

  // Construct 26-char key
  const keyChars = new Array(26).fill('.');
  for (let i = 0; i < 26; i++) {
    const p = UPPER[i];
    if (plainToCipher[p]) {
      keyChars[i] = plainToCipher[p];
    }
  }

  const partialKey = keyChars.join('');
  const mappedCount = Object.keys(plainToCipher).length;

  // Decrypt what we know, leaving unmapped characters as lowercase or '?'
  let decrypted = '';
  for (const char of ciphertext) {
    const upper = char.toUpperCase();
    if (cipherToPlain[upper]) {
      decrypted += char === upper ? cipherToPlain[upper] : cipherToPlain[upper].toLowerCase();
    } else if (/[a-zA-Z]/.test(char)) {
      decrypted += '_';
    } else {
      decrypted += char;
    }
  }

  return {
    partialKey,
    mappedCount,
    decrypted,
    mapping: plainToCipher
  };
}
