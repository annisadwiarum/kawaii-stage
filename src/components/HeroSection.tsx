"use client";

import WelcomeModal from "@/components/WelcomeModal";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { motion } from "framer-motion";

const focusTags = ["Hiragana", "Katakana", "Kanji", "Writing", "Culture", "Slang"];

type Intent = "modules" | "games" | "writing";

export default function HeroSection() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [modalIntent, setModalIntent] = useState<Intent | null>(null);

  const isSessionLoading = status === "loading";

  const handleAdventure = (intent: Intent) => {
    if (isSessionLoading) return;
    if (status !== "authenticated") {
      router.push("/sign-in");
      return;
    }
    setModalIntent(intent);
  };

  const handleModalClose = () => {
    setModalIntent(null);
  };

  const handleModalConfirm = () => {
    if (!modalIntent) return;

    if (modalIntent === "modules") {
      router.push("/lessons");
      setModalIntent(null);
      return;
    }

    if (modalIntent === "writing") {
      router.push("/write");
      setModalIntent(null);
      return;
    }

    const sectionId = "games";
    const destination = document.getElementById(sectionId);
    if (destination) {
      destination.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    setModalIntent(null);
  };

  const modalContent = modalIntent
    ? modalIntent === "modules"
      ? {
          targetTitle: "Mau mulai modul pertama bareng Kawaii Stage?",
          targetDescription:
            "Kami siapin jalur 5 menit yang ringan dan playful. Yuk gas sebelum vibes-nya hilang!",
          confirmLabel: "Mulai petualangan",
        }
      : modalIntent === "games"
        ? {
            targetTitle: "Arcade neon lagi nunggu kamu buat duel kosakata!",
            targetDescription:
              "Kumpulin Sakura Coins, raih badge, dan bikin streak makin panjang sebelum teman lain nyusul.",
            confirmLabel: "Masuk ke arcade",
          }
        : {
            targetTitle: "Siap latihan stroke hiragana bareng pen neon?",
            targetDescription:
              "Tulis stroke sesuai urutan, dapatkan feedback akurasi, dan kumpulin XP bonus khusus penmanship.",
            confirmLabel: "Gas latihan nulis",
          }
    : null;

  return (
    <section className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden px-6 pb-24 pt-32 text-center md:px-12">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 1.2 }}
        className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_top,rgba(99,102,241,0.35),transparent_55%)]"
      />

      <motion.span
        initial={{ opacity: 0, y: -12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="relative mb-6 inline-flex items-center gap-3 rounded-full border border-indigo-400/40 bg-indigo-500/10 px-6 py-2 text-sm font-medium text-indigo-200 backdrop-blur"
      >
        <span className="h-2 w-2 rounded-full bg-pink-400" />
        <span>Kawaii Stage</span>
        <span className="text-white/70">Belajar Jepang yang seru &amp; kekinian</span>
      </motion.span>

      <motion.h1
        initial={{ opacity: 0, y: -40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1 }}
        className="relative text-4xl font-bold text-white sm:text-5xl md:text-6xl"
      >
        Learn Japanese the <span className="text-pink-400">Kawaii Way</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 1 }}
        className="relative mt-4 max-w-2xl text-pretty text-base text-gray-300 md:text-lg"
      >
        Nikmati mini-lesson, tantangan harian, dan komunitas yang heboh sambil ngumpulin badge &amp; slang Tokyo terbaru. Semua dibuat biar kamu makin pede ngomong Jepang di dunia nyata.
      </motion.p>

      <motion.div
        initial="hidden"
        animate="visible"
        variants={{
          hidden: { opacity: 0, y: 16 },
          visible: { opacity: 1, y: 0, transition: { delay: 0.8, staggerChildren: 0.08 } },
        }}
        className="relative mt-10 flex flex-wrap items-center justify-center gap-3"
      >
        {focusTags.map((tag) => (
          <motion.span
            key={tag}
            variants={{ hidden: { opacity: 0, y: 12 }, visible: { opacity: 1, y: 0 } }}
            className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-indigo-100"
          >
            {tag}
          </motion.span>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 1, duration: 0.6 }}
        className="relative mt-12 flex flex-wrap items-center justify-center gap-4"
      >
        <motion.button
          type="button"
          whileHover={{ scale: isSessionLoading ? 1 : 1.05 }}
          whileTap={{ scale: isSessionLoading ? 1 : 0.96 }}
          onClick={() => handleAdventure("modules")}
          disabled={isSessionLoading}
          className="rounded-full bg-pink-500 px-7 py-3 text-sm font-semibold text-white shadow-lg shadow-pink-500/30 transition-colors hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "authenticated" ? "Lanjut Belajar" : "Mulai Belajar Sekarang"}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: isSessionLoading ? 1 : 1.05 }}
          whileTap={{ scale: isSessionLoading ? 1 : 0.96 }}
          onClick={() => handleAdventure("games")}
          disabled={isSessionLoading}
          className="rounded-full border border-white/20 px-7 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "authenticated" ? "Masuk Arcade" : "Coba Mini Game"}
        </motion.button>
        <motion.button
          type="button"
          whileHover={{ scale: isSessionLoading ? 1 : 1.05 }}
          whileTap={{ scale: isSessionLoading ? 1 : 0.96 }}
          onClick={() => handleAdventure("writing")}
          disabled={isSessionLoading}
          className="rounded-full border border-pink-500/30 px-7 py-3 text-sm font-semibold text-pink-200 transition-colors hover:bg-pink-500/15 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "authenticated" ? "Latihan Menulis" : "Coba Nulis Kana"}
        </motion.button>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.2, duration: 0.6 }}
        className="relative mt-14 grid gap-6 text-left sm:grid-cols-3"
      >
        {[{
          title: "5 Menit / Lesson",
          desc: "Langsung praktik lewat prompts & audio.",
        },
        {
          title: "Daily Streak",
          desc: "Unlock badge dan drop slang terbaru.",
        },
        {
          title: "Live Community",
          desc: "Hangout bareng senpai tiap minggu.",
        }].map((item) => (
          <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-5">
            <p className="text-sm uppercase tracking-wide text-indigo-200/80">{item.title}</p>
            <p className="mt-2 text-sm text-gray-300">{item.desc}</p>
          </div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 1.4, duration: 0.6 }}
        className="relative mt-16 flex items-center gap-3 text-xs text-indigo-200/70"
      >
        <span className="h-2 w-2 animate-pulse rounded-full bg-pink-400" />
        Scroll buat lihat vibe selengkapnya
      </motion.div>
      {modalContent && (
        <WelcomeModal
          open={!!modalIntent}
          onClose={handleModalClose}
          onConfirm={handleModalConfirm}
          userName={session?.user?.name}
          targetTitle={modalContent.targetTitle}
          targetDescription={modalContent.targetDescription}
          confirmLabel={modalContent.confirmLabel}
        />
      )}
    </section>
  );
}
