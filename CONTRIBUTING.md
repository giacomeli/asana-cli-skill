# Contributing to asana-cli

Contributions are very welcome — bug reports, feature ideas, docs improvements, and pull requests. If you use Asana with Claude Code (or any other agent), your feedback on the workflow is just as valuable as code.

## Getting started

1. Fork the repository and clone your fork:

   ```bash
   git clone https://github.com/<your-username>/asana-cli-skill.git
   cd asana-cli-skill
   npm install
   npm link
   ```

2. Create a branch for your change:

   ```bash
   git checkout -b feat/my-change
   ```

3. Make your changes and test them against a real Asana workspace (a personal sandbox project works well):

   ```bash
   asana-cli init
   asana-cli task <url-of-a-test-task>
   ```

4. Open a pull request with a clear description of what changed and why.

## Guidelines

- **Keep it simple.** No build step, no TypeScript — plain Node.js with native ESM.
- **Minimal dependencies.** Use native `fetch`; do not add axios, node-fetch, or heavy frameworks.
- **Human-readable output.** CLI output is meant to be read by humans and pasted into plans and docs.
- **No emojis** in output, code, or docs.
- **English** for code, output, and documentation.
- **Small, focused PRs.** One change per pull request. For larger changes, open an issue first so we can discuss the approach.

## Reporting bugs

Open an issue at [github.com/giacomeli/asana-cli-skill/issues](https://github.com/giacomeli/asana-cli-skill/issues) including:

- The command you ran and its full output (redact tokens and private task data)
- What you expected to happen
- Your Node.js version (`node -v`)

## Ideas for contribution

Looking for somewhere to start? A few directions already mapped as out of scope for the initial release:

- `--json` output flag for machine consumption
- Creating top-level tasks (currently only subtasks)
- OAuth2 support
- Skills for other agent platforms
