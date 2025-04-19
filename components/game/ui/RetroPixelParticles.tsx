import { motion } from "framer-motion";

interface RetroPixelParticlesProps {
  count?: number;
  color?: string;
}

export const RetroPixelParticles = ({
  count = 10,
  color = "bg-purple-400",
}: RetroPixelParticlesProps) => (
  <>
    {Array.from({ length: count }).map((_, i) => (
      <motion.div
        key={`pixel-${i}`}
        className={`absolute w-1 h-1 ${color}`}
        style={{
          left: `${Math.random() * 100}%`,
          top: `${Math.random() * 100}%`,
        }}
        animate={{
          y: [0, Math.random() * -30 - 10],
          x: [0, (Math.random() - 0.5) * 20],
          opacity: [1, 0],
        }}
        transition={{
          duration: 0.8 + Math.random() * 0.7,
          repeat: Infinity,
          repeatDelay: Math.random() * 2,
        }}
      />
    ))}
  </>
); 