"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PenTool, ShieldCheck, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import WritingTrainer from "@/components/writing/WritingTrainer";
import { type WritingScript, writingCharacters } from "@/data/writingCharacters";
import { useWritingProgressOverview } from "@/hooks/useWritingPractice";

type ScriptFilter = "all" | WritingScript;

const scriptFilters: { value: ScriptFilter; label: string }[] = [
  { value: "all", label: "Semua" },
  { value: "hiragana", label: "Hiragana" },
  { value: "katakana", label: "Katakana" },
  { value: "kanji", label: "Kanji" },
];

export default function WritingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [filter, setFilter] = useState<ScriptFilter>("all");
  const { snapshot, totalAttempts, totalXp } = useWritingProgressOverview();

  const filteredCharacters = useMemo(() => {
    if (filter === "all") return writingCharacters;
    return writingCharacters.filter((character) => character.script === filter);
  }, [filter]);

  const [activeId, setActiveId] = useState(filteredCharacters[0]?.id ?? "");

  useEffect(() => {
    if (filteredCharacters.length > 0) {
      setActiveId(filteredCharacters[0].id);
    }
  }, [filteredCharacters]);

  useEffect(() => {
    if (status === "unauthenticated") {
      const redirect = encodeURIComponent("/write");
      router.replace(`/sign-in?redirect=${redirect}`);
    }
  }, [router, status]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm text-indigo-100/80">Preparing writing dojo...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const activeCharacter = filteredCharacters.find((character) => character.id === activeId);

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-indigo-950 px-6 py-16 text-white">
      <div className="mx-auto flex max-w-6xl flex-col gap-12">
        <header className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-zinc-900/60 p-8">
          <div className="flex flex-wrap items-center justify-between gap-6">
            <motion.div
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="flex items-center gap-3 rounded-full border border-pink-500/30 bg-pink-500/15 px-4 py-2 text-sm text-pink-200"
            >
              <PenTool className="h-4 w-4" />
              Neon Stroke Lab
            </motion.div>
            <div className="flex flex-wrap items-center gap-4 text-xs uppercase tracking-[0.28em] text-indigo-200/70">
              <span>Attempts {totalAttempts}</span>
              <span>XP {totalXp}</span>
            </div>
          </div>
          <div className="space-y-3">
            <h1 className="text-3xl font-semibold">Latihan Menulis Kana & Kanji</h1>
            <p className="max-w-3xl text-sm text-indigo-100/80">
              Ikuti garis bantu, tulis stroke sesuai urutan, dan kumpulkan XP tambahan di luar modul.
              Setiap sesi bakal ngukur akurasi garis kamu dan simpan best score.
            </p>
            <div className="flex flex-wrap items-center gap-2 text-xs text-indigo-200/70">
              <ShieldCheck className="h-4 w-4 text-pink-400" />
              <span>Progress tersimpan otomatis · Bonus XP dihitung dari akurasi</span>
            </div>
          </div>
          <div className="flex flex-wrap gap-3">
            {scriptFilters.map((option) => {
              const isActive = option.value === filter;
              return (
                <button
                  key={option.value}
                  type="button"
                  onClick={() => setFilter(option.value)}
                  className={`rounded-full border px-4 py-2 text-sm transition ${
                    isActive
                      ? "border-pink-400 bg-pink-500/20 text-pink-100"
                      : "border-white/10 bg-white/5 text-indigo-100 hover:bg-white/10"
                  }`}
                >
                  {option.label}
                </button>
              );
            })}
          </div>
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.32fr_0.68fr]">
          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-indigo-300/80">Daftar karakter</p>
              <div className="mt-4 flex flex-col gap-2">
                {filteredCharacters.map((character) => {
                  const progress = snapshot[character.id];
                  const isActive = character.id === activeId;
                  return (
                    <button
                      key={character.id}
                      type="button"
                      onClick={() => setActiveId(character.id)}
                      className={`flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition ${
                        isActive
                          ? "border-pink-400/60 bg-pink-500/20 text-white"
                          : "border-white/10 bg-black/40 text-indigo-100 hover:border-pink-400/40 hover:text-white"
                      }`}
                    >
                      <div>
                        <p className="text-lg font-semibold">{character.glyph}</p>
                        <p className="text-xs uppercase tracking-wide text-indigo-200/70">
                          {character.script} · {character.romaji}
                        </p>
                      </div>
                      <div className="text-right text-xs text-indigo-200/70">
                        <p>Best {progress ? Math.round((progress.bestAccuracy ?? 0) * 100) : 0}%</p>
                        <p>XP {progress ? progress.totalXp : 0}</p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5 text-sm text-indigo-100/80">
              <div className="flex items-center gap-2 text-xs uppercase tracking-[0.28em] text-indigo-300/80">
                <Sparkles className="h-4 w-4 text-pink-300" />
                Tips cepat
              </div>
              <ul className="mt-3 space-y-2 list-disc pl-5">
                <li>Pastikan stroke dimulai dari arah yang sama seperti outline neon.</li>
                <li>Tahan tekanan dan kecepatan, garis halus lebih akurat.</li>
                <li>Gunakan tombol replay buat lihat animasi stroke ulang.</li>
              </ul>
              <p className="mt-3 text-xs text-indigo-200/60">
                Butuh refresh kana dasar? Balik ke halaman
                <Link href="/lessons" className="text-pink-300 hover:text-pink-200">
                  {" "}
                  modules
                </Link>
                .
              </p>
            </div>
          </aside>

          <section>
            {activeCharacter ? <WritingTrainer character={activeCharacter} /> : null}
          </section>
        </div>
      </div>
    </main>
  );
}
