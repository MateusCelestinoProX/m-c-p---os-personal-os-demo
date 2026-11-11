/**
 * api/imagekit.js — Vercel Serverless Function: ImageKit API Proxy
 * Handles auth signature generation for client-side uploads, secure file deletion,
 * and unified gallery/media listing across Diary, Cartas, Potes and Dreamboard.
 */
const crypto = require('crypto');
const https = require('https');
const path = require('path');
const { enqueueMediaBackup } = require('./github-backup-service');

const PUBLIC_KEY = process.env.IMAGEKIT_PUBLIC_KEY || "";
const PRIVATE_KEY = process.env.IMAGEKIT_PRIVATE_KEY || "";
const URL_ENDPOINT = process.env.IMAGEKIT_URL_ENDPOINT || "https://ik.imagekit.io/xnfm1p4bc";

// Cache in-memory leve para respostas instantâneas (<30s)
let cachedMediaList = null;
let lastCacheTime = 0;
const CACHE_TTL_MS = 45 * 1000;

module.exports = async function handler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const action = req.query.action || (req.method === 'DELETE' ? 'delete' : 'auth');

    // ─────────────────────────────────────────────────────────────
    // 1. Auth Endpoint: Gera token, expire e signature para upload do browser
    // ─────────────────────────────────────────────────────────────
    if (action === 'auth') {
        const token = req.query.token || crypto.randomUUID();
        const expire = req.query.expire || (Math.floor(Date.now() / 1000) + 2400); // 40 minutos

        const signature = crypto
            .createHmac('sha1', PRIVATE_KEY)
            .update(token + expire)
            .digest('hex');

        return res.status(200).json({
            token: token.toString(),
            expire: Number(expire),
            signature: signature,
            publicKey: PUBLIC_KEY,
            urlEndpoint: URL_ENDPOINT
        });
    }

    // ─────────────────────────────────────────────────────────────
    // 1.8 GitHub Backup Endpoint: Espelha mídias enviadas para o ImageKit no GitHub
    // ─────────────────────────────────────────────────────────────
    if (action === 'github-backup' || action === 'backup') {
        try {
            const body = req.body || {};
            const { filePath, url, fileId, name, size, mime, fileType } = body;

            if (!url || !filePath) {
                return res.status(400).json({ error: 'Parâmetros obrigatórios ausentes: url e filePath.' });
            }

            console.log(`[ImageKit API] Recebida solicitação de backup GitHub para: ${filePath}`);
            
            // Enfileira processamento assíncrono para o GitHub
            const backupPromise = enqueueMediaBackup({
                filePath,
                url,
                fileId,
                name: name || path.basename(filePath),
                size: Number(size) || 0,
                mime: mime || 'image/webp',
                fileType: fileType || 'image'
            });

            // Responde imediatamente com sucesso ou aguarda se parâmetro wait=true
            if (req.query.wait === 'true') {
                const result = await backupPromise;
                return res.status(200).json({ success: true, ...result });
            } else {
                // Inicia em background e retorna 202 Accepted
                backupPromise.catch(err => {
                    console.error('[ImageKit API] Erro no backup em segundo plano:', err);
                });
                return res.status(202).json({
                    success: true,
                    status: 'queued',
                    message: 'Backup enfileirado para envio ao repositório GitHub com sucesso.',
                    targetPath: `imagekit-media-backup/${filePath.replace(/^\/+/, '')}`
                });
            }
        } catch (err) {
            console.error('[ImageKit API] Erro ao enfileirar backup no GitHub:', err);
            return res.status(500).json({ error: err.message || 'Erro interno no backup' });
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. Delete Endpoint: Remove arquivo do ImageKit por fileId ou nome/caminho
    // ─────────────────────────────────────────────────────────────
    if (action === 'delete') {
        try {
            let fileId = req.query.fileId;
            const filePath = req.query.filePath || req.query.path;
            const fileName = req.query.name || req.query.fileName;

            // Se não tiver fileId direto, busca pelo caminho exato (pasta + nome)
            if (!fileId && (filePath || fileName)) {
                const cleanFilePath = "/" + (filePath || fileName).replace(/^\/+/, "").replace(/\/+/g, "/");
                const lastSlash = cleanFilePath.lastIndexOf("/");
                const folderPath = lastSlash > 0 ? cleanFilePath.substring(0, lastSlash) : "";
                const target = lastSlash >= 0 ? cleanFilePath.substring(lastSlash + 1) : cleanFilePath;

                const folderParam = folderPath ? `path=${encodeURIComponent(folderPath)}&` : "";
                const searchRes = await ikRequest(`/v1/files?${folderParam}searchQuery=name%3D%22${encodeURIComponent(target)}%22`, "GET");
                if (Array.isArray(searchRes) && searchRes.length > 0) {
                    const exactMatch = searchRes.find(f => f.filePath === cleanFilePath || f.name === target);
                    fileId = exactMatch ? exactMatch.fileId : searchRes[0].fileId;
                }
            }

            if (!fileId) {
                return res.status(404).json({ error: 'Arquivo não encontrado no ImageKit para exclusão.' });
            }

            await ikRequest(`/v1/files/${fileId}`, 'DELETE');
            // Invalida cache de mídias
            cachedMediaList = null;
            return res.status(200).json({ success: true, deletedFileId: fileId });
        } catch (err) {
            console.error('Erro ao deletar no ImageKit:', err);
            return res.status(500).json({ error: err.message || 'Erro ao deletar arquivo no ImageKit' });
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 3. Galleries & Media List Endpoint: Retorna mídias organizadas
    // ─────────────────────────────────────────────────────────────
    if (action === 'galleries' || action === 'list') {
        try {
            const now = Date.now();
            let allFiles = [];

            if (cachedMediaList && (now - lastCacheTime < CACHE_TTL_MS)) {
                allFiles = cachedMediaList;
            } else {
                let skip = 0;
                while (true) {
                    const batch = await ikRequest(`/v1/files?limit=100&skip=${skip}`, 'GET');
                    if (!Array.isArray(batch) || batch.length === 0) break;
                    allFiles.push(...batch);
                    if (batch.length < 100) break;
                    skip += 100;
                    if (skip >= 1000) break; // Trava de segurança para limites de quota
                }
                cachedMediaList = allFiles;
                lastCacheTime = now;
            }

            // Mapeia galerias e itens
            const categories = {
                diary: {
                    id: 'diary',
                    title: 'Diário OS',
                    icon: '📔',
                    description: 'Mídias e notas anexadas no Diário',
                    items: []
                },
                cartas: {
                    id: 'cartas',
                    title: 'Cartas',
                    icon: '✉️',
                    description: 'Imagens e mídias de cartas',
                    items: []
                },
                potes: {
                    id: 'potes',
                    title: 'Potes da Gratidão',
                    icon: '🏺',
                    description: 'Fotos dos potes de memórias',
                    items: []
                },
                dreamboard: {
                    id: 'dreamboard',
                    title: 'Dreamboard',
                    icon: '🌟',
                    description: 'Mural de Sonhos e Metas Visuais',
                    subcategories: {},
                    items: []
                },
                outros: {
                    id: 'outros',
                    title: 'Outros Arquivos',
                    icon: '📁',
                    description: 'Arquivos gerais na raiz e temas',
                    items: []
                }
            };

            allFiles.forEach(file => {
                const fp = (file.filePath || '').toLowerCase();
                const item = {
                    fileId: file.fileId,
                    name: file.name,
                    filePath: file.filePath,
                    url: file.url,
                    thumbnail: file.thumbnail || file.url,
                    fileType: file.fileType || (file.mime && file.mime.startsWith('image/') ? 'image' : 'non-image'),
                    mime: file.mime,
                    size: file.size,
                    createdAt: file.createdAt
                };

                if (fp.includes('diary-uploads') || fp.includes('/diary/') || fp.startsWith('/diary')) {
                    categories.diary.items.push(item);
                } else if (fp.includes('/cartas-media/potes')) {
                    categories.potes.items.push(item);
                } else if (fp.includes('/cartas-media/uploads')) {
                    categories.cartas.items.push(item);
                } else if (fp.includes('dreamboard')) {
                    categories.dreamboard.items.push(item);
                    // Extrai subcategoria do Dreamboard
                    const parts = (file.filePath || '').split('/').filter(Boolean);
                    const subcat = parts.length > 2 ? parts[parts.length - 2] : 'geral';
                    if (!categories.dreamboard.subcategories[subcat]) {
                        categories.dreamboard.subcategories[subcat] = [];
                    }
                    categories.dreamboard.subcategories[subcat].push(item);
                } else {
                    categories.outros.items.push(item);
                }
            });

            return res.status(200).json({
                success: true,
                totalFiles: allFiles.length,
                categories,
                dreamboardSubcategories: Object.keys(categories.dreamboard.subcategories)
            });

        } catch (err) {
            console.error('Erro ao listar arquivos do ImageKit:', err);
            return res.status(500).json({ error: err.message || 'Erro ao listar mídias do ImageKit' });
        }
    }

    return res.status(400).json({ error: 'Ação não suportada' });
};

function ikRequest(path, method = 'GET') {
    return new Promise((resolve, reject) => {
        const auth = Buffer.from(PRIVATE_KEY + ':').toString('base64');
        const req = https.request({
            hostname: 'api.imagekit.io',
            path: path,
            method: method,
            headers: {
                'Authorization': `Basic ${auth}`,
                'Content-Type': 'application/json'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    if (data) {
                        try { resolve(JSON.parse(data)); } catch (e) { resolve(data); }
                    } else {
                        resolve(null);
                    }
                } else {
                    reject(new Error(`ImageKit API error [${res.statusCode}]: ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}
