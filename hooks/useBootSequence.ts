import { useState, useEffect, useCallback } from "react";

// Define boot sequence stages as constants for better maintainability
const BOOT_TEXT_STAGE_1 = [
  "Starting MS-DOS...",
  "HIMEM is testing extended memory...",
  "HIMEM: 16,384K of extended memory tested, OK",
  "C:\\> COMMAND.COM loaded",
];

const BOOT_TEXT_STAGE_2 = [
  "C:\\> STARTUP.EXE /load",
  "Loading STARTUP BATTLE v3.7",
  "MOUSE.SYS driver loaded",
  "SOUND.SYS driver loaded",
  "Initializing VGA mode...",
];

const BOOT_TEXT_STAGE_3 = [
  "Loading entrepreneur database...",
  "Indexing venture capital records...",
  "Startup data loaded: 10,562 records",
  "Memory allocation: OK",
  "Network status: ONLINE",
];

const BOOT_TEXT_STAGE_4 = [
  "C:\\STARTUPBATTLE> EXEC MAIN.EXE",
  "Rendering interface...",
  "WELCOME TO STARTUP BATTLE",
  "PRESS ANY KEY TO CONTINUE",
];

/**
 * Interface for the return value of useBootSequence hook
 */
interface BootSequenceReturnType {
  bootSequenceComplete: boolean;
  bootStage: number;
  bootText: string[];
  cursorVisible: boolean;
  showSystemReadyIcon: boolean;
  screenOn: boolean;
  forceMainContentRender: boolean;
  completeBootSequence: () => void;
}

/**
 * Custom hook that manages the boot sequence animation
 * @returns Boot sequence state and control functions
 */
export function useBootSequence(): BootSequenceReturnType {
  const [bootSequenceComplete, setBootSequenceComplete] =
    useState<boolean>(false);
  const [bootStage, setBootStage] = useState<number>(0);
  const [bootText, setBootText] = useState<string[]>([]);
  const [cursorVisible, setCursorVisible] = useState<boolean>(true);
  const [showSystemReadyIcon, setShowSystemReadyIcon] =
    useState<boolean>(false);
  const [screenOn, setScreenOn] = useState<boolean>(false);
  const [forceMainContentRender, setForceMainContentRender] =
    useState<boolean>(false);

  /**
   * Manually complete the boot sequence animation
   */
  const completeBootSequence = useCallback((): void => {
    setBootSequenceComplete(true);
  }, []);

  useEffect(() => {
    // Store all timeouts and intervals for cleanup
    const timeoutIds: NodeJS.Timeout[] = [];
    const intervalIds: NodeJS.Timeout[] = [];

    // Helper function to create and track timeouts
    const createTimeout = (
      callback: () => void,
      delay: number
    ): NodeJS.Timeout => {
      const id = setTimeout(callback, delay);
      timeoutIds.push(id);
      return id;
    };

    // CRT screen on effect
    createTimeout(() => setScreenOn(true), 500);

    // Boot sequence animation
    const bootSequence = async (): Promise<void> => {
      try {
        // Stage 1
        setBootText(BOOT_TEXT_STAGE_1);
        setBootStage(1);
        await new Promise<void>((resolve) => {
          createTimeout(() => resolve(), 1200);
        });

        // Stage 2
        setBootText((prev) => [...prev, ...BOOT_TEXT_STAGE_2]);
        setBootStage(2);
        await new Promise<void>((resolve) => {
          createTimeout(() => resolve(), 1200);
        });

        // Stage 3
        setBootText((prev) => [...prev, ...BOOT_TEXT_STAGE_3]);
        setBootStage(3);
        await new Promise<void>((resolve) => {
          createTimeout(() => resolve(), 1200);
        });

        // Final stage
        setBootText((prev) => [...prev, ...BOOT_TEXT_STAGE_4]);
        setBootStage(4);
        await new Promise<void>((resolve) => {
          createTimeout(() => resolve(), 800);
        });

        // Check if already manually completed
        if (bootSequenceComplete) return;

        console.log("Boot sequence complete");
        setBootSequenceComplete(true); // Mark as complete

        // Force main content to render after a short delay
        createTimeout(() => {
          setForceMainContentRender(true);
          console.log("Forcing main content render");
        }, 500);

        // Wait a moment then show the system ready icon in the corner
        createTimeout(() => {
          setShowSystemReadyIcon(true);
        }, 1000);
      } catch (error) {
        console.error("Error in boot sequence:", error);
        // Fallback to force completion if something goes wrong
        setBootSequenceComplete(true);
        setForceMainContentRender(true);
      }
    };

    // Start the boot sequence only if not already complete
    if (!bootSequenceComplete) {
      bootSequence();
    }

    // Cursor blink effect
    const cursorInterval = setInterval(() => {
      setCursorVisible((prev) => !prev);
    }, 500);
    intervalIds.push(cursorInterval);

    // Cleanup function
    return () => {
      // Clear all timeouts
      timeoutIds.forEach(clearTimeout);
      // Clear all intervals
      intervalIds.forEach(clearInterval);
    };
  }, [bootSequenceComplete]); // Re-run effect only if bootSequenceComplete changes (e.g., manual skip)

  return {
    bootSequenceComplete,
    bootStage,
    bootText,
    cursorVisible,
    showSystemReadyIcon,
    screenOn,
    forceMainContentRender,
    completeBootSequence, // Expose the function to manually complete
  };
}
