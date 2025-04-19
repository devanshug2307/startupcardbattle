import { LucideIcon } from "lucide-react";

// Type moved from app/play/page.tsx
export type StartupCard = {
  name: string;
  category: string;
  founded: number;
  power: number;
  timeToUnicorn: number;
  valuation: number;
  icon?: string | LucideIcon;
  [key: string]: string | number | LucideIcon | undefined;
};

export function getDateSeed() {
  const now = new Date();
  return now.getFullYear() * 10000 + (now.getMonth() + 1) * 100 + now.getDate();
}

export function seededRandom(seed: number) {
  // Simple seedable random function
  let t = (seed += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
}

export function deterministicShuffle(array: any[], seed: number) {
  // Create a copy of the array to avoid modifying the original
  const result = [...array];
  let currentSeed = seed;

  // Fisher-Yates shuffle with seeded random
  for (let i = result.length - 1; i > 0; i--) {
    // Generate random index based on the seed
    currentSeed = Math.floor(seededRandom(currentSeed) * 1000000);
    const j = Math.floor(seededRandom(currentSeed) * (i + 1));
    // Swap elements
    [result[i], result[j]] = [result[j], result[i]];
  }

  return result;
}

export function getMaxValue(key: string): number {
  switch (key) {
    case "power":
      return 10; // Max power level
    case "founded":
      return 2025; // Current year
    case "timeToUnicorn":
      return 15; // Max years to unicorn
    case "valuation":
      return 200; // Max valuation in billions
    default:
      return 100;
  }
}

export const getBattleGuideText = (attribute: string) => {
  switch (attribute) {
    case "power":
      return "Higher power shows stronger market performance";
    case "founded":
      return "More recent founding year indicates newer technology";
    case "timeToUnicorn":
      return "Faster unicorn status shows rapid growth";
    case "valuation":
      return "Higher valuation indicates market dominance";
    default:
      return "Select an attribute to battle!";
  }
};

// Imported from lib/utils initially, keeping here for now
export const formatPower = (power: number | undefined): string => {
  if (power === undefined || power === null) return "--";
  return `${power} PW`;
};

export const formatTimeToUnicorn = (years: number | undefined): string => {
  if (years === undefined || years === null || years < 0) return "--";
  const y = Math.floor(years);
  const m = Math.round((years - y) * 12);
  return `${y}Y ${m}M`;
};

export const formatValuation = (valuation: number | undefined): string => {
  if (valuation === undefined || valuation === null) return "--";
  return `$${valuation.toFixed(1)}B`;
};

export const formatAttributeValue = (
  value: number | string | undefined | LucideIcon,
  attribute: string,
): string => {
  if (value === undefined || value === null || typeof value === 'object' || typeof value === 'function') {
    return "---";
  }

  switch (attribute) {
    case "power":
      return formatPower(Number(value));
    case "timeToUnicorn":
      return formatTimeToUnicorn(Number(value));
    case "valuation":
      return formatValuation(Number(value));
    case "founded":
      return value.toString();
    default:
      return value.toString();
  }
};

export const isLucideIcon = (value: unknown): value is LucideIcon => {
  return typeof value === 'function' || (typeof value === 'object' && value !== null && 'render' in value);
};

export const compareAttribute = (
  playerCard: StartupCard | undefined,
  aiCard: StartupCard | undefined,
  attribute: string,
): "win" | "lose" | "draw" | null => {
  if (!playerCard || !aiCard || !attribute) return null;

  const playerValue = playerCard[attribute];
  const aiValue = aiCard[attribute];

  if (typeof playerValue !== 'number' || typeof aiValue !== 'number') {
    console.warn(`Attempted to compare non-numeric values for attribute: ${attribute}, Player: ${typeof playerValue}, AI: ${typeof aiValue}`);
    return null;
  }

  let playerWins = false;
  let isDraw = false;

  switch (attribute) {
    case "timeToUnicorn":
    case "founded":
      playerWins = playerValue < aiValue;
      isDraw = playerValue === aiValue;
      break;
    default:
      playerWins = playerValue > aiValue;
      isDraw = playerValue === aiValue;
  }

  if (isDraw) return "draw";
  return playerWins ? "win" : "lose";
}; 