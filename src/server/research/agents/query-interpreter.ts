import { query } from '../../db.ts';

export interface InterpretedQuery {
  rawQuestion: string;
  normalizedKeywords: string[];
  matchedEntities: {
    id: string;
    canonicalId: string;
    kind: string;
    title: string;
  }[];
  suggestedObjective: 'compreender' | 'comparar_doutrina' | 'comparar_jurisprudencia' | 'aplicar';
}

export async function interpretQuery(rawQuestion: string): Promise<InterpretedQuery> {
  const clean = rawQuestion.trim();
  const lower = clean.toLowerCase();

  // 1. Detecta palavras-chave principais
  const tokens = lower
    .replace(/[.,\/#!$%\^&\*;:{}=\-_`~()]/g, '')
    .split(/\s+/)
    .filter(t => t.length >= 3 && !['uma', 'para', 'com', 'que', 'qual', 'como', 'sobre', 'onde'].includes(t));

  // 2. Busca entidades no Grafo Jurídico que coincidam com o título ou canonical_id
  const searchPattern = `%${tokens.slice(0, 3).join('%')}%`;
  const entitiesRes = await query<{
    id: string;
    canonical_id: string;
    kind: string;
    title: string;
  }>(`
    SELECT id, canonical_id, kind, title
    FROM legal_entities
    WHERE LOWER(title) LIKE LOWER($1)
       OR LOWER(canonical_id) LIKE LOWER($1)
    LIMIT 5;
  `, [searchPattern]);

  let matched = entitiesRes.rows.map(r => ({
    id: r.id,
    canonicalId: r.canonical_id,
    kind: r.kind,
    title: r.title
  }));

  // Se não encontrar por Like amplo, busca por termos individuais
  if (matched.length === 0 && tokens.length > 0) {
    const fallbackRes = await query<{
      id: string;
      canonical_id: string;
      kind: string;
      title: string;
    }>(`
      SELECT id, canonical_id, kind, title
      FROM legal_entities
      WHERE ${tokens.map((_, i) => `LOWER(title) LIKE LOWER($${i + 1})`).join(' OR ')}
      LIMIT 5;
    `, tokens.map(t => `%${t}%`));

    matched = fallbackRes.rows.map(r => ({
      id: r.id,
      canonicalId: r.canonical_id,
      kind: r.kind,
      title: r.title
    }));
  }

  // 3. Determina o objetivo sugerido
  let objective: 'compreender' | 'comparar_doutrina' | 'comparar_jurisprudencia' | 'aplicar' = 'compreender';
  if (lower.includes('comparar') || lower.includes('diferença') || lower.includes('versus') || lower.includes('vs')) {
    objective = lower.includes('tribunal') || lower.includes('stf') || lower.includes('stj')
      ? 'comparar_jurisprudencia'
      : 'comparar_doutrina';
  } else if (lower.includes('aplicar') || lower.includes('caso') || lower.includes('prática') || lower.includes('situação')) {
    objective = 'aplicar';
  }

  return {
    rawQuestion: clean,
    normalizedKeywords: tokens,
    matchedEntities: matched,
    suggestedObjective: objective
  };
}
