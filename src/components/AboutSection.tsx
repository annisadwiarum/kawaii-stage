// File: components/AboutSection.tsx

"use client";

import { motion } from "framer-motion";

export default function AboutSection() {
  return (
    <section id="about" className="py-20 px-6 md:px-16 bg-zinc-900">
      <motion.div
        initial={{ opacity: 0, x: -30 }}
        whileInView={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="max-w-3xl mx-auto text-center"
      >
        <h2 className="text-3xl md:text-4xl font-semibold mb-4 text-indigo-400">
          Tentang Saya
        </h2>
        <p className="text-gray-300 text-md md:text-lg leading-relaxed">
          Gue adalah seorang <strong>Frontend Developer</strong> yang suka bikin
          antarmuka yang kece, ringan, dan responsif. Biasanya gue ngulik pake{" "}
          <span className="text-white font-medium">
            Next.js, TypeScript, Tailwind
          </span>
          , dan kalau perlu, gue juga bisa turun ke{" "}
          <span className="text-white font-medium">Node.js atau Laravel</span>.
        </p>
        <p className="text-gray-400 text-sm mt-4">
          Nggak cuma koding, gue juga peduli soal user experience dan detail
          animasi kecil yang bikin beda.
        </p>
      </motion.div>
    </section>
  );
}
