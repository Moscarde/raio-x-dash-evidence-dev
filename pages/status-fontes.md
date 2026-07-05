---
title: Status das fontes
---

# Status das fontes

Situação real das fontes carregadas no banco analítico do Raio-X Municipal — o que existe, para qual período e para quantos municípios.

```sql resumo_fontes
select 'CNES' as fonte, 'raio_x_saude.dim_estabelecimento' as tabela,
    count(*) as total_registros,
    count(distinct cod_municipio_ibge6) as municipios_cobertos,
    min(competencia_cadastro)::text as periodo_inicio,
    max(competencia_cadastro)::text as periodo_fim
from raio_x_saude.dim_estabelecimento

union all

select 'SIH' as fonte, 'raio_x_saude.fct_internacoes' as tabela,
    count(*) as total_registros,
    count(distinct id_municipio_estabelecimento) as municipios_cobertos,
    min(competencia_date)::text as periodo_inicio,
    max(competencia_date)::text as periodo_fim
from raio_x_saude.fct_internacoes

union all

select 'SIM' as fonte, 'raio_x_saude.fct_obitos' as tabela,
    count(*) as total_registros,
    count(distinct id_municipio_ocorrencia) as municipios_cobertos,
    min(_reference_year)::text as periodo_inicio,
    max(_reference_year)::text as periodo_fim
from raio_x_saude.fct_obitos

union all

select 'SINASC' as fonte, 'raio_x_saude.fct_nascidos_vivos' as tabela,
    count(*) as total_registros,
    count(distinct id_municipio_nascimento) as municipios_cobertos,
    min(_reference_year)::text as periodo_inicio,
    max(_reference_year)::text as periodo_fim
from raio_x_saude.fct_nascidos_vivos

union all

select 'FNS' as fonte, 'raio_x_saude.mart_repasses_fns' as tabela,
    count(*) as total_registros,
    count(distinct id_municipio) as municipios_cobertos,
    min(ano)::text as periodo_inicio,
    max(ano)::text as periodo_fim
from raio_x_saude.mart_repasses_fns

union all

select 'SIOPS' as fonte, 'raio_x_saude.mart_financiamento_saude_siops' as tabela,
    count(*) as total_registros,
    count(distinct id_municipio) as municipios_cobertos,
    min(ano_exercicio)::text as periodo_inicio,
    max(ano_exercicio)::text as periodo_fim
from raio_x_saude.mart_financiamento_saude_siops

union all

select 'SISAB' as fonte, 'raio_x_saude.mart_indicadores_aps' as tabela,
    count(*) as total_registros,
    count(distinct id_municipio) as municipios_cobertos,
    min(quadrimestre) as periodo_inicio,
    max(quadrimestre) as periodo_fim
from raio_x_saude.mart_indicadores_aps

order by fonte
```

<DataTable data={resumo_fontes} rows=8>
    <Column id="fonte" title="Fonte"/>
    <Column id="tabela" title="Tabela"/>
    <Column id="total_registros" title="Registros" fmt="num0"/>
    <Column id="municipios_cobertos" title="Municípios"/>
    <Column id="periodo_inicio" title="Início"/>
    <Column id="periodo_fim" title="Fim"/>
</DataTable>

## Observações

- **SIA** (produção ambulatorial) está fora desta página por instrução explícita: a base ainda não está pronta no projeto de engenharia.
- Todas as fontes de fato (SIH, SIM, SINASC, FNS, SIOPS, SISAB) hoje cobrem **1 único município — Rio de Janeiro (RJ), id IBGE 3304557**. Só `dim_municipio` (dimensão IBGE) tem os 5.571 municípios do Brasil. Páginas que dependam de comparação entre municípios não são viáveis com dado real ainda.
- CNES (`dim_estabelecimento`) tem 1 competência de cadastro carregada (dez/2025) e o campo `tipo_unidade` está em código cru do CNES — ainda não existe seed de-para para nome legível (ver `notes/backlog.md`).
- Nenhuma das marts expõe timestamp de carga (`_loaded_at`) — a coluna existe apenas em `fct_producao_ambulatorial` (SIA). "Início"/"Fim" aqui referem-se ao período dos dados, não à data em que foram carregados.
