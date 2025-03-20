"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Gamepad2, Trophy, Library } from "lucide-react";
import { LogoCarousel } from "@/components/ui/logo-carousel";
import { GradientHeading } from "@/components/ui/gradient-heading";
import type { SVGProps } from "react";

// Add these SVG components for Indian startup logos
function PhonePeIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="#5F259F" {...props}>
      <path d="M12 0C5.373 0 0 5.373 0 12s5.373 12 12 12 12-5.373 12-12S18.627 0 12 0zm3.248 17.43H8.752c-.69 0-1.248-.558-1.248-1.247V7.816c0-.69.558-1.248 1.248-1.248h6.496c.69 0 1.248.558 1.248 1.248v8.367c0 .689-.559 1.247-1.248 1.247z" />
    </svg>
  );
}

function CREDIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg
      width="800"
      height="800"
      viewBox="0 0 192 192"
      xmlns="http://www.w3.org/2000/svg"
      fill="none"
      {...props}
    >
      <path
        d="M34 22v117l62 31 62-31V22H34z"
        style={{
          fill: "none",
          stroke: "#000000",
          strokeWidth: 12,
          strokeLinejoin: "round",
        }}
      />
      <path
        d="M110 69.686H58V127l38 19 38-19V88m0-12V46H52"
        style={{
          fill: "none",
          stroke: "#000000",
          strokeWidth: 12,
          strokeLinejoin: "round",
        }}
      />
      <path
        d="M82 88v27l14 7 14-7"
        style={{
          fill: "none",
          stroke: "#020000",
          strokeWidth: 12,
          strokeLinejoin: "round",
          strokeOpacity: 1,
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

// Update the startupLogos array with all icons
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
  const [isLoading, setIsLoading] = useState(true);
  const [selectedCard, setSelectedCard] = useState<number | null>(null);

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const cardVariants = {
    hover: {
      scale: 1.05,
      rotate: 2,
      transition: { duration: 0.2 },
    },
    tap: { scale: 0.95 },
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-background/90 to-muted/50 dark:from-background/80 dark:to-background">
      {/* Animated background pattern */}
      <div className="absolute inset-0 bg-grid-white/[0.02] bg-[size:50px_50px] [mask-image:radial-gradient(white,transparent_85%)]" />

      <AnimatePresence>
        {isLoading ? (
          <motion.div
            className="absolute inset-0 flex items-center justify-center"
            exit={{ opacity: 0, scale: 0.9 }}
          >
            <motion.div
              animate={{
                rotate: 360,
                scale: [1, 1.2, 1],
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                ease: "linear",
              }}
              className="relative"
            >
              <Sparkles className="w-16 h-16 text-primary" />
              <motion.div
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity }}
                className="absolute inset-0 text-primary/50"
              >
                <Sparkles className="w-16 h-16" />
              </motion.div>
            </motion.div>
          </motion.div>
        ) : (
          <div className="container relative mx-auto px-4 py-16">
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="flex flex-col items-center gap-12"
            >
              {/* Hero Section */}
              <motion.div
                className="text-center space-y-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
              >
                <h1 className="text-4xl sm:text-6xl font-bold tracking-tighter bg-gradient-to-r from-primary to-primary-foreground bg-clip-text text-transparent">
                  Unicorn Battle
                </h1>
                <p className="text-xl text-muted-foreground">
                  India's Premier Startup Card Game
                </p>
              </motion.div>

              {/* Card Preview */}
              <motion.div
                className="relative w-full max-w-3xl aspect-[16/9] rounded-lg overflow-hidden"
                whileHover={{ scale: 1.02 }}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-primary/20 to-primary-foreground/20 backdrop-blur-sm" />
                <div className="absolute inset-0 grid grid-cols-2 md:grid-cols-4 gap-4 p-6">
                  {startupLogos.slice(0, 4).map((logo, index) => (
                    <motion.div
                      key={logo.id}
                      variants={cardVariants}
                      whileHover="hover"
                      whileTap="tap"
                      className="bg-card rounded-lg p-4 flex items-center justify-center shadow-lg"
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.1 }}
                    >
                      <logo.img className="w-12 h-12" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>

              {/* Action Buttons */}
              <motion.div
                className="grid gap-4 w-full max-w-md"
                variants={containerVariants}
              >
                <motion.div variants={cardVariants}>
                  <Button
                    className="w-full py-6 text-lg bg-primary hover:bg-primary/90 text-primary-foreground"
                    onClick={() => router.push("/play")}
                  >
                    <Gamepad2 className="mr-2 h-5 w-5" />
                    Start Battle
                  </Button>
                </motion.div>

                <motion.div variants={cardVariants}>
                  <Button
                    className="w-full py-6 text-lg bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                    onClick={() => router.push("/collection")}
                  >
                    <Library className="mr-2 h-5 w-5" />
                    My Collection
                  </Button>
                </motion.div>

                <motion.div variants={cardVariants}>
                  <Button
                    className="w-full py-6 text-lg bg-accent hover:bg-accent/90 text-accent-foreground"
                    onClick={() => router.push("/leaderboard")}
                  >
                    <Trophy className="mr-2 h-5 w-5" />
                    Leaderboard
                  </Button>
                </motion.div>
              </motion.div>

              {/* Logo Carousel */}
              <motion.div
                className="w-full"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.8 }}
              >
                <LogoCarousel columnCount={3} logos={startupLogos} />
              </motion.div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
