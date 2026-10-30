export type Phase = 'warmup' | 'core' | 'self_eval' | 'challenge';

export type BloomLevel =
  | 'remember'
  | 'understand'
  | 'apply'
  | 'analyze'
  | 'evaluate';

export type Confidence = 'sure' | 'hesitant' | 'random';

export type ItemFormat = 'qcm' | 'numeric' | 'true_false' | 'guided' | 'graph';

export type Curriculum = 'marocain' | 'francais' | 'commun';

export interface Item {
  id: string;
  competenceId: string;
  chapter: string;
  level: string;
  bloom: BloomLevel;
  difficulty: 1 | 2 | 3 | 4 | 5;
  curriculum: Curriculum;
  targetTimeS: number;
  format: ItemFormat;
  phases: Phase[];
}

export interface Response {
  itemId: string;
  correct: boolean;
  timeMs: number;
  targetTimeMs: number;
  hintsUsed: number;
  confidence: Confidence;
  at: number;
}

export interface ReviewState {
  itemId: string;
  lastReviewAt: number;
  dueAt: number;
  stabilityDays: number;
  reps: number;
  lapses: number;
}

export interface FsrsConfig {
  targetRetention: number;
  initialStabilityDays: number;
  minStabilityDays: number;
  maxStabilityDays: number;
}

export interface Mastery {
  competenceId: string;
  pMastery: number;
  slip: number;
  guess: number;
  transit: number;
  mastered: boolean;
}

export interface Session {
  studentId: string;
  tenantId: string;
  composedAt: number;
  phases: {
    warmup: SelectedItem[];
    core: SelectedItem[];
    self_eval: SelectedItem[];
    challenge: SelectedItem[];
  };
  items: SelectedItem[];
  reasons: DecisionLog[];
}

export type SelectionReason =
  | 'revision_due'
  | 'fragile_competence'
  | 'calibration'
  | 'challenge'
  | 'exam_priority';

export interface SelectedItem {
  item: Item;
  reason: SelectionReason;
}

export interface DecisionLog {
  itemId: string;
  rule: 'R1' | 'R2' | 'R3' | 'R4' | 'R5' | 'R6';
  reason: SelectionReason;
  at: number;
}

export interface ExamDate {
  chapter: string;
  at: number;
}

export interface ItemRepository {
  dueItems(tenantId: string, studentId: string, limit: number): Promise<Item[]>;
  weakestUnmastered(tenantId: string, studentId: string): Promise<{ competenceId: string; pMastery: number } | null>;
  itemsForCompetence(tenantId: string, competenceId: string, phase: Phase, limit: number): Promise<Item[]>;
  itemsByPredictedSuccess(tenantId: string, studentId: string, target: number, limit: number): Promise<Item[]>;
  adjacentBloom(tenantId: string, competenceId: string, limit: number): Promise<Item[]>;
  examItems(tenantId: string, studentId: string, chapters: string[], limit: number): Promise<Item[]>;
}

export interface SessionContext {
  tenantId: string;
  studentId: string;
  now: number;
  exams: ExamDate[];
  repo: ItemRepository;
}