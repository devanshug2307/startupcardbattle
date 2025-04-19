"use client";

import { useState, useEffect, Suspense } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { motion, AnimatePresence } from "framer-motion";
import {
  Trophy,
  ArrowLeft,
  Share2,
  Twitter,
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  Share,
  Download,
  Layout,
  Banknote,
  ShoppingBag,
  Cloud,
  GraduationCap,
  Swords,
  Shield,
  InfoIcon,
  Calendar,
  ChevronDown,
  Lightbulb,
  Rocket,
  TrendingDown,
  Clock,
  Volume2,
  VolumeX,
  X,
  ArrowUpCircle,
  ArrowDownCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { startupData } from "@/lib/game-data";
import {
  cn,
  formatPower,
  formatTimeToUnicorn,
  formatValuation,
  playSfx,
} from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import html2canvas from "html2canvas";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";
import Image from "next/image";
import { LucideIcon } from "lucide-react";
import React from "react";
import { SelectPhase } from "@/components/game/SelectPhase"; // Import the new component
import { CRTEffect } from "@/components/game/ui/CRTEffect"; // Import new component
import { RetroPixelParticles } from "@/components/game/ui/RetroPixelParticles"; // Import new component
import { RetroGridBackground } from "@/components/game/ui/RetroGridBackground"; // Import new component
import { PixelAttackEffect } from "@/components/game/ui/PixelAttackEffect"; // Import new component
import {
  getDateSeed,
  deterministicShuffle,
  getMaxValue,
  getBattleGuideText,
  formatAttributeValue,
  isLucideIcon,
  compareAttribute,
  StartupCard, // Import type from new location
} from "@/lib/game-utils"; // Import from new utils file
import { BattleRoundsSummary } from "@/components/game/BattleRoundsSummary"; // Import the new component

// First, let's add proper type definitions at the top of the file
type StartupCard = {
  name: string;
  category: string;
  founded: number;
  power: number;
  timeToUnicorn: number;
  valuation: number;
  icon?: string | LucideIcon;
  // Make index signature more specific if possible, or handle potential non-numeric/string values
  // For now, we rely on functions using this to handle the specific keys they need
  [key: string]: string | number | LucideIcon | undefined;
};

// Add these types at the top of the file
interface Category {
  name: string;
  icon: LucideIcon;
  colors: {
    from: string;
    to: string;
    iconColor: string;
    activeText?: string; // Make activeText optional
  };
}

// Add these new animation variants at the top
const battleAnimationVariants = {
  playerCard: {
    initial: { x: -100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: -100, opacity: 0 },
  },
  aiCard: {
    initial: { x: 100, opacity: 0 },
    animate: { x: 0, opacity: 1 },
    exit: { x: 100, opacity: 0 },
  },
  attack: {
    initial: { scale: 1 },
    animate: {
      scale: [1, 1.2, 0.9, 1],
      rotate: [0, -5, 5, 0],
    },
  },
  statsReveal: {
    initial: { width: 0 },
    animate: { width: "100%" },
  },
};

// First, add these new animation variants at the top of the file
const cardAnimationVariants = {
  ...battleAnimationVariants,
  shine: {
    initial: { x: "-100%" },
    animate: {
      x: ["-100%", "100%"],
      transition: {
        repeat: Infinity,
        duration: 2,
        ease: "linear",
        repeatDelay: 1,
      },
    },
  },
  hover: {
    initial: { y: 0 },
    animate: {
      y: [-5, 5, -5],
      transition: {
        repeat: Infinity,
        duration: 4,
        ease: "easeInOut",
      },
    },
  },
  attack: {
    player: {
      animate: {
        x: [0, 50, 0],
        rotate: [0, 5, 0],
        transition: { duration: 0.5 },
      },
    },
    ai: {
      animate: {
        x: [0, -50, 0],
        rotate: [0, -5, 0],
        transition: { duration: 0.5 },
      },
    },
  },
};

// Add portal configuration
// REMOVE START
// const PORTAL_CONFIG = {
//   exitPortalUrl: "http://portal.pieter.com",
//   defaultColor: "purple",
//   defaultSpeed: 1,
//   gameRef: "https://cardbattle.online",
// };
// REMOVE END

// Add these new types near the top of the file
interface BattleMetric {
  name: string;
  power: number;
  accuracy: number;
  icon: LucideIcon;
}

// Add pixel border styles
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

// Add this helper function to get max values for the progress bars
function getMaxValue(key: string): number {
  switch (key) {
    case "power":
      return 10; // Max power level
    case "founded":
      return 2025; // Current year
    case "timeToUnicorn":
      return 15; // Max years to unicorn
    case "valuation":
      return 200; // Max valuation in billions
    default:
      return 100;
  }
}

// First, add this helper function at the top of the file
const getBattleGuideText = (attribute: string) => {
  switch (attribute) {
    case "power":
      return "Higher power shows stronger market performance";
    case "founded":
      return "More recent founding year indicates newer technology";
    case "timeToUnicorn":
      return "Faster unicorn status shows rapid growth";
    case "valuation":
      return "Higher valuation indicates market dominance";
    default:
      return "Select an attribute to battle!";
  }
};

// Replace the enhancedCardAnimations object with this retro-styled version
const enhancedCardAnimations = {
  glow: {
    initial: { boxShadow: "0 0 0 rgba(168, 85, 247, 0)" },
    animate: {
      boxShadow: [
        "0 0 0 rgba(168, 85, 247, 0)",
        "0 0 0 2px rgba(168, 85, 247, 0.3)",
        "0 0 0 rgba(168, 85, 247, 0)",
      ],
      transition: {
        duration: 1.5,
        repeat: Infinity,
        repeatType: "reverse" as const, // Type assertion to fix repeatType
      },
    },
    win: {
      boxShadow: [
        "0 0 0 rgba(34, 197, 94, 0)",
        "0 0 0 3px rgba(34, 197, 94, 0.5)",
        "0 0 0 rgba(34, 197, 94, 0)",
      ],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
    lose: {
      boxShadow: [
        "0 0 0 rgba(239, 68, 68, 0)",
        "0 0 0 3px rgba(239, 68, 68, 0.5)",
        "0 0 0 rgba(239, 68, 68, 0)",
      ],
      transition: {
        duration: 0.8,
        repeat: Infinity,
        repeatType: "reverse" as const,
      },
    },
  },
  attack: {
    player: {
      initial: { x: 0, rotate: 0 },
      animate: {
        x: [0, 15, 0, 5, 0],
        rotate: [0, 2, 0, 1, 0],
        transition: { duration: 0.4 },
      },
    },
    ai: {
      initial: { x: 0, rotate: 0 },
      animate: {
        x: [0, -15, 0, -5, 0],
        rotate: [0, -2, 0, -1, 0],
        transition: { duration: 0.4 },
      },
    },
  },
  statHighlight: {
    initial: { backgroundColor: "rgba(139, 92, 246, 0)" },
    animate: {
      backgroundColor: [
        "rgba(139, 92, 246, 0)",
        "rgba(139, 92, 246, 0.3)",
        "rgba(139, 92, 246, 0)",
      ],
      transition: { duration: 0.8, repeat: Infinity },
    },
  },
  pixelShine: {
    initial: { opacity: 0 },
    animate: {
      opacity: [0, 1, 0],
      transition: { duration: 0.3, repeat: Infinity, repeatDelay: 2 },
    },
  },
};

// Add this function to create retro pixel particles
const RetroPixelParticles = ({ count = 10, color = "bg-purple-400" }) => (
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

// Add these new retro animation variants
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
  pixelBorder: {
    initial: {
      borderColor: "rgba(168, 85, 247, 0.4)",
      borderStyle: "dashed",
    },
    animate: {
      borderColor: [
        "rgba(168, 85, 247, 0.4)",
        "rgba(168, 85, 247, 0.8)",
        "rgba(168, 85, 247, 0.4)",
      ],
      transition: { duration: 1.2, repeat: Infinity },
    },
    win: {
      borderColor: [
        "rgba(34, 197, 94, 0.4)",
        "rgba(34, 197, 94, 0.8)",
        "rgba(34, 197, 94, 0.4)",
      ],
      borderStyle: "solid",
      transition: { duration: 0.8, repeat: Infinity },
    },
    lose: {
      borderColor: [
        "rgba(239, 68, 68, 0.4)",
        "rgba(239, 68, 68, 0.8)",
        "rgba(239, 68, 68, 0.4)",
      ],
      borderStyle: "solid",
      transition: { duration: 0.8, repeat: Infinity },
    },
  },
  pixelFlash: {
    animate: {
      opacity: [0, 0.8, 0],
      scale: [0.8, 1.2, 0.8],
      transition: { duration: 0.3, repeat: Infinity, repeatDelay: 2 },
    },
  },
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
  crt: {
    on: {
      opacity: [0, 1],
      scale: [0.9, 1],
      filter: ["brightness(0) blur(10px)", "brightness(1) blur(0px)"],
      transition: { duration: 0.4 },
    },
    off: {
      opacity: [1, 0],
      scale: [1, 0.9],
      filter: ["brightness(1) blur(0px)", "brightness(0) blur(10px)"],
      transition: { duration: 0.3 },
    },
  },
};

// Add a CRT screen effect component
const CRTEffect = () => (
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

// Add a pixel attack effect component
const PixelAttackEffect = ({ isPlayer = true, isActive = false }) => (
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

// Update the formatAttributeValue function to better handle attribute access
const formatAttributeValue = (
  value: number | string | undefined | LucideIcon, // Accept LucideIcon
  attribute: string,
): string => {
  // Return placeholder if value is not suitable for formatting
  if (value === undefined || value === null || typeof value === 'object' || typeof value === 'function') {
    return "---";
  }

  // Now value is guaranteed to be string or number
  switch (attribute) {
    case "power":
      return formatPower(Number(value));
    case "timeToUnicorn":
      return formatTimeToUnicorn(Number(value));
    case "valuation":
      return formatValuation(Number(value));
    case "founded":
      return value.toString();
    default:
      return value.toString();
  }
};

// Update the BattleResultOverlay component to handle potential undefined values
const BattleResultOverlay = ({
  result,
  playerCard,
  aiCard,
  attribute,
  onNext,
  playerScore,
  aiScore,
}: {
  result: "win" | "lose" | "draw" | null;
  playerCard: StartupCard;
  aiCard: StartupCard;
  attribute: string;
  onNext: () => void;
  playerScore: number;
  aiScore: number;
}) => {
  // Play result sound when component mounts
  useEffect(() => {
    if (result === "win") {
      playSfx("result-win", 0.8);
    } else if (result === "lose") {
      playSfx("result-lose", 0.7);
    } else if (result === "draw") {
      playSfx("result-draw", 0.6);
    }
  }, [result]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="absolute inset-0 flex items-center justify-center z-30"
    >
      <motion.div
        className="absolute inset-0 bg-black/60"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onNext}
      />

      {/* Add CRT turn-on effect */}
      <motion.div
        className="absolute inset-0 bg-white/5 pointer-events-none"
        initial={{ opacity: 0 }}
        animate={{
          opacity: [0, 0.2, 0],
          scaleY: [1.5, 1],
        }}
        transition={{ duration: 0.3 }}
      />

      <motion.div
        className="pixel-corners border-2 bg-gray-900/90 p-1 relative overflow-hidden"
        style={{
          borderColor:
            result === "win"
              ? "#22c55e"
              : result === "lose"
                ? "#ef4444"
                : "#eab308",
        }}
        initial={{ y: -50, opacity: 0, scale: 0.8 }}
        animate={{ y: 0, opacity: 1, scale: 1 }}
        exit={{ y: 50, opacity: 0, scale: 0.8 }}
        transition={{ type: "spring", bounce: 0.4 }}
      >
        {/* Add scanlines effect */}
        <div style={retroAnimations.scanlines} />

        {/* Add horizontal scan effect */}
        <motion.div
          className="absolute left-0 right-0 h-[2px] bg-white/30 z-50 pointer-events-none"
          initial={{ top: 0, opacity: 0 }}
          animate={{
            top: ["0%", "100%"],
            opacity: [0.5, 0.5, 0],
          }}
          transition={{ duration: 1, times: [0, 0.9, 1] }}
        />

        <div className="p-6 md:p-8 relative">
          {/* Victory/Defeat Text */}
          <motion.div
            className={`text-3xl md:text-4xl font-bold pixel-text ${
              result === "win"
                ? "text-green-400"
                : result === "lose"
                  ? "text-red-400"
                  : "text-yellow-400"
            }`}
            style={{
              textShadow: "3px 3px 0 #000",
            }}
            animate={{
              scale: [1, 1.1, 1],
              x: result === "win" ? [0, -2, 2, -2, 0] : 0,
            }}
            transition={{
              scale: { duration: 0.6, repeat: 1 },
              x: { duration: 0.3, delay: 0.6 },
            }}
          >
            {result === "win"
              ? "VICTORY!"
              : result === "lose"
                ? "DEFEATED!"
                : "DRAW!"}
          </motion.div>

          {/* Attribute Comparison */}
          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="text-center">
              <div className="text-purple-400 mb-2">YOUR CARD</div>
              <div className="font-bold text-lg mb-1">
                {playerCard?.name || "Unknown"}
              </div>
              <div
                className={cn(
                  "text-2xl font-bold",
                  result === "win"
                    ? "text-green-400"
                    : result === "lose"
                      ? "text-red-400"
                      : "text-yellow-400",
                )}
              >
                {formatAttributeValue(playerCard?.[attribute], attribute)}
              </div>
            </div>
            <div className="text-center">
              <div className="text-red-400 mb-2">AI CARD</div>
              <div className="font-bold text-lg mb-1">
                {aiCard?.name || "Unknown"}
              </div>
              <div
                className={cn(
                  "text-2xl font-bold",
                  result === "lose"
                    ? "text-green-400"
                    : result === "win"
                      ? "text-red-400"
                      : "text-yellow-400",
                )}
              >
                {formatAttributeValue(aiCard?.[attribute], attribute)}
              </div>
            </div>
          </div>

          {/* Add retro pixel particles */}
          <div className="absolute inset-0 overflow-hidden">
            <RetroPixelParticles
              count={20}
              color={
                result === "win"
                  ? "bg-green-400"
                  : result === "lose"
                    ? "bg-red-400"
                    : "bg-yellow-400"
              }
            />
          </div>

          {/* Add 8-bit style score display */}
          <div className="mt-6 flex justify-center items-center gap-4">
            <div className="pixel-corners bg-gray-800/80 px-3 py-1">
              <div className="text-sm text-gray-400">YOU</div>
              <div className="text-xl text-green-400 font-bold text-center">
                {playerScore}
              </div>
            </div>
            <div className="text-xl text-white">-</div>
            <div className="pixel-corners bg-gray-800/80 px-3 py-1">
              <div className="text-sm text-gray-400">CPU</div>
              <div className="text-xl text-red-400 font-bold text-center">
                {aiScore}
              </div>
            </div>
          </div>

          <motion.div
            className="mt-4 flex justify-center items-center gap-2"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                className="w-2 h-2 bg-white/80 rounded-full"
                animate={{ opacity: [0.3, 1, 0.3] }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
              />
            ))}
          </motion.div>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Assuming your main content is in a component, let's wrap it in Suspense
function PlayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [gameState, setGameState] = useState<"select" | "battle" | "result">(
    "select",
  );
  const [playerDeck, setPlayerDeck] = useState<StartupCard[]>([]);
  const [aiDeck, setAiDeck] = useState<StartupCard[]>([]);
  const [selectedCards, setSelectedCards] = useState<StartupCard[]>([]);
  const [currentRound, setCurrentRound] = useState(1);
  const [playerScore, setPlayerScore] = useState(0);
  const [aiScore, setAiScore] = useState(0);
  const [battleAttribute, setBattleAttribute] = useState<string | null>(null);
  const [battleResult, setBattleResult] = useState<
    "win" | "lose" | "draw" | null
  >(null);
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const [timeLeft, setTimeLeft] = useState(15);
  const [isTimerActive, setIsTimerActive] = useState(false);
  const [activeCategory, setActiveCategory] = useState<string>("all");
  const [roundAttributes, setRoundAttributes] = useState<string[]>([]);
  const [currentDay, setCurrentDay] = useState(0);
  const [showTutorial, setShowTutorial] = useState(false);

  // Add portal-related state
  // REMOVE START
  // const [portalActive, setPortalActive] = useState(false);
  // const [playerName, setPlayerName] = useState<string>("");
  // const [comingFromPortal, setComingFromPortal] = useState(false);
  // const [previousGameUrl, setPreviousGameUrl] = useState<string | null>(null);
  // REMOVE END

  // Add this state at the top of your component
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Add this effect to update the sound utility
  useEffect(() => {
    // Store the preference in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "unicornBattle_soundEnabled",
        isSoundEnabled.toString(),
      );
    }
  }, [isSoundEnabled]);

  // Add this effect to load the preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPreference = localStorage.getItem(
        "unicornBattle_soundEnabled",
      );
      if (savedPreference !== null) {
        setIsSoundEnabled(savedPreference === "true");
      }
    }
  }, []);

  // Modify the playSfx function to respect the sound toggle
  const playSoundEffect = (soundName: string, volume: number = 1.0) => {
    if (isSoundEnabled) {
      playSfx(soundName, volume);
    }
  };

  // Initialize game
  useEffect(() => {
    // Get today's date-based seed or use the existing shuffle logic
    const dateSeed = getDateSeed();

    // Shuffle using deterministic algorithm based on the date
    // const shuffled = [...startupData].sort(() => 0.5 - Math.random()); // Original random shuffle
    const shuffled = deterministicShuffle(startupData, dateSeed); // Use deterministic shuffle

    // Change from 10 to 8 cards for each player
    setPlayerDeck(shuffled.slice(0, 8) as unknown as StartupCard[]);
    setAiDeck(shuffled.slice(8, 16) as unknown as StartupCard[]);

    // Calculate days since/until March 31, 2025
    const launchDate = new Date("2025-03-31T00:00:00");
    const now = new Date();
    const dayDiff = Math.floor(
      (now.getTime() - launchDate.getTime()) / 86400000,
    );

    // If we're before launch date, dayDiff will be negative
    // After launch date, it will be 0 (launch day) or positive
    const dayNumber = dayDiff < 0 ? -1 : dayDiff + 1; // +1 so launch day is Day 1

    setCurrentDay(dayNumber);
  }, []);

  // Timer for turn-based gameplay
  useEffect(() => {
    let timer: NodeJS.Timeout;

    if (isTimerActive && timeLeft > 0) {
      timer = setTimeout(() => {
        setTimeLeft(timeLeft - 1);
        if (timeLeft <= 5) {
          playSfx("timer-low", 0.5); // Low time warning sound
        }
      }, 1000);
    } else if (isTimerActive && timeLeft === 0) {
      // Auto-select a random attribute if time runs out
      playSfx("timer-end", 0.7); // Timer end sound
      const attributes = ["founded", "revenue", "timeToUnicorn", "valuation"];
      const randomAttr =
        attributes[Math.floor(Math.random() * attributes.length)];
      handleAttributeSelect(randomAttr);
    }

    return () => clearTimeout(timer);
  }, [timeLeft, isTimerActive]);

  // Start timer when battle begins
  useEffect(() => {
    if (gameState === "battle" && !battleAttribute) {
      setTimeLeft(15);
      setIsTimerActive(true);
    } else {
      setIsTimerActive(false);
    }
  }, [gameState, battleAttribute]);

  // Add this near your other useEffect hooks
  // REMOVE START
  // useEffect(() => {
  //   // Check if user is coming from portal
  //   const isFromPortal = searchParams.get("portal") === "true";
  //   const refGame = searchParams.get("ref");
  //   const userName = searchParams.get("username");
  //   const showTutorialParam = searchParams.get("tutorial") === "true";
  //
  //   // Add debug logging
  //   console.log("Portal Debug:", {
  //     isFromPortal,
  //     refGame,
  //     userName,
  //     showTutorialParam,
  //     allParams: Object.fromEntries(searchParams.entries()),
  //   });
  //
  //   if (showTutorialParam) {
  //     setShowTutorial(true);
  //   }
  //
  //   if (isFromPortal && refGame) {
  //     console.log("Entering from portal:", refGame);
  //     setComingFromPortal(true);
  //     setPreviousGameUrl(refGame);
  //     if (userName) setPlayerName(userName);
  //     // Automatically start game for seamless experience
  //     startGame();
  //   }
  // }, [searchParams]);
  // REMOVE END

  // REMOVE START
  // // Use a separate useEffect for tutorial parameter to avoid dependency issues
  // useEffect(() => {
  //   const showTutorialParam = searchParams.get("tutorial") === "true";
  //   if (showTutorialParam) {
  //     setShowTutorial(true);
  //   }
  // }, [searchParams]);
  // REMOVE END

  const startGame = () => {
    if (selectedCards.length < 4) {
      playSfx("error", 0.5); // Error sound
      return;
    }
    playSfx("game-start", 0.8); // Game start sound
    setGameState("battle");
    setCurrentRound(1);
    setPlayerScore(0);
    setAiScore(0);
  };

  const handleCardSelect = (card: StartupCard) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter((c) => c !== card));
      playSfx("card-unselect", 0.6); // Card deselection sound
    } else if (selectedCards.length < 4) {
      setSelectedCards([...selectedCards, card]);
      playSfx("card-select", 0.7); // Card selection sound
    } else {
      playSfx("error", 0.5); // Error sound when trying to select more than 4 cards
    }
  };

  const handleAttributeSelect = (attribute: string) => {
    playSfx("attribute-select", 0.7); // Attribute selection sound

    const playerCard = selectedCards[currentRound - 1];
    const aiCard = aiDeck[currentRound - 1];

    // Add checks for undefined cards
    if (!playerCard || !aiCard) {
      console.error("Error: Player or AI card is missing for the current round.");
      // Optionally reset or show an error state
      return;
    }

    setBattleAttribute(attribute);
    setIsTimerActive(false);

    // Add this line to track the selected attribute for each round
    setRoundAttributes((prev) => [...prev, attribute]);

    // Compare values based on attribute type
    const comparisonResult = compareAttribute(playerCard, aiCard, attribute);

    // Update scores and play appropriate sound
    if (comparisonResult === "draw") {
      setBattleResult("draw");
      playSfx("battle-draw", 0.7); // Draw sound
    } else if (comparisonResult === "win") {
      setPlayerScore((prevScore) => prevScore + 1);
      setBattleResult("win");
      playSfx("battle-win", 0.8); // Win sound
    } else if (comparisonResult === "lose") {
      setAiScore((prevScore) => prevScore + 1);
      setBattleResult("lose");
      playSfx("battle-lose", 0.7); // Lose sound
    } else {
      // Handle null comparison result (e.g., error or missing data)
      console.error("Attribute comparison failed for:", attribute);
      setBattleResult(null); // Or some error state
    }

    // Move to next round or end game
    setTimeout(() => {
      if (currentRound < 4) {
        setCurrentRound(currentRound + 1);
        setBattleAttribute(null);
        setBattleResult(null);
        playSfx("next-round", 0.6); // Next round sound
      } else {
        setGameState("result");
        playSfx("game-end", 0.8); // Game end sound
      }
    }, 2000);
  };

  const resetGame = () => {
    playSfx("reset-game", 0.7); // Reset game sound
    setGameState("select");
    setSelectedCards([]);
    setBattleAttribute(null);
    setBattleResult(null);
    setRoundAttributes([]); // Clear round attributes

    // Reshuffle cards
    const shuffled = [...startupData].sort(() => 0.5 - Math.random());
    setPlayerDeck(shuffled.slice(0, 8) as unknown as StartupCard[]);
    setAiDeck(shuffled.slice(8, 16) as unknown as StartupCard[]);
  };

  // Add this function to handle moving to the next round
  const handleNextRound = () => {
    if (currentRound < 4) {
      setCurrentRound(currentRound + 1);
      setBattleAttribute(null);
      setBattleResult(null);
    } else {
      setGameState("result");
    }
  };

  const generateShareText = () => {
    // Handle pre-launch period
    if (currentDay < 1) {
      // Before official launch
      const launchDate = new Date("2025-03-31T00:00:00");
      const now = new Date();
      const daysToLaunch = Math.ceil(
        (launchDate.getTime() - now.getTime()) / 86400000,
      );

      return `🚀 Startup Battle launches in ${daysToLaunch} days!\n\nI'm playing the preview version. Join me at startupcards.game #StartupBattle`;
    }

    // Add a result emoji based on game outcome
    const resultEmoji =
      playerScore > aiScore ? "🏆" : playerScore === aiScore ? "🤝" : "💪";

    // Create header with win/loss indicator
    const header = `Startup Battle #${currentDay} (${playerScore}/4) ${resultEmoji}\n\n`;

    // Check if we have enough data to generate the grid
    const validRounds = Math.min(
      roundAttributes.length,
      selectedCards.length,
      aiDeck.length,
    );

    // Keep the grid generation code the same, but make it safe
    const grid =
      validRounds > 0
        ? Array.from({ length: validRounds })
            .map((_, i) => {
              const playerCard = selectedCards[i];
              const aiCard = aiDeck[i];
              const attr = roundAttributes[i];

              // Make sure we have valid data for this round
              if (!playerCard || !aiCard || !attr) {
                return `Round ${i + 1}: Data missing`;
              }
              
              // Re-add playerValue and aiValue for comparison check
              const playerValue = playerCard[attr];
              const aiValue = aiCard[attr];

              // Ensure values are numbers before comparing
              if (typeof playerValue !== 'number' || typeof aiValue !== 'number') {
                console.warn(`Skipping non-numeric comparison in share text for attribute: ${attr}`);
                return `Round ${i + 1}: Invalid data for ${attr}`;
              }

              // Use imported compareAttribute function
              const comparisonResult = compareAttribute(playerCard, aiCard, attr);

              // Determine outcome emoji based on comparison result
              const outcome =
                comparisonResult === "win"
                  ? "🟩"
                  : comparisonResult === "lose"
                    ? "🟥"
                    : comparisonResult === "draw"
                      ? "🟨"
                      : "❓"; // Add a case for null/error

              // Attribute icon
              const attrIcon =
                {
                  founded: "🚀",
                  power: "💸",
                  timeToUnicorn: "🦄",
                  valuation: "💰",
                }[attr] || "🎮";

              // Show startup name only for wins (green squares)
              const startupName =
                outcome === "🟩" ? ` ${selectedCards[i].name}` : "";

              return `${attrIcon} ${outcome}${startupName}`;
            })
            .join("\n")
        : "No rounds played yet";

    // Add a more direct challenge in the footer
    const footer = `\n\nCan you beat my ${playerScore}/4 at cardbattle.online? #StartupBattle #vibejam`;

    return header + grid + footer;
  };

  // Update the shareResult function to be more direct
  const shareResult = async () => {
    const shareText = generateShareText();

    try {
      // Try to use the Web Share API directly with the text as the primary content
      await navigator.share({
        title: "Startup Battle Results",
        text: shareText,
        // Remove the URL to focus on sharing the text content
      });
    } catch (error) {
      // Fallback to clipboard only if sharing fails
      await navigator.clipboard.writeText(shareText);
      setShowSharePrompt(true);

      // Hide prompt after delay
      setTimeout(() => {
        setShowSharePrompt(false);
      }, 3000);
    }
  };

  // Add these new retro-styled animation variants
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

  // Add a css utility for pixel corners
  const pixelCorners = `
    clip-path: polygon(
      0 4px, 4px 4px, 4px 0,
      calc(100% - 4px) 0, calc(100% - 4px) 4px, 100% 4px,
      100% calc(100% - 4px), calc(100% - 4px) calc(100% - 4px), calc(100% - 4px) 100%,
      4px 100%, 4px calc(100% - 4px), 0 calc(100% - 4px)
    )
  `;

  // Add a retro grid background component
  const RetroGridBackground = () => (
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

  // Add this function before the PlayGame component
  const shareViaMobileAPI = async (file: File, text: string) => {
    if (navigator.share) {
      try {
        await navigator.share({
          files: [file],
          title: "Startup Card Battle Results",
          text: text,
        });
        return true;
      } catch (error) {
        console.error("Error sharing:", error);
        return false;
      }
    }
    return false;
  };

  // Add type guard for LucideIcon
  const isLucideIcon = (value: unknown): value is LucideIcon => {
    return typeof value === 'function' || (typeof value === 'object' && value !== null && 'render' in value);
  };

  // Add this function to render the battle phase
  const renderBattlePhase = () => {
    const playerCard = selectedCards[currentRound - 1];
    const aiCard = aiDeck[currentRound - 1];

    if (!playerCard || !aiCard) return null;

    const renderIcon = (card: StartupCard, isPlayer: boolean) => {
      const bgColor = isPlayer ? "bg-purple-800" : "bg-red-800";
      const textColor = isPlayer ? "text-purple-200" : "text-red-200";

      if (!card.icon) {
        return (
          <div className={`w-12 h-12 flex items-center justify-center ${bgColor} rounded-lg`}>
            <Rocket className={`w-6 h-6 ${textColor}`} />
          </div>
        );
      }

      if (typeof card.icon === "string") {
        return (
          <div className="relative">
            <Image
              src={card.icon}
              alt={card.name}
              width={48}
              height={48}
              className="rounded-lg"
            />
          </div>
        );
      }

      if (isLucideIcon(card.icon)) {
        return (
          <div className={`w-12 h-12 flex items-center justify-center ${bgColor} rounded-lg`}>
            <card.icon className={`w-6 h-6 ${textColor}`} />
          </div>
        );
      }

      return null;
    };

    return (
      <motion.div
        className="relative h-full w-full max-w-5xl mx-auto px-4 py-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Retro Grid Background */}
        <RetroGridBackground />

        {/* Battle Arena Background with improved retro effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-indigo-900/20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a0066_1px,transparent_1px),linear-gradient(to_bottom,#2a0066_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

          {/* Enhanced animated background particles */}
          <motion.div
            className="absolute inset-0 overflow-hidden"
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 0.5 }}
          >
            {Array.from({ length: 20 }).map((_, i) => (
              <motion.div
                key={`particle-${i}`}
                className="absolute w-1 h-1 rounded-full bg-purple-400"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                }}
                animate={{
                  y: [0, Math.random() * -100],
                  opacity: [0.8, 0],
                  scale: [1, 0],
                }}
                transition={{
                  duration: 2 + Math.random() * 3,
                  repeat: Infinity,
                  delay: Math.random() * 5,
                }}
              />
            ))}
          </motion.div>
        </div>

        {/* CRT Screen Effect */}
        <CRTEffect />

        {/* Battle HUD */}
        <div className="relative z-10">
          {/* Round & Timer */}
          <div className="flex justify-between items-center mb-4">
            <motion.div
              className="pixel-corners bg-gray-900/80 px-4 py-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-purple-300 font-bold pixel-text">
                ROUND {currentRound}/4
              </span>
            </motion.div>
            {isTimerActive && (
              <motion.div
                className="pixel-corners bg-gray-900/80 px-4 py-2"
                initial={{ x: 20, opacity: 0 }}
                animate={{
                  x: 0,
                  opacity: 1,
                  scale: timeLeft <= 5 ? [1, 1.1, 1] : 1,
                }}
                transition={{
                  x: { delay: 0.2 },
                  scale: {
                    repeat: timeLeft <= 5 ? Infinity : 0,
                    duration: 0.5,
                  },
                }}
              >
                <span
                  className={`font-mono font-bold ${
                    timeLeft <= 5 ? "text-red-400" : "text-purple-300"
                  }`}
                >
                  {timeLeft}s
                </span>
              </motion.div>
            )}
          </div>

          {/* Battle Rules - Ultra Condensed version for quick reference */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center mb-2 bg-gray-900/70 rounded py-1 pixel-corners"
          >
            <div className="flex justify-center gap-10">
              <div className="flex items-center gap-2">
                <span className="inline-block bg-purple-600 rounded-sm w-3.5 h-3.5 flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </span>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-purple-400 font-bold">
                    HIGHER WINS
                  </span>
                  <span className="text-xs text-white leading-tight">
                    VALUATION • POWER
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="inline-block bg-blue-600 rounded-sm w-3.5 h-3.5 flex items-center justify-center text-white text-xs font-bold">
                  ✓
                </span>
                <div className="flex flex-col items-start">
                  <span className="text-xs text-blue-400 font-bold">
                    LOWER WINS
                  </span>
                  <span className="text-xs text-white leading-tight">
                    UNICORN • FOUNDED
                  </span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Score Display - New retro style */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex justify-center gap-8 mb-4"
          >
            <div className="pixel-corners bg-purple-900/80 px-4 py-2 flex items-center gap-2">
              <span className="text-purple-200 font-bold">YOU:</span>
              <span className="text-white font-pixel text-lg">
                {playerScore}
              </span>
            </div>
            <div className="pixel-corners bg-red-900/80 px-4 py-2 flex items-center gap-2">
              <span className="text-red-200 font-bold">AI:</span>
              <span className="text-white font-pixel text-lg">{aiScore}</span>
            </div>
          </motion.div>

          {/* Battle Arena - Improved layout to prevent scrolling */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-8 items-center">
            {/* Player Card with enhanced animations */}
            <motion.div
              variants={cardAnimationVariants.playerCard}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full"
            >
              <motion.div
                variants={cardAnimationVariants.hover}
                animate={
                  battleResult === "win"
                    ? enhancedCardAnimations.attack.player.animate
                    : cardAnimationVariants.hover.animate
                }
                className="relative h-full"
              >
                {/* Add pixel border effect with improved animation */}
                <motion.div
                  className="absolute -inset-1 rounded-2xl z-0 border-2"
                  initial={retroAnimations.pixelBorder.initial}
                  animate={
                    battleResult === "win"
                      ? retroAnimations.pixelBorder.win
                      : battleResult === "lose"
                        ? retroAnimations.pixelBorder.lose
                        : retroAnimations.pixelBorder.animate
                  }
                />

                {/* Add attack pixel effect */}
                <PixelAttackEffect
                  isPlayer={true}
                  isActive={battleResult === "win"}
                />

                <div className="pixel-corners bg-gradient-to-br from-purple-900/90 to-indigo-900/90 p-3 md:p-4 backdrop-blur relative z-10 overflow-hidden h-full">
                  {/* Retro pixel shine effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <RetroPixelParticles count={5} color="bg-white/30" />
                  </div>

                  {/* Add scanline flicker effect */}
                  <div className="absolute inset-0 bg-scanlines pointer-events-none"></div>

                  {/* Card Header with pixel animation */}
                  <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4 relative">
                    {renderIcon(playerCard, true)}
                    <div>
                      <h3 className="text-base md:text-xl font-bold text-white pixel-text">
                        {playerCard.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-purple-600 text-xs md:text-sm">
                          {playerCard.category}
                        </Badge>
                        <span className="text-purple-300 text-xs md:text-sm">
                          Lv.{currentRound}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Player Stats Display with improved retro style */}
                  <div className="space-y-3">
                    {[
                      {
                        key: "power",
                        label: "Power",
                        value: playerCard.power,
                      },
                      {
                        key: "founded",
                        label: "Founded",
                        value: playerCard.founded,
                      },
                      {
                        key: "timeToUnicorn",
                        label: "Time to Unicorn",
                        value: playerCard.timeToUnicorn,
                      },
                      {
                        key: "valuation",
                        label: "Valuation",
                        value: playerCard.valuation,
                      },
                    ].map(({ key, label, value }) => (
                      <motion.div
                        key={key}
                        className={`relative rounded-lg overflow-hidden ${
                          battleAttribute === key
                            ? "ring-2 ring-purple-400"
                            : ""
                        }`}
                        initial="initial"
                        animate={
                          battleAttribute === key
                            ? enhancedCardAnimations.statHighlight.animate
                            : "initial"
                        }
                        variants={enhancedCardAnimations.statHighlight}
                      >
                        <div
                          className={`flex items-center justify-between mb-1 px-2 pt-1 ${
                            battleAttribute === key ? "bg-purple-900/50" : ""
                          }`}
                          onClick={() => {
                            if (!battleAttribute) {
                              handleAttributeSelect(key);
                            }
                          }}
                        >
                          <span className="text-sm text-purple-200 uppercase pixel-text">
                            {label}
                          </span>
                          <span className="text-sm font-bold text-white">
                            {value}
                          </span>
                        </div>
                        <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden mx-2 mb-1">
                          <motion.div
                            className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                            initial={{ width: "0%" }}
                            animate={{
                              width: `${
                                (Number(playerCard[key]) / getMaxValue(key)) *
                                100
                              }%`,
                            }}
                            transition={{ duration: 1 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* AI Card with enhanced animations */}
            <motion.div
              variants={cardAnimationVariants.aiCard}
              initial="initial"
              animate="animate"
              exit="exit"
              className="w-full h-full"
            >
              <motion.div
                variants={cardAnimationVariants.hover}
                animate={
                  battleResult === "lose"
                    ? enhancedCardAnimations.attack.ai.animate
                    : cardAnimationVariants.hover.animate
                }
                className="relative h-full"
              >
                {/* Add pixel border effect */}
                <motion.div
                  className="absolute -inset-1 rounded-2xl z-0 border-2"
                  initial={retroAnimations.pixelBorder.initial}
                  animate={
                    battleResult === "lose"
                      ? retroAnimations.pixelBorder.win
                      : battleResult === "win"
                        ? retroAnimations.pixelBorder.lose
                        : retroAnimations.pixelBorder.animate
                  }
                />

                {/* Add attack pixel effect */}
                <PixelAttackEffect
                  isPlayer={false}
                  isActive={battleResult === "lose"}
                />

                <div className="pixel-corners bg-gradient-to-br from-red-900/90 to-pink-900/90 p-3 md:p-4 backdrop-blur relative z-10 overflow-hidden h-full">
                  {/* Retro pixel shine effect */}
                  <div className="absolute inset-0 overflow-hidden">
                    <RetroPixelParticles count={5} color="bg-white/30" />
                  </div>

                  {/* Add scanline flicker effect */}
                  <div className="absolute inset-0 bg-scanlines pointer-events-none"></div>

                  {/* Card Header with pixel animation */}
                  <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4 relative">
                    {renderIcon(aiCard, false)}
                    <div>
                      <h3 className="text-base md:text-xl font-bold text-white pixel-text">
                        {aiCard.name}
                      </h3>
                      <div className="flex items-center gap-2">
                        <Badge className="bg-red-600 text-xs md:text-sm">
                          {aiCard.category}
                        </Badge>
                        <span className="text-red-300 text-xs md:text-sm">
                          Lv.{currentRound}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* AI Stats Display with improved retro style */}
                  <div className="space-y-3">
                    {[
                      {
                        key: "power",
                        label: "Power",
                        value: aiCard.power,
                      },
                      {
                        key: "founded",
                        label: "Founded",
                        value: aiCard.founded,
                      },
                      {
                        key: "timeToUnicorn",
                        label: "Time to Unicorn",
                        value: aiCard.timeToUnicorn,
                      },
                      {
                        key: "valuation",
                        label: "Valuation",
                        value: aiCard.valuation,
                      },
                    ].map(({ key, label, value }) => (
                      <motion.div
                        key={key}
                        className={`relative rounded-lg overflow-hidden ${
                          battleAttribute === key ? "ring-2 ring-red-400" : ""
                        }`}
                        initial="initial"
                        animate={
                          battleAttribute === key
                            ? enhancedCardAnimations.statHighlight.animate
                            : "initial"
                        }
                        variants={enhancedCardAnimations.statHighlight}
                      >
                        <div
                          className={`flex items-center justify-between mb-1 px-2 pt-1 ${
                            battleAttribute === key ? "bg-red-900/50" : ""
                          }`}
                        >
                          <span className="text-sm text-red-200 uppercase pixel-text">
                            {label}
                          </span>
                          <span className="text-sm font-bold text-white">
                            {battleAttribute ? value : "???"}
                          </span>
                        </div>
                        <div className="h-2 bg-red-900/50 rounded-full overflow-hidden mx-2 mb-1">
                          <motion.div
                            className="h-full bg-gradient-to-r from-red-500 to-pink-500"
                            initial={{ width: 0 }}
                            animate={
                              battleAttribute
                                ? {
                                    width: `${
                                      (Number(aiCard[key]) / getMaxValue(key)) *
                                      100
                                    }%`,
                                  }
                                : { width: 0 }
                            }
                            transition={{ duration: 1, delay: 0.5 }}
                          />
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </div>

          {/* Battle Controls - Improved with new retro styling */}
          {!battleAttribute && !battleResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-6 mb-16 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent py-4 px-4 rounded-lg pixel-corners"
            >
              <h3 className="text-center text-purple-200 mb-3 pixel-text text-sm md:text-base">
                SELECT YOUR MOVE!
              </h3>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-2 md:gap-3">
                {[
                  {
                    name: "Power",
                    icon: DollarSign,
                    key: "power",
                    color: "from-purple-600 to-indigo-600",
                  },
                  {
                    name: "Founded",
                    icon: Calendar,
                    key: "founded",
                    color: "from-blue-600 to-cyan-600",
                  },
                  {
                    name: "Time to Unicorn",
                    icon: Rocket,
                    key: "timeToUnicorn",
                    color: "from-green-600 to-teal-600",
                  },
                  {
                    name: "Valuation",
                    icon: TrendingUp,
                    key: "valuation",
                    color: "from-amber-600 to-yellow-600",
                  },
                ].map((attr) => (
                  <motion.button
                    key={attr.name}
                    onClick={() => handleAttributeSelect(attr.key)}
                    className={`pixel-corners bg-gradient-to-br ${attr.color}
                               hover:from-purple-500 hover:to-indigo-500 p-2 md:px-4 md:py-3 
                               text-white font-medium text-xs md:text-base
                             shadow-lg shadow-purple-900/20 relative overflow-hidden`}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <motion.div
                      className="absolute inset-0 bg-white/10"
                      animate={{ opacity: [0, 0.2, 0] }}
                      transition={{
                        duration: 1.5,
                        repeat: Infinity,
                        repeatDelay: 1,
                      }}
                    />
                    <div className="flex items-center justify-center gap-1 md:gap-2">
                      <attr.icon className="w-3 h-3 md:w-4 md:h-4" />
                      <span className="truncate">{attr.name}</span>
                    </div>
                  </motion.button>
                ))}
              </div>
            </motion.div>
          )}

          {/* Battle VS Animation - Added for more exciting battles */}
          {battleAttribute && !battleResult && (
            <motion.div
              className="absolute inset-0 flex items-center justify-center pointer-events-none"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                className="text-6xl md:text-8xl font-bold text-white pixel-text"
                initial={{ scale: 2, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                VS
              </motion.div>
            </motion.div>
          )}

          {/* Battle Result Animation - Enhanced Retro Style */}
          <AnimatePresence>
            {battleResult && (
              <BattleResultOverlay
                result={battleResult}
                playerCard={selectedCards[currentRound - 1]}
                aiCard={aiDeck[currentRound - 1]}
                attribute={battleAttribute!}
                playerScore={playerScore}
                aiScore={aiScore}
                onNext={() => {
                  if (currentRound < 4) {
                    setCurrentRound((prev) => prev + 1);
                    setBattleAttribute(null);
                    setBattleResult(null);
                  } else {
                    setGameState("result");
                  }
                }}
              />
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    );
  };

  // Add portal transition function
  // REMOVE START
  // const handlePortalTransition = (isExit: boolean = false) => {
  //   playSfx("portal-transition", 0.8); // Portal transition sound
  //   setPortalActive(true);
  //
  //   // Construct portal URL with parameters
  //   const portalParams = new URLSearchParams({
  //     username: playerName || "anonymous",
  //     color: PORTAL_CONFIG.defaultColor,
  //     speed: PORTAL_CONFIG.defaultSpeed.toString(),
  //     ref: PORTAL_CONFIG.gameRef,
  //   });
  //
  //   // Add game-specific stats
  //   if (playerScore) {
  //     portalParams.append("score", (playerScore * 100).toString());
  //   }
  //
  //   const portalUrl = isExit
  //     ? `${PORTAL_CONFIG.exitPortalUrl}?${portalParams}`
  //     : previousGameUrl || PORTAL_CONFIG.exitPortalUrl;
  //
  //   // Debug logging
  //   console.log("Portal Transition:", {
  //     isExit,
  //     portalUrl,
  //     params: Object.fromEntries(portalParams.entries()),
  //   });
  //
  //   // Animate portal transition
  //   setTimeout(() => {
  //     router.push(portalUrl);
  //   }, 1000);
  // };
  //
  // // Add portal UI components
  // const PortalElement = ({
  //   isExit = false,
  //   onClick,
  // }: {
  //   isExit?: boolean;
  //   onClick: () => void;
  // }) => (
  //   <motion.div
  //     whileHover={{ scale: 1.05 }}
  //     className={cn(
  //       "cursor-pointer relative rounded-full overflow-hidden",
  //       "w-16 h-16 md:w-24 md:h-24",
  //       "bg-gradient-to-r from-purple-600 to-blue-600",
  //       "flex items-center justify-center",
  //       "transition-all duration-300",
  //       isExit
  //         ? "hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
  //         : "hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]",
  //     )}
  //     onClick={onClick}
  //   >
  //     <div className="absolute inset-0 portal-swirl animate-spin-slow" />
  //     <div className="relative z-10 text-white font-bold text-sm md:text-base">
  //       {isExit ? "Exit Portal" : "Return"}
  //     </div>
  //   </motion.div>
  // );
  // REMOVE END

  // First, add a helper component for the battle guide
  const BattleGuide = () => (
    <div className="bg-purple-900/80 rounded-lg p-3 mb-4 mx-4">
      <div className="text-sm text-purple-100 flex justify-center gap-8">
        <div className="flex items-center gap-2">
          <div className="text-green-400 font-bold">HIGHER WINS ↗️</div>
          <div className="text-gray-300">VALUATION • POWER</div>
        </div>
        <div className="flex items-center gap-2">
          <div className="text-blue-400 font-bold">LOWER WINS ↙️</div>
          <div className="text-gray-300">FOUNDED • UNICORN</div>
        </div>
      </div>
    </div>
  );

  // Update the battle metrics section
  const battleMetrics = [
    {
      name: "VALUATION",
      power: "$12.0B",
      accuracy: "↗️ Higher",
      color: "from-purple-600 to-purple-800",
      icon: "💰",
      description: "Compare valuations",
    },
    {
      name: "POWER",
      power: "8 PW",
      accuracy: "↗️ Higher",
      color: "from-green-600 to-green-800",
      icon: "📈",
      description: "Compare power levels",
    },
    {
      name: "FOUNDED",
      power: "2015",
      accuracy: "↙️ Lower",
      color: "from-blue-600 to-blue-800",
      icon: "🚀",
      description: "Compare founding years",
    },
    {
      name: "TIME TO UNICORN",
      power: "5Y 5M",
      accuracy: "↙️ Lower",
      color: "from-amber-600 to-amber-800",
      icon: "🦄",
      description: "Compare time to reach unicorn",
    },
  ];

  // Add tutorial modal component
  const TutorialModal = () => (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70"
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        transition={{ type: "spring", damping: 20 }}
        className="bg-gray-900 border-2 border-purple-500 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto"
        style={{ ...pixelBorderStyles }}
      >
        <div className="bg-gradient-to-r from-purple-800 to-blue-800 p-3 flex justify-between items-center">
          <h2 className="text-xl font-mono font-bold text-white">
            HOW TO PLAY
          </h2>
          <button
            onClick={() => setShowTutorial(false)}
            className="text-white hover:text-purple-200"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-6 text-white">
          <div className="space-y-3">
            <h3 className="text-xl font-bold text-purple-300">Game Overview</h3>
            <p>
              Startup Battle is a strategic card game where you compete against
              AI using startup company cards.
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-purple-300">Game Flow</h3>
            <ol className="list-decimal pl-5 space-y-2">
              <li>Select 4 startup cards for your battle deck</li>
              <li>
                Each round, one card from your deck battles against an AI card
              </li>
              <li>Choose a stat to compare (Valuation, Revenue, etc.)</li>
              <li>The card with the better stat wins the round</li>
              <li>Win more rounds than the AI to win the battle</li>
            </ol>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-purple-300">
              Comparison Rules
            </h3>
            <ul className="space-y-4">
              <li className="flex items-center gap-2">
                <ArrowUpCircle className="text-green-400 w-6 h-6" />
                <div>
                  <div className="font-bold">Higher is Better:</div>
                  <div className="text-gray-300">Valuation, Revenue, Power</div>
                </div>
              </li>
              <li className="flex items-center gap-2">
                <ArrowDownCircle className="text-blue-400 w-6 h-6" />
                <div>
                  <div className="font-bold">Lower is Better:</div>
                  <div className="text-gray-300">
                    Founded Year, Time to Unicorn
                  </div>
                </div>
              </li>
            </ul>
          </div>

          <div className="space-y-3">
            <h3 className="text-xl font-bold text-purple-300">Tips</h3>
            <ul className="list-disc pl-5 space-y-2">
              <li>Choose cards with strong stats across multiple categories</li>
              <li>
                Look for newer startups with high valuations for balanced cards
              </li>
              <li>
                Remember which attributes are better when higher vs. lower
              </li>
              <li>
                Plan your deck to have different strengths for different rounds
              </li>
            </ul>
          </div>

          <motion.button
            onClick={() => setShowTutorial(false)}
            className="w-full mt-4 bg-gradient-to-r from-purple-600 to-pink-600 p-3 rounded font-bold text-white"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            GOT IT! START PLAYING
          </motion.button>
        </div>
      </motion.div>
    </motion.div>
  );

  const [isLoading, setIsLoading] = useState(false); // Add isLoading state if not present

  return (
    <div className="relative min-h-screen flex flex-col bg-black text-white overflow-hidden">
      {/* Show tutorial modal if tutorial parameter is true */}
      {showTutorial && <TutorialModal />}

      {/* Add portal entrance animation if coming from portal */}
      {/* REMOVE START */}
      {/* {comingFromPortal && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 20, opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 bg-purple-600/50 z-50"
        />
      )} */}
      {/* REMOVE END */}

      <main className="flex-grow px-3 py-2">
        <AnimatePresence mode="wait">
          {gameState === "select" && (
            <SelectPhase
              key="select-phase" // Add key for AnimatePresence
              playerDeck={playerDeck}
              selectedCards={selectedCards}
              handleCardSelect={handleCardSelect}
              startGame={startGame}
              isLoading={isLoading} // Pass isLoading state
              // Note: We are temporarily putting CardComponent and FloatingCounter *inside* SelectPhase.
              // Step 4a optional sub-steps will extract them properly.
            />
          )}

          {gameState === "battle" && renderBattlePhase()}

          {gameState === "result" && (
            <motion.div
              key="result"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="flex flex-col items-center justify-center h-full text-center p-4"
            >
              {/* RetroGrid background */}
              <RetroGridBackground />

              {/* CRT overlay effects */}
              <div className="absolute inset-0 pointer-events-none z-50">
                <div style={retroAnimations.scanlines} />
                <motion.div
                  className="absolute left-0 right-0 h-[2px] bg-purple-400/30"
                  animate={{
                    top: ["0%", "100%"],
                    opacity: [0.4, 0.4, 0],
                  }}
                  transition={{
                    repeat: Infinity,
                    duration: 2,
                    ease: "linear",
                    times: [0, 0.97, 1],
                  }}
                />
              </div>

              {/* Glowing title */}
              <motion.div
                className="w-full text-center mb-2 relative"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="font-mono text-4xl md:text-5xl font-bold relative">
                  <span className="relative z-10 bg-clip-text text-transparent bg-gradient-to-r from-purple-300 via-fuchsia-200 to-purple-300">
                    BATTLE RESULTS
                  </span>

                  {/* Text glow */}
                  <motion.span
                    className="absolute inset-0 blur-md bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-fuchsia-300 to-purple-400 z-0"
                    animate={{ opacity: [0.5, 0.8, 0.5] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    BATTLE RESULTS
                  </motion.span>
                </h1>

                {/* Decorative pixel elements */}
                <div className="absolute top-0 left-1/2 w-8 h-1 bg-purple-500 -translate-x-1/2 -translate-y-4" />
                <div className="absolute bottom-0 left-1/2 w-8 h-1 bg-purple-500 -translate-x-1/2 translate-y-4" />
              </motion.div>

              {/* Terminal-style final score */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-black/60 backdrop-blur-sm border border-purple-500/40 w-full mb-4 overflow-hidden"
                style={{ ...pixelBorderStyles }}
              >
                <div className="font-mono p-4">
                  <div className="text-teal-400 text-sm mb-1">
                    // Final battle results
                  </div>
                  <div className="flex justify-center gap-8 text-2xl">
                    <div className="flex flex-col items-center">
                      <span className="text-purple-400">YOU</span>
                      <motion.div
                        className="text-4xl font-bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                      >
                        <span className="text-green-400">{playerScore}</span>
                      </motion.div>
                    </div>
                    <div className="text-2xl text-white">vs</div>
                    <div className="flex flex-col items-center">
                      <span className="text-red-400">AI</span>
                      <motion.div
                        className="text-4xl font-bold"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.8 }}
                      >
                        <span className="text-red-400">{aiScore}</span>
                      </motion.div>
                    </div>
                  </div>
                  <motion.div
                    className="text-center text-xl mt-3"
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 1 }}
                  >
                    {playerScore > aiScore ? (
                      <span className="text-green-400 font-bold">
                        VICTORY ACHIEVED
                      </span>
                    ) : playerScore === aiScore ? (
                      <span className="text-yellow-400 font-bold">
                        MATCH DRAW
                      </span>
                    ) : (
                      <span className="text-red-400 font-bold">
                        DEFEAT RECORDED
                      </span>
                    )}
                  </motion.div>

                  {/* Animated dots */}
                  <div className="mt-2 flex justify-center gap-1">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <motion.div
                        key={`dot-${i}`}
                        className="w-2 h-2 bg-purple-500"
                        animate={{ opacity: [0.2, 1, 0.2] }}
                        transition={{
                          duration: 1.5,
                          repeat: Infinity,
                          delay: i * 0.2,
                          ease: "easeInOut",
                        }}
                      />
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Replace the old summary div with the new component */}
              <BattleRoundsSummary
                selectedCards={selectedCards}
                aiDeck={aiDeck}
                roundAttributes={roundAttributes}
              />

              {/* Action buttons with retro style */}
              <div className="flex flex-col md:flex-row gap-3 justify-center mt-2">
                <motion.button
                  onClick={shareResult}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-6 py-3 bg-gradient-to-r from-teal-600 to-cyan-600 font-mono font-bold text-white"
                  style={{ ...pixelBorderStyles }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.2 }}
                >
                  {/* Animated scanlines effect */}
                  <div className="absolute inset-0 overflow-hidden opacity-10">
                    <div
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 1px, transparent 1px, transparent 2px)",
                        backgroundSize: "2px 2px",
                        height: "100%",
                      }}
                    />
                  </div>

                  {/* Button content */}
                  <div className="relative z-10 flex items-center gap-2">
                    <Share2 className="w-5 h-5" />
                    <span>SHARE RESULTS</span>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/30" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/30" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/30" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/30" />
                </motion.button>

                <motion.button
                  onClick={resetGame}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="relative px-6 py-3 bg-gradient-to-r from-purple-600 to-pink-600 font-mono font-bold text-white"
                  style={{ ...pixelBorderStyles }}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 1.4 }}
                >
                  {/* Animated scanlines effect */}
                  <div className="absolute inset-0 overflow-hidden opacity-10">
                    <div
                      style={{
                        backgroundImage:
                          "repeating-linear-gradient(0deg, rgba(255,255,255,0.2) 0px, rgba(255,255,255,0.2) 1px, transparent 1px, transparent 2px)",
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
                  <div className="relative z-10 flex items-center gap-2">
                    <Swords className="w-5 h-5" />
                    <span>NEW BATTLE</span>
                  </div>

                  {/* Corner accents */}
                  <div className="absolute top-0 left-0 w-2 h-2 border-t-2 border-l-2 border-white/30" />
                  <div className="absolute top-0 right-0 w-2 h-2 border-t-2 border-r-2 border-white/30" />
                  <div className="absolute bottom-0 left-0 w-2 h-2 border-b-2 border-l-2 border-white/30" />
                  <div className="absolute bottom-0 right-0 w-2 h-2 border-b-2 border-r-2 border-white/30" />
                </motion.button>
              </div>

              {/* Floating share success message with retro style */}
              <AnimatePresence>
                {showSharePrompt && (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    className="fixed bottom-20 left-1/2 -translate-x-1/2 z-50 font-mono"
                  >
                    <div
                      className="bg-black/80 border border-teal-500 px-4 py-2 text-teal-400"
                      style={{ ...pixelBorderStyles }}
                    >
                      <div className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-teal-500 animate-pulse" />
                        <span>RESULTS COPIED TO CLIPBOARD</span>
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Add floating pixel particles */}
              <div className="absolute inset-0 overflow-hidden pointer-events-none">
                <RetroPixelParticles count={15} color="bg-purple-400" />
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* ... other elements like TutorialModal ... */}
    </div>
  );
}
export default function PlayPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <PlayContent />
    </Suspense>
  );
}

