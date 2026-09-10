"use client";

import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";
import { useState, useEffect, useCallback } from "react";
import { personalInfo, navItems } from "@/lib/data";
import { List, X, MagnifyingGlass } from "@phosphor-icons/react";
import { SoundToggle } from "./SoundToggle";
import { soundManager } from "@/lib/useSoundFx";
import { ScrambleText } from "./ScrambleText";

export function Navbar({ onOpenPalette }: { onOpenPalette?: () => void }) {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [active, setActive] = useState("HOME");

  const openPalette = useCallback(() => {
    soundManager.playClick();
    if (onOpenPalette) {
      onOpenPalette();
    } else {
      window.dispatchEvent(new CustomEvent("toggle-command-palette"));
    }
  }, [onOpenPalette]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener("scroll", onScroll, { passive: true });

    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        openPalette();
      }
      if (e.key === "Escape" && open) {
        setOpen(false);
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    const sections = navItems
      .map((item) => (item.href.startsWith("#") ? document.querySelector(item.href) : null))
      .filter((section): section is Element => Boolean(section));

    const observer = new IntersectionObserver(
      (entries) =>
        entries.forEach((entry) => {
          if (entry.isIntersecting) setActive(entry.target.id.toUpperCase());
        }),
      { rootMargin: "-35% 0px -55% 0px" }
    );
    sections.forEach((section) => observer.observe(section));

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("keydown", handleKeyDown);
      observer.disconnect();
    };
  }, [open, openPalette]);

  return (
    <>
      <motion.header
        initial={{ y: -60, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
        className="fixed left-0 right-0 top-3 z-50 px-3 sm:px-6"
      >
        <div
          className={`mx-auto flex h-14 max-w-[1320px] items-center justify-between rounded-full border px-3 sm:px-6 shadow-[0_14px_50px_rgba(0,0,0,0.25)] transition-[background-color,border-color,box-shadow] duration-300 ease-[cubic-bezier(0.23,1,0.32,1)] ${
            scrolled
              ? "border-white/[0.14] bg-[#090a0d]/95 backdrop-blur-2xl"
              : "border-white/[0.10] bg-[#090a0d]/75 backdrop-blur-xl"
          }`}
        >
          {/* Logo */}
          <Link
            href="/"
            onClick={() => soundManager.playClick()}
            className="flex min-h-[44px] items-center gap-3 shrink-0 px-1 group"
            aria-label="Rishi Pandey homepage"
          >
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#69a65b] shadow-[0_0_15px_rgba(105,166,91,0.4)] transition-transform duration-300 group-hover:scale-105">
              <span className="text-[#102012] font-black text-sm tracking-tight">RP</span>
            </div>
            <span className="text-[13px] font-bold tracking-wider text-foreground/95 uppercase hidden sm:block">
              <ScrambleText text={personalInfo.name} />
            </span>
          </Link>

          {/* Desktop Nav Links */}
          <nav className="hidden lg:flex items-center gap-1" aria-label="Main Navigation">
            {navItems.map((item) => {
              const isActive = active === item.name || active === item.href.slice(1).toUpperCase();
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => {
                    soundManager.playClick();
                    setActive(item.name);
                  }}
                  aria-current={isActive ? "page" : undefined}
                  className="relative flex min-h-[44px] items-center px-3.5 py-2 group"
                >
                  <span
                    className={`text-[11px] font-semibold tracking-[0.14em] transition-colors duration-200 ${
                      isActive ? "text-white" : "text-white/60 group-hover:text-white"
                    }`}
                  >
                    {item.name}
                  </span>
                  {isActive && (
                    <motion.span
                      layoutId="nav-indicator"
                      className="absolute bottom-2 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-[#69a65b]"
                    />
                  )}
                </Link>
              );
            })}
          </nav>

          {/* Actions: Sound Toggle + Command Palette Trigger + CTA */}
          <div className="flex items-center gap-2 sm:gap-3">
            <SoundToggle />

            <button
              onClick={openPalette}
              aria-label="Open command palette (Ctrl+K or Cmd+K)"
              className="flex min-h-[44px] items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3 py-1.5 text-[11px] font-mono text-white/70 transition-all duration-200 hover:border-[#69a65b]/50 hover:bg-white/[0.08] hover:text-white active:scale-95"
            >
              <MagnifyingGlass size={15} weight="bold" className="text-[#69a65b]" />
              <span className="hidden sm:inline">Search</span>
              <kbd className="hidden md:inline rounded bg-white/10 px-1.5 py-0.5 text-[9px] text-white/50">
                ⌘K
              </kbd>
            </button>

            <a
              href="#contact"
              onClick={() => soundManager.playClick()}
              className="hidden sm:flex min-h-[44px] items-center gap-2 rounded-full border border-[#69a65b]/40 bg-[#69a65b]/10 px-4 py-2 text-[11px] font-bold tracking-widest text-[#e5d3c9] transition-[border-color,background-color,color] duration-200 hover:border-[#69a65b] hover:bg-[#69a65b] hover:text-[#040403]"
            >
              LET&apos;S TALK
              <svg width="12" height="12" viewBox="0 0 12 12" fill="none" aria-hidden="true">
                <path
                  d="M1 11L11 1M11 1H3M11 1V9"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </a>

            {/* Mobile Menu Hamburger */}
            <button
              onClick={() => {
                soundManager.playClick();
                setOpen((v) => !v);
              }}
              className="lg:hidden flex h-10 w-10 items-center justify-center rounded-full border border-white/15 text-white/80 transition-all hover:border-white/35 hover:text-white"
              aria-label={open ? "Close navigation menu" : "Open navigation menu"}
              aria-expanded={open}
              aria-controls="mobile-nav-menu"
            >
              {open ? <X size={18} weight="bold" /> : <List size={18} weight="bold" />}
            </button>
          </div>
        </div>
      </motion.header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav-menu"
            role="dialog"
            aria-modal="true"
            aria-label="Mobile Navigation Menu"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-6 bg-[#040403]/98 px-6 backdrop-blur-2xl lg:hidden"
          >
            <nav className="flex flex-col items-center gap-5" aria-label="Mobile Navigation">
              {navItems.map((item, i) => (
                <motion.div
                  key={item.name}
                  initial={{ y: 24, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 12, opacity: 0 }}
                  transition={{ duration: 0.35, delay: i * 0.04, ease: [0.23, 1, 0.32, 1] }}
                >
                  <Link
                    href={item.href}
                    onClick={() => {
                      setOpen(false);
                      setActive(item.name);
                    }}
                    className="flex min-h-[44px] items-center px-4 py-2 text-2xl font-black tracking-tight text-white/75 transition-colors hover:text-white active:text-[#69a65b]"
                  >
                    {item.name}
                  </Link>
                </motion.div>
              ))}
            </nav>

            <motion.a
              initial={{ y: 24, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: 12, opacity: 0 }}
              transition={{ duration: 0.35, delay: navItems.length * 0.04 }}
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-4 flex min-h-[48px] items-center justify-center rounded-full bg-[#69a65b] px-8 py-3 text-sm font-bold tracking-widest text-[#102012] shadow-[0_4px_25px_rgba(105,166,91,0.4)]"
            >
              LET&apos;S TALK ↗
            </motion.a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}

