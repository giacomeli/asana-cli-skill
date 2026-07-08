import { basename } from 'path';

const BASE_URL = 'https://app.asana.com/api/1.0';

export class AsanaClient {
    constructor(token) {
        if (!token) {
            throw new Error(
                'ASANA_TOKEN is not set.\n' +
                'Run: asana-cli init'
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
            throw new Error(`Asana API error (${response.status}): ${msg}`);
        }

        const json = await response.json();
        return json.data;
    }

    async getTask(taskId) {
        return this.request(
            `/tasks/${taskId}?opt_fields=name,notes,completed,assignee.name,memberships.project.name,custom_fields.name,custom_fields.enum_value,custom_fields.enum_options`
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

    async addHtmlComment(taskId, htmlText) {
        return this.request(`/tasks/${taskId}/stories`, {
            method: 'POST',
            body: JSON.stringify({ data: { html_text: htmlText } }),
        });
    }

    async setCustomFieldEnum(taskId, fieldName, optionName) {
        const task = await this.getTask(taskId);
        const field = task.custom_fields?.find(
            (f) => f.name.toLowerCase() === fieldName.toLowerCase()
        );
        if (!field) {
            const available = task.custom_fields?.map((f) => f.name).join(', ') || 'none';
            throw new Error(
                `Custom field "${fieldName}" not found. Available fields: ${available}`
            );
        }

        const option = field.enum_options?.find(
            (o) => o.name.toLowerCase() === optionName.toLowerCase()
        );
        if (!option) {
            const available = field.enum_options?.map((o) => o.name).join(', ') || 'none';
            throw new Error(
                `Option "${optionName}" not found in field "${fieldName}". Available options: ${available}`
            );
        }

        return this.request(`/tasks/${taskId}`, {
            method: 'PUT',
            body: JSON.stringify({
                data: { custom_fields: { [field.gid]: option.gid } },
            }),
        });
    }

    async uploadAttachment(taskId, filePath) {
        const url = `${BASE_URL}/tasks/${taskId}/attachments`;
        const fileName = basename(filePath);
        const ext = fileName.toLowerCase().slice(fileName.lastIndexOf('.'));
        const mimeTypes = {
            '.png': 'image/png',
            '.jpg': 'image/jpeg',
            '.jpeg': 'image/jpeg',
            '.gif': 'image/gif',
            '.webp': 'image/webp',
            '.bmp': 'image/bmp',
            '.svg': 'image/svg+xml',
            '.pdf': 'application/pdf',
        };
        const mimeType = mimeTypes[ext] || 'application/octet-stream';

        const { readFile } = await import('fs/promises');
        const fileBuffer = await readFile(filePath);
        const blob = new Blob([fileBuffer], { type: mimeType });

        const form = new FormData();
        form.append('file', blob, fileName);

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${this.token}`,
            },
            body: form,
        });

        if (!response.ok) {
            const body = await response.json().catch(() => ({}));
            const msg = body?.errors?.[0]?.message || response.statusText;
            throw new Error(`Asana API error uploading attachment (${response.status}): ${msg}`);
        }

        const json = await response.json();
        return json.data;
    }

    async createSubtask(parentId, name) {
        return this.request(`/tasks/${parentId}/subtasks`, {
            method: 'POST',
            body: JSON.stringify({ data: { name } }),
        });
    }
}
