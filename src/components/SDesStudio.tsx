'use client';

import React, { useState, useEffect } from 'react';
import {
  Binary,
  Key,
  Wand2,
  Lock,
  Unlock,
  Copy,
  Check,
  Cpu
} from 'lucide-react';

import {
  sdesEncryptBlock,
  sdesDecryptBlock,
  generateRandomSDesKey,
  sdesEncryptText,
  sdesDecryptText,
  SDesAuditTrace
} from '../lib/crypto/sdes';

export default function SDesStudio() {
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputType, setInputType] = useState<'block' | 'text'>('block');
  const [key, setKey] = useState('1010000010');
  const [inputBlock, setInputBlock] = useState('10101010');
  const [inputText, setInputText] = useState('Security 2026');
  const [resultBlock, setResultBlock] = useState('');
  const [resultText, setResultText] = useState({ binary: '', hex: '', text: '' });
  const [trace, setTrace] = useState<SDesAuditTrace | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

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

  const handleGenerateKey = () => {
    setKey(generateRandomSDesKey());
  };

  const processSDes = () => {
    setError(null);
    try {
      if (inputType === 'block') {
        if (mode === 'encrypt') {
          const res = sdesEncryptBlock(inputBlock, key);
          setResultBlock(res.ciphertext);
          setTrace(res.trace);
        } else {
          const res = sdesDecryptBlock(inputBlock, key);
          setResultBlock(res.plaintext);
          setTrace(res.trace);
        }
      } else {
        if (mode === 'encrypt') {
          const res = sdesEncryptText(inputText, key);
          setResultText({ binary: res.binaryOutput, hex: res.hexOutput, text: '' });
        } else {
          const restored = sdesDecryptText(inputText, key);
          setResultText({ binary: inputText, hex: '', text: restored });
        }
      }
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    }
  };

  useEffect(() => {
    processSDes();
  }, [mode, inputType, key, inputBlock, inputText]);

  const handleCopy = (textToCopy: string) => {
    navigator.clipboard.writeText(textToCopy);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            Simplified DES (S-DES)
            <span className="rounded bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 text-xs font-mono font-normal text-slate-400">
              Feistel Architecture
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            2-round symmetric block cipher with 10-bit key scheduling, non-linear S-Boxes, and permutations.
          </p>
        </div>

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

      {/* Mode Buttons */}
      <div className="flex gap-2">
        <button
          onClick={() => setInputType('block')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            inputType === 'block'
              ? 'bg-white text-slate-950 font-semibold shadow-sm'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          8-Bit Block Trace
        </button>
        <button
          onClick={() => setInputType('text')}
          className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
            inputType === 'text'
              ? 'bg-white text-slate-950 font-semibold shadow-sm'
              : 'bg-white/[0.03] text-slate-400 hover:text-white border border-white/[0.06]'
          }`}
        >
          Multi-Block ASCII (ECB)
        </button>
      </div>

      {/* Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-medium text-slate-300">10-Bit Key Schedule</span>
              <button
                onClick={handleGenerateKey}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                <Wand2 className="h-3 w-3" />
                <span>Random</span>
              </button>
            </div>

            <input
              type="text"
              maxLength={10}
              value={key}
              onChange={(e) => setKey(e.target.value.replace(/[^01]/g, ''))}
              placeholder="10 bits (e.g. 1010000010)..."
              className="w-full rounded-lg border border-white/[0.1] bg-[#090a0f] px-3 py-2 text-xs font-mono tracking-widest text-white focus:outline-none"
            />

            {trace?.keySchedule && (
              <div className="grid grid-cols-2 gap-2 text-xs font-mono pt-1">
                <div className="p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.06]">
                  <span className="text-[10px] text-slate-500 uppercase block">K1 (8 bits)</span>
                  <span className="text-white font-semibold">{trace.keySchedule.K1}</span>
                </div>
                <div className="p-2.5 rounded-lg bg-[#090a0f] border border-white/[0.06]">
                  <span className="text-[10px] text-slate-500 uppercase block">K2 (8 bits)</span>
                  <span className="text-white font-semibold">{trace.keySchedule.K2}</span>
                </div>
              </div>
            )}
          </div>

          {inputType === 'block' ? (
            <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-2">
              <div className="flex justify-between text-xs">
                <span className="font-medium text-slate-300">
                  {mode === 'encrypt' ? '8-Bit Plaintext' : '8-Bit Ciphertext'}
                </span>
                <span className="font-mono text-[11px] text-slate-500">{inputBlock.length}/8 bits</span>
              </div>
              <input
                type="text"
                maxLength={8}
                value={inputBlock}
                onChange={(e) => setInputBlock(e.target.value.replace(/[^01]/g, ''))}
                placeholder="8 bits (e.g. 10101010)..."
                className="w-full rounded-lg border border-white/[0.08] bg-[#090a0f] px-3 py-2 text-xs font-mono tracking-widest text-white focus:outline-none"
              />
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-2">
              <span className="text-xs font-medium text-slate-300 block">
                {mode === 'encrypt' ? 'Text String' : 'Binary Ciphertext'}
              </span>
              <textarea
                rows={3}
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Enter string..."
                className="w-full rounded-lg border border-white/[0.08] bg-[#090a0f] p-3 text-xs font-mono text-slate-100 focus:outline-none resize-y"
              />
            </div>
          )}

          {/* Output Card */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">
                {mode === 'encrypt' ? 'Ciphertext Output' : 'Plaintext Output'}
              </span>
              <button
                onClick={() =>
                  handleCopy(inputType === 'block' ? resultBlock : mode === 'encrypt' ? resultText.binary : resultText.text)
                }
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white"
              >
                {copied ? <Check className="h-3 w-3 text-emerald-400" /> : <Copy className="h-3 w-3" />}
                <span>{copied ? 'Copied' : 'Copy'}</span>
              </button>
            </div>

            {error ? (
              <div className="rounded-lg border border-rose-500/20 bg-rose-950/20 p-3 text-xs font-mono text-rose-400">
                {error}
              </div>
            ) : inputType === 'block' ? (
              <div className="rounded-lg border border-white/[0.06] bg-[#07090d] p-3 font-mono text-sm tracking-widest font-semibold text-white">
                {resultBlock || '...'}
              </div>
            ) : (
              <div className="space-y-1.5 font-mono text-xs">
                <div className="p-2.5 rounded bg-[#07090d] border border-white/[0.06] text-slate-300 break-all">
                  {resultText.binary}
                </div>
                {resultText.hex && (
                  <div className="p-2 rounded bg-[#07090d] text-slate-400 text-[11px]">
                    Hex: 0x{resultText.hex}
                  </div>
                )}
                {resultText.text && (
                  <div className="p-2 rounded bg-[#07090d] text-emerald-400 text-xs">
                    Text: {resultText.text}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Right Column (Round Trace & S-Boxes) */}
        <div className="lg:col-span-6 space-y-4">
          {trace && inputType === 'block' ? (
            <div className="space-y-4">
              <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-3 font-mono text-xs">
                <span className="font-medium text-slate-300 block">Round Trace</span>
                <div className="space-y-1.5 text-slate-400 text-[11px]">
                  <div className="flex justify-between p-2 rounded bg-[#090a0f] border border-white/[0.04]">
                    <span>Initial Permutation (IP):</span>
                    <span className="text-white">{trace.afterIP}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-[#090a0f] border border-white/[0.04]">
                    <span>Round 1 Output:</span>
                    <span className="text-white">{trace.round1.newLeft} | {trace.round1.newRight}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-[#090a0f] border border-white/[0.04]">
                    <span>After Feistel Swap:</span>
                    <span className="text-white">{trace.afterSwap.left} | {trace.afterSwap.right}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-[#090a0f] border border-white/[0.04]">
                    <span>Round 2 Output:</span>
                    <span className="text-white">{trace.round2.newLeft} | {trace.round2.newRight}</span>
                  </div>
                  <div className="flex justify-between p-2 rounded bg-[#090a0f] border border-white/[0.04]">
                    <span>Inverse IP (Final):</span>
                    <span className="text-white font-semibold">{trace.finalOutput}</span>
                  </div>
                </div>
              </div>

              {/* S-Box Coordinates */}
              <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-3">
                <span className="text-xs font-medium text-slate-300 block">S-Box Lookups (Round 1)</span>
                <div className="grid grid-cols-2 gap-3 text-xs font-mono">
                  <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.06] space-y-2">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>S0</span>
                      <span className="text-white">r:{trace.round1.s0Row}, c:{trace.round1.s0Col}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {S0.map((row, r) =>
                        row.map((val, c) => (
                          <div
                            key={`${r}-${c}`}
                            className={`p-1 text-center rounded text-[10px] ${
                              r === trace.round1.s0Row && c === trace.round1.s0Col
                                ? 'bg-white text-slate-950 font-bold'
                                : 'bg-white/[0.03] text-slate-500'
                            }`}
                          >
                            {val}
                          </div>
                        ))
                      )}
                    </div>
                  </div>

                  <div className="p-3 rounded-lg bg-[#090a0f] border border-white/[0.06] space-y-2">
                    <div className="flex justify-between text-slate-400 text-[11px]">
                      <span>S1</span>
                      <span className="text-white">r:{trace.round1.s1Row}, c:{trace.round1.s1Col}</span>
                    </div>
                    <div className="grid grid-cols-4 gap-1">
                      {S1.map((row, r) =>
                        row.map((val, c) => (
                          <div
                            key={`${r}-${c}`}
                            className={`p-1 text-center rounded text-[10px] ${
                              r === trace.round1.s1Row && c === trace.round1.s1Col
                                ? 'bg-white text-slate-950 font-bold'
                                : 'bg-white/[0.03] text-slate-500'
                            }`}
                          >
                            {val}
                          </div>
                        ))
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-8 text-center text-slate-500 text-xs font-mono">
              Multi-Block ASCII mode processes each 8-bit character through S-DES.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
