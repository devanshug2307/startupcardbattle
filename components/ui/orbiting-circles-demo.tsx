"use client";

import { motion, useAnimation, AnimatePresence } from "framer-motion";
import {
  Trophy,
  Gamepad2,
  Star,
  Rocket,
  HelpCircle,
  Clock,
  X,
  Zap,
  Cpu,
  Database,
  Globe,
  BarChart,
  ArrowUp,
  Code,
  Server,
  ArrowRight,
  Command,
  Sparkles,
} from "lucide-react";
import { useState, useEffect, useMemo } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import cloudflareIcon from "/public/icons/Cloudflare.png";
import vercelIcon from "/public/icons/vercel-icon-dark.png";
import replitIcon from "/public/icons/Replit_Logo_Symbol.png";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";

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

export interface OrbitingCirclesDemoProps {
  hideTitle?: boolean;
  compactMode?: boolean;
}

export function OrbitingCirclesDemo({
  hideTitle = false,
  compactMode = false,
}: OrbitingCirclesDemoProps) {
  const [selectedCard, setSelectedCard] = useState<number | null>(null);
  const [isCardFlipped, setIsCardFlipped] = useState<boolean>(false);
  const [isMobile, setIsMobile] = useState(false);
  const [showHelp, setShowHelp] = useState(false);
  const [hasShownInitialHelp, setHasShownInitialHelp] = useState(false);
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [dimensions, setDimensions] = useState({ width: 1000, height: 800 });
  const [showScanlines, setShowScanlines] = useState(true);

  // Set directly to true to skip animation
  const [animationComplete, setAnimationComplete] = useState(true);

  const [noiseParticles, setNoiseParticles] = useState<
    Array<{
      width: number;
      height: number;
      x: string;
      y: string;
      opacity: number;
      delay: number;
    }>
  >([]);

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
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [hasShownInitialHelp]);

  useEffect(() => {
    setMounted(true);
    // Update dimensions after mount
    setDimensions({
      width: window.innerWidth,
      height: window.innerHeight,
    });

    // Add resize handler
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Generate noise particles after mount
  useEffect(() => {
    if (mounted) {
      const particles = Array.from({ length: 20 }).map(() => ({
        width: Math.random() * 2 + 1,
        height: Math.random() * 2 + 1,
        x: `${Math.random() * 100}%`,
        y: `${Math.random() * 100}%`,
        opacity: Math.random() * 0.3,
        delay: Math.random() * 5,
      }));
      setNoiseParticles(particles);
    }
  }, [mounted]);

  // Startup data with retro gaming stats
  const startupData: StartupData[] = [
    {
      icon: cloudflareIcon.src,
      name: "Cloudflare",
      color: "from-indigo-600 to-indigo-900",
      stats: {
        valuation: "12B",
        founded: 2015,
        category: "Cybersecurity",
        power: 90,
        speed: 85,
        innovation: 82,
      },
      borderColor: "purple-500",
    },
    {
      icon: vercelIcon.src,
      name: "VERCEL",
      color: "from-black-900 to-black-900",
      stats: {
        valuation: "6.4B",
        founded: 2018,
        category: "DevOps",
        power: 85,
        speed: 92,
        innovation: 88,
      },
      borderColor: "purple-500",
    },
    {
      icon: replitIcon.src,
      name: "Replit",
      color: "from-blue-600 to-blue-900",
      stats: {
        valuation: "4.9B",
        founded: 2015,
        category: "Coding",
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
            <span>Valuation & Power:</span>
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

  // Helper function to generate deterministic positions
  const getParticlePosition = (
    index: number,
    total: number,
    isPercentage = false
  ) => {
    if (!mounted) {
      // During SSR and initial render, use deterministic positions
      const x = ((index + 1) / (total + 1)) * 100;
      const y = (index * index) % 100;
      return isPercentage
        ? {
            x: `${x}%`,
            y: `${y}%`,
          }
        : {
            x: (dimensions.width * x) / 100,
            y: (dimensions.height * y) / 100,
          };
    }
    // After mounting, use random positions
    return isPercentage
      ? {
          x: `${Math.random() * 100}%`,
          y: `${Math.random() * 100}%`,
        }
      : {
          x: Math.random() * dimensions.width,
          y: Math.random() * dimensions.height,
        };
  };

  const getParticleScale = (index: number) => {
    if (!mounted) {
      // Deterministic scale during SSR
      return 0.5 + (index % 5) / 10;
    }
    return Math.random() * 0.5 + 0.5;
  };

  const particleCount = isMobile ? 25 : 50;
  const starCount = isMobile ? 20 : 40;

  // Define floating icons with their properties
  const floatingIcons = useMemo(
    () => [
      {
        icon: <Rocket size={compactMode ? 14 : 18} />,
        delay: 0,
        radius: compactMode ? 120 : 220,
        color: "cyan-500",
        glowEffect: true,
      },
      {
        icon: <Cpu size={compactMode ? 14 : 18} />,
        delay: 2,
        radius: compactMode ? 120 : 220,
        color: "green-500",
        glowEffect: true,
      },
      {
        icon: <Globe size={compactMode ? 14 : 18} />,
        delay: 4,
        radius: compactMode ? 120 : 220,
        color: "indigo-500",
        glowEffect: true,
      },
      {
        icon: <Database size={compactMode ? 14 : 18} />,
        delay: 6,
        radius: compactMode ? 120 : 220,
        color: "amber-500",
        glowEffect: true,
      },
      {
        icon: <Server size={compactMode ? 14 : 18} />,
        delay: 8,
        radius: compactMode ? 120 : 220,
        color: "rose-500",
        glowEffect: true,
      },
      {
        icon: <Zap size={compactMode ? 14 : 18} />,
        delay: 10,
        radius: compactMode ? 120 : 220,
        color: "yellow-500",
        glowEffect: true,
      },
      {
        icon: <Code size={compactMode ? 14 : 18} />,
        delay: 12,
        radius: compactMode ? 120 : 220,
        color: "blue-500",
        glowEffect: true,
      },
      {
        icon: <Command size={compactMode ? 14 : 18} />,
        delay: 14,
        radius: compactMode ? 120 : 220,
        color: "purple-500",
        glowEffect: true,
      },
    ],
    [compactMode]
  );

  return (
    <motion.div
      id="orbiting-circles-demo"
      className="relative w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* CRT Screen Effect */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* Scanlines effect */}
        <div className="absolute inset-0 bg-scanlines opacity-10"></div>

        {/* CRT flicker effect */}
        <motion.div
          className="absolute inset-0 bg-white/5"
          animate={{ opacity: [0.03, 0, 0.02, 0, 0.03] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Edge vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/70 opacity-40"></div>
      </div>

      <div className="relative z-20 grid lg:grid-cols-2 gap-0 items-center overflow-hidden">
        {/* Animated circles with icons */}
        <div
          className={`flex items-center justify-center relative ${
            compactMode ? "h-[300px]" : "h-[600px]"
          }`}
        >
          <div className="flex flex-col items-center justify-center relative">
            {/* Glowing orb center */}
            <motion.div
              className={`absolute ${
                compactMode ? "w-16 h-16" : "w-24 h-24"
              } rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500`}
              animate={{
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "easeInOut",
              }}
              style={{
                filter: "blur(20px)",
              }}
            />

            <motion.div
              className="relative"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
            >
              <div
                className={`relative flex items-center justify-center rounded-full bg-background/10 backdrop-blur-md border border-secondary p-4 ${
                  compactMode ? "w-12 h-12" : "w-16 h-16"
                } z-20`}
              >
                <Sparkles
                  className={`${
                    compactMode ? "h-5 w-5" : "h-7 w-7"
                  } text-primary`}
                />
              </div>
            </motion.div>

            {/* Orbiting icons */}
            {mounted &&
              floatingIcons.map((item, index) => (
                <OrbitingCircles
                  key={index}
                  radius={item.radius}
                  delay={item.delay}
                  duration={compactMode ? 20 + index * 2 : 25 + index * 2}
                  reverse={index % 2 === 0}
                  glowEffect={item.glowEffect}
                  glowColor={item.color}
                  trailEffect={true}
                  trailCount={compactMode ? 2 : 3}
                  pathColor={`${item.color}`}
                  pulseEffect={true}
                >
                  <div
                    className={`p-1 rounded-full bg-background/50 backdrop-blur-sm`}
                  >
                    {item.icon}
                  </div>
                </OrbitingCircles>
              ))}
          </div>
        </div>

        {/* Content */}
        <AnimatePresence>
          {!hideTitle && (
            <motion.div
              className="p-4 lg:p-8 flex flex-col space-y-6"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="space-y-2">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                >
                  <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 tracking-tight">
                    STARTUP BATTLE
                  </h1>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="text-muted-foreground max-w-lg font-mono"
                >
                  Build, compete, and conquer in the ultimate entrepreneurship
                  simulator. Launch your startup, outmaneuver rivals, and
                  dominate the market.
                </motion.p>
              </div>

              {/* Feature cards with retro styling */}
              <div className="grid gap-4 mt-8">
                {[
                  {
                    title: "BUILD YOUR STARTUP",
                    desc: "Assemble your team, allocate resources, and develop your MVP",
                    icon: <Code />,
                    delay: 0.6,
                  },
                  {
                    title: "RAISE CAPITAL",
                    desc: "Pitch to VCs, negotiate terms, and secure funding rounds",
                    icon: <Database />,
                    delay: 0.8,
                  },
                  {
                    title: "MARKET DOMINATION",
                    desc: "Execute your go-to-market strategy and crush the competition",
                    icon: <Rocket />,
                    delay: 1.0,
                  },
                ].map((feature, i) => (
                  <motion.div
                    key={i}
                    className="p-4 border border-secondary/50 rounded-md bg-background/50 backdrop-blur-sm hover:bg-accent/5 transition-colors"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.4, delay: feature.delay }}
                  >
                    <div className="flex items-start space-x-4">
                      <div className="mt-1 bg-primary/10 p-2 rounded-md">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold tracking-wider text-primary">
                          {feature.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mt-1 font-mono">
                          {feature.desc}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 1.2 }}
                className="mt-4"
              >
                <Link href="/signup" className="inline-block">
                  <Button className="gap-1 px-4 py-2 font-mono bg-primary hover:bg-primary/90 transition-colors">
                    GET STARTED
                    <ArrowRight className="h-4 w-4" />
                  </Button>
                </Link>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </motion.div>
  );
}
