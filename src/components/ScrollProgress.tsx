"use client";

import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const chapters = ["HOME", "ABOUT", "EXPERIENCE", "PROJECTS", "BLOG", "CONTACT"];

export function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const progress = useSpring(scrollYProgress, { stiffness: 180, damping: 28, mass: 0.2 });
  const opacity = useTransform(progress, [0, 0.02, 1], [0, 1, 1]);

  return (
    <motion.div
      aria-hidden="true"
      style={{ opacity }}
      className="pointer-events-none fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 md:flex"
    >
      <div className="relative h-32 w-px bg-white/15">
        <motion.div style={{ scaleY: progress }} className="absolute inset-x-0 top-0 h-full origin-top bg-[#69a65b]" />
      </div>
      <motion.span style={{ opacity: progress }} className="text-[8px] font-mono tracking-[0.25em] text-white/50 [writing-mode:vertical-rl]">
        {chapters.join(" · ")}
      </motion.span>
    </motion.div>
  );
}

