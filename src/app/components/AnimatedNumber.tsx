"use client";

import React, { useEffect, useRef, useState } from "react";
import { cn } from "@/lib/utils";

interface AnimatedNumberProps {
  value: number;
  formatter?: (val: number) => string;
  className?: string;
  /** Show a "+" prefix when value increases. Default true. */
  showDelta?: boolean;
}

export const AnimatedNumber = ({
  value,
  formatter,
  className,
  showDelta = false,
}: AnimatedNumberProps) => {
  const [displayValue, setDisplayValue] = useState(value);
  const [direction, setDirection] = useState<"up" | "down" | null>(null);
  const [isAnimating, setIsAnimating] = useState(false);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);
  const fromRef = useRef(value);
  const toRef = useRef(value);
  const DURATION = 700; // ms

  useEffect(() => {
    if (value === displayValue) return;

    // Use a small timeout to avoid the synchronous state update lint error
    const updateTimer = setTimeout(() => {
      // Determine direction for color/glow
      setDirection(value > displayValue ? "up" : "down");
      setIsAnimating(true);
    }, 0);

    fromRef.current = displayValue;
    toRef.current = value;
    startRef.current = null;

    // Cancel any in-progress animation
    if (rafRef.current) cancelAnimationFrame(rafRef.current);

    const animate = (timestamp: number) => {
      if (!startRef.current) startRef.current = timestamp;
      const elapsed = timestamp - startRef.current;
      const progress = Math.min(elapsed / DURATION, 1);

      // Ease-out expo for snappy start, smooth landing
      const eased = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
      const current =
        fromRef.current + (toRef.current - fromRef.current) * eased;

      setDisplayValue(current);

      if (progress < 1) {
        rafRef.current = requestAnimationFrame(animate);
      } else {
        setDisplayValue(toRef.current);
        const clearTimer = setTimeout(() => {
          setIsAnimating(false);
          setDirection(null);
        }, 800);
        return () => clearTimeout(clearTimer);
      }
    };

    rafRef.current = requestAnimationFrame(animate);
    return () => {
      clearTimeout(updateTimer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps

  const formatted = formatter
    ? formatter(displayValue)
    : Math.round(displayValue).toString();

  return (
    <span
      className={cn(
        "relative inline-flex items-center transition-all duration-300",
        className,
      )}
    >
      {/* Main number */}
      <span
        className={cn(
          "relative inline-block transition-all duration-300",
          isAnimating &&
            direction === "up" &&
            "drop-shadow-[0_0_8px_rgba(16,185,129,0.8)] text-emerald-500",
          isAnimating &&
            direction === "down" &&
            "drop-shadow-[0_0_8px_rgba(239,68,68,0.8)] text-red-500",
        )}
        style={{
          animation: isAnimating
            ? "balance-bounce 0.6s cubic-bezier(0.34,1.56,0.64,1)"
            : undefined,
        }}
      >
        {formatted}
      </span>

      {/* Delta indicator (floating +/- badge above) */}
      {showDelta && isAnimating && direction && (
        <span
          className={cn(
            "absolute -top-5 left-1/2 -translate-x-1/2 text-[10px] font-black px-1.5 py-0.5 rounded-full whitespace-nowrap",
            "animate-delta-float",
            direction === "up"
              ? "text-emerald-600 bg-emerald-50 ring-1 ring-emerald-200"
              : "text-red-600 bg-red-50 ring-1 ring-red-200",
          )}
        >
          {direction === "up" ? "▲" : "▼"}
        </span>
      )}
    </span>
  );
};
