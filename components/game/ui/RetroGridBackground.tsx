import { motion } from "framer-motion";

// Copied from app/play/page.tsx
export const RetroGridBackground = () => (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute inset-0"
        style={{
          backgroundImage: `
            linear-gradient(to right, rgba(147, 51, 234, 0.1) 1px, transparent 1px),
            linear-gradient(to bottom, rgba(147, 51, 234, 0.1) 1px, transparent 1px)
          `,
          backgroundSize: "40px 40px",
          perspective: "1000px",
          transformStyle: "preserve-3d",
        }}
        animate={{
          backgroundPosition: ["0px 0px", "40px 40px"],
        }}
        transition={{ repeat: Infinity, duration: 20, ease: "linear" }}
      />

      {/* Horizon line */}
      <div
        className="absolute w-full h-[1px] bg-gradient-to-r from-purple-500/0 via-purple-500/30 to-purple-500/0"
        style={{ bottom: "30%", transform: "translateY(0.5px)" }}
      />

      {/* Horizontal perspective lines */}
      {Array.from({ length: 10 }).map((_, i) => (
        <div
          key={`h-line-${i}`}
          className="absolute w-full h-[1px] bg-purple-500/10"
          style={{
            bottom: `${30 + i * 7}%`,
            transform: `scaleX(${1 - i * 0.1}) translateY(0.5px)`,
          }}
        />
      ))}

      {/* Vertical perspective lines */}
      {Array.from({ length: 21 }).map((_, i) => (
        <div
          key={`v-line-${i}`}
          className="absolute h-[30%] w-[1px] bg-purple-500/10"
          style={{
            bottom: 0,
            left: `${i * 5}%`,
            transformOrigin: "bottom center",
            transform: "perspective(1000px) rotateX(60deg)",
          }}
        />
      ))}

      {/* Sun/sphere in background */}
      <motion.div
        className="absolute w-40 h-40 rounded-full bg-gradient-to-b from-purple-500 to-fuchsia-600"
        style={{
          bottom: "35%",
          left: "50%",
          transform: "translateX(-50%)",
          filter: "blur(20px)",
        }}
        animate={{
          opacity: [0.5, 0.7, 0.5],
          scale: [1, 1.1, 1],
        }}
        transition={{ repeat: Infinity, duration: 10, ease: "easeInOut" }}
      />
    </div>
  ); 