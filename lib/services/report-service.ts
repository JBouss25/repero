import { Resend } from 'resend';
import { prisma } from '@/lib/db/client';

const resend = new Resend(process.env.RESEND_API_KEY);
const FROM = `Repero <${process.env.RESEND_FROM_EMAIL ?? 'onboarding@resend.dev'}>`;

export async function sendWeeklyParentReport(tenantId: string, studentId: string) {
  const weekAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000);

  const [sessions, mastery, alerts] = await Promise.all([
    prisma.sessionLog.count({ where: { tenantId, studentId, composedAt: { gte: weekAgo } } }),
    prisma.mastery.findMany({ where: { tenantId, studentId }, orderBy: { pMastery: 'desc' }, take: 3 }),
    prisma.tutorAlert.count({ where: { tenantId, studentId, resolved: false } }),
  ]);

  const progressList = mastery.map((m) => `<li>${m.competenceId} : ${Math.round(m.pMastery * 100)}%</li>`).join('');

  await resend.emails.send({
    from: FROM,
    to: process.env.TEST_PARENT_EMAIL ?? 'delivered@resend.dev',
    subject: 'Repero â€” Rapport hebdomadaire',
    html: `<h2>Rapport de la semaine</h2><p>AssiduitÃ© : ${sessions} session(s)</p><h3>CompÃ©tences</h3><ul>${progressList || '<li>Aucune</li>'}</ul><p>Alertes : ${alerts}</p>`,
  });
}