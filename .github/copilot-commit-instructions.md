# Instruções Para Mensagens De Commit

Use estas instruções ao gerar mensagens de commit para este repositório.

## Padrão

As mensagens devem seguir Conventional Commits com emoji:

```text
<emoji> <type>(<scope opcional>): <descrição em português>
```

O `type` deve permanecer em inglês, usando as tags originais do padrão. A descrição e o corpo do commit devem ser escritos em português.

## Types E Emojis

Use sempre o emoji correspondente ao `type`:

- `✨ feat`: nova funcionalidade
- `🐛 fix`: correção de bug
- `📝 docs`: documentação
- `💄 style`: formatação sem mudança de comportamento
- `♻️ refactor`: refatoração sem nova funcionalidade ou correção
- `⚡ perf`: melhoria de desempenho
- `✅ test`: testes
- `📦 build`: build, dependências ou empacotamento
- `👷 ci`: integração contínua
- `🔧 chore`: tarefas de manutenção
- `⏪ revert`: reversão de commit anterior

## Escopo

Use `scope` quando ele ajudar a localizar a mudança. Prefira nomes curtos e pesquisáveis, alinhados à arquitetura do projeto.

Escopos comuns neste repositório:

- `airflow`
- `dbt`
- `ibge`
- `cnes`
- `sia`
- `sih`
- `sisab`
- `fns`
- `siops`
- `sim`
- `sinasc`
- `tests`
- `docs`

Se a mudança for transversal ou pequena, omita o escopo.

## Estilo

- Escreva a descrição no imperativo ou presente simples em português.
- Comece a descrição com letra minúscula, exceto nomes próprios.
- Não finalize a primeira linha com ponto.
- Mantenha a primeira linha curta e objetiva, idealmente até 72 caracteres.
- Use corpo quando for necessário explicar contexto, decisão técnica ou impacto.

## Exemplos

```text
✨ feat(airflow): adiciona DAG para ingestão do IBGE
```

```text
🐛 fix(cnes): evita duplicidade na carga raw

Remove os registros do período antes da nova carga para manter a ingestão
idempotente no PostgreSQL local.
```

```text
📝 docs: atualiza instruções de execução local
```
