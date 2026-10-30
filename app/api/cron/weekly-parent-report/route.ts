import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';
import { sendWeeklyParentReport } from '@/lib/services/report-service';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

function isAuthorized(req: Request): boolean {
  const auth = req.headers.get('authorization');
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  return auth === `Bearer ${secret}`;
}

export async function GET(req: Request) {
  if (!isAuthorized(req)) {
    return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  }
  const streaks = await prisma.streak.findMany({ take: 50 });
  let sent = 0;
  for (const s of streaks) {
    try {
      await sendWeeklyParentReport(s.tenantId, s.studentId);
      sent++;
    } catch (err) {
      console.error('[Report]', (err as Error).message);
    }
  }
  return NextResponse.json({ sent });
}