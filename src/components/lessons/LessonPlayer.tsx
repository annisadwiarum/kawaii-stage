"use client";

import { LessonMeta } from "@/data/lessons";
import { LessonStepCard } from "@/components/lessons/LessonStepCard";
import { Button } from "@/components/ui/button";
import { useLessonProgress } from "@/hooks/useLessonProgress";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useMemo, useState } from "react";

type LessonPlayerProps = {
  lesson: LessonMeta;
};

export function LessonPlayer({ lesson }: LessonPlayerProps) {
  const [activeStepIndex, setActiveStepIndex] = useState(0);
  const [showRomaji, setShowRomaji] = useState(false);
  const { state, markStepCompleted, recordQuizScore, resetLesson } = useLessonProgress(
    lesson.id,
    lesson.steps.length
  );

  const currentStep = lesson.steps[activeStepIndex];

  const progressPercent = useMemo(() => {
    if (lesson.steps.length === 0) return 0;
    return Math.min(100, (state.completedStepIds.length / lesson.steps.length) * 100);
  }, [lesson.steps.length, state.completedStepIds.length]);

  const handleComplete = () => {
    markStepCompleted(currentStep.id);
    if (activeStepIndex < lesson.steps.length - 1) {
      setActiveStepIndex((idx) => idx + 1);
    }
  };

  const goToStep = (index: number) => {
    setActiveStepIndex(index);
    setShowRomaji(false);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      <div className="rounded-3xl border border-white/10 bg-zinc-950/60 p-6">
        <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">{lesson.script}</p>
            <h2 className="mt-2 text-2xl font-semibold text-white">{lesson.title}</h2>
            <p className="text-xs text-indigo-100/70">
              Level {lesson.level} • {lesson.durationMinutes} menit • XP {lesson.xpReward}
            </p>
          </div>
          <div className="flex items-center gap-3 text-sm text-indigo-100/70">
            <span>{state.completedStepIds.length}/{lesson.steps.length} steps</span>
            <div className="relative h-2 w-32 overflow-hidden rounded-full bg-white/10">
              <div
                className="absolute inset-y-0 left-0 rounded-full bg-pink-400"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        <div className="mt-4 flex flex-wrap gap-2">
          {lesson.steps.map((step, index) => {
            const isCompleted = state.completedStepIds.includes(step.id);
            const isActive = index === activeStepIndex;
            return (
              <button
                key={step.id}
                type="button"
                onClick={() => goToStep(index)}
                className={cn(
                  "rounded-full border px-3 py-1 text-xs uppercase tracking-[0.25em] transition",
                  "border-white/10 text-indigo-100/60 hover:border-pink-400 hover:text-pink-300",
                  isActive && "border-pink-400 text-pink-200",
                  isCompleted && "border-emerald-400 text-emerald-200"
                )}
              >
                {step.type}
              </button>
            );
          })}
        </div>
      </div>

      <LessonStepCard
        step={currentStep}
        onComplete={handleComplete}
        isCompleted={state.completedStepIds.includes(currentStep.id)}
        showRomaji={showRomaji}
        toggleRomaji={() => setShowRomaji((prev) => !prev)}
        recordQuiz={recordQuizScore}
      />

      <div className="flex flex-col gap-3 rounded-3xl border border-white/10 bg-zinc-950/60 p-6 md:flex-row md:items-center md:justify-between">
        <div className="text-sm text-indigo-100/80">
          <p>Quiz score: {state.quizScore}</p>
          {state.completedStepIds.length >= lesson.steps.length && (
            <p className="text-emerald-200">Lesson completed! XP +{lesson.xpReward}</p>
          )}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="ghost"
            className="border border-white/10 bg-black/40 hover:bg-white/10"
            onClick={() => goToStep(Math.max(0, activeStepIndex - 1))}
            disabled={activeStepIndex === 0}
          >
            Step sebelumnya
          </Button>
          <Button
            variant="ghost"
            className="border border-white/10 bg-black/40 hover:bg-white/10"
            onClick={() =>
              goToStep(Math.min(lesson.steps.length - 1, activeStepIndex + 1))
            }
            disabled={activeStepIndex === lesson.steps.length - 1}
          >
            Step selanjutnya
          </Button>
          <Button
            variant="destructive"
            className="bg-pink-500 text-white hover:bg-pink-400"
            onClick={() => {
              resetLesson();
              setActiveStepIndex(0);
            }}
          >
            Reset lesson
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
