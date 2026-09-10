"use client";

import { motion } from "framer-motion";
import { experience } from "@/lib/data";

const reveal = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: [0.23, 1, 0.32, 1] as const } },
};

export function Experience() {
  return (
    <section id="experience" className="relative overflow-hidden bg-[#f3eee8] py-20 text-[#040403] sm:py-28 md:py-36">
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
            CAREER &amp; TRACK RECORD
          </p>
          <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black leading-[0.84] tracking-[-0.07em] text-[#040403]">
            EXPERIENCE<span className="text-[#69a65b]">.</span>
          </h2>
        </motion.div>

        <div className="relative flex flex-col gap-0">
          {/* Vertical timeline line */}
          <div className="absolute bottom-2 left-[7px] top-2 hidden w-px bg-black/[0.15] md:block" />

          {experience.map((job, i) => (
            <motion.div
              key={i}
              variants={reveal}
              initial="hidden"
              whileInView="visible"
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.75, delay: i * 0.1 }}
              className="relative pb-10 sm:pb-14 md:pl-12 last:pb-0"
            >
              {/* Timeline dot */}
              <div className="absolute left-0 top-1.5 hidden h-3.5 w-3.5 rounded-full border-2 border-[#69a65b] bg-[#f3eee8] shadow-[0_0_10px_rgba(105,166,91,0.5)] md:block" />

              <div className="rounded-[1.5rem] border border-black/[0.08] bg-[#fffdfa] p-6 sm:p-8 md:p-10 shadow-[0_15px_40px_rgba(0,0,0,0.03)] transition-[border-color,transform,box-shadow] duration-500 ease-[cubic-bezier(0.23,1,0.32,1)] hover:-translate-y-1 hover:border-[#69a65b]/50 hover:shadow-[0_22px_55px_rgba(4,4,3,0.08)]">
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-3 mb-5">
                  <div>
                    <h3 className="text-lg font-black tracking-tight text-[#040403] mb-1">{job.role}</h3>
                    <p className="text-[#4f8745] font-bold text-sm tracking-tight">{job.company}</p>
                  </div>
                  <div className="flex flex-col gap-0.5 md:items-end shrink-0">
                    <span className="text-[11px] font-mono font-semibold text-black/60">{job.period}</span>
                    <span className="text-[11px] font-mono text-black/50">{job.location}</span>
                  </div>
                </div>

                <ul className="flex flex-col gap-2.5 mb-5">
                  {job.achievements.map((a, j) => (
                    <li key={j} className="flex items-start gap-3 text-[13px] text-black/75 leading-relaxed">
                      <span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-[#d63d21]" />
                      {a}
                    </li>
                  ))}
                </ul>

                <div className="flex flex-wrap gap-2 pt-4 border-t border-black/[0.06]">
                  {job.technologies.map((t) => (
                    <span
                      key={t}
                      className="px-2.5 py-1 text-[10px] font-mono font-medium text-black/70 bg-black/[0.04] border border-black/[0.08] rounded-md"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

