import { readSession } from '@/lib/oidc/session';
import { prisma } from '@/lib/db/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

export const dynamic = 'force-dynamic';

export default async function ReportsPage() {
  const session = await readSession();
  if (!session) return null;

  // Pour la V1, on suppose que le parent voit les données de l'élève lié à son tenant.
  // (Dans une vraie app, on ferait une jointure parent-enfant).
  // On prend un élève au hasard de ce tenant pour la démo.
  const student = await prisma.mastery.findFirst({
    where: { tenantId: session.user.tenantId },
    select: { studentId: true },
  });

  if (!student) {
    return (
      <div className="p-6 text-center text-gray-500">
        Aucune donnée d'élève à afficher pour le moment.
      </div>
    );
  }

  const [streak, mastery, alerts] = await Promise.all([
    prisma.streak.findUnique({
      where: { tenantId_studentId: { tenantId: session.user.tenantId, studentId: student.studentId } },
    }),
    prisma.mastery.findMany({
      where: { tenantId: session.user.tenantId, studentId: student.studentId },
      orderBy: { pMastery: 'desc' },
      take: 3,
    }),
    prisma.tutorAlert.count({
      where: { tenantId: session.user.tenantId, studentId: student.studentId, resolved: false },
    }),
  ]);

  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <h1 className="text-2xl font-bold">📊 Rapport Hebdomadaire</h1>
      <p className="text-gray-500">Suivi de l'élève : {student.studentId.substring(0, 12)}...</p>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Assiduité</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-orange-500">🔥 {streak?.current || 0} jours</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Compétences suivies</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-blue-600">{mastery.length}</p></CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2"><CardTitle className="text-sm text-gray-500">Alertes</CardTitle></CardHeader>
          <CardContent><p className="text-3xl font-bold text-red-500">{alerts}</p></CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader><CardTitle>Compétences en progrès</CardTitle></CardHeader>
        <CardContent className="space-y-4">
          {mastery.map((m) => (
            <div key={m.competenceId}>
              <div className="flex justify-between text-sm mb-1">
                <span>{m.competenceId}</span>
                <span className="font-semibold">{Math.round(m.pMastery * 100)}%</span>
              </div>
              <Progress value={m.pMastery * 100} className="h-2" />
            </div>
          ))}
        </CardContent>
      </Card>
    </div>
  );
}