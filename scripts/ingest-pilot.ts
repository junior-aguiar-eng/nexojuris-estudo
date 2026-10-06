import fs from 'node:fs/promises';
import crypto from 'node:crypto';
import path from 'node:path';
import { getPool, withTransaction, closePool } from '../src/server/db.ts';

const PILOT_FILE_PATH = process.env.PILOT_FILE_PATH || 'C:/Users/Boni Jr/Desktop/CPM E CPPM/output/hermeneutica-constitucional-3.1-a-3.10.2.6_ESTRUTURADO_IA.md';

interface SectionChunk {
  title: string;
  lineStart: number;
  lineEnd: number;
  text: string;
}

function parseMarkdownSections(content: string): SectionChunk[] {
  const lines = content.split('\n');
  const sections: SectionChunk[] = [];

  let currentTitle = '3. Introdução à Hermenêutica';
  let currentStart = 1;
  let currentLines: string[] = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const isHeading = line.startsWith('## ') || line.startsWith('### ') || line.startsWith('# ');

    if (isHeading && currentLines.length > 0) {
      sections.push({
        title: currentTitle,
        lineStart: currentStart,
        lineEnd: i,
        text: currentLines.join('\n').trim()
      });
      currentTitle = line.replace(/^#+\s*/, '').trim();
      currentStart = i + 1;
      currentLines = [line];
    } else {
      currentLines.push(line);
    }
  }

  if (currentLines.length > 0) {
    sections.push({
      title: currentTitle,
      lineStart: currentStart,
      lineEnd: lines.length,
      text: currentLines.join('\n').trim()
    });
  }

  return sections.filter(s => s.text.length > 50);
}

async function ingestPilot() {
  console.log('--- Iniciando Ingestão Real do Material Piloto e Grafo Inicial ---');
  const pool = getPool();

  console.log(`Lendo arquivo piloto de: ${PILOT_FILE_PATH}`);
  const rawContent = await fs.readFile(PILOT_FILE_PATH, 'utf-8');
  const hashSha256 = crypto.createHash('sha256').update(rawContent).digest('hex');
  console.log(`Hash SHA-256 calculado: ${hashSha256}`);

  const sections = parseMarkdownSections(rawContent);
  console.log(`Documento fatiado em ${sections.length} seções temáticas de doutrina.`);

  await withTransaction(async (client) => {
    // 1. Inserir ou atualizar Documento Doutrinário
    const docRes = await client.query<{ id: string }>(`
      INSERT INTO source_documents (hash_sha256, title, author, kind, metadata)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (hash_sha256) DO UPDATE SET title = EXCLUDED.title
      RETURNING id;
    `, [
      hashSha256,
      'Hermenêutica Constitucional (Tópicos 3.1 a 3.10)',
      'Doutrina Constitucional',
      'doctrine',
      JSON.stringify({ path: PILOT_FILE_PATH, sectionsCount: sections.length })
    ]);
    const doctrineDocId = docRes.rows[0].id;

    // Remove passagens antigas do mesmo documento para idempotência
    await client.query('DELETE FROM source_passages WHERE document_id = $1', [doctrineDocId]);

    // 2. Inserir passagens de doutrina com busca textual
    const passageMap = new Map<string, string>();
    for (const sec of sections) {
      const pRes = await client.query<{ id: string }>(`
        INSERT INTO source_passages (document_id, locator_section, line_start, line_end, text_content, search_tsv)
        VALUES ($1, $2, $3, $4, $5, to_tsvector('portuguese', $5))
        RETURNING id;
      `, [doctrineDocId, sec.title, sec.lineStart, sec.lineEnd, sec.text]);
      passageMap.set(sec.title, pRes.rows[0].id);
    }
    console.log(`[OK] ${sections.length} passagens doutrinárias cadastradas com sucesso.`);

    // 3. Inserir Documento da Constituição Federal de 1988
    const cfHash = crypto.createHash('sha256').update('CF88_CONSTITUICAO_FEDERAL_BRASIL_1988').digest('hex');
    const cfDocRes = await client.query<{ id: string }>(`
      INSERT INTO source_documents (hash_sha256, title, author, kind, metadata)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (hash_sha256) DO UPDATE SET title = EXCLUDED.title
      RETURNING id;
    `, [
      cfHash,
      'Constituição da República Federativa do Brasil de 1988',
      'Assembleia Nacional Constituinte',
      'law',
      JSON.stringify({ promulgated: '1988-10-05', scope: 'Constituição Federal' })
    ]);
    const cfDocId = cfDocRes.rows[0].id;
    await client.query('DELETE FROM source_passages WHERE document_id = $1', [cfDocId]);

    // Passagens constitucionais centrais
    const cfPassages = [
      {
        locator: 'Art. 5º, XXXVI',
        text: 'A lei não prejudicará o direito adquirido, o ato jurídico perfeito e a coisa julgada.'
      },
      {
        locator: 'Art. 5º, IV',
        text: 'É livre a manifestação do pensamento, sendo vedado o anonimato.'
      },
      {
        locator: 'Art. 5º, IX',
        text: 'É livre a expressão da atividade intelectual, artística, científica e de comunicação, independentemente de censura ou licença.'
      },
      {
        locator: 'Art. 102, caput e I, a',
        text: 'Compete ao Supremo Tribunal Federal, precipuamente, a guarda da Constituição, cabendo-lhe: I - processar e julgar, originariamente: a) a ação direta de inconstitucionalidade de lei ou ato normativo federal ou estadual e a ação declaratória de constitucionalidade de lei ou ato normativo federal.'
      },
      {
        locator: 'Art. 103, caput',
        text: 'Podem propor a ação direta de inconstitucionalidade e a ação declaratória de constitucionalidade: o Presidente da República, as Mesas do Senado e da Câmara, Governadores, o Procurador-Geral da República, o Conselho Federal da OAB e partidos políticos com representação no Congresso.'
      }
    ];

    const cfPassageIdMap = new Map<string, string>();
    for (const cfp of cfPassages) {
      const pres = await client.query<{ id: string }>(`
        INSERT INTO source_passages (document_id, locator_section, line_start, line_end, text_content, search_tsv)
        VALUES ($1, $2, $3, $4, $5, to_tsvector('portuguese', $5))
        RETURNING id;
      `, [cfDocId, cfp.locator, 1, 1, cfp.text]);
      cfPassageIdMap.set(cfp.locator, pres.rows[0].id);
    }
    console.log(`[OK] Dispositivos fundamentais da CF/88 cadastrados.`);

    // 4. Inserir Nós do Grafo (Legal Entities)
    const entities = [
      { id: 'BR:CF:1988:art5:inc36', kind: 'device', title: 'CF · art. 5º, XXXVI', desc: 'Proteção ao direito adquirido, ato jurídico perfeito e coisa julgada.' },
      { id: 'BR:CF:1988:art5:inc4', kind: 'device', title: 'CF · art. 5º, IV', desc: 'Livre manifestação do pensamento e vedação ao anonimato.' },
      { id: 'BR:CF:1988:art5:inc9', kind: 'device', title: 'CF · art. 5º, IX', desc: 'Livre expressão da atividade intelectual, artística, científica e comunicação.' },
      { id: 'BR:CF:1988:art102', kind: 'device', title: 'CF · art. 102', desc: 'Competência originária do STF para a guarda da Constituição e controle concentrado.' },
      { id: 'instituto:coisa-julgada', kind: 'concept', title: 'Coisa Julgada', desc: 'Eficácia que torna imutável e indiscutível a decisão de mérito não mais sujeita a recurso.' },
      { id: 'instituto:liberdade-expressao', kind: 'concept', title: 'Liberdade de Expressão', desc: 'Direito fundamental que abrange manifestação de ideias, imprensa e pensamento.' },
      { id: 'instituto:direitos-personalidade', kind: 'concept', title: 'Direitos da Personalidade', desc: 'Direitos inerentes à pessoa humana, como honra, imagem, privacidade e intimidade.' },
      { id: 'instituto:controle-constitucionalidade', kind: 'concept', title: 'Controle de Constitucionalidade', desc: 'Mecanismo de verificação da conformidade das leis com a Constituição.' },
      { id: 'instituto:mutacao-constitucional', kind: 'concept', title: 'Mutação Constitucional', desc: 'Alteração do sentido interpretativo da norma sem mudança do texto formal.' }
    ];

    const entityDbIdMap = new Map<string, string>();
    for (const ent of entities) {
      const eres = await client.query<{ id: string }>(`
        INSERT INTO legal_entities (canonical_id, kind, title, description)
        VALUES ($1, $2, $3, $4)
        ON CONFLICT (canonical_id) DO UPDATE SET title = EXCLUDED.title, description = EXCLUDED.description
        RETURNING id;
      `, [ent.id, ent.kind, ent.title, ent.desc]);
      entityDbIdMap.set(ent.id, eres.rows[0].id);
    }
    console.log(`[OK] ${entities.length} nós jurídicos populados no grafo.`);

    // 5. Inserir Arestas do Grafo (Legal Relations)
    await client.query('DELETE FROM legal_relations');

    const relations = [
      {
        source: 'instituto:coisa-julgada',
        target: 'BR:CF:1988:art5:inc36',
        passageId: cfPassageIdMap.get('Art. 5º, XXXVI'),
        type: 'governed_by',
        evidence: 'A Constituição Federal consagra a coisa julgada como garantia fundamental no art. 5º, XXXVI.'
      },
      {
        source: 'instituto:liberdade-expressao',
        target: 'BR:CF:1988:art5:inc4',
        passageId: cfPassageIdMap.get('Art. 5º, IV'),
        type: 'governed_by',
        evidence: 'Garantia constitucional expressa da manifestação do pensamento no art. 5º, IV.'
      },
      {
        source: 'instituto:liberdade-expressao',
        target: 'BR:CF:1988:art5:inc9',
        passageId: cfPassageIdMap.get('Art. 5º, IX'),
        type: 'governed_by',
        evidence: 'Livre expressão de atividade intelectual e artística no art. 5º, IX.'
      },
      {
        source: 'instituto:liberdade-expressao',
        target: 'instituto:direitos-personalidade',
        passageId: null,
        type: 'supports',
        evidence: 'Conflito e harmonização prática entre liberdade de expressão e direitos da personalidade (honra e imagem).'
      },
      {
        source: 'instituto:controle-constitucionalidade',
        target: 'BR:CF:1988:art102',
        passageId: cfPassageIdMap.get('Art. 102, caput e I, a'),
        type: 'governed_by',
        evidence: 'O STF detém competência precípua para a guarda da Constituição e o controle abstrato de normas.'
      },
      {
        source: 'instituto:mutacao-constitucional',
        target: 'BR:CF:1988:art102',
        passageId: null,
        type: 'comments_on',
        evidence: 'O papel do STF como intérprete autêntico e motor das mutações constitucionais no ordenamento brasileiro.'
      }
    ];

    for (const rel of relations) {
      const srcId = entityDbIdMap.get(rel.source);
      const tgtId = entityDbIdMap.get(rel.target);
      if (srcId && tgtId) {
        await client.query(`
          INSERT INTO legal_relations (source_entity_id, target_entity_id, passage_id, relation_type, evidence_text, method)
          VALUES ($1, $2, $3, $4, $5, 'editorial');
        `, [srcId, tgtId, rel.passageId || null, rel.type, rel.evidence]);
      }
    }
    console.log(`[OK] Arestas semânticas do Grafo Jurídico estabelecidas.`);
  });

  console.log('--- Ingestão Real Concluída com Sucesso! ---');
  await closePool();
}

ingestPilot().catch(err => {
  console.error('Falha crítica na ingestão:', err);
  process.exit(1);
});
