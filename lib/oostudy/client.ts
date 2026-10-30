export interface DiagnosticData {
  initialMastery: Array<{ competenceId: string; pMastery: number }>;
  prerequisites: string[];
}

export interface MasteryUpdate {
  competenceId: string;
  pMastery: number;
  mastered: boolean;
}

export async function fetchDiagnostic(studentId: string): Promise<DiagnosticData> {
  if (process.env.USE_OOSTUDY_MOCK === 'true') {
    return {
      initialMastery: [
        { competenceId: 'PC-1B-MEC-03', pMastery: 0.2 },
        { competenceId: 'PC-1B-MEC-04', pMastery: 0.45 },
      ],
      prerequisites: [],
    };
  }
  throw new Error('OoStudy API not configured');
}

export async function pushMasteryUpdate(studentId: string, updates: MasteryUpdate[]): Promise<void> {
  if (process.env.USE_OOSTUDY_MOCK === 'true') {
    console.log(`[MOCK OoStudy] Mastery updated for ${studentId}`, JSON.stringify(updates));
    return;
  }
  throw new Error('OoStudy API not configured');
}