---
title: Perfil municipal
---

# Perfil municipal

Visão geral de um município a partir dos dados carregados no banco analítico.

Hoje só **Rio de Janeiro (RJ)** tem dado de fato carregado (ver [Status das fontes](/status-fontes)) — por isso ainda não há seletor de município. Ele será adicionado quando houver mais de um município com dado real.

```sql municipio
select id_municipio, nome_municipio, nome_microrregiao, nome_mesorregiao, sigla_uf, nome_regiao
from raio_x_saude.dim_municipio
where id_municipio = 3304557
```

# {municipio[0].nome_municipio} · {municipio[0].sigla_uf}

{municipio[0].nome_microrregiao} · {municipio[0].nome_mesorregiao} · Região {municipio[0].nome_regiao}

```sql resumo_estabelecimentos
select count(*) as total
from raio_x_saude.dim_estabelecimento
where cod_municipio_ibge6 = 330455
```

```sql resumo_internacoes
select count(*) as total, round(avg(dias_permanencia), 1) as permanencia_media
from raio_x_saude.fct_internacoes
where id_municipio_estabelecimento = 3304557
```

```sql resumo_obitos
select count(*) as total
from raio_x_saude.fct_obitos
where id_municipio_ocorrencia = 3304557
```

```sql resumo_nascidos
select count(*) as total
from raio_x_saude.fct_nascidos_vivos
where id_municipio_nascimento = 3304557
```

<BigValue data={resumo_estabelecimentos} value="total" title="Estabelecimentos CNES"/>
<BigValue data={resumo_internacoes} value="total" title="Internações (SIH)"/>
<BigValue data={resumo_internacoes} value="permanencia_media" title="Permanência média (dias)"/>
<BigValue data={resumo_obitos} value="total" title="Óbitos (SIM)"/>
<BigValue data={resumo_nascidos} value="total" title="Nascidos vivos (SINASC)"/>

## Observações

- Não há coluna de população em `raio_x_saude.dim_municipio` hoje — o card de população/porte previsto no backlog depende de uma mart futura no dbt.
- Estabelecimentos são filtrados pelo código IBGE de 6 dígitos (`cod_municipio_ibge6`), já que `dim_estabelecimento` ainda não resolve para o código de 7 dígitos de `dim_municipio` (decisão deliberada do projeto dbt — ver `ROADMAP_DBT.md`).
- Óbitos, nascimentos e internações usam o município de ocorrência/estabelecimento, não necessariamente o de residência do paciente.
