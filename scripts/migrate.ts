import fs from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { getPool, withTransaction, closePool } from '../src/server/db.ts';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function runMigrations() {
  console.log('--- Iniciando execução de migrações NexoJuris ---');
  const pool = getPool();

  // Garante que a tabela de controle de migração existe
  await pool.query(`
    CREATE TABLE IF NOT EXISTS schema_migrations (
      version VARCHAR(50) PRIMARY KEY,
      applied_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    );
  `);

  const appliedRes = await pool.query<{ version: string }>('SELECT version FROM schema_migrations ORDER BY version ASC');
  const appliedVersions = new Set(appliedRes.rows.map(r => r.version));

  const migrationsDir = path.resolve(__dirname, '../migrations');
  const files = await fs.readdir(migrationsDir);
  const sqlFiles = files.filter(f => f.endsWith('.sql')).sort();

  for (const file of sqlFiles) {
    if (appliedVersions.has(file)) {
      console.log(`[PULADO] Migração já aplicada: ${file}`);
      continue;
    }

    console.log(`[APLICANDO] Executando migração: ${file}...`);
    const filePath = path.join(migrationsDir, file);
    const sql = await fs.readFile(filePath, 'utf-8');

    await withTransaction(async (client) => {
      await client.query(sql);
      await client.query('INSERT INTO schema_migrations (version) VALUES ($1)', [file]);
    });

    console.log(`[SUCESSO] Migração ${file} aplicada com êxito.`);
  }

  console.log('--- Todas as migrações foram verificadas e aplicadas ---');
  await closePool();
}

runMigrations().catch(err => {
  console.error('Falha crítica ao aplicar migrações:', err);
  process.exit(1);
});
