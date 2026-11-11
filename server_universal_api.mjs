#!/usr/bin/env node
/**
 * server_universal_api.mjs
 * Servidor HTTP de desenvolvimento local completo para o MCP Personal OS:
 * - Porta padrão: 5173
 * - Servidor de arquivos estáticos com suporte a Range (áudio/vídeo), CORS e MIME types
 * - Rewrites automáticas: /diary, /calendar, /admin, /pomodoro, /oauth, /
 * - APIs Serverless emuladas: /api/imagekit, /api/universal, /api/notion, /api/gcal
 */

import http from "node:http";
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createRequire } from "node:module";
import { execSync } from "node:child_process";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const require = createRequire(import.meta.url);

// Carregadores das Serverless APIs
const universalHandler = require("./api/universal.js");
const notionHandler = require("./api/notion.js");
const imagekitHandler = require("./api/imagekit.js");
const gcalHandler = require("./api/gcal.js");
const chatHandler = require("./api/chat.js");

const PORT = parseInt(process.env.PORT || "5173", 10);
const HOST = process.env.HOST || "0.0.0.0";

const MIME_TYPES = {
    '.html': 'text/html; charset=utf-8',
    '.js': 'application/javascript; charset=utf-8',
    '.mjs': 'application/javascript; charset=utf-8',
    '.css': 'text/css; charset=utf-8',
    '.json': 'application/json; charset=utf-8',
    '.png': 'image/png',
    '.jpg': 'image/jpeg',
    '.jpeg': 'image/jpeg',
    '.gif': 'image/gif',
    '.webp': 'image/webp',
    '.svg': 'image/svg+xml',
    '.ico': 'image/x-icon',
    '.mp3': 'audio/mpeg',
    '.wav': 'audio/wav',
    '.ogg': 'audio/ogg',
    '.m4a': 'audio/mp4',
    '.aac': 'audio/aac',
    '.webm': 'video/webm',
    '.mp4': 'video/mp4',
    '.woff': 'font/woff',
    '.woff2': 'font/woff2',
    '.ttf': 'font/ttf'
};

function adaptVercelReqRes(req, res, url) {
    req.query = Object.fromEntries(url.searchParams.entries());
    
    if (!res.status) {
        res.status = function(code) {
            res.statusCode = code;
            return res;
        };
    }
    if (!res.json) {
        res.json = function(data) {
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            res.end(JSON.stringify(data));
            return res;
        };
    }
    if (!res.send) {
        res.send = function(data) {
            res.end(data);
            return res;
        };
    }
}

async function parseBody(req) {
    return new Promise((resolve) => {
        let body = '';
        req.on('data', chunk => body += chunk);
        req.on('end', () => {
            if (body) {
                try {
                    req.body = JSON.parse(body);
                } catch {
                    req.body = body;
                }
            } else {
                req.body = {};
            }
            resolve(req.body);
        });
    });
}

function serveStaticFile(req, res, filePath) {
    fs.stat(filePath, (err, stats) => {
        if (err || !stats.isFile()) {
            res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
            return res.end('404 Arquivo não encontrado');
        }

        const ext = path.extname(filePath).toLowerCase();
        const contentType = MIME_TYPES[ext] || 'application/octet-stream';
        const totalSize = stats.size;

        // Suporte a cabeçalhos de Range para Streaming de Áudio/Vídeo fluido
        const range = req.headers.range;
        if (range) {
            const parts = range.replace(/bytes=/, "").split("-");
            const start = parseInt(parts[0], 10);
            const end = parts[1] ? parseInt(parts[1], 10) : totalSize - 1;
            const chunksize = (end - start) + 1;

            const fileStream = fs.createReadStream(filePath, { start, end });
            res.writeHead(206, {
                'Content-Range': `bytes ${start}-${end}/${totalSize}`,
                'Accept-Ranges': 'bytes',
                'Content-Length': chunksize,
                'Content-Type': contentType,
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });
            fileStream.pipe(res);
        } else {
            res.writeHead(200, {
                'Content-Length': totalSize,
                'Content-Type': contentType,
                'Accept-Ranges': 'bytes',
                'Access-Control-Allow-Origin': '*',
                'Cache-Control': 'no-cache'
            });
            fs.createReadStream(filePath).pipe(res);
        }
    });
}

const server = http.createServer(async (req, res) => {
    // CORS global para requisições do app e navegador
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        return res.end();
    }

    const host = req.headers.host || `localhost:${PORT}`;
    const url = new URL(req.url, `http://${host}`);
    adaptVercelReqRes(req, res, url);

    // ─────────────────────────────────────────────────────────────
    // 1. ROTAS DE API
    // ─────────────────────────────────────────────────────────────
    if (url.pathname === "/api/universal" || url.pathname === "/api/universal/") {
        await parseBody(req);
        return universalHandler(req, res);
    }

    if (url.pathname === "/api/chat" || url.pathname === "/api/chat/" || url.pathname === "/api/tutor/chat") {
        await parseBody(req);
        return chatHandler(req, res);
    }

    if (url.pathname === "/api/notion" || url.pathname === "/api/notion/") {
        await parseBody(req);
        return notionHandler(req, res);
    }

    if (url.pathname === "/api/imagekit" || url.pathname === "/api/imagekit/") {
        await parseBody(req);
        return imagekitHandler(req, res);
    }

    if (url.pathname === "/api/gcal" || url.pathname === "/api/gcal/") {
        await parseBody(req);
        return gcalHandler(req, res);
    }

    // ─────────────────────────────────────────────────────────────
    // 1.5 KILL MIC (SISTEMA MAC OS & CORE AUDIO CONTROL)
    // ─────────────────────────────────────────────────────────────
    if (url.pathname === "/api/kill-mic" || url.pathname === "/api/system/mic" || url.pathname === "/api/mic") {
        await parseBody(req);
        const action = req.body?.action || req.query.action || (req.method === 'POST' ? 'kill' : 'status');
        const reqVolume = req.body?.volume !== undefined ? Number(req.body.volume) : (req.query.volume ? Number(req.query.volume) : null);

        try {
            if (process.platform === 'darwin') {
                if (action === 'kill' || action === 'mute') {
                    execSync("osascript -e 'set volume input volume 0'");
                    return res.status(200).json({
                        success: true,
                        action: 'kill',
                        inputVolume: 0,
                        isMuted: true,
                        message: '🛑 Microfone do macOS completamente encerrado e silenciado (volume 0%).'
                    });
                } else if (action === 'unmute') {
                    const targetVol = (reqVolume && reqVolume > 0 && reqVolume <= 100) ? reqVolume : 75;
                    execSync(`osascript -e 'set volume input volume ${targetVol}'`);
                    return res.status(200).json({
                        success: true,
                        action: 'unmute',
                        inputVolume: targetVol,
                        isMuted: false,
                        message: `🎙️ Microfone do macOS reativado com sucesso (volume ${targetVol}%).`
                    });
                } else if (action === 'toggle') {
                    let cur = 0;
                    try {
                        const curStr = execSync("osascript -e 'input volume of (get volume settings)'").toString().trim();
                        cur = parseInt(curStr, 10) || 0;
                    } catch(e) { cur = 0; }

                    if (cur > 0) {
                        execSync("osascript -e 'set volume input volume 0'");
                        return res.status(200).json({
                            success: true,
                            action: 'kill',
                            inputVolume: 0,
                            isMuted: true,
                            message: '🛑 Microfone do macOS completamente encerrado e silenciado (volume 0%).'
                        });
                    } else {
                        const targetVol = (reqVolume && reqVolume > 0 && reqVolume <= 100) ? reqVolume : 75;
                        execSync(`osascript -e 'set volume input volume ${targetVol}'`);
                        return res.status(200).json({
                            success: true,
                            action: 'unmute',
                            inputVolume: targetVol,
                            isMuted: false,
                            message: `🎙️ Microfone do macOS reativado (volume ${targetVol}%).`
                        });
                    }
                } else {
                    // Status
                    let cur = 0;
                    try {
                        const curStr = execSync("osascript -e 'input volume of (get volume settings)'").toString().trim();
                        cur = parseInt(curStr, 10) || 0;
                    } catch(e) { cur = 0; }

                    return res.status(200).json({
                        success: true,
                        inputVolume: cur,
                        isMuted: cur === 0,
                        platform: 'darwin'
                    });
                }
            } else {
                return res.status(200).json({
                    success: true,
                    inputVolume: 0,
                    isMuted: true,
                    platform: process.platform,
                    message: 'Simulado para plataforma não-macOS.'
                });
            }
        } catch (err) {
            console.error('Erro no endpoint /api/kill-mic:', err);
            return res.status(500).json({ success: false, error: err.message });
        }
    }

    if (url.pathname === "/health" || url.pathname === "/api/health") {
        return res.status(200).json({ status: "ok", service: "personal_os_universal_api", time: new Date().toISOString() });
    }

    // ─────────────────────────────────────────────────────────────
    // 2. REWRITES DE ROTAS VERCEL
    // ─────────────────────────────────────────────────────────────
    let decodedPath = decodeURIComponent(url.pathname);
    if (decodedPath === "/" || decodedPath === "/index") {
        return serveStaticFile(req, res, path.join(__dirname, "index.html"));
    }
    if (decodedPath === "/chat" || decodedPath === "/ai" || decodedPath === "/tutor") {
        return serveStaticFile(req, res, path.join(__dirname, "chat.html"));
    }
    if (decodedPath === "/diary" || decodedPath === "/journal" || decodedPath === "/books") {
        return serveStaticFile(req, res, path.join(__dirname, "diary.html"));
    }
    if (decodedPath === "/calendar") {
        return serveStaticFile(req, res, path.join(__dirname, "calendar.html"));
    }
    if (decodedPath === "/admin") {
        return serveStaticFile(req, res, path.join(__dirname, "admin.html"));
    }
    if (decodedPath === "/pomodoro" || decodedPath === "/time") {
        return serveStaticFile(req, res, path.join(__dirname, "pomodoro.html"));
    }
    if (decodedPath === "/oauth") {
        return serveStaticFile(req, res, path.join(__dirname, "oauth.html"));
    }

    // ─────────────────────────────────────────────────────────────
    // 3. ARQUIVOS ESTÁTICOS
    // ─────────────────────────────────────────────────────────────
    let safePath = path.normalize(decodedPath).replace(/^(\.\.[\/\\])+/, '');
    if (safePath.startsWith('/') || safePath.startsWith('\\')) {
        safePath = safePath.slice(1);
    }

    let filePath = path.join(__dirname, safePath);
    if (fs.existsSync(filePath) && fs.statSync(filePath).isFile()) {
        return serveStaticFile(req, res, filePath);
    }

    // Tenta dentro de public/
    let publicFilePath = path.join(__dirname, "public", safePath);
    if (fs.existsSync(publicFilePath) && fs.statSync(publicFilePath).isFile()) {
        return serveStaticFile(req, res, publicFilePath);
    }

    // Se for rota sem extensão, tenta com .html
    if (!path.extname(safePath)) {
        let htmlPath = path.join(__dirname, `${safePath}.html`);
        if (fs.existsSync(htmlPath)) {
            return serveStaticFile(req, res, htmlPath);
        }
    }

    res.writeHead(404, { 'Content-Type': 'application/json; charset=utf-8' });
    res.end(JSON.stringify({ error: `Rota ou arquivo não encontrado: ${decodedPath}` }));
});

server.listen(PORT, HOST, () => {
    console.log(`\n======================================================`);
    console.log(`🚀 MCP Personal OS ativo em http://localhost:${PORT}`);
    console.log(`📔 Diário OS:        http://localhost:${PORT}/diary`);
    console.log(`📅 Pure Calendar:    http://localhost:${PORT}/calendar`);
    console.log(`⚙️ Admin Studio:     http://localhost:${PORT}/admin`);
    console.log(`💬 Chat AI Tutor:    http://localhost:${PORT}/chat`);
    console.log(`🤖 Chat API:         http://localhost:${PORT}/api/chat`);
    console.log(`⏱️ Pomodoro:         http://localhost:${PORT}/pomodoro`);
    console.log(`☁️ ImageKit API:     http://localhost:${PORT}/api/imagekit`);
    console.log(`🌐 Universal API:    http://localhost:${PORT}/api/universal`);
    console.log(`======================================================\n`);
});
