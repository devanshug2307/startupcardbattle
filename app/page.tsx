"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gamepad2, Trophy, Library, Rocket } from "lucide-react";
import { LogoCarousel } from "@/components/ui/logo-carousel";
import { GradientHeading } from "@/components/ui/gradient-heading";
import type { SVGProps } from "react";
import { OrbitingCirclesDemo } from "@/components/ui/orbiting-circles-demo";

// Indian Startup SVG Icons (unchanged)
function PhonePeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#5F259F" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.248 17.43H8.752c-.69 0-1.248-.558-1.248-1.247V7.816c0-.69.558-1.248 1.248-1.248h6.496c.69 0 1.248.558 1.248 1.248v8.367c0 .689-.559 1.247-1.248 1.247z" />
    </svg>
  );
}

function CREDIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg width="800" height="800" viewBox="0 0 192 192" fill="none" {...props}>
      <path
        d="M34 22v117l62 31 62-31V22H34z"
        style={{
          fill: "none",
          stroke: "#fff",
          strokeWidth: 12,
          strokeLinejoin: "round",
        }}
      />
      <path
        d="M110 69.686H58V127l38 19 38-19V88m0-12V46H52"
        style={{
          fill: "none",
          stroke: "#fff",
          strokeWidth: 12,
          strokeLinejoin: "round",
        }}
      />
      <path
        d="M82 88v27l14 7 14-7"
        style={{
          fill: "none",
          stroke: "#fff",
          strokeWidth: 12,
          strokeLinejoin: "round",
        }}
      />
    </svg>
  );
}

function MeeshoIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#FF6B6B" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1 15.5c0 .276-.224.5-.5.5h-1c-.276 0-.5-.224-.5-.5v-7c0-.276.224-.5.5-.5h1c.276 0 .5.224.5.5v7z" />
    </svg>
  );
}

function SwiggyIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#FC8019" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3 16H9c-.552 0-1-.448-1-1V9c0-.552.448-1 1-1h6c.552 0 1 .448 1 1v6c0 .552-.448 1-1 1z" />
    </svg>
  );
}

function ZerodhaIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#387ED1" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm1.5 16.5h-3c-.276 0-.5-.224-.5-.5V8c0-.276.224-.5.5-.5h3c.276 0 .5.224.5.5v8c0 .276-.224.5-.5.5z" />
    </svg>
  );
}

function RazorpayIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#2D81E5" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm2 16.5h-4c-.276 0-.5-.224-.5-.5V8c0-.276.224-.5.5-.5h4c.276 0 .5.224.5.5v8c0 .276-.224.5-.5.5z" />
    </svg>
  );
}

const startupLogos = [
  { name: "PhonePe", id: 1, img: PhonePeIcon },
  { name: "CRED", id: 2, img: CREDIcon },
  { name: "Meesho", id: 3, img: MeeshoIcon },
  { name: "Swiggy", id: 4, img: SwiggyIcon },
  { name: "Zerodha", id: 5, img: ZerodhaIcon },
  { name: "Razorpay", id: 6, img: RazorpayIcon },
];

export default function Home() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1500);
    return () => clearTimeout(timer);
  }, []);

  const buttonVariants = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    hover: {
      scale: 1.05,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff10_1px,transparent_1px)] bg-[size:20px_20px] opacity-30 -z-20" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10 -z-10"
        animate={{
          opacity: [0.1, 0.2, 0.1],
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 5, repeat: Infinity }}
      />

      <AnimatePresence>
        {isLoading ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center bg-gray-900"
            exit={{ opacity: 0, scale: 0.8 }}
          >
            <motion.div
              animate={{ rotate: 360, scale: [1, 1.3, 1] }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: "easeInOut",
              }}
            >
              <Rocket className="w-20 h-20 text-purple-400" />
              <motion.div
                className="absolute inset-0 flex items-center justify-center"
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1, repeat: Infinity }}
              >
                <Sparkles className="w-24 h-24 text-pink-400" />
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
            <div className="flex flex-col items-center gap-8 md:gap-12">
              {/* Hero Section with Improved Layout */}
              <div className="w-full max-w-4xl mx-auto">
                <div className="relative">
                  {/* Main Title */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-4"
                  >
                    <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight bg-gradient-to-br from-purple-300 via-pink-400 to-blue-400 bg-clip-text text-transparent drop-shadow-2xl">
                      Startup Card Battle
                    </h1>
                    <p className="mt-4 text-lg md:text-xl text-gray-300">
                      Collect, Trade & Battle with India's Top Startups
                    </p>
                  </motion.div>

                  {/* Orbiting Circles Demo */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="mt-8 mb-12"
                  >
                    <OrbitingCirclesDemo />
                  </motion.div>
                </div>
              </div>

              {/* Action Buttons with Improved Styling and z-index */}
              <motion.div
                className="grid gap-4 w-full max-w-md px-4 relative z-20"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
              >
                <motion.div
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  <Button
                    className="w-full py-6 text-lg bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 text-white rounded-xl shadow-lg hover:shadow-purple-500/25 transition-all duration-300"
                    onClick={() => router.push("/play")}
                  >
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    Play Now
                  </Button>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      className="w-full py-6 text-lg bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white rounded-xl shadow-lg hover:shadow-blue-500/25 transition-all duration-300"
                      onClick={() => router.push("/collection")}
                    >
                      <Library className="mr-2 h-5 w-5" />
                      Collection
                    </Button>
                  </motion.div>

                  <motion.div
                    variants={buttonVariants}
                    whileHover="hover"
                    whileTap="tap"
                  >
                    <Button
                      className="w-full py-6 text-lg bg-gradient-to-r from-pink-600 to-pink-700 hover:from-pink-700 hover:to-pink-800 text-white rounded-xl shadow-lg hover:shadow-pink-500/25 transition-all duration-300"
                      onClick={() => router.push("/leaderboard")}
                    >
                      <Trophy className="mr-2 h-5 w-5" />
                      Rankings
                    </Button>
                  </motion.div>
                </div>
              </motion.div>

              {/* Game Features */}
              <motion.div
                className="w-full max-w-4xl mt-8"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
              >
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 px-4">
                  {[
                    {
                      title: "Collect Cards",
                      description:
                        "Build your startup portfolio with unique cards",
                      icon: Library,
                      color: "from-blue-500/20 to-blue-600/20",
                    },
                    {
                      title: "Battle Others",
                      description:
                        "Challenge players in strategic card battles",
                      icon: Gamepad2,
                      color: "from-purple-500/20 to-purple-600/20",
                    },
                    {
                      title: "Climb Ranks",
                      description:
                        "Rise through the leaderboard and earn rewards",
                      icon: Trophy,
                      color: "from-pink-500/20 to-pink-600/20",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className={`relative p-6 rounded-xl bg-gradient-to-br ${feature.color} backdrop-blur-sm border border-gray-800`}
                      whileHover={{ scale: 1.02 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className="h-8 w-8 mb-4 text-white/80" />
                      <h3 className="text-lg font-semibold mb-2">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-gray-300">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
