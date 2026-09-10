"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { soundManager } from "@/lib/useSoundFx";

const LOGS = [
  "SYSTEM_BOOT // Initializing Next.js 16 core...",
  "AI_ENGINE // Loading vector search pipeline...",
  "FULL_STACK // Indexing schema models & API routes...",
  "SYSTEM_READY // Initializing interface viewports...",
];

export function Preloader({ onComplete }: { onComplete: () => void }) {
  const [progress, setProgress] = useState(0);
  const [currentLog, setCurrentLog] = useState(LOGS[0]);
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    let current = 0;
    const interval = setInterval(() => {
      // Accelerate towards 100%
      const increment = Math.floor(Math.random() * 8) + 3;
      current += increment;

      if (current >= 100) {
        current = 100;
        setProgress(100);
        setCurrentLog(LOGS[3]);
        clearInterval(interval);
        soundManager.playBeep(980, 0.12, "sine", 0.08);

        setTimeout(() => {
          setIsFinished(true);
          setTimeout(() => {
            onComplete();
          }, 800);
        }, 300);
      } else {
        setProgress(current);
        if (current > 75) {
          setCurrentLog(LOGS[2]);
        } else if (current > 35) {
          setCurrentLog(LOGS[1]);
        }
      }
    }, 45);

    const handleSkip = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === "Enter") {
        clearInterval(interval);
        setProgress(100);
        setIsFinished(true);
        setTimeout(onComplete, 400);
      }
    };
    window.addEventListener("keydown", handleSkip);

    return () => {
      clearInterval(interval);
      window.removeEventListener("keydown", handleSkip);
    };
  }, [onComplete]);

  return (
    <AnimatePresence>
      {!isFinished && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{
            y: "-100%",
            transition: { duration: 0.85, ease: [0.77, 0, 0.175, 1] },
          }}
          className="fixed inset-0 z-[9999] flex flex-col justify-between bg-[#040403] px-6 py-10 text-[#f3eee8] sm:px-12 md:py-14 select-none"
        >
          {/* Top Diagnostics Header */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4 text-[10px] font-mono tracking-[0.25em] text-white/50 uppercase">
            <div className="flex items-center gap-2">
              <span className="h-2 w-2 rounded-full bg-[#69a65b] animate-ping" />
              <span>BOOT_SEQUENCE_V2.6</span>
            </div>
            <span className="hidden sm:inline text-[#69a65b]">RISHI PANDEY · PORTFOLIO</span>
            <button
              onClick={() => {
                setProgress(100);
                setIsFinished(true);
                setTimeout(onComplete, 400);
              }}
              className="text-[9px] font-mono tracking-widest text-white/60 hover:text-[#69a65b] transition-colors uppercase border border-white/10 px-2 py-1 rounded"
            >
              SKIP [ESC] ↗
            </button>
          </div>

          {/* Center Large Kinetic Number */}
          <div className="my-auto flex flex-col items-center justify-center text-center">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative flex items-baseline font-mono font-black tracking-[-0.08em] text-[clamp(4.5rem,18vw,14rem)] leading-none text-white"
            >
              <span>{progress.toString().padStart(3, "0")}</span>
              <span className="text-2xl sm:text-4xl text-[#69a65b] font-bold tracking-normal ml-2">
                %
              </span>
            </motion.div>

            {/* Monospace Live Diagnostic Terminal Line */}
            <div className="mt-6 flex items-center gap-3 rounded-full border border-white/10 bg-white/[0.03] px-4 py-2 text-[10px] sm:text-[11px] font-mono tracking-wider text-white/75">
              <span className="text-[#69a65b] font-bold">&gt;</span>
              <span className="animate-pulse">{currentLog}</span>
            </div>
          </div>

          {/* Bottom Progress Bar */}
          <div className="space-y-3">
            <div className="relative h-1 w-full overflow-hidden rounded-full bg-white/10">
              <motion.div
                className="absolute inset-y-0 left-0 bg-gradient-to-r from-[#69a65b]/50 via-[#69a65b] to-[#a0e492] shadow-[0_0_15px_rgba(105,166,91,0.8)]"
                style={{ width: `${progress}%` }}
                transition={{ ease: "easeOut" }}
              />
            </div>
            <div className="flex items-center justify-between text-[9px] font-mono tracking-[0.2em] text-white/40 uppercase">
              <span>INITIALIZING SYSTEM ASSETS</span>
              <span>IST {new Date().toLocaleTimeString()}</span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
