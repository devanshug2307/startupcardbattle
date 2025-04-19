"use client";

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils'; // Assuming utils are moved
import { Swords, LucideIcon } from 'lucide-react'; // Added LucideIcon

// TEMP: Define types locally until moved to lib/types.ts
type StartupCard = {
  name: string;
  category: string;
  founded: number;
  power: number;
  timeToUnicorn: number;
  valuation: number;
  icon?: string | LucideIcon;
  [key: string]: string | number | LucideIcon | undefined;
};

// TEMP: Copy constants locally until moved to lib/constants.ts
const pixelBorderStyles = {
  position: "relative",
  "&::before": {
    content: '""',
    position: "absolute",
    inset: "-2px",
    background: "linear-gradient(45deg, #ffffff20, #ffffff10)",
    padding: "2px",
    borderRadius: "4px",
    mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
    maskComposite: "exclude",
  },
} as const;

const retroCardSelectionAnimations = {
    card: {
      initial: (i: number) => ({
        opacity: 0,
        y: 50,
        scale: 0.9,
        rotateX: -15,
      }),
      animate: (i: number) => ({
        opacity: 1,
        y: 0,
        scale: 1,
        rotateX: 0,
        transition: {
          duration: 0.4,
          delay: i * 0.1,
          ease: "easeOut",
        },
      }),
      hover: {
        y: -5,
        scale: 1.02,
        transition: {
          duration: 0.2,
          ease: "easeInOut",
        },
      },
    },
    gridLines: {
      initial: { opacity: 0, scale: 0.95 },
      animate: {
        opacity: 1,
        scale: 1,
        transition: {
          duration: 0.8,
        },
      },
    },
    cardContainer: {
      initial: { opacity: 0 },
      animate: {
        opacity: 1,
        transition: {
          staggerChildren: 0.1,
        },
      },
      exit: {
        opacity: 0,
        transition: {
          duration: 0.3,
        },
      },
    },
  };


interface SelectPhaseProps {
  playerDeck: StartupCard[];
  selectedCards: StartupCard[];
  handleCardSelect: (card: StartupCard) => void;
  startGame: () => void;
  isLoading: boolean; // Add isLoading prop
  // Note: For now, we assume CardComponent and FloatingCounter are defined *within* or imported by this component.
  // These should be extracted in subsequent steps (4a optional sub-steps).
}

export const SelectPhase: React.FC<SelectPhaseProps> = ({
  playerDeck,
  selectedCards,
  handleCardSelect,
  startGame,
  isLoading, // Receive isLoading prop
}) => {

  // TEMP: Keep CardComponent definition here until extracted
  const CardComponent = ({
    card,
    isSelected,
    onSelect,
    index,
  }: {
    card: StartupCard;
    isSelected: boolean;
    onSelect: () => void;
    index: number;
  }) => (
      <motion.div
        variants={retroCardSelectionAnimations.card}
        initial="initial"
        animate="animate"
        whileHover="hover"
        custom={index}
        onClick={onSelect}
        className={cn(
          "relative cursor-pointer transform-gpu",
          "transition-all duration-300",
        )}
      >
        {/* Card Frame with Pixel Corners */}
        <div
          className={cn(
            "relative overflow-hidden",
            isSelected
              ? "ring-4 ring-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
              : "ring-1 ring-purple-900/50",
          )}
          style={{
            clipPath:
              "polygon(0 8px, 8px 0, calc(100% - 8px) 0, 100% 8px, 100% calc(100% - 8px), calc(100% - 8px) 100%, 8px 100%, 0 calc(100% - 8px))",
          }}
        >
          {/* Inner Background with Grid */}
          <div className="absolute inset-0 bg-gradient-to-br from-gray-900 to-black">
            <div
              className="absolute inset-0"
              style={{
                backgroundImage: `
                linear-gradient(to right, rgba(147, 51, 234, 0.05) 1px, transparent 1px),
                linear-gradient(to bottom, rgba(147, 51, 234, 0.05) 1px, transparent 1px)
              `,
                backgroundSize: "8px 8px",
              }}
            />
          </div>

          {/* Selection Indicator Border Effects */}
          {isSelected && (
            <>
              <motion.div
                className="absolute inset-0 z-10"
                style={{
                  background: "transparent",
                  border: "2px dashed rgba(168, 85, 247, 0.7)",
                  margin: "4px",
                }}
                animate={{
                  opacity: [0.4, 1, 0.4],
                  boxShadow: [
                    "0 0 5px rgba(168, 85, 247, 0.3)",
                    "0 0 10px rgba(168, 85, 247, 0.5)",
                    "0 0 5px rgba(168, 85, 247, 0.3)",
                  ],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              />
              <motion.div
                className="absolute z-10"
                style={{
                  width: "12px",
                  height: "12px",
                  background: "rgba(168, 85, 247, 0.8)",
                  top: "0",
                  left: "0",
                  margin: "8px",
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
              <motion.div
                className="absolute z-10"
                style={{
                  width: "12px",
                  height: "12px",
                  background: "rgba(168, 85, 247, 0.8)",
                  top: "0",
                  right: "0",
                  margin: "8px",
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
              />
              <motion.div
                className="absolute z-10"
                style={{
                  width: "12px",
                  height: "12px",
                  background: "rgba(168, 85, 247, 0.8)",
                  bottom: "0",
                  left: "0",
                  margin: "8px",
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
              />
              <motion.div
                className="absolute z-10"
                style={{
                  width: "12px",
                  height: "12px",
                  background: "rgba(168, 85, 247, 0.8)",
                  bottom: "0",
                  right: "0",
                  margin: "8px",
                }}
                animate={{
                  opacity: [0.6, 1, 0.6],
                }}
                transition={{ duration: 1.5, repeat: Infinity, delay: 0.9 }}
              />
            </>
          )}

          {/* Scanlines Effect */}
          <div
            className="absolute inset-0 opacity-10 pointer-events-none z-20"
            style={{
              backgroundImage:
                "linear-gradient(0deg, rgba(255,255,255,0.15) 1px, transparent 1px)",
              backgroundSize: "2px 4px",
            }}
          />

          {/* Card Content */}
          <div className="relative p-4 z-10">
            {/* Card Header With Retro Typography */}
            <div className="mb-3">
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-mono font-bold text-base md:text-lg text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-pink-400">
                  {card.name}
                </h3>
                <div className="flex items-center space-x-1">
                  {Array.from({
                    length: Math.min(5, Math.ceil(card.power / 2)),
                  }).map((_, i) => (
                    <div
                      key={`star-${i}`}
                      className="w-2 h-2 bg-purple-500"
                      style={{
                        clipPath:
                          "polygon(50% 0%, 61% 35%, 98% 35%, 68% 57%, 79% 91%, 50% 70%, 21% 91%, 32% 57%, 2% 35%, 39% 35%)",
                      }}
                    />
                  ))}
                </div>
              </div>
              <div className="flex justify-between">
                <div className="text-[10px] md:text-xs text-gray-400 uppercase font-mono">
                  {card.category}
                </div>
                <div className="text-[10px] md:text-xs text-purple-400 font-mono">
                  LEVEL {Math.ceil(card.valuation / 40)}
                </div>
              </div>
            </div>

            {/* Custom Power Display */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 bg-green-500"
                    style={{
                      clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)",
                    }}
                  />
                  <span className="text-xs font-mono text-gray-300 uppercase">
                    Power
                  </span>
                </div>
                <span className="text-xs md:text-sm font-mono font-bold text-green-400">
                   {card.power}
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-green-800 to-green-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(card.power / 10) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </div>

            {/* Founded Year */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 bg-blue-500"
                    style={{
                      clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%)",
                    }}
                  />
                  <span className="text-xs font-mono text-gray-300 uppercase">
                    Founded
                  </span>
                </div>
                <span className="text-xs md:text-sm font-mono font-bold text-blue-400">
                  {card.founded}
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-blue-800 to-blue-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${((2025 - card.founded) / 25) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </div>

            {/* Unicorn Time */}
            <div className="mb-3">
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 bg-purple-500"
                    style={{
                      clipPath:
                        "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
                    }}
                  />
                  <span className="text-xs font-mono text-gray-300 uppercase">
                    Unicorn
                  </span>
                </div>
                <span className="text-xs md:text-sm font-mono font-bold text-purple-400">
                   {card.timeToUnicorn}y
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-purple-800 to-purple-500"
                  initial={{ width: 0 }}
                  animate={{
                    width: `${((15 - card.timeToUnicorn) / 15) * 100}%`,
                  }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </div>

            {/* Valuation */}
            <div>
              <div className="flex justify-between items-center mb-1">
                <div className="flex items-center gap-1.5">
                  <div
                    className="w-3 h-3 bg-yellow-500"
                    style={{
                      clipPath:
                        "polygon(50% 0%, 100% 38%, 82% 100%, 18% 100%, 0% 38%)",
                    }}
                  />
                  <span className="text-xs font-mono text-gray-300 uppercase">
                    Value
                  </span>
                </div>
                <span className="text-xs md:text-sm font-mono font-bold text-yellow-400">
                   ${card.valuation}B
                </span>
              </div>
              <div className="h-1.5 bg-gray-800 overflow-hidden">
                <motion.div
                  className="h-full bg-gradient-to-r from-yellow-800 to-yellow-500"
                  initial={{ width: 0 }}
                  animate={{ width: `${(card.valuation / 200) * 100}%` }}
                  transition={{ duration: 1, delay: index * 0.1 }}
                />
              </div>
            </div>

            {/* Card selection corners */}
            {isSelected && (
              <>
                <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-purple-400" />
                <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-purple-400" />
                <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-purple-400" />
                <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-purple-400" />
              </>
            )}
          </div>

          {/* Hover shine effect */}
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent z-20"
            style={{ width: "150%", left: "-25%" }}
            initial={{ x: "-100%" }}
            whileHover={{ x: "100%" }}
            transition={{ duration: 0.5 }}
          />
        </div>
      </motion.div>
    );


  // TEMP: Keep FloatingCounter definition here until extracted
  const FloatingCounter = () => (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="fixed bottom-4 left-1/2 -translate-x-1/2 z-40"
      >
        <div
          className="bg-black/80 backdrop-blur-sm px-6 py-3 border border-purple-500/30"
          style={{
            ...pixelBorderStyles,
            boxShadow: "0 0 10px rgba(147, 51, 234, 0.3)",
          }}
        >
          <div className="flex items-center gap-4">
            <div className="flex -space-x-2">
              {Array.from({ length: 4 }).map((_, i) => (
                <div
                  key={i}
                  className={cn(
                    "w-8 h-8 flex items-center justify-center text-sm font-bold relative overflow-hidden",
                    selectedCards[i]
                      ? "bg-gradient-to-r from-purple-600 to-pink-600 text-white"
                      : "bg-gray-800 text-gray-600",
                  )}
                  style={{ ...pixelBorderStyles }}
                >
                  {selectedCards[i] && (
                    <motion.div
                      className="absolute inset-0 bg-white/20"
                      animate={{
                        x: ["-100%", "100%"],
                      }}
                      transition={{
                        duration: 1,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                  )}
                  <span className="relative z-10">
                    {selectedCards[i] ? i + 1 : ""}
                  </span>
                </div>
              ))}
            </div>
            <div className="relative">
              <span className="text-purple-300 font-mono font-bold">
                {selectedCards.length}/4 SELECTED
              </span>
              {/* Blinking cursor */}
              <motion.span
                className="inline-block w-2 h-4 bg-purple-400 ml-1"
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
            </div>
          </div>
        </div>
      </motion.div>
    );


  return (
    <motion.div
      variants={retroCardSelectionAnimations.cardContainer}
      initial="initial"
      animate="animate"
      exit="exit"
      className="relative w-full max-w-7xl mx-auto px-4 py-8 overflow-hidden"
    >
      {/* Additional retro VHS effects */}
      <div className="absolute inset-0 pointer-events-none z-0">
        {/* CRT scan line */}
        <motion.div
          className="absolute left-0 right-0 h-[3px] bg-purple-500/20"
          animate={{
            top: ["0%", "100%"],
            opacity: [0.3, 0.5, 0.3],
          }}
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "linear",
          }}
        />

        {/* Random glitches */}
        <motion.div
          className="absolute inset-0 bg-purple-500/5 mix-blend-overlay"
          animate={{
            opacity: [0, 0.05, 0, 0.08, 0],
          }}
          transition={{
            repeat: Infinity,
            duration: 10,
            times: [0, 0.2, 0.3, 0.35, 0.5],
            repeatType: "reverse",
          }}
        />
      </div>

      {/* Glowing text effect header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-center mb-12 relative"
      >
        <h1 className="font-mono text-5xl md:text-6xl font-bold relative tracking-tight py-2">
          {/* Main text with gradient */}
          <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-fuchsia-200 to-purple-300">
            SELECT BATTLE DECK
          </span>

          {/* Text glow */}
          <motion.span
            className="absolute inset-0 blur-md bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-400 z-0"
            animate={{ opacity: [0.5, 0.8, 0.5] }}
            transition={{ duration: 2, repeat: Infinity }}
          >
            SELECT BATTLE DECK
          </motion.span>
        </h1>

        {/* Subtitle with scanline effect */}
        <div className="relative mt-2">
          <p className="text-lg font-mono text-purple-200 tracking-wide">
            CHOOSE 4 STARTUP CARDS FOR YOUR DECK
          </p>
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-400/20 to-transparent"
            animate={{ x: ["-100%", "100%"] }}
            transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
          />
        </div>

        {/* Decorative pixel elements */}
        <div className="absolute top-0 left-1/2 w-8 h-1 bg-purple-500 -translate-x-1/2 -translate-y-4" />
        <div className="absolute bottom-0 left-1/2 w-8 h-1 bg-purple-500 -translate-x-1/2 translate-y-4" />
      </motion.div>

      {/* Add game rules with retro styling */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="mb-6 max-w-2xl mx-auto"
        style={{ boxShadow: "0 0 20px rgba(147, 51, 234, 0.2)" }}
      >
        <div
          className="bg-black/60 backdrop-blur-sm border border-purple-500/40 p-3"
          style={{ ...pixelBorderStyles }}
        >
          <h3 className="text-xl font-mono mb-2 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-teal-300">
            BATTLE RULES
          </h3>

          <div className="flex justify-center gap-8 font-mono">
            <div className="flex items-center gap-2">
              <span className="text-green-400 font-bold">HIGHER WINS ↗️</span>
              <span className="text-green-200/80">VALUATION • POWER</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-blue-400 font-bold">LOWER WINS ↙️</span>
              <span className="text-blue-200/80">FOUNDED • UNICORN</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Cards grid with retro styling */}
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-4 gap-4 md:gap-6">
        {playerDeck.slice(0, 8).map((card, index) => (
          <CardComponent
            key={card.name}
            card={card}
            isSelected={selectedCards.includes(card)}
            onSelect={() => handleCardSelect(card)}
            index={index}
          />
        ))}
      </div>

      {/* Retro pixel footer decoration */}
      <div className="w-full flex justify-center mt-12 mb-24">
        <div className="flex space-x-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <motion.div
              key={`pixel-${i}`}
              className="h-2 w-2 md:h-3 md:w-3 bg-purple-500"
              animate={{
                opacity: [0.3, 1, 0.3],
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: i * 0.3,
                ease: "easeInOut",
              }}
            />
          ))}
        </div>
      </div>

      {/* Render the floating counter */}
      <FloatingCounter />

      {/* Enhanced Start Battle Button */}
      <AnimatePresence>
        {selectedCards.length === 4 && !isLoading && ( // Check isLoading state
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            className="fixed bottom-20 left-1/2 -translate-x-1/2 z-40"
          >
            <motion.button
              onClick={startGame}
              className="relative px-8 py-4 bg-gradient-to-r from-purple-600 to-pink-600 font-mono font-bold text-lg text-white overflow-hidden"
              style={{
                ...pixelBorderStyles,
                boxShadow: "0 0 15px rgba(147, 51, 234, 0.4)",
              }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 20px rgba(147, 51, 234, 0.6)",
              }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Animated scanlines effect */}
              <div className="absolute inset-0 overflow-hidden opacity-10">
                <div
                  style={{
                    backgroundImage:
                      "repeating-linear-gradient(0deg, rgba(255,255,255,0.3) 0px, rgba(255,255,255,0.3) 1px, transparent 1px, transparent 2px)",
                    backgroundSize: "2px 2px",
                    height: "100%",
                  }}
                />
              </div>

              {/* Shine effect */}
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                style={{ width: "100%" }}
                animate={{ x: ["-100%", "100%"] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  repeatDelay: 2,
                }}
              />

              {/* Button content */}
              <div className="relative z-10 flex items-center gap-3">
                <Swords className="w-6 h-6" />
                <span className="tracking-wider">LAUNCH BATTLE</span>
              </div>

              {/* Pixel corner accents */}
              <div className="absolute top-0 left-0 w-3 h-3 border-t-2 border-l-2 border-white/50" />
              <div className="absolute top-0 right-0 w-3 h-3 border-t-2 border-r-2 border-white/50" />
              <div className="absolute bottom-0 left-0 w-3 h-3 border-b-2 border-l-2 border-white/50" />
              <div className="absolute bottom-0 right-0 w-3 h-3 border-b-2 border-r-2 border-white/50" />
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>
      {/* Loading indicator */}
      {isLoading && (
         <motion.div
           initial={{ opacity: 0 }}
           animate={{ opacity: 1 }}
           exit={{ opacity: 0 }}
           className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 text-purple-300 font-mono"
         >
           LOADING...
         </motion.div>
      )}
    </motion.div>
  );
}; 