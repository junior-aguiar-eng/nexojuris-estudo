import { NextRequest, NextResponse } from 'next/server';
import { query } from '@/server/db.ts';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const q = searchParams.get('q') || '';

  if (q.trim().length < 2) {
    return NextResponse.json({
      legislation: { label: 'LEGISLAÇÃO', title: 'CF · art. 5º, IV e IX', action: 'Abrir dispositivo conectado ↗' },
      institute: { label: 'INSTITUTO CONECTADO', title: 'Direitos da personalidade', action: 'Explore a relação ↗' },
      jurisprudence: { label: 'JURISPRUDÊNCIA', title: 'Questões no STF e STJ', action: 'Conexões com fontes ↗' },
      doctrine: { label: 'DOUTRINA', title: 'Fundamentos e limites', action: 'Comparar posições ↗' }
    });
  }

  try {
    // Busca dispositivo correlato
    const deviceRes = await query<{ title: string }>(`
      SELECT title FROM legal_entities 
      WHERE kind = 'device' AND (LOWER(title) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1))
      LIMIT 1;
    `, [`%${q}%`]);

    // Busca conceito/instituto correlato
    const conceptRes = await query<{ title: string }>(`
      SELECT title FROM legal_entities 
      WHERE kind = 'concept' AND (LOWER(title) LIKE LOWER($1) OR LOWER(description) LIKE LOWER($1))
      LIMIT 1;
    `, [`%${q}%`]);

    const legTitle = deviceRes.rows[0]?.title || (q.toLowerCase().includes('coisa') ? 'CF · art. 5º, XXXVI' : 'CF · art. 5º, IV e IX');
    const instTitle = conceptRes.rows[0]?.title || (q.toLowerCase().includes('coisa') ? 'Segurança jurídica e imutabilidade' : 'Direitos da personalidade');

    return NextResponse.json({
      legislation: {
        label: 'LEGISLAÇÃO',
        title: legTitle,
        action: 'Abrir dispositivo conectado ↗'
      },
      institute: {
        label: 'INSTITUTO CONECTADO',
        title: instTitle,
        action: 'Explore a relação ↗'
      },
      jurisprudence: {
        label: 'JURISPRUDÊNCIA',
        title: 'Questões no STF e STJ',
        action: 'Conexões com fontes ↗'
      },
      doctrine: {
        label: 'DOUTRINA',
        title: 'Fundamentos e limites',
        action: 'Comparar posições ↗'
      }
    });
  } catch (err: any) {
    return NextResponse.json({
      legislation: { label: 'LEGISLAÇÃO', title: 'CF · art. 5º, IV e IX', action: 'Abrir dispositivo conectado ↗' },
      institute: { label: 'INSTITUTO CONECTADO', title: 'Direitos da personalidade', action: 'Explore a relação ↗' },
      jurisprudence: { label: 'JURISPRUDÊNCIA', title: 'Questões no STF e STJ', action: 'Conexões com fontes ↗' },
      doctrine: { label: 'DOUTRINA', title: 'Fundamentos e limites', action: 'Comparar posições ↗' }
    });
  }
}
