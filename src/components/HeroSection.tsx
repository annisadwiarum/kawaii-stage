// File: components/HeroSection.tsx

"use client";

import { motion } from "framer-motion";

export default function HeroSection() {
  return (
    <section className="h-screen flex flex-col justify-center items-center text-center px-4">
      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="text-4xl md:text-6xl font-bold text-white"
      >
        Hello, I&apos;m <span className="text-indigo-400">Human</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5, duration: 1 }}
        className="mt-4 text-lg md:text-xl max-w-xl text-gray-300"
      >
        Frontend Developer yang suka bikin UI interaktif, smooth transition, dan desain yang nggak ngebosenin.
      </motion.p>

      <motion.a
        href="#projects"
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mt-8 inline-block bg-indigo-500 text-white px-6 py-3 rounded-full font-medium hover:bg-indigo-600 transition-colors"
      >
        Lihat Proyek Saya 🚀
      </motion.a>
    </section>
  );
}
