"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ArrowLeft, Trophy, Medal, Award, Crown, Share2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { cn } from "@/lib/utils";

// Mock leaderboard data
const leaderboardData = [
  {
    id: 1,
    name: "Startup Guru",
    score: 1250,
    wins: 42,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 2,
    name: "VentureKing",
    score: 1180,
    wins: 38,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "TechTycoon",
    score: 1050,
    wins: 35,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "You",
    score: 980,
    wins: 31,
    avatar: "/placeholder.svg?height=40&width=40",
    isPlayer: true,
  },
  {
    id: 5,
    name: "UnicornHunter",
    score: 920,
    wins: 29,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "StartupWhiz",
    score: 870,
    wins: 27,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "InvestorPro",
    score: 820,
    wins: 25,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    name: "FundingNinja",
    score: 780,
    wins: 23,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 9,
    name: "PitchMaster",
    score: 730,
    wins: 21,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 10,
    name: "ScaleupSage",
    score: 690,
    wins: 19,
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

const weeklyLeaderboardData = [
  {
    id: 1,
    name: "You",
    score: 450,
    wins: 15,
    avatar: "/placeholder.svg?height=40&width=40",
    isPlayer: true,
  },
  {
    id: 2,
    name: "VentureKing",
    score: 420,
    wins: 14,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 3,
    name: "StartupWhiz",
    score: 380,
    wins: 12,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 4,
    name: "TechTycoon",
    score: 350,
    wins: 11,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 5,
    name: "UnicornHunter",
    score: 320,
    wins: 10,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 6,
    name: "Startup Guru",
    score: 290,
    wins: 9,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 7,
    name: "InvestorPro",
    score: 260,
    wins: 8,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 8,
    name: "FundingNinja",
    score: 230,
    wins: 7,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 9,
    name: "PitchMaster",
    score: 200,
    wins: 6,
    avatar: "/placeholder.svg?height=40&width=40",
  },
  {
    id: 10,
    name: "ScaleupSage",
    score: 170,
    wins: 5,
    avatar: "/placeholder.svg?height=40&width=40",
  },
];

export default function Leaderboard() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all-time");
  const [showSharePrompt, setShowSharePrompt] = useState(false);
  const [highlightedPlayer, setHighlightedPlayer] = useState<number | null>(
    null,
  );

  // Get the correct leaderboard data based on the active tab
  const currentLeaderboard =
    activeTab === "all-time" ? leaderboardData : weeklyLeaderboardData;

  // Find the player's position
  const playerPosition =
    currentLeaderboard.findIndex((player) => player.isPlayer) + 1;

  // Animation for highlighting a player
  useEffect(() => {
    if (highlightedPlayer !== null) {
      const timer = setTimeout(() => {
        setHighlightedPlayer(null);
      }, 2000);

      return () => clearTimeout(timer);
    }
  }, [highlightedPlayer]);

  const shareLeaderboard = () => {
    setShowSharePrompt(true);

    // In a real app, this would generate a shareable image or link
    setTimeout(() => {
      setShowSharePrompt(false);
    }, 3000);
  };

  const getRankIcon = (position: number) => {
    switch (position) {
      case 1:
        return <Trophy className="h-5 w-5 text-yellow-400" />;
      case 2:
        return <Medal className="h-5 w-5 text-gray-300" />;
      case 3:
        return <Award className="h-5 w-5 text-amber-600" />;
      default:
        return (
          <div className="w-5 h-5 flex items-center justify-center text-xs">
            {position}
          </div>
        );
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <h1 className="text-xl font-bold">Leaderboard</h1>

        <Button variant="ghost" size="icon" onClick={shareLeaderboard}>
          <Share2 className="h-5 w-5" />
        </Button>
      </header>

      {/* Player Stats Card */}
      <div className="px-4 py-2">
        <Card className="bg-gradient-to-r from-indigo-900 to-purple-900 border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Your Ranking</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center">
              <div className="relative mr-4">
                <Avatar className="h-14 w-14 border-2 border-yellow-500">
                  <AvatarImage
                    src="/placeholder.svg?height=56&width=56"
                    alt="Your avatar"
                  />
                  <AvatarFallback>YOU</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-1 -right-1 bg-indigo-600 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold border-2 border-indigo-900">
                  {playerPosition}
                </div>
              </div>

              <div className="flex-grow">
                <div className="font-bold">You</div>
                <div className="text-sm text-gray-300">
                  {activeTab === "all-time" ? "All-time rank" : "Weekly rank"}:
                  #{playerPosition}
                </div>
              </div>

              <div className="text-right">
                <div className="font-bold text-yellow-400">
                  {activeTab === "all-time" ? "980" : "450"} pts
                </div>
                <div className="text-sm text-gray-300">
                  {activeTab === "all-time" ? "31" : "15"} wins
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for filtering */}
      <div className="px-4 py-2">
        <Tabs
          defaultValue="all-time"
          value={activeTab}
          onValueChange={setActiveTab}
        >
          <TabsList className="w-full bg-gray-800">
            <TabsTrigger value="all-time" className="flex-1">
              All Time
            </TabsTrigger>
            <TabsTrigger value="weekly" className="flex-1">
              This Week
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Leaderboard List */}
      <div className="flex-grow p-4">
        <div className="bg-gray-800 rounded-lg overflow-hidden">
          <div className="grid grid-cols-12 gap-2 p-3 border-b border-gray-700 text-sm font-semibold text-gray-400">
            <div className="col-span-1">Rank</div>
            <div className="col-span-7">Player</div>
            <div className="col-span-2 text-right">Score</div>
            <div className="col-span-2 text-right">Wins</div>
          </div>

          <div className="divide-y divide-gray-700">
            {currentLeaderboard.map((player, index) => (
              <motion.div
                key={player.id}
                className={cn(
                  "grid grid-cols-12 gap-2 p-3 items-center",
                  player.isPlayer && "bg-indigo-900/30",
                  highlightedPlayer === player.id && "bg-yellow-500/20",
                )}
                whileHover={{ backgroundColor: "rgba(79, 70, 229, 0.1)" }}
                onClick={() => setHighlightedPlayer(player.id)}
              >
                <div className="col-span-1 flex justify-center">
                  {getRankIcon(index + 1)}
                </div>

                <div className="col-span-7 flex items-center">
                  <Avatar className="h-8 w-8 mr-2">
                    <AvatarImage src={player.avatar} alt={player.name} />
                    <AvatarFallback>
                      {player.name.substring(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <div
                    className={cn(
                      player.isPlayer && "font-bold",
                      index < 3 && "font-semibold",
                    )}
                  >
                    {player.name}
                    {index === 0 && (
                      <Crown className="h-4 w-4 text-yellow-400 inline ml-1" />
                    )}
                  </div>
                </div>

                <div className="col-span-2 text-right font-semibold">
                  {player.score}
                </div>

                <div className="col-span-2 text-right text-gray-300">
                  {player.wins}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Challenge Button */}
      <div className="p-4">
        <Button
          className="w-full py-6 bg-gradient-to-r from-green-600 to-emerald-700"
          onClick={() => router.push("/play")}
        >
          Play & Climb the Ranks
        </Button>
      </div>

      {/* Share Prompt */}
      <AnimatePresence>
        {showSharePrompt && (
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 50 }}
            className="fixed bottom-4 left-4 right-4 bg-black p-4 rounded-lg border border-gray-700 shadow-lg"
          >
            <div className="text-center">
              <div className="font-bold mb-2">Challenge your friends!</div>
              <div className="text-sm text-gray-400">
                Screenshot taken! Share your rank #{playerPosition} and
                challenge your friends to beat it!
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
