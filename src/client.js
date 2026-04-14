const BASE_URL = 'https://app.asana.com/api/1.0';

export class AsanaClient {
    constructor(token) {
        if (!token) {
            throw new Error(
                'ASANA_TOKEN não configurado.\n' +
                'Execute: asana-cli init'
            );
        }
        this.token = token;
    }

    async request(path, options = {}) {
        const url = `${BASE_URL}${path}`;
        const response = await fetch(url, {
            ...options,
            headers: {
                'Authorization': `Bearer ${this.token}`,
                'Content-Type': 'application/json',
                ...options.headers,
            },
        });

        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            const msg = body?.errors?.[0]?.message || response.statusText;
            throw new Error(`Asana API erro (${response.status}): ${msg}`);
        }

        const json = await response.json();
        return json.data;
    }

    async getTask(taskId) {
        return this.request(
            `/tasks/${taskId}?opt_fields=name,notes,completed,assignee.name,memberships.project.name`
        );
    }

    async getSubtasks(taskId) {
        return this.request(
            `/tasks/${taskId}/subtasks?opt_fields=name,completed`
        );
    }

    async completeTask(taskId) {
        return this.request(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify({ data: { completed: true } }),
        });
    }

    async addComment(taskId, text) {
        const parsed = text.replace(/\\n/g, '\n');
        return this.request(`/tasks/${taskId}/stories`, {
            method: 'POST',
            body: JSON.stringify({ data: { text: parsed } }),
        });
    }

    async createSubtask(parentId, name) {
        return this.request(`/tasks/${parentId}/subtasks`, {
            method: 'POST',
            body: JSON.stringify({ data: { name } }),
        });
    }
}
