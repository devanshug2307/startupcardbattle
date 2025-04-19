import { motion } from "framer-motion";
import {
  Zap,
  TrendingUp,
  Users,
  DollarSign,
  LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  StartupCard,
  compareAttribute,
  formatAttributeValue,
} from "@/lib/game-utils";
import React from "react";

// Assuming pixelBorderStyles is defined here or imported from a shared location
// For now, defining it locally based on the original file content.
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

interface BattleRoundsSummaryProps {
  selectedCards: StartupCard[];
  aiDeck: StartupCard[];
  roundAttributes: string[];
}

// Helper function to render attribute icons (moved from page.tsx)
const renderAttributeIcon = (attribute: string): React.ReactNode => {
  switch (attribute) {
    case "founded":
      return <Zap className="w-4 h-4" />; // Adjusted size slightly if needed
    case "power":
      return <TrendingUp className="w-4 h-4" />;
    case "timeToUnicorn":
      return <Users className="w-4 h-4" />;
    case "valuation":
      return <DollarSign className="w-4 h-4" />;
    default:
      return null;
  }
};

export const BattleRoundsSummary: React.FC<BattleRoundsSummaryProps> = ({
  selectedCards,
  aiDeck,
  roundAttributes,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: 0.4 }}
      id="battle-summary"
      className="bg-black/60 backdrop-blur-sm border border-purple-500/40 w-full p-4 mb-4"
      // Using React.CSSProperties for style prop
      style={pixelBorderStyles as React.CSSProperties}
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
              style={pixelBorderStyles as React.CSSProperties}
            >
              <div className="font-mono text-sm text-purple-400">YOUR CARD</div>
              <div className="font-mono font-bold text-white truncate">
                {selectedCards[i]?.name || "---"}
              </div>
              <div className="flex gap-2 items-center mt-1">
                <div className="w-2 h-2 bg-purple-500" />
                <div className="text-xs text-gray-400">
                  {selectedCards[i]?.category || "---"}
                </div>
              </div>

              {roundAttributes[i] && selectedCards[i] && aiDeck[i] && (
                <div className="mt-1 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    {renderAttributeIcon(roundAttributes[i])}
                    <span className="text-xs text-gray-300 capitalize">
                      {roundAttributes[i].replace("timeTo", "Time To ")}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-bold",
                      compareAttribute(
                        selectedCards[i],
                        aiDeck[i],
                        roundAttributes[i],
                      ) === "win"
                        ? "text-green-400"
                        : compareAttribute(
                              selectedCards[i],
                              aiDeck[i],
                              roundAttributes[i],
                            ) === "lose"
                          ? "text-red-400"
                          : "text-yellow-400",
                    )}
                  >
                    {formatAttributeValue(
                      selectedCards[i]?.[roundAttributes[i]],
                      roundAttributes[i],
                    )}
                  </span>
                </div>
              )}
            </div>

            {/* Middle Result Indicator */}
            <div className="flex flex-col items-center gap-1">
              <div className="text-white font-mono">R{i + 1}</div>
              {roundAttributes[i] && selectedCards[i] && aiDeck[i] && (
                <div
                  className={cn(
                    "w-6 h-6 flex items-center justify-center font-bold",
                    compareAttribute(
                      selectedCards[i],
                      aiDeck[i],
                      roundAttributes[i],
                    ) === "win"
                      ? "bg-green-500 text-white"
                      : compareAttribute(
                            selectedCards[i],
                            aiDeck[i],
                            roundAttributes[i],
                          ) === "lose"
                        ? "bg-red-500 text-white"
                        : "bg-yellow-500 text-black", // Adjusted draw color for contrast
                  )}
                  style={pixelBorderStyles as React.CSSProperties}
                >
                  {compareAttribute(
                    selectedCards[i],
                    aiDeck[i],
                    roundAttributes[i],
                  ) === "win"
                    ? "W"
                    : compareAttribute(
                          selectedCards[i],
                          aiDeck[i],
                          roundAttributes[i],
                        ) === "lose"
                      ? "L"
                      : "D"}
                </div>
              )}
            </div>

            {/* Right Card - AI */}
            <div
              className="relative overflow-hidden p-2 bg-gray-900/80"
              style={pixelBorderStyles as React.CSSProperties}
            >
              <div className="font-mono text-sm text-red-400">AI CARD</div>
              <div className="font-mono font-bold text-white truncate">
                {aiDeck[i]?.name || "---"}
              </div>
              <div className="flex gap-2 items-center mt-1">
                <div className="w-2 h-2 bg-red-500" />
                <div className="text-xs text-gray-400">
                  {aiDeck[i]?.category || "---"}
                </div>
              </div>

              {roundAttributes[i] && selectedCards[i] && aiDeck[i] && (
                <div className="mt-1 flex justify-between items-center">
                  <div className="flex items-center gap-1">
                    {renderAttributeIcon(roundAttributes[i])}
                    <span className="text-xs text-gray-300 capitalize">
                       {roundAttributes[i].replace("timeTo", "Time To ")}
                    </span>
                  </div>
                  <span
                    className={cn(
                      "text-xs font-bold",
                      compareAttribute(
                        selectedCards[i],
                        aiDeck[i],
                        roundAttributes[i],
                      ) === "lose" // AI wins if player loses
                        ? "text-green-400"
                        : compareAttribute(
                              selectedCards[i],
                              aiDeck[i],
                              roundAttributes[i],
                            ) === "win" // AI loses if player wins
                          ? "text-red-400"
                          : "text-yellow-400",
                    )}
                  >
                    {formatAttributeValue(
                      aiDeck[i]?.[roundAttributes[i]],
                      roundAttributes[i],
                    )}
                  </span>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </motion.div>
  );
}; 