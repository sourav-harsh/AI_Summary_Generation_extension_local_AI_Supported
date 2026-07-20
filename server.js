import { spawn } from 'child_process';
import path from 'path';
import { fileURLToPath } from 'url';
import fs from "fs";

// Recreate __dirname functionality for ES Modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function startOllama() {
    const platform = process.platform;
    const binaryName = platform === 'win32' ? 'ollama.exe' : 'ollama';
    const binaryPath = path.join(__dirname, 'assets', 'binaries', platform, binaryName);
    const modelsDir = path.join(__dirname, 'assets', 'models');

    console.log(`[Ollama] Launching binary from: ${binaryPath}`);
    console.log("OLLAMA_MODELS =", modelsDir);
    console.log("Exists:", fs.existsSync(modelsDir));
    console.log("Contents:", fs.readdirSync(modelsDir));


    const ollamaProcess = spawn("/usr/local/bin/ollama", ['serve'], {
        env: {
            ...process.env,
            OLLAMA_MODELS: modelsDir,
            OLLAMA_HOST: '127.0.0.1:11434',
            OLLAMA_ORIGINS: '*'
        }
    });

    ollamaProcess.stdout.on('data', (data) => console.log(`[Ollama Logs]: ${data}`));
    ollamaProcess.stderr.on('data', (data) => console.error(`[Ollama Error]: ${data}`));

    process.on('SIGINT', () => {
        ollamaProcess.kill();
        process.exit();
    });
}

startOllama();
