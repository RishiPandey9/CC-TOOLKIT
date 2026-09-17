'use client';

import React, { useState, useEffect } from 'react';
import {
  Layers,
  Plus,
  Trash2,
  ArrowDown,
  Copy,
  Check,
  Lock,
  Unlock,
  MoveUp,
  MoveDown,
  Clock
} from 'lucide-react';

import {
  executeMultiLayerPipeline,
  CipherLayer,
  SupportedAlgorithm,
  MultiLayerPipelineResult
} from '../lib/crypto/multilayer';

const ALGORITHM_OPTIONS: Array<{ id: SupportedAlgorithm; name: string; defaultKey: string }> = [
  { id: 'caesar', name: 'Caesar', defaultKey: '3' },
  { id: 'vigenere', name: 'Vigenère', defaultKey: 'SECRET' },
  { id: 'playfair', name: 'Playfair', defaultKey: 'MONARCHY' },
  { id: 'railfence', name: 'Rail Fence', defaultKey: '3' },
  { id: 'rowcolumn', name: 'Row-Column', defaultKey: '3142' },
  { id: 'mono', name: 'Monoalphabetic', defaultKey: 'QWERTYUIOPASDFGHJKLZXCVBNM' },
  { id: 'affine', name: 'Affine', defaultKey: '7' },
  { id: 'rot13', name: 'ROT13', defaultKey: '' },
  { id: 'atbash', name: 'Atbash', defaultKey: '' }
];

const PRESETS: Array<{ name: string; description: string; layers: CipherLayer[] }> = [
  {
    name: 'Tri-Cipher Hybrid',
    description: 'Caesar(5) → Vigenère(CIPHER) → Rail Fence(3)',
    layers: [
      { id: '1', algorithm: 'caesar', key: '5' },
      { id: '2', algorithm: 'vigenere', key: 'CIPHER' },
      { id: '3', algorithm: 'railfence', key: '3' }
    ]
  },
  {
    name: 'Transposition Shield',
    description: 'Playfair(BANKING) → Row-Column(3142) → Affine(7, 11)',
    layers: [
      { id: '1', algorithm: 'playfair', key: 'BANKING' },
      { id: '2', algorithm: 'rowcolumn', key: '3142' },
      { id: '3', algorithm: 'affine', key: '7', extraKey: '11' }
    ]
  },
  {
    name: 'Involution Chain',
    description: 'Atbash → Monoalphabetic → ROT13',
    layers: [
      { id: '1', algorithm: 'atbash', key: '' },
      { id: '2', algorithm: 'mono', key: 'QWERTYUIOPASDFGHJKLZXCVBNM' },
      { id: '3', algorithm: 'rot13', key: '' }
    ]
  }
];

export default function MultiLayerPipeline() {
  const [layers, setLayers] = useState<CipherLayer[]>([
    { id: '1', algorithm: 'caesar', key: '3' },
    { id: '2', algorithm: 'vigenere', key: 'SECRET' },
    { id: '3', algorithm: 'railfence', key: '3' }
  ]);
  const [mode, setMode] = useState<'encrypt' | 'decrypt'>('encrypt');
  const [inputText, setInputText] = useState('CONFIDENTIAL INTELLIGENCE DATA PACKET 9482');
  const [pipelineResult, setPipelineResult] = useState<MultiLayerPipelineResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);

  const addLayer = () => {
    const newId = String(Date.now());
    setLayers([...layers, { id: newId, algorithm: 'caesar', key: '3' }]);
  };

  const removeLayer = (id: string) => {
    if (layers.length <= 1) return;
    setLayers(layers.filter((l) => l.id !== id));
  };

  const moveLayer = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= layers.length) return;
    const updated = [...layers];
    const temp = updated[index];
    updated[index] = updated[newIndex];
    updated[newIndex] = temp;
    setLayers(updated);
  };

  const updateLayer = (index: number, updates: Partial<CipherLayer>) => {
    const updated = [...layers];
    updated[index] = { ...updated[index], ...updates };
    setLayers(updated);
  };

  const runPipeline = () => {
    setError(null);
    if (!inputText) {
      setPipelineResult(null);
      return;
    }

    try {
      const res = executeMultiLayerPipeline(inputText, layers, mode);
      setPipelineResult(res);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : String(err);
      setError(msg);
    }
  };

  useEffect(() => {
    runPipeline();
  }, [inputText, layers, mode]);

  const handleCopy = () => {
    if (!pipelineResult?.finalText) return;
    navigator.clipboard.writeText(pipelineResult.finalText);
    setCopied(true);
    setTimeout(() => setCopied(false), 1800);
  };

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            Multi-Layer Pipeline
            <span className="rounded bg-white/[0.06] border border-white/[0.08] px-2 py-0.5 text-xs font-mono font-normal text-slate-400">
              {layers.length} Layers
            </span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Chained cryptographic transformations. Decrypt mode automatically reverses execution hierarchy.
          </p>
        </div>

        {/* Mode Selector */}
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
            <span>Encrypt Pipeline</span>
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
            <span>Decrypt (Reversed)</span>
          </button>
        </div>
      </div>

      {/* Presets */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {PRESETS.map((p, i) => (
          <button
            key={i}
            onClick={() => setLayers(p.layers)}
            className="flex flex-col text-left rounded-xl border border-white/[0.06] bg-[#0e1117] p-3.5 hover:border-white/[0.15] transition-all"
          >
            <span className="text-xs font-medium text-white">{p.name}</span>
            <span className="text-[11px] text-slate-500 font-mono mt-1">{p.description}</span>
          </button>
        ))}
      </div>

      {/* Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column (Layers List & Input) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-3">
            <div className="flex items-center justify-between border-b border-white/[0.06] pb-2.5">
              <span className="text-xs font-medium text-slate-300">Configured Layers</span>
              <button
                onClick={addLayer}
                className="flex items-center gap-1 text-[11px] text-slate-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.08] px-2.5 py-1 rounded-md transition-all"
              >
                <Plus className="h-3 w-3" />
                <span>Add Layer</span>
              </button>
            </div>

            <div className="space-y-2">
              {layers.map((layer, idx) => (
                <div
                  key={layer.id}
                  className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-mono text-slate-400">
                      #{idx + 1} Layer
                    </span>
                    <div className="flex items-center gap-1 text-slate-500">
                      <button
                        onClick={() => moveLayer(idx, 'up')}
                        disabled={idx === 0}
                        className="p-1 hover:text-white disabled:opacity-20"
                      >
                        <MoveUp className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => moveLayer(idx, 'down')}
                        disabled={idx === layers.length - 1}
                        className="p-1 hover:text-white disabled:opacity-20"
                      >
                        <MoveDown className="h-3 w-3" />
                      </button>
                      <button
                        onClick={() => removeLayer(layer.id)}
                        disabled={layers.length <= 1}
                        className="p-1 hover:text-rose-400 disabled:opacity-20 ml-1"
                      >
                        <Trash2 className="h-3 w-3" />
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <select
                      value={layer.algorithm}
                      onChange={(e) => {
                        const newAlgo = e.target.value as SupportedAlgorithm;
                        const defaultKey = ALGORITHM_OPTIONS.find((a) => a.id === newAlgo)?.defaultKey || '';
                        updateLayer(idx, { algorithm: newAlgo, key: defaultKey });
                      }}
                      className="rounded-md border border-white/[0.08] bg-[#0e1117] px-2.5 py-1 text-xs text-white focus:outline-none"
                    >
                      {ALGORITHM_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>{opt.name}</option>
                      ))}
                    </select>

                    {layer.algorithm !== 'rot13' && layer.algorithm !== 'atbash' ? (
                      <input
                        type="text"
                        value={layer.key}
                        onChange={(e) => updateLayer(idx, { key: e.target.value })}
                        placeholder="Key..."
                        className="rounded-md border border-white/[0.08] bg-[#0e1117] px-2.5 py-1 text-xs font-mono text-white focus:outline-none"
                      />
                    ) : (
                      <span className="text-[11px] font-mono text-slate-500 flex items-center px-2">No key required</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-2">
            <span className="text-xs font-medium text-slate-300 block">Input Message</span>
            <textarea
              rows={3}
              value={inputText}
              onChange={(e) => setInputText(e.target.value)}
              placeholder="Enter message for pipeline..."
              className="w-full rounded-lg border border-white/[0.08] bg-[#090a0f] p-3 text-xs font-mono text-slate-100 focus:outline-none resize-y"
            />
          </div>
        </div>

        {/* Right Column (Output & Intermediate Stream) */}
        <div className="lg:col-span-6 space-y-4">
          <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="font-medium text-slate-300">Pipeline Result</span>
              <button
                onClick={handleCopy}
                disabled={!pipelineResult?.finalText}
                className="flex items-center gap-1 text-[11px] text-slate-400 hover:text-white disabled:opacity-30"
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
                value={pipelineResult?.finalText || ''}
                placeholder="Results appear here..."
                className="w-full rounded-lg border border-white/[0.06] bg-[#07090d] p-3 text-xs font-mono text-slate-200 focus:outline-none resize-y"
              />
            )}
          </div>

          {/* Step Log */}
          <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-3">
            <span className="text-xs font-medium text-slate-300 block">Step Breakdown</span>
            {pipelineResult?.logs && pipelineResult.logs.length > 0 ? (
              <div className="space-y-2">
                {pipelineResult.logs.map((log, index) => (
                  <div key={index} className="space-y-1.5">
                    <div className="rounded-lg border border-white/[0.06] bg-[#090a0f] p-3 text-xs space-y-1 font-mono">
                      <div className="flex justify-between text-slate-400 text-[11px]">
                        <span>Stage {log.layerIndex}: <strong className="text-white uppercase">{log.algorithm}</strong></span>
                        <span className="text-slate-500">{log.durationMs}ms</span>
                      </div>
                      <div className="text-slate-300 text-xs break-all bg-white/[0.02] p-2 rounded">
                        {log.outputText}
                      </div>
                    </div>
                    {index < pipelineResult.logs.length - 1 && (
                      <div className="flex justify-center text-slate-700">
                        <ArrowDown className="h-3.5 w-3.5" />
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-xs text-slate-500 py-4 text-center font-mono">
                Enter text above to preview pipeline transformations.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
