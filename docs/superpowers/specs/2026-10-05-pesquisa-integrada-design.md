# Pesquisa integrada — primeiro circuito funcional

Data: 05/10/2026. Especificação para revisão, baseada nas decisões desta conversa.

## Propósito e precedência

Permitir estudar Direito de forma integrada a partir de uma pergunta central livre. O sistema interpreta a questão e articula doutrina, legislação e jurisprudência; o grafo sustenta as conexões contextuais da interface, sem exigir diagrama visual.

O primeiro teste será exclusivamente sobre controle de constitucionalidade. Esta especificação e seu plano detalham o núcleo local do planejamento integral em `docs/architecture/site-completo.md`. Constituição inteira, outros temas, múltiplos provedores, assinaturas e publicação são etapas posteriores do NexoJuris independente. Não há autorização de contratação ou consumo pago implícita na redação do plano.

## Decisões do usuário

- Doutrina fornecida pelo proprietário em PDF ou Markdown.
- Pergunta livre; o site identifica conceitos e relações pertinentes, sem exigir que o cliente escolha um tema cadastrado.
- Banco interno consultado primeiro; web de fontes previamente autorizadas complementa lacunas e atualização.
- Resultado organizado, sem exibir buscas ou links; autoria, obra, dispositivo e julgado aparecem como referências discretas.
- Prompts e scripts internos direcionados ao objetivo: compreender, comparar e aplicar, além de explicar artigo e julgado.
- Constituição Federal como acervo legislativo inicial; dispositivos externos podem ser recuperados em fontes autorizadas.
- Interface dos prints como referência ajustável: leitura central, conexões contextuais, aprofundamento e retorno preservados.
- Arquivo piloto aceito exatamente como enviado; título derivado do nome do arquivo e metadados não informados permanecem desconhecidos, sem exigir complementação.

## Arquitetura proposta para implementação

Manter Next.js/React/TypeScript em `src/`, npm e Node >=24. Servidor Next.js executa pesquisa e acesso a dados; scripts TypeScript fazem ingestão e revisão administrativa. Usar PostgreSQL 18 em ambiente local isolado, driver `pg`, migrations SQL e arquivos originais fora de `public/`. O grafo é representado por tabelas de nós, relações e evidências. Não adicionar outro serviço de banco nem um worker Python no primeiro circuito.

PDF com camada textual: extração por página com `pdfjs-dist` no script Node; Markdown tratado como texto, sem executar HTML ou código. PDF digitalizado, protegido ou sem texto suficiente recebe estado de revisão e não é indexado como extração bem-sucedida. OCR é uma extensão posterior. A localização inclui página física do PDF; página editorial somente quando comprovada. Markdown usa seção e intervalo de linhas.

Busca inicial combina full-text português, correspondência literal, aliases editoriais e expansão do grafo. Um modelo interpreta a pergunta em estrutura validada, mas os termos originais também são pesquisados. Sem embeddings no primeiro circuito; a avaliação mede essa abordagem antes de justificar índice vetorial.

Modelo real acessado por adaptador HTTP no servidor com URL, ID, segredo e limites configuráveis. Começar com um executor compatível com Chat Completions e saída JSON validada por Zod; nomes comerciais do protótipo não representam modelos disponíveis. Adaptador falso serve apenas a testes e fica rotulado. Modelo local compatível pode ser usado; prova com adaptador falso não conta como estudo real.

## Identidade e evidência

Nós: conceito, questão, dispositivo, documento e passagem. Documento tem tipo doutrina/legislação/jurisprudência, versão, hash e metadados de origem. Passagem conserva texto e localizador. Dispositivo mantém identidade independente de suas redações; julgado registra tribunal, classe, número, órgão e nível documental.

Relações: `governed_by`, `comments_on`, `mentions`, `interprets`, `supports`, `opposes`, `related_to` e `official_annotation`. Cada relação tem evidência, origem, estado e versão. Citação explícita pode gerar `mentions`; não gera interpretação ou concordância automaticamente. Relações semânticas propostas por IA passam por revisão editorial antes de integrar o grafo publicado.

Conexões descobertas durante uma consulta podem integrar seu resultado como relações contextuais fundamentadas, sem entrar automaticamente no grafo global. Devem preservar a evidência, distinguir descoberta da sessão e vínculo editorial/oficial e informar ausência de suporte. Toda relação apresentada precisa de passagem recuperada ou referência oficial comprobatória.

## Execução da pergunta

1. Validar entrada e orçamento técnico; identificar questão, conceitos, aliases, ambiguidade e necessidade de atualidade.
2. Consultar banco, resolver entidades e percorrer até duas relações publicadas; selecionar passagens relevantes.
3. Quando houver lacuna ou necessidade de atualização, pesquisar apenas fontes habilitadas no cadastro. Ausência de acesso externo gera limite explícito, sem conclusão atual inventada.
4. Executar o roteiro escolhido com as evidências: explicação integrada, comparação delimitada ou atividade de aplicação. Artigo/julgado usa recurso e versão selecionados.
5. Validar formato, identidade e citações literais; relações e afirmações relevantes recebem evidência interna. Revisão jurídica humana mede suporte semântico: validação estrutural não prova correção jurídica.
6. Persistir resultado e seu conjunto de evidências; apresentar resposta, referências discretas e conexões por passagem. Reabrir resultado ou fonte não executa nova geração.

Pergunta ambígua retorna esclarecimento; pergunta fora do piloto retorna limite de cobertura, sem resposta forçada. Resultados insuficientes podem apresentar o que foi sustentado e as lacunas. A pesquisa externa não envia passagens integrais de doutrina privada: usa termos públicos e questão minimizada.

## Ambiente e limites propostos

Piloto local, usuário único, servidor em localhost; importação e revisão por CLI, sem upload público. Não expor endpoints sem autenticação em rede externa. Histórico local de resultados no banco, sem política comercial de retenção nesta etapa.

Limites técnicos iniciais configuráveis: entrada de 2.000 caracteres; até 20 passagens internas; no máximo 2 saltos no grafo e 40 nós; até 3 consultas externas e 5 documentos externos; 3 chamadas de modelo por execução; 120 segundos por execução; arquivo de até 50 MiB e 1.000 páginas. Contexto e saída obedecem ao perfil real do modelo, sem cortar evidência silenciosamente. Valores são limites de piloto, não tarifas comerciais.

Fontes web começam desabilitadas. Configuração proposta: Planalto, STF e STJ, com hosts/caminhos exatos e método de busca confirmado por fonte. Ativação depende de autorização do proprietário e inspeção gratuita das condições e do funcionamento. A execução não contorna CAPTCHA nem supõe API. Cadastro novo não é autorizado pelo modelo.

## Aceite

Pergunta livre de controle de constitucionalidade produz estudo integrado a partir de documentos reais, abre conexões contextualizadas e preserva a leitura. Não fabricar conexão para preencher categorias sem material. Compreender, Comparar e Aplicar compartilham evidências e contexto; aplicação não mostra correção antes da tentativa.

Revisão de 30 perguntas: 18 respondíveis, 4 ambíguas, 4 insuficientes e 4 fora do recorte. Aprovação exige zero fontes ou citações inventadas, zero relações sem evidência, esclarecimento/limite adequado em todos os 12 casos especiais e pelo menos 16 das 18 respondíveis aprovadas pelo proprietário por pertinência, integração e suporte jurídico. Todas as falhas são registradas; esses números não provam qualidade geral de produção.

## Documentação técnica consultada

- PostgreSQL full-text: https://www.postgresql.org/docs/current/textsearch.html
- Next.js Route Handlers: https://nextjs.org/docs/app/getting-started/route-handlers

As versões de novas dependências, sua licença e compatibilidade Node/Next deverão ser registradas e fixadas na tarefa de preparação, usando metadados oficiais. Nenhuma instalação foi executada para produzir esta especificação.
