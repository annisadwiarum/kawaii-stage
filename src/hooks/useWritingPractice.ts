"use client";

import { useCallback, useEffect, useState } from "react";

export type WritingProgressState = {
  attempts: number;
  bestAccuracy: number;
  totalXp: number;
  lastAccuracy?: number;
  lastXpGain?: number;
  lastPlayedAt?: string;
};

type WritingProgressMap = Record<string, WritingProgressState>;

const STORAGE_KEY = "kawaii-stage.writing-progress";

const isBrowser = typeof window !== "undefined";

const loadProgress = (): WritingProgressMap => {
  if (!isBrowser) return {};
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as WritingProgressMap) : {};
  } catch (error) {
    console.error("Failed to parse writing progress", error);
    return {};
  }
};

const saveProgress = (data: WritingProgressMap) => {
  if (!isBrowser) return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
  } catch (error) {
    console.error("Failed to persist writing progress", error);
  }
};

let store: WritingProgressMap | null = null;
const listeners = new Set<() => void>();

const getStore = () => {
  if (store === null) {
    store = loadProgress();
  }
  return store;
};

const setStore = (updater: (prev: WritingProgressMap) => WritingProgressMap) => {
  const next = updater(getStore());
  store = next;
  saveProgress(next);
  listeners.forEach((listener) => listener());
};

export const subscribeWritingProgress = (listener: () => void) => {
  listeners.add(listener);
  return () => listeners.delete(listener);
};

export const getWritingProgressSnapshot = () => getStore();

const getDefaultState = (): WritingProgressState => ({
  attempts: 0,
  bestAccuracy: 0,
  totalXp: 0,
});

const computeState = (characterId: string): WritingProgressState => {
  const snapshot = getStore();
  return snapshot[characterId] ?? getDefaultState();
};

const calculateXpGain = (accuracy: number) => {
  const base = 25;
  const scaled = Math.round(accuracy * 80);
  const bonus = accuracy > 0.92 ? 20 : accuracy > 0.8 ? 12 : 0;
  return base + scaled + bonus;
};

export function useWritingPractice(characterId: string) {
  const [state, setState] = useState<WritingProgressState>(() => computeState(characterId));

  useEffect(() => {
    setState(computeState(characterId));
    const unsubscribe = subscribeWritingProgress(() => {
      setState(computeState(characterId));
    });
    return unsubscribe;
  }, [characterId]);

  const recordAttempt = useCallback(
    (accuracy: number) => {
      const xpGain = calculateXpGain(accuracy);
      const timestamp = new Date().toISOString();
      setStore((prev) => {
        const previous = prev[characterId] ?? getDefaultState();
        const bestAccuracy = Math.max(previous.bestAccuracy, accuracy);
        return {
          ...prev,
          [characterId]: {
            attempts: previous.attempts + 1,
            bestAccuracy,
            totalXp: previous.totalXp + xpGain,
            lastAccuracy: accuracy,
            lastXpGain: xpGain,
            lastPlayedAt: timestamp,
          },
        };
      });
      return xpGain;
    },
    [characterId]
  );

  const resetHistory = useCallback(() => {
    setStore((prev) => {
      const next = { ...prev };
      delete next[characterId];
      return next;
    });
  }, [characterId]);

  return {
    state,
    recordAttempt,
    resetHistory,
  } as const;
}

export function useWritingProgressOverview() {
  const [snapshot, setSnapshot] = useState<WritingProgressMap>(() => getStore());

  useEffect(() => {
    setSnapshot(getStore());
    const unsubscribe = subscribeWritingProgress(() => {
      setSnapshot(getStore());
    });

    if (isBrowser) {
      const handleStorage = () => {
        store = loadProgress();
        setSnapshot(getStore());
      };
      window.addEventListener("storage", handleStorage);
      return () => {
        unsubscribe();
        window.removeEventListener("storage", handleStorage);
      };
    }

    return unsubscribe;
  }, []);

  const totalCharacters = Object.keys(snapshot).length;
  const totalAttempts = Object.values(snapshot).reduce((acc, entry) => acc + entry.attempts, 0);
  const totalXp = Object.values(snapshot).reduce((acc, entry) => acc + entry.totalXp, 0);

  return {
    snapshot,
    totalCharacters,
    totalAttempts,
    totalXp,
  } as const;
}
