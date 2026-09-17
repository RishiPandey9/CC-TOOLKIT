'use client';

import React, { useState } from 'react';
import {
  KeyRound,
  BarChart3,
  Flame,
  Search,
  Copy,
  Check,
  Play,
  Sparkles
} from 'lucide-react';

import {
  analyzeFrequencies,
  crackMonoWithHillClimbing,
  crackKnownPlaintext,
  CrackCandidate
} from '../lib/crypto/monocracker';
import { crackCaesarChiSquared } from '../lib/crypto/caesar';
import { estimateVigenereKeyLength } from '../lib/crypto/vigenere';

export default function CryptoCracker() {
  const [activeTab, setActiveTab] = useState<'frequency' | 'hillclimb' | 'kpa' | 'auto'>('frequency');
  const [ciphertext, setCiphertext] = useState(
    'GUR DHVPX OEBJA SBK WHZCF BIRE GUR YNML QBT NAQ FRPERG PBQR VAGRY'
  );
  const [knownPlain, setKnownPlain] = useState('THE QUICK BROWN');
  const [maxIter, setMaxIter] = useState(1500);
  const [isCracking, setIsCracking] = useState(false);
  const [candidates, setCandidates] = useState<CrackCandidate[]>([]);
  const [copiedKey, setCopiedKey] = useState<string | null>(null);

  const freqData = React.useMemo(() => {
    return analyzeFrequencies(ciphertext);
  }, [ciphertext]);

  const caesarCandidates = React.useMemo(() => {
    return crackCaesarChiSquared(ciphertext).slice(0, 5);
  }, [ciphertext]);

  const vigenereKeyLengths = React.useMemo(() => {
    return estimateVigenereKeyLength(ciphertext, 10);
  }, [ciphertext]);

  const kpaResult = React.useMemo(() => {
    if (!ciphertext || !knownPlain) return null;
    return crackKnownPlaintext(ciphertext, knownPlain);
  }, [ciphertext, knownPlain]);

  const handleRunHillClimbing = () => {
    if (!ciphertext) return;
    setIsCracking(true);
    setTimeout(() => {
      const results = crackMonoWithHillClimbing(ciphertext, maxIter);
      setCandidates(results);
      setIsCracking(false);
    }, 100);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(id);
    setTimeout(() => setCopiedKey(null), 1800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="border-b border-white/[0.08] pb-6">
        <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
          Cryptanalysis & Cracker
        </h1>
        <p className="text-xs sm:text-sm text-slate-400 mt-1">
          Frequency analysis, Chi-squared (χ²) goodness-of-fit, Kasiski examination, and Simulated Annealing AI solvers.
        </p>
      </div>

      {/* Target Input */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-2">
        <div className="flex items-center justify-between text-xs">
          <span className="font-medium text-slate-300">Target Ciphertext</span>
          <div className="flex gap-2 text-[11px] text-slate-500">
            <button
              onClick={() => setCiphertext('GUR DHVPX OEBJA SBK WHZCF BIRE GUR YNML QBT NAQ FRPERG PBQR VAGRY')}
              className="hover:text-white"
            >
              ROT13 Preset
            </button>
            <span>·</span>
            <button
              onClick={() => setCiphertext('KHOOR ZRUOG WKLV LV D VHFUHW PHVVDJH HQFUBSWHG ZLWK FDHVDU FLSKHU')}
              className="hover:text-white"
            >
              Caesar Preset
            </button>
          </div>
        </div>

        <textarea
          rows={3}
          value={ciphertext}
          onChange={(e) => setCiphertext(e.target.value.toUpperCase())}
          placeholder="Enter ciphertext to analyze..."
          className="w-full rounded-lg border border-white/[0.08] bg-[#090a0f] p-3 text-xs font-mono text-slate-100 uppercase focus:outline-none resize-y"
        />
      </div>

      {/* Tabs */}
      <div className="flex flex-wrap gap-1.5">
        <button
          onClick={() => setActiveTab('frequency')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'frequency'
              ? 'bg-white text-slate-950 font-semibold'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          Frequency Analysis
        </button>
        <button
          onClick={() => setActiveTab('hillclimb')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'hillclimb'
              ? 'bg-white text-slate-950 font-semibold'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          AI Hill Climbing
        </button>
        <button
          onClick={() => setActiveTab('kpa')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'kpa'
              ? 'bg-white text-slate-950 font-semibold'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          Known-Plaintext Attack
        </button>
        <button
          onClick={() => setActiveTab('auto')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            activeTab === 'auto'
              ? 'bg-white text-slate-950 font-semibold'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          Caesar & Vigenère χ²
        </button>
      </div>

      {/* Tab 1: Frequency */}
      {activeTab === 'frequency' && (
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-5 space-y-4">
          <div className="flex justify-between items-center text-xs">
            <span className="font-medium text-slate-300">Letter Frequency Distribution</span>
            <span className="font-mono text-[11px] text-slate-400">
              Sorted: <strong className="text-white">{freqData.sortedByObserved}</strong>
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-7 lg:grid-cols-13 gap-1.5">
            {freqData.frequencies.map((item) => (
              <div
                key={item.char}
                className="flex flex-col items-center rounded-lg border border-white/[0.04] bg-[#090a0f] p-2 text-center"
              >
                <span className="text-xs font-mono font-semibold text-white">{item.char}</span>
                <span className="text-[10px] text-slate-500 font-mono">{item.count}</span>

                <div className="w-full flex items-end justify-center gap-1 h-12 bg-white/[0.02] rounded my-1 p-0.5">
                  <div
                    className="w-2 bg-white rounded-t"
                    style={{ height: `${Math.min(100, item.observedPct * 5)}%` }}
                    title={`Observed: ${item.observedPct}%`}
                  />
                  <div
                    className="w-2 bg-slate-700 rounded-t"
                    style={{ height: `${Math.min(100, item.expectedPct * 5)}%` }}
                    title={`English: ${item.expectedPct}%`}
                  />
                </div>
                <span className="text-[9px] font-mono text-slate-400">{item.observedPct}%</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Tab 2: Hill Climbing */}
      {activeTab === 'hillclimb' && (
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-5 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-white/[0.06] pb-3">
            <span className="text-xs font-medium text-slate-300">Simulated Annealing Optimizer</span>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <span>Iterations:</span>
                <input
                  type="number"
                  min="200"
                  max="5000"
                  step="200"
                  value={maxIter}
                  onChange={(e) => setMaxIter(parseInt(e.target.value, 10) || 1000)}
                  className="w-20 rounded border border-white/[0.1] bg-[#090a0f] px-2 py-1 text-xs font-mono text-white"
                />
              </div>
              <button
                onClick={handleRunHillClimbing}
                disabled={isCracking || !ciphertext}
                className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1 text-xs font-semibold text-slate-950 hover:bg-slate-200 transition-all disabled:opacity-50"
              >
                <Play className="h-3 w-3" />
                <span>{isCracking ? 'Solving...' : 'Solve'}</span>
              </button>
            </div>
          </div>

          {candidates.length > 0 ? (
            <div className="space-y-2">
              {candidates.map((cand, idx) => (
                <div
                  key={idx}
                  className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3 text-xs space-y-1.5"
                >
                  <div className="flex justify-between items-center text-slate-400 font-mono text-[11px]">
                    <span>#{idx + 1} Key: <strong className="text-white">{cand.key}</strong></span>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400">Score: {cand.score}</span>
                      <button
                        onClick={() => handleCopy(cand.decryptedText, `cand-${idx}`)}
                        className="hover:text-white"
                      >
                        {copiedKey === `cand-${idx}` ? 'Copied' : 'Copy'}
                      </button>
                    </div>
                  </div>
                  <div className="font-mono text-slate-200 text-xs break-all bg-white/[0.02] p-2 rounded">
                    {cand.decryptedText}
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 py-6 text-center font-mono">
              Click &quot;Solve&quot; to begin heuristic convergence optimization.
            </p>
          )}
        </div>
      )}

      {/* Tab 3: KPA */}
      {activeTab === 'kpa' && (
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-5 space-y-4">
          <div className="space-y-1.5">
            <label className="text-xs font-medium text-slate-300">Known Plaintext Fragment:</label>
            <input
              type="text"
              value={knownPlain}
              onChange={(e) => setKnownPlain(e.target.value.toUpperCase())}
              placeholder="e.g. THE QUICK BROWN..."
              className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-2 text-xs font-mono uppercase text-white focus:outline-none"
            />
          </div>

          {kpaResult && (
            <div className="space-y-3 font-mono text-xs">
              <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3">
                <span className="text-slate-500 block mb-1">Recovered Partial Key ({kpaResult.mappedCount}/26 chars):</span>
                <span className="text-white font-semibold tracking-widest">{kpaResult.partialKey}</span>
              </div>
              <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3">
                <span className="text-slate-500 block mb-1">Decrypted Stream:</span>
                <span className="text-slate-200 break-all">{kpaResult.decrypted}</span>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Tab 4: Auto Detector */}
      {activeTab === 'auto' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-3">
            <span className="text-xs font-medium text-slate-300 block">Caesar Chi-Squared (χ²) Rankings</span>
            <div className="space-y-1.5">
              {caesarCandidates.map((c, i) => (
                <div key={i} className="rounded-lg border border-white/[0.04] bg-[#090a0f] p-2.5 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Shift <strong className="text-white">{c.shift}</strong></span>
                    <span>χ²: {c.chiSquared.toFixed(2)}</span>
                  </div>
                  <div className="text-slate-300 truncate text-[11px]">{c.decrypted}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-3">
            <span className="text-xs font-medium text-slate-300 block">Vigenère Key Length (IoC)</span>
            <div className="space-y-1.5">
              {vigenereKeyLengths.slice(0, 5).map((v, i) => (
                <div key={i} className="rounded-lg border border-white/[0.04] bg-[#090a0f] p-2.5 text-xs font-mono space-y-1">
                  <div className="flex justify-between text-slate-400 text-[11px]">
                    <span>Length <strong className="text-white">{v.keyLen}</strong></span>
                    <span>IoC: {v.avgIoC.toFixed(4)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
