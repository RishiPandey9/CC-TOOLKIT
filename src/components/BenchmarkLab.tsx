'use client';

import React, { useState, useEffect } from 'react';
import {
  Activity,
  Play,
  Zap,
  Clock,
  CheckCircle2
} from 'lucide-react';

import { runFullCryptoBenchmark, BenchmarkItemResult } from '../lib/dsa/benchmark-engine';

export default function BenchmarkLab() {
  const [isRunning, setIsRunning] = useState(false);
  const [results, setResults] = useState<BenchmarkItemResult[]>([]);
  const [lastRunTime, setLastRunTime] = useState<string | null>(null);

  const startBenchmark = () => {
    setIsRunning(true);
    setTimeout(() => {
      const benchResults = runFullCryptoBenchmark();
      setResults(benchResults);
      setLastRunTime(new Date().toLocaleTimeString());
      setIsRunning(false);
    }, 150);
  };

  useEffect(() => {
    startBenchmark();
  }, []);

  const maxOps = results.length > 0 ? Math.max(...results.map((r) => r.operationsPerSecond)) : 1;

  return (
    <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6">
        <div>
          <h1 className="text-xl sm:text-2xl font-semibold tracking-tight text-white flex items-center gap-2">
            Performance Benchmark Lab
          </h1>
          <p className="text-xs sm:text-sm text-slate-400 mt-1">
            Empirical hardware execution throughput and latency profiling across all ciphers and DSA engines.
          </p>
        </div>

        <button
          onClick={startBenchmark}
          disabled={isRunning}
          className="flex items-center gap-1.5 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-slate-950 hover:bg-slate-200 transition-all disabled:opacity-50"
        >
          <Play className={`h-3.5 w-3.5 ${isRunning ? 'animate-spin' : ''}`} />
          <span>{isRunning ? 'Benchmarking...' : 'Run Benchmark'}</span>
        </button>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-1">
          <span className="text-[11px] text-slate-500 block uppercase font-mono">Max Throughput</span>
          <p className="text-lg font-mono font-semibold text-white">
            {results.length > 0 ? `${maxOps.toLocaleString()} ops/s` : '...'}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-1">
          <span className="text-[11px] text-slate-500 block uppercase font-mono">Avg Latency</span>
          <p className="text-lg font-mono font-semibold text-white">
            {results.length > 0
              ? `${(
                  results.reduce((acc, r) => acc + r.avgLatencyMs, 0) / results.length
                ).toFixed(3)} ms`
              : '...'}
          </p>
        </div>

        <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-4 space-y-1">
          <span className="text-[11px] text-slate-500 block uppercase font-mono">Algorithms Tested</span>
          <p className="text-lg font-mono font-semibold text-white">{results.length} Engines</p>
        </div>
      </div>

      {/* Results Table */}
      <div className="rounded-xl border border-white/[0.08] bg-[#0e1117] p-5 space-y-3">
        <div className="space-y-2">
          {results.map((item, idx) => {
            const barWidth = Math.max(3, (item.operationsPerSecond / maxOps) * 100);
            return (
              <div
                key={idx}
                className="rounded-lg border border-white/[0.04] bg-[#090a0f] p-3 space-y-1.5"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-medium text-slate-200">{item.name}</span>
                    <span className="rounded bg-white/[0.04] px-1.5 py-0.5 text-[10px] font-mono text-slate-500">
                      {item.category}
                    </span>
                  </div>
                  <div className="flex items-center gap-3 font-mono text-[11px]">
                    <span className="text-white font-semibold">
                      {item.operationsPerSecond.toLocaleString()} ops/s
                    </span>
                    <span className="text-slate-500">{item.avgLatencyMs} ms</span>
                    <span className="text-slate-500">{item.timeComplexity}</span>
                  </div>
                </div>

                <div className="h-1.5 w-full rounded-full bg-white/[0.04] overflow-hidden">
                  <div
                    className="h-full bg-white rounded-full transition-all duration-300"
                    style={{ width: `${barWidth}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
