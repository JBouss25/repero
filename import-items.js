// import-items.js
const XLSX = require('xlsx');
const { PrismaClient } = require('@prisma/client');
const { PrismaPg } = require('@prisma/adapter-pg');

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });

async function main() {
  const wb = XLSX.readFile('modele_import_repero.xlsx');
  const rows = XLSX.utils.sheet_to_json(wb.Sheets['Items']);

  console.log(`📦 ${rows.length} items à importer...`);

  const tenantId = "11111111-1111-1111-1111-111111111111"; // Ton tenant de test

  for (const row of rows) {
    try {
      const item = await prisma.item.create({
        data: {
          tenantId,
          competenceId: row.competence_id,
          chapter: row.chapter,
          level: row.level,
          bloom: row.bloom,
          difficulty: row.difficulty,
          curriculum: row.curriculum,
          targetTimeS: row.target_time_s,
          format: row.format,
          phases: row.phases.split(','),
          label: row.label,
          // Création des distracteurs (options)
          distractors: {
            create: [
              { label: row.option_a, errorType: row.error_type_a },
              { label: row.option_b, errorType: row.error_type_b },
              { label: row.option_c, errorType: row.error_type_c },
              { label: row.option_d, errorType: row.error_type_d },
            ]
          }
        }
      });
      console.log(`✅ Item créé : ${item.id} (${item.label.substring(0, 30)}...)`);
    } catch (e) {
      console.error(`❌ Erreur sur la ligne : ${row.label.substring(0, 20)}...`, e.message);
    }
  }
  await prisma.$disconnect();
}

main().catch(console.error);