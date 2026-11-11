/**
 * api/github-backup-service.js
 * 
 * Serviço inteligente de espelhamento e backup contínuo de mídias:
 * ImageKit CDN ➔ Repositório GitHub (m-c-p---os-personal-os)
 * 
 * Características:
 * 1. Fila sequencial assíncrona (evita conflitos de concorrência / git locks).
 * 2. Suporte Híbrido:
 *    - Modo Local: Gravação direta em disk (imagekit-media-backup/), atualização
 *      do manifest.json com SHA-256 e git commit/push com identidade oficial.
 *    - Modo API (Vercel / Cloud): Uso direto da GitHub REST API (Contents API)
 *      com token e committer/author oficial Mateus Celestino.
 * 3. Download fiel com ?tr=orig-true para preservar o arquivo mestre original.
 */

const fs = require('fs');
const path = require('path');
const https = require('https');
const crypto = require('crypto');
const { exec } = require('child_process');

const GITHUB_TOKEN = process.env.GITHUB_TOKEN || "";
const GITHUB_REPO_OWNER = "MateusCelestinoProX";
const GITHUB_REPO_NAME = "m-c-p---os-personal-os";
const GITHUB_BRANCH = "main";
const COMMITTER_NAME = "Mateus Celestino";
const COMMITTER_EMAIL = "202405039459@alunos.estacio.br";

const REPO_ROOT = path.resolve(__dirname, '..');
const BACKUP_DIR = path.join(REPO_ROOT, 'imagekit-media-backup');
const MANIFEST_PATH = path.join(BACKUP_DIR, 'manifest.json');

// Fila sequencial em memória para operações de backup
const queue = [];
let isProcessing = false;

/**
 * Faz download do buffer original da CDN ImageKit com ?tr=orig-true
 */
function fetchMediaBuffer(url) {
    return new Promise((resolve, reject) => {
        try {
            const parsed = new URL(url);
            parsed.searchParams.set('tr', 'orig-true');
            const targetUrl = parsed.toString();

            https.get(targetUrl, (res) => {
                if (res.statusCode !== 200) {
                    return reject(new Error(`Falha ao obter mídia da CDN ImageKit (${res.statusCode}): ${targetUrl}`));
                }
                const chunks = [];
                res.on('data', chunk => chunks.push(chunk));
                res.on('end', () => resolve(Buffer.concat(chunks)));
            }).on('error', reject);
        } catch (e) {
            reject(e);
        }
    });
}

/**
 * Chamada autenticada para a GitHub REST API
 */
function githubApiRequest(apiPath, method = 'GET', data = null) {
    return new Promise((resolve, reject) => {
        const headers = {
            'Authorization': `token ${GITHUB_TOKEN}`,
            'User-Agent': 'PersonalOS-MediaBackupEngine',
            'Accept': 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28'
        };

        let body = null;
        if (data) {
            body = typeof data === 'string' ? data : JSON.stringify(data);
            headers['Content-Type'] = 'application/json';
            headers['Content-Length'] = Buffer.byteLength(body);
        }

        const options = {
            hostname: 'api.github.com',
            path: apiPath,
            method: method,
            headers: headers
        };

        const req = https.request(options, (res) => {
            let resData = '';
            res.on('data', chunk => resData += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(resData));
                    } catch (e) {
                        resolve(resData);
                    }
                } else {
                    reject(new Error(`GitHub API Error [${res.statusCode}]: ${resData}`));
                }
            });
        });

        req.on('error', reject);
        if (body) req.write(body);
        req.end();
    });
}

/**
 * Cria ou atualiza um arquivo no GitHub via REST API
 */
async function uploadToGitHubViaApi(repoPath, contentBuffer, commitMessage) {
    let sha = null;
    try {
        const existing = await githubApiRequest(
            `/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${encodeURIComponent(repoPath)}?ref=${GITHUB_BRANCH}`
        );
        if (existing && existing.sha) {
            sha = existing.sha;
        }
    } catch (e) {
        // Se der 404, arquivo é novo, sha permanece null
    }

    const payload = {
        message: commitMessage,
        content: contentBuffer.toString('base64'),
        branch: GITHUB_BRANCH,
        committer: {
            name: COMMITTER_NAME,
            email: COMMITTER_EMAIL
        },
        author: {
            name: COMMITTER_NAME,
            email: COMMITTER_EMAIL
        }
    };
    if (sha) payload.sha = sha;

    return await githubApiRequest(
        `/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/${encodeURIComponent(repoPath)}`,
        'PUT',
        payload
    );
}

/**
 * Atualiza o arquivo manifest.json no GitHub via REST API
 */
async function updateRemoteManifestViaApi(newItem) {
    try {
        let manifestData = { files: [] };
        let sha = null;

        try {
            const res = await githubApiRequest(
                `/repos/${GITHUB_REPO_OWNER}/${GITHUB_REPO_NAME}/contents/imagekit-media-backup/manifest.json?ref=${GITHUB_BRANCH}`
            );
            if (res && res.content) {
                sha = res.sha;
                const jsonText = Buffer.from(res.content, 'base64').toString('utf8');
                manifestData = JSON.parse(jsonText);
            }
        } catch (e) {
            console.warn('[GitHub API Manifest] Criando novo manifesto remoto...');
        }

        // Remove item se já existia e adiciona versão mais recente
        manifestData.files = (manifestData.files || []).filter(f => f.filePath !== newItem.filePath);
        manifestData.files.push(newItem);
        manifestData.files.sort((a, b) => a.filePath.localeCompare(b.filePath));
        manifestData.updatedAt = new Date().toISOString();
        manifestData.summary = {
            totalFiles: manifestData.files.length,
            totalSizeBytes: manifestData.files.reduce((acc, f) => acc + (f.size || 0), 0)
        };

        const buf = Buffer.from(JSON.stringify(manifestData, null, 2), 'utf8');
        await uploadToGitHubViaApi(
            'imagekit-media-backup/manifest.json',
            buf,
            `chore(manifest): atualiza catalogo apos backup de ${newItem.name}`
        );
    } catch (err) {
        console.warn('⚠️ [GitHub API Manifest] Falha não impeditiva ao atualizar manifesto remoto:', err.message);
    }
}

/**
 * Processa a sincronização de uma mídia específica
 */
async function processBackupTask(task) {
    const { filePath, url, fileId, name, size, mime, fileType } = task;
    const cleanRelPath = filePath.replace(/^\/+/, '');
    const repoFilePath = `imagekit-media-backup/${cleanRelPath}`;
    const commitMessage = `feat(media-backup): auto backup ${name || cleanRelPath} [ImageKit -> GitHub]`;

    console.log(`📡 [GitHub Backup] Baixando original ImageKit: ${filePath}...`);
    const buffer = await fetchMediaBuffer(url);
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

    const manifestItem = {
        fileId: fileId || null,
        name: name || path.basename(cleanRelPath),
        filePath: filePath,
        localPath: repoFilePath,
        size: buffer.length || size || 0,
        mime: mime || 'application/octet-stream',
        fileType: fileType || 'image',
        sha256: sha256,
        originalUrl: url,
        updatedAt: new Date().toISOString()
    };

    const hasLocalGit = fs.existsSync(path.join(REPO_ROOT, '.git'));

    if (hasLocalGit) {
        // MODO 1: LOCAL DISK + GIT CLI (Desktop, Tauri ou Servidor Local)
        console.log(`💾 [GitHub Backup] Gravando cópia local em ${repoFilePath}...`);
        const localDest = path.join(REPO_ROOT, repoFilePath);
        fs.mkdirSync(path.dirname(localDest), { recursive: true });
        fs.writeFileSync(localDest, buffer);

        // Atualiza manifest.json local
        let localManifest = { files: [] };
        if (fs.existsSync(MANIFEST_PATH)) {
            try {
                localManifest = JSON.parse(fs.readFileSync(MANIFEST_PATH, 'utf8'));
            } catch (e) {}
        }
        localManifest.files = (localManifest.files || []).filter(f => f.filePath !== filePath);
        localManifest.files.push(manifestItem);
        localManifest.files.sort((a, b) => a.filePath.localeCompare(b.filePath));
        localManifest.updatedAt = new Date().toISOString();
        localManifest.summary = {
            totalFiles: localManifest.files.length,
            totalSizeBytes: localManifest.files.reduce((acc, f) => acc + (f.size || 0), 0)
        };
        fs.writeFileSync(MANIFEST_PATH, JSON.stringify(localManifest, null, 2));

        // Executa commit e push atômico
        console.log(`🚀 [GitHub Backup] Executando commit e push local para o GitHub...`);
        await new Promise((resolve, reject) => {
            const gitCmd = `cd "${REPO_ROOT}" && git add "${repoFilePath}" "${MANIFEST_PATH}" && git commit -m "${commitMessage}" --author="${COMMITTER_NAME} <${COMMITTER_EMAIL}>" && git push origin ${GITHUB_BRANCH}`;
            exec(gitCmd, (error, stdout, stderr) => {
                if (error) {
                    console.warn('⚠️ [GitHub Backup] Falha no git push local, tentando fallback via API GitHub...', stderr);
                    // Fallback para API do GitHub se git local falhar
                    uploadToGitHubViaApi(repoFilePath, buffer, commitMessage)
                        .then(() => updateRemoteManifestViaApi(manifestItem))
                        .then(resolve)
                        .catch(reject);
                } else {
                    console.log('✅ [GitHub Backup] Commit e push local concluídos com sucesso!');
                    resolve(stdout);
                }
            });
        });

        return {
            success: true,
            mode: 'local-git',
            path: repoFilePath,
            size: buffer.length,
            sha256: sha256
        };
    } else {
        // MODO 2: CLOUD / VERCEL SERVERLESS (Usa GitHub Contents API)
        console.log(`☁️ [GitHub Backup] Ambiente Serverless: enviando diretamente via GitHub Contents API...`);
        const apiRes = await uploadToGitHubViaApi(repoFilePath, buffer, commitMessage);
        await updateRemoteManifestViaApi(manifestItem);

        return {
            success: true,
            mode: 'github-api',
            path: repoFilePath,
            size: buffer.length,
            sha256: sha256,
            commitSha: apiRes?.commit?.sha || null
        };
    }
}

/**
 * Processador da fila assíncrona
 */
async function processQueue() {
    if (isProcessing || queue.length === 0) return;
    isProcessing = true;

    while (queue.length > 0) {
        const { task, resolve, reject } = queue.shift();
        try {
            const result = await processBackupTask(task);
            resolve(result);
        } catch (err) {
            console.error(`❌ [GitHub Backup Error] Falha ao processar ${task.filePath}:`, err);
            reject(err);
        }
    }

    isProcessing = false;
}

/**
 * Enfileira uma mídia para backup imediato no GitHub
 */
function enqueueMediaBackup(task) {
    return new Promise((resolve, reject) => {
        queue.push({ task, resolve, reject });
        processQueue();
    });
}

module.exports = {
    enqueueMediaBackup,
    processBackupTask,
    fetchMediaBuffer
};
