"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { Gamepad2, BrainCircuit, Type, Trophy, ChevronRight, Lock } from "lucide-react";

const games = [
  {
    id: "kana-speed-tap",
    title: "Kana Speed Tap",
    description: "Uji kecepatan jari dan hafalan Hiragana / Katakana-mu sebelum waktu habis!",
    icon: <Type className="w-8 h-8 text-white" />,
    gradient: "from-pink-500 to-rose-500",
    playable: true,
    xpReward: "Up to 50 XP",
  },
  {
    id: "emoji-phrase-match",
    title: "Emoji Phrase Match",
    description: "Tebak frasa bahasa Jepang yang tepat hanya dari petunjuk kombinasi emoji keren.",
    icon: <BrainCircuit className="w-8 h-8 text-white" />,
    gradient: "from-purple-500 to-indigo-500",
    playable: false,
    xpReward: "Up to 100 XP",
  },
];

export default function ArcadeHub() {
  return (
    <div className="min-h-screen pt-24 pb-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-16"
        >
          <div className="inline-flex items-center justify-center p-3 sm:p-4 bg-primary/10 rounded-full mb-6">
            <Gamepad2 className="w-8 h-8 sm:w-12 sm:h-12 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
            Mini Game <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-secondary">Arcade</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Tempat seru-seruan sambil santai. Kumpulkan Sakura Coins dan XP dengan bermain *mini games* harian untuk menaikan *rank*-mu di Leaderboard!
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {games.map((game, index) => (
            <motion.div
              key={game.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
            >
              <Link href={game.playable ? `/arcade/${game.id}` : "#"} className={`block h-full ${!game.playable ? 'cursor-not-allowed opacity-80' : ''}`}>
                <div className="relative h-full flex flex-col rounded-3xl border bg-card text-card-foreground shadow-sm hover:shadow-xl transition-all duration-300 overflow-hidden group">
                  <div className={`h-32 sm:h-40 w-full bg-gradient-to-br ${game.gradient} flex items-center justify-center relative overflow-hidden`}>
                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 p-4 opacity-20 transform translate-x-4 -translate-y-4 shadow-2xl rounded-full scale-150">
                      {game.icon}
                    </div>
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }} 
                      className="relative z-10 p-4 bg-white/20 backdrop-blur-md rounded-2xl shadow-lg ring-1 ring-white/30"
                    >
                      {game.icon}
                    </motion.div>
                  </div>
                  
                  <div className="p-6 sm:p-8 flex-1 flex flex-col">
                    <h3 className="text-2xl font-bold mb-2 group-hover:text-primary transition-colors flex items-center gap-2">
                      {game.title}
                      {!game.playable && <Lock className="w-4 h-4 text-muted-foreground shrink-0" />}
                    </h3>
                    <p className="text-muted-foreground flex-1 mb-6 text-sm sm:text-base">
                      {game.description}
                    </p>
                    
                    <div className="flex items-center justify-between mt-auto">
                      <div className="flex items-center gap-1.5 text-sm font-semibold text-amber-500 bg-amber-500/10 px-3 py-1.5 rounded-full">
                        <Trophy className="w-4 h-4" />
                        <span>{game.xpReward}</span>
                      </div>
                      <div className={`p-2 rounded-full flex items-center justify-center transition-colors ${game.playable ? 'bg-primary/10 text-primary group-hover:bg-primary group-hover:text-white' : 'bg-muted text-muted-foreground'}`}>
                        <ChevronRight className="w-5 h-5" />
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
