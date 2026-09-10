"use client";

import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { GithubLogo, LinkedinLogo, TwitterLogo, ArrowUpRight } from "@phosphor-icons/react";
import { personalInfo, heroStats, socialLinks } from "@/lib/data";
import { useRef } from "react";
import { CyberParticles } from "./CyberParticles";
import { TiltCard } from "./TiltCard";
import { ScrambleText } from "./ScrambleText";
import { soundManager } from "@/lib/useSoundFx";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <GithubLogo size={18} weight="light" />,
  linkedin: <LinkedinLogo size={18} weight="light" />,
  twitter: <TwitterLogo size={18} weight="light" />,
};

const labels = [
  { text: "AI SYSTEMS", tone: "green", className: "left-[1%] top-[16%] -rotate-6 hidden xs:inline-block" },
  { text: "FULL-STACK", tone: "cream", className: "right-[2%] top-[8%] rotate-3" },
  { text: "PRODUCT THINKING", tone: "orange", className: "right-[1%] top-[42%] rotate-6 hidden sm:inline-block" },
  { text: "MOTION & UI", tone: "cream", className: "left-[0%] top-[54%] -rotate-3" },
  { text: "SCHEMA TO SHIP", tone: "green", className: "left-[4%] bottom-[10%] rotate-3 hidden sm:inline-block" },
];

const entry = {
  hidden: { opacity: 0, transform: "translateY(24px)" },
  visible: {
    opacity: 1,
    transform: "translateY(0px)",
    transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as const },
  },
};

export function Hero({ onOpenPalette }: { onOpenPalette?: () => void }) {
  const ref = useRef<HTMLElement>(null);
  const reduceMotion = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const copyY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "18%"]);
  const visualY = useTransform(scrollYProgress, [0, 1], ["0%", reduceMotion ? "0%" : "-10%"]);
  const visualScale = useTransform(scrollYProgress, [0, 1], [1, reduceMotion ? 1 : 1.08]);
  const fade = useTransform(scrollYProgress, [0, 0.75, 1], [1, 0.9, 0.35]);

  return (
    <section ref={ref} id="home" className="hero-reference relative min-h-[100dvh] overflow-hidden bg-[#040403] text-[#f3eee8]">
      <div className="hero-reference-grid pointer-events-none absolute inset-0" />
      <CyberParticles />
      <div className="hero-reference-glow pointer-events-none absolute left-[38%] top-[17%] h-[48vw] w-[48vw] max-h-[720px] max-w-[720px] rounded-full opacity-60" />

      <div className="relative z-10 mx-auto flex min-h-[100dvh] max-w-[1440px] flex-col justify-between px-4 pb-8 pt-20 sm:px-6 sm:pt-24 md:px-10 md:pt-28">
        {/* Top Status Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-4 text-[10px] font-mono tracking-[0.2em] text-white/60 uppercase">
          <span>PORTFOLIO / 2026</span>
          <span className="hidden md:block">
            <ScrambleText text="RISHI PANDEY · FULL-STACK & AI" />
          </span>
          <span className="flex items-center gap-2 text-[#69a65b]">
            <i className="h-2 w-2 rounded-full bg-[#69a65b] animate-pulse" /> AVAILABLE FOR WORK
          </span>
        </div>

        {/* Main Content Area */}
        <div className="relative flex flex-1 flex-col justify-center py-8 lg:grid lg:grid-cols-[1.08fr_0.92fr] lg:items-center lg:gap-8 lg:py-0">
          <motion.div style={{ y: copyY }} className="relative z-20 max-w-[720px]">
            <motion.p variants={entry} initial="hidden" animate="visible" className="mb-4 sm:mb-6 flex items-center gap-3 text-[10px] font-mono tracking-[0.25em] text-[#e5d3c9] uppercase">
              <span className="h-px w-8 bg-[#d63d21]" />
              Full-stack developer / AI engineer
            </motion.p>
            <motion.h1 variants={entry} initial="hidden" animate="visible" transition={{ delay: 0.08 }} className="max-w-[760px] text-[clamp(2.85rem,8.5vw,9.5rem)] font-black leading-[0.84] tracking-[-0.08em] uppercase">
              <span className="block text-[#f3eee8]">
                <ScrambleText text="Build" />
              </span>
              <span className="block pl-[6vw] text-[#69a65b]">
                <ScrambleText text="Better" />
              </span>
              <span className="block text-[#f3eee8]">
                <ScrambleText text="Systems" />
                <span className="text-[#d63d21]">.</span>
              </span>
            </motion.h1>
            <motion.div variants={entry} initial="hidden" animate="visible" transition={{ delay: 0.16 }} className="mt-6 sm:mt-8 flex flex-col sm:flex-row max-w-[520px] items-start justify-between gap-5 border-t border-white/10 pt-4">
              <p className="text-[13px] sm:text-sm leading-relaxed text-white/70">
                I design and ship intelligent digital products that turn complex distributed systems into clear, high-performing experiences.
              </p>
              <div className="flex items-center gap-3 shrink-0">
                <a
                  href="#projects"
                  onClick={() => soundManager.playClick()}
                  className="group flex min-h-[44px] items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2 text-[11px] font-bold tracking-[0.16em] text-[#e5d3c9] uppercase transition-all duration-200 hover:border-[#69a65b] hover:bg-[#69a65b] hover:text-[#040403]"
                >
                  Explore work <ArrowUpRight size={14} weight="bold" className="transition-transform duration-200 group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
                </a>
              </div>
            </motion.div>
          </motion.div>

          {/* Visual Showcase Card with 3D Tilt & Specular Glare */}
          <motion.div style={{ y: visualY, scale: visualScale, opacity: fade }} className="relative mx-auto mt-8 aspect-[0.86] w-[min(82vw,440px)] lg:mt-0 lg:mr-[6%] lg:w-[min(38vw,480px)]">
            <TiltCard maxTilt={10} glare={true} className="h-full w-full">
              <div className="relative h-full w-full">
                <div className="absolute inset-[7%] rounded-[48%_48%_42%_42%] bg-[#d9c7bd] opacity-90 shadow-[0_20px_60px_rgba(0,0,0,0.4)]" />
                <div className="hero-reference-portrait absolute inset-[9%] overflow-hidden rounded-[48%_48%_42%_42%] border border-white/25 bg-[#12161a]">
                  <Image src="/profile.png" alt="Portrait of Rishi Pandey" fill priority sizes="(max-width: 768px) 100vw, 48vw" className="object-cover object-top grayscale-[0.25] contrast-[1.04]" />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#040403]/80 via-transparent to-[#69a65b]/10" />
                  <div className="absolute inset-x-6 top-6 flex items-center justify-between text-[9px] font-mono tracking-[0.2em] text-white/75">
                    <span>RP / 01</span>
                    <span className="flex items-center gap-2"><i className="h-1.5 w-1.5 rounded-full bg-[#69a65b]" /> NAGPUR, IN</span>
                  </div>
                  <div className="absolute bottom-7 left-6 right-6 flex items-end justify-between">
                    <div>
                      <p className="text-[9px] font-mono tracking-[0.2em] text-white/70">ENGINEER / BUILDER</p>
                      <p className="mt-1 text-2xl font-black tracking-[-0.05em] text-white">RISHI<br />PANDEY</p>
                    </div>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full border border-white/30 text-[#e5d3c9] bg-black/30 backdrop-blur-sm">↗</span>
                  </div>
                </div>
                {labels.map((label, index) => (
                  <motion.span key={label.text} initial={{ opacity: 0, transform: "translateY(10px) scale(0.96)" }} animate={{ opacity: 1, transform: "translateY(0px) scale(1)" }} transition={{ duration: 0.55, delay: 0.45 + index * 0.08, ease: [0.23, 1, 0.32, 1] }} className={`hero-label hero-label-${label.tone} absolute ${label.className}`}>{label.text}</motion.span>
                ))}
              </div>
            </TiltCard>
          </motion.div>
        </div>

        {/* Footer Bar */}
        <div className="hero-reference-footer flex flex-col gap-5 border-t border-white/10 pt-5 md:flex-row md:items-end md:justify-between">
          <div className="flex items-center gap-3 md:w-1/3">
            {socialLinks.map((social) => (
              <a
                key={social.label}
                href={social.href}
                target="_blank"
                rel="noreferrer"
                aria-label={social.label}
                onClick={() => soundManager.playClick()}
                className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-white/10 bg-white/[0.02] text-white/65 transition-all duration-200 hover:border-[#69a65b]/50 hover:bg-white/[0.06] hover:text-white"
              >
                {SOCIAL_ICONS[social.icon]}
              </a>
            ))}
            <span className="ml-1 text-[9px] font-mono tracking-[0.2em] text-white/50">EXPLORE ↓</span>
          </div>
          <div className="hidden text-center text-[9px] font-mono tracking-[0.24em] text-white/50 uppercase md:block md:w-1/3">Core capabilities &amp; systems / 2026</div>
          <div className="grid grid-cols-2 gap-x-6 gap-y-3 sm:grid-cols-4 md:w-1/3 md:justify-items-end">
            {heroStats.map((stat) => (
              <div key={stat.label}>
                <p className="text-xl font-black tracking-[-0.04em] text-[#e5d3c9]">{stat.value}</p>
                <p className="mt-0.5 text-[8px] font-mono tracking-[0.16em] text-white/50">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

