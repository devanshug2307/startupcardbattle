import { motion, useAnimation, AnimatePresence } from "framer-motion";
import { Trophy, Gamepad2, Star, Rocket, HelpCircle, Clock } from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";

interface StartupData {
  icon: string;
  name: string;
  color: string;
  stats: {
    valuation: string;
    founded: number;
    category: string;
    power: number;
    speed: number;
    innovation: number;
  };
  borderColor: string;
}

export function OrbitingCirclesDemo() {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Startup data with retro gaming stats
  const startupData: StartupData[] = [
    {
      icon: "/icons/phonepe.png",
      name: "PhonePe",
      color: "from-indigo-600 to-indigo-900",
      stats: {
        valuation: "12B",
        founded: 2015,
        category: "Fintech",
        power: 90,
        speed: 85,
        innovation: 82,
      },
      borderColor: "indigo-500",
    },
    {
      icon: "/icons/cred.png",
      name: "CRED",
      color: "from-purple-600 to-purple-900",
      stats: {
        valuation: "6.4B",
        founded: 2018,
        category: "Fintech",
        power: 85,
        speed: 92,
        innovation: 88,
      },
      borderColor: "purple-500",
    },
    {
      icon: "/icons/meesho.png",
      name: "Meesho",
      color: "from-pink-600 to-pink-900",
      stats: {
        valuation: "4.9B",
        founded: 2015,
        category: "Consumer",
        power: 82,
        speed: 88,
        innovation: 85,
      },
      borderColor: "pink-500",
    },
  ];

  const helpSteps = [
    {
      title: "Build Your Deck",
      description: "Select 4 startup cards to form your battle deck. Each card has unique stats and abilities.",
      icon: Star,
      color: "from-indigo-600 to-indigo-900",
      demo: (
        <motion.div className="flex -space-x-2">
          {[...Array(4)].map((_, i) => (
            <motion.div
              key={i}
              initial={{ scale: 0, x: -20 }}
              animate={{ scale: 1, x: 0 }}
              transition={{ delay: i * 0.2 }}
              className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 
                       flex items-center justify-center text-white font-bold ring-2 ring-black"
            >
              {i + 1}
            </motion.div>
          ))}
        </motion.div>
      )
    },
    {
      title: "Battle Mechanics",
      description: "Each round, compare card stats to win. Higher isn't always better!",
      icon: Gamepad2,
      color: "from-purple-600 to-purple-900",
      demo: (
        <div className="space-y-2 text-xs">
          <div className="flex items-center justify-between text-green-400">
            <span>Valuation & Revenue:</span>
            <span>Higher Wins! ↑</span>
          </div>
          <div className="flex items-center justify-between text-blue-400">
            <span>Founded Year & Time to Unicorn:</span>
            <span>Lower Wins! ↓</span>
          </div>
        </div>
      )
    },
    {
      title: "Round System",
      description: "Play through 4 rounds, each focusing on a different stat. Score points for each win!",
      icon: Clock,
      color: "from-blue-600 to-blue-900",
      demo: (
        <motion.div className="w-full bg-gray-800/50 h-2 rounded-full overflow-hidden">
          <motion.div
            className="h-full bg-gradient-to-r from-purple-500 to-blue-500"
            initial={{ width: "0%" }}
            animate={{ width: "100%" }}
            transition={{ duration: 2, repeat: Infinity }}
          />
        </motion.div>
      )
    },
    {
      title: "Victory Conditions",
      description: "Win more rounds than your opponent to claim victory and earn rewards!",
      icon: Trophy,
      color: "from-yellow-600 to-orange-600",
      demo: (
        <motion.div 
          className="flex justify-center"
          animate={{ scale: [1, 1.1, 1], rotate: [-5, 5, -5, 5, 0] }}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Trophy className="w-8 h-8 text-yellow-400" />
        </motion.div>
      )
    }
  ];

  // Card flip animation variants
  const cardVariants = {
    initial: {
      scale: 0.8,
      opacity: 0,
      y: 50,
    },
    animate: (i: number) => ({
      scale: 1,
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.15,
        duration: 0.5,
        ease: "easeOut",
      },
    }),
    hover: {
      scale: 1.05,
      y: -10,
      transition: {
        duration: 0.3,
        ease: "easeInOut",
      },
    },
    tap: {
      scale: 0.95,
      transition: {
        duration: 0.1,
      },
    },
  };

  return (
    <div className="relative min-h-[600px] w-full overflow-hidden px-4 sm:px-6">
      {/* Enhanced Retro Grid Background */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#2a0066_1px,transparent_1px),linear-gradient(to_bottom,#2a0066_1px,transparent_1px)] bg-[size:24px_24px] sm:bg-[size:32px_32px] opacity-20">
          <motion.div
            className="absolute inset-0 bg-gradient-to-b from-transparent via-purple-900/20 to-transparent"
            animate={{
              opacity: [0.2, 0.3, 0.2],
            }}
            transition={{
              duration: 3,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>
      </div>

      {/* Cards Display */}
      <div className="relative max-w-4xl mx-auto py-8 sm:py-12">
        {/* Help Button */}
        <motion.button
          className="absolute top-0 right-0 p-2 text-purple-300 hover:text-purple-100 transition-colors"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.9 }}
          onClick={() => setShowHelp(!showHelp)}
        >
          <HelpCircle className="w-6 h-6" />
        </motion.button>

        {/* How to Play Modal */}
        <AnimatePresence>
          {showHelp && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="fixed inset-0 z-50 flex items-center justify-center px-4"
            >
              <motion.div
                className="absolute inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowHelp(false)}
              />
              <motion.div
                className="relative bg-gradient-to-b from-purple-900/90 to-indigo-900/90 p-6 rounded-lg max-w-lg w-full pixel-corners"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                <h3 className="text-xl font-bold text-white mb-6 pixel-text text-center">
                  How to Play
                </h3>
                <div className="space-y-8">
                  {helpSteps.map((step, index) => (
                    <motion.div
                      key={step.title}
                      className="relative"
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.15 }}
                    >
                      <div className="flex items-start gap-4">
                        <motion.div 
                          className={`p-3 rounded-lg bg-gradient-to-br ${step.color}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <step.icon className="w-6 h-6 text-white" />
                        </motion.div>
                        <div className="flex-1">
                          <h4 className="text-white font-semibold mb-1">
                            {step.title}
                          </h4>
                          <p className="text-purple-200 text-sm mb-3">
                            {step.description}
                          </p>
                          <motion.div
                            className="bg-black/20 rounded-lg p-3"
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: "auto", opacity: 1 }}
                            transition={{ delay: index * 0.15 + 0.3 }}
                          >
                            {step.demo}
                          </motion.div>
                        </div>
                      </div>
                      
                      {index < helpSteps.length - 1 && (
                        <motion.div
                          className="absolute left-6 top-full h-8 w-px bg-gradient-to-b from-purple-500/50 to-transparent"
                          initial={{ scaleY: 0 }}
                          animate={{ scaleY: 1 }}
                          transition={{ delay: index * 0.15 + 0.5 }}
                        />
                      )}
                    </motion.div>
                  ))}
                </div>

                <div className="mt-8 space-y-4">
                  <div className="text-sm text-purple-200/70 bg-purple-950/30 p-3 rounded-lg">
                    <span className="text-purple-400 font-medium">Pro Tip: </span>
                    Study your opponent's cards and predict their strategy to gain the upper hand!
                  </div>
                  
                  <motion.button
                    className="w-full pixel-btn bg-gradient-to-r from-purple-600 to-indigo-600 text-white py-3 text-sm font-bold uppercase"
                    onClick={() => setShowHelp(false)}
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    Ready to Battle!
                  </motion.button>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 md:gap-8">
          <AnimatePresence>
            {startupData.map((card, index) => (
              <motion.div
                key={index}
                className="relative group"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                custom={index}
                layout
              >
                {/* Card Design */}
                <div className="relative rounded-lg overflow-hidden card-retro">
                  {/* Enhanced Card Background */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${card.color} opacity-90`}
                    animate={{
                      background: [
                        `linear-gradient(45deg, ${card.color.split(" ")[1]}, ${
                          card.color.split(" ")[3]
                        })`,
                        `linear-gradient(225deg, ${card.color.split(" ")[1]}, ${
                          card.color.split(" ")[3]
                        })`,
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      repeatType: "reverse",
                    }}
                  >
                    <div className="absolute inset-0 bg-scanlines opacity-10" />
                  </motion.div>

                  {/* Card Content */}
                  <div className="relative p-3 sm:p-4">
                    {/* Enhanced Header */}
                    <motion.div
                      className="flex justify-between items-start mb-3 sm:mb-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                    >
                      <div className="pixel-corners bg-black/30 px-2 py-1">
                        <span className="text-[10px] sm:text-xs font-bold text-white">
                          {card.stats.category}
                        </span>
                      </div>
                      <div className="flex items-center">
                        {[...Array(3)].map((_, i) => (
                          <motion.div
                            key={i}
                            initial={{ opacity: 0, scale: 0 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ delay: index * 0.1 + i * 0.1 }}
                          >
                            <Star className="w-3 h-3 text-yellow-300 fill-yellow-300" />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Enhanced Image Container */}
                    <motion.div
                      className="relative h-24 sm:h-32 mb-3 sm:mb-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="relative w-20 h-20 sm:w-24 sm:h-24"
                          animate={{
                            y: [0, -5, 0],
                          }}
                          transition={{
                            duration: 2,
                            repeat: Infinity,
                            ease: "easeInOut",
                          }}
                        >
                          <Image
                            src={card.icon}
                            alt={card.name}
                            fill
                            className="object-contain pixel-image"
                            sizes="(max-width: 768px) 80px, 96px"
                          />
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Enhanced Name */}
                    <motion.div
                      className="text-center mb-3 sm:mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.2 + 0.5 }}
                    >
                      <h3 className="text-lg sm:text-xl font-bold text-white pixel-text">
                        {card.name}
                      </h3>
                    </motion.div>

                    {/* Enhanced Stats */}
                    <div className="space-y-1.5 sm:space-y-2">
                      {Object.entries(card.stats)
                        .filter(
                          ([key]) =>
                            key !== "category" &&
                            key !== "founded" &&
                            key !== "valuation"
                        )
                        .map(([stat, value], statIndex) => (
                          <motion.div
                            key={stat}
                            className="flex items-center justify-between"
                            initial={{ opacity: 0, x: -20 }}
                            animate={{ opacity: 1, x: 0 }}
                            transition={{
                              delay: index * 0.1 + statIndex * 0.1,
                            }}
                          >
                            <span className="text-[10px] sm:text-xs text-white/80 uppercase">
                              {stat}
                            </span>
                            <div className="flex-1 mx-2">
                              <div className="h-1.5 sm:h-2 bg-black/30 rounded-full overflow-hidden">
                                <motion.div
                                  className="h-full bg-white"
                                  initial={{ width: 0 }}
                                  animate={{
                                    width: `${
                                      typeof value === "number" ? value : 0
                                    }%`,
                                  }}
                                  transition={{
                                    duration: 1,
                                    delay: index * 0.2 + statIndex * 0.1,
                                    ease: "easeOut",
                                  }}
                                />
                              </div>
                            </div>
                            <span className="text-[10px] sm:text-xs font-bold text-white">
                              {value}
                            </span>
                          </motion.div>
                        ))}
                    </div>
                  </div>

                  {/* Enhanced Border Effect */}
                  <motion.div
                    className={`absolute inset-0 border-2 border-${card.borderColor} pixel-corners pointer-events-none`}
                    animate={{
                      opacity: [0.5, 1, 0.5],
                    }}
                    transition={{
                      duration: 2,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  />
                </div>

                {/* Enhanced Hover Glow Effect */}
                <motion.div
                  className="absolute -inset-1 bg-gradient-to-r from-purple-500 to-indigo-500 rounded-lg opacity-0 group-hover:opacity-30 blur transition-opacity duration-300 -z-10"
                  animate={{
                    scale: [1, 1.05, 1],
                    opacity: [0.2, 0.3, 0.2],
                  }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {/* Enhanced CTA Button */}
        <motion.div
          className="mt-8 sm:mt-12 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8 }}
        >
          <motion.button
            className="pixel-btn bg-gradient-to-r from-purple-600 to-indigo-600 text-white px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg font-bold uppercase tracking-wide"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.span
              className="flex items-center gap-2"
              animate={{
                textShadow: [
                  "0 0 8px rgba(168, 85, 247, 0.4)",
                  "0 0 16px rgba(168, 85, 247, 0.6)",
                  "0 0 8px rgba(168, 85, 247, 0.4)",
                ],
              }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              <Gamepad2 className="w-4 h-4 sm:w-5 sm:h-5" />
              Start Battle
            </motion.span>
          </motion.button>
        </motion.div>
      </div>

      {/* Enhanced Particles */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(isMobile ? 10 : 20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1 h-1 bg-purple-400 rounded-full"
            initial={{
              x: Math.random() * (isMobile ? 300 : 800),
              y: Math.random() * (isMobile ? 500 : 600),
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 10 - 5, 0],
              opacity: [0, 1, 0],
              scale: [1, 1.5, 1],
            }}
            transition={{
              duration: Math.random() * 2 + 1,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
          />
        ))}
      </div>
    </div>
  );
}
