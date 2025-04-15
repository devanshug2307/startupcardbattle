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

// First, let's add proper type definitions at the top of the file
type StartupCard = {
  name: string;
  category: string;
  founded: number;
  power: number;
  timeToUnicorn: number;
  valuation: number;
  [key: string]: string | number; // Add index signature to allow string indexing
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

// Add these utility functions at the top of your file or in a separate utils file
function getDateSeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

function seededRandom(seed: number) {
  // Simple seedable random function
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

function deterministicShuffle(array: any[], seed: number) {
  // Create a copy of the array to avoid modifying the original
  const result = [...array];
  let currentSeed = seed;

  // Fisher-Yates shuffle with seeded random
  for (let i = result.length - 1; i > 0; i--) {
    // Generate random index based on the seed
    currentSeed = Math.floor(seededRandom(currentSeed) * 1000000);
    const j = Math.floor(seededRandom(currentSeed) * (i + 1));
    // Swap elements
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

// Add portal configuration
const PORTAL_CONFIG = {
  exitPortalUrl: "http://portal.pieter.com",
  defaultColor: "purple",
  defaultSpeed: 1,
  gameRef: "https://cardbattle.online",
};

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
  value: number | string | undefined,
  attribute: string
): string => {
  // Return placeholder if value is undefined or null
  if (value === undefined || value === null) {
    return "---";
  }

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
                    : "text-yellow-400"
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
                    : "text-yellow-400"
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
            className="mt-4 text-gray-300 text-center pixel-text"
            initial={{ opacity: 0 }}
            animate={{ opacity: [0, 1, 0.5, 1] }}
            transition={{ delay: 0.5, duration: 1, repeat: Infinity }}
          >
            PRESS ANY KEY TO CONTINUE
          </motion.div>
        </div>
      </motion.div>
      <Button
        onClick={() => {
          playSfx("button-click", 0.6); // Button click sound
          onNext();
        }}
      >
        Next
      </Button>
    </motion.div>
  );
};

// Assuming your main content is in a component, let's wrap it in Suspense
function PlayContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [gameState, setGameState] = useState<"select" | "battle" | "result">(
    "select"
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

  // Add portal-related state
  const [portalActive, setPortalActive] = useState(false);
  const [playerName, setPlayerName] = useState<string>("");
  const [comingFromPortal, setComingFromPortal] = useState(false);
  const [previousGameUrl, setPreviousGameUrl] = useState<string | null>(null);

  // Add this state at the top of your component
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  // Add this effect to update the sound utility
  useEffect(() => {
    // Store the preference in localStorage
    if (typeof window !== "undefined") {
      localStorage.setItem(
        "unicornBattle_soundEnabled",
        isSoundEnabled.toString()
      );
    }
  }, [isSoundEnabled]);

  // Add this effect to load the preference
  useEffect(() => {
    if (typeof window !== "undefined") {
      const savedPreference = localStorage.getItem(
        "unicornBattle_soundEnabled"
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
    const shuffled = [...startupData].sort(() => 0.5 - Math.random());

    // Change from 10 to 8 cards for each player
    setPlayerDeck(shuffled.slice(0, 8) as unknown as StartupCard[]);
    setAiDeck(shuffled.slice(8, 16) as unknown as StartupCard[]);

    // Calculate days since/until March 31, 2025
    const launchDate = new Date("2025-03-31T00:00:00");
    const now = new Date();
    const dayDiff = Math.floor(
      (now.getTime() - launchDate.getTime()) / 86400000
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
  useEffect(() => {
    // Check if user is coming from portal
    const isFromPortal = searchParams.get("portal") === "true";
    const refGame = searchParams.get("ref");
    const userName = searchParams.get("username");

    // Add debug logging
    console.log("Portal Debug:", {
      isFromPortal,
      refGame,
      userName,
      allParams: Object.fromEntries(searchParams.entries()),
    });

    if (isFromPortal && refGame) {
      console.log("Entering from portal:", refGame);
      setComingFromPortal(true);
      setPreviousGameUrl(refGame);
      if (userName) setPlayerName(userName);
      // Automatically start game for seamless experience
      startGame();
    }
  }, [searchParams]);

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
    setBattleAttribute(attribute);
    setIsTimerActive(false);

    // Add this line to track the selected attribute for each round
    setRoundAttributes((prev) => [...prev, attribute]);

    const playerCard = selectedCards[currentRound - 1];
    const aiCard = aiDeck[currentRound - 1];

    // Compare values based on attribute type
    let playerWins = false;
    let isDraw = false;

    switch (attribute) {
      case "timeToUnicorn":
      case "founded":
        // Lower is better for these attributes
        playerWins = playerCard[attribute] < aiCard[attribute];
        isDraw = playerCard[attribute] === aiCard[attribute];
        break;
      default:
        // Higher is better for revenue and valuation
        playerWins = playerCard[attribute] > aiCard[attribute];
        isDraw = playerCard[attribute] === aiCard[attribute];
    }

    // Update scores and play appropriate sound
    if (isDraw) {
      setBattleResult("draw");
      playSfx("battle-draw", 0.7); // Draw sound
    } else if (playerWins) {
      setPlayerScore((prevScore) => prevScore + 1);
      setBattleResult("win");
      playSfx("battle-win", 0.8); // Win sound
    } else {
      setAiScore((prevScore) => prevScore + 1);
      setBattleResult("lose");
      playSfx("battle-lose", 0.7); // Lose sound
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
        (launchDate.getTime() - now.getTime()) / 86400000
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
      aiDeck.length
    );

    // Keep the grid generation code the same, but make it safe
    const grid =
      validRounds > 0
        ? Array.from({ length: validRounds })
            .map((_, i) => {
              // Make sure we have valid data for this round
              if (!selectedCards[i] || !aiDeck[i] || !roundAttributes[i]) {
                return `Round ${i + 1}: Data missing`;
              }

              const attr = roundAttributes[i];
              const playerValue = selectedCards[i][attr];
              const aiValue = aiDeck[i][attr];
              const isLowerBetter =
                attr === "timeToUnicorn" || attr === "founded";

              // Determine outcome
              const outcome = isLowerBetter
                ? playerValue < aiValue
                  ? "🟩"
                  : playerValue > aiValue
                  ? "🟥"
                  : "🟨"
                : playerValue > aiValue
                ? "🟩"
                : playerValue < aiValue
                ? "🟥"
                : "🟨";

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

  const renderAttributeIcon = (attribute: string) => {
    switch (attribute) {
      case "founded":
        return <Zap className="w-5 h-5" />;
      case "power":
        return <TrendingUp className="w-5 h-5" />;
      case "timeToUnicorn":
        return <Users className="w-5 h-5" />;
      case "valuation":
        return <DollarSign className="w-5 h-5" />;
      default:
        return null;
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

  // Update the CardComponent with enhanced styling and animations
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
        "transition-all duration-300"
      )}
    >
      {/* Card Frame with Pixel Corners */}
      <div
        className={cn(
          "relative overflow-hidden",
          isSelected
            ? "ring-4 ring-purple-500 shadow-[0_0_15px_rgba(168,85,247,0.5)]"
            : "ring-1 ring-purple-900/50"
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
                <span className="text-[10px] font-mono text-gray-300 uppercase">
                  Power
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-green-400">
                {formatPower(card.power)}
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
                <span className="text-[10px] font-mono text-gray-300 uppercase">
                  Founded
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-blue-400">
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
                <span className="text-[10px] font-mono text-gray-300 uppercase">
                  Unicorn
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-purple-400">
                {formatTimeToUnicorn(card.timeToUnicorn)}
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
                <span className="text-[10px] font-mono text-gray-300 uppercase">
                  Value
                </span>
              </div>
              <span className="text-[10px] font-mono font-bold text-yellow-400">
                {formatValuation(card.valuation)}
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

  // Update the selection phase container
  {
    gameState === "select" && (
      <motion.div
        variants={retroCardSelectionAnimations.cardContainer}
        initial="initial"
        animate="animate"
        exit="exit"
        className="relative w-full max-w-7xl mx-auto px-4 py-8 overflow-hidden"
      >
        {/* Add retro background */}
        <RetroGridBackground />

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
          className="mb-10 max-w-2xl mx-auto"
          style={{ boxShadow: "0 0 20px rgba(147, 51, 234, 0.2)" }}
        >
          <div
            className="bg-black/60 backdrop-blur-sm border border-purple-500/40 p-5"
            style={{ ...pixelBorderStyles }}
          >
            <h3 className="text-xl font-mono mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-teal-300">
              BATTLE RULES
            </h3>

            <div className="grid grid-cols-2 gap-6 font-mono text-sm">
              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-green-400 font-bold">
                  <TrendingUp className="w-4 h-4" />
                  HIGHER WINS
                </h4>
                <ul className="space-y-1 pl-6 text-green-200/80">
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">•</span> VALUATION
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-green-400">•</span> POWER LEVEL
                  </li>
                </ul>
              </div>

              <div className="space-y-2">
                <h4 className="flex items-center gap-2 text-blue-400 font-bold">
                  <TrendingDown className="w-4 h-4" />
                  LOWER WINS
                </h4>
                <ul className="space-y-1 pl-6 text-blue-200/80">
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span> TIME TO UNICORN
                  </li>
                  <li className="flex items-center gap-2">
                    <span className="text-blue-400">•</span> FOUNDED YEAR
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Cards grid with retro styling */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
          {playerDeck.map((card, index) => (
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

        {/* Enhanced floating counter with retro style */}
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
                        : "bg-gray-800 text-gray-600"
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

        {/* Enhanced Start Battle Button */}
        <AnimatePresence>
          {selectedCards.length === 4 && (
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
      </motion.div>
    );
  }

  // First, let's define better category data with custom colors and icons
  const categories: Category[] = [
    {
      name: "All",
      icon: Layout,
      colors: {
        from: "from-purple-500/20",
        to: "to-purple-600/20",
        iconColor: "text-purple-400",
      },
    },
    {
      name: "Fintech",
      icon: Banknote,
      colors: {
        from: "from-blue-500/20",
        to: "to-blue-600/20",
        iconColor: "text-blue-400",
      },
    },
    {
      name: "Consumer",
      icon: ShoppingBag,
      colors: {
        from: "from-pink-500/20",
        to: "to-pink-600/20",
        iconColor: "text-pink-400",
      },
    },
    {
      name: "SaaS",
      icon: Cloud,
      colors: {
        from: "from-indigo-500/20",
        to: "to-indigo-600/20",
        iconColor: "text-indigo-400",
      },
    },
  ];

  // Update the category navigation section
  <div className="mb-6">
    <Tabs
      defaultValue="all"
      className="w-full"
      onValueChange={(value) => setActiveCategory(value)}
    >
      <TabsList className="w-full max-w-2xl mx-auto grid grid-cols-5 bg-gray-900/50 backdrop-blur-xl p-2 rounded-2xl border border-gray-800/50 gap-2">
        {categories.map((category) => {
          const isActive = activeCategory === category.name.toLowerCase();
          return (
            <TabsTrigger
              key={`category-${category.name.toLowerCase()}`}
              value={category.name.toLowerCase()}
              className={cn(
                "relative overflow-hidden transition-all duration-300",
                "rounded-xl py-3 px-1",
                "hover:bg-gray-800/50",
                isActive ? "bg-gradient-to-b" : "bg-transparent",
                isActive && category.colors.from,
                isActive && category.colors.to,
                isActive ? category.colors.activeText : "text-gray-400"
              )}
            >
              <div className="relative">
                <motion.div
                  initial={false}
                  animate={{
                    y: isActive ? 0 : 10,
                    opacity: isActive ? 1 : 0.7,
                  }}
                  className="flex flex-col items-center gap-2"
                >
                  {/* Icon Container */}
                  <div
                    className={cn(
                      "p-2 rounded-lg transition-colors duration-300",
                      isActive ? "bg-gray-900/60" : "bg-transparent",
                      category.colors.iconColor
                    )}
                  >
                    <category.icon className="w-5 h-5" />
                  </div>

                  {/* Category Name */}
                  <span
                    className={cn(
                      "text-sm font-medium transition-colors duration-300",
                      isActive ? "text-white" : "text-gray-400"
                    )}
                  >
                    {category.name}
                  </span>
                </motion.div>

                {/* Active Indicator */}
                {isActive && (
                  <>
                    {/* Glowing background effect */}
                    <motion.div
                      layoutId="categoryGlow"
                      className={cn(
                        "absolute inset-0 opacity-20 blur-xl",
                        "bg-gradient-to-b",
                        category.colors.from,
                        category.colors.to
                      )}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />

                    {/* Bottom border indicator */}
                    <motion.div
                      layoutId="categoryIndicator"
                      className={cn(
                        "absolute bottom-0 left-1/2 -translate-x-1/2 w-12 h-0.5",
                        "bg-gradient-to-r",
                        category.colors.from,
                        category.colors.to
                      )}
                      transition={{
                        type: "spring",
                        bounce: 0.2,
                        duration: 0.6,
                      }}
                    />
                  </>
                )}
              </div>
            </TabsTrigger>
          );
        })}
      </TabsList>
    </Tabs>
  </div>;

  const captureAndShare = async () => {
    const battleSummary = document.getElementById("battle-summary");

    if (!battleSummary) return null;

    try {
      const canvas = await html2canvas(battleSummary, {
        backgroundColor: "#111827",
        scale: 2,
      });

      // Convert to blob
      const blob = await new Promise<Blob>((resolve) => {
        canvas.toBlob((blob) => {
          resolve(blob!);
        }, "image/png");
      });

      // Create sharing data
      const file = new File([blob], "battle-summary.png", {
        type: "image/png",
      });

      // Create object URL for download
      const downloadUrl = URL.createObjectURL(blob);
      const downloadLink = document.createElement("a");
      downloadLink.href = downloadUrl;
      downloadLink.download = "startup-battle-summary.png";

      // Create share text
      const shareText = `Check out my Startup Card Battle results! 🎮✨
Score: ${playerScore * 100} points
Rounds Won: ${playerScore} vs AI: ${aiScore}

Can you beat my score? #StartupCardBattle`;

      // Create Twitter share URL
      const twitterText = encodeURIComponent(shareText);
      const twitterUrl = `https://twitter.com/intent/tweet?text=${twitterText}`;

      return {
        file,
        downloadLink,
        twitterUrl,
        shareText,
      };
    } catch (error) {
      console.error("Error capturing battle summary:", error);
      return null;
    }
  };

  // Add this floating counter component
  const FloatingCounter = () => (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="fixed bottom-4 left-1/2 -translate-x-1/2 z-50 bg-gradient-to-r from-purple-900/90 to-pink-900/90 
                 backdrop-blur-md rounded-full px-6 py-3 shadow-xl border border-purple-500/20"
    >
      <div className="flex items-center gap-4">
        <div className="flex -space-x-2">
          {selectedCards.map((card, index) => (
            <motion.div
              key={`card-${card.name}-${index}`}
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 
                       flex items-center justify-center text-white font-bold ring-2 ring-black"
            >
              {index + 1}
            </motion.div>
          ))}
          {Array.from({ length: 4 - selectedCards.length }).map((_, index) => (
            <div
              key={`empty-${index}`}
              className="w-8 h-8 rounded-full bg-gray-800/80 ring-2 ring-black"
            />
          ))}
        </div>
        <span className="text-sm font-medium">
          {4 - selectedCards.length}{" "}
          {4 - selectedCards.length === 1 ? "Card" : "Cards"} Left
        </span>
      </div>
    </motion.div>
  );

  // Update the BattleCard component with a more engaging design
  const BattleCard = ({
    card,
    isPlayer = true,
  }: {
    card: StartupCard;
    isPlayer?: boolean;
  }) => (
    <motion.div
      className={cn(
        "relative h-full rounded-2xl overflow-hidden transition-all duration-300",
        "group hover:scale-105",
        battleResult === "win" &&
          isPlayer &&
          "ring-4 ring-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.4)]",
        battleResult === "lose" &&
          !isPlayer &&
          "ring-4 ring-green-500/50 shadow-[0_0_40px_rgba(34,197,94,0.4)]",
        battleResult === "lose" &&
          isPlayer &&
          "ring-4 ring-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.4)]",
        battleResult === "win" &&
          !isPlayer &&
          "ring-4 ring-red-500/50 shadow-[0_0_40px_rgba(239,68,68,0.4)]"
      )}
    >
      {/* Card Frame */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Holographic Effect */}
        <div
          className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 
                      opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-[1]"
        />
        <div
          className="absolute inset-0 opacity-[0.02] group-hover:opacity-[0.04] 
                      mix-blend-overlay z-[2] card-holographic pointer-events-none"
        />

        {/* Top Banner */}
        <div
          className="relative h-24 bg-gradient-to-br from-purple-600/90 to-blue-600/90 
                      overflow-hidden p-3 z-[3]"
        >
          <div className="absolute inset-0 card-circuit-pattern opacity-20" />

          {/* Company Name & Category */}
          <div className="relative z-[4]">
            <div className="flex items-start justify-between">
              <h3 className="font-bold text-xl text-white drop-shadow-lg">
                {isPlayer || battleAttribute ? card.name : "???"}
              </h3>
              <div
                className="bg-white/10 backdrop-blur-sm px-2 py-0.5 rounded-full
                            border border-white/20 text-white text-xs font-medium"
              >
                {isPlayer || battleAttribute ? card.category : "???"}
              </div>
            </div>

            {/* Startup Level */}
            <div className="mt-2 flex items-center gap-1">
              {Array.from({
                length: Math.min(
                  5,
                  Math.ceil((card.power + card.valuation) / 4)
                ),
              }).map((_, i) => (
                <div
                  key={`${card.name}-level-${i}`}
                  className="w-2 h-2 rounded-full bg-white/80"
                />
              ))}
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4 z-[5]">
          <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
            {[
              {
                key: "power",
                label: "Power",
                value: formatPower(card.power),
                icon: TrendingUp,
                color: "from-green-500 to-emerald-600",
                textColor: "text-green-400",
              },
              {
                key: "founded",
                label: "Founded",
                value: card.founded,
                icon: Zap,
                color: "from-yellow-500 to-orange-600",
                textColor: "text-yellow-400",
              },
              {
                key: "timeToUnicorn",
                label: "Time to 🦄",
                value: formatTimeToUnicorn(card.timeToUnicorn),
                icon: Users,
                color: "from-blue-500 to-cyan-600",
                textColor: "text-blue-400",
              },
              {
                key: "valuation",
                label: "Valuation",
                value: formatValuation(card.valuation),
                icon: DollarSign,
                color: "from-purple-500 to-pink-600",
                textColor: "text-purple-400",
              },
            ].map((attr) => (
              <div
                key={`${card.name}-${attr.key}`}
                onClick={() => {
                  if (isPlayer && !battleAttribute) {
                    handleAttributeSelect(attr.key);
                  }
                }}
                className={cn(
                  "relative rounded-lg sm:rounded-xl overflow-hidden p-[1px]",
                  "bg-gradient-to-br",
                  attr.color,
                  isPlayer &&
                    !battleAttribute &&
                    "hover:ring-2 hover:ring-white/20 cursor-pointer",
                  battleAttribute === attr.key && "ring-2 ring-white/50",
                  (!isPlayer || battleAttribute) &&
                    "opacity-90 pointer-events-none",
                  "z-[6]" // Ensure stats are clickable
                )}
              >
                <div className="relative bg-gray-900/90 rounded-lg sm:rounded-xl p-1.5 sm:p-2">
                  <div
                    className={cn(
                      "flex items-center gap-1 text-[10px] sm:text-xs truncate",
                      attr.textColor
                    )}
                  >
                    <attr.icon className="w-3 h-3 flex-shrink-0" />
                    <span className="truncate">{attr.label}</span>
                  </div>
                  <div className="font-bold text-[11px] sm:text-sm text-white mt-0.5 sm:mt-1 truncate">
                    {!isPlayer && !battleAttribute ? "???" : attr.value}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </motion.div>
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

  // Add this function to render the battle phase
  const renderBattlePhase = () => {
    const playerCard = selectedCards[currentRound - 1];
    const aiCard = aiDeck[currentRound - 1];

    return (
      <motion.div
        className="relative h-full w-full max-w-5xl mx-auto px-4 py-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        {/* Battle Arena Background */}
        <div className="absolute inset-0 bg-gradient-to-b from-purple-900/20 to-indigo-900/20">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a0066_1px,transparent_1px),linear-gradient(to_bottom,#2a0066_1px,transparent_1px)] bg-[size:24px_24px] opacity-20" />

          {/* Add animated background particles */}
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

        {/* Battle HUD */}
        <div className="relative z-10">
          {/* Round & Timer */}
          <div className="flex justify-between items-center mb-6">
            <motion.div
              className="pixel-corners bg-gray-900/80 px-4 py-2"
              initial={{ x: -20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 }}
            >
              <span className="text-purple-300 font-bold">
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

          {/* Battle Guide - Keep existing code */}
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 md:mb-8"
          >
            {/* ... existing battle guide code ... */}
          </motion.div>

          {/* Battle Arena - Updated with enhanced animations */}
          <div className="flex flex-col md:flex-row md:justify-center gap-4 md:gap-8 items-center">
            {/* Cards Container */}
            <div className="relative w-full max-w-md mx-auto flex flex-col gap-4 md:gap-8">
              {/* Player Card with enhanced animations */}
              <motion.div
                variants={cardAnimationVariants.playerCard}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <motion.div
                  variants={cardAnimationVariants.hover}
                  animate={
                    battleResult === "win"
                      ? enhancedCardAnimations.attack.player.animate
                      : cardAnimationVariants.hover.animate
                  }
                  className="relative"
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

                  <div className="pixel-corners bg-gradient-to-br from-purple-900/90 to-indigo-900/90 p-3 md:p-6 backdrop-blur relative z-10 overflow-hidden">
                    {/* Add CRT screen effect */}
                    <CRTEffect />

                    {/* Retro pixel shine effect */}
                    <div className="absolute inset-0 overflow-hidden">
                      <RetroPixelParticles count={5} color="bg-white/30" />
                    </div>

                    {/* Add scanline flicker effect */}
                    <motion.div
                      className="absolute inset-0 bg-white/5 pointer-events-none"
                      animate={{ opacity: [0, 0.1, 0] }}
                      transition={{
                        duration: 0.2,
                        repeat: Infinity,
                        repeatDelay: 3,
                      }}
                    />

                    {/* Card Header with pixel animation */}
                    <div className="flex items-center gap-2 md:gap-4 mb-3 md:mb-4 relative">
                      {typeof playerCard.icon === "string" ? (
                        <div className="relative">
                          <Image
                            src={playerCard.icon}
                            alt={playerCard.name}
                            width={48}
                            height={48}
                            className="w-12 h-12 md:w-16 md:h-16 rounded-lg pixel-image"
                          />
                          <motion.div
                            className="absolute inset-0 bg-purple-500/30 rounded-lg"
                            animate={{ opacity: [0, 0.5, 0] }}
                            transition={{
                              duration: 0.5,
                              repeat: Infinity,
                              repeatDelay: 2,
                            }}
                          />
                        </div>
                      ) : (
                        <motion.div
                          className="w-12 h-12 md:w-16 md:h-16 bg-purple-800/50 rounded-lg flex items-center justify-center relative overflow-hidden"
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className="text-xl md:text-2xl relative z-10">
                            {playerCard.name[0]}
                          </span>
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-purple-600/0 via-purple-600/30 to-purple-600/0"
                            animate={{ x: ["-100%", "100%"] }}
                            transition={{
                              duration: 1.5,
                              repeat: Infinity,
                              repeatDelay: 2,
                            }}
                          />
                        </motion.div>
                      )}
                      <div>
                        <h3 className="text-base md:text-xl font-bold text-white pixel-text">
                          {playerCard.name}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-purple-600 text-xs md:text-sm relative overflow-hidden">
                            {playerCard.category}
                            <motion.div
                              className="absolute inset-0 bg-white/20"
                              animate={{ opacity: [0, 0.5, 0] }}
                              transition={{
                                duration: 0.3,
                                repeat: Infinity,
                                repeatDelay: 3,
                              }}
                            />
                          </Badge>
                          <span className="text-purple-300 text-xs md:text-sm">
                            Lv.{currentRound}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Stats Display with improved retro animations */}
                    <div className="space-y-2 md:space-y-3">
                      {[
                        {
                          key: "power",
                          label: "Power",
                          value: formatPower(playerCard.power),
                        },
                        {
                          key: "founded",
                          label: "Founded",
                          value: playerCard.founded,
                        },
                        {
                          key: "timeToUnicorn",
                          label: "Time to Unicorn",
                          value: formatTimeToUnicorn(playerCard.timeToUnicorn),
                        },
                        {
                          key: "valuation",
                          label: "Valuation",
                          value: formatValuation(playerCard.valuation),
                        },
                      ].map(({ key, label, value }) => (
                        <motion.div
                          key={key}
                          className={`relative rounded-lg overflow-hidden ${
                            battleAttribute === key
                              ? "border-2 border-purple-400"
                              : ""
                          }`}
                          initial="initial"
                          animate={
                            battleAttribute === key ? "animate" : "initial"
                          }
                          variants={{
                            initial: { backgroundColor: "rgba(0,0,0,0)" },
                            animate: {
                              backgroundColor: [
                                "rgba(0,0,0,0)",
                                "rgba(139,92,246,0.3)",
                                "rgba(0,0,0,0)",
                              ],
                              transition: { duration: 0.5, repeat: Infinity },
                            },
                          }}
                        >
                          {/* Add highlight flash for selected attribute */}
                          {battleAttribute === key && (
                            <motion.div
                              className="absolute inset-0 bg-purple-400/30 z-0"
                              animate={{ opacity: [0, 0.6, 0] }}
                              transition={{
                                duration: 0.3,
                                repeat: Infinity,
                                repeatDelay: 0.5,
                              }}
                            />
                          )}

                          <div className="flex items-center justify-between mb-1 px-2 pt-1 relative z-10">
                            <span className="text-sm text-purple-200 uppercase">
                              {label}
                            </span>
                            <span className="text-sm font-bold text-white">
                              {value}
                            </span>
                          </div>
                          <div className="h-2 bg-purple-900/50 rounded-full overflow-hidden mx-2 mb-1 relative z-10">
                            <motion.div
                              className="h-full bg-gradient-to-r from-purple-500 to-indigo-500"
                              initial={{ width: 0 }}
                              animate={{
                                width: `${
                                  (Number(playerCard[key]) / getMaxValue(key)) *
                                  100
                                }%`,
                              }}
                              transition={{ duration: 1, delay: 0.5 }}
                            />
                            {/* Add pixel loading effect */}
                            {battleAttribute === key && (
                              <motion.div
                                className="absolute inset-y-0 right-0 w-1 bg-white"
                                animate={{
                                  opacity: [0, 1, 0],
                                  x: [0, -2, 0],
                                }}
                                transition={{ duration: 0.2, repeat: Infinity }}
                              />
                            )}
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              </motion.div>

              {/* VS Divider with enhanced retro animation */}
              <div className="relative flex justify-center my-2 md:my-0 md:absolute md:left-1/2 md:top-1/2 md:-translate-x-1/2 md:-translate-y-1/2 z-10">
                <div className="relative">
                  <motion.div
                    className="text-2xl md:text-4xl font-bold text-purple-300 pixel-text"
                    style={{
                      textShadow: "2px 2px 0 #2e1065",
                      WebkitTextStroke: "1px #2e1065",
                    }}
                    animate={{
                      scale: [1, 1.1, 1],
                      textShadow: [
                        "2px 2px 0 #2e1065",
                        "3px 3px 0 #2e1065",
                        "2px 2px 0 #2e1065",
                      ],
                    }}
                    transition={{ duration: 0.8, repeat: Infinity }}
                  >
                    VS
                  </motion.div>

                  {/* Add pixel glitch effect */}
                  <AnimatePresence>
                    {battleAttribute && (
                      <motion.div
                        className="absolute inset-0 text-2xl md:text-4xl font-bold text-red-300 pixel-text"
                        style={{
                          textShadow: "2px 2px 0 #7f1d1d",
                          WebkitTextStroke: "1px #7f1d1d",
                          left: "2px",
                        }}
                        initial={{ opacity: 0 }}
                        animate={{ opacity: [0, 0.8, 0] }}
                        exit={{ opacity: 0 }}
                        transition={{
                          duration: 0.2,
                          repeat: 3,
                          repeatDelay: 0.1,
                        }}
                      >
                        VS
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                {/* Add retro pixel particles around VS */}
                <div className="absolute inset-0 -m-8">
                  <RetroPixelParticles count={12} color="bg-purple-400" />

                  {/* Add pixel explosion when attribute is selected */}
                  <AnimatePresence>
                    {battleAttribute && (
                      <motion.div className="absolute inset-0">
                        {Array.from({ length: 20 }).map((_, i) => (
                          <motion.div
                            key={`explosion-${i}`}
                            className="absolute w-2 h-2 bg-white"
                            style={{
                              left: "50%",
                              top: "50%",
                              originX: "center",
                              originY: "center",
                            }}
                            initial={{ scale: 0 }}
                            animate={{
                              scale: [0, 1, 0],
                              x: [0, Math.cos((i * Math.PI) / 10) * 50],
                              y: [0, Math.sin((i * Math.PI) / 10) * 50],
                              opacity: [1, 0],
                            }}
                            transition={{ duration: 0.5 }}
                            exit={{ opacity: 0 }}
                          />
                        ))}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </div>

              {/* AI Card with similar enhanced animations */}
              <motion.div
                variants={cardAnimationVariants.aiCard}
                initial="initial"
                animate="animate"
                exit="exit"
                className="w-full"
              >
                <motion.div
                  variants={cardAnimationVariants.hover}
                  animate={
                    battleResult === "lose"
                      ? enhancedCardAnimations.attack.ai.animate
                      : cardAnimationVariants.hover.animate
                  }
                  className="relative"
                >
                  {/* Add glow effect container */}
                  <motion.div
                    className="absolute -inset-1 rounded-2xl z-0"
                    initial={enhancedCardAnimations.glow.initial}
                    animate={
                      battleResult === "lose"
                        ? enhancedCardAnimations.glow.win
                        : battleResult === "win"
                        ? enhancedCardAnimations.glow.lose
                        : enhancedCardAnimations.glow.animate
                    }
                  />

                  <div className="pixel-corners bg-gradient-to-br from-red-900/90 to-pink-900/90 p-3 md:p-6 backdrop-blur relative z-10">
                    {/* Shine effect overlay */}
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
                      style={{ width: "50%", height: "100%" }}
                      variants={enhancedCardAnimations.pixelShine}
                      initial="initial"
                      animate="animate"
                    />

                    {/* AI Card Content - Similar to player card with animations */}
                    <div className="flex items-center gap-4 mb-4">
                      {typeof aiCard.icon === "string" ? (
                        <Image
                          src={aiCard.icon}
                          alt={aiCard.name}
                          width={48}
                          height={48}
                          className="w-12 h-12 md:w-16 md:h-16 rounded-lg pixel-image"
                        />
                      ) : (
                        <motion.div
                          className="w-12 h-12 md:w-16 md:h-16 bg-red-800/50 rounded-lg flex items-center justify-center"
                          whileHover={{ scale: 1.05 }}
                        >
                          <span className="text-xl md:text-2xl">
                            {aiCard.name[0]}
                          </span>
                        </motion.div>
                      )}
                      <div>
                        <h3 className="text-base md:text-xl font-bold text-white pixel-text">
                          {battleAttribute ? aiCard.name : "???"}
                        </h3>
                        <div className="flex items-center gap-2">
                          <Badge className="bg-red-600 text-xs md:text-sm">
                            {battleAttribute ? aiCard.category : "???"}
                          </Badge>
                          <span className="text-red-300 text-xs md:text-sm">
                            Lv.{currentRound}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* AI Stats Display with animations */}
                    <div className="space-y-3">
                      {[
                        {
                          key: "power",
                          label: "Power",
                          value: formatPower(aiCard.power),
                        },
                        {
                          key: "founded",
                          label: "Founded",
                          value: aiCard.founded,
                        },
                        {
                          key: "timeToUnicorn",
                          label: "Time to Unicorn",
                          value: formatTimeToUnicorn(aiCard.timeToUnicorn),
                        },
                        {
                          key: "valuation",
                          label: "Valuation",
                          value: formatValuation(aiCard.valuation),
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
                          <div className="flex items-center justify-between mb-1 px-2 pt-1">
                            <span className="text-sm text-red-200 uppercase">
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
                                        (Number(aiCard[key]) /
                                          getMaxValue(key)) *
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
          </div>

          {/* Battle Controls - Keep existing code */}
          {!battleAttribute && !battleResult && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-0 left-0 right-0 bg-gradient-to-t from-gray-900 via-gray-900/95 to-transparent pb-safe pt-6 px-2 md:px-4 z-20"
            >
              <div className="max-w-5xl mx-auto">
                <h3 className="text-center text-purple-200 mb-2 md:mb-3 pixel-text text-sm md:text-base">
                  Choose your move!
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-1.5 md:gap-3 px-2">
                  {[
                    { name: "Power", icon: DollarSign, key: "power" },
                    { name: "Founded", icon: Calendar, key: "founded" },
                    {
                      name: "Time to Unicorn",
                      icon: Rocket,
                      key: "timeToUnicorn",
                    },
                    { name: "Valuation", icon: TrendingUp, key: "valuation" },
                  ].map((attr) => (
                    <motion.button
                      key={attr.name}
                      onClick={() => handleAttributeSelect(attr.key)}
                      className="pixel-corners bg-gradient-to-br from-purple-600 to-indigo-600 
                               hover:from-purple-500 hover:to-indigo-500 p-2 md:px-4 md:py-3 
                               text-white font-medium text-xs md:text-base
                               shadow-lg shadow-purple-900/20"
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <div className="flex items-center justify-center gap-1 md:gap-2">
                        <attr.icon className="w-3 h-3 md:w-4 md:h-4" />
                        <span className="truncate">{attr.name}</span>
                      </div>
                    </motion.button>
                  ))}
                </div>
              </div>
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
  const handlePortalTransition = (isExit: boolean = false) => {
    playSfx("portal-transition", 0.8); // Portal transition sound
    setPortalActive(true);

    // Construct portal URL with parameters
    const portalParams = new URLSearchParams({
      username: playerName || "anonymous",
      color: PORTAL_CONFIG.defaultColor,
      speed: PORTAL_CONFIG.defaultSpeed.toString(),
      ref: PORTAL_CONFIG.gameRef,
    });

    // Add game-specific stats
    if (playerScore) {
      portalParams.append("score", (playerScore * 100).toString());
    }

    const portalUrl = isExit
      ? `${PORTAL_CONFIG.exitPortalUrl}?${portalParams}`
      : previousGameUrl || PORTAL_CONFIG.exitPortalUrl;

    // Debug logging
    console.log("Portal Transition:", {
      isExit,
      portalUrl,
      params: Object.fromEntries(portalParams.entries()),
    });

    // Animate portal transition
    setTimeout(() => {
      router.push(portalUrl);
    }, 1000);
  };

  // Add portal UI components
  const PortalElement = ({
    isExit = false,
    onClick,
  }: {
    isExit?: boolean;
    onClick: () => void;
  }) => (
    <motion.div
      whileHover={{ scale: 1.05 }}
      className={cn(
        "cursor-pointer relative rounded-full overflow-hidden",
        "w-16 h-16 md:w-24 md:h-24",
        "bg-gradient-to-r from-purple-600 to-blue-600",
        "flex items-center justify-center",
        "transition-all duration-300",
        isExit
          ? "hover:shadow-[0_0_30px_rgba(147,51,234,0.5)]"
          : "hover:shadow-[0_0_30px_rgba(59,130,246,0.5)]"
      )}
      onClick={onClick}
    >
      <div className="absolute inset-0 portal-swirl animate-spin-slow" />
      <div className="relative z-10 text-white font-bold text-sm md:text-base">
        {isExit ? "Exit Portal" : "Return"}
      </div>
    </motion.div>
  );

  // First, add a helper component for the battle guide
  const BattleGuide = () => (
    <div className="bg-purple-900/80 rounded-lg p-4 mb-4 mx-4">
      <div className="text-sm text-purple-100">
        <div className="mb-2 font-bold">
          Each round, compare card stats to win:
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div className="flex items-center gap-2">
            <div className="text-green-400">Higher Wins! ↗️</div>
            <div className="text-gray-300 text-xs">• Valuation & Power</div>
          </div>
          <div className="flex items-center gap-2">
            <div className="text-blue-400">Lower Wins! ↙️</div>
            <div className="text-gray-300 text-xs">
              • Founded Year & Time to Unicorn
            </div>
          </div>
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

  return (
    <div className="relative min-h-screen bg-gray-900">
      {/* Add portal entrance animation if coming from portal */}
      {comingFromPortal && (
        <motion.div
          initial={{ scale: 0, opacity: 1 }}
          animate={{ scale: 20, opacity: 0 }}
          transition={{ duration: 1 }}
          className="fixed inset-0 bg-purple-600/50 z-50"
        />
      )}

      {/* Add portals to the game UI */}
      <div className="fixed top-4 right-4 z-40 flex gap-4">
        {previousGameUrl && (
          <PortalElement onClick={() => handlePortalTransition(false)} />
        )}
        <PortalElement isExit onClick={() => handlePortalTransition(true)} />
      </div>

      <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
        {/* Streamlined Header */}
        <header className="sticky top-0 z-40 px-3 py-2 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800/50">
          <div className="flex justify-between items-center max-w-7xl mx-auto">
            <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
              <ArrowLeft className="w-5 h-5" />
            </Button>
            <h1 className="text-lg font-bold">Unicorn Battle</h1>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsSoundEnabled(!isSoundEnabled)}
            >
              {isSoundEnabled ? (
                <Volume2 className="w-5 h-5" />
              ) : (
                <VolumeX className="w-5 h-5" />
              )}
            </Button>
          </div>
        </header>

        {/* Optimized Game Content */}
        <main className="flex-grow px-3 py-2">
          {gameState === "select" && (
            <motion.div
              variants={retroCardSelectionAnimations.cardContainer}
              initial="initial"
              animate="animate"
              exit="exit"
              className="relative w-full max-w-7xl mx-auto px-4 py-8 overflow-hidden"
            >
              {/* Add retro background */}
              <RetroGridBackground />

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
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      repeatDelay: 3,
                    }}
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
                className="mb-10 max-w-2xl mx-auto"
                style={{ boxShadow: "0 0 20px rgba(147, 51, 234, 0.2)" }}
              >
                <div
                  className="bg-black/60 backdrop-blur-sm border border-purple-500/40 p-5"
                  style={{ ...pixelBorderStyles }}
                >
                  <h3 className="text-xl font-mono mb-3 text-center bg-clip-text text-transparent bg-gradient-to-r from-green-300 to-teal-300">
                    BATTLE RULES
                  </h3>

                  <div className="grid grid-cols-2 gap-6 font-mono text-sm">
                    <div className="space-y-2">
                      <h4 className="flex items-center gap-2 text-green-400 font-bold">
                        <TrendingUp className="w-4 h-4" />
                        HIGHER WINS
                      </h4>
                      <ul className="space-y-1 pl-6 text-green-200/80">
                        <li className="flex items-center gap-2">
                          <span className="text-green-400">•</span> VALUATION
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-green-400">•</span> POWER LEVEL
                        </li>
                      </ul>
                    </div>

                    <div className="space-y-2">
                      <h4 className="flex items-center gap-2 text-blue-400 font-bold">
                        <TrendingDown className="w-4 h-4" />
                        LOWER WINS
                      </h4>
                      <ul className="space-y-1 pl-6 text-blue-200/80">
                        <li className="flex items-center gap-2">
                          <span className="text-blue-400">•</span> TIME TO
                          UNICORN
                        </li>
                        <li className="flex items-center gap-2">
                          <span className="text-blue-400">•</span> FOUNDED YEAR
                        </li>
                      </ul>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Cards grid with retro styling */}
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-5 gap-4 md:gap-6">
                {playerDeck.map((card, index) => (
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

              {/* Enhanced floating counter with retro style */}
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
                              : "bg-gray-800 text-gray-600"
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

              {/* Enhanced Start Battle Button */}
              <AnimatePresence>
                {selectedCards.length === 4 && (
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
            </motion.div>
          )}

          {gameState === "battle" && renderBattlePhase()}

          {gameState === "result" && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="relative flex flex-col items-center justify-between h-full w-full max-w-[900px] mx-auto px-4 md:min-h-0 gap-2"
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

              {/* Battle Rounds Summary */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                id="battle-summary"
                className="bg-black/60 backdrop-blur-sm border border-purple-500/40 w-full p-4 mb-4"
                style={{ ...pixelBorderStyles }}
              >
                <h2 className="font-mono text-xl text-center mb-4 bg-clip-text text-transparent bg-gradient-to-r from-teal-300 to-cyan-300">
                  ROUND ANALYSIS
                </h2>

                <div className="grid gap-4">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <motion.div
                      key={`round-${i}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: 0.6 + i * 0.2 }}
                      className="grid grid-cols-[1fr_auto_1fr] gap-3 items-center"
                    >
                      {/* Left Card - Player */}
                      <div
                        className="relative overflow-hidden p-2 bg-gray-900/80"
                        style={{ ...pixelBorderStyles }}
                      >
                        <div className="font-mono text-sm text-purple-400">
                          YOUR CARD
                        </div>
                        <div className="font-mono font-bold text-white">
                          {selectedCards[i]?.name || "---"}
                        </div>
                        <div className="flex gap-2 items-center mt-1">
                          <div className="w-2 h-2 bg-purple-500" />
                          <div className="text-xs text-gray-400">
                            {selectedCards[i]?.category || "---"}
                          </div>
                        </div>

                        {roundAttributes[i] && (
                          <div className="mt-1 flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              {renderAttributeIcon(roundAttributes[i])}
                              <span className="text-xs text-gray-300">
                                {roundAttributes[i]}
                              </span>
                            </div>
                            <span
                              className={cn(
                                "text-xs font-bold",
                                compareAttribute(
                                  selectedCards[i],
                                  aiDeck[i],
                                  roundAttributes[i]
                                ) === "win"
                                  ? "text-green-400"
                                  : compareAttribute(
                                      selectedCards[i],
                                      aiDeck[i],
                                      roundAttributes[i]
                                    ) === "lose"
                                  ? "text-red-400"
                                  : "text-yellow-400"
                              )}
                            >
                              {formatAttributeValue(
                                selectedCards[i]?.[roundAttributes[i]],
                                roundAttributes[i]
                              )}
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Middle Result Indicator */}
                      <div className="flex flex-col items-center gap-1">
                        <div className="text-white font-mono">R{i + 1}</div>
                        {roundAttributes[i] && (
                          <div
                            className={cn(
                              "w-6 h-6 flex items-center justify-center font-bold",
                              compareAttribute(
                                selectedCards[i],
                                aiDeck[i],
                                roundAttributes[i]
                              ) === "win"
                                ? "bg-green-500 text-white"
                                : compareAttribute(
                                    selectedCards[i],
                                    aiDeck[i],
                                    roundAttributes[i]
                                  ) === "lose"
                                ? "bg-red-500 text-white"
                                : "bg-yellow-500 text-white"
                            )}
                            style={{ ...pixelBorderStyles }}
                          >
                            {compareAttribute(
                              selectedCards[i],
                              aiDeck[i],
                              roundAttributes[i]
                            ) === "win"
                              ? "W"
                              : compareAttribute(
                                  selectedCards[i],
                                  aiDeck[i],
                                  roundAttributes[i]
                                ) === "lose"
                              ? "L"
                              : "D"}
                          </div>
                        )}
                      </div>

                      {/* Right Card - AI */}
                      <div
                        className="relative overflow-hidden p-2 bg-gray-900/80"
                        style={{ ...pixelBorderStyles }}
                      >
                        <div className="font-mono text-sm text-red-400">
                          AI CARD
                        </div>
                        <div className="font-mono font-bold text-white">
                          {aiDeck[i]?.name || "---"}
                        </div>
                        <div className="flex gap-2 items-center mt-1">
                          <div className="w-2 h-2 bg-red-500" />
                          <div className="text-xs text-gray-400">
                            {aiDeck[i]?.category || "---"}
                          </div>
                        </div>

                        {roundAttributes[i] && (
                          <div className="mt-1 flex justify-between items-center">
                            <div className="flex items-center gap-1">
                              {renderAttributeIcon(roundAttributes[i])}
                              <span className="text-xs text-gray-300">
                                {roundAttributes[i]}
                              </span>
                            </div>
                            <span
                              className={cn(
                                "text-xs font-bold",
                                compareAttribute(
                                  selectedCards[i],
                                  aiDeck[i],
                                  roundAttributes[i]
                                ) === "lose"
                                  ? "text-green-400"
                                  : compareAttribute(
                                      selectedCards[i],
                                      aiDeck[i],
                                      roundAttributes[i]
                                    ) === "win"
                                  ? "text-red-400"
                                  : "text-yellow-400"
                              )}
                            >
                              {formatAttributeValue(
                                aiDeck[i]?.[roundAttributes[i]],
                                roundAttributes[i]
                              )}
                            </span>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>

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
        </main>
      </div>
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

// Add this helper function to compare attributes
const compareAttribute = (
  playerCard: StartupCard | undefined,
  aiCard: StartupCard | undefined,
  attribute: string
): "win" | "lose" | "draw" | null => {
  if (!playerCard || !aiCard || !attribute) return null;

  // Compare values based on attribute type
  let playerWins = false;
  let isDraw = false;

  switch (attribute) {
    case "timeToUnicorn":
    case "founded":
      // Lower is better for these attributes
      playerWins = playerCard[attribute] < aiCard[attribute];
      isDraw = playerCard[attribute] === aiCard[attribute];
      break;
    default:
      // Higher is better for power and valuation
      playerWins = playerCard[attribute] > aiCard[attribute];
      isDraw = playerCard[attribute] === aiCard[attribute];
  }

  if (isDraw) return "draw";
  return playerWins ? "win" : "lose";
};
