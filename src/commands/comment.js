import { formatSuccess } from '../formatter.js';

export async function commentCommand(taskId, options, client) {
    const message = options.message;
    if (!message) {
        console.error('Erro: --message é obrigatório');
        process.exit(1);
    }

    await client.addComment(taskId, message);

    const task = await client.getTask(taskId);
    console.log(formatSuccess(`Comentário adicionado em "${task.name}"\n   Mensagem: "${message}"`));
}
