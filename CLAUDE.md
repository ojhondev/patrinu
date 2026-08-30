# Patrinu — instruções do projeto

**Patrinu** — "O Radar do Patrimônio e Restauro do Brasil". Hub vertical + marketplace do
setor de **restauro e conservação de patrimônio**. A rede profissional é o fosso; o
marketplace é a receita. **Assinatura, nunca comissão.**

**Seis pilares** (PRD v4), um objeto `Projeto` que atravessa todos:

1. **Projetos** — vitrine de obras concluídas (estilo ArchDaily) + briefs abertos para
   disputar (estilo Workana). Mesmo objeto, estados diferentes.
2. **Profissionais** — diretório, perfil, portfólio, reputação verificável.
3. **Notícias** — editorial leve: newsletter + curadoria + poucas matérias (sem CMS).
4. **Cursos** — diretório curado com link de inscrição (sem LMS).
5. **Editais** — licitações/chamamentos estruturados por IA + checklist de habilitação.
   (Era o "Radar" — renomeado; "Radar do Patrimônio" agora é a marca.)
6. **Financiamento** — match projeto ↔ lei de incentivo / edital de banco / patrocinador.

Transversal: **Passaporte do Patrimônio** (dentro de Projetos).

Documentos em [`docs/`](docs/): `PRD.md` (v4), `radar-fontes.md` (as ~30 fontes de Editais).
Artifacts: PRD v4 https://claude.ai/code/artifact/41a40295-20b9-4973-8d87-c23d60aec933 ·
Fontes https://claude.ai/code/artifact/9df43684-c324-4673-bbc7-ba9e33af17aa

## Design

**Fundo branco + verde.** Sem preto de plataforma — preto só para contraste pontual em
botões. Verde primário `#1dbf73`, faixa escura = verde profundo (`--band`), nunca preto.
Fontes: **Hanken Grotesk** (display + corpo) + **Fraunces itálico** (palavras de ênfase,
classe `.accent`). Tokens em `src/app/globals.css`. Padrões de marketplace tipo Fiverr:
header sticky com busca que colapsa ao rolar, cards estilo "gig", thumbnail gerado por
especialidade (`specialty-visual.tsx`, sem foto de estoque).

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

- **Mockado primeiro** — integrações reais que ainda não podem ser conectadas são
  construídas com mocks no formato da API real e trocadas depois sem mudar a arquitetura.
  Mocks em `src/lib/mock/`; acesso a dados em `src/lib/{opportunities,projects,directory}.ts`
  (lê mock hoje, troca para Drizzle sem mudar assinatura).
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
