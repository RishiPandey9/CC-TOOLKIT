"use client";

import { useEffect, useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { personalInfo, projects, navItems } from "@/lib/data";
import {
  MagnifyingGlass,
  ArrowRight,
  Copy,
  FileText,
  GithubLogo,
  LinkedinLogo,
  Check,
  X,
  Sparkle,
} from "@phosphor-icons/react";

interface CommandItem {
  id: string;
  title: string;
  category: "Navigation" | "Projects" | "Actions" | "Social";
  subtitle?: string;
  icon: React.ReactNode;
  perform: () => void;
}

export function CommandPalette({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const [query, setQuery] = useState("");
  const [copied, setCopied] = useState(false);
  const [selectedIndex, setSelectedIndex] = useState(0);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTimeout(() => inputRef.current?.focus(), 50);
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      setQuery("");
      setSelectedIndex(0);
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  const copyEmail = () => {
    navigator.clipboard.writeText(personalInfo.email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
      onClose();
    }, 1200);
  };

  const items: CommandItem[] = useMemo(() => {
    const list: CommandItem[] = [
      {
        id: "copy-email",
        title: copied ? "Copied to clipboard!" : `Copy Email (${personalInfo.email})`,
        category: "Actions",
        subtitle: "Copy direct contact email",
        icon: copied ? <Check size={18} className="text-[#69a65b]" /> : <Copy size={18} />,
        perform: copyEmail,
      },
      {
        id: "view-resume",
        title: "Download Resume",
        category: "Actions",
        subtitle: "PDF version",
        icon: <FileText size={18} />,
        perform: () => {
          window.open(personalInfo.resume, "_blank");
          onClose();
        },
      },
      ...navItems.map((nav) => ({
        id: `nav-${nav.name.toLowerCase()}`,
        title: `Go to ${nav.name}`,
        category: "Navigation" as const,
        subtitle: `Jump to #${nav.href.replace("#", "")} section`,
        icon: <ArrowRight size={18} />,
        perform: () => {
          const el = document.querySelector(nav.href);
          if (el) {
            el.scrollIntoView({ behavior: "smooth" });
          } else {
            window.location.href = nav.href;
          }
          onClose();
        },
      })),
      ...projects.map((p) => ({
        id: `project-${p.id}`,
        title: p.name,
        category: "Projects" as const,
        subtitle: `${p.category} · ${p.technologies.join(", ")}`,
        icon: <Sparkle size={18} className="text-[#69a65b]" />,
        perform: () => {
          if (p.link) {
            window.open(p.link, "_blank");
          } else {
            const el = document.getElementById("projects");
            el?.scrollIntoView({ behavior: "smooth" });
          }
          onClose();
        },
      })),
      {
        id: "github",
        title: "GitHub Profile",
        category: "Social",
        subtitle: personalInfo.github,
        icon: <GithubLogo size={18} />,
        perform: () => {
          window.open(personalInfo.github, "_blank");
          onClose();
        },
      },
      {
        id: "linkedin",
        title: "LinkedIn Profile",
        category: "Social",
        subtitle: personalInfo.linkedin,
        icon: <LinkedinLogo size={18} />,
        perform: () => {
          window.open(personalInfo.linkedin, "_blank");
          onClose();
        },
      },
    ];

    if (!query.trim()) return list;

    const q = query.toLowerCase();
    return list.filter(
      (item) =>
        item.title.toLowerCase().includes(q) ||
        item.category.toLowerCase().includes(q) ||
        item.subtitle?.toLowerCase().includes(q)
    );
  }, [query, copied, onClose]);

  useEffect(() => {
    setSelectedIndex(0);
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Escape") {
      onClose();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev + 1) % (items.length || 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setSelectedIndex((prev) => (prev - 1 + items.length) % (items.length || 1));
    } else if (e.key === "Enter" && items[selectedIndex]) {
      e.preventDefault();
      items[selectedIndex].perform();
    }
  };

  return (
    <AnimatePresence>
      {open && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Command Palette"
          className="fixed inset-0 z-[999] flex items-start justify-center px-4 pt-[15vh] sm:pt-[18vh]"
        >
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            onClick={onClose}
            className="fixed inset-0 bg-[#040403]/80 backdrop-blur-md"
          />

          {/* Dialog */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96, y: -10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.96, y: -10 }}
            transition={{ duration: 0.2, ease: [0.23, 1, 0.32, 1] }}
            className="relative z-10 w-full max-w-xl overflow-hidden rounded-2xl border border-white/[0.12] bg-[#0d0f12] shadow-[0_25px_70px_rgba(0,0,0,0.6)]"
          >
            {/* Search Input Bar */}
            <div className="flex items-center gap-3 border-b border-white/[0.08] px-4 py-3.5">
              <MagnifyingGlass size={20} className="text-white/40 shrink-0" />
              <input
                ref={inputRef}
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Type a command or search (e.g. Projects, Resume, Contact)..."
                className="w-full bg-transparent text-sm text-white placeholder:text-white/40 focus:outline-none"
              />
              <button
                onClick={onClose}
                aria-label="Close command palette"
                className="flex h-7 w-7 items-center justify-center rounded-lg border border-white/10 text-white/40 hover:text-white transition-colors"
              >
                <X size={14} />
              </button>
            </div>

            {/* Results List */}
            <div className="max-h-[380px] overflow-y-auto p-2 [scrollbar-width:thin]">
              {items.length === 0 ? (
                <div className="p-8 text-center text-sm text-white/40">
                  No matching commands found for &ldquo;{query}&rdquo;
                </div>
              ) : (
                items.map((item, index) => {
                  const isSelected = index === selectedIndex;
                  return (
                    <button
                      key={item.id}
                      onClick={item.perform}
                      onMouseEnter={() => setSelectedIndex(index)}
                      className={`flex w-full items-center justify-between rounded-xl px-3.5 py-3 text-left transition-all ${
                        isSelected
                          ? "bg-[#69a65b]/15 text-white"
                          : "text-white/70 hover:bg-white/[0.04] hover:text-white"
                      }`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <span
                          className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg border ${
                            isSelected
                              ? "border-[#69a65b]/40 bg-[#69a65b]/20 text-[#69a65b]"
                              : "border-white/10 bg-white/[0.03] text-white/50"
                          }`}
                        >
                          {item.icon}
                        </span>
                        <div className="min-w-0">
                          <p className="text-[13px] font-semibold tracking-tight truncate">{item.title}</p>
                          {item.subtitle && (
                            <p className="text-[11px] text-white/40 truncate">{item.subtitle}</p>
                          )}
                        </div>
                      </div>
                      <span className="shrink-0 text-[10px] font-mono tracking-widest uppercase text-white/30 ml-2">
                        {item.category}
                      </span>
                    </button>
                  );
                })
              )}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between border-t border-white/[0.08] bg-[#090a0d] px-4 py-2.5 text-[10px] font-mono text-white/40">
              <div className="flex items-center gap-3">
                <span>↑↓ Navigate</span>
                <span>↵ Select</span>
                <span>ESC Close</span>
              </div>
              <span className="text-[#69a65b]">Rishi Pandey · Portfolio</span>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
