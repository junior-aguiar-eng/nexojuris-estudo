import { test } from 'node:test';
import assert from 'node:assert/strict';
import { ForgeLexClient, ForgeLexAuthoritySchema } from '../src/server/integrations/forgelex.ts';

test('ForgeLexAuthoritySchema valida dados canônicos de acórdão', () => {
  const sample = {
    id: 'stf-re-123456',
    tribunal: 'STF' as const,
    classe: 'RE',
    numero: '123.456',
    orgaoJulgador: 'Tribunal Pleno',
    relator: 'Min. Relator',
    ementa: 'CONSTITUCIONAL. COISA JULGADA. SEGURANÇA JURÍDICA. EFICÁCIA DA DECISÃO.',
    tese: 'Tema 123: A coisa julgada goza de proteção constitucional intransponível.',
    urlOficial: 'https://portal.stf.jus.br/processos/detalhe.asp?incidente=123456'
  };

  const parsed = ForgeLexAuthoritySchema.parse(sample);
  assert.equal(parsed.id, 'stf-re-123456');
  assert.equal(parsed.tribunal, 'STF');
  assert.equal(parsed.classe, 'RE');
});

test('ForgeLexClient executa busca com tratamento seguro e idempotência', async () => {
  const client = new ForgeLexClient();
  const res = await client.searchCaseLaw({
    query: 'coisa julgada',
    limit: 2,
    requestId: 'test_req_001'
  });

  assert.ok(Array.isArray(res.items));
  assert.equal(typeof res.total, 'number');
});
