"use client";

import { motion } from "framer-motion";
import { FormEvent, useState } from "react";

export default function ContactSection() {
  const [email, setEmail] = useState("");
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!email.trim()) return;
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      className="relative overflow-hidden bg-gradient-to-b from-zinc-950 to-black py-20 px-6 md:px-16"
    >
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        viewport={{ once: true }}
        className="mx-auto flex max-w-4xl flex-col items-center rounded-3xl border border-white/10 bg-white/5 px-6 py-14 text-center shadow-2xl shadow-pink-500/10 backdrop-blur md:px-12"
      >
        <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/10 px-4 py-1 text-xs uppercase tracking-[0.35em] text-indigo-200/90">
          Next Drop
        </span>
        <h3 className="mt-6 text-3xl font-semibold text-white md:text-4xl">
          Gabung waitlist &amp; jadi beta tester pertama
        </h3>
        <p className="mt-4 max-w-xl text-sm text-gray-300 md:text-base">
          Dapatkan akses awal ke full arcade, kelas live bareng senpai, dan hadiah merch eksklusif begitu Kawaii Stage resmi launching.
        </p>

        <form
          onSubmit={handleSubmit}
          className="mt-8 flex w-full flex-col gap-3 sm:flex-row sm:items-center"
        >
          <label htmlFor="email" className="sr-only">
            Alamat email
          </label>
          <input
            id="email"
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email kamu yang aktif"
            className="w-full rounded-full border border-white/15 bg-black/30 px-5 py-3 text-sm text-white placeholder:text-white/50 focus:border-pink-400 focus:outline-none"
            required
          />
          <button
            type="submit"
            className="group inline-flex items-center justify-center rounded-full bg-pink-500 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-pink-400"
          >
            {submitted ? "Joined" : "Masuk Waitlist"}
          </button>
        </form>

        {submitted ? (
          <p className="mt-4 text-sm text-pink-200">
            Yay! Tunggu email spesial dari kami, dan siap-siap dapet undangan eksklusif.
          </p>
        ) : (
          <p className="mt-4 text-xs text-indigo-200/70">
            Kami anti spam. Kamu bisa cabut kapan aja.
          </p>
        )}
      </motion.div>
    </section>
  );
}