# NexoJuris e ForgeLex — correlações, STF e assinatura

Escopo adicional aprovado em 05/10/2026, America/Fortaleza. Este documento complementa o plano do MVP. Descreve novas entregas; não afirma que o STF esteja habilitado ou que haja recorrência implementada no ForgeLex atual.

## 1. Frentes coordenadas

**NexoJuris:** importar dispositivos constitucionais, passagens das anotações oficiais e doutrina autorizada; construir relações por instituto e questão jurídica; frontend e agentes de tarefa; assinatura mensal.

**ForgeLex:** adquirir e indexar jurisprudência STF; normalizar identificação, proveniência e versões; habilitar pesquisa, obtenção e verificação STF por contratos públicos testados. A cobertura STJ existente continua disponível e sua política comercial permanece preservada.

O primeiro lote STF deve atender aos institutos constitucionais do piloto. Uma expansão posterior para toda a jurisprudência STF é outro marco mensurável, não condição para o primeiro circuito do NexoJuris.

A ingestão canônica de documentos jurisprudenciais STF pertence ao ForgeLex. O NexoJuris mantém um catálogo de IDs e passagens necessárias para suas conexões, com versão e localizador. Não manter dois coletores independentes e concorrentes do mesmo inteiro teor. As anotações dispositivo → julgado do STF são relações do acervo NexoJuris e precisam ser reconciliadas com a identidade canônica do julgado.

Sem correspondente no ForgeLex, a associação anotada preserva o identificador original e o link oficial, com status `unresolved`. A navegação pode mostrar a anotação disponível; não simular disponibilidade de inteiro teor ou ferramenta de verificação. Ao entrar o julgado no índice, o resolvedor liga a anotação ao ID canônico.

## 2. O que significa correlacionar

Correlacionar é registrar uma relação específica entre recursos identificados, acompanhada de evidência. Um resultado parecido semanticamente não vira relação jurídica publicada automaticamente.

| Entidade | Identidade | Papel |
|---|---|---|
| Norma e dispositivo | Norma, artigo/inciso/parágrafo e versão | Objeto jurídico e redação pertinente |
| Instituto | ID e sinônimos editoriais | Porta de entrada temática |
| Questão jurídica | Pergunta delimitada e contexto | Unidade de interpretação/comparação |
| Passagem doutrinária | Documento, versão e localizador | Sustenta uma posição atribuída |
| Julgado | Tribunal, classe, número e órgão; ID canônico | Fonte de decisão e fundamentação |
| Passagem jurisprudencial | Versão do documento e localizador | Evidência da relação ou posição |
| Tribunal e órgão | IDs do catálogo | Origem e filtro; não posição jurídica por si só |
| Posição | Questão, proposição e sujeito/fonte atribuídos | Unidade para comparar fundamentos |

Exemplo de dispositivo canônico: `BR:CF:1988:art5:inc36`. A redação histórica é uma versão separada; o artigo não muda de identidade quando a redação muda.

### Tipos de relação

- `governed_by`: instituto/questão é regulado por dispositivo, com evidência editorial ou documental.
- `comments_on`: passagem doutrinária comenta dispositivo ou questão.
- `mentions`: passagem cita um dispositivo ou julgado; não prova interpretação, apoio ou concordância.
- `interprets`: passagem jurisprudencial interpreta dispositivo/questão, com trecho comprobatório.
- `official_annotation`: associação importada da anotação oficial ou do Corpus927; preservar autoria da associação sem presumir tese colegiada.
- `supports` / `opposes`: fonte ou passagem sustenta/contraria uma posição delimitada, com escopo explícito.
- `related_to`: ligação temática editorial; não recebe força normativa ou status de precedente vinculante.
- `changes_position`: registro de superação/distinção ou alteração, com decisão e questão afetada comprovadas; nunca atualizar toda a jurisprudência de um tribunal por inferência.

Em `relation`, guardar `id`, origem/destino, tipo, `question_id` quando pertinente, evidência, fonte, método (`official_import`, `explicit_reference`, `editorial`, `semantic_candidate`), estado, versão, coleta e revisor. Separar método da validade: uma referência extraída automaticamente pode ser correta, mas sua semântica depende do que foi efetivamente comprovado.

Relações são muitos-para-muitos. Um artigo pode tratar vários institutos, uma obra pode divergir de outra sobre a mesma questão e um julgado pode conter fundamentos diferentes. Não reduzir cada documento a um só tema.

## 3. Esteira de criação das correlações

1. **Identificar:** normalizar dispositivos, documentos, processos, tribunal e localizadores. Resolver referências exatas; homônimos ou números incompletos vão para revisão.
2. **Importar vínculos oficiais:** preservar as ligações disponíveis nas fontes e sua versão. Publicar após validação de integridade do parser e da referência; associação oficial não equivale a “entendimento dominante”.
3. **Extrair referências explícitas:** localizar citações de artigos e julgados nas passagens. Criar `mentions` quando a evidência só comprova menção; interpretação exige evidência adicional.
4. **Relacionar por questão/instituto:** usar taxonomia editorial, palavras-chave, busca híbrida e IA para propor candidatos. IA registra justificativa e trecho; candidatos sem evidência permanecem não publicados.
5. **Revisar:** aprovar semântica das novas relações e atribuição de posições; resolver versão, competência, voto/maioria e ambiguidade. Manter rótulos distintos entre vínculo oficial e conexão do NexoJuris.
6. **Publicar e atualizar:** índices e blocos usam relações publicadas. Se a fonte muda, marcar evidências afetadas como `needs_review`; preservar histórico e não apagar silenciosamente relações usadas em estudos salvos.

PostgreSQL é suficiente para esse modelo inicial: tabelas de entidades, passagens, questões, posições e relações; full-text e pgvector auxiliam descoberta. Banco de grafos não é exigência para apresentar conexões visuais.

## 4. Consulta e apresentação

`getConnections(resourceId, passageId, questionId?, dateContext?)` retorna conexões publicadas com motivo, origem, evidência e data de versão, agrupadas em legislação, doutrina e jurisprudência. Tribunal é filtro das conexões jurisprudenciais, não quarta coluna de conteúdo concorrente.

No estudo de coisa julgada, o instituto conduz ao art. 5º, XXXVI; passagens doutrinárias e julgados se agrupam pela questão delimitada. Este é um percurso de interface, não afirmação de que toda doutrina ou julgado localizado interprete diretamente esse dispositivo. Cada bloco exibido precisa de seu próprio vínculo comprovado.

Bloco mostra o motivo: “Comenta a proteção constitucional”, “Associado ao dispositivo na fonte oficial” ou “Interpreta a questão selecionada”. Seleção realça evidência correspondente no texto. Abrir artigo citado e abrir o bloco do mesmo artigo usa a mesma identidade e painel.

Comparar STF/STJ ou doutrina compara posições vinculadas à mesma questão, apresentando escopo, competência, contexto, data e qualidade da fonte. Ausência de um lado é lacuna explícita. Predominância é avaliação fundamentada separada, não propriedade computada por quantidade de resultados ou número de relações.

## 5. Entrega verificável da correlação

**Arquivos propostos NexoJuris:** `db/migrations/005_relations.sql`, `packages/contracts/src/connections.ts`, `apps/worker/nexojuris/{resolve_references,relation_candidates}.py`, `apps/web/src/features/sources/{connections,review-relations}.ts`, `tests/integration/relations.test.ts`.

**Contratos:** `resolveReference(input): ResolvedReference|UnresolvedReference`; `getConnections(input: {resourceId; passageId?; questionId?; dateContext?}): Promise<Connection[]>`; `reviewRelation(relationId, decision, reviewerId): Promise<RelationVersion>`. `Connection { id; kind; resourceId; questionId; relationType; reason; evidence; origin; version; tribunalId? }`.

- [ ] Escrever testes: citação cria `mentions`, não `interprets`; anotação oficial conserva origem; uma relação duplicada não duplica bloco; citação ambígua fica não resolvida; candidato sem evidência não publica; versão de artigo correta; tribunal corresponde ao documento; voto individual não vira posição colegiada.
- [ ] Rodar `pnpm exec vitest run tests/integration/relations.test.ts` e confirmar falha antes da implementação.
- [ ] Implementar identidade, resolvedor, registro de evidência, fila editorial e consulta com deduplicação por relação/destino/contexto. Relações diferentes para o mesmo destino preservam motivos, sem duplicar painel.
- [ ] Validar lote piloto de pelo menos 10 questões constitucionais, com amostras das três categorias e dos dois tribunais onde exista material pertinente. Se não houver associação, registrar lacuna em vez de fabricar cobertura.
- [ ] Medir precisão das relações publicadas por revisão e cobertura por questão; testes exigem 100% das relações publicadas com evidência acessível e nenhuma publicação de candidato não aprovado. Conferir semântica manualmente, não só integridade do banco.
- [ ] Repetir importação para provar idempotência; alterar fixture para provar revisão de evidências afetadas. Rodar suíte e registrar commit.

## 6. Entrega STF no ForgeLex

**Arquivos existentes a inspecionar antes de editar:** `packages/source-catalog`, `packages/source-providers`, `packages/legal-data`, `packages/persistence`, `packages/legal-tools/src/gateway/legal-tool-gateway.ts`, `packages/billing-ledger`, `apps/api` e contratos OpenAPI/MCP. Os caminhos internos do novo provider não são definidos sem leitura dos módulos.

- [ ] Documentar fonte STF permitida e formato real; definir IDs e normalização, tribunal e órgãos. Adotar a estrutura existente e um lote piloto versionado.
- [ ] Escrever testes de ingestão STF, deduplicação, versões, pesquisa, obtenção, verificação e isolamento; a mesma numeração não colide entre STJ/STF.
- [ ] Implementar ingestão/indexação e proveniência usando contratos comuns; conservar fontes originais e distinguir inteiro teor, ementa e informativo.
- [ ] Evoluir catálogo, schemas, gateway, REST e MCP de forma compatível para `court = STF`; revisar política de billing e preços explicitamente, sem copiar 20 centavos por pressuposição. Preservar STJ, scopes, idempotência e rejeição de tribunais ainda não suportados.
- [ ] Rodar testes STJ e STF; homologar cobertura e contrato. Não basta remover `FROZEN_STRATEGICALLY` ou aceitar o filtro para declarar suporte.
- [ ] Só após homologação habilitar STF para o adaptador NexoJuris. Até então, conexões constitucionais oficiais locais continuam navegáveis, com disponibilidade documental explícita.

## 7. Mercado Pago e dois modelos comerciais

ForgeLex conserva checkout de créditos pré-pagos e ledger existente. NexoJuris ganha adaptador próprio de assinatura, plano/ciclo/franquia e ledger de uso separado. Componentes de assinatura/webhook podem compartilhar implementação quando os contratos permitirem; nenhum pagamento pode conceder saldo aos dois produtos por engano.

Referências oficiais consultadas:
- https://www.mercadopago.com.br/developers/pt/reference/online-payments/subscriptions/overview
- https://www.mercadopago.com.br/developers/pt/reference/online-payments/subscriptions/create-preapproval/post
- https://www.mercadopago.com.br/developers/pt/docs/subscriptions/additional-content/your-integrations/notifications/webhooks

O Mercado Pago expõe `/preapproval` para assinaturas e `/preapproval_plan` para planos. Isso não significa que esses fluxos estejam no adaptador ForgeLex atual; a conta, ambiente de teste, modalidade e eventos precisam de homologação.

**Arquivos propostos NexoJuris:** `apps/web/src/features/account/{subscription-provider,subscription-reconciler,entitlements}.ts`, `db/migrations/006_subscriptions.sql`, `tests/integration/subscriptions.test.ts`.

**Interfaces:** `createSubscription(userId, planId, idempotencyKey): Promise<SubscriptionCheckout>`; `reconcileSubscription(providerId): Promise<SubscriptionState>`; `grantCycle(paymentId, subscriptionId, cycleId): Promise<EntitlementGrant>`.

- [ ] Testar evento duplicado/fora de ordem, autorização da assinatura sem parcela paga, pagamento recusado, cancelamento, estorno e produto incorreto. `grantCycle` tem unicidade por produto, assinatura e ciclo com referência de pagamento validada.
- [ ] Implementar adaptador de assinaturas e verificação do webhook seguida de consulta autorizada ao provedor. Não conceder mês novo só pelo status `authorized` da assinatura ou retorno do navegador.
- [ ] Implementar política explícita para ciclo pago, renovação, cancelamento e inadimplência. Crédito de ciclo e cotas diária/semanal têm regras distintas e não se renovam duas vezes por replay.
- [ ] Homologar recorrência e estados no ambiente de teste apropriado; registrar evidência e falhas, sem cobrança produtiva nesta etapa de planejamento.
- [ ] Registrar custo de pesquisa ForgeLex/STF, IA, recuperação, infraestrutura e pagamento na margem NexoJuris. Navegação local segue sem IA; pesquisa complementar paga exige orçamento.

## 8. Ordem coordenada e critério de integração

Após definir identidade/versões e contrato compartilhado: NexoJuris pode construir frontend, doutrina e anotações enquanto ForgeLex implementa ingestão STF. Correlação e resolvedor fazem a junção; disponibilidade de STF no gateway é um gate para pesquisa remota, não para navegar as anotações locais.

Sequência final: corpus piloto → resolução de IDs → relações verificadas → suporte STF homologado → agentes de explicação/comparação → orçamento/assinatura → piloto com usuários. Banco de fontes e de relações devem estar prontos antes de avaliar comparações jurídicas.

Esta é uma expansão planejada dos dois produtos. Não houve habilitação, mudança de preços, criação de assinatura, implantação ou alteração no repositório ForgeLex.
