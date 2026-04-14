# asana-cli

CLI minimalista para integração com o Asana. Desenvolvido para ser usado pela skill `asana` do Claude Code, mas funciona independentemente no terminal.

## Instalação

```bash
cd ~/Projects/asana-cli-skill
npm install
npm link
```

Isso disponibiliza o comando `asana-cli` globalmente.

## Configuração

### Opção 1: Comando interativo

```bash
asana-cli init
```

Solicita o Personal Access Token e salva em `~/.asana-cli/.env`.

### Opção 2: Manual

Crie o arquivo `~/.asana-cli/.env`:

```
ASANA_TOKEN=seu-token-aqui
```

O token pode ser gerado em: Asana > Settings > Apps > Developer > Personal Access Tokens.

## Comandos

### `asana-cli task <url-ou-id>`

Lê uma task completa com título, descrição, projeto, assignee e subtasks.

```bash
asana-cli task https://app.asana.com/0/1234/5678
```

Saída:

```
📋 Task: Implementar sistema de notificações
   Status: Em andamento
   Projeto: Sprint 42
   Assignee: Juliano
   ID: 5678

   Descrição:
   Criar sistema de notificações push...

   Subtasks (2):
   [ ] Criar schema (id: 9012)
   [✓] Definir endpoints (id: 9013)
```

### `asana-cli subtasks <url-ou-id>`

Lista apenas as subtasks de uma task.

```bash
asana-cli subtasks 5678
```

### `asana-cli complete <task-id> -m "mensagem"`

Adiciona um comentário na task e marca como concluída.

```bash
asana-cli complete 9012 -m "✅ Concluído\n\nSchema criado com validação Zod\n\nCommit: abc1234\nBranch: feature/notificacoes"
```

Quebras de linha (`\n`) são convertidas automaticamente.

### `asana-cli comment <task-id> -m "mensagem"`

Adiciona um comentário sem alterar o status.

```bash
asana-cli comment 5678 -m "🎯 Task concluída\n\nResumo dos commits..."
```

### `asana-cli create-subtask <parent-id> -n "nome"`

Cria uma nova subtask em uma task.

```bash
asana-cli create-subtask 5678 -n "Implementar componente de toast"
```

## Formatos de URL aceitos

O CLI aceita qualquer um destes formatos:

- `https://app.asana.com/0/<project-id>/<task-id>`
- `https://app.asana.com/0/<project-id>/<task-id>/f`
- `https://app.asana.com/1/<workspace-id>/project/<project-id>/task/<task-id>`
- ID numérico direto (ex: `1234567890`)

## Estrutura do projeto

```
asana-cli-skill/
├── bin/
│   └── asana-cli.js          # Entry point
├── src/
│   ├── client.js             # Client HTTP para API do Asana
│   ├── formatter.js          # Formatação human-readable
│   ├── utils.js              # Parse de URL, helpers
│   └── commands/
│       ├── init.js            # Configuração do token
│       ├── task.js            # Ler task
│       ├── subtasks.js        # Listar subtasks
│       ├── complete.js        # Completar + comentar
│       ├── comment.js         # Comentar
│       └── create-subtask.js  # Criar subtask
├── package.json
└── .gitignore
```

## Stack

- Node.js (ESM nativo, sem build step)
- `commander` para parsing de argumentos
- `chalk` para cores no terminal
- `dotenv` para configuração
- `fetch` nativo (Node 18+)
