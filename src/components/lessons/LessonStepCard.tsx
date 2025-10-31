"use client";

import { LessonStep } from "@/data/lessons";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { cn } from "@/lib/utils";

type LessonStepCardProps = {
  step: LessonStep;
  onComplete: () => void;
  isCompleted: boolean;
  showRomaji: boolean;
  toggleRomaji: () => void;
  recordQuiz: (score: number) => void;
};

type QuizState = {
  selectedIndex: number | null;
  isAnswered: boolean;
};

const StepFrame = ({ children }: { children: React.ReactNode }) => (
  <div className="rounded-3xl border border-white/10 bg-zinc-900/80 p-6 shadow-lg shadow-pink-500/10">
    {children}
  </div>
);

function IntroStep({
  step,
  onComplete,
  isCompleted,
}: LessonStepCardProps & { step: Extract<LessonStep, { type: "intro" }> }) {
  return (
    <StepFrame>
      <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">Intro</p>
      <h3 className="mt-3 text-2xl font-semibold text-white">{step.title}</h3>
      <p className="mt-3 text-sm text-indigo-100/80">{step.description}</p>
      {step.audio && (
        <audio controls className="mt-5 w-full rounded-xl bg-black/30">
          <source src={step.audio} type="audio/mpeg" />
          Browser kamu belum support audio tag.
        </audio>
      )}
      <Button
        className="mt-6 w-full rounded-full bg-pink-500 text-white hover:bg-pink-400"
        onClick={onComplete}
      >
        {isCompleted ? "Sudah selesai" : "Next step"}
      </Button>
    </StepFrame>
  );
}

function PracticeStep({
  step,
  onComplete,
  isCompleted,
  showRomaji,
  toggleRomaji,
}: LessonStepCardProps & { step: Extract<LessonStep, { type: "practice" }> }) {
  return (
    <StepFrame>
      <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">Practice</p>
      <h3 className="mt-3 text-2xl font-semibold text-white">{step.prompt}</h3>
      <div className="mt-4 rounded-2xl border border-white/5 bg-black/40 p-4">
        <p className="text-sm text-indigo-100/80">Hint</p>
        <p className="mt-1 text-sm text-white/80">{step.hint}</p>
      </div>

      <div className="mt-4 flex flex-col gap-2 rounded-2xl border border-white/5 bg-black/40 p-4">
        <span className="text-sm text-indigo-100/70">Contoh kata</span>
        <p className="text-xl font-semibold text-white">{step.example}</p>
        <button
          type="button"
          onClick={toggleRomaji}
          className="self-start text-xs font-semibold uppercase tracking-[0.25em] text-pink-300"
        >
          {showRomaji ? "Hide romaji" : "Show romaji"}
        </button>
        {showRomaji && <p className="text-sm text-indigo-100/80">{step.romaji}</p>}
      </div>

      <Button
        className="mt-6 w-full rounded-full bg-pink-500 text-white hover:bg-pink-400"
        onClick={onComplete}
      >
        {isCompleted ? "Sudah selesai" : "Next step"}
      </Button>
    </StepFrame>
  );
}

function QuizStep({
  step,
  onComplete,
  recordQuiz,
}: LessonStepCardProps & { step: Extract<LessonStep, { type: "quiz" }> }) {
  const [quizState, setQuizState] = useState<QuizState>({
    selectedIndex: null,
    isAnswered: false,
  });

  const submitAnswer = () => {
    if (quizState.selectedIndex === null) return;
    const isCorrect = quizState.selectedIndex === step.correctIndex;
    recordQuiz(isCorrect ? 100 : 50);
    setQuizState((prev) => ({ ...prev, isAnswered: true }));
    onComplete();
  };

  const isCorrectChoice =
    quizState.isAnswered && quizState.selectedIndex === step.correctIndex;
  const isWrongChoice =
    quizState.isAnswered && quizState.selectedIndex !== step.correctIndex;

  return (
    <StepFrame>
      <p className="text-xs uppercase tracking-[0.3em] text-indigo-200/70">Quiz</p>
      <h3 className="mt-3 text-2xl font-semibold text-white">{step.question}</h3>
      <div className="mt-6 grid gap-3">
        {step.options.map((option, index) => {
          const isSelected = quizState.selectedIndex === index;
          const isCorrect = index === step.correctIndex;
          return (
            <button
              key={option}
              type="button"
              disabled={quizState.isAnswered}
              onClick={() =>
                setQuizState((prev) => ({
                  ...prev,
                  selectedIndex: index,
                }))
              }
              className={cn(
                "rounded-2xl border px-4 py-3 text-left text-sm transition",
                "border-white/10 bg-black/40 hover:border-pink-400 hover:bg-pink-500/10",
                isSelected && "border-pink-400 bg-pink-500/10",
                quizState.isAnswered && isCorrect && "border-emerald-400 bg-emerald-500/10",
                quizState.isAnswered && isSelected && !isCorrect && "border-red-400 bg-red-500/10"
              )}
            >
              {option}
            </button>
          );
        })}
      </div>
      {quizState.isAnswered && (
        <p
          className={cn(
            "mt-4 text-sm",
            isCorrectChoice && "text-emerald-200",
            isWrongChoice && "text-red-200"
          )}
        >
          {step.explanation}
        </p>
      )}
      <Button
        className="mt-6 w-full rounded-full bg-pink-500 text-white hover:bg-pink-400 disabled:cursor-not-allowed disabled:opacity-60"
        disabled={quizState.selectedIndex === null || quizState.isAnswered}
        onClick={submitAnswer}
      >
        Submit answer
      </Button>
    </StepFrame>
  );
}

export function LessonStepCard(props: LessonStepCardProps) {
  if (props.step.type === "intro") {
    return <IntroStep {...props} step={props.step} />;
  }

  if (props.step.type === "practice") {
    return <PracticeStep {...props} step={props.step} />;
  }

  if (props.step.type === "quiz") {
    return <QuizStep {...props} step={props.step} />;
  }

  return null;
}
