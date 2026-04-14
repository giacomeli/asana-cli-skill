import { formatSuccess } from '../formatter.js';

export async function completeCommand(taskId, options, client) {
    const message = options.message;
    if (!message) {
        console.error('Erro: --message é obrigatório');
        process.exit(1);
    }

    await client.addComment(taskId, message);
    await client.completeTask(taskId);

    const task = await client.getTask(taskId);
    console.log(formatSuccess(`Task "${task.name}" marcada como concluída\n   Comentário adicionado: "${message}"`));
}
