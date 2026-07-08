import { formatSuccess } from '../formatter.js';

export async function createSubtaskCommand(parentId, options, client) {
    const name = options.name;
    if (!name) {
        console.error('Error: --name is required');
        process.exit(1);
    }

    const subtask = await client.createSubtask(parentId, name);
    const parent = await client.getTask(parentId);

    console.log(formatSuccess(`Subtask created: "${name}" (id: ${subtask.gid})\n   Parent: ${parent.name}`));
}
