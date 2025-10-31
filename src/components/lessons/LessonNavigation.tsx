"use client";

import { LessonMeta } from "@/data/lessons";
import { useOverallLessonProgress } from "@/hooks/useLessonProgress";
import { cn } from "@/lib/utils";

type LessonNavigationProps = {
  lessons: LessonMeta[];
  activeLessonId: string;
  onSelect: (lessonId: string) => void;
};

type LessonStatus = "locked" | "available" | "completed";

type LessonProgress = {
  completedStepIds: string[];
  totalSteps: number;
  quizScore: number;
  completedAt?: string;
};

const getLessonStatus = (
  lesson: LessonMeta,
  progress: LessonProgress,
  progressMap: Record<string, LessonProgress>
): LessonStatus => {
  const isCompleted = progress.completedStepIds.length >= progress.totalSteps && progress.totalSteps > 0;
  if (isCompleted) return "completed";

  const unmetPrereq = (lesson.prerequisites ?? []).some((id) => {
    const state = progressMap[id];
    if (!state) return true;
    return state.completedStepIds.length < state.totalSteps;
  });

  if (unmetPrereq) return "locked";
  return "available";
};

export function LessonNavigation({ lessons, activeLessonId, onSelect }: LessonNavigationProps) {
  const grouped = lessons.reduce<Record<string, LessonMeta[]>>((acc, lesson) => {
    acc[lesson.script] = acc[lesson.script] ? [...acc[lesson.script], lesson] : [lesson];
    return acc;
  }, {});
  const { progressMap } = useOverallLessonProgress();

  const normalizedProgress = lessons.reduce<Record<string, LessonProgress>>((acc, lesson) => {
    const stored = progressMap[lesson.id];
    acc[lesson.id] = stored
      ? {
          ...stored,
          totalSteps: lesson.steps.length,
        }
      : {
          completedStepIds: [],
          totalSteps: lesson.steps.length,
          quizScore: 0,
        };
    return acc;
  }, {});

  return (
    <div className="space-y-6">
      {Object.entries(grouped).map(([script, scriptLessons]) => (
        <div key={script} className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">{script}</p>
              <h3 className="mt-2 text-xl font-semibold text-white">
                {script === "hiragana" && "Hiragana heads start"}
                {script === "katakana" && "Katakana neon vibes"}
                {script === "kanji" && "Kanji challenge"}
              </h3>
            </div>
          </div>

          <div className="mt-5 grid gap-4">
            {scriptLessons.map((lesson) => {
              const progress = normalizedProgress[lesson.id];
              const status = getLessonStatus(lesson, progress, normalizedProgress);

              const isActive = lesson.id === activeLessonId;
              const completedCount = progress.completedStepIds.length;
              const total = progress.totalSteps;

              return (
                <button
                  key={lesson.id}
                  type="button"
                  onClick={() => status !== "locked" && onSelect(lesson.id)}
                  disabled={status === "locked"}
                  className={cn(
                    "flex items-center justify-between rounded-2xl border px-4 py-3 text-left transition",
                    "border-white/10 bg-black/40 hover:border-pink-400 hover:bg-pink-500/10",
                    isActive && "border-pink-400 bg-pink-500/10",
                    status === "locked" && "cursor-not-allowed opacity-50"
                  )}
                >
                  <div>
                    <p className="text-sm font-semibold text-white">{lesson.title}</p>
                    <p className="text-xs text-indigo-100/70">
                      {lesson.level} • {lesson.durationMinutes} menit • XP {lesson.xpReward}
                    </p>
                  </div>
                  <div className="flex flex-col items-end text-xs text-indigo-100/60">
                    <span>
                      {completedCount}/{total} steps
                    </span>
                    <span className="capitalize">{status}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}
