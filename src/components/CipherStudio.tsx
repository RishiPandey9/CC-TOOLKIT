'use client';

import React, { useState, useEffect, useMemo } from 'react';
import {
  Shield,
  Key,
  Copy,
  Check,
  ArrowRightLeft,
  ChevronDown,
  ChevronUp,
  Info,
  Wand2,
  Lock,
  Unlock,
  Sliders,
  Table as TableIcon,
  Sparkles
} from 'lucide-react';
import confetti from 'canvas-confetti';

import { caesarEncrypt, caesarDecrypt, generateRandomCaesarKey } from '../lib/crypto/caesar';
import { monoEncrypt, monoDecrypt, generateMonoKey, isValidMonoKey } from '../lib/crypto/monoalphabetic';
import { playfairEncrypt, playfairDecrypt, generatePlayfairKey } from '../lib/crypto/playfair';
import { vigenereEncrypt, vigenereDecrypt, generateRandomVigenereKey, calculateIoC } from '../lib/crypto/vigenere';
import { railfenceEncrypt, railfenceDecrypt, generateRandomRailfenceKey } from '../lib/crypto/railfence';
import { rowEncrypt, rowDecrypt, generateRandomRowKey } from '../lib/crypto/rowcolumn';
import { hillEncrypt, hillDecrypt, parseHillMatrix } from '../lib/crypto/hill';
import { affineEncrypt, affineDecrypt, generateRandomAffineKeys, VALID_AFFINE_A } from '../lib/crypto/affine';
import { rot13, atbash } from '../lib/crypto/atbash';

export type CipherType =
  | 'caesar'
  | 'mono'
  | 'playfair'
  | 'vigenere'
  | 'railfence'
  | 'rowcolumn'
  | 'hill'
  | 'affine'
  | 'rot13'
  | 'atbash';

interface CipherInfo {
  id: CipherType;
  name: string;
  category: string;
  complexity: string;
  description: string;
  defaultKey: string;
}

const CIPHER_REGISTRY: CipherInfo[] = [
  {
    id: 'caesar',
    name: 'Caesar',
    category: 'Substitution',
    complexity: 'O(N)',
    description: 'Shifts each letter by a fixed position offset modulo 26.',
    defaultKey: '3'
  },
  {
    id: 'mono',
    name: 'Monoalphabetic',
    category: 'Permutation',
    complexity: 'O(N)',
    description: 'Fixed 26-letter substitution alphabet mapping.',
    defaultKey: 'QWERTYUIOPASDFGHJKLZXCVBNM'
  },
  {
    id: 'playfair',
    name: 'Playfair',
    category: 'Digraph',
    complexity: 'O(N)',
    description: '5x5 matrix geometric digraph substitution with I/J combined.',
    defaultKey: 'MONARCHY'
  },
  {
    id: 'vigenere',
    name: 'Vigenère',
    category: 'Polyalphabetic',
    complexity: 'O(N)',
    description: 'Polyalphabetic Caesar stream repeating a keyword sequence.',
    defaultKey: 'LEMON'
  },
  {
    id: 'railfence',
    name: 'Rail Fence',
    category: 'Transposition',
    complexity: 'O(N)',
    description: 'Zigzag multi-rail oscillation pattern.',
    defaultKey: '3'
  },
  {
    id: 'rowcolumn',
    name: 'Row-Column',
    category: 'Transposition',
    complexity: 'O(N)',
    description: 'Permutation grid with dynamic column read order and padding.',
    defaultKey: '3142'
  },
  {
    id: 'hill',
    name: 'Hill (Matrix)',
    category: 'Linear Algebra',
    complexity: 'O(N·M²)',
    description: 'Matrix multiplication and modular inversion mod 26.',
    defaultKey: '3 3 2 5'
  },
  {
    id: 'affine',
    name: 'Affine',
    category: 'Arithmetic',
    complexity: 'O(N)',
    description: 'Linear modular transform E(x) = (ax + b) mod 26.',
    defaultKey: '7'
  },
  {
    id: 'rot13',
    name: 'ROT13',
    category: 'Reciprocal',
    complexity: 'O(N)',
    description: 'Shift by 13 serving as its own inverse.',
    defaultKey: ''
  },
  {
    id: 'atbash',
    name: 'Atbash',
    category: 'Reciprocal',
    complexity: 'O(N)',
    description: 'Reverses the alphabet mapping (A ↔ Z, B ↔ Y).',
    defaultKey: ''
  }
];

export default function CipherStudio() {
  const [selectedCipher, setSelectedCipher] = useState<CipherType>('caesar');
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('THE QUICK BROWN FOX JUMPS OVER THE LAZY DOG');
  const [outputText, setOutputText] = useState('');
  const [key, setKey] = useState('3');
  const [affineB, setAffineB] = useState('8');
  const [hillDimension, setHillDimension] = useState<2 | 3>(2);
  const [copied, setCopied] = useState(false);
  const [showDetails, setShowDetails] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [traceData, setTraceData] = useState<any>(null);

  const currentMeta = useMemo(() => {
    return CIPHER_REGISTRY.find((c) => c.id === selectedCipher) || CIPHER_REGISTRY[0];
  }, [selectedCipher]);

  const handleSelectCipher = (cipherId: CipherType) => {
    setSelectedCipher(cipherId);
    const meta = CIPHER_REGISTRY.find((c) => c.id === cipherId);
    if (meta && meta.defaultKey !== undefined) {
      setKey(meta.defaultKey);
    }
    setError(null);
  };

  const handleGenerateRandomKey = () => {
    switch (selectedCipher) {
      case 'caesar':
        setKey(String(generateRandomCaesarKey()));
        break;
      case 'mono':
        setKey(generateMonoKey('upper'));
        break;
      case 'playfair':
        setKey(generatePlayfairKey());
        break;
      case 'vigenere':
        setKey(generateRandomVigenereKey());
        break;
      case 'railfence':
        setKey(String(generateRandomRailfenceKey()));
        break;
      case 'rowcolumn':
        setKey(generateRandomRowKey());
        break;
      case 'affine': {
        const rand = generateRandomAffineKeys();
        setKey(String(rand.a));
        setAffineB(String(rand.b));
        break;
      }
      case 'hill':
        setKey(hillDimension === 2 ? '3 3 2 5' : '6 24 1 13 16 10 20 17 15');
        break;
      default:
        break;
    }
  };

  const processCipher = () => {
    setError(null);
    if (!inputText) {
      setOutputText('');
      setTraceData(null);
      return;
    }

    try {
      switch (selectedCipher) {
        case 'caesar': {
          const shift = parseInt(key, 10) || 0;
          const res = mode === 'encrypt' ? caesarEncrypt(inputText, shift) : caesarDecrypt(inputText, shift);
          setOutputText(res.text);
          setTraceData(res);
          break;
        }
        case 'mono': {
          const res = mode === 'encrypt' ? monoEncrypt(inputText, key) : monoDecrypt(inputText, key);
          setOutputText(res.text);
          setTraceData(res);
          break;
        }
        case 'playfair': {
          const res = mode === 'encrypt' ? playfairEncrypt(inputText, key) : playfairDecrypt(inputText, key);
          setOutputText(res.text);
          setTraceData(res);
          break;
        }
        case 'vigenere': {
          const res = mode === 'encrypt' ? vigenereEncrypt(inputText, key) : vigenereDecrypt(inputText, key);
          setOutputText(res.text);
          setTraceData(res);
          break;
        }
        case 'railfence': {
          const rails = parseInt(key, 10) || 3;
          const res = mode === 'encrypt' ? railfenceEncrypt(inputText, rails) : railfenceDecrypt(inputText, rails);
          setOutputText(res.text);
          setTraceData(res);
          break;
        }
        case 'rowcolumn': {
          const res = mode === 'encrypt' ? rowEncrypt(inputText, key) : rowDecrypt(inputText, key);
          setOutputText(res.text);
          setTraceData(res);
          break;
        }
        case 'hill': {
          const parsed = parseHillMatrix(key, hillDimension);
          if (!parsed.isInvertible) {
            setError(`Matrix not invertible mod 26 (det=${parsed.determinant}). Must be coprime with 26.`);
            return;
          }
          const res =
            mode === 'encrypt'
              ? hillEncrypt(inputText, parsed.matrix, hillDimension)
              : hillDecrypt(inputText, parsed.matrix, hillDimension);
          setOutputText(res.text);
          setTraceData(res);
          break;
        }
        case 'affine': {
          const a = parseInt(key, 10) || 5;
          const b = parseInt(affineB, 10) || 0;
          const res = mode === 'encrypt' ? affineEncrypt(inputText, a, b) : affineDecrypt(inputText, a, b);
          setOutputText(res.text);
          setTraceData(res);
          break;
        }
        case 'rot13': {
          const res = rot13(inputText);
          setOutputText(res);
          setTraceData({ text: res, method: 'ROT13' });
          break;
        }
        case 'atbash': {
          const res = atbash(inputText);
          setOutputText(res);
          setTraceData({ text: res, method: 'Atbash' });
          break;
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    }
  };

  useEffect(() => {
    processCipher();
  }, [inputText, key, affineB, selectedCipher, mode, hillDimension]);

  const handleCopy = () => {
    if (!outputText) return;
    navigator.clipboard.writeText(outputText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  const handleSwap = () => {
    if (!outputText) return;
    setInputText(outputText);
    setMode(mode === 'encrypt' ? 'decrypt' : 'encrypt');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Top Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white flex items-center gap-2.5">
            Cipher Studio
            <span className="rounded bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 text-xs font-mono font-normal text-slate-400">
              {currentMeta.name} · {currentMeta.complexity}
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-xl">
            {currentMeta.description}
          </p>
        </div>

        {/* Mode Toggle (Segmented Control) */}
        <div className="inline-flex rounded-lg bg-white/[0.04] p-1 border border-white/[0.08] self-start sm:self-auto">
          <button
            onClick={() => setMode('encrypt')}
            className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium transition-all ${
              mode === 'encrypt'
                ? 'bg-white/[0.1] text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Lock className="h-3.5 w-3.5" />
            <span>Encrypt</span>
          </button>
          <button
            onClick={() => setMode('decrypt')}
            className={`flex items-center gap-1.5 rounded-md px-4 py-1.5 text-xs font-medium transition-all ${
              mode === 'decrypt'
                ? 'bg-white/[0.1] text-white shadow-sm font-semibold'
                : 'text-slate-400 hover:text-slate-200'
            }`}
          >
            <Unlock className="h-3.5 w-3.5" />
            <span>Decrypt</span>
          </button>
        </div>
      </div>

      {/* Cipher Selector Pills */}
      <div className="flex flex-wrap gap-1.5">
        {CIPHER_REGISTRY.map((cipher) => {
          const isSelected = selectedCipher === cipher.id;
          return (
            <button
              key={cipher.id}
              onClick={() => handleSelectCipher(cipher.id)}
              className={`rounded-lg px-3 py-1.5 text-xs font-medium transition-all ${
                isSelected
                  ? 'bg-white text-slate-950 font-semibold shadow-sm'
                  : 'bg-white/[0.03] text-slate-400 hover:text-slate-200 hover:bg-white/[0.06] border border-white/[0.06]'
              }`}
            >
              {cipher.name}
            </button>
          );
        })}
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Input, Key, Output) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Key Input Section */}
          {selectedCipher !== 'rot13' && selectedCipher !== 'atbash' && (
            <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-3">
              <div className="flex items-center justify-between">
                <label className="text-xs font-medium text-slate-300 flex items-center gap-1.5">
                  <Key className="h-3.5 w-3.5 text-slate-400" />
                  <span>Key Parameters</span>
                </label>
                <button
                  onClick={handleGenerateRandomKey}
                  className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors"
                >
                  <Wand2 className="h-3 w-3" />
                  <span>Random</span>
                </button>
              </div>

              {selectedCipher === 'caesar' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Shift: <strong className="text-white">{key}</strong></span>
                    <span>1 – 25</span>
                  </div>
                  <input
                    type="range"
                    min="1"
                    max="25"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/[0.1] rounded-lg"
                  />
                </div>
              )}

              {selectedCipher === 'mono' && (
                <div className="space-y-1.5">
                  <input
                    type="text"
                    value={key}
                    maxLength={26}
                    onChange={(e) => setKey(e.target.value.toUpperCase())}
                    placeholder="26 unique characters..."
                    className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-2 text-xs font-mono tracking-widest text-white focus:border-cyan-500 focus:outline-none"
                  />
                  <div className="flex justify-between text-[11px] font-mono text-slate-500">
                    <span>{key.length}/26 chars</span>
                    <span className={isValidMonoKey(key) ? 'text-emerald-400' : 'text-amber-400'}>
                      {isValidMonoKey(key) ? 'Valid key' : 'Needs 26 distinct letters'}
                    </span>
                  </div>
                </div>
              )}

              {selectedCipher === 'playfair' && (
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                  placeholder="Playfair keyword (e.g. MONARCHY)..."
                  className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-2 text-xs font-mono tracking-wide text-white focus:border-cyan-500 focus:outline-none"
                />
              )}

              {selectedCipher === 'vigenere' && (
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value.toUpperCase().replace(/[^A-Z]/g, ''))}
                  placeholder="Vigenère keyword (e.g. LEMON)..."
                  className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-2 text-xs font-mono tracking-wide text-white focus:border-cyan-500 focus:outline-none"
                />
              )}

              {selectedCipher === 'railfence' && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs font-mono text-slate-400">
                    <span>Rails: <strong className="text-white">{key}</strong></span>
                    <span>2 – 8</span>
                  </div>
                  <input
                    type="range"
                    min="2"
                    max="8"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full accent-cyan-400 cursor-pointer h-1.5 bg-white/[0.1] rounded-lg"
                  />
                </div>
              )}

              {selectedCipher === 'rowcolumn' && (
                <input
                  type="text"
                  value={key}
                  onChange={(e) => setKey(e.target.value.replace(/[^0-9]/g, ''))}
                  placeholder="Permutation digits (e.g. 3142)..."
                  className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-2 text-xs font-mono tracking-widest text-white focus:border-cyan-500 focus:outline-none"
                />
              )}

              {selectedCipher === 'affine' && (
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Multiplier a (coprime to 26):</label>
                    <select
                      value={key}
                      onChange={(e) => setKey(e.target.value)}
                      className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                    >
                      {VALID_AFFINE_A.map((val) => (
                        <option key={val} value={val}>a = {val}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] text-slate-400 mb-1 block">Shift b (0..25):</label>
                    <input
                      type="number"
                      min="0"
                      max="25"
                      value={affineB}
                      onChange={(e) => setAffineB(e.target.value)}
                      className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-1.5 text-xs font-mono text-white focus:outline-none"
                    />
                  </div>
                </div>
              )}

              {selectedCipher === 'hill' && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] text-slate-400">Matrix elements:</span>
                    <div className="flex gap-1">
                      <button
                        onClick={() => { setHillDimension(2); setKey('3 3 2 5'); }}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded ${hillDimension === 2 ? 'bg-white/[0.15] text-white' : 'text-slate-500'}`}
                      >
                        2x2
                      </button>
                      <button
                        onClick={() => { setHillDimension(3); setKey('6 24 1 13 16 10 20 17 15'); }}
                        className={`px-2 py-0.5 text-[10px] font-mono rounded ${hillDimension === 3 ? 'bg-white/[0.15] text-white' : 'text-slate-500'}`}
                      >
                        3x3
                      </button>
                    </div>
                  </div>
                  <input
                    type="text"
                    value={key}
                    onChange={(e) => setKey(e.target.value)}
                    className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-2 text-xs font-mono text-white focus:outline-none"
                  />
                </div>
              )}
            </div>
          )}

          {/* Input Text Card */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">
                {mode === 'encrypt' ? 'Plaintext' : 'Ciphertext'}
              </span>
              <span className="font-mono text-[11px] text-slate-500">{inputText.length} chars</span>
            </div>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Type message here..."
              className="w-full rounded-lg border border-white/[0.08] bg-[#090a0f] p-3 text-xs font-mono text-slate-100 placeholder-slate-600 focus:border-white/[0.2] focus:outline-none resize-y"
            />
          </div>

          {/* Center Action (Swap) */}
          <div className="flex justify-center">
            <button
              onClick={handleSwap}
              className="flex items-center gap-1.5 rounded-md border border-white/[0.08] bg-white/[0.03] px-3 py-1 text-xs font-medium text-slate-400 hover:text-white hover:bg-white/[0.06] transition-all"
            >
              <ArrowRightLeft className="h-3 w-3" />
              <span>Swap</span>
            </button>
          </div>

          {/* Output Text Card */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">
                {mode === 'encrypt' ? 'Encrypted Output' : 'Decrypted Output'}
              </span>
              <button
                onClick={handleCopy}
                disabled={!outputText}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white transition-colors disabled:opacity-30"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {error ? (
              <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-3 text-xs font-mono text-rose-400">
                {error}
              </div>
            ) : (
              <textarea
                rows={3}
                readOnly
                value={outputText}
                placeholder="Output appears here..."
                className="w-full rounded-lg border border-white/[0.06] bg-[#07090d] p-3 text-xs font-mono text-slate-200 placeholder-slate-700 focus:outline-none resize-y"
              />
            )}
          </div>
        </div>

        {/* Right Column (Visualizers & Math State) */}
        <div className="lg:col-span-5 space-y-4">
          {/* Playfair 5x5 Matrix Visualizer */}
          {selectedCipher === 'playfair' && traceData?.matrix && (
            <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-3">
              <span className="text-xs font-medium text-slate-300 block">5x5 Playfair Matrix</span>
              <div className="grid grid-cols-5 gap-1.5 max-w-[220px] mx-auto p-2 rounded-lg bg-[#090a0f] border border-white/[0.06]">
                {traceData.matrix.map((row: string[], r: number) =>
                  row.map((char: string, c: number) => (
                    <div
                      key={`${r}-${c}`}
                      className="flex h-8 items-center justify-center rounded bg-white/[0.03] text-xs font-mono font-medium text-slate-200 border border-white/[0.04]"
                    >
                      {char}
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* Rail Fence Wave Visualizer */}
          {selectedCipher === 'railfence' && traceData?.matrix && (
            <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-3 overflow-x-auto">
              <span className="text-xs font-medium text-slate-300 block">Rail Fence Wave</span>
              <div className="space-y-1 p-2 rounded-lg bg-[#090a0f] border border-white/[0.06] min-w-[280px]">
                {traceData.matrix.map((row: string[], r: number) => (
                  <div key={r} className="flex items-center gap-1 font-mono text-[11px]">
                    <span className="w-10 text-slate-500">R{r + 1}:</span>
                    <div className="flex gap-0.5 overflow-x-auto">
                      {row.slice(0, 24).map((char, c) => (
                        <span
                          key={c}
                          className={`inline-flex h-5 w-5 items-center justify-center rounded text-[10px] ${
                            char
                              ? 'bg-white/[0.1] text-white font-semibold'
                              : 'text-slate-700'
                          }`}
                        >
                          {char || '·'}
                        </span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Row Column Grid */}
          {selectedCipher === 'rowcolumn' && traceData?.grid && (
            <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-3">
              <span className="text-xs font-medium text-slate-300 block">Transposition Grid</span>
              <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.06] overflow-x-auto">
                <div className="flex gap-1.5 justify-center mb-2 border-b border-white/[0.06] pb-2">
                  {traceData.key.split('').map((digit: string, i: number) => (
                    <div key={i} className="h-6 w-6 flex items-center justify-center rounded bg-white/[0.08] text-xs font-mono font-semibold text-white">
                      {digit}
                    </div>
                  ))}
                </div>
                <div className="space-y-1">
                  {traceData.grid.map((row: string[], r: number) => (
                    <div key={r} className="flex gap-1.5 justify-center">
                      {row.map((cell: string, c: number) => (
                        <div
                          key={c}
                          className="h-6 w-6 flex items-center justify-center rounded bg-white/[0.03] text-xs font-mono text-slate-300"
                        >
                          {cell}
                        </div>
                      ))}
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* Vigenere IoC */}
          {selectedCipher === 'vigenere' && (
            <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-2 text-xs">
              <div className="flex justify-between text-slate-400">
                <span>Index of Coincidence (IoC):</span>
                <span className="font-mono text-white font-semibold">
                  {calculateIoC(inputText).toFixed(4)}
                </span>
              </div>
              <p className="text-[11px] text-slate-500">
                Standard English reference: 0.0667. Vigenère spreads frequencies closer to 0.038.
              </p>
            </div>
          )}

          {/* Step Details Accordion */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-2">
            <button
              onClick={() => setShowDetails(!showDetails)}
              className="flex w-full items-center justify-between text-xs font-medium text-slate-300 hover:text-white transition-colors"
            >
              <span>Execution Steps ({traceData?.steps?.length || 0})</span>
              {showDetails ? <ChevronUp className="h-3.5 w-3.5" /> : <ChevronDown className="h-3.5 w-3.5" />}
            </button>

            {showDetails && traceData?.steps && (
              <div className="max-h-56 overflow-y-auto space-y-1 pr-1 font-mono text-[11px] pt-2 border-t border-white/[0.06]">
                {traceData.steps.slice(0, 40).map((step: any, idx: number) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between rounded p-1.5 bg-white/[0.02] border border-white/[0.04]"
                  >
                    <span className="text-slate-400">
                      {step.originalChar || step.originalPair?.join('') || step.inputChars?.join('') || step.char}
                    </span>
                    <span className="text-slate-600">→</span>
                    <span className="text-white font-semibold">
                      {step.newChar || step.resultPair?.join('') || step.outputChars?.join('') || step.mappedChar || step.resultChar}
                    </span>
                    {step.explanation && (
                      <span className="text-[10px] text-slate-500 truncate max-w-[120px]">
                        {step.explanation}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
