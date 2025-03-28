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

  // Initialize game
  useEffect(() => {
    // Shuffle and distribute cards
    const shuffled = [...startupData].sort(() => 0.5 - Math.random());
    setPlayerDeck(shuffled.slice(0, 10) as StartupCard[]);
    setAiDeck(shuffled.slice(10, 20) as StartupCard[]);
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
    // Get the most valuable startup from player's selected cards
    const bestStartup = selectedCards.reduce((prev, curr) =>
      curr.valuation > prev.valuation ? curr : prev
    );

    // Create an engaging header with battle result
    const resultEmoji =
      playerScore > aiScore ? "🏆" : playerScore === aiScore ? "🤝" : "💪";
    const header =
      `Epic battle with ${bestStartup.name} ${resultEmoji}\n` +
      `${"⭐".repeat(playerScore)}-${aiScore} • ${
        selectedCards.length
      } Unicorns\n\n`;

    // Generate battle summary with emojis and startup names
    const rounds = roundAttributes
      .map((attr, i) => {
        const playerValue = selectedCards[i][attr];
        const aiValue = aiDeck[i][attr];

        // Get attribute emoji
        const attrEmoji = {
          founded: "⚡",
          revenue: "📈",
          timeToUnicorn: "🦄",
          valuation: "💰",
        }[attr];

        // Determine winner and get appropriate emoji
        let result = "";
        if (attr === "timeToUnicorn" || attr === "founded") {
          result =
            playerValue < aiValue ? "🟩" : playerValue > aiValue ? "🟥" : "🟨";
        } else {
          result =
            playerValue > aiValue ? "🟩" : playerValue < aiValue ? "🟥" : "🟨";
        }

        // Add startup name only for wins
        const isWin =
          attr === "timeToUnicorn" || attr === "founded"
            ? playerValue < aiValue
            : playerValue > aiValue;

        return `${attrEmoji} ${result}${
          isWin ? ` ${selectedCards[i].name}` : ""
        }`;
      })
      .join("\n");

    // Add viral call-to-action
    const footer =
      "\n\nThink you can do better? 💪\n" +
      "Play Startup Card Battle at startupcards.game 🚀";

    return header + rounds + footer;
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

            {/* Selection Badge */}
            <motion.div
              initial={{ scale: 0, rotate: -180 }}
              animate={{ scale: 1, rotate: 0 }}
              className="absolute top-3 right-3 w-8 h-8 rounded-full 
                       bg-gradient-to-r from-purple-500 to-pink-500
                       flex items-center justify-center text-white font-bold
                       shadow-lg z-20 ring-2 ring-white/20"
            >
              {selectedCards.indexOf(card) + 1}
            </motion.div>
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
                  Select 4 cards to build your battle deck. Choose wisely - different attributes matter in different rounds!
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
                    animate={{ width: `${(selectedCards.length / 4) * 100}%` }}
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
                  value: selectedCards.length ? 
                    Math.round(selectedCards.reduce((acc, card) => acc + card.valuation, 0) / selectedCards.length) : 
                    "-",
                  icon: Zap,
                      color: "text-yellow-400",
                      bg: "bg-yellow-500/10"
                },
                {
                  label: "Categories",
                  value: selectedCards.length ?
                    `${new Set(selectedCards.map(card => card.category)).size}/4` : 
                    "-",
                  icon: Layout,
                      color: "text-blue-400",
                      bg: "bg-blue-500/10"
                },
                {
                  label: "Avg Year",
                  value: selectedCards.length ?
                    Math.round(selectedCards.reduce((acc, card) => acc + card.founded, 0) / selectedCards.length) : 
                    "-",
                  icon: Calendar,
                      color: "text-green-400",
                      bg: "bg-green-500/10"
                }
              ].map((stat) => (
                <div
                  key={stat.label}
                      className={`${stat.bg} rounded-lg p-3 border border-gray-800`}
                    >
                      <div className="flex items-center gap-2">
                        <stat.icon className="w-4 h-4 text-gray-400" />
                        <span className="text-sm text-gray-300">{stat.label}</span>
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
                        <span className="text-sm font-medium text-purple-200">Battle Tips</span>
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
                      color: "bg-green-500/10"
                    },
                    {
                      tip: "Newer startups win founding year rounds",
                      icon: "📅",
                      color: "bg-blue-500/10"
                    },
                    {
                      tip: "Faster unicorns win speed rounds",
                      icon: "⚡",
                      color: "bg-yellow-500/10"
                    },
                    {
                      tip: "Higher revenue wins revenue rounds",
                      icon: "📈",
                      color: "bg-pink-500/10"
                    }
                    ].map((tip) => (
                      <div
                        key={tip.tip}
                          className={`flex items-start gap-2 ${tip.color} rounded-lg p-3`}
                      >
                          <span className="text-xl">{tip.icon}</span>
                          <span className="text-sm leading-tight text-gray-300">{tip.tip}</span>
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
                  <Tabs defaultValue="all" className="w-full" onValueChange={setActiveCategory}>
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
                .filter(card => activeCategory === "all" || card.category.toLowerCase() === activeCategory)
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

                    {/* Selection Number */}
                    <AnimatePresence>
                      {selectedCards.includes(card) && (
                        <motion.div
                          initial={{ opacity: 0, scale: 0.5 }}
                          animate={{ opacity: 1, scale: 1 }}
                          exit={{ opacity: 0, scale: 0.5 }}
                              className="absolute top-2 right-2 w-6 h-6 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center text-white text-sm font-bold shadow-lg"
                        >
                            {selectedCards.indexOf(card) + 1}
                        </motion.div>
                      )}
                    </AnimatePresence>
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

        {gameState === "battle" && (
          <motion.div
            className="w-full max-w-4xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            {/* Battle Arena */}
            <div className="relative w-full h-[500px] sm:h-[550px] md:h-[600px] rounded-xl overflow-hidden bg-gradient-to-b from-gray-900 to-gray-950 border border-purple-500/20">
              {/* Animated background effects */}
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px] opacity-50" />
              <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(130,71,229,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(130,71,229,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

              {/* Battle status bar */}
              <div className="absolute top-0 left-0 right-0 p-3 flex justify-between items-center bg-gray-900/80 backdrop-blur-sm border-b border-purple-500/20 z-10">
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-300">
                    Round {currentRound}/4
                  </div>
                  <div className="h-2 w-24 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
                      style={{ width: `${(currentRound / 4) * 100}%` }}
                    />
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-blue-400">
                      You: {playerScore}
                    </div>
                  </div>
                  <div className="text-xs text-gray-500">vs</div>
                  <div className="flex items-center">
                    <div className="text-sm font-medium text-red-400">
                      AI: {aiScore}
                    </div>
                  </div>
                </div>
              </div>

              {/* Timer */}
              {!battleAttribute && (
                <div className="absolute top-14 left-1/2 -translate-x-1/2 z-10">
                  <div className="flex flex-col items-center">
                    <div className="text-sm text-gray-400 mb-1">
                      Choose an attribute
                    </div>
                    <div className="w-16 h-16 rounded-full bg-gray-800/80 border border-purple-500/30 flex items-center justify-center">
                      <motion.div
                        animate={{
                          scale: [1, 1.1, 1],
                        }}
                        transition={{ duration: 1, repeat: Infinity }}
                      >
                        <span className="text-2xl font-bold text-purple-400">
                          {timeLeft}
                        </span>
                      </motion.div>
                    </div>
                  </div>
                </div>
              )}

              {/* Battle area */}
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <div className="w-full flex flex-col md:flex-row items-center justify-between px-4 md:px-12 gap-6 md:gap-10">
                  {/* Player Card */}
                  <motion.div
                    className="w-full md:w-2/5"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative">
                      {/* Player label */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-blue-500/80 px-3 py-1 rounded-full text-xs font-medium text-white z-10">
                        YOU
                      </div>

                      {/* Card container */}
                      <div className="relative w-full aspect-[3/4] max-w-[220px] mx-auto">
                        {/* Card background with retro design */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-blue-900/90 to-blue-950/90 border-2 border-blue-500/50 overflow-hidden card-shine">
                          <div className="absolute inset-0 card-circuit-pattern opacity-10" />

                          {/* Card content */}
                          <div className="relative h-full flex flex-col p-3">
                            {/* Card header */}
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-xs font-bold px-2 py-0.5 rounded bg-blue-500/20 text-blue-300">
                                {selectedCards[currentRound - 1].category}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-blue-400" />
                                <span className="text-xs text-gray-300">
                                  {selectedCards[currentRound - 1].founded}
                                </span>
                              </div>
                            </div>

                            {/* Card name */}
                            <div className="text-center my-2">
                              <h3 className="text-lg font-bold text-white">
                                {selectedCards[currentRound - 1].name}
                              </h3>
                            </div>

                            {/* Card attributes */}
                            <div className="flex-grow grid grid-cols-2 gap-2 mt-2">
                              {[
                                {
                                  name: "Valuation",
                                  value: formatValuation(
                                    selectedCards[currentRound - 1].valuation
                                  ),
                                  icon: DollarSign,
                                  color: "purple",
                                  key: "valuation",
                                },
                                {
                                  name: "Revenue",
                                  value: formatRevenue(
                                    selectedCards[currentRound - 1].revenue
                                  ),
                                  icon: TrendingUp,
                                  color: "green",
                                  key: "revenue",
                                },
                                {
                                  name: "Time to Unicorn",
                                  value: formatTimeToUnicorn(
                                    selectedCards[currentRound - 1]
                                      .timeToUnicorn
                                  ),
                                  icon: Zap,
                                  color: "yellow",
                                  key: "timeToUnicorn",
                                },
                                {
                                  name: "Founded",
                                  value:
                                    selectedCards[
                                      currentRound - 1
                                    ].founded.toString(),
                                  icon: Calendar,
                                  color: "blue",
                                  key: "founded",
                                },
                              ].map((attr) => (
                                <motion.div
                                  key={attr.key}
                                  className={cn(
                                    "rounded-lg p-2 flex flex-col items-center justify-center cursor-pointer",
                                    !battleAttribute
                                      ? [
                                          attr.color === "purple" &&
                                            "bg-purple-500/20 hover:bg-purple-500/40",
                                          attr.color === "green" &&
                                            "bg-green-500/20 hover:bg-green-500/40",
                                          attr.color === "yellow" &&
                                            "bg-yellow-500/20 hover:bg-yellow-500/40",
                                          attr.color === "blue" &&
                                            "bg-blue-500/20 hover:bg-blue-500/40",
                                        ]
                                      : battleAttribute === attr.key
                                      ? [
                                          attr.color === "purple" &&
                                            "bg-purple-500/50 ring-2 ring-purple-400",
                                          attr.color === "green" &&
                                            "bg-green-500/50 ring-2 ring-green-400",
                                          attr.color === "yellow" &&
                                            "bg-yellow-500/50 ring-2 ring-yellow-400",
                                          attr.color === "blue" &&
                                            "bg-blue-500/50 ring-2 ring-blue-400",
                                        ]
                                      : "bg-gray-500/10 opacity-50"
                                  )}
                                  onClick={() =>
                                    !battleAttribute &&
                                    handleAttributeSelect(attr.key)
                                  }
                                  whileHover={
                                    !battleAttribute ? { scale: 1.05 } : {}
                                  }
                                  whileTap={
                                    !battleAttribute ? { scale: 0.95 } : {}
                                  }
                                >
                                  <attr.icon
                                    className={cn(
                                      "h-4 w-4 mb-1",
                                      attr.color === "purple" &&
                                        "text-purple-400",
                                      attr.color === "green" &&
                                        "text-green-400",
                                      attr.color === "yellow" &&
                                        "text-yellow-400",
                                      attr.color === "blue" && "text-blue-400"
                                    )}
                                  />
                                  <div className="text-[10px] text-gray-400">
                                    {attr.name}
                                  </div>
                                  <div className="text-xs font-semibold text-white">
                                    {attr.value}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>

                  {/* AI Card */}
                  <motion.div
                    className="w-full md:w-2/5"
                    initial={{ x: 50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                  >
                    <div className="relative">
                      {/* AI label */}
                      <div className="absolute -top-6 left-1/2 -translate-x-1/2 bg-red-500/80 px-3 py-1 rounded-full text-xs font-medium text-white z-10">
                        AI
                      </div>

                      {/* Card container */}
                      <div className="relative w-full aspect-[3/4] max-w-[220px] mx-auto">
                        {/* Card background with retro design */}
                        <div className="absolute inset-0 rounded-xl bg-gradient-to-br from-red-900/90 to-red-950/90 border-2 border-red-500/50 overflow-hidden card-shine">
                          <div className="absolute inset-0 card-circuit-pattern opacity-10" />

                          {/* Card content */}
                          <div className="relative h-full flex flex-col p-3">
                            {/* Card header */}
                            <div className="flex justify-between items-start mb-2">
                              <div className="text-xs font-bold px-2 py-0.5 rounded bg-red-500/20 text-red-300">
                                {aiDeck[currentRound - 1].category}
                              </div>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-3 w-3 text-red-400" />
                                <span className="text-xs text-gray-300">
                                  {battleAttribute
                                    ? aiDeck[currentRound - 1].founded
                                    : "?"}
                                </span>
                              </div>
                            </div>

                            {/* Card name */}
                            <div className="text-center my-2">
                              <h3 className="text-lg font-bold text-white">
                                {aiDeck[currentRound - 1].name}
                              </h3>
                            </div>

                            {/* Card attributes - hidden until revealed */}
                            <div className="flex-grow grid grid-cols-2 gap-2 mt-2">
                              {[
                                {
                                  name: "Valuation",
                                  value: formatValuation(
                                    aiDeck[currentRound - 1].valuation
                                  ),
                                  icon: DollarSign,
                                  color: "purple",
                                  key: "valuation",
                                },
                                {
                                  name: "Revenue",
                                  value: formatRevenue(
                                    aiDeck[currentRound - 1].revenue
                                  ),
                                  icon: TrendingUp,
                                  color: "green",
                                  key: "revenue",
                                },
                                {
                                  name: "Time to Unicorn",
                                  value: formatTimeToUnicorn(
                                    aiDeck[currentRound - 1].timeToUnicorn
                                  ),
                                  icon: Zap,
                                  color: "yellow",
                                  key: "timeToUnicorn",
                                },
                                {
                                  name: "Founded",
                                  value:
                                    aiDeck[currentRound - 1].founded.toString(),
                                  icon: Calendar,
                                  color: "blue",
                                  key: "founded",
                                },
                              ].map((attr) => (
                                <motion.div
                                  key={attr.key}
                                  className={cn(
                                    "rounded-lg p-2 flex flex-col items-center justify-center",
                                    !battleAttribute
                                      ? [
                                          attr.color === "purple" &&
                                            "bg-purple-500/20",
                                          attr.color === "green" &&
                                            "bg-green-500/20",
                                          attr.color === "yellow" &&
                                            "bg-yellow-500/20",
                                          attr.color === "blue" &&
                                            "bg-blue-500/20",
                                        ]
                                      : battleAttribute === attr.key
                                      ? [
                                          attr.color === "purple" &&
                                            "bg-purple-500/50 ring-2 ring-purple-400",
                                          attr.color === "green" &&
                                            "bg-green-500/50 ring-2 ring-green-400",
                                          attr.color === "yellow" &&
                                            "bg-yellow-500/50 ring-2 ring-yellow-400",
                                          attr.color === "blue" &&
                                            "bg-blue-500/50 ring-2 ring-blue-400",
                                        ]
                                      : "bg-gray-500/10 opacity-50"
                                  )}
                                >
                                  <attr.icon
                                    className={cn(
                                      "h-4 w-4 mb-1",
                                      attr.color === "purple" &&
                                        "text-purple-400",
                                      attr.color === "green" &&
                                        "text-green-400",
                                      attr.color === "yellow" &&
                                        "text-yellow-400",
                                      attr.color === "blue" && "text-blue-400"
                                    )}
                                  />
                                  <div className="text-[10px] text-gray-400">
                                    {attr.name}
                                  </div>
                                  <div className="text-xs font-semibold text-white">
                                    {attr.value}
                                  </div>
                                </motion.div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                </div>

                {/* Battle result animation */}
                <AnimatePresence>
                  {battleResult && (
                    <motion.div
                      className="absolute inset-0 pointer-events-none z-20"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      exit={{ opacity: 0 }}
                    >
                      {battleResult === "win" && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <div className="relative">
                            <motion.div
                              className="absolute -inset-20 rounded-full bg-gradient-to-r from-green-500/0 via-green-500/20 to-green-500/0 blur-xl"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0, 0.5, 0],
                              }}
                              transition={{ duration: 1.5 }}
                            />
                            <motion.div
                              className="text-6xl font-bold text-green-500"
                              animate={{
                                y: [0, -20, 0],
                                scale: [1, 1.2, 1],
                              }}
                              transition={{ duration: 1 }}
                            >
                              WIN!
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                      {battleResult === "lose" && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <div className="relative">
                            <motion.div
                              className="absolute -inset-20 rounded-full bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 blur-xl"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0, 0.5, 0],
                              }}
                              transition={{ duration: 1.5 }}
                            />
                            <motion.div
                              className="text-6xl font-bold text-red-500"
                              animate={{
                                y: [0, -20, 0],
                                scale: [1, 1.2, 1],
                              }}
                              transition={{ duration: 1 }}
                            >
                              LOSE!
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                      {battleResult === "draw" && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          exit={{ scale: 0 }}
                        >
                          <div className="relative">
                            <motion.div
                              className="absolute -inset-20 rounded-full bg-gradient-to-r from-yellow-500/0 via-yellow-500/20 to-yellow-500/0 blur-xl"
                              animate={{
                                scale: [1, 1.5, 1],
                                opacity: [0, 0.5, 0],
                              }}
                              transition={{ duration: 1.5 }}
                            />
                            <motion.div
                              className="text-6xl font-bold text-yellow-500"
                              animate={{
                                y: [0, -20, 0],
                                scale: [1, 1.2, 1],
                              }}
                              transition={{ duration: 1 }}
                            >
                              DRAW!
                            </motion.div>
                          </div>
                        </motion.div>
                      )}
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Battle controls */}
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-gray-900/80 backdrop-blur-sm border-t border-purple-500/20 z-10">
                {battleAttribute ? (
                  <motion.button
                    className="w-full py-3 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white font-medium"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={handleNextRound}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                  >
                    {currentRound < 4 ? "Next Round" : "See Results"}
                  </motion.button>
                ) : (
                  <div className="text-center text-sm text-gray-400">
                    Select an attribute to battle with
                  </div>
                )}
              </div>
            </div>

            {/* Battle tips */}
            <div className="mt-4 p-3 rounded-lg bg-gray-900/50 border border-purple-500/20">
              <div className="flex items-center gap-2 text-sm text-gray-400">
                <InfoIcon className="h-4 w-4 text-purple-400" />
                <span>
                  <span className="text-purple-400 font-medium">
                    Battle Tip:
                  </span>{" "}
                  For Valuation & Revenue, higher values win. For Founded Year &
                  Time to Unicorn, lower values win.
                </span>
              </div>
            </div>
          </motion.div>
        )}

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
          </motion.div>
        )}
      </main>
    </div>
  );
}
