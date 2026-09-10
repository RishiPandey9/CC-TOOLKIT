"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ReactNode, useRef, useState, MouseEvent } from "react";

export function TiltCard({
  children,
  className = "",
  glare = true,
  maxTilt = 8,
}: {
  children: ReactNode;
  className?: string;
  glare?: boolean;
  maxTilt?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);

  const x = useMotionValue(0.5);
  const y = useMotionValue(0.5);

  const springConfig = { damping: 20, stiffness: 180, mass: 0.3 };
  const rotateX = useSpring(useTransform(y, [0, 1], [maxTilt, -maxTilt]), springConfig);
  const rotateY = useSpring(useTransform(x, [0, 1], [-maxTilt, maxTilt]), springConfig);

  const glareX = useSpring(useTransform(x, [0, 1], ["0%", "100%"]), springConfig);
  const glareY = useSpring(useTransform(y, [0, 1], ["0%", "100%"]), springConfig);

  const handleMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    if (!ref.current) return;
    const rect = ref.current.getBoundingClientRect();
    const clientX = (e.clientX - rect.left) / rect.width;
    const clientY = (e.clientY - rect.top) / rect.height;

    x.set(clientX);
    y.set(clientY);
  };

  const handleMouseEnter = () => setIsHovered(true);
  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0.5);
    y.set(0.5);
  };

  return (
    <div
      style={{ perspective: 1200 }}
      className={`relative ${className}`}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <motion.div
        ref={ref}
        style={{
          rotateX: isHovered ? rotateX : 0,
          rotateY: isHovered ? rotateY : 0,
          transformStyle: "preserve-3d",
        }}
        className="relative h-full w-full"
      >
        {children}

        {/* Dynamic Specular Glare */}
        {glare && isHovered && (
          <motion.div
            style={{
              background: `radial-gradient(circle 320px at ${glareX.get()} ${glareY.get()}, rgba(255,255,255,0.07), transparent 70%)`,
            }}
            className="pointer-events-none absolute inset-0 z-30 rounded-[inherit] transition-opacity duration-300"
          />
        )}
      </motion.div>
    </div>
  );
}
