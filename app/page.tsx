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
    <AnimatePresence>
      {isLoading ? (
        <motion.div
          className="absolute inset-0 flex items-center justify-center bg-[#0A0118]"
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
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="relative min-h-screen bg-[#0A0118] text-white overflow-hidden"
        >
          {/* Enhanced Background Effects */}
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#2C0855,#0A0118_50%)] opacity-70" />

          {/* Animated Grid Background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a002a_1px,transparent_1px),linear-gradient(to_bottom,#1a002a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

          {/* Glowing Orbs */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/10 rounded-full blur-[128px] -z-10" />
          <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/10 rounded-full blur-[128px] -z-10" />

          {/* Content Container */}
          <div className="container mx-auto px-4 py-8 md:py-12 relative z-10">
            <div className="flex flex-col items-center gap-8">
              {/* Hero Section */}
              <div className="w-full max-w-4xl mx-auto">
                <div className="relative">
                  {/* Main Title */}
                  <motion.div
                    initial={{ opacity: 0, y: -20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="text-center mb-4"
                  >
                    <h1 className="text-5xl sm:text-6xl md:text-7xl font-black tracking-tight bg-gradient-to-br from-violet-200 via-purple-400 to-indigo-400 bg-clip-text text-transparent drop-shadow-2xl">
                      Startup Card Battle
                    </h1>
                    <motion.p
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.2 }}
                      className="mt-6 text-lg md:text-xl text-purple-200/80 font-light"
                    >
                      A Strategic Card Game of Innovation & Power
                    </motion.p>
                  </motion.div>

                  {/* Orbiting Circles Demo */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.3 }}
                    className="relative mt-12"
                  >
                    <OrbitingCirclesDemo />
                  </motion.div>
                </div>
              </div>

              {/* Latest Updates */}
              <motion.div
                className="w-full max-w-4xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.9 }}
              >
                <div className="bg-purple-900/20 border border-purple-700/20 rounded-xl p-4">
                  <h3 className="text-lg font-bold text-purple-300 mb-3 flex items-center gap-2">
                    <Sparkles className="h-5 w-5" />
                    Latest Updates
                  </h3>
                  <div className="space-y-2">
                    {[
                      "New Startup Cards: Introducing 5 new unicorn startups!",
                      "Weekend Tournament: Compete for exclusive rewards",
                      "Balance Update: Adjusted valuation metrics for better gameplay",
                    ].map((update, i) => (
                      <motion.div
                        key={i}
                        className="flex items-center gap-2 text-sm text-purple-200"
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: i * 0.1 + 1 }}
                      >
                        <div className="h-2 w-2 rounded-full bg-purple-500" />
                        {update}
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>

              {/* Feature Cards */}
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
                      description: "Build your ultimate startup portfolio",
                      icon: Library,
                      color: "from-indigo-900/30 to-indigo-800/30",
                      borderColor: "indigo-700/30",
                    },
                    {
                      title: "Battle Others",
                      description: "Engage in strategic card battles",
                      icon: Gamepad2,
                      color: "from-purple-900/30 to-purple-800/30",
                      borderColor: "purple-700/30",
                    },
                    {
                      title: "Climb Ranks",
                      description: "Rise to the top of the leaderboard",
                      icon: Trophy,
                      color: "from-violet-900/30 to-violet-800/30",
                      borderColor: "violet-700/30",
                    },
                  ].map((feature, index) => (
                    <motion.div
                      key={index}
                      className={`relative p-6 rounded-xl bg-gradient-to-br ${
                        feature.color
                      } backdrop-blur-md border border-${
                        feature.borderColor
                      } hover:border-${feature.borderColor.replace(
                        "/30",
                        "/50"
                      )} transition-colors duration-300`}
                      whileHover={{ scale: 1.02, y: -2 }}
                      transition={{ duration: 0.2 }}
                    >
                      <feature.icon className="h-8 w-8 mb-4 text-white/90" />
                      <h3 className="text-lg font-semibold mb-2 text-white/90">
                        {feature.title}
                      </h3>
                      <p className="text-sm text-purple-200/70">
                        {feature.description}
                      </p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
