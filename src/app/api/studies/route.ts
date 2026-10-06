import { NextRequest, NextResponse } from 'next/server';
import { executeStudy } from '@/server/research/study-orchestrator.ts';
import { query } from '@/server/db.ts';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { question, objective } = body;

    if (!question || typeof question !== 'string' || !question.trim()) {
      return NextResponse.json({ error: 'Pergunta obrigatória.' }, { status: 400 });
    }

    const result = await executeStudy({
      question: question.trim(),
      objective: objective || 'compreender',
    });

    return NextResponse.json(result);
  } catch (error: any) {
    console.error('Erro na API /api/studies:', error);
    return NextResponse.json(
      { error: 'Falha ao processar estudo jurídico.', details: error.message },
      { status: 500 }
    );
  }
}

export async function GET(req: NextRequest) {
  try {
    const res = await query(`
      SELECT s.id, s.question, s.objective, s.created_at,
        (SELECT json_agg(json_build_object('title', sc.title, 'category', sc.category))
         FROM study_connections sc WHERE sc.study_id = s.id) as connections
      FROM studies s
      ORDER BY s.created_at DESC
      LIMIT 20;
    `);

    return NextResponse.json({ studies: res.rows });
  } catch (error: any) {
    return NextResponse.json({ error: 'Falha ao buscar histórico de estudos.' }, { status: 500 });
  }
}
