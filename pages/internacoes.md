---
title: Internações
---

# Internações

Produção hospitalar (SIH) do município de Rio de Janeiro (RJ) — único município com este dado carregado hoje (ver [Status das fontes](/status-fontes)).

```sql resumo_internacoes
select
    count(*) as total_internacoes,
    round(avg(dias_permanencia), 1) as permanencia_media_dias,
    sum(case when houve_obito then 1 else 0 end) as total_obitos,
    round(100.0 * sum(case when houve_obito then 1 else 0 end) / count(*), 1) as taxa_obito_pct,
    round(sum(valor_total)) as valor_total_aprovado
from raio_x_saude.fct_internacoes
```

<BigValue data={resumo_internacoes} value="total_internacoes" title="Internações" fmt="num0"/>
<BigValue data={resumo_internacoes} value="permanencia_media_dias" title="Permanência média (dias)"/>
<BigValue data={resumo_internacoes} value="taxa_obito_pct" title="Óbito hospitalar" fmt="pct1"/>
<BigValue data={resumo_internacoes} value="valor_total_aprovado" title="Valor total aprovado (R$)" fmt="usd0"/>

```sql serie_competencia
select
    competencia_date,
    count(*) as total_internacoes,
    round(sum(valor_total)) as valor_aprovado
from raio_x_saude.fct_internacoes
group by competencia_date
order by competencia_date
```

## Internações por competência

<LineChart data={serie_competencia} x="competencia_date" y="total_internacoes" title="Internações por mês"/>

<BarChart data={serie_competencia} x="competencia_date" y="valor_aprovado" title="Valor aprovado por mês (R$)"/>

## Observações

- Fonte: SIH (2025, ano completo, Rio de Janeiro/RJ). Sem dado de outros municípios ou de 2026 até o momento.
- `valor_total` é o valor aprovado por AIH, sem separar diária, SP/SADT e órteses/próteses.
- Município de internação (`id_municipio_estabelecimento`), não necessariamente o de residência do paciente — internações de outros municípios atendidas no Rio de Janeiro entram na mesma contagem.
