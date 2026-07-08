import { existsSync } from 'fs';
import { formatSuccess, formatError } from '../formatter.js';

export async function commentCommand(taskId, options, client) {
    const message = options.message;
    const attachments = options.attachment || [];

    if (!message && attachments.length === 0) {
        console.error(formatError('Provide --message and/or --attachment'));
        process.exit(1);
    }

    // Validate files exist
    for (const filePath of attachments) {
        if (!existsSync(filePath)) {
            console.error(formatError(`File not found: ${filePath}`));
            process.exit(1);
        }
    }

    // Upload attachments and collect GIDs
    const uploaded = [];
    for (const filePath of attachments) {
        const result = await client.uploadAttachment(taskId, filePath);
        uploaded.push({ name: result.name, gid: result.gid });
    }

    // Build comment
    if (uploaded.length > 0) {
        // Use html_text with inline images via data-asana-gid
        const textPart = message
            ? message.replace(/\\n/g, '\n')
            : '';
        const imgTags = uploaded
            .map((att) => `<img data-asana-gid="${att.gid}"/>`)
            .join('\n');
        const htmlBody = textPart
            ? `<body>${textPart}\n${imgTags}</body>`
            : `<body>${imgTags}</body>`;
        await client.addHtmlComment(taskId, htmlBody);
    } else if (message) {
        await client.addComment(taskId, message);
    }

    const task = await client.getTask(taskId);
    const parts = [];
    if (message) parts.push(`Comment: "${message}"`);
    if (uploaded.length > 0) parts.push(`Inline attachments: ${uploaded.map((u) => u.name).join(', ')}`);

    console.log(formatSuccess(`Task "${task.name}" updated\n   ${parts.join('\n   ')}`));
}
