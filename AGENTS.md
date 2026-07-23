# Agent instructions

Instructions for AI coding agents working in this repository. Claude Code reads the equivalent [CLAUDE.md](CLAUDE.md); this file serves every other agent.

## What this project is

Minimal Node.js CLI that performs CRUD against the Asana API, plus a Claude Code skill (`skills/asana/SKILL.md`) that orchestrates a development workflow on top of it. The CLI is the infrastructure layer; orchestration logic lives in the skill.

## Running

```bash
npm install
node bin/asana-cli.js task <url>        # or `asana-cli` after `npm link`
```

Authentication: `ASANA_TOKEN` from `.env` in the working directory or `~/.asana-cli/.env` (run `node bin/asana-cli.js init` to configure). There is no test suite; verify changes against a real Asana sandbox task.

## Conventions

- No build step, no TypeScript. Plain Node.js with native ESM, run directly with `node`.
- Minimal dependencies: `commander`, `chalk`, `dotenv`. Use native `fetch` (Node 18+); never add axios or node-fetch.
- CLI output is human-readable plain text meant to be pasted into plans and docs.
- `src/client.js` converts literal `\n` into real line breaks before sending to the Asana API.
- No emojis anywhere: output, code, docs, commits.
- English for code, output, errors, and documentation.

## Structure

- `bin/asana-cli.js` — entry point and command registration
- `src/client.js` — AsanaClient, HTTP wrapper over the Asana REST API
- `src/formatter.js` — terminal output formatting
- `src/utils.js` — `parseTaskId`, extracts IDs from Asana URLs
- `src/commands/` — one file per command (task, subtasks, complete, comment, create-subtask, init)
- `skills/asana/SKILL.md` — the Claude Code skill
