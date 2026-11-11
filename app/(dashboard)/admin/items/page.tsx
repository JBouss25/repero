import { prisma } from '@/lib/db/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Upload } from 'lucide-react';

export const dynamic = 'force-dynamic';

export default async function AdminItemsPage() {
  // On compte les items de la base
  const count = await prisma.item.count();

  return (
    <div className="p-6 space-y-6 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold flex items-center gap-2">
        <Upload className="h-6 w-6 text-[#0066FF]" />
        Administration des Items
      </h1>
      
      <Card>
        <CardHeader>
          <CardTitle>Banque d'items</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-gray-700">
            Total d'items dans la base : <strong className="text-lg text-[#0066FF]">{count}</strong>
          </p>
          
          <div className="flex flex-wrap gap-4 pt-4 border-t">
            <a 
              href="/modele_import_repero.xlsx" 
              download
              className="inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring bg-[#0066FF] text-white hover:bg-[#0052CC] h-10 px-4 py-2"
            >
              📥 Télécharger le modèle Excel
            </a>
          </div>

          <div className="bg-blue-50 border border-blue-200 text-blue-800 p-4 rounded-lg text-sm mt-4">
            <p className="font-semibold mb-2">💡 Comment ajouter des items ?</p>
            <ol className="list-decimal list-inside space-y-1">
              <li>Téléchargez le fichier Excel ci-dessus.</li>
              <li>Remplissez-le avec vos questions (ne modifiez pas les noms des colonnes).</li>
              <li>Enregistrez-le et lancez la commande <code className="bg-blue-100 px-1 rounded">node import-items.js</code> dans votre terminal.</li>
              <li>Rafraîchissez cette page pour voir le nouveau total.</li>
            </ol>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}