"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { personalInfo, navItems, socialLinks } from "@/lib/data";
import { GithubLogo, LinkedinLogo, TwitterLogo } from "@phosphor-icons/react";

const SOCIAL_ICONS: Record<string, React.ReactNode> = {
  github: <GithubLogo size={18} weight="bold" />,
  linkedin: <LinkedinLogo size={18} weight="bold" />,
  twitter: <TwitterLogo size={18} weight="bold" />,
};

const RESOURCES = [
  { name: "Resume", href: personalInfo.resume },
  { name: "Services", href: "#services" },
  { name: "Case Studies", href: "#projects" },
  { name: "Testimonials", href: "#contact" },
];

export function Footer() {
  const scrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });

  return (
    <footer className="relative border-t border-black/[0.08] bg-[#f3eee8] text-[#040403]">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 pb-12 pt-16 sm:pt-20 md:px-10">
        {/* Top grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 sm:gap-10 pb-12 border-b border-black/[0.08]">
          {/* Brand */}
          <div className="flex flex-col gap-3">
            <Link href="/" className="flex min-h-[44px] items-center gap-3" aria-label="Rishi Pandey home">
              <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#69a65b]">
                <span className="text-[#102012] font-black text-sm tracking-tight">RP</span>
              </div>
              <span className="font-black text-sm tracking-wide text-[#040403] uppercase">{personalInfo.name}</span>
            </Link>
            <p className="text-[11px] font-mono tracking-[0.15em] text-black/60 font-semibold uppercase">
              {personalInfo.roles.join(" · ")}
            </p>
          </div>

          {/* Navigation */}
          <div>
            <p className="text-[10px] font-mono tracking-[0.25em] text-black/50 font-bold uppercase mb-4">Navigation</p>
            <ul className="flex flex-col gap-1">
              {navItems.map((item) => (
                <li key={item.name}>
                  <Link
                    href={item.href}
                    className="flex min-h-[40px] items-center text-[13px] font-medium text-black/70 transition-colors duration-200 hover:text-[#4f8745]"
                  >
                    {item.name[0] + item.name.slice(1).toLowerCase()}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div>
            <p className="text-[10px] font-mono tracking-[0.25em] text-black/50 font-bold uppercase mb-4">Resources</p>
            <ul className="flex flex-col gap-1">
              {RESOURCES.map((r) => (
                <li key={r.name}>
                  <a
                    href={r.href}
                    className="flex min-h-[40px] items-center text-[13px] font-medium text-black/70 transition-colors duration-200 hover:text-[#4f8745]"
                  >
                    {r.name}
                  </a>
                </li>
              ))}
            </ul>
          </div>

          {/* Social */}
          <div>
            <p className="text-[10px] font-mono tracking-[0.25em] text-black/50 font-bold uppercase mb-4">Follow Me</p>
            <div className="flex items-center gap-2 sm:gap-3">
              {socialLinks.map((s) => (
                <motion.a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noreferrer"
                  aria-label={s.label}
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                  className="flex h-11 w-11 items-center justify-center rounded-full border border-black/[0.14] bg-[#fffdfa] text-black/60 shadow-sm transition-colors duration-200 hover:border-[#69a65b] hover:text-[#4f8745]"
                >
                  {SOCIAL_ICONS[s.icon]}
                </motion.a>
              ))}
            </div>
          </div>
        </div>

        {/* Bottom row */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-8">
          <p className="text-[11px] font-mono text-black/60 font-medium">
            &copy; {new Date().getFullYear()} {personalInfo.name}. All rights reserved.
          </p>
          <button
            onClick={scrollTop}
            aria-label="Scroll back to top of page"
            className="group flex min-h-[44px] items-center gap-2 text-[10px] font-mono tracking-[0.2em] text-black/60 font-bold uppercase transition-colors hover:text-[#4f8745]"
          >
            BACK TO TOP
            <span className="flex h-6 w-6 items-center justify-center border border-black/30 transition-colors group-hover:border-[#4f8745]">
              <svg viewBox="0 0 10 10" fill="none" className="w-2.5 h-2.5" stroke="currentColor" strokeWidth="1.8" aria-hidden="true">
                <path d="M5 8V2M2 5l3-3 3 3" strokeLinecap="round" strokeLinejoin="round"/>
              </svg>
            </span>
          </button>
        </div>
      </div>
    </footer>
  );
}

