import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import {
  PhonePeIcon,
  CREDIcon,
  MeeshoIcon,
  SwiggyIcon,
  ZerodhaIcon,
  RazorpayIcon,
} from "@/components/ui/startup-icons";
import { motion, useAnimation } from "framer-motion";
import {
  Sparkles,
  Zap,
  TrendingUp,
  DollarSign,
  Rocket,
  HelpCircle,
  X,
  ChevronRight,
  ChevronLeft,
  Calendar,
  Award,
} from "lucide-react";
import { useState, useEffect } from "react";
import { AnimatePresence } from "framer-motion";

export function OrbitingCirclesDemo() {
  const [hoveredCard, setHoveredCard] = useState<number | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const centerControls = useAnimation();
  const [showTutorial, setShowTutorial] = useState<boolean>(false);
  const [tutorialStep, setTutorialStep] = useState<number>(1);

  // Handle card hover effect
  useEffect(() => {
    if (hoveredCard !== null) {
      centerControls.start({
        scale: 1.05,
        transition: { duration: 0.3 },
      });
    } else {
      centerControls.start({
        scale: 1,
        transition: { duration: 0.3 },
      });
    }
  }, [hoveredCard, centerControls]);

  // Tutorial data with steps
  const tutorialSteps = [
    {
      title: "Welcome to Startup Card Battle!",
      description:
        "A strategic card game featuring India's most innovative unicorns. Let's learn how to play!",
      image: "deck",
      highlight: "cards",
    },
    {
      title: "Build Your Deck",
      description:
        "Select 4 startup cards to form your battle deck. Choose wisely based on their stats!",
      image: "select",
      highlight: "selection",
    },
    {
      title: "Battle Mechanics",
      description:
        "Each round, you'll choose one attribute to compete with. Higher isn't always better!",
      image: "battle",
      highlight: "attributes",
    },
    {
      title: "Winning Strategies",
      description:
        "Revenue & Valuation: Higher is better | Founded Year & Time to Unicorn: Lower is better",
      image: "strategy",
      highlight: "comparison",
    },
    {
      title: "Ready to Play?",
      description:
        "Win rounds, climb the leaderboard, and unlock more startup cards. Good luck!",
      image: "trophy",
      highlight: "play",
    },
  ];

  // Startup data for cards
  const startupData = [
    {
      Icon: PhonePeIcon,
      name: "PhonePe",
      color: "purple",
      stats: { valuation: "12B", founded: 2015, category: "Fintech" },
      position: { radius: 130, delay: 0, reverse: false },
    },
    {
      Icon: CREDIcon,
      name: "CRED",
      color: "pink",
      stats: { valuation: "6.4B", founded: 2018, category: "Fintech" },
      position: { radius: 130, delay: -8.33, reverse: false },
    },
    {
      Icon: MeeshoIcon,
      name: "Meesho",
      color: "blue",
      stats: { valuation: "4.9B", founded: 2015, category: "Consumer" },
      position: { radius: 130, delay: -16.66, reverse: false },
    },
    {
      Icon: SwiggyIcon,
      name: "Swiggy",
      color: "orange",
      stats: { valuation: "10.7B", founded: 2014, category: "Consumer" },
      position: { radius: 210, delay: 0, reverse: true },
    },
    {
      Icon: ZerodhaIcon,
      name: "Zerodha",
      color: "blue",
      stats: { valuation: "2B", founded: 2010, category: "Fintech" },
      position: { radius: 210, delay: -11.66, reverse: true },
    },
    {
      Icon: RazorpayIcon,
      name: "Razorpay",
      color: "cyan",
      stats: { valuation: "7.5B", founded: 2014, category: "Fintech" },
      position: { radius: 210, delay: -23.33, reverse: true },
    },
  ];

  return (
    <div className="relative flex h-[450px] sm:h-[550px] w-full flex-col items-center justify-center">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px] opacity-50" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10"
        animate={{
          opacity: [0.3, 0.15, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      {/* Retro grid background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,rgba(130,71,229,0.1)_1px,transparent_1px),linear-gradient(to_bottom,rgba(130,71,229,0.1)_1px,transparent_1px)] bg-[size:20px_20px]" />

      <div className="relative h-full w-full">
        {/* Help Button */}
        <motion.button
          className="absolute top-4 right-4 z-50 bg-gradient-to-r from-purple-500/80 to-blue-500/80 p-2 rounded-full shadow-lg hover:shadow-purple-500/30"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setShowTutorial(true)}
        >
          <HelpCircle className="h-5 w-5 text-white" />
        </motion.button>

        {/* Center Container with Gradient Ring */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          {/* Animated gradient ring */}
          <motion.div
            className="absolute -inset-2 rounded-full bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 blur-md"
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* Center content - Card-like design */}
          <motion.div
            animate={centerControls}
            onClick={() => setIsCardFlipped(!isCardFlipped)}
            className="relative w-[120px] h-[120px] sm:w-[160px] sm:h-[160px] rounded-2xl bg-gradient-to-br from-gray-900/95 to-gray-800/95 backdrop-blur-xl border border-purple-500/30 flex items-center justify-center overflow-hidden cursor-pointer card-shine card-holographic"
          >
            <motion.div
              className="absolute inset-0 w-full h-full"
              initial={false}
              animate={{ rotateY: isCardFlipped ? 180 : 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              style={{ transformStyle: "preserve-3d" }}
            >
              {/* Front of card */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center backface-hidden p-4"
                style={{ backfaceVisibility: "hidden" }}
              >
                <div className="absolute inset-0 card-circuit-pattern opacity-20" />
                <Rocket className="text-purple-400 h-8 w-8 sm:h-10 sm:w-10 mb-2" />
                <h2 className="text-base sm:text-xl font-bold bg-gradient-to-br from-purple-300 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                  Unicorns
                </h2>
                <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                  India's Rising Stars
                </p>
                <div className="absolute top-2 right-2">
                  <Sparkles className="h-3 w-3 text-purple-400/70" />
                </div>
                <div className="absolute bottom-2 left-2">
                  <Sparkles className="h-3 w-3 text-blue-400/70" />
                </div>
              </motion.div>

              {/* Back of card */}
              <motion.div
                className="absolute inset-0 flex flex-col items-center justify-center backface-hidden p-3"
                style={{
                  backfaceVisibility: "hidden",
                  transform: "rotateY(180deg)",
                }}
              >
                <div className="absolute inset-0 card-circuit-pattern opacity-20" />
                <div className="w-full h-full flex flex-col justify-between">
                  <div className="text-center">
                    <p className="text-[10px] sm:text-xs text-purple-300 font-semibold">
                      STARTUP STATS
                    </p>
                  </div>
                  <div className="flex flex-col gap-1.5 text-[9px] sm:text-xs">
                    <div className="flex items-center gap-1">
                      <TrendingUp className="h-2.5 w-2.5 text-green-400" />
                      <span className="text-gray-300">
                        Total Unicorns: 100+
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <DollarSign className="h-2.5 w-2.5 text-yellow-400" />
                      <span className="text-gray-300">
                        Total Valuation: $450B+
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Zap className="h-2.5 w-2.5 text-blue-400" />
                      <span className="text-gray-300">
                        Growth Rate: 43% YoY
                      </span>
                    </div>
                  </div>
                  <div className="text-center">
                    <p className="text-[8px] sm:text-[10px] text-gray-500">
                      Tap to flip
                    </p>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          </motion.div>
        </div>

        {/* Startup Cards */}
        {startupData.map(({ Icon, name, color, stats, position }, index) => (
          <OrbitingCircles
            key={index}
            className="size-[90px] sm:size-[110px]"
            duration={position.radius < 200 ? 25 : 35}
            delay={position.delay}
            radius={position.radius}
            reverse={position.reverse}
            path={false}
          >
            <motion.div
              className="relative group"
              onHoverStart={() => setHoveredCard(index)}
              onHoverEnd={() => setHoveredCard(null)}
              whileHover={{ scale: 1.1, zIndex: 30 }}
              whileTap={{ scale: 0.95 }}
            >
              {/* Card design */}
              <div
                className={`relative w-[80px] h-[110px] sm:w-[90px] sm:h-[130px] rounded-lg overflow-hidden card-shine`}
              >
                {/* Card background with gradient */}
                <div
                  className={`absolute inset-0 bg-gradient-to-br from-gray-800 to-gray-900 border-2 border-${color}-500/30 rounded-lg`}
                />
                <div className="absolute inset-0 card-circuit-pattern opacity-10" />

                {/* Card content */}
                <div className="relative h-full flex flex-col p-2 sm:p-3">
                  {/* Card header */}
                  <div className="flex justify-between items-start mb-1">
                    <div
                      className={`text-[8px] sm:text-[10px] font-bold px-1.5 py-0.5 rounded bg-${color}-500/20 text-${color}-300`}
                    >
                      {stats.category}
                    </div>
                    <div className="text-[8px] sm:text-[10px] text-gray-400">
                      {stats.founded}
                    </div>
                  </div>

                  {/* Logo area */}
                  <div
                    className={`flex-grow flex items-center justify-center my-1 rounded-md bg-gray-800/50 p-2 border border-${color}-500/10`}
                  >
                    <Icon className="h-10 w-10 sm:h-12 sm:w-12" />
                  </div>

                  {/* Name and stats */}
                  <div className="mt-1">
                    <h3
                      className={`text-[10px] sm:text-xs font-bold text-${color}-300 text-center`}
                    >
                      {name}
                    </h3>
                    <div className="flex justify-center items-center mt-1">
                      <div className="text-[8px] sm:text-[10px] text-gray-300 flex items-center">
                        <DollarSign className="h-2 w-2 mr-0.5 text-yellow-400" />
                        {stats.valuation}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Holographic effect */}
                <div className="absolute inset-0 bg-gradient-to-tr from-transparent via-white/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>

              {/* Glow effect on hover */}
              <motion.div
                className={`absolute -inset-1 rounded-lg bg-gradient-to-r from-${color}-500/0 via-${color}-500/30 to-${color}-500/0 blur-sm opacity-0 group-hover:opacity-100 transition-opacity duration-300 -z-10`}
                animate={hoveredCard === index ? { scale: [1, 1.05, 1] } : {}}
                transition={{ duration: 1.5, repeat: Infinity }}
              />
            </motion.div>
          </OrbitingCircles>
        ))}

        {/* Orbit paths with glowing effect */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-[420px] h-[420px] sm:w-[460px] sm:h-[460px] rounded-full border border-purple-500/20 blur-[0.5px]"
            animate={{
              opacity: [0.2, 0.3, 0.2],
              scale: [1, 1.01, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[260px] h-[260px] sm:w-[300px] sm:h-[300px] rounded-full border border-pink-500/20 blur-[0.5px]"
            animate={{
              opacity: [0.15, 0.25, 0.15],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </div>

        {/* Tutorial Modal */}
        <AnimatePresence>
          {showTutorial && (
            <motion.div
              className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={(e) => {
                if (e.target === e.currentTarget) setShowTutorial(false);
              }}
            >
              <motion.div
                className="relative w-full max-w-md bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl overflow-hidden border border-purple-500/30 shadow-xl"
                initial={{ scale: 0.9, y: 20 }}
                animate={{ scale: 1, y: 0 }}
                exit={{ scale: 0.9, y: 20 }}
              >
                {/* Close button */}
                <button
                  className="absolute top-3 right-3 z-10 p-1 rounded-full bg-gray-800/80 hover:bg-gray-700/80"
                  onClick={() => setShowTutorial(false)}
                >
                  <X className="h-5 w-5 text-gray-400" />
                </button>

                {/* Tutorial content */}
                <div className="p-6">
                  {/* Progress indicator */}
                  <div className="flex justify-center mb-4 gap-1.5">
                    {tutorialSteps.map((_, i) => (
                      <motion.div
                        key={`step-${i}`}
                        className={`h-1.5 rounded-full ${
                          i + 1 === tutorialStep
                            ? "bg-purple-500 w-8"
                            : "bg-gray-700 w-4"
                        }`}
                        animate={
                          i + 1 === tutorialStep
                            ? { width: 32, backgroundColor: "#a855f7" }
                            : { width: 16, backgroundColor: "#374151" }
                        }
                        transition={{ duration: 0.3 }}
                      />
                    ))}
                  </div>

                  {/* Tutorial step content */}
                  <motion.div
                    key={`tutorial-step-${tutorialStep}`}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <h3 className="text-xl font-bold bg-gradient-to-r from-purple-300 to-blue-300 bg-clip-text text-transparent mb-2">
                      {tutorialSteps[tutorialStep - 1].title}
                    </h3>
                    <p className="text-gray-300 text-sm mb-4">
                      {tutorialSteps[tutorialStep - 1].description}
                    </p>

                    {/* Tutorial illustrations */}
                    <div className="relative h-48 mb-4 rounded-xl overflow-hidden bg-gradient-to-br from-gray-800/50 to-gray-900/50 border border-purple-500/20">
                      <div className="absolute inset-0 card-circuit-pattern opacity-10" />

                      {/* Different illustrations based on step */}
                      {tutorialSteps[tutorialStep - 1].image === "deck" && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="relative flex items-center justify-center">
                            {[...Array(5)].map((_, i) => (
                              <motion.div
                                key={`card-${i}`}
                                className="absolute w-20 h-28 rounded-lg bg-gradient-to-br from-purple-600/80 to-blue-600/80 border border-white/20 shadow-lg"
                                initial={{
                                  rotate: 0,
                                  x: 0,
                                  y: 0,
                                  scale: 0.8,
                                  opacity: 0,
                                }}
                                animate={{
                                  rotate: (i - 2) * 5,
                                  x: (i - 2) * 10,
                                  y: Math.abs(i - 2) * -2,
                                  scale: 1 - Math.abs(i - 2) * 0.05,
                                  opacity: 1,
                                }}
                                transition={{
                                  delay: i * 0.1,
                                  duration: 0.5,
                                }}
                              >
                                <div className="absolute inset-0 card-circuit-pattern opacity-20" />
                                <div className="h-full flex flex-col p-2">
                                  <div className="text-[8px] bg-white/10 rounded px-1 mb-1">
                                    Startup
                                  </div>
                                  <div className="flex-grow flex items-center justify-center">
                                    <Rocket className="h-6 w-6 text-white/70" />
                                  </div>
                                  <div className="text-[8px] text-center text-white/80 mt-1">
                                    Unicorn
                                  </div>
                                </div>
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {tutorialSteps[tutorialStep - 1].image === "select" && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="grid grid-cols-2 gap-3 p-4">
                            {[...Array(4)].map((_, i) => (
                              <motion.div
                                key={`select-card-${i}`}
                                className={`w-16 h-24 rounded-lg bg-gradient-to-br from-gray-800 to-gray-900 border-2 ${
                                  i < 2
                                    ? "border-purple-500"
                                    : "border-gray-700"
                                } relative`}
                                initial={{ y: 20, opacity: 0 }}
                                animate={{
                                  y: 0,
                                  opacity: 1,
                                  scale: i < 2 ? [1, 1.05, 1] : 1,
                                }}
                                transition={{
                                  delay: i * 0.15,
                                  duration: 0.5,
                                  scale: {
                                    repeat: i < 2 ? Infinity : 0,
                                    repeatType: "reverse",
                                    duration: 1.5,
                                  },
                                }}
                              >
                                {i < 2 && (
                                  <motion.div
                                    className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-purple-500 flex items-center justify-center text-[10px] font-bold text-white"
                                    initial={{ scale: 0 }}
                                    animate={{ scale: 1 }}
                                    transition={{ delay: i * 0.15 + 0.3 }}
                                  >
                                    {i + 1}
                                  </motion.div>
                                )}
                              </motion.div>
                            ))}
                          </div>
                        </motion.div>
                      )}

                      {tutorialSteps[tutorialStep - 1].image === "battle" && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="flex items-center justify-between w-full px-6">
                            <motion.div
                              className="w-20 h-28 rounded-lg bg-gradient-to-br from-blue-600/80 to-blue-800/80 border border-blue-500/50 relative"
                              initial={{ x: -20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="absolute inset-0 p-2">
                                <div className="text-[8px] text-center text-white mb-1">
                                  YOU
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                  {[
                                    {
                                      icon: DollarSign,
                                      color: "bg-purple-500/30",
                                    },
                                    {
                                      icon: TrendingUp,
                                      color: "bg-green-500/30",
                                    },
                                    { icon: Zap, color: "bg-yellow-500/30" },
                                    { icon: Calendar, color: "bg-blue-500/30" },
                                  ].map((item, i) => (
                                    <motion.div
                                      key={`stat-${i}`}
                                      className={`rounded p-1 ${item.color} flex items-center justify-center`}
                                      whileHover={{ scale: 1.1 }}
                                      animate={
                                        i === 0
                                          ? {
                                              scale: [1, 1.15, 1],
                                              boxShadow: [
                                                "0 0 0 rgba(168, 85, 247, 0.4)",
                                                "0 0 20px rgba(168, 85, 247, 0.6)",
                                                "0 0 0 rgba(168, 85, 247, 0.4)",
                                              ],
                                            }
                                          : {}
                                      }
                                      transition={{
                                        repeat: i === 0 ? Infinity : 0,
                                        duration: 1.5,
                                      }}
                                    >
                                      <item.icon className="h-3 w-3 text-white" />
                                    </motion.div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>

                            <motion.div
                              className="flex flex-col items-center"
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div className="text-[10px] text-purple-400 mb-1">
                                VS
                              </div>
                              <motion.div
                                animate={{
                                  rotate: 360,
                                }}
                                transition={{
                                  duration: 10,
                                  repeat: Infinity,
                                  ease: "linear",
                                }}
                                className="w-8 h-8 rounded-full border-2 border-dashed border-purple-500/30"
                              />
                            </motion.div>

                            <motion.div
                              className="w-20 h-28 rounded-lg bg-gradient-to-br from-red-600/80 to-red-800/80 border border-red-500/50 relative"
                              initial={{ x: 20, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ duration: 0.5 }}
                            >
                              <div className="absolute inset-0 p-2">
                                <div className="text-[8px] text-center text-white mb-1">
                                  AI
                                </div>
                                <div className="grid grid-cols-2 gap-1">
                                  {[
                                    {
                                      icon: DollarSign,
                                      color: "bg-purple-500/30",
                                    },
                                    {
                                      icon: TrendingUp,
                                      color: "bg-green-500/30",
                                    },
                                    { icon: Zap, color: "bg-yellow-500/30" },
                                    { icon: Calendar, color: "bg-blue-500/30" },
                                  ].map((item, i) => (
                                    <div
                                      key={`ai-stat-${i}`}
                                      className={`rounded p-1 ${item.color} flex items-center justify-center`}
                                    >
                                      <item.icon className="h-3 w-3 text-white" />
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                      {tutorialSteps[tutorialStep - 1].image === "strategy" && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <div className="grid grid-cols-2 gap-4 p-4">
                            <motion.div
                              className="col-span-2 bg-gradient-to-r from-purple-500/20 to-blue-500/20 rounded-lg p-2"
                              initial={{ y: -10, opacity: 0 }}
                              animate={{ y: 0, opacity: 1 }}
                              transition={{ delay: 0.1 }}
                            >
                              <div className="text-[10px] text-center text-white/80 mb-1">
                                Attribute Comparison
                              </div>
                              <div className="grid grid-cols-2 gap-2">
                                <div className="flex items-center gap-1">
                                  <DollarSign className="h-3 w-3 text-purple-400" />
                                  <span className="text-[8px] text-white">
                                    Higher wins
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <TrendingUp className="h-3 w-3 text-green-400" />
                                  <span className="text-[8px] text-white">
                                    Higher wins
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Zap className="h-3 w-3 text-yellow-400" />
                                  <span className="text-[8px] text-white">
                                    Lower wins
                                  </span>
                                </div>
                                <div className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 text-blue-400" />
                                  <span className="text-[8px] text-white">
                                    Lower wins
                                  </span>
                                </div>
                              </div>
                            </motion.div>

                            <motion.div
                              className="bg-gradient-to-br from-green-500/20 to-green-700/20 rounded-lg p-2 flex flex-col items-center"
                              initial={{ x: -10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.3 }}
                            >
                              <div className="text-[10px] text-green-400 mb-1">
                                WIN
                              </div>
                              <div className="text-[8px] text-center text-white/80">
                                Choose your strongest attribute
                              </div>
                            </motion.div>

                            <motion.div
                              className="bg-gradient-to-br from-red-500/20 to-red-700/20 rounded-lg p-2 flex flex-col items-center"
                              initial={{ x: 10, opacity: 0 }}
                              animate={{ x: 0, opacity: 1 }}
                              transition={{ delay: 0.5 }}
                            >
                              <div className="text-[10px] text-red-400 mb-1">
                                AVOID
                              </div>
                              <div className="text-[8px] text-center text-white/80">
                                Predict opponent's strengths
                              </div>
                            </motion.div>
                          </div>
                        </motion.div>
                      )}

                      {tutorialSteps[tutorialStep - 1].image === "trophy" && (
                        <motion.div
                          className="absolute inset-0 flex items-center justify-center"
                          initial={{ opacity: 0 }}
                          animate={{ opacity: 1 }}
                        >
                          <motion.div
                            initial={{ scale: 0 }}
                            animate={{
                              scale: 1,
                              y: [0, -5, 0],
                            }}
                            transition={{
                              scale: { duration: 0.5 },
                              y: {
                                repeat: Infinity,
                                duration: 1.5,
                                ease: "easeInOut",
                              },
                            }}
                            className="relative"
                          >
                            <motion.div
                              animate={{
                                rotate: [0, -10, 10, -10, 10, 0],
                              }}
                              transition={{
                                duration: 2,
                                repeat: Infinity,
                                repeatType: "reverse",
                              }}
                            >
                              <Award className="h-20 w-20 text-yellow-400 drop-shadow-[0_0_12px_rgba(234,179,8,0.3)]" />
                            </motion.div>

                            <motion.div
                              className="absolute -top-4 -right-4"
                              animate={{
                                scale: [0, 1.2, 1],
                                rotate: [0, 20, 0],
                              }}
                              transition={{
                                delay: 0.8,
                                duration: 0.5,
                                scale: { repeat: Infinity, repeatDelay: 2 },
                                rotate: { repeat: Infinity, repeatDelay: 2 },
                              }}
                            >
                              <Sparkles className="h-6 w-6 text-yellow-300" />
                            </motion.div>
                          </motion.div>
                        </motion.div>
                      )}
                    </div>
                  </motion.div>

                  {/* Navigation buttons */}
                  <div className="flex justify-between mt-4">
                    <motion.button
                      className={`flex items-center gap-1 px-3 py-1.5 rounded-lg ${
                        tutorialStep === 1
                          ? "bg-gray-800/50 text-gray-500 cursor-not-allowed"
                          : "bg-gray-800 text-gray-300 hover:bg-gray-700"
                      }`}
                      whileHover={tutorialStep !== 1 ? { scale: 1.05 } : {}}
                      whileTap={tutorialStep !== 1 ? { scale: 0.95 } : {}}
                      onClick={() => {
                        if (tutorialStep > 1) setTutorialStep(tutorialStep - 1);
                      }}
                      disabled={tutorialStep === 1}
                    >
                      <ChevronLeft className="h-4 w-4" />
                      <span className="text-sm">Previous</span>
                    </motion.button>

                    {tutorialStep < tutorialSteps.length ? (
                      <motion.button
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-purple-600 hover:bg-purple-700 text-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setTutorialStep(tutorialStep + 1)}
                      >
                        <span className="text-sm">Next</span>
                        <ChevronRight className="h-4 w-4" />
                      </motion.button>
                    ) : (
                      <motion.button
                        className="flex items-center gap-1 px-4 py-1.5 rounded-lg bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white"
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => setShowTutorial(false)}
                      >
                        <span className="text-sm font-medium">Let's Play!</span>
                        <Rocket className="h-4 w-4 ml-1" />
                      </motion.button>
                    )}
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
