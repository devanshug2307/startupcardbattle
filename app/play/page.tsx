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

export default function PlayGame() {
  const router = useRouter();
  const [gameState, setGameState] = useState<"select" | "battle" | "result">(
    "select"
  );
  const [playerDeck, setPlayerDeck] = useState<any[]>([]);
  const [aiDeck, setAiDeck] = useState<any[]>([]);
  const [selectedCards, setSelectedCards] = useState<any[]>([]);
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
    setPlayerDeck(shuffled.slice(0, 10));
    setAiDeck(shuffled.slice(10, 20));
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

  const handleCardSelect = (card: any) => {
    if (selectedCards.includes(card)) {
      setSelectedCards(selectedCards.filter((c) => c !== card));
    } else if (selectedCards.length < 4) {
      setSelectedCards([...selectedCards, card]);
    }
  };

  const handleAttributeSelect = (attribute: string) => {
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
    setPlayerDeck(shuffled.slice(0, 10));
    setAiDeck(shuffled.slice(10, 20));
  };

  const shareResult = () => {
    setShowSharePrompt(true);

    // In a real app, this would generate a shareable image or link
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

  const renderCardFront = (card: any, isPlayerCard = true, showAll = false) => (
    <div
      className={cn(
        "relative w-full h-full rounded-lg overflow-hidden bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col",
        battleResult === "win" && isPlayerCard && "ring-4 ring-green-500",
        battleResult === "lose" && !isPlayerCard && "ring-4 ring-green-500",
        battleResult === "lose" && isPlayerCard && "ring-4 ring-red-500",
        battleResult === "win" && !isPlayerCard && "ring-4 ring-red-500"
      )}
    >
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 text-white font-bold text-center">
        {card.name}
      </div>
      <div className="p-3 flex-grow flex flex-col justify-between">
        <div className="text-xs text-gray-300 mb-2">{card.category}</div>

        <div className="space-y-2">
          <div
            className={cn(
              "flex justify-between items-center p-1 rounded",
              battleAttribute === "founded" && "bg-blue-900"
            )}
            onClick={() =>
              isPlayerCard &&
              gameState === "battle" &&
              !battleAttribute &&
              handleAttributeSelect("founded")
            }
          >
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1 text-yellow-400" />
              <span className="text-xs">Founded</span>
            </div>
            <div className="font-bold">
              {showAll || battleAttribute === "founded"
                ? card.founded
                : isPlayerCard
                ? card.founded
                : "?"}
            </div>
          </div>

          <div
            className={cn(
              "flex justify-between items-center p-1 rounded",
              battleAttribute === "revenue" && "bg-blue-900"
            )}
            onClick={() =>
              isPlayerCard &&
              gameState === "battle" &&
              !battleAttribute &&
              handleAttributeSelect("revenue")
            }
          >
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
              <span className="text-xs">Revenue</span>
            </div>
            <div className="font-bold">
              {showAll || battleAttribute === "revenue"
                ? formatRevenue(card.revenue)
                : isPlayerCard
                ? formatRevenue(card.revenue)
                : "?"}
            </div>
          </div>

          <div
            className={cn(
              "flex justify-between items-center p-1 rounded",
              battleAttribute === "timeToUnicorn" && "bg-blue-900"
            )}
            onClick={() =>
              isPlayerCard &&
              gameState === "battle" &&
              !battleAttribute &&
              handleAttributeSelect("timeToUnicorn")
            }
          >
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-blue-400" />
              <span className="text-xs">Time to Unicorn</span>
            </div>
            <div className="font-bold">
              {showAll || battleAttribute === "timeToUnicorn"
                ? formatTimeToUnicorn(card.timeToUnicorn)
                : isPlayerCard
                ? formatTimeToUnicorn(card.timeToUnicorn)
                : "?"}
            </div>
          </div>

          <div
            className={cn(
              "flex justify-between items-center p-1 rounded",
              battleAttribute === "valuation" && "bg-blue-900"
            )}
            onClick={() =>
              isPlayerCard &&
              gameState === "battle" &&
              !battleAttribute &&
              handleAttributeSelect("valuation")
            }
          >
            <div className="flex items-center">
              <DollarSign className="w-4 h-4 mr-1 text-purple-400" />
              <span className="text-xs">Valuation</span>
            </div>
            <div className="font-bold">
              {showAll || battleAttribute === "valuation"
                ? formatValuation(card.valuation)
                : isPlayerCard
                ? formatValuation(card.valuation)
                : "?"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // Add categories array
  const categories = ["All", "Fintech", "Consumer", "SaaS", "EdTech"];

  const captureAndShare = async () => {
    const summaryElement = document.getElementById("battle-summary");
    if (!summaryElement) return;

    try {
      // Dynamic import of html2canvas
      const html2canvas = (await import("html2canvas")).default;
      const canvas = await html2canvas(summaryElement);
      const imageUrl = canvas.toDataURL("image/png");

      // Create sharing text
      const shareText = `🦄 I just ${
        playerScore > aiScore ? "won" : "played"
      } a game of Unicorn Battle!\n
Score: ${playerScore * 100}${playerScore > aiScore ? " +50 bonus!" : ""}\n
Can you beat my score? 🎮\n
Play now at [your-game-url]`;

      // For Twitter
      const twitterUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(
        shareText
      )}`;

      // Create temporary link for image download
      const downloadLink = document.createElement("a");
      downloadLink.href = imageUrl;
      downloadLink.download = "unicorn-battle-result.png";

      return { imageUrl, twitterUrl, downloadLink };
    } catch (error) {
      console.error("Error capturing result:", error);
      return null;
    }
  };

  const formatAttributeValue = (value: number, attribute: string) => {
    switch (attribute) {
      case "revenue":
        return formatRevenue(value);
      case "timeToUnicorn":
        return formatTimeToUnicorn(value);
      case "valuation":
        return formatValuation(value);
      default:
        return value;
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <h1 className="text-xl font-bold">Unicorn Battle</h1>

        <div className="w-6"></div>
      </header>

      {/* Game Content */}
      <main className="flex-grow p-4 flex flex-col">
        {gameState === "select" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
          >
            <div className="flex flex-col space-y-4 mb-6">
              <h2 className="text-xl font-bold">Select 4 Cards for Battle</h2>

              {/* Category Tabs */}
              <Tabs
                defaultValue="all"
                className="w-full"
                onValueChange={(value) => setActiveCategory(value)}
              >
                <TabsList className="grid w-full grid-cols-5 lg:w-[600px]">
                  {categories.map((category) => (
                    <TabsTrigger
                      key={category.toLowerCase()}
                      value={category.toLowerCase()}
                      className="text-sm"
                    >
                      {category}
                    </TabsTrigger>
                  ))}
                </TabsList>
              </Tabs>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 mb-6">
              {playerDeck
                .filter(
                  (card) =>
                    activeCategory === "all" ||
                    card.category.toLowerCase() === activeCategory
                )
                .map((card, index) => (
                  <motion.div
                    key={index}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className={cn(
                      "relative h-48 rounded-lg overflow-hidden cursor-pointer transition-all duration-300",
                      selectedCards.includes(card) && "ring-4 ring-yellow-500"
                    )}
                    onClick={() => handleCardSelect(card)}
                  >
                    {/* Selection Number */}
                    {selectedCards.includes(card) && (
                      <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 
                                  bg-yellow-500 text-black rounded-full w-12 h-12 
                                  flex items-center justify-center font-bold text-xl
                                  shadow-lg z-20"
                      >
                        {selectedCards.indexOf(card) + 1}
                      </motion.div>
                    )}

                    {/* Card Content */}
                    <div
                      className={cn(
                        "relative w-full h-full transition-opacity duration-300",
                        selectedCards.includes(card) && "opacity-80"
                      )}
                    >
                      {renderCardFront(card, true, true)}
                    </div>
                  </motion.div>
                ))}
            </div>

            {/* Selection Stats */}
            <div className="mt-auto">
              <Button
                className={cn(
                  "w-full py-6 text-lg font-bold rounded-lg transition-all duration-300",
                  selectedCards.length === 4
                    ? "bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                    : "bg-gray-700"
                )}
                disabled={selectedCards.length !== 4}
                onClick={startGame}
              >
                {selectedCards.length === 4
                  ? "Start Battle"
                  : `Select ${4 - selectedCards.length} More Cards`}
              </Button>
            </div>
          </motion.div>
        )}

        {gameState === "battle" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="flex flex-col h-full"
          >
            <div className="flex justify-between items-center mb-4">
              <div className="text-lg font-bold">Round {currentRound}/4</div>
              <div className="flex items-center space-x-4">
                <div className="text-blue-400">You: {playerScore}</div>
                <div className="text-red-400">AI: {aiScore}</div>
              </div>
            </div>

            {!battleAttribute && (
              <div className="mb-4">
                <div className="flex justify-between mb-1">
                  <span>Select an attribute</span>
                  <span>{timeLeft}s</span>
                </div>
                <Progress value={(timeLeft / 15) * 100} className="h-2" />
              </div>
            )}

            <div className="flex flex-col space-y-4 mb-4">
              <AnimatePresence>
                {battleResult && (
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0 }}
                    className={cn(
                      "text-center py-2 rounded-lg font-bold",
                      battleResult === "win" && "bg-green-600",
                      battleResult === "lose" && "bg-red-600",
                      battleResult === "draw" && "bg-yellow-600"
                    )}
                  >
                    {battleResult === "win" && "You win this round!"}
                    {battleResult === "lose" && "AI wins this round!"}
                    {battleResult === "draw" && "It's a draw!"}
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="grid grid-cols-2 gap-4">
                <div className="h-64">
                  {renderCardFront(selectedCards[currentRound - 1], true)}
                </div>
                <div className="h-64">
                  {renderCardFront(aiDeck[currentRound - 1], false)}
                </div>
              </div>
            </div>

            {!battleAttribute && (
              <div className="mt-auto">
                <div className="text-center mb-2">
                  Tap an attribute on your card to battle
                </div>
              </div>
            )}
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

            {/* Battle Summary Card - Enhanced for desktop */}
            <Card
              id="battle-summary"
              className="w-full bg-gray-900/90 border-gray-800 overflow-hidden backdrop-blur-sm"
            >
              <CardHeader className="border-b border-gray-800/50 p-4">
                <CardTitle className="text-xl md:text-2xl text-center bg-clip-text text-transparent bg-gradient-to-r from-blue-400 to-purple-400">
                  Battle Summary
                </CardTitle>
              </CardHeader>
              <div className="p-4 md:p-6 grid gap-3 md:gap-4">
                {Array.from({ length: 4 }).map((_, i) => (
                  <motion.div
                    key={i}
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
                    <div className="relative bg-gray-950/90 rounded-xl p-4 md:p-5">
                      <div className="grid grid-cols-[auto,1fr,auto,1fr] items-center gap-4 md:gap-6">
                        {/* Round Number */}
                        <div className="flex items-center justify-center w-8 h-8 md:w-10 md:h-10 rounded-lg bg-gray-800/50 font-bold text-gray-400">
                          R{i + 1}
                        </div>

                        {/* Player Side */}
                        <div className="min-w-0">
                          <div className="text-base md:text-lg font-medium text-gray-200 truncate mb-1">
                            {selectedCards[i].name}
                          </div>
                          <div className="flex items-center gap-2">
                            {renderAttributeIcon(roundAttributes[i])}
                            <span className="text-xl md:text-2xl font-bold text-blue-400">
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
                            "px-3 py-1 text-sm md:text-base font-semibold",
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
                          <div className="text-base md:text-lg font-medium text-gray-200 truncate mb-1">
                            {aiDeck[i].name}
                          </div>
                          <div className="flex items-center justify-end gap-2">
                            <span className="text-xl md:text-2xl font-bold text-red-400">
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

            {/* Action Buttons - Desktop optimized */}
            <div className="grid grid-cols-2 gap-4 w-full max-w-2xl mx-auto mt-6">
              <Button
                variant="outline"
                className="relative group py-4 md:py-6 text-lg"
                onClick={async () => {
                  const shareData = await captureAndShare();
                  if (shareData) {
                    window.open(shareData.twitterUrl, "_blank");
                    shareData.downloadLink.click();
                  }
                }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-blue-400/20 to-purple-400/20 opacity-0 group-hover:opacity-100 transition-opacity"
                  animate={{ x: [-100, 100] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                />
                <div className="relative flex items-center justify-center gap-3">
                  <Twitter className="h-5 w-5 md:h-6 md:w-6" />
                  <span className="font-medium">Share Result</span>
                </div>
              </Button>

              <Button
                className="relative py-4 md:py-6 text-lg bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                onClick={resetGame}
              >
                <div className="relative flex items-center justify-center gap-3">
                  <span className="font-medium">Play Again</span>
                  <motion.span
                    animate={{ x: [0, 4, 0] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                    className="text-xl"
                  >
                    →
                  </motion.span>
                </div>
              </Button>
            </div>
          </motion.div>
        )}
      </main>
    </div>
  );
}
