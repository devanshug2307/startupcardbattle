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
//
Temporary
file
