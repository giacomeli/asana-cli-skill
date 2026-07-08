import { writeFileSync, mkdirSync, existsSync } from 'fs';
import { join } from 'path';
import { homedir } from 'os';
import { createInterface } from 'readline';
import { formatSuccess, formatError } from '../formatter.js';

const CONFIG_DIR = join(homedir(), '.asana-cli');
const ENV_PATH = join(CONFIG_DIR, '.env');

function prompt(question) {
    const rl = createInterface({ input: process.stdin, output: process.stdout });
    return new Promise((resolve) => {
        rl.question(question, (answer) => {
            rl.close();
            resolve(answer.trim());
        });
    });
}

export async function initCommand() {
    console.log('\nAsana CLI setup\n');

    if (existsSync(ENV_PATH)) {
        const overwrite = await prompt('   A configuration already exists. Overwrite? (y/N): ');
        if (overwrite.toLowerCase() !== 'y') {
            console.log(formatSuccess('Existing configuration kept.'));
            return;
        }
    }

    const token = await prompt('   Paste your Asana Personal Access Token: ');

    if (!token) {
        console.log(formatError('Token cannot be empty.'));
        process.exit(1);
    }

    mkdirSync(CONFIG_DIR, { recursive: true });
    writeFileSync(ENV_PATH, `ASANA_TOKEN=${token}\n`, { mode: 0o600 });

    console.log(formatSuccess(`Token saved to ${ENV_PATH}`));
}
