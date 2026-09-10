"use client";

import { useSoundFx } from "@/lib/useSoundFx";
import { SpeakerHigh, SpeakerSlash } from "@phosphor-icons/react";
import { motion } from "framer-motion";

export function SoundToggle() {
  const { enabled, toggleSound } = useSoundFx();

  return (
    <button
      onClick={toggleSound}
      aria-label={enabled ? "Mute audio sound effects" : "Enable cyber audio sound effects"}
      className="flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-mono text-white/70 transition-all duration-200 hover:border-[#69a65b]/50 hover:bg-white/[0.08] hover:text-white active:scale-95"
    >
      {enabled ? (
        <SpeakerHigh size={15} weight="bold" className="text-[#69a65b]" />
      ) : (
        <SpeakerSlash size={15} weight="bold" className="text-white/40" />
      )}

      {/* Animated Equalizer Bars */}
      <div className="flex items-end gap-0.5 h-3">
        {[1, 2, 3].map((bar) => (
          <motion.span
            key={bar}
            className={`w-0.5 rounded-full ${enabled ? "bg-[#69a65b]" : "bg-white/20"}`}
            animate={
              enabled
                ? { height: ["20%", "100%", "40%", "80%", "20%"] }
                : { height: "25%" }
            }
            transition={
              enabled
                ? {
                    duration: 0.8 + bar * 0.2,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }
                : undefined
            }
          />
        ))}
      </div>
      <span className="hidden xl:inline text-[9px] uppercase tracking-wider text-white/40">
        {enabled ? "AUDIO ON" : "AUDIO OFF"}
      </span>
    </button>
  );
}
