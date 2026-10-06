# NexoJuris — planejamento integral: legislação, doutrina e jurisprudência

> **For agentic workers:** executar por fases com `superpowers:executing-plans`, diretamente, sem delegação salvo instrução de Boni. Checkboxes representam execução comprovada. Este pedido autoriza refazer o planejamento, não executar suas fases.

**Data:** 06/10/2026 — America/Fortaleza.

**Goal:** entregar um site para estudar Direito de forma integrada a partir de uma pergunta central livre, articulando legislação, doutrina e jurisprudência em uma leitura com conexões exploráveis, comparação e aplicação.

**Architecture:** NexoJuris e ForgeLex são produtos distintos no mesmo domínio, aproveitando a infraestrutura existente conforme as escolhas de Boni. NexoJuris administra doutrina, legislação, anotações, relações e estudos; ForgeLex fornece jurisprudência canônica. Grafo jurídico, pesquisa híbrida e ferramentas internas unem as fontes em torno da pergunta central.

**Tech Stack:** preservar Next.js/React/TypeScript, Node >=24 e npm presentes. A proposta original inclui PostgreSQL, full-text/pgvector, worker Python, Docker e Google Cloud para aplicação, jobs, armazenamento e segredos. Confirmar componentes/destinos com Boni, sem substituir worker, framework ou infraestrutura por iniciativa do executor.

**Spec:** arquivos originais lidos no snapshot da fundação e decisões posteriores da conversa, consolidados abaixo.

## 1. Originais e correções de escopo

Plano refeito após leitura dos originais versionados, não dos documentos posteriores que introduziram decisões equivocadas:

| Original | Requisitos incorporados |
|---|---|
| [Especificação do MVP](../specs/nexojuris-mvp.md) | Três fontes, experiência, busca híbrida, modelos, orçamento, histórico, agentes e lançamento |
| [Plano inicial](2026-10-05-nexojuris-mvp.md) | Fundação, ingestão, embeddings, geração, comparação, aplicação, custos, pagamentos, atualização e piloto |
| [Integração ForgeLex](../../architecture/forgelex-integration.md) | Contratos, identidade, proveniência, infraestrutura e consumo jurisprudencial |
| [Correlações, STF e recorrência](../../architecture/correlations-stf-subscriptions.md) | Entidades, posições, relações, resolvedor, evidências, STF coordenado e assinatura |
| [Fundação](../../foundation-status.md) | Estado demonstrativo e verificações pendentes |
| `public/prototipo/index.html`, prints e código inicial | Busca, leitura/conexões, modelos, Compreender/Comparar/Aplicar e retorno |

Decisões posteriores de Boni prevalecem:

- Pergunta central livre organiza o estudo; o cliente não precisa selecionar tema cadastrado.
- Grafo jurídico é central na pesquisa/correlação, sem obrigar diagrama visual.
- Doutrina enviada em PDF/Markdown; aceitar o arquivo piloto como enviado, sem ajustes ou complementações exigidos.
- Acervo primeiro; web autorizada para lacunas/atualidade. Resultados e referências discretas, sem buscas ou links.
- ForgeLex fornece jurisprudência; aproveitar infraestrutura existente. Não impor projetos cloud/contas/bancos novos por confundir produtos distintos com infraestrutura separada.
- Preservar estrutura inicial; Boni escolhe tecnologias, endereço, serviços, modelos, prioridades e regras comerciais.
- Primeiro teste em controle de constitucionalidade; produto completo não se resume ao teste ou ao arquivo piloto.

Documentos posteriores que retiraram ForgeLex, impuseram infraestrutura nova ou reduziram o produto não autorizam essas mudanças. Os originais ficam preservados; esta revisão altera apenas este plano.

Material piloto aceito: `C:/Users/Boni Jr/Desktop/CPM E CPPM/output/hermeneutica-constitucional-3.1-a-3.10.2.6_ESTRUTURADO_IA.md`. Preservar original/bytes; não condicionar a ingestão a novas informações ou reformatação.

## 2. Três eixos permanentes do produto

| Eixo | Capacidades a implementar | Participação no estudo |
|---|---|---|
| **Legislação** | CF estruturada, dispositivos/redações, hierarquia, vigência, remissões; A Constituição e o Supremo; vínculos Corpus927; legislação complementar pertinente | Normas ligadas à pergunta, leitura/explicação do artigo e conexões interpretativas |
| **Doutrina** | Originais PDF/Markdown, versões, capítulos/passagens, fundamentos, conceitos e posições atribuíveis com localizadores | Explicação, premissas, argumentos, limites, exceções e comparação de posições |
| **Jurisprudência** | Material ForgeLex, IDs canônicos, tribunal/órgão, documentos/passagens, nível de evidência, fundamentos/tese/resultado e cobertura STJ/STF | Julgados pertinentes, explicação da decisão e comparação de fundamentos/alcance |

A entrega é um estudo integrado, não biblioteca de arquivos, lista de links, chatbot genérico ou pesquisa jurisprudencial isolada. As categorias permanecem visíveis; falta de evidência gera lacuna, não conteúdo fictício para preencher a tela.

```text
Pergunta central livre + objetivo + modelo escolhido
                         ↓
Questão, conceitos, dispositivos, ambiguidades e atualidade
                         ↓
Doutrina interna + legislação + jurisprudência ForgeLex
                         ↓
Grafo: caminhos, posições e evidências das relações
                         ↓
Complementação autorizada de lacunas/atualização
                         ↓
Roteiro interno + validação + controle de execução/consumo
                         ↓
Leitura integrada + referências discretas + conexões por passagem
                         ↓
Explicar artigo/julgado · comparar · aplicar · aprofundar · salvar/retomar
```

## 3. Regras comuns e estrutura de implementação

CF é o recorte legislativo inicial; dispositivos externos pertinentes podem vir de fontes autorizadas. Não pressupor toda legislação. Separar autor da obra, autor citado, síntese didática, proposição do modelo e posição judicial.

Dispositivo tem identidade independente da redação; julgado conserva ID canônico/tribunal e versão documental. Anotação oficial não comprova tese colegiada/predominância. Similaridade semântica descobre candidato; menção não equivale a interpretação/apoio. Conteúdo importado não autoriza ferramentas, gastos ou execução de código.

Navegar recurso disponível ou reabrir resultado não exige nova IA. Explicar/comparar/corrigir/atualizar são atividades identificadas/cotadas. Segredos e débito ficam no servidor. Saldos/franquias/dados dos produtos não se misturam por infraestrutura comum.

Protótipo não define política comercial: saldo 400, preços 0/1/3/8, 30 dias e 50 salvos são simulação/sugestões. Referência e bloco do mesmo recurso compartilham destino/estado; uma expansão por vez, retorno, três categorias, Compreender/Comparar/Aplicar e acessibilidade preservados.

Existe scaffold, workspace demonstrativo, navegação, estilos, PNG, protótipo e testes. Isso não comprova acervo, pesquisa, IA, conta ou cobrança. Revalidar dependências/build/typecheck antes da execução.

Manter `src/app/` e `src/features/` reais. Caminhos `apps/web`/`packages/contracts` do original eram propostas pré-scaffold; traduzir responsabilidades sem migração automática para monorepo. Worker permanece na proposta original, com caminho/runtime registrado na fase 1.

| Módulo | Caminho base | Responsabilidade |
|---|---|---|
| Estudo | `src/features/study/` | Busca, leitura, conexões, comparação/aplicação e retorno |
| Doutrina | `src/features/sources/doctrine/` | Arquivos, versões, passagens e posições |
| Legislação | `src/features/sources/legislation/` | CF, versões, anotações, remissões e complementos |
| Jurisprudência | `src/features/sources/case-law/` | Catálogo/passagens ligados às autoridades ForgeLex |
| ForgeLex | `src/features/integrations/forgelex/` | Pesquisa/obter/verificar, identidade, proveniência e consumo |
| Grafo | `src/features/graph/` | Institutos, questões, posições, relações/evidências |
| APIs de IA | `src/features/ai/` | Adaptadores de APIs externas, perfis, credenciais, geração, embeddings, limites e medição |
| Pesquisa/IA | `src/features/research/` | Interpretação, recuperação híbrida, web, modelos e roteiros |
| Conta/consumo | `src/features/account/`, `src/features/usage/` | Histórico, identidade, tarifas, ledger e assinatura |
| Dados/operação | `db/`, `ops/`, worker/scripts aprovados | Schema, índices, ingestão, atualização e implantação |

Contratos comuns: `LegalDevice/DeviceVersion`, `SourceDocument/SourceVersion/SourcePassage`, `AuthorityRef`, `LegalQuestion/LegalPosition`, `Relation/Connection`, `QuestionIntent/RetrievedPassage`, `ModelProfile`, `StudyResult`, `TaskDefinition/TaskResult`, `UsageQuote/Reservation/UsageReceipt`. Tipos/schemas versionados preservam identidade, versão, localizador e evidência. Projeção pública não contém URL de pesquisa, trace, prompt ou segredo.

Dados mínimos por contrato:

- `SourcePassage`: documento/versão, texto, localizador, contexto hierárquico, atribuição conhecida e nível documental.
- `LegalPosition`: questão, proposição, sujeito/fonte atribuídos, escopo e passagens que sustentam a atribuição.
- `Relation`: origem/destino, tipo, questão quando pertinente, evidências, método, estado, versão e revisor. Fonte alterada permite `needs_review`; candidato não é publicado.
- `Connection`: categoria, recurso/versão, contexto da pergunta/passagem, motivo, origem e evidência; tribunal apenas quando jurisprudencial.
- `TaskDefinition`: missão, prompt/schema versionados, ferramentas permitidas, política de fonte, chamadas/timeout/limites do perfil. `TaskResult`: execução/recurso/versão, seções/citações, nível de evidência, limitações e recibo.
- `UsageQuote`: tarifa/versionamento, atividade/modelo/escopo, máximo e validade. Retry mantém chave por intenção; nova pergunta/atualização usa nova chave.

API NexoJuris planejada: criar/consultar/cancelar estudo; consultar dispositivo/recurso/conexões; listar/salvar/retomar estudos do usuário; obter cotação/consumo; receber webhook validado; endpoints administrativos protegidos de ingestão/revisão. ForgeLex é chamado somente pelo servidor no contrato homologado. Transporte síncrono, streaming ou processamento durável segue a decisão de infraestrutura e precisa preservar os mesmos estados/identidades.

## 4. Fases de implementação

### Fase 1 — Arquitetura, domínio e infraestrutura existente

**Entrega:** mapa integral e escolhas do proprietário para aplicação, três acervos, grafo, pesquisa, modelos e operação.

**Arquivos:** `docs/architecture/infrastructure-inventory.md`, `docs/architecture/decisions.md`, `ops/dependencies.lock.md`.

- [ ] Confirmar checkout, estrutura, runtime, dependências e estado NexoJuris.
- [ ] Mapear cloud, domínio, hosting, banco, storage, identidade, jobs, segredos, pipeline e pagamentos existentes, por leitura.
- [ ] Registrar reutilização, isolamento lógico, capacidade e custo incremental; não impor projeto/instância/conta nova.
- [ ] Ler contratos ForgeLex: REST/OpenAPI/MCP, autenticação, escopos, idempotência, proveniência, cobertura STJ/STF e billing.
- [ ] Apresentar a Boni endereço no domínio, ambientes, banco/esquema, armazenamento, worker/runtime, região e integração; registrar escolhas.
- [ ] Registrar motores/modelos/embeddings e alias→fornecedor→ID, sem presumir preço/disponibilidade/identidade de Luna.
- [ ] Definir com Boni a contratação/acesso às APIs de IA: provedor, acesso direto ou cloud existente, credencial, ambiente, disponibilidade, limite de gasto e política de dados. Detalhamento obrigatório na fase 2A.
- [ ] Confirmar métodos permitidos de CF, A Constituição e o Supremo, Corpus927 e web autorizada, sem API pública presumida.
- [ ] Registrar arquitetura e orçamento distinguindo custo compartilhado/incremental.

**Aceite:** responsabilidade/destino aprovados, fronteiras e integração explícitas; inventário sanitizado, sem alteração remota.

### Fase 2 — Fundação executável e persistência comum

**Entrega:** base reproduzível e suporte comum aos três eixos, grafo e estudos.

**Arquivos:** package/lockfile/config, `.env.example`, `src/server/{config,db}.ts`, contratos/migrations e testes de conexão/configuração.

- [ ] Validar/instalar base e gerar lockfile; preservar framework/runtime aprovados.
- [ ] Executar baseline `npm test`, `npm run typecheck`, `npm run build`; corrigir falhas comprovadas.
- [ ] Escrever testes de configuração, banco de teste separado e entrada inválida; confirmar falha inicial.
- [ ] Implementar conexão, migrations, configuração server-side, logs sanitizados e contratos.
- [ ] Preparar worker/storage escolhidos; original/snapshot não depende do disco efêmero da hospedagem.
- [ ] Introduzir scripts npm de integração/E2E com suas suites; worker usa runner aprovado.
- [ ] Verificar banco/testes/build e registrar limitações sem simular sucesso.

**Aceite:** aplicação/persistência reproduzíveis, sem chave no cliente ou teste atingindo produção.

### Fase 2A — APIs de IA: provedores, credenciais, geração e embeddings

**Entrega:** integração server-side real com as APIs de IA escolhidas, antes de depender delas para interpretar perguntas, gerar vetores ou produzir estudos. Esta fase é parte da fundação; não fica implícita em “modelos” ou “prompts”.

**Dependências:** escolhas de acesso da fase 1 e configuração da fase 2. A implementação usa adaptadores simulados para contratos; chamadas reais dependem de credencial e orçamento operacional definidos. Não contratar, provisionar ou ativar consumo pela simples redação deste plano.

#### APIs e decisões de acesso

| Uso/alias original | Integração a planejar | Decisão necessária antes de implementar |
|---|---|---|
| Flash | Adaptador Google/Gemini, caso Boni confirme essa associação | ID real/versionado, API direta ou acesso pela cloud existente, autenticação, limites e preço |
| Sonnet e Opus | Adaptador Anthropic/Claude, caso Boni confirme essas associações | IDs reais/versionados, API direta ou acesso pela cloud existente, autenticação, limites e preço |
| Luna | Alias original sem provedor/ID demonstrado | Boni define o modelo; não associar automaticamente a OpenAI, Google, Anthropic ou modelo local |
| Embeddings | Adaptador independente do modelo de resposta; remoto ou local conforme escolha/benchmark | Pelo menos dois candidatos, versão/dimensão, custo, política de dados, índice e execução no worker |
| Reranking, se aprovado | Serviço/modelo específico ou estratégia local avaliada | Provar ganho sobre recuperação básica e registrar custo/latência antes de adicionar dependência |

As famílias sugeridas na tabela não representam contratação ou escolha de versão. A documentação oficial descreve acesso Gemini por geração e embeddings e acesso Claude pela API de mensagens: [referência Gemini](https://ai.google.dev/api.md), [modelos Gemini](https://ai.google.dev/gemini-api/docs/models), [visão geral da API Claude](https://platform.claude.com/docs/en/api/overview). Fontes consultadas nesta revisão; IDs, preços, capacidades e acesso pelo canal escolhido serão verificados novamente na implementação. Ter cloud/domain não demonstra acesso aos modelos. ForgeLex fornece jurisprudência; não se presume que seu gateway execute IA.

#### Arquivos e responsabilidades

**Criar:**

- `src/features/ai/contracts.ts`: perfis, requisições, eventos, consumo e erros normalizados.
- `src/features/ai/model-registry.ts`: associação alias→provedor→ID/versionamento e capacidades por atividade.
- `src/features/ai/providers/gemini.ts` e `src/features/ai/providers/anthropic.ts`: adaptadores somente se os provedores forem escolhidos; um adaptador adicional para Luna após definição.
- `src/features/ai/gateway.ts`: seleção do perfil, chamada, streaming, cancelamento, limites e resultado normalizado; não é um serviço cloud novo obrigatório.
- `src/features/ai/embedding-service.ts`: contrato de embeddings e compatibilidade com índices; o worker de ingestão consome esse contrato pela interface aprovada na fase 1, sem duplicar configuração de modelos.
- `src/features/ai/{execution-budget,usage,errors}.ts`: autorização operacional de gasto, medição e classificação de falhas.
- `tests/ai/{registry,providers,gateway,embeddings}.test.ts`: suites específicas introduzidas no runner de integração da fase 2.
- `docs/architecture/ai-integrations.md`: provedores escolhidos, SDK/protocolo, IDs, capacidades, canais, limites e política de envio/retensão de dados.

**Modificar:** `.env.example`, configuração server-side, manifesto/lockfile de dependências escolhidas e contratos de execução. Segredos reais ficam no mecanismo existente aprovado; `.env.example` só contém nomes/placeholders. Configuração do adaptador nunca usa prefixo público ou chega ao bundle/browser.

#### Contratos de integração

- `ModelProfile`: `alias`, `profileVersion`, `provider`, `accessChannel`, `apiModelId`, `credentialRef`, `capabilities`, `contextLimit`, `outputLimit`, `timeoutMs`, `maxAttempts`, `maxConcurrency` e `tariffVersion`. Valores são definidos pelo canal/modelo verificado, não pela demonstração.
- `ExecutionBudget`: `executionId`, `authorizationRef`, `maxProviderCost`, `currency`, `expiresAt` e limites de chamadas/tokens. Antes da fase 13, a autorização é o teto técnico do piloto; após a fase 13, fica associada à reserva/cotação do cliente. Um teto técnico é verificado antes de cada chamada, não apenas no lançamento comercial.
- `GenerationRequest`: `executionId`, `profileVersion`, `taskKind`, `messages`, `outputSchema`, `maxOutputTokens` e `budget`; inclui apenas evidências selecionadas/necessárias e regras do roteiro, não o banco inteiro.
- `generate(request: GenerationRequest, signal: AbortSignal): Promise<GenerationResult>`; resultado contém conteúdo, término, versão efetiva do perfil, ID do provedor quando disponível e consumo conhecido ou pendente de conciliação.
- `stream(request: GenerationRequest, signal: AbortSignal): AsyncIterable<GenerationEvent>`; eventos normalizados `delta`, `usage`, `completed`, `failed`. Texto parcial permanece provisório até schema/citações validados pela fase 9.
- `EmbeddingProfile`: `profileId`, `version`, `providerOrRuntime`, `apiModelId`, `dimensions`, `batchLimits` e `indexVersion`.
- `embed(request: EmbeddingRequest, signal: AbortSignal): Promise<EmbeddingBatch>`; entrada tem perfil, IDs/textos de passagens e orçamento quando pago; saída mantém correspondência ID→vetor, dimensão e consumo. Não misturar vetores de perfis/versões incompatíveis.
- `ProviderUsage`: `executionId`, `attemptId`, `providerRequestId?`, perfil/modelo efetivos, tokens informados, custo medido/estimado e `reconciliationStatus`. Consumo não informado não significa custo zero.
- `ProviderError`: categoria `configuration|authentication|rate_limit|timeout|unavailable|invalid_output|cancelled|unknown_outcome`, possibilidade de retry e estado de consumo quando conhecido. Erro interno é sanitizado antes da UI.

#### Implementação e verificação

- [ ] Testar `registry_rejects_unconfigured_alias`: Luna sem associação e modelo sem capacidade para tarefa ficam indisponíveis; nenhuma chamada externa ou troca automática ocorre. Confirmar falha antes de implementar registro.
- [ ] Testar `credentials_stay_server_side`: segredo não aparece no bundle, resposta HTTP, logs ou erros; ausência de credencial bloqueia o adaptador com diagnóstico interno sanitizado. Confirmar falha inicial.
- [ ] Testar os adaptadores com transporte simulado: mapeamento da entrada/saída, schema, término, tokens, IDs, streaming e erros de cada API escolhida. Implementar SDK/protocolo conforme documentação oficial vigente; registrar versões no lockfile.
- [ ] Implementar gateway único para interpretação assistida, composição, explicação, comparação e feedback. Prompts continuam no executor da fase 9; acesso aos modelos e chamadas externas pertencem a esta fase.
- [ ] Testar `budget_blocks_before_request`: teto vencido/insuficiente, limite de saída/chamadas e concorrência impedem envio; qualquer retry consome a mesma autorização e aparece como tentativa própria.
- [ ] Testar 401/403, 429, falha temporária, timeout e queda durante stream. Retry só para falha recuperável com limite total; respeitar orientação de espera do provedor quando disponível. Resultado desconhecido não é tratado como falha gratuita nem repetido indefinidamente. Não presumir idempotência externa só porque há ID interno.
- [ ] Testar cancelamento até o adaptador e entrega parcial; cancelamento local não garante ausência de cobrança remota. Registrar consumo disponível e pendência de conciliação, sem repetir débito do cliente.
- [ ] Testar `embedding_rejects_wrong_dimension` e `embedding_preserves_passage_ids`: dimensionamento e versões corretos; lote incompleto fica identificado, com retomada sem misturar índices. API/modelo de embeddings é escolhido separadamente do modelo de geração.
- [ ] Implementar métricas por execução/tentativa/provedor/modelo: latência, taxa de falha, tokens, custo e consumo pendente, sem armazenar chaves ou obra integral em logs.
- [ ] Executar as suites no runner introduzido na fase 2, `npm run typecheck` e `npm run build`; verificar que a UI recebe somente capacidades/aliases públicos e estado da execução.
- [ ] Fazer uma chamada real mínima por perfil habilitado e um lote mínimo de embeddings no ambiente autorizado, com teto prévio. Registrar canal, ID, data, latência, consumo e resultado; sucesso simulado não comprova acesso real.

**Aceite:** cada perfil habilitado chama sua API/modelo efetivos com credencial protegida e limite de gasto; embeddings têm integração e índice compatíveis; falhas/cancelamentos têm resultado explícito. Perfil sem acesso real não aparece como funcional. A pesquisa usa esses adaptadores e o estudo mantém os três eixos e a pergunta central.

### Fase 3 — Frontend de referência e navegação única

**Entrega:** protótipo em componentes com legislação/doutrina/jurisprudência preparadas para dados reais.

**Arquivos:** `SearchBar`, `ReadingPane`, `ConnectionRail`, `ConnectionDetail`, workspace/navigation atuais, tokens/CSS, páginas estudo/histórico e E2E.

- [ ] Escrever testes de três categorias, texto/bloco com destino único, repetição sem duplicar trilha, retorno e Comparar contextual; confirmar falhas.
- [ ] Converter fluxos completos, preservando busca central, conexões ao digitar e animação de execução encerrada em sucesso/falha/cancelamento.
- [ ] Manter leitura central, três categorias e instituto conectado; seleção realça passagem/evidência.
- [ ] Implementar trilha/reducer, uma expansão por vez, foco/retorno; rolagem não troca painel escolhido.
- [ ] Preservar Compreender/Comparar/Aplicar e Meus estudos em página própria; fixtures rotuladas.
- [ ] Aplicar identidade original: Inter, `#0F4C5C`, superfície `#E6F0F2`, leitura 16 px/1,7; ajustes/marca vetorial escolhidos por Boni.
- [ ] Validar teclado/foco, movimento reduzido, 320/736/1.024/1.440 px e detalhe/retorno mobile.

**Aceite:** experiência completa, sem reduzir o produto ao workspace demonstrativo atual.

### Fase 4 — Doutrina: arquivos, passagens, argumentos e posições

**Entrega:** acervo doutrinário consultável com contexto/fundamentos/posições apoiados em trechos.

**Arquivos:** schema fontes, `sources/doctrine/`, worker/importador aprovado, testes e relatório de ingestão.

**Interfaces:** `ingestDoctrine(input): ImportReport`; `getDoctrinePassages(input): Promise<SourcePassage[]>`; `getDoctrinePosition(id): Promise<LegalPosition>`.

- [ ] Escrever testes Markdown/PDF, seção/página, metadado ausente, hash/replay, versão alterada, falha parcial e extração defeituosa; confirmar falha.
- [ ] Armazenar original, documento, hash, versão, estrutura e passagens/localizadores.
- [ ] Importar Markdown enviado como está, sem exigir autoria/edição/reformatação; filename/seção/linhas identificam provisoriamente, desconhecido não é inventado.
- [ ] Preservar hierarquia/tabelas/citações/continuidade/ressalvas; não separar conclusão de exceção nem atribuir citação de terceiro ao autor do arquivo.
- [ ] Implementar extração PDF com diagnóstico; OCR necessário é capacidade a escolher, não sucesso presumido.
- [ ] Registrar conceitos/referências/candidatos de posição com evidência; distinguir autor da obra, autor citado e síntese.
- [ ] Preparar posições por questão: proposição, premissas, fundamento, alcance/exceções; metadado desconhecido limita atribuição, não aceitação.
- [ ] Conferir amostra e replay, preservando versões; original não vai para Git/URL pública por consequência automática.

**Aceite:** doutrina fundamenta estudo e comparação, com passagem/localizador/atribuição verificáveis.

### Fase 5 — Legislação: CF, versões, anotações e remissões

**Entrega:** eixo legislativo estruturado/conectado, com redação pertinente à pergunta.

**Arquivos:** schema dispositivos/versões, `sources/legislation/`, importadores CF/STF/Corpus927, testes e inventário.

**Interfaces:** `getDevice(deviceId, at?): Promise<DeviceWithRelations>`; `ingestLegalSnapshot(input): ImportReport`; `getOfficialAnnotations(deviceId): Promise<OfficialAnnotation[]>`.

- [ ] Escrever testes de hierarquia, artigo/parágrafo/inciso, identidade, duas redações, contexto temporal, remissão e registro malformado; confirmar falha.
- [ ] Importar CF, títulos/capítulos/artigos/incisos/alíneas/parágrafos/ADCT e redações disponíveis na fonte aprovada.
- [ ] Separar identidade canônica e versão; histórico não aparece como vigente.
- [ ] Importar **A Constituição e o Supremo**: dispositivo, passagem, referência jurisprudencial, origem, snapshot/localizador; associação não prova tese/predominância.
- [ ] Importar vínculos reais do **Corpus927**, preservando significado/origem sem fabricar correspondência por artigo.
- [ ] Resolver remissões exatas; guardar referência ambígua/ausente como não resolvida.
- [ ] Recuperar legislação complementar autorizada quando pertinente, com lei/artigo/versão, sem pressupor todas as leis no corpus.
- [ ] Testar idempotência/mudança e leitura de dispositivo/vínculos antes de IA.

**Aceite:** CF é acervo permanente; pergunta encontra norma real e texto/versionamento/conexões pertinentes.

### Fase 6 — Jurisprudência: ForgeLex, STJ e STF coordenado

**Entrega:** material jurisprudencial canônico com proveniência, nível documental e cobertura explícitos.

**Arquivos NexoJuris:** `integrations/forgelex/{client,contracts,authority-mapping}.ts`, `sources/case-law/{repository,resolver}.ts` e testes.

**Interfaces:** `searchCaseLaw`, `getAuthority`, `verifyAuthority`, `resolveAuthorityReference`, mapeadas ao contrato real da fase 1.

- [ ] Escrever testes de tribunal/ID/proveniência, limites, erro semântico, timeout/cancelamento, idempotência/escopo; confirmar falha.
- [ ] Implementar servidor→ForgeLex com identidade restrita e contrato real; não acessar matters/documentos privados ou saldo de outra finalidade.
- [ ] Catálogo NexoJuris guarda IDs/versões/passagens das conexões; não criar coletor concorrente de inteiro teor canônico.
- [ ] Distinguir inteiro teor, ementa, informativo/trecho; não completar fato/fundamento ausente por inferência.
- [ ] Reconciliar referências doutrina/CF/Corpus927 com IDs; preservar `unresolved` quando não houver correspondente.
- [ ] Validar STJ real no escopo autorizado; preço antigo não prova política atual.
- [ ] Detalhar frente **STF no ForgeLex** prevista nos originais: fonte/formato, IDs, ingestão/indexação, proveniência, pesquisa/obter/verificar, catálogo, REST/MCP e billing. Executar naquele projeto somente com instrução correspondente.
- [ ] Testar STF/números homônimos, versões/deduplicação e regressão STJ; aceitar filtro não comprova suporte.
- [ ] Habilitar STF NexoJuris após homologação; anotações locais permanecem disponíveis antes disso, com limites.

**Aceite:** julgado encontrado é obtido/verificado e conectado a passagens; cobertura declarada por prova. Gate STF não bloqueia doutrina/UI.

### Fase 7 — Grafo: questão, fontes, posições e evidências

**Entrega:** relações específicas entre os três eixos para pesquisa e leitura contextual.

**Arquivos:** schema entidades/questões/posições/relações, `graph/{resolve,relations,traverse,review}.ts`, worker referências/candidatos e testes.

**Interfaces:** `resolveReference`; `getConnections({resourceId, passageId?, questionId?, dateContext?}): Promise<Connection[]>`; `reviewRelation(relationId, decision, reviewerId): Promise<RelationVersion>`.

- [ ] Escrever testes de menção sem interpretação, origem oficial, candidato sem evidência, duplicação, versão/tribunal/voto; confirmar falha.
- [ ] Implementar dispositivos, institutos/aliases, questões, passagens, tribunal/órgão e posições atribuídas.
- [ ] Tipos: `governed_by`, `comments_on`, `mentions`, `interprets`, `official_annotation`, `supports`, `opposes`, `related_to`, `changes_position`, com escopo/evidência.
- [ ] Separar método `official_import|explicit_reference|editorial|semantic_candidate` de validade/estado.
- [ ] Esteira identificar→importar vínculo oficial→extrair referência→propor→revisar→publicar, muitos-para-muitos.
- [ ] Bloco mostra motivo e passagem realçada; categorias legislação/doutrina/jurisprudência, tribunal como filtro.
- [ ] Conexão contextual da sessão não publica automaticamente candidato no grafo global.
- [ ] Deduplicar painel sem perder motivos; fonte alterada marca evidência para revisão e preserva histórico.
- [ ] Revisar pelo menos 10 questões com categorias/tribunais onde haja material; lacuna não recebe preenchimento artificial.

**Aceite:** todas as relações publicadas têm evidência, candidatos não aprovados não publicam, semântica revisada além do SQL.

### Fase 8 — Pesquisa híbrida, interpretação livre e web

**Entrega:** pergunta natural recupera fontes/caminhos pertinentes e complementa lacunas/atualidade.

**Arquivos:** schema pesquisa, `research/{intent,retrieval,ranking}.ts`, `web/{registry,policy,search,fetch}.ts`, worker embeddings, fixtures/relatório.

**Interfaces:** `interpretQuestion`; `retrieve(query, filters, limit)`; `retrieveStudyEvidence`; `searchApprovedSources`.

**Dependência de IA:** interpretação que usar modelo consome o gateway da fase 2A; embeddings de passagens e consultas consomem `EmbeddingProfile`/`embed`. Busca lexical/grafo não exige geração. Não usar um provedor implícito ou API paga fora do orçamento técnico.

- [ ] Preparar 60 perguntas, 10 sem resposta e 10 referências literais; separar ajuste/avaliação, primeiro lote constitucional.
- [ ] Testar paráfrase/conceito/literal/dispositivo, categoria/tribunal/versão/rascunho/ambiguidade; confirmar falha.
- [ ] Interpretar questão/conceitos/aliases preservando termos; não converter pergunta livre em classificação rígida.
- [ ] Full-text português, resolução literal e grafo; comparar pelo menos dois embeddings por recall@10, nDCG@10, latência, custo/espaço.
- [ ] Registrar para escolha de Boni; índice vetorial versionado/fusão lexical-semântica; reranking avaliado, não imposto.
- [ ] Banco primeiro; web por lacuna/atualidade, apenas fonte aprovada/método permitido com snapshot/origem/localizador.
- [ ] Testar redirect/host não permitido, endereço privado, timeout/CAPTCHA, snippet sem documento e injection; falha não libera fonte substituta.
- [ ] Não enviar doutrina privada integral em query aberta; selecionar evidência por pertinência/orçamento, não frequência como predominância.
- [ ] Benchmark/cobertura registrados; indexação ampla após modelo/dimensão escolhidos, troca via reindexação versionada.

**Aceite:** três fontes recuperadas quando suportadas, relações úteis, lacuna/esclarecimento explícitos e web controlada/invisível ao cliente.

### Fase 9 — Estudo integrado e explicar artigo/julgado

**Entrega:** explicação completa na questão delimitada e ferramentas documentais padronizadas.

**Arquivos:** `research/{compose,verify-citations}.ts`, `agents/{registry,executor,evidence-policy}.ts`, prompts, schema resultados e testes. Adaptadores externos são os da fase 2A; não implementar segundo acesso concorrente às APIs.

**Interfaces:** `composeStudy`, `verifyCitations`, `runTask` com versões/limites/recibo/evidência.

- [ ] Perfis Luna/Flash/Sonnet/Opus escolhidos têm ID/capacidade/limite real; não trocar silenciosamente por modelo mais caro.
- [ ] Testar fonte/citação inventada, ementa limitada, tese inexistente, voto/maioria, dispositivo revogado, injection, cancelamento/teto/reabertura; confirmar falha.
- [ ] Consumir gateway/perfis/consumo da fase 2A; implementar executor/saída estruturada com ferramentas/contexto/saída/chamadas/orçamento controlados. Limites originais são propostas a medir.
- [ ] Compreender: pergunta, conceitos, doutrina, norma, jurisprudência, convergências/limites/exceções e conexões pertinentes.
- [ ] Explicar artigo: redação/versão, finalidade, elementos/requisitos/efeitos, exceções/conexões e exemplo hipotético rotulado.
- [ ] Explicar julgado: identificação/documento, contexto disponível, questão/resultado, fundamentos, tese formal quando houver, divergência/alcance.
- [ ] Separar maioria/voto/obiter/síntese; superação/atualidade exige verificação própria; falta documental limita/recusa, não fabrica.
- [ ] Validar IDs/citações antes da entrega; streaming não confirma citação não verificada.
- [ ] Persistir resultado/evidências/versões por execução/usuário; modelo/fonte/profundidade novos são nova intenção, reabertura usa resultado.
- [ ] Avaliar pelo menos 12 casos documentais e 12 dispositivos, qualidade/latência por modelo; fake não prova geração real.

**Aceite:** leitura articula os três eixos, referências/literais verificáveis, limites explícitos e revisão jurídica complementar.

### Fase 10 — Comparar doutrina/jurisprudência e Aplicar

**Entrega:** posições confrontadas e prática jurídica ligadas à mesma pergunta/evidência/ferramenta.

**Arquivos:** `research/{compare-doctrine,compare-cases,practice}.ts`, prompts, `study/{ComparisonView,PracticeView}.tsx` e testes/E2E.

**Interfaces:** `compareDoctrine`, `compareCases` e `assessAnswer`, com questão/escopo/evidências comuns.

- [ ] Testar autoria ausente, questões/competências distintas, tribunal sem material, contagem sem predominância e gabarito antecipado; confirmar falha.
- [ ] Doutrina por questão: posições/premissas/fundamentos/efeitos/convergências/divergências/evidências; não inventar autor desconhecido.
- [ ] STF/STJ por competência/fatos/datas/autoridade/questão; diferença de função não vira conflito artificial.
- [ ] Predominância `supported|divergent|insufficient` exige critério/referências, não frequência.
- [ ] Aplicar: hipótese/pergunta→resposta→feedback fundamentado, exceções e variação hipotética; corrigir após tentativa.
- [ ] Comparar por modo/bloco usa executor único; explicar recurso/aprofundar preserva leitura/retorno, sem painel paralelo.
- [ ] Integrar UI real com referências discretas, sem buscas/links; verificar custo técnico, limites e navegação.

**Aceite:** modos e explicações compartilham contexto/evidência, sem duplicação ou atribuição indevida.

### Fase 11 — Primeiro teste: controle de constitucionalidade

**Entrega:** prova do mecanismo integrado com arquivo enviado e fontes reais disponíveis.

**Arquivos:** perguntas/script de avaliação, `docs/evaluation/controle-constitucionalidade.md` e regressões.

- [ ] Usar Markdown como enviado, sem exigir metadados, alteração ou substituição.
- [ ] Perguntas livres sobre conceitos/técnicas/limites/relações; além da cobertura testa insuficiência, sem forçar conteúdo do arquivo.
- [ ] Registrar por pergunta doutrina, normas/versões, julgados, relações, resposta/limite esperado.
- [ ] Executar recuperação/grafo/ForgeLex/web/modelo/UI no escopo autorizado, explicar recurso, comparar/aplicar/retornar.
- [ ] Revisar recuperação, semântica, atribuição, integração jurídica, limites/usabilidade; Boni realiza aceite jurídico.
- [ ] Identificar falta de STF/documento/fonte sem simular sucesso ou bloquear capacidades independentes.
- [ ] Corrigir falhas com regressões; registrar corpus/contrato/prompt/modelo, custo/latência e resultados negativos.

**Aceite:** estudo fundamentado nos casos respondíveis, sem fonte/citação/relação inventada; ambiguidade/insuficiência corretas. Não equivale à conclusão do site ou fronteira definitiva.

### Fase 12 — Conta, Meus estudos, permissões e retenção

**Entrega:** identidade/histórico isolados, resultados retomáveis e armazenamento controlado.

**Arquivos:** `account/{auth,permissions,study-history,retention}.ts`, páginas, schema e testes integração/E2E.

**Interfaces:** `saveStudy`, `listStudies`, `expireTemporaryStudies` por usuário/política.

- [ ] Testar sessão/revogação/acesso entre usuários/admin, salvar/retomar/excluir/expirar; confirmar falha.
- [ ] Identidade escolhida, reutilização somente aprovada; mesmo domínio não mistura dados dos produtos.
- [ ] Meus estudos: página/cartões/busca/recentes/salvos, sem sidebar de histórico.
- [ ] Retomar resultado/evidências sem geração; atualizar é ação identificada/cotada.
- [ ] Limite escolhido sem apagar outro salvo; 30 dias/50 salvos continuam sugestões até decisão.
- [ ] Separar acervo/estudo/anexos/logs/ledger/backups; exclusão não apaga financeiro.
- [ ] Retenção e restore reaplicam exclusões; nenhum cache privado compartilhado indevidamente.

**Aceite:** conta acessa só seus dados e histórico/retensão seguem política escolhida.

### Fase 13 — Custo, créditos, cotas e Mercado Pago

**Entrega:** economia medida, teto de consumo, ledger idempotente e assinatura homologada.

**Arquivos:** `usage/{quote,ledger,quotas,costing}.ts`, subscription-provider/reconciler/entitlements, webhook/schema, testes e tarifas/cost-model.

**Interfaces:** `quoteActivity`, `reserveUsage`, `settleUsage`, `createSubscription`, `reconcileSubscription`, `grantCycle`.

- [ ] Testar concorrência/saldo negativo/retry, vencimento/troca de modelo, teto/falha parcial/cancelamento; confirmar falha.
- [ ] Medir tokens/embedding/retrieval/ForgeLex/infra variável-compartilhada/pagamento/suporte/rateio; separar margem de contribuição e resultado operacional.
- [ ] Vincular `ExecutionBudget`/`ProviderUsage` da fase 2A a cotação/reserva/liquidação. Distinguir gasto do provedor e débito do cliente; reconciliar consumo desconhecido e custos das tentativas sem débito duplicado.
- [ ] Apresentar planos/tarifas/créditos/cotas diária-semanal/franquia para Boni, com renovação/falha parcial explícitas.
- [ ] Tarifa versionada/unidade inteira, cotação por objetivo/modelo/escopo, ledger append-only e reserva/liquidação/liberação/estorno/conciliação.
- [ ] Máximo antes de executar; escolher modelo não cobra; ForgeLex pago integra orçamento prévio; exceder exige nova confirmação no produto.
- [ ] Recorrência Mercado Pago distinta do pré-pago ForgeLex; compartilhar componente só aprovado/compatível.
- [ ] Testar autorização sem parcela, produto errado, webhook repetido/fora de ordem, confirmação no provedor, recusa/cancelamento/estorno; browser não concede.
- [ ] Homologar sandbox/ciclo/franquia; unicidade produto-assinatura-ciclo; um pagamento não concede ambos os saldos.

**Aceite:** custo/margem mensurados, máximo compreensível/respeitado e cobrança/concessão únicas no produto correto.

### Fase 14 — Atualização dos três eixos, revisão e homologação

**Entrega:** acervo mantido e site completo comprovado na infraestrutura escolhida, com recuperação.

**Arquivos:** worker atualização/diff/review, painel operação/fontes, revisão relações, `ops/{update-runbook,deploy,rollback,observability,restore}.md`, suites atualização/E2E remoto.

**Interfaces:** `update_source(source_id): UpdateReport`; `publish_review(review_id, reviewer_id): PublishReport`.

- [ ] Testar fonte falha/retirada, mudança de redação/vínculo, replay/histórico/needs_review; confirmar falha.
- [ ] Atualizar doutrina por arquivo novo, CF/anotações/Corpus927 por fontes aprovadas e jurisprudência coordenada com ForgeLex.
- [ ] Snapshot/versionamento/revisão de relação; IA classifica candidato, não publica mudança jurídica irrestrita.
- [ ] Painel mostra cobertura/coleta/versão/erro/fila; preservar última versão válida.
- [ ] Escolher frequência/limites com Boni; 06h America/Fortaleza é proposta original, não automação criada.
- [ ] Preparar build/deploy/jobs/segredos/migrations/backups, capacidade e efeito nos recursos compartilhados.
- [ ] Ambiente autorizado: endereço/TLS/cookie/callback e E2E login→orçamento→pergunta→fontes→comparar/aplicar→salvar/retomar→consumo/pagamento de teste.
- [ ] Testar falha modelo/fonte/ForgeLex, timeout/retry/duas abas/reload/cancelamento; execução não perde intenção pela queda do navegador.
- [ ] Ensaiar backup/restore/rotação/rollback/limites, logs sem segredo/obra integral.
- [ ] Registrar host/URL, SHA/digest/revisão, corpus/contratos/escopo; HTTP 200 não substitui E2E.

**Aceite:** atualização rastreável/revisável, fluxo remoto e recuperação comprovados sem regressão material compartilhada.

### Fase 15 — Área pública, piloto com clientes e conclusão

**Entrega:** primeira versão publicada, experiência completa, operação/manutenção documentadas.

**Arquivos:** páginas como-funciona/acervo/planos, identidade/textos, E2E jornada, user-pilot/release e runbooks.

- [ ] Área pública minimalista apresenta estudo integrado/cobertura/planos reais/acesso, sem preço/acervo fictício.
- [ ] Jornada visitante→conta→modelo/orçamento→pergunta→leitura/conexões→comparar/aplicar→salvar/retomar→consumo/pagamento sem duplicação.
- [ ] Piloto de convidados no escopo autorizado mede conclusão/pertinência/compreensão do preço/caminhos redundantes.
- [ ] Corrigir falhas, conferir UI/conteúdo e identidade escolhida; não redesenhar produto por iniciativa própria.
- [ ] Validação final pertinente: build/typecheck/suites/E2E/segurança/restore/economia.
- [ ] Preparar digest validado/migrations compatíveis/monitoração/rollback; publicar autorizado e conferir domínio/revisão/tráfego/integrações.
- [ ] Acompanhar erros/fila/latência/cobertura/custo/teto/conciliação reais.
- [ ] Documentar uso/admin, ingestão/revisão/atualização/manutenção/incidente/recuperação/expansão.

**Aceite:** cliente estuda pergunta com fontes/conexões reais, compara/aplica/salva/retoma e entende consumo; operação/recuperação comprovadas. Expansão de disciplinas é ciclo posterior.

## 5. Dependências e marcos

```text
1 Arquitetura → 2 Fundação → 2A APIs de IA → 3 UI
                     ↓
4 Doutrina + 5 Legislação + 6 Jurisprudência ForgeLex
                     ↓
7 Grafo → 8 Pesquisa híbrida/web
                     ↓
9 Estudo/explicações → 10 Comparar/Aplicar → 11 Primeiro teste
                     ↓
12 Conta/histórico → 13 Consumo/assinatura
                     ↓
14 Atualização/homologação → 15 Lançamento
```

Frentes 4/5/6 podem avançar sem bloquear uma à outra, com contratos comuns, sem autorização de delegação. STF tem gate próprio de operação remota. Antecipar autenticação antes de qualquer ambiente remoto multiusuário; endpoint local sem controle não é publicado.

Fase 2A é a etapa técnica explícita de APIs de IA, dependente da fundação e obrigatória antes de chamadas de interpretação/embeddings/geração nas fases 8/9. A UI e a ingestão sem IA podem avançar enquanto acesso/credenciais são definidos. Cobrança comercial da fase 13 não substitui o teto operacional desde a primeira chamada paga.

Marcos: **M1** fundação/arquitetura escolhida; **M2** três eixos acessíveis sem IA; **M3** pesquisa integrada/benchmark; **M4** modos/explicações reais na UI; **M5** primeiro teste jurídico; **M6** conta/consumo/assinatura conciliados; **M7** fontes atualizáveis, homologação/piloto/publicação/operação comprovados.

Prazo/custo total após inventário e primeiro lote real, sem promessas baseadas apenas em documento.

## 6. Foco de revisão e regressões

| Risco | Comportamento obrigatório | Fases |
|---|---|---|
| Arquivo sem metadados | Aceitar enviado, sem autoria/página inventada | 4/11 |
| Duas redações | Versão pertinente/histórico | 5/7/9 |
| Anotação sem autoridade canônica | Não resolvida, sem inteiro teor simulado | 5/6/7 |
| Citação/candidato | Não vira interpretação publicada sem suporte | 7 |
| Voto/ementa/informativo | Explicação limitada, sem tese/fato inventado | 6/9/10 |
| Competência distinta | Comparação delimitada, sem conflito artificial | 10 |
| Fonte retirada/falha | Lacuna/revisão, última versão válida | 5/6/8/14 |
| Instrução hostil | Não muda ferramentas/sites/orçamento | 4/8/9 |
| Referência/bloco | Destino/painel/resultado únicos | 3/9/10 |
| Retry/duas abas/webhook | Execução/débito/ciclo idempotentes | 6/9/12/13/14 |
| API sem credencial/modelo/capacidade | Perfil indisponível, sem fallback silencioso | 2A/9 |
| 429/timeout/stream interrompido | Retry limitado, consumo incerto conciliado, teto respeitado | 2A/13/14 |
| Embedding com dimensão/versão diferente | Índice compatível ou rejeição/reindexação explícita | 2A/8 |
| Retenção/exclusão/restore | Financeiro separado/exclusão reaplicada | 12/14 |

Teste automático comprova integridade/contrato/fluxo; revisão jurídica comprova suporte no lote, não correção global. Fixture, fake, chamada real e produção são evidências distintas.

## 7. Matriz de cobertura dos originais

| Requisito | Fases |
|---|---|
| Framework/banco/worker/Docker/cloud/domínio | 1/2/14/15 |
| UI/marca/animação/contexto/retorno/mobile/acessibilidade | 3/10/15 |
| **Legislação: CF/versões/vigência/A Constituição e o Supremo/Corpus927** | **5/7/14** |
| **Doutrina: PDF/Markdown/passagens/argumentos/posições/comparação** | **4/7/8/9/10/14** |
| **Jurisprudência: ForgeLex STJ-STF/documentos/proveniência/verificação** | **6/7/9/10/14** |
| Grafo/questões/posições/resolvedor/evidência/revisão | 7/8/14 |
| Pergunta livre/busca híbrida/benchmark embeddings | 8/11 |
| Web autorizada/lacuna/atualidade/busca invisível | 8/9/10 |
| **APIs de IA/provedores/credenciais/adaptadores/streaming/falhas/medição** | **1/2/2A/9/13/14** |
| Embeddings: API/runtime/perfil/dimensão/lotes e compatibilidade | 2A/8 |
| Modelos/prompts/agentes/limites | 1/2A/9/13 |
| Explicar artigo/julgado/nível documental | 9/10/11 |
| Comparar doutrina/STF-STJ/critério predominância | 10/11 |
| Aplicar/variar fatos/feedback após tentativa | 10/11 |
| Custo/margem/tarifas/créditos/cotas/teto/idempotência | 13/14 |
| Conta/histórico/salvos/retenção/backups | 12/14 |
| Mercado Pago recorrente/produtos financeiros distintos | 13/14 |
| Atualização/painel/fila/cobertura/recuperação | 14 |
| Área pública/QA/piloto/publicação/operação | 14/15 |
| Arquivo como enviado/controle como primeiro teste | 4/11, respeitado em todo o plano |

## 8. Decisões, execução e registro

Cada fase segue teste relevante→falha comprovada→implementação→verificação→registro; documentação trivial não recebe teste artificial. Scripts são introduzidos antes de citar sua execução; app continua npm e worker segue escolha da fase 1.

Boni decide domínio/hosting, reutilização/isolamento, banco/worker/motores, modelos, sites, UI, regras comerciais, orçamento/operação remota. Recomendar quando solicitado não é escolher por ele. Escolhas fechadas antes da execução afetada, sem reabrir propósito já definido.

Registrar entrega/versão/checkout/comandos efetivamente executados/resultados/cobertura/pendências por fase. Commit/push, mudanças ForgeLex, recursos pagos, DNS/publicação seguem autorização correspondente. Não alterar/desfazer outros arquivos como consequência desta redação.

**Revisão:** os três eixos possuem capacidades próprias e convergem em grafo/pesquisa/estudo; APIs de IA possuem fase própria, contratos e dependências para geração/embeddings; requisitos originais mapeados; piloto não substitui site. Este trabalho apenas revisou o Markdown, sem instalação/importação/provisão/cobrança/publicação.
