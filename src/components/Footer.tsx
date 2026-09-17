import React from 'react';
import Link from 'next/link';
import { Shield } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="border-t border-white/[0.08] bg-[#090a0f] text-slate-400 py-8">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 text-xs">
          <div className="flex items-center gap-2">
            <Shield className="h-4 w-4 text-cyan-400" />
            <span className="font-semibold text-white">
              CC<span className="font-mono text-cyan-400">TOOLKIT</span>
            </span>
            <span className="text-slate-600">·</span>
            <span className="text-slate-500">Classical & Modern Cryptography Studio</span>
          </div>

          <div className="flex items-center gap-4 text-slate-500">
            <Link href="/" className="hover:text-slate-300 transition-colors">Studio</Link>
            <Link href="/pipeline" className="hover:text-slate-300 transition-colors">Pipeline</Link>
            <Link href="/sdes" className="hover:text-slate-300 transition-colors">S-DES</Link>
            <Link href="/cracker" className="hover:text-slate-300 transition-colors">Cracker</Link>
            <Link href="/dsa" className="hover:text-slate-300 transition-colors">DSA</Link>
            <Link href="/benchmark" className="hover:text-slate-300 transition-colors">Benchmark</Link>
            <a
              href="https://github.com/RishiPandey9/CC-TOOLKIT.git"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-white transition-colors"
            >
              GitHub
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
