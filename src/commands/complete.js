import { formatSuccess } from '../formatter.js';

export async function completeCommand(taskId, options, client) {
    const message = options.message;
    if (!message) {
        console.error('Error: --message is required');
        process.exit(1);
    }

    await client.addComment(taskId, message);

    // When a progress custom field is configured, set it instead of the
    // completed checkbox (useful for boards driven by an enum field).
    const progressField = process.env.ASANA_PROGRESS_FIELD;
    const progressValue = process.env.ASANA_PROGRESS_VALUE;
    const useProgressField = Boolean(progressField && progressValue);

    if (useProgressField) {
        await client.setCustomFieldEnum(taskId, progressField, progressValue);
    }

    if (options.close || !useProgressField) {
        await client.completeTask(taskId);
    }

    if (options.close) {
        const subtasks = await client.getSubtasks(taskId);
        const pending = subtasks.filter((s) => !s.completed);
        for (const sub of pending) {
            await client.completeTask(sub.gid);
        }

        if (pending.length > 0) {
            console.log(formatSuccess(`${pending.length} pending subtask(s) also marked as completed`));
        }
    }

    const task = await client.getTask(taskId);
    const actions = [];
    if (useProgressField) actions.push(`progress set to "${progressValue}"`);
    if (options.close || !useProgressField) actions.push('marked as completed');
    console.log(formatSuccess(`Task "${task.name}" - ${actions.join(' + ')}\n   Comment added: "${message}"`));
}
