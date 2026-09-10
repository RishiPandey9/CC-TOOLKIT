"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useEffect, useRef, useState, useMemo } from "react";
import Image from "next/image";
import { projects as localProjects } from "@/lib/data";
import { isFirebaseConfigured } from "@/lib/firebase/config";
import { loadProjects, type PortfolioProject } from "@/lib/firebase/projects";
import { ArrowSquareOut, GithubLogo, Sparkle } from "@phosphor-icons/react";
import { soundManager } from "@/lib/useSoundFx";
import { ScrambleText } from "./ScrambleText";

const CATEGORIES = ["ALL", "AI SYSTEMS", "SAAS & FULL-STACK", "TOOLS & SECURITY"] as const;

function ProjectCard({ p, i, isMobile }: { p: PortfolioProject; i: number; isMobile: boolean }) {
  const cardRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: cardRef,
    offset: ["start 0.9", "start 0.28"],
  });

  const fromX = i % 2 === 0 ? -120 : 120;
  const x = useTransform(scrollYProgress, [0, 1], [fromX, 0]);
  const opacity = useTransform(scrollYProgress, [0, 0.6, 1], [0.2, 0.6, 1]);
  const scale = useTransform(scrollYProgress, [0, 1], [0.95, 1]);

  return (
    <motion.div
      ref={cardRef}
      style={!isMobile ? { x, opacity, scale, zIndex: i + 1 } : undefined}
      whileHover={{ y: -4 }}
      className="md:sticky md:top-24 mx-auto flex w-full flex-col overflow-hidden rounded-[1.75rem] border border-white/[0.14] bg-[#0d0f12] shadow-[0_20px_60px_rgba(0,0,0,0.5)] transition-[border-color,box-shadow] duration-500 hover:border-[#69a65b]/60 md:flex-row"
    >
      {/* Visual / Image Area */}
      <div
        data-cursor="view"
        className="relative min-h-[220px] sm:min-h-[280px] md:min-h-[440px] overflow-hidden bg-[#12151a] md:w-[48%] flex items-center justify-center p-6 cursor-pointer"
      >
        {p.image ? (
          <div className="relative h-full w-full aspect-[16/10] overflow-hidden rounded-xl border border-white/10 shadow-2xl">
            <Image
              src={p.image}
              alt={`${p.name} preview`}
              fill
              loading={i === 0 ? "eager" : "lazy"}
              sizes="(max-width: 768px) 100vw, 45vw"
              className="object-contain p-2 transition-transform duration-700 hover:scale-105"
            />
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-3 text-center p-8">
            <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/[0.04] border border-white/10 text-[#69a65b]">
              <Sparkle size={28} />
            </div>
            <p className="font-mono text-xs tracking-widest uppercase text-white/50">{p.category}</p>
          </div>
        )}

        <span className="absolute bottom-4 left-5 rounded-full border border-white/10 bg-black/70 px-3 py-1 font-mono text-[9px] uppercase tracking-[0.18em] text-white/75 backdrop-blur-md">
          {p.category}
        </span>

        {p.link && (
          <a
            href={p.link}
            target="_blank"
            rel="noreferrer"
            aria-label={`Open ${p.name}`}
            onClick={() => soundManager.playClick()}
            className="absolute top-4 right-4 flex h-9 w-9 items-center justify-center rounded-full border border-white/15 bg-black/60 text-white/80 transition-all duration-200 hover:border-[#69a65b] hover:text-[#69a65b] backdrop-blur-md"
          >
            <ArrowSquareOut size={16} weight="bold" />
          </a>
        )}
      </div>

      {/* Content Area */}
      <div className="flex flex-1 flex-col justify-between gap-5 p-6 sm:p-8 md:p-9">
        <div>
          <div className="flex items-start justify-between gap-2 mb-2">
            <span className="font-mono text-xs font-bold text-[#d63d21]">PROJECT {p.id}</span>
            <span className="rounded-full border border-[#69a65b]/30 bg-[#69a65b]/10 px-2.5 py-0.5 text-[9px] font-mono tracking-wider text-[#69a65b] uppercase">
              Production
            </span>
          </div>

          <h3 className="text-2xl font-black uppercase tracking-[-0.03em] text-white sm:text-3xl md:text-4xl">
            <ScrambleText text={p.name} />
          </h3>

          <p className="mt-3 text-[13px] sm:text-sm leading-relaxed text-white/75">
            {p.description}
          </p>

          {(p.role || p.scope) && (
            <div className="mt-4 grid gap-3 border-y border-white/[0.08] py-3.5 sm:grid-cols-2">
              {p.role && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">Role</p>
                  <p className="mt-0.5 text-xs font-semibold text-white/85">{p.role}</p>
                </div>
              )}
              {p.scope && (
                <div>
                  <p className="font-mono text-[9px] uppercase tracking-[0.18em] text-white/45">Scope</p>
                  <p className="mt-0.5 text-xs font-semibold text-white/85">{p.scope}</p>
                </div>
              )}
            </div>
          )}

          {p.highlights && (
            <ul className="mt-4 grid gap-2 text-xs text-white/70 sm:grid-cols-2">
              {p.highlights.map((highlight) => (
                <li key={highlight} className="flex items-start gap-2">
                  <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-[#69a65b]" />
                  <span>{highlight}</span>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div>
          {/* Tech stack pills */}
          <div className="flex flex-wrap gap-1.5 border-t border-white/[0.08] pt-4 mb-4">
            {p.technologies.map((t) => (
              <span
                key={t}
                className="rounded border border-white/15 bg-white/[0.05] px-2.5 py-1 text-[10px] font-mono text-white/80"
              >
                {t}
              </span>
            ))}
          </div>

          {/* Action Links */}
          <div className="flex items-center justify-between gap-4 pt-1">
            {p.link ? (
              <a
                href={p.link}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="inline-flex min-h-[44px] items-center gap-2 rounded-full border border-[#69a65b]/40 bg-[#69a65b]/15 px-4 py-2 text-[11px] font-bold uppercase tracking-[0.16em] text-[#69a65b] transition-all hover:bg-[#69a65b] hover:text-[#040403]"
              >
                View Live Project <ArrowSquareOut size={15} weight="bold" />
              </a>
            ) : (
              <span className="font-mono text-[11px] uppercase tracking-[0.16em] text-white/45">
                Internal / Live Demo Pending
              </span>
            )}
            {p.github && (
              <a
                href={p.github}
                target="_blank"
                rel="noreferrer"
                onClick={() => soundManager.playClick()}
                className="inline-flex min-h-[44px] items-center gap-2 text-[11px] font-mono uppercase tracking-[0.16em] text-white/60 hover:text-white transition-colors"
              >
                <GithubLogo size={16} /> Source Code
              </a>
            )}
          </div>
        </div>
      </div>
    </motion.div>
  );
}

export function Projects() {
  const [projects, setProjects] = useState<PortfolioProject[]>(
    localProjects.map((project, index) => ({ ...project, order: index }))
  );
  const [activeTab, setActiveTab] = useState<(typeof CATEGORIES)[number]>("ALL");
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (!isFirebaseConfigured) return;

    void loadProjects(
      (remoteProjects) => {
        const visibleProjects = remoteProjects.filter(
          (project) => !project.name.toLowerCase().includes("portfolio")
        );
        if (visibleProjects.length > 0) setProjects(visibleProjects);
      },
      () => undefined
    );
  }, []);

  const filteredProjects = useMemo(() => {
    if (activeTab === "ALL") return projects;
    if (activeTab === "AI SYSTEMS") {
      return projects.filter(
        (p) =>
          p.category.toLowerCase().includes("ai") ||
          p.technologies.some((t) => ["python", "langchain", "weaviate", "openai"].includes(t.toLowerCase()))
      );
    }
    if (activeTab === "SAAS & FULL-STACK") {
      return projects.filter(
        (p) =>
          p.category.toLowerCase().includes("saas") ||
          p.category.toLowerCase().includes("platform") ||
          p.technologies.some((t) => ["next.js", "react", "node.js", "prisma"].includes(t.toLowerCase()))
      );
    }
    if (activeTab === "TOOLS & SECURITY") {
      return projects.filter(
        (p) =>
          p.category.toLowerCase().includes("automation") ||
          p.category.toLowerCase().includes("fintech") ||
          p.name.toLowerCase().includes("cctoolkit") ||
          p.name.toLowerCase().includes("ocr")
      );
    }
    return projects;
  }, [projects, activeTab]);

  return (
    <section id="projects" className="relative overflow-hidden bg-[#040403] py-20 text-foreground sm:py-28 md:py-36">
      <div className="absolute left-0 right-0 top-0 h-px bg-gradient-to-r from-transparent via-[#69a65b]/30 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mb-10 sm:mb-14 flex flex-col md:flex-row md:items-end justify-between gap-6"
        >
          <div>
            <p className="mb-3 flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#d63d21]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d63d21]" />
              CURATED PRODUCTION WORK
            </p>
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black leading-[0.84] tracking-[-0.07em] text-white">
              SELECTED<br />WORK<span className="text-[#69a65b]">.</span>
            </h2>
          </div>

          <a
            href="https://github.com/RishiPandey9"
            target="_blank"
            rel="noreferrer"
            onClick={() => soundManager.playClick()}
            className="flex min-h-[44px] items-center gap-2 self-start rounded-full border border-white/20 bg-white/[0.04] px-5 py-2 text-[11px] font-mono tracking-[0.2em] text-white/80 uppercase transition-all duration-200 hover:border-[#69a65b] hover:text-[#69a65b] md:self-end"
          >
            VIEW GITHUB WORK
            <svg viewBox="0 0 14 14" fill="none" className="w-3.5 h-3.5" stroke="currentColor" strokeWidth="2">
              <path d="M1 13L13 1M13 1H5M13 1V9" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </a>
        </motion.div>

        {/* Category Filter Tabs */}
        <div className="mb-12 flex flex-wrap gap-2 sm:gap-3" role="tablist" aria-label="Project Categories">
          {CATEGORIES.map((tab) => {
            const isActive = activeTab === tab;
            return (
              <button
                key={tab}
                role="tab"
                aria-selected={isActive}
                onClick={() => {
                  soundManager.playClick();
                  setActiveTab(tab);
                }}
                className={`flex min-h-[44px] items-center rounded-full px-4 py-2 text-[11px] font-mono tracking-wider transition-all duration-200 ${
                  isActive
                    ? "bg-[#69a65b] font-bold text-[#040403] shadow-[0_4px_20px_rgba(105,166,91,0.4)]"
                    : "border border-white/10 bg-white/[0.03] text-white/70 hover:border-white/25 hover:text-white"
                }`}
              >
                {tab}
              </button>
            );
          })}
        </div>

        {/* Projects List: Mobile Stacking vs Desktop Parallax */}
        <div className="mx-auto flex max-w-5xl flex-col gap-8 md:gap-[24vh] md:pb-[25vh]">
          {filteredProjects.map((p, i) => (
            <ProjectCard key={p.id} p={p} i={i} isMobile={isMobile} />
          ))}
        </div>
      </div>
    </section>
  );
}

