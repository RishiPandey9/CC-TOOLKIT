"use client";

import { useState, useCallback, useRef, useEffect } from "react";
import { soundManager } from "@/lib/useSoundFx";

const GLYPHS = "ABCDEF0123456789!@#$%^&*<>~_+=[]";

export function ScrambleText({
  text,
  className = "",
  scrambleOnMount = false,
  scrambleOnHover = true,
}: {
  text: string;
  className?: string;
  scrambleOnMount?: boolean;
  scrambleOnHover?: boolean;
}) {
  const [displayText, setDisplayText] = useState(text);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const startScramble = useCallback(() => {
    let iteration = 0;
    if (intervalRef.current) clearInterval(intervalRef.current);

    soundManager.playHover();

    intervalRef.current = setInterval(() => {
      setDisplayText((prev) =>
        text
          .split("")
          .map((char, index) => {
            if (char === " ") return " ";
            if (index < iteration) {
              return text[index];
            }
            return GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
          })
          .join("")
      );

      if (iteration >= text.length) {
        if (intervalRef.current) clearInterval(intervalRef.current);
      }
      iteration += 1 / 2;
    }, 28);
  }, [text]);

  useEffect(() => {
    if (scrambleOnMount) {
      startScramble();
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [scrambleOnMount, startScramble]);

  return (
    <span
      onMouseEnter={scrambleOnHover ? startScramble : undefined}
      className={`inline-block font-inherit cursor-default ${className}`}
    >
      {displayText}
    </span>
  );
}
