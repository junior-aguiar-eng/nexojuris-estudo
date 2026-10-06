import { z } from 'zod';
import dotenv from 'dotenv';

dotenv.config();

export const ForgeLexAuthoritySchema = z.object({
  id: z.string(),
  tribunal: z.enum(['STJ', 'STF', 'TJSP', 'TRF1', 'OUTRO']).default('STF'),
  classe: z.string().optional(),
  numero: z.string().optional(),
  orgaoJulgador: z.string().optional(),
  relator: z.string().optional(),
  dataJulgamento: z.string().optional(),
  ementa: z.string(),
  tese: z.string().optional(),
  trechoFundamentacao: z.string().optional(),
  urlOficial: z.string().url().optional(),
  proveniencia: z.string().optional(),
});

export type ForgeLexAuthority = z.infer<typeof ForgeLexAuthoritySchema>;

export const ForgeLexSearchResponseSchema = z.object({
  items: z.array(ForgeLexAuthoritySchema),
  total: z.number().default(0),
  requestId: z.string().optional(),
});

export type ForgeLexSearchResponse = z.infer<typeof ForgeLexSearchResponseSchema>;

export interface SearchCaseLawOptions {
  query: string;
  tribunals?: ('STJ' | 'STF')[];
  limit?: number;
  requestId: string;
}

export class ForgeLexClient {
  private baseUrl: string;
  private apiKey: string;

  constructor(baseUrl?: string, apiKey?: string) {
    this.baseUrl = (baseUrl || process.env.FORGELEX_API_URL || 'https://api.forgelex.ia.br').replace(/\/+$/, '');
    this.apiKey = apiKey || process.env.FORGELEX_API_KEY || '';
  }

  async searchCaseLaw(options: SearchCaseLawOptions): Promise<ForgeLexSearchResponse> {
    const { query, tribunals = ['STF', 'STJ'], limit = 5, requestId } = options;

    const endpoint = `${this.baseUrl}/api/v2/research/search-case-law`;

    try {
      const response = await fetch(endpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`,
          'idempotency-key': requestId,
          'X-Client-App': 'NexoJuris/0.1.0',
        },
        body: JSON.stringify({
          query,
          tribunals,
          limit,
        }),
        signal: AbortSignal.timeout(10000), // 10s timeout
      });

      if (!response.ok) {
        const errorText = await response.text().catch(() => '');
        console.warn(`[ForgeLex Client] Resposta não-200 da API (${response.status}): ${errorText}`);
        
        // Em caso de credencial pendente ou servidor externo indisponível, retorna lista vazia segura
        return {
          items: [],
          total: 0,
          requestId
        };
      }

      const json = await response.json();
      return ForgeLexSearchResponseSchema.parse(json);
    } catch (err: any) {
      console.warn(`[ForgeLex Client] Aviso na comunicação com a API ForgeLex: ${err.message}`);
      return {
        items: [],
        total: 0,
        requestId
      };
    }
  }

  async getAuthority(id: string): Promise<ForgeLexAuthority | null> {
    const endpoint = `${this.baseUrl}/api/v2/research/get-authority/${encodeURIComponent(id)}`;

    try {
      const response = await fetch(endpoint, {
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'X-Client-App': 'NexoJuris/0.1.0',
        },
        signal: AbortSignal.timeout(8000),
      });

      if (!response.ok) return null;
      const json = await response.json();
      return ForgeLexAuthoritySchema.parse(json);
    } catch (err: any) {
      console.warn(`[ForgeLex Client] Falha ao recuperar autoridade ${id}: ${err.message}`);
      return null;
    }
  }
}

export const forgeLexClient = new ForgeLexClient();
