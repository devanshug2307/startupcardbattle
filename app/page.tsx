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
  const [scanlineEffect, setScanlineEffect] = useState(true);

  useEffect(() => {
    // Add global CSS for CRT effects
    const style = document.createElement("style");
    style.innerHTML = `
      @keyframes flicker {
        0% { opacity: 0.97; }
        5% { opacity: 0.95; }
        10% { opacity: 0.97; }
        15% { opacity: 0.94; }
        20% { opacity: 0.98; }
        25% { opacity: 0.95; }
        30% { opacity: 0.97; }
        35% { opacity: 0.96; }
        40% { opacity: 0.99; }
        45% { opacity: 0.97; }
        50% { opacity: 0.99; }
        55% { opacity: 0.95; }
        60% { opacity: 0.98; }
        65% { opacity: 0.97; }
        70% { opacity: 0.95; }
        75% { opacity: 0.97; }
        80% { opacity: 0.96; }
        85% { opacity: 0.98; }
        90% { opacity: 0.97; }
        95% { opacity: 0.95; }
        100% { opacity: 0.98; }
      }

      .crt-flicker {
        animation: flicker 0.15s infinite;
      }
      
      body {
        overflow-x: hidden;
      }
      
      .scanlines {
        position: absolute;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        background: linear-gradient(
          to bottom,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.02) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        background-size: 100% 2px;
        z-index: 999;
        pointer-events: none;
        opacity: 0.3;
      }
      
      .crt-corners:before {
        content: "";
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        border-radius: 12px;
        box-shadow: inset 0 0 100px 40px rgba(0,0,0,0.9);
        z-index: 10;
        pointer-events: none;
      }
      
      .retro-text {
        text-shadow: 2px 2px 0px rgba(0,0,0,0.8);
        letter-spacing: 1px;
      }
      
      .retro-button-hover {
        transition: all 0.2s ease;
        box-shadow: 0 0 0px rgba(255,255,255,0);
      }
      
      .retro-button-hover:hover {
        box-shadow: 0 0 10px rgba(255,255,255,0.5);
      }
    `;
    document.head.appendChild(style);

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

      {/* CRT Monitor Frame with enhanced retro effects */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0">
        <div className="w-[102%] h-[102%] bg-[#111] rounded-xl shadow-2xl">
          <div className="absolute inset-0 rounded-xl border-[20px] sm:border-[32px] border-[#111] shadow-inner bg-transparent overflow-hidden crt-corners">
            {/* CRT screen bulge effect */}
            <div
              className="absolute inset-0 rounded-md shadow-inner bg-transparent pointer-events-none"
              style={{ boxShadow: "inset 0 0 100px 20px rgba(0,0,0,0.8)" }}
            ></div>

            {/* Static noise overlay */}
            <div
              className="absolute inset-0 opacity-[0.03] pointer-events-none z-10 mix-blend-overlay"
              style={{
                backgroundImage:
                  "url('data:image/png;base64,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')",
              }}
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

      {/* Scanlines overlay */}
      {scanlineEffect && <div className="scanlines"></div>}

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
                  VERSION 3.7 - (C) STARTUP SYSTEMS 2025
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

        {/* DOS-Style Title Bar - Enhanced */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-blue-900 text-white p-2 mb-4 rounded-t-md border-2 border-blue-700 flex items-center justify-between"
        >
          <div className="flex items-center space-x-2">
            <span className="text-sm font-mono tracking-wider">
              C:\STARTBAT.EXE
            </span>
            <span className="text-xs bg-black/30 px-1 rounded">[VER 3.7]</span>
          </div>
          <div className="flex space-x-1">
            <button className="bg-gray-300 h-3 w-3 rounded-sm border border-gray-400"></button>
            <button className="bg-gray-300 h-3 w-3 rounded-sm border border-gray-400"></button>
            <button className="bg-gray-300 h-3 w-3 rounded-sm border border-gray-400"></button>
          </div>
        </motion.div>

        {/* Scanline Toggle - New */}
        <motion.div
          className="absolute top-4 left-4 z-20"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
        >
          <motion.button
            className="bg-blue-900/60 hover:bg-blue-800/80 p-2 rounded-md border border-blue-700/50 retro-button-hover text-xs font-mono"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            onClick={() => setScanlineEffect(!scanlineEffect)}
          >
            {scanlineEffect ? "CRT: ON" : "CRT: OFF"}
          </motion.button>
        </motion.div>

        {/* Main Action Buttons - Restyled for more retro look */}
        <motion.div
          className="w-full max-w-4xl mx-auto mb-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-900/50 border-2 border-amber-500/30 rounded-md">
            {/* Main Buttons at Top */}
            <motion.button
              className="relative w-full bg-amber-600 hover:bg-amber-700 text-white py-3 px-6 rounded-md flex items-center justify-center gap-3 shadow-lg shadow-amber-700/20 overflow-hidden border-2 border-amber-500/50 retro-button-hover"
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

            {/* How to Play - Enhanced */}
            <motion.button
              className="w-full bg-blue-800 hover:bg-blue-900 text-white py-3 px-6 rounded-md flex items-center justify-center gap-2 transition-all duration-300 shadow-lg shadow-blue-500/20 border-2 border-blue-700/50 retro-button-hover terminal-text"
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
              <div className="text-center md:text-left p-4 bg-black border-2 border-amber-500/30 rounded-md">
                {/* Main Title */}
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-3"
                >
                  <div className="bg-blue-900 p-1 mb-2 border-b-2 border-blue-700 flex items-center justify-between">
                    <span className="text-white text-xs font-mono">
                      STARTUP BATTLE v3.7
                    </span>
                    <span className="text-white text-xs font-mono">
                      [1994-2025]
                    </span>
                  </div>
                </motion.div>

                {/* Enhanced Pixel Art Title with tagline below it */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 0.3 }}
                  className="my-3 font-mono text-amber-400 leading-tight flex flex-col items-center"
                >
                  <pre
                    className="text-[8px] sm:text-[10px] md:text-[12px] font-bold overflow-hidden text-center"
                    style={{
                      color: "#FFB700",
                      textShadow: "0 2px 4px rgba(0,0,0,0.8)",
                    }}
                  >
                    {`
███████╗████████╗ █████╗ ██████╗ ████████╗██╗   ██╗██████╗ 
██╔════╝╚══██╔══╝██╔══██╗██╔══██╗╚══██╔══╝██║   ██║██╔══██╗
███████╗   ██║   ███████║██████╔╝   ██║   ██║   ██║██████╔╝
╚════██║   ██║   ██╔══██║██╔══██╗   ██║   ██║   ██║██╔═══╝ 
███████║   ██║   ██║  ██║██║  ██║   ██║   ╚██████╔╝██║     
╚══════╝   ╚═╝   ╚═╝  ╚═╝╚═╝  ╚═╝   ╚═╝    ╚═════╝ ╚═╝     
███████╗  █████╗ ████████╗████████╗██╗     ███████╗
██╔══██╗ ██╔══██╗╚══██╔══╝╚══██╔══╝██║     ██╔════╝
██████╔╝ ███████║   ██║      ██║   ██║     █████╗  
██╔══██╗ ██╔══██║   ██║      ██║   ██║     ██╔══╝  
██████╔╝ ██║  ██║   ██║      ██║   ███████╗███████╗
╚═════╝  ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝╚══════╝`}
                  </pre>

                  {/* Tagline moved here, after the ASCII art, bright green color */}
                  <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.4 }}
                    className="mt-4 text-xs sm:text-sm md:text-base text-[#00FF00] font-mono tracking-wider uppercase text-center"
                  >
                    A Strategic Card Game of Innovation & Power
                  </motion.p>
                </motion.div>

                {/* MS-DOS Stats Display - Enhanced */}
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.5 }}
                  className="mt-4 font-mono text-xs text-amber-300/80 text-left border-2 border-amber-500/20 p-2 bg-black/50 rounded-sm"
                >
                  <div className="grid grid-cols-2 gap-x-2 gap-y-1">
                    <div className="flex items-center">
                      <Cpu className="h-3 w-3 mr-1 text-amber-500" />
                      CPU: 486DX/33MHz
                    </div>
                    <div className="flex items-center">
                      <Server className="h-3 w-3 mr-1 text-amber-500" />
                      RAM: 16,384K
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-3 w-3 mr-1 text-amber-500" />
                      VIDEO: VGA/SVGA
                    </div>
                    <div className="flex items-center">
                      <Database className="h-3 w-3 mr-1 text-amber-500" />
                      DISK: 520MB
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right side: Animated Boot/Startup Visual - Enhanced */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.4 }}
                className="p-4 bg-black border-2 border-amber-500/30 rounded-md h-full"
              >
                <div className="bg-blue-900 p-1 mb-2 border-b-2 border-blue-700 flex items-center justify-between">
                  <span className="text-white text-xs font-mono tracking-wider">
                    STARTUP SIMULATOR
                  </span>
                  <Command className="h-3 w-3 text-blue-200" />
                </div>

                {/* DOS-Style File System Animation - Enhanced */}
                <div className="text-amber-400 font-mono text-sm space-y-1">
                  {/* MS-DOS Style prompt with blinking cursor */}
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    transition={{ delay: 0.5 }}
                    className="flex flex-col space-y-2"
                  >
                    <div className="flex flex-col space-y-1 mb-2">
                      <div className="text-green-400 text-xs">
                        Microsoft(R) MS-DOS(R) Version 6.22
                      </div>
                      <div className="text-green-400 text-xs">
                        (C)Copyright Microsoft Corp 1981-1994.
                      </div>
                    </div>

                    <div>
                      C:\STARTUPBATTLE&gt;{" "}
                      <span className="text-white">dir /w</span>
                    </div>
                    <div className="pl-2 space-y-0.5 text-xs">
                      <div className="flex flex-wrap gap-x-4 gap-y-1 text-green-400">
                        <span>STARTUP.DAT</span>
                        <span>INNOV.EXE</span>
                        <span>VC.SYS</span>
                        <span>README.TXT</span>
                        <span>HIGHSCR.DAT</span>
                        <span>BATTLE.EXE</span>
                        <span>CONFIG.SYS</span>
                      </div>
                      <div className="text-white text-xs mt-1">
                        7 file(s) 82,944 bytes
                      </div>
                      <div className="text-white text-xs">
                        312,864 bytes free
                      </div>
                    </div>

                    <div>
                      C:\STARTUPBATTLE&gt;{" "}
                      <span className="text-white">type README.TXT</span>
                    </div>
                    <div className="pl-2 space-y-0.5 text-xs">
                      <div className="text-green-400">
                        Welcome to Startup Battle v3.7
                      </div>
                      <div className="text-green-400">
                        Build your deck. Battle opponents.
                      </div>
                      <div className="text-green-400">
                        Become the ultimate entrepreneur.
                      </div>
                      <div className="text-green-400 mt-1">
                        Type BATTLE.EXE to begin...
                      </div>
                    </div>

                    <div className="flex items-center mt-2">
                      <div>C:\STARTUPBATTLE&gt;</div>
                      <motion.span
                        animate={{ opacity: [1, 0, 1] }}
                        transition={{ duration: 1, repeat: Infinity }}
                        className="w-2 h-4 bg-amber-400 ml-1"
                      ></motion.span>
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
