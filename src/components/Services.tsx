"use client";

import { motion } from "framer-motion";
import { services } from "@/lib/data";
import { TiltCard } from "./TiltCard";
import { soundManager } from "@/lib/useSoundFx";

const ICONS: Record<string, React.ReactNode> = {
  ai: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2V4a2 2 0 0 1 2-2z"/>
      <path d="M12 16a2 2 0 0 1 2 2v2a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-2a2 2 0 0 1 2-2z"/>
      <path d="M2 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2H4a2 2 0 0 1-2-2z"/>
      <path d="M16 12a2 2 0 0 1 2-2h2a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-2a2 2 0 0 1-2-2z"/>
      <circle cx="12" cy="12" r="2"/>
    </svg>
  ),
  stack: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2L2 7l10 5 10-5-10-5z"/>
      <path d="M2 17l10 5 10-5"/>
      <path d="M2 12l10 5 10-5"/>
    </svg>
  ),
  design: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <rect x="3" y="3" width="8" height="8" rx="1"/>
      <rect x="13" y="3" width="8" height="8" rx="1"/>
      <rect x="3" y="13" width="8" height="8" rx="1"/>
      <rect x="13" y="13" width="8" height="8" rx="1"/>
    </svg>
  ),
  web: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <circle cx="12" cy="12" r="10"/>
      <path d="M2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10 15 15 0 0 1 4-10z"/>
    </svg>
  ),
  automation: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83"/>
    </svg>
  ),
  product: (
    <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6" stroke="currentColor" strokeWidth="1.5">
      <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/>
      <path d="M3.27 6.96L12 12.01l8.73-5.05M12 22.08V12"/>
    </svg>
  ),
};

export function Services() {
  return (
    <section id="services" className="relative overflow-hidden bg-[#f3eee8] py-20 text-[#040403] sm:py-28 md:py-36">
      <div className="absolute top-0 left-0 right-0 h-px bg-gradient-to-r from-transparent via-black/10 to-transparent" />

      <div className="max-w-[1400px] mx-auto px-4 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7 }}
          className="mb-14 sm:mb-20"
        >
          <p className="mb-3 flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#d63d21]">
            <span className="h-1.5 w-1.5 rounded-full bg-[#d63d21]" />
            WHAT I DELIVER
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black leading-[0.84] tracking-[-0.07em] text-[#040403]">
            SERVICES<span className="text-[#69a65b]">.</span>
          </h2>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {services.map((service, i) => (
            <motion.div
              key={service.title}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: i * 0.06 }}
              className="h-full"
            >
              <TiltCard maxTilt={8} glare={false} className="h-full">
                <div
                  onMouseEnter={() => soundManager.playHover()}
                  className="group relative flex h-full flex-col justify-between rounded-[1.5rem] border border-black/[0.08] bg-[#fffdfa] p-7 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-[border-color,box-shadow,transform] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:border-[#69a65b]/50 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)] min-h-[220px]"
                >
                  <div>
                    <div className="mb-5 flex items-center justify-between">
                      <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-black/[0.04] text-[#040403]/80 transition-colors duration-300 group-hover:bg-[#69a65b]/15 group-hover:text-[#4f8745]">
                        {ICONS[service.icon]}
                      </span>
                      <span className="font-mono text-[10px] tracking-widest text-black/40">0{i + 1}</span>
                    </div>
                    <h3 className="text-base font-black tracking-tight uppercase text-[#040403] mb-2">
                      {service.title}
                    </h3>
                    <p className="text-[13px] text-[#040403]/70 leading-relaxed">{service.description}</p>
                  </div>

                  <div className="mt-6 flex items-center justify-between border-t border-black/[0.06] pt-4">
                    <span className="text-[10px] font-mono tracking-widest text-black/50 uppercase">Production Ready</span>
                    <svg
                      viewBox="0 0 20 20"
                      fill="none"
                      className="h-4 w-4 text-[#d63d21] opacity-70 transition-[opacity,transform] duration-200 group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:opacity-100"
                      stroke="currentColor"
                      strokeWidth="2"
                      aria-hidden="true"
                    >
                      <path d="M3 17L17 3M17 3H7M17 3V13" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                </div>
              </TiltCard>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

