import { test } from 'node:test';
import assert from 'node:assert/strict';
import { openConnection, goBack, initialNavigation } from '../src/features/study/navigation.ts';

test('referência e bloco compartilham destino e não duplicam histórico', () => {
  const law = { id: 'cf-art5-xxxvi', kind: 'law' as const, passageId: 'protecao' };
  const first = openConnection(initialNavigation, law);
  const repeated = openConnection(first, { ...law });
  assert.deepEqual(repeated, first);
  assert.equal(repeated.trail.length, 0);
});

test('voltar recupera a conexão e a passagem anteriores', () => {
  const law = { id: 'cf-art5-xxxvi', kind: 'law' as const, passageId: 'protecao' };
  const cases = { id: 'casos', kind: 'case' as const, passageId: 'limites' };
  const previous = openConnection(initialNavigation, law);
  const current = openConnection(previous, cases);
  assert.deepEqual(goBack(current), previous);
  assert.deepEqual(goBack(previous), initialNavigation);
});
