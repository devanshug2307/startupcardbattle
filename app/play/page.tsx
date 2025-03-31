"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
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
  formatRevenue,
  formatTimeToUnicorn,
  formatValuation,
} from "@/lib/utils";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import html2canvas from "html2canvas";
import {
  Collapsible,
  CollapsibleTrigger,
  CollapsibleContent,
} from "@/components/ui/collapsible";

// First, let's add proper type definitions at the top of the file
type StartupCard = {
  name: string;
  category: string;
  founded: number;
  revenue: number;
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
  };
}

// Add these new animation variants at the top
const battleAnimationVariants = {
  playerAttack: {
    x: [0, 100, 0],
    rotate: [0, 15, 0],
    transition: { duration: 0.5 },
  },
  aiAttack: {
    x: [0, -100, 0],
    rotate: [0, -15, 0],
    transition: { duration: 0.5 },
  },
  shake: {
    x: [0, -10, 10, -10, 10, 0],
    transition: { duration: 0.4 },
  },
  hover: {
    y: [0, -10, 0],
    transition: {
      duration: 2,
      repeat: Infinity,
      ease: "easeInOut",
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

export default function PlayGame() {
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

  // Initialize game
  useEffect(() => {
    // Get today's date-based seed
    const dateSeed = getDateSeed();

    // Shuffle using deterministic algorithm based on the date
    const shuffled = deterministicShuffle(startupData, dateSeed);

    // Always assign the same cards to player and AI for a given day
    setPlayerDeck(shuffled.slice(0, 10) as StartupCard[]);
    setAiDeck(shuffled.slice(10, 20) as StartupCard[]);

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
      }, 1000);
    } else if (isTimerActive && timeLeft === 0) {
      // Auto-select a random attribute if time runs out
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

  const startGame = () => {
    if (selectedCards.length < 4) return;

    setGameState("battle");
    setCurrentRound(1);
    setPlayerScore(0);
    setAiScore(0);
  };

  const handleCardSelect = (card: StartupCard) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter((c) => c !== card));
    } else if (selectedCards.length < 4) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleAttributeSelect = (attribute: string) => {
    console.log("Selected attribute:", attribute); // Add this for debugging
    setBattleAttribute(attribute);
    setIsTimerActive(false);

    // Store the attribute used for this round
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

    if (isDraw) {
      setBattleResult("draw");
    } else if (playerWins) {
      setPlayerScore(playerScore + 1);
      setBattleResult("win");
    } else {
      setAiScore(aiScore + 1);
      setBattleResult("lose");
    }

    // Move to next round or end game
    setTimeout(() => {
      if (currentRound < 4) {
        setCurrentRound(currentRound + 1);
        setBattleAttribute(null);
        setBattleResult(null);
      } else {
        setGameState("result");
      }
    }, 2000);
  };

  const resetGame = () => {
    setGameState("select");
    setSelectedCards([]);
    setBattleAttribute(null);
    setBattleResult(null);
    setRoundAttributes([]); // Clear round attributes

    // Reshuffle cards
    const shuffled = [...startupData].sort(() => 0.5 - Math.random());
    setPlayerDeck(shuffled.slice(0, 10) as StartupCard[]);
    setAiDeck(shuffled.slice(10, 20) as StartupCard[]);
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
    const header = `Startup Battle #${currentDay} ${playerScore}/4 ${resultEmoji}\n\n`;

    // Keep the grid generation code the same
    const grid = roundAttributes
      .map((attr, i) => {
        const playerValue = selectedCards[i][attr];
        const aiValue = aiDeck[i][attr];
        const isLowerBetter = attr === "timeToUnicorn" || attr === "founded";

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
        const attrIcon = {
          founded: "🚀",
          revenue: "💸",
          timeToUnicorn: "🦄",
          valuation: "💰",
        }[attr];

        // Show startup name only for wins (green squares)
        const startupName = outcome === "🟩" ? ` ${selectedCards[i].name}` : "";

        return `${attrIcon} ${outcome}${startupName}`;
      })
      .join("\n");

    // Add a more direct challenge in the footer
    const footer = `\n\nCan you beat my ${playerScore}/4 at startupcards.game? #StartupBattle`;

    return header + grid + footer;
  };

  const shareResult = async () => {
    const shareText = generateShareText();

    if (navigator.share) {
      try {
        await navigator.share({
          text: shareText,
        });
      } catch (error) {
        console.error("Error sharing:", error);
        // Fallback to clipboard
        await navigator.clipboard.writeText(shareText);
        setShowSharePrompt(true);
      }
    } else {
      // Fallback to clipboard
      await navigator.clipboard.writeText(shareText);
      setShowSharePrompt(true);
    }

    // Hide prompt after delay
    setTimeout(() => {
      setShowSharePrompt(false);
    }, 3000);
  };

  const renderAttributeIcon = (attribute: string) => {
    switch (attribute) {
      case "founded":
        return <Zap className="w-5 h-5" />;
      case "revenue":
        return <TrendingUp className="w-5 h-5" />;
      case "timeToUnicorn":
        return <Users className="w-5 h-5" />;
      case "valuation":
        return <DollarSign className="w-5 h-5" />;
      default:
        return null;
    }
  };

  // Update the CardComponent to fix the animation issue
  const CardComponent = ({
    card,
    isSelected,
    onSelect,
  }: {
    card: StartupCard;
    isSelected: boolean;
    onSelect: () => void;
  }) => (
    <motion.div
      whileHover={{
        scale: 1.05,
        y: -8,
        transition: { duration: 0.2 },
      }}
      whileTap={{ scale: 0.95 }}
      onClick={onSelect}
      className={cn(
        "relative aspect-[3/4] rounded-2xl cursor-pointer overflow-hidden",
        "group transition-transform duration-300",
        isSelected
          ? "ring-4 ring-purple-500/50 shadow-[0_0_40px_rgba(168,85,247,0.4)]"
          : "ring-2 ring-purple-900/50 hover:ring-purple-700/50 shadow-xl"
      )}
    >
      {/* Holographic Effect - Only show on hover or when selected */}
      <div
        className={cn(
          "absolute inset-0 bg-gradient-to-br from-purple-500/5 to-blue-500/5 transition-opacity duration-300 z-10",
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        )}
      />
      <div
        className={cn(
          "absolute inset-0 mix-blend-overlay z-10 card-holographic pointer-events-none transition-opacity duration-300",
          isSelected
            ? "opacity-[0.04]"
            : "opacity-[0.02] group-hover:opacity-[0.04]"
        )}
      />

      {/* Selection Overlay */}
      <AnimatePresence>
        {isSelected && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-20"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 to-pink-500/20" />
            <motion.div
              animate={{
                opacity: [0.3, 0.6, 0.3],
                scale: [1, 1.05, 1],
              }}
              transition={{ duration: 2, repeat: Infinity }}
              className="absolute inset-0 bg-gradient-to-br from-purple-500/10 to-pink-500/10"
            />

            {/* Selection Badge - Static version without animations */}
            <div
              className="absolute top-3 right-3 w-8 h-8 rounded-full 
                       bg-gradient-to-r from-purple-500 to-pink-500
                       flex items-center justify-center text-white font-bold
                       shadow-lg z-20 ring-2 ring-white/20"
            >
              {selectedCards.indexOf(card) + 1}
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Card Content */}
      <div className="absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900">
        {/* Card Frame */}
        <div className="absolute inset-[2px] rounded-xl overflow-hidden">
          {/* Top Banner */}
          <div
            className="relative h-24 bg-gradient-to-br from-purple-600/90 to-blue-600/90 
                        overflow-hidden p-3"
          >
            <div className="absolute inset-0 card-circuit-pattern opacity-20 pointer-events-none" />

            {/* Company Name & Category */}
            <div className="relative z-10">
              <div className="flex items-start justify-between">
                <h3 className="font-bold text-xl text-white drop-shadow-lg">
                  {card.name}
                </h3>
                <Badge
                  variant="outline"
                  className="bg-white/10 border-white/20 text-white backdrop-blur-sm
                           px-2 py-0.5 text-xs font-medium"
                >
                  {card.category}
                </Badge>
              </div>

              {/* Startup Level */}
              <div className="mt-2 flex items-center gap-1">
                {Array.from({
                  length: Math.min(
                    5,
                    Math.ceil((card.revenue + card.valuation) / 4)
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
          <div className="absolute bottom-0 left-0 right-0 p-2 sm:p-4">
            <div className="grid grid-cols-2 gap-1.5 sm:gap-3">
              {[
                {
                  key: "revenue",
                  label: "Revenue",
                  value: formatRevenue(card.revenue),
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
              ].map((stat) => (
                <motion.button
                  key={`${card.name}-${stat.key}`}
                  disabled={true}
                  whileHover={{ scale: 1.02 }}
                  className={cn(
                    "relative rounded-lg sm:rounded-xl overflow-hidden p-[1px]",
                    "bg-gradient-to-br",
                    stat.color
                  )}
                >
                  <div className="relative bg-gray-900/90 rounded-lg sm:rounded-xl p-1.5 sm:p-2">
                    <div
                      className={cn(
                        "flex items-center gap-1 text-[10px] sm:text-xs truncate",
                        stat.textColor
                      )}
                    >
                      <stat.icon className="w-3 h-3 flex-shrink-0" />
                      <span className="truncate">{stat.label}</span>
                    </div>
                    <div className="font-bold text-[11px] sm:text-sm text-white mt-0.5 sm:mt-1 truncate">
                      {stat.value}
                    </div>
                  </div>
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );

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

  const formatAttributeValue = (value: string | number, attribute: string) => {
    // First convert to number if it's a string
    const numValue = typeof value === "string" ? parseFloat(value) : value;

    switch (attribute) {
      case "revenue":
        return formatRevenue(numValue);
      case "timeToUnicorn":
        return formatTimeToUnicorn(numValue);
      case "valuation":
        return formatValuation(numValue);
      default:
        return value;
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
                  Math.ceil((card.revenue + card.valuation) / 4)
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
                key: "revenue",
                label: "Revenue",
                value: formatRevenue(card.revenue),
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
                icon: Zap,
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

  // Update the battle phase render function
  const renderBattlePhase = () => {
    return (
      <div className="relative min-h-screen w-full overflow-hidden bg-gradient-to-b from-gray-900 via-purple-900/20 to-gray-900">
        {/* Battle Arena */}
        <div className="relative max-w-lg mx-auto px-3 py-4">
          {/* Top Battle HUD - Simplified for Mobile */}
          <div className="flex items-center justify-between mb-4">
            {/* Player Score */}
            <div className="flex items-center gap-2 bg-blue-950/50 rounded-lg px-3 py-1.5">
              <div className="text-blue-400 text-sm">You</div>
              <div className="text-xl font-bold text-white">{playerScore}</div>
            </div>

            {/* Round Indicator */}
            <div className="flex gap-1.5">
              {[1, 2, 3, 4].map((round) => (
                <div
                  key={round}
                  className={cn(
                    "w-2 h-2 rounded-full",
                    round === currentRound
                      ? "bg-purple-500 animate-pulse"
                      : round < currentRound
                      ? "bg-purple-700"
                      : "bg-gray-700"
                  )}
                />
              ))}
            </div>

            {/* AI Score */}
            <div className="flex items-center gap-2 bg-red-950/50 rounded-lg px-3 py-1.5">
              <div className="text-xl font-bold text-white">{aiScore}</div>
              <div className="text-red-400 text-sm">AI</div>
            </div>
          </div>

          {/* Battle Guide Tooltip */}
          {!battleAttribute && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gray-900/90 backdrop-blur-sm rounded-lg p-3 mb-4 border border-purple-500/20"
            >
              <div className="flex items-start gap-2">
                <div className="flex-shrink-0 mt-1">
                  <Lightbulb className="w-4 h-4 text-yellow-400" />
                </div>
                <div className="space-y-2 text-sm">
                  <div className="text-purple-300 font-medium">Your Turn!</div>
                  <div className="text-gray-400 text-xs space-y-1">
                    <p>🎯 Select an attribute to battle with AI</p>
                    <div className="grid grid-cols-2 gap-1">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-3 h-3 text-green-400" />
                        <span className="text-green-400">Higher wins:</span>
                        <span>Valuation, Revenue</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Calendar className="w-3 h-3 text-blue-400" />
                        <span className="text-blue-400">Lower wins:</span>
                        <span>Founded, Time to Unicorn</span>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="flex-shrink-0 text-xs text-purple-400 font-medium">
                  {timeLeft}s
                </div>
              </div>
            </motion.div>
          )}

          {/* Cards Battle Area - Stacked on Mobile */}
          <div className="space-y-4">
            {/* Player Card */}
            <motion.div
              variants={battleAnimationVariants}
              animate={
                battleResult === "win"
                  ? "playerAttack"
                  : battleResult === "lose"
                  ? "shake"
                  : "hover"
              }
              className="relative z-10"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-xl blur-lg" />
              <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-xl border border-blue-500/30 p-4">
                {/* Company Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-blue-500/20 p-2.5 flex items-center justify-center">
                    <img
                      src={`/icons/${selectedCards[
                        currentRound - 1
                      ].name.toLowerCase()}.png`}
                      alt={selectedCards[currentRound - 1].name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {selectedCards[currentRound - 1].name}
                    </h3>
                    <div className="text-sm text-blue-400">
                      {selectedCards[currentRound - 1].category}
                    </div>
                  </div>
                </div>

                {/* Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {["valuation", "revenue", "founded", "timeToUnicorn"].map(
                    (attr) => (
                      <motion.button
                        key={attr}
                        whileHover={!battleAttribute ? { scale: 1.02 } : {}}
                        whileTap={!battleAttribute ? { scale: 0.98 } : {}}
                        onClick={() =>
                          !battleAttribute && handleAttributeSelect(attr)
                        }
                        disabled={!!battleAttribute}
                        className={cn(
                          "relative p-3 rounded-lg transition-all",
                          battleAttribute === attr
                            ? "bg-blue-500/30 ring-2 ring-blue-400"
                            : "bg-gray-800/50",
                          !battleAttribute && "active:bg-gray-700/50",
                          battleAttribute &&
                            battleAttribute !== attr &&
                            "opacity-50"
                        )}
                      >
                        <div className="flex flex-col items-center">
                          <div
                            className={cn(
                              "text-blue-400 mb-1",
                              !battleAttribute && "animate-bounce"
                            )}
                          >
                            {attr === "valuation" && (
                              <DollarSign className="w-4 h-4" />
                            )}
                            {attr === "revenue" && (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            {attr === "founded" && (
                              <Calendar className="w-4 h-4" />
                            )}
                            {attr === "timeToUnicorn" && (
                              <Rocket className="w-4 h-4" />
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            {attr.split(/(?=[A-Z])/).join(" ")}
                          </div>
                          <div className="text-sm font-bold text-white mt-1">
                            {formatAttributeValue(
                              selectedCards[currentRound - 1][attr],
                              attr
                            )}
                          </div>
                        </div>
                      </motion.button>
                    )
                  )}
                </div>
              </div>
            </motion.div>

            {/* VS Badge */}
            <div className="relative flex justify-center">
              <motion.div
                animate={{
                  scale: [1, 1.1, 1],
                  rotate: [0, 5, -5, 0],
                }}
                transition={{ duration: 2, repeat: Infinity }}
                className="bg-gradient-to-r from-purple-600 to-pink-600 rounded-full p-0.5"
              >
                <div className="bg-gray-900 rounded-full px-4 py-1">
                  <span className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    VS
                  </span>
                </div>
              </motion.div>
            </div>

            {/* AI Card */}
            <motion.div
              variants={battleAnimationVariants}
              animate={
                battleResult === "lose"
                  ? "aiAttack"
                  : battleResult === "win"
                  ? "shake"
                  : "hover"
              }
              className="relative"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-red-500/20 to-orange-500/20 rounded-xl blur-lg" />
              <div className="relative bg-gray-900/90 backdrop-blur-sm rounded-xl border border-red-500/30 p-4">
                {/* AI Info */}
                <div className="flex items-center gap-3 mb-4">
                  <div className="w-12 h-12 rounded-full bg-red-500/20 p-2.5 flex items-center justify-center">
                    <Swords className="w-6 h-6 text-red-400" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">
                      {aiDeck[currentRound - 1].name}
                    </h3>
                    <div className="text-sm text-red-400">
                      {aiDeck[currentRound - 1].category}
                    </div>
                  </div>
                </div>

                {/* AI Stats Grid */}
                <div className="grid grid-cols-2 gap-2">
                  {["valuation", "revenue", "founded", "timeToUnicorn"].map(
                    (attr) => (
                      <div
                        key={attr}
                        className={cn(
                          "relative p-3 rounded-lg",
                          battleAttribute === attr
                            ? "bg-red-500/30 ring-2 ring-red-400"
                            : "bg-gray-800/50"
                        )}
                      >
                        <div className="flex flex-col items-center">
                          <div className="text-red-400 mb-1">
                            {attr === "valuation" && (
                              <DollarSign className="w-4 h-4" />
                            )}
                            {attr === "revenue" && (
                              <TrendingUp className="w-4 h-4" />
                            )}
                            {attr === "founded" && (
                              <Calendar className="w-4 h-4" />
                            )}
                            {attr === "timeToUnicorn" && (
                              <Rocket className="w-4 h-4" />
                            )}
                          </div>
                          <div className="text-xs text-gray-400">
                            {attr.split(/(?=[A-Z])/).join(" ")}
                          </div>
                          <div className="text-sm font-bold text-white mt-1">
                            {battleAttribute === attr ? (
                              <motion.div
                                initial={{ opacity: 0, scale: 0.5 }}
                                animate={{ opacity: 1, scale: 1 }}
                              >
                                {formatAttributeValue(
                                  aiDeck[currentRound - 1][attr],
                                  attr
                                )}
                              </motion.div>
                            ) : (
                              <span className="text-red-400">?</span>
                            )}
                          </div>
                        </div>
                      </div>
                    )
                  )}
                </div>
              </div>
            </motion.div>
          </div>

          {/* Timer */}
          {!battleAttribute && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="fixed bottom-4 left-1/2 -translate-x-1/2"
            >
              <div className="bg-gray-900/90 backdrop-blur-sm rounded-full px-4 py-2 border border-purple-500/30">
                <div className="text-purple-400 font-bold">{timeLeft}s</div>
              </div>
            </motion.div>
          )}
        </div>
      </div>
    );
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Streamlined Header */}
      <header className="sticky top-0 z-40 px-3 py-2 bg-gray-900/80 backdrop-blur-sm border-b border-gray-800/50">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          <Button variant="ghost" size="sm" onClick={() => router.push("/")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-lg font-bold">Unicorn Battle</h1>
          <div className="w-5" />
        </div>
      </header>

      {/* Optimized Game Content */}
      <main className="flex-grow px-3 py-2">
        {gameState === "select" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col space-y-3 max-w-7xl mx-auto px-4"
          >
            {/* Quick Tutorial Tooltip */}
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-blue-500/20 to-purple-500/20 rounded-lg p-3 sm:p-4 max-w-3xl mx-auto w-full"
            >
              <div className="flex items-start gap-2">
                <Lightbulb className="w-4 h-4 sm:w-5 sm:h-5 text-yellow-400 flex-shrink-0 mt-0.5" />
                <p className="text-xs sm:text-sm text-blue-200">
                  Select 4 cards to build your battle deck. Choose wisely -
                  different attributes matter in different rounds!
                </p>
              </div>
            </motion.div>

            {/* Desktop Layout Container */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
              {/* Left Column - Stats & Info */}
              <div className="lg:col-span-3 space-y-3">
                {/* Compact Header with Progress */}
                <div className="text-center sm:text-left bg-gray-900/50 rounded-xl p-4">
                  <h1 className="text-xl sm:text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-400 to-pink-400">
                    Build Your Battle Deck
                  </h1>
                  <div className="flex items-center gap-2 mt-2 justify-center sm:justify-start">
                    <div className="h-2 w-32 bg-gray-800 rounded-full overflow-hidden">
                      <motion.div
                        className="h-full bg-gradient-to-r from-purple-500 to-pink-500"
                        initial={{ width: "0%" }}
                        animate={{
                          width: `${(selectedCards.length / 4) * 100}%`,
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-purple-300">
                      {selectedCards.length}/4
                    </span>
                  </div>
                </div>

                {/* Quick Stats Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-1 gap-2">
                  {[
                    {
                      label: "Deck Power",
                      value: selectedCards.length
                        ? Math.round(
                            selectedCards.reduce(
                              (acc, card) => acc + card.valuation,
                              0
                            ) / selectedCards.length
                          )
                        : "-",
                      icon: Zap,
                      color: "text-yellow-400",
                      bg: "bg-yellow-500/10",
                    },
                    {
                      label: "Categories",
                      value: selectedCards.length
                        ? `${
                            new Set(selectedCards.map((card) => card.category))
                              .size
                          }/4`
                        : "-",
                      icon: Layout,
                      color: "text-blue-400",
                      bg: "bg-blue-500/10",
                    },
                    {
                      label: "Avg Year",
                      value: selectedCards.length
                        ? Math.round(
                            selectedCards.reduce(
                              (acc, card) => acc + card.founded,
                              0
                            ) / selectedCards.length
                          )
                        : "-",
                      icon: Calendar,
                      color: "text-green-400",
                      bg: "bg-green-500/10",
                    },
                  ].map((stat) => (
                    <div
                      key={stat.label}
                      className={`${stat.bg} rounded-lg p-3 border border-gray-800`}
                    >
                      <div className="flex items-center gap-2">
                        <stat.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">
                          {stat.label}
                        </span>
                      </div>
                      <div className={`text-lg font-bold mt-1 ${stat.color}`}>
                        {stat.value}
                      </div>
                    </div>
                  ))}
                </div>

                {/* Battle Tips Accordion */}
                <Collapsible>
                  <CollapsibleTrigger className="w-full">
                    <div className="flex items-center justify-between p-3 bg-gradient-to-r from-purple-500/10 to-blue-500/10 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4 text-purple-400" />
                        <span className="text-sm font-medium text-purple-200">
                          Battle Tips
                        </span>
                      </div>
                      <ChevronDown className="w-4 h-4 text-purple-400" />
                    </div>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <div className="grid grid-cols-1 gap-2 p-2">
                      {[
                        {
                          tip: "Higher valuation wins valuation rounds",
                          icon: "💰",
                          color: "bg-green-500/10",
                        },
                        {
                          tip: "Newer startups win founding year rounds",
                          icon: "📅",
                          color: "bg-blue-500/10",
                        },
                        {
                          tip: "Faster unicorns win speed rounds",
                          icon: "⚡",
                          color: "bg-yellow-500/10",
                        },
                        {
                          tip: "Higher revenue wins revenue rounds",
                          icon: "📈",
                          color: "bg-pink-500/10",
                        },
                      ].map((tip) => (
                        <div
                          key={tip.tip}
                          className={`flex items-start gap-2 ${tip.color} rounded-lg p-3`}
                        >
                          <span className="text-xl">{tip.icon}</span>
                          <span className="text-sm leading-tight text-gray-300">
                            {tip.tip}
                          </span>
                        </div>
                      ))}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </div>

              {/* Right Column - Categories & Cards */}
              <div className="lg:col-span-9 space-y-3">
                {/* Enhanced Category Navigation */}
                <div className="bg-gray-900/50 rounded-lg p-2">
                  <Tabs
                    defaultValue="all"
                    className="w-full"
                    onValueChange={setActiveCategory}
                  >
                    <TabsList className="grid grid-cols-4 gap-2">
                      {categories.map((category) => (
                        <TabsTrigger
                          key={category.name}
                          value={category.name.toLowerCase()}
                          className="relative px-3 py-2 rounded-md data-[state=active]:bg-gradient-to-r from-purple-500/20 to-pink-500/20"
                        >
                          <div className="flex items-center justify-center gap-2">
                            <category.icon className="w-4 h-4" />
                            <span className="text-sm">{category.name}</span>
                          </div>
                        </TabsTrigger>
                      ))}
                    </TabsList>
                  </Tabs>
                </div>

                {/* Card Grid */}
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3 pb-20">
                  {playerDeck
                    .filter(
                      (card) =>
                        activeCategory === "all" ||
                        card.category.toLowerCase() === activeCategory
                    )
                    .map((card, index) => (
                      <motion.div
                        key={card.name}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: index * 0.05 }}
                        className="relative"
                      >
                        <CardComponent
                          card={card}
                          isSelected={selectedCards.includes(card)}
                          onSelect={() => handleCardSelect(card)}
                        />
                      </motion.div>
                    ))}
                </div>
              </div>
            </div>

            {/* Start Battle Button */}
            <AnimatePresence>
              {selectedCards.length === 4 && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  className="fixed bottom-4 inset-x-4 sm:inset-x-auto sm:right-4 sm:left-1/2 sm:-translate-x-1/2 sm:w-96 z-50"
                >
                  <motion.button
                    onClick={startGame}
                    className="w-full bg-gradient-to-r from-purple-600 to-pink-600 text-white py-3 rounded-lg font-medium text-base shadow-lg shadow-purple-500/20 flex items-center justify-center gap-2"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Swords className="w-5 h-5" />
                    <span>Start Battle</span>
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
            className="flex flex-col items-center justify-center h-full w-full max-w-[900px] mx-auto px-4"
          >
            {/* Hero Result Section - Responsive */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="relative w-full bg-gradient-to-b from-gray-800/50 to-gray-900/50 rounded-2xl p-8 mb-6 overflow-hidden"
            >
              {/* Background Effects */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-purple-500/10 opacity-50" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_var(--tw-gradient-stops))] from-purple-500/10 via-transparent to-transparent" />

              {/* Content */}
              <div className="relative flex items-center justify-between">
                <div className="space-y-2">
                  <h2 className="text-3xl md:text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                    {playerScore > aiScore
                      ? "Victory!"
                      : playerScore === aiScore
                      ? "Draw!"
                      : "Nice Try!"}
                  </h2>
                  <div className="flex items-baseline gap-3">
                    <span className="text-4xl md:text-5xl font-bold text-white">
                      {playerScore * 100}
                    </span>
                    {playerScore > aiScore && (
                      <span className="text-xl md:text-2xl font-semibold text-green-400">
                        +50
                      </span>
                    )}
                    <span className="text-base md:text-lg text-gray-400">
                      points
                    </span>
                  </div>
                  <div className="flex items-center gap-3 text-gray-400 mt-2">
                    <span className="text-xl">
                      Rounds Won:{" "}
                      <span className="text-blue-400 font-bold">
                        {playerScore}
                      </span>
                    </span>
                    <span className="text-gray-600">•</span>
                    <span className="text-xl">
                      AI Won:{" "}
                      <span className="text-red-400 font-bold">{aiScore}</span>
                    </span>
                  </div>
                </div>

                {/* Trophy/Emoji with enhanced animation */}
                <div className="relative">
                  {playerScore > aiScore ? (
                    <div className="relative">
                      <motion.div
                        animate={{
                          rotate: [0, -10, 10, -10, 10, 0],
                          scale: [1, 1.1, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          repeatType: "reverse",
                        }}
                      >
                        <Trophy className="w-20 h-20 md:w-28 md:h-28 text-yellow-400 drop-shadow-[0_0_12px_rgba(234,179,8,0.3)]" />
                      </motion.div>
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: [0, 1.2, 1] }}
                        transition={{ delay: 0.8 }}
                        className="absolute -top-3 -right-3 animate-bounce"
                      >
                        <span className="text-2xl md:text-3xl">✨</span>
                      </motion.div>
                    </div>
                  ) : (
                    <motion.div
                      animate={{ y: [0, -5, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                      className="text-5xl md:text-6xl"
                    >
                      {playerScore === aiScore ? "🤝" : "💪"}
                    </motion.div>
                  )}
                </div>
              </div>
            </motion.div>

            {/* Battle Summary Card - Enhanced for desktop and mobile */}
            <Card
              id="battle-summary"
              className="w-full bg-gray-900/90 border-gray-800 overflow-hidden backdrop-blur-sm"
            >
              <CardHeader className="border-b border-gray-800/50 p-4">
                <CardTitle className="text-xl md:text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Battle Summary
                </CardTitle>
              </CardHeader>
              <div className="p-3 md:p-6 grid gap-2 md:gap-4 max-h-[60vh] overflow-y-auto">
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={`${i}-${roundAttributes[i]}-${
                      selectedCards[i][roundAttributes[i]]
                    }-${aiDeck[i][roundAttributes[i]]}`}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + i * 0.1 }}
                    className={cn(
                      "relative rounded-xl overflow-hidden",
                      "bg-gradient-to-r p-[1px]",
                      roundAttributes[i] === "timeToUnicorn" ||
                        roundAttributes[i] === "founded"
                        ? selectedCards[i][roundAttributes[i]] <
                          aiDeck[i][roundAttributes[i]]
                          ? "from-green-500/30 via-green-500/20 to-green-500/30"
                          : selectedCards[i][roundAttributes[i]] >
                            aiDeck[i][roundAttributes[i]]
                          ? "from-red-500/30 via-red-500/20 to-red-500/30"
                          : "from-yellow-500/30 via-yellow-500/20 to-yellow-500/30"
                        : selectedCards[i][roundAttributes[i]] >
                          aiDeck[i][roundAttributes[i]]
                        ? "from-green-500/30 via-green-500/20 to-green-500/30"
                        : selectedCards[i][roundAttributes[i]] <
                          aiDeck[i][roundAttributes[i]]
                        ? "from-red-500/30 via-red-500/20 to-red-500/30"
                        : "from-yellow-500/30 via-yellow-500/20 to-yellow-500/30"
                    )}
                  >
                    <div className="relative bg-gray-950/90 rounded-xl p-3 md:p-5">
                      <div className="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-2 md:gap-6">
                        {/* Round Number */}
                        <div className="flex items-center justify-center w-6 h-6 md:w-10 md:h-10 rounded-lg bg-gray-800/50 font-bold text-gray-400 text-sm md:text-base">
                          R{i + 1}
                        </div>

                        {/* Player Side */}
                        <div className="min-w-0">
                          <div className="text-sm md:text-lg font-medium text-gray-200 truncate mb-1">
                            {selectedCards[i].name}
                          </div>
                          <div className="flex items-center gap-1 md:gap-2">
                            {renderAttributeIcon(roundAttributes[i])}
                            <span className="text-base md:text-2xl font-bold text-blue-400">
                              {formatAttributeValue(
                                selectedCards[i][roundAttributes[i]],
                                roundAttributes[i]
                              )}
                            </span>
                          </div>
                        </div>

                        {/* Result Badge */}
                        <Badge
                          variant="outline"
                          className={cn(
                            "px-2 py-0.5 md:px-3 md:py-1 text-xs md:text-base font-semibold",
                            roundAttributes[i] === "timeToUnicorn" ||
                              roundAttributes[i] === "founded"
                              ? selectedCards[i][roundAttributes[i]] <
                                aiDeck[i][roundAttributes[i]]
                                ? "border-green-500/30 bg-green-500/10 text-green-400"
                                : selectedCards[i][roundAttributes[i]] >
                                  aiDeck[i][roundAttributes[i]]
                                ? "border-red-500/30 bg-red-500/10 text-red-400"
                                : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                              : selectedCards[i][roundAttributes[i]] >
                                aiDeck[i][roundAttributes[i]]
                              ? "border-green-500/30 bg-green-500/10 text-green-400"
                              : selectedCards[i][roundAttributes[i]] <
                                aiDeck[i][roundAttributes[i]]
                              ? "border-red-500/30 bg-red-500/10 text-red-400"
                              : "border-yellow-500/30 bg-yellow-500/10 text-yellow-400"
                          )}
                        >
                          {roundAttributes[i] === "timeToUnicorn" ||
                          roundAttributes[i] === "founded"
                            ? selectedCards[i][roundAttributes[i]] <
                              aiDeck[i][roundAttributes[i]]
                              ? "WIN"
                              : selectedCards[i][roundAttributes[i]] >
                                aiDeck[i][roundAttributes[i]]
                              ? "LOSS"
                              : "TIE"
                            : selectedCards[i][roundAttributes[i]] >
                              aiDeck[i][roundAttributes[i]]
                            ? "WIN"
                            : selectedCards[i][roundAttributes[i]] <
                              aiDeck[i][roundAttributes[i]]
                            ? "LOSS"
                            : "TIE"}
                        </Badge>

                        {/* AI Side */}
                        <div className="min-w-0 text-right">
                          <div className="text-sm md:text-lg font-medium text-gray-200 truncate mb-1">
                            {aiDeck[i].name}
                          </div>
                          <div className="flex items-center justify-end gap-1 md:gap-2">
                            <span className="text-base md:text-2xl font-bold text-red-400">
                              {formatAttributeValue(
                                aiDeck[i][roundAttributes[i]],
                                roundAttributes[i]
                              )}
                            </span>
                            {renderAttributeIcon(roundAttributes[i])}
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </Card>

            {/* Action Buttons - Fixed position for mobile */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto mt-4 mb-16 px-4">
              <Button
                variant="outline"
                className="relative py-3 md:py-6 text-base md:text-lg col-span-1 bg-gray-900 hover:bg-gray-800 border-gray-700 text-gray-100"
                onClick={shareResult}
              >
                <div className="relative flex items-center justify-center gap-2">
                  <Share2 className="h-4 w-4 md:h-6 md:w-6" />
                  <span className="font-medium">Share</span>
                </div>
              </Button>

              <Button
                className="col-span-1 py-3 md:py-6 text-base md:text-lg bg-gradient-to-r from-green-600 to-emerald-700 hover:from-green-700 hover:to-emerald-800"
                onClick={resetGame}
              >
                <div className="flex items-center justify-center gap-2">
                  <Swords className="h-4 w-4 md:h-6 md:w-6" />
                  <span>Play Again</span>
                </div>
              </Button>
            </div>

            {/* Share Prompt with enhanced message */}
            <AnimatePresence>
              {showSharePrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-4 left-4 right-4 bg-black p-4 rounded-lg border border-gray-700 shadow-lg z-50"
                >
                  <div className="text-center">
                    <div className="font-bold mb-2">
                      Battle summary copied! 📋
                    </div>
                    <div className="text-sm text-gray-400">
                      Share your results with friends and challenge them to beat
                      your score!
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Preview Message */}
            {currentDay < 1 && (
              <div className="fixed bottom-4 left-4 right-4 bg-gradient-to-r from-purple-600 to-blue-600 p-4 rounded-lg shadow-lg">
                <p className="text-center text-white font-bold">
                  Playing preview version! Official daily challenges launch on
                  March 31, 2025.
                </p>
              </div>
            )}
          </motion.div>
        )}
      </main>
    </div>
  );
}
