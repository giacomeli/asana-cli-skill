import chalk from 'chalk';

export function formatTask(task, subtasks) {
    const lines = [];

    lines.push('');
    lines.push(chalk.bold(`📋 Task: ${task.name}`));
    lines.push(`   Status: ${task.completed ? chalk.green('Concluída') : chalk.yellow('Em andamento')}`);

    const project = task.memberships?.[0]?.project?.name;
    if (project) {
        lines.push(`   Projeto: ${project}`);
    }

    if (task.assignee?.name) {
        lines.push(`   Assignee: ${task.assignee.name}`);
    }

    lines.push(`   ID: ${task.gid}`);

    if (task.notes) {
        lines.push('');
        lines.push('   Descrição:');
        const noteLines = task.notes.split('\n');
        for (const line of noteLines) {
            lines.push(`   ${line}`);
        }
    }

    if (subtasks && subtasks.length > 0) {
        lines.push('');
        lines.push(`   Subtasks (${subtasks.length}):`);
        for (const sub of subtasks) {
            const check = sub.completed ? chalk.green('✓') : ' ';
            const name = sub.completed ? chalk.dim(sub.name) : sub.name;
            lines.push(`   [${check}] ${name} (id: ${sub.gid})`);
        }
    }

    lines.push('');
    return lines.join('\n');
}

export function formatSubtasks(subtasks) {
    const lines = [];
    lines.push('');

    if (subtasks.length === 0) {
        lines.push(chalk.dim('   Nenhuma subtask encontrada.'));
        lines.push('');
        return lines.join('\n');
    }

    lines.push(`   Subtasks (${subtasks.length}):`);
    for (const sub of subtasks) {
        const check = sub.completed ? chalk.green('✓') : ' ';
        const name = sub.completed ? chalk.dim(sub.name) : sub.name;
        lines.push(`   [${check}] ${name} (id: ${sub.gid})`);
    }

    lines.push('');
    return lines.join('\n');
}

export function formatSuccess(message) {
    return `\n${chalk.green('✅')} ${message}\n`;
}

export function formatError(message) {
    return `\n${chalk.red('❌')} ${message}\n`;
}
