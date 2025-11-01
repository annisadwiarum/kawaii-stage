"use client";

import { useEffect, useId, useMemo, useRef, useState } from "react";
import type { PointerEvent as ReactPointerEvent } from "react";
import { motion } from "framer-motion";
import { PenLine, Play, RotateCcw, Sparkles } from "lucide-react";
import type { WritingCharacter, WritingStroke, WritingStrokePoint } from "@/data/writingCharacters";
import { useWritingPractice } from "@/hooks/useWritingPractice";

type Props = {
  character: WritingCharacter;
};

type PlaybackState = {
  running: boolean;
  index: number;
};

const SAMPLE_POINTS = 64;

const clamp = (value: number, min: number, max: number) => Math.min(Math.max(value, min), max);

const distance = (a: WritingStrokePoint, b: WritingStrokePoint) => Math.hypot(a.x - b.x, a.y - b.y);

const polylineLength = (points: WritingStrokePoint[]) => {
  if (points.length < 2) return 0;
  let total = 0;
  for (let i = 1; i < points.length; i += 1) {
    total += distance(points[i - 1], points[i]);
  }
  return total;
};

const resamplePolyline = (points: WritingStrokePoint[], sampleCount: number) => {
  if (points.length === 0) return [];
  if (points.length === 1) {
    return Array.from({ length: sampleCount }, () => ({ ...points[0] }));
  }

  const totalLength = polylineLength(points);
  if (totalLength === 0) {
    return Array.from({ length: sampleCount }, () => ({ ...points[0] }));
  }

  const step = totalLength / (sampleCount - 1);
  const result: WritingStrokePoint[] = [points[0]];
  let prevPoint = points[0];
  let distanceSinceLast = 0;

  for (let i = 1; i < points.length; i += 1) {
    const currentPoint = points[i];
    let segmentLength = distance(prevPoint, currentPoint);
    if (segmentLength === 0) continue;

    while (distanceSinceLast + segmentLength >= step) {
      const remaining = step - distanceSinceLast;
      const ratio = remaining / segmentLength;
      const nextPoint = {
        x: prevPoint.x + ratio * (currentPoint.x - prevPoint.x),
        y: prevPoint.y + ratio * (currentPoint.y - prevPoint.y),
      };
      result.push(nextPoint);
      prevPoint = nextPoint;
      segmentLength -= remaining;
      distanceSinceLast = 0;
    }

    distanceSinceLast += segmentLength;
    prevPoint = currentPoint;
  }

  while (result.length < sampleCount) {
    result.push({ ...points[points.length - 1] });
  }

  return result;
};

const getBounds = (points: WritingStrokePoint[]) => {
  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);
  const minX = Math.min(...xs);
  const maxX = Math.max(...xs);
  const minY = Math.min(...ys);
  const maxY = Math.max(...ys);
  return {
    minX,
    minY,
    maxX,
    maxY,
    width: Math.max(maxX - minX, 1e-3),
    height: Math.max(maxY - minY, 1e-3),
  };
};

const normaliseToBounds = (source: WritingStrokePoint[], targetBounds: ReturnType<typeof getBounds>) => {
  const bounds = getBounds(source);
  return source.map((point) => ({
    x: targetBounds.minX + ((point.x - bounds.minX) / bounds.width) * targetBounds.width,
    y: targetBounds.minY + ((point.y - bounds.minY) / bounds.height) * targetBounds.height,
  }));
};

const evaluateStrokeSimilarity = (expected: WritingStrokePoint[], user: WritingStrokePoint[]) => {
  if (expected.length < 2 || user.length < 2) return 0;
  const targetBounds = getBounds(expected);
  const scaledUser = normaliseToBounds(user, targetBounds);

  const resampledExpected = resamplePolyline(expected, SAMPLE_POINTS);
  const resampledUser = resamplePolyline(scaledUser, SAMPLE_POINTS);

  let total = 0;
  for (let i = 0; i < SAMPLE_POINTS; i += 1) {
    total += distance(resampledExpected[i], resampledUser[i]);
  }
  const averageDistance = total / SAMPLE_POINTS;
  const similarity = 1 - averageDistance / 28;
  return clamp(Number.isFinite(similarity) ? similarity : 0, 0, 1);
};

const pointsToPath = (points: WritingStrokePoint[]) => {
  if (points.length === 0) return "";
  const [first, ...rest] = points;
  return `M ${first.x} ${first.y} ${rest.map((point) => `L ${point.x} ${point.y}`).join(" ")}`;
};

const pointsToPolyline = (points: WritingStrokePoint[]) => points.map((point) => `${point.x},${point.y}`).join(" ");

export function WritingTrainer({ character }: Props) {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [activeStrokeIndex, setActiveStrokeIndex] = useState(0);
  const [currentStroke, setCurrentStroke] = useState<WritingStrokePoint[]>([]);
  const [userStrokes, setUserStrokes] = useState<WritingStrokePoint[][]>([]);
  const [strokeScores, setStrokeScores] = useState<number[]>([]);
  const [feedback, setFeedback] = useState<string | null>(null);
  const [playback, setPlayback] = useState<PlaybackState>({ running: false, index: -1 });
  const [sessionResult, setSessionResult] = useState<{ accuracy: number; xp: number } | null>(null);

  const { state, recordAttempt } = useWritingPractice(character.id);

  const expectedStrokes = useMemo(
    () => character.strokes.slice().sort((a, b) => a.order - b.order),
    [character.strokes]
  );

  const previewStages = useMemo(() => {
    return expectedStrokes.map((_, index) => ({
      strokes: expectedStrokes.slice(0, index + 1),
      label: `Stroke ${index + 1}`,
    }));
  }, [expectedStrokes]);

  useEffect(() => {
    setIsDrawing(false);
    setActiveStrokeIndex(0);
    setCurrentStroke([]);
    setUserStrokes([]);
    setStrokeScores([]);
    setFeedback(null);
    setPlayback({ running: false, index: -1 });
    setSessionResult(null);
  }, [character.id]);

  const handlePointerDown = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (playback.running) return;
    if (activeStrokeIndex >= expectedStrokes.length) return;
    if (!svgRef.current) return;

    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const point = { x: clamp(x, 0, 100), y: clamp(y, 0, 100) };

    setIsDrawing(true);
    setCurrentStroke([point]);
    setFeedback(null);
    event.currentTarget.setPointerCapture(event.pointerId);
  };

  const handlePointerMove = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!isDrawing || !svgRef.current) return;
    const rect = svgRef.current.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    const point = { x: clamp(x, 0, 100), y: clamp(y, 0, 100) };
    setCurrentStroke((prev) => (prev.length === 0 ? [point] : [...prev, point]));
  };

  const finishStroke = (strokePoints: WritingStrokePoint[]) => {
    if (strokePoints.length < 3) {
      setFeedback("Stroke terlalu pendek. Coba lagi lebih mantap.");
      return;
    }

    const expectedStroke = expectedStrokes[activeStrokeIndex];
    if (!expectedStroke) {
      setFeedback("Semua stroke sudah selesai. Reset buat ulang sesi.");
      return;
    }

    const similarity = evaluateStrokeSimilarity(expectedStroke.points, strokePoints);

    if (similarity < 0.25) {
      setFeedback("Masih melenceng. Perhatikan urutan dan bentuk.");
      return;
    }

    setUserStrokes((prev) => [...prev, strokePoints]);
    setStrokeScores((prev) => [...prev, similarity]);

    const positiveFeedback =
      similarity > 0.8
        ? "Mantap! Stroke kamu nyaris sempurna."
        : similarity > 0.55
          ? "Nice! Udah searah, tinggal rapihin dikit."
          : "Lumayan, ulangi pelan biar garisnya lebih stabil.";
    setFeedback(positiveFeedback);

    setActiveStrokeIndex((prev) => prev + 1);
  };

  const handlePointerUp = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!isDrawing) return;
    eventsHelperRelease(event);
    const strokePoints = currentStroke;
    setIsDrawing(false);
    setCurrentStroke([]);
    finishStroke(strokePoints);
  };

  const handlePointerLeave = (event: ReactPointerEvent<SVGSVGElement>) => {
    if (!isDrawing) return;
    eventsHelperRelease(event);
    const strokePoints = currentStroke;
    setIsDrawing(false);
    setCurrentStroke([]);
    finishStroke(strokePoints);
  };

  useEffect(() => {
    if (strokeScores.length !== expectedStrokes.length) return;
    if (expectedStrokes.length === 0) return;
    const total = strokeScores.reduce((acc, score) => acc + score, 0);
    const accuracy = total / expectedStrokes.length;
    const xp = recordAttempt(accuracy);
    setSessionResult({ accuracy, xp });
    setFeedback(
      accuracy > 0.85
        ? "Super rapi! Simpan momentum ini."
        : accuracy > 0.65
          ? "Udah mendekati, coba ulang biar makin cling."
          : "Lanjut latihan, garis dasar harus makin stabil."
    );
  }, [expectedStrokes.length, recordAttempt, strokeScores]);

  const handleReset = () => {
    setIsDrawing(false);
    setActiveStrokeIndex(0);
    setCurrentStroke([]);
    setUserStrokes([]);
    setStrokeScores([]);
    setFeedback(null);
    setSessionResult(null);
  };

  const handlePlayback = () => {
    if (playback.running) return;
    setPlayback({ running: true, index: -1 });
    const sequence = expectedStrokes.length;
    if (sequence === 0) {
      setPlayback({ running: false, index: -1 });
      return;
    }
    let current = 0;
    const timer = window.setInterval(() => {
      setPlayback({ running: true, index: current });
      current += 1;
      if (current >= sequence) {
        window.clearInterval(timer);
        window.setTimeout(() => {
          setPlayback({ running: false, index: -1 });
        }, 500);
      }
    }, 750);
  };

  const activeStrokeLabel =
    expectedStrokes.length === 0
      ? ""
      : activeStrokeIndex >= expectedStrokes.length
        ? "Semua stroke selesai"
        : `Stroke ${activeStrokeIndex + 1} dari ${expectedStrokes.length}`;

  return (
    <div className="flex flex-col gap-6 rounded-3xl border border-white/10 bg-zinc-900/60 p-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.32em] text-indigo-300/80">Writing Lab</p>
          <h2 className="text-2xl font-semibold text-white">
            {character.glyph} · {character.romaji.toUpperCase()}
          </h2>
          <p className="text-sm text-indigo-100/80">{character.vibe}</p>
        </div>
        <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-indigo-200/80">
          <PenLine className="h-4 w-4 text-pink-300" />
          {activeStrokeLabel}
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-[minmax(0,0.62fr)_minmax(0,0.38fr)]">
        <div className="flex flex-col gap-6">
          {previewStages.length > 0 && (
            <div>
              <p className="mb-3 text-xs uppercase tracking-[0.28em] text-indigo-300/80">
                Contoh stroke bertahap
              </p>
              <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-3">
                {previewStages.map((stage, index) => (
                  <PreviewStrokeGrid
                    key={`${character.id}-preview-${stage.label}`}
                    stageIndex={index}
                    totalStages={previewStages.length}
                    strokes={stage.strokes}
                    label={stage.label}
                  />
                ))}
              </div>
            </div>
          )}

          <div>
            <p className="mb-2 text-xs uppercase tracking-[0.28em] text-indigo-300/80">
              Kanvas latihan kamu
            </p>
            <InteractiveGrid
              svgRef={svgRef}
              onPointerDown={handlePointerDown}
              onPointerMove={handlePointerMove}
              onPointerUp={handlePointerUp}
              onPointerLeave={handlePointerLeave}
              currentStroke={currentStroke}
              userStrokes={userStrokes}
              playback={playback}
              expectedStrokes={expectedStrokes}
            />
            <p className="mt-3 text-xs text-indigo-200/70">
              Garis contoh hanya muncul saat kamu menekan tombol replay. Sisanya, coba tiru bentuk dari grid di atas.
            </p>
          </div>
        </div>

        <aside className="flex h-full flex-col justify-between gap-4 rounded-2xl border border-white/10 bg-black/30 p-4">
          <div className="space-y-3">
            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3">
              <p className="text-xs uppercase tracking-[0.28em] text-indigo-300/80">Status</p>
              <p className="mt-2 text-sm text-gray-200">Script: {character.script.toUpperCase()}</p>
              <p className="text-sm text-gray-200">Meaning: {character.meaning}</p>
              <p className="text-sm text-gray-200">
                Difficulty: <span className="capitalize text-pink-300">{character.difficulty}</span>
              </p>
            </div>

            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3">
              <p className="text-xs uppercase tracking-wide text-indigo-200/70">Skor per stroke</p>
              <div className="mt-2 space-y-1.5 text-sm text-gray-200">
                {expectedStrokes.map((stroke, index) => {
                  const score = strokeScores[index];
                  const completed = score !== undefined;
                  const isActive = index === activeStrokeIndex && activeStrokeIndex < expectedStrokes.length;
                  return (
                    <div
                      key={stroke.id}
                      className={`flex items-center justify-between rounded-lg px-2 py-1.5 ${
                        isActive
                          ? "bg-pink-500/20 text-pink-100"
                          : "bg-black/40 text-indigo-100/80"
                      }`}
                    >
                      <span>Stroke {index + 1}</span>
                      <span className={completed ? "text-pink-300" : "text-indigo-200/60"}>
                        {completed ? `${Math.round(score * 100)}%` : "Belum"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {sessionResult && (
              <div className="rounded-xl border border-pink-500/30 bg-pink-500/10 p-3 text-sm text-pink-100">
                <div className="flex items-center gap-2 text-xs uppercase tracking-wide text-pink-200">
                  <Sparkles className="h-4 w-4" />
                  Sesi selesai
                </div>
                <p className="mt-2 text-base font-semibold text-white">
                  Akurasi {Math.round(sessionResult.accuracy * 100)}%
                </p>
                <p className="text-sm text-pink-100/80">+{sessionResult.xp} XP ditambahkan</p>
              </div>
            )}

            {feedback && (
              <p className="rounded-xl border border-white/10 bg-white/5 px-3 py-2 text-sm text-indigo-100/90">
                {feedback}
              </p>
            )}

            <div className="rounded-xl border border-white/10 bg-zinc-900/50 p-3 text-sm text-gray-200">
              <p className="text-xs uppercase tracking-wide text-indigo-200/70">Riwayat</p>
              <p className="mt-1">Percobaan: {state.attempts}</p>
              <p>Best accuracy: {Math.round(state.bestAccuracy * 100)}%</p>
              <p>Total XP: {state.totalXp}</p>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={handlePlayback}
              disabled={playback.running}
              className="inline-flex items-center gap-2 rounded-full border border-indigo-300/40 px-4 py-2 text-sm font-semibold text-indigo-100 transition hover:bg-indigo-500/20 disabled:cursor-not-allowed disabled:opacity-50"
            >
              <Play className="h-4 w-4" />
              Replay Stroke Order
            </button>
            <button
              type="button"
              onClick={handleReset}
              className="inline-flex items-center gap-2 rounded-full border border-white/10 px-4 py-2 text-sm font-semibold text-white transition hover:bg-white/10"
            >
              <RotateCcw className="h-4 w-4" />
              Reset Kanvas
            </button>
          </div>
        </aside>
      </div>
    </div>
  );
}

function eventsHelperRelease(event: ReactPointerEvent<SVGSVGElement>) {
  try {
    event.currentTarget.releasePointerCapture(event.pointerId);
  } catch {
    // ignore release errors
  }
}

function PreviewStrokeGrid({
  strokes,
  label,
  stageIndex,
  totalStages,
}: {
  strokes: WritingStroke[];
  label: string;
  stageIndex: number;
  totalStages: number;
}) {
  const patternId = useId();
  return (
    <div className="flex flex-col gap-2 rounded-2xl border border-white/10 bg-black/40 p-3">
      <svg viewBox="0 0 100 100" className="aspect-square w-full select-none rounded-xl border border-white/10 bg-black/50">
        <defs>
          <pattern id={patternId} width="25" height="25" patternUnits="userSpaceOnUse">
            <path
              d="M 25 0 L 0 0 0 25"
              fill="none"
              stroke="rgba(148,163,184,0.25)"
              strokeWidth="0.4"
            />
          </pattern>
        </defs>
        <rect width="100" height="100" fill={`url(#${patternId})`} />
        <rect
          x="0"
          y="0"
          width="100"
          height="100"
          fill="none"
          stroke="rgba(250,250,250,0.18)"
          strokeWidth="0.8"
        />
        {strokes.map((stroke, index) => (
          <path
            key={stroke.id}
            d={pointsToPath(resamplePolyline(stroke.points, 64))}
            strokeWidth={index === strokes.length - 1 ? 3 : 2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ))}
      </svg>
      <p className="text-xs font-medium text-indigo-200/80">
        {label}
        <span className="text-indigo-200/50"> · {stageIndex + 1}/{totalStages}</span>
      </p>
    </div>
  );
}

function InteractiveGrid({
  svgRef,
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerLeave,
  currentStroke,
  userStrokes,
  playback,
  expectedStrokes,
}: {
  svgRef: React.MutableRefObject<SVGSVGElement | null>;
  onPointerDown: (event: ReactPointerEvent<SVGSVGElement>) => void;
  onPointerMove: (event: ReactPointerEvent<SVGSVGElement>) => void;
  onPointerUp: (event: ReactPointerEvent<SVGSVGElement>) => void;
  onPointerLeave: (event: ReactPointerEvent<SVGSVGElement>) => void;
  currentStroke: WritingStrokePoint[];
  userStrokes: WritingStrokePoint[][];
  playback: PlaybackState;
  expectedStrokes: WritingStroke[];
}) {
  const patternId = useId();
  return (
    <svg
      ref={svgRef}
      viewBox="0 0 100 100"
      className="aspect-square w-full touch-none select-none rounded-3xl border border-white/10 bg-black/50 shadow-inner"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerLeave={onPointerLeave}
    >
      <defs>
        <pattern id={patternId} width="25" height="25" patternUnits="userSpaceOnUse">
          <path
            d="M 25 0 L 0 0 0 25"
            fill="none"
            stroke="rgba(148,163,184,0.2)"
            strokeWidth="0.4"
          />
        </pattern>
      </defs>
      <rect width="100" height="100" fill={`url(#${patternId})`} />
      <rect
        x="0"
        y="0"
        width="100"
        height="100"
        fill="none"
        stroke="rgba(250,250,250,0.18)"
        strokeWidth="0.8"
      />

      {playback.running &&
        expectedStrokes.map((stroke, index) => (
          <motion.path
            key={stroke.id}
            d={pointsToPath(resamplePolyline(stroke.points, 64))}
            fill="none"
            stroke={playback.index === index ? "rgba(251,113,133,0.9)" : "rgba(129,140,248,0.5)"}
            strokeWidth={playback.index === index ? 3 : 2.2}
            strokeLinecap="round"
            strokeLinejoin="round"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: playback.index === index ? 0.65 : 0.3 }}
            className="pointer-events-none"
          />
        ))}

      {userStrokes.map((stroke, index) => (
        <polyline
          key={`user-${index}`}
          points={pointsToPolyline(stroke)}
          fill="none"
          stroke="rgba(244,114,182,0.85)"
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none"
        />
      ))}

      {currentStroke.length > 0 && (
        <polyline
          points={pointsToPolyline(currentStroke)}
          fill="none"
          stroke="rgba(248,189,255,0.75)"
          strokeWidth={3.2}
          strokeLinecap="round"
          strokeLinejoin="round"
          className="pointer-events-none"
        />
      )}
    </svg>
  );
}

export default WritingTrainer;
