import { prisma } from '@/lib/db/client';
import { evaluateAlerts } from '@/lib/alerts/rules';

export async function checkAndCreateAlerts(tenantId: string, studentId: string) {
  const [responses, mastery, lastSession] = await Promise.all([
    prisma.response.findMany({ where: { tenantId, studentId }, orderBy: { at: 'desc' }, take: 20 }),
    prisma.mastery.findMany({ where: { tenantId, studentId } }),
    prisma.sessionLog.findFirst({ where: { tenantId, studentId }, orderBy: { composedAt: 'desc' } }),
  ]);

  const candidates = await evaluateAlerts(responses, mastery, lastSession?.composedAt ?? null);

  for (const c of candidates) {
    const existing = await prisma.tutorAlert.findFirst({
      where: { tenantId, studentId, type: c.type, resolved: false },
    });
    if (!existing) {
      await prisma.tutorAlert.create({
        data: { tenantId, studentId, type: c.type, priority: c.priority, detail: c.detail },
      });
    }
  }
  return candidates.length;
}