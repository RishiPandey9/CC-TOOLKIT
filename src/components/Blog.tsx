"use client";

import { motion } from "framer-motion";

const posts = [
  { type: "BUILD LOG", title: "Designing systems that stay calm under heavy production load.", date: "Coming soon", index: "01" },
  { type: "FIELD NOTE", title: "What shipping production AI teaches you about product engineering.", date: "Coming soon", index: "02" },
  { type: "PLAYBOOK", title: "The architectural details that make a full-stack product feel finished.", date: "Coming soon", index: "03" },
];

export function Blog() {
  return (
    <section id="blog" className="relative overflow-hidden bg-[#f3eee8] py-20 text-[#040403] sm:py-28 md:py-36">
      <div className="mx-auto max-w-[1400px] px-4 sm:px-6 md:px-10">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-60px" }}
          transition={{ duration: 0.7, ease: [0.23, 1, 0.32, 1] }}
          className="mb-12 flex items-end justify-between gap-6"
        >
          <div>
            <p className="mb-3 flex items-center gap-2 text-[10px] font-mono tracking-[0.3em] uppercase text-[#d63d21]">
              <span className="h-1.5 w-1.5 rounded-full bg-[#d63d21]" />
              NOTES &amp; OBSERVATIONS
            </p>
            <h2 className="text-[clamp(2.5rem,6vw,5.5rem)] font-black leading-[0.84] tracking-[-0.07em]">
              THE<br />JOURNAL<span className="text-[#69a65b]">.</span>
            </h2>
          </div>
          <span className="hidden text-[11px] font-mono tracking-[0.2em] text-black/60 font-semibold md:block uppercase">
            Articles in Progress
          </span>
        </motion.div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 sm:gap-6">
          {posts.map((post, index) => (
            <motion.article
              key={post.index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ duration: 0.65, delay: index * 0.08, ease: [0.23, 1, 0.32, 1] }}
              className="group relative flex min-h-[280px] flex-col justify-between rounded-[1.5rem] border border-black/[0.08] bg-[#fffdfa] p-7 sm:p-8 shadow-[0_10px_30px_rgba(0,0,0,0.03)] transition-[border-color,box-shadow,transform] duration-500 hover:-translate-y-1 hover:border-[#69a65b]/50 hover:shadow-[0_20px_45px_rgba(0,0,0,0.08)]"
            >
              <div>
                <div className="mb-6 flex items-center justify-between">
                  <span className="rounded-full bg-[#d63d21]/10 px-2.5 py-0.5 text-[9px] font-mono font-bold tracking-[0.18em] text-[#d63d21]">
                    {post.type}
                  </span>
                  <span className="font-mono text-[11px] font-semibold text-black/50">{post.index}</span>
                </div>
                <h3 className="text-lg sm:text-xl font-black leading-snug tracking-tight text-[#040403]">
                  {post.title}
                </h3>
              </div>
              <div className="mt-8 flex items-center justify-between border-t border-black/[0.06] pt-4 text-[11px] font-mono font-medium text-black/60">
                <span>{post.date}</span>
                <span className="flex h-8 w-8 items-center justify-center rounded-full border border-black/10 text-[#040403] transition-transform duration-200 group-hover:border-[#69a65b] group-hover:text-[#69a65b] group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  ↗
                </span>
              </div>
            </motion.article>
          ))}
        </div>
      </div>
    </section>
  );
}

