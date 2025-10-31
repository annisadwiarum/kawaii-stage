"use client";

import { useCallback, useEffect, useState } from "react";

type LessonState = {
  completedStepIds: string[];
  quizScore: number;
  totalSteps: number;
  completedAt?: string;
};

type LessonProgressMap = Record<string, LessonState>;

const STORAGE_KEY = "kawaii-stage.lesson-progress";

const isBrowser = typeof window !== "undefined";

const loadProgress = (): LessonProgressMap => {
  if (!isBrowser) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as LessonProgressMap) : {};
  } catch (error) {
    console.error("Failed to parse lesson progress", error);
    return {};
  }
};

const saveProgress = (data: LessonProgressMap) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to persist lesson progress", error);
  }
};

let store: LessonProgressMap | null = null;
const listeners = new Set<() => void>();

const getStore = () => {
  if (store === null) {
    store = loadProgress();
  }
  return store;
};

const setStore = (updater: (prev: LessonProgressMap) => LessonProgressMap) => {
  const next = updater(getStore());
  store = next;
  saveProgress(next);
  listeners.forEach((listener) => listener());
};

const subscribe = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

const getDefaultLessonState = (totalSteps: number): LessonState => ({
  completedStepIds: [],
  quizScore: 0,
  totalSteps,
});

const computeLessonState = (lessonId: string, totalSteps: number): LessonState => {
  const snapshot = getStore();
  const existing = snapshot[lessonId];
  if (!existing) {
    return getDefaultLessonState(totalSteps);
  }
  return {
    ...existing,
    totalSteps,
  };
};

export function useLessonProgress(lessonId: string, totalSteps: number) {
  const [state, setState] = useState<LessonState>(() => computeLessonState(lessonId, totalSteps));

  useEffect(() => {
    setState(computeLessonState(lessonId, totalSteps));
    const unsubscribe = subscribe(() => {
      setState(computeLessonState(lessonId, totalSteps));
    });
    return unsubscribe;
  }, [lessonId, totalSteps]);

  const persist = useCallback(
    (updater: (prev: LessonState) => LessonState) => {
      setStore((prev) => {
        const current = prev[lessonId] ?? getDefaultLessonState(totalSteps);
        return {
          ...prev,
          [lessonId]: updater(current),
        };
      });
    },
    [lessonId, totalSteps]
  );

  const markStepCompleted = useCallback(
    (stepId: string) => {
      persist((prev) => {
        if (prev.completedStepIds.includes(stepId)) return prev;
        const updatedIds = [...prev.completedStepIds, stepId];
        const isCompleted = updatedIds.length >= totalSteps;
        return {
          ...prev,
          completedStepIds: updatedIds,
          completedAt: isCompleted ? new Date().toISOString() : prev.completedAt,
        };
      });
    },
    [persist, totalSteps]
  );

  const recordQuizScore = useCallback(
    (score: number) => {
      persist((prev) => ({
        ...prev,
        quizScore: score,
      }));
    },
    [persist]
  );

  const resetLesson = useCallback(() => {
    persist(() => getDefaultLessonState(totalSteps));
  }, [persist, totalSteps]);

  return {
    state,
    markStepCompleted,
    recordQuizScore,
    resetLesson,
  } as const;
}

export function useOverallLessonProgress() {
  const [progressMap, setProgressMap] = useState<LessonProgressMap>(() => getStore());

  useEffect(() => {
    setProgressMap(getStore());
    const unsubscribeStore = subscribe(() => {
      setProgressMap(getStore());
    });

    if (isBrowser) {
      const handleStorage = () => {
        store = loadProgress();
        setProgressMap(getStore());
      };
      window.addEventListener("storage", handleStorage);
      return () => {
        unsubscribeStore();
        window.removeEventListener("storage", handleStorage);
      };
    }

    return unsubscribeStore;
  }, []);

  const totalLessons = Object.keys(progressMap).length;
  const completedLessons = Object.values(progressMap).filter(
    (state) => state.completedStepIds.length >= state.totalSteps
  ).length;
  const totalXp = Object.values(progressMap).reduce((acc, state) => acc + state.quizScore, 0);

  return {
    progressMap,
    totalLessons,
    completedLessons,
    totalXp,
  } as const;
}
