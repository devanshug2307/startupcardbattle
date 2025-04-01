import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Gamepad2,
  Star,
  Rocket,
  HelpCircle,
  Clock,
  X,
} from "lucide-react";
import { useState, useEffect } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";

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
  const [hasShownInitialHelp, setHasShownInitialHelp] = useState(false);
  const router = useRouter();

  // Check if mobile on mount and window resize
  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // Add this effect to show help automatically
  useEffect(() => {
    if (!hasShownInitialHelp) {
      const timer = setTimeout(() => {
        setShowHelp(true);
        setHasShownInitialHelp(true);
      }, 3000); // Changed from 2000 to 3000 to show after 3 seconds

      return () => clearTimeout(timer);
    }
  }, [hasShownInitialHelp]);

  // Startup data with retro gaming stats
  const startupData: StartupData[] = [
    {
      icon: "/icons/cloudflare.png",
      name: "Cloudflare",
      color: "from-indigo-600 to-indigo-900",
      stats: {
        valuation: "12B",
        founded: 2015,
        category: "Fintech",
        power: 90,
        speed: 85,
        innovation: 82,
      },
      borderColor: "purple-500",
    },
    {
      icon: "/icons/vercel-icon-dark.png",
      name: "VERCEL",
      color: "from-black-900 to-black-900",
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
      icon: "/icons/replit_logo_symbol.png",
      name: "Replit",
      color: "from-blue-600 to-blue-900",
      stats: {
        valuation: "4.9B",
        founded: 2015,
        category: "Consumer",
        power: 82,
        speed: 88,
        innovation: 85,
      },
      borderColor: "blue-500",
    },
  ];

  const helpSteps = [
    {
      title: "Build Your Deck",
      description:
        "Select 4 startup cards to form your battle deck. Each card has unique stats and abilities.",
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
      ),
    },
    {
      title: "Battle Mechanics",
      description:
        "Each round, compare card stats to win. Higher isn't always better!",
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
      ),
    },
    {
      title: "Round System",
      description:
        "Play through 4 rounds, each focusing on a different stat. Score points for each win!",
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
      ),
    },
    {
      title: "Victory Conditions",
      description:
        "Win more rounds than your opponent to claim victory and earn rewards!",
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
      ),
    },
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
    <div
      id="orbiting-circles-demo"
      className="relative min-h-[600px] w-full overflow-hidden px-4 sm:px-6"
    >
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

      {/* Add Rocket Section before Cards Display */}
      <div className="relative max-w-4xl mx-auto pt-8">
        <motion.div
          className="flex flex-col items-center justify-center mb-8 relative"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {/* Animated Rocket */}
          <motion.div
            className="relative"
            animate={{
              y: [-10, 10, -10],
              rotate: [-2, 2, -2],
            }}
            transition={{
              duration: 4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            <motion.div
              className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-8 h-12 opacity-20"
              animate={{
                height: [48, 64, 48],
                opacity: [0.1, 0.3, 0.1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <div className="w-full h-full bg-gradient-to-b from-purple-500 to-transparent rounded-full blur-lg" />
            </motion.div>

            <Rocket
              className="w-12 h-12 text-purple-400 transform rotate-45"
              strokeWidth={1.5}
            />

            {/* Particle Effects */}
            {[...Array(6)].map((_, i) => (
              <motion.div
                key={i}
                className="absolute bottom-0 left-1/2 w-1 h-1 rounded-full bg-purple-400"
                initial={{
                  x: 0,
                  y: 0,
                  opacity: 0,
                }}
                animate={{
                  x: Math.random() * 40 - 20,
                  y: Math.random() * 40 + 20,
                  opacity: [0, 1, 0],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                  ease: "easeOut",
                }}
              />
            ))}
          </motion.div>

          {/* Title */}
          <motion.h1
            className="text-2xl sm:text-3xl md:text-4xl font-bold text-white mt-6 pixel-text text-center"
            animate={{
              scale: [1, 1.02, 1],
              textShadow: [
                "0 0 8px rgba(168, 85, 247, 0.4)",
                "0 0 16px rgba(168, 85, 247, 0.6)",
                "0 0 8px rgba(168, 85, 247, 0.4)",
              ],
            }}
            transition={{
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          >
            Startup Battle
          </motion.h1>

          <motion.p
            className="text-purple-300 mt-2 text-sm sm:text-base text-center max-w-md"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2 }}
          >
            Collect cards, build your deck, and battle with the most innovative
            startups
          </motion.p>
        </motion.div>
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
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              {/* Backdrop */}
              <motion.div
                className="fixed inset-0 bg-black/60 backdrop-blur-sm"
                onClick={() => setShowHelp(false)}
              />

              {/* Modal Content */}
              <motion.div
                className="relative bg-gradient-to-b from-purple-900/90 to-indigo-900/90 p-4 sm:p-6 rounded-lg w-full max-w-lg max-h-[90vh] overflow-y-auto"
                initial={{ y: 20 }}
                animate={{ y: 0 }}
              >
                {/* Close button */}
                <button
                  onClick={() => setShowHelp(false)}
                  className="absolute top-2 right-2 p-2 text-purple-300 hover:text-purple-100 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>

                <h3 className="text-xl font-bold text-white mb-6 pixel-text text-center">
                  How to Play
                </h3>

                <div className="space-y-6">
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
                          className={`flex-shrink-0 p-3 rounded-lg bg-gradient-to-br ${step.color}`}
                          whileHover={{ scale: 1.05 }}
                        >
                          <step.icon className="w-5 h-5 text-white" />
                        </motion.div>
                        <div className="flex-1 min-w-0">
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
                    </motion.div>
                  ))}
                </div>

                {/* Add this before the bottom padding div */}
                <motion.button
                  className="w-full mt-6 bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 text-white py-3 rounded-lg font-semibold"
                  onClick={() => setShowHelp(false)}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  Got it!
                </motion.button>

                {/* Bottom padding */}
                <div className="h-4" />
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="grid grid-cols-3 gap-2 sm:gap-4 md:gap-8">
          <AnimatePresence>
            {startupData.map((card, index) => (
              <motion.div
                key={index}
                className="relative group w-full"
                variants={cardVariants}
                initial="initial"
                animate="animate"
                whileHover="hover"
                whileTap="tap"
                custom={index}
                layout
              >
                {/* Card Container */}
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
                  <div className="relative p-2 sm:p-3 md:p-4">
                    {/* Enhanced Header - Reduce padding and font sizes */}
                    <motion.div
                      className="flex justify-between items-start mb-2 sm:mb-3 md:mb-4"
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.2 + 0.3 }}
                    >
                      <div className="pixel-corners bg-black/30 px-1 py-0.5 sm:px-2 sm:py-1">
                        <span className="text-[8px] sm:text-[10px] md:text-xs font-bold text-white">
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
                            <Star className="w-2 h-2 sm:w-3 sm:h-3 text-yellow-300 fill-yellow-300" />
                          </motion.div>
                        ))}
                      </div>
                    </motion.div>

                    {/* Enhanced Image Container - Reduce size on mobile */}
                    <motion.div
                      className="relative h-16 sm:h-24 md:h-32 mb-2 sm:mb-3 md:mb-4"
                      whileHover={{ scale: 1.05 }}
                    >
                      <div className="absolute inset-0 flex items-center justify-center">
                        <motion.div
                          className="relative w-12 h-12 sm:w-20 sm:h-20 md:w-24 md:h-24"
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
                            sizes="(max-width: 768px) 48px, (max-width: 1024px) 80px, 96px"
                          />
                        </motion.div>
                      </div>
                    </motion.div>

                    {/* Enhanced Name - Reduce font size on mobile */}
                    <motion.div
                      className="text-center mb-2 sm:mb-3 md:mb-4"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: index * 0.2 + 0.5 }}
                    >
                      <h3 className="text-sm sm:text-lg md:text-xl font-bold text-white pixel-text">
                        {card.name}
                      </h3>
                    </motion.div>

                    {/* Enhanced Stats - Reduce spacing and font sizes */}
                    <div className="space-y-1 sm:space-y-1.5 md:space-y-2">
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
                            <span className="text-[8px] sm:text-[10px] md:text-xs text-white/80 uppercase">
                              {stat}
                            </span>
                            <div className="flex-1 mx-1 sm:mx-2">
                              <div className="h-1 sm:h-1.5 md:h-2 bg-black/30 rounded-full overflow-hidden">
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
                            <span className="text-[8px] sm:text-[10px] md:text-xs font-bold text-white">
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

        {/* Battle Section */}
        <div className="mt-8 space-y-6">
          {/* Start Battle Button */}
          <div className="relative max-w-md mx-auto">
            <motion.button
              className="relative w-full bg-gradient-to-r from-purple-700 to-indigo-700 text-white py-4 px-6 rounded-lg flex items-center justify-center gap-3 overflow-hidden pixel-corners"
              whileHover={{
                scale: 1.02,
                transition: { duration: 0.2 },
              }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/play")}
            >
              {/* Button Content */}
              <motion.div
                className="relative flex items-center gap-3"
                animate={{
                  y: [-1, 1, -1],
                }}
                transition={{
                  duration: 1.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                }}
              >
                <Gamepad2 className="w-6 h-6" />
                <span className="text-xl font-bold pixel-text tracking-wide">
                  START BATTLE
                </span>
                <motion.div
                  animate={{
                    x: [0, 5, 0],
                  }}
                  transition={{
                    duration: 1.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                  }}
                >
                  <Rocket className="w-6 h-6" />
                </motion.div>
              </motion.div>
            </motion.button>
          </div>

          {/* Stats Grid */}
          <div className="grid grid-cols-3 gap-4 max-w-md mx-auto">
            {[
              { value: "5+", label: "Category" },
              { value: "$100B+", label: "Total Valuation" },
              { value: "20+", label: "Unicorns" },
            ].map((stat, i) => (
              <motion.div
                key={i}
                className="bg-[#1A1033] bg-opacity-50 rounded-lg p-3 text-center"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
              >
                <div className="text-lg font-bold text-white">{stat.value}</div>
                <div className="text-xs text-purple-300">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      {/* Enhanced Floating Particles */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(isMobile ? 15 : 30)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-1.5 h-1.5 bg-gradient-to-r from-purple-400 to-indigo-400 rounded-full"
            initial={{
              x: Math.random() * window.innerWidth,
              y: Math.random() * window.innerHeight,
              scale: 0,
            }}
            animate={{
              x: [
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
                Math.random() * window.innerWidth,
              ],
              y: [
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
                Math.random() * window.innerHeight,
              ],
              opacity: [0.2, 0.8, 0.2],
              scale: [0, 1, 0],
            }}
            transition={{
              duration: Math.random() * 8 + 4,
              repeat: Infinity,
              ease: "easeInOut",
              delay: Math.random() * 2,
            }}
            style={{
              filter: "blur(0.5px)",
              boxShadow: "0 0 8px rgba(168, 85, 247, 0.4)",
            }}
          />
        ))}
      </div>

      {/* Additional Background Stars */}
      <div className="absolute inset-0 pointer-events-none">
        {[...Array(isMobile ? 20 : 40)].map((_, i) => (
          <motion.div
            key={`star-${i}`}
            className="absolute w-0.5 h-0.5 bg-white rounded-full"
            initial={{
              x: Math.random() * 100 + "%",
              y: Math.random() * 100 + "%",
              scale: Math.random() * 0.5 + 0.5,
            }}
            animate={{
              opacity: [0.2, 0.8, 0.2],
            }}
            transition={{
              duration: Math.random() * 3 + 2,
              repeat: Infinity,
              delay: Math.random() * 2,
            }}
            style={{
              boxShadow: "0 0 2px rgba(255, 255, 255, 0.5)",
            }}
          />
        ))}
      </div>
    </div>
  );
}
