# NexoJuris MVP Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking. Execução direta, sem delegação, salvo solicitação posterior do proprietário.

**Goal:** Entregar um ambiente constitucional de estudo por institutos com conexões verificáveis, análise por IA, consumo controlado e pagamento integrado.

**Architecture:** Monólito modular web com Next.js, uma base PostgreSQL isolada para o NexoJuris e um worker de ingestão/atualização. A aplicação web orquestra busca, autorização, orçamento e respostas; adaptadores encapsulam fontes, ForgeLex, provedores de IA e Mercado Pago. O reaproveitamento do ForgeLex é condicionado à inspeção de contratos e isolamento de dados, sem alterações presumidas em produção.

**Tech Stack:** Proposta: Next.js/React/TypeScript, Radix para primitivas acessíveis, CSS com tokens próprios, PostgreSQL com pesquisa textual e pgvector, worker Python e Docker; Google Cloud para aplicação, jobs, armazenamento e segredos. Versões e serviços específicos serão registrados na inspeção técnica, antes do scaffold.

**Spec:** `docs/superpowers/specs/nexojuris-mvp.md`.

## Global Constraints

- Recorte inicial: Constituição Federal.
- Doutrina, legislação e jurisprudência permanecem visíveis na experiência.
- Não retirar os modos Compreender, Comparar e Aplicar; centralizar destinos e ferramentas compartilhadas.
- Marca: #0F4C5C; superfície suave: #E6F0F2; fundo: #F8F9FA; cards: #FFFFFF; texto: #1A252C; metadados legíveis: #596973; divisores: #E2E8F0.
- Inter; texto jurídico de 16 px com entrelinha 1,7; telas de 320 a 1.440 px devem permanecer utilizáveis.
- Nenhum autor, citação, julgado ou preço fictício em produção.
- Nenhuma chave de API no navegador; todo débito validado no servidor.
- Não importar os 400 créditos, os preços 0/1/3/8 ou os limites do protótipo como política comercial definitiva.
- Não modificar infraestrutura ForgeLex em produção como parte da inspeção inicial.
- Rascunhos e sugestões automáticas nunca aparecem como associações oficiais.

## Review Focus

- Mesmo artigo em versões diferentes: abrir e citar a redação correta, preservando histórico; teste da tarefa 2.
- Uma relação acessada pelo bloco ou pelo texto: destino e estado únicos, sem perder leitura; teste da tarefa 1.
- Fonte removida ou coletor com falha: manter última versão validada e indicar atualização pendente; teste da tarefa 8.
- Webhook repetido, duas abas ou retry após timeout: não duplicar crédito, débito ou franquia; testes das tarefas 6 e 7.
- Acervo insuficiente ou questões de competência distintas: não fabricar equivalência nem posição dominante; testes das tarefas 4 e 5.

## Organização e dependências

Este documento é o plano coordenador de três entregas: experiência e fontes reais (tarefas 1–3), estudo por IA e economia de uso (4–7), operação e lançamento (8–9). Cada tarefa entrega uma capacidade verificável; a divisão não exige três projetos de infraestrutura.

Os caminhos abaixo são **propostos para um novo projeto**. Não são arquivos inspecionados do ForgeLex. A tarefa 0 identifica o repositório de destino, seus padrões e os caminhos existentes; se houver diferenças, atualizar o mapa antes de editar código.

```text
apps/web/src/app/                     páginas públicas, estudo, conta e operação
apps/web/src/features/study/          busca, leitura e navegação contextual
apps/web/src/features/sources/        fontes, dispositivos e relações
apps/web/src/features/research/       recuperação, citações e análises
apps/web/src/features/usage/          orçamento, tarifas e ledger
apps/web/src/features/account/        autenticação, histórico e pagamento
apps/worker/nexojuris/                importação e atualização
packages/contracts/src/              contratos compartilhados em TypeScript
db/migrations/                       esquema e índices
tests/unit/                          invariantes de domínio
tests/integration/                   banco, fontes e provedores simulados
tests/e2e/                           percursos reais do navegador
ops/                                 implantação e rotina operacional
```

## Tarefa 0 — Inspecionar infraestrutura e fechar contratos de integração

**Arquivos:** criar `docs/architecture/infrastructure-inventory.md`, `docs/architecture/decisions.md`, `ops/dependencies.lock.md`.

**Interfaces:** consome acesso autorizado ao repositório e documentação ForgeLex. Produz inventário sem segredos, tabela de serviços reutilizáveis e versão real de cada contrato/API; registro explícito da correspondência alias → fornecedor → ID do modelo.

- [ ] Identificar repositórios, ambientes, autenticação, banco, armazenamento, mecanismo de jobs e integrações existentes, apenas por leitura.
- [ ] Registrar quais componentes podem ser reutilizados e quais exigem isolamento; definir banco próprio ou esquema isolado, credenciais e armazenamento do NexoJuris.
- [ ] Conferir condições e formatos de acesso às fontes, autorização das obras, IDs de modelos, região e custos dos serviços. Registrar impedimentos concretos, sem presumir APIs públicas.
- [ ] Escolher versões fixadas e destino dos serviços Google Cloud, com ambiente de homologação separado.
- [ ] Validar inventário contra configurações reais e registrar decisões. Commit apenas da documentação sanitizada.

**Conclusão:** integração definida sem copiar dados privados, alterar produção ou expor credenciais. Se faltar acesso, esta tarefa é bloqueio explícito para infraestrutura real, não para validação do protótipo.

## Tarefa 1 — Converter o protótipo em frontend com navegação única

**Arquivos:** criar `apps/web/src/features/study/{StudyWorkspace,SearchBar,ReadingPane,ConnectionRail,ConnectionDetail}.tsx`, `apps/web/src/features/study/navigation.ts`, `apps/web/src/styles/tokens.css`, `apps/web/src/app/{page,estudo/page,meus-estudos/page}.tsx`, `tests/e2e/study-navigation.spec.ts`.

**Interfaces:** produzir `ConnectionRef { id: string; kind: 'law'|'doctrine'|'case'; passageId: string }`, `StudyNavState { passageId: string; selected: ConnectionRef|null; trail: ConnectionRef[] }` e `openConnection(state: StudyNavState, ref: ConnectionRef): StudyNavState` em `packages/contracts/src/study.ts` / `navigation.ts`.

- [ ] Escrever teste: texto e bloco abrem o mesmo `id`; repetir clique não adiciona histórico; voltar restaura seleção e passagem; rail mantém as três categorias; Comparar conduz à ferramenta contextual existente.
- [ ] Rodar `pnpm exec playwright test tests/e2e/study-navigation.spec.ts`; confirmar falha pelos comportamentos ausentes.
- [ ] Implementar componentes e reducer; atualizar conexões por passagem visível com IntersectionObserver e estabilizar seleção até a intenção do usuário mudar. Não alternar painel aberto só porque a rolagem mudou.
- [ ] Aplicar identidade aprovada, preparar SVG final do símbolo e fonte carregada; busca lateral é diferente da animação de execução, que termina em sucesso, falha ou cancelamento.
- [ ] Validar teclado, foco, retorno, movimento reduzido e layouts 320/736/1.024/1.440 px; rodar o teste e `pnpm typecheck`. Commit da tarefa.

**Conclusão:** experiência navegável sem repetição de ferramentas; usa fixtures rotuladas até a tarefa 3.

## Tarefa 2 — Modelar e importar Constituição, fontes e relações oficiais

**Arquivos:** criar `db/migrations/001_sources.sql`, `apps/worker/nexojuris/{models,import_stf,import_corpus927,import_doctrine}.py`, `apps/web/src/features/sources/repository.ts`, `tests/integration/test_source_import.py`.

**Interfaces:** produzir tabelas `legal_device`, `device_version`, `source_document`, `source_version`, `source_passage`, `legal_relation`. `legal_relation` possui `device_version_id`, `passage_id`, `origin`, `status`, `source_url` e `collected_at`. Origens: `official`, `editorial`, `suggested`; estados: `draft`, `published`, `retired`.

`ingest_snapshot(source: str, content: bytes, collected_at: datetime) -> ImportReport` retorna `{created_versions, unchanged, draft_relations, rejected}`. `getDevice(deviceId: string, at?: string): Promise<DeviceWithRelations>` lê apenas relações publicadas.

- [ ] Criar fixtures reais pequenas e autorizadas; teste garante identidade por dispositivo, duas redações distintas, hash repetido sem duplicação e localizador preservado. Testar registro malformado em quarentena.
- [ ] Rodar `uv run pytest tests/integration/test_source_import.py -q` e confirmar falha inicial.
- [ ] Implementar migrations e adaptadores para os formatos confirmados na tarefa 0; armazenar originais no armazenamento de objetos, metadados e relações no banco.
- [ ] Importar primeiro um lote representativo que inclua os três institutos do protótipo, registrando cobertura e lacunas. Obras sem autorização cadastrada permanecem fora do acervo publicado.
- [ ] Conferir manualmente amostra de texto e vínculos contra originais; repetir importação e provar idempotência. Rodar testes. Commit.

**Conclusão:** dispositivo e julgado relacionados abrem por dados reais e rastreáveis, sem IA.

## Tarefa 3 — Busca híbrida e benchmark de embeddings

**Arquivos:** criar `db/migrations/002_search.sql`, `apps/web/src/features/research/{retrieval,ranking}.ts`, `apps/worker/nexojuris/embed.py`, `tests/fixtures/retrieval-gold.json`, `tests/integration/retrieval.test.ts`, `docs/evaluation/embeddings.md`.

**Interfaces:** produzir `retrieve(query: string, filters: RetrievalFilters, limit: number): Promise<RetrievedPassage[]>`; passagem contém `id`, `sourceVersionId`, `locator`, `text`, `score` e `origin`. Filtros incluem versão, tipo de fonte e tribunal quando aplicável. `embed_passages(model_id: str, passage_ids: list[str]) -> EmbeddingReport`.

- [ ] Elaborar 60 perguntas jurídicas com passagens relevantes revisadas, incluindo 10 consultas sem resposta e 10 citações exatas de dispositivos. Separar ajuste e avaliação.
- [ ] Criar teste de busca por instituto, artigo e trecho literal; resultado não contém fonte em rascunho nem versão excluída pelo filtro. Rodar `pnpm exec vitest run tests/integration/retrieval.test.ts` e confirmar falha.
- [ ] Comparar pelo menos dois embeddings disponíveis em português jurídico; registrar recall@10, nDCG@10, latência, custo de indexação e espaço. Registrar fornecedor, versão e dimensão do vencedor.
- [ ] Implementar full-text em português, índice vetorial e fusão de resultados; testar reranking como opção, não dependência obrigatória. Indexar o acervo inteiro somente depois da decisão.
- [ ] Verificar consultas exatas e filtros; publicar relatório de benchmark e testes. Commit.

**Conclusão:** busca retorna passagens úteis e não apenas similaridade aparente; troca de embedding exige índice versionado e reindexação controlada.

## Tarefa 4 — Explicação por IA com citações verificáveis

**Arquivos:** criar `packages/contracts/src/research.ts`, `apps/web/src/features/research/{providers,compose,verify-citations}.ts`, `tests/unit/citations.test.ts`, `tests/integration/research.test.ts`.

**Interfaces:** produzir `ModelAlias = 'Luna'|'Flash'|'Sonnet'|'Opus'`, configuração `ModelProfile { alias; provider; apiModelId; contextLimit; outputLimit }`, `Citation { passageId; sourceVersionId; locator; quote?: string }`, `StudyResult { sections; citations; missingEvidence; modelProfileVersion }`.

`composeStudy(input: { query: string; passages: RetrievedPassage[]; model: ModelProfile }): Promise<StudyResult>`; `verifyCitations(result: StudyResult, passages: RetrievedPassage[]): CitationCheck`.

- [ ] Escrever testes: recusar ID de fonte inventado; citação direta precisa corresponder à passagem; fonte insuficiente produz `missingEvidence`; instruções presentes nos documentos não alteram regras do sistema.
- [ ] Rodar `pnpm exec vitest run tests/unit/citations.test.ts tests/integration/research.test.ts` e confirmar falha inicial.
- [ ] Implementar adaptadores de provedores, geração estruturada e verificação de referências. Limitar contexto e saída ao perfil; não registrar chaves ou conteúdo integral em logs.
- [ ] Conectar ao frontend com streaming e tratamento de cancelamento; não publicar citação ainda não validada como fato confirmado. Integrar consumo real apenas após tarefa 6.
- [ ] Avaliar lote revisado de respostas: nenhum identificador fictício e citações diretas verificadas; documentar casos de insuficiência. Rodar testes. Commit.

**Conclusão:** uma explicação pode ser auditada até suas passagens de origem. Não prometer precisão sem revisão e medição.

## Tarefa 5 — Comparação doutrinária, jurisprudencial e aplicação

**Arquivos:** criar `apps/web/src/features/research/{compare-doctrine,compare-cases,practice}.ts`, `apps/web/src/features/study/{ComparisonView,PracticeView}.tsx`, `tests/unit/comparison.test.ts`.

**Interfaces:** produzir `ComparisonScope { question; deviceVersionId; dateCutoff? }`, `ComparisonResult { scope; positions; commonGround; differences; evidence; prevailingAssessment: { status: 'supported'|'divergent'|'insufficient'; criterion; citations } }`.

`compareCases(scope: ComparisonScope, passages: RetrievedPassage[]): Promise<ComparisonResult>`; `compareDoctrine` usa o mesmo contrato. `assessAnswer(input: { question; answer; passages }): Promise<{ feedback; citations; missingEvidence }>`.

- [ ] Testar questões de competência diferentes sem rótulo de conflito; tribunal sem evidência com lacuna expressa; mera contagem de julgados não sustenta dominância; ausência de autor impede comparação atribuída.
- [ ] Rodar `pnpm exec vitest run tests/unit/comparison.test.ts` e confirmar falha.
- [ ] Implementar ferramentas compartilhadas por bloco e modo Comparar; exibir datas, tipo de precedente e critérios. Não apresentar STF e STJ como instâncias equivalentes em matéria constitucional.
- [ ] Implementar aplicação por questão delimitada e correção fundamentada, com prompts prontos que explicitam atividade e escopo, em vez de campos ocultos ilimitados.
- [ ] Validar exemplos jurídicos e navegação sem destino duplicado. Rodar testes. Commit.

**Conclusão:** comparação explica convergência, diferença ou insuficiência e preserva a experiência visual.

## Tarefa 6 — Tarifas, margem, créditos e cotas

**Arquivos:** criar `db/migrations/003_usage.sql`, `apps/web/src/features/usage/{quote,ledger,quotas,costing}.ts`, `packages/contracts/src/usage.ts`, `tests/integration/usage.test.ts`, `docs/business/tariffs.md`.

**Interfaces:** `quoteActivity(input: { userId; activity; modelAlias; scope }): Promise<UsageQuote>` retorna `{quoteId, tariffVersion, maxCredits, expiresAt, scope, modelAlias}`. `reserveUsage(userId: string, quoteId: string, idempotencyKey: string): Promise<Reservation>`; `settleUsage(reservationId: string, outcome: ExecutionOutcome): Promise<UsageReceipt>`.

Ledger é append-only com reserva, débito e estorno; saldo calculado de lançamentos, sem gravação direta enviada pelo cliente. `checkQuota(userId, now)` avalia janelas diária, semanal e ciclo mensal separadamente, com regras e fuso documentados.

- [ ] Testar duas reservas concorrentes sem saldo negativo, retry sem débito repetido, cotação vencida, troca de modelo invalidando orçamento e limites diário/semanal/mensal. Falha antes da entrega libera a reserva; definir e testar política explícita para resultado parcial e cancelamento.
- [ ] Rodar `pnpm exec vitest run tests/integration/usage.test.ts` e confirmar falha.
- [ ] Montar planilha ou relatório de custo por atividade: API de entrada/saída, busca, embeddings amortizados, infraestrutura variável, pagamentos e rateio fixo por cenários de assinantes. Definir margem de contribuição e resultado operacional separadamente.
- [ ] Definir planos e tarifas só após medição das tarefas 3–5; versionar valores em unidade inteira e fixar escopo de cada atividade. Não extrapolar preços simulados.
- [ ] Implementar reserva atômica, limites de execução, conciliação e painel didático. Cobrança final não excede `maxCredits` sem nova autorização explícita.
- [ ] Rodar testes concorrentes e cenários de alto uso; commit. Serviços pagos entram no ambiente de teste com limites controlados.

**Conclusão:** cada usuário entende o máximo de consumo e a operação mede custo e margem reais.

## Tarefa 7 — Conta, Mercado Pago e retenção

**Arquivos:** criar `db/migrations/004_accounts.sql`, `apps/web/src/features/account/{auth,mercado-pago,study-history,retention}.ts`, `apps/web/src/app/api/payments/webhook/route.ts`, `tests/integration/account.test.ts`.

**Interfaces:** `applyPaymentEvent(event: VerifiedPaymentEvent): Promise<PaymentResult>`; `saveStudy(userId: string, studyId: string): Promise<SaveResult>`; `listStudies(userId: string, filter: StudyFilter): Promise<StudyCard[]>`; `expireTemporaryStudies(now: Date): Promise<RetentionReport>`.

`RetentionPolicy { temporaryDays; savedLimit; backupRetentionDays }` e `PlanPolicy` vêm da configuração comercial da tarefa 6. Autenticação existente só será reutilizada após validação da tarefa 0.

- [ ] Testar isolamento entre usuários, webhook duplicado/fora de ordem, evento não autenticado sem crédito, confirmação consultada no provedor, limite de salvos sem apagar outro estudo e expiração apenas de temporários.
- [ ] Rodar `pnpm exec vitest run tests/integration/account.test.ts` e confirmar falha.
- [ ] Implementar autenticação, checkout homologado e webhook validado; status do navegador não concede franquia. Pagamento confirmado cria lançamento único e período de assinatura consistente.
- [ ] Implementar histórico em cartões, busca, salvar/desmarcar/excluir e limite explícito. Separar histórico do usuário, acervo, logs e registros financeiros; exclusão de estudo não apaga ledger.
- [ ] Implementar expiração programada e ciclo de vida de anexos/resultados derivados; backups têm retenção e restauração com reaplicação de exclusões.
- [ ] Validar sandbox Mercado Pago e isolamento por usuário. Rodar testes. Commit.

**Conclusão:** assinatura e retenção funcionam sem duplicar concessões nem transformar pesquisas em armazenamento ilimitado.

## Tarefa 8 — Atualização incremental e revisão editorial

**Arquivos:** criar `apps/worker/nexojuris/{update_sources,diff,review_queue}.py`, `apps/web/src/app/operacao/fontes/page.tsx`, `tests/integration/test_updates.py`, `ops/update-runbook.md`.

**Interfaces:** `update_source(source_id: str) -> UpdateReport` e `publish_review(review_id: str, reviewer_id: str) -> PublishReport`. Relatório distingue conteúdo novo, mudança de redação, alteração de vínculo, erro e ausência de mudança.

- [ ] Testar falha de coleta mantendo última versão publicada, mudança detectada sem sobrescrever histórico, retirada de vínculo registrada, reexecução idempotente e nova publicação autorizada.
- [ ] Rodar `uv run pytest tests/integration/test_updates.py -q` e confirmar falha inicial.
- [ ] Implementar job diário proposto às 06h America/Fortaleza, com limites por fonte, retry e captura de hash. Selecionar intervalo definitivo conforme condições e frequência reais da fonte.
- [ ] Colocar mudanças ambíguas e conexões inferidas em fila de revisão. Atualização de metadados segura pode ser automática; mudanças jurídicas ficam rastreáveis e versionadas.
- [ ] Usar IA opcionalmente para classificar mudanças, nunca como única prova de atualização ou publicador irrestrito. DOTS não é dependência da operação; coletor determinístico e job são o núcleo.
- [ ] Exibir coleta e versão por fonte, publicar amostra revisada e testar recuperação de falha. Commit.

**Conclusão:** atualização é um processo observável e recuperável, não uma promessa de um agente.

## Tarefa 9 — Área pública, implantação e piloto

**Arquivos:** criar `apps/web/src/app/{como-funciona,acervo,planos}/page.tsx`, `ops/{deploy,rollback,observability}.md`, `tests/e2e/mvp-journey.spec.ts`, `docs/evaluation/pilot.md`.

**Interfaces:** consome os contratos anteriores. Produz release homologada, roteiro de rollback, matriz de cobertura publicada e métricas de confiabilidade, qualidade, custo e usabilidade.

- [ ] Escrever percurso: visitante conhece proposta e cobertura, entra, recebe orçamento, pesquisa, abre fonte, compara, salva, retoma, acompanha consumo e recebe crédito de pagamento confirmado sem duplicação.
- [ ] Rodar `pnpm exec playwright test tests/e2e/mvp-journey.spec.ts` e confirmar falhas de integração antes de implementá-las.
- [ ] Implementar área pública minimalista sem preços fictícios, login e plano coerentes com tarefa 6. Preparar deploy de homologação com segredos, migrações, backups, limites e logs sanitizados.
- [ ] Rodar `pnpm typecheck`, testes unitários/integração, E2E e testes Python; verificar referência, custo, latência e recuperação de falha. Não repetir suíte completa sem mudança ou preocupação concreta.
- [ ] Fazer piloto pequeno com usuários convidados; medir conclusão da pesquisa, abertura de fonte, compreensão do preço, tempo até primeira passagem e caminhos redundantes.
- [ ] Corrigir falhas observadas, registrar evidências e plano de rollback. Implantação pública e configuração do domínio só entram na execução quando solicitadas; não estão autorizadas por este documento de planejamento.

**Conclusão:** MVP operacional e mensurado, com piloto aprovado antes de expansão do acervo.

## Ordem de execução e marcos

1. Inspeção técnica e navegação: tarefas 0–1.
2. Primeiro circuito real sem IA: tarefas 2–3. Marco: artigo → passagem → julgado abre e retorna corretamente.
3. Primeiro estudo rastreável: tarefas 4–5. Marco: explicação e comparação apoiadas no lote validado.
4. Operação comercial homologada: tarefas 6–7. Marco: orçamento, consumo, assinatura e histórico conciliados.
5. Atualização e piloto: tarefas 8–9. Marco: mudanças de fonte versionadas e percurso validado com usuários.

Prazo e custo total só serão estimados após tarefa 0 e primeiro lote de ingestão. Não há base para prometer uma data sem conhecer ForgeLex, qualidade das obras e acessibilidade das fontes.

## Revisão do próprio plano

Cobertura conferida: identidade e frontend (1/9), três categorias e fluxo (1/5), CF e origens (2/8), embeddings (3), fidelidade e modelos (4), comparação e aplicação (5), margem/cotas (6), Mercado Pago/histórico (7), atualização (8), implantação/piloto (9). Os cinco casos de Review Focus têm testes nas tarefas indicadas. Contratos e IDs de conexão são compartilhados; nenhum arquivo ou endpoint existente do ForgeLex foi inventado.

## Próximo marco

Revisão do plano pelo proprietário, seguida da inspeção do repositório/ambiente real na tarefa 0. Esta entrega é planejamento; não iniciou implementação de produção nem alterou o protótipo aprovado.


## Atualização após inspeção inicial do ForgeLex — 05/10/2026

Foi realizada leitura da branch main do repositório junior-aguiar-eng/ForgeLex. Os resultados e suas limitações estão em `docs/architecture/forgelex-integration.md`. Esta atualização prevalece sobre pressupostos anteriores: ForgeLex é pré-pago por operação, tem pesquisa comercial STJ e frontend React/Vite; o gateway não gerencia modelos de IA. A assinatura mensal e sua recorrência são novas capacidades do NexoJuris. O domínio nexojuris.ia.br já está associado ao ForgeLex na documentação; nenhum DNS será alterado sem definir a separação. A tarefa 0 continua parcialmente pendente porque produção, autenticação completa e contratos de integração ainda não foram validados.


## Tarefa 4A — Executor de agentes de tarefa e explicações padronizadas

**Dependências:** tarefas 2–4 para fontes e provedores; tarefa 6 para ativar consumo pago. Inserir entre tarefas 4 e 5. Tarefa 5 passa a consumir este executor para comparação e prática; não implementar orquestrações concorrentes.

**Arquivos propostos:** criar `packages/contracts/src/task-agents.ts`, `apps/web/src/features/research/agents/{registry,executor,evidence-policy}.ts`, `apps/web/src/features/research/agents/prompts/{explain-case,explain-article,compare-doctrine,compare-cases,practice}.ts`, `tests/unit/task-agents.test.ts`, `tests/integration/explanations.test.ts`, `tests/fixtures/agents/evaluation.json`.

**Interfaces:** produzir `TaskKind = 'explain_case'|'explain_article'|'compare_doctrine'|'compare_cases'|'practice'`; `TaskInput { kind; resourceId; sourceVersionId; question?; modelAlias; quoteId; idempotencyKey }`; `TaskDefinition { kind; promptVersion; outputSchemaVersion; allowedTools; evidencePolicy; maxToolCalls; timeoutMs }`.

`runTask(input: TaskInput): Promise<TaskResult>` é o executor compartilhado. `TaskResult { executionId; resourceId; sourceVersionId; kind; evidenceLevel; sections; citations; limitations; promptVersion; outputSchemaVersion; modelProfileVersion; usageReceiptId }`. Níveis de evidência: `full_text`, `excerpt`, `headnote`, `bulletin`; sem documento suficiente, recusar geração em vez de fabricar nível. `TaskSection { id; title; text; citationIds }` é validada no servidor.

- [ ] Criar testes: ementa isolada não produz fatos não documentados; voto isolado não é tese colegiada; ausência de tese formal é explícita; texto revogado vem identificado; instrução maliciosa na fonte não expande ferramentas; modelo escolhido não é trocado silenciosamente; abrir resultado por duas entradas compartilha ID e não debita novamente.
- [ ] Executar `pnpm exec vitest run tests/unit/task-agents.test.ts tests/integration/explanations.test.ts` e confirmar falha inicial pelos comportamentos ausentes.
- [ ] Implementar registry com allowlist por tarefa. Limites iniciais de engenharia: no máximo 3 chamadas de recuperação/verificação e 1 geração principal por execução, timeout total de 90 segundos; contagem de retries incluída no limite e cancelamento propagado. Qualquer chamada paga adicional exige orçamento válido da tarefa 6. Ajustar limites apenas por versão e medição, sem loop indefinido.
- [ ] Implementar prompts versionados. Explicar julgado exige identificação/fonte, contexto disponível, questão, resultado, fundamentos, tese formal quando houver, alcance e conexões. Explicar artigo exige redação/versão, finalidade, elementos, requisitos, efeitos, exceções, conexões e exemplo rotulado. Fonte insuficiente produz limitações em vez de completar campos inventados.
- [ ] Integrar ações contextuais únicas ao ConnectionDetail da tarefa 1. Guardar resultado por execução e versão da fonte; retry idempotente devolve o mesmo resultado. Novo modelo, novas fontes ou novo aprofundamento criam nova intenção e orçamento. Evitar cache compartilhado de conteúdo privado entre usuários.
- [ ] Construir lote de avaliação revisado com pelo menos 12 casos (inteiro teor, ementa, informativo, voto divergente e material insuficiente) e 12 artigos (redações atuais, históricas, remissões e exceções). Assertivas: 100% dos IDs de citação existem; citações diretas correspondem; nenhuma tese formal ou fato é atribuído sem suporte; falhas de qualidade bloqueiam publicação da versão do prompt.
- [ ] Executar testes e percursos de orçamento/cancelamento; registrar qualidade por modelo e latência. Commit da tarefa. Não executar avaliação paga em volume sem orçamento operacional definido.

**Conclusão:** ferramentas padronizadas do site têm missão, fontes, formato e consumo previsíveis. Agentes de tarefa pertencem ao NexoJuris; ForgeLex permanece fornecedor de operações STJ e não passa a hospedar modelos por causa desta mudança.


## Expansão aprovada: STF, correlações e recorrência

O proprietário autorizou ampliar o planejamento para implementar STF no ForgeLex em frente coordenada com o NexoJuris. A limitação STJ descrita acima permanece uma constatação do estado atual, não uma restrição definitiva do novo escopo. O plano complementar está em docs/architecture/correlations-stf-subscriptions.md e define entidades, tipos de relação, evidências, publicação, resolvedor de IDs, evolução dos contratos STF e assinatura Mercado Pago. A tarefa de correlação entra após ingestão e antes da geração/comparação; a entrega STF é uma frente própria, e a assinatura recorrente complementa a tarefa 7. Nenhuma dessas capacidades foi habilitada nesta entrega de planejamento.
