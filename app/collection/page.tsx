"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  ArrowLeft,
  Star,
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  Lock,
} from "lucide-react";
import { motion } from "framer-motion";
import { startupData } from "@/lib/game-data";
import {
  cn,
  formatPower,
  formatTimeToUnicorn,
  formatValuation,
} from "@/lib/utils";

export default function Collection() {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("all");
  const [selectedCard, setSelectedCard] = useState<any>(null);

  // Filter cards based on active tab
  const filteredCards =
    activeTab === "all"
      ? startupData
      : startupData.filter((card) => card.category.toLowerCase() === activeTab);

  // For demo purposes, some cards are locked
  const unlockedCards = startupData.slice(0, 7);
  const lockedCards = startupData.slice(7);

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-gray-900 to-black text-white">
      {/* Header */}
      <header className="p-4 flex justify-between items-center">
        <Button variant="ghost" size="icon" onClick={() => router.push("/")}>
          <ArrowLeft className="h-6 w-6" />
        </Button>

        <h1 className="text-xl font-bold">My Collection</h1>

        <div className="w-6"></div>
      </header>

      {/* Collection Stats */}
      <div className="px-4 py-2">
        <Card className="bg-gradient-to-r from-indigo-900 to-purple-900 border-0">
          <CardContent className="p-4">
            <div className="flex justify-between items-center">
              <div>
                <h3 className="font-bold">Collection Progress</h3>
                <p className="text-sm text-gray-300">
                  7/{startupData.length} Cards Unlocked
                </p>
              </div>
              <div className="flex">
                {[1, 2, 3].map((i) => (
                  <Star
                    key={i}
                    className="h-5 w-5 text-yellow-400 fill-yellow-400"
                  />
                ))}
                {[4, 5].map((i) => (
                  <Star key={i} className="h-5 w-5 text-gray-600" />
                ))}
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs for filtering */}
      <div className="px-4 py-2">
        <Tabs defaultValue="all" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="w-full bg-gray-800">
            <TabsTrigger value="all" className="flex-1">
              All
            </TabsTrigger>
            <TabsTrigger value="fintech" className="flex-1">
              Fintech
            </TabsTrigger>
            <TabsTrigger value="saas" className="flex-1">
              SaaS
            </TabsTrigger>
            <TabsTrigger value="consumer" className="flex-1">
              Consumer
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>

      {/* Card Grid */}
      <div className="flex-grow p-4">
        <div className="grid grid-cols-2 gap-3">
          {filteredCards.map((card, index) => {
            const isLocked = !unlockedCards.includes(card);

            return (
              <motion.div
                key={index}
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className={cn(
                  "relative rounded-lg overflow-hidden cursor-pointer h-48",
                  selectedCard === card && "ring-2 ring-yellow-500"
                )}
                onClick={() => setSelectedCard(card)}
              >
                {isLocked ? (
                  <div className="h-full bg-gray-800 flex flex-col items-center justify-center p-4">
                    <Lock className="h-10 w-10 text-gray-600 mb-2" />
                    <div className="text-center text-gray-400">
                      <div className="font-bold">{card.name}</div>
                      <div className="text-xs mt-1">
                        Win more battles to unlock
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="h-full bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col">
                    <div className="bg-gradient-to-r from-blue-600 to-purple-600 p-2 text-white font-bold text-center">
                      {card.name}
                    </div>
                    <div className="p-3 flex-grow flex flex-col justify-between">
                      <div className="flex justify-between items-start">
                        <div className="text-xs text-gray-300">
                          {card.category}
                        </div>
                        <Badge
                          variant="outline"
                          className="text-xs bg-indigo-900 border-indigo-700"
                        >
                          Lvl{" "}
                          {card.founded +
                            card.power +
                            card.timeToUnicorn +
                            card.valuation >
                          30
                            ? "Rare"
                            : "Common"}
                        </Badge>
                      </div>

                      <div className="space-y-2 mt-2">
                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Zap className="w-4 h-4 mr-1 text-yellow-400" />
                            <span className="text-xs">Founded</span>
                          </div>
                          <div className="font-bold">{card.founded}</div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <TrendingUp className="w-4 h-4 mr-1 text-green-400" />
                            <span className="text-xs">Power</span>
                          </div>
                          <div className="font-bold">
                            {formatPower(card.power)}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <Users className="w-4 h-4 mr-1 text-blue-400" />
                            <span className="text-xs">Time to Unicorn</span>
                          </div>
                          <div className="font-bold">
                            {formatTimeToUnicorn(card.timeToUnicorn)}
                          </div>
                        </div>

                        <div className="flex justify-between items-center">
                          <div className="flex items-center">
                            <DollarSign className="w-4 h-4 mr-1 text-purple-400" />
                            <span className="text-xs">Valuation</span>
                          </div>
                          <div className="font-bold">
                            {formatValuation(card.valuation)}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Card Details */}
      {selectedCard && (
        <motion.div
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 100 }}
          className="fixed bottom-0 left-0 right-0 bg-gray-900 border-t border-gray-800 rounded-t-xl p-4 shadow-lg"
        >
          <div className="flex justify-between items-start mb-4">
            <div>
              <h3 className="text-xl font-bold">{selectedCard.name}</h3>
              <p className="text-sm text-gray-400">{selectedCard.category}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSelectedCard(null)}
            >
              Close
            </Button>
          </div>

          <div className="mb-4">
            <h4 className="font-semibold mb-2">Card Description</h4>
            <p className="text-sm text-gray-300">
              {selectedCard.name} is a leading{" "}
              {selectedCard.category.toLowerCase()} startup known for its
              {selectedCard.founded > 7
                ? " early establishment"
                : " recent founding"}{" "}
              and
              {selectedCard.power > 7
                ? " high power level"
                : " moderate power"}{" "}
              in the market.
            </p>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-sm font-semibold mb-1">Battle Stats</div>
              <div className="text-xs text-gray-400">
                Win Rate: 67%
                <br />
                Battles: 12
                <br />
                Best Attribute:{" "}
                {Math.max(
                  selectedCard.founded,
                  selectedCard.power,
                  selectedCard.timeToUnicorn,
                  selectedCard.valuation
                ) === selectedCard.founded
                  ? "Founded"
                  : Math.max(
                      selectedCard.founded,
                      selectedCard.power,
                      selectedCard.timeToUnicorn,
                      selectedCard.valuation
                    ) === selectedCard.power
                  ? "Power"
                  : Math.max(
                      selectedCard.founded,
                      selectedCard.power,
                      selectedCard.timeToUnicorn,
                      selectedCard.valuation
                    ) === selectedCard.timeToUnicorn
                  ? "Time to Unicorn"
                  : "Valuation"}
              </div>
            </div>

            <div className="bg-gray-800 p-3 rounded-lg">
              <div className="text-sm font-semibold mb-1">Card Rarity</div>
              <div className="text-xs text-gray-400">
                Collection: 1 of 3<br />
                Acquired: 3 days ago
                <br />
                Power Level:{" "}
                {selectedCard.founded +
                  selectedCard.power +
                  selectedCard.timeToUnicorn +
                  selectedCard.valuation}
              </div>
            </div>
          </div>

          <Button
            className="w-full bg-gradient-to-r from-indigo-600 to-purple-600"
            onClick={() => {
              setSelectedCard(null);
              router.push("/play");
            }}
          >
            Battle with this Card
          </Button>
        </motion.div>
      )}
    </div>
  );
}
