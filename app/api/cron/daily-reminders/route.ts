import { NextResponse } from 'next/server';
import { sendDailyReminders } from '@/lib/notifications/scheduler';

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
  const result = await sendDailyReminders();
  return NextResponse.json(result);
}