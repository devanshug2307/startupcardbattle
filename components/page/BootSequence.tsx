import { motion, AnimatePresence } from "framer-motion";
import { FC, memo } from "react";

/**
 * Props for the BootSequence component
 */
interface BootSequenceProps {
  bootText: string[];
  bootStage: number;
  cursorVisible: boolean;
  onComplete: () => void;
}

/**
 * ASCII art logo component
 */
const AsciiLogo: FC = memo(() => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ delay: 0.2 }}
      className="text-3xl mb-4 terminal-title"
    >
      <pre className="text-green-500 text-xs sm:text-sm leading-tight font-mono">
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
      <div className="text-sm text-amber-400 mt-2 font-mono">
        VERSION 3.7 - (C) STARTUP SYSTEMS 2025
      </div>
    </motion.div>
  );
});

AsciiLogo.displayName = "AsciiLogo";

/**
 * Props for the BootTerminal component
 */
interface BootTerminalProps {
  bootText: string[];
  cursorVisible: boolean;
}

/**
 * Terminal display component showing boot text with animations
 */
const BootTerminal: FC<BootTerminalProps> = memo(
  ({ bootText, cursorVisible }) => {
    return (
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
    );
  }
);

BootTerminal.displayName = "BootTerminal";

/**
 * Props for the ProgressBar component
 */
interface ProgressBarProps {
  bootStage: number;
}

/**
 * DOS-style progress bar component
 */
const ProgressBar: FC<ProgressBarProps> = memo(({ bootStage }) => {
  const progressPercentage = bootStage * 25; // Each stage is 25%

  return (
    <motion.div
      initial={{ width: 0 }}
      animate={{ width: `${progressPercentage}%` }}
      className="h-4 bg-black border border-green-500 mx-auto max-w-md relative overflow-hidden"
    >
      <motion.div
        className="absolute top-0 left-0 h-full bg-green-500/70"
        style={{ width: `${progressPercentage}%` }}
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
  );
});

ProgressBar.displayName = "ProgressBar";

/**
 * Props for the SystemReadyPrompt component
 */
interface SystemReadyPromptProps {
  onComplete: () => void;
}

/**
 * Final system ready prompt with continue instruction
 */
const SystemReadyPrompt: FC<SystemReadyPromptProps> = memo(({ onComplete }) => {
  return (
    <motion.div
      initial={{ scale: 0 }}
      animate={{ scale: [0, 1.2, 1] }}
      transition={{ duration: 0.5 }}
      className="mt-6 flex flex-col items-center justify-center"
    >
      <div
        className="border-2 border-green-500/30 p-6 rounded bg-black/60 pixel-border cursor-pointer crt-screen"
        onClick={onComplete}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") {
            onComplete();
          }
        }}
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
  );
});

SystemReadyPrompt.displayName = "SystemReadyPrompt";

/**
 * Main BootSequence component that displays the retro boot animation
 */
export const BootSequence: FC<BootSequenceProps> = ({
  bootText,
  bootStage,
  cursorVisible,
  onComplete,
}: BootSequenceProps) => {
  return (
    <motion.div
      className="absolute inset-0 bg-black z-30 flex items-center justify-center terminal-text"
      initial={{ opacity: 1 }}
      exit={{
        opacity: 0,
        transition: { duration: 1, ease: "easeInOut" },
      }}
    >
      <motion.div className="text-center space-y-1 max-w-xl w-full px-4">
        <AsciiLogo />
        <BootTerminal bootText={bootText} cursorVisible={cursorVisible} />
        <ProgressBar bootStage={bootStage} />
        {bootStage >= 4 && <SystemReadyPrompt onComplete={onComplete} />}
      </motion.div>
    </motion.div>
  );
};
