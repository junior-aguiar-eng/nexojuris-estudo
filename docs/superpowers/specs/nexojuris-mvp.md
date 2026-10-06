# NexoJuris — especificação do MVP

Data: 05/10/2026. Documento de produto consolidado a partir desta conversa.

## Objetivo

Criar um ambiente de estudo de institutos jurídicos que conecte doutrina, Constituição Federal e jurisprudência verificável, com IA opcional e consumo previsível. O estudante navega por temas e questões; referências bibliográficas aparecem como prova das explicações, não como organização principal do acervo.

## Estado atual e limites

Existe um protótipo HTML interativo, `nexojuris.html`, com navegação e custos simulados. Ele não consulta acervo real, não chama modelos, não cobra e não comprova posições jurisprudenciais. O Google Cloud, o PostgreSQL, o Docker, o Mercado Pago, o domínio nexojuris.ia.br e a infraestrutura ForgeLex foram informados pelo proprietário; seus repositórios, configurações e interfaces não foram inspecionados nesta tarefa.

O logo atual é uma proposta rasterizada em contorno, criada para o protótipo. A versão final da identidade precisa de um arquivo vetorial com simplificação adequada a tamanhos pequenos.

## Experiência aprovada

- Busca central arredondada e interface clean, com Inter e identidade verde-petróleo.
- Nome e símbolo de juiz histórico com martelo no cabeçalho. Slogan de trabalho: “Compreenda direito. Conecte ideias.”
- Fundo suave com marca-d'água na busca; leitura com fundo discreto e texto legível.
- Enquanto digita, surgem conexões laterais; durante a execução há movimento e esmaecimento leves, encerrados quando o resultado chega.
- Texto principal no centro e presença visual de doutrina, legislação e jurisprudência. Não retirar essas categorias para simplificar o fluxo.
- Conexões vinculadas ao trecho em foco, com posições estáveis, destaque de seleção e passagem correspondente realçada.
- Referência no texto e bloco lateral que apontem ao mesmo recurso compartilham destino e estado. Ações equivalentes não são repetidas em vários lugares.
- Apenas uma exploração expandida por vez. Aprofundamentos preservam leitura e histórico de retorno, sem acumular janelas.
- Manter os modos Compreender, Comparar e Aplicar do protótipo; Comparar direciona para a ferramenta contextual correspondente, sem recriá-la.
- Meus estudos é uma página própria, com busca e cartões, sem sidebar de histórico.
- No celular, conexão expandida ocupa uma superfície própria com retorno à mesma passagem.
- Animações respeitam preferência de movimento reduzido; controles acessíveis por teclado.

## Acervo inicial

Constituição Federal, anotações e vínculos oficiais disponíveis em A Constituição e o Supremo, mais registros pertinentes do Corpus927 e materiais doutrinários autorizados pelo proprietário. A extensão ao STJ depende de relações efetivamente disponíveis e validadas; não pressupor que todo artigo constitucional tenha um precedente correspondente em cada tribunal.

Fontes de referência informadas:

- https://portal.stf.jus.br/constituicao-supremo/constituicao.asp
- https://corpus927.enfam.jus.br/

Não pressupor API pública, formatos estáveis nem autorização irrestrita de republicação. Antes de integrar, documentar método permitido de aquisição, condições de uso e autorização das obras. Posse de exemplar e titularidade de direitos de exploração são campos distintos do cadastro.

Cada dispositivo tem identidade estável, hierarquia, redações e vigência. Cada documento tem fonte, URL ou identificador, versão, hash, data de coleta e localizador. Cada relação registra origem oficial, revisão editorial ou sugestão automática. Sugestões automáticas não recebem rótulo de vínculo oficial.

## IA e fidelidade

Busca híbrida textual e semântica. Seleção de embeddings por avaliação em português jurídico, antes de indexar o acervo completo. Não fixar dimensão ou fornecedor sem benchmark.

Aliases de produto solicitados: Luna, Flash, Sonnet e Opus. “Luna” precisa ser associado a um fornecedor e ID real de API; não presumir que o nome corresponda a produto disponível. IDs e preços dos demais também são configuráveis e verificados antes da contratação.

As explicações devem ser completas na questão delimitada, com fontes e localizadores verificáveis. Citações diretas correspondem ao texto efetivamente recuperado. Uma resposta sem material suficiente declara a lacuna e não inventa autores, páginas, processos ou teses.

Comparação entre STF e STJ delimita questão, competência, fatos, datas e autoridade dos precedentes. “Posição dominante” só aparece acompanhada de critério e suporte; se não houver base para conclusão, a interface indica insuficiência ou divergência. Frequência de resultados recuperados não prova predominância.

## Consumo e negócio

A navegação por dispositivos, fontes e conexões previamente disponíveis não aciona análise de IA. Gerar explicação, comparar e analisar raciocínio são atividades tarifadas conforme modelo e escopo.

O usuário escolhe o modelo e recebe preço ou limite máximo de consumo antes da atividade. Mudança de modelo atualiza o aviso e não cobra pela simples seleção. O servidor controla orçamento e execução: frontend não é autoridade de saldo ou cobrança.

Tarifa inclui API, recuperação, infraestrutura variável, taxas de pagamento, suporte e rateio operacional. A margem precisa ser calculada e acompanhada. Créditos, planos, cotas diárias e semanais, franquia mensal e retenção são configurações comerciais, não valores herdados do protótipo. Luna não será gratuito por causa do preço zero da demonstração.

Sugestões de partida, sujeitas à definição comercial: histórico temporário de 30 dias e 50 estudos salvos. Não apagar estudos salvos automaticamente ao atingir o limite; o cliente escolhe o que remover. Créditos e cotas são controles distintos e devem ter regras explícitas de renovação.

## Fronteiras do MVP

Inclui área pública simples; autenticação; busca; estudo e conexões; comparação; aplicação em questões delimitadas; consumo; Mercado Pago; histórico; atualização do acervo; painel interno de revisão.

Não inclui curso em vídeo, navegação por biblioteca de livros, aplicativo nativo, grafo de conhecimento obrigatório, agente autônomo que publica conclusões sem validação ou expansão imediata para toda a legislação.

## Critério de lançamento

Um estudante consegue pesquisar um instituto constitucional, ler resposta rastreável, abrir suas conexões oficiais, comparar uma questão suportada, salvar e retomar o estudo e compreender seu consumo. Mudanças em fonte e cobrança são rastreáveis; nenhuma condição de teste ou valor fictício é apresentada como produção.


## Atualização após inspeção inicial do ForgeLex — 05/10/2026

Foi realizada leitura da branch main do repositório junior-aguiar-eng/ForgeLex. Os resultados e suas limitações estão em `docs/architecture/forgelex-integration.md`. Esta atualização prevalece sobre pressupostos anteriores: ForgeLex é pré-pago por operação, tem pesquisa comercial STJ e frontend React/Vite; o gateway não gerencia modelos de IA. A assinatura mensal e sua recorrência são novas capacidades do NexoJuris. O domínio nexojuris.ia.br já está associado ao ForgeLex na documentação; nenhum DNS será alterado sem definir a separação. A tarefa 0 continua parcialmente pendente porque produção, autenticação completa e contratos de integração ainda não foram validados.


## Escopo adicional aprovado — explicação de julgados e agentes de tarefa

O MVP inclui explicar um julgado e explicar um artigo por ferramentas direcionadas e padronizadas. São workflows delimitados no servidor, acionados pelo usuário; não são personagens de chat separados ou agentes que pesquisam e gastam indefinidamente.

### Agentes iniciais

1. **Explicar julgado:** identificação; documento efetivamente utilizado; contexto fático/processual disponível; questão jurídica; resultado; fundamentos determinantes; tese formal quando existente; divergências comprovadas; alcance e limitações; dispositivos e institutos conectados. Separar fundamentação da maioria, voto individual, obiter dictum e síntese didática. Ausência desses dados é declarada, não preenchida por suposição.
2. **Explicar artigo:** redação e versão; finalidade; elementos normativos; requisitos; efeitos; exceções e conexões com outros dispositivos, doutrina e julgados disponíveis; exemplo didático explicitamente hipotético.
3. **Comparar doutrina / comparar jurisprudência:** usar os contratos de comparação já planejados, delimitando questão e mantendo atribuições rastreáveis.
4. **Testar entendimento:** pergunta, resposta do estudante e feedback fundamentado, sem expor gabarito antes da tentativa quando a atividade assim exigir.

Cada workflow possui entrada validada, prompt versionado, ferramentas permitidas, regras de fonte, estrutura de saída, limites de execução e avaliação de qualidade. A escolha Luna/Flash/Sonnet/Opus altera o executor do mesmo roteiro; não altera silenciosamente sua missão ou seu formato. Um modelo que não comporte a tarefa é apresentado como indisponível para ela, sem troca automática para outro mais caro.

### Fidelidade documental

Explicar julgado usa prioritariamente o inteiro teor quando disponível e licenciado para uso. Se houver somente ementa, informativo ou trecho, indicar esse nível de evidência e limitar a explicação; ementa não prova todos os fatos ou todos os fundamentos do acórdão. Fontes complementares ficam identificadas separadamente. Situação atual do precedente e eventual superação exigem verificação própria, não são presumidas pelo texto original. Se essa verificação não ocorreu, o resultado declara a data e o limite da consulta.

Explicar artigo usa a redação consolidada pertinente e o localizador do dispositivo. Não gerar interpretação de dispositivo revogado como se estivesse vigente. Versões históricas são permitidas com identificação expressa.

### Fluxo visual e consumo

Julgado expandido tem uma ação principal **Explicar este julgado**; artigo expandido tem **Explicar este artigo**. Ambos acionam o mesmo executor central e mostram a análise na área de aprofundamento, preservando leitura e retorno. Acesso ao mesmo recurso por bloco ou referência textual compartilha identidade e resultado. Comparar continua acessível pelo modo existente e pelo contexto, direcionando à mesma ferramenta.

Antes da execução, mostrar modelo, escopo e consumo máximo. Ler documento disponível não consome IA; gerar explicação é atividade tarifada. Busca complementar paga no ForgeLex entra no orçamento antes de executada. Se não couber no orçamento, pedir ampliação explícita ou entregar a análise limitada ao material existente. Resultado concluído pode ser reaberto sem nova geração; atualizar fontes, modelo ou profundidade é nova atividade identificada.

### Critério adicional de aceite

O estudante abre um julgado, identifica a fonte disponível, solicita explicação com consumo confirmado e recebe análise estruturalmente consistente, com cada afirmação relevante apoiada em localizador ou marcada como exemplo/insuficiência. O mesmo artigo ou julgado não gera painéis ou cobranças duplicadas por dois caminhos de acesso.


## Expansão aprovada: STF, correlações e recorrência

O proprietário autorizou ampliar o planejamento para implementar STF no ForgeLex em frente coordenada com o NexoJuris. A limitação STJ descrita acima permanece uma constatação do estado atual, não uma restrição definitiva do novo escopo. O plano complementar está em docs/architecture/correlations-stf-subscriptions.md e define entidades, tipos de relação, evidências, publicação, resolvedor de IDs, evolução dos contratos STF e assinatura Mercado Pago. A tarefa de correlação entra após ingestão e antes da geração/comparação; a entrega STF é uma frente própria, e a assinatura recorrente complementa a tarefa 7. Nenhuma dessas capacidades foi habilitada nesta entrega de planejamento.
