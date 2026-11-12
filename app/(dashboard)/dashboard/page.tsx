import { readSession } from '@/lib/oidc/session';
import { prisma } from '@/lib/db/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { StreakBadge } from '@/components/dashboard/StreakBadge';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const session = await readSession();
  if (!session) return null;

  const [mastery, dueCount, streak] = await Promise.all([
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
    prisma.streak.findUnique({
      where: {
        tenantId_studentId: {
          tenantId: session.user.tenantId,
          studentId: session.user.sub,
        },
      },
    }),
  ]);

  return (
    <div className="p-6 md:p-8 max-w-5xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Bonjour</h1>
          <p className="text-gray-500 mt-1">Prêt pour vos 15 minutes quotidiennes ?</p>
        </div>
        
        {streak && <StreakBadge current={streak.current} longest={streak.longest} />}
      </div>

      <div className="p-6 bg-[#0066FF] rounded-2xl flex flex-col md:flex-row justify-between items-center gap-4 shadow-lg shadow-blue-500/20">
        <div>
          <h2 className="text-xl font-bold text-white">Session du jour</h2>
          <p className="text-blue-100 mt-1">
            {dueCount > 0 
              ? `${dueCount} révision(s) en attente pour consolider vos acquis.`
              : 'Consolidez vos compétences en 15 minutes.'}
          </p>
        </div>
        <Link
          href="/session"
          className="bg-white text-[#0066FF] hover:bg-gray-50 px-8 py-3 rounded-xl font-bold transition-transform hover:scale-105"
        >
          Démarrer
        </Link>
      </div>

      <div>
        <h3 className="text-lg font-bold text-gray-900 mb-4">Jauges de maîtrise</h3>
        {mastery.length === 0 ? (
          <div className="bg-gray-50 border border-dashed border-gray-300 rounded-xl p-8 text-center">
            <p className="text-gray-500">Pas encore de données de maîtrise.</p>
            <p className="text-sm text-gray-400 mt-1">Faites une session pour voir vos progrès.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mastery.map((m) => (
              <Card key={m.competenceId} className="shadow-sm">
                <CardHeader className="pb-2">
                  <CardTitle className="text-sm font-medium text-gray-500">
                    {m.competenceId}
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-2xl font-bold text-gray-900">
                      {Math.round(m.pMastery * 100)}%
                    </span>
                    {m.mastered && (
                      <span className="text-xs font-semibold text-green-600 bg-green-100 px-2 py-1 rounded-full">
                        Acquis
                      </span>
                    )}
                  </div>
                  <Progress value={m.pMastery * 100} className="h-2" />
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>

      <div className="text-xs text-gray-400 border-t pt-4 flex justify-between">
        <span>Utilisateur : {session.user.sub.substring(0, 8)}...</span>
        <span>Tenant : {session.user.tenantId.substring(0, 8)}...</span>
      </div>
    </div>
	<div className="mt-8 p-4 bg-yellow-50 border border-yellow-200 rounded-lg text-sm font-mono">
  <p className="font-bold text-yellow-800 mb-2">🛠️ DEBUG RÔLES :</p>
  <pre className="whitespace-pre-wrap text-yellow-900">
    {JSON.stringify(session.user, null, 2)}
  </pre>
</div>
  );
}