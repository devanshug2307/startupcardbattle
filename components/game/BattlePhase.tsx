import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { LucideIcon, Zap, TrendingUp, DollarSign, Swords, Calendar } from 'lucide-react';

// Define the StartupCard type directly here or receive via props if preferred
// For now, defining locally to avoid prop drilling it if not needed elsewhere
// Alternatively, define it in a shared types file that *is* accessible
// Let's receive it via props to be safe and avoid redefinition
// -- Reverted: Defining locally for now as it's complex to pass types via props.
// -- If this causes issues, we'll adjust.
// -- Update: Passing type definition *is not possible*. We must assume the type is globally available
//    or redefine it here if necessary. Let's redefine it for isolation.

type StartupCard = {
  name: string;
  category: string;
  founded: number;
  power: number;
  timeToUnicorn: number;
  valuation: number;
  icon?: string | LucideIcon;
  [key: string]: string | number | LucideIcon | undefined;
};

// Define props based on analysis of renderBattlePhase and REFACTOR.MD Step 4b
interface BattlePhaseProps {
  playerCard: StartupCard | undefined;
  aiCard: StartupCard | undefined;
  currentRound: number;
  battleAttribute: string | null;
  battleResult: 'win' | 'lose' | 'draw' | null;
  handleAttributeSelect: (attribute: string) => void;
  handleNextRound: () => void;
  isAttributeSelectionDisabled: boolean;
  isNextRoundDisabled: boolean;
  playerScore: number;
  aiScore: number;
  playerAttackAnimation: boolean;
  aiAttackAnimation: boolean;
  // Pass necessary functions/components from parent
  renderIcon: (card: StartupCard, isPlayer: boolean) => JSX.Element;
  renderAttributeIcon: (attribute: string) => JSX.Element | null;
  BattleResultOverlay: React.ComponentType<{ // Pass BattleResultOverlay Component
    result: 'win' | 'lose' | 'draw' | null;
    playerCard: StartupCard;
    aiCard: StartupCard;
    attribute: string;
    onNext: () => void;
    playerScore: number;
    aiScore: number;
  }>;
  PixelAttackEffect: React.ComponentType<{isPlayer: boolean; isActive: boolean}>;
  formatAttributeValue: (value: number | string | undefined | LucideIcon, attribute: string) => string; // Pass util function
  // getMaxValue: (key: string) => number; // Pass util function - Actually not used in the BattleCard logic extracted
  compareAttribute: (playerCard: StartupCard | undefined, aiCard: StartupCard | undefined, attribute: string) => "win" | "lose" | "draw" | null; // Pass util function
}

// Animation variants (can be moved to constants.ts later)
const battleAnimationVariants = {
  playerCard: { initial: { x: -100, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: -100, opacity: 0 } },
  aiCard: { initial: { x: 100, opacity: 0 }, animate: { x: 0, opacity: 1 }, exit: { x: 100, opacity: 0 } },
  attack: { initial: { scale: 1 }, animate: { scale: [1, 1.2, 0.9, 1], rotate: [0, -5, 5, 0] } },
  statsReveal: { initial: { width: 0 }, animate: { width: '100%' } },
};
const cardAnimationVariants = { // Keeping relevant parts, ideally move to constants
    attack: {
      player: { animate: { x: [0, 50, 0], rotate: [0, 5, 0], transition: { duration: 0.5 } } },
      ai: { animate: { x: [0, -50, 0], rotate: [0, -5, 0], transition: { duration: 0.5 } } },
    },
};

// Define the BattleCard component locally for now as it wasn't extracted yet
// Ideally, this should be extracted as per step 4b's sub-step
const BattleCard = ({
    card,
    isPlayer,
    selectedAttribute,
    revealAttribute,
    onAttributeSelect,
    disabled,
    isWinner,
    isLoser,
    isAttacking,
    renderIcon, // Receive renderIcon
    renderAttributeIcon, // Receive renderAttributeIcon
    formatAttributeValue // Receive formatAttributeValue
  }: {
    card: StartupCard | undefined;
    isPlayer: boolean;
    selectedAttribute: string | null;
    revealAttribute: boolean;
    onAttributeSelect?: (attribute: string) => void; // Make optional for AI card
    disabled: boolean;
    isWinner: boolean;
    isLoser: boolean;
    isAttacking: boolean;
    renderIcon: (card: StartupCard, isPlayer: boolean) => JSX.Element;
    renderAttributeIcon: (attribute: string) => JSX.Element | null;
    formatAttributeValue: (value: number | string | undefined | LucideIcon, attribute: string) => string;
  }) => {
    if (!card) return null;

    const attributes = [
      { key: 'power', name: 'Power', icon: Zap },
      { key: 'founded', name: 'Founded', icon: Calendar },
      { key: 'timeToUnicorn', name: 'Unicorn Speed', icon: TrendingUp },
      { key: 'valuation', name: 'Valuation', icon: DollarSign },
      //{ key: "employees", name: "Team Size", icon: Users }, // Add if needed
    ];

    const getAttributeBorder = (attrKey: string) => {
      if (revealAttribute && selectedAttribute === attrKey) {
        return isWinner
          ? 'border-green-500 border-2 shadow-green-500/50 shadow-lg'
          : isLoser
          ? 'border-red-500 border-2 shadow-red-500/50 shadow-lg'
          : 'border-yellow-500 border-2 shadow-yellow-500/50 shadow-lg';
      }
      if (selectedAttribute === attrKey) {
        return 'border-blue-500 border-2';
      }
      return 'border-transparent border-2';
    };

    return (
      <motion.div
        className={`w-full md:w-5/12 relative ${isPlayer ? 'md:mr-4' : 'md:ml-4'} mb-4 md:mb-0`}
        variants={cardAnimationVariants.attack[isPlayer ? 'player' : 'ai']}
        animate={isAttacking ? 'animate' : ''}
      >
        <Card className={`bg-gray-800/80 backdrop-blur-sm border-gray-700 overflow-hidden shadow-xl transition-all duration-300 ${
          isWinner ? 'shadow-green-500/40 border-green-600' : ''
        } ${isLoser ? 'shadow-red-500/40 border-red-600' : ''}`}>
          <CardHeader className="p-3">
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-2">
                 {renderIcon(card, isPlayer)}
                 <CardTitle className="text-lg font-bold text-gray-100 truncate">
                  {card.name}
                </CardTitle>
              </div>
              <Badge
                variant="secondary"
                className="bg-gray-700 text-gray-300 text-xs"
              >
                {card.category}
              </Badge>
            </div>
          </CardHeader>
          <CardContent className="p-3 space-y-2">
            {attributes.map((attr) => (
              <Button
                key={attr.key}
                variant="ghost"
                className={`w-full justify-start h-auto p-2 text-left relative overflow-hidden transition-all duration-300 ${
                  isPlayer ? 'hover:bg-gray-700/70' : ''
                } ${getAttributeBorder(attr.key)}`}
                onClick={() => isPlayer && onAttributeSelect && onAttributeSelect(attr.key)}
                disabled={disabled || !isPlayer}
              >
                <div className="flex items-center justify-between w-full">
                  <div className="flex items-center space-x-2">
                    <span className="text-blue-400 w-5 h-5">
                       {renderAttributeIcon(attr.key)}
                    </span>
                    <span className="text-sm font-medium text-gray-300">
                      {attr.name}
                    </span>
                  </div>
                  <AnimatePresence>
                    {revealAttribute && selectedAttribute === attr.key && (
                      <motion.span
                        className="text-sm font-semibold text-right text-gray-100"
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 10 }}
                      >
                        {formatAttributeValue(card[attr.key], attr.key)}
                      </motion.span>
                    )}
                  </AnimatePresence>
                  {!revealAttribute && isPlayer && (
                    <span className="text-xs text-gray-500 group-hover:text-blue-400 transition-colors">
                      Select
                    </span>
                   )}
                   {!revealAttribute && !isPlayer && (
                    <span className="text-xs text-gray-600">Hidden</span>
                   )}
                </div>
                {revealAttribute && selectedAttribute === attr.key && (
                  <motion.div
                    className={`absolute bottom-0 left-0 h-1 ${
                      isWinner ? 'bg-green-500' : isLoser ? 'bg-red-500' : 'bg-yellow-500'
                    }`}
                    variants={battleAnimationVariants.statsReveal}
                    initial="initial"
                    animate="animate"
                    transition={{ duration: 0.5, ease: 'easeOut' }}
                  />
                )}
              </Button>
            ))}
          </CardContent>
        </Card>
      </motion.div>
    );
};


export const BattlePhase: React.FC<BattlePhaseProps> = ({
  playerCard,
  aiCard,
  currentRound,
  battleAttribute,
  battleResult,
  handleAttributeSelect,
  handleNextRound,
  isAttributeSelectionDisabled,
  isNextRoundDisabled,
  playerScore,
  aiScore,
  playerAttackAnimation,
  aiAttackAnimation,
  renderIcon, // Destructure passed functions/components
  renderAttributeIcon,
  BattleResultOverlay,
  PixelAttackEffect,
  formatAttributeValue, // Destructure passed function
  compareAttribute // Destructure passed function
}) => {
  if (!playerCard || !aiCard) {
    // Handle case where cards might not be loaded yet, though ideally parent ensures they exist
    return <div>Loading battle...</div>;
  }

  const showResultOverlay = battleResult !== null && !!battleAttribute;

  return (
    <div className="flex flex-col items-center w-full h-full relative">
       {/* Scoreboard */}
       <div className="w-full flex justify-between items-center mb-4 px-2">
        <div className="text-lg font-semibold text-blue-400">You: {playerScore}</div>
        <Badge variant="secondary" className="bg-gray-700 text-gray-300">Round {currentRound}</Badge>
        <div className="text-lg font-semibold text-red-400">AI: {aiScore}</div>
      </div>

      {/* Battle Arena */}
      <div className="flex flex-col md:flex-row justify-center items-start w-full px-2 relative">
        {/* Player Card */}
         <BattleCard
          card={playerCard}
          isPlayer={true}
          selectedAttribute={battleAttribute}
          revealAttribute={battleResult !== null}
          onAttributeSelect={handleAttributeSelect}
          disabled={isAttributeSelectionDisabled}
          isWinner={battleResult === 'win'}
          isLoser={battleResult === 'lose'}
          isAttacking={playerAttackAnimation}
          renderIcon={renderIcon}
          renderAttributeIcon={renderAttributeIcon}
          formatAttributeValue={formatAttributeValue}
        />

        {/* VS Indicator / Action Button */}
        <div className="flex flex-col items-center justify-center w-full md:w-auto px-4 my-4 md:my-0">
           {!battleResult && !battleAttribute && (
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-center"
            >
              <p className="text-xl font-bold text-gray-300 mb-2 animate-pulse">
                 SELECT ATTRIBUTE
              </p>
              <Swords className="w-10 h-10 text-yellow-500 mx-auto" />
             </motion.div>
          )}
          {battleResult && battleAttribute && (
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="text-center">
               <Button
                 onClick={handleNextRound}
                 disabled={isNextRoundDisabled}
                 className="mt-4 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white font-bold shadow-lg"
               >
                 {currentRound < 5 ? "Next Round" : "See Results"}
              </Button>
             </motion.div>
          )}
        </div>

        {/* AI Card */}
         <BattleCard
          card={aiCard}
          isPlayer={false}
          selectedAttribute={battleAttribute}
          revealAttribute={battleResult !== null}
          disabled={true} // AI card attributes are not selectable by player
          isWinner={battleResult === 'lose'} // AI wins if player loses
          isLoser={battleResult === 'win'} // AI loses if player wins
          isAttacking={aiAttackAnimation}
          renderIcon={renderIcon}
          renderAttributeIcon={renderAttributeIcon}
          formatAttributeValue={formatAttributeValue}
        />

         {/* Attack Effects (Positioned absolutely) */}
        <PixelAttackEffect isPlayer={true} isActive={playerAttackAnimation} />
        <PixelAttackEffect isPlayer={false} isActive={aiAttackAnimation} />
      </div>

      {/* Battle Result Overlay */}
      <AnimatePresence>
         {showResultOverlay && battleAttribute && (
          <BattleResultOverlay
            result={battleResult}
            playerCard={playerCard}
            aiCard={aiCard}
            attribute={battleAttribute}
            onNext={handleNextRound}
            playerScore={playerScore}
            aiScore={aiScore}
          />
        )}
      </AnimatePresence>
    </div>
  );
}; 