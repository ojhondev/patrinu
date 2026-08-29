# A Patrinu — PRD v3.0

**O ecossistema digital do patrimônio.**

- **Versão:** 3.0 — Radar + Marketplace
- **Data:** Agosto de 2026
- **Base:** PRD v1.1 (GPT) → revisão v2 → v3
- **Escopo:** Nacional · restauro e conservação de patrimônio
- **Status:** Proposta para discussão
- **Artifact:** https://claude.ai/code/artifact/41a40295-20b9-4973-8d87-c23d60aec933

---

## 00 — Resumo executivo

### Um produto com dois motores: Radar e Marketplace

A Patrinu é a infraestrutura digital do mercado de **restauro e conservação de patrimônio**
no Brasil. Ela conecta profissionais, empresas, instituições, oportunidades e recursos ao
longo de um ciclo: `descoberta → conexão → proposta → contratação → execução → documentação
→ reputação`. A v3 fixa a forma do produto em **dois motores que se alimentam**: o **Radar
de Oportunidades** (recorrência, hábito, dado) e o **Marketplace** (transação, reputação,
efeito de rede). Os dois entram já no MVP.

### Evolução do documento

| Versão | Ideia central |
|---|---|
| v1.1 (GPT) | Marketplace vertical de 4 pilares lançado de uma vez; Radar na Fase 2, financiamento na Fase 3, Passaporte na Fase 4. |
| v2 | Inverter a ordem: Radar sozinho como cunha na Fase 1, marketplace só depois de haver tração de um lado. |
| **v3 (esta)** | **Radar + Marketplace juntos no MVP**, com o Radar atuando como motor de tráfego que mantém o lado da oferta sempre presente e resolve o *cold-start* do marketplace. Beachhead **nacional**, patrimônio em geral. TAM tratado com **foco estrito** em restauro/conservação. |

### Decisões fixadas nesta versão

- **Escopo do produto:** Radar + Marketplace, ambos no v1. O Marketplace começa como *camada
  de trabalho sobre o feed do Radar* (responder a licitações e editais), e ganha projetos
  privados nativos com o tempo.
- **Beachhead:** **nacional, todo tipo de patrimônio** (religioso, civil, urbano, industrial,
  ferroviário, arqueológico, acervos). Sem recorte de segmento nem de região no cadastro.
- **TAM:** enquadramento estrito no mercado de **restauro e conservação de bens
  patrimoniais**. Adjacências (retrofit/AEC, seguros, acervos) e LATAM ficam como tese de
  expansão, não como mercado-base.
- **Receita âncora:** três produtos — **Empresa/Ateliê Business** (assinatura por assento),
  **Institucional** (plano customizado) e **Patrocinador/Vitrine** (deal flow de projetos
  incentiváveis para bancos e institutos). A assinatura Pro individual é alavanca de
  aquisição e engajamento, não a âncora.
- **Take rate sobre contratos** continua fora do centro do modelo — existe só como taxa
  opcional sobre projetos privados originados e geridos de ponta a ponta na plataforma.
- **Passaporte do Patrimônio** permanece puxado para a Fase 1–2 como o ativo de dado
  defensável.

> **Nota.** Marketplace vertical em mercado pequeno morre de falta de liquidez. A v3 não
> elimina esse risco pela sequência — elimina pela arquitetura: o Radar traz o profissional
> todo dia, e o Marketplace só precisa converter atenção que já está na plataforma.

---

## 01 — Tese: dois motores que se alimentam

O ecossistema de patrimônio é pequeno, técnico e movido a indicação. Um marketplace
horizontal não tem vantagem aqui, e um marketplace vertical isolado não atinge liquidez. A
Patrinu resolve isso rodando duas máquinas ao mesmo tempo, cada uma cobrindo a fraqueza da
outra.

| Motor | O que é | Papel |
|---|---|---|
| **1. Radar de Oportunidades** | Ingestão e estruturação, com IA, de toda licitação, edital, chamamento, credenciamento, bolsa e programa relevante a patrimônio no Brasil. Feed personalizado, *match* com o perfil, alertas. | Recorrência · hábito diário · dado de comportamento · barreira de execução · tráfego. |
| **2. Marketplace** | Onde a atenção do Radar vira trabalho: montar candidatura e habilitação para as oportunidades públicas, formar consórcio/equipe, e — crescendo com o tempo — publicar e disputar projetos privados nativos. | Transação · reputação verificável · efeito de rede · monetização âncora. |

### Como um alimenta o outro

- O Radar dá razão para o profissional entrar **todo dia** — isso mantém o lado da oferta
  sempre "aceso" no Marketplace, sem campanha de aquisição contínua.
- Cada oportunidade do Radar é **demanda pronta**: o profissional não precisa de projeto
  nativo no dia 1, precisa de ajuda para ganhar a licitação que já existe.
- Cada projeto respondido ou executado deixa **evidência no portfólio** e uma entrada no
  **Passaporte do bem** — o que melhora o *match* do Radar e a reputação exibida no
  Marketplace.
- O comportamento no Radar (o que salva, no que se candidata, o que ganha) treina o
  ranqueamento dos dois lados.

### Posicionamento

| Público | Promessa |
|---|---|
| Profissionais | Mostre seu trabalho, construa reputação verificável e receba as oportunidades certas antes dos concorrentes. |
| Empresas / ateliês | Monitore todo edital e licitação compatível, encontre especialistas e monte a proposta mais rápido que o concorrente. |
| Instituições | Estruture a demanda, encontre quem executa e descubra como financiar antes de abrir o processo. |
| Patrocinadores | Acesse projetos financiáveis já curados, com dossiê e enquadramento fiscal prontos. |

---

## 02 — Problema

Profissionais dependem de indicação. Empresas e instituições têm dificuldade de encontrar
especialistas. Licitações, editais e oportunidades estão dispersos em centenas de portais.
Muitos projetos não avançam por falta de recurso — ou por desconhecimento sobre como captar.

### Dores por ator

| Ator | Dor | Consequência hoje |
|---|---|---|
| Profissional | Portfólio não padronizado; difícil comprovar experiência; oportunidades invisíveis; habilitação em licitação é um labirinto. | Renda instável, dependência de rede pessoal, editais perdidos por prazo ou documento. |
| Empresa / ateliê | Não sabe quem existe nem quem está disponível; monitorar editais é trabalho manual; montar proposta técnica consome dias. | Perde prazos; contrata por indicação, sem histórico; margem corroída pelo custo de licitar. |
| Instituição | Não sabe descrever tecnicamente a intervenção nem estimar orçamento; não conhece as fontes de recurso. | Projeto trava no diagnóstico ou no edital; obra não sai do papel. |
| Patrocinador | Não encontra projetos com aderência e narrativa; enquadramento fiscal é opaco. | Recurso incentivado subutilizado; projetos bons sem apoio. |

> **Fricção subestimada na v1.1.** A obra de restauro no Brasil trava em três pontos:
> **diagnóstico** (o que fazer e com que técnica), **orçamento** (difícil de estimar) e
> **conformidade** (IPHAN / órgão estadual, termo de referência, ART/RRT, atestado de
> capacidade técnica, acervo técnico). O Marketplace da Patrinu ataca especificamente a
> terceira — a mais mecânica e a mais dolorosa.

---

## 03 — Mercado e por que é investível

**Nicho estreito na base.** A base de profissionais formais de conservação-restauro no
Brasil é da ordem de poucos milhares. Uma assinatura individual, sozinha, é um negócio
pequeno. A tese de escala depende de **cobrar de quem tem orçamento** (empresas,
instituições, patrocinadores) e de **capturar o dado do setor**.

### Dimensionamento (ordens de grandeza — a validar)

| Camada | Estimativa | Como monetiza |
|---|---|---|
| Profissionais de conservação-restauro (formais) | ~3–5 mil | Free → Pro (aquisição / engajamento) |
| Arquitetos / engenheiros com atuação em restauro | ~8–15 mil | Pro + assento em plano Business |
| Ateliês e empresas especializadas | ~800–1.500 | **Business (âncora)** · assinatura por assento |
| Instituições detentoras de patrimônio protegido | dezenas de milhar (federal + estadual + municipal) | Plano institucional / enterprise |
| Volume anual de editais / licitações de restauro | centenas–milhares | Radar premium, alertas, dados de desfecho |
| Recurso incentivado dirigido a patrimônio / ano | ordem de R$ 0,5–1 bi | Patrocinador / Vitrine · curadoria + match |

### Tese de escala

1. **Vertical, mas com muitos bolsos:** mesmo restrito a restauro, a receita soma
   profissionais + ateliês + instituições + patrocinadores + licenciamento de dado. É
   estreito em usuários, não em fontes de receita.
2. **Adjacências:** retrofit e requalificação de edifícios históricos (AEC), gestão de
   acervos e ativos culturais, seguro de arte e patrimônio, *due diligence* de imóveis
   tombados.
3. **Geográfica:** LATAM e países lusófonos com forte patrimônio colonial e mecanismos de
   incentivo — México, Portugal, Colômbia, Peru.
4. **Dado como produto:** a base estruturada de estado de conservação, intervenções e fontes
   de recurso é licenciável para órgãos públicos, seguradoras, pesquisa e fomento.

> **O que torna o negócio defensável.** Não é a intermediação de contratos. É o **banco de
> dados proprietário** que a operação gera: perfis verificados com histórico de obra, o
> Passaporte de cada bem, e o corpus de editais estruturados *com desfecho* (quem venceu,
> por quanto, com que habilitação). Esse dado cresce a cada projeto documentado e ninguém
> mais o tem.

---

## 04 — Estratégia de entrada

Decisão do fundador: lançar **nacional** e sem recorte de tipo de bem. O cadastro é aberto a
qualquer profissional, empresa, instituição ou bem. Isso maximiza alcance e a história de
mercado, mas transfere o peso para a **operação de curadoria** — cobertura de fontes e
densidade de oferta.

### Como isso é executável mesmo sendo amplo

- **Radar:** priorizar as **~30 fontes que concentram o grosso do volume** (ver
  `radar-fontes.md`). Ampliar por demanda observada.
- **Oferta:** a curadoria de profissionais começa pelos **polos de patrimônio** — MG, BA,
  PE, RJ, SP, RS — mesmo sem restringir o cadastro.
- **Demanda do Marketplace no dia 1:** vem do próprio Radar. As oportunidades públicas *são*
  o inventário inicial.
- **Concierge:** o time da Patrinu posta manualmente os primeiros projetos privados e
  institucionais, sourced de dioceses, museus e prefeituras, até o fluxo orgânico se
  sustentar.

### Sequência de construção

| Passo | Quando | Conteúdo |
|---|---|---|
| 1 — Radar manual + lista | pré-produto | Curadoria manual de editais por e-mail/WhatsApp; vira lista de espera qualificada e valida os critérios de *match*. |
| 2 — Radar + Perfil no produto | v1.0 | Ingestão automatizada + estruturação com IA; feed, filtros, alertas. Perfil e portfólio como pré-requisito do *match*. |
| 3 — Marketplace sobre o feed | v1.0 | Responder a oportunidade: checklist de habilitação, montar equipe/consórcio, anexar atestados. Diretório público, selo verificado. |
| 4 — Projetos privados nativos | v1.1 | Instituições e empresas publicam projeto; manifestação de interesse e comparação de propostas. Concierge → orgânico. |

**Canais de aquisição de oferta:** primeiros ~150 profissionais na mão — ABRACOR, cursos de
conservação e restauro (CECOR-UFMG, UFPel, UFRJ), ateliês de referência, ex-alunos, redes de
arquitetos de restauro. Importar bases públicas.

---

## 05 — Quem paga

Instituições têm problema de caixa; profissionais são *cash-poor*. A receita âncora vem das
empresas que disputam obra, das grandes instituições e do lado do dinheiro incentivado.

| Produto | Público | Modelo | Papel |
|---|---|---|---|
| Profissional Free | Restauradores, conservadores, arquitetos | Grátis — perfil, portfólio limitado, Radar básico, responder a até N oportunidades/mês | Aquisição / oferta |
| Profissional Pro | Idem, ativos | Assinatura mensal (ticket baixo) — portfólio ilimitado, Radar completo, alertas avançados, checklist de habilitação, analytics, destaque | Engajamento / receita secundária |
| **Empresa / Ateliê Business** | Ateliês, escritórios, construtoras especializadas, consultorias de projeto cultural | **Assinatura por assento — faixa R$ 300–900 / assento / mês** conforme porte e módulos. Radar de licitações, busca de profissionais, banco de talentos, publicação de projetos e vagas, ferramentas de proposta e habilitação, gestão de consórcio | **Âncora de receita** |
| **Institucional / Enterprise** | Museus, órgãos públicos, fundações, dioceses e redes, universidades | **Plano customizado** — gestão de fornecedores, Passaporte dos acervos, compliance e histórico, apoio a termo de referência, relatórios | Alto ticket, ciclo longo |
| **Patrocinador / Vitrine** | Bancos, institutos, estatais, fundações empresariais (Itaú Cultural, BNDES, Petrobras, institutos…) | **Assinatura + curadoria** — *deal flow* de projetos incentiváveis já estruturados, com dossiê, narrativa de impacto e enquadramento fiscal; filtros por tema, região e linha de incentivo | Receita do lado do dinheiro |
| Dados Patrinu | Seguradoras, fomento, pesquisa, poder público | Licenciamento de dados agregados de estado de conservação, intervenções e mercado | Receita futura, alta margem |

> **Fora do centro do modelo: take rate sobre contratos.** Obra pública sai por licitação e
> não é taxável pela plataforma; a privada é relacional e vaza. Existe apenas como **taxa
> opcional** sobre projetos privados originados *e* geridos de ponta a ponta na Patrinu.

**Sequenciamento da receita:** v1 — Free, Pro, Business. v1–v2 — Institucional (contas-farol)
e Patrocinador/Vitrine (piloto *concierge*: vender 2–3 contratos de patrocínio na mão antes
de construir o produto). v3+ — Dados Patrinu.

---

## 06 — Produto

### 6.1 Radar de Oportunidades — v1

O radar central do mercado de patrimônio e restauração.

- **Categorias:** licitações e concorrências · chamamentos e credenciamentos · editais ·
  projetos privados e públicos · vagas · bolsas, residências e programas · parcerias e
  patrocínios.
- **Radar personalizado:** o usuário define especialidades, regiões, faixas de valor e tipos
  de oportunidade. A Patrinu gera feed personalizado e alertas — *"Nova licitação de
  restauração de talha compatível com seu perfil, em Minas Gerais, até R$ 180 mil,
  habilitação exige acervo técnico em bens móveis."*
- **Funcionalidades MVP:** ingestão automatizada das ~30 fontes prioritárias + estruturação
  com IA (objeto, valor, prazo, exigências de habilitação, técnica); filtros por localização,
  categoria, valor, prazo; salvar oportunidades; histórico; alertas e-mail/WhatsApp/in-app;
  *match* perfil ↔ oportunidade; página detalhada com documentos e link para a fonte oficial;
  botão "responder" que abre o fluxo do Marketplace.
- **Evolução:** score de aderência e probabilidade de enquadramento na habilitação; resumo
  automático do edital e checklist de documentos; base histórica de editais com desfecho.

### 6.2 Marketplace — v1

Duas camadas, entregues em ordem.

**Camada A — Responder a oportunidades públicas (v1.0)**
- **Checklist de habilitação** gerado do edital: documentos exigidos, prazos, o que o
  profissional já tem no perfil e o que falta.
- **Formação de equipe / consórcio:** encontrar parceiros complementares (técnica, região,
  atestado, porte).
- **Cofre de documentos:** ART/RRT, atestados de capacidade técnica, acervo técnico,
  certidões — reutilizáveis entre candidaturas.
- **Manifestação de interesse** registrada na plataforma; acompanhamento do resultado.

**Camada B — Projetos privados nativos (v1.1)**
- Publicação de projeto (título, descrição, categoria, localização, escopo, fotos,
  documentos, prazo, orçamento, requisitos); visibilidade pública ou convite privado;
  recebimento e comparação de propostas.
- Busca e contratação por especialidade, técnica, localização, experiência, disponibilidade;
  favoritos e listas; histórico de contratações e avaliações.
- Vagas especializadas; candidaturas com perfil e portfólio; banco de talentos.

**Apoio à contratação (camada de fricção) — v2**
- Assistente para redigir termo de referência / escopo a partir de fotos e descrição.
- Pré-diagnóstico por foto (triagem de patologias).
- Referências de custo por tipo de intervenção, a partir do histórico da plataforma.

### 6.3 Perfil & Portfólio profissional — v1

- **MVP:** perfil (foto, bio, localização, áreas, especialidades, técnicas); formação,
  certificações, experiência; registros profissionais (CAU/CREA), ART/RRT, filiações;
  portfólio com imagens de **antes, durante e depois** e ficha por projeto (bem, técnica,
  materiais, ano, papel); página compartilhável; busca e filtros; candidatura; selo de
  perfil verificado.
- **Evolução:** Patrinu Score; analytics; destaque regional e por especialidade;
  certificações verificadas; página premium; comunidade.

### 6.4 Passaporte do Patrimônio — v1–v2

*Puxado da Fase 4 para o centro.* Registro canônico e longitudinal de cada bem: intervenções,
técnicas e materiais, profissionais responsáveis, laudos, evolução de estado.

- **MVP mínimo:** uma página por bem, criada a partir dos projetos documentados; linha do
  tempo de intervenções; galeria antes/durante/depois agregada; vínculo com profissionais e
  empresas que atuaram.
- **Por que agora:** é o dado mais defensável e cresce sem custo marginal a cada projeto
  registrado. Interessa a órgãos de preservação, seguradoras, instituições e pesquisa — e é
  licenciável.

### 6.5 Financiamento & match de recursos — v3

- **Cadastro de projeto para captação:** descrição do patrimônio, objetivo, orçamento e
  meta, localização, documentação, impacto, status, contrapartidas.
- **Match de recursos:** leis de incentivo (federal e estaduais), editais de bancos e
  estatais, fundos internacionais — com estimativa de enquadramento. No MVP por regras;
  evolui para IA. Abastece o produto Patrocinador/Vitrine.
- **Vitrine de projetos:** projetos abertos para apoio; meta e progresso; botão de interesse;
  página pública; dossiê gerado.

---

## 07 — Camada de IA

| Uso | O que faz | Fase |
|---|---|---|
| Extração de editais | Ingere PDF de licitação / termo de referência e estrutura objeto, valor, prazo, exigências de habilitação e técnica. | v1 |
| Classificação de relevância | Decide se uma oportunidade dispersa é de patrimônio e a que especialidade pertence. | v1 |
| Match perfil ↔ oportunidade | Casa especialidade, técnica, região, porte e histórico; aprende com o comportamento. | v1 |
| Checklist de habilitação | Do edital, gera a lista de documentos exigidos e cruza com o cofre de documentos do profissional. | v1 |
| Resumo do edital | Resumo em linguagem clara + pontos de atenção. | v1–v2 |
| Sugestão de consórcio | Aponta profissionais/empresas complementares para disputar em conjunto. | v2 |
| Pré-diagnóstico por foto | Triagem de patologias (fissuras, colonização biológica, eflorescência salina, perda de policromia, destacamento). Não substitui laudo. | v2 |
| Rascunho de escopo | Minuta de termo de referência a partir de foto + descrição. | v2 |
| Match de financiamento | Dado um projeto, quais leis, editais e patrocinadores têm aderência, com estimativa de enquadramento fiscal. | v3 |

---

## 08 — Arquitetura de navegação

| Área | Principais páginas | Fase |
|---|---|---|
| Início | Feed personalizado, busca, destaques, oportunidades e projetos | v1 |
| Oportunidades | Radar, licitações, editais, chamamentos, vagas; salvos e alertas | v1 |
| Responder | Fluxo de candidatura: checklist de habilitação, consórcio, cofre de documentos, acompanhamento | v1 |
| Profissionais | Diretório, filtros, perfil e portfólio | v1 |
| Projetos | Projetos privados e públicos; publicação e propostas | v1.1 |
| Patrimônio | Passaporte dos bens — linha do tempo, intervenções, responsáveis | v1–v2 |
| Minha conta | Perfil, candidaturas, favoritos, alertas, assinatura, documentos | v1 |
| Empresas | Dashboard, assentos, projetos, vagas, profissionais, propostas, consórcios | v1 |
| Instituições | Fornecedores, acervos, Passaporte, termo de referência, relatórios | v2 |
| Financiamento | Fontes, projetos, patrocinadores e captação; Vitrine | v3 |
| Comunidade | Conteúdo, discussões e networking | v3 |

---

## 09 — MVP

O primeiro lançamento valida duas perguntas: **o Radar retém sozinho?** e **o profissional
usa a Patrinu para *responder* à oportunidade, e não só para descobri-la?**

**Dentro do MVP:** cadastro e perfil profissional · portfólio (antes/durante/depois) ·
diretório e busca · página pública · Radar com ingestão automatizada das ~30 fontes
prioritárias · *match* perfil ↔ oportunidade · filtros, salvar, histórico · alertas
e-mail/WhatsApp/in-app · fluxo de resposta (checklist de habilitação, cofre de documentos,
formação de consórcio, manifestação de interesse) · selo verificado · Passaporte mínimo
(página por bem) · dashboard e assentos de Empresa Business · assinatura Pro · publicação de
projetos privados (concierge + orgânico leve).

**Fora do MVP:** apoio à contratação com IA (termo de referência, pré-diagnóstico) · banco
de talentos avançado · módulo Institucional completo · Patrocinador/Vitrine (só piloto
concierge) · módulo de financiamento e captação · comunidade · pagamentos · take rate ·
Dados Patrinu · expansão para adjacências.

> **Consequência da decisão "nacional e geral".** Sem recorte, a operação de curadoria
> carrega o produto. O MVP precisa vir com: as ~30 fontes prioritárias já ingeridas, ~150
> profissionais semeados nos polos, e o time postando os primeiros projetos privados na mão.

---

## 10 — Roadmap

**Fase 1 — Radar + Marketplace (MVP):** perfis + portfólios; diretório e busca; Radar +
ingestão + *match* + alertas; Marketplace camada A (checklist de habilitação, cofre de
documentos, consórcio); projetos privados nativos (concierge → orgânico); Passaporte mínimo;
Empresa Business (assentos) + assinatura Pro + avaliações e reputação.

**Fase 2 — Instituições & fricção (pós-tração):** módulo Institucional (fornecedores,
acervos, compliance, relatórios); apoio à contratação (rascunho de TR, pré-diagnóstico por
foto, referências de custo); Patrinu Recursos / Vitrine (sai do piloto concierge); Passaporte
completo; sugestão de consórcio com IA; base histórica de desfecho de editais.

**Fase 3 — Financiamento:** cadastro de projetos para captação; base de fontes de recurso;
match projeto ↔ financiamento; Vitrine; dossiê e enquadramento fiscal automáticos.

**Fase 4 — Inteligência & expansão:** IA de matching avançada; recomendações; Patrinu Score
avançado; dados de mercado; licenciamento de dados; adjacências (AEC, seguros) e LATAM.

---

## 11 — Métricas de sucesso

**Fase 1 — as métricas que decidem tudo:** retenção do Radar (W4 ≥ meta) · alerta → resposta
(%) · perfis completos (% da base) · MRR de assentos Business.

| Dimensão | KPIs |
|---|---|
| Oferta | Profissionais cadastrados, perfis completos, projetos no portfólio, cobertura por polo |
| Radar | Oportunidades ingeridas/dia, cobertura de fontes, precisão do *match*, alertas enviados, CTR, retenção semanal |
| Marketplace | Alerta → resposta iniciada → manifestação enviada, consórcios formados, candidaturas concluídas na plataforma, win-rate autorreportado |
| Demanda privada | Projetos publicados (concierge vs. orgânico), propostas por projeto, taxa de conexão, contratos originados |
| Patrimônio | Bens com Passaporte, intervenções registradas, cobertura por região |
| Instituições / Patrocínio | Contas institucionais, projetos na Vitrine, valor potencial, conexões com financiadores (F2–F3) |
| Receita | MRR, ARPU, mix Business / Institucional / Pro, retenção líquida, conversão Free→Pro |

---

## 12 — Riscos e mitigações

| Risco | Por quê | Mitigação |
|---|---|---|
| **Cold-start do Marketplace no v1** | Lançar as duas camadas cedo aumenta o risco de os projetos privados ficarem vazios. | Camada A não precisa de projeto nativo — usa as oportunidades públicas do Radar como inventário. Camada B entra depois, com concierge. O Radar garante presença do lado da oferta. |
| Lançamento nacional fica raso | Sem recorte, a curadoria se dilui e nenhum lugar tem densidade. | Cadastro nacional, curadoria concentrada: ~30 fontes de maior volume, oferta semeada nos polos. |
| Desintermediação | Mercado pequeno e relacional; partes se conhecem e fecham fora. | Não depender de take rate. Valor recorrente no Radar, no cofre de documentos e na reputação — que só existem *dentro* da plataforma. |
| TAM estreito na base | Poucos milhares de profissionais formais. | Receita âncora em Business/Institucional/Patrocinador; muitos bolsos no mesmo vertical; adjacências e LATAM depois; dado licenciável. |
| Ciclo de venda institucional longo | Órgãos públicos e grandes instituições compram devagar. | Entrar por baixo (profissionais e ateliês), subir para institucional na Fase 2, começando por contas-farol. |
| Cobertura e qualidade do *match* | Editais em centenas de portais heterogêneos; match ruim destrói a confiança no alerta. | Priorizar as fontes de maior volume; humano no circuito na fase de curadoria manual para calibrar critérios antes de automatizar. |
| Sobrecarga de escopo no MVP | Radar + Marketplace + Passaporte + Business ao mesmo tempo é muito para um time pequeno. | Marketplace no MVP é só a camada A. Passaporte é uma página gerada, não um módulo. Business v1 é dashboard + assentos, sem apoio à contratação com IA. |

---

## 13 — Princípios de produto

- Especialização acima de escala genérica.
- Portfólio e evidência acima de autodeclaração.
- Reputação como ativo central.
- O Radar tem que "só funcionar" — descoberta sem esforço.
- Prender o fluxo de trabalho, não só a descoberta: o alerta tem que levar à resposta dentro
  da plataforma.
- Cada tela deixa dado estruturado — perfil, edital, intervenção, desfecho.
- IA como camada de inteligência, não como substituta do especialista.
- Cobrar de quem tem orçamento; o lado *cash-poor* usa de graça.
- Cadastro amplo, curadoria concentrada — alcance nacional não significa esforço uniforme.

---

## 14 — Decisões em aberto

1. **Fontes de verdade do Radar:** quais são as ~30 fontes prioritárias? PNCP resolve quanto
   do volume público? Quais órgãos estaduais têm API e quais exigem scraping? *(Detalhado em
   `radar-fontes.md`.)*
2. **Verificação de profissionais:** o que conta como "verificado" — diploma, registro
   CAU/CREA, ART/RRT, filiação a associação, projeto documentado com foto? Há verificação em
   níveis?
3. **Identificador do bem no Passaporte:** usar cadastro do IPHAN (SICG) / órgãos estaduais
   como chave, ou criar identificador próprio com *mapeamento* para os cadastros oficiais?
4. **Preço:** valor do Pro; posição exata do Business dentro da faixa R$ 300–900/assento e o
   que separa os níveis; base de cobrança do Institucional (por acervo? por usuário? por
   bem?).
5. **Marketplace camada B:** quanto de concierge o time aguenta operar, e qual o gatilho para
   ligar a publicação orgânica aberta?
6. **Patrocinador/Vitrine:** começar o piloto concierge com qual perfil de patrocinador —
   banco, instituto empresarial ou estatal?
7. **Modelo de captação (Fase 3):** a Patrinu apenas conecta, ou também opera a gestão do
   incentivo (proponente, prestação de contas)?
8. **Prioridade de expansão:** adjacência (AEC / retrofit) antes ou depois de LATAM?
