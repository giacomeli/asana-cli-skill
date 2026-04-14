# CLAUDE.md

Orientações para o Claude Code ao trabalhar neste repositório.

## O que é este projeto

CLI Node.js minimalista que faz CRUD na API do Asana. Foi criado para ser usado pela skill `asana` do Claude Code (`~/.claude/skills/asana/SKILL.md`), mas funciona independentemente no terminal.

O CLI é a camada de infraestrutura — toda lógica de orquestração (ler task, gerar plano, executar steps) vive na skill, não aqui.

## Comandos

```bash
node bin/asana-cli.js task <url>                    # Ler task
node bin/asana-cli.js subtasks <url-ou-id>          # Listar subtasks
node bin/asana-cli.js complete <id> -m "msg"        # Completar + comentar
node bin/asana-cli.js comment <id> -m "msg"         # Comentar
node bin/asana-cli.js create-subtask <id> -n "nome" # Criar subtask
node bin/asana-cli.js init                          # Configurar token
```

Se instalado globalmente (`npm link`), usar `asana-cli` ao invés de `node bin/asana-cli.js`.

## Stack

- Node.js com ESM nativo (sem build step, sem TypeScript)
- `commander` para parsing de CLI
- `chalk` para cores
- `dotenv` para configuração
- `fetch` nativo (Node 18+)

## Estrutura

```
bin/asana-cli.js              # Entry point, registro de comandos
src/
  client.js                   # AsanaClient — wrapper HTTP sobre a API REST do Asana
  formatter.js                # Formatação human-readable para terminal
  utils.js                    # parseTaskId — extrai ID de URLs do Asana
  commands/
    init.js                   # Configuração interativa do token
    task.js                   # Comando: ler task completa
    subtasks.js               # Comando: listar subtasks
    complete.js               # Comando: completar task + comentário
    comment.js                # Comando: adicionar comentário
    create-subtask.js         # Comando: criar subtask
```

## Convenções

- **Sem build step.** Código roda direto com `node`, ESM nativo.
- **Sem TypeScript.** Manter simples — é um CLI pequeno.
- **Dependências mínimas.** Não adicionar axios, node-fetch ou frameworks pesados. Usar `fetch` nativo.
- **Saída human-readable.** O output do CLI é feito para ser lido por humanos e colado em planos/docs.
- **`\n` literal.** O `client.js` converte `\n` literal em quebras de linha reais antes de enviar pra API do Asana.

## Autenticação

O token (Personal Access Token) é carregado de:
1. `.env` no diretório atual (prioridade)
2. `~/.asana-cli/.env` (fallback global)

Variável: `ASANA_TOKEN`

## API do Asana

Base URL: `https://app.asana.com/api/1.0`

Endpoints usados:
- `GET /tasks/{id}` — ler task
- `GET /tasks/{id}/subtasks` — listar subtasks
- `PUT /tasks/{id}` — atualizar task (completar)
- `POST /tasks/{id}/stories` — adicionar comentário
- `POST /tasks/{id}/subtasks` — criar subtask

Documentação: https://developers.asana.com/reference

## Idioma

Português (pt-BR) para mensagens de erro, output e commits.
