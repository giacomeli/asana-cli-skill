/**
 * Extrai o task ID de uma URL do Asana ou retorna o ID direto.
 *
 * Formatos suportados:
 * - https://app.asana.com/0/<project-id>/<task-id>
 * - https://app.asana.com/0/<project-id>/<task-id>/f
 * - https://app.asana.com/1/<workspace-id>/project/<project-id>/task/<task-id>
 * - ID numérico direto
 */
export function parseTaskId(input) {
    if (/^\d+$/.test(input)) {
        return input;
    }

    try {
        const url = new URL(input);
        if (!url.hostname.includes('asana.com')) {
            throw new Error(`URL não é do Asana: ${input}`);
        }

        const parts = url.pathname.split('/').filter(Boolean);

        // Formato: /1/<workspace>/project/<project>/task/<task-id>
        const taskIndex = parts.indexOf('task');
        if (taskIndex !== -1 && parts[taskIndex + 1]) {
            return parts[taskIndex + 1];
        }

        // Formato: /0/<project-id>/<task-id>[/f]
        if (parts[0] === '0' && parts.length >= 3) {
            return parts[2];
        }

        throw new Error(`Não foi possível extrair task ID de: ${input}`);
    } catch (err) {
        if (err.code === 'ERR_INVALID_URL') {
            throw new Error(`Entrada inválida (não é URL nem ID numérico): ${input}`);
        }
        throw err;
    }
}
