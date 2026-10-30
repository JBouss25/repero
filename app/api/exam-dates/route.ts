import { NextResponse } from 'next/server';
import { readSession } from '@/lib/oidc/session';
import { prisma } from '@/lib/db/client';

export const runtime = 'nodejs';

export async function GET() {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const exams = await prisma.examDate.findMany({
    where: { tenantId: session.user.tenantId, studentId: session.user.sub, at: { gte: new Date() } },
    orderBy: { at: 'asc' },
  });
  return NextResponse.json({ exams });
}

export async function POST(req: Request) {
  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });
  const body = await req.json();
  const exam = await prisma.examDate.create({
    data: {
      tenantId: session.user.tenantId,
      studentId: session.user.sub,
      chapter: body.chapter,
      at: new Date(body.at),
      createdBy: session.user.sub,
    },
  });
  return NextResponse.json(exam);
}