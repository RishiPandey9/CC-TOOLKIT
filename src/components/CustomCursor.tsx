"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, useSpring } from "framer-motion";

export function CustomCursor() {
  const [enabled, setEnabled] = useState(false);
  const [cursorText, setCursorText] = useState("");
  const [cursorVariant, setCursorVariant] = useState<"default" | "pointer" | "view">("default");

  const mouseX = useMotionValue(-100);
  const mouseY = useMotionValue(-100);

  const springConfig = { damping: 28, stiffness: 320, mass: 0.2 };
  const smoothX = useSpring(mouseX, springConfig);
  const smoothY = useSpring(mouseY, springConfig);

  useEffect(() => {
    // Only enable on desktop pointer devices
    const isFinePointer = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    if (!isFinePointer) return;

    setEnabled(true);

    const handleMouseMove = (e: MouseEvent) => {
      mouseX.set(e.clientX);
      mouseY.set(e.clientY);

      const target = e.target as HTMLElement | null;
      if (!target) return;

      const cursorTarget = target.closest("[data-cursor]") as HTMLElement | null;
      if (cursorTarget) {
        const type = cursorTarget.getAttribute("data-cursor");
        if (type === "view") {
          setCursorVariant("view");
          setCursorText("VIEW ↗");
        } else if (type === "pointer") {
          setCursorVariant("pointer");
          setCursorText("");
        }
      } else if (target.closest("button, a, select, input, textarea")) {
        setCursorVariant("pointer");
        setCursorText("");
      } else {
        setCursorVariant("default");
        setCursorText("");
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  if (!enabled) return null;

  return (
    <motion.div
      aria-hidden="true"
      style={{
        x: smoothX,
        y: smoothY,
        translateX: "-50%",
        translateY: "-50%",
      }}
      className="pointer-events-none fixed left-0 top-0 z-[99999] flex items-center justify-center"
    >
      {cursorVariant === "view" ? (
        <motion.div
          initial={{ scale: 0.5, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.5, opacity: 0 }}
          className="flex h-12 w-28 items-center justify-center rounded-full bg-[#69a65b] font-mono text-[10px] font-black tracking-widest text-[#040403] shadow-[0_0_25px_rgba(105,166,91,0.6)]"
        >
          {cursorText}
        </motion.div>
      ) : cursorVariant === "pointer" ? (
        <motion.div
          animate={{ scale: 1.5 }}
          className="h-9 w-9 rounded-full border border-[#69a65b]/60 bg-[#69a65b]/10 backdrop-blur-[1px] shadow-[0_0_15px_rgba(105,166,91,0.3)]"
        />
      ) : (
        <div className="relative flex items-center justify-center">
          {/* Inner solid dot */}
          <div className="h-2 w-2 rounded-full bg-[#69a65b] shadow-[0_0_8px_#69a65b]" />
          {/* Outer trailing faint ring */}
          <div className="absolute h-7 w-7 rounded-full border border-white/20" />
        </div>
      )}
    </motion.div>
  );
}
