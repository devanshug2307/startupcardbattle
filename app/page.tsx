"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import {
  Sparkles,
  Gamepad2,
  Trophy,
  Library,
  Rocket,
  HelpCircle,
  Volume2,
  VolumeX,
  Cpu,
  Code,
  Database,
  Server,
  Zap,
  Command,
} from "lucide-react";
import { LogoCarousel } from "@/components/ui/logo-carousel";
import { GradientHeading } from "@/components/ui/gradient-heading";
import type { SVGProps } from "react";

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
  const [isMusicPlaying, setIsMusicPlaying] = useState(true);
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [mounted, setMounted] = useState(false);
  const [bootSequenceComplete, setBootSequenceComplete] = useState(false);
  const [bootStage, setBootStage] = useState(0);
  const [bootText, setBootText] = useState<string[]>([]);
  const [cursorVisible, setCursorVisible] = useState(true);
  const [showSystemReadyIcon, setShowSystemReadyIcon] = useState(false);
  const [screenOn, setScreenOn] = useState(false);
  const [forceMainContentRender, setForceMainContentRender] = useState(false);

  useEffect(() => {
    setMounted(true);

    // Create audio element when component mounts
    const audioElement = new Audio("/music/background-music.mp3");
    audioElement.loop = true;
    audioElement.volume = 0.5;
    setAudio(audioElement);

    // CRT screen on effect
    setTimeout(() => {
      setScreenOn(true);
    }, 500);

    // Try to auto-play, but handle the expected restriction
    audioElement.play().catch((error) => {
      console.log("Auto-play prevented - waiting for user interaction");
      setIsMusicPlaying(false); // Update UI to show music is not playing
    });

    // Add a one-time event listener for user interaction
    const enableAudio = () => {
      if (audioElement && audioElement.paused) {
        audioElement
          .play()
          .then(() => {
            setIsMusicPlaying(true);
          })
          .catch((e) => console.error("Play failed:", e));
      }
      // Remove the event listeners after first interaction
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
    };

    // Add event listeners for user interaction
    document.addEventListener("click", enableAudio);
    document.addEventListener("touchstart", enableAudio);

    // Boot sequence animation
    const bootSequence = async () => {
      // Stage 1
      setBootText([
        "Starting MS-DOS...",
        "HIMEM is testing extended memory...",
        "HIMEM: 16,384K of extended memory tested, OK",
        "C:\\> COMMAND.COM loaded",
      ]);
      setBootStage(1);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Stage 2
      setBootText((prev) => [
        ...prev,
        "C:\\> STARTUP.EXE /load",
        "Loading STARTUP BATTLE v3.7",
        "MOUSE.SYS driver loaded",
        "SOUND.SYS driver loaded",
        "Initializing VGA mode...",
      ]);
      setBootStage(2);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Stage 3
      setBootText((prev) => [
        ...prev,
        "Loading entrepreneur database...",
        "Indexing venture capital records...",
        "Startup data loaded: 10,562 records",
        "Memory allocation: OK",
        "Network status: ONLINE",
      ]);
      setBootStage(3);

      await new Promise((resolve) => setTimeout(resolve, 1200));

      // Final stage
      setBootText((prev) => [
        ...prev,
        "C:\\STARTUPBATTLE> EXEC MAIN.EXE",
        "Rendering interface...",
        "WELCOME TO STARTUP BATTLE",
        "PRESS ANY KEY TO CONTINUE",
      ]);
      setBootStage(4);

      await new Promise((resolve) => setTimeout(resolve, 800));

      // Make sure we set boot sequence complete
      setBootSequenceComplete(true);
      console.log("Boot sequence complete");

      // Force main content to render
      setTimeout(() => {
        setForceMainContentRender(true);
        console.log("Forcing main content render");
      }, 500);

      // Wait a moment then show the system ready icon in the corner
      setTimeout(() => {
        setShowSystemReadyIcon(true);
      }, 1000);
    };

    // Start the boot sequence
    bootSequence();

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);

    // Cleanup function
    return () => {
      if (audioElement) {
        audioElement.pause();
        audioElement.src = "";
      }
      // Clean up event listeners
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
      clearInterval(cursorInterval);
    };
  }, []);

  const toggleMusic = () => {
    if (audio) {
      if (isMusicPlaying) {
        audio.pause();
      } else {
        audio.play().catch((error) => {
          console.error("Audio playback failed:", error);
        });
      }
      setIsMusicPlaying(!isMusicPlaying);
    }
  };

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
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen bg-[#0A0118] text-white overflow-hidden"
    >
      {/* Enhanced Background Effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_-20%,#2C0855,#0A0118_50%)] opacity-70" />

      {/* CRT Monitor Frame */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[102%] h-[102%] bg-[#111] rounded-xl shadow-2xl">
          <div className="absolute inset-0 rounded-xl border-[20px] sm:border-[32px] border-[#111] shadow-inner bg-transparent overflow-hidden">
            {/* CRT screen bulge effect */}
            <div
              className="absolute inset-0 rounded-md shadow-inner bg-transparent pointer-events-none"
              style={{ boxShadow: "inset 0 0 100px 20px rgba(0,0,0,0.8)" }}
            ></div>

            {/* Power button */}
            <div className="absolute bottom-[-30px] right-12 z-20 hidden sm:block">
              <div
                className={`w-8 h-8 rounded-full bg-[#222] border-2 border-[#333] flex items-center justify-center`}
              >
                <div
                  className={`w-2 h-4 ${
                    screenOn ? "bg-green-500" : "bg-red-500"
                  } rounded-sm`}
                ></div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* CRT Turn on animation */}
      <AnimatePresence>
        {mounted && !bootSequenceComplete && !forceMainContentRender && (
          <motion.div
            className="absolute inset-0 bg-white z-40 pointer-events-none"
            initial={{ opacity: 1 }}
            animate={{
              opacity: 0,
              scaleY: [0.1, 1, 1],
              scaleX: [0.8, 1, 1],
            }}
            transition={{
              duration: 0.6,
              times: [0, 0.5, 1],
            }}
          />
        )}
      </AnimatePresence>

      {/* Animated Grid Background */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1a002a_1px,transparent_1px),linear-gradient(to_bottom,#1a002a_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)] opacity-20" />

      {/* CRT flicker */}
      {mounted && (
        <motion.div
          className="absolute inset-0 bg-white/5 crt-flicker"
          animate={{ opacity: [0.01, 0.02, 0.01, 0.03, 0.01] }}
          transition={{ duration: 0.2, repeat: Infinity }}
        />
      )}

      {/* CRT edge vignette */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "radial-gradient(circle at center, transparent 60%, rgba(0,0,0,0.6) 100%)",
        }}
      />

      {/* Glowing Orbs */}
      <motion.div
        animate={{
          opacity: [0.5, 0.7, 0.5],
        }}
        transition={{
          duration: 4,
          repeat: Infinity,
          repeatType: "reverse",
        }}
        className="absolute top-0 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-[128px] -z-10"
      />
      <motion.div
        animate={{
          opacity: [0.5, 0.8, 0.5],
        }}
        transition={{
          duration: 5,
          repeat: Infinity,
          repeatType: "reverse",
          delay: 1,
        }}
        className="absolute bottom-0 right-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-[128px] -z-10"
      />

      {/* System Ready Persistent Icon */}
      {showSystemReadyIcon && (
        <motion.div
          className="absolute top-4 right-4 z-30"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center bg-black/70 border border-green-500/70 px-3 py-1.5 rounded-sm backdrop-blur-sm shadow-lg shadow-green-500/20 system-ready-indicator">
            <div className="w-3 h-3 bg-green-500 rounded-full mr-2 animate-pulse shadow-glow shadow-green-500/70"></div>
            <span className="text-green-400 text-sm font-mono font-bold tracking-widest uppercase">
              System Ready
            </span>
          </div>
        </motion.div>
      )}

      {/* Boot Sequence Overlay */}
      <AnimatePresence>
        {mounted && !bootSequenceComplete && !forceMainContentRender && (
          <motion.div
            className="absolute inset-0 bg-black z-30 flex items-center justify-center terminal-text"
            initial={{ opacity: 1 }}
            exit={{
              opacity: 0,
              transition: { duration: 1, ease: "easeInOut" },
            }}
          >
            <motion.div className="text-center space-y-1 max-w-xl w-full px-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="text-3xl mb-4 terminal-title"
              >
                <pre className="text-green-500 text-xs sm:text-sm leading-tight font-mono">
                  {`
███████╗████████╗ █████╗ ██████╗ ████████╗██╗   ██╗██████╗     ██████╗  █████╗ ████████╗████████╗██╗     ███████╗
██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝██║   ██║██╔══██╗    ██╔══██╗██╔══██╗╚══██╔══╝╚══██╔══╝██║     ██╔════╝
███████╗   ██║   ███████║██████╔╝   ██║   ██║   ██║██████╔╝    ██████╔╝███████║   ██║      ██║   ██║     █████╗  
╚════██║   ██║   ██╔══██║██╔══██╗   ██║   ██║   ██║██╔═══╝     ██╔══██╗██╔══██║   ██║      ██║   ██║     ██╔══╝  
███████║   ██║   ██║  ██║██║  ██║   ██║   ╚██████╔╝██║         ██████╔╝██║  ██║   ██║      ██║   ███████╗███████╗
╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝         ╚═════╝ ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝╚══════╝
`}
                </pre>
                <div className="text-sm text-amber-400 mt-2 font-mono">
                  VERSION 3.7 - (C) STARTUP SYSTEMS 2024
                </div>
              </motion.div>

              <div className="font-mono text-amber-400 text-left p-3 border-amber-500/30 rounded bg-black/50 max-h-[350px] overflow-y-auto mb-4 boot-terminal">
                {bootText.map((line, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 5 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex"
                  >
                    {line.startsWith("C:") ? (
                      <span className="text-white mr-0">{line}</span>
                    ) : (
                      <>
                        <span className="text-amber-600 mr-2">&gt;</span>
                        <span>{line}</span>
                      </>
                    )}
                    {index === bootText.length - 1 && (
                      <span
                        className={`ml-1 ${
                          cursorVisible ? "opacity-100" : "opacity-0"
                        }`}
                      >
                        _
                      </span>
                    )}
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${bootStage * 25}%` }}
                className="h-4 bg-black border border-green-500 mx-auto max-w-md relative overflow-hidden"
              >
                <motion.div
                  className="absolute top-0 left-0 h-full bg-green-500/70"
                  style={{ width: `${bootStage * 25}%` }}
                />
                {/* DOS-style loading bar segments */}
                <div className="absolute inset-0 flex">
                  {Array.from({ length: 20 }).map((_, i) => (
                    <div
                      key={i}
                      className="h-full border-r border-black"
                      style={{ width: "5%" }}
                    />
                  ))}
                </div>
              </motion.div>

              {bootStage >= 4 && (
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: [0, 1.2, 1] }}
                  transition={{ duration: 0.5 }}
                  className="mt-6 flex flex-col items-center justify-center"
                >
                  <div
                    className="border-2 border-green-500/30 p-6 rounded bg-black/60 pixel-border cursor-pointer crt-screen"
                    onClick={() => setBootSequenceComplete(true)}
                  >
                    {/* Classic ASCII-style decoration */}
                    <div className="text-amber-500 text-xs font-mono mb-4 text-center">
                      ╔═════════════════════════════════════╗
                    </div>

                    <div className="text-amber-400 text-4xl font-bold flex items-center mb-4 system-ready-text">
                      <div className="w-4 h-4 bg-amber-500 rounded-full mr-4 animate-pulse"></div>
                      SYSTEM READY
                      <div className="w-4 h-4 bg-amber-500 rounded-full ml-4 animate-pulse"></div>
                    </div>

                    <motion.div
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ delay: 0.5 }}
                      className="mt-4"
                    >
                      <div className="terminal-text text-amber-400 text-sm flex items-center justify-center border border-amber-500/30 px-6 py-2 rounded bg-black/30">
                        <span>Press any key to continue</span>
                        <motion.span
                          animate={{ opacity: [0, 1, 0] }}
                          transition={{ duration: 1, repeat: Infinity }}
                          className="ml-1"
                        >
                          _
                        </motion.span>
                      </div>
                    </motion.div>

                    {/* Bottom ASCII-style decoration */}
                    <div className="text-amber-500 text-xs font-mono mt-4 text-center">
                      ╚═════════════════════════════════════╝
                    </div>
                  </div>
                </motion.div>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Content Container */}
      <div
        className={`container mx-auto px-4 py-6 md:py-8 relative z-20 ${
          bootSequenceComplete || forceMainContentRender
            ? "opacity-100"
            : "opacity-0"
        }`}
      >
        {/* Sound Toggle Button */}
        <motion.div
          className="absolute top-4 right-4 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="bg-blue-900/60 hover:bg-blue-800/80 p-3 rounded-md border border-blue-700/50 retro-button-hover"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={toggleMusic}
            aria-label={isMusicPlaying ? "Mute music" : "Play music"}
          >
            {isMusicPlaying ? (
              <Volume2 className="h-5 w-5 text-blue-200" />
            ) : (
              <VolumeX className="h-5 w-5 text-blue-200" />
            )}
          </motion.button>
        </motion.div>

        {/* DOS-Style Title Bar - New Addition */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900 text-white p-2 mb-4 rounded-t-md border border-blue-700 flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono">STARTBAT.EXE</span>
          </div>
          <div className="flex space-x-1">
            <button className="bg-gray-300 h-3 w-3 rounded-sm"></button>
            <button className="bg-gray-300 h-3 w-3 rounded-sm"></button>
            <button className="bg-gray-300 h-3 w-3 rounded-sm"></button>
          </div>
        </motion.div>

        {/* Main Action Buttons - Moved to top for immediate access */}
        <motion.div
          className="w-full max-w-4xl mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-900/50 border border-amber-500/30 rounded-md">
            {/* Main Buttons at Top */}
            <motion.button
              className="relative w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-md flex items-center justify-center gap-3 shadow-lg shadow-amber-700/20 overflow-hidden pixel-border border border-amber-500/50 retro-button-hover"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => router.push("/play")}
            >
              <div className="relative flex items-center gap-3">
                <Gamepad2 className="w-5 h-5" />
                <span className="font-bold tracking-wide terminal-text">
                  START GAME
                </span>
                <motion.div
                  animate={{ x: [0, 3, 0] }}
                  transition={{ duration: 1.5, repeat: Infinity }}
                >
                  <Rocket className="w-5 h-5" />
                </motion.div>
              </div>

              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                initial={{ opacity: 0, x: "-100%" }}
                whileHover={{ opacity: 1, x: "100%" }}
                transition={{ duration: 1.2 }}
              />
            </motion.button>

            {/* How to Play */}
            <motion.button
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/20 pixel-border retro-button-hover terminal-text"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <HelpCircle className="w-5 h-5" />
              <span className="font-mono tracking-wide">HOW TO PLAY</span>
            </motion.button>
          </div>
        </motion.div>

        <div className="flex flex-col items-center gap-4 md:gap-6">
          {/* Hero Section - REDESIGNED WITH MS-DOS THEME */}
          <div className="w-full max-w-4xl mx-auto">
            <div className="grid md:grid-cols-2 gap-4 items-start">
              {/* Left side: Title and Terminal */}
              <div className="text-center md:text-left p-4 bg-black border border-amber-500/30 rounded-md">
                {/* Main Title */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3"
                >
                  <div className="bg-blue-900 p-1 mb-2 border-b border-blue-700">
                    <span className="text-white text-xs font-mono">
                      STARTUP BATTLE v3.7
                    </span>
                  </div>
                  <motion.h1
                    className="text-4xl sm:text-5xl font-bold tracking-tight font-mono terminal-text text-amber-400 drop-shadow-2xl"
                    animate={{
                      textShadow: [
                        "0 0 5px rgba(245, 158, 11, 0.7)",
                        "0 0 15px rgba(245, 158, 11, 0.9)",
                        "0 0 5px rgba(245, 158, 11, 0.7)",
                      ],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    STARTUP BATTLE
                  </motion.h1>

                  <div className="relative h-1 w-full mx-auto my-3">
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-amber-500 to-transparent rounded"></div>
                    <motion.div
                      className="absolute inset-0 bg-white"
                      animate={{
                        x: ["-100%", "100%"],
                        opacity: [0, 0.5, 0],
                      }}
                      transition={{
                        duration: 2,
                        repeat: Infinity,
                        ease: "easeInOut",
                      }}
                    />
                  </div>

                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.2 }}
                    className="mt-2 text-sm md:text-base text-amber-300/90 font-mono terminal-text tracking-wider uppercase"
                  >
                    A Strategic Card Game of Innovation & Power
                  </motion.p>
                </motion.div>

                {/* MS-DOS Stats Display */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 font-mono text-xs text-amber-300/80 text-left border border-amber-500/20 p-2 bg-black/50 rounded-sm"
                >
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <div>CPU: 486DX/33MHz</div>
                    <div>RAM: 16,384K</div>
                    <div>VIDEO: VGA/SVGA</div>
                    <div>DISK: 520MB</div>
                  </div>
                </motion.div>
              </div>

              {/* Right side: Animated Boot/Startup Visual */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-4 bg-black border border-amber-500/30 rounded-md h-full"
              >
                <div className="bg-blue-900 p-1 mb-2 border-b border-blue-700">
                  <span className="text-white text-xs font-mono">
                    STARTUP SIMULATOR
                  </span>
                </div>

                {/* DOS-Style File System Animation */}
                <div className="text-amber-400 font-mono text-sm space-y-1">
                  {/* Animated directory listing */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.6 }}
                    className="space-y-1"
                  >
                    <div>C:\STARTUPBATTLE&gt; dir *.* /p</div>
                    <div className="pl-2 space-y-0.5 text-xs">
                      <div className="text-green-400">
                        STARTUP DAT 12,288 05-17-24 9:15a
                      </div>
                      <div className="text-green-400">
                        INNOV EXE 46,080 05-10-24 3:22p
                      </div>
                      <div className="text-green-400">
                        VC SYS 8,192 05-12-24 11:40a
                      </div>
                      <div className="text-green-400">
                        README TXT 1,024 05-01-24 8:30a
                      </div>
                      <div className="text-green-400">
                        HIGHSCR DAT 4,096 05-16-24 7:45p
                      </div>
                    </div>

                    <div className="flex items-center mt-2 animate-pulse">
                      <span className="w-2 h-4 bg-amber-400 mr-1"></span>
                      <span>C:\STARTUPBATTLE&gt;</span>
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>

          {/* Feature Cards - RESTYLED WITH DOS WINDOW LOOK */}
          <motion.div
            className="w-full max-w-4xl mt-2"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
          >
            <div className="bg-black border border-amber-500/30 rounded-md overflow-hidden">
              <div className="bg-blue-900 p-1 border-b border-blue-700">
                <span className="text-white text-xs font-mono">
                  GAME FEATURES
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-2 p-3">
                {[
                  {
                    title: "COLLECT CARDS",
                    description: "Build your ultimate startup portfolio",
                    icon: Library,
                    label: "COLLECT.EXE",
                    ascii: `
  ┌─────────┐
  │░░░░░░░░░│
  │░░░░░░░░░│
  │░░░░░░░░░│
  └─────────┘`,
                  },
                  {
                    title: "BATTLE OTHERS",
                    description: "Engage in strategic card battles",
                    icon: Gamepad2,
                    label: "BATTLE.EXE",
                    ascii: `
   ▄▄███▄▄
  █       █
  █ █   █ █
  █       █
   ▀▀▀▀▀▀▀`,
                  },
                  {
                    title: "CLIMB RANKS",
                    description: "Rise to the top of the leaderboard",
                    icon: Trophy,
                    label: "RANK.EXE",
                    ascii: `
     ▄▄▄
    █   █
  ▄█▀▀▀▀▀█▄
  █       █
   ▀▀▀▀▀▀▀`,
                  },
                ].map((feature, index) => (
                  <motion.div
                    key={index}
                    className="p-2 border border-amber-500/20 bg-black/80 rounded-sm hover:bg-black/60 transition-colors"
                    whileHover={{ scale: 1.02, y: -2 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs text-amber-300 font-mono">
                        {feature.label}
                      </span>
                      <div className="h-2 w-2 rounded-full bg-green-500 animate-pulse"></div>
                    </div>

                    <pre className="text-[9px] text-amber-400 opacity-60 mb-2 hidden sm:block font-mono leading-tight">
                      {feature.ascii}
                    </pre>

                    <div className="flex items-start space-x-2">
                      <div className="mt-1 p-1 rounded-full bg-blue-900/50">
                        <feature.icon className="h-4 w-4 text-amber-400" />
                      </div>
                      <div>
                        <h3 className="text-sm font-bold mb-1 text-amber-300 terminal-text tracking-wide">
                          {feature.title}
                        </h3>
                        <p className="text-xs text-amber-200/70 font-mono">
                          {feature.description}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Latest Updates - STYLED AS DOS BOX */}
          <motion.div
            className="w-full max-w-4xl"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
          >
            <div className="bg-black border border-amber-500/30 rounded-md overflow-hidden">
              <div className="bg-blue-900 p-1 border-b border-blue-700 flex items-center justify-between">
                <span className="text-white text-xs font-mono">
                  LATEST UPDATES
                </span>
                <Sparkles className="h-3 w-3 text-yellow-300" />
              </div>

              <div className="p-3 grid grid-cols-1 md:grid-cols-3 gap-2">
                {[
                  "New Startup Cards: Introducing 5 new unicorn startups!",
                  "Weekend Tournament: Compete for exclusive rewards",
                  "Balance Update: Adjusted valuation metrics for better gameplay",
                ].map((update, i) => (
                  <motion.div
                    key={i}
                    className="flex items-start gap-2 text-xs text-amber-200 font-mono p-1 border border-amber-500/10 rounded-sm"
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 + 0.8 }}
                  >
                    <div className="mt-0.5 h-2 w-2 rounded-full bg-amber-500 flex-shrink-0 animate-pulse" />
                    <span>{update}</span>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </motion.div>
  );
}
