import { motion } from "framer-motion";

// Copied from app/play/page.tsx
const retroAnimations = {
  scanlines: {
    opacity: 0.1,
    backgroundImage:
      "linear-gradient(to bottom, transparent 50%, rgba(0, 0, 0, 0.5) 50%)",
    backgroundSize: "100% 4px",
    position: "absolute" as const, // Type assertion to fix position property
    inset: 0,
    pointerEvents: "none" as const, // Type assertion for pointerEvents
    zIndex: 40,
  },
  // Other retroAnimations properties might be needed if used here, copy them as necessary
};

export const CRTEffect = () => (
  <>
    <div style={retroAnimations.scanlines} />
    <div
      className="absolute inset-0 pointer-events-none z-40 rounded-lg"
      style={{
        background:
          "radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
        mixBlendMode: "overlay",
      }}
    />
    <div
      className="absolute inset-0 pointer-events-none z-40"
      style={{
        boxShadow: "inset 0 0 30px rgba(0,0,0,0.5)",
        borderRadius: "inherit",
      }}
    />
  </>
); 