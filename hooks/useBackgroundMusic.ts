import { useState, useEffect, useCallback } from "react";

/**
 * Custom hook for background music management with auto-play handling
 * @param src The URL of the audio file to play
 * @param initialVolume Initial volume level (0.0 to 1.0)
 * @returns Object containing music state and toggle function
 */
export function useBackgroundMusic(src: string, initialVolume = 0.5) {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [isMusicPlaying, setIsMusicPlaying] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    try {
      const audioElement = new Audio(src);
      audioElement.loop = true;
      audioElement.volume = initialVolume;
      setAudio(audioElement);

      // Attempt initial play, setting state based on success/failure
      audioElement
        .play()
        .then(() => {
          setIsMusicPlaying(true);
          setError(null);
        })
        .catch((error: Error) => {
          // Most browsers block autoplay without user interaction
          console.log("Auto-play prevented:", error.message);
          setIsMusicPlaying(false);
          // Don't set this as an error state since it's expected behavior
        });

      // Cleanup function to pause and release audio resources
      return () => {
        audioElement.pause();
        audioElement.src = ""; // Release the src to free memory
        setAudio(null);
      };
    } catch (err) {
      setError(err instanceof Error ? err : new Error("Unknown audio error"));
      console.error("Error initializing audio:", err);
    }
  }, [src, initialVolume]); // Re-run if src or initialVolume changes

  // Add event listeners for user interaction to enable audio if initially blocked
  useEffect(() => {
    if (!audio) return;

    const enableAudio = () => {
      if (audio.paused) {
        audio
          .play()
          .then(() => {
            setIsMusicPlaying(true);
            setError(null);
          })
          .catch((e: Error) => {
            console.error("Play failed after interaction:", e.message);
            setError(e);
          });
      }
      // Remove listeners after first interaction
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
    };

    // Only add listeners if music isn't already playing (i.e., auto-play failed)
    if (!isMusicPlaying) {
      document.addEventListener("click", enableAudio);
      document.addEventListener("touchstart", enableAudio);
    }

    return () => {
      // Ensure listeners are removed on cleanup
      document.removeEventListener("click", enableAudio);
      document.removeEventListener("touchstart", enableAudio);
    };
  }, [audio, isMusicPlaying]); // Dependencies: audio element and playing state

  /**
   * Toggle music playback state
   */
  const toggleMusic = useCallback(() => {
    if (!audio) return;

    if (isMusicPlaying) {
      audio.pause();
      setIsMusicPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsMusicPlaying(true);
          setError(null);
        })
        .catch((error: Error) => {
          console.error("Audio playback failed on toggle:", error.message);
          setError(error);
          setIsMusicPlaying(false);
        });
    }
  }, [audio, isMusicPlaying]);

  return {
    isMusicPlaying,
    toggleMusic,
    error,
  };
}
