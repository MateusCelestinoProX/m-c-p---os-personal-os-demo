/**
 * api/notion.js — Vercel Serverless Function: Notion Tasks & Alarms Proxy
 * Suporta execução Serverless (Vercel) e nativa Node.js / HTTP Server.
 *
 * Ações:
 * GET/POST /api/notion?action=test         → Verifica o token e lista workspaces/páginas autorizadas
 * GET/POST /api/notion?action=search       → Busca bases e páginas compartilhadas
 * GET/POST /api/notion?action=fetch_tasks  → Extrai tarefas, prazos e alarmes de uma página ou database
 * POST     /api/notion?action=toggle       → Atualiza o checkbox de uma tarefa no Notion
 */

const DEFAULT_NOTION_TOKEN = '';
const DEFAULT_DATABASE_ID = '3e28112a-6332-80c1-ba2c-ed849c99686e';
const NOTION_API_VERSION = '2022-06-28';

/**
 * Normaliza um ID ou URL do Notion para formato UUID canônico de 32 hexadecimais com hífens
 */
function normalizeNotionId(input) {
    if (!input || typeof input !== 'string') return null;
    let clean = input.trim();
    
    // Se for URL, extrai o slug final
    if (clean.includes('notion.so') || clean.includes('notion.site')) {
        const parts = clean.split('?')[0].split('/');
        clean = parts[parts.length - 1];
    }

    // Pega os últimos 32 caracteres hexadecimais (IDs do Notion têm 32 caracteres hex no final)
    const match = clean.match(/([a-f0-9]{32})/i);
    if (match) {
        const raw = match[1];
        return `${raw.slice(0, 8)}-${raw.slice(8, 12)}-${raw.slice(12, 16)}-${raw.slice(16, 20)}-${raw.slice(20)}`;
    }

    // Se já tiver hífens (UUID format)
    const uuidMatch = clean.match(/([a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12})/i);
    if (uuidMatch) {
        return uuidMatch[1];
    }

    return clean;
}

/**
 * Helper para chamadas seguras à API do Notion
 */
async function notionRequest(endpoint, method = 'GET', body = null, token = DEFAULT_NOTION_TOKEN) {
    const url = `https://api.notion.com/v1/${endpoint}`;
    const headers = {
        'Authorization': `Bearer ${token}`,
        'Notion-Version': NOTION_API_VERSION,
        'Content-Type': 'application/json'
    };

    const options = { method, headers };
    if (body && (method === 'POST' || method === 'PATCH')) {
        options.body = JSON.stringify(body);
    }

    const response = await fetch(url, options);
    const data = await response.json();
    return { ok: response.ok, status: response.status, data };
}

/**
 * Analisa rich_text de um bloco Notion para extrair texto, datas de menções (@remind) e alarmes
 */
function parseRichTextAndAlarms(richTextArray) {
    if (!Array.isArray(richTextArray)) return { title: '', dueDate: null, dueTime: null, hasAlarm: false };

    let fullText = '';
    let dueDate = null;
    let dueTime = null;
    let hasAlarm = false;

    richTextArray.forEach(chunk => {
        fullText += chunk.plain_text || '';

        // Detecção de Menção com Data/Lembrete do Notion
        if (chunk.type === 'mention' && chunk.mention && chunk.mention.date) {
            const dateObj = chunk.mention.date;
            if (dateObj.start) {
                // dateObj.start pode ser "2026-09-22" ou "2026-09-22T14:30:00.000-03:00"
                if (dateObj.start.includes('T')) {
                    const parsedDate = new Date(dateObj.start);
                    if (!isNaN(parsedDate.getTime())) {
                        const strBrt = parsedDate.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
                        const bDate = new Date(strBrt);
                        dueDate = `${bDate.getFullYear()}-${String(bDate.getMonth() + 1).padStart(2, '0')}-${String(bDate.getDate()).padStart(2, '0')}`;
                        dueTime = `${String(bDate.getHours()).padStart(2, '0')}:${String(bDate.getMinutes()).padStart(2, '0')}`;
                        hasAlarm = true;
                    }
                } else {
                    dueDate = dateObj.start.slice(0, 10);
                }
            }
        }
    });

    fullText = fullText.trim();

    // Fallback inteligente via Regex no texto para horários manuais caso não use @mention
    if (!dueTime) {
        const timeMatch = fullText.match(/\b([01]?\d|2[0-3]):([0-5]\d)\b/);
        if (timeMatch) {
            dueTime = `${timeMatch[1].padStart(2, '0')}:${timeMatch[2]}`;
            hasAlarm = true;
        } else {
            const shortHourMatch = fullText.match(/\b([01]?\d|2[0-3])h([0-5]\d)?\b/i);
            if (shortHourMatch) {
                const hh = shortHourMatch[1].padStart(2, '0');
                const mm = shortHourMatch[2] ? shortHourMatch[2].padStart(2, '0') : '00';
                dueTime = `${hh}:${mm}`;
                hasAlarm = true;
            }
        }
    }

    // Fallback de data via Regex DD/MM ou DD/MM/YYYY
    if (!dueDate) {
        const dateMatch = fullText.match(/\b(\d{1,2})\/(\d{1,2})(?:\/(\d{2,4}))?\b/);
        if (dateMatch) {
            const curYear = new Date().getFullYear();
            const day = dateMatch[1].padStart(2, '0');
            const month = dateMatch[2].padStart(2, '0');
            const year = dateMatch[3] ? (dateMatch[3].length === 2 ? `20${dateMatch[3]}` : dateMatch[3]) : curYear;
            dueDate = `${year}-${month}-${day}`;
        }
    }

    return { title: fullText, dueDate, dueTime, hasAlarm };
}

/**
 * Detecta a prioridade baseando-se no texto
 */
function detectPriority(text) {
    if (!text) return 'normal';
    const lower = text.toLowerCase();
    if (lower.includes('urgente') || lower.includes('crítico') || lower.includes('critico') || lower.includes('🔥') || lower.includes('asap')) {
        return 'urgent';
    }
    if (lower.includes('alta') || lower.includes('prioridade') || lower.includes('importante') || lower.includes('⚡') || lower.includes('alerta')) {
        return 'high';
    }
    if (lower.includes('baixa') || lower.includes('quando der') || lower.includes('leitura') || lower.includes('🌱')) {
        return 'low';
    }
    return 'normal';
}

/**
 * Extrai blocos recursivamente de uma página
 */
async function extractBlocksFromPage(blockId, token, maxDepth = 2, currentDepth = 0) {
    const tasks = [];
    if (currentDepth > maxDepth) return tasks;

    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
        const queryParams = new URLSearchParams({ page_size: '100' });
        if (startCursor) queryParams.set('start_cursor', startCursor);

        const res = await notionRequest(`blocks/${blockId}/children?${queryParams.toString()}`, 'GET', null, token);
        if (!res.ok || !res.data || !Array.isArray(res.data.results)) {
            break;
        }

        for (const block of res.data.results) {
            // 1. Bloco de Checklist / Tarefa (to_do)
            if (block.type === 'to_do' && block.to_do) {
                const parsed = parseRichTextAndAlarms(block.to_do.rich_text);
                if (parsed.title) {
                    tasks.push({
                        id: `notion_block_${block.id}`,
                        notion_block_id: block.id,
                        notion_type: 'block_todo',
                        title: parsed.title,
                        is_completed: !!block.to_do.checked,
                        due_date: parsed.dueDate,
                        due_time: parsed.dueTime,
                        has_alarm: parsed.hasAlarm,
                        priority: detectPriority(parsed.title),
                        created_at: block.created_time || new Date().toISOString()
                    });
                }
            }

            // 2. Database Inline incorporado na página
            else if (block.type === 'child_database') {
                const dbTasks = await extractFromDatabase(block.id, token);
                tasks.push(...dbTasks);
            }

            // 3. Blocos com sub-itens
            if (block.has_children && block.type !== 'child_database') {
                const subTasks = await extractBlocksFromPage(block.id, token, maxDepth, currentDepth + 1);
                tasks.push(...subTasks);
            }
        }

        hasMore = res.data.has_more;
        startCursor = res.data.next_cursor;
    }

    return tasks;
}

/**
 * Extrai tarefas caso a página seja um Database
 */
async function extractFromDatabase(databaseId, token) {
    const tasks = [];
    let hasMore = true;
    let startCursor = undefined;

    while (hasMore) {
        const body = { page_size: 100 };
        if (startCursor) body.start_cursor = startCursor;

        const res = await notionRequest(`databases/${databaseId}/query`, 'POST', body, token);
        if (!res.ok || !res.data || !Array.isArray(res.data.results)) {
            break;
        }

        for (const page of res.data.results) {
            const props = page.properties || {};
            let title = '';
            let isCompleted = false;
            let dueDate = null;
            let dueTime = null;
            let hasAlarm = false;
            let priority = 'normal';

            // Varre propriedades procurando Título, Status/Checkbox e Data
            for (const [propName, prop] of Object.entries(props)) {
                if (prop.type === 'title' && Array.isArray(prop.title)) {
                    title = prop.title.map(t => t.plain_text).join('').trim();
                } else if (prop.type === 'checkbox') {
                    isCompleted = !!prop.checkbox;
                } else if (prop.type === 'status' && prop.status) {
                    const statusName = (prop.status.name || '').toLowerCase();
                    if (statusName === 'done' || statusName === 'concluído' || statusName === 'concluida' || statusName === 'finalizado') {
                        isCompleted = true;
                    }
                } else if (prop.type === 'date' && prop.date && prop.date.start) {
                    const dStart = prop.date.start;
                    if (dStart.includes('T')) {
                        const parsedDate = new Date(dStart);
                        if (!isNaN(parsedDate.getTime())) {
                            const strBrt = parsedDate.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
                            const bDate = new Date(strBrt);
                            dueDate = `${bDate.getFullYear()}-${String(bDate.getMonth() + 1).padStart(2, '0')}-${String(bDate.getDate()).padStart(2, '0')}`;
                            dueTime = `${String(bDate.getHours()).padStart(2, '0')}:${String(bDate.getMinutes()).padStart(2, '0')}`;
                            hasAlarm = true;
                        }
                    } else {
                        dueDate = dStart.slice(0, 10);
                    }
                } else if (prop.type === 'select' && prop.select && prop.select.name) {
                    const selName = prop.select.name.toLowerCase();
                    if (selName.includes('urgente') || selName.includes('crítica') || selName.includes('urgent')) priority = 'urgent';
                    else if (selName.includes('alta') || selName.includes('high')) priority = 'high';
                    else if (selName.includes('baixa') || selName.includes('low')) priority = 'low';
                }
            }

            if (title) {
                tasks.push({
                    id: `notion_page_${page.id}`,
                    notion_page_id: page.id,
                    notion_type: 'database_row',
                    title: title,
                    is_completed: isCompleted,
                    due_date: dueDate,
                    due_time: dueTime,
                    has_alarm: hasAlarm,
                    priority: priority,
                    created_at: page.created_time || new Date().toISOString()
                });
            }
        }

        hasMore = res.data.has_more;
        startCursor = res.data.next_cursor;
    }

    return tasks;
}

module.exports = async function handler(req, res) {
    // Cabeçalhos CORS Universais
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PATCH, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }

    // Leitura flexível de parâmetros (query ou body)
    let bodyData = req.body;
    if (typeof bodyData === 'string') {
        try { bodyData = JSON.parse(bodyData); } catch(e) {}
    }
    if (!bodyData && req.method === 'POST') {
        bodyData = await new Promise((resolve) => {
            let raw = '';
            req.on('data', chunk => { raw += chunk; });
            req.on('end', () => {
                try { resolve(JSON.parse(raw)); }
                catch (e) { resolve({}); }
            });
            req.on('error', () => resolve({}));
        });
    }
    bodyData = bodyData || {};

    const action = req.query.action || bodyData.action || 'fetch_tasks';
    const authHeader = req.headers['authorization'];
    const token = (authHeader && authHeader.startsWith('Bearer ')) 
        ? authHeader.slice(7).trim() 
        : (req.query.token || bodyData.token || DEFAULT_NOTION_TOKEN);

    // ─────────────────────────────────────────────────────────────
    // 1. ACTION: TEST & VERIFY TOKEN
    // ─────────────────────────────────────────────────────────────
    if (action === 'test') {
        try {
            const userRes = await notionRequest('users/me', 'GET', null, token);
            if (!userRes.ok) {
                return res.status(userRes.status).json({ 
                    ok: false, 
                    error: 'Token do Notion inválido ou sem permissões.', 
                    details: userRes.data 
                });
            }

            const searchRes = await notionRequest('search', 'POST', { page_size: 20 }, token);
            return res.status(200).json({
                ok: true,
                bot: userRes.data,
                shared_count: searchRes.ok && searchRes.data ? (searchRes.data.results || []).length : 0,
                shared_items: searchRes.ok && searchRes.data ? (searchRes.data.results || []).map(r => ({
                    id: r.id,
                    type: r.object,
                    title: r.properties && r.properties.title ? r.properties.title.title?.map(t => t.plain_text).join('') : (r.title ? r.title.map(t => t.plain_text).join('') : 'Sem título'),
                    url: r.url
                })) : []
            });
        } catch (err) {
            return res.status(500).json({ ok: false, error: 'Falha ao testar conexão: ' + err.message });
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 2. ACTION: SEARCH SHARED PAGES & DATABASES
    // ─────────────────────────────────────────────────────────────
    if (action === 'search') {
        try {
            const searchRes = await notionRequest('search', 'POST', { page_size: 50 }, token);
            if (!searchRes.ok) {
                return res.status(searchRes.status).json({ ok: false, error: 'Erro ao buscar páginas.', details: searchRes.data });
            }
            return res.status(200).json({ ok: true, data: searchRes.data });
        } catch (err) {
            return res.status(500).json({ ok: false, error: 'Erro no search: ' + err.message });
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 3. ACTION: FETCH TASKS (PAGE / DATABASE / AUTO)
    // ─────────────────────────────────────────────────────────────
    if (action === 'fetch_tasks') {
        try {
            const inputPageId = req.query.page_id || bodyData.page_id;
            const targetId = normalizeNotionId(inputPageId) || DEFAULT_DATABASE_ID;

            // Se nenhum ID for passado, tenta descobrir via search se há páginas conectadas
            let finalTargetId = targetId;
            if (!finalTargetId) {
                const searchRes = await notionRequest('search', 'POST', { page_size: 10 }, token);
                if (searchRes.ok && searchRes.data && searchRes.data.results && searchRes.data.results.length > 0) {
                    finalTargetId = searchRes.data.results[0].id;
                }
            }

            if (!finalTargetId) {
                return res.status(200).json({
                    ok: false,
                    needs_page_id: true,
                    message: 'Nenhuma página do Notion foi vinculada ainda. Conecte a conexão TASKS à sua página no Notion ou insira o link/ID da página.',
                    tasks: []
                });
            }

            // Tenta obter como página primeiro
            const pageRes = await notionRequest(`pages/${finalTargetId}`, 'GET', null, token);
            let tasks = [];
            let containerTitle = 'Página Notion';

            if (pageRes.ok) {
                // É uma página: extrai blocos de checklist recursivamente
                const props = pageRes.data.properties || {};
                for (const p of Object.values(props)) {
                    if (p.type === 'title' && Array.isArray(p.title)) {
                        containerTitle = p.title.map(t => t.plain_text).join('').trim() || containerTitle;
                    }
                }
                tasks = await extractBlocksFromPage(finalTargetId, token);
            } else {
                // Tenta como database
                const dbRes = await notionRequest(`databases/${finalTargetId}`, 'GET', null, token);
                if (dbRes.ok) {
                    if (dbRes.data.title && Array.isArray(dbRes.data.title)) {
                        containerTitle = dbRes.data.title.map(t => t.plain_text).join('').trim() || containerTitle;
                    }
                    tasks = await extractFromDatabase(finalTargetId, token);
                } else {
                    return res.status(404).json({
                        ok: false,
                        error: `Não foi possível acessar a página/base "${finalTargetId}". Certifique-se de que a conexão "TASKS" foi adicionada em "..." -> Conexões dentro da página no Notion.`,
                        details: pageRes.data
                    });
                }
            }

            return res.status(200).json({
                ok: true,
                target_id: finalTargetId,
                title: containerTitle,
                count: tasks.length,
                alarms_count: tasks.filter(t => t.has_alarm).length,
                completed_count: tasks.filter(t => t.is_completed).length,
                tasks: tasks
            });

        } catch (err) {
            return res.status(500).json({ ok: false, error: 'Erro ao extrair tarefas do Notion: ' + err.message });
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 4. ACTION: CREATE TASK (PERSONAL OS ➔ NOTION)
    // ─────────────────────────────────────────────────────────────
    if (action === 'create_task' || action === 'push_task') {
        try {
            const rawDbId = bodyData.database_id || req.query.database_id || bodyData.page_id || req.query.page_id || DEFAULT_DATABASE_ID;
            const databaseId = normalizeNotionId(rawDbId);
            const title = (bodyData.title || req.query.title || 'Novo Alarme / Lembrete').trim();
            const dueDate = bodyData.due_date || req.query.due_date || null;
            const dueTime = bodyData.due_time || req.query.due_time || null;
            const isCompleted = bodyData.is_completed !== undefined ? !!bodyData.is_completed : false;
            const statusName = bodyData.status || (isCompleted ? 'Concluída' : 'A fazer');
            const notes = bodyData.notes || '';

            // Busca esquema do Database para mapeamento dinâmico
            const dbRes = await notionRequest(`databases/${databaseId}`, 'GET', null, token);
            let titlePropName = 'Nome da tarefa';
            let statusPropName = 'Status';
            let datePropName = 'Prazo';
            let hasStatus = false;
            let hasCheckbox = false;
            let checkboxPropName = '';

            if (dbRes.ok && dbRes.data && dbRes.data.properties) {
                for (const [name, prop] of Object.entries(dbRes.data.properties)) {
                    if (prop.type === 'title') titlePropName = name;
                    else if (prop.type === 'status') { statusPropName = name; hasStatus = true; }
                    else if (prop.type === 'checkbox') { checkboxPropName = name; hasCheckbox = true; }
                    else if (prop.type === 'date') datePropName = name;
                }
            }

            const pageProperties = {};
            pageProperties[titlePropName] = {
                title: [{ text: { content: title } }]
            };

            if (hasStatus || statusPropName) {
                pageProperties[statusPropName] = {
                    status: { name: statusName }
                };
            } else if (hasCheckbox && checkboxPropName) {
                pageProperties[checkboxPropName] = {
                    checkbox: isCompleted
                };
            }

            if (dueDate) {
                let isoDate = dueDate;
                if (dueTime) {
                    const normTime = dueTime.length === 5 ? `${dueTime}:00` : dueTime;
                    isoDate = `${dueDate}T${normTime}-03:00`;
                }
                pageProperties[datePropName] = {
                    date: { start: isoDate }
                };
            }

            const createBody = {
                parent: { database_id: databaseId },
                properties: pageProperties
            };

            if (notes && typeof notes === 'string') {
                createBody.children = [
                    {
                        object: 'block',
                        type: 'paragraph',
                        paragraph: {
                            rich_text: [{ type: 'text', text: { content: notes } }]
                        }
                    }
                ];
            }

            const createRes = await notionRequest('pages', 'POST', createBody, token);
            if (!createRes.ok) {
                return res.status(createRes.status).json({
                    ok: false,
                    error: 'Erro ao criar tarefa no Notion.',
                    details: createRes.data
                });
            }

            return res.status(200).json({
                ok: true,
                id: createRes.data.id,
                url: createRes.data.url,
                task: {
                    id: `notion_page_${createRes.data.id}`,
                    notion_page_id: createRes.data.id,
                    title: title,
                    due_date: dueDate,
                    due_time: dueTime,
                    is_completed: isCompleted,
                    status: statusName
                }
            });
        } catch (err) {
            return res.status(500).json({ ok: false, error: 'Falha ao criar tarefa no Notion: ' + err.message });
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 5. ACTION: UPDATE TASK (PERSONAL OS ➔ NOTION)
    // ─────────────────────────────────────────────────────────────
    if (action === 'update_task') {
        try {
            const pageId = req.query.page_id || bodyData.page_id;
            const blockId = req.query.block_id || bodyData.block_id;

            if (!pageId && !blockId) {
                return res.status(400).json({ ok: false, error: 'page_id ou block_id é obrigatório para update_task.' });
            }

            if (blockId) {
                const cleanBlockId = normalizeNotionId(blockId);
                const patchObj = {};
                if (bodyData.checked !== undefined || bodyData.is_completed !== undefined) {
                    const chk = bodyData.checked !== undefined ? !!bodyData.checked : !!bodyData.is_completed;
                    patchObj.to_do = { checked: chk };
                }
                const patchRes = await notionRequest(`blocks/${cleanBlockId}`, 'PATCH', patchObj, token);
                return res.status(patchRes.status).json({ ok: patchRes.ok, data: patchRes.data });
            }

            const cleanPageId = normalizeNotionId(pageId);
            const getRes = await notionRequest(`pages/${cleanPageId}`, 'GET', null, token);
            if (!getRes.ok) return res.status(getRes.status).json({ ok: false, details: getRes.data });

            const props = getRes.data.properties || {};
            const patchProperties = {};

            // 1. Título
            if (bodyData.title) {
                for (const [name, p] of Object.entries(props)) {
                    if (p.type === 'title') {
                        patchProperties[name] = { title: [{ text: { content: bodyData.title.trim() } }] };
                        break;
                    }
                }
            }

            // 2. Status ou Checkbox
            if (bodyData.is_completed !== undefined || bodyData.status || bodyData.checked !== undefined) {
                const isComp = bodyData.is_completed !== undefined ? !!bodyData.is_completed : (bodyData.checked !== undefined ? !!bodyData.checked : null);
                for (const [name, p] of Object.entries(props)) {
                    if (p.type === 'status') {
                        const statusVal = bodyData.status || (isComp ? 'Concluída' : 'A fazer');
                        patchProperties[name] = { status: { name: statusVal } };
                        break;
                    } else if (p.type === 'checkbox') {
                        patchProperties[name] = { checkbox: isComp !== null ? isComp : false };
                        break;
                    }
                }
            }

            // 3. Prazo / Alarme (Data e Hora)
            if (bodyData.due_date !== undefined) {
                for (const [name, p] of Object.entries(props)) {
                    if (p.type === 'date') {
                        if (bodyData.due_date) {
                            let isoDate = bodyData.due_date;
                            if (bodyData.due_time) {
                                const normTime = bodyData.due_time.length === 5 ? `${bodyData.due_time}:00` : bodyData.due_time;
                                isoDate = `${bodyData.due_date}T${normTime}-03:00`;
                            }
                            patchProperties[name] = { date: { start: isoDate } };
                        } else {
                            patchProperties[name] = { date: null };
                        }
                        break;
                    }
                }
            }

            const patchRes = await notionRequest(`pages/${cleanPageId}`, 'PATCH', {
                properties: patchProperties
            }, token);

            return res.status(patchRes.status).json({ ok: patchRes.ok, data: patchRes.data });
        } catch (err) {
            return res.status(500).json({ ok: false, error: 'Erro ao atualizar tarefa no Notion: ' + err.message });
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 6. ACTION: ARCHIVE / DELETE TASK (PERSONAL OS ➔ NOTION)
    // ─────────────────────────────────────────────────────────────
    if (action === 'delete_task' || action === 'archive_task') {
        try {
            const pageId = req.query.page_id || bodyData.page_id;
            const blockId = req.query.block_id || bodyData.block_id;

            if (pageId) {
                const cleanPageId = normalizeNotionId(pageId);
                const delRes = await notionRequest(`pages/${cleanPageId}`, 'PATCH', { archived: true }, token);
                return res.status(delRes.status).json({ ok: delRes.ok, data: delRes.data });
            }

            if (blockId) {
                const cleanBlockId = normalizeNotionId(blockId);
                const delRes = await notionRequest(`blocks/${cleanBlockId}`, 'DELETE', null, token);
                return res.status(delRes.status).json({ ok: delRes.ok, data: delRes.data });
            }

            return res.status(400).json({ ok: false, error: 'page_id ou block_id é obrigatório para exclusão.' });
        } catch (err) {
            return res.status(500).json({ ok: false, error: 'Erro ao excluir/arquivar tarefa no Notion: ' + err.message });
        }
    }

    // ─────────────────────────────────────────────────────────────
    // 7. ACTION: TOGGLE TASK STATUS (CHECK/UNCHECK)
    // ─────────────────────────────────────────────────────────────
    if (action === 'toggle') {
        try {
            const blockId = req.query.block_id || bodyData.block_id;
            const pageId = req.query.page_id || bodyData.page_id;
            const checked = bodyData.checked !== undefined ? !!bodyData.checked : true;

            if (blockId) {
                const cleanBlockId = normalizeNotionId(blockId);
                const patchRes = await notionRequest(`blocks/${cleanBlockId}`, 'PATCH', {
                    to_do: { checked: checked }
                }, token);
                return res.status(patchRes.status).json({ ok: patchRes.ok, data: patchRes.data });
            }

            if (pageId) {
                const cleanPageId = normalizeNotionId(pageId);
                const getRes = await notionRequest(`pages/${cleanPageId}`, 'GET', null, token);
                if (!getRes.ok) return res.status(getRes.status).json({ ok: false, details: getRes.data });

                let patchProperties = {};
                const props = getRes.data.properties || {};

                for (const [name, p] of Object.entries(props)) {
                    if (p.type === 'status') {
                        const statusVal = checked ? 'Concluída' : 'A fazer';
                        patchProperties[name] = { status: { name: statusVal } };
                        break;
                    } else if (p.type === 'checkbox') {
                        patchProperties[name] = { checkbox: checked };
                        break;
                    }
                }

                const patchRes = await notionRequest(`pages/${cleanPageId}`, 'PATCH', {
                    properties: patchProperties
                }, token);
                return res.status(patchRes.status).json({ ok: patchRes.ok, data: patchRes.data });
            }

            return res.status(400).json({ ok: false, error: 'block_id ou page_id é obrigatório para toggle.' });
        } catch (err) {
            return res.status(500).json({ ok: false, error: 'Erro ao alternar status da tarefa no Notion: ' + err.message });
        }
    }

    return res.status(400).json({ ok: false, error: 'Ação não reconhecida. Use ?action=test, ?action=search, ?action=fetch_tasks, ?action=create_task, ?action=update_task, ?action=delete_task ou ?action=toggle' });
};
