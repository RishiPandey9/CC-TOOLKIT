'use client';

import React, { useState } from 'react';
import {
  Cpu,
  Table as TableIcon,
  Search,
  BookOpen,
  Plus
} from 'lucide-react';

import { extendedGcd, isCoprime } from '../lib/dsa/extended-gcd';
import { det2x2, inverse2x2, Matrix2x2 } from '../lib/dsa/matrix-math';
import { Trie } from '../lib/dsa/trie';

export default function DsaLibrary() {
  const [activeTab, setActiveTab] = useState<'gcd' | 'matrix' | 'trie' | 'bigo'>('gcd');

  const [gcdA, setGcdA] = useState(240);
  const [gcdB, setGcdB] = useState(46);
  const gcdResult = React.useMemo(() => {
    return extendedGcd(gcdA, gcdB);
  }, [gcdA, gcdB]);

  const [matA, setMatA] = useState('3 3 2 5');
  const matrixResult = React.useMemo(() => {
    const nums = matA.split(/[\s,]+/).map((n) => parseInt(n, 10) || 0);
    const m: Matrix2x2 = [
      [nums[0] || 0, nums[1] || 0],
      [nums[2] || 0, nums[3] || 0]
    ];
    const det = det2x2(m, 26);
    const inv = inverse2x2(m, 26);
    return { matrix: m, det, inv, coprime: isCoprime(det, 26) };
  }, [matA]);

  const [trieWords, setTrieWords] = useState<string[]>(['CIPHER', 'CRYPTO', 'CODE', 'SECRET', 'MATRIX']);
  const [searchQuery, setSearchQuery] = useState('CIPH');
  const [newWord, setNewWord] = useState('');

  const trieInstance = React.useMemo(() => {
    const t = new Trie();
    for (const w of trieWords) {
      t.insert(w);
    }
    return t;
  }, [trieWords]);

  const handleAddWord = () => {
    if (!newWord.trim()) return;
    setTrieWords([...trieWords, newWord.trim().toUpperCase()]);
    setNewWord('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
          DSA & Mathematical Lab
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Extended Euclidean Algorithm, Modular Matrix Inversion mod 26, Prefix Trees, and Asymptotic Complexity.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTab('gcd')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'gcd'
              ? 'bg-white text-slate-950 font-semibold'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          Extended Euclidean GCD
        </button>
        <button
          onClick={() => setActiveTab('matrix')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'matrix'
              ? 'bg-white text-slate-950 font-semibold'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          Matrix Inversion mod 26
        </button>
        <button
          onClick={() => setActiveTab('trie')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'trie'
              ? 'bg-white text-slate-950 font-semibold'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          Trie (Prefix Tree)
        </button>
        <button
          onClick={() => setActiveTab('bigo')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'bigo'
              ? 'bg-white text-slate-950 font-semibold'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          Big-O Reference
        </button>
      </div>

      {/* Tab 1: Extended GCD */}
      {activeTab === 'gcd' && (
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-5 space-y-4">
          <div className="grid grid-cols-2 gap-3 max-w-xs">
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Value A:</label>
              <input
                type="number"
                value={gcdA}
                onChange={(e) => setGcdA(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-md border border-white/[0.1] bg-[#090a0f] px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
              />
            </div>
            <div>
              <label className="text-[11px] text-slate-400 block mb-1">Value B:</label>
              <input
                type="number"
                value={gcdB}
                onChange={(e) => setGcdB(parseInt(e.target.value, 10) || 0)}
                className="w-full rounded-md border border-white/[0.1] bg-[#090a0f] px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
              />
            </div>
          </div>

          <div className="grid grid-cols-3 gap-3 font-mono text-xs max-w-md">
            <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.06]">
              <span className="text-slate-500 text-[10px] block">GCD</span>
              <span className="text-white font-bold text-base">{gcdResult.gcd}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.06]">
              <span className="text-slate-500 text-[10px] block">Bézout X</span>
              <span className="text-white font-bold text-base">{gcdResult.x}</span>
            </div>
            <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.06]">
              <span className="text-slate-500 text-[10px] block">Bézout Y</span>
              <span className="text-white font-bold text-base">{gcdResult.y}</span>
            </div>
          </div>

          <div className="space-y-1.5 font-mono text-xs max-w-lg">
            <span className="text-slate-400 text-[11px] block">Division Steps:</span>
            {gcdResult.steps.map((s) => (
              <div key={s.step} className="flex justify-between p-2 rounded bg-[#090a0f] border border-white/[0.04]">
                <span className="text-slate-500">Step {s.step}</span>
                <span className="text-slate-300">
                  {s.a} = {s.quotient} × {s.b} + <strong className="text-white">{s.remainder}</strong>
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Matrix */}
      {activeTab === 'matrix' && (
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-5 space-y-4">
          <div className="space-y-1 max-w-xs">
            <label className="text-xs text-slate-400">2x2 Matrix Entries:</label>
            <input
              type="text"
              value={matA}
              onChange={(e) => setMatA(e.target.value)}
              className="w-full rounded-md border border-white/[0.1] bg-[#090a0f] px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          <div className="grid grid-cols-2 gap-4 max-w-sm">
            <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.06] space-y-2">
              <span className="text-xs font-medium text-slate-400 block">Matrix M</span>
              <div className="grid grid-cols-2 gap-1 font-mono text-xs text-center">
                {matrixResult.matrix.map((row, r) =>
                  row.map((val, c) => (
                    <div key={`${r}-${c}`} className="p-1.5 rounded bg-white/[0.04] text-white">
                      {val}
                    </div>
                  ))
                )}
              </div>
              <span className="text-[11px] font-mono text-slate-500 block text-center">
                det = {matrixResult.det} ({matrixResult.coprime ? 'coprime' : 'singular'})
              </span>
            </div>

            <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.06] space-y-2">
              <span className="text-xs font-medium text-slate-400 block">Inverse M⁻¹ mod 26</span>
              {matrixResult.inv ? (
                <div className="grid grid-cols-2 gap-1 font-mono text-xs text-center">
                  {matrixResult.inv.map((row, r) =>
                    row.map((val, c) => (
                      <div key={`${r}-${c}`} className="p-1.5 rounded bg-white/[0.04] text-emerald-400 font-semibold">
                        {val}
                      </div>
                    ))
                  )}
                </div>
              ) : (
                <span className="text-rose-400 text-xs font-mono block text-center py-3">
                  Not invertible
                </span>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Tab 3: Trie */}
      {activeTab === 'trie' && (
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-5 space-y-4">
          <div className="flex gap-2 max-w-md">
            <input
              type="text"
              value={newWord}
              onChange={(e) => setNewWord(e.target.value.toUpperCase())}
              placeholder="Insert word..."
              className="flex-1 rounded-md border border-white/[0.1] bg-[#090a0f] px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
            />
            <button
              onClick={handleAddWord}
              className="px-3 py-1 rounded-md bg-white text-slate-950 text-xs font-semibold hover:bg-slate-200"
            >
              Insert
            </button>
          </div>

          <div className="max-w-md">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
              placeholder="Query prefix or word..."
              className="w-full rounded-md border border-white/[0.1] bg-[#090a0f] px-2.5 py-1.5 text-xs font-mono text-white focus:outline-none"
            />
          </div>

          <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.06] max-w-md text-xs font-mono space-y-1">
            <div className="flex justify-between">
              <span className="text-slate-500">Exact Word Match:</span>
              <span className={trieInstance.search(searchQuery) ? 'text-emerald-400' : 'text-slate-500'}>
                {trieInstance.search(searchQuery) ? 'TRUE' : 'FALSE'}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-500">Prefix Match:</span>
              <span className={trieInstance.startsWith(searchQuery) ? 'text-cyan-400' : 'text-slate-500'}>
                {trieInstance.startsWith(searchQuery) ? 'TRUE' : 'FALSE'}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Big-O Matrix */}
      {activeTab === 'bigo' && (
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-5">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead className="border-b border-white/[0.08] text-slate-500">
                <tr>
                  <th className="py-2 px-3">Algorithm</th>
                  <th className="py-2 px-3">Category</th>
                  <th className="py-2 px-3">Time (Encrypt)</th>
                  <th className="py-2 px-3">Time (Decrypt)</th>
                  <th className="py-2 px-3">Space</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/[0.04] text-slate-300">
                <tr>
                  <td className="py-2 px-3 text-white font-medium">Caesar</td>
                  <td className="py-2 px-3 text-slate-500">Substitution</td>
                  <td className="py-2 px-3">O(N)</td>
                  <td className="py-2 px-3">O(N)</td>
                  <td className="py-2 px-3 text-slate-500">O(1)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-white font-medium">Monoalphabetic</td>
                  <td className="py-2 px-3 text-slate-500">Permutation</td>
                  <td className="py-2 px-3">O(N)</td>
                  <td className="py-2 px-3">O(N)</td>
                  <td className="py-2 px-3 text-slate-500">O(1)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-white font-medium">Playfair</td>
                  <td className="py-2 px-3 text-slate-500">Digraph</td>
                  <td className="py-2 px-3">O(N)</td>
                  <td className="py-2 px-3">O(N)</td>
                  <td className="py-2 px-3 text-slate-500">O(1)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-white font-medium">Hill (M×M)</td>
                  <td className="py-2 px-3 text-slate-500">Linear Algebra</td>
                  <td className="py-2 px-3">O(N·M²)</td>
                  <td className="py-2 px-3">O(M³ + N·M²)</td>
                  <td className="py-2 px-3 text-slate-500">O(M²)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-white font-medium">Simplified DES</td>
                  <td className="py-2 px-3 text-slate-500">Block</td>
                  <td className="py-2 px-3">O(B · R)</td>
                  <td className="py-2 px-3">O(B · R)</td>
                  <td className="py-2 px-3 text-slate-500">O(1)</td>
                </tr>
                <tr>
                  <td className="py-2 px-3 text-white font-medium">Trie Prefix Tree</td>
                  <td className="py-2 px-3 text-slate-500">Structure</td>
                  <td className="py-2 px-3">O(L)</td>
                  <td className="py-2 px-3">O(L)</td>
                  <td className="py-2 px-3 text-slate-500">O(Σ·V)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
