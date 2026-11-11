/**
 * api/gcal.js — Vercel Serverless Function: Google Calendar Proxy
 * CommonJS (sem "type":"module" no package.json) + leitura manual do body raw
 *
 * GET    /api/gcal?action=events   → lista eventos do calendário primário
 * POST   /api/gcal?action=create   → cria um evento novo
 * DELETE /api/gcal?action=delete   → deleta um evento pelo eventId
 */
module.exports = async function handler(req, res) {
    // CORS para o frontend do próprio site
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    const action = req.query.action || (req.body && req.body.action);

    // ─────────────────────────────────────────────────────────────
    // POST / GET /api/gcal?action=refresh (Renovação Automática Perpétua)
    // ─────────────────────────────────────────────────────────────
    if (action === 'refresh') {
        try {
            let bodyData = req.body;
            if (typeof bodyData === 'string') {
                try { bodyData = JSON.parse(bodyData); } catch(e){}
            }
            const refreshToken = req.query.refresh_token || (bodyData && bodyData.refresh_token) || 'demo_gcal_refresh_token_placeholder';
            const clientId = req.query.client_id || (bodyData && bodyData.client_id) || 'demo-client-id.apps.googleusercontent.com';
            const clientSecret = req.query.client_secret || (bodyData && bodyData.client_secret) || 'demo_gcal_client_secret_placeholder';

            const tokenRes = await fetch('https://oauth2.googleapis.com/token', {
                method: 'POST',
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                body: new URLSearchParams({
                    client_id: clientId,
                    client_secret: clientSecret,
                    refresh_token: refreshToken,
                    grant_type: 'refresh_token'
                })
            });

            const data = await tokenRes.json();
            return res.status(tokenRes.status).json(data);
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao renovar token Google: ' + err.message });
        }
    }

    const authHeader = req.headers['authorization'];
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ error: 'Token de acesso ausente.' });
    }

    // ─────────────────────────────────────────────────────────────
    // GET /api/gcal?action=events
    // ─────────────────────────────────────────────────────────────
    if (req.method === 'GET' && action === 'events') {
        try {
            const now = new Date();
            const timeMin = req.query.timeMin
                || new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString();
            const timeMax = req.query.timeMax
                || new Date(now.getFullYear(), now.getMonth() + 4, 1).toISOString();

            const gcalUrl =
                'https://www.googleapis.com/calendar/v3/calendars/primary/events' +
                '?timeMin=' + encodeURIComponent(timeMin) +
                '&timeMax=' + encodeURIComponent(timeMax) +
                '&singleEvents=true&orderBy=startTime&maxResults=250';

            const gcalRes = await fetch(gcalUrl, {
                headers: { 'Authorization': authHeader }
            });

            const data = await gcalRes.json();
            return res.status(gcalRes.status).json(data);
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao buscar eventos: ' + err.message });
        }
    }

    // ─────────────────────────────────────────────────────────────
    // POST /api/gcal?action=create
    // ─────────────────────────────────────────────────────────────
    if (req.method === 'POST' && action === 'create') {
        try {
            // Lê o body — Vercel auto-parseia JSON se Content-Type for application/json
            let payload = req.body;

            // Segurança: se vier como string, parseia
            if (typeof payload === 'string') {
                try { payload = JSON.parse(payload); } catch (e) {}
            }

            // Se ainda for undefined/null, lê o stream raw
            if (!payload) {
                payload = await new Promise((resolve, reject) => {
                    let raw = '';
                    req.on('data', chunk => { raw += chunk; });
                    req.on('end', () => {
                        try { resolve(JSON.parse(raw)); }
                        catch (e) { resolve({}); }
                    });
                    req.on('error', reject);
                });
            }

            const gcalRes = await fetch(
                'https://www.googleapis.com/calendar/v3/calendars/primary/events',
                {
                    method: 'POST',
                    headers: {
                        'Authorization': authHeader,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(payload)
                }
            );

            const data = await gcalRes.json();
            return res.status(gcalRes.status).json(data);
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao criar evento: ' + err.message });
        }
    }

    // ─────────────────────────────────────────────────────────────
    // DELETE /api/gcal?action=delete&eventId=...
    // ─────────────────────────────────────────────────────────────
    if (req.method === 'DELETE' || action === 'delete') {
        try {
            const eventId = req.query.eventId || (req.body && req.body.eventId);
            if (!eventId) {
                return res.status(400).json({ error: 'eventId ausente.' });
            }

            const gcalUrl = `https://www.googleapis.com/calendar/v3/calendars/primary/events/${encodeURIComponent(eventId)}`;
            const gcalRes = await fetch(gcalUrl, {
                method: 'DELETE',
                headers: { 'Authorization': authHeader }
            });

            if (gcalRes.status === 204 || gcalRes.ok) {
                return res.status(200).json({ success: true });
            }

            let data = {};
            try { data = await gcalRes.json(); } catch (e) {}
            return res.status(gcalRes.status).json(data);
        } catch (err) {
            return res.status(500).json({ error: 'Erro ao deletar evento: ' + err.message });
        }
    }

    return res.status(400).json({ error: 'Use ?action=events, ?action=create ou ?action=delete' });
};
