import { interpretQuery } from './agents/query-interpreter.ts';
import { traverseGraph } from './agents/graph-traversal.ts';
import { forgeLexClient } from '../integrations/forgelex.ts';
import { synthesizeStudy, type SynthesizedStudy } from './agents/synthesizer-agent.ts';
import { validateStudyEvidence } from './agents/evidence-validator.ts';
import { withTransaction } from '../db.ts';

export interface ExecuteStudyOptions {
  question: string;
  objective?: 'compreender' | 'comparar_doutrina' | 'comparar_jurisprudencia' | 'aplicar';
  userId?: string;
  modelId?: string;
}

export interface StudyExecutionResult {
  studyId: string;
  study: SynthesizedStudy;
  verifiedCitations: string[];
  creditsRemaining: number;
}

export async function executeStudy(options: ExecuteStudyOptions): Promise<StudyExecutionResult> {
  const { question, objective = 'compreender', userId, modelId = 'gemini-2.5-flash' } = options;
  const requestId = `req_${Date.now()}_${Math.random().toString(36).substring(2, 7)}`;

  // 1. Interpretação da Pergunta
  const interpreted = await interpretQuery(question);
  const activeObjective = options.objective || interpreted.suggestedObjective;
  const entityIds = interpreted.matchedEntities.map(e => e.id);

  // 2. Travessia do Grafo e Busca de Passagens
  const { passages, connectedEntities } = await traverseGraph(entityIds, question);

  // 3. Consulta de Jurisprudência no ForgeLex
  const forgeLexResults = await forgeLexClient.searchCaseLaw({
    query: question,
    tribunals: ['STF', 'STJ'],
    limit: 3,
    requestId
  });

  // 4. Síntese com Google Gemini / Motor Cognitivo
  const rawSynthesis = await synthesizeStudy({
    question,
    objective: activeObjective,
    passages,
    connectedEntities,
    caseAuthorities: forgeLexResults.items
  });

  // 5. Validação Factual e Anti-Alucinação
  const validation = validateStudyEvidence(rawSynthesis, passages);
  const finalStudy = validation.auditedStudy;

  // 6. Persistência Transacional no PostgreSQL e Débito de Crédito
  let studyId = requestId;
  let remainingCredits = 390;

  try {
    await withTransaction(async (client) => {
      // Criação ou identificação do usuário padrão se não logado
      let effectiveUserId = userId;
      if (!effectiveUserId) {
        const defaultUser = await client.query<{ id: string }>(`
          INSERT INTO users (email, name)
          VALUES ('estudante@nexojuris.ia.br', 'Estudante NexoJuris')
          ON CONFLICT (email) DO UPDATE SET updated_at = NOW()
          RETURNING id;
        `);
        effectiveUserId = defaultUser.rows[0].id;
      }

      // Débito no Ledger de Créditos
      const lastLedger = await client.query<{ balance_after: number }>(`
        SELECT balance_after FROM credit_ledger
        WHERE user_id = $1
        ORDER BY created_at DESC
        LIMIT 1;
      `, [effectiveUserId]);

      const currentBalance = lastLedger.rows[0]?.balance_after ?? 400;
      const cost = 3;
      remainingCredits = Math.max(0, currentBalance - cost);

      await client.query(`
        INSERT INTO credit_ledger (user_id, type, amount, balance_after, description)
        VALUES ($1, 'settle', $2, $3, $4);
      `, [effectiveUserId, -cost, remainingCredits, `Estudo gerado: "${question.slice(0, 50)}"`]);

      // Salva o Estudo
      const studyRes = await client.query<{ id: string }>(`
        INSERT INTO studies (user_id, question, objective, model_id, status)
        VALUES ($1, $2, $3, $4, 'completed')
        RETURNING id;
      `, [effectiveUserId, question, activeObjective, modelId]);
      studyId = studyRes.rows[0].id;

      // Salva as Seções
      for (let i = 0; i < finalStudy.sections.length; i++) {
        const sec = finalStudy.sections[i];
        await client.query(`
          INSERT INTO study_sections (study_id, order_index, title, content_markdown, referenced_passages)
          VALUES ($1, $2, $3, $4, $5);
        `, [studyId, i, sec.title, sec.content, JSON.stringify(sec.citations)]);
      }

      // Salva as Conexões do Estudo
      for (const conn of finalStudy.connections) {
        await client.query(`
          INSERT INTO study_connections (study_id, category, label, title, summary, passage_id)
          VALUES ($1, $2, $3, $4, $5, $6);
        `, [studyId, conn.category, conn.label, conn.title, conn.summary, conn.passageId || null]);
      }
    });
  } catch (dbErr: any) {
    console.warn(`[StudyOrchestrator] Aviso na persistência do estudo no banco: ${dbErr.message}`);
  }

  return {
    studyId,
    study: finalStudy,
    verifiedCitations: validation.verifiedCitations,
    creditsRemaining: remainingCredits
  };
}
