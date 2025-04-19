"use client";

import React, { ReactNode, useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export interface OrbitingCirclesProps {
  children: ReactNode;
  radius?: number;
  duration?: number;
  delay?: number;
  reverse?: boolean;
  className?: string;
  hideCircle?: boolean;
  glowEffect?: boolean;
  glowColor?: string;
  trailEffect?: boolean;
  trailCount?: number;
  pathColor?: string;
  pulseEffect?: boolean;
}

export function OrbitingCircles({
  children,
  radius = 150,
  duration = 20,
  delay = 0,
  reverse = false,
  className,
  hideCircle = false,
  glowEffect = false,
  glowColor = "blue-500",
  trailEffect = false,
  trailCount = 5,
  pathColor,
  pulseEffect = false,
}: OrbitingCirclesProps) {
  const [mounted, setMounted] = useState(false);

  // Only animate after component is mounted to prevent hydration issues
  useEffect(() => {
    setMounted(true);
  }, []);

  // Calculate path
  const path = {
    x: reverse
      ? [-radius, 0, radius, 0, -radius]
      : [radius, 0, -radius, 0, radius],
    y: [0, -radius, 0, radius, 0],
  };

  const pathTransition = {
    duration,
    ease: "linear",
    repeat: Infinity,
    delay,
  };

  // Generate trail elements
  const trailElements = () => {
    if (!trailEffect || !mounted) return null;

    return Array.from({ length: trailCount }).map((_, i) => {
      const trailDelay = i * 0.3; // Staggered delay for each trail element
      const scale = 1 - i * 0.15; // Diminishing scale for each trail element

      return (
        <motion.div
          key={`trail-${i}`}
          className={cn(
            "absolute rounded-full",
            hideCircle ? "bg-transparent" : `bg-${glowColor}/30`,
          )}
          style={{
            width: i === 0 ? 28 : 16,
            height: i === 0 ? 28 : 16,
            opacity: 1 - i * 0.15, // Diminishing opacity
          }}
          animate={{
            ...path,
            scale: [scale, scale * 0.9, scale],
          }}
          transition={{
            ...pathTransition,
            delay: delay + trailDelay,
          }}
        />
      );
    });
  };

  return (
    <div
      className={cn("relative", className)}
      style={{ width: radius * 2, height: radius * 2 }}
    >
      {/* Orbiting path visualization */}
      {pathColor && mounted && (
        <motion.div
          className={`absolute inset-0 rounded-full border border-${pathColor} opacity-40`}
          style={{
            width: radius * 2,
            height: radius * 2,
            top: -radius,
            left: -radius,
          }}
          animate={
            pulseEffect
              ? {
                  scale: [1, 1.02, 1],
                  opacity: [0.3, 0.5, 0.3],
                }
              : {}
          }
          transition={
            pulseEffect
              ? {
                  duration: 3,
                  repeat: Infinity,
                  ease: "easeInOut",
                }
              : {}
          }
        />
      )}

      {/* Trail elements */}
      {mounted && trailEffect && trailElements()}

      {/* Main orbiting element */}
      {mounted && (
        <motion.div
          className={cn(
            "absolute flex items-center justify-center",
            glowEffect ? `shadow-md shadow-${glowColor}` : "",
          )}
          style={{
            width: 40,
            height: 40,
            filter: glowEffect
              ? `drop-shadow(0 0 5px var(--${glowColor.replace("-", "-")}))`
              : undefined,
          }}
          animate={path}
          transition={pathTransition}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            {!hideCircle && (
              <div
                className={cn("w-8 h-8 rounded-full", `bg-${glowColor}/60`)}
              />
            )}
            <div className={cn("relative z-10")}>{children}</div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
