// File: components/AboutSection.tsx

"use client";

import { motion } from "framer-motion";
import { BookOpen, Mic2, Sparkles, Timer } from "lucide-react";

const modules = [
  {
    title: "Bite-Sized Lessons",
    description: "Micro lesson interaktif buat hiragana, katakana, dan kanji biar gampang nempel.",
    icon: BookOpen,
    gradient: "from-indigo-500 to-purple-500",
  },
  {
    title: "Daily Kawaii Challenge",
    description: "Tantangan 5 menit dengan video, audio, dan emoji cues yang bikin belajar berasa game.",
    icon: Sparkles,
    gradient: "from-pink-500 to-orange-500",
  },
  {
    title: "Real Talk Audio",
    description: "Latihan dialog asli dari anak Tokyo sampai Osaka, lengkap sama slang kekiniannya.",
    icon: Mic2,
    gradient: "from-sky-500 to-teal-500",
  },
  {
    title: "Hyper Focus Mode",
    description: "Timer, lo-fi beats, dan streak tracker biar kamu konsisten setiap hari.",
    icon: Timer,
    gradient: "from-rose-500 to-indigo-500",
  },
];

export default function AboutSection() {
  return (
    <section
      id="modules"
      className="bg-zinc-900 py-20 px-6 md:px-16"
    >
      <div className="mx-auto max-w-5xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-xs uppercase tracking-[0.3em] text-indigo-300/70">
            Learning Flow
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            Turun langsung ke bahasa Jepang tanpa pusing
          </h2>
          <p className="mt-3 text-base text-gray-300 md:text-lg">
            Semua lesson dikurasi biar kamu bisa nyelipin belajar di sela aktivitas. Tinggal pilih level, unlock combo, dan lanjut tanpa nunggu sensei.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {modules.map((module) => {
            const Icon = module.icon;
            return (
              <motion.div
                key={module.title}
                initial={{ opacity: 0, y: 24 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-80px" }}
                className="group rounded-2xl border border-white/5 bg-zinc-950/60 p-6 shadow-lg shadow-black/20 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className={`mb-5 inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br ${module.gradient}`}>
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-white">
                  {module.title}
                </h3>
                <p className="mt-2 text-sm text-gray-300">
                  {module.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
