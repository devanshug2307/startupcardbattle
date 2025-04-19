"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { HowToPlay } from "@/components/page/HowToPlay";
import { BootSequence } from "@/components/page/BootSequence";
import { MainContent } from "@/components/page/MainContent";
import { useCRTEffects } from "@/hooks/useCRTEffects";
import { useBackgroundMusic } from "@/hooks/useBackgroundMusic";
import { useBootSequence } from "@/hooks/useBootSequence";

export default function Home() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [scanlineEffect, setScanlineEffect] = useState(true);
  const [showHowToPlay, setShowHowToPlay] = useState(false);

  useCRTEffects();
  const { isMusicPlaying, toggleMusic } = useBackgroundMusic(
    "/music/background-music.mp3",
  );
  const {
    bootSequenceComplete,
    bootStage,
    bootText,
    cursorVisible,
    showSystemReadyIcon,
    screenOn,
    forceMainContentRender,
    completeBootSequence,
  } = useBootSequence();

  useEffect(() => {
    setMounted(true);
  }, []);

  // Add a key event listener for ESC key to close How To Play modal
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && showHowToPlay) {
        setShowHowToPlay(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, [showHowToPlay]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="relative min-h-screen bg-[#0A0118] text-white overflow-hidden"
    >
      {/* How To Play Modal */}
      <HowToPlay
        isOpen={showHowToPlay}
        onClose={() => setShowHowToPlay(false)}
      />

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
          <BootSequence
            bootText={bootText}
            bootStage={bootStage}
            cursorVisible={cursorVisible}
            onComplete={completeBootSequence}
          />
        )}
      </AnimatePresence>

      {/* Conditional Rendering for Main Content */}
      {(bootSequenceComplete || forceMainContentRender) && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative z-10"
        >
          <MainContent
            router={router}
            isMusicPlaying={isMusicPlaying}
            toggleMusic={toggleMusic}
            scanlineEffect={scanlineEffect}
            setScanlineEffect={setScanlineEffect}
            setShowHowToPlay={setShowHowToPlay}
          />
        </motion.div>
      )}
    </motion.div>
  );
}
