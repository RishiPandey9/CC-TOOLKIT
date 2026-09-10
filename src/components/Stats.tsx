"use client";

import { motion } from "framer-motion";

const card = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] as const } },
};

const PILLAR_COLORS: Record<string, string> = {
  "Full-Stack": "bg-[#69a65b]",
  "Applied AI": "bg-[#e5d3c9]",
  "System Architecture": "bg-[#d63d21]",
};

export function Stats() {
  return (
    <section className="relative overflow-hidden bg-[#040403] py-20 text-foreground sm:py-28 md:py-36">
      {/* Subtle top border accent */}
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#69a65b]/35 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="mb-12 sm:mb-16 flex flex-col sm:flex-row sm:items-end gap-3 sm:gap-5"
        >
          <div>
            <p className="mb-2 flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#d63d21]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d63d21]" />
              ENGINEERING IMPACT
            </p>
            <h2 className="text-[clamp(2.4rem,5.5vw,5rem)] font-black leading-[0.84] tracking-[-0.07em] text-white">
              BY THE NUMBERS<span className="text-[#69a65b]">.</span>
            </h2>
          </div>
        </motion.div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-60px" }}
          transition={{ staggerChildren: 0.1 }}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 sm:gap-5"
        >
          {/* Card 1: Projects Shipped */}
          <motion.div variants={card} className="min-h-[240px] rounded-[1.5rem] border border-white/[0.12] bg-[#101010] p-6 sm:p-7 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase mb-1">Production Delivery</p>
              <p className="text-4xl font-black text-white tracking-tighter">10+</p>
              <p className="text-[12px] text-white/65 mt-1 font-medium">Projects Shipped Live</p>
            </div>
            {/* Sparkline chart */}
            <div className="pt-4">
              <svg viewBox="0 0 120 32" className="w-full h-8" preserveAspectRatio="none">
                <polyline
                  points="0,30 20,24 40,18 55,22 70,12 90,6 120,2"
                  fill="none"
                  stroke="#69a65b"
                  strokeWidth="2.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <circle cx="120" cy="2" r="3.5" fill="#69a65b" />
              </svg>
            </div>
          </motion.div>

          {/* Card 2: Core Pillars */}
          <motion.div variants={card} className="min-h-[240px] rounded-[1.5rem] border border-white/[0.12] bg-[#101010] p-6 sm:p-7 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase mb-1">Core Pillars</p>
              <p className="text-4xl font-black text-white tracking-tighter">3</p>
              <p className="text-[12px] text-white/65 mt-1 font-medium">Engineering Disciplines</p>
            </div>
            <div className="flex flex-col gap-2 pt-2">
              {["Full-Stack", "Applied AI", "System Architecture"].map((pillar) => (
                <div key={pillar} className="flex items-center gap-2">
                  <span className={`w-2 h-2 rounded-full ${PILLAR_COLORS[pillar]}`} />
                  <span className="text-[12px] text-white/80 font-medium">{pillar}</span>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Card 3: Technologies Mastered */}
          <motion.div variants={card} className="min-h-[240px] rounded-[1.5rem] border border-white/[0.12] bg-[#101010] p-6 sm:p-7 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase mb-1">Active Tooling</p>
              <p className="text-4xl font-black text-white tracking-tighter">20+</p>
              <p className="text-[12px] text-white/65 mt-1 font-medium">Frameworks, DBs &amp; APIs</p>
            </div>
            <div className="flex gap-1.5 flex-wrap pt-2">
              {["React", "Next", "TS", "Node", "Python", "PG", "Prisma", "AI"].map((t) => (
                <span
                  key={t}
                  className="rounded border border-white/10 bg-white/[0.04] px-2 py-0.5 text-[9px] font-mono text-white/70"
                >
                  {t}
                </span>
              ))}
            </div>
          </motion.div>

          {/* Card 4: Client & Team Delivery */}
          <motion.div variants={card} className="min-h-[240px] rounded-[1.5rem] border border-white/[0.12] bg-[#101010] p-6 sm:p-7 flex flex-col justify-between shadow-[0_15px_40px_rgba(0,0,0,0.4)]">
            <div>
              <p className="text-[10px] font-mono tracking-[0.2em] text-white/50 uppercase mb-1">Collaborations</p>
              <p className="text-4xl font-black text-white tracking-tighter">5+</p>
              <p className="text-[12px] text-white/65 mt-1 font-medium">Clients &amp; Production Teams</p>
            </div>
            <div className="flex items-center gap-2 pt-2">
              <span className="inline-flex items-center gap-1.5 rounded-full border border-[#69a65b]/40 bg-[#69a65b]/10 px-3 py-1 text-[11px] font-mono text-[#69a65b]">
                <i className="h-1.5 w-1.5 rounded-full bg-[#69a65b]" /> 100% On-Time Delivery
              </span>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}

