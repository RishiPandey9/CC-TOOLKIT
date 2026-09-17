/**
 * Simplified Data Encryption Standard (S-DES) Engine
 * Implements 10-bit key scheduling, 8-bit Feistel round functions,
 * round-by-round visual audit states, and ECB/CBC block modes.
 */

export interface SDesKeySchedule {
  initialKey: string;
  afterP10: string;
  leftHalf: string;
  rightHalf: string;
  afterLS1: string;
  K1: string;
  afterLS2: string;
  K2: string;
}

export interface SDesRoundStep {
  roundNumber: 1 | 2;
  inputLeft: string;
  inputRight: string;
  expandedRight: string;
  afterSubkeyXor: string;
  s0Row: number;
  s0Col: number;
  s0Output: string;
  s1Row: number;
  s1Col: number;
  s1Output: string;
  sBoxOutput: string;
  afterP4: string;
  newLeft: string;
  newRight: string;
}

export interface SDesAuditTrace {
  inputBlock: string;
  afterIP: string;
  ipLeft: string;
  ipRight: string;
  round1: SDesRoundStep;
  afterSwap: { left: string; right: string };
  round2: SDesRoundStep;
  preOutput: string;
  finalOutput: string;
  keySchedule: SDesKeySchedule;
}

// Permutation Tables for S-DES (0-indexed)
const P10 = [2, 4, 1, 6, 3, 9, 0, 8, 7, 5];
const P8 = [5, 2, 6, 3, 7, 4, 9, 8];
const IP = [1, 5, 2, 0, 3, 7, 4, 6];
const IP_INV = [3, 0, 2, 4, 6, 1, 7, 5];
const EP = [3, 0, 1, 2, 1, 2, 3, 0];
const P4 = [1, 3, 2, 0];

// S-Boxes S0 and S1
const S0 = [
  ['01', '00', '11', '10'],
  ['11', '10', '01', '00'],
  ['00', '10', '01', '11'],
  ['11', '01', '11', '10']
];

const S1 = [
  ['00', '01', '10', '11'],
  ['10', '00', '01', '11'],
  ['11', '00', '01', '00'],
  ['10', '01', '00', '11']
];

/**
 * Generate 8-bit subkeys K1 and K2 from a 10-bit master key
 */
export function generateSDesKeys(key: string): { K1: string; K2: string; schedule: SDesKeySchedule } {
  const cleanKey = key.trim();
  if (cleanKey.length !== 10 || !/^[01]{10}$/.test(cleanKey)) {
    throw new Error('Key must be exactly 10 bits of 0s and 1s (e.g. 1010000010)');
  }

  // Permutation P10
  let permutedKey = '';
  for (let i = 0; i < 10; i++) {
    permutedKey += cleanKey[P10[i]];
  }

  const leftHalf = permutedKey.substring(0, 5);
  const rightHalf = permutedKey.substring(5, 10);

  // Left shift by 1 (LS-1)
  const leftShift1 = leftHalf.substring(1) + leftHalf[0];
  const rightShift1 = rightHalf.substring(1) + rightHalf[0];
  const combined1 = leftShift1 + rightShift1;

  // Key K1 via P8
  let K1 = '';
  for (let i = 0; i < 8; i++) {
    K1 += combined1[P8[i]];
  }

  // Left shift by 2 (LS-2) on the previous shifted halves
  const leftShift2 = leftShift1.substring(2) + leftShift1.substring(0, 2);
  const rightShift2 = rightShift1.substring(2) + rightShift1.substring(0, 2);
  const combined2 = leftShift2 + rightShift2;

  // Key K2 via P8
  let K2 = '';
  for (let i = 0; i < 8; i++) {
    K2 += combined2[P8[i]];
  }

  return {
    K1,
    K2,
    schedule: {
      initialKey: cleanKey,
      afterP10: permutedKey,
      leftHalf,
      rightHalf,
      afterLS1: combined1,
      K1,
      afterLS2: combined2,
      K2
    }
  };
}

/**
 * Feistel round function f(R, subkey)
 */
function feistelRound(
  left: string,
  right: string,
  subkey: string,
  roundNumber: 1 | 2
): { newLeft: string; newRight: string; step: SDesRoundStep } {
  // Expansion Permutation EP (4-bit -> 8-bit)
  let expanded = '';
  for (let i = 0; i < 8; i++) {
    expanded += right[EP[i]];
  }

  // XOR with subkey
  let xorResult = '';
  for (let i = 0; i < 8; i++) {
    xorResult += expanded[i] === subkey[i] ? '0' : '1';
  }

  const left4 = xorResult.substring(0, 4);
  const right4 = xorResult.substring(4, 8);

  // S-Box 0 lookup: row = bits 0 & 3, col = bits 1 & 2
  const s0Row = parseInt(left4[0] + left4[3], 2);
  const s0Col = parseInt(left4[1] + left4[2], 2);
  const s0Output = S0[s0Row][s0Col];

  // S-Box 1 lookup: row = bits 0 & 3, col = bits 1 & 2
  const s1Row = parseInt(right4[0] + right4[3], 2);
  const s1Col = parseInt(right4[1] + right4[2], 2);
  const s1Output = S1[s1Row][s1Col];

  const sBoxOutput = s0Output + s1Output;

  // Permutation P4
  let p4Output = '';
  for (let i = 0; i < 4; i++) {
    p4Output += sBoxOutput[P4[i]];
  }

  // XOR with Left Half
  let newLeft = '';
  for (let i = 0; i < 4; i++) {
    newLeft += left[i] === p4Output[i] ? '0' : '1';
  }

  const step: SDesRoundStep = {
    roundNumber,
    inputLeft: left,
    inputRight: right,
    expandedRight: expanded,
    afterSubkeyXor: xorResult,
    s0Row,
    s0Col,
    s0Output,
    s1Row,
    s1Col,
    s1Output,
    sBoxOutput,
    afterP4: p4Output,
    newLeft,
    newRight: right
  };

  return { newLeft, newRight: right, step };
}

/**
 * Encrypt a single 8-bit block with S-DES
 */
export function sdesEncryptBlock(plaintext8: string, key10: string): { ciphertext: string; trace: SDesAuditTrace } {
  const cleanPT = plaintext8.trim();
  if (cleanPT.length !== 8 || !/^[01]{8}$/.test(cleanPT)) {
    throw new Error('Plaintext block must be exactly 8 bits of 0s and 1s (e.g. 10101010)');
  }

  const { K1, K2, schedule } = generateSDesKeys(key10);

  // Initial Permutation (IP)
  let afterIP = '';
  for (let i = 0; i < 8; i++) {
    afterIP += cleanPT[IP[i]];
  }

  const ipLeft = afterIP.substring(0, 4);
  const ipRight = afterIP.substring(4, 8);

  // Round 1 (using K1)
  const round1 = feistelRound(ipLeft, ipRight, K1, 1);

  // Swap halves
  const swapLeft = round1.step.newRight; // old right
  const swapRight = round1.step.newLeft; // round 1 XOR output

  // Round 2 (using K2)
  const round2 = feistelRound(swapLeft, swapRight, K2, 2);

  const preOutput = round2.step.newLeft + round2.step.newRight;

  // Inverse Initial Permutation (IP^-1)
  let ciphertext = '';
  for (let i = 0; i < 8; i++) {
    ciphertext += preOutput[IP_INV[i]];
  }

  const trace: SDesAuditTrace = {
    inputBlock: cleanPT,
    afterIP,
    ipLeft,
    ipRight,
    round1: round1.step,
    afterSwap: { left: swapLeft, right: swapRight },
    round2: round2.step,
    preOutput,
    finalOutput: ciphertext,
    keySchedule: schedule
  };

  return { ciphertext, trace };
}

/**
 * Decrypt a single 8-bit block with S-DES (Rounds use K2 then K1)
 */
export function sdesDecryptBlock(ciphertext8: string, key10: string): { plaintext: string; trace: SDesAuditTrace } {
  const cleanCT = ciphertext8.trim();
  if (cleanCT.length !== 8 || !/^[01]{8}$/.test(cleanCT)) {
    throw new Error('Ciphertext block must be exactly 8 bits of 0s and 1s (e.g. 10101010)');
  }

  const { K1, K2, schedule } = generateSDesKeys(key10);

  // Initial Permutation (IP)
  let afterIP = '';
  for (let i = 0; i < 8; i++) {
    afterIP += cleanCT[IP[i]];
  }

  const ipLeft = afterIP.substring(0, 4);
  const ipRight = afterIP.substring(4, 8);

  // Round 1 (using K2 during decryption)
  const round1 = feistelRound(ipLeft, ipRight, K2, 1);

  // Swap halves
  const swapLeft = round1.step.newRight;
  const swapRight = round1.step.newLeft;

  // Round 2 (using K1 during decryption)
  const round2 = feistelRound(swapLeft, swapRight, K1, 2);

  const preOutput = round2.step.newLeft + round2.step.newRight;

  // Inverse Initial Permutation (IP^-1)
  let plaintext = '';
  for (let i = 0; i < 8; i++) {
    plaintext += preOutput[IP_INV[i]];
  }

  const trace: SDesAuditTrace = {
    inputBlock: cleanCT,
    afterIP,
    ipLeft,
    ipRight,
    round1: round1.step,
    afterSwap: { left: swapLeft, right: swapRight },
    round2: round2.step,
    preOutput,
    finalOutput: plaintext,
    keySchedule: schedule
  };

  return { plaintext, trace };
}

/**
 * Multi-block ASCII string encryption using S-DES in ECB mode
 */
export function sdesEncryptText(text: string, key10: string): { binaryOutput: string; hexOutput: string; blockCount: number } {
  const binaryBlocks: string[] = [];
  for (let i = 0; i < text.length; i++) {
    const byte = text.charCodeAt(i) & 0xff;
    const bin = byte.toString(2).padStart(8, '0');
    const { ciphertext } = sdesEncryptBlock(bin, key10);
    binaryBlocks.push(ciphertext);
  }

  const binaryOutput = binaryBlocks.join(' ');
  const hexOutput = binaryBlocks.map(b => parseInt(b, 2).toString(16).padStart(2, '0')).join('');
  return { binaryOutput, hexOutput, blockCount: binaryBlocks.length };
}

/**
 * Multi-block ASCII string decryption from binary blocks
 */
export function sdesDecryptText(binaryString: string, key10: string): string {
  const clean = binaryString.replace(/[^01]/g, '');
  if (clean.length % 8 !== 0) {
    throw new Error('Binary ciphertext length must be a multiple of 8 bits');
  }

  let text = '';
  for (let i = 0; i < clean.length; i += 8) {
    const block = clean.substring(i, i + 8);
    const { plaintext } = sdesDecryptBlock(block, key10);
    text += String.fromCharCode(parseInt(plaintext, 2));
  }
  return text;
}

/**
 * Generate a random 10-bit binary key
 */
export function generateRandomSDesKey(): string {
  let key = '';
  for (let i = 0; i < 10; i++) {
    key += Math.random() > 0.5 ? '1' : '0';
  }
  return key;
}
