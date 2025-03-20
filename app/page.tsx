"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { motion } from "framer-motion"
import { Sparkles } from "lucide-react"

export default function Home() {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Simulate loading assets
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 1500)

    return () => clearTimeout(timer)
  }, [])

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-b from-purple-900 to-indigo-900 p-4 text-white">
      {isLoading ? (
        <div className="flex flex-col items-center justify-center">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 2, repeat: Number.POSITIVE_INFINITY, ease: "linear" }}
            className="w-16 h-16 mb-4"
          >
            <Sparkles className="w-16 h-16 text-yellow-400" />
          </motion.div>
          <h2 className="text-xl font-bold">Loading...</h2>
        </div>
      ) : (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex flex-col items-center justify-center w-full max-w-md"
        >
          <motion.h1
            className="text-4xl font-bold mb-2 text-center"
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5 }}
          >
            Unicorn Battle
          </motion.h1>
          <motion.div
            initial={{ scale: 0.9 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-xl text-yellow-300 mb-8 text-center"
          >
            India's Startup Card Game
          </motion.div>

          <motion.div
            className="relative w-full h-64 mb-8 overflow-hidden rounded-lg shadow-lg"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-purple-600 opacity-80"></div>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="grid grid-cols-2 gap-2">
                {["Cred", "Zerodha", "Zoho", "Zomato"].map((name, index) => (
                  <motion.div
                    key={name}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 + index * 0.1 }}
                    className="w-24 h-32 bg-white rounded-md shadow-md flex items-center justify-center text-black font-bold"
                  >
                    {name}
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <div className="space-y-4 w-full">
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <Button
                className="w-full py-6 text-lg bg-gradient-to-r from-yellow-500 to-orange-500 hover:from-yellow-600 hover:to-orange-600 text-white font-bold rounded-lg shadow-lg"
                onClick={() => router.push("/play")}
              >
                Start Battle
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.6 }}
            >
              <Button
                className="w-full py-6 text-lg bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white font-bold rounded-lg shadow-lg"
                onClick={() => router.push("/collection")}
              >
                My Collection
              </Button>
            </motion.div>

            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
            >
              <Button
                className="w-full py-6 text-lg bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 text-white font-bold rounded-lg shadow-lg"
                onClick={() => router.push("/leaderboard")}
              >
                Leaderboard
              </Button>
            </motion.div>
          </div>

          <motion.p
            className="mt-8 text-sm text-gray-300 text-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            Collect cards, build your deck, and battle to become India's top startup mogul!
          </motion.p>
        </motion.div>
      )}
    </div>
  )
}

