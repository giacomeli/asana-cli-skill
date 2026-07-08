import chalk from 'chalk';

export function formatTask(task, subtasks) {
    const lines = [];

    lines.push('');
    lines.push(chalk.bold(`Task: ${task.name}`));
    lines.push(`   Status: ${task.completed ? chalk.green('Completed') : chalk.yellow('In progress')}`);

    const project = task.memberships?.[0]?.project?.name;
    if (project) {
        lines.push(`   Project: ${project}`);
    }

    if (task.assignee?.name) {
        lines.push(`   Assignee: ${task.assignee.name}`);
    }

    lines.push(`   ID: ${task.gid}`);

    if (task.notes) {
        lines.push('');
        lines.push('   Description:');
        const noteLines = task.notes.split('\n');
        for (const line of noteLines) {
            lines.push(`   ${line}`);
        }
    }

    if (subtasks && subtasks.length > 0) {
        lines.push('');
        lines.push(`   Subtasks (${subtasks.length}):`);
        for (const sub of subtasks) {
            const check = sub.completed ? chalk.green('x') : ' ';
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
        lines.push(chalk.dim('   No subtasks found.'));
        lines.push('');
        return lines.join('\n');
    }

    lines.push(`   Subtasks (${subtasks.length}):`);
    for (const sub of subtasks) {
        const check = sub.completed ? chalk.green('x') : ' ';
        const name = sub.completed ? chalk.dim(sub.name) : sub.name;
        lines.push(`   [${check}] ${name} (id: ${sub.gid})`);
    }

    lines.push('');
    return lines.join('\n');
}

export function formatSuccess(message) {
    return `\n${chalk.green('OK')} ${message}\n`;
}

export function formatError(message) {
    return `\n${chalk.red('Error:')} ${message}\n`;
}
