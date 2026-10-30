import { updateMastery, initialMastery } from '@/lib/engine/bkt';
import { scheduleNextReview } from '@/lib/engine/fsrs';
import { prisma } from '@/lib/db/client';
import { pushMasteryUpdate } from '@/lib/oostudy/client';
import type { Response as EngineResponse } from '@/lib/engine/types';

export async function processAnswer(
  tenantId: string,
  studentId: string,
  response: EngineResponse,
) {
  // 1. Journaliser la réponse
  await prisma.response.create({
    data: {
      tenantId,
      studentId,
      itemId: response.itemId,
      correct: response.correct,
      timeMs: response.timeMs,
      targetTimeMs: response.targetTimeMs,
      hintsUsed: response.hintsUsed,
      confidence: response.confidence,
    },
  });

  // 2. Récupérer l'item
  const item = await prisma.item.findUniqueOrThrow({ where: { id: response.itemId } });

  // 3. FSRS
  const existingReview = await prisma.reviewState.findUnique({
    where: { tenantId_studentId_itemId: { tenantId, studentId, itemId: response.itemId } },
  });

  const nextReview = scheduleNextReview(
    existingReview
      ? {
          itemId: existingReview.itemId,
          lastReviewAt: existingReview.lastReviewAt.getTime(),
          dueAt: existingReview.dueAt.getTime(),
          stabilityDays: existingReview.stabilityDays,
          reps: existingReview.reps,
          lapses: existingReview.lapses,
        }
      : null,
    response,
    Date.now(),
  );

  await prisma.reviewState.upsert({
    where: { tenantId_studentId_itemId: { tenantId, studentId, itemId: response.itemId } },
    create: {
      tenantId, studentId, itemId: response.itemId,
      lastReviewAt: new Date(nextReview.lastReviewAt),
      dueAt: new Date(nextReview.dueAt),
      stabilityDays: nextReview.stabilityDays,
      reps: nextReview.reps,
      lapses: nextReview.lapses,
    },
    update: {
      lastReviewAt: new Date(nextReview.lastReviewAt),
      dueAt: new Date(nextReview.dueAt),
      stabilityDays: nextReview.stabilityDays,
      reps: nextReview.reps,
      lapses: nextReview.lapses,
    },
  });

  // 4. BKT
  const existingMastery = await prisma.mastery.findUnique({
    where: { tenantId_studentId_competenceId: { tenantId, studentId, competenceId: item.competenceId } },
  });

  const masteryState = existingMastery
    ? {
        competenceId: existingMastery.competenceId,
        pMastery: existingMastery.pMastery,
        slip: existingMastery.slip,
        guess: existingMastery.guess,
        transit: existingMastery.transit,
        mastered: existingMastery.mastered,
      }
    : initialMastery(item.competenceId, 0.1);

  const nextMastery = updateMastery(masteryState, response);

  await prisma.mastery.upsert({
    where: { tenantId_studentId_competenceId: { tenantId, studentId, competenceId: item.competenceId } },
    create: {
      tenantId, studentId, competenceId: item.competenceId,
      pMastery: nextMastery.pMastery, mastered: nextMastery.mastered,
    },
    update: { pMastery: nextMastery.pMastery, mastered: nextMastery.mastered },
  });

  // 5. Push OoStudy (F4)
  await pushMasteryUpdate(studentId, [{
    competenceId: item.competenceId,
    pMastery: nextMastery.pMastery,
    mastered: nextMastery.mastered,
  }]);

  return { nextReview, nextMastery };
}