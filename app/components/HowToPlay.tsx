import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";

interface HowToPlayProps {
  isOpen: boolean;
  onClose: () => void;
}

export function HowToPlay({ isOpen, onClose }: HowToPlayProps) {
  // Close when clicking outside the modal content
  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={handleBackdropClick}
        >
          <motion.div
            className="w-11/12 max-w-3xl bg-[#0A0118] text-white border-4 border-[#6A2FEB] rounded-lg overflow-hidden shadow-[0_0_15px_rgba(106,47,235,0.6)] relative"
            initial={{ scale: 0.9, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.9, y: 20 }}
          >
            {/* Title bar with close button */}
            <div className="bg-[#6A2FEB] text-white p-2 flex items-center justify-between">
              <h2 className="text-2xl font-bold tracking-wide font-mono">
                HOW TO PLAY
              </h2>
              <button
                onClick={onClose}
                className="w-8 h-8 flex items-center justify-center rounded hover:bg-purple-800 transition"
                aria-label="Close"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div
              className="p-6 max-h-[80vh] overflow-y-auto space-y-6 font-['VT323',monospace]"
              style={{ backgroundColor: "#0A0118" }}
            >
              {/* Game Overview Section */}
              <div>
                <h3 className="text-2xl text-[#6A2FEB] mb-3 font-mono border-b border-[#6A2FEB]/50 pb-1">
                  Game Overview
                </h3>
                <p className="text-lg">
                  Startup Battle is a strategic card game where you compete
                  against AI using startup company cards.
                </p>
              </div>

              {/* Game Flow Section */}
              <div>
                <h3 className="text-2xl text-[#6A2FEB] mb-3 font-mono border-b border-[#6A2FEB]/50 pb-1">
                  Game Flow
                </h3>
                <ol className="list-decimal pl-6 space-y-2 text-lg">
                  <li className="text-amber-300">
                    Select 4 startup cards for your battle deck
                  </li>
                  <li className="text-amber-300">
                    Each round, one card from your deck battles against an AI
                    card
                  </li>
                  <li className="text-amber-300">
                    Choose a stat to compare (Valuation, Revenue, etc.)
                  </li>
                  <li className="text-amber-300">
                    The card with the better stat wins the round
                  </li>
                  <li className="text-amber-300">
                    Win more rounds than the AI to win the battle
                  </li>
                </ol>
              </div>

              {/* Comparison Rules Section */}
              <div>
                <h3 className="text-2xl text-[#6A2FEB] mb-3 font-mono border-b border-[#6A2FEB]/50 pb-1">
                  Comparison Rules
                </h3>
                <div className="bg-black/30 p-4 rounded-md border border-[#6A2FEB]/30">
                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-green-500 mr-2 flex items-center justify-center text-black font-bold">
                      ↑
                    </div>
                    <p className="text-lg">
                      <span className="text-green-400 font-bold">
                        Higher is Better:
                      </span>
                    </p>
                  </div>
                  <p className="ml-8 text-amber-300 mb-4">
                    Valuation, Revenue, Power
                  </p>

                  <div className="flex items-center mb-2">
                    <div className="w-6 h-6 rounded-full bg-blue-500 mr-2 flex items-center justify-center text-black font-bold">
                      ↓
                    </div>
                    <p className="text-lg">
                      <span className="text-blue-400 font-bold">
                        Lower is Better:
                      </span>
                    </p>
                  </div>
                  <p className="ml-8 text-amber-300">
                    Founded Year, Time to Unicorn
                  </p>
                </div>
              </div>

              {/* Tips Section */}
              <div>
                <h3 className="text-2xl text-[#6A2FEB] mb-3 font-mono border-b border-[#6A2FEB]/50 pb-1">
                  Tips
                </h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li className="text-amber-300 text-lg">
                    Choose cards with strong stats across multiple categories
                  </li>
                  <li className="text-amber-300 text-lg">
                    Pay attention to your opponent's previous choices
                  </li>
                  <li className="text-amber-300 text-lg">
                    Save your strongest cards for critical rounds
                  </li>
                </ul>
              </div>

              {/* DOS-style footer */}
              <div className="mt-8 border-t border-[#6A2FEB]/30 pt-4 text-center font-mono text-sm text-[#6A2FEB]">
                <pre className="text-xs">
                  C:\STARTUP\BATTLE&gt; LAUNCH.EXE /PLAYNOW
                </pre>
                <p className="mt-2">
                  PRESS ESC OR CLICK X TO CLOSE THIS WINDOW
                </p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
