import { NextResponse } from 'next/server';

export const runtime = 'nodejs';
export const dynamic = 'force-dynamic';

export async function GET(): Promise<Response> {
  const { readSession } = await import('@/lib/oidc/session');
  const { prisma } = await import('@/lib/db/client');

  const session = await readSession();
  if (!session) return NextResponse.json({ error: 'UNAUTHORIZED' }, { status: 401 });

  const exams = await prisma.examDate.findMany({
    where: { tenantId: session.user.tenantId, studentId: session.user.sub, at: { gte: new Date() } },
    orderBy: { at: 'asc' },
  });
  return NextResponse.json({ exams });
}

export async function POST(req: Request): Promise<Response> {
  const { readSession } = await import('@/lib/oidc/session');
  const { prisma } = await import('@/lib/db/client');

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