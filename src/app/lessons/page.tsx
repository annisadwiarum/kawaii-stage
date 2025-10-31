"use client";

import { LessonNavigation } from "@/components/lessons/LessonNavigation";
import { LessonPlayer } from "@/components/lessons/LessonPlayer";
import { lessons } from "@/data/lessons";
import { useOverallLessonProgress } from "@/hooks/useLessonProgress";
import { useSession } from "next-auth/react";
import { useRouter, useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState } from "react";

const getFirstAvailableLesson = (
  progressMap: ReturnType<typeof useOverallLessonProgress>["progressMap"]
) => {
  const sorted = lessons.slice();
  for (const lesson of sorted) {
    const prereqs = lesson.prerequisites ?? [];
    const unmet = prereqs.some((id) => {
      const progress = progressMap[id];
      if (!progress) return true;
      return progress.completedStepIds.length < progress.totalSteps;
    });
    if (!unmet) return lesson.id;
  }
  return lessons[0]?.id ?? "";
};

export default function LessonsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const searchParams = useSearchParams();
  const { progressMap } = useOverallLessonProgress();

  const firstAccessibleLessonId = useMemo(
    () => getFirstAvailableLesson(progressMap),
    [progressMap]
  );

  const [activeLessonId, setActiveLessonId] = useState(firstAccessibleLessonId);

  useEffect(() => {
    setActiveLessonId(firstAccessibleLessonId);
  }, [firstAccessibleLessonId]);

  useEffect(() => {
    if (status === "unauthenticated") {
      const redirect = encodeURIComponent("/lessons");
      router.push(`/sign-in?redirect=${redirect}`);
    }
  }, [router, status]);

  useEffect(() => {
    const lessonFromQuery = searchParams.get("lesson");
    if (lessonFromQuery && lessons.some((lesson) => lesson.id === lessonFromQuery)) {
      setActiveLessonId(lessonFromQuery);
    }
  }, [searchParams]);

  if (status === "loading") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-black text-white">
        <p className="text-sm text-indigo-100/80">Loading lessons...</p>
      </div>
    );
  }

  if (!session) {
    return null;
  }

  const activeLesson = lessons.find((lesson) => lesson.id === activeLessonId) ?? lessons[0];

  return (
    <main className="min-h-screen bg-gradient-to-b from-black via-zinc-950 to-indigo-950 px-6 py-20 text-white">
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[0.45fr_0.55fr]">
        <div className="space-y-6 lg:sticky lg:top-20 lg:self-start">
          <h1 className="text-3xl font-semibold">Micro Lessons</h1>
          <p className="text-sm text-indigo-100/80">
            Setiap lesson cuma 5 menit, lengkap dengan audio, latihan tulis, dan kuis cepat. Selesaikan buat nambah streak & XP.
          </p>
          <LessonNavigation
            lessons={lessons}
            activeLessonId={activeLesson.id}
            onSelect={(lessonId) => setActiveLessonId(lessonId)}
          />
        </div>

        <div className="space-y-6">
          <LessonPlayer lesson={activeLesson} />
        </div>
      </div>
    </main>
  );
}
