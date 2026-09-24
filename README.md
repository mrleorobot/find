# LedgerIQ

Aplicação para extrair e organizar dados de notas fiscais e comprovantes com Google Gemini. O repositório mantém o nome `find`.

[Visualizar projeto](https://find-seven-psi.vercel.app) · [Portfólio](https://mrleorobot.github.io/)

## Recursos

- Envio de documentos em PDF e imagens para análise.
- Extração de informações como fornecedor, CNPJ, data, valor e categoria.
- Painel para consultar os resultados.
- Histórico armazenado no navegador, com busca e ordenação.
- Exportação do histórico em CSV.

A análise depende de conexão com a API do Gemini. O histórico inicial inclui dados de demonstração.

## Tecnologias

Next.js 14, React, TypeScript, Tailwind CSS, Motion e Google GenAI SDK. As versões declaradas estão em [package.json](package.json).

## Executar localmente

Requisito: Node.js com npm.

```bash
git clone https://github.com/mrleorobot/find.git
cd find
npm install
```

Copie `.env.example` para `.env.local` e preencha `GEMINI_API_KEY` com sua chave. A configuração é lida pela integração no servidor. O arquivo local está excluído do Git.

```bash
npm run dev
```

Abra o endereço exibido pelo servidor no terminal.

Para gerar e servir a versão de produção:

```bash
npm run build
npm start
```

## Estrutura

| Caminho | Conteúdo |
| --- | --- |
| [app/page.tsx](app/page.tsx) | Página de apresentação |
| [app/dashboard/](app/dashboard/) | Painel da aplicação |
| [app/api/analyze/route.ts](app/api/analyze/route.ts) | Recebimento e validação dos documentos |
| [components/dashboard/](components/dashboard/) | Componentes do painel |
| [lib/services/gemini.ts](lib/services/gemini.ts) | Integração com Gemini |
| [lib/hooks/](lib/hooks/) | Estado da análise e do histórico |
| [lib/utils/export.ts](lib/utils/export.ts) | Exportação CSV e resumo dos resultados |

## Licença

MIT © Leonilson Souza
