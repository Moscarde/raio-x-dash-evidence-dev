# Backlog

Backlog do projeto `raio-x-dash-evidence-dev`.

Este arquivo centraliza ideias, páginas, melhorias e pendências da camada analítica construída com Evidence.dev.

## Critérios de priorização

Priorizar tarefas que:

1. aumentem confiança nos dados;
2. respondam perguntas reais de gestão municipal;
3. ajudem o produto a ser apresentado como portfólio;
4. reutilizem models ou views já existentes no projeto `raio-x-engenharia`;
5. evitem lógica pesada no Evidence;
6. reduzam risco de interpretação errada dos indicadores.

## Fase 0 — Estrutura inicial do projeto

- [x] Confirmar estrutura padrão do Evidence no repositório.
- [x] Validar conexão local com PostgreSQL.
- [x] Criar ou revisar configuração de sources.
- [x] Criar `.env.example` sem credenciais reais.
- [x] Garantir que `.env` esteja no `.gitignore`.
- [x] Confirmar comandos reais no `package.json`.
- [x] Rodar servidor local do Evidence.
- [x] Criar página inicial com objetivo do produto.
- [x] Criar menu ou navegação inicial (nav padrão do Evidence a partir de `pages/`).
- [x] Revisar se não há dados sensíveis expostos (só agregados municipais, sem CPF/CNS/paciente).

## Fase 1 — Páginas de confiança e qualidade

Essas páginas devem vir antes dos dashboards mais vistosos. Elas mostram se o banco está carregado, atualizado e confiável.

### Status das fontes

Arquivo sugerido:

```txt
pages/status-fontes.md
```

Pergunta respondida:

> Quais fontes estão carregadas e qual é a última atualização de cada uma?

Conteúdo desejado:

- [x] total de registros por fonte;
- [x] período coberto por fonte (início/fim);
- [ ] última data de carga (nenhuma mart expõe `_loaded_at` hoje, só `fct_producao_ambulatorial`/SIA);
- [x] total de municípios cobertos;
- [ ] status visual por fonte (hoje é só tabela textual);
- [x] observações sobre atraso ou cobertura.

Implementado em `pages/status-fontes.md` (2026-07-05), com SQL direto (8 `union all`, ~65 linhas — já no limite do que o CLAUDE.md recomenda manter fora do dbt). Se crescer mais, migrar para uma view.

Possível dependência dbt:

```txt
gold_dashboard.vw_fontes_status
```

### Cobertura temporal

Arquivo sugerido:

```txt
pages/cobertura-temporal.md
```

Pergunta respondida:

> Quais competências estão disponíveis por fonte e município?

Conteúdo desejado:

- [ ] matriz fonte x competência;
- [ ] série mensal de registros;
- [ ] primeira e última competência por fonte;
- [ ] lacunas de competência;
- [ ] alerta de fonte sem atualização recente.

Possível dependência dbt:

```txt
gold_dashboard.vw_cobertura_temporal_por_fonte
```

### Qualidade dos dados

Arquivo sugerido:

```txt
pages/qualidade-dados.md
```

Pergunta respondida:

> Existem nulos, duplicidades ou quebras de chave que afetam a leitura dos dados?

Conteúdo desejado:

- [ ] nulos em campos críticos;
- [ ] duplicidades por chave esperada;
- [ ] municípios sem correspondência IBGE;
- [ ] estabelecimentos sem município válido;
- [ ] competências inválidas;
- [ ] tabelas com carga vazia;
- [ ] observações metodológicas.

Possível dependência dbt:

```txt
gold_dashboard.vw_qualidade_dados_resumo
```

## Fase 2 — Páginas de diagnóstico municipal

### Perfil municipal

Arquivo sugerido:

```txt
pages/perfil-municipal.md
```

Pergunta respondida:

> Qual é o contexto básico do município?

Conteúdo desejado:

- [ ] seletor de UF/município, se aplicável;
- [ ] código IBGE;
- [ ] população;
- [ ] porte populacional;
- [ ] região de saúde, quando disponível;
- [ ] área territorial e densidade, se disponível;
- [ ] cards de resumo;
- [ ] observações sobre fonte e atualização.

Possíveis fontes/modelos:

```txt
gold.dim_municipio
gold_dashboard.vw_perfil_municipal
```

### Rede assistencial

Arquivo sugerido:

```txt
pages/rede-assistencial.md
```

Pergunta respondida:

> Qual é a estrutura de saúde cadastrada no município?

Conteúdo desejado:

- [ ] total de estabelecimentos ativos;
- [ ] estabelecimentos por tipo;
- [ ] UBS, hospitais, unidades de urgência, CAPS, CEO e outros tipos relevantes;
- [ ] estabelecimentos por natureza jurídica;
- [ ] estabelecimentos por gestão;
- [ ] tabela de unidades;
- [ ] alertas de CNES sem dados relevantes;
- [ ] observações sobre limitações do CNES.

Possíveis fontes/modelos:

```txt
gold.dim_estabelecimento
gold_dashboard.vw_rede_assistencial_municipal
```

### Produção ambulatorial

Arquivo sugerido:

```txt
pages/producao-ambulatorial.md
```

Pergunta respondida:

> Como a produção ambulatorial do município evolui ao longo do tempo?

Conteúdo desejado:

- [ ] produção total por competência;
- [ ] valor aprovado por competência, se disponível;
- [ ] produção por grupo de procedimento;
- [ ] produção por estabelecimento;
- [ ] top procedimentos;
- [ ] variação mensal e anual;
- [ ] observações sobre local de atendimento versus município de residência.

Possíveis fontes/modelos:

```txt
gold.fato_producao_ambulatorial
gold_dashboard.vw_producao_ambulatorial_municipal
```

### Internações

Arquivo sugerido:

```txt
pages/internacoes.md
```

Pergunta respondida:

> Como está a demanda hospitalar e onde ocorrem as internações de residentes?

Conteúdo desejado:

- [ ] internações por competência;
- [ ] internações por município de residência;
- [ ] internações por local de internação;
- [ ] principais causas ou grupos;
- [ ] média de permanência, se disponível;
- [ ] valor aprovado, se disponível;
- [ ] dependência de outros municípios;
- [ ] observações sobre limites da base SIH/SUS.

Possíveis fontes/modelos:

```txt
gold.fato_internacao
gold_dashboard.vw_internacoes_municipal
gold_dashboard.vw_dependencia_hospitalar_municipal
```

### Comparação entre municípios

Arquivo sugerido:

```txt
pages/comparacao-municipios.md
```

Pergunta respondida:

> Como o município se compara a municípios semelhantes?

Conteúdo desejado:

- [ ] definição do grupo de comparação;
- [ ] comparação por população;
- [ ] produção por habitante;
- [ ] estabelecimentos por 10 mil habitantes;
- [ ] internações por mil habitantes;
- [ ] posição relativa do município;
- [ ] observações sobre limites de comparação.

Possíveis fontes/modelos:

```txt
gold_dashboard.vw_municipios_semelhantes
gold_dashboard.vw_comparacao_municipal
```

## Fase 3 — Páginas de valor gerencial

### O que merece atenção

Arquivo sugerido:

```txt
pages/o-que-merece-atencao.md
```

Pergunta respondida:

> Quais pontos deveriam chamar atenção da gestão neste momento?

Conteúdo desejado:

- [ ] lista priorizada de alertas;
- [ ] gravidade ou prioridade;
- [ ] fonte do alerta;
- [ ] competência de referência;
- [ ] explicação curta do achado;
- [ ] recomendação de leitura;
- [ ] link para página detalhada.

Possível dependência dbt:

```txt
gold_dashboard.vw_alertas_municipais
```

### Alertas CNES

Arquivo sugerido:

```txt
pages/alertas-cnes.md
```

Pergunta respondida:

> Existem sinais de inconsistência cadastral na rede municipal?

Conteúdo desejado:

- [ ] estabelecimentos ativos sem produção recente;
- [ ] unidades sem geolocalização válida, se aplicável;
- [ ] tipos de unidade com cadastro incompleto;
- [ ] serviços cadastrados sem produção relacionada;
- [ ] estabelecimentos duplicados ou suspeitos;
- [ ] observações metodológicas.

Possível dependência dbt:

```txt
gold_dashboard.vw_alertas_cnes
```

### Relatório executivo

Arquivo sugerido:

```txt
pages/relatorio-executivo.md
```

Pergunta respondida:

> Qual é o resumo interpretativo do diagnóstico municipal?

Conteúdo desejado:

- [ ] resumo do município;
- [ ] principais achados;
- [ ] riscos e oportunidades;
- [ ] comparação com pares;
- [ ] recomendações;
- [ ] referências de fonte;
- [ ] texto pronto para apresentação.

Observação:

A geração com IA deve usar apenas indicadores agregados e textos metodológicos. Não enviar dados sensíveis.

## Fase 4 — Documentação metodológica

### Metodologia geral

Arquivo sugerido:

```txt
pages/metodologia.md
```

Conteúdo desejado:

- [ ] objetivo do produto;
- [ ] escopo das fontes;
- [ ] definição de competência;
- [ ] diferença entre local de atendimento e município de residência;
- [ ] uso de código IBGE;
- [ ] uso de código CNES;
- [ ] limitações gerais;
- [ ] política de atualização.

### Dicionário de indicadores

Arquivo sugerido:

```txt
pages/dicionario-indicadores.md
```

Conteúdo desejado:

- [ ] nome do indicador;
- [ ] pergunta respondida;
- [ ] fórmula;
- [ ] fonte;
- [ ] granularidade;
- [ ] competência;
- [ ] limitações;
- [ ] páginas onde é usado.

### Fontes de dados

Arquivo sugerido:

```txt
pages/fontes-dados.md
```

Conteúdo desejado:

- [ ] IBGE;
- [ ] CNES;
- [ ] SIA/SUS;
- [ ] SIH/SUS;
- [ ] SISAB/e-Gestor APS;
- [ ] SIM;
- [ ] SINASC;
- [ ] FNS;
- [ ] SIOPS;
- [ ] OpenDataSUS;
- [ ] atualização esperada por fonte;
- [ ] observações de coleta.

## Fase 5 — Componentes reutilizáveis

Criar componentes apenas quando houver repetição real.

Possíveis componentes:

- [ ] `FonteAtualizacao`: bloco com fonte, competência e data de carga.
- [ ] `AlertaQualidade`: aviso padronizado para limitação de dado.
- [ ] `BlocoMetodologia`: seção reutilizável de metodologia.
- [ ] `CardIndicador`: card padronizado de métrica principal.
- [ ] `TabelaFonteStatus`: tabela padronizada de status de fontes.

Critério para criar:

- usado em pelo menos duas páginas;
- melhora legibilidade;
- não contém regra de negócio pesada;
- recebe props explícitas;
- não consulta banco diretamente.

## Fase 6 — Testes e validações

- [ ] Definir comando único de teste no README.
- [ ] Validar renderização local das páginas principais.
- [ ] Criar verificação simples para nomes de queries.
- [ ] Criar verificação para ausência de termos sensíveis em páginas.
- [ ] Validar links internos.
- [ ] Testar helpers de formatação, se existirem.
- [ ] Garantir que testes unitários não batam em banco real.
- [ ] Criar checklist de revisão antes de merge.

Possíveis validações automatizadas:

- arquivos em `pages/` usam `kebab-case`;
- queries não usam `select *`;
- páginas não possuem strings como `CPF`, `CNS`, `nome_paciente`;
- arquivos Markdown possuem título H1;
- páginas principais possuem seção de observações ou metodologia.

## Fase 7 — Performance

- [ ] Identificar páginas lentas.
- [ ] Medir tempo das queries principais.
- [ ] Evitar renderizar tabelas grandes no navegador.
- [ ] Limitar tabelas exploratórias.
- [ ] Propor views agregadas no dbt quando necessário.
- [ ] Verificar índices no PostgreSQL para consultas críticas.
- [ ] Evitar joins pesados no Evidence.
- [ ] Criar views `gold_dashboard` para páginas recorrentes.

## Fase 8 — Portfólio e narrativa comercial

- [ ] Criar página inicial com narrativa do Radar SUS Municipal.
- [ ] Criar fluxo demonstrativo por município.
- [ ] Criar página “O que este painel responde?”.
- [ ] Criar página “Como interpretar este diagnóstico?”.
- [ ] Criar demo com municípios pequenos e médios do RJ.
- [ ] Criar screenshots ou imagens para apresentação comercial.
- [ ] Criar seção de limitações e transparência metodológica.
- [ ] Criar CTA textual para diagnóstico completo.
- [ ] Criar versão navegável para apresentação a gestores.

## Ideias de páginas futuras

- [ ] `aps-indicadores.md`
- [ ] `saude-bucal.md`
- [ ] `equipes-aps.md`
- [ ] `financiamento-saude.md`
- [ ] `repasses-fns.md`
- [ ] `orcamento-siops.md`
- [ ] `mortalidade.md`
- [ ] `nascidos-vivos.md`
- [ ] `mapa-unidades.md`
- [ ] `dependencia-regional.md`
- [ ] `procedimentos-mais-frequentes.md`
- [ ] `unidades-sem-producao.md`
- [ ] `ranking-regional.md`
- [ ] `glossario-sus.md`

## Sugestões de views para o projeto dbt

Avaliar criação no projeto `raio-x-engenharia`:

```txt
gold_dashboard.vw_fontes_status
gold_dashboard.vw_cobertura_temporal_por_fonte
gold_dashboard.vw_qualidade_dados_resumo
gold_dashboard.vw_perfil_municipal
gold_dashboard.vw_rede_assistencial_municipal
gold_dashboard.vw_producao_ambulatorial_municipal
gold_dashboard.vw_internacoes_municipal
gold_dashboard.vw_dependencia_hospitalar_municipal
gold_dashboard.vw_municipios_semelhantes
gold_dashboard.vw_comparacao_municipal
gold_dashboard.vw_alertas_municipais
gold_dashboard.vw_alertas_cnes
```

Cada view deve ter documentação dbt e testes mínimos quando aplicável.

## Checklist antes de criar uma nova página

- [ ] A página responde uma pergunta clara?
- [ ] A fonte/model foi validado no banco ou no dbt?
- [ ] A query é simples o suficiente para ficar no Markdown?
- [ ] Existe página parecida que deveria ser reaproveitada?
- [ ] A lógica deveria viver no dbt?
- [ ] Existe risco de expor dado sensível?
- [ ] A página tem contexto e observações metodológicas?
- [ ] Os nomes das queries são descritivos?
- [ ] A visualização escolhida é simples e adequada?
- [ ] A página ajuda o usuário a interpretar e decidir?

## Pendências abertas

Registrar aqui decisões e problemas encontrados durante o desenvolvimento.

### Decisões a tomar

- [ ] Nome final do produto na interface: `Radar SUS Municipal`, `Raio-X Municipal` ou outro.
- [ ] Municípios usados na demo inicial.
- [ ] Schemas finais preferenciais para dashboard.
- [ ] Views mínimas necessárias no `gold_dashboard`.
- [ ] Padrão visual da home.
- [ ] Estratégia para filtros de município.
- [ ] Estratégia para publicação ou demo local.

### Riscos conhecidos

- [ ] Consultar tabelas raw por falta de marts finais.
- [ ] Criar SQL grande demais dentro de páginas Evidence.
- [ ] Exibir números sem competência ou fonte.
- [ ] Comparar municípios com perfis muito diferentes.
- [ ] Confundir local de atendimento com município de residência.
- [ ] Gerar interpretações fortes com números pequenos.
- [ ] Expor dados sensíveis em páginas ou logs.

### Achados da primeira carga (2026-07-05)

Ao escalonar o projeto Evidence e conectar no Postgres real (`raio-x-engenharia`), descobri três limitações que mudam o que dá para construir agora:

- **Dado real hoje cobre só 1 município — Rio de Janeiro (RJ), id IBGE 3304557.** Todas as marts de fato (SIH, SIM, SINASC, FNS, SIOPS, SISAB) têm exatamente 1 `id_municipio` distinto. Só `dim_municipio` tem os 5.571 municípios (dimensão IBGE, sem fato associado). **O comparador de municípios do `reference/` (Paraty vs. pares) não é viável com dado real ainda** — precisa de mais municípios carregados no projeto de engenharia antes de fazer sentido construir essa página.
- **`dim_estabelecimento.tipo_unidade` está em código cru do CNES**, sem seed de-para (o projeto dbt só tem seed para `natureza_juridica`, não para `tipo_unidade`). Sem isso não dá pra mostrar "UBS", "Hospital geral" etc. como no `reference/` — só o código numérico.
- **Crosswalk de município para `dim_estabelecimento` foi deliberadamente adiado no dbt** (`cod_municipio_ibge6`, 6 dígitos, sem resolver para o `id_municipio` de 7 dígitos de `dim_municipio` — ver comentário em `dim_estabelecimento.sql` e `ROADMAP_DBT.md`). Hoje isso não trava nada porque só existe 1 município nos fatos, mas trava assim que houver um segundo.

Sugestões para o projeto dbt (`raio-x-engenharia`):

```txt
Sugestão 1: seed_cnes_tipo_unidade (de-para código → nome legível de tipo de unidade).
Motivo: reference/ visual e backlog (rede-assistencial.md) esperam essa decodificação;
hoje só existe o código cru do CNES.

Sugestão 2: resolver dim_estabelecimento.cod_municipio_ibge6 → id_municipio (7 dígitos)
quando o segundo município for carregado (já sinalizado como próximo passo natural em
ROADMAP_DBT.md, não antes).

Sugestão 3: carregar um segundo município nas fontes de fato (SIH/SIM/SINASC/FNS/SIOPS/SISAB)
antes de investir em comparacao-municipios.md — hoje ela não tem o que comparar.
```

## Regra de manutenção

Sempre que uma ideia nova surgir, registrar aqui antes de criar arquivos soltos.

O backlog deve orientar a evolução do produto, não virar depósito de tarefas sem contexto.
