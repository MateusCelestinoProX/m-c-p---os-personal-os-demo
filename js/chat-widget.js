/**
 * js/chat-widget.js — Widget de Chat Apple Glassmorphism para o MCP Personal OS
 * Injetável em todas as interfaces do ecossistema Personal OS (index, calendar, diary, pomodoro).
 */

(function() {
    if (window.__PERSONAL_OS_CHAT_WIDGET_LOADED__) return;
    window.__PERSONAL_OS_CHAT_WIDGET_LOADED__ = true;

    // Detectar backend de API (suporta nativo Mac personalos://, Android Tauri e Web)
    function getApiBaseUrl() {
        const isNative = typeof window !== 'undefined' && (
            window.location.hostname === 'tauri.localhost' ||
            window.location.protocol === 'tauri:' ||
            window.location.protocol === 'personalos:' ||
            window.location.protocol === 'file:' ||
            window.__IS_NATIVE_APP__ ||
            window.__MACOS_NATIVE__ ||
            typeof window.AndroidBridge !== 'undefined'
        );
        return isNative ? 'https://m-c-p-os-personal-os-1.vercel.app' : '';
    }

    const STORAGE_KEY = 'personal_os_active_chat_session';
    const SESSIONS_KEY = 'personal_os_chat_history_v1';

    let isExpanded = false;
    let isSending = false;
    let currentSessionId = localStorage.getItem(STORAGE_KEY) || ('session_' + Date.now());

    // Carregar histórico local
    function getStoredSessions() {
        try {
            return JSON.parse(localStorage.getItem(SESSIONS_KEY) || '{}');
        } catch {
            return {};
        }
    }

    function saveSessionMessages(sessionId, messages) {
        const sessions = getStoredSessions();
        if (!sessions[sessionId]) {
            sessions[sessionId] = {
                id: sessionId,
                title: messages[0]?.content?.slice(0, 32) || 'Conversa com Tutor AI',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                messages: []
            };
        }
        sessions[sessionId].messages = messages;
        sessions[sessionId].updatedAt = new Date().toISOString();
        if (messages.length > 0 && sessions[sessionId].title === 'Conversa com Tutor AI') {
            const firstUserMsg = messages.find(m => m.role === 'user');
            if (firstUserMsg) {
                sessions[sessionId].title = firstUserMsg.content.slice(0, 32) + (firstUserMsg.content.length > 32 ? '...' : '');
            }
        }
        try {
            localStorage.setItem(SESSIONS_KEY, JSON.stringify(sessions));
            localStorage.setItem(STORAGE_KEY, sessionId);
        } catch(e) {
            console.warn('[ChatWidget] Falha ao persistir no localStorage:', e);
        }
    }

    function getCurrentMessages() {
        const sessions = getStoredSessions();
        return sessions[currentSessionId]?.messages || [
            {
                role: 'assistant',
                content: 'Olá, Celestino. Tudo tranquilo por aqui.\n\nEstou disponível para conversar, clarear ideias ou ajudar a organizar o seu dia com calma.'
            }
        ];
    }

    // Injeção do CSS Apple Glassmorphism isolado
    const styleEl = document.createElement('style');
    styleEl.textContent = `
        .pos-chat-fab {
            position: fixed;
            bottom: max(var(--safe-bottom, 0px), 24px);
            right: 24px;
            z-index: 9998;
            width: 58px;
            height: 58px;
            border-radius: 20px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.18) 0%, rgba(255, 255, 255, 0.05) 100%);
            backdrop-filter: blur(22px) saturate(190%);
            -webkit-backdrop-filter: blur(22px) saturate(190%);
            border: 1px solid rgba(255, 255, 255, 0.35);
            box-shadow: 0 16px 40px rgba(0, 0, 0, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.55);
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.25s cubic-bezier(0.16, 1, 0.3, 1);
            user-select: none;
            touch-action: manipulation;
        }
        .pos-chat-fab:hover {
            transform: scale(1.06) translateY(-2px);
            border-color: rgba(255, 255, 255, 0.5);
            box-shadow: 0 20px 48px rgba(0, 119, 182, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.6);
        }
        .pos-chat-fab:active {
            transform: scale(0.95);
        }
        .pos-chat-fab-badge {
            position: absolute;
            top: -3px;
            right: -3px;
            width: 14px;
            height: 14px;
            border-radius: 50%;
            background: #10b981;
            border: 2px solid #000;
            box-shadow: 0 0 10px #10b981;
        }

        .pos-chat-panel {
            position: fixed;
            bottom: 94px;
            right: 24px;
            z-index: 9999;
            width: 390px;
            max-width: calc(100vw - 32px);
            height: 560px;
            max-height: calc(100vh - 120px);
            border-radius: 28px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.16) 0%, rgba(16, 16, 24, 0.25) 100%);
            backdrop-filter: blur(28px) saturate(200%);
            -webkit-backdrop-filter: blur(28px) saturate(200%);
            border: 1px solid rgba(255, 255, 255, 0.32);
            box-shadow: 
                0 32px 80px rgba(0, 0, 0, 0.35),
                inset 0 1px 2px rgba(255, 255, 255, 0.55),
                inset 0 -1px 1px rgba(255, 255, 255, 0.15);
            display: flex;
            flex-direction: column;
            overflow: hidden;
            transform-origin: bottom right;
            transition: all 0.3s cubic-bezier(0.16, 1, 0.3, 1);
            opacity: 0;
            pointer-events: none;
            transform: scale(0.92) translateY(16px);
        }
        .pos-chat-panel.active {
            opacity: 1;
            pointer-events: auto;
            transform: scale(1) translateY(0);
        }

        .pos-chat-header {
            padding: 14px 18px;
            display: flex;
            align-items: center;
            justify-content: space-between;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.10) 0%, rgba(255, 255, 255, 0.02) 100%);
            border-bottom: 1px solid rgba(255, 255, 255, 0.18);
        }
        .pos-chat-body {
            flex: 1;
            overflow-y: auto;
            padding: 16px;
            display: flex;
            flex-direction: column;
            gap: 12px;
            scrollbar-width: thin;
            scrollbar-color: rgba(255, 255, 255, 0.2) transparent;
        }
        .pos-chat-msg {
            max-width: 85%;
            padding: 10px 14px;
            border-radius: 18px;
            font-size: 13px;
            line-height: 1.5;
            word-break: break-word;
            animation: posFadeIn 0.2s ease-out;
        }
        .pos-chat-msg.user {
            align-self: flex-end;
            background: linear-gradient(135deg, rgba(14, 165, 233, 0.42) 0%, rgba(56, 189, 248, 0.18) 100%);
            backdrop-filter: blur(20px) saturate(190%);
            -webkit-backdrop-filter: blur(20px) saturate(190%);
            border: 1px solid rgba(125, 211, 252, 0.50);
            color: #ffffff;
            border-bottom-right-radius: 4px;
            box-shadow: 0 4px 16px rgba(14, 165, 233, 0.3), inset 0 1px 1px rgba(255, 255, 255, 0.5);
        }
        .pos-chat-msg.assistant {
            align-self: flex-start;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.14) 0%, rgba(255, 255, 255, 0.04) 100%);
            backdrop-filter: blur(20px) saturate(190%);
            -webkit-backdrop-filter: blur(20px) saturate(190%);
            border: 1px solid rgba(255, 255, 255, 0.25);
            color: #ffffff;
            border-bottom-left-radius: 4px;
            box-shadow: 0 4px 16px rgba(0, 0, 0, 0.15), inset 0 1px 1px rgba(255, 255, 255, 0.35);
        }
        .pos-chat-input-box {
            padding: 12px 14px;
            background: linear-gradient(180deg, rgba(255, 255, 255, 0.08) 0%, rgba(255, 255, 255, 0.02) 100%);
            border-top: 1px solid rgba(255, 255, 255, 0.18);
            display: flex;
            align-items: center;
            gap: 8px;
        }
        .pos-chat-input {
            flex: 1;
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.22);
            border-radius: 16px;
            padding: 10px 14px;
            color: #ffffff;
            font-size: 13px;
            outline: none;
            resize: none;
            height: 42px;
            max-height: 100px;
            font-family: inherit;
            transition: all 0.2s;
        }
        .pos-chat-input:focus {
            border-color: rgba(56, 189, 248, 0.75);
            background: rgba(255, 255, 255, 0.14);
            box-shadow: 0 0 18px rgba(14, 165, 233, 0.25);
        }
        .pos-chat-send-btn {
            width: 42px;
            height: 42px;
            border-radius: 14px;
            background: linear-gradient(135deg, #0077b6 0%, #00b4d8 100%);
            border: 1px solid rgba(255, 255, 255, 0.3);
            color: #ffffff;
            display: flex;
            align-items: center;
            justify-content: center;
            cursor: pointer;
            transition: all 0.2s;
            flex-shrink: 0;
        }
        .pos-chat-send-btn:hover {
            transform: scale(1.05);
            box-shadow: 0 0 15px rgba(0, 180, 216, 0.5);
        }
        .pos-chat-send-btn:active {
            transform: scale(0.95);
        }
        @keyframes posFadeIn {
            from { opacity: 0; transform: translateY(6px); }
            to { opacity: 1; transform: translateY(0); }
        }
        @media (max-width: 640px) {
            .pos-chat-panel {
                bottom: 84px;
                right: 12px;
                width: calc(100vw - 24px);
                height: calc(100vh - 110px);
                border-radius: 22px;
            }
            .pos-chat-fab {
                bottom: 16px;
                right: 16px;
                width: 52px;
                height: 52px;
            }
        }
    `;
    document.head.appendChild(styleEl);

    // Formatação de Markdown simples
    function formatMarkdown(text) {
        if (!text) return '';
        let html = text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
            .replace(/\*(.*?)\*/g, '<em>$1</em>')
            .replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.15); padding: 2px 6px; border-radius: 6px; font-family: monospace; font-size: 11px;">$1</code>')
            .replace(/\n\n/g, '<br><br>')
            .replace(/\n/g, '<br>');
        return html;
    }

    // Criar DOM do Widget
    const container = document.createElement('div');
    container.id = 'pos-chat-widget-root';
    container.innerHTML = `
        <div class="pos-chat-fab" id="pos-chat-fab" title="Tutor AI & Rotina">
            <span style="font-size: 26px;">🥋</span>
            <div class="pos-chat-fab-badge" title="Tutor Conectado"></div>
        </div>

        <div class="pos-chat-panel" id="pos-chat-panel">
            <div class="pos-chat-header">
                <div style="display: flex; align-items: center; gap: 10px;">
                    <div style="width: 32px; height: 32px; border-radius: 10px; background: linear-gradient(135deg, #0077b6, #00b4d8); display: flex; align-items: center; justify-content: center; font-size: 16px; box-shadow: 0 2px 10px rgba(0, 180, 216, 0.4);">
                        🥋
                    </div>
                    <div>
                        <div style="font-size: 13px; font-weight: bold; color: #fff; letter-spacing: 0.02em;">Tutor AI & Rotina</div>
                        <div style="font-size: 10px; color: #10b981; font-family: monospace; display: flex; align-items: center; gap: 4px;">
                            <span style="width: 6px; height: 6px; border-radius: 50%; background: #10b981;"></span>
                            Online • Personal OS Core
                        </div>
                    </div>
                </div>
                <div style="display: flex; align-items: center; gap: 6px;">
                    <button id="pos-chat-clear-btn" title="Limpar conversa" style="width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #7dd3fc; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 13px; transition: background 0.2s;">
                        🧹
                    </button>
                    <a href="chat.html" title="Abrir Chat Completo" style="width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #fff; display: flex; align-items: center; justify-content: center; text-decoration: none; font-size: 12px; transition: background 0.2s;">
                        ↗
                    </a>
                    <button id="pos-chat-close-btn" title="Minimizar" style="width: 28px; height: 28px; border-radius: 8px; background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.15); color: #fff; display: flex; align-items: center; justify-content: center; cursor: pointer; font-size: 12px; transition: background 0.2s;">
                        ✕
                    </button>
                </div>
            </div>

            <div class="pos-chat-body" id="pos-chat-body"></div>

            <div class="pos-chat-input-box">
                <textarea id="pos-chat-input" class="pos-chat-input" placeholder="Converse com o Tutor AI..." rows="1"></textarea>
                <button id="pos-chat-send" class="pos-chat-send-btn" title="Enviar mensagem (Enter)">
                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="22" y1="2" x2="11" y2="13"></line>
                        <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
                    </svg>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(container);

    const fab = document.getElementById('pos-chat-fab');
    const panel = document.getElementById('pos-chat-panel');
    const closeBtn = document.getElementById('pos-chat-close-btn');
    const bodyEl = document.getElementById('pos-chat-body');
    const inputEl = document.getElementById('pos-chat-input');
    const sendBtn = document.getElementById('pos-chat-send');

    function renderMessages() {
        const messages = getCurrentMessages();
        bodyEl.innerHTML = '';
        messages.forEach(msg => {
            const div = document.createElement('div');
            div.className = `pos-chat-msg ${msg.role === 'user' ? 'user' : 'assistant'}`;
            div.innerHTML = formatMarkdown(msg.content);
            bodyEl.appendChild(div);
        });
        bodyEl.scrollTop = bodyEl.scrollHeight;
    }

    function isMobileViewport() {
        return typeof window !== 'undefined' && (
            window.innerWidth <= 1023 ||
            /Android|iPhone|iPad|Mobile/i.test(navigator.userAgent)
        );
    }

    function toggleChat(open) {
        if (isMobileViewport() && (open === undefined || open === true)) {
            window.location.href = 'chat.html';
            return;
        }
        isExpanded = typeof open === 'boolean' ? open : !isExpanded;
        if (isExpanded) {
            panel.classList.add('active');
            renderMessages();
            if (!isMobileViewport()) {
                setTimeout(() => inputEl.focus(), 150);
            }
        } else {
            panel.classList.remove('active');
        }
    }

    async function sendMessage() {
        const text = inputEl.value.trim();
        if (!text || isSending) return;

        isSending = true;
        inputEl.value = '';
        sendBtn.style.opacity = '0.5';

        const messages = getCurrentMessages();
        messages.push({ role: 'user', content: text });
        saveSessionMessages(currentSessionId, messages);
        renderMessages();

        // Indicador de digitação
        const typingDiv = document.createElement('div');
        typingDiv.className = 'pos-chat-msg assistant';
        typingDiv.id = 'pos-typing-indicator';
        typingDiv.innerHTML = '<span style="opacity: 0.7; font-style: italic;">Pensando com calma...</span>';
        bodyEl.appendChild(typingDiv);
        bodyEl.scrollTop = bodyEl.scrollHeight;

        try {
            const apiBase = getApiBaseUrl();
            const response = await fetch(`${apiBase}/api/chat`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    sessionId: currentSessionId,
                    message: text,
                    history: messages.slice(0, -1)
                })
            });

            let data;
            try {
                data = await response.json();
            } catch(e) {
                throw new Error(`Resposta inválida (HTTP ${response.status})`);
            }
            const typingEl = document.getElementById('pos-typing-indicator');
            if (typingEl) typingEl.remove();

            if (response.ok && data.success && data.reply) {
                let pillText = '';
                if (Array.isArray(data.executedActions) && data.executedActions.length > 0) {
                    data.executedActions.forEach(act => {
                        if (act.action === 'start_pomodoro') {
                            const dur = act.params?.duration_minutes || 25;
                            pillText += `\n\n⏱️ **[Pomodoro Ativado: ${dur} min]**`;
                            try {
                                localStorage.setItem('personal_os_active_pomodoro', JSON.stringify({
                                    running: true,
                                    durationMinutes: dur,
                                    startedAt: Date.now(),
                                    durationMs: dur * 60000
                                }));
                                window.dispatchEvent(new CustomEvent('personalos:pomodoro_started', { detail: { durationMinutes: dur } }));
                            } catch (e) {}
                        } else if (act.action === 'create_todo') {
                            pillText += `\n\n📌 **[Tarefa Registrada: ${act.params?.title || 'Nova tarefa'}]**`;
                        } else if (act.action === 'complete_todo') {
                            pillText += `\n\n✅ **[Tarefa Concluída: ${act.params?.title || act.result?.title || 'Feita'}]**`;
                        } else if (act.action === 'complete_habit') {
                            pillText += `\n\n⚡ **[Hábito Concluído: ${act.params?.title || act.result?.habit || 'Hábito'}]**`;
                        } else if (act.action === 'create_diary_entry') {
                            pillText += `\n\n📖 **[Diário: Reflexão Registrada]**`;
                        } else if (act.action === 'navigate') {
                            const targetPage = act.params?.page ? `${act.params.page}.html` : 'index.html';
                            pillText += `\n\n🚀 **[Abrindo tela ${act.params?.page}...]**`;
                            setTimeout(() => { window.location.href = targetPage; }, 1200);
                        }
                    });
                }
                messages.push({ role: 'assistant', content: data.reply + pillText });
                saveSessionMessages(currentSessionId, messages);
            } else {
                messages.push({ role: 'assistant', content: `⚠️ ${data.error || 'Falha ao conectar com o Tutor AI.'}` });
                saveSessionMessages(currentSessionId, messages);
            }
        } catch (err) {
            const typingEl = document.getElementById('pos-typing-indicator');
            if (typingEl) typingEl.remove();
            messages.push({ role: 'assistant', content: `⚠️ Erro de rede: ${err.message}` });
            saveSessionMessages(currentSessionId, messages);
        } finally {
            isSending = false;
            sendBtn.style.opacity = '1';
            renderMessages();
            inputEl.focus();
        }
    }

    const clearBtn = document.getElementById('pos-chat-clear-btn');
    if (clearBtn) {
        clearBtn.addEventListener('click', () => {
            if (confirm('Deseja limpar as mensagens deste chat?')) {
                const initialMsg = [
                    {
                        role: 'assistant',
                        content: 'Olá, Celestino. Tudo tranquilo por aqui.\n\nEstou disponível para conversar, clarear ideias ou ajudar a organizar o seu dia com calma.'
                    }
                ];
                saveSessionMessages(currentSessionId, initialMsg);
                renderMessages();
            }
        });
    }

    fab.addEventListener('click', () => toggleChat());
    closeBtn.addEventListener('click', () => toggleChat(false));
    sendBtn.addEventListener('click', sendMessage);

    inputEl.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });

    window.PersonalOsChatWidget = {
        open: () => toggleChat(true),
        close: () => toggleChat(false),
        toggle: () => toggleChat()
    };
})();
