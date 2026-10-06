# NexoJuris

**Compreenda direito. Conecte ideias.**

Aplicação independente de estudo jurídico, integrada ao ForgeLex por API. Recorte inicial: Constituição Federal.

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

Pesquisa STJ será consumida no servidor a partir do contrato ForgeLex. STF é uma expansão planejada do ForgeLex. Credenciais, saldos, dados privados e assinaturas não são compartilhados por pressuposição. Mercado Pago recorrente pertence à implementação do NexoJuris.

O símbolo atual é uma proposta PNG em contorno. Vetorização e simplificação da marca continuam previstas.
