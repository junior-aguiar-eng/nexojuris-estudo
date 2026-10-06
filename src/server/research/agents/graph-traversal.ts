import { query } from '../../db.ts';

export interface RetrievedPassage {
  id: string;
  documentTitle: string;
  documentKind: string;
  locatorSection: string;
  lineStart: number;
  lineEnd: number;
  textContent: string;
  rank?: number;
}

export interface GraphConnectedEntity {
  id: string;
  canonicalId: string;
  title: string;
  kind: string;
  relationType: string;
  evidenceText?: string;
  passageText?: string;
}

export interface TraversalResult {
  passages: RetrievedPassage[];
  connectedEntities: GraphConnectedEntity[];
}

export async function traverseGraph(
  entityIds: string[],
  searchQueryText: string
): Promise<TraversalResult> {
  const passages: RetrievedPassage[] = [];
  const connectedEntities: GraphConnectedEntity[] = [];

  // 1. Busca textual no acervo de passagens (Doutrina e Legislação)
  if (searchQueryText.trim()) {
    const textRes = await query<{
      id: string;
      doc_title: string;
      doc_kind: string;
      locator_section: string;
      line_start: number;
      line_end: number;
      text_content: string;
      rank: number;
    }>(`
      SELECT 
        p.id,
        d.title as doc_title,
        d.kind as doc_kind,
        p.locator_section,
        p.line_start,
        p.line_end,
        p.text_content,
        ts_rank(p.search_tsv, plainto_tsquery('portuguese', $1)) as rank
      FROM source_passages p
      JOIN source_documents d ON p.document_id = d.id
      WHERE p.search_tsv @@ plainto_tsquery('portuguese', $1)
         OR LOWER(p.text_content) LIKE LOWER($2)
      ORDER BY rank DESC
      LIMIT 6;
    `, [searchQueryText, `%${searchQueryText}%`]);

    for (const r of textRes.rows) {
      passages.push({
        id: r.id,
        documentTitle: r.doc_title,
        documentKind: r.doc_kind,
        locatorSection: r.locator_section,
        lineStart: r.line_start,
        lineEnd: r.line_end,
        textContent: r.text_content,
        rank: r.rank
      });
    }
  }

  // Se a busca textual trouxer poucas passagens, garante inclusão de passagens constitucionais básicas
  if (passages.length < 2) {
    const baseNorms = await query<{
      id: string;
      doc_title: string;
      doc_kind: string;
      locator_section: string;
      line_start: number;
      line_end: number;
      text_content: string;
    }>(`
      SELECT p.id, d.title as doc_title, d.kind as doc_kind, p.locator_section, p.line_start, p.line_end, p.text_content
      FROM source_passages p
      JOIN source_documents d ON p.document_id = d.id
      WHERE d.kind = 'law'
      LIMIT 3;
    `);

    for (const r of baseNorms.rows) {
      if (!passages.some(p => p.id === r.id)) {
        passages.push({
          id: r.id,
          documentTitle: r.doc_title,
          documentKind: r.doc_kind,
          locatorSection: r.locator_section,
          lineStart: r.line_start,
          lineEnd: r.line_end,
          textContent: r.text_content
        });
      }
    }
  }

  // 2. Travessia no Grafo (Relações de 1 a 2 saltos a partir das entidades identificadas)
  if (entityIds.length > 0) {
    const relRes = await query<{
      target_id: string;
      canonical_id: string;
      title: string;
      kind: string;
      relation_type: string;
      evidence_text: string | null;
      passage_text: string | null;
    }>(`
      SELECT 
        e.id as target_id,
        e.canonical_id,
        e.title,
        e.kind,
        r.relation_type,
        r.evidence_text,
        p.text_content as passage_text
      FROM legal_relations r
      JOIN legal_entities e ON (r.target_entity_id = e.id OR r.source_entity_id = e.id)
      LEFT JOIN source_passages p ON r.passage_id = p.id
      WHERE (r.source_entity_id = ANY($1::uuid[]) OR r.target_entity_id = ANY($1::uuid[]))
        AND e.id != ALL($1::uuid[])
      LIMIT 6;
    `, [entityIds]);

    for (const r of relRes.rows) {
      connectedEntities.push({
        id: r.target_id,
        canonicalId: r.canonical_id,
        title: r.title,
        kind: r.kind,
        relationType: r.relation_type,
        evidenceText: r.evidence_text || undefined,
        passageText: r.passage_text || undefined
      });
    }
  }

  // Se não houver relações diretas, busca entidades padrão do grafo
  if (connectedEntities.length === 0) {
    const defaultEnts = await query<{
      id: string;
      canonical_id: string;
      title: string;
      kind: string;
    }>(`
      SELECT id, canonical_id, title, kind
      FROM legal_entities
      LIMIT 4;
    `);

    for (const r of defaultEnts.rows) {
      connectedEntities.push({
        id: r.id,
        canonicalId: r.canonical_id,
        title: r.title,
        kind: r.kind,
        relationType: 'related_to'
      });
    }
  }

  return { passages, connectedEntities };
}
