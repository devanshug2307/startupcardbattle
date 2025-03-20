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
  Zap,
  TrendingUp,
  Users,
  DollarSign,
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
import { cn } from "@/lib/utils";

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
      const attributes = ["innovation", "growth", "userBase", "valuation"];
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

    // Get current cards for the round
    const playerCard = selectedCards[currentRound - 1];
    const aiCard = aiDeck[currentRound - 1];

    // Compare attribute values
    if (playerCard[attribute] > aiCard[attribute]) {
      setPlayerScore(playerScore + 1);
      setBattleResult("win");
    } else if (playerCard[attribute] < aiCard[attribute]) {
      setAiScore(aiScore + 1);
      setBattleResult("lose");
    } else {
      setBattleResult("draw");
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
      case "innovation":
        return <Zap className="w-5 h-5" />;
      case "growth":
        return <TrendingUp className="w-5 h-5" />;
      case "userBase":
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
              battleAttribute === "innovation" && "bg-blue-900"
            )}
            onClick={() =>
              isPlayerCard &&
              gameState === "battle" &&
              !battleAttribute &&
              handleAttributeSelect("innovation")
            }
          >
            <div className="flex items-center">
              <Zap className="w-4 h-4 mr-1 text-yellow-400" />
              <span className="text-xs">Innovation</span>
            </div>
            <div className="font-bold">
              {showAll || battleAttribute
                ? card.innovation
                : isPlayerCard
                ? card.innovation
                : "?"}
            </div>
          </div>

          <div
            className={cn(
              "flex justify-between items-center p-1 rounded",
              battleAttribute === "growth" && "bg-blue-900"
            )}
            onClick={() =>
              isPlayerCard &&
              gameState === "battle" &&
              !battleAttribute &&
              handleAttributeSelect("growth")
            }
          >
            <div className="flex items-center">
              <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
              <span className="text-xs">Growth</span>
            </div>
            <div className="font-bold">
              {showAll || battleAttribute
                ? card.growth
                : isPlayerCard
                ? card.growth
                : "?"}
            </div>
          </div>

          <div
            className={cn(
              "flex justify-between items-center p-1 rounded",
              battleAttribute === "userBase" && "bg-blue-900"
            )}
            onClick={() =>
              isPlayerCard &&
              gameState === "battle" &&
              !battleAttribute &&
              handleAttributeSelect("userBase")
            }
          >
            <div className="flex items-center">
              <Users className="w-4 h-4 mr-1 text-blue-400" />
              <span className="text-xs">User Base</span>
            </div>
            <div className="font-bold">
              {showAll || battleAttribute
                ? card.userBase
                : isPlayerCard
                ? card.userBase
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
              {showAll || battleAttribute
                ? card.valuation
                : isPlayerCard
                ? card.valuation
                : "?"}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

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
            <h2 className="text-xl font-bold mb-4">
              Select 4 Cards for Battle
            </h2>

            <div className="grid grid-cols-2 gap-3 mb-6">
              {playerDeck.map((card, index) => (
                <motion.div
                  key={index}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={cn(
                    "relative h-48 rounded-lg overflow-hidden cursor-pointer",
                    selectedCards.includes(card) && "ring-4 ring-yellow-500"
                  )}
                  onClick={() => handleCardSelect(card)}
                >
                  {renderCardFront(card, true, true)}
                  {selectedCards.includes(card) && (
                    <div className="absolute top-2 right-2 bg-yellow-500 text-black rounded-full w-6 h-6 flex items-center justify-center font-bold">
                      {selectedCards.indexOf(card) + 1}
                    </div>
                  )}
                </motion.div>
              ))}
            </div>

            <div className="mt-auto">
              <Button
                className={cn(
                  "w-full py-6 text-lg font-bold rounded-lg",
                  selectedCards.length === 4
                    ? "bg-gradient-to-r from-green-500 to-emerald-600"
                    : "bg-gray-700"
                )}
                disabled={selectedCards.length !== 4}
                onClick={startGame}
              >
                Start Battle ({selectedCards.length}/4)
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
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="flex flex-col items-center justify-center h-full"
          >
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.3, duration: 0.5 }}
              className="w-20 h-20 mb-4"
            >
              {playerScore > aiScore ? (
                <Trophy className="w-full h-full text-yellow-400" />
              ) : (
                <div className="w-full h-full rounded-full bg-red-500 flex items-center justify-center text-4xl">
                  😢
                </div>
              )}
            </motion.div>

            <h2 className="text-2xl font-bold mb-2">
              {playerScore > aiScore
                ? "Victory!"
                : playerScore === aiScore
                ? "It's a Draw!"
                : "Defeat!"}
            </h2>

            <div className="text-xl mb-6">
              <span className="text-blue-400">{playerScore}</span> -{" "}
              <span className="text-red-400">{aiScore}</span>
            </div>

            <Card className="w-full mb-6 bg-gray-800 border-gray-700">
              <CardHeader>
                <CardTitle>Battle Summary</CardTitle>
                <CardDescription>Your performance against AI</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="flex justify-between items-center">
                      <div className="flex items-center">
                        <div className="w-8 h-8 rounded-full bg-indigo-900 flex items-center justify-center mr-2">
                          {i + 1}
                        </div>
                        <span>
                          {selectedCards[i].name} vs {aiDeck[i].name}
                        </span>
                      </div>
                      <div
                        className={cn(
                          "font-bold",
                          selectedCards[i].innovation > aiDeck[i].innovation
                            ? "text-green-500"
                            : selectedCards[i].innovation < aiDeck[i].innovation
                            ? "text-red-500"
                            : "text-yellow-500"
                        )}
                      >
                        {selectedCards[i].innovation > aiDeck[i].innovation
                          ? "Win"
                          : selectedCards[i].innovation < aiDeck[i].innovation
                          ? "Loss"
                          : "Draw"}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
              <CardFooter className="flex justify-between">
                <div>
                  Final Score:{" "}
                  <span className="font-bold">{playerScore * 100}</span>
                </div>
                {playerScore > aiScore && (
                  <div className="text-yellow-500">+50 Bonus!</div>
                )}
              </CardFooter>
            </Card>

            <div className="grid grid-cols-2 gap-4 w-full">
              <Button variant="outline" className="py-6" onClick={shareResult}>
                <Share2 className="mr-2 h-4 w-4" />
                Share Result
              </Button>

              <Button
                className="py-6 bg-gradient-to-r from-purple-600 to-indigo-600"
                onClick={resetGame}
              >
                Play Again
              </Button>
            </div>

            <AnimatePresence>
              {showSharePrompt && (
                <motion.div
                  initial={{ opacity: 0, y: 50 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 50 }}
                  className="fixed bottom-4 left-4 right-4 bg-black p-4 rounded-lg border border-gray-700 shadow-lg"
                >
                  <div className="text-center">
                    <div className="font-bold mb-2">
                      Challenge your friends!
                    </div>
                    <div className="text-sm text-gray-400">
                      Screenshot taken! Share your score of {playerScore * 100}
                      {playerScore > aiScore ? " + 50 bonus" : ""} points and
                      challenge your friends to beat it!
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
