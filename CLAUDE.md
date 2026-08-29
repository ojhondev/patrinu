# Patrinu — instruções do projeto

**Patrinu** ("O ecossistema digital do patrimônio") é a infraestrutura digital do mercado de
**restauro e conservação de patrimônio** no Brasil. Produto de **dois motores**:

- **Radar de Oportunidades** — ingestão e estruturação (com IA) de toda licitação, edital,
  chamamento, credenciamento, bolsa e programa relevante a patrimônio. Feed personalizado,
  match com o perfil, alertas. É o motor de recorrência, hábito e dado.
- **Marketplace** — onde a atenção do Radar vira trabalho e reputação: montar candidatura e
  habilitação para as oportunidades públicas, formar consórcio/equipe e (crescendo com o
  tempo) publicar e disputar projetos privados nativos.

Documentos de produto em [`docs/`](docs/): `PRD.md` (v3) e `radar-fontes.md` (as ~30 fontes
prioritárias do Radar). Artifacts de referência:
- PRD v3: https://claude.ai/code/artifact/41a40295-20b9-4973-8d87-c23d60aec933
- Fontes do Radar: https://claude.ai/code/artifact/9df43684-c324-4673-bbc7-ba9e33af17aa

## Stack

| Camada | Escolha |
|---|---|
| Framework | Next.js 15.5 (App Router, Server Actions) + TypeScript |
| UI | Tailwind CSS v4 + Lucide + Recharts (quando houver dashboard) |
| Dados | Neon (Postgres serverless) + Drizzle ORM / drizzle-kit |
| Auth | Cookie de sessão próprio + scrypt, antes de qualquer provedor externo |
| Qualidade | ESLint (flat config, `next/core-web-vitals` + `next/typescript`) |
| Deploy | Vercel, integrado ao GitHub |

Pasta do projeto: **`A:/patrinu`** (minúsculo — o casing importa no Windows; não usar
`A:/Patrinu`). Dev local na porta **3006** (config em `A:/Velo/.claude/launch.json`, nome
`patrinu`).

> Nota: começou em Next 16.3 (create-next-app), mas o build com Turbopack quebrava o
> prerender de rotas internas (`/_not-found`, `/_error`) com `InvariantError: Expected
> workStore to be initialized`. Fixado em **Next 15.5.24** (webpack).

## Convenções

- **Mockado primeiro** — integrações reais (fontes do Radar, gateway, etc.) que ainda não
  podem ser conectadas são construídas com mocks no formato da API real e trocadas depois
  sem mudar a arquitetura.
- **Schema em código** — Drizzle em TypeScript, nunca editar o banco direto. Mudança de
  schema gera migration (`generate`) antes de aplicar.
- **Commits pequenos e descritivos** — um por mudança de comportamento. Mensagens em
  português, no imperativo, descrevendo o comportamento — não o código.
- **Validar antes do commit** — `npm run build` (typecheck) e `npm run lint`.
- **Rebrand/copy** em commits separados de schema/lógica.

## Git: commit, push e deploy automáticos

Toda alteração de código feita neste projeto (nesta ou em sessões futuras) deve ser
commitada, enviada para o GitHub (`origin/main`) e publicada em produção automaticamente,
sem esperar autorização explícita a cada vez — isso já foi autorizado pelo usuário.

Fluxo padrão ao concluir uma tarefa que altere código:
1. Rodar typecheck/build e lint.
2. `git add -A`
3. `git commit -m "<mensagem descrevendo a mudança>"`
4. `git push origin main`
5. `npx vercel@latest --prod` — **obrigatório**, não presumir que o push sozinho publica
   (o auto-deploy nativo da Vercel já falhou silenciosamente neste tipo de projeto antes;
   ver `C:\Users\55149\dev.md`).

Repositório: https://github.com/ojhondev/patrinu
