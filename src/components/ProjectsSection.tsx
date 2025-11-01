"use client";

import WelcomeModal from "@/components/WelcomeModal";
import { lessons } from "@/data/lessons";
import { useOverallLessonProgress } from "@/hooks/useLessonProgress";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { useEffect, useMemo, useState } from "react";
import {
  Compass,
  Flame,
  Headphones,
  Sparkles,
  Trophy,
} from "lucide-react";

const highlights = [
  {
    title: "Curated Roadmap",
    description:
      "Ikuti jalur 30 hari yang ngeblend dasar, conversation, dan budaya pop biar skill kamu balance.",
    icon: Compass,
  },
  {
    title: "Native Audio Drops",
    description:
      "Latihan listening dari native speaker dengan playback lambat, filter aksen, dan cheat sheet romaji.",
    icon: Headphones,
  },
  {
    title: "Culture Capsules",
    description:
      "Belajar etika, festival, dan meme Jepang terbaru supaya obrolan kamu tetap relevan sama gen-z sana.",
    icon: Sparkles,
  },
];

const phrases = [
  {
    kana: "いただきます！",
    romaji: "itadakimasu!",
    meaning: "Selamat makan!",
    context: "Dipakai sebelum mulai makan bareng temen atau keluarga.",
  },
  {
    kana: "やばい、天気良すぎ！",
    romaji: "yabai, tenki yosugi!",
    meaning: "Gila, cuacanya bagus banget!",
    context: "Ekspresi casual kalau ketemu cuaca cerah pas mau hangout.",
  },
  {
    kana: "推しが尊い…",
    romaji: "oshi ga toutoi…",
    meaning: "Bias-ku terlalu berharga…",
    context: "Ungkapan wibu kekinian pas lagi fangirling atau fanguying artis favorit.",
  },
];

const games = [
  {
    title: "Kana Speed Tap",
    description: "Refleksin hiragana & katakana dengan countdown dan kombo warna neon.",
    difficulty: "Starter",
  },
  {
    title: "Emoji Phrase Match",
    description: "Cocokin emoji clue sama frasa Jepang biar kosakata makin nempel.",
    difficulty: "Casual",
  },
  {
    title: "Culture Trivia Rush",
    description: "Trivia kilat tentang festival, street food, dan anime trends tiap minggunya.",
    difficulty: "Challenge",
  },
];

export default function ProjectsSection() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activePhrase, setActivePhrase] = useState(0);
  const [selectedGameTitle, setSelectedGameTitle] = useState<string | null>(null);
  const [isArcadeModalOpen, setIsArcadeModalOpen] = useState(false);
  const [hasHydrated, setHasHydrated] = useState(false);
  const { progressMap, writingXp } = useOverallLessonProgress();

  const isSessionLoading = status === "loading";

  const lessonSummary = useMemo(() => {
    if (!hasHydrated) {
      return {
        streakBest: 0,
        badgeCount: 0,
        weeklyXp: 0,
      };
    }

    const totalCompleted = lessons.reduce((acc, lesson) => {
      const progress = progressMap[lesson.id];
      if (!progress) return acc;
      return progress.completedStepIds.length >= lesson.steps.length ? acc + 1 : acc;
    }, 0);

    const lessonXp = lessons.reduce((acc, lesson) => {
      const progress = progressMap[lesson.id];
      if (!progress) return acc;
      if (progress.completedStepIds.length >= lesson.steps.length) {
        return acc + lesson.xpReward;
      }
      return acc;
    }, 0);

    const totalXp = lessonXp + Math.round(writingXp ?? 0);
    const streakApprox = Math.max(totalCompleted * 3, totalXp > 0 ? 3 : 0);

    return {
      streakBest: streakApprox,
      badgeCount: totalCompleted,
      weeklyXp: totalXp,
    };
  }, [hasHydrated, progressMap, writingXp]);

  const openArcadeGate = (gameTitle?: string) => {
    if (isSessionLoading) return;
    if (status !== "authenticated") {
      router.push("/sign-in");
      return;
    }

    setSelectedGameTitle(gameTitle ?? null);
    setIsArcadeModalOpen(true);
  };

  const closeArcadeGate = () => {
    setIsArcadeModalOpen(false);
    setSelectedGameTitle(null);
  };

  const confirmArcadeGate = () => {
    const arcadeSection = document.getElementById("games");
    if (arcadeSection) {
      arcadeSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }

    closeArcadeGate();
  };

  useEffect(() => {
    setHasHydrated(true);
  }, []);

  useEffect(() => {
    const timer = window.setInterval(() => {
      setActivePhrase((prev) => (prev + 1) % phrases.length);
    }, 4200);

    return () => window.clearInterval(timer);
  }, []);

  const phrase = phrases[activePhrase];

  return (
    <section id="projects" className="bg-zinc-950 py-20 px-6 md:px-16">
      <div className="mx-auto max-w-6xl">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="text-center"
        >
          <span className="text-xs uppercase tracking-[0.28em] text-indigo-300/70">
            Your Daily Move
          </span>
          <h2 className="mt-4 text-3xl font-semibold text-white md:text-4xl">
            Bangun kebiasaan, unlock budaya, dan siap ngobrol
          </h2>
          <p className="mt-3 text-base text-gray-300 md:text-lg">
            Jadwalkan belajar kamu kayak playlist favorit: ringan, konsisten, dan selalu ada kejutan baru.
          </p>
        </motion.div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {highlights.map((highlight) => {
            const Icon = highlight.icon;
            return (
              <motion.div
                key={highlight.title}
                initial={{ opacity: 0, y: 22 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6 }}
                viewport={{ once: true, margin: "-80px" }}
                className="rounded-2xl border border-white/5 bg-gradient-to-b from-white/5 to-transparent p-6 backdrop-blur"
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-pink-500/20 text-pink-300">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="mt-4 text-lg font-semibold text-white">
                  {highlight.title}
                </h3>
                <p className="mt-2 text-sm text-gray-300">
                  {highlight.description}
                </p>
              </motion.div>
            );
          })}
        </div>

        <div className="mt-16 grid gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-60px" }}
            className="flex flex-col justify-between rounded-3xl border border-white/10 bg-zinc-900/70 p-7"
          >
            <div>
              <div className="flex items-center gap-3 text-sm text-indigo-200">
                <Flame className="h-4 w-4 text-pink-400" />
                Today&apos;s Phrase
              </div>
              <p className="mt-4 text-3xl font-semibold text-white">
                {phrase.kana}
              </p>
              <p className="mt-2 text-lg text-pink-300">{phrase.romaji}</p>
              <p className="mt-3 text-base text-gray-200">{phrase.meaning}</p>
              <p className="mt-2 text-sm text-gray-400">{phrase.context}</p>
            </div>

            <div className="mt-6 flex items-center justify-between gap-3">
              <div className="flex gap-2">
                {phrases.map((_, index) => (
                  <button
                    key={`phrase-${index}`}
                    type="button"
                    aria-label={`Pilih frasa ${index + 1}`}
                    onClick={() => setActivePhrase(index)}
                    className={`h-2.5 w-8 rounded-full transition-all ${
                      index === activePhrase
                        ? "bg-pink-400"
                        : "bg-white/15 hover:bg-white/25"
                    }`}
                  />
                ))}
              </div>
              <span className="text-xs uppercase tracking-[0.3em] text-indigo-200/80">
                Auto rotate
              </span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 24 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true, margin: "-60px" }}
            className="rounded-3xl border border-white/10 bg-gradient-to-b from-pink-500/20 via-zinc-900/60 to-zinc-900/30 p-7"
          >
            <div className="flex items-center gap-2 text-sm text-indigo-200">
              <Trophy className="h-4 w-4 text-pink-300" />
              Progress Sneak Peek
            </div>
            <p className="mt-4 text-lg font-semibold text-white">
              Sistem poin &amp; badge biar belajar makin nagih
            </p>
            <div className="mt-6 space-y-5">
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-indigo-200/70">Streak Best</p>
                  <p className="mt-1 text-sm text-gray-300">hari berturut-turut</p>
                </div>
                <p className="text-2xl font-semibold text-white">{lessonSummary.streakBest}</p>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-indigo-200/70">Badge Sakura</p>
                  <p className="mt-1 text-sm text-gray-300">lesson mastered</p>
                </div>
                <p className="text-2xl font-semibold text-white">{lessonSummary.badgeCount}</p>
              </div>
              <div className="flex items-center justify-between rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
                <div>
                  <p className="text-xs uppercase tracking-wider text-indigo-200/70">XP Mingguan</p>
                  <p className="mt-1 text-sm text-gray-300">dari micro lessons</p>
                </div>
                <p className="text-2xl font-semibold text-white">{lessonSummary.weeklyXp}</p>
              </div>
            </div>
            <p className="mt-6 text-xs text-indigo-200/70">
              Nantinya leaderboard &amp; event komunitas bakal drop tiap akhir minggu.
            </p>
          </motion.div>
        </div>

        <motion.div
          id="games"
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true, margin: "-40px" }}
          className="mt-20"
        >
          <div className="flex flex-col items-center gap-3 text-center">
            <span className="text-xs uppercase tracking-[0.32em] text-indigo-300/70">
              Mini Game Arcade
            </span>
            <h3 className="text-3xl font-semibold text-white md:text-4xl">
              Latihan berasa main, XP langsung nge-up
            </h3>
            <p className="max-w-2xl text-sm text-gray-300 md:text-base">
              Pilih game favorit kamu, kumpulin Sakura Coins, dan unlock akses ke stage baru di halaman games penuh.
            </p>
          </div>

          <div className="mt-12 grid gap-6 md:grid-cols-3">
            {games.map((game) => (
              <div
                key={game.title}
                className="group relative overflow-hidden rounded-2xl border border-white/10 bg-zinc-900/70 p-6 transition-transform duration-300 hover:-translate-y-1"
              >
                <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-pink-400 via-indigo-400 to-sky-400 opacity-70" />
                <div className="flex items-center justify-between text-xs uppercase tracking-wider text-indigo-200/70">
                  <span>{game.difficulty}</span>
                  <span>Preview</span>
                </div>
                <h4 className="mt-4 text-xl font-semibold text-white">
                  {game.title}
                </h4>
                <p className="mt-3 text-sm text-gray-300">{game.description}</p>
                <button
                  type="button"
                  disabled={isSessionLoading}
                  onClick={() => openArcadeGate(game.title)}
                  className="mt-6 flex items-center gap-2 text-sm font-semibold text-pink-300 transition-colors group-hover:text-pink-200 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  {status === "authenticated" ? "Gas main" : "Lihat Demo"}
                  <span className="text-lg leading-none">→</span>
                </button>
              </div>
            ))}
          </div>
          <div className="mt-10 flex flex-col items-center gap-4 text-sm text-indigo-200/70 md:flex-row md:justify-center">
            <span>Kumpulkan Sakura Coins buat akses full arcade.</span>
            <button
              type="button"
              disabled={isSessionLoading}
              onClick={() => openArcadeGate()}
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-5 py-2 text-white transition-colors hover:bg-white/10 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {status === "authenticated" ? "Buka halaman Games →" : "Masuk ke halaman Games →"}
            </button>
          </div>
        </motion.div>
      </div>

      {isArcadeModalOpen && (
        <WelcomeModal
          open={isArcadeModalOpen}
          onClose={closeArcadeGate}
          onConfirm={confirmArcadeGate}
          userName={session?.user?.name}
          targetTitle={
            selectedGameTitle
              ? `Siap ngegas ${selectedGameTitle}?`
              : "Arcade neon lagi nunggu petualanganmu!"
          }
          targetDescription={
            selectedGameTitle
              ? "Santai aja, progress kamu bakal ke-save dan leaderboard bakal kebuka buat kamu doang."
              : "Kumpulin Sakura Coins, unlock badge, dan nantikan update full arcade versi beta di minggu depan."
          }
          confirmLabel={selectedGameTitle ? "Gas ke arcade" : "Masuk ke arcade"}
        />
      )}
    </section>
  );
}
