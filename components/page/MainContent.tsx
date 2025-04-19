import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
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

interface MainContentProps {
  router: ReturnType<typeof useRouter>;
  isMusicPlaying: boolean;
  toggleMusic: () => void;
  scanlineEffect: boolean;
  setScanlineEffect: (value: boolean) => void;
  setShowHowToPlay: (value: boolean) => void;
}

export function MainContent({
  router,
  isMusicPlaying,
  toggleMusic,
  scanlineEffect,
  setScanlineEffect,
  setShowHowToPlay,
}: MainContentProps) {
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
    <div className="container mx-auto px-4 py-6 md:py-8 relative z-20">
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
            C:\\STARTBAT.EXE
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
            onClick={() => setShowHowToPlay(true)}
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
 ██████╗  █████╗ ████████╗████████╗██╗     ███████╗
 ██╔══██╗██╔══██╗╚══██╔══╝╚══██╔══╝██║     ██╔════╝
 ██████╔╝███████║   ██║      ██║   ██║     █████╗  
 ██╔══██╗██╔══██║   ██║      ██║   ██║     ██╔══╝  
 ██████╔╝██║  ██║   ██║      ██║   ███████╗███████╗
 ╚═════╝ ╚═╝  ╚═╝   ╚═╝      ╚═╝   ╚══════╝╚══════╝`}
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
                    C:\\STARTUPBATTLE&gt;{" "}
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
                    <div className="text-white text-xs">312,864 bytes free</div>
                  </div>

                  <div>
                    C:\\STARTUPBATTLE&gt;{" "}
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
                    <div className="text-green-400 mt-1"></div>
                  </div>

                  <div className="flex items-center mt-2">
                    <div>C:\\STARTUPBATTLE&gt;</div>
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
  );
}
