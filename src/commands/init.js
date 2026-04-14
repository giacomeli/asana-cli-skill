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
    console.log('\n🔧 Configuração do Asana CLI\n');

    if (existsSync(ENV_PATH)) {
        const overwrite = await prompt('   Já existe uma configuração. Sobrescrever? (s/N): ');
        if (overwrite.toLowerCase() !== 's') {
            console.log(formatSuccess('Configuração mantida.'));
            return;
        }
    }

    const token = await prompt('   Cole seu Personal Access Token do Asana: ');

    if (!token) {
        console.log(formatError('Token não pode ser vazio.'));
        process.exit(1);
    }

    mkdirSync(CONFIG_DIR, { recursive: true });
    writeFileSync(ENV_PATH, `ASANA_TOKEN=${token}\n`, { mode: 0o600 });

    console.log(formatSuccess(`Token salvo em ${ENV_PATH}`));
}
