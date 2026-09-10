"use client";

import { motion } from "framer-motion";
import { testimonials } from "@/lib/data";
import ContactFormClient from "./ContactFormClient";

const cardVariant = {
  hidden: { opacity: 0, y: 24 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.23, 1, 0.32, 1] as const } },
};

export function TestimonialsContact() {
  return (
    <section id="contact" className="relative overflow-visible">
      <div className="grid min-h-auto lg:min-h-[720px] grid-cols-1 lg:grid-cols-2">
        {/* LEFT: dark testimonials */}
        <div className="relative overflow-visible bg-[#040403] px-4 py-20 sm:px-8 sm:py-28 md:px-12 md:py-32 lg:py-36 text-foreground">
          <div
            className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] rounded-full pointer-events-none opacity-50"
            style={{ background: "radial-gradient(circle, rgba(105,166,91,0.18) 0%, transparent 65%)" }}
          />

          <div className="relative z-10 max-w-xl mx-auto lg:max-w-none">
            <p className="mb-3 flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#d63d21]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d63d21]" />
              TESTIMONIALS &amp; FEEDBACK
            </p>
            <h2 className="text-[clamp(2rem,3.5vw,2.8rem)] font-black tracking-tighter text-white mb-8">
              ENDORSEMENTS<span className="text-[#69a65b]">.</span>
            </h2>

            <motion.div
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ staggerChildren: 0.12 }}
              className="flex flex-col gap-4"
            >
              {testimonials.map((t) => (
                <motion.div
                  key={t.name}
                  variants={cardVariant}
                  className="flex flex-col gap-3 rounded-[1.5rem] border border-white/[0.12] bg-[#101010] p-6 sm:p-7 shadow-[0_10px_30px_rgba(0,0,0,0.3)]"
                >
                  <div className="text-[#69a65b] opacity-90">
                    <svg viewBox="0 0 24 24" className="w-5 h-5" fill="currentColor" aria-hidden="true">
                      <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z"/>
                    </svg>
                  </div>
                  <p className="text-[13px] text-white/80 leading-relaxed italic">{t.quote}</p>
                  <div className="flex items-center gap-3 pt-3 border-t border-white/[0.08]">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-white/15 to-white/5 border border-white/15 flex items-center justify-center text-[11px] font-bold text-white/80">
                      {t.name[0]}
                    </div>
                    <div>
                      <p className="text-[13px] font-bold text-white">{t.name}</p>
                      <p className="text-[10px] font-mono text-white/50">{t.role}</p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </div>

        {/* RIGHT: contact form */}
        <div className="relative flex flex-col justify-center overflow-visible bg-[#f3eee8] px-4 py-20 sm:px-8 sm:py-28 md:px-12 md:py-32 lg:py-36 text-[#040403]">
          <div
            className="absolute bottom-0 left-0 w-64 h-64 rounded-full pointer-events-none opacity-20"
            style={{ background: "radial-gradient(circle, rgba(214,61,33,0.24) 0%, transparent 65%)" }}
          />

          <div className="relative z-10 max-w-xl mx-auto lg:max-w-none w-full">
            <ContactFormInner />
          </div>
        </div>
      </div>
    </section>
  );
}

function ContactFormInner() {
  return (
    <div>
      <p className="mb-3 flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#d63d21]">
        <span className="h-1.5 w-1.5 rounded-full bg-[#d63d21]" />
        LET&apos;S COLLABORATE
      </p>
      <h2 className="text-[clamp(1.8rem,3vw,2.6rem)] font-black tracking-tighter text-[#040403] mb-6">
        START A PROJECT<span className="text-[#69a65b]">.</span>
      </h2>
      <ContactFormClient />
    </div>
  );
}

