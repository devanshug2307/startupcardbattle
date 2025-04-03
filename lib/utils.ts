import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPower(value: number): string {
  return `${value} PW`;
}

export function formatTimeToUnicorn(years: number | undefined): string {
  if (years === undefined || years === null) {
    return "---";
  }
  const wholeYears = Math.floor(years);
  const months = Math.round((years - wholeYears) * 12);
  return `${wholeYears}Y ${months}M`;
}

export function formatValuation(value: number): string {
  return `$${value.toFixed(1)}B`;
}

// Add sound effect utility
export function playSfx(soundName: string, volume: number = 1.0): void {
  // Only run on client side
  if (typeof window === "undefined") return;

  try {
    const audio = new Audio(`/sfx/${soundName}.mp3`);
    audio.volume = volume;

    // Some browsers require user interaction before playing audio
    const playPromise = audio.play();

    if (playPromise !== undefined) {
      playPromise.catch((error) => {
        // Auto-play was prevented, likely due to browser policy
        console.log("Audio playback prevented:", error);
      });
    }
  } catch (error) {
    console.error("Failed to play sound:", error);
  }
}
