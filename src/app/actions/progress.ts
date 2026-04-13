"use server";

import { getServerSession } from "next-auth/next";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

async function getSessionUserId() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user || !(session.user as any).id) {
    throw new Error("Unauthorized");
  }
  return (session.user as any).id as string;
}

export async function fetchLessonProgress() {
  try {
    const userId = await getSessionUserId();
    const progress = await prisma.lessonProgress.findMany({
      where: { userId },
    });
    return progress;
  } catch (error) {
    return [];
  }
}

export async function updateLessonProgressState(lessonId: string, completedStepIds: string[], quizScore: number, totalSteps: number, completedAt?: Date | null) {
  try {
    const userId = await getSessionUserId();
    const result = await prisma.lessonProgress.upsert({
      where: {
        userId_lessonId: { userId, lessonId },
      },
      update: {
        completedStepIds: JSON.stringify(completedStepIds),
        quizScore,
        totalSteps,
        completedAt: completedAt ? new Date(completedAt) : null,
      },
      create: {
        userId,
        lessonId,
        completedStepIds: JSON.stringify(completedStepIds),
        quizScore,
        totalSteps,
        completedAt: completedAt ? new Date(completedAt) : null,
      },
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to update lesson progress:", error);
    return { success: false };
  }
}

export async function fetchWritingProgress() {
  try {
    const userId = await getSessionUserId();
    const progress = await prisma.writingProgress.findMany({
      where: { userId },
    });
    return progress;
  } catch (error) {
    return [];
  }
}

export async function upsertWritingProgressAction(characterId: string, attempts: number, totalXp: number, lastAccuracy: number | null) {
  try {
    const userId = await getSessionUserId();
    const result = await prisma.writingProgress.upsert({
      where: {
        userId_characterId: { userId, characterId },
      },
      update: {
        attempts: { increment: attempts },
        totalXp: { increment: totalXp },
        lastAccuracy,
        lastPracticed: new Date(),
      },
      create: {
        userId,
        characterId,
        attempts,
        totalXp,
        lastAccuracy,
      },
    });
    return { success: true, data: result };
  } catch (error) {
    console.error("Failed to update writing progress:", error);
    return { success: false };
  }
}
