#!/usr/bin/env node

import { config } from 'dotenv';
import { join } from 'path';
import { homedir } from 'os';
import { existsSync } from 'fs';
import { Command } from 'commander';
import { AsanaClient } from '../src/client.js';
import { initCommand } from '../src/commands/init.js';
import { taskCommand } from '../src/commands/task.js';
import { subtasksCommand } from '../src/commands/subtasks.js';
import { completeCommand } from '../src/commands/complete.js';
import { commentCommand } from '../src/commands/comment.js';
import { createSubtaskCommand } from '../src/commands/create-subtask.js';
import { formatError } from '../src/formatter.js';

// Load .env from the current directory first, then from ~/.asana-cli/
config({ path: join(process.cwd(), '.env') });

const globalEnv = join(homedir(), '.asana-cli', '.env');
if (existsSync(globalEnv)) {
    config({ path: globalEnv });
}

function getClient() {
    return new AsanaClient(process.env.ASANA_TOKEN);
}

function collectMultiple(value, prev) {
    return prev.concat([value]);
}

const program = new Command();

program
    .name('asana-cli')
    .description('Minimal CLI for Asana task management')
    .version('1.0.0');

program
    .command('init')
    .description('Configure your Asana Personal Access Token')
    .action(initCommand);

program
    .command('task')
    .description('Read a full task with its subtasks')
    .argument('<url-or-id>', 'Asana URL or task ID')
    .action(async (urlOrId) => {
        await taskCommand(urlOrId, getClient());
    });

program
    .command('subtasks')
    .description('List the subtasks of a task')
    .argument('<url-or-id>', 'Asana URL or task ID')
    .action(async (urlOrId) => {
        await subtasksCommand(urlOrId, getClient());
    });

program
    .command('complete')
    .description('Mark a task as done with a comment (custom progress field or completed checkbox)')
    .argument('<task-id>', 'Task ID')
    .requiredOption('-m, --message <text>', 'Comment message')
    .option('--close', 'Also mark the task as completed (checkbox), including pending subtasks')
    .action(async (taskId, options) => {
        await completeCommand(taskId, options, getClient());
    });

program
    .command('comment')
    .description('Add a comment and/or attachments to a task')
    .argument('<task-id>', 'Task ID')
    .option('-m, --message <text>', 'Comment message')
    .option('-a, --attachment <path>', 'File to attach (repeatable)', collectMultiple, [])
    .action(async (taskId, options) => {
        await commentCommand(taskId, options, getClient());
    });

program
    .command('create-subtask')
    .description('Create a subtask under a task')
    .argument('<parent-id>', 'Parent task ID')
    .requiredOption('-n, --name <name>', 'Subtask name')
    .action(async (parentId, options) => {
        await createSubtaskCommand(parentId, options, getClient());
    });

program.parseAsync().catch((err) => {
    console.error(formatError(err.message));
    process.exit(1);
});
