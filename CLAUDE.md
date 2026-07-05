# CLAUDE.md

Este projeto é um produto de dados construído com Evidence.dev.

O objetivo é criar dashboards, páginas analíticas e documentação navegável a partir do PostgreSQL alimentado pelo projeto principal de engenharia de dados.

O projeto principal fica em:

```txt
/home/moscarde/raio-x-engenharia
```

Ele contém ingestão, Airflow, dbt, models, seeds, snapshots e demais regras de transformação dos dados.

Este repositório deve ser tratado como uma camada de apresentação analítica. Não duplicar aqui lógica pesada de transformação que deveria viver no dbt.

## Stack

* Evidence.dev para dashboards e documentação analítica.
* PostgreSQL como fonte de dados.
* dbt no projeto principal para modelagem e regras de negócio.
* Markdown + SQL para construção das páginas.
* Componentes reutilizáveis quando necessário.
* Git como fonte da verdade.

## Papel deste projeto

Este projeto deve conter:

* dashboards;
* páginas analíticas;
* documentação de leitura dos indicadores;
* páginas de qualidade e cobertura dos dados;
* explicações metodológicas para consumo humano;
* pequenos componentes ou utilitários de apresentação, quando fizer sentido.

Este projeto não deve conter:

* collectors;
* jobs de ingestão;
* transformações pesadas;
* regras de negócio centrais duplicadas;
* consultas diretas desnecessárias em tabelas raw;
* dados sensíveis ou individualizados;
* arquivos grandes de dados versionados.

## Contextualização dos dados

Para entender os dados disponíveis, é permitido consultar:

1. O banco PostgreSQL usado pelo projeto.
2. Os models dbt do projeto principal em:

```txt
/home/moscarde/raio-x-engenharia
```

Antes de criar uma nova página, query ou dashboard, verificar se já existe model, view, tabela ou documentação dbt adequada no projeto principal.

Quando necessário, consultar arquivos como:

```txt
/home/moscarde/raio-x-engenharia/models/
/home/moscarde/raio-x-engenharia/dbt_project.yml
/home/moscarde/raio-x-engenharia/README.md
/home/moscarde/raio-x-engenharia/ROADMAP.md
```

Não inventar schemas, tabelas ou colunas. Sempre validar pelo banco ou pelos models dbt quando houver dúvida.

## Princípios gerais

* Priorize simplicidade, clareza e manutenção.
* Cada página deve responder uma pergunta analítica clara.
* Escreva páginas como produtos de dados: contexto, indicador, leitura, gráfico e observações.
* Prefira consultar views, tabelas ou marts já prontos pelo dbt.
* Evite lógica complexa dentro dos arquivos Markdown.
* Não crie dashboards soltos sem explicação.
* Não duplique SQL entre páginas.
* Se uma lógica for reutilizável, propor criação de model/view no dbt.
* O projeto deve ser apresentável como portfólio.
* Código auxiliar deve ser pequeno, testável e previsível.

## Camadas de dados

Ordem de preferência para consultas:

1. Schemas específicos para dashboard, como:

   * `gold_dashboard`
   * `marts_dashboard`
   * `analytics`

2. Camadas finais de negócio, como:

   * `gold`
   * `marts`

3. Camadas intermediárias, apenas quando necessário.

4. Camadas raw, apenas para auditoria, qualidade, linhagem ou debug.

Evite consultar tabelas raw em dashboards finais.

## Convenções de SQL

* Use SQL explícito.
* Evite `select *`.
* Nomeie colunas pensando na leitura final.
* Use aliases claros.
* Mantenha queries pequenas.
* Evite joins pesados no Evidence.
* Evite agregações complexas em tempo de renderização.
* Prefira dados já agregados pelo dbt.
* Sempre ordene resultados quando a ordem importar.
* Use `limit` em tabelas exploratórias.
* Não duplique SQL entre páginas.

Se uma query passar de aproximadamente 60 linhas, avaliar se ela deveria virar model/view no dbt.

Exemplo bom:

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

Exemplo ruim:

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
cobertura-temporal.md
qualidade-dados.md
perfil-municipal.md
status-fontes.md
```

Cada página analítica deve ter, quando fizer sentido:

* título claro;
* descrição do objetivo;
* contexto do indicador ou fonte;
* métricas principais;
* gráficos;
* tabela de apoio;
* observações metodológicas;
* referência de atualização dos dados.

Modelo recomendado:

````md
# Status das fontes

Esta página mostra a situação das fontes carregadas no banco analítico.

```sql resumo_fontes
select
    fonte,
    total_registros,
    ultima_atualizacao
from gold_dashboard.vw_fontes_status
order by fonte
````

<DataTable data={resumo_fontes} />

## Observações

Descrever limitações, atrasos de carga ou pontos de atenção.

````

## Nomeação de queries

Queries dentro das páginas devem usar `snake_case` e nomes descritivos.

Bom:

```txt
resumo_fontes
serie_competencia
ranking_municipios
cobertura_temporal
qualidade_por_fonte
````

Ruim:

```txt
query1
dados
teste
grafico
tabela
```

## Componentes visuais

Priorize visualizações simples:

* `BigValue` para métricas principais.
* `LineChart` para séries temporais.
* `BarChart` para rankings e comparações.
* `DataTable` para apoio e auditoria.
* Markdown para interpretação.

Evite excesso de gráficos em uma única página.

Uma boa página costuma ter:

* 2 a 5 métricas principais;
* 1 a 3 gráficos;
* 1 tabela de detalhe;
* texto explicativo suficiente para interpretação.

## Estrutura de código

Siga as convenções do framework e do Evidence.dev.

Preferir uma estrutura previsível:

```txt
pages/
sources/
components/
src/
tests/
notes/
```

Use `src/` apenas quando houver código auxiliar real.

Exemplos de código auxiliar aceitável:

* funções de formatação;
* componentes reutilizáveis;
* helpers de visualização;
* validações locais;
* scripts pequenos de inspeção;
* tipos compartilhados;
* adaptadores finos para bibliotecas externas.

Evite criar código auxiliar sem necessidade. Se Markdown + SQL resolver bem, não criar abstração extra.

## Estilo de código

Para qualquer código TypeScript, JavaScript ou Python criado neste projeto:

* Funções devem ter entre 4 e 20 linhas sempre que possível.
* Se passar disso, dividir por responsabilidade.
* Arquivos devem ter menos de 500 linhas.
* Cada função deve fazer uma coisa.
* Cada módulo deve ter uma responsabilidade clara.
* Evite arquivos “god file”.
* Use nomes específicos e únicos.
* Evite nomes genéricos como `data`, `handler`, `manager`, `utils`, `helper`.
* Prefira nomes que retornem poucos resultados no grep do projeto.
* Use tipos explícitos.
* Não use `any` sem justificativa muito forte.
* Não use funções sem tipo em TypeScript.
* Não duplique código.
* Extraia lógica repetida para função, componente ou módulo.
* Prefira early return em vez de muitos `if` aninhados.
* Máximo de 2 níveis de indentação.
* Mensagens de erro devem incluir o valor problemático e o formato esperado.

Exemplo ruim:

```ts
function handle(data: any) {
  if (data) {
    if (data.value) {
      return data.value
    }
  }

  return null
}
```

Exemplo melhor:

```ts
type FonteStatus = {
  fonte: string
  totalRegistros: number
}

function getTotalRegistrosFonte(fonteStatus: FonteStatus): number {
  if (!fonteStatus.fonte) {
    throw new Error(`Fonte inválida: "${fonteStatus.fonte}". Esperado nome não vazio.`)
  }

  return fonteStatus.totalRegistros
}
```

## Componentes reutilizáveis

Criar componentes apenas quando houver reutilização clara ou ganho real de legibilidade.

Bom motivo para criar componente:

* card de métrica usado em várias páginas;
* bloco padrão de metodologia;
* alerta padrão de qualidade;
* componente visual repetido;
* layout comum de página de fonte.

Mau motivo:

* encapsular algo usado uma única vez;
* esconder SQL;
* criar abstração antes de existir repetição;
* replicar componente nativo do Evidence sem necessidade.

Componentes devem:

* ter nome claro;
* receber props explícitas;
* não acessar banco diretamente;
* não conter regra de negócio pesada;
* não misturar renderização com transformação complexa.

## Comentários

* Preserve comentários existentes em refactors.
* Comentários devem explicar o porquê, não o óbvio.
* Evite comentários que apenas repetem o código.
* Docstrings devem existir em funções públicas.
* Docstrings devem conter intenção e um exemplo curto de uso.
* Se uma linha existir por bug, limitação upstream ou decisão histórica, referenciar issue, commit ou contexto.

Exemplo ruim:

```ts
// soma 1 ao contador
counter += 1
```

Exemplo bom:

```ts
// O Evidence renderiza este componente antes da hidratação completa;
// manter fallback evita quebra visual em páginas estáticas.
const safeValue = value ?? 0
```

## Testes

Quando houver código auxiliar, ele deve ser testável.

Regras:

* Testes devem rodar com um único comando definido no README.
* Toda nova função relevante deve ter teste.
* Correção de bug deve incluir teste de regressão.
* Mock de I/O externo deve usar fake nomeado, não stub inline confuso.
* Não bater em banco real em teste unitário.
* Não depender de filesystem real quando for possível injetar fake.
* Testes devem ser F.I.R.S.T:

  * Fast;
  * Independent;
  * Repeatable;
  * Self-validating;
  * Timely.

Para páginas Evidence, validar pelo menos:

* renderização local;
* queries principais;
* ausência de dados sensíveis;
* consistência dos nomes de queries;
* links internos quebrados, quando houver verificação disponível.

## Dependências

* Evite dependências novas sem necessidade clara.
* Antes de adicionar pacote, justificar o motivo.
* Preferir recursos nativos do Evidence e da stack atual.
* Injetar dependências por parâmetro ou construtor, não por global escondido.
* Bibliotecas externas devem ser encapsuladas atrás de uma interface fina do projeto quando usadas em código relevante.
* Não espalhar chamadas diretas a bibliotecas externas por vários arquivos.

Exemplo:

```txt
src/lib/date-format.ts
src/lib/number-format.ts
src/lib/evidence-components.ts
```

Melhor ter uma interface pequena do projeto do que acoplar várias páginas ou componentes diretamente a detalhes de biblioteca.

## Formatação

Use o formatador padrão da linguagem/ferramenta.

* TypeScript/JavaScript: `prettier`.
* Python: `black`.
* SQL: manter indentação consistente e legível.
* Markdown: manter títulos, blocos SQL e componentes organizados.

Não discutir estilo manualmente quando o formatador resolver.

## Logging

Este projeto deve ter pouco logging.

Quando houver scripts ou código auxiliar:

* logs técnicos devem ser estruturados em JSON;
* mensagens de CLI para usuário podem ser texto simples;
* não logar secrets;
* não logar strings de conexão;
* não logar amostras sensíveis de dados;
* logs de erro devem indicar contexto suficiente para debug.

Exemplo de log técnico:

```json
{
  "event": "query_validation_failed",
  "page": "pages/qualidade/status-fontes.md",
  "query_name": "resumo_fontes",
  "error": "column fonte not found"
}
```

## Performance

Evidence deve consumir dados prontos para apresentação.

Regras:

* Não carregar milhões de linhas em uma página.
* Não usar Evidence como exploração bruta de dados.
* Pré-agregar dados no dbt.
* Usar filtros de tempo e escopo quando necessário.
* Evitar tabelas enormes renderizadas no navegador.
* Usar views específicas para dashboard quando fizer sentido.
* Verificar índices no PostgreSQL se uma consulta importante estiver lenta.

Se uma página estiver lenta, investigar nesta ordem:

1. Query SQL.
2. Falta de pré-agregação no dbt.
3. Falta de índice no PostgreSQL.
4. Excesso de dados renderizados.
5. Granularidade inadequada para o gráfico/tabela.

## Documentação analítica

Toda página de indicador deve deixar claro:

* o que o indicador mede;
* fonte original;
* granularidade;
* período de referência;
* regra de cálculo;
* filtros aplicados;
* limitações;
* data ou competência de atualização.

A documentação deve ser objetiva e compreensível para público técnico e gestor.

## Qualidade de dados

O projeto deve conter páginas para monitorar qualidade e cobertura.

Indicadores úteis:

* última atualização por fonte;
* total de registros por fonte;
* total de municípios cobertos;
* competências disponíveis;
* campos críticos nulos;
* duplicidades;
* fontes sem atualização recente;
* quebras de chave esperada.

Sempre que possível, essas métricas devem vir de models/views do dbt.

## Segurança e dados sensíveis

Este projeto pode lidar com dados de saúde pública.

Regras obrigatórias:

* Não expor dados pessoais identificáveis.
* Não exibir CPF, CNS, endereço, telefone, nome de paciente ou dados individualizados sensíveis.
* Não criar páginas com granularidade individual de paciente.
* Preferir dados agregados.
* Não versionar secrets.
* Não versionar credenciais.
* Usar variáveis de ambiente para conexão.
* Não colocar strings reais de conexão em Markdown, README ou exemplos públicos.
* Não logar dados sensíveis.
* Não criar dumps locais versionados.

## Uso com IA

Ao modificar o projeto:

* Ler este arquivo antes de alterar.
* Preservar a estrutura existente.
* Fazer mudanças pequenas e revisáveis.
* Não inventar schemas, tabelas ou colunas.
* Consultar banco ou dbt quando houver dúvida.
* Não criar múltiplos padrões para a mesma coisa.
* Não reescrever grandes partes sem necessidade.
* Explicar decisões estruturais relevantes.
* Não adicionar dependências sem justificar.
* Não criar abstrações antes de existir necessidade real.

Antes de implementar uma nova página, verificar:

1. Qual pergunta a página responde.
2. Qual fonte/model será usado.
3. Se já existe página parecida.
4. Se a lógica pertence ao Evidence ou ao dbt.
5. Se há risco de expor dado sensível.
6. Se a query é simples o suficiente para ficar no Markdown.
7. Se há componente nativo do Evidence que já resolve o caso.
8. Se qualquer código auxiliar criado é pequeno e testável.

## Quando propor mudança no dbt

Propor alteração no projeto principal quando:

* a query do Evidence ficar longa demais;
* a mesma regra for usada em múltiplas páginas;
* houver regra de negócio relevante;
* houver necessidade de teste de dados;
* houver join recorrente;
* houver cálculo de indicador oficial;
* houver problema de performance por falta de pré-agregação;
* houver necessidade de materialização ou índice.

Exemplo de recomendação:

```txt
Sugestão: criar a view gold_dashboard.vw_cobertura_temporal_por_fonte no projeto dbt.

Motivo: a lógica é reutilizável, envolve regra de negócio e será usada em múltiplas páginas.
```

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

Evite:

```txt
ajustes
teste
dashboard
mudanças
```

## Backlog

Ideias futuras e tarefas pendentes devem ficar em:

```txt
notes/backlog.md
```

Não criar arquivos incompletos espalhados pelo projeto.

## Regra final

Este projeto deve parecer um produto de dados bem cuidado.

Não é apenas um conjunto de gráficos.

Cada página deve ajudar alguém a entender os dados, confiar na origem, interpretar os indicadores e tomar decisões.

Código auxiliar só deve existir quando melhorar clareza, reutilização ou qualidade do produto.
