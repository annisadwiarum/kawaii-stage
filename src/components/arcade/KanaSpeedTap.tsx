"use client";

import { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { basicKanaList, KanaData } from "@/data/kana";
import { Play, RotateCcw, Trophy, Timer, Zap, XCircle } from "lucide-react";

const GAME_DURATION = 60; // 60 seconds
const OPTIONS_COUNT = 4; // 4 choices per question

export default function KanaSpeedTap() {
  const [gameState, setGameState] = useState<"idle" | "playing" | "gameover">("idle");
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);
  const [score, setScore] = useState(0);
  const [combos, setCombos] = useState(0);
  
  // Question state
  const [targetKana, setTargetKana] = useState<KanaData | null>(null);
  const [options, setOptions] = useState<KanaData[]>([]);
  
  // Feedback state
  const [feedback, setFeedback] = useState<"correct" | "incorrect" | null>(null);

  const generateQuestion = useCallback(() => {
    // Pick a random target
    const targetIdx = Math.floor(Math.random() * basicKanaList.length);
    const target = basicKanaList[targetIdx];
    
    // Pick 3 other wrong options
    const wrongOptions: KanaData[] = [];
    while (wrongOptions.length < OPTIONS_COUNT - 1) {
      const idx = Math.floor(Math.random() * basicKanaList.length);
      const wrong = basicKanaList[idx];
      // Ensure it's not the target and not already in wrongOptions
      if (wrong.romaji !== target.romaji && !wrongOptions.includes(wrong)) {
        wrongOptions.push(wrong);
      }
    }
    
    // Combine and shuffle
    const allOptions = [target, ...wrongOptions];
    const shuffled = allOptions.sort(() => Math.random() - 0.5);
    
    setTargetKana(target);
    setOptions(shuffled);
    setFeedback(null);
  }, []);

  const startGame = () => {
    setScore(0);
    setCombos(0);
    setTimeLeft(GAME_DURATION);
    setGameState("playing");
    generateQuestion();
  };

  const handleOptionClick = (selected: KanaData) => {
    if (gameState !== "playing" || !targetKana) return;
    
    if (selected.romaji === targetKana.romaji) {
      // Correct!
      setFeedback("correct");
      setScore(prev => prev + 10 + (combos * 2)); // Bonus for combos
      setCombos(prev => prev + 1);
      
      // small delay to show feedback flash, then next question
      setTimeout(() => {
        generateQuestion();
      }, 150);
    } else {
      // Incorrect!
      setFeedback("incorrect");
      setCombos(0);
      setTimeLeft(prev => Math.max(0, prev - 2)); // 2 second penalty
      
      // Just clear error state after a bit but remain on same question
      setTimeout(() => {
        setFeedback(null);
      }, 400);
    }
  };

  // Timer Effect
  useEffect(() => {
    let timer: number;
    if (gameState === "playing" && timeLeft > 0) {
      timer = window.setInterval(() => {
        setTimeLeft(prev => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && gameState === "playing") {
      setGameState("gameover");
    }
    return () => window.clearInterval(timer);
  }, [gameState, timeLeft]);

  // Convert game score to real XP based on some scaling logic
  const calculateXpReward = () => {
    return Math.floor(score / 5);
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-card border rounded-3xl shadow-xl overflow-hidden relative min-h-[500px] flex flex-col">
      
      {/* HEADER BAR */}
      <div className="bg-muted/50 p-4 border-b flex items-center justify-between">
        <div className="flex items-center gap-2 font-mono text-xl font-bold">
          <Timer className={`w-5 h-5 ${timeLeft <= 10 && gameState === "playing" ? 'text-red-500 animate-pulse' : 'text-primary'}`} />
          <span className={timeLeft <= 10 && gameState === "playing" ? 'text-red-500' : ''}>
            00:{timeLeft.toString().padStart(2, '0')}
          </span>
        </div>
        <div className="flex items-center gap-4">
           {combos > 2 && (
             <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }} className="flex items-center text-amber-500 text-sm font-bold bg-amber-500/10 px-2 py-1 rounded-md">
               <Zap className="w-4 h-4 mr-1" /> {combos}x Combo!
             </motion.div>
           )}
          <div className="text-xl font-bold flex items-center gap-2">
            Score: <span className="text-primary">{score}</span>
          </div>
        </div>
      </div>

      {/* GAME AREA */}
      <div className={`flex-1 p-6 flex flex-col relative transition-colors duration-200 
        ${feedback === 'correct' ? 'bg-green-500/10' : ''} 
        ${feedback === 'incorrect' ? 'bg-red-500/10' : ''}
      `}>
        
        {gameState === "idle" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-background/80 backdrop-blur-sm">
            <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
              <Zap className="w-10 h-10 text-primary" />
            </div>
            <h2 className="text-3xl font-extrabold mb-2">Kana Speed Tap</h2>
            <p className="text-muted-foreground mb-8 max-w-sm">
              Tap the correct Japanese character that matches the Romaji. You have 60 seconds. Fast combos give bonus points!
            </p>
            <button
              onClick={startGame}
              className="bg-primary text-primary-foreground hover:bg-primary/90 px-8 py-4 rounded-full font-bold text-lg inline-flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
            >
              <Play className="w-5 h-5" /> Start Game
            </button>
          </div>
        )}

        {gameState === "gameover" && (
          <div className="absolute inset-0 flex flex-col items-center justify-center p-6 text-center z-10 bg-background/95 backdrop-blur-md">
            <motion.div initial={{ scale: 0.8, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} className="flex flex-col items-center">
              <div className="w-24 h-24 bg-amber-500/20 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-12 h-12 text-amber-500" />
              </div>
              <h2 className="text-4xl font-extrabold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-amber-400 to-amber-600">
                Time's Up!
              </h2>
              <div className="text-6xl font-black text-primary my-6">{score}</div>
              <p className="text-xl text-muted-foreground mb-8">
                You earned <span className="font-bold text-amber-500">+{calculateXpReward()} XP</span>
              </p>
              
              <div className="flex gap-4">
                <button
                  onClick={startGame}
                  className="bg-primary text-primary-foreground hover:bg-primary/90 px-6 py-3 rounded-xl font-bold flex items-center gap-2 transition-transform hover:scale-105 active:scale-95"
                >
                  <RotateCcw className="w-5 h-5" /> Play Again
                </button>
              </div>
            </motion.div>
          </div>
        )}

        <AnimatePresence mode="popLayout">
          {gameState === "playing" && targetKana && (
            <motion.div 
              key={`question-${targetKana.kana}-${score}`}
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 1.1, opacity: 0 }}
              transition={{ duration: 0.15 }}
              className="flex-1 flex flex-col items-center justify-center"
            >
              {/* Target Romaji Box */}
              <div className="mb-10 text-center">
                <span className="text-sm font-bold tracking-widest uppercase text-muted-foreground mb-2 block">Find this:</span>
                <div className={`text-8xl md:text-9xl font-black tracking-tighter ${feedback === 'incorrect' ? 'text-red-500' : 'text-foreground'}`}>
                  {targetKana.romaji}
                </div>
              </div>

              {/* Grid Options */}
              <div className="grid grid-cols-2 gap-4 w-full max-w-md">
                 {options.map((opt, i) => (
                   <button
                     key={i}
                     onClick={() => handleOptionClick(opt)}
                     className="bg-background hover:bg-accent border-2 hover:border-primary text-4xl md:text-5xl font-bold p-6 md:p-8 rounded-2xl shadow-sm transition-all focus:outline-none focus:ring-4 focus:ring-primary/20 active:scale-95"
                   >
                     {opt.kana}
                   </button>
                 ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

    </div>
  );
}
