"use client";

import { Button } from "@/components/ui/button";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import {
  ArrowRight,
  Code,
  Command,
  Cpu,
  Database,
  Globe,
  LifeBuoy,
  Rocket,
  Server,
  Sparkles,
  Zap,
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect } from "react";
import Link from "next/link";

export function OrbitingCirclesDemo() {
  const [mounted, setMounted] = useState(false);
  const [animationComplete, setAnimationComplete] = useState(false);
  const [bootSequence, setBootSequence] = useState(false);
  const [bootingText, setBootingText] = useState("");
  const bootMessages = [
    "LOADING SYSTEM FILES...",
    "MEMORY TEST: 16384K OK",
    "INITIALIZING MS-DOS v6.22",
    "LOADING STARTUP BATTLE v3.7...",
    "SETTING VGA MODE: 640x480x256",
    "STARTUP DATABASE DETECTED",
    "INITIALIZING VENTURE PROTOCOLS",
    "CHECKING DRIVE INTEGRITY",
    "SYSTEM READY.",
  ];

  useEffect(() => {
    setMounted(true);

    // Start boot sequence animation
    let currentMsgIndex = 0;
    const bootingInterval = setInterval(() => {
      if (currentMsgIndex < bootMessages.length) {
        setBootingText(bootMessages[currentMsgIndex]);
        currentMsgIndex++;
      } else {
        clearInterval(bootingInterval);
        setTimeout(() => {
          setBootSequence(true);
          setTimeout(() => {
            setAnimationComplete(true);
          }, 1000);
        }, 1000);
      }
    }, 600);

    return () => clearInterval(bootingInterval);
  }, []);

  // Define floating icons with their properties
  const floatingIcons = [
    {
      icon: <Rocket size={18} />,
      delay: 0,
      radius: 220,
      color: "amber-500",
      glowEffect: true,
    },
    {
      icon: <Cpu size={18} />,
      delay: 2,
      radius: 220,
      color: "amber-500",
      glowEffect: true,
    },
    {
      icon: <Globe size={18} />,
      delay: 4,
      radius: 220,
      color: "amber-500",
      glowEffect: true,
    },
    {
      icon: <Database size={18} />,
      delay: 6,
      radius: 220,
      color: "amber-500",
      glowEffect: true,
    },
    {
      icon: <Server size={18} />,
      delay: 8,
      radius: 220,
      color: "amber-500",
      glowEffect: true,
    },
    {
      icon: <Zap size={18} />,
      delay: 10,
      radius: 220,
      color: "amber-500",
      glowEffect: true,
    },
    {
      icon: <Code size={18} />,
      delay: 12,
      radius: 220,
      color: "amber-500",
      glowEffect: true,
    },
    {
      icon: <Command size={18} />,
      delay: 14,
      radius: 220,
      color: "amber-500",
      glowEffect: true,
    },
  ];

  return (
    <motion.div
      className="relative w-full overflow-hidden"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* CRT Screen Effect */}
      <div className="absolute inset-0 pointer-events-none z-10">
        {/* CRT flicker effect */}
        <motion.div
          className="absolute inset-0 bg-white/5"
          animate={{ opacity: [0.03, 0, 0.02, 0, 0.03] }}
          transition={{ duration: 5, repeat: Infinity, repeatType: "reverse" }}
        />

        {/* Edge vignette */}
        <div className="absolute inset-0 bg-gradient-radial from-transparent to-black/70 opacity-40"></div>
      </div>

      {!bootSequence ? (
        <div className="relative z-20 flex flex-col items-center justify-center min-h-[400px] text-center bg-black border border-amber-500/30 rounded-md">
          <div className="bg-blue-900 w-full p-1 mb-4 border-b border-blue-700 text-left">
            <span className="text-white text-xs font-mono">SYSTEM BOOT</span>
          </div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="font-mono text-xl text-amber-400 mb-4"
          >
            <div className="flex items-center space-x-2 justify-center">
              <motion.div
                animate={{ opacity: [1, 0, 1] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="w-3 h-3 bg-amber-500 rounded-full"
              ></motion.div>
              <span className="tracking-wider">{bootingText}</span>
            </div>
          </motion.div>

          <div className="mt-8 flex flex-col items-center space-y-4">
            <motion.div
              animate={{
                rotate: 360,
              }}
              transition={{
                duration: 4,
                repeat: Infinity,
                ease: "linear",
              }}
            >
              <Rocket size={48} className="text-amber-400" />
            </motion.div>

            <div className="text-amber-400/70 text-xs font-mono mt-4 animate-pulse">
              Press any key to continue...
            </div>
          </div>
        </div>
      ) : (
        <div className="relative z-20 grid lg:grid-cols-2 gap-4 items-start bg-black border border-amber-500/30 rounded-md overflow-hidden">
          <div className="bg-blue-900 w-full p-1 border-b border-blue-700 text-left col-span-2">
            <span className="text-white text-xs font-mono">
              STARTUP BATTLE v3.7
            </span>
          </div>

          {/* Animated circles with icons */}
          <div className="flex items-center justify-center relative h-[400px] p-4 border-r border-amber-500/20">
            <div className="flex flex-col items-center justify-center relative">
              {/* Glowing orb center */}
              <motion.div
                className="absolute w-24 h-24 rounded-full bg-gradient-to-r from-amber-500 via-amber-400 to-yellow-500"
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
                <div className="relative flex items-center justify-center rounded-full bg-background/10 backdrop-blur-md border border-amber-500/50 p-4 w-16 h-16 z-20">
                  <Sparkles className="h-7 w-7 text-amber-400" />
                </div>
              </motion.div>

              {/* Orbiting icons */}
              {mounted &&
                floatingIcons.map((item, index) => (
                  <OrbitingCircles
                    key={index}
                    radius={item.radius}
                    delay={item.delay}
                    duration={25 + index * 2}
                    reverse={index % 2 === 0}
                    glowEffect={item.glowEffect}
                    glowColor={item.color}
                    trailEffect={true}
                    trailCount={3}
                    pathColor={`${item.color}`}
                    pulseEffect={true}
                  >
                    <div className="p-1 rounded-full bg-background/50 backdrop-blur-sm">
                      {item.icon}
                    </div>
                  </OrbitingCircles>
                ))}
            </div>
          </div>

          {/* Content */}
          <AnimatePresence>
            {animationComplete && (
              <motion.div
                className="p-4 flex flex-col space-y-4"
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
                    <div className="bg-blue-900 p-1 mb-2 border-b border-blue-700 text-left">
                      <span className="text-white text-xs font-mono">
                        README.TXT
                      </span>
                    </div>
                    <h1 className="text-3xl font-bold text-amber-400 tracking-tight terminal-text">
                      STARTUP BATTLE
                    </h1>
                  </motion.div>
                  <motion.p
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="text-amber-300/80 max-w-lg font-mono text-sm"
                  >
                    Build, compete, and conquer in the ultimate entrepreneurship
                    simulator. Launch your startup, outmaneuver rivals, and
                    dominate the market.
                  </motion.p>
                </div>

                {/* Feature cards with DOS styling */}
                <div className="space-y-2 mt-4">
                  <div className="bg-blue-900 p-1 border-b border-blue-700 text-left">
                    <span className="text-white text-xs font-mono">
                      FEATURES.DAT
                    </span>
                  </div>

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
                      className="flex items-start space-x-2 p-2 border border-amber-500/20 bg-black/80 rounded-sm"
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.4, delay: feature.delay }}
                    >
                      <div className="mt-1 bg-blue-900/50 p-1.5 rounded-sm">
                        {feature.icon}
                      </div>
                      <div>
                        <h3 className="text-sm font-bold tracking-wider text-amber-400 terminal-text">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-amber-300/70 mt-1 font-mono">
                          {feature.desc}
                        </p>
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
                    <Button className="gap-1 px-4 py-2 font-mono bg-amber-600 hover:bg-amber-700 text-black transition-colors border border-amber-500/50">
                      C:\&gt; START.EXE
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </Link>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </motion.div>
  );
}
