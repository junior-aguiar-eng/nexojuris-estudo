import { test } from 'node:test';
import assert from 'node:assert/strict';
import { executeStudy } from '../src/server/research/study-orchestrator.ts';
import { closePool } from '../src/server/db.ts';

test('Orquestrador de Estudo gera análise jurídica integrada e debita crédito', async () => {
  const result = await executeStudy({
    question: 'Controle de constitucionalidade das leis pelo STF',
    objective: 'compreender'
  });

  assert.ok(result.studyId);
  assert.ok(result.study.title);
  assert.ok(result.study.sections.length >= 2);
  assert.ok(result.study.connections.length >= 2);
  assert.equal(typeof result.creditsRemaining, 'number');

  await closePool();
});
