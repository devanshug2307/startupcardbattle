import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRevenue(value: number): string {
  return `${value} PW`;
}

export function formatTimeToUnicorn(years: number): string {
  const wholeYears = Math.floor(years);
  const months = Math.round((years - wholeYears) * 12);
  return `${wholeYears}Y ${months}M`;
}

export function formatValuation(value: number): string {
  return `$${value.toFixed(1)}B`;
}
