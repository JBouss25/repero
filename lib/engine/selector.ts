import type {
  DecisionLog,
  Item,
  ItemRepository,
  Session,
  SelectedItem,
  SelectionReason,
  SessionContext,
} from './types';

const DAY_MS = 24 * 60 * 60 * 1000;

const PHASE_COUNTS = {
  warmup: 3,
  core: 1,
  self_eval: 3,
  challenge: 1,
} as const;

export async function composeDailySession(ctx: SessionContext): Promise<Session> {
  const { repo, tenantId, studentId, now, exams } = ctx;
  const composedAt = Date.now();
  const decisions: DecisionLog[] = [];

  const pick = (items: Item[], reason: SelectionReason, rule: DecisionLog['rule']): SelectedItem[] =>
    items.map((item) => {
      decisions.push({ itemId: item.id, rule, reason, at: composedAt });
      return { item, reason };
    });

  const warmup = pick(
    await repo.dueItems(tenantId, studentId, PHASE_COUNTS.warmup),
    'revision_due',
    'R1',
  );

  const weakest = await repo.weakestUnmastered(tenantId, studentId);
  const core = weakest
    ? pick(
        await repo.itemsForCompetence(tenantId, weakest.competenceId, 'core', PHASE_COUNTS.core),
        'fragile_competence',
        'R2',
      )
    : [];

  const selfEval = pick(
    await repo.itemsByPredictedSuccess(tenantId, studentId, 0.75, PHASE_COUNTS.self_eval),
    'calibration',
    'R3',
  );

  const challenge = weakest
    ? pick(
        await repo.adjacentBloom(tenantId, weakest.competenceId, PHASE_COUNTS.challenge),
        'challenge',
        'R4',
      )
    : [];

  const upcomingChapters = chaptersWithExamWithin(exams, now, 10);
  let finalSession: Session = buildSession({
    tenantId,
    studentId,
    composedAt,
    phases: { warmup, core, self_eval: selfEval, challenge },
    decisions,
  });

  if (upcomingChapters.length > 0) {
    const totalItems = finalSession.items.length;
    const targetExamItems = Math.ceil(totalItems * 0.6);
    const currentExamItems = finalSession.items.filter((s) =>
      upcomingChapters.includes(s.item.chapter),
    ).length;

    if (currentExamItems < targetExamItems) {
      const need = targetExamItems - currentExamItems;
      const extra = await repo.examItems(tenantId, studentId, upcomingChapters, need);
      finalSession = injectExamItems(finalSession, extra, decisions, composedAt);
    }
  }

  finalSession = await enforceInterleaving(finalSession, repo, tenantId, studentId);

  return finalSession;
}

function buildSession(args: {
  tenantId: string;
  studentId: string;
  composedAt: number;
  phases: Session['phases'];
  decisions: DecisionLog[];
}): Session {
  const items = [
    ...args.phases.warmup,
    ...args.phases.core,
    ...args.phases.self_eval,
    ...args.phases.challenge,
  ];
  return {
    studentId: args.studentId,
    tenantId: args.tenantId,
    composedAt: args.composedAt,
    phases: args.phases,
    items,
    reasons: args.decisions,
  };
}

function chaptersWithExamWithin(
  exams: { chapter: string; at: number }[],
  now: number,
  days: number,
): string[] {
  const limit = now + days * DAY_MS;
  return exams.filter((e) => e.at >= now && e.at <= limit).map((e) => e.chapter);
}

function injectExamItems(
  session: Session,
  extra: Item[],
  decisions: DecisionLog[],
  at: number,
): Session {
  const selected: SelectedItem[] = extra.map((item) => {
    decisions.push({ itemId: item.id, rule: 'R6', reason: 'exam_priority', at });
    return { item, reason: 'exam_priority' as const };
  });
  const selfEval = [...session.phases.self_eval, ...selected];
  return {
    ...session,
    phases: { ...session.phases, self_eval: selfEval },
    items: [
      ...session.phases.warmup,
      ...session.phases.core,
      ...selfEval,
      ...session.phases.challenge,
    ],
    reasons: decisions,
  };
}

async function enforceInterleaving(
  session: Session,
  repo: ItemRepository,
  tenantId: string,
  studentId: string,
): Promise<Session> {
  const chapters = new Set(session.items.map((s) => s.item.chapter));
  if (chapters.size >= 2) return session;

  const weakest = await repo.weakestUnmastered(tenantId, studentId);
  if (!weakest) return session;

  const extra = await repo.itemsForCompetence(tenantId, weakest.competenceId, 'self_eval', 1);
  if (extra.length === 0) return session;

  const fallback = extra[0];
  if (chapters.has(fallback.chapter)) return session;

  const selected: SelectedItem = { item: fallback, reason: 'calibration' };
  const selfEval = [...session.phases.self_eval, selected];
  return {
    ...session,
    phases: { ...session.phases, self_eval: selfEval },
    items: [
      ...session.phases.warmup,
      ...session.phases.core,
      ...selfEval,
      ...session.phases.challenge,
    ],
  };
}