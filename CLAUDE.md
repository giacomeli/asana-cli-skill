# CLAUDE.md

Guidance for Claude Code when working in this repository.

## What this project is

Minimal Node.js CLI that performs CRUD against the Asana API. It was built to be used by the `asana` Claude Code skill (`skills/asana/SKILL.md` in this repo, installed to `~/.claude/skills/asana/`), but works standalone in the terminal.

The CLI is the infrastructure layer — all orchestration logic (read task, generate plan, execute steps) lives in the skill, not here.

## Commands

```bash
node bin/asana-cli.js task <url>                    # Read a task
node bin/asana-cli.js subtasks <url-or-id>          # List subtasks
node bin/asana-cli.js complete <id> -m "msg"        # Complete + comment
node bin/asana-cli.js comment <id> -m "msg"         # Comment
node bin/asana-cli.js create-subtask <id> -n "name" # Create a subtask
node bin/asana-cli.js init                          # Configure token
```

If installed globally (`npm link`), use `asana-cli` instead of `node bin/asana-cli.js`.

## Stack

- Node.js with native ESM (no build step, no TypeScript)
- `commander` for CLI parsing
- `chalk` for colors
- `dotenv` for configuration
- Native `fetch` (Node 18+)

## Structure

```
bin/asana-cli.js              # Entry point, command registration
src/
  client.js                   # AsanaClient — HTTP wrapper over the Asana REST API
  formatter.js                # Human-readable terminal output
  utils.js                    # parseTaskId — extracts IDs from Asana URLs
  commands/
    init.js                   # Interactive token setup
    task.js                   # Command: read a full task
    subtasks.js               # Command: list subtasks
    complete.js               # Command: complete a task + comment
    comment.js                # Command: add a comment
    create-subtask.js         # Command: create a subtask
skills/
  asana/SKILL.md              # Claude Code skill that orchestrates the workflow
```

## Conventions

- **No build step.** Code runs directly with `node`, native ESM.
- **No TypeScript.** Keep it simple — it is a small CLI.
- **Minimal dependencies.** Do not add axios, node-fetch, or heavy frameworks. Use native `fetch`.
- **Human-readable output.** CLI output is meant to be read by humans and pasted into plans/docs.
- **Literal `\n`.** `client.js` converts literal `\n` into real line breaks before sending to the Asana API.
- **No emojis.** Not in output, code, docs, or commits.

## Authentication

The token (Personal Access Token) is loaded from:
1. `.env` in the current directory (takes precedence)
2. `~/.asana-cli/.env` (global fallback)

Variables:
- `ASANA_TOKEN` — required.
- `ASANA_PROGRESS_FIELD` / `ASANA_PROGRESS_VALUE` — optional. When both are set, `complete` sets this enum custom field instead of the completed checkbox (the `--close` flag still checks the task off).

## Asana API

Base URL: `https://app.asana.com/api/1.0`

Endpoints used:
- `GET /tasks/{id}` — read a task
- `GET /tasks/{id}/subtasks` — list subtasks
- `PUT /tasks/{id}` — update a task (complete, custom fields)
- `POST /tasks/{id}/stories` — add a comment
- `POST /tasks/{id}/attachments` — upload an attachment
- `POST /tasks/{id}/subtasks` — create a subtask

Documentation: https://developers.asana.com/reference

## Language

English for error messages, CLI output, and documentation. Commit messages follow Conventional Commits in pt-BR.
