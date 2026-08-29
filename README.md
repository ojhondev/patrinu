# Patrinu

**O ecossistema digital do patrimônio.** Infraestrutura digital do mercado de restauro e
conservação de patrimônio no Brasil.

Produto de **dois motores**:

- **Radar de Oportunidades** — ingestão e estruturação (com IA) de toda licitação, edital,
  chamamento e programa relevante a patrimônio. Feed personalizado, match com o perfil,
  alertas.
- **Marketplace** — onde a atenção do Radar vira trabalho e reputação: checklist de
  habilitação, cofre de documentos, formação de consórcio e projetos privados nativos.

## Documentação

- [`docs/PRD.md`](docs/PRD.md) — Product Requirements Document v3
- [`docs/radar-fontes.md`](docs/radar-fontes.md) — as ~30 fontes prioritárias do Radar
- [`CLAUDE.md`](CLAUDE.md) — regras do projeto para o agente

## Stack

Next.js (App Router + Turbopack) · TypeScript · Tailwind CSS · Neon (Postgres) · Drizzle ORM
· Vercel.

## Desenvolvimento

```bash
npm install
npm run dev        # porta 3006
```

Variáveis de ambiente: copiar `.env.example` para `.env.local` e preencher (ou
`npx vercel@latest env pull .env.local`).

```bash
npm run build      # typecheck + build de produção
npm run lint
npm run db:generate   # gera migration a partir do schema Drizzle
npm run db:migrate    # aplica migrations
npm run db:studio     # inspeciona o banco
```
