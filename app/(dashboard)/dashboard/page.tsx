import { readSession } from '@/lib/oidc/session';
import { prisma } from '@/lib/db/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import Link from 'next/link';
export const dynamic = 'force-dynamic';
export default async function DashboardPage() {
  const session = await readSession();
  if (!session) return null;

  const [mastery, dueCount] = await Promise.all([
    prisma.mastery.findMany({
      where: { tenantId: session.user.tenantId, studentId: session.user.sub },
      orderBy: { pMastery: 'asc' },
      take: 3,
    }),
    prisma.reviewState.count({
      where: {
        tenantId: session.user.tenantId,
        studentId: session.user.sub,
        dueAt: { lte: new Date() },
      },
    }),
  ]);

  return (
    <div className="p-8 max-w-4xl mx-auto space-y-8">
      <div>
        <h1 className="text-3xl font-bold">Bonjour</h1>
        <p className="text-muted-foreground">Prêt pour 15 minutes ?</p>
      </div>

      <div className="p-6 bg-blue-50 border border-blue-200 rounded-xl flex justify-between items-center">
        <div>
          <h2 className="text-lg font-bold text-blue-900">Session du jour</h2>
          <p className="text-blue-700 text-sm">
            {dueCount > 0 ? `${dueCount} révision(s) due(s)` : 'Consolidez vos compétences.'}
          </p>
        </div>
        <Link
          href="/session"
          className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-lg font-bold"
        >
          Démarrer
        </Link>
      </div>

      <div>
        <h3 className="text-lg font-bold mb-4">Jauges de maîtrise</h3>
        {mastery.length === 0 ? (
          <p className="text-muted-foreground">Pas encore de données de maîtrise.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mastery.map((m) => (
              <Card key={m.competenceId}>
                <CardHeader>
                  <CardTitle className="text-sm">{m.competenceId}</CardTitle>
                </CardHeader>
                <CardContent>
                  <Progress value={m.pMastery * 100} />
                  <p className="text-xs text-right mt-2 text-muted-foreground">
                    {Math.round(m.pMastery * 100)}% {m.mastered && '✅'}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="text-sm text-muted-foreground border-t pt-4">
        <p><strong>sub</strong> : {session.user.sub}</p>
        <p><strong>tenant</strong> : {session.user.tenantId}</p>
      </div>
    </div>
  );
}