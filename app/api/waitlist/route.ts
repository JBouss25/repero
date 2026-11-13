import { NextResponse } from 'next/server';
import { prisma } from '@/lib/db/client';

export const runtime = 'nodejs';

export async function POST(req: Request) {
  try {
    const { email } = await req.json();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      return NextResponse.json({ error: 'Email invalide' }, { status: 400 });
    }

    await prisma.waitlist.upsert({
      where: { email },
      update: {},
      create: { email, source: 'landing' },
    });

    return NextResponse.json({ ok: true });
  } catch (err) {
    return NextResponse.json({ error: 'Erreur serveur' }, { status: 500 });
  }
}

export async function GET() {
  const count = await prisma.waitlist.count();
  return NextResponse.json({ count });
}