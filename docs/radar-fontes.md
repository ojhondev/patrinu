# Fontes do Radar — anexo ao PRD v3 §14.1

As ~30 fontes que constroem o Radar de Oportunidades.

- **Escopo:** restauro e conservação de patrimônio · nacional
- **Data:** Agosto de 2026
- **Artifact:** https://claude.ai/code/artifact/9df43684-c324-4673-bbc7-ba9e33af17aa

## 00 — Lógica da priorização

O Radar tem **dois trabalhos**: rastrear **quem contrata a obra** (licitações, chamamentos,
credenciamentos → profissionais e ateliês disputam) e rastrear **o dinheiro que faz o
projeto acontecer** (editais de fomento, leis de incentivo, editais de banco → instituições
e proponentes). O segundo trabalho também abastece o produto **Patrocinador / Vitrine**.

As fontes estão em **6 tiers por relação valor/esforço**. Os tiers 0–2 (~15 fontes, quase
todas com **API pública**) devem cobrir a maior parte do volume relevante. Os tiers 3–5
aumentam profundidade e captam o alto valor de baixa frequência.

| Acesso | O que significa |
|---|---|
| **API** | API pública documentada, geralmente JSON e sem autenticação. Ingestão direta. |
| **Scraping** | Sem API; raspar HTML / PDF de páginas de edital ou diários oficiais. Precisa de manutenção. |
| **Monitorar** | Baixa frequência e alto valor. Newsletter, alerta de página ou curadoria humana até justificar automação. |

## 01 — Tier 0 · Base nacional (6 fontes) — o Radar de licitações roda só com isto

| # | Fonte | O que entrega | Acesso |
|---|---|---|---|
| 1 | **PNCP** — Portal Nacional de Contratações Públicas (`pncp.gov.br`) | Portal obrigatório da Lei 14.133/2021. Editais, avisos e contratos de União, estados e municípios que já migraram. Núcleo do Radar de licitações. | API JSON, sem auth, Swagger público |
| 2 | **Compras.gov.br** (Comprasnet / SIASG) | Compras do executivo federal. Onde IPHAN, IBRAM/museus federais, Funarte, universidades e Biblioteca Nacional licitam. Mais completo que o PNCP para o federal. | API Dados Abertos Compras |
| 3 | **DOU** — Imprensa Nacional / Diário Oficial da União | Extratos de edital, avisos de licitação e editais de fomento federais. Rede de segurança. | API + scraping |
| 4 | **Querido Diário** (Open Knowledge Brasil) | Agregação aberta de diários oficiais municipais de centenas de municípios. Captura restauro em cidades pequenas fora do PNCP. | API aberta |
| 5 | **Licitações-e** (Banco do Brasil) | Plataforma de pregão usada por milhares de prefeituras. Cobertura municipal que escapa do PNCP. | Scraping |
| 6 | **Plataformas privadas de pregão** — Portal de Compras Públicas, BLL, Licitar Digital, BNC | Muitas prefeituras e órgãos rodam pregões aqui. Tratar como um bloco; priorizar por volume observado. | Scraping / parceria de dados |

## 02 — Tier 1 · Patrimônio federal (5 fontes) — maior densidade de restauro

| # | Fonte | O que entrega | Acesso |
|---|---|---|---|
| 7 | **IPHAN — Editais e Seleções** (`gov.br/iphan`) | Editais de restauro, seleção de projetos, chamamentos e credenciamentos de profissionais/empresas. Fonte de maior aderência. | Scraping da página + cruzar com DOU |
| 8 | **IPHAN — licitações e contratos** | A autarquia contrata obra e projeto via PNCP/Comprasnet. Filtro dedicado por órgão (IPHAN sede + 27 superintendências). | API via #1 e #2 |
| 9 | **Novo PAC — Cidades Históricas** | Pipeline de obras em 44+ cidades históricas (~R$ 1,6 bi), operado por IPHAN + Caixa + Ministério das Cidades. Antecipa licitações. | Monitorar anúncios + PNCP quando licita |
| 10 | **Fundações e museus federais** — IBRAM e museus nacionais, Funarte, Fundação Casa de Rui Barbosa, Biblioteca Nacional, Fundação Palmares | Restauro de edifícios e acervos, museografia, conservação preventiva. Consolidar num filtro de órgãos. | API via #2 |
| 11 | **Ministério da Cultura — Editais** (`gov.br/cultura`) | Editais nacionais de fomento, incluindo linhas com recorte de patrimônio material e imaterial. | Scraping + DOU |

## 03 — Tier 2 · Incentivo e fomento (4 fontes) — abastece o Radar E a Vitrine

| # | Fonte | O que entrega | Acesso |
|---|---|---|---|
| 12 | **SALIC / VerSalic** — projetos e propostas da Lei Rouanet | *Deal-flow* de projetos de patrimônio buscando patrocínio, com valor, proponente e status. Núcleo do produto Patrocinador/Vitrine e sinal de demanda para o Marketplace. | API pública (JSON/XML/CSV) |
| 13 | **PNAB** — Política Nacional Aldir Blanc | Editais culturais de estados e dos 5.570 municípios com recurso federal até ~2027. Volume enorme; filtrar por patrimônio / acervo / memória / museus. | API parcial (Mapas Culturais) + scraping |
| 14 | **Rede Mapas Culturais** | Plataforma open-source usada por dezenas de estados e municípios para publicar editais e chamamentos. Uma API por instância, mesmo schema. | API por instância |
| 15 | **Prosas** (`prosas.com.br`) | Agregador privado de editais social/cultural/patrimônio de institutos e empresas. Boa cobertura do que não sai em diário oficial. | Scraping ou parceria de dados |

## 04 — Tier 3 · Estados / polos (8 fontes) — começar por MG, BA, PE, RJ, SP, RS

| # | Fonte | O que entrega | Acesso |
|---|---|---|---|
| 16 | **IEPHA-MG** — Instituto Estadual do Patrimônio de Minas | Editais, chamamentos e o programa ICMS Patrimônio Cultural. Alta aderência. | Scraping |
| 17 | **SEC-MG** — Lei Estadual de Incentivo (LEIC) + Fundo Estadual de Cultura | Plataforma Digital de Fomento e Incentivo Cultural de MG (fluxo contínuo); editais do Fundo Estadual. | Scraping / API Mapas Culturais MG |
| 18 | **Secretaria de Cultura e Economia Criativa SP** — ProAC Editais + ProAC ICMS | Maior programa estadual de fomento do país; linhas de patrimônio, museus e acervos. | Scraping |
| 19 | **CONDEPHAAT-SP / UPPM** | Patrimônio tombado estadual paulista: obras, editais e Programa de Ação Cultural com recorte de preservação. | Scraping + PNCP |
| 20 | **IPAC-BA + Secult-BA** (Fazcultura, Fundo de Cultura) | Centro histórico de Salvador, Cachoeira, Recôncavo. Editais de restauro e incentivo estadual. | Scraping |
| 21 | **Fundarpe-PE** (Funcultura) | Órgão de patrimônio + fomento de Pernambuco. Recife, Olinda, sítios do interior. | Scraping |
| 22 | **INEPAC-RJ + Secretaria de Cultura RJ** (LIC-RJ, Fundo de Cultura) · **IPHAE-RS + SEDAC-RS** (Pró-Cultura RS) | Patrimônio e incentivo estaduais de RJ e RS. Duas fontes irmãs no mesmo conector. | Scraping |
| 23 | **Demais secretarias estaduais de cultura** — PR, SC, CE, PA, ES, GO, DF e outras | Cobertura da cauda longa via rede Mapas Culturais e diários oficiais estaduais (DOE). | API onde houver + scraping |

## 05 — Tier 4 · Bancos, estatais e institutos (5 fontes) — baixa frequência, altíssimo valor

Poucos editais por ano, tickets grandes, quase sempre casados com Lei Rouanet. Também são os
**compradores** do produto Patrocinador/Vitrine.

| # | Fonte | O que entrega | Acesso |
|---|---|---|---|
| 24 | **BNDES** — linha de Patrimônio Cultural / BNDES + Cultura / matchfunding | Um dos maiores financiadores de restauro de bens tombados do país. Chamadas públicas e seleções. | Monitorar página de editais |
| 25 | **Petrobras** — Seleção Pública / Programa Petrobras Cultural | Grandes editais periódicos com linhas de patrimônio material e memória. | Monitorar + DOU |
| 26 | **Instituto Cultural Vale** | Forte atuação em Minas — Ouro Preto, Congonhas, Mariana, Sabará. Editais próprios e parcerias de restauro. | Monitorar |
| 27 | **Caixa Cultural · CCBB (Banco do Brasil) · Itaú Cultural (Rumos) · Banco do Nordeste** | Editais de ocupação, fomento e ocasionalmente restauro/qualificação de espaços. Bloco de quatro no mesmo conector. | Monitorar / scraping |
| 28 | **Fundações e institutos privados** — Fundação Roberto Marinho, Sesc (SP e nacional), Fundação Iberê, entre outros | Projetos e parcerias de restauro e museografia, muitas vezes sem edital formal — sinal de mercado e de patrocínio. | Monitorar |

## 06 — Tier 5 · Internacional (2 blocos) — nicho, alto valor simbólico

| # | Fonte | O que entrega | Acesso |
|---|---|---|---|
| 29 | **Fundos de preservação** — World Monuments Watch, Getty (Keeping It Modern), ALIPH, Ambassadors Fund for Cultural Preservation (Embaixada dos EUA), Fundação Gulbenkian, UNESCO | Grants para restauro de bens de valor excepcional. Poucos por ano, prestígio alto. | Monitorar newsletters e páginas de grant |
| 30 | **Bancos multilaterais** — BID, Banco Mundial, CAF | Projetos de revitalização urbana com componente de patrimônio (contratam consultoria e projeto). | API/scraping dos portais de procurement |

## 07 — Ordem de implementação

| Onda | Fontes | Observação |
|---|---|---|
| **1 — MVP** | #1 PNCP · #2 Compras.gov.br · #3 DOU · #7 IPHAN Editais · #12 SALIC | 4 com API limpa. Deve cobrir a maior parte do volume público relevante. |
| **2 — pós-lançamento** | #4 Querido Diário · #5 Licitações-e · #13–14 PNAB + Mapas Culturais · #16–21 os 6 estados-polo · #10 museus e fundações federais | Profundidade municipal e estadual. Mais scraping, mais manutenção. |
| **3 — quando escalar** | #6 plataformas privadas · #15 Prosas · #22–23 demais estados · #24–28 bancos e institutos · #29–30 internacional | Cauda longa e alto valor de baixa frequência. Curadoria humana enquanto o volume não justifica conector. |

**Antes do produto:** o "Passo 1" do PRD (Radar manual + lista de espera) roda com as fontes
da Onda 1 abertas num navegador e uma planilha. Serve para calibrar os critérios de *match* e
o vocabulário de classificação antes de escrever qualquer *parser*.

## 08 — Deduplicação e classificação

PNCP, Comprasnet, DOU e Querido Diário **se sobrepõem muito** — a mesma licitação aparece em
três lugares com formatos diferentes. Sem uma camada de resolução de entidade, o feed vira
ruído. Essa camada faz:

- **Resolução de duplicatas** por número do processo, órgão, objeto e datas — uma
  oportunidade canônica com várias fontes anexadas.
- **Classificação de relevância** com IA: isto é patrimônio? Qual especialidade (bens
  móveis, integrados, arquitetura, arqueologia, acervo, imaterial)? Qual técnica?
- **Extração estruturada:** objeto, valor estimado, prazo, exigências de habilitação, acervo
  técnico e atestados exigidos, órgão, localização, bem afetado.
- **Vínculo com o bem** quando identificável — liga a oportunidade ao Passaporte do
  Patrimônio (ver PRD §14.3).
- **Desfecho:** acompanhar homologação e vencedor para montar a base histórica — o dado mais
  defensável do Radar.

**Risco de manutenção:** portais mudam layout, diários mudam formato, plataformas privadas
bloqueiam scraping. Orçar as fontes de scraping como custo recorrente de operação, não como
entrega única. As fontes de API são o alicerce justamente por isso.

---

### Fontes públicas consultadas

- PNCP — Swagger/API: https://pncp.gov.br/api/consulta/swagger-ui/index.html
- PNCP — Dados Abertos: https://www.gov.br/pncp/pt-br/acesso-a-informacao/dados-abertos
- SALIC — API: https://api.salic.cultura.gov.br/docs
- SALIC — dados abertos: https://dados.cultura.gov.br/dataset/incentivos-da-lei-rouanet
- Edital IPHAN nº 1/2026: https://www.gov.br/iphan/pt-br/acesso-a-informacao/editais-e-selecoes
- LEIC Minas Gerais — SECULT-MG: https://www.secult.mg.gov.br/documentos/lei-estadual-de-incentivo-a-cultura-leic

> Nomes de portais e mecanismos verificados em fontes públicas; disponibilidade de API a
> confirmar por fonte na fase de engenharia.
