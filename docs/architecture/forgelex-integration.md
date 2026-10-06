# ForgeLex → NexoJuris — inspeção inicial e integração

Inspeção de leitura em 05/10/2026, America/Fortaleza. Repositório: https://github.com/junior-aguiar-eng/ForgeLex, branch main. Não houve execução do serviço, testes remotos pagos, alteração de código ou acesso à configuração produtiva.

## Evidência observada

- `README.md`: descreve produto STJ, REST/MCP, pré-pago BRL sem mensalidade, índice próprio persistido e domínio nexojuris.ia.br associado ao ForgeLex. Suas evidências de release são datadas; não comprovam a revisão produtiva atual.
- `apps/api/package.json`: API Fastify/TypeScript, pacotes internos de pesquisa, auditoria, persistência, billing e MCP; Drizzle e integração Google Cloud Storage.
- `apps/web/package.json`: React/Vite, TypeScript e dependência Supabase. O ForgeLex não usa Next.js nesse frontend.
- `packages/legal-tools/src/gateway/legal-tool-gateway.ts`: contrato 1.0.0 para `research.search_case_law`, `research.get_authority` e `research.verify_authority`; escopo `research:read`; tribunal STJ; até 20 resultados na busca; timeout/cancelamento e proveniência. Busca: 20 centavos conforme código lido; obter e verificar: gratuitos. Esse valor é evidência do repositório, não cotação confirmada do serviço ao vivo.
- `docs/legal-tool-gateway.md`: REST e MCP projetam o mesmo contrato. ForgeLex fornece dados e operações jurídicas; modelos, tokens e margem de provider não pertencem ao gateway.
- `apps/api/src/billing/mercado-pago-payment-provider.ts`: checkout de créditos, idempotência, contrato de webhook e `supportsAutoRecharge = false`; cobrança off-session e configuração de método de pagamento retornam indisponibilidade. O adaptador atual não é uma implementação de assinatura mensal recorrente.
- `scripts/phase8/remote-http.mjs`, localizado por busca: usa `/api/v2/research/search-case-law` com `idempotency-key`; a compatibilidade completa de autenticação/respostas ainda exige leitura do OpenAPI e rotas.

## Correções ao planejamento inicial

1. Dois produtos, mas não duas assinaturas atuais: ForgeLex é pré-pago por operação; assinatura mensal com franquia pertence ao novo NexoJuris.
2. NexoJuris usa o ForgeLex inicialmente para STJ; Constituição/STF e vínculos Corpus927 precisam de aquisição própria ou de novas capabilities explicitamente desenvolvidas. Não habilitar STF por inferência.
3. Custos de pesquisas no ForgeLex entram na economia unitária do NexoJuris. Navegação gratuita só serve recursos locais ou chamadas gratuitas confirmadas; abrir uma conexão não dispara nova busca paga silenciosamente.
4. Mercado Pago pode oferecer componentes reaproveitáveis, mas recorrência e ciclos de franquia precisam de nova implementação homologada.
5. Next.js permanece proposta para o novo produto, não uma descrição da infraestrutura existente. React/Vite é alternativa a avaliar se o reaproveitamento superar a necessidade de renderização pública no servidor.
6. O domínio raiz já possui finalidade documentada. Proposta para validação posterior: manter rotas e endpoints atuais e começar NexoJuris em `estudo.nexojuris.ia.br`. Não mudar DNS, OAuth, callbacks ou domínio comercial nesta inspeção.

## Contrato proposto do adaptador NexoJuris

`searchStj(query, limit, requestId)` acessa a operação de pesquisa; `getAuthority` e `verifyAuthority` preservam identificadores, proveniência e estado de verificação. Chave de idempotência é estável por execução/retry, mas distinta por nova intenção de pesquisa.

O servidor NexoJuris chama REST com uma identidade de integração restrita a pesquisa. A forma real dessa identidade (token/conta dedicada e políticas comerciais) depende da autenticação existente; não foi comprovado suporte específico a contas de serviço. Não usar token pessoal do proprietário como solução permanente.

Frontend NexoJuris → servidor NexoJuris → adaptador REST ForgeLex → índice STJ. Constituição, doutrina, relações e histórico ficam na base do NexoJuris. Saldos separados; nenhum usuário é debitado duas vezes pela mesma reserva/execução. Não há acesso a matters ou documentos privados nessa integração de pesquisa.

## Próximas verificações da tarefa 0

- Ler OpenAPI e rotas de pesquisa, autenticação e escopos; confirmar resposta e política de idempotência.
- Conferir política de conta de integração e regras de reutilização dos resultados.
- Inspecionar pipeline e configuração de ambientes com dados sensíveis sanitizados; identificar revisão realmente implantada.
- Definir subdomínio, configuração OAuth/cookies/CORS e destino do novo repositório sem alterar ForgeLex publicado.
- Recalcular tarifas considerando IA, busca ForgeLex, infraestrutura e taxas. Confirmar preços vigentes mediante leitura gratuita de política/contrato, sem disparar pesquisas pagas.


## Expansão aprovada: STF, correlações e recorrência

O proprietário autorizou ampliar o planejamento para implementar STF no ForgeLex em frente coordenada com o NexoJuris. A limitação STJ descrita acima permanece uma constatação do estado atual, não uma restrição definitiva do novo escopo. O plano complementar está em docs/architecture/correlations-stf-subscriptions.md e define entidades, tipos de relação, evidências, publicação, resolvedor de IDs, evolução dos contratos STF e assinatura Mercado Pago. A tarefa de correlação entra após ingestão e antes da geração/comparação; a entrega STF é uma frente própria, e a assinatura recorrente complementa a tarefa 7. Nenhuma dessas capacidades foi habilitada nesta entrega de planejamento.
