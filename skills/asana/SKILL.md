---
name: asana
description: >
  Asana integration for task management during development.
  Use this skill whenever the user shares an Asana link (app.asana.com),
  mentions "asana", "asana task", "pick up this task", or uses /asana.
  The skill reads the task, creates an implementation plan based on its
  subtasks, and updates Asana automatically as the work progresses
  (comments + status). It MUST be used whenever an Asana link appears in
  the conversation or the user mentions anything related to Asana tasks.
---

# Skill: Asana Task Integration

Orchestrates the development workflow from an Asana task: reads the task, generates a plan, executes it, and updates Asana with progress and commits.

## Prerequisite

The `asana-cli` command must be installed globally.
If `asana-cli` is not found, instruct the user:
```
git clone https://github.com/giacomeli/asana-cli-skill.git
cd asana-cli-skill && npm install && npm link
asana-cli init
```

## Full Workflow

### 1. Read the Task

When you receive a link or a mention of an Asana task:

```bash
asana-cli task <url>
```

This returns the title, description, project, assignee, and subtasks. Use this information as context for the plan.

### 2. Analyze and Plan

Based on the task you read:

- **If the task already has subtasks:** use them as the plan steps. Each subtask becomes a step.
- **If the task has no subtasks:** analyze the title and description to derive steps. Create the corresponding subtasks in Asana:
  ```bash
  asana-cli create-subtask <task-id> --name "Step name"
  ```
- **If extra steps are needed** beyond the existing subtasks: create them in Asana as well.

Generate the plan in the project's standard format (if a `spec-plan` or `writing-plans` skill is available, use it). The plan must include an Asana tracking section:

```markdown
## Asana Tracking

Task: [Task Name](asana-url)

| Step | Subtask | Asana ID | Status | Commit |
|------|---------|----------|--------|--------|
| 1 | Step name | 1234567890 | Pending | - |
| 2 | Step name | 1234567891 | Pending | - |
```

Save the plan in `specs/plans/` (or the project's standard location).

### 3. Execute the Plan

Execute the plan step by step. When each step is finished:

#### a. Commit

Commit normally, following the project's conventions.

#### b. Capture the commit hash

```bash
git log -1 --format="%h"
```

#### c. Capture the current branch

```bash
git branch --show-current
```

#### d. Update Asana

Mark the subtask as done with a descriptive comment:

```bash
asana-cli complete <subtask-id> --message "Done

<short description of what was implemented>

Commit: <hash>
Branch: <branch>"
```

#### e. Update the plan

Update the tracking table in the plan with the status and commit:

```markdown
| 1 | Step name | 1234567890 | Done | abc1234 |
```

Also include the output of `asana-cli complete` in the plan for documentation.

### 4. Finish

Once all steps are done:

#### a. Comment on the parent task

```bash
asana-cli comment <task-id> --message "Task completed

Summary:
- Step 1: <name> -> commit <hash>
- Step 2: <name> -> commit <hash>
- Step 3: <name> -> commit <hash>

Branch: <branch>
Total commits: <N>"
```

#### b. Do NOT mark the parent task as complete

The parent task must be closed manually by the user or tech lead. Only subtasks are completed automatically.

## Available Commands

Quick reference for `asana-cli`:

| Command | Purpose |
|---------|---------|
| `asana-cli task <url>` | Read a task with its subtasks |
| `asana-cli subtasks <url-or-id>` | List subtasks only |
| `asana-cli complete <id> -m "msg"` | Comment + mark as done |
| `asana-cli comment <id> -m "msg"` | Comment only |
| `asana-cli comment <id> -m "msg" -a <path>` | Comment with attachment (image, file) |
| `asana-cli create-subtask <parent-id> -n "name"` | Create a subtask |

## Important Rules

1. **Always read the task before acting.** Never assume its content — run `asana-cli task`.
2. **Never skip the Asana update.** After each completed step, Asana MUST be updated.
3. **Never mark the parent task as complete.** Only subtasks are completed automatically.
4. **CLI output goes into the plan.** The output of each `asana-cli complete` must be recorded in the plan.
5. **IDs are required.** Always use the numeric Asana ID with `complete`, `comment`, and `create-subtask`. The ID is shown in the output of `asana-cli task`.
