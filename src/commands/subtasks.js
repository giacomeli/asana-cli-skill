import { parseTaskId } from '../utils.js';
import { formatSubtasks } from '../formatter.js';

export async function subtasksCommand(urlOrId, client) {
    const taskId = parseTaskId(urlOrId);
    const subtasks = await client.getSubtasks(taskId);
    console.log(formatSubtasks(subtasks));
}
