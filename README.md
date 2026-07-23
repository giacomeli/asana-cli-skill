<p align="center">
  <img src="https://raw.githubusercontent.com/giacomeli/asana-cli-skill/main/promo-assets/asana-cli-skill-readme-hero-1280x640.png" alt="asana-cli banner: Asana task management from your terminal, a minimal Node.js CLI that powers the asana skill for Claude Code" width="100%">
</p>

# asana-cli — Asana task management from your terminal

**Minimal CLI for Asana task management. Built to power the `asana` skill for [Claude Code](https://claude.com/claude-code), but works standalone in any terminal.**

[![npm version](https://img.shields.io/npm/v/asana-cli-skill)](https://www.npmjs.com/package/asana-cli-skill)
[![node](https://img.shields.io/node/v/asana-cli-skill)](https://nodejs.org)
[![license: MIT](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

`asana-cli` is a Node.js command-line tool for the [Asana API](https://developers.asana.com/reference): read tasks, list and create subtasks, add comments with attachments, and complete work — all from the terminal. It is the infrastructure layer behind the `asana` Claude Code skill, which lets an AI coding agent pick up an Asana task, build an implementation plan from its subtasks, and report progress back as the work advances.

The CLI is a thin infrastructure layer over the Asana REST API. All orchestration logic (reading a task, generating a plan, executing steps, reporting progress) lives in the skill — see [The Claude Code skill](#the-claude-code-skill).

## Installation

Install from [npm](https://www.npmjs.com/package/asana-cli-skill):

```bash
npm install -g asana-cli-skill
```

This makes the `asana-cli` command available globally.

Or run it without installing — useful in scripts, CI, and AI agent environments:

```bash
npx asana-cli-skill task <url-or-id>
```

Or from source:

```bash
git clone https://github.com/giacomeli/asana-cli-skill.git
cd asana-cli-skill
npm install
npm link
```

Requires Node.js 18+ (native `fetch`).

## Configuration

### Option 1: Interactive command

```bash
asana-cli init
```

Prompts for your Personal Access Token and saves it to `~/.asana-cli/.env`.

### Option 2: Manual

Create `~/.asana-cli/.env` (or a `.env` in your working directory):

```
ASANA_TOKEN=your-token-here
```

You can generate a token at: Asana > Settings > Apps > Developer > Personal Access Tokens.

### Optional: progress custom field

By default, `asana-cli complete` marks the task as completed (the Asana checkbox). If your workspace tracks progress with an enum custom field instead (common on board-style projects), configure it:

```
ASANA_PROGRESS_FIELD=Task Progress
ASANA_PROGRESS_VALUE=Done
```

With these set, `complete` sets the custom field to that value instead of checking the task off. Use `--close` to also check it off.

## Commands

### `asana-cli task <url-or-id>`

Reads a full task: title, description, project, assignee, and subtasks.

```bash
asana-cli task https://app.asana.com/0/1234/5678
```

Output:

```
Task: Implement notification system
   Status: In progress
   Project: Sprint 42
   Assignee: Juliano
   ID: 5678

   Description:
   Build a push notification system...

   Subtasks (2):
   [ ] Create schema (id: 9012)
   [x] Define endpoints (id: 9013)
```

### `asana-cli subtasks <url-or-id>`

Lists only the subtasks of a task.

```bash
asana-cli subtasks 5678
```

### `asana-cli complete <task-id> -m "message"`

Adds a comment and marks the task as done (completed checkbox, or the configured progress custom field).

```bash
asana-cli complete 9012 -m "Done\n\nSchema created with Zod validation\n\nCommit: abc1234\nBranch: feature/notifications"
```

Literal `\n` sequences are converted to real line breaks automatically.

Flags:

- `--close` — also mark the task as completed (checkbox) and complete any pending subtasks. Useful when a progress custom field is configured and you want both.

### `asana-cli comment <task-id> -m "message"`

Adds a comment without changing the task status.

```bash
asana-cli comment 5678 -m "Task completed\n\nCommit summary..."
```

Attach files (repeatable, images are embedded inline):

```bash
asana-cli comment 5678 -m "Screenshots attached" -a screenshot1.png -a screenshot2.png
```

### `asana-cli create-subtask <parent-id> -n "name"`

Creates a new subtask under a task.

```bash
asana-cli create-subtask 5678 -n "Implement toast component"
```

## Accepted URL formats

The CLI accepts any of these:

- `https://app.asana.com/0/<project-id>/<task-id>`
- `https://app.asana.com/0/<project-id>/<task-id>/f`
- `https://app.asana.com/1/<workspace-id>/project/<project-id>/task/<task-id>`
- Plain numeric ID (e.g. `1234567890`)

## The Claude Code skill

The `skills/asana/` directory contains a Claude Code skill that orchestrates a full development workflow on top of this CLI: it reads an Asana task, builds an implementation plan from its subtasks (creating them if missing), executes step by step, and updates Asana with comments, commit hashes, and status as the work progresses.

To install it, copy (or symlink) the skill into your Claude Code skills directory.

From a cloned repo:

```bash
cp -r skills/asana ~/.claude/skills/asana
```

From the npm global install (the package ships the skill):

```bash
cp -r "$(npm root -g)/asana-cli-skill/skills/asana" ~/.claude/skills/asana
```

Then share any Asana task link in a Claude Code conversation, or use `/asana`.

### Other AI coding agents

The CLI itself is agent-agnostic: any coding agent (Codex, Cursor, Copilot, Gemini CLI, opencode) that can run shell commands can use it to read Asana tasks and report progress — `npx asana-cli-skill task <url>` works with zero setup beyond the token. The repository ships [llms.txt](llms.txt) with an LLM-friendly overview and [AGENTS.md](AGENTS.md) with conventions for agents working on the codebase. Ports of the skill to other agent platforms are a welcome [contribution](CONTRIBUTING.md).

## Project structure

```
asana-cli-skill/
├── bin/
│   └── asana-cli.js          # Entry point, command registration
├── src/
│   ├── client.js             # HTTP client for the Asana API
│   ├── formatter.js          # Human-readable terminal output
│   ├── utils.js              # URL parsing, helpers
│   └── commands/
│       ├── init.js            # Token setup
│       ├── task.js            # Read a task
│       ├── subtasks.js        # List subtasks
│       ├── complete.js        # Complete + comment
│       ├── comment.js         # Comment
│       └── create-subtask.js  # Create a subtask
├── skills/
│   └── asana/
│       └── SKILL.md          # Claude Code skill
├── package.json
└── .gitignore
```

## Stack

- Node.js (native ESM, no build step)
- `commander` for argument parsing
- `chalk` for terminal colors
- `dotenv` for configuration
- Native `fetch` (Node 18+)

## Contributing

Contributions are very welcome — bug reports, feature ideas, docs improvements, and pull requests. See [CONTRIBUTING.md](CONTRIBUTING.md) for the guidelines, project conventions, and ideas for a first contribution. Questions and workflow feedback are welcome in [Discussions](https://github.com/giacomeli/asana-cli-skill/discussions).

## License

[MIT](LICENSE)
