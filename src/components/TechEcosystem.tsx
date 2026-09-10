"use client";

import {
  Atom,
  BracketsCurly,
  Cloud,
  Code,
  Cube,
  Database,
  FigmaLogo,
  GitBranch,
  Lightning,
  Sparkle,
  TerminalWindow,
  Triangle,
} from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { technologies } from "@/lib/data";

const iconMap = {
  React: Atom,
  "Next.js": Triangle,
  TypeScript: BracketsCurly,
  "Node.js": TerminalWindow,
  Python: Code,
  PostgreSQL: Database,
  Prisma: Cube,
  OpenAI: Sparkle,
  AWS: Cloud,
  Docker: Cube,
  Git: GitBranch,
  Figma: FigmaLogo,
  "Framer Motion": Lightning,
} as const;

const firstLayer = technologies.slice(0, 7);
const secondLayer = technologies.slice(7);

function TechCard({ name, index }: { name: string; index: number }) {
  const Icon = iconMap[name as keyof typeof iconMap] ?? Code;

  return (
    <div className="group flex min-w-[178px] shrink-0 items-center gap-4 rounded-[1.25rem] border border-black/[0.1] bg-[#fffdfa] px-5 py-4 shadow-[0_6px_20px_rgba(0,0,0,0.02)] transition-[border-color,transform,box-shadow] duration-200 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:border-[#69a65b]/60 hover:shadow-[0_18px_35px_rgba(4,4,3,0.08)]">
      <span className="grid size-10 shrink-0 place-items-center rounded-full bg-[#040403] text-[#f3eee8] transition-colors duration-200 group-hover:bg-[#69a65b] group-hover:text-[#040403]">
        <Icon size={19} weight="duotone" aria-hidden="true" />
      </span>
      <span className="min-w-0">
        <span className="mb-0.5 block font-mono text-[9px] tracking-[0.2em] text-black/60 font-semibold">0{index + 1}</span>
        <span className="block text-[13px] font-bold tracking-tight text-[#040403]">{name}</span>
      </span>
    </div>
  );
}

function TechLayer({ items, reverse = false }: { items: typeof technologies; reverse?: boolean }) {
  const loop = [...items, ...items];

  return (
    <div className="tech-layer relative overflow-x-auto [scrollbar-width:none] [&::-webkit-scrollbar]:hidden" tabIndex={0} aria-label="Scrollable tech list">
      <div className={`tech-track flex w-max gap-4 px-4 sm:px-6 md:gap-5 md:px-10 ${reverse ? "tech-track-reverse" : ""}`}>
        {loop.map((tech, index) => (
          <TechCard key={`${tech.name}-${index}`} name={tech.name} index={index % items.length} />
        ))}
      </div>
    </div>
  );
}

export function TechEcosystem() {
  return (
    <section className="relative overflow-hidden bg-[#f3eee8] py-20 text-[#040403] sm:py-28 md:py-36">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

      <div className="mx-auto mb-12 max-w-[1400px] px-4 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4"
        >
          <span className="flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#d63d21]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d63d21]" />
            Technology ecosystem
          </span>
          <span className="h-1.5 w-1.5 rounded-full bg-[#69a65b]" />
        </motion.div>
        <div className="mt-6 flex flex-col justify-between gap-5 md:flex-row md:items-end">
          <h2 className="max-w-3xl text-3xl font-black uppercase leading-[0.92] tracking-[-0.055em] sm:text-5xl md:text-6xl text-[#040403]">
            Tools for turning<br />
            <span className="text-black/40">complexity into clarity.</span>
          </h2>
          <p className="max-w-sm text-sm leading-relaxed text-black/70 font-medium">
            A focused stack for scalable web applications, real-time architectures, and dependable AI pipelines.
          </p>
        </div>
      </div>

      <div className="space-y-4" aria-label="Technology ecosystem marquee">
        <TechLayer items={firstLayer} />
        <TechLayer items={secondLayer} reverse />
      </div>
    </section>
  );
}

