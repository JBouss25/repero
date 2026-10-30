import { Resend } from 'resend';
import { prisma } from '@/lib/db/client';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `Repero <${process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'}>`;

export async function sendDailyReminders() {
  const now = new Date();
  const hour = now.getHours();
  if (hour >= 21 || hour < 6) return { sent: 0 };

  const startOfDay = new Date(now);
  startOfDay.setHours(0, 0, 0, 0);

  const streaks = await prisma.streak.findMany({
    where: { lastActiveAt: { lt: startOfDay } },
    take: 100,
  });

  let sent = 0;
  for (const s of streaks) {
    const alreadySent = await prisma.dailyNotification.findFirst({
      where: { tenantId: s.tenantId, studentId: s.studentId, sentAt: { gte: startOfDay } },
    });
    if (alreadySent) continue;

    try {
      await resend.emails.send({
        from: FROM,
        to: process.env.TEST_PARENT_EMAIL ?? 'delivered@resend.dev',
        subject: 'Repero â€” 15 minutes aujourd hui ?',
        html: `<p>Bonjour,</p><p>Vous n avez pas encore fait votre session Daily 15 aujourd hui.</p><p><a href="${process.env.REPERO_BASE_URL}/dashboard">DÃ©marrer ma session</a></p>`,
      });
      await prisma.dailyNotification.create({
        data: { tenantId: s.tenantId, studentId: s.studentId, type: 'daily_reminder' },
      });
      sent++;
    } catch (err) {
      console.error('[Resend]', (err as Error).message);
    }
  }
  return { sent };
}