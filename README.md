# NexoJuris

**Compreenda direito. Conecte ideias.**

Aplicação independente para estudar Direito de forma integrada a partir de uma pergunta central livre. Recorte legislativo inicial: Constituição Federal. Primeiro teste: controle de constitucionalidade.

## Planejamento vigente

- [Planejamento integral do site](docs/architecture/site-completo.md): framework, motores de pesquisa/IA, grafo, banco, hospedagem, cloud, domínio, contas, consumo, segurança, custos e operação.
- [Especificação do núcleo](docs/superpowers/specs/2026-10-05-pesquisa-integrada-design.md) e [plano de implementação local](docs/superpowers/plans/2026-10-05-pesquisa-integrada.md).

O NexoJuris é um produto novo, com infraestrutura e adaptadores próprios. Documentos anteriores que pressupõem integração com ForgeLex permanecem como histórico; não são requisitos do planejamento vigente. Tecnologias cloud e endereços no planejamento são propostas, não recursos contratados.

## Estado da fundação

- Base Next.js, React e TypeScript.
- Primeiro workspace de estudo em componentes, com navegação contextual testada.
- Protótipo visual aprovado preservado em `/prototipo/index.html` como referência.
- Especificação, plano e integração documentados em `docs/`.
- Acervo, IA, autenticação, pagamentos e chamadas ForgeLex ainda não ativados. Dados de exemplo rotulados na interface.

## Executar

Com Node.js 24 ou superior:

```sh
npm install
npm test
npm run typecheck
npm run dev
```

Abra http://localhost:3000. Para validar a versão de produção: `npm run build` e `npm start`.

O primeiro lockfile deve ser gerado e versionado após instalação bem-sucedida. Na sessão de fundação, a rede bloqueou o registry e a conexão Git direta; a dependência do framework e seu build ainda não foram validados. Os testes de navegação não precisam de dependências externas.

## Integração

Pesquisa jurídica será construída com acervo, grafo e adaptadores próprios de fontes autorizadas. Nenhuma infraestrutura, credencial, banco, conta ou saldo de outro produto é pressuposto. Mercado Pago recorrente pertence à implementação do NexoJuris.

O símbolo atual é uma proposta PNG em contorno. Vetorização e simplificação da marca continuam previstas.
