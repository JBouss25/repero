import { readSession } from '@/lib/oidc/session';
import { prisma } from '@/lib/db/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

export default async function TutorPage() {
  const session = await readSession();
  if (!session) return null;

  const alerts = await prisma.tutorAlert.findMany({
    where: { tenantId: session.user.tenantId, resolved: false },
    orderBy: [{ priority: 'asc' }, { createdAt: 'asc' }],
    take: 50,
  });

  return (
    <div className="p-8 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-6">Alertes tuteur</h1>
      {alerts.length === 0 ? (
        <p className="text-muted-foreground">Aucune alerte.</p>
      ) : (
        <div className="space-y-3">
          {alerts.map((a) => (
            <Card key={a.id}>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-sm">{a.type}</CardTitle>
                <Badge variant={a.priority === 'HIGH' ? 'destructive' : 'secondary'}>
                  {a.priority}
                </Badge>
              </CardHeader>
              <CardContent>
                <p className="text-sm">{a.detail}</p>
                <p className="text-xs text-muted-foreground mt-2">Eleve : {a.studentId}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}