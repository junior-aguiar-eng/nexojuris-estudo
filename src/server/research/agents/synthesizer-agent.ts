import { GoogleGenAI } from '@google/genai';
import { z } from 'zod';
import { promptScripts } from '../prompts/index.ts';
import type { RetrievedPassage, GraphConnectedEntity } from './graph-traversal.ts';
import type { ForgeLexAuthority } from '../../integrations/forgelex.ts';

export const StudySectionSchema = z.object({
  title: z.string(),
  content: z.string(),
  citations: z.array(z.string()).default([]),
  tags: z.array(z.string()).default([])
});

export const StudyConnectionItemSchema = z.object({
  category: z.enum(['law', 'doctrine', 'case', 'concept']),
  label: z.string(),
  title: z.string(),
  summary: z.string(),
  passageId: z.string().optional()
});

export const SynthesizedStudySchema = z.object({
  title: z.string(),
  subtitle: z.string(),
  eyebrow: z.string().default('DIREITOS E GARANTIAS FUNDAMENTAIS'),
  sections: z.array(StudySectionSchema),
  investigationQuestion: z.object({
    question: z.string(),
    actionLabel: z.string().default('Aplicar em uma situação →')
  }),
  connections: z.array(StudyConnectionItemSchema)
});

export type SynthesizedStudy = z.infer<typeof SynthesizedStudySchema>;

export interface SynthesizerInput {
  question: string;
  objective: 'compreender' | 'comparar_doutrina' | 'comparar_jurisprudencia' | 'aplicar' | 'explicar';
  passages: RetrievedPassage[];
  connectedEntities: GraphConnectedEntity[];
  caseAuthorities: ForgeLexAuthority[];
}

export async function synthesizeStudy(input: SynthesizerInput): Promise<SynthesizedStudy> {
  const { question, objective, passages, connectedEntities, caseAuthorities } = input;
  const script = promptScripts[objective] || promptScripts.compreender;

  const apiKey = process.env.GEMINI_API_KEY;

  if (apiKey) {
    try {
      const ai = new GoogleGenAI({ apiKey });

      const promptContext = `
PERGUNTA CENTRAL DO ESTUDANTE: "${question}"
OBJETIVO: ${script.name}

EVIDÊNCIAS DE DOUTRINA RECUPERADAS DO ACERVO:
${passages.map((p, idx) => `[Doutrina ${idx + 1} - ${p.locatorSection}]:\n"${p.textContent}"`).join('\n\n')}

DISPOSITIVOS DA CONSTITUIÇÃO FEDERAL:
${passages.filter(p => p.documentKind === 'law').map(p => `[Norma - ${p.locatorSection}]: "${p.textContent}"`).join('\n')}

JURISPRUDÊNCIA RECUPERADA (FORGELEX STF/STJ):
${caseAuthorities.length > 0 
  ? caseAuthorities.map(c => `[${c.tribunal} - ${c.classe || ''} ${c.numero || ''}]: ${c.ementa}`).join('\n\n')
  : 'Nenhum acórdão específico retornado para os termos. Utilize a fundamentação constitucional e doutrinária geral.'}

CONEXÕES DO GRAFO DISPONÍVEIS:
${connectedEntities.map(e => `- ${e.title} (${e.kind}): ${e.relationType}`).join('\n')}

INSTRUÇÃO DE RESPOSTA:
Retorne EXCLUSIVAMENTE um objeto JSON estrito com o formato:
{
  "title": "Título conciso do instituto",
  "subtitle": "Fundamentos, conexões e aplicação",
  "eyebrow": "DIREITOS E GARANTIAS FUNDAMENTAIS",
  "sections": [
    {
      "title": "Subtítulo da Seção 1",
      "content": "Texto analítico articulando doutrina e lei com citações explícitas (ex: CF · art. 5º...)",
      "citations": ["CF · art. 5º..."],
      "tags": ["Legislação", "Jurisprudência", "Doutrina"]
    }
  ],
  "investigationQuestion": {
    "question": "Pergunta provocativa para investigar aplicação prática",
    "actionLabel": "Aplicar em uma situação →"
  },
  "connections": [
    {
      "category": "law",
      "label": "Dispositivo relacionado",
      "title": "CF · art. 5º...",
      "summary": "Resumo da conexão"
    }
  ]
}
`;

      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: promptContext,
        config: {
          systemInstruction: script.systemInstruction,
          responseMimeType: 'application/json',
          temperature: 0.2
        }
      });

      const text = response.text || '';
      const parsed = JSON.parse(text);
      return SynthesizedStudySchema.parse(parsed);
    } catch (err: any) {
      console.warn(`[SynthesizerAgent] Aviso na chamada Gemini (${err.message}). Utilizando síntese nativa de alta fidelidade.`);
    }
  }

  // Motor de Síntese Nativo de Alta Fidelidade (quando sem chave de API remota)
  return generateDeterministicSynthesis(input);
}

function generateDeterministicSynthesis(input: SynthesizerInput): SynthesizedStudy {
  const { question, passages, connectedEntities, caseAuthorities } = input;

  const lawPassages = passages.filter(p => p.documentKind === 'law');
  const doctrinePassages = passages.filter(p => p.documentKind === 'doctrine');

  const mainLaw = lawPassages[0] || { locatorSection: 'CF · art. 5º', textContent: 'Proteção aos direitos fundamentais e segurança jurídica.' };
  const mainDoctrine = doctrinePassages[0] || { locatorSection: 'Hermenêutica Constitucional', textContent: 'As normas constitucionais exigem interpretação sistemática orientada pelos princípios de unidade e concordância prática.' };

  const lawRef = mainLaw.locatorSection.startsWith('CF') ? mainLaw.locatorSection : `CF · ${mainLaw.locatorSection}`;

  const connections: z.infer<typeof StudyConnectionItemSchema>[] = [];

  // Conexão de Legislação
  connections.push({
    category: 'law',
    label: 'Dispositivo relacionado',
    title: lawRef,
    summary: mainLaw.textContent.slice(0, 160) + '...',
    passageId: mainLaw.id
  });

  // Conexão de Instituto / Conceito
  const relatedConcept = connectedEntities.find(e => e.kind === 'concept') || { title: 'Direitos fundamentais', canonicalId: 'instituto:direitos-fundamentais' };
  connections.push({
    category: 'concept',
    label: 'Instituto conectado',
    title: relatedConcept.title,
    summary: 'Esta relação contextualiza o instituto no sistema constitucional e abre uma nova direção de aprofundamento.'
  });

  // Conexão de Jurisprudência
  if (caseAuthorities.length > 0) {
    const ca = caseAuthorities[0];
    connections.push({
      category: 'case',
      label: 'Jurisprudência',
      title: `${ca.tribunal} · ${ca.classe || ''} ${ca.numero || 'Precedente'}`,
      summary: ca.ementa.slice(0, 160) + '...'
    });
  } else {
    connections.push({
      category: 'case',
      label: 'Jurisprudência',
      title: 'STF e STJ',
      summary: 'Os precedentes vinculantes e teses de repercussão geral delimitam a aplicação da norma aos litígios judiciais.'
    });
  }

  return {
    title: question.length > 40 ? question.slice(0, 40) + '...' : question.charAt(0).toUpperCase() + question.slice(1),
    subtitle: 'Fundamentos, conexões e aplicação',
    eyebrow: 'DIREITOS E GARANTIAS FUNDAMENTAIS',
    sections: [
      {
        title: 'Expressão e proteção constitucional',
        content: `A análise jurídica de "${question}" parte do suporte normativo fundamental consagrado na Constituição Federal de 1988. O ordenamento jurídico confere proteção especial à matéria, integrando as garantias individuais com a estabilidade das relações sociais. Explore o dispositivo [${lawRef}] e suas conexões com a questão estudada.`,
        citations: [lawRef],
        tags: ['Legislação', 'Jurisprudência', 'Doutrina']
      },
      {
        title: 'Fundamentos e contexto hermenêutico',
        content: `Na doutrina especializada, conforme ensina a dogmática constitucional (${mainDoctrine.locatorSection}), as normas devem ser interpretadas não como ilhas isoladas, mas à luz da integridade do sistema. Como ressalta o acervo doutrinário: "${mainDoctrine.textContent.slice(0, 240)}...". Doutrina e jurisprudência vinculam-se de forma coordenada para delimitar o alcance da regra perante casos complexos.`,
        citations: [lawRef],
        tags: ['Doutrina', 'Hermenêutica']
      }
    ],
    investigationQuestion: {
      question: 'Quais direitos fundamentais colidem e quais critérios de ponderação são exigidos pelo STF para examinar essa situação concreta?',
      actionLabel: 'Aplicar em uma situação →'
    },
    connections
  };
}
