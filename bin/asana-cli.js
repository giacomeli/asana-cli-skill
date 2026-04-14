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

// Carrega .env do diretório do projeto primeiro, depois do ~/.asana-cli/
config({ path: join(process.cwd(), '.env') });

const globalEnv = join(homedir(), '.asana-cli', '.env');
if (existsSync(globalEnv)) {
    config({ path: globalEnv });
}

function getClient() {
    return new AsanaClient(process.env.ASANA_TOKEN);
}

const program = new Command();

program
    .name('asana-cli')
    .description('CLI para integração com Asana')
    .version('1.0.0');

program
    .command('init')
    .description('Configurar Personal Access Token do Asana')
    .action(initCommand);

program
    .command('task')
    .description('Ler task completa com subtasks')
    .argument('<url-ou-id>', 'URL do Asana ou task ID')
    .action(async (urlOrId) => {
        await taskCommand(urlOrId, getClient());
    });

program
    .command('subtasks')
    .description('Listar subtasks de uma task')
    .argument('<url-ou-id>', 'URL do Asana ou task ID')
    .action(async (urlOrId) => {
        await subtasksCommand(urlOrId, getClient());
    });

program
    .command('complete')
    .description('Marcar task como concluída com comentário')
    .argument('<task-id>', 'ID da task')
    .requiredOption('-m, --message <texto>', 'Mensagem do comentário')
    .action(async (taskId, options) => {
        await completeCommand(taskId, options, getClient());
    });

program
    .command('comment')
    .description('Adicionar comentário em uma task')
    .argument('<task-id>', 'ID da task')
    .requiredOption('-m, --message <texto>', 'Mensagem do comentário')
    .action(async (taskId, options) => {
        await commentCommand(taskId, options, getClient());
    });

program
    .command('create-subtask')
    .description('Criar subtask em uma task')
    .argument('<parent-id>', 'ID da task pai')
    .requiredOption('-n, --name <nome>', 'Nome da subtask')
    .action(async (parentId, options) => {
        await createSubtaskCommand(parentId, options, getClient());
    });

program.parseAsync().catch((err) => {
    console.error(formatError(err.message));
    process.exit(1);
});
