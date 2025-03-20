import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import {
  PhonePeIcon,
  CREDIcon,
  MeeshoIcon,
  SwiggyIcon,
  ZerodhaIcon,
  RazorpayIcon,
} from "@/components/ui/startup-icons";
import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";

export function OrbitingCirclesDemo() {
  return (
    <div className="relative flex h-[400px] sm:h-[500px] w-full flex-col items-center justify-center overflow-hidden rounded-xl border border-gray-800 bg-gradient-to-br from-gray-900/90 via-gray-900/70 to-gray-800/80 backdrop-blur-md shadow-2xl">
      {/* Animated background effects */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,#ffffff08_1px,transparent_1px)] bg-[size:16px_16px] opacity-50" />
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-blue-500/10"
        animate={{
          opacity: [0.3, 0.15, 0.3],
          scale: [1, 1.02, 1],
        }}
        transition={{ duration: 3, repeat: Infinity }}
      />

      <div className="relative h-full w-full">
        {/* Center Container with Gradient Ring */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 z-20">
          {/* Animated gradient ring */}
          <motion.div
            className="absolute -inset-1 rounded-full bg-gradient-to-r from-purple-500/30 via-pink-500/30 to-blue-500/30 blur-md"
            animate={{
              rotate: 360,
              scale: [1, 1.05, 1],
            }}
            transition={{
              rotate: { duration: 10, repeat: Infinity, ease: "linear" },
              scale: { duration: 2, repeat: Infinity, ease: "easeInOut" },
            }}
          />

          {/* Center content */}
          <div className="relative w-[100px] h-[100px] sm:w-[140px] sm:h-[140px] rounded-full bg-gray-900/95 backdrop-blur-xl border border-gray-700/50 flex items-center justify-center overflow-hidden">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8 }}
              className="relative text-center p-4"
            >
              <h2 className="text-base sm:text-lg font-bold bg-gradient-to-br from-purple-300 via-pink-400 to-blue-400 bg-clip-text text-transparent">
                Unicorns
              </h2>
              <p className="text-[10px] sm:text-xs text-gray-400 mt-1">
                India's Rising Stars
              </p>

              {/* Decorative elements */}
              <motion.div
                className="absolute inset-0"
                animate={{
                  opacity: [0.5, 0.3, 0.5],
                }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                <Sparkles className="absolute -top-1 right-0 h-3 w-3 text-purple-400/50" />
                <Sparkles className="absolute bottom-0 -left-1 h-3 w-3 text-blue-400/50" />
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Inner Circle - 3 Startups */}
        {[
          { Icon: PhonePeIcon, color: "purple", delay: 0 },
          { Icon: CREDIcon, color: "pink", delay: -8.33 },
          { Icon: MeeshoIcon, color: "blue", delay: -16.66 },
        ].map(({ Icon, color, delay }, index) => (
          <OrbitingCircles
            key={index}
            className="size-10 sm:size-12"
            duration={25}
            delay={delay}
            radius={120}
            path={true}
          >
            <motion.div
              whileHover={{ scale: 1.15 }}
              className={`rounded-full bg-gray-800/90 p-2.5 backdrop-blur-sm border border-${color}-500/20 shadow-lg shadow-${color}-500/10 transition-all duration-300 hover:border-${color}-500/40 hover:bg-gray-800/95`}
            >
              <Icon className="h-6 w-6 sm:h-7 sm:w-7" />
            </motion.div>
          </OrbitingCircles>
        ))}

        {/* Outer Circle - 3 Startups */}
        {[
          { Icon: SwiggyIcon, color: "orange", delay: 0 },
          { Icon: ZerodhaIcon, color: "blue", delay: -11.66 },
          { Icon: RazorpayIcon, color: "cyan", delay: -23.33 },
        ].map(({ Icon, color, delay }, index) => (
          <OrbitingCircles
            key={index}
            className="size-12 sm:size-14"
            radius={200}
            duration={35}
            delay={delay}
            reverse
            path={true}
          >
            <motion.div
              whileHover={{ scale: 1.15 }}
              className={`rounded-full bg-gray-800/90 p-3 backdrop-blur-sm border border-${color}-500/20 shadow-lg shadow-${color}-500/10 transition-all duration-300 hover:border-${color}-500/40 hover:bg-gray-800/95`}
            >
              <Icon className="h-7 w-7 sm:h-8 sm:w-8" />
            </motion.div>
          </OrbitingCircles>
        ))}

        {/* Orbit paths with glowing effect */}
        <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
          <motion.div
            className="w-[400px] h-[400px] sm:w-[440px] sm:h-[440px] rounded-full border border-gray-700/30 blur-[0.5px]"
            animate={{
              opacity: [0.2, 0.3, 0.2],
              scale: [1, 1.01, 1],
            }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.div
            className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[240px] h-[240px] sm:w-[280px] sm:h-[280px] rounded-full border border-gray-700/20 blur-[0.5px]"
            animate={{
              opacity: [0.15, 0.25, 0.15],
              scale: [1, 1.02, 1],
            }}
            transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
          />
        </div>
      </div>
    </div>
  );
}
