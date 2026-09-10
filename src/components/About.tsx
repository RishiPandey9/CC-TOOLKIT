"use client";

import { motion } from "framer-motion";
import { personalInfo } from "@/lib/data";
import { At, Check, Crosshair, MapPin, Translate, Clock } from "@phosphor-icons/react";

const reveal = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as const } },
};
const stagger = { hidden: {}, visible: { transition: { staggerChildren: 0.1, delayChildren: 0.1 } } };

export function About() {
  return (
    <section id="about" className="relative overflow-hidden bg-[#f3eee8] py-20 text-[#040403] sm:py-28 md:py-36">
      {/* Subtle grid */}
      <div
        className="absolute inset-0 pointer-events-none opacity-[0.05]"
        style={{
          backgroundImage:
            "linear-gradient(rgba(4,4,3,0.12) 1px, transparent 1px), linear-gradient(90deg, rgba(4,4,3,0.12) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <div className="relative z-10 mx-auto grid max-w-[1400px] grid-cols-1 items-start gap-8 px-4 sm:px-6 md:grid-cols-2 md:px-10 lg:grid-cols-[400px_1fr_290px] lg:gap-14">
        {/* Left: Philosophy Sheet Card */}
        <motion.div
          initial={{ opacity: 0, x: -24 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, ease: [0.23, 1, 0.32, 1] }}
          className="relative h-[340px] sm:h-[400px] md:h-[480px] lg:h-[540px] rounded-[2rem] border border-black/10 bg-black/[0.04] p-2"
        >
          <div className="about-system-sheet relative flex h-full flex-col justify-between overflow-hidden rounded-[1.5rem] bg-[#101010] p-6 sm:p-8 text-white">
            <div className="absolute right-[-18%] top-[8%] h-64 w-64 rounded-full border border-[#69a65b]/30" />
            <div className="absolute right-[-7%] top-[19%] h-40 w-40 rounded-full border border-white/15" />

            <div className="flex items-start justify-between text-[10px] font-mono tracking-[0.2em] text-white/50">
              <span>ABOUT / 02</span>
              <span>RP</span>
            </div>
            <div>
              <p className="mb-3 text-[10px] font-mono tracking-[0.2em] text-[#d63d21]">THE WORKING METHOD</p>
              <p className="text-[clamp(1.85rem,3.5vw,3.6rem)] font-black leading-[0.88] tracking-[-0.07em]">
                CLARITY<br />BEFORE<br />COMPLEXITY<span className="text-[#d63d21]">.</span>
              </p>
            </div>
            <div className="flex items-end justify-between border-t border-white/10 pt-4">
              <div className="flex flex-col gap-1 text-[9px] font-mono tracking-[0.18em] text-white/50">
                <span>01 / ARCHITECT</span>
                <span>02 / EXECUTE</span>
                <span>03 / OPTIMIZE</span>
              </div>
              <span className="flex h-10 w-10 items-center justify-center rounded-full border border-[#d63d21]/60 text-[#d63d21]">
                ↗
              </span>
            </div>
          </div>
        </motion.div>

        {/* Center: Bio Narrative */}
        <motion.div
          variants={stagger}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          className="flex flex-col gap-5 pt-2"
        >
          <motion.p variants={reveal} className="flex items-center gap-3 text-[10px] font-mono tracking-[0.3em] uppercase text-[#d63d21]">
            <span className="h-px w-6 bg-[#d63d21]" />
            ABOUT ME
          </motion.p>

          <motion.h2 variants={reveal} className="text-[clamp(1.85rem,3.2vw,2.75rem)] font-black leading-tight tracking-tighter text-[#040403]">
            TURNING IDEAS INTO<br />
            INTELLIGENT <span className="text-[#69a65b]">DIGITAL PRODUCTS.</span>
          </motion.h2>

          <motion.p variants={reveal} className="text-[#040403]/75 text-[0.95rem] leading-relaxed max-w-[54ch]">
            {personalInfo.about}
          </motion.p>

          <motion.p variants={reveal} className="text-[#040403]/65 text-[0.88rem] leading-relaxed max-w-[54ch]">
            Currently focused on building production-grade Next.js web applications, vector search architectures, and AI agent workflows that deliver measurable business impact.
          </motion.p>

          {/* Signature */}
          <motion.div variants={reveal} className="pt-2">
            <p
              className="text-[#040403]/70 text-2xl font-serif italic"
            >
              {personalInfo.signature}
            </p>
          </motion.div>
        </motion.div>

        {/* Right / Tablet-Bottom: Info Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.23, 1, 0.32, 1] }}
          className="rounded-[1.5rem] border border-black/10 bg-[#fffdfa] p-6 shadow-[0_10px_35px_rgba(0,0,0,0.03)] md:col-span-2 lg:col-span-1"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-1 gap-4">
            {[
              { icon: MapPin, label: "BASED IN", value: personalInfo.location },
              { icon: Check, label: "AVAILABLE FOR", value: personalInfo.availability },
              { icon: At, label: "EMAIL", value: personalInfo.email },
              { icon: Crosshair, label: "FOCUS", value: personalInfo.focus },
              { icon: Translate, label: "LANGUAGES", value: personalInfo.languages },
              { icon: Clock, label: "TIMEZONE", value: personalInfo.timezone },
            ].map(({ icon: Icon, label, value }) => (
              <div key={label} className="flex gap-3 items-start pb-3 border-b border-black/[0.06] last:border-0 last:pb-0">
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-[#69a65b]/10 text-[#69a65b]">
                  <Icon size={16} weight="bold" />
                </span>
                <div className="min-w-0">
                  <p className="text-[9px] font-mono tracking-[0.18em] text-black/55 uppercase mb-0.5">{label}</p>
                  <p className="text-[13px] font-bold text-[#040403] truncate">{value}</p>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

