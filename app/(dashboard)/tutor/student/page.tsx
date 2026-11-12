import { readSession } from '@/lib/oidc/session';
import { prisma } from '@/lib/db/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export const dynamic = 'force-dynamic';

export default async function TutorStudentsPage() {
  const session = await readSession();
  if (!session) return null;

  // On récupère tous les élèves qui ont une maîtrise dans ce tenant
  // (Idéalement, il faudrait filtrer sur les élèves assignés à ce tuteur, mais on simplifie pour la V1)
  const masteries = await prisma.mastery.groupBy({
    by: ['studentId'],
    where: { tenantId: session.user.tenantId },
    _avg: { pMastery: true },
    _count: { competenceId: true },
  });

  return (
    <div className="p-6 max-w-5xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        👨‍🏫 Mes Élèves
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Suivi de la classe</CardTitle>
        </CardHeader>
        <CardContent>
          {masteries.length === 0 ? (
            <p className="text-gray-500">Aucun élève n'a encore de données de maîtrise.</p>
          ) : (
            <table className="w-full text-sm text-left">
              <thead className="bg-gray-50 text-gray-700">
                <tr>
                  <th className="px-4 py-3 rounded-tl-lg">ID Élève</th>
                  <th className="px-4 py-3">Compétences suivies</th>
                  <th className="px-4 py-3 rounded-tr-lg">Maîtrise moyenne</th>
                </tr>
              </thead>
              <tbody>
                {masteries.map((m) => (
                  <tr key={m.studentId} className="border-b">
                    <td className="px-4 py-3 font-mono text-xs">{m.studentId.substring(0, 12)}...</td>
                    <td className="px-4 py-3">{m._count.competenceId}</td>
                    <td className="px-4 py-3 font-semibold text-blue-600">
                      {Math.round((m._avg.pMastery || 0) * 100)}%
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </CardContent>
      </Card>
    </div>
  );
}