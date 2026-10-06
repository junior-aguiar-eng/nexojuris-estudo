# Plano de implementação — pesquisa integrada de controle de constitucionalidade

> **For agentic workers:** Use `superpowers:executing-plans` para implementar por tarefa. Execução direta, sem delegação. Checkboxes registram execução comprovada, não intenção.

**Goal:** Construir, desde a fundação atual, um circuito local de estudo jurídico integrado a partir de pergunta livre sobre controle de constitucionalidade.

**Architecture:** Next.js existente, PostgreSQL isolado, grafo relacional com evidências, ingestão administrativa e executor de pesquisa no servidor. Acervo primeiro; complementação web autorizada; interface contextual alimentada por resultados reais.

**Tech Stack:** Node >=24, npm, React/Next.js/TypeScript, PostgreSQL 18, `pg`, Zod e `pdfjs-dist`; Node test para domínio/integração e Playwright para navegador. Novas dependências serão fixadas após verificar versões, licença e compatibilidade.

**Spec:** `docs/superpowers/specs/2026-10-05-pesquisa-integrada-design.md`. Arquitetura integral e independente: `docs/architecture/site-completo.md`, que prevalece sobre pressupostos de integração dos documentos anteriores.

## Estado inicial e fronteira

Checkout observado: branch `foundation/nexojuris`, HEAD `562aa18`; nenhum arquivo alterado antes deste planejamento. Existem `StudyWorkspace.tsx`, `navigation.ts`, CSS e protótipo HTML. Dois testes de navegação passaram nesta conversa; não existem `node_modules` ou lockfile. Banco, ingestão, grafo, APIs, IA e web ainda precisam ser construídos.

Este é um plano para revisão. Não instala serviços, contrata APIs, importa obras, faz push ou publica aplicação. O plano amplo anterior continua como horizonte; este documento governa o primeiro circuito e mantém `src/`, sem migração para monorepo.

## Restrições globais

- Pergunta central e estudo integrado são a unidade de produto; não substituir por lista de resultados ou chatbot genérico.
- Conteúdo real e demonstração têm identificação distinta; nenhuma fixture deve aparecer como acervo real.
- Banco primeiro; web para lacunas e atualização, apenas fontes cadastradas e habilitadas.
- Não mostrar buscas ou links na experiência final; conservar referências discretas e evidências internas.
- Preservar doutrina, legislação e jurisprudência, modos Compreender/Comparar/Aplicar e retorno de leitura.
- Credenciais apenas no servidor; conteúdos importados não são instruções de execução.
- Uso local único nesta etapa; autenticação comercial, billing, assinaturas e deploy pertencem às etapas posteriores do site independente.
- Aceitar o arquivo piloto como enviado, sem solicitar metadados ou reformatação. O cadastro permite dados desconhecidos; publicação comercial é uma etapa distinta do teste local.

## Foco de revisão

- PDF escaneado ou extração em ordem errada: bloquear publicação e mostrar diagnóstico — tarefa 2.
- Mesma lei com redações distintas e mesmo número de processo em tribunais diferentes: não colidir identidades — tarefa 3.
- Pergunta ambígua ou fora do tema: esclarecer ou delimitar, sem encaixe artificial — tarefas 4/6.
- Fonte externa falha, muda ou redireciona para host não autorizado: limitar resultado, preservar versão e bloquear acesso — tarefa 5.
- Referência e bloco abrem o mesmo recurso; retry não duplica execução e aplicação não antecipa feedback — tarefas 6/7.

## Contratos comuns

Criar `src/features/research/contracts.ts` com tipos e schemas Zod, reutilizados pelo servidor e projeções públicas.

- `QuestionInput { question: string; objective: 'understand'|'compare'|'apply'|'explain_article'|'explain_case'; resourceId?: string; sourceVersionId?: string; answer?: string; requestId: string }`.
- `QuestionIntent { question: string; concepts: string[]; aliases: string[]; needsCurrentCheck: boolean; coverage: 'in_scope'|'outside'|'ambiguous'; clarification?: string }`.
- `EvidencePassage { id; documentId; sourceVersionId; kind: 'doctrine'|'law'|'case'; text; locator; attribution; collectedAt?; evidenceLevel }`.
- `GraphConnection { id; resourceId; sourceVersionId; passageId; relationType; reason; evidenceIds: string[]; origin: 'official'|'editorial'|'session'; kind: 'concept'|'law'|'doctrine'|'case' }`.
- `StudyResult { id; question; objective; status: 'complete'|'limited'|'clarification'|'outside_scope'; sections: { id; title; text; evidenceIds: string[] }[]; connections: GraphConnection[]; limitations: string[]; modelProfileVersion; promptVersion; createdAt }`.
- `StudyView` projeta o resultado com referências discretas e recursos disponíveis; não inclui URLs, logs de ferramentas, segredos ou prompts. Evidências completas ficam no servidor.

## Tarefa 1 — Base executável, configuração e contratos

**Arquivos:** modificar `package.json`, `tsconfig.json`, `.gitignore`; criar `package-lock.json`, `.env.example`, `compose.yaml`, `scripts/migrate.ts`, `src/server/db.ts`, `src/server/config.ts`, `src/features/research/contracts.ts`, `tests/contracts.test.ts`, `tests/db.integration.test.ts`.

**Interfaces:** `getDb(): Pool`; `readConfig(): PilotConfig`; `validateQuestion(input: unknown): QuestionInput`. Scripts npm: `db:up`, `db:migrate`, `test:integration`, `test:e2e`; manter `npm test` existente. Integração usa banco exclusivo de teste e recusa apontar para banco de trabalho.

- [ ] Verificar versões atuais oficiais e licença de cada dependência; instalar versões exatas e gerar lockfile. Conservar versões existentes se compatíveis; registrar substituição necessária com motivo.
- [ ] Validar aplicação existente: `npm test`, `npm run typecheck`, `npm run build`; corrigir incompatibilidades de scaffold antes de novos módulos.
- [ ] Escrever testes para entrada vazia/maior que 2.000 caracteres, objetivo desconhecido, artigo sem recurso/versão, configuração incompleta e banco de teste igual ao banco do piloto; executar `npm test` e confirmar falha das novas funções.
- [ ] Implementar schemas, configuração server-only e conexão PostgreSQL; migrations numeradas com tabela de controle e transação; volume local e pasta de originais ignorados pelo Git.
- [ ] Executar `npm run db:up`, `npm run db:migrate`, `npm run test:integration`, testes de domínio, typecheck e build. Docker indisponível: registrar requisito de PostgreSQL local e URI separada, sem instalar serviço por inferência.

**Entrega:** aplicação compilável e banco vazio verificável; ainda sem estudo real. Commit sugerido: `build: preparar ambiente do piloto de pesquisa`.

## Tarefa 2 — Ingestão de doutrina e preservação de passagens

**Arquivos:** criar `db/migrations/001_sources.sql`, `scripts/import-source.ts`, `scripts/publish-source.ts`, `src/features/sources/{extract,ingest,repository}.ts`, `tests/ingestion.test.ts`, `tests/ingestion.integration.test.ts` e fixtures pequenas autorizadas.

**Interfaces:** `ingestSource(input: { path: string; metadata?: SourceMetadata }): Promise<ImportReport>`; `publishSource(versionId: string, reviewer: string): Promise<void>`; `getPassage(id: string): Promise<EvidencePassage>`. Sem manifesto, derivar título do filename, tipo pelo formato e origem `owner_upload`; autoria/edição permanecem desconhecidas. O proprietário não precisa alterar ou completar o arquivo.

- [ ] Escrever testes de PDF textual e Markdown, páginas/linhas, hash repetido, importação interrompida, arquivo protegido, PDF sem texto, texto vazio e script embutido; executar `npm test` e confirmar falha inicial.
- [ ] Criar documentos, versões e passagens; guardar original pelo hash fora de `public/`. Reimportação idêntica reutiliza versão; conteúdo diferente cria versão. Falha não publica lote parcial.
- [ ] Extrair PDF por página com `pdfjs-dist`; dividir por parágrafos, até 4.000 caracteres por passagem, com continuidade por documento/localizador. Markdown mantém títulos e linhas; não renderizar HTML cru.
- [ ] Implementar relatório `draft|needs_review|failed|unchanged`, limite 50 MiB/1.000 páginas e publicação explícita por CLI. Revisar amostra da extração antes de publicar.
- [ ] Executar testes e `npm run test:integration`; importar um trecho real fornecido pelo proprietário e conferir pelo menos 10 passagens contra original. Sem material real, concluir software com fixtures e marcar aceite de corpus como pendente.

**Entrega:** doutrina consultável com proveniência e versões. Commit: `feat: importar fontes com passagens rastreáveis`.

## Tarefa 3 — Corpus constitucional e grafo jurídico

**Arquivos:** criar `db/migrations/002_graph.sql`, `scripts/{import-legal-source,review-relation}.ts`, `src/features/graph/{entities,resolve,relations,traverse}.ts`, `tests/graph.test.ts`, `tests/graph.integration.test.ts`, `docs/evaluation/corpus-controle.md`.

**Interfaces:** `resolveReference(input: ReferenceInput): Promise<ResolvedReference|UnresolvedReference>`; `proposeRelation(input: RelationInput): Promise<string>`; `reviewRelation(id: string, decision: 'publish'|'reject', reviewer: string): Promise<void>`; `getConnections(input: { resourceIds: string[]; passageId?: string; maxHops: number }): Promise<GraphConnection[]>`.

- [ ] Testar referência exata versus ambígua, CF em duas redações, processo homônimo STF/STJ, menção sem interpretação, vínculo oficial com origem, candidato não publicado, deduplicação e evidência invalidada; executar `npm test` e confirmar falha.
- [ ] Modelar nós, aliases, questões, identidades canônicas, relações, evidências e revisões. Identidade de dispositivo separada da versão; julgado inclui tribunal. Fonte alterada marca relações afetadas para revisão, sem apagar versão usada em estudo anterior.
- [ ] Importar snapshots oficiais relativos ao controle de constitucionalidade; ponto de partida: CF arts. 97, 102, 103 e 125 e dispositivos pertinentes confirmados pela pesquisa. Leis 9.868/1999 e 9.882/1999 entram como legislação complementar com versão e origem, sem assumir que todo artigo é relevante.
- [ ] Incorporar julgados reais documentados: identificação, fonte, documento disponível e passagens. Implementar catálogo e adaptadores próprios NexoJuris; no piloto, importação administrativa de originais oficiais.
- [ ] Criar taxonomia inicial de controle difuso/concentrado, ADI/ADC/ADPF/ADO, legitimidade, parâmetro, reserva de plenário, efeitos, modulação e técnicas decisórias. Extrair referências explícitas como `mentions`; revisão transforma propostas em relações semânticas publicadas.
- [ ] Conferir pelo menos 20 relações e montar inventário com cobertura por questão e lacunas. Testar travessia limitada a 2 saltos/40 nós e repetir importação sem duplicação.

**Entrega:** grafo navegável apoiado em documentos; não exige Neo4j nem rede visual. Commit: `feat: estruturar grafo jurídico com evidências`.

## Tarefa 4 — Pergunta livre e recuperação interna

**Arquivos:** criar `db/migrations/003_search.sql`, `src/features/research/{interpret,retrieve,rank}.ts`, `src/features/research/providers/{types,chat-completions,fake}.ts`, `tests/retrieval.test.ts`, `tests/retrieval.integration.test.ts`, `tests/fixtures/questions-controle.json`.

**Interfaces:** `interpretQuestion(input: QuestionInput): Promise<QuestionIntent>`; `retrieveInternal(intent: QuestionIntent): Promise<{ passages: EvidencePassage[]; connections: GraphConnection[]; gaps: string[] }>`; `ModelExecutor.generate(input: { task; messages; schema; signal }): Promise<unknown>`.

- [ ] Criar conjunto revisado de 30 perguntas da especificação, com materiais esperados, aceitações alternativas e falhas proibidas; separar 10 para ajuste e 20 para avaliação preservada. Incluir paráfrases e perguntas sem terminologia técnica.
- [ ] Escrever testes de pergunta natural, busca literal de dispositivo, aliases, negação, ambiguidade, fora do tema, documento em rascunho e redação histórica; executar `npm test` e confirmar falha.
- [ ] Implementar adaptador configurável e fake exclusivo de testes; perfil valida limites de contexto/saída. Interpretação produz JSON validado; falha não autoriza ferramentas novas ou gasto adicional.
- [ ] Implementar índice full-text português com GIN, resolução literal e aliases. Unir candidatos por ID; ordenar correspondência explícita, pertinência textual e caminho comprovado no grafo; limitar a 20 passagens, sem usar quantidade de julgados como dominância.
- [ ] Pergunta ambígua retorna esclarecimento e fora do recorte retorna limite. Nenhum conceito detectado vira relação publicada apenas por saída do modelo.
- [ ] Rodar testes e medir recuperação: pelo menos uma passagem relevante entre as 10 primeiras em 16/18 perguntas respondíveis; registrar desempenho por paráfrase. Se falhar, corrigir interpretação/aliases/ranking e repetir apenas conjunto de ajuste; persistência da falha abre decisão específica de embeddings, sem alegar piloto aprovado.

**Entrega:** pergunta conecta fontes internas antes da geração de texto. Commit: `feat: recuperar evidências a partir de pergunta livre`.

## Tarefa 5 — Complementação web controlada

**Arquivos:** criar `src/features/research/web/{registry,search,fetch,extract}.ts`, `scripts/configure-web-source.ts`, `tests/web-policy.test.ts`, `tests/web.integration.test.ts`, `docs/architecture/web-sources.md`.

**Interfaces:** `searchApprovedSources(intent: QuestionIntent, gaps: string[], signal: AbortSignal): Promise<WebEvidenceReport>`; `WebSourcePolicy { id; allowedHosts; allowedPaths; enabled; searchMethod; approvedAt }`.

- [ ] Inspecionar gratuitamente métodos de pesquisa e termos das fontes propostas; registrar URL, método real e parser de cada adaptador. Ativar somente fontes expressamente autorizadas; indisponibilidade de fonte não bloqueia o circuito interno.
- [ ] Testar banco suficiente sem chamada web, necessidade de atualização, host não autorizado, redirect, endereço privado, timeout, HTML com instrução maliciosa, conteúdo removido e resultado sem documento acessível; confirmar falha com `npm test`.
- [ ] Implementar pesquisa apenas em adaptadores registrados, máximo 3 consultas/5 documentos. Não usar resultados de snippet como inteiro teor. Validar destino e redirecionamentos, restringir endereços privados e tamanho de resposta; conteúdo externo é evidência, não comando.
- [ ] Registrar snapshot/hash/data/localizador e condição de uso; não incorporar relações externas ao grafo publicado sem revisão. Consulta envia termos públicos, sem texto doutrinário privado integral.
- [ ] Falha web retorna lacunas; atualidade não verificada permanece explícita. Executar testes com respostas gravadas e smoke gratuito por fonte habilitada; distinguir replay de teste real.

**Entrega:** complementação auditável e invisível na UI. Commit: `feat: complementar pesquisa em fontes autorizadas`.

## Tarefa 6 — Executor de estudo integrado e roteiros

**Arquivos:** criar `db/migrations/004_studies.sql`, `src/features/research/{execute,evidence-check,study-repository}.ts`, `src/features/research/prompts/{understand,compare,apply,explain-resource}.ts`, `src/app/api/studies/route.ts`, `src/app/api/studies/[id]/route.ts`, `tests/execution.test.ts`, `tests/execution.integration.test.ts`.

**Interfaces:** `executeStudy(input: QuestionInput, signal: AbortSignal): Promise<StudyResult>`; `verifyEvidence(result: StudyResult, passages: EvidencePassage[]): EvidenceCheck`; `getStudyView(id: string): Promise<StudyView>`.

- [ ] Testar sequência banco→web condicional→síntese, citação inventada, texto literal alterado, fonte insuficiente, relação sem suporte, pergunta ambígua, teto de ferramentas, cancelamento, falha do modelo, retry e resposta do aluno ausente; confirmar falha.
- [ ] Implementar prompts versionados por objetivo: compreender integra fontes em torno da questão; comparar delimita posições e fundamentos; aplicar entrega questão e só corrige após resposta; explicar recurso respeita versão e nível documental.
- [ ] Executor controla 3 chamadas de modelo/120 segundos, limites de busca e contexto. Gerar somente com passagens; conexão da sessão exige evidência e origem `session`. Modelo não grava diretamente no banco nem altera permissões.
- [ ] Validar IDs, citações diretas e formato antes de disponibilizar; uma correção cabe no teto de chamadas, caso contrário entregar erro diagnosticado. Verificação estrutural é acompanhada de avaliação humana do suporte jurídico.
- [ ] Persistir execução, versão do roteiro/modelo, resultados e evidências. `requestId` único: repetição idêntica reutiliza execução, payload diferente retorna conflito; nova intenção usa novo ID. Não chamar modelo ao reabrir estudo.
- [ ] API `POST /api/studies`: 400 entrada inválida, 409 conflito, 503 modelo não configurado; resultados jurídicos limitados/esclarecimento retornam estado próprio. `GET /api/studies/[id]` retorna projeção pública. Timeout não publica estudo incompleto como concluído.
- [ ] Executar testes e uma geração real somente com executor disponível e consumo autorizado, ou modelo local. Sem executor real, registrar gate pendente e manter testes simulados rotulados.

**Entrega:** estudo integrado persistido e rastreável. Commit: `feat: gerar estudo integrado com roteiros verificáveis`.

## Tarefa 7 — Interface contextual ligada à pesquisa

**Arquivos:** modificar `src/features/study/StudyWorkspace.tsx`, `src/features/study/navigation.ts`, `src/app/globals.css`; criar `src/features/study/{SearchBar,ReadingPane,ConnectionRail,ConnectionDetail,ComparisonView,PracticeView}.tsx`, `src/app/meus-estudos/page.tsx`, `src/app/api/connections/suggest/route.ts`, `playwright.config.ts`, `tests/e2e/study.spec.ts`.

**Interfaces:** consumir `StudyView` e endpoints da tarefa 6; ampliar `ConnectionRef` para conceito e identidade de versão/contexto. Uma referência e um bloco com mesmo destino compartilham painel; contexto original e trilha de leitura permanecem preservados.

Adicionar `GET /api/connections/suggest?q=...`: busca literal/full-text e aliases no grafo publicado, retorna até 6 conexões com evidência, sem modelo ou web. Adicionar `GET /api/studies?saved=true|false` com cartões por data e `PATCH /api/studies/[id]` com `{ saved: boolean }`; coluna `saved` na migration de estudos. Endpoints do piloto continuam restritos ao ambiente local.

- [ ] Escrever E2E para pergunta real, loading/erro/cancelamento, referências sem URLs, seleção por trecho, retorno, mesmo destino sem duplicação, comparação compartilhada, aplicação sem correção antecipada e estudo reaberto sem nova geração. Executar `npm run test:e2e` e confirmar falha.
- [ ] Separar componentes sem refazer o projeto; substituir fixture fixa de coisa julgada pelos resultados do servidor. Antes de resultado, sugestões somente a partir de consulta interna read-only, sem geração paga a cada tecla; debounce de 400 ms, mínimo 3 caracteres e cancelamento de resposta obsoleta.
- [ ] Leitura central e blocos mostram conexões por seção; rolagem pode atualizar contexto, mas não troca painel selecionado automaticamente. Conceito conectado pode iniciar novo estudo com retorno preservado, identificado como nova execução.
- [ ] Comparar/Aplicar usam a pergunta central e evidências compartilhadas. Histórico local em cartões permite salvar/retomar; conteúdo reaberto mantém versão e data, atualização é ação explícita.
- [ ] No celular, detalhe ocupa superfície própria com retorno ao trecho; validar teclado, foco, movimento reduzido e 320/736/1.024/1.440 px. Remover links de buscas da experiência; protótipo permanece referência separada de desenvolvimento.
- [ ] Rodar `npm test`, `npm run test:integration`, `npm run test:e2e`, `npm run typecheck`, `npm run build`; conferir visualmente contra prints sem exigir reprodução exata.

**Entrega:** circuito pergunta→estudo→conexão→retorno utilizável. Commit: `feat: conectar experiência de estudo à pesquisa integrada`.

## Tarefa 8 — Avaliação jurídica e conclusão do primeiro teste

**Arquivos:** criar `scripts/evaluate-pilot.ts`, `docs/evaluation/piloto-controle-constitucionalidade.md`, `tests/pilot.integration.test.ts`.

- [ ] Rodar as 30 perguntas com corpus e executor reais; registrar pergunta, resposta, evidências, versões, latência, consumo técnico e falhas. Logs locais não entram no Git com conteúdo doutrinário privado.
- [ ] Proprietário revisa pertinência, integração e suporte jurídico; pontuação de recuperação e testes automáticos não substituem essa revisão.
- [ ] Exigir zero fontes/citações inventadas, zero conexões sem evidência, tratamento adequado dos 12 casos especiais e aprovação de pelo menos 16/18 respondíveis; reportar resultados separadamente no conjunto de avaliação preservado.
- [ ] Corrigir falhas encontradas e acrescentar regressões proporcionais; reexecutar casos afetados e suite final. Documentar falhas residuais e cobertura sem declarar validação geral.
- [ ] Registrar versão do corpus, HEAD, executor, resultados e procedimento de reprodução. Conclusão não publica nem ativa cobrança.

**Entrega:** evidência de que o núcleo funciona no recorte escolhido, ou diagnóstico preciso do que impede aprovação. Commit: `test: avaliar estudo integrado de controle de constitucionalidade`.

## Ordem, dependências e gates externos

Ordem: 1 → 2 → 3 → 4 → 5 → 6 → 7 → 8. Se fontes externas estiverem indisponíveis, a tarefa 5 entrega política e adaptador indisponível explícito; seguir circuito interno, sem contar atualização web como aprovada. Cada tarefa passa seus testes antes da seguinte; registrar status e evidência, sem marcar implementação apenas por documento escrito.

O código pode avançar com fixtures pequenas; o aceite real exige doutrina de controle de constitucionalidade fornecida pelo proprietário, corpus jurisprudencial oficial e modelo real. Credenciais, fontes autorizadas e condições de uso são entradas operacionais, não decisões técnicas deixadas ao implementador. A ausência de cada entrada limita apenas seu teste real.

Não há estimativa em dias antes de validar ambiente e primeiros documentos. Marcos verificáveis: A — fontes importadas (1–2); B — pergunta encontra evidências e relações (3–5); C — estudo utilizável (6–7); D — avaliação do piloto (8).

Após revisão deste plano, implementação direta por tarefa. Mudanças de cobertura, contratação, publicação ou arquitetura de embeddings exigem decisão específica; não reabrir escolhas já aprovadas sem evidência nova. Não há dependência de outro produto jurídico.
