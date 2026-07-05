# Raio-X Dash Evidence Dev

Produto de dados construído com [Evidence.dev](https://evidence.dev/) para criar dashboards, páginas analíticas e documentação navegável sobre saúde pública municipal.

Este repositório é a camada de apresentação analítica do ecossistema **Raio-X Municipal**. Ele consome dados estruturados em PostgreSQL pelo projeto principal de engenharia de dados e transforma esses dados em páginas úteis para leitura, diagnóstico, auditoria, portfólio e tomada de decisão.

## Objetivo

Criar uma experiência analítica clara para responder perguntas de gestão em saúde municipal, como:

- Minhas equipes de saúde estão produzindo direito?
- Tem unidade com CNES desatualizado?
- Estou perdendo recurso por dado mal informado?
- Minha demanda de urgência está crescendo?
- Tenho gargalo de regulação?
- Quais indicadores preciso priorizar este mês?
- Como comparo meu município com municípios parecidos?

O produto deve ir além de gráficos soltos. Cada página deve ter contexto, fonte, leitura analítica, limitações e utilidade prática para o gestor.

## Relação com o projeto de engenharia

O projeto principal de engenharia de dados fica em:

```txt
/home/moscarde/raio-x-engenharia
```

Ele contém ingestão, Airflow, dbt, models, seeds, snapshots e regras centrais de transformação.

Este repositório deve consumir os dados prontos ou semi-prontos do PostgreSQL e dos models dbt. Não duplicar aqui lógica pesada de transformação.

Antes de criar uma nova página, query ou dashboard, verificar se já existe model, view, tabela ou documentação adequada no projeto principal, especialmente em:

```txt
/home/moscarde/raio-x-engenharia/models/
/home/moscarde/raio-x-engenharia/dbt_project.yml
/home/moscarde/raio-x-engenharia/README.md
/home/moscarde/raio-x-engenharia/ROADMAP.md
```

## Stack

- Evidence.dev para dashboards e documentação analítica.
- PostgreSQL como fonte de dados.
- dbt no projeto principal para modelagem e regras de negócio.
- Markdown + SQL para páginas analíticas.
- Git como fonte da verdade.
- Componentes reutilizáveis apenas quando houver ganho real.

## O que este projeto contém

Este projeto deve conter:

- dashboards;
- páginas analíticas;
- documentação de leitura dos indicadores;
- páginas de qualidade e cobertura dos dados;
- explicações metodológicas para consumo humano;
- pequenos componentes ou utilitários de apresentação, quando fizer sentido.

Este projeto não deve conter:

- collectors;
- jobs de ingestão;
- transformações pesadas;
- regras de negócio centrais duplicadas;
- consultas diretas desnecessárias em tabelas raw;
- dados sensíveis ou individualizados;
- arquivos grandes de dados versionados.

## Princípios de produto

Cada página deve responder uma pergunta analítica clara.

Exemplos:

- Qual é o status das fontes carregadas?
- Quais competências estão disponíveis por fonte?
- Quais municípios possuem cobertura completa?
- Como está a rede assistencial de um município?
- Quais unidades estão ativas no CNES?
- Como a produção ambulatorial evoluiu?
- Onde há possíveis inconsistências cadastrais ou de produção?
- Como um município se compara a municípios semelhantes?

Uma boa página deve conter, quando fizer sentido:

- título claro;
- objetivo;
- contexto da fonte ou indicador;
- métricas principais;
- gráfico simples;
- tabela de apoio;
- observações metodológicas;
- referência de atualização dos dados.

## Camadas de dados

Ordem de preferência para consultas:

1. Schemas específicos para dashboard:
   - `gold_dashboard`
   - `marts_dashboard`
   - `analytics`

2. Camadas finais de negócio:
   - `gold`
   - `marts`

3. Camadas intermediárias, apenas quando necessário.

4. Camadas raw, apenas para auditoria, qualidade, linhagem ou debug.

Evite consultar tabelas raw em dashboards finais.

## Convenções de SQL

Use SQL simples, explícito e legível.

Boas práticas:

- evitar `select *`;
- nomear colunas pensando na leitura final;
- usar aliases claros;
- manter queries pequenas;
- evitar joins pesados no Evidence;
- evitar agregações complexas em tempo de renderização;
- preferir dados já agregados pelo dbt;
- ordenar resultados quando a ordem importar;
- usar `limit` em tabelas exploratórias;
- não duplicar SQL entre páginas.

Se uma query passar de aproximadamente 60 linhas, avaliar se ela deveria virar model ou view no projeto dbt.

Exemplo recomendado:

```sql
select
    competencia,
    fonte,
    total_registros,
    total_municipios,
    atualizado_em
from gold_dashboard.vw_fontes_status
order by competencia desc, fonte
```

Exemplo a evitar:

```sql
select *
from raw_ibge.municipios m
join raw_datasus.alguma_tabela d on ...
join raw_outro_schema.x on ...
```

## Convenções de páginas

Arquivos de página devem usar `kebab-case`.

Exemplos:

```txt
pages/status-fontes.md
pages/cobertura-temporal.md
pages/qualidade-dados.md
pages/perfil-municipal.md
```

Queries dentro das páginas devem usar `snake_case` e nomes descritivos.

Exemplos bons:

```txt
resumo_fontes
serie_competencia
ranking_municipios
cobertura_temporal
qualidade_por_fonte
```

Evitar nomes genéricos:

```txt
query1
dados
teste
grafico
tabela
```

## Estrutura sugerida

```txt
.
├── CLAUDE.md
├── README.md
├── evidence.config.yaml
├── package.json
├── pages/
├── sources/
├── components/
├── src/
├── tests/
└── notes/
    └── backlog.md
```

Use `src/` apenas quando houver código auxiliar real.

Exemplos aceitáveis:

- funções de formatação;
- componentes reutilizáveis;
- helpers de visualização;
- validações locais;
- scripts pequenos de inspeção;
- tipos compartilhados;
- adaptadores finos para bibliotecas externas.

## Componentes visuais

Priorizar visualizações simples:

- `BigValue` para métricas principais;
- `LineChart` para séries temporais;
- `BarChart` para rankings e comparações;
- `DataTable` para apoio e auditoria;
- Markdown para interpretação.

Evitar excesso de gráficos em uma única página.

Uma boa página costuma ter:

- 2 a 5 métricas principais;
- 1 a 3 gráficos;
- 1 tabela de detalhe;
- texto explicativo suficiente para interpretação.

## Segurança e dados sensíveis

Este projeto pode lidar com dados de saúde pública. As regras abaixo são obrigatórias:

- não expor dados pessoais identificáveis;
- não exibir CPF, CNS, endereço, telefone, nome de paciente ou dado individualizado sensível;
- não criar páginas com granularidade individual de paciente;
- preferir dados agregados;
- não versionar secrets;
- não versionar credenciais;
- usar variáveis de ambiente para conexão;
- não colocar strings reais de conexão no README, Markdown ou exemplos públicos;
- não logar dados sensíveis;
- não criar dumps locais versionados.

## Setup local

> Ajustar os comandos conforme a configuração real do projeto.

Instalar dependências:

```bash
npm install
```

Configurar variáveis de ambiente em arquivo local não versionado:

```bash
cp .env.example .env
```

Host, porta e nome do banco ficam em `sources/raio_x_saude/connection.yaml` (não são segredo). Usuário e senha vêm de variáveis de ambiente, seguindo a convenção do Evidence (`EVIDENCE_SOURCE__<source>__<opcao>`):

```bash
EVIDENCE_SOURCE__raio_x_saude__user=usuario_local
EVIDENCE_SOURCE__raio_x_saude__password=senha_local
```

Não versionar `.env`.

Extrair/atualizar o cache local das tabelas usadas nas páginas (necessário após adicionar uma tabela nova ou mudar dado no Postgres):

```bash
npm run sources
```

O Evidence não consulta o Postgres diretamente a cada query de página — ele lê de um cache local (parquet/DuckDB) construído a partir dos arquivos em `sources/raio_x_saude/*.sql` (um arquivo por tabela, `select * from <schema>.<tabela>`). Nas páginas, referencie a tabela pelo nome do arquivo, sem o schema (`raio_x_saude.dim_municipio`, não `marts.dim_municipio`). Toda tabela nova usada em uma página precisa de um `.sql` correspondente aqui + rodar `npm run sources` de novo.

Rodar em desenvolvimento:

```bash
npm run dev
```

Build local:

```bash
npm run build
```

Executar testes, se houver código auxiliar testável:

```bash
npm test
```

## Fluxo recomendado para criar uma página

1. Definir qual pergunta a página responde.
2. Verificar se o dado já existe no banco ou em model dbt.
3. Validar schema, tabela e colunas no PostgreSQL ou no projeto dbt.
4. Criar query pequena no Markdown.
5. Usar componentes nativos do Evidence sempre que possível.
6. Adicionar contexto, leitura e observações metodológicas.
7. Verificar se não há dado sensível.
8. Rodar localmente e validar renderização.
9. Registrar pendências ou melhorias em `notes/backlog.md`.

## Páginas iniciais recomendadas

Primeiras páginas úteis para o produto:

- `status-fontes.md`: situação das fontes carregadas.
- `cobertura-temporal.md`: competências disponíveis por fonte.
- `qualidade-dados.md`: nulos, duplicidades e quebras de chave.
- `perfil-municipal.md`: visão geral de um município.
- `rede-assistencial.md`: estabelecimentos, tipos de unidade e CNES.
- `producao-ambulatorial.md`: série e composição da produção SIA/SUS.
- `internacoes.md`: produção hospitalar e dependência regional.
- `comparacao-municipios.md`: comparação entre municípios semelhantes.
- `metodologia.md`: leitura dos indicadores, fontes e limitações.

## Quando propor mudança no dbt

Propor alteração no projeto principal quando:

- a query do Evidence ficar longa demais;
- a mesma regra for usada em múltiplas páginas;
- houver regra de negócio relevante;
- houver necessidade de teste de dados;
- houver join recorrente;
- houver cálculo de indicador oficial;
- houver problema de performance por falta de pré-agregação;
- houver necessidade de materialização ou índice.

Modelo de recomendação:

```txt
Sugestão: criar a view gold_dashboard.vw_cobertura_temporal_por_fonte no projeto dbt.

Motivo: a lógica é reutilizável, envolve regra de negócio e será usada em múltiplas páginas.
```

## Qualidade de dados

O projeto deve conter páginas específicas para qualidade e cobertura.

Indicadores úteis:

- última atualização por fonte;
- total de registros por fonte;
- total de municípios cobertos;
- competências disponíveis;
- campos críticos nulos;
- duplicidades;
- fontes sem atualização recente;
- quebras de chave esperada.

Sempre que possível, essas métricas devem vir de models ou views do dbt.

## Git

Commits devem ser pequenos e descritivos.

Exemplos:

```txt
feat: adiciona painel de status das fontes
feat: cria página de cobertura temporal
docs: documenta metodologia dos indicadores municipais
fix: corrige ordenação da série de competências
refactor: separa páginas de qualidade por tema
test: adiciona teste para formatador de competência
```

Evitar:

```txt
ajustes
teste
dashboard
mudanças
```

## Backlog

Ideias futuras e tarefas pendentes ficam em:

```txt
notes/backlog.md
```

Não criar arquivos incompletos espalhados pelo projeto.

## Regra final

Este projeto deve parecer um produto de dados bem cuidado.

Não é apenas um conjunto de gráficos.

Cada página deve ajudar alguém a entender os dados, confiar na origem, interpretar os indicadores e tomar decisões.
