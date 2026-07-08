/**
 * Extracts the task ID from an Asana URL, or returns the ID as-is.
 *
 * Supported formats:
 * - https://app.asana.com/0/<project-id>/<task-id>
 * - https://app.asana.com/0/<project-id>/<task-id>/f
 * - https://app.asana.com/1/<workspace-id>/project/<project-id>/task/<task-id>
 * - Plain numeric ID
 */
export function parseTaskId(input) {
    if (/^\d+$/.test(input)) {
        return input;
    }

    try {
        const url = new URL(input);
        if (!url.hostname.includes('asana.com')) {
            throw new Error(`URL is not an Asana URL: ${input}`);
        }

        const parts = url.pathname.split('/').filter(Boolean);

        // Format: /1/<workspace>/project/<project>/task/<task-id>
        const taskIndex = parts.indexOf('task');
        if (taskIndex !== -1 && parts[taskIndex + 1]) {
            return parts[taskIndex + 1];
        }

        // Format: /0/<project-id>/<task-id>[/f]
        if (parts[0] === '0' && parts.length >= 3) {
            return parts[2];
        }

        throw new Error(`Could not extract a task ID from: ${input}`);
    } catch (err) {
        if (err.code === 'ERR_INVALID_URL') {
            throw new Error(`Invalid input (not a URL or numeric ID): ${input}`);
        }
        throw err;
    }
}
