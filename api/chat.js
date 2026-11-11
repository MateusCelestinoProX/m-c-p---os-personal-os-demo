/**
 * api/chat.js — AI Agent Conversacional-First & Pensamento Prévio do MCP Personal OS
 * Arquitetura deliberativa: pensa em silêncio (<thought>) antes de falar ou agir,
 * mantém abordagem gentil, suave, calma e estritamente profissional.
 */

process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';

const universalHandler = require('./universal.js');
const { executeUniversalAction } = universalHandler;

const OMNIROUTE_FUNNEL_URL = 'https://instance-20260907-0637.tail798a9b.ts.net/v1/chat/completions';
const OMNIROUTE_PORT_10000_URL = 'https://instance-20260907-0637.tail798a9b.ts.net:10000/v1/chat/completions';
const OMNIROUTE_TAILSCALE_URL = 'https://instance-20260907-0637.tail798a9b.ts.net:20128/v1/chat/completions';
const OMNIROUTE_DIRECT_IP_URL = 'http://100.99.207.96:20128/v1/chat/completions';
const OMNIROUTE_LOCAL_URL = process.env.OMNIROUTE_URL || 'http://127.0.0.1:20128/v1/chat/completions';
const OMNIROUTE_API_KEY = process.env.OMNIROUTE_API_KEY || '';

// Helper para obter dados em tempo real da Universal API
async function fetchUniversalSnapshot() {
    return new Promise((resolve) => {
        try {
            const req = {
                headers: { authorization: 'Bearer mcpos_ai_agent_universal_key_2026' },
                query: { scope: 'all' },
                method: 'GET'
            };
            const res = {
                statusCode: 200,
                setHeader: () => {},
                end: (str) => {
                    try {
                        const data = JSON.parse(str);
                        resolve(data);
                    } catch {
                        resolve(null);
                    }
                }
            };
            universalHandler(req, res);
        } catch {
            resolve(null);
        }
    });
}

/**
 * Classificação prévia de intenção para evitar viés de relatórios não solicitados
 * quando o usuário está apenas cumprimentando ou conversando livremente.
 */
function analyzeContextIntent(message, history = []) {
    const text = String(message || '').trim();
    const words = text.split(/\s+/).filter(Boolean);

    const greetingRegex = /^(oi+|ol[aá]+|ola+|bom dia|boa tarde|boa noite|tudo bem|td bem|como vai|e a[ií]|hey|hello|hi|opa|salve|oi tutor|ol[aá] tutor)[!?.,\s]*$/i;
    const isCasualGreeting = words.length <= 5 && greetingRegex.test(text);

    const systemKeywords = /(h[aá]bito|h[aá]bitos|di[aá]rio|pomodoro|foco|tarefa|tarefas|todo|to-do|rotina|resumo|progresso|status|andamento|meta|metas|agenda|calend[aá]rio|organizar|estudo|iniciar|come[cç]ar|criar|marcar|registrar|anotar|pausar|concluir|abrir|meu dia|para hoje|fiz hoje)/i;

    const recentUserMessages = Array.isArray(history)
        ? history.slice(-4).filter(m => m && m.role === 'user').map(m => String(m.content || ''))
        : [];

    const needsSystemState = !isCasualGreeting && (
        systemKeywords.test(text) ||
        recentUserMessages.some(prev => systemKeywords.test(prev))
    );

    return { isCasualGreeting, needsSystemState };
}

/**
 * Extrai pensamentos internos (<thought>, <think>, <reasoning>) mantendo-os
 * totalmente isolados da resposta entregue ao usuário.
 */
function extractAndStripReasoning(rawText) {
    let thoughtParts = [];
    let stripped = String(rawText || '');

    const tagPatterns = [
        /<thought>([\s\S]*?)<\/thought>/gi,
        /<think>([\s\S]*?)<\/think>/gi,
        /<reasoning>([\s\S]*?)<\/reasoning>/gi
    ];

    for (const pattern of tagPatterns) {
        stripped = stripped.replace(pattern, (_, inner) => {
            if (inner && inner.trim()) thoughtParts.push(inner.trim());
            return '';
        });
    }

    // Proteção contra tags de pensamento abertas e não fechadas em caso de corte de stream/tokens
    stripped = stripped.replace(/<(thought|think|reasoning)>[\s\S]*$/gi, '');

    return {
        thought: thoughtParts.join('\n---\n'),
        visibleText: stripped.trim()
    };
}

async function requestLlmCompletion(messages) {
    const models = [
        'openrouter/auto',
        'combo/deskcomm-memory',
        'deepseek-web/deepseek-chat'
    ];

    const targetUrls = [
        OMNIROUTE_FUNNEL_URL,
        OMNIROUTE_PORT_10000_URL,
        OMNIROUTE_TAILSCALE_URL,
        OMNIROUTE_DIRECT_IP_URL,
        OMNIROUTE_LOCAL_URL
    ];

    let lastError = null;

    for (const targetUrl of targetUrls) {
        for (const model of models) {
            try {
                const controller = new AbortController();
                const timeoutId = setTimeout(() => controller.abort(), 15000);

                const response = await fetch(targetUrl, {
                    method: 'POST',
                    headers: {
                        'Authorization': `Bearer ${OMNIROUTE_API_KEY}`,
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        model,
                        messages,
                        temperature: 0.55,
                        max_tokens: 1200
                    }),
                    signal: controller.signal
                });

                clearTimeout(timeoutId);

                if (!response.ok) {
                    const errorText = await response.text();
                    lastError = new Error(`HTTP ${response.status}: ${errorText.slice(0, 200)}`);
                    continue;
                }

                const data = await response.json();
                const reply = data?.choices?.[0]?.message?.content;
                if (reply) {
                    return {
                        reply: reply.trim(),
                        model,
                        provider: targetUrl.includes('tail798a9b.ts.net/v1') ? 'funnel_omniroute_443' : (targetUrl.includes(':10000') ? 'funnel_omniroute_10000' : (targetUrl.includes('tail798a9b') ? 'tailscale_omniroute' : (targetUrl.includes('100.99') ? 'direct_ip_omniroute' : 'local_omniroute')))
                    };
                }
            } catch (err) {
                lastError = err;
                if (err.cause?.code === 'ECONNREFUSED' || err.message?.includes('ECONNREFUSED')) {
                    break;
                }
            }
        }
    }

    throw lastError || new Error('Não foi possível obter resposta do Tutor AI nos gateways configurados.');
}

module.exports = async function chatHandler(req, res) {
    // CORS
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', '*');

    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        return res.end();
    }

    try {
        let body = req.body;
        if (typeof body === 'string') {
            try { body = JSON.parse(body); } catch { body = {}; }
        }
        if (!body && req.method === 'POST') {
            body = await new Promise((resolve) => {
                let raw = '';
                req.on('data', chunk => { raw += chunk; });
                req.on('end', () => {
                    try { resolve(JSON.parse(raw)); }
                    catch (e) { resolve({}); }
                });
                req.on('error', () => resolve({}));
            });
        }
        body = body || {};

        const userMessage = body.message || body.prompt || '';
        if (!userMessage.trim()) {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.end(JSON.stringify({ error: 'Parâmetro message é obrigatório.' }));
        }

        const sessionId = body.sessionId || `session_${Date.now()}`;
        const history = Array.isArray(body.history) ? body.history : [];

        // 1. Análise de Intenção + Snapshot silencioso em paralelo
        const intent = analyzeContextIntent(userMessage, history);
        const snapshot = await fetchUniversalSnapshot();

        const diaryInfo = snapshot?.diary || {};
        const habitsInfo = snapshot?.habits || {};
        const pomodoroInfo = snapshot?.pomodoro || {};
        const todosInfo = snapshot?.todos || {};

        const hasWrittenDiary = Boolean(diaryInfo.has_written_today);
        const diarySummary = hasWrittenDiary
            ? `já possui registro hoje (${diaryInfo.words_count_today || 0} palavras)`
            : 'sem registros escritos hoje';
        const habitsRate = habitsInfo.completion_rate_percent !== undefined ? `${habitsInfo.completion_rate_percent}%` : '0%';
        const habitsCompleted = (habitsInfo.completed_today || []).join(', ') || 'nenhum registrado ainda';
        const habitsPending = (habitsInfo.pending_today || []).join(', ') || 'nenhum em aberto';
        const focusMinutes = pomodoroInfo.summary?.today_minutes || 0;
        const pomodoroCycles = pomodoroInfo.summary?.today_cycles || 0;
        const pendingTasks = (todosInfo.pending_tasks || []).map(t => t.title || t).slice(0, 6).join('; ') || 'nenhuma tarefa cadastrada em aberto';

        // Só expõe métricas detalhadas ao prompt quando o diálogo toca na rotina ou sistema.
        // Caso contrário, evita qualquer viés de despejar auditorias não solicitadas.
        const contextBlock = intent.needsSystemState
            ? `CONTEXTO ATUAL DO PERSONAL OS (USE COM DELICADEZA, APENAS NO QUE AJUDAR A RESPONDER):
- Diário de hoje: ${diarySummary}.
- Hábitos hoje: ${habitsRate} concluídos (Concluídos: [${habitsCompleted}] | Em aberto: [${habitsPending}]).
- Foco (Pomodoro): ${focusMinutes} minutos acumulados hoje (${pomodoroCycles} ciclos).
- Tarefas em aberto: [${pendingTasks}].`
            : `CONTEXTO DO MOMENTO:
O usuário está em conversa livre ou saudação inicial. NÃO mencione métricas zeradas, diário vazio, hábitos ou relatórios a menos que ele peça explicitamente.`;

        // 2. System Prompt Oficial — Conversacional-First, Gentil, Suave, Calmo e Deliberativo
        const systemPrompt = `Você é o Tutor AI do Personal OS, um assistente pessoal conversacional com postura serena, gentil, suave, paciente e altamente profissional, conversando com Celestino.

SUA PERSONALIDADE & TOM DE VOZ:
- Seja gentil, calmo, acolhedor e respeitoso. Fale como um parceiro de conversa humano maduro e tranquilo.
- Mantenha leveza e fluidez natural. Use "Celestino" apenas quando soar natural e afetuoso na conversa — sem repetir títulos robóticos em toda mensagem.
- PROIBIDO adotar tom militar, agressivo, ansioso ou de "coach de pressão". Nunca use termos como "postura ereta", "ataque", "na mira", "em marcha", "tração zero", "cobrança", "diretiva", nem faça relatórios mecânicos com semáforos (🔴/🟢).
- CONCISÃO & PROPORCIONALIDADE: Nunca envie "paredões de texto" sem necessidade.
  - Se Celestino mandar uma saudação simples ("olá", "oi", "bom dia", "tudo bem"): responda em 1 a 2 frases curtas, suaves e acolhedoras (aprox. 10 a 25 palavras). Exemplo do nível de brevidade: "Olá, Celestino. Tudo tranquilo por aqui. Como está sendo o seu dia hoje?"
  - Se Celestino puxar um assunto, pedir ajuda ou desabafar: dialogue em 1 a 2 parágrafos leves, claros e equilibrados, ouvindo antes de propor muita coisa.
  - Só aprofunde em passos ou listas se o usuário pedir explicações detalhadas, organização completa ou resumo geral — ainda assim com elegância, suavidade e espaço para respirar.

PROTOCOLO OBRIGATÓRIO — PENSE ANTES DE AGIR (<thought>):
Antes de escrever qualquer palavra visível ou disparar comandos, faça sempre uma breve reflexão interna dentro das tags <thought>...</thought> (o sistema removerá essa tag antes de exibir ao usuário):
1. Qual é a intenção real de Celestino agora? (Saudação, conversa livre, dúvida, desabafo, consulta de rotina ou pedido explícito de ação?)
2. Que informações realmente pertencem à resposta? (Se for saudação/conversa geral, NÃO cite dados nem pendências.)
3. Devo executar alguma ação no sistema agora?
   - Regra de prudência: NUNCA execute ações (:::action) por impulso ou suposição. Só dispare se houver um pedido claro ou confirmação explícita de Celestino.
   - Se parecer útil criar uma tarefa, registrar no diário ou iniciar um Pomodoro, mas ele não pediu diretamente, pergunte primeiro com suavidade (ex.: "Se quiser, posso deixar essa tarefa anotada ou iniciar um ciclo calmo de foco com você. O que prefere?").
4. Minha resposta está genuinamente calma, gentil, curta e sem excesso de formatação? (Prefira texto corrido natural a listas cheias de negrito.)

${contextBlock}

AÇÕES DO SISTEMA (SOMENTE APÓS DELIBERAÇÃO NO <thought> E COM PEDIDO OU CONSENTIMENTO CLARO):
Quando for o momento certo de executar uma ação no ecossistema Personal OS, emita o bloco ao final da sua resposta visível (fora da tag <thought>):
:::action
{ "action": "NOME_DA_ACAO", "params": { ... } }
:::

Ações suportadas:
- "start_pomodoro": { "duration_minutes": 25, "notes": "...", "task_name": "..." }
- "stop_pomodoro": { "notes": "..." }
- "create_todo": { "title": "...", "priority": "alta"|"media"|"baixa", "due_date": "YYYY-MM-DD" }
- "complete_todo": { "title": "..." }
- "delete_todo": { "title": "..." }
- "complete_habit": { "title": "..." }
- "uncomplete_habit": { "title": "..." }
- "create_habit": { "title": "...", "emoji": "🌿", "category": "Geral", "habit_type": "growth"|"ban" }
- "create_diary_entry": { "title": "...", "content": "...", "mood": "sereno" }
- "navigate": { "page": "pomodoro"|"diary"|"calendar"|"index"|"admin" }
- "set_theme": { "theme": "..." }

FORMATO EXIGIDO DA RESPOSTA (OBRIGATÓRIO):
Sempre inicie sua geração com um bloco <thought>...</thought> breve (2 a 4 linhas) avaliando intenção, necessidade de contexto e consentimento antes de agir. Só depois entregue a resposta gentil ao usuário (e o bloco :::action apenas se solicitado/consentido).

Exemplo:
<thought>
Intenção: saudação casual simples.
Contexto: desnecessário mencionar métricas do sistema.
Ação: nenhuma.
Tom: gentil, suave, calmo e breve.
</thought>
Olá, Celestino! Tudo tranquilo por aqui. Como você está se sentindo hoje?`;

        const messages = [
            { role: 'system', content: systemPrompt }
        ];

        // Anexa histórico recente (últimas 10 mensagens)
        const recentHistory = history.slice(-10);
        for (const msg of recentHistory) {
            if (msg.role && msg.content) {
                messages.push({
                    role: msg.role === 'user' ? 'user' : 'assistant',
                    content: String(msg.content)
                });
            }
        }

        // Anexa mensagem do usuário atual
        messages.push({ role: 'user', content: userMessage });

        // 3. Inferência no Gateway LLM
        const { reply: rawReply, model, provider } = await requestLlmCompletion(messages);

        // 4. Isolamento do Raciocínio (<thought>) ANTES de processar ações
        // Isso garante que ações eventualmente cogitadas ou descartadas dentro do <thought> nunca sejam disparadas!
        const { thought: internalThought, visibleText } = extractAndStripReasoning(rawReply);

        // 5. Extração e Execução Segura de Ações apenas do texto deliberado final
        const executedActions = [];
        const actionRegex = /:::action\s*([\s\S]*?)\s*:::/gi;
        let match;

        while ((match = actionRegex.exec(visibleText)) !== null) {
            try {
                const actionJson = JSON.parse(match[1]);
                if (actionJson && actionJson.action && typeof executeUniversalAction === 'function') {
                    const result = await executeUniversalAction(actionJson.action, actionJson.params || {});
                    executedActions.push({
                        action: actionJson.action,
                        params: actionJson.params || {},
                        result,
                        success: !!result.success
                    });
                }
            } catch (actErr) {
                console.warn('[Tutor AI] Falha ao processar action JSON:', actErr.message);
            }
        }

        // 6. Remoção dos blocos :::action para a resposta final limpa ao usuário
        let cleanReply = visibleText.replace(/:::action\s*([\s\S]*?)\s*:::/gi, '').trim();

        if (!cleanReply && executedActions.length > 0) {
            cleanReply = 'Prontinho, Celestino. Tudo ajustado por aqui com tranquilidade.';
        } else if (!cleanReply) {
            cleanReply = 'Estou por aqui, Celestino. Em que posso te acompanhar agora?';
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.end(JSON.stringify({
            success: true,
            sessionId,
            reply: cleanReply,
            internalThought: internalThought || null,
            intent,
            executedActions,
            model,
            provider,
            timestamp: new Date().toISOString(),
            auditSnapshot: {
                hasWrittenDiary,
                habitsRate,
                focusMinutes,
                pomodoroCycles,
                pendingHabitsCount: (habitsInfo.pending_today || []).length
            }
        }));

    } catch (err) {
        console.error('Erro na API /api/chat:', err);
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.end(JSON.stringify({
            success: false,
            error: 'Não foi possível conectar ao Tutor AI neste momento: ' + err.message
        }));
    }
};
