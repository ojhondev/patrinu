# A Patrinu — PRD v6.0

**O Radar do Patrimônio e Restauro do Brasil.**

- **Versão:** 6.0 — Pro, regra de acesso/paywall, conta Master & moderação
- **Data:** Agosto de 2026
- **Documento completo:** `docs/PRD-v6.html` (este .md tem o corpo da v4 + os deltas v5 e v6)

---

## v6 — Regra de acesso, conta Master e moderação

**Acesso, em três níveis:**

| Nível | Vê | Borrado / bloqueado |
|---|---|---|
| **Visitante** | Vitrine de projetos, profissionais, notícias, cursos; publica **1 projeto/mês** | Valores de projeto · nome de contratante/empresa · Radar de Editais inteiro |
| **Cadastrado** (grátis, cadastro leve) | + valores de projeto + salvar | Radar de Editais · enviar proposta · checklist · alertas |
| **Pro** (assinante) | Tudo | — |

- **Radar de Editais é 100% Pro** (lista e detalhe borrados com CTA para não-Pro).
- **Informação-ouro borrada, não removida** — borrar em vez de bloquear é o gatilho da
  assinatura. Valores, nomes de contratante, o Radar.
- **Enviar proposta** exige Pro; **ver valores** exige ao menos cadastro leve.
- Cadastro leve: entra com o mínimo, completa o perfil no painel para liberar cada
  funcionalidade.

**Conta Master** (`/master`, link no rodapé): acesso total. Auth por env
(`MASTER_EMAIL` + `MASTER_PASSWORD_HASH` scrypt + `SESSION_SECRET`) e cookie assinado —
senha em claro nunca no repo.

**Moderação prévia obrigatória:** projeto, vaga, edital ingerido e pedido de divulgação de
curso entram numa fila de aprovação; só vão ao ar com o OK do Master. Popup "Projeto em
análise" ao publicar. **Novos perfis não são revisados.**

**Outras decisões v6:** multi-trilha permitida sem conflito de interesse · elegibilidade
sinalizada manualmente · painel do contratante com duas seções (candidatos / matches) ·
"formar consórcio" → **"Quero participar"** (lista de interessados por projeto que o
vencedor pode contratar) · **Passaporte do Patrimônio sai do escopo** · divulgar curso =
contato por e-mail.

**Ainda em aberto (§18):** regra concreta do conflito de interesse · o que acontece com o
2º projeto do mês · SLA da moderação · rotação do segredo Master · preço · verificação ·
contrato leve · receita de cursos.

---

## v5 — Patrinu Pro (3 trilhas) + Onboarding + Painel

O hub de 6 pilares (v4, abaixo) é aberto e gratuito — camada de audiência. **Patrinu Pro**
é a camada paga por cima, espelhando o *Fiverr Pro* ("quero contratar" / "quero oferecer"),
mas com **três trilhas** porque o setor tem um terceiro lado, o dinheiro.

| Trilha | Quem | Landing | Onboarding coleta | Painel entrega |
|---|---|---|---|---|
| **A — Quero contratar** | Instituições, empresas, órgãos, dioceses | `/pro/contratar` | tipo de org · o que restaurar · bem · orçamento/recurso · urgência | **prospectos** (profissionais que deram match ou se candidataram), propostas recebidas, status dos projetos |
| **B — Quero oferecer serviços** | Restauradores, ateliês, escritórios | `/pro/oferecer` | PF/PJ · especialidades e técnicas · registros · portfólio · região · disponibilidade | **oportunidades compatíveis** (editais + briefs por aderência), candidaturas, convites, visitas ao perfil |
| **C — Quero financiamento de obra** | Detentores do bem com projeto | `/pro/financiamento` | bem · projeto (status) · meta de captação · lei pretendida · documentação | **leque de investidores que sinalizam elegibilidade** por projeto, status de captação, dossiê gerado |

**Investidor / Patrocinador** é o 4º lado — entra pelo produto Patrocinador, opera do outro
lado da Trilha C (recebe deal flow e *sinaliza elegibilidade*). Painel do investidor = Fase 2.

**Onboarding:** um fluxo por trilha, 3–5 passos, salva a cada passo, termina dentro do painel
com algo útil na tela. Hoje é *scaffold* de UI sem persistência (auth própria vem depois).

**Painel (`/painel`):** três visões, mesmo layout, muda o que fica no topo. No MVP roda com
dados de demonstração escolhidos por `?perfil=contratante|profissional|financiamento`.

**Por que o painel importa:** é o que justifica a assinatura recorrente sem comissão — o
contratante paga para ver prospectos, o profissional para receber oportunidades antes, o
proponente para ver quem financia. Sem contrato fechado, a assinatura segue entregando valor.

**Decisões em aberto (v5):** um usuário pode estar em 2 trilhas? · onboarding completo antes
de entrar vs. cadastro leve · sinal de elegibilidade manual vs. por critério · prospectos =
só candidatos ou também matches · onde entra o paywall de cada trilha.

---

## (v4) A Patrinu — hub vertical de 6 pilares

- **Versão base:** 4.0 — hub vertical de 6 pilares
- **Data:** Agosto de 2026
- **Base:** PRD v3 (Radar + Marketplace)
- **Modelo:** Assinatura · sem comissão
- **Status:** Proposta para discussão
- **Artifact:** https://claude.ai/code/artifact/41a40295-20b9-4973-8d87-c23d60aec933

---

## 00 — Resumo executivo

### A rede profissional e o marketplace do restauro brasileiro

A Patrinu reúne num só lugar tudo que o setor de patrimônio e restauro do Brasil precisa:
**projetos, profissionais, notícias, cursos, editais e financiamento**. O paralelo não é
"Fiverr do restauro" — é **Behance / ArchDaily / Houzz**: tornar-se o lugar onde a
comunidade se concentra e monetizar por cima, com **planos de assinatura — nunca comissão
sobre contrato**. A promessa da marca é o *Radar*: se está acontecendo em patrimônio e
restauro no Brasil, está na Patrinu.

### O que muda em relação à v3

| | |
|---|---|
| **PRD v3** | Dois motores: Radar de editais (motor de tráfego) + Marketplace. Foco central nos editais e no fluxo de habilitação. |
| **PRD v4** | A lógica se inverte. O **marketplace de projetos e profissionais é o núcleo**. Editais e financiamento viram **dois pilares entre seis**. Entram dois novos: **Notícias** e **Cursos**. "Radar" vira a marca; o módulo de licitações passa a se chamar **Editais**. |

### Decisões fixadas nesta versão

- **Seis pilares:** Projetos · Profissionais · Notícias · Cursos · Editais · Financiamento.
  Transversal: Passaporte do Patrimônio (dentro de Projetos).
- **Projetos = um único objeto com dois modos, ambos no v1:** *vitrine* de obras concluídas
  (estilo ArchDaily) e *briefs abertos* para disputar (estilo Workana).
- **Notícias e Cursos entram leves:** Notícias = newsletter semanal + curadoria de links +
  poucas matérias. Cursos = diretório curado com link para inscrição. **Sem CMS pesado, sem
  LMS.**
- **Monetização = assinatura.** Sem *take rate*. A plataforma não custodia pagamento.
- **Renomeação:** "Radar do Patrimônio" = plataforma inteira. Módulo de
  licitações/editais/chamamentos = "Editais".

---

## 01 — Tese: ser a casa profissional do setor — e ter um marketplace dentro

O setor de patrimônio e restauro no Brasil não tem casa comum. Profissionais dependem de
indicação; não há referência canônica de projetos executados; a formação técnica é escassa
e dispersa; editais estão espalhados em centenas de portais; projetos travam por falta de
recurso. Cada um é um pilar da Patrinu.

Plataformas verticais vencem ao concentrar a comunidade primeiro e monetizar depois:
Behance/Dribbble (designers), ArchDaily (arquitetos), Houzz (reforma residencial), Doximity
(médicos). A Patrinu segue esse manual para conservação-restauro.

| Camada | Pilares | Função |
|---|---|---|
| Identidade | Profissionais | Quem é quem — perfil, portfólio, reputação. O cadastro que ninguém mais tem. |
| Descoberta & transação | Projetos | Obras concluídas como referência; briefs abertos para disputar. |
| Hábito & autoridade | Notícias · Cursos · Editais | Razões para voltar toda semana. Tráfego, SEO, e-mails, autoridade. |
| Dinheiro | Financiamento | Conectar projeto financiável a lei de incentivo e a patrocinador. |

---

## 02 — Os seis pilares

| # | Pilar | O que é |
|---|---|---|
| 01 | **Projetos** | Vitrine de obras concluídas (referência, ArchDaily) + briefs abertos para disputar (Workana). Mesmo objeto, estados diferentes. |
| 02 | **Profissionais** | Diretório, perfil e portfólio com antes/durante/depois, especialidades, técnicas, registros e selo verificado. |
| 03 | **Notícias** | Editorial do setor — obras, técnicas, políticas de preservação. Newsletter semanal + curadoria + matérias originais. |
| 04 | **Cursos** | Diretório curado de cursos, oficinas e pós-graduações de conservação-restauro. Depois, workshops de profissionais. |
| 05 | **Editais** | Licitações, editais, chamamentos e credenciamentos de patrimônio, estruturados por IA, com checklist de habilitação. (Era o "Radar".) |
| 06 | **Financiamento** | Match entre projeto e lei de incentivo, editais de banco e patrocinador. Vitrine de projetos financiáveis. |

**Transversal — Passaporte do Patrimônio:** registro longitudinal de cada bem. Vive dentro
de Projetos.

---

## 03 — A espinha: um objeto Projeto que atravessa tudo

O que impede seis pilares de virarem seis produtos soltos é **um único objeto de dados — o
Projeto — que muda de estado ao longo do ciclo do setor**:

```
nasce como Edital (ou cadastro direto de instituição)
  → vira brief aberto — profissionais enviam proposta
  → busca recurso no pilar Financiamento — match com lei de incentivo e patrocinador
  → é executado por Profissionais — que registram antes/durante/depois
  → é publicado como matéria no pilar Notícias
  → encerra como vitrine (referência pública) e entrada no Passaporte do bem
```

**Consequência:** a vitrine de projetos concluídos vista *por obra/profissional/técnica* é a
mesma base que o Passaporte vista *por monumento/linha do tempo*. Esse acervo canônico de
intervenções de restauro no Brasil é o **fosso de escala tipo ArchDaily** — e é semeável sem
liquidez: o time cura ~100 restauros notáveis com créditos, fotos e técnicas.

---

## 04 — Problema

| Ator | Dor | Pilar que responde |
|---|---|---|
| Profissional | Portfólio não padronizado; difícil comprovar experiência; oportunidades invisíveis; formação escassa. | Profissionais · Projetos · Cursos · Editais |
| Empresa / ateliê | Não sabe quem existe; monitorar editais é manual; montar proposta consome dias. | Profissionais · Projetos · Editais |
| Instituição | Não sabe descrever a intervenção nem estimar orçamento; não conhece fontes de recurso; não tem histórico do bem. | Projetos · Financiamento · Passaporte |
| Estudante / recém-formado | Não há referência de projetos executados; poucos cursos; entrada por indicação. | Projetos (vitrine) · Notícias · Cursos |
| Patrocinador | Não encontra projetos com aderência e narrativa; enquadramento fiscal opaco. | Financiamento · Projetos |

**A dor comum:** não existe um lugar onde o setor se encontre. A informação está fragmentada
entre grupos de WhatsApp, sites de órgãos, revistas acadêmicas, portais de licitação e a
memória de quem está há 30 anos na área. A Patrinu é esse lugar.

---

## 05 — Mercado e por que é investível

A base de profissionais formais de conservação-restauro é da ordem de poucos milhares. Mas a
**rede** alcança um público muito maior: arquitetos e engenheiros de restauro, estudantes,
técnicos, instituições, gestores culturais, jornalistas, pesquisadores e patrocinadores.

| Camada | Estimativa | Como monetiza |
|---|---|---|
| Conservadores-restauradores formais | ~3–5 mil | Pro (aquisição / engajamento) |
| Arquitetos / engenheiros com atuação em restauro | ~8–15 mil | Pro + assento em plano de empresa |
| Ateliês e empresas especializadas | ~800–1.500 | **Assinatura por assento (âncora)** |
| Instituições detentoras de patrimônio protegido | dezenas de milhar | Plano institucional / enterprise |
| Estudantes e público interessado (audiência editorial) | centenas de milhar | Topo de funil · newsletter · cursos |
| Recurso incentivado dirigido a patrimônio / ano | ordem de R$ 0,5–1 bi | Patrocinador / Vitrine · curadoria |

### Tese de escala

1. **Autoridade e SEO:** o acervo de projetos + notícias vira a referência indexável do
   setor no Brasil (modelo ArchDaily).
2. **Muitos bolsos no mesmo vertical:** profissionais + ateliês + instituições +
   patrocinadores + cursos + dado licenciável.
3. **Adjacências:** retrofit/AEC, acervos e museus, seguro de arte, due diligence de imóveis
   tombados.
4. **Geográfica:** LATAM e países lusófonos.
5. **Dado como produto:** base estruturada de estado de conservação, intervenções e fontes
   de recurso — licenciável.

**O que torna o negócio defensável:** a gravidade da rede, o acervo canônico de projetos e
do Passaporte, e a autoridade editorial. Nenhum concorrente tem os três juntos.

---

## 06 — Quem paga: assinatura, sem comissão

A plataforma não custodia pagamento e não tira percentual de contrato.

| Plano | Público | Inclui | Papel |
|---|---|---|---|
| Profissional Free | Restauradores, conservadores, arquitetos, estudantes | Perfil, portfólio limitado, ver projetos e vitrine, ler notícias, diretório de cursos, alertas básicos de edital | Aquisição / rede |
| Profissional Pro | Idem, ativos | Portfólio ilimitado, destaque, Editais completo + checklist, candidatura a briefs, analytics, desconto em cursos | Engajamento / receita secundária |
| **Empresa / Ateliê** | Ateliês, escritórios, construtoras especializadas | Assinatura por assento — tudo do Pro + publicação de briefs e vagas, busca de talentos, gestão de consórcio, cofre compartilhado | **Âncora de receita** |
| Institucional / Enterprise | Museus, órgãos, fundações, dioceses, universidades | Gestão de fornecedores, Passaporte dos acervos, publicação de projetos, apoio a TR, relatórios | Alto ticket, ciclo longo |
| Patrocinador / Vitrine | Bancos, institutos, estatais | Deal flow de projetos financiáveis já estruturados, com dossiê e enquadramento fiscal | Receita do lado do dinheiro |
| Dados Patrinu | Seguradoras, fomento, pesquisa, poder público | Licenciamento de dados agregados | Receita futura, alta margem |

**Por que assinatura funciona aqui — e comissão não:** marketplace sem comissão sofre de
**desintermediação**. Os seis pilares são o antídoto — você mantém a assinatura pelos
alertas, pelo portfólio, pelos cursos, pelas notícias e pelos dados, *independente de
qualquer contrato fechado*. Cobrar percentual de obra pública, aliás, não é possível — sai
por licitação.

---

## 07 — Produto por pilar

### 7.1 Projetos — v1

**Modo vitrine (obras concluídas):** página por projeto (bem, localização, ano, escopo,
técnicas e materiais, galeria antes/durante/depois); créditos linkados aos perfis; vínculo
com o Passaporte e com o edital de origem; busca e filtros; coleções curadas; ~100 restauros
de referência na largada.

**Modo brief (projeto aberto):** instituição/empresa publica (título, escopo, localização,
fotos, prazo, faixa de orçamento, requisitos); visibilidade pública ou convite; recebimento
e comparação de propostas; sem custódia de pagamento; concierge no início.

### 7.2 Profissionais — v1

Perfil (foto, bio, localização, áreas, especialidades, técnicas); formação, certificações,
registros (CAU/CREA, ART/RRT, ABRACOR); portfólio com ficha por projeto (puxa dos Projetos
creditados); página compartilhável; busca e filtros; selo verificado; Patrinu Score
(evolução).

### 7.3 Notícias — v1 leve

Newsletter semanal (obras, editais que abriram, matéria da semana, curso em foco); curadoria
de links do setor + poucas matérias originais; página de artigo simples; sem CMS complexo no
v1. Evolução: contribuições da comunidade, conteúdo patrocinado.

### 7.4 Cursos — v1 leve

Diretório curado (cursos técnicos, oficinas, especializações, pós — CECOR-UFMG, UFPel, UFRJ,
ateliês); ficha por curso (instituição, formato, carga horária, próxima turma, link de
inscrição); filtros; desconto para Pro quando houver parceria. Evolução (Fase 3): workshops
vendidos por profissionais.

### 7.5 Editais — v1 (já construído)

Ingestão automatizada das ~30 fontes prioritárias + estruturação com IA (ver
`radar-fontes.md`); feed personalizado, filtros, salvar, alertas, match com o perfil;
checklist de habilitação cruzado com o cofre de documentos; base histórica com desfecho.

### 7.6 Financiamento — v1 leve → v2

Cadastro de projeto para captação; match de recursos (leis de incentivo, editais de banco,
fundos internacionais) por regras no v1, IA depois; vitrine de projetos financiáveis com
dossiê gerado; sem operar a gestão do incentivo no v1.

### 7.7 Passaporte do Patrimônio — v1–v2

Página por bem (linha do tempo de intervenções, técnicas e materiais, responsáveis, laudos,
evolução de estado); gerado a partir dos Projetos documentados; identificador do bem a
definir (IPHAN/SICG vs. próprio).

---

## 08 — Camada de IA

| Uso | O que faz | Pilar |
|---|---|---|
| Extração de editais | Estrutura PDF de licitação em objeto, valor, prazo, habilitação e técnica. | Editais (v1) |
| Classificação de relevância | Decide se uma oportunidade é de patrimônio e a que especialidade pertence. | Editais (v1) |
| Match | Perfil ↔ edital, perfil ↔ brief, projeto ↔ financiamento; recomenda projetos, profissionais, cursos. | Todos (v1) |
| Checklist de habilitação | Do edital, lista documentos exigidos e cruza com o cofre. | Editais (v1) |
| Curadoria editorial | Resume e classifica notícias; sugere pauta a partir de projetos e editais novos. | Notícias (v1–v2) |
| Ficha de projeto | A partir de fotos e texto, propõe técnicas, materiais e rascunho de descrição. | Projetos (v2) |
| Pré-diagnóstico por foto | Triagem de patologias. | Projetos / Passaporte (v2) |
| Match de financiamento | Quais leis, editais e patrocinadores têm aderência, com estimativa de enquadramento. | Financiamento (v2–v3) |

---

## 09 — Arquitetura de navegação

| Área | Principais páginas | Fase |
|---|---|---|
| Início | Busca do hub, projetos e profissionais em destaque, editais abertos, últimas notícias, cursos | v1 |
| Projetos | Vitrine (concluídos) · Abertos (briefs) · página de projeto · coleções | v1 |
| Profissionais | Diretório, filtros, perfil e portfólio | v1 |
| Notícias | Feed de artigos, página de artigo, arquivo, newsletter | v1 |
| Cursos | Diretório, filtros, ficha de curso | v1 |
| Editais | Feed, filtros, alertas, página de edital, fluxo "responder" | v1 |
| Financiamento | Fontes de recurso, cadastrar projeto, vitrine financiável | v1–v2 |
| Patrimônio | Passaporte dos bens | v1–v2 |
| Minha conta | Perfil, portfólio, candidaturas, favoritos, alertas, assinatura, cofre | v1 |
| Para empresas / instituições | Planos, assentos, dashboard, briefs, vagas, fornecedores | v1 |

---

## 10 — MVP

O MVP valida: **o setor adota a Patrinu como o lugar onde se encontra?** — medido por
tráfego, perfis completos e inscrições na newsletter, antes de qualquer receita de
marketplace.

**Dentro do MVP:** Projetos — vitrine curada (~100) + briefs abertos (concierge) ·
Profissionais — diretório, perfil e portfólio, selo verificado · Editais — feed, filtros,
alertas, checklist (já pronto) · Notícias — newsletter semanal + curadoria + poucas matérias
· Cursos — diretório curado · Passaporte mínimo · planos Free, Pro e Empresa · cofre de
documentos.

**Fora do MVP:** CMS editorial completo · LMS / aulas hospedadas · venda de workshops ·
pagamentos e contratos na plataforma · take rate · módulo de financiamento completo ·
Patrocinador/Vitrine além do piloto concierge · Dados Patrinu · app nativo · adjacências.

**Custo além do produto:** Notícias e Cursos são **opex editorial contínuo**. A vitrine de
~100 projetos é trabalho de pesquisa e licenciamento de imagem. Orçar como parte do MVP.

---

## 11 — Roadmap

**Fase 1 — Hub de conteúdo (MVP):** Projetos (vitrine + briefs concierge); Profissionais;
Editais (pronto); Notícias (newsletter + curadoria); Cursos (diretório); Passaporte mínimo;
planos Free/Pro/Empresa.

**Fase 2 — Marketplace transacional:** briefs orgânicos + propostas + comparação; busca de
talentos, vagas, consórcio; plano Institucional; apoio à contratação (rascunho de TR,
pré-diagnóstico); Passaporte completo; contrato leve opcional.

**Fase 3 — Dinheiro & educação:** Financiamento completo (match IA, dossiê automático);
Patrinu Recursos / Vitrine; workshops vendidos por profissionais; contribuições da comunidade
em Notícias.

**Fase 4 — Inteligência & expansão:** recomendação e Patrinu Score avançados; licenciamento
de dados; adjacências (AEC, seguros, acervos) e LATAM.

---

## 12 — Métricas de sucesso

**Fase 1:** visitantes/mês · inscritos na newsletter · perfis completos (% da base) ·
retenção semanal W4.

| Dimensão | KPIs |
|---|---|
| Rede | Profissionais cadastrados, perfis completos, projetos com crédito, cobertura por polo |
| Conteúdo | Visitantes, páginas de projeto vistas, inscritos e abertura da newsletter, tráfego orgânico |
| Editais | Oportunidades ingeridas/dia, cobertura de fontes, precisão do match, alertas, CTR |
| Marketplace | Briefs publicados (concierge vs. orgânico), propostas por brief, taxa de conexão (F2) |
| Cursos | Cursos no diretório, cliques para inscrição, parcerias com desconto |
| Financiamento | Projetos em captação, valor potencial, conexões com financiadores (F2–F3) |
| Receita | MRR, ARPU, mix Pro / Empresa / Institucional, retenção líquida, conversão Free→Pro |

---

## 13 — Riscos e mitigações

| Risco | Por quê | Mitigação |
|---|---|---|
| **Escopo — 6 pilares = 3–4 produtos** | Time pequeno não constrói tudo bem ao mesmo tempo. | Só 2 pilares nascem "produto completo" (Projetos, Profissionais). Editais já existe. Notícias e Cursos nascem "diretório/newsletter". Financiamento entra leve. |
| Custo editorial contínuo | Notícias e Cursos exigem curadoria toda semana — opex, não dev. | Orçado no MVP. Newsletter enxuta + curadoria + press releases. Comunidade contribui na Fase 3. |
| Dois marketplaces rasos | Briefs e workshops precisam de liquidez dos dois lados. | Vitrine-primeiro (sem liquidez) e diretório-primeiro. Briefs por concierge. Workshops só na Fase 3. |
| Foco na narrativa | "Fiverr + Workana + ArchDaily + financiamento" soa disperso. | Frase-âncora única: *a rede profissional + o marketplace do restauro brasileiro*. |
| Desintermediação (sem comissão) | Depois de se acharem, por que continuar pagando? | O valor recorrente está nos alertas, portfólio, cursos, notícias e dados — não no contrato. |
| SEO / autoridade é lento | ArchDaily levou anos. | Jogo de longo prazo no conteúdo, em paralelo com a receita B2B que tem loop mais rápido. |
| TAM estreito na base formal | Poucos milhares de restauradores. | Receita âncora em Empresa/Institucional; a rede alcança 10× mais; dado licenciável; adjacências. |

---

## 14 — Princípios de produto

- A rede vem primeiro — tudo tem que aumentar a gravidade da comunidade.
- Um objeto Projeto atravessa os pilares; nada de dados duplicados entre módulos.
- Portfólio e evidência acima de autodeclaração.
- Diretório antes de produto: começar curando, construir quando o interesse se provar.
- Assinatura, nunca comissão. A plataforma conecta; não custodia dinheiro no v1.
- Cada tela deixa dado estruturado.
- IA como camada de inteligência, não como substituta do especialista.
- Conteúdo é opex — se não dá para sustentar a curadoria, não lançar o pilar.

---

## 15 — Decisões em aberto

1. **Aquisição da vitrine:** quem produz as ~100 fichas de projeto e como se resolve o
   direito de imagem?
2. **Operação editorial:** quem edita a newsletter e as matérias?
3. **Identificador do bem no Passaporte:** IPHAN/SICG como chave, ou identificador próprio?
4. **Preço:** valores de Pro e Empresa (faixa R$ 300–900/assento indicada); base de cobrança
   do Institucional.
5. **Verificação de profissionais:** o que conta como "verificado" e há níveis?
6. **Contrato leve:** a Patrinu oferece um modelo de contrato entre as partes, ou só conecta?
7. **Cursos — modelo de receita:** só diretório com link de afiliado, ou comissão de
   indicação nas parcerias?
8. **Financiamento (Fase 3):** a Patrinu apenas conecta, ou também opera a gestão do
   incentivo?
