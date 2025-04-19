import { motion, AnimatePresence } from "framer-motion";

// Copied from app/play/page.tsx
const retroAnimations = {
  attackPixels: {
    player: {
      initial: { opacity: 0 },
      animate: {
        opacity: [0, 1, 0],
        x: [0, 50, 100],
        transition: { duration: 0.5 },
      },
    },
    ai: {
      initial: { opacity: 0 },
      animate: {
        opacity: [0, 1, 0],
        x: [0, -50, -100],
        transition: { duration: 0.5 },
      },
    },
  },
  // Other retroAnimations properties might be needed if used here, copy them as necessary
};

interface PixelAttackEffectProps {
  isPlayer?: boolean;
  isActive?: boolean;
}

export const PixelAttackEffect = ({ isPlayer = true, isActive = false }: PixelAttackEffectProps) => (
  <AnimatePresence>
    {isActive && (
      <motion.div
        className="absolute inset-0 overflow-hidden pointer-events-none z-20"
        initial="initial"
        animate="animate"
        exit="initial"
        variants={
          isPlayer
            ? retroAnimations.attackPixels.player
            : retroAnimations.attackPixels.ai
        }
      >
        {Array.from({ length: 15 }).map((_, i) => (
          <motion.div
            key={`attack-pixel-${i}`}
            className={`absolute w-2 h-2 ${
              isPlayer ? "bg-purple-400" : "bg-red-400"
            }`}
            style={{
              left: isPlayer ? "20%" : "80%",
              top: `${20 + i * 4}%`,
              opacity: Math.random() * 0.7 + 0.3,
            }}
            animate={{
              x: isPlayer ? [0, 100] : [0, -100],
              y: [(Math.random() - 0.5) * 20, (Math.random() - 0.5) * 40],
              opacity: [0.7, 0],
            }}
            transition={{
              duration: 0.4,
              delay: i * 0.02,
            }}
          />
        ))}
      </motion.div>
    )}
  </AnimatePresence>
); 