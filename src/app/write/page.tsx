"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { PenTool, ShieldCheck, Sparkles } from "lucide-react";
import { useSession } from "next-auth/react";
import WritingTrainer from "@/components/writing/WritingTrainer";
import { CharacterAccordion } from "@/components/writing/CharacterAccordion";
import { type WritingScript, writingCharacters } from "@/data/writingCharacters";
import { useWritingProgressOverview } from "@/hooks/useWritingPractice";

export default function WritingPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const { snapshot, totalAttempts, totalXp } = useWritingProgressOverview();

  const groupedCharacters = useMemo(() => {
    const groups: Record<WritingScript, typeof writingCharacters> = {
      hiragana: [],
      katakana: [],
      kanji: [],
    };
    for (const char of writingCharacters) {
      groups[char.script].push(char);
    }
    return groups;
  }, []);

  const [activeId, setActiveId] = useState(writingCharacters[0]?.id ?? "");

  useEffect(() => {
    const firstChar = Object.values(groupedCharacters).flat()[0];
    if (firstChar) {
      setActiveId(firstChar.id);
    }
  }, [groupedCharacters]);

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

  const activeCharacter = writingCharacters.find((character) => character.id === activeId);

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
        </header>

        <div className="grid gap-8 lg:grid-cols-[0.32fr_0.68fr]">
          <aside className="space-y-4">
            <div className="rounded-3xl border border-white/10 bg-zinc-900/60 p-5">
              <p className="text-xs uppercase tracking-[0.28em] text-indigo-300/80">Daftar karakter</p>
              <div className="mt-4">
                <CharacterAccordion
                  groupedCharacters={groupedCharacters}
                  activeId={activeId}
                  onSelect={setActiveId}
                  snapshot={snapshot}
                />
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

          <section className="sticky top-16">
            {activeCharacter ? <WritingTrainer character={activeCharacter} /> : null}
          </section>
        </div>
      </div>
    </main>
  );
}
