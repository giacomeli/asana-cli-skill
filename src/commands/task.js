import { parseTaskId } from '../utils.js';
import { formatTask } from '../formatter.js';

export async function taskCommand(urlOrId, client) {
    const taskId = parseTaskId(urlOrId);
    const [task, subtasks] = await Promise.all([
        client.getTask(taskId),
        client.getSubtasks(taskId),
    ]);

    console.log(formatTask(task, subtasks));
}
