# Fundação — 05/10/2026, America/Fortaleza

Repositório de destino: https://github.com/junior-aguiar-eng/nexojuris-estudo

Ruling: criar a base em uma pasta isolada e branch `foundation/nexojuris` — repositório remoto vazio e clonagem de rede indisponível. Não modificar ForgeLex nem publicar serviços.

Ruling: esta entrega é a fundação do projeto, com navegação e fixtures; não declarar as tarefas completas do plano de MVP — faltam fontes, contratos, infraestrutura e orçamento operacional.

Ruling: GitHub write bloqueado pela aprovação indisponível; preservar entrega local pronta para envio, sem tentar outro canal para contornar a negativa.

Ruling: instalação de dependências bloqueada; testes de domínio executados pelo Node, mas build/typecheck Next.js precisam ser executados após instalar dependências.

A experiência aprovada está preservada como referência independente. A implementação em componentes é o ponto de partida e não substitui a validação posterior do fluxo visual completo.

Verificação local: node --test tests/*.test.ts — 2 testes passaram. Build e typecheck pendentes de instalação de dependências. O teste inicialmente falhou pela ausência do módulo de navegação e passou após a implementação.
