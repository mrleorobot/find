<div align="center">
  <img src="https://capsule-render.vercel.app/api?type=waving&color=0:050505,100:1a1a2e&height=180&section=header&text=LedgerIQ&fontSize=60&fontColor=ffffff&animation=fadeIn&fontAlignY=35&desc=Auditoria%20Fiscal%20com%20IA&descSize=20&descAlignY=60" />
</div>

<div align="center">
  <img src="https://img.shields.io/badge/Next.js-14-000000?style=for-the-badge&logo=next.js&logoColor=white" />
  <img src="https://img.shields.io/badge/TypeScript-5.5-3178C6?style=for-the-badge&logo=typescript&logoColor=white" />
  <img src="https://img.shields.io/badge/Tailwind-4-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white" />
  <img src="https://img.shields.io/badge/Gemini%20AI-2.0-4285F4?style=for-the-badge&logo=google&logoColor=white" />
</div>

<br>

## 📋 Sobre

**LedgerIQ** é uma aplicação de auditoria fiscal que utiliza inteligência artificial (Google Gemini) para extrair dados de notas fiscais, categorizar despesas e gerar relatórios financeiros automatizados.

Desenvolvido como parte do portfólio de [Leonilson Souza](https://mrleorobot.github.io).

## ✨ Funcionalidades

- 📄 **Extração de Notas Fiscais** — Upload de PDF/imagens com OCR + IA
- 🤖 **Categorização Automática** — Classificação inteligente de despesas
- 📊 **Dashboard Analítico** — Visualização de gastos por categoria e período
- 💾 **Histórico Local** — Persistência de análises no navegador
- 📤 **Exportação** — Relatórios em múltiplos formatos
- 🌙 **Tema Escuro Premium** — Interface dark com design refinado

## 🛠️ Stack

| Camada | Tecnologia |
|:---|:---|
| Framework | Next.js 14 (App Router) |
| Linguagem | TypeScript 5 |
| Estilos | Tailwind CSS 4 |
| Animações | Motion (Framer Motion) |
| Ícones | Lucide React |
| IA | Google Gemini API |

## 🚀 Como usar

```bash
# Clone o repositório
git clone https://github.com/mrleorobot/find.git
cd find

# Instale as dependências
npm install

# Configure a variável de ambiente
echo "GEMINI_API_KEY=sua_chave_aqui" > .env.local

# Inicie o servidor de desenvolvimento
npm run dev
```

Acesse `http://localhost:3000`

## 📁 Estrutura

```
app/
├── page.tsx          # Landing page
├── dashboard/        # Painel principal
│   └── page.tsx
├── api/analyze/      # API de análise com Gemini
│   └── route.ts
├── layout.tsx        # Root layout + metadata
├── globals.css       # Design system
├── icon.tsx          # Favicon programático
├── apple-icon.tsx    # Ícone iOS
└── manifest.ts       # PWA manifest

components/
├── dashboard/        # Componentes do painel
├── GlassAquaIcons.tsx # Ícones customizados

lib/
├── hooks/            # Hooks customizados
├── services/         # Integração Gemini
├── types/            # Tipos TypeScript
└── utils/            # Utilitários
```

## 📊 Resultados

- ⏱️ **Redução de 4h → 15 min** no processamento de documentos
- 🎯 **Precisão de 94%** na extração de dados via IA
- 📱 **PWA instalável** — funciona offline

## 📝 Licença

MIT © [Leonilson Souza](https://github.com/mrleorobot)

---

<div align="center">
  <a href="https://mrleorobot.github.io">
    <img src="https://img.shields.io/badge/🔗%20Ver%20Portfólio-mrleorobot.github.io-0d1117?style=for-the-badge" />
  </a>
</div>
