/**
 * ==============================================================================
 * M.C.P PERSONAL OS — CONTROL ENGINE & NOTIFICATION DISPATCHER (v2026.4)
 * ==============================================================================
 * 
 * 1. Vidro Pure Liquid Glassmorphism Super Light & Premium (Shader 100% Visível)
 * 2. Editor & Visualizador Split View Markdown Aprimorado (Fidelidade Tipográfica Apple / Diary)
 * 3. Biblioteca Gigante Completa de Emojis Original (+400 Emojis Categorizados)
 * 4. Botões de Exclusão Diretos e Funcionais em Grupos de Tarefas, Tarefas, Lembretes, Grupos e Modelos
 * 5. Garantia Absoluta de Briefings Diários, Semanais e Mensais extraídos do Geral Dashboard Habits
 * 6. Disparo Preciso de Alertas de Tasks e Lembretes com Alarme Heroico e Assinatura Oficial
 */

(function(window) {
    'use strict';

    // ==============================================================================
    // ANDROID / SAMSUNG ONE UI NATIVE NOTIFICATION & ALARM BRIDGE
    // ==============================================================================
    function setupAndroidNativeBridge() {
        if (typeof window === 'undefined') return;
        if (window.AndroidBridge) {
            window.Notification = class {
                constructor(title, options) {
                    try {
                        const body = (options && options.body) || '';
                        window.AndroidBridge.showNotification(title, body, false);
                    } catch(e) {}
                }
                static requestPermission() {
                    try {
                        if (window.AndroidBridge && window.AndroidBridge.requestNotificationPermission) {
                            window.AndroidBridge.requestNotificationPermission();
                        }
                    } catch(e) {}
                    return Promise.resolve("granted");
                }
                static get permission() {
                    return "granted";
                }
            };
        }
    }
    setupAndroidNativeBridge();
    window.addEventListener('androidbridge:ready', setupAndroidNativeBridge);

    const SUPABASE_URL = 'https://jfxxmhthwoggffrvkflv.supabase.co';
    const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeHhtaHRod29nZ2ZmcnZrZmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MDUyOTEsImV4cCI6MjEwMzI4MTI5MX0.yBYGdnsV2i-QOXytEtNhRsTBez1AfA67q9ct-4-ZrEw';
    const EDGE_FUNCTION_EMAIL_URL = `${SUPABASE_URL}/functions/v1/send-resend-email`;

    const EMAIL_SIGNATURE = `\n\n---\n*Powered BY Mateus Celestino PRO.*`;
    const EMAIL_SIGNATURE_HTML = `<div style="margin-top: 28px; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.15); font-size: 11px; font-family: 'SF Mono', monospace, -apple-system, sans-serif; color: #a1a1aa; text-align: center; font-weight: 700; letter-spacing: 0.08em; text-transform: uppercase;">Powered BY Mateus Celestino PRO.</div>`;

    let supabaseClient = null;

    function getSupabase() {
        if (!supabaseClient) {
            if (window.client) {
                supabaseClient = window.client;
            } else if (window.supabase && typeof window.supabase.createClient === 'function') {
                supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
            }
        }
        return supabaseClient;
    }

    // ==========================================
    // BIBLIOTECA GIGANTE DE EMOJIS (+400 EMOJIS CATEGORIZADOS ORIGINAL HABIT)
    // ==========================================
    const EMOJI_COLLECTION = {
        foco: [
            '⚡', '🧠', '💡', '🎯', '🚀', '💻', '📚', '✍️', '📖', '🔬', '🔭', '💼', '📊', '📈', '🎨', '🛠️', 
            '♟️', '🗝️', '🔍', '📝', '🖥️', '⌨️', '📡', '🌐', '🧭', '⚙️', '🧪', '📐', '⌛', '⏳', '⏰', '💎', 
            '👑', '🏛️', '🧩', '🕯️', '🖨️', '📁', '📂', '🗒️', '📅', '📌', '📎', '🔒', '🔓', '🔏', '🔑', '🏷️',
            '🗂️', '📊', '📉', '💼', '📋', '📐', '📏', '📎', '📌', '🖍️', '🖊️', '🖋️', '✒️', '✏️', '💻', '🖥️'
        ],
        ban: [
            '🛑', '🚫', '⛔', '📵', '🚭', '🔞', '🗑️', '💣', '🗡️', '🛡️', '⚔️', '🔒', '🔕', '🔇', '☣️', '⚠️', 
            '🚨', '❌', '✖️', '🩸', '🕸️', '⛓️', '🪓', '🪚', '🪤', '🕳️', '💀', '☠️', '🪫', '🔌', '📉', '💔', 
            '💥', '🔥', '🚯', '🚷', '🚳', '🚾', '🛑', '⛔', '🚫', '❌', '📛', '🔰', '🙅', '🙅‍♂️', '🙅‍♀️', '🚷'
        ],
        rotina: [
            '☀️', '🌅', '🌙', '🌌', '🪐', '🌕', '🌑', '🌲', '🌳', '🌴', '🌿', '🍀', '🍁', '🌊', '🏔️', '🌋', 
            '⚡', '⛈️', '❄️', '💨', '🌈', '🦅', '🐺', '🦁', '🐯', '🐉', '🕊️', '🦉', '🐝', '🌾', '🌻', '🌵', 
            '🐾', '🐬', '🐋', '🦈', '🐅', '🐆', '🦓', '🐘', '🦏', '🦛', '🐪', '🐫', '🦙', '🦒', '🌸', '🌺',
            '🌷', '🌹', '🌻', '🌼', '💐', '🪴', '🌱', '🎍', '🎋', '🍃', '🍂', '🍁', '🍄', '🌾', '💐', '🌷'
        ],
        riqueza: [
            '💰', '💵', '💳', '🪙', '💎', '🏦', '💹', '🏷️', '💸', '📈', '🥇', '👑', '💍', '🏛️', '🏰', '🛡️', 
            '🎲', '🎰', '🗝️', '📜', '🏆', '🎖️', '🏅', '⚜️', '🔮', '🧿', '⚓', '🏎️', '✈️', '🚀', '🚢', '🛥️', 
            '🚁', '🛳️', '🏎️', '🏍️', '🚘', '🚖', '🏢', '🏦', '🏨', '🏪', '🏭', '🗼', '🚢', '🚀', '🛫', '🛬'
        ],
        vibe: [
            '🔥', '✨', '🌟', '💫', '💥', '💢', '💯', '🔱', '⚜️', '🗿', '👁️', '🦾', '🦿', '🧘‍♂️', '🧙‍♂️', '🥷', 
            '👑', '🕶️', '🪐', '🛸', '🌌', '🧬', '🔮', '🖤', '🤍', '💚', '💙', '💜', '💛', '🧡', '🤍', '☯️', 
            '♾️', '🕊️', '🤖', '👾', '👽', '👻', '👺', '👹', '🎭', '🎪', '🎨', '🎬', '🎤', '🎧', '🎸', '🎹'
        ]
    };

    let activeEmojiCategory = 'foco';

    const DEFAULT_TODO_GROUPS = [
        { id: 'group_main', title: 'Main • Foco & Prioridades', emoji: '🎯', color: '#38bdf8', description: 'Tarefas prioritárias imediatas', sort_order: 0 },
        { id: 'group_work', title: 'Projetos & Negócios', emoji: '💼', color: '#a855f7', description: 'Execução estratégica e desenvolvimento', sort_order: 1 },
        { id: 'group_health', title: 'Saúde & Rotina', emoji: '🌱', color: '#10b981', description: 'Corpo, mente e bem-estar', sort_order: 2 },
        { id: 'group_notion', title: 'Notion • Tasks & Alarmes', emoji: '📝', color: '#6366f1', description: 'Tarefas e alarmes sincronizados diretamente da sua página do Notion', sort_order: 3 }
    ];

    const DEFAULT_REMINDER_GROUPS = [
        { id: 'rem_grp_focus', title: 'Foco & Disciplina', emoji: '⚡', color: '#ec4899' },
        { id: 'rem_grp_health', title: 'Saúde & Hábitos Diários', emoji: '🌱', color: '#10b981' },
        { id: 'rem_grp_exec', title: 'Compromissos & Estratégia', emoji: '💼', color: '#38bdf8' }
    ];

    // Estado Geral do Módulo Control
    
    function generateDefaultTodos() {
        const now = getBrasiliaDate();
        const todayDayIdx = now.getDay();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(startOfWeek.getDate() - todayDayIdx);
        
        const getDateForDay = (dayIdx) => {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + dayIdx);
            return formatISODate(d);
        };

        return [
            // DOM (0)
            { id: 'todo_def_1', group_id: 'group_main', title: 'Planejamento Estratégico Semanal', priority: 'high', due_date: getDateForDay(0), due_time: '10:00', is_completed: false, has_alarm: true },
            { id: 'todo_def_2', group_id: 'group_health', title: 'Meal Prep Semanal & Hidratação 3L', priority: 'normal', due_date: getDateForDay(0), due_time: '15:30', is_completed: false, has_alarm: false },
            
            // SEG (1)
            { id: 'todo_def_3', group_id: 'group_work', title: 'Revisão dos Códigos & Deploy Personal OS', priority: 'urgent', due_date: getDateForDay(1), due_time: '09:00', is_completed: true, has_alarm: true },
            { id: 'todo_def_4', group_id: 'group_main', title: 'Otimização de Performance WebGL & SW', priority: 'high', due_date: getDateForDay(1), due_time: '14:00', is_completed: false, has_alarm: true },
            { id: 'todo_def_5', group_id: 'group_health', title: 'Alongamento & Mobilidade Articular', priority: 'normal', due_date: getDateForDay(1), due_time: '19:30', is_completed: false, has_alarm: false },

            // TER (2)
            { id: 'todo_def_6', group_id: 'group_work', title: 'Reunião de Alinhamento e Metas Q3', priority: 'high', due_date: getDateForDay(2), due_time: '10:30', is_completed: false, has_alarm: true },
            { id: 'todo_def_7', group_id: 'group_main', title: 'Auditoria de Cache e Network Saver', priority: 'normal', due_date: getDateForDay(2), due_time: '15:00', is_completed: false, has_alarm: false },
            { id: 'todo_def_8', group_id: 'group_health', title: 'Leitura de 30 minutos (Deep Work)', priority: 'low', due_date: getDateForDay(2), due_time: '21:00', is_completed: false, has_alarm: false },

            // QUA (3)
            { id: 'todo_def_9', group_id: 'group_main', title: 'Cálculo Avançado & Simulações', priority: 'urgent', due_date: getDateForDay(3), due_time: '08:30', is_completed: false, has_alarm: true },
            { id: 'todo_def_10', group_id: 'group_work', title: 'Implementar Matriz Unificada no Control', priority: 'high', due_date: getDateForDay(3), due_time: '14:30', is_completed: false, has_alarm: true },
            { id: 'todo_def_11', group_id: 'group_main', title: 'Revisão Financeira & Investimentos', priority: 'normal', due_date: getDateForDay(3), due_time: '20:00', is_completed: false, has_alarm: false },

            // QUI (4)
            { id: 'todo_def_12', group_id: 'group_work', title: 'Design System & Liquid Glass Polish', priority: 'high', due_date: getDateForDay(4), due_time: '09:30', is_completed: false, has_alarm: false },
            { id: 'todo_def_13', group_id: 'group_health', title: 'Revisão de Metas & Planejamento', priority: 'normal', due_date: getDateForDay(4), due_time: '18:30', is_completed: false, has_alarm: false },

            // SEX (5)
            { id: 'todo_def_14', group_id: 'group_main', title: 'Backup Geral do Banco Supabase & ImageKit', priority: 'urgent', due_date: getDateForDay(5), due_time: '11:00', is_completed: false, has_alarm: true },
            { id: 'todo_def_15', group_id: 'group_work', title: 'Retrospectiva Semanal & Fechamento', priority: 'high', due_date: getDateForDay(5), due_time: '16:00', is_completed: false, has_alarm: false },

            // SAB (6)
            { id: 'todo_def_16', group_id: 'group_health', title: 'Corrida ao ar livre 5km + Meditação', priority: 'normal', due_date: getDateForDay(6), due_time: '08:00', is_completed: false, has_alarm: false },
            { id: 'todo_def_17', group_id: 'group_main', title: 'Estudo Livre & Novas Ideias de Negócio', priority: 'low', due_date: getDateForDay(6), due_time: '20:00', is_completed: false, has_alarm: false }
        ];
    }

    function generateDefaultReminders() {
        const now = getBrasiliaDate();
        const todayDayIdx = now.getDay();
        const startOfWeek = new Date(now);
        startOfWeek.setDate(startOfWeek.getDate() - todayDayIdx);
        
        const getDateForDay = (dayIdx) => {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + dayIdx);
            return formatISODate(d);
        };

        return [
            // Diários
            { id: 'rem_def_1', group_id: 'rem_grp_health', title: 'Hidratação: 500ml de Água Gelada', reminder_type: 'daily', target_time: '08:00', is_active: true, has_sound: true, day_of_week: 'ALL' },
            { id: 'rem_def_2', group_id: 'rem_grp_focus', title: 'Deep Work: Desativar Notificações', reminder_type: 'daily', target_time: '09:00', is_active: true, has_sound: true, day_of_week: 'ALL' },
            { id: 'rem_def_3', group_id: 'rem_grp_health', title: 'Almoço & Suplementação Vitamínica', reminder_type: 'daily', target_time: '12:30', is_active: true, has_sound: true, day_of_week: 'ALL' },
            { id: 'rem_def_4', group_id: 'rem_grp_focus', title: 'Pausa Ativa: Respiração & Postura', reminder_type: 'daily', target_time: '15:30', is_active: true, has_sound: false, day_of_week: 'ALL' },
            { id: 'rem_def_5', group_id: 'rem_grp_health', title: 'Desaceleração Noturna & Higiene do Sono', reminder_type: 'daily', target_time: '22:00', is_active: true, has_sound: true, day_of_week: 'ALL' },
            
            // Dias específicos da semana
            { id: 'rem_def_6', group_id: 'rem_grp_exec', title: 'Briefing Executivo & Metas da Semana', reminder_type: 'specific_date', target_date: getDateForDay(1), target_time: '08:30', is_active: true, has_sound: true, day_of_week: 'SEG' },
            { id: 'rem_def_7', group_id: 'rem_grp_exec', title: 'Call de Acompanhamento Técnico', reminder_type: 'specific_date', target_date: getDateForDay(2), target_time: '14:00', is_active: true, has_sound: true, day_of_week: 'TER' },
            { id: 'rem_def_8', group_id: 'rem_grp_focus', title: 'Sessão de Foco: Algoritmos', reminder_type: 'specific_date', target_date: getDateForDay(3), target_time: '10:00', is_active: true, has_sound: true, day_of_week: 'QUA' },
            { id: 'rem_def_9', group_id: 'rem_grp_health', title: 'Organização do Espaço de Foco', reminder_type: 'specific_date', target_date: getDateForDay(4), target_time: '18:00', is_active: true, has_sound: false, day_of_week: 'QUI' },
            { id: 'rem_def_10', group_id: 'rem_grp_exec', title: 'Fechamento de Caixa Semanal & Contas', reminder_type: 'specific_date', target_date: getDateForDay(5), target_time: '17:00', is_active: true, has_sound: true, day_of_week: 'SEX' },
            { id: 'rem_def_11', group_id: 'rem_grp_focus', title: 'Revisão de Conteúdos & Audiobooks', reminder_type: 'specific_date', target_date: getDateForDay(6), target_time: '11:00', is_active: true, has_sound: false, day_of_week: 'SAB' },
            { id: 'rem_def_12', group_id: 'rem_grp_exec', title: 'Organizar Agenda do Google & Notificações', reminder_type: 'specific_date', target_date: getDateForDay(0), target_time: '20:30', is_active: true, has_sound: true, day_of_week: 'DOM' }
        ];
    }

    let todoGroups = [...DEFAULT_TODO_GROUPS];
    let todosList = [];
    let reminderGroups = [...DEFAULT_REMINDER_GROUPS];
    let remindersList = [];
    
    let notionSettings = {
        token: '',
        page_id: '3e28112a-6332-80c1-ba2c-ed849c99686e',
        page_title: 'krnfkjrmnf',
        auto_sync: true,
        sync_alarms: true,
        last_sync: null,
        last_sync_count: 0,
        last_alarms_count: 0
    };
    
    let emailSettings = {
        recipient_email: 'demo@personal-os.io',
        resend_api_key: 'demo_resend_api_key_placeholder', // Chave padrão Resend oficial
        sender_name: 'PERSONAL OS',
        sender_email: 'onboarding@resend.dev',
        notify_on_habit_finish: true,
        motivation_enabled: true,
        briefing_frequency: ['day', 'week', 'month'],
        morning_briefing_enabled: true,
        morning_briefing_time: '07:00',
        daily_briefing_time: '00:01',
        weekly_briefing_day: 0, // Domingo
        weekly_briefing_time: '23:55',
        monthly_briefing_day_type: 'last_day',
        monthly_briefing_time: '23:58',
        last_daily_briefing_date: null,
        last_morning_briefing_date: null,
        last_weekly_briefing_date: null,
        last_monthly_briefing_date: null
    };

    let motivationRules = [
        {
            id: 'rule_default_streak_growth',
            habit_id: 'all',
            frequency: 'custom_days',
            target_days: 7,
            condition_type: 'streak_success',
            template_id: 'tpl_mot_streak_growth',
            is_active: true,
            created_at: new Date().toISOString()
        },
        {
            id: 'rule_default_broken_growth',
            habit_id: 'all',
            frequency: 'daily',
            target_days: 1,
            condition_type: 'habit_broken',
            template_id: 'tpl_mot_broken_growth',
            is_active: true,
            created_at: new Date().toISOString()
        }
    ];

    let emailTemplates = [
        {
            id: 'tpl_habit_finished',
            title: 'Notificação: Hábito Concluído',
            template_type: 'habit_finished',
            emoji: '🏆',
            recurrence_type: 'one_time',
            is_scheduled: false,
            subject: '⚡ [PERSONAL OS] Hábito Concluído: {habit_title}',
            markdown_content: '# 🏆 Meta Cumprida com Sucesso!\n\nOlá Mateus,\n\nO hábito **{habit_title}** acabou de ser concluído no seu sistema **PERSONAL OS**.\n\n- **Duração da Sessão:** {elapsed_time}\n- **Horário de Brasília:** {completed_at}\n- **Status:** ✓ Registrado e Sincronizado na Nuvem\n\n*Continue cultivando a consistência inabalável.*'
        },
        {
            id: 'tpl_reminder_triggered',
            title: 'Lembrete do Sistema',
            template_type: 'reminder_triggered',
            emoji: '⏰',
            recurrence_type: 'one_time',
            is_scheduled: false,
            subject: '⏰ [Lembrete PERSONAL OS] {reminder_title}',
            markdown_content: '# ⏰ Lembrete Programado\n\n**Título:** {reminder_title}\n**Grupo:** {group_name}\n**Horário:** {time_brt}\n\n**Observações:**\n{notes}'
        },
        {
            id: 'tpl_daily_briefing',
            title: 'Briefing Executivo Diário',
            template_type: 'daily_briefing',
            emoji: '📊',
            recurrence_type: 'daily',
            target_time: '00:01',
            is_scheduled: true,
            subject: '📊 [Briefing Diário] Resumo Consolidado • {date}',
            markdown_content: '# 📊 Briefing Executivo Diário\n\n**Data de Referência:** {date}\n**Fuso Oficial:** Brasília (BRT)\n\n{briefing_summary}'
        },
        {
            id: 'tpl_mot_streak_growth',
            title: 'Motivacional: Streak & Conquista (Growth)',
            template_type: 'motivation',
            emoji: '🔥',
            recurrence_type: 'custom_days',
            is_scheduled: false,
            subject: '🔥 [CONQUISTA] {streak} Dias Invicto em {habit_title}!',
            markdown_content: '# 🔥 Parabéns pela Consistência Inabalável!\n\nMateus,\n\nVocê manteve o foco absoluto e atingiu a marca de **{streak} dias consecutivos** no hábito **{habit_title}**.\n\n> "A excelência não é um ato, mas um hábito construído diariamente."\n\n- **Hábito:** {habit_title}\n- **Sequência Atual:** {streak} dias cumpridos\n- **Status:** {status}\n- **Data de Registro:** {date}\n\nContinue firme no topo.'
        },
        {
            id: 'tpl_mot_streak_ban',
            title: 'Motivacional: Sobriedade & Domínio (Ban)',
            template_type: 'motivation',
            emoji: '🛡️',
            recurrence_type: 'custom_days',
            is_scheduled: false,
            subject: '🛡️ [DOMÍNIO & SOBRIEDADE] {streak} Dias Limpo de {habit_title}!',
            markdown_content: '# 🛡️ Vitória da Autodisciplina e Força Mental!\n\nMateus,\n\nVocê manteve sua mente blindada e está há **{streak} dias totalmente limpo** do vício/hábito prejudicial **{habit_title}**.\n\n> "Quem domina a si mesmo domina qualquer destino."\n\n- **Hábito Destrutivo (Ban):** {habit_title}\n- **Dias de Sobriedade & Liberdade:** {streak} dias invictos\n- **Status:** {status}\n- **Data:** {date}\n\nCada dia que passa sua mente se fortalece ainda mais.'
        },
        {
            id: 'tpl_mot_broken_growth',
            title: 'Alerta Motivacional: Quebra de Hábito (Growth)',
            template_type: 'motivation',
            emoji: '⚠️',
            recurrence_type: 'daily',
            is_scheduled: false,
            subject: '⚠️ [RECOMEÇO] Alerta de Consistência: {habit_title}',
            markdown_content: '# ⚠️ Quebra de Cronograma Detectada\n\nMateus,\n\nO hábito **{habit_title}** não foi concluído hoje conforme o seu plano de alta performance.\n\n> "Um deslize não é uma derrota, a menos que você escolha não se levantar imediatamente."\n\n- **Hábito:** {habit_title}\n- **Situação:** Cronograma interrompido\n- **Data:** {date}\n\nReajuste o foco agora mesmo. Amanhã a contagem recomeça com força total.'
        },
        {
            id: 'tpl_mot_broken_ban',
            title: 'Alerta Motivacional: Recaída em Hábito Ban',
            template_type: 'motivation',
            emoji: '🚨',
            recurrence_type: 'daily',
            is_scheduled: false,
            subject: '🚨 [ALERTA DE RECAÍDA] {habit_title} foi praticado hoje',
            markdown_content: '# 🚨 Alerta Vermelho: Recaída no Hábito Prejudicial\n\nMateus,\n\nO sistema registrou uma ação no hábito **{habit_title}** (marcado como Ban/Destruir).\n\n> "O fracasso só é permanente se você se render a ele. Respire, corte o estímulo e retome o controle agora."\n\n- **Hábito Ban:** {habit_title}\n- **Ação Registrada:** Recaída no dia {date}\n\nCorte as pontes, elimine os gatilhos ao seu redor e recupere a sobriedade imediatamente.'
        },
        {
            id: 'tpl_mot_session_done',
            title: 'Motivacional: Sessão Concluída com Maestria',
            template_type: 'motivation',
            emoji: '⚡',
            recurrence_type: 'one_time',
            is_scheduled: false,
            subject: '⚡ [SESSÃO DE ALTO IMPACTO] {habit_title} Concluído!',
            markdown_content: '# ⚡ Sessão de Alto Impacto Finalizada!\n\nMateus,\n\nMais uma sessão de **{habit_title}** foi executada com precisão no **PERSONAL OS**.\n\n- **Hábito:** {habit_title}\n- **Progresso:** {status}\n- **Data/Hora:** {date}\n\nConsistência é o diferencial que separa os amadores dos mestres.'
        }
    ];

    // Configurações Oficiais Google Cloud OAuth (Projeto api-agenda-personal-os)
    const GOOGLE_CLIENT_ID = "demo-client-id.apps.googleusercontent.com";

    // Cores Oficiais da Google Calendar API (Event Colors: IDs 1 a 11)
    const GOOGLE_CALENDAR_COLORS = {
        '1': { id: '1', name: 'Lavanda', hex: '#7986cb', lightHex: '#c5cae9', dot: '🟣' },
        '2': { id: '2', name: 'Sálvia', hex: '#33b679', lightHex: '#a5d6a7', dot: '🟢' },
        '3': { id: '3', name: 'Uva', hex: '#8e24aa', lightHex: '#e1bee7', dot: '🍇' },
        '4': { id: '4', name: 'Flamingo', hex: '#e67c73', lightHex: '#ffcdd2', dot: '🦩' },
        '5': { id: '5', name: 'Banana', hex: '#f6bf26', lightHex: '#fff9c4', dot: '🟡' },
        '6': { id: '6', name: 'Tangerina', hex: '#f4511e', lightHex: '#ffccbc', dot: '🟠' },
        '7': { id: '7', name: 'Pavão', hex: '#039be5', lightHex: '#b3e5fc', dot: '🔵' },
        '8': { id: '8', name: 'Grafite', hex: '#616161', lightHex: '#e0e0e0', dot: '⚪' },
        '9': { id: '9', name: 'Mirtilo', hex: '#3f51b5', lightHex: '#c5cae9', dot: '🫐' },
        '10': { id: '10', name: 'Manjericão', hex: '#0b8043', lightHex: '#c8e6c9', dot: '🌿' },
        '11': { id: '11', name: 'Tomate', hex: '#d50000', lightHex: '#ffcdd2', dot: '🔴' }
    };

    // Estados do Google Calendar & Timeline
    let googleCalendarSettings = {
        ical_url: '',
        api_key: '',
        client_id: GOOGLE_CLIENT_ID,
        access_token: null,
        token_expires_at: null,
        auto_sync: true,
        last_synced_at: null
    };
    let selectedQuickCalColorId = '7'; // Pavão / Azul como padrão
    let googleEventsList = [];
    let diaryEntriesList = [];
    let calendarCurrentDate = null;
    let calendarViewMode = 'month'; // '1day' | '3days' | '5days' | '7days' | 'month'
    let calendarFilter = 'all';
    let selectedCalendarDateStr = null;
    let todoModalCalendarDate = null;
    let todoSelectedRecurringDates = [];

    // Estados de Filtro e Edição
    let currentFilterTodoGroupId = 'all';
    let currentFilterTodoPriority = 'all';
    let currentTodoSortOrder = 'priority_desc';
    let currentFilterReminderGroupId = 'all';
    let currentEditingTodo = null;
    let currentEditingTodoGroup = null;
    let currentEditingReminder = null;
    let currentEditingReminderGroup = null;
    let currentEditingTemplate = null;
    let currentSelectedEmoji = '🎯';

    // Estados da Rotina de Estudos (Notion & Google Agenda)
    const STUDY_DAYS_ORDER = ['SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB', 'DOM'];
    const STUDY_DAYS_LABEL = {
        'ALL': 'Todos os Dias',
        'SEG': 'Segunda-feira',
        'TER': 'Terça-feira',
        'QUA': 'Quarta-feira',
        'QUI': 'Quinta-feira',
        'SEX': 'Sexta-feira',
        'SAB': 'Sábado',
        'DOM': 'Domingo'
    };
    let studyBlocks = [];
    let studySettings = {
        google_calendar_color_id: '4',
        prefix: 'STUD: ',
        auto_sync_gcal: true
    };
    let currentEditingStudyBlock = null;
    let activeStudyTemplateId = null;
    let currentEditingTemplateSlotId = null;
    let studyTemplates = [];
    
    // ==========================================
    // ESTADO DE MODELOS PARA TO-DO PERSONALS (TOTALMENTE ZERADO)
    // ==========================================
    let todoConfigActiveTab = 'templates';
    let activeTodoTemplateId = null;
    let currentEditingTodoTemplateSlotId = null;
    let todoTemplates = [];

    // ==========================================
    // ESTADO DE MODELOS PARA LEMBRETES & ALARMES (TOTALMENTE ZERADO)
    // ==========================================
    let reminderConfigActiveTab = 'templates';
    let activeReminderTemplateId = null;
    let currentEditingReminderTemplateSlotId = null;
    let reminderTemplates = [];

    // Estado das Abas de Configuração de Estudos (Semanas Modelo vs Google Agenda)
    let studyConfigActiveTab = 'templates';

    // Estado TRIP (Viagens) - Totalmente limpo para registros do usuário
    let trips = [];
    let tripFilterCategory = 'all';
    let tripViewMode = 'cards';
    try {
        tripViewMode = localStorage.getItem('mcp_trip_view_mode') || 'cards';
    } catch(e) { tripViewMode = 'cards'; }
    let currentEditingTripId = null;

    // Estado do Alarme Heroico
    let audioCtx = null;
    let alarmAudioBuffer = null;
    let currentAlarmSource = null;
    let isAlarmActive = false;

    // ==========================================
    // INICIALIZAÇÃO & REALTIME
    // ==========================================

    async function initControl() {
        console.log('🎛️ Inicializando M.C.P CONTROL Engine (v2026.4)...');
        loadLocalStorageFallback();
        initSessionAccentColors();
        checkOAuthRedirectToken();
        setupOAuthMessageListener();
        renderControlUI();
        initWebAudioContext();
        await loadAllControlData();
        setupMasterTicker();
        renderControlUI();

        // Cancelamento preventivo de alarmes residuais agendados anteriormente no SO Android
        if (typeof window !== 'undefined' && window.AndroidBridge && typeof window.AndroidBridge.cancelAllAlarms === 'function') {
            try {
                window.AndroidBridge.cancelAllAlarms();
                console.log('🔇 AndroidBridge: cancelAllAlarms() executado com sucesso no startup.');
            } catch (e) {
                console.warn('Erro ao chamar cancelAllAlarms:', e);
            }
        }
        window.addEventListener('androidbridge:ready', () => {
            if (window.AndroidBridge && typeof window.AndroidBridge.cancelAllAlarms === 'function') {
                try {
                    window.AndroidBridge.cancelAllAlarms();
                } catch (e) {}
            }
        });

        const unlockAudio = () => {
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            window.removeEventListener('click', unlockAudio);
            window.removeEventListener('touchstart', unlockAudio);
        };
        window.addEventListener('click', unlockAudio);
        window.addEventListener('touchstart', unlockAudio);

        // Auto-Sync Notion ao iniciar (após carregamento inicial)
        if (notionSettings.auto_sync) {
            setTimeout(() => syncNotionTasks(true), 1500);
        }

        // Auto-Sync Ultra-Rápido ao focar / retornar para a aba
        window.addEventListener('focus', () => {
            if (googleCalendarSettings.access_token && googleCalendarSettings.auto_sync !== false) {
                syncGoogleCalendar(true);
            }
            if (notionSettings.auto_sync) {
                syncNotionTasks(true);
            }
        });
        document.addEventListener('visibilitychange', () => {
            if (!document.hidden && googleCalendarSettings.access_token && googleCalendarSettings.auto_sync !== false) {
                syncGoogleCalendar(true);
            }
            if (!document.hidden && notionSettings.auto_sync) {
                syncNotionTasks(true);
            }
        });
        // Ciclo de fundo seguro e controlado (a cada 60 segundos)
        setInterval(() => {
            if (document.hidden) return;
            if (googleCalendarSettings.access_token && googleCalendarSettings.auto_sync !== false) {
                syncGoogleCalendar(true);
            }
            if (notionSettings.auto_sync) {
                syncNotionTasks(true);
            }
        }, 60000);
    }

    /**
     * Escuta mensagens postMessage vindas da janela /oauth.html
     * Esta é a forma mais segura e universal de receber o token OAuth em produção.
     */
    function setupOAuthMessageListener() {
        window.addEventListener('message', async (event) => {
            if (!event.data || !event.data.type) return;

            // Aceita mensagens da mesma origem ou do domínio oficial Vercel
            const isAllowedOrigin = event.origin === window.location.origin || 
                                    event.origin.includes('vercel.app') || 
                                    event.origin.includes('localhost') || 
                                    event.origin.includes('tauri.localhost');
            if (!isAllowedOrigin) return;

            if (event.data.type === 'GOOGLE_OAUTH_SUCCESS') {
                const { access_token, expires_in } = event.data;
                googleCalendarSettings.access_token = access_token;
                googleCalendarSettings.token_expires_at = Date.now() + (expires_in || 3600) * 1000;
                saveLocalStorageBackup();
                if (window.showToast) window.showToast('✓ Conta Google conectada com sucesso!');
                await syncGoogleCalendar();
                closeGoogleCalendarConnectModal();
            } else if (event.data.type === 'GOOGLE_OAUTH_ERROR') {
                console.error('Erro OAuth Google:', event.data.error);
                if (window.showToast) window.showToast('❌ Erro ao conectar com o Google: ' + event.data.error);
            }
        });

        // Escuta quando a tela volta ao foco para checar credenciais sincronizadas via nuvem
        window.addEventListener('focus', () => {
            checkPendingCloudAuth();
        });
        document.addEventListener('visibilitychange', () => {
            if (document.visibilityState === 'visible') {
                checkPendingCloudAuth();
            }
        });
    }

    /**
     * Verifica se há um pending sync via redirect direto (quando popup é bloqueado)
     */
    function checkOAuthRedirectToken() {
        // Caso 1: token veio no hash da URL (redirect direto, sem popup)
        if (typeof window !== 'undefined' && window.location.hash && window.location.hash.includes('access_token')) {
            try {
                const hash = window.location.hash.substring(1);
                const params = new URLSearchParams(hash);
                const token = params.get('access_token');
                const expiresIn = parseInt(params.get('expires_in') || '3600', 10);
                if (token) {
                    googleCalendarSettings.access_token = token;
                    googleCalendarSettings.token_expires_at = Date.now() + expiresIn * 1000;
                    saveLocalStorageBackup();
                    window.history.replaceState(null, '', window.location.pathname + window.location.search);
                    if (window.showToast) window.showToast('✓ Conta Google conectada com sucesso!');
                    setTimeout(() => syncGoogleCalendar(), 800);
                }
            } catch (e) {
                console.error('Erro ao ler token OAuth do hash:', e);
            }
        }
        // Caso 2: redirect via /oauth.html salvou no localStorage (popup bloqueado)
        if (localStorage.getItem('mcp_oauth_pending_sync') === '1') {
            localStorage.removeItem('mcp_oauth_pending_sync');
            const saved = JSON.parse(localStorage.getItem('mcp_control_google_cal_settings') || '{}');
            if (saved.access_token) {
                googleCalendarSettings.access_token = saved.access_token;
                googleCalendarSettings.token_expires_at = saved.token_expires_at;
                saveLocalStorageBackup();
                if (window.showToast) window.showToast('✓ Conta Google conectada com sucesso!');
                setTimeout(() => syncGoogleCalendar(), 800);
            }
        }
    }

    let htmlAlarmAudio = null;
    let sirenTimerId = null;

    function getHtmlAlarmAudio() {
        if (!htmlAlarmAudio && typeof Audio !== 'undefined') {
            try {
                htmlAlarmAudio = new Audio('assets/sounds/ps2_startup.mp3');
                htmlAlarmAudio.loop = true;
                htmlAlarmAudio.volume = 1.0;
                htmlAlarmAudio.preload = 'auto';
            } catch (e) {
                console.warn('HTML5 Audio não suportado:', e);
            }
        }
        return htmlAlarmAudio;
    }

    function initWebAudioContext() {
        try {
            const AudioContextClass = window.AudioContext || window.webkitAudioContext;
            if (AudioContextClass && !audioCtx) {
                audioCtx = new AudioContextClass();
            }
            loadAlarmSoundBuffer();
            getHtmlAlarmAudio();
            setupAudioUnlockListeners();
        } catch (e) {
            console.warn('Web Audio API não inicializada:', e);
        }
    }

    function setupAudioUnlockListeners() {
        const unlock = () => {
            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => {});
            }
            if (!alarmAudioBuffer) {
                loadAlarmSoundBuffer();
            }
            if (!htmlAlarmAudio) {
                getHtmlAlarmAudio();
            }
        };

        ['click', 'touchstart', 'keydown', 'mousedown'].forEach(evt => {
            document.addEventListener(evt, unlock, { once: false, passive: true });
        });
    }

    async function loadAlarmSoundBuffer() {
        try {
            const response = await fetch('assets/sounds/ps2_startup.mp3');
            if (response.ok) {
                const arrayBuffer = await response.arrayBuffer();
                if (audioCtx) {
                    audioCtx.decodeAudioData(arrayBuffer, (decoded) => {
                        alarmAudioBuffer = decoded;
                    }, (err) => console.warn('Aviso: decodificação WebAudio com fallback pronto:', err));
                }
            }
        } catch (e) {
            console.warn('Aviso: Áudio local ps2_startup.mp3 indisponível, fallback eletrônico pronto.');
        }
    }

    async function loadAllControlData() {
        const client = getSupabase();
        if (!client) return;

        try {
            const [grpRes, todoRes, remGrpRes, remRes, setRes, tplRes, motRes, diaryRes, studyBlockRes, studySetRes, studyTplRes, tripRes] = await Promise.all([
                client.from('control_todo_groups').select('*').order('sort_order', { ascending: true }),
                client.from('control_todos').select('*').order('created_at', { ascending: false }),
                client.from('control_reminder_groups').select('*').order('created_at', { ascending: true }),
                client.from('control_reminders').select('*').order('created_at', { ascending: false }),
                client.from('control_email_settings').select('*').eq('id', 'default_settings').maybeSingle(),
                client.from('control_email_templates').select('*').order('created_at', { ascending: true }),
                client.from('control_motivation_rules').select('*').order('created_at', { ascending: true }),
                client.from('diary_entries').select('id, entry_date, title_preview, folder, mood, word_count, tags, created_at').order('entry_date', { ascending: false }),
                client.from('control_study_blocks').select('*').order('sort_order', { ascending: true }),
                client.from('control_study_settings').select('*').eq('id', 'default').maybeSingle(),
                client.from('control_study_templates').select('*').order('id', { ascending: true }),
                client.from('control_trips').select('*').order('start_date', { ascending: true })
            ]);

            if (grpRes.data && grpRes.data.length > 0) todoGroups = grpRes.data;
            if (todoRes && Array.isArray(todoRes.data)) {
                todosList = todoRes.data;
            }
            if (remGrpRes.data && remGrpRes.data.length > 0) reminderGroups = remGrpRes.data;
            if (remRes && Array.isArray(remRes.data)) {
                remindersList = remRes.data.map(r => {
                    if (!r.notion_page_id) {
                        if (r.id && r.id.startsWith('notion_rem_')) {
                            const raw = r.id.replace('notion_rem_', '');
                            r.notion_page_id = raw.length === 32
                                ? `${raw.slice(0,8)}-${raw.slice(8,12)}-${raw.slice(12,16)}-${raw.slice(16,20)}-${raw.slice(20)}`
                                : raw;
                        } else if (r.notes) {
                            const match = r.notes.match(/\[notion_id:\s*([a-f0-9-]+)\]/i);
                            if (match) r.notion_page_id = match[1];
                        }
                    }
                    return r;
                });
            }
            if (setRes && setRes.data) {
                emailSettings = { ...emailSettings, ...setRes.data };
                if (!emailSettings.resend_api_key) emailSettings.resend_api_key = 'demo_resend_api_key_placeholder';
                // Sincroniza Google Calendar Settings salvas no Supabase
                if (setRes.data.settings && setRes.data.settings.google_calendar_settings) {
                    googleCalendarSettings = { ...googleCalendarSettings, ...setRes.data.settings.google_calendar_settings };
                }
                // Sincroniza Notion Settings salvas no Supabase
                if (setRes.data.settings && setRes.data.settings.notion_settings) {
                    notionSettings = { ...notionSettings, ...setRes.data.settings.notion_settings };
                }
            }
            if (motRes.data && motRes.data.length > 0) motivationRules = motRes.data;
            if (diaryRes && diaryRes.data) diaryEntriesList = diaryRes.data;
            if (studyBlockRes && Array.isArray(studyBlockRes.data)) studyBlocks = studyBlockRes.data;
            if (studySetRes && studySetRes.data) studySettings = { ...studySettings, ...studySetRes.data };
            if (studyTplRes && studyTplRes.data && studyTplRes.data.length > 0) studyTemplates = studyTplRes.data;
            if (tripRes && tripRes.data && tripRes.data.length > 0) trips = tripRes.data;
            if (tplRes.data && tplRes.data.length > 0) {
                emailTemplates = tplRes.data.map(t => {
                    if (t.markdown_content && typeof t.markdown_content === 'string') {
                        t.markdown_content = t.markdown_content.replace(/\\n/g, '\n');
                    }
                    return t;
                });
            }

            saveLocalStorageBackup();
        } catch (err) {
            console.error('Erro ao carregar dados de CONTROL do Supabase:', err);
        }
    }

    function loadLocalStorageFallback() {
        try {
            // SANEAMENTO RADICAL E EXPURGO DEFINITIVO DE MOCKS & ALARMES RESIDUAIS
            const KEYS_TO_EXPURGE = [
                'mcp_control_reminders',
                'mcp_control_todos',
                'mcp_control_habits',
                'mcp_control_study_blocks',
                'mcp_control_trips',
                'mcp_control_study_templates',
                'mcp_control_todo_templates',
                'mcp_control_reminder_templates',
                'mcp_control_active_study_template',
                'mcp_control_active_reminder_template',
                'mcp_control_active_todo_template'
            ];
            KEYS_TO_EXPURGE.forEach(k => {
                try { localStorage.removeItem(k); } catch(e){}
            });

            todosList = [];
            remindersList = [];
            studyBlocks = [];
            habitsList = [];
            trips = [];
            todoTemplates = [];
            reminderTemplates = [];
            studyTemplates = [];
            activeStudyTemplateId = null;
            activeReminderTemplateId = null;
            activeTodoTemplateId = null;

            const g = localStorage.getItem('mcp_control_todo_groups');
            if (g) todoGroups = JSON.parse(g);

            const rg = localStorage.getItem('mcp_control_reminder_groups');
            if (rg) {
                try {
                    const parsed = JSON.parse(rg);
                    if (Array.isArray(parsed) && parsed.length > 0) reminderGroups = parsed;
                } catch(e){}
            }
            const s = localStorage.getItem('mcp_control_email_settings');
            if (s) {
                const parsed = JSON.parse(s);
                emailSettings = { ...emailSettings, ...parsed };
                if (!emailSettings.resend_api_key) emailSettings.resend_api_key = 'demo_resend_api_key_placeholder';
            }
            const tp = localStorage.getItem('mcp_control_email_templates');
            if (tp) emailTemplates = JSON.parse(tp);
            const mot = localStorage.getItem('mcp_control_motivation_rules');
            if (mot) motivationRules = JSON.parse(mot);
            const gcal = localStorage.getItem('mcp_control_google_cal_settings');
            if (gcal) googleCalendarSettings = JSON.parse(gcal);
            const gev = localStorage.getItem('mcp_control_google_events');
            if (gev) googleEventsList = JSON.parse(gev);
            const d = localStorage.getItem('mcp_control_diary_entries');
            if (d) diaryEntriesList = JSON.parse(d);
            const ns = localStorage.getItem('mcp_control_notion_settings');
            if (ns) {
                try {
                    const parsed = JSON.parse(ns);
                    notionSettings = { ...notionSettings, ...parsed };
                } catch(e) {}
            }
            studyBlocks = [];
            studyTemplates = [];
            todoTemplates = [];
            reminderTemplates = [];
            activeStudyTemplateId = null;
            trips = [];
        } catch (e) {}
    }

    function saveLocalStorageBackup() {
        try {
            localStorage.setItem('mcp_control_todo_groups', JSON.stringify(todoGroups));
            localStorage.setItem('mcp_control_todos', JSON.stringify(todosList));
            localStorage.setItem('mcp_control_reminder_groups', JSON.stringify(reminderGroups));
            localStorage.setItem('mcp_control_reminders', JSON.stringify(remindersList));
            localStorage.setItem('mcp_control_notion_settings', JSON.stringify(notionSettings));
            localStorage.setItem('mcp_control_email_settings', JSON.stringify(emailSettings));
            localStorage.setItem('mcp_control_email_templates', JSON.stringify(emailTemplates));
            localStorage.setItem('mcp_control_motivation_rules', JSON.stringify(motivationRules));
            localStorage.setItem('mcp_control_google_cal_settings', JSON.stringify(googleCalendarSettings));
            localStorage.setItem('mcp_control_google_events', JSON.stringify(googleEventsList));
            localStorage.setItem('mcp_control_diary_entries', JSON.stringify(diaryEntriesList));
            localStorage.setItem('mcp_control_study_blocks', JSON.stringify(studyBlocks));
            localStorage.setItem('mcp_control_study_settings', JSON.stringify(studySettings));
            localStorage.setItem('mcp_control_study_templates', JSON.stringify(studyTemplates));
            localStorage.setItem('mcp_control_todo_templates', JSON.stringify(todoTemplates));
            localStorage.setItem('mcp_control_reminder_templates', JSON.stringify(reminderTemplates));
            localStorage.setItem('mcp_control_active_study_template', activeStudyTemplateId);
            localStorage.setItem('mcp_control_trips', JSON.stringify(trips));
        } catch (e) {}
    }

    function setupRealtimeSubscriptions() {
        const client = getSupabase();
        if (!client) return;

        client
            .channel('control_engine_realtime_v4')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'control_todos' }, () => reloadTodos())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'control_todo_groups' }, () => reloadTodoGroups())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'control_reminders' }, () => reloadReminders())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'control_reminder_groups' }, () => reloadReminderGroups())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'control_email_settings' }, () => reloadEmailSettings())
            .on('postgres_changes', { event: '*', schema: 'public', table: 'control_email_templates' }, () => reloadEmailTemplates())
            .subscribe();
    }

    async function reloadTodos() {
        const client = getSupabase();
        if (!client) return;
        const { data } = await client.from('control_todos').select('*').order('created_at', { ascending: false });
        if (data) { todosList = data; renderTodosListUI(); renderTodoGroupsUI(); updateSidebarCounts(); }
    }

    async function reloadTodoGroups() {
        const client = getSupabase();
        if (!client) return;
        const { data } = await client.from('control_todo_groups').select('*').order('sort_order', { ascending: true });
        if (data && data.length > 0) { todoGroups = data; renderTodoGroupsUI(); renderTodoGroupFilterTabs(); }
    }

    async function reloadReminders() {
        const client = getSupabase();
        if (!client) return;
        const { data } = await client.from('control_reminders').select('*').order('created_at', { ascending: false });
        if (data) { remindersList = data; renderRemindersListUI(); renderReminderGroupsUI(); updateSidebarCounts(); }
    }

    async function reloadReminderGroups() {
        const client = getSupabase();
        if (!client) return;
        const { data } = await client.from('control_reminder_groups').select('*').order('created_at', { ascending: true });
        if (data && data.length > 0) { reminderGroups = data; renderReminderGroupsUI(); renderReminderGroupFilterTabs(); }
    }

    async function reloadEmailSettings() {
        const client = getSupabase();
        if (!client) return;
        const { data } = await client.from('control_email_settings').select('*').eq('id', 'default_settings').maybeSingle();
        if (data) {
            emailSettings = { ...emailSettings, ...data };
            if (!emailSettings.resend_api_key) emailSettings.resend_api_key = 'demo_resend_api_key_placeholder';
        }
    }

    async function reloadEmailTemplates() {
        const client = getSupabase();
        if (!client) return;
        const { data } = await client.from('control_email_templates').select('*').order('created_at', { ascending: true });
        if (data && data.length > 0) {
            emailTemplates = data.map(t => {
                if (t.markdown_content && typeof t.markdown_content === 'string') {
                    t.markdown_content = t.markdown_content.replace(/\\n/g, '\n');
                }
                return t;
            });
            renderEmailTemplatesMicroCards();
        }
    }

    // ==========================================
    // SISTEMA 1: ALARME HEROICO (LOOP + DISMISS 1 TOQUE)
    // ==========================================

    function startElectronicSiren(gainNode, compressor) {
        // Desativado: M.C.P Personal OS utiliza exclusivamente o áudio ps2_startup.mp3
        return;
    }

    function triggerHeroicAlarm({ title, subtitle, details, reason, emoji = '⚡', color = '#ec4899', hasSound = true }) {
        isAlarmActive = true;
        const alarmReason = reason || details || subtitle || 'Horário programado atingido.';

        if (hasSound !== false) {
            playAmplifiedAlarmSound();
        }

        // Vibração física tátil nativa Android / Samsung
        if (typeof window !== 'undefined' && window.AndroidBridge && typeof window.AndroidBridge.vibrate === 'function') {
            try { window.AndroidBridge.vibrate("[0, 500, 200, 500, 200, 500, 200, 1000]"); } catch (e) {}
        } else if (typeof navigator !== 'undefined' && typeof navigator.vibrate === 'function') {
            try { navigator.vibrate([300, 150, 300, 150, 600]); } catch (e) {}
        }

        // Notificação Nativa Android / Samsung One UI & Desktop
        if (typeof window !== 'undefined' && window.AndroidBridge && typeof window.AndroidBridge.showNotification === 'function') {
            try {
                window.AndroidBridge.showNotification(
                    title,
                    `Motivo: ${alarmReason}`,
                    true // isAlarm = true (Heads-Up e som nativo ps2_startup.mp3)
                );
            } catch (e) {}
        } else if (typeof Notification !== 'undefined') {
            try {
                if (Notification.permission === 'granted') {
                    new Notification(`${emoji} ${title}`, {
                        body: `Motivo: ${alarmReason}`,
                        icon: 'assets/brand/icon.png'
                    });
                } else if (Notification.permission !== 'denied') {
                    Notification.requestPermission();
                }
            } catch (e) {}
        }

        const overlay = document.getElementById('heroic-alarm-overlay');
        const titleEl = document.getElementById('alarm-overlay-title');
        const subtitleEl = document.getElementById('alarm-overlay-subtitle');
        const detailsEl = document.getElementById('alarm-overlay-details');
        const iconEl = document.getElementById('alarm-overlay-icon');

        if (titleEl) titleEl.innerText = title;
        if (subtitleEl) subtitleEl.innerText = subtitle || 'ALARME DO SISTEMA • ATIVO';
        if (detailsEl) detailsEl.innerText = alarmReason;
        if (iconEl) iconEl.innerText = emoji;

        if (overlay) {
            overlay.classList.remove('hidden');
            overlay.style.opacity = '1';
        }
    }

    function playAmplifiedAlarmSound() {
        try {
            if (!audioCtx) {
                const AudioContextClass = window.AudioContext || window.webkitAudioContext;
                if (AudioContextClass) audioCtx = new AudioContextClass();
            }

            if (audioCtx && audioCtx.state === 'suspended') {
                audioCtx.resume().catch(() => {});
            }

            if (currentAlarmSource) {
                try { currentAlarmSource.stop(); } catch (e) {}
                currentAlarmSource = null;
            }
            if (sirenTimerId) {
                clearInterval(sirenTimerId);
                sirenTimerId = null;
            }

            // Executa áudio via Web Audio API amplificado ou fallback HTML5 Audio (som único e exclusivo ps2_startup.mp3)
            if (audioCtx && alarmAudioBuffer) {
                const compressor = audioCtx.createDynamicsCompressor();
                compressor.threshold.setValueAtTime(-12, audioCtx.currentTime);
                compressor.knee.setValueAtTime(30, audioCtx.currentTime);
                compressor.ratio.setValueAtTime(12, audioCtx.currentTime);
                compressor.attack.setValueAtTime(0.003, audioCtx.currentTime);
                compressor.release.setValueAtTime(0.25, audioCtx.currentTime);

                const gainNode = audioCtx.createGain();
                gainNode.gain.setValueAtTime(2.2, audioCtx.currentTime);

                const source = audioCtx.createBufferSource();
                source.buffer = alarmAudioBuffer;
                source.loop = true;
                source.connect(gainNode);
                gainNode.connect(compressor);
                compressor.connect(audioCtx.destination);
                source.start(0);
                currentAlarmSource = source;
            } else {
                try {
                    const htmlAudio = getHtmlAlarmAudio();
                    if (htmlAudio) {
                        htmlAudio.currentTime = 0;
                        const p = htmlAudio.play();
                        if (p !== undefined) p.catch(e => console.warn('HTML5 Audio play aguardando interação:', e));
                    }
                } catch (e) {}
            }
        } catch (e) {
            console.warn('Erro ao tocar áudio PS2 amplificado:', e);
        }
    }

    function stopHeroicAlarm() {
        if (!isAlarmActive) return;
        isAlarmActive = false;

        if (currentAlarmSource) {
            try {
                currentAlarmSource.stop();
                currentAlarmSource.disconnect();
            } catch (e) {}
            currentAlarmSource = null;
        }

        if (sirenTimerId) {
            clearInterval(sirenTimerId);
            sirenTimerId = null;
        }

        if (htmlAlarmAudio) {
            try {
                htmlAlarmAudio.pause();
                htmlAlarmAudio.currentTime = 0;
            } catch (e) {}
        }

        const overlay = document.getElementById('heroic-alarm-overlay');
        if (overlay) {
            overlay.style.opacity = '0';
            setTimeout(() => overlay.classList.add('hidden'), 300);
        }
    }

    function testHeroicAlarm() {
        triggerHeroicAlarm({
            title: '⏰ Teste de Alarme & Lembrete Heroico',
            subtitle: 'PERSONAL OS — Sistema de Alarmes',
            details: 'O alarme heroico está operando com som amplificado, vibração e alerta visual.',
            emoji: '🔔',
            color: '#a855f7',
            hasSound: true
        });
    }

    // ==========================================
    // SISTEMA 2: RESEND EMAIL ENGINE VIA SUPABASE EDGE FUNCTION
    // ==========================================

    async function sendResendEmail({ to, subject, html, markdown }) {
        const apiKey = emailSettings.resend_api_key || 'demo_resend_api_key_placeholder';
        if (!apiKey) {
            showToast('⚠️ API Key do Resend não configurada. Acesse Admin → Configurações e insira sua chave.', 'warning');
            return { success: false, error: 'API key not configured' };
        }
        const recipient = to || emailSettings.recipient_email || 'demo@personal-os.io';
        const sender = `${emailSettings.sender_name || 'PERSONAL OS'} <${emailSettings.sender_email || 'onboarding@resend.dev'}>`;

        const markdownClean = markdown ? markdown.replace(/\\n/g, '\n') : '';
        const markdownWithSignature = markdownClean ? (markdownClean + EMAIL_SIGNATURE) : '';
        const emailHtml = html ? (html.includes('Powered BY') ? html : (html + EMAIL_SIGNATURE_HTML)) : renderRichMarkdownToHtml(markdownWithSignature);

        try {
            const controller = new AbortController();
            const timeoutId = setTimeout(() => controller.abort(), 15000); // 15s timeout

            const response = await fetch(EDGE_FUNCTION_EMAIL_URL, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}`
                },
                body: JSON.stringify({
                    to: recipient,
                    from: sender,
                    subject: subject,
                    html: emailHtml,
                    text: markdownClean,
                    apiKey: apiKey,
                    api_key: apiKey
                }),
                signal: controller.signal
            });

            clearTimeout(timeoutId);

            const result = await response.json().catch(() => ({}));
            const isSuccess = response.ok && (result.success || result.data?.id || result.id);

            const client = getSupabase();
            if (client) {
                try {
                    await client.from('control_email_logs').insert([{
                        id: 'log_' + Date.now(),
                        template_type: subject.includes('BRIEFING') ? 'daily_briefing' : (subject.includes('Alerta') ? 'task_alert' : 'habit_finished'),
                        recipient: recipient,
                        subject: subject,
                        status: isSuccess ? 'sent' : 'failed',
                        response_data: result
                    }]);
                } catch (logErr) {
                    console.warn('Erro ao salvar log de email:', logErr);
                }
            }

            if (isSuccess) {
                if (window.showToast) window.showToast('📧 Email enviado com sucesso via Resend!');
                return { success: true, id: result.data?.id || result.id };
            } else {
                const errMsg = result.error?.message || result.error || result.message || 'Verifique o destinatário da conta Resend';
                if (window.showToast) window.showToast(`⚠️ Resend: ${errMsg}`);
                return { success: false, error: errMsg };
            }
        } catch (err) {
            const msg = err.name === 'AbortError' ? 'Tempo limite esgotado (15s)' : err.message;
            if (window.showToast) window.showToast(`⚠️ Erro de envio de email: ${msg}`);
            return { success: false, error: msg };
        }
    }

    // ==========================================
    // CANAL OFICIAL DE ALERTAS: EXCLUSIVO DISCORD (#🥋┃tutor-ai)
    // ==========================================
    const TUTOR_DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1548863267638747148/CcZC3e4Bel5YeCPnrQtMdr93VTf03SDNQlPJKdIGMQ38GNEbVuZ1OpHhPE1DRR8GkpEb';

    async function sendDiscordAlert({ title, message, details, color = 0x5865F2, fields = [] }) {
        try {
            const now = getBrasiliaDate();
            const timeFormatted = now.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' (BRT)';
            const dateFormatted = formatDisplayDate(formatISODate(now));

            const embed = {
                title: title || '⚡ [PERSONAL OS] Alerta Oficial',
                description: message || details || '',
                color: color,
                timestamp: new Date().toISOString(),
                footer: {
                    text: `M.C.P Personal OS • ${timeFormatted} • ${dateFormatted}`
                }
            };

            if (Array.isArray(fields) && fields.length > 0) {
                embed.fields = fields;
            }

            const payload = {
                username: 'Personal OS • Alertas',
                avatar_url: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=256&q=80',
                embeds: [embed]
            };

            const resp = await fetch(TUTOR_DISCORD_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (resp.ok) {
                console.log('✅ Alerta despachado exclusivamente para o Discord (#🥋┃tutor-ai)');
            }
            return { success: resp.ok };
        } catch (err) {
            console.warn('⚠️ Erro ao despachar alerta para o Discord:', err);
            return { success: false, error: err.message };
        }
    }

    async function notifyHabitCompletedEmail(habit, elapsedSeconds) {
        // Redirecionamento estrito: Alertas somente e tão somente no chat do Discord
        const durationFormatted = formatSecondsToDetailedDuration(elapsedSeconds);
        const nowBrt = getBrasiliaDate();
        const timeStr = nowBrt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + ' BRT';

        await sendDiscordAlert({
            title: `🏆 [Personal OS] Hábito Concluído: ${habit.title || 'Hábito'}`,
            message: `Meta de foco cumprida com sucesso e registrada na nuvem.`,
            color: 0x10b981,
            fields: [
                { name: 'Duração da Sessão', value: durationFormatted, inline: true },
                { name: 'Horário de Conclusão', value: timeStr, inline: true },
                { name: 'Categoria', value: habit.category || 'Geral', inline: true }
            ]
        });
    }

    // ==========================================
    // BRIEFING DE HÁBITOS (EXTRAÍDO DO GERAL DASHBOARD) — SEM IA
    // ==========================================

    function getHabitsFromSystem() {
        if (window.HabitTracker) {
            if (typeof window.HabitTracker.getHabits === 'function') {
                const list = window.HabitTracker.getHabits();
                if (list && list.length > 0) return list;
            }
            if (typeof window.HabitTracker.getHabitsList === 'function') {
                const list = window.HabitTracker.getHabitsList();
                if (list && list.length > 0) return list;
            }
        }

        try {
            const local1 = localStorage.getItem('mcp_habits');
            if (local1) {
                const parsed1 = JSON.parse(local1);
                if (Array.isArray(parsed1) && parsed1.length > 0) return parsed1;
            }
            const local2 = localStorage.getItem('habits');
            if (local2) {
                const parsed2 = JSON.parse(local2);
                if (Array.isArray(parsed2) && parsed2.length > 0) return parsed2;
            }
        } catch (e) {}

        return [];
    }

    function generateHabitsAnalyticsData(periodType) {
        const habits = getHabitsFromSystem();
        const now = getBrasiliaDate();
        const todayStr = formatISODate(now);

        let daysCount = 1;
        let dateList = [todayStr];

        if (periodType === 'week') {
            daysCount = 7;
            dateList = [];
            for (let i = 6; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                dateList.push(formatISODate(d));
            }
        } else if (periodType === 'month') {
            daysCount = 30;
            dateList = [];
            for (let i = 29; i >= 0; i--) {
                const d = new Date(now);
                d.setDate(d.getDate() - i);
                dateList.push(formatISODate(d));
            }
        }

        let totalOpportunities = habits.length * daysCount;
        let totalCompleted = 0;
        let rows = [];

        habits.forEach(h => {
            const completeDays = h.complete_days || [];
            const completedInPeriod = completeDays.filter(d => dateList.includes(d));
            const count = completedInPeriod.length;
            totalCompleted += count;
            const habitSuccessRate = daysCount > 0 ? Math.round((count / daysCount) * 100) : 0;

            rows.push({
                title: h.title,
                emoji: h.emoji || '⚡',
                isCompletedToday: completeDays.includes(todayStr),
                completedCount: count,
                daysCount: daysCount,
                successRate: habitSuccessRate,
                dateListStatus: dateList.map(dStr => completeDays.includes(dStr))
            });
        });

        const totalFailures = Math.max(0, totalOpportunities - totalCompleted);
        const overallSuccessRate = totalOpportunities > 0 ? Math.round((totalCompleted / totalOpportunities) * 100) : 0;
        const overallFailureRate = Math.max(0, 100 - overallSuccessRate);

        return {
            periodType,
            dateList,
            totalOpportunities,
            totalCompleted,
            totalFailures,
            overallSuccessRate,
            overallFailureRate,
            rows
        };
    }

    function buildHabitsBriefingHtml(analytics) {
        const periodLabels = { 'day': 'DIA', 'week': 'SEMANA', 'month': 'MÊS' };
        const label = periodLabels[analytics.periodType] || 'DIA';
        const dateStr = getBrasiliaDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        let tableRowsHtml = '';

        if (analytics.periodType === 'day') {
            analytics.rows.forEach(r => {
                const statusBadge = r.isCompletedToday 
                    ? '<span style="color: #10b981; font-weight: 700; background: rgba(16,185,129,0.15); padding: 4px 8px; border-radius: 6px;">🟢 CONCLUÍDO</span>'
                    : '<span style="color: #ef4444; font-weight: 700; background: rgba(239,68,68,0.15); padding: 4px 8px; border-radius: 6px;">🔴 NÃO CONCLUÍDO</span>';
                tableRowsHtml += `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                        <td style="padding: 12px 16px; color: #ffffff; font-weight: 600;">${r.emoji} ${r.title}</td>
                        <td style="padding: 12px 16px; text-align: right;">${statusBadge}</td>
                    </tr>
                `;
            });
        } else {
            analytics.rows.forEach(r => {
                const dots = r.dateListStatus.map(st => st ? '🟢' : '🔴').join(' ');
                tableRowsHtml += `
                    <tr style="border-bottom: 1px solid rgba(255,255,255,0.08);">
                        <td style="padding: 12px 16px; color: #ffffff; font-weight: 600;">
                            ${r.emoji} ${r.title}
                            <div style="font-size: 11px; margin-top: 5px; letter-spacing: 2px;">${dots}</div>
                        </td>
                        <td style="padding: 12px 16px; text-align: right; color: #ffffff; font-weight: 700; font-family: monospace;">
                            ${r.completedCount}/${r.daysCount} (${r.successRate}%)
                        </td>
                    </tr>
                `;
            });
        }

        return `
            <div style="font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Segoe UI', Roboto, sans-serif; background: #0c0c12; color: #f4f4f5; padding: 32px; border-radius: 20px; border: 1px solid rgba(255,255,255,0.18); max-width: 620px; margin: auto; box-shadow: 0 25px 60px rgba(0,0,0,0.5);">
                
                <h1 style="color: #ffffff; font-size: 22px; font-weight: 800; letter-spacing: 0.04em; margin-bottom: 4px; text-transform: uppercase;">
                    BRIEFING (${label}) DE HÁBITOS (ANALYTICS)
                </h1>
                <p style="color: #a1a1aa; font-size: 12px; font-family: monospace; margin-top: 0; margin-bottom: 24px;">
                    Data de Referência: ${dateStr} • Fuso Oficial: Brasília (BRT)
                </p>

                <!-- Grid de Métricas -->
                <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 28px;">
                    <div style="background: rgba(16,185,129,0.12); border: 1px solid rgba(16,185,129,0.35); padding: 14px; border-radius: 14px;">
                        <span style="font-size: 11px; font-family: monospace; color: #a7f3d0; text-transform: uppercase; font-weight: 700;">Habitos Concluídos</span>
                        <div style="font-size: 24px; font-weight: 800; color: #10b981; font-family: monospace; margin-top: 4px;">${analytics.totalCompleted}</div>
                    </div>
                    <div style="background: rgba(239,68,68,0.12); border: 1px solid rgba(239,68,68,0.35); padding: 14px; border-radius: 14px;">
                        <span style="font-size: 11px; font-family: monospace; color: #fecaca; text-transform: uppercase; font-weight: 700;">Quantidade de Fracassos</span>
                        <div style="font-size: 24px; font-weight: 800; color: #ef4444; font-family: monospace; margin-top: 4px;">${analytics.totalFailures}</div>
                    </div>
                    <div style="background: rgba(56,189,248,0.12); border: 1px solid rgba(56,189,248,0.35); padding: 14px; border-radius: 14px;">
                        <span style="font-size: 11px; font-family: monospace; color: #bae6fd; text-transform: uppercase; font-weight: 700;">Taxa Geral de Sucesso</span>
                        <div style="font-size: 24px; font-weight: 800; color: #38bdf8; font-family: monospace; margin-top: 4px;">${analytics.overallSuccessRate}%</div>
                    </div>
                    <div style="background: rgba(245,158,11,0.12); border: 1px solid rgba(245,158,11,0.35); padding: 14px; border-radius: 14px;">
                        <span style="font-size: 11px; font-family: monospace; color: #fde68a; text-transform: uppercase; font-weight: 700;">Taxa Geral de Fracasso</span>
                        <div style="font-size: 24px; font-weight: 800; color: #f59e0b; font-family: monospace; margin-top: 4px;">${analytics.overallFailureRate}%</div>
                    </div>
                </div>

                <!-- Boletim / Tabela -->
                <h3 style="color: #ffffff; font-size: 14px; font-weight: 700; margin-bottom: 10px; text-transform: uppercase; font-family: monospace; letter-spacing: 0.05em;">
                    📋 BOLETIM EXECUTIVO
                </h3>
                <table style="width: 100%; border-collapse: collapse; background: rgba(255,255,255,0.03); border-radius: 14px; overflow: hidden; border: 1px solid rgba(255,255,255,0.12); font-size: 13px;">
                    <thead>
                        <tr style="background: rgba(255,255,255,0.08); text-align: left;">
                            <th style="padding: 12px 16px; color: #a1a1aa; font-family: monospace; font-size: 11px; font-weight: 700;">HÁBITO</th>
                            <th style="padding: 12px 16px; color: #a1a1aa; font-family: monospace; font-size: 11px; text-align: right; font-weight: 700;">STATUS</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${tableRowsHtml || '<tr><td colspan="2" style="padding: 16px; text-align: center; color: #71717a;">Nenhum hábito cadastrado no sistema</td></tr>'}
                    </tbody>
                </table>

                ${EMAIL_SIGNATURE_HTML}

            </div>
        `;
    }

    async function triggerHabitsBriefingEmail(periodType = 'day') {
        const analytics = generateHabitsAnalyticsData(periodType);
        const periodLabels = { 'day': 'Diário', 'week': 'Semanal', 'month': 'Mês' };
        const label = periodLabels[periodType] || 'Diário';
        const dateStr = getBrasiliaDate().toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });

        return await sendDiscordAlert({
            title: `📊 [PERSONAL OS] Briefing ${label} de Hábitos • ${dateStr}`,
            message: `**Relatório de Desempenho Executivo:**\n• Concluídos: **${analytics.totalCompleted}**\n• Não Cumpridos: **${analytics.totalFailures}**\n• Taxa Geral de Sucesso: **${analytics.overallSuccessRate}%**`,
            color: 0x38bdf8,
            fields: [
                { name: 'Hábitos Cumpridos', value: String(analytics.totalCompleted), inline: true },
                { name: 'Falhas / Pendentes', value: String(analytics.totalFailures), inline: true },
                { name: 'Taxa de Sucesso', value: `${analytics.overallSuccessRate}%`, inline: true }
            ]
        });
    }

    // ==========================================
    // RECORRÊNCIA & AGENDAMENTO AUTOMÁTICO
    // ==========================================

    function calculateNextRecurrenceDate(currentDateStr, recurrenceType) {
        const d = new Date(currentDateStr || new Date());
        switch (recurrenceType) {
            case 'daily':
                d.setDate(d.getDate() + 1);
                break;
            case 'weekly':
                d.setDate(d.getDate() + 7);
                break;
            case 'monthly':
                d.setMonth(d.getMonth() + 1);
                break;
            case 'bimonthly':
                d.setMonth(d.getMonth() + 2);
                break;
            case 'quarterly':
                d.setMonth(d.getMonth() + 3);
                break;
            case 'semiannual':
                d.setMonth(d.getMonth() + 6);
                break;
            case 'annual':
                d.setFullYear(d.getFullYear() + 1);
                break;
            default:
                return null;
        }
        return formatISODate(d);
    }

    // ==========================================
    // MASTER TICKER: ALARMES, LEMBRETES, TASKS & TEMPLATES AGENDADOS
    // ==========================================

    function normalizeTime(t) {
        if (!t) return '';
        const clean = String(t).trim();
        if (clean.length >= 5) {
            return clean.slice(0, 5);
        }
        return clean;
    }

    function syncNativeAlarmsWithAndroid() {
        if (typeof window === 'undefined' || !window.AndroidBridge) return;
        // Alertas e mensagens ocorrem SOMENTE via Discord; alarmes locais do Android desativados
        if (typeof window.AndroidBridge.cancelAllAlarms === 'function') {
            try { window.AndroidBridge.cancelAllAlarms(); } catch(e){}
        }
    }

    function setupMasterTicker() {
        setInterval(() => {
            const now = getBrasiliaDate();
            const todayStr = formatISODate(now);
            const curHours = String(now.getHours()).padStart(2, '0');
            const curMins = String(now.getMinutes()).padStart(2, '0');
            const curTimeStr = `${curHours}:${curMins}`;
            const curSeconds = now.getSeconds();

            checkTodoAlarmsPrecise(todayStr, curTimeStr);
            checkReminderAlarmsPrecise(todayStr, curTimeStr, now);
            checkScheduledTemplatesPrecise(todayStr, curTimeStr, now);
            checkStudyAlarmsPrecise(todayStr, curTimeStr, now);

            if (curSeconds === 0) {
                checkAutomatedBriefings(todayStr, curTimeStr, now);
                syncNativeAlarmsWithAndroid();
            }
        }, 1000);
    }

    function checkTodoAlarmsPrecise(todayStr, curTimeStr) {
        todosList.forEach(todo => {
            if (!todo || !todo.has_alarm || todo.alarm_triggered || todo.is_completed) return;
            const dueTime = normalizeTime(todo.due_time);

            if (todo.due_date === todayStr && dueTime === curTimeStr) {
                todo.alarm_triggered = true;
                saveLocalStorageBackup();

                const client = getSupabase();
                if (client) {
                    client.from('control_todos').update({ alarm_triggered: true }).eq('id', todo.id);
                }

                const grp = todoGroups.find(g => g.id === todo.group_id);
                
                // 1. Alarme Sonoro + Overlay
                triggerHeroicAlarm({
                    title: `📋 Tarefa: ${todo.title}`,
                    subtitle: grp ? grp.title : 'To-Do Personals',
                    details: todo.description || 'Horário de execução atingido.',
                    emoji: grp ? grp.emoji : '🎯',
                    color: grp ? grp.color : '#38bdf8'
                });

                // 2. Despacho Exclusivo no Chat do Discord (#🥋┃tutor-ai)
                sendDiscordAlert({
                    title: `📋 [Personal OS] Alerta de Tarefa: ${todo.title}`,
                    message: todo.description || 'Horário de execução atingido.',
                    color: 0x38bdf8,
                    fields: [
                        { name: 'Grupo', value: grp ? grp.title : 'Tarefas', inline: true },
                        { name: 'Horário', value: `${curTimeStr} BRT`, inline: true },
                        { name: 'Data', value: todayStr, inline: true }
                    ]
                });
            }
        });
    }

    function checkReminderAlarmsPrecise(todayStr, curTimeStr, nowObj) {
        remindersList.forEach(rem => {
            if (!rem || !rem.is_active) return;
            const targetTime = normalizeTime(rem.target_time);
            if (!targetTime) return;

            let shouldTrigger = false;

            if (rem.reminder_type === 'one_time' || rem.reminder_type === 'once') {
                if (rem.target_date === todayStr && targetTime === curTimeStr && rem.last_triggered_today !== todayStr) {
                    shouldTrigger = true;
                    rem.is_active = false;
                    rem.last_triggered_today = todayStr;
                }
            } else if (rem.reminder_type === 'daily') {
                if (targetTime === curTimeStr && rem.last_triggered_today !== todayStr) {
                    shouldTrigger = true;
                    rem.last_triggered_today = todayStr;
                }
            } else if (rem.reminder_type === 'weekly') {
                const dayOfWeek = nowObj.getDay();
                const daysCodes = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
                const curDayCode = daysCodes[dayOfWeek];
                const matchDay = (
                    rem.day_of_week === undefined ||
                    rem.day_of_week === null ||
                    rem.day_of_week === 'ALL' ||
                    rem.day_of_week === curDayCode ||
                    Number(rem.day_of_week) === dayOfWeek ||
                    (rem.target_date && rem.target_date === todayStr)
                );
                if (matchDay && targetTime === curTimeStr && rem.last_triggered_today !== todayStr) {
                    shouldTrigger = true;
                    rem.last_triggered_today = todayStr;
                }
            } else if (['monthly', 'bimonthly', 'quarterly', 'semiannual', 'annual'].includes(rem.reminder_type)) {
                if (rem.target_date === todayStr && targetTime === curTimeStr && rem.last_triggered_today !== todayStr) {
                    shouldTrigger = true;
                    rem.last_triggered_today = todayStr;
                    const nextDate = calculateNextRecurrenceDate(todayStr, rem.reminder_type);
                    if (nextDate) rem.target_date = nextDate;
                }
            }

            if (shouldTrigger) {
                rem.last_triggered_at = new Date().toISOString();
                saveLocalStorageBackup();

                const client = getSupabase();
                if (client) {
                    client.from('control_reminders').update({
                        is_active: rem.is_active,
                        target_date: rem.target_date,
                        last_triggered_at: rem.last_triggered_at
                    }).eq('id', rem.id);
                }

                const grp = reminderGroups.find(g => g.id === rem.group_id);

                triggerHeroicAlarm({
                    title: `⏰ Lembrete: ${rem.title}`,
                    subtitle: grp ? grp.title : 'Lembrete Programado',
                    details: rem.notes || 'Horário programado atingido.',
                    emoji: rem.emoji || (grp ? grp.emoji : '🔔'),
                    color: rem.color || (grp ? grp.color : '#a855f7'),
                    hasSound: rem.has_sound !== false
                });

                // 2. Despacho Exclusivo no Chat do Discord (#🥋┃tutor-ai)
                sendDiscordAlert({
                    title: `⏰ [Personal OS] Lembrete: ${rem.title}`,
                    message: rem.notes || 'Horário programado atingido.',
                    color: 0xa855f7,
                    fields: [
                        { name: 'Grupo', value: grp ? grp.title : 'Lembretes', inline: true },
                        { name: 'Horário', value: `${curTimeStr} BRT`, inline: true }
                    ]
                });
            }
        });
    }

    function checkScheduledTemplatesPrecise(todayStr, curTimeStr, nowObj) {
        emailTemplates.forEach(tpl => {
            if (!tpl || !tpl.is_scheduled) return;
            const targetTime = normalizeTime(tpl.target_time);
            if (!targetTime) return;

            let shouldTrigger = false;

            if (tpl.recurrence_type === 'one_time') {
                if (tpl.target_date === todayStr && targetTime === curTimeStr && tpl.last_triggered_date !== todayStr) {
                    shouldTrigger = true;
                    tpl.is_scheduled = false;
                    tpl.last_triggered_date = todayStr;
                }
            } else if (tpl.recurrence_type === 'daily') {
                if (targetTime === curTimeStr && tpl.last_triggered_date !== todayStr) {
                    shouldTrigger = true;
                    tpl.last_triggered_date = todayStr;
                }
            } else if (['weekly', 'monthly', 'bimonthly', 'quarterly', 'semiannual', 'annual'].includes(tpl.recurrence_type)) {
                if (tpl.target_date === todayStr && targetTime === curTimeStr && tpl.last_triggered_date !== todayStr) {
                    shouldTrigger = true;
                    tpl.last_triggered_date = todayStr;
                    const nextDate = calculateNextRecurrenceDate(todayStr, tpl.recurrence_type);
                    if (nextDate) tpl.target_date = nextDate;
                }
            }

            if (shouldTrigger) {
                saveLocalStorageBackup();
                const client = getSupabase();
                if (client) {
                    client.from('control_email_templates').update({
                        is_scheduled: tpl.is_scheduled,
                        target_date: tpl.target_date,
                        last_triggered_date: tpl.last_triggered_date
                    }).eq('id', tpl.id);
                }

                sendDiscordAlert({
                    title: tpl.subject ? tpl.subject.replace(/{date}/g, todayStr) : '📅 [PERSONAL OS] Aviso Agendado',
                    message: tpl.markdown_content ? tpl.markdown_content.replace(/{date}/g, todayStr) : '',
                    color: 0x6366f1
                });
            }
        });
    }

    // ==========================================
    // NOTIFICAÇÃO INTELIGENTE DE ROTINA DE ESTUDOS (DISCORD OFICIAL)
    // ==========================================
    const sentStudyNotifications = new Set();

    function checkStudyAlarmsPrecise(todayStr, curTimeStr, now) {
        const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
        const curDay = days[now.getDay()];

        studyBlocks.forEach(b => {
            if (!b || b.is_active === false) return;
            const blockDay = String(b.day_of_week || '').toUpperCase();
            const blockStart = normalizeTime(b.start_time);

            if ((blockDay === curDay || blockDay === 'ALL') && blockStart === curTimeStr) {
                const notifyKey = `study_${b.id || b.title}_${todayStr}_${blockStart}`;
                if (sentStudyNotifications.has(notifyKey)) return;
                sentStudyNotifications.add(notifyKey);

                // Despacho Oficial Exclusivo no Tutor IA (Discord #🥋┃tutor-ai)
                sendDiscordAlert({
                    title: `🥋 [Tutor IA • Início de Foco & Estudo] ${b.title}`,
                    message: `O seu bloco de foco em **${b.title}** está começando agora (**${curTimeStr} BRT**).\n\n> *"A disciplina diária constrói o futuro que a motivação temporária apenas sonha."*`,
                    color: 0x0284c7,
                    fields: [
                        { name: 'Disciplina', value: b.title, inline: true },
                        { name: 'Horário', value: `${b.start_time} às ${b.end_time}`, inline: true },
                        { name: 'Dia', value: STUDY_DAYS_LABEL[b.day_of_week] || b.day_of_week, inline: true },
                        { name: 'Tag / Foco', value: b.tag || 'Geral', inline: true }
                    ]
                });
            }
        });
    }

    async function testStudyAlarm(customTitle = null) {
        const block = (studyBlocks && studyBlocks.length > 0) ? studyBlocks[0] : {
            title: customTitle || 'Cálculo 01 / Deep Work',
            start_time: '14:00',
            end_time: '16:00',
            day_of_week: 'SEG',
            tag: 'Cálculo 01',
            color: '#38bdf8'
        };

        const blockTitle = customTitle || block.title;
        const startTime = block.start_time || '14:00';
        const endTime = block.end_time || '16:00';
        const dayLabel = STUDY_DAYS_LABEL[block.day_of_week] || block.day_of_week || 'Segunda-feira';
        const tag = block.tag || 'Estudo & Foco';

        // 1. Mensagem no Chat do Tutor IA (Discord)
        const TUTOR_DISCORD_WEBHOOK = 'https://discord.com/api/webhooks/1548863267638747148/CcZC3e4Bel5YeCPnrQtMdr93VTf03SDNQlPJKdIGMQ38GNEbVuZ1OpHhPE1DRR8GkpEb';
        try {
            fetch(TUTOR_DISCORD_WEBHOOK, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    content: `🥋 **[Tutor IA • Teste de Rotina]**\nInício de bloco de estudos simulado: **${blockTitle}** (${startTime} às ${endTime} - ${dayLabel}).`
                })
            }).catch(e => console.warn('Erro ao testar envio Discord:', e));
        } catch(e) {}

        // 2. Despacho Exclusivo no Chat do Discord (#🥋┃tutor-ai)
        if (window.showToast) window.showToast('🥋 Enviando alerta de teste para o Discord (#🥋┃tutor-ai)...');
        await sendDiscordAlert({
            title: `📚 [PERSONAL OS • Teste] Hora de Estudar: ${blockTitle}`,
            message: `O seu bloco de estudos agendado na **Rotina Semanal** está começando agora (**${startTime} às ${endTime} BRT**).\n\n- 📖 **Disciplina / Assunto:** ${blockTitle}\n- 📅 **Dia da Semana:** ${dayLabel}\n- 🏷️ **Tag / Foco:** ${tag}\n\n> *"A disciplina diária constrói o futuro que a motivação temporária apenas sonha."*`,
            color: 0x0284c7,
            fields: [
                { name: 'Disciplina', value: blockTitle, inline: true },
                { name: 'Horário', value: `${startTime} às ${endTime}`, inline: true },
                { name: 'Dia', value: dayLabel, inline: true }
            ]
        });

        if (window.showToast) window.showToast('✓ Alerta enviado ao Discord com sucesso!');
        return { success: true };
    }

    async function checkAutomatedBriefings(todayStr, curTimeStr, nowObj) {
        const frequencies = emailSettings.briefing_frequency || ['day'];

        // 1. Briefing Diário
        if (frequencies.includes('day') && curTimeStr === (emailSettings.daily_briefing_time || '00:01') && emailSettings.last_daily_briefing_date !== todayStr) {
            emailSettings.last_daily_briefing_date = todayStr;
            saveLocalStorageBackup();
            await triggerHabitsBriefingEmail('day');
        }

        // 2. Briefing Matinal
        if (emailSettings.morning_briefing_enabled && curTimeStr === (emailSettings.morning_briefing_time || '07:00') && emailSettings.last_morning_briefing_date !== todayStr) {
            emailSettings.last_morning_briefing_date = todayStr;
            saveLocalStorageBackup();
            await triggerHabitsBriefingEmail('day');
        }

        // 3. Briefing Semanal
        const targetWeeklyDay = Number(emailSettings.weekly_briefing_day !== undefined ? emailSettings.weekly_briefing_day : 0);
        if (frequencies.includes('week') && nowObj.getDay() === targetWeeklyDay && curTimeStr === (emailSettings.weekly_briefing_time || '23:55') && emailSettings.last_weekly_briefing_date !== todayStr) {
            emailSettings.last_weekly_briefing_date = todayStr;
            saveLocalStorageBackup();
            await triggerHabitsBriefingEmail('week');
        }

        // 4. Briefing Mensal
        const isLastDay = new Date(nowObj.getFullYear(), nowObj.getMonth() + 1, 0).getDate() === nowObj.getDate();
        const shouldRunMonthly = (emailSettings.monthly_briefing_day_type === 'last_day') ? isLastDay : (String(nowObj.getDate()) === String(emailSettings.monthly_briefing_day_type));
        
        if (frequencies.includes('month') && shouldRunMonthly && curTimeStr === (emailSettings.monthly_briefing_time || '23:58') && emailSettings.last_monthly_briefing_date !== todayStr) {
            emailSettings.last_monthly_briefing_date = todayStr;
            saveLocalStorageBackup();
            await triggerHabitsBriefingEmail('month');
        }
    }

    // ==========================================
    // CRUD: TO-DO PERSONALS & GRUPOS COM EXCLUSÃO DIRETA
    // ==========================================

    async function createTodo(todoData) {
        const newTodo = {
            id: 'todo_' + Date.now() + '_' + Math.random().toString(36).substr(2, 5),
            group_id: todoData.group_id || (todoGroups[0] ? todoGroups[0].id : 'group_main'),
            title: todoData.title || 'Nova Tarefa',
            description: todoData.description || '',
            is_completed: false,
            priority: todoData.priority || 'normal',
            due_date: todoData.due_date || null,
            due_time: todoData.due_time || null,
            has_alarm: !!todoData.has_alarm,
            is_recurring: !!todoData.is_recurring,
            recurring_dates: Array.isArray(todoData.recurring_dates) ? todoData.recurring_dates : [],
            alarm_triggered: false,
            sort_order: todosList.length,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        todosList.unshift(newTodo);
        saveLocalStorageBackup();
        renderTodosListUI();
        renderTodoGroupsUI();
        renderTodoMatrixTableGridUI();
        updateSidebarCounts();

        const client = getSupabase();
        if (client) {
            try {
                const { error } = await client.from('control_todos').insert([newTodo]);
                if (error) console.error('[SUPABASE] Erro ao salvar todo:', error);
            } catch (err) {
                console.error('[SUPABASE] Falha ao enviar todo:', err);
            }
        }

        // Push bidirecional automático para Notion se pertencer ao grupo Notion ou se tiver alarme
        if (!isSyncingNotion && (newTodo.group_id === NOTION_GROUP_ID || todoData.push_to_notion)) {
            pushTodoToNotion(newTodo).catch(e => console.warn('[NOTION PUSH ERROR]', e));
        }

        if (window.showToast) window.showToast('✓ Tarefa adicionada!');
        return newTodo;
    }

    async function updateTodo(id, updates) {
        const idx = todosList.findIndex(t => t.id === id);
        if (idx === -1) return;

        todosList[idx] = { ...todosList[idx], ...updates, updated_at: new Date().toISOString() };
        saveLocalStorageBackup();
        renderTodosListUI();
        renderTodoGroupsUI();
        renderTodoMatrixTableGridUI();
        updateSidebarCounts();

        const client = getSupabase();
        if (client) {
            try {
                const { error } = await client.from('control_todos').update(updates).eq('id', id);
                if (error) console.error('[SUPABASE] Erro ao atualizar todo:', error);
            } catch (err) {
                console.error('[SUPABASE] Falha ao atualizar todo:', err);
            }
        }

        // Sincronização com Notion
        if (!isSyncingNotion && (todosList[idx].notion_page_id || todosList[idx].notion_block_id)) {
            pushTodoToNotion(todosList[idx]).catch(e => console.warn('[NOTION PUSH ERROR]', e));
        }
    }

    async function toggleTodoComplete(id) {
        const todo = todosList.find(t => t.id === id);
        if (!todo) return;

        const newStatus = !todo.is_completed;
        await updateTodo(id, { is_completed: newStatus });
        if (window.showToast) window.showToast(newStatus ? '✓ Tarefa concluída!' : 'Tarefa reaberta.');

        // Sincronização bidirecional com o Notion
        if (todo.is_notion_task || todo.notion_block_id || todo.notion_page_id) {
            try {
                callNotionProxy('action=toggle', 'POST', {
                    block_id: todo.notion_block_id,
                    page_id: todo.notion_page_id,
                    checked: newStatus,
                    token: notionSettings.token
                }).catch(e => console.warn('[NOTION] Erro ao sincronizar status no Notion:', e));
            } catch(e) {}
        }
    }

    async function deleteTodo(id) {
        const confirmed = window.glassConfirm ? await window.glassConfirm('Tem certeza que deseja excluir esta tarefa?', 'Excluir Tarefa', 'Excluir Tarefa', 'Cancelar', true, '🗑️') : confirm('Tem certeza que deseja excluir esta tarefa?');
        if (!confirmed) return;

        const todo = todosList.find(t => t.id === id);
        if (todo && (todo.notion_page_id || todo.notion_block_id)) {
            archiveTodoInNotion(todo).catch(e => console.warn('[NOTION ARCHIVE ERROR]', e));
        }

        todosList = todosList.filter(t => t.id !== id);
        saveLocalStorageBackup();
        renderTodosListUI();
        renderTodoGroupsUI();
        renderTodoMatrixTableGridUI();
        updateSidebarCounts();

        const client = getSupabase();
        if (client) {
            try {
                await client.from('control_todos').delete().eq('id', id);
            } catch (err) {
                console.error('[SUPABASE] Falha ao excluir todo:', err);
            }
        }
        if (window.showToast) window.showToast('🗑️ Tarefa excluída permanentemente.');
        closeTodoModal();
    }

    async function createTodoGroup(groupData) {
        const newGroup = {
            id: 'group_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            title: groupData.title || 'Novo Grupo',
            emoji: groupData.emoji || '📁',
            color: groupData.color || '#38bdf8',
            description: groupData.description || '',
            sort_order: todoGroups.length,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        todoGroups.push(newGroup);
        saveLocalStorageBackup();
        renderTodoGroupsUI();
        renderTodoGroupFilterTabs();
        updateGroupDropdowns();

        const client = getSupabase();
        if (client) {
            await client.from('control_todo_groups').insert([newGroup]);
        }

        if (window.showToast) window.showToast('✓ Grupo de tarefas criado!');
        return newGroup;
    }

    async function updateTodoGroup(id, updates) {
        const idx = todoGroups.findIndex(g => g.id === id);
        if (idx === -1) return;

        todoGroups[idx] = { ...todoGroups[idx], ...updates, updated_at: new Date().toISOString() };
        saveLocalStorageBackup();
        renderTodoGroupsUI();
        renderTodoGroupFilterTabs();
        updateGroupDropdowns();

        const client = getSupabase();
        if (client) {
            await client.from('control_todo_groups').update(updates).eq('id', id);
        }
    }

    async function deleteTodoGroup(id) {
        if (todoGroups.length <= 1) {
            if (window.glassAlert) await window.glassAlert('Não é possível excluir o único grupo restante.', 'Aviso', '⚠️');
            else alert('Não é possível excluir o único grupo restante.');
            return;
        }

        const grp = todoGroups.find(g => g.id === id);
        const name = grp ? grp.title : 'Grupo';
        const confirmed = window.glassConfirm ? await window.glassConfirm(`Deseja realmente excluir o grupo "${name}" e todas as suas tarefas vinculadas?`, 'Excluir Grupo de Tarefas', 'Excluir Grupo', 'Cancelar', true, '🗑️') : confirm(`Deseja realmente excluir o grupo "${name}" e todas as suas tarefas vinculadas?`);
        if (!confirmed) return;

        todoGroups = todoGroups.filter(g => g.id !== id);
        todosList = todosList.filter(t => t.group_id !== id);
        if (currentFilterTodoGroupId === id) currentFilterTodoGroupId = 'all';

        saveLocalStorageBackup();
        renderTodoGroupsUI();
        renderTodoGroupFilterTabs();
        renderTodosListUI();
        updateGroupDropdowns();
        updateSidebarCounts();

        const client = getSupabase();
        if (client) {
            await client.from('control_todo_groups').delete().eq('id', id);
            await client.from('control_todos').delete().eq('group_id', id);
        }
        if (window.showToast) window.showToast('🗑️ Grupo de tarefas e itens excluídos.');
        closeEditTodoGroupModal();
    }

    // ==========================================
    // CRUD: LEMBRETES & GRUPOS COM EXCLUSÃO DIRETA
    // ==========================================

    async function createReminder(reminderData) {
        const newRem = {
            id: reminderData.id || ('rem_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4)),
            group_id: reminderData.group_id || (reminderGroups[0] ? reminderGroups[0].id : 'rem_grp_focus'),
            title: reminderData.title || 'Novo Lembrete',
            notes: reminderData.notes || '',
            emoji: reminderData.emoji || '🔔',
            color: reminderData.color || '#a855f7',
            reminder_type: reminderData.reminder_type || 'one_time',
            target_date: reminderData.target_date || null,
            target_time: reminderData.target_time || '12:00',
            day_of_week: Number(reminderData.day_of_week !== undefined ? reminderData.day_of_week : 0),
            is_active: reminderData.is_active !== undefined ? !!reminderData.is_active : true,
            has_sound: reminderData.has_sound !== false,
            notion_page_id: reminderData.notion_page_id || null,
            created_at: reminderData.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        remindersList.unshift(newRem);
        saveLocalStorageBackup();
        renderRemindersListUI();
        renderReminderGroupsUI();
        renderReminderMatrixTableGridUI();
        updateSidebarCounts();

        const client = getSupabase();
        if (client) {
            try {
                const cleanInsert = sanitizeReminderForSupabase(newRem);
                const { error } = await client.from('control_reminders').insert([cleanInsert]);
                if (error) console.error('[SUPABASE] Erro ao salvar lembrete:', error);
            } catch (err) {
                console.error('[SUPABASE] Falha ao enviar lembrete:', err);
            }
        }

        // Push bidirecional automático para Notion
        if (!isSyncingNotion) {
            pushReminderToNotion(newRem).catch(e => console.warn('[NOTION PUSH ERROR]', e));
        }

        if (window.showToast) window.showToast('✓ Lembrete programado!');
        return newRem;
    }

    async function updateReminder(id, updates) {
        const idx = remindersList.findIndex(r => r.id === id);
        if (idx === -1) return;

        remindersList[idx] = { ...remindersList[idx], ...updates, updated_at: new Date().toISOString() };
        saveLocalStorageBackup();
        renderRemindersListUI();
        renderReminderGroupsUI();
        renderReminderMatrixTableGridUI();
        updateSidebarCounts();

        const client = getSupabase();
        if (client) {
            try {
                const cleanUpdates = sanitizeReminderUpdatesForSupabase(updates);
                const { error } = await client.from('control_reminders').update(cleanUpdates).eq('id', id);
                if (error) console.error('[SUPABASE] Erro ao atualizar lembrete:', error);
            } catch (err) {
                console.error('[SUPABASE] Falha ao atualizar lembrete:', err);
            }
        }

        // Push bidirecional automático para Notion
        if (!isSyncingNotion) {
            pushReminderToNotion(remindersList[idx]).catch(e => console.warn('[NOTION PUSH ERROR]', e));
        }
    }

    async function toggleReminderActive(id) {
        const rem = remindersList.find(r => r.id === id);
        if (!rem) return;

        const newStatus = !rem.is_active;
        await updateReminder(id, { is_active: newStatus });
        if (window.showToast) window.showToast(newStatus ? '✓ Lembrete ativado!' : 'Lembrete desativado.');
    }

    async function deleteReminder(id) {
        const confirmed = window.glassConfirm ? await window.glassConfirm('Deseja realmente excluir este lembrete?', 'Excluir Lembrete', 'Excluir Lembrete', 'Cancelar', true, '⏰') : confirm('Deseja realmente excluir este lembrete?');
        if (!confirmed) return;

        const rem = remindersList.find(r => r.id === id);
        if (rem) {
            archiveReminderInNotion(rem).catch(e => console.warn('[NOTION ARCHIVE ERROR]', e));
        }

        remindersList = remindersList.filter(r => r.id !== id);
        saveLocalStorageBackup();
        renderRemindersListUI();
        renderReminderGroupsUI();
        renderReminderMatrixTableGridUI();
        updateSidebarCounts();

        const client = getSupabase();
        if (client) {
            try {
                await client.from('control_reminders').delete().eq('id', id);
            } catch (err) {
                console.error('[SUPABASE] Falha ao excluir lembrete:', err);
            }
        }
        if (window.showToast) window.showToast('🗑️ Lembrete excluído.');
        closeReminderModal();
    }

    async function createReminderGroup(groupData) {
        const newGroup = {
            id: 'rem_grp_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            title: groupData.title || 'Novo Grupo de Lembretes',
            emoji: groupData.emoji || '⏰',
            color: groupData.color || '#a855f7',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        reminderGroups.push(newGroup);
        saveLocalStorageBackup();
        renderReminderGroupsUI();
        renderReminderGroupFilterTabs();
        updateGroupDropdowns();

        const client = getSupabase();
        if (client) {
            await client.from('control_reminder_groups').insert([newGroup]);
        }

        if (window.showToast) window.showToast('✓ Grupo de lembretes criado!');
        return newGroup;
    }

    async function updateReminderGroup(id, updates) {
        const idx = reminderGroups.findIndex(g => g.id === id);
        if (idx === -1) return;

        reminderGroups[idx] = { ...reminderGroups[idx], ...updates, updated_at: new Date().toISOString() };
        saveLocalStorageBackup();
        renderReminderGroupsUI();
        renderReminderGroupFilterTabs();
        updateGroupDropdowns();

        const client = getSupabase();
        if (client) {
            await client.from('control_reminder_groups').update(updates).eq('id', id);
        }
    }

    async function deleteReminderGroup(id) {
        if (reminderGroups.length <= 1) {
            if (window.glassAlert) await window.glassAlert('Não é possível excluir o único grupo restante.', 'Aviso', '⚠️');
            else alert('Não é possível excluir o único grupo restante.');
            return;
        }

        const grp = reminderGroups.find(g => g.id === id);
        const name = grp ? grp.title : 'Grupo';
        const confirmed = window.glassConfirm ? await window.glassConfirm(`Deseja realmente excluir o grupo "${name}" e todos os seus lembretes vinculados?`, 'Excluir Grupo de Lembretes', 'Excluir Grupo', 'Cancelar', true, '🗑️') : confirm(`Deseja realmente excluir o grupo "${name}" e todos os seus lembretes vinculados?`);
        if (!confirmed) return;

        reminderGroups = reminderGroups.filter(g => g.id !== id);
        remindersList = remindersList.filter(r => r.group_id !== id);
        if (currentFilterReminderGroupId === id) currentFilterReminderGroupId = 'all';

        saveLocalStorageBackup();
        renderReminderGroupsUI();
        renderReminderGroupFilterTabs();
        renderRemindersListUI();
        updateGroupDropdowns();
        updateSidebarCounts();

        const client = getSupabase();
        if (client) {
            await client.from('control_reminder_groups').delete().eq('id', id);
            await client.from('control_reminders').delete().eq('group_id', id);
        }
        if (window.showToast) window.showToast('🗑️ Grupo de lembretes excluído.');
        closeEditReminderGroupModal();
    }

    // ==========================================
    // RENDERIZAÇÃO DA INTERFACE (PURE LIQUID GLASS)
    // ==========================================

    
    // ==========================================
    // SISTEMA UNIFICADO DE VISUALIZAÇÃO DE CALENDÁRIO (TO-DO & LEMBRETES)
    // ==========================================

    let todoViewMode = localStorage.getItem('mcp_todo_view_mode') || 'matrix';
    let todoCalendarDate = getBrasiliaDate();
    let todoCalendarMode = 'month';

    let reminderViewMode = localStorage.getItem('mcp_reminder_view_mode') || 'matrix';
    let reminderCalendarDate = getBrasiliaDate();
    let reminderCalendarMode = 'month';

    function setTodoViewMode(mode) {
        todoViewMode = mode;
        localStorage.setItem('mcp_todo_view_mode', mode);
        updateTodoViewModeUI();
    }

    function updateTodoViewModeUI() {
        const matrixContainer = document.getElementById('todo-view-matrix-container');
        const calendarContainer = document.getElementById('todo-view-calendar-container');
        const listContainer = document.getElementById('todo-view-list-container');

        const btnMatrix = document.getElementById('todo-view-btn-matrix');
        const btnCal = document.getElementById('todo-view-btn-calendar');
        const btnList = document.getElementById('todo-view-btn-list');

        const activeClass = 'px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 bg-white text-black shadow-md cursor-pointer';
        const inactiveClass = 'px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer';

        if (btnMatrix) btnMatrix.className = todoViewMode === 'matrix' ? activeClass : inactiveClass;
        if (btnCal) btnCal.className = todoViewMode === 'calendar' ? activeClass : inactiveClass;
        if (btnList) btnList.className = todoViewMode === 'list' ? activeClass : inactiveClass;

        if (matrixContainer) {
            if (todoViewMode === 'matrix') {
                matrixContainer.classList.remove('hidden');
                renderTodoMatrixTableGridUI();
            } else {
                matrixContainer.classList.add('hidden');
            }
        }

        if (calendarContainer) {
            if (todoViewMode === 'calendar') {
                calendarContainer.classList.remove('hidden');
                renderTodoCalendarGridUI();
            } else {
                calendarContainer.classList.add('hidden');
            }
        }

        if (listContainer) {
            if (todoViewMode === 'list') {
                listContainer.classList.remove('hidden');
                renderTodosListUI();
            } else {
                listContainer.classList.add('hidden');
            }
        }
    }

    function setTodoCalendarMode(mode) {
        todoCalendarMode = mode;
        renderTodoCalendarGridUI();
    }

    function navigateTodoCalendar(delta) {
        if (todoCalendarMode === 'month') {
            todoCalendarDate.setMonth(todoCalendarDate.getMonth() + delta);
        } else if (todoCalendarMode === '7days') {
            todoCalendarDate.setDate(todoCalendarDate.getDate() + (delta * 7));
        } else if (todoCalendarMode === '5days') {
            todoCalendarDate.setDate(todoCalendarDate.getDate() + (delta * 5));
        } else if (todoCalendarMode === '3days') {
            todoCalendarDate.setDate(todoCalendarDate.getDate() + (delta * 3));
        } else {
            todoCalendarDate.setDate(todoCalendarDate.getDate() + delta);
        }
        renderTodoCalendarGridUI();
    }

    function navigateTodoCalendarToToday() {
        todoCalendarDate = getBrasiliaDate();
        renderTodoCalendarGridUI();
    }

    function renderTodoCalendarGridUI() {
        const gridEl = document.getElementById('todo-calendar-grid');
        const monthTitleEl = document.getElementById('todo-calendar-current-month');
        const headerEl = document.getElementById('todo-calendar-weekdays-header');
        if (!gridEl) return;

        ['1day', '3days', '5days', '7days', 'month'].forEach(m => {
            const btn = document.getElementById(`todo-cal-mode-${m}`);
            if (btn) {
                btn.className = (m === todoCalendarMode)
                    ? 'px-2.5 py-1 rounded-lg bg-emerald-500 text-white font-bold transition cursor-pointer shadow'
                    : 'px-2.5 py-1 rounded-lg text-gray-300 hover:text-white transition cursor-pointer';
            }
        });

        const todayBrt = getBrasiliaDate();
        const todayStr = formatISODate(todayBrt);

        let daysToRender = [];
        let gridClass = 'grid grid-cols-7 gap-1.5 sm:gap-2';

        if (todoCalendarMode === '1day') {
            const d = new Date(todoCalendarDate);
            daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            gridClass = 'grid grid-cols-1 gap-3';
            if (monthTitleEl) monthTitleEl.innerText = `${formatDisplayDate(daysToRender[0].dayStr)} • ${WEEKDAY_NAMES_FULL[d.getDay()]}`;
            if (headerEl) headerEl.className = 'hidden';
        } else if (todoCalendarMode === '3days') {
            const base = new Date(todoCalendarDate);
            base.setDate(base.getDate() - 1);
            for (let i = 0; i < 3; i++) {
                const d = new Date(base);
                d.setDate(d.getDate() + i);
                daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            }
            gridClass = 'grid grid-cols-1 sm:grid-cols-3 gap-3';
            if (monthTitleEl) monthTitleEl.innerText = `${formatDisplayDate(daysToRender[0].dayStr)} – ${formatDisplayDate(daysToRender[2].dayStr)}`;
            if (headerEl) {
                headerEl.className = 'grid grid-cols-1 sm:grid-cols-3 gap-1 text-center font-mono text-xs font-bold text-gray-400 uppercase py-1';
                headerEl.innerHTML = daysToRender.map(d => `<div>${WEEKDAY_NAMES_FULL[d.dateObj.getDay()]} (${d.dateObj.getDate()})</div>`).join('');
            }
        } else if (todoCalendarMode === '5days') {
            for (let i = 0; i < 5; i++) {
                const d = new Date(todoCalendarDate);
                d.setDate(d.getDate() + i);
                daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            }
            gridClass = 'grid grid-cols-1 sm:grid-cols-5 gap-2';
            if (monthTitleEl) monthTitleEl.innerText = `${formatDisplayDate(daysToRender[0].dayStr)} – ${formatDisplayDate(daysToRender[4].dayStr)}`;
            if (headerEl) {
                headerEl.className = 'grid grid-cols-1 sm:grid-cols-5 gap-1 text-center font-mono text-xs font-bold text-gray-400 uppercase py-1';
                headerEl.innerHTML = daysToRender.map(d => `<div>${WEEKDAY_NAMES_SHORT[d.dateObj.getDay()]} ${d.dateObj.getDate()}</div>`).join('');
            }
        } else if (todoCalendarMode === '7days') {
            const startOfWeek = new Date(todoCalendarDate);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            for (let i = 0; i < 7; i++) {
                const d = new Date(startOfWeek);
                d.setDate(d.getDate() + i);
                daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            }
            gridClass = 'grid grid-cols-2 sm:grid-cols-7 gap-1.5 sm:gap-2';
            if (monthTitleEl) monthTitleEl.innerText = `${formatDisplayDate(daysToRender[0].dayStr)} – ${formatDisplayDate(daysToRender[6].dayStr)}`;
            if (headerEl) {
                headerEl.className = 'grid grid-cols-7 gap-1 text-center font-mono text-xs font-bold text-gray-400 uppercase py-1';
                headerEl.innerHTML = WEEKDAY_NAMES_SHORT.map((name, idx) => `
                    <div class="${idx === 0 ? 'text-rose-400' : idx === 6 ? 'text-sky-400' : ''}">${name} ${daysToRender[idx].dateObj.getDate()}</div>
                `).join('');
            }
        } else {
            // MÊS COMPLETO
            const year = todoCalendarDate.getFullYear();
            const month = todoCalendarDate.getMonth();
            if (monthTitleEl) monthTitleEl.innerText = `${MONTH_NAMES_FULL[month]} ${year}`;
            if (headerEl) {
                headerEl.className = 'grid grid-cols-7 gap-1 text-center font-mono text-xs font-bold text-gray-400 uppercase py-1';
                headerEl.innerHTML = `
                    <div class="text-rose-400">Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div class="text-sky-400">Sáb</div>
                `;
            }

            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDay = firstDay.getDay();

            const prevMonthLastDay = new Date(year, month, 0).getDate();
            for (let i = startingDay - 1; i >= 0; i--) {
                const offD = new Date(year, month - 1, prevMonthLastDay - i);
                daysToRender.push({ dateObj: offD, dayStr: formatISODate(offD), isOffset: true });
            }
            for (let day = 1; day <= daysInMonth; day++) {
                const d = new Date(year, month, day);
                daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            }
            const totalRendered = daysToRender.length;
            const remaining = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
            for (let j = 1; j <= remaining; j++) {
                const nextD = new Date(year, month + 1, j);
                daysToRender.push({ dateObj: nextD, dayStr: formatISODate(nextD), isOffset: true });
            }
            gridClass = 'grid grid-cols-7 gap-1.5 sm:gap-2';
        }

        gridEl.className = gridClass;

        let html = '';
        daysToRender.forEach(item => {
            if (item.isOffset) {
                const offNum = item.dateObj ? item.dateObj.getDate() : '';
                html += `
                    <div class="min-h-[85px] sm:min-h-[96px] rounded-2xl p-2.5 border border-white/[0.04] bg-white/[0.01] opacity-25 flex flex-col justify-between select-none">
                        <span class="text-xs font-mono font-bold text-gray-500">${offNum}</span>
                        <div class="h-2"></div>
                    </div>
                `;
                return;
            }

            const dayStr = item.dayStr;
            const dayObj = item.dateObj;
            const dayNum = dayObj.getDate();
            const isToday = dayStr === todayStr;

            const dayTodos = todosList.filter(t => t.due_date === dayStr || (t.is_recurring && Array.isArray(t.recurring_dates) && t.recurring_dates.includes(dayStr)));

            html += `
                <div class="min-h-[85px] sm:min-h-[96px] h-full rounded-2xl p-2.5 border transition-all flex flex-col justify-between select-none relative group ${
                    isToday ? 'bg-sky-500/15 border-sky-400/60 ring-1 ring-sky-400/40 shadow-[0_0_20px_rgba(56,189,248,0.2)]' : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.09] hover:border-white/25'
                }">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-mono font-bold ${isToday ? 'text-sky-300 font-black text-sm' : 'text-gray-300'}">
                            ${dayNum} ${todoCalendarMode !== 'month' ? `(${WEEKDAY_NAMES_SHORT[dayObj.getDay()]})` : ''}
                        </span>
                        <div class="flex items-center gap-1">
                            ${isToday ? '<span class="w-1.5 h-1.5 rounded-full bg-sky-400 animate-ping"></span>' : ''}
                            <button type="button" onclick="window.ControlEngine.openNewTodoModal(null, '${dayStr}')" class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition text-xs leading-none p-0.5" title="Adicionar Tarefa neste dia">＋</button>
                        </div>
                    </div>

                    <div class="space-y-1 overflow-hidden my-1 flex-1 flex flex-col justify-start">
                        ${dayTodos.slice(0, 3).map(t => {
                            const grp = todoGroups.find(g => g.id === t.group_id);
                            const accentColor = (grp && grp.color) ? grp.color : getSessionColor('todos');
                            return `
                                <div onclick="window.ControlEngine.openEditTodoModal('${t.id}')" class="text-[9px] font-mono px-1.5 py-0.5 rounded-lg border transition flex items-center justify-between gap-1 shadow-xs cursor-pointer truncate ${t.is_completed ? 'opacity-50 line-through bg-gray-500/20 text-gray-400 border-gray-500/30' : 'text-emerald-100'}" style="${!t.is_completed ? `background: ${accentColor}25; border-color: ${accentColor}50;` : ''}" title="Clique para editar: ${escapeHtml(t.title)}">
                                    <div class="truncate flex items-center gap-1 font-bold">
                                        <button type="button" onclick="event.stopPropagation(); window.ControlEngine.toggleTodoComplete('${t.id}')" class="text-[9px] hover:scale-125 transition">
                                            ${t.is_completed ? '✓' : '○'}
                                        </button>
                                        <span class="truncate">${t.due_time ? t.due_time + ' ' : ''}${escapeHtml(t.title)}</span>
                                    </div>
                                    ${t.priority === 'urgent' ? '<span class="text-[7px] text-rose-400">🔥</span>' : t.priority === 'high' ? '<span class="text-[7px] text-amber-400">⚡</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                        ${dayTodos.length > 3 ? `<span class="text-[8px] font-mono text-emerald-400 font-bold block">+${dayTodos.length - 3} mais</span>` : ''}
                    </div>

                    <div class="flex items-center justify-between text-[8px] font-mono text-gray-400 pt-0.5 border-t border-white/5">
                        <span>${dayTodos.length} ${dayTodos.length === 1 ? 'tarefa' : 'tarefas'}</span>
                        <span class="text-emerald-300 font-bold">${dayTodos.filter(t => t.is_completed).length}✓</span>
                    </div>
                </div>
            `;
        });

        gridEl.innerHTML = html;
    }

    // ==========================================
    // SISTEMA DE CALENDÁRIO PARA LEMBRETES & ALARMES
    // ==========================================

    function setReminderViewMode(mode) {
        reminderViewMode = mode;
        localStorage.setItem('mcp_reminder_view_mode', mode);
        updateReminderViewModeUI();
    }

    function updateReminderViewModeUI() {
        const matrixContainer = document.getElementById('reminder-view-matrix-container');
        const calendarContainer = document.getElementById('reminder-view-calendar-container');
        const listContainer = document.getElementById('reminder-view-list-container');

        const btnMatrix = document.getElementById('reminder-view-btn-matrix');
        const btnCal = document.getElementById('reminder-view-btn-calendar');
        const btnList = document.getElementById('reminder-view-btn-list');

        const activeClass = 'px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 bg-white text-black shadow-md cursor-pointer';
        const inactiveClass = 'px-3.5 py-1.5 rounded-xl font-bold transition flex items-center gap-1.5 text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer';

        if (btnMatrix) btnMatrix.className = reminderViewMode === 'matrix' ? activeClass : inactiveClass;
        if (btnCal) btnCal.className = reminderViewMode === 'calendar' ? activeClass : inactiveClass;
        if (btnList) btnList.className = reminderViewMode === 'list' ? activeClass : inactiveClass;

        if (matrixContainer) {
            if (reminderViewMode === 'matrix') {
                matrixContainer.classList.remove('hidden');
                renderReminderMatrixTableGridUI();
            } else {
                matrixContainer.classList.add('hidden');
            }
        }

        if (calendarContainer) {
            if (reminderViewMode === 'calendar') {
                calendarContainer.classList.remove('hidden');
                renderReminderCalendarGridUI();
            } else {
                calendarContainer.classList.add('hidden');
            }
        }

        if (listContainer) {
            if (reminderViewMode === 'list') {
                listContainer.classList.remove('hidden');
                renderRemindersListUI();
            } else {
                listContainer.classList.add('hidden');
            }
        }
    }

    function setReminderCalendarMode(mode) {
        reminderCalendarMode = mode;
        renderReminderCalendarGridUI();
    }

    function navigateReminderCalendar(delta) {
        if (reminderCalendarMode === 'month') {
            reminderCalendarDate.setMonth(reminderCalendarDate.getMonth() + delta);
        } else if (reminderCalendarMode === '7days') {
            reminderCalendarDate.setDate(reminderCalendarDate.getDate() + (delta * 7));
        } else if (reminderCalendarMode === '5days') {
            reminderCalendarDate.setDate(reminderCalendarDate.getDate() + (delta * 5));
        } else if (reminderCalendarMode === '3days') {
            reminderCalendarDate.setDate(reminderCalendarDate.getDate() + (delta * 3));
        } else {
            reminderCalendarDate.setDate(reminderCalendarDate.getDate() + delta);
        }
        renderReminderCalendarGridUI();
    }

    function navigateReminderCalendarToToday() {
        reminderCalendarDate = getBrasiliaDate();
        renderReminderCalendarGridUI();
    }

    function renderReminderCalendarGridUI() {
        const gridEl = document.getElementById('reminder-calendar-grid');
        const monthTitleEl = document.getElementById('reminder-calendar-current-month');
        const headerEl = document.getElementById('reminder-calendar-weekdays-header');
        if (!gridEl) return;

        ['1day', '3days', '5days', '7days', 'month'].forEach(m => {
            const btn = document.getElementById(`reminder-cal-mode-${m}`);
            if (btn) {
                btn.className = (m === reminderCalendarMode)
                    ? 'px-2.5 py-1 rounded-lg bg-purple-600 text-white font-bold transition cursor-pointer shadow'
                    : 'px-2.5 py-1 rounded-lg text-gray-300 hover:text-white transition cursor-pointer';
            }
        });

        const todayBrt = getBrasiliaDate();
        const todayStr = formatISODate(todayBrt);

        let daysToRender = [];
        let gridClass = 'grid grid-cols-7 gap-1.5 sm:gap-2';

        if (reminderCalendarMode === '1day') {
            const d = new Date(reminderCalendarDate);
            daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            gridClass = 'grid grid-cols-1 gap-3';
            if (monthTitleEl) monthTitleEl.innerText = `${formatDisplayDate(daysToRender[0].dayStr)} • ${WEEKDAY_NAMES_FULL[d.getDay()]}`;
            if (headerEl) headerEl.className = 'hidden';
        } else if (reminderCalendarMode === '3days') {
            const base = new Date(reminderCalendarDate);
            base.setDate(base.getDate() - 1);
            for (let i = 0; i < 3; i++) {
                const d = new Date(base);
                d.setDate(d.getDate() + i);
                daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            }
            gridClass = 'grid grid-cols-1 sm:grid-cols-3 gap-3';
            if (monthTitleEl) monthTitleEl.innerText = `${formatDisplayDate(daysToRender[0].dayStr)} – ${formatDisplayDate(daysToRender[2].dayStr)}`;
            if (headerEl) {
                headerEl.className = 'grid grid-cols-1 sm:grid-cols-3 gap-1 text-center font-mono text-xs font-bold text-gray-400 uppercase py-1';
                headerEl.innerHTML = daysToRender.map(d => `<div>${WEEKDAY_NAMES_FULL[d.dateObj.getDay()]} (${d.dateObj.getDate()})</div>`).join('');
            }
        } else if (reminderCalendarMode === '5days') {
            for (let i = 0; i < 5; i++) {
                const d = new Date(reminderCalendarDate);
                d.setDate(d.getDate() + i);
                daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            }
            gridClass = 'grid grid-cols-1 sm:grid-cols-5 gap-2';
            if (monthTitleEl) monthTitleEl.innerText = `${formatDisplayDate(daysToRender[0].dayStr)} – ${formatDisplayDate(daysToRender[4].dayStr)}`;
            if (headerEl) {
                headerEl.className = 'grid grid-cols-1 sm:grid-cols-5 gap-1 text-center font-mono text-xs font-bold text-gray-400 uppercase py-1';
                headerEl.innerHTML = daysToRender.map(d => `<div>${WEEKDAY_NAMES_SHORT[d.dateObj.getDay()]} ${d.dateObj.getDate()}</div>`).join('');
            }
        } else if (reminderCalendarMode === '7days') {
            const startOfWeek = new Date(reminderCalendarDate);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            for (let i = 0; i < 7; i++) {
                const d = new Date(startOfWeek);
                d.setDate(d.getDate() + i);
                daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            }
            gridClass = 'grid grid-cols-2 sm:grid-cols-7 gap-1.5 sm:gap-2';
            if (monthTitleEl) monthTitleEl.innerText = `${formatDisplayDate(daysToRender[0].dayStr)} – ${formatDisplayDate(daysToRender[6].dayStr)}`;
            if (headerEl) {
                headerEl.className = 'grid grid-cols-7 gap-1 text-center font-mono text-xs font-bold text-gray-400 uppercase py-1';
                headerEl.innerHTML = WEEKDAY_NAMES_SHORT.map((name, idx) => `
                    <div class="${idx === 0 ? 'text-rose-400' : idx === 6 ? 'text-sky-400' : ''}">${name} ${daysToRender[idx].dateObj.getDate()}</div>
                `).join('');
            }
        } else {
            // MÊS COMPLETO
            const year = reminderCalendarDate.getFullYear();
            const month = reminderCalendarDate.getMonth();
            if (monthTitleEl) monthTitleEl.innerText = `${MONTH_NAMES_FULL[month]} ${year}`;
            if (headerEl) {
                headerEl.className = 'grid grid-cols-7 gap-1 text-center font-mono text-xs font-bold text-gray-400 uppercase py-1';
                headerEl.innerHTML = `
                    <div class="text-rose-400">Dom</div><div>Seg</div><div>Ter</div><div>Qua</div><div>Qui</div><div>Sex</div><div class="text-sky-400">Sáb</div>
                `;
            }

            const firstDay = new Date(year, month, 1);
            const lastDay = new Date(year, month + 1, 0);
            const daysInMonth = lastDay.getDate();
            const startingDay = firstDay.getDay();

            const prevMonthLastDay = new Date(year, month, 0).getDate();
            for (let i = startingDay - 1; i >= 0; i--) {
                const offD = new Date(year, month - 1, prevMonthLastDay - i);
                daysToRender.push({ dateObj: offD, dayStr: formatISODate(offD), isOffset: true });
            }
            for (let day = 1; day <= daysInMonth; day++) {
                const d = new Date(year, month, day);
                daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            }
            const totalRendered = daysToRender.length;
            const remaining = totalRendered % 7 === 0 ? 0 : 7 - (totalRendered % 7);
            for (let j = 1; j <= remaining; j++) {
                const nextD = new Date(year, month + 1, j);
                daysToRender.push({ dateObj: nextD, dayStr: formatISODate(nextD), isOffset: true });
            }
            gridClass = 'grid grid-cols-7 gap-1.5 sm:gap-2';
        }

        gridEl.className = gridClass;

        let html = '';
        daysToRender.forEach(item => {
            if (item.isOffset) {
                const offNum = item.dateObj ? item.dateObj.getDate() : '';
                html += `
                    <div class="min-h-[85px] sm:min-h-[96px] rounded-2xl p-2.5 border border-white/[0.04] bg-white/[0.01] opacity-25 flex flex-col justify-between select-none">
                        <span class="text-xs font-mono font-bold text-gray-500">${offNum}</span>
                        <div class="h-2"></div>
                    </div>
                `;
                return;
            }

            const dayStr = item.dayStr;
            const dayObj = item.dateObj;
            const dayNum = dayObj.getDate();
            const isToday = dayStr === todayStr;
            const dayOfWeekName = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'][dayObj.getDay()];

            const dayReminders = remindersList.filter(r => {
                if (!r.is_active) return false;
                if (r.reminder_type === 'daily') return true;
                if (r.target_date === dayStr) return true;
                if (r.day_of_week === dayOfWeekName || r.day_of_week === 'ALL') return true;
                return false;
            });

            html += `
                <div class="min-h-[85px] sm:min-h-[96px] h-full rounded-2xl p-2.5 border transition-all flex flex-col justify-between select-none relative group ${
                    isToday ? 'bg-purple-500/15 border-purple-400/60 ring-1 ring-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.2)]' : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.09] hover:border-white/25'
                }">
                    <div class="flex items-center justify-between">
                        <span class="text-xs font-mono font-bold ${isToday ? 'text-purple-300 font-black text-sm' : 'text-gray-300'}">
                            ${dayNum} ${reminderCalendarMode !== 'month' ? `(${WEEKDAY_NAMES_SHORT[dayObj.getDay()]})` : ''}
                        </span>
                        <div class="flex items-center gap-1">
                            ${isToday ? '<span class="w-1.5 h-1.5 rounded-full bg-purple-400 animate-ping"></span>' : ''}
                            <button type="button" onclick="window.ControlEngine.openNewReminderModal(null, '${dayStr}')" class="opacity-0 group-hover:opacity-100 text-gray-400 hover:text-white transition text-xs leading-none p-0.5" title="Adicionar Lembrete neste dia">＋</button>
                        </div>
                    </div>

                    <div class="space-y-1 overflow-hidden my-1 flex-1 flex flex-col justify-start">
                        ${dayReminders.slice(0, 3).map(r => {
                            const grp = reminderGroups.find(g => g.id === r.group_id);
                            const accentColor = (grp && grp.color) ? grp.color : getSessionColor('reminders');
                            return `
                                <div onclick="window.ControlEngine.openEditReminderModal('${r.id}')" class="text-[9px] font-mono px-1.5 py-0.5 rounded-lg border transition flex items-center justify-between gap-1 shadow-xs cursor-pointer truncate text-purple-100" style="background: ${accentColor}25; border-color: ${accentColor}50;" title="Clique para editar: ${escapeHtml(r.title)}">
                                    <div class="truncate flex items-center gap-1 font-bold">
                                        <span>⏰</span>
                                        <span class="truncate">${r.target_time ? r.target_time + ' ' : ''}${escapeHtml(r.title)}</span>
                                    </div>
                                    ${r.has_sound ? '<span class="text-[7px] text-amber-300">🔊</span>' : ''}
                                </div>
                            `;
                        }).join('')}
                        ${dayReminders.length > 3 ? `<span class="text-[8px] font-mono text-purple-400 font-bold block">+${dayReminders.length - 3} mais</span>` : ''}
                    </div>

                    <div class="flex items-center justify-between text-[8px] font-mono text-gray-400 pt-0.5 border-t border-white/5">
                        <span>${dayReminders.length} ${dayReminders.length === 1 ? 'lembrete' : 'lembretes'}</span>
                        <span class="text-purple-300 font-bold">${dayReminders.filter(r => r.is_active).length} ativos</span>
                    </div>
                </div>
            `;
        });

        gridEl.innerHTML = html;
    }

    function renderControlUI() {
        renderTodoGroupFilterTabs();
        renderTodoPriorityFilterTabs();
        renderTodoGroupsUI();
        renderTodosListUI();
        renderTodoMatrixTableGridUI();
        updateTodoViewModeUI();

        renderReminderGroupFilterTabs();
        renderReminderGroupsUI();
        renderRemindersListUI();
        renderReminderMatrixTableGridUI();
        updateReminderViewModeUI();

        renderEmailTemplatesMicroCards();
        renderMotivationRulesList();
        renderControlCalendar();
        updateGroupDropdowns();
        updateSidebarCounts();

        // Rotina de Estudos (Notion & Google Agenda)
        renderStudyScheduleUI();
        renderStudyTableGridUI();
        renderStudyGoogleColorPalette();
        updateStudyStatusUI();

        // Sessão TRIP (Viagens)
        renderTripUI();
    }

    function renderTodoGroupFilterTabs() {
        const container = document.getElementById('todo-group-filter-tabs');
        if (!container) return;

        let html = `
            <button onclick="window.ControlEngine.setFilterTodoGroup('all')" class="px-3.5 py-1.5 rounded-xl font-mono text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0 ${currentFilterTodoGroupId === 'all' ? 'bg-white text-black font-bold shadow-md' : 'bg-white/10 hover:bg-white/20 text-gray-200'}">
                <span>🌐</span>
                <span>Todas as Tarefas</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full ${currentFilterTodoGroupId === 'all' ? 'bg-black/20 text-black' : 'bg-white/20 text-white'}">${todosList.length}</span>
            </button>
        `;

        todoGroups.forEach(g => {
            const count = todosList.filter(t => t.group_id === g.id).length;
            const isSel = currentFilterTodoGroupId === g.id;
            html += `
                <button onclick="window.ControlEngine.setFilterTodoGroup('${g.id}')" class="px-3.5 py-1.5 rounded-xl font-mono text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0 ${isSel ? 'text-black font-bold shadow-md' : 'bg-white/10 hover:bg-white/20 text-gray-200'}" style="${isSel ? `background: ${g.color};` : ''}">
                    <span>${g.emoji}</span>
                    <span>${g.title}</span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isSel ? 'bg-black/20 text-black' : 'bg-white/20 text-white'}">${count}</span>
                </button>
            `;
        });

        container.innerHTML = html;
    }

    function renderTodoPriorityFilterTabs() {
        const container = document.getElementById('todo-priority-filter-tabs');
        if (!container) return;

        let baseList = todosList;
        if (currentFilterTodoGroupId !== 'all') {
            baseList = todosList.filter(t => t.group_id === currentFilterTodoGroupId);
        }

        const totalCount = baseList.length;
        const urgentCount = baseList.filter(t => t.priority === 'urgent').length;
        const highCount = baseList.filter(t => t.priority === 'high').length;
        const normalCount = baseList.filter(t => t.priority === 'normal' || !t.priority).length;
        const lowCount = baseList.filter(t => t.priority === 'low').length;

        const priorities = [
            { id: 'all', label: 'Todas as Prioridades', emoji: '🏷️', count: totalCount, badgeColor: 'bg-white text-black' },
            { id: 'urgent', label: 'Urgente', emoji: '🔥', count: urgentCount, badgeColor: 'bg-rose-500/20 text-rose-300 border border-rose-500/40' },
            { id: 'high', label: 'Alta', emoji: '⚡', count: highCount, badgeColor: 'bg-amber-500/20 text-amber-300 border border-amber-500/40' },
            { id: 'normal', label: 'Normal', emoji: '🟢', count: normalCount, badgeColor: 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' },
            { id: 'low', label: 'Baixa', emoji: '🌱', count: lowCount, badgeColor: 'bg-blue-500/20 text-blue-300 border border-blue-500/40' }
        ];

        let html = '';
        priorities.forEach(p => {
            const isSel = currentFilterTodoPriority === p.id;
            html += `
                <button type="button" onclick="window.ControlEngine.setFilterTodoPriority('${p.id}')" class="px-2.5 py-1 rounded-xl text-[11px] font-mono transition cursor-pointer flex items-center gap-1 shrink-0 ${isSel ? (p.id === 'all' ? 'bg-white text-black font-bold shadow' : `${p.badgeColor} font-bold ring-1 ring-white/40`) : 'bg-white/5 hover:bg-white/10 text-gray-300'}">
                    <span>${p.emoji}</span>
                    <span>${p.label}</span>
                    <span class="text-[9px] px-1.5 py-0.2 rounded-full ${isSel ? (p.id === 'all' ? 'bg-black/20 text-black' : 'bg-white/20 text-white') : 'bg-white/10 text-gray-300'}">${p.count}</span>
                </button>
            `;
        });

        container.innerHTML = html;
    }

    function setFilterTodoPriority(priority) {
        currentFilterTodoPriority = priority;
        renderTodoPriorityFilterTabs();
        renderTodosListUI();
    }

    function setTodoSortOrder(order) {
        currentTodoSortOrder = order;
        renderTodosListUI();
    }

    function renderTodoGroupsUI() {
        const container = document.getElementById('todo-groups-grid');
        if (!container) return;

        let html = '';
        todoGroups.forEach(g => {
            const grpTodos = todosList.filter(t => t.group_id === g.id);
            const doneCount = grpTodos.filter(t => t.is_completed).length;
            const totalCount = grpTodos.length;
            const pct = totalCount > 0 ? Math.round((doneCount / totalCount) * 100) : 0;

            html += `
                <div class="ultra-liquid-glass-card p-5 rounded-2xl sm:rounded-3xl transition-all duration-300 flex flex-col justify-between relative group overflow-hidden" style="border-color: ${g.color}55;">
                    <div class="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-30" style="background: ${g.color};"></div>
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2.5">
                                <span class="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style="background: ${g.color}30; border: 1px solid ${g.color}77;">
                                    ${g.emoji}
                                </span>
                                <div>
                                    <h4 class="text-sm font-bold text-white tracking-tight">${g.title}</h4>
                                    <span class="text-[10px] font-mono text-gray-300">${doneCount}/${totalCount} concluídas</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button onclick="window.ControlEngine.openEditTodoGroupModal('${g.id}')" class="text-gray-200 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer text-xs" title="Editar Grupo">
                                    ✏️
                                </button>
                                <button onclick="window.ControlEngine.deleteTodoGroup('${g.id}')" class="text-rose-300 hover:text-white p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 transition cursor-pointer text-xs" title="Excluir Grupo e Tarefas">
                                    🗑️
                                </button>
                            </div>
                        </div>
                        <div class="w-full bg-white/15 rounded-full h-1.5 overflow-hidden mb-4">
                            <div class="h-full rounded-full transition-all duration-500" style="width: ${pct}%; background: ${g.color}; box-shadow: 0 0 8px ${g.color};"></div>
                        </div>
                        <div class="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                            ${grpTodos.slice(0, 4).map(t => `
                                <div class="flex items-center justify-between gap-2 text-xs font-mono py-1 px-2 rounded-lg bg-white/[0.05] border border-white/10 ${t.is_completed ? 'opacity-50 line-through text-gray-400' : 'text-gray-100'}">
                                    <div class="flex items-center gap-2 truncate flex-1">
                                        <input type="checkbox" ${t.is_completed ? 'checked' : ''} onchange="window.ControlEngine.toggleTodoComplete('${t.id}')" class="w-3.5 h-3.5 rounded accent-emerald-500 cursor-pointer">
                                        <span class="truncate flex-1">${t.title}</span>
                                        ${t.has_alarm ? '<span class="text-[9px] text-amber-400">⏰</span>' : ''}
                                    </div>
                                    <div class="flex items-center gap-1 shrink-0">
                                        <button onclick="window.ControlEngine.openEditTodoModal('${t.id}')" class="text-gray-300 hover:text-white text-[10px] p-0.5" title="Editar">✏️</button>
                                        <button onclick="window.ControlEngine.deleteTodo('${t.id}')" class="text-rose-300 hover:text-rose-100 text-[10px] p-0.5" title="Excluir">🗑️</button>
                                    </div>
                                </div>
                            `).join('')}
                            ${grpTodos.length === 0 ? '<div class="text-[10px] font-mono text-gray-400 italic py-2 text-center">Nenhuma tarefa neste grupo</div>' : ''}
                        </div>
                    </div>
                    <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <button onclick="window.ControlEngine.openNewTodoModal('${g.id}')" class="text-[10px] font-mono font-bold px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition flex items-center gap-1 cursor-pointer">
                            <span>➕</span>
                            <span>Nova Tarefa</span>
                        </button>
                        <button onclick="window.ControlEngine.setFilterTodoGroup('${g.id}')" class="text-[10px] font-mono hover:underline cursor-pointer" style="color: ${g.color};">
                            Ver todas ➔
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function renderTodosListUI() {
        const container = document.getElementById('control-todos-list');
        const countIndicator = document.getElementById('todos-active-count-indicator');
        if (!container) return;

        let filtered = [...todosList];

        // 1. Filtro por Grupo
        if (currentFilterTodoGroupId !== 'all') {
            filtered = filtered.filter(t => t.group_id === currentFilterTodoGroupId);
        }

        // 2. Filtro por Prioridade / Importância
        if (currentFilterTodoPriority !== 'all') {
            filtered = filtered.filter(t => (t.priority || 'normal') === currentFilterTodoPriority);
        }

        // 3. Ordenação Inteligente
        const priorityWeights = { 'urgent': 4, 'high': 3, 'normal': 2, 'low': 1 };
        if (currentTodoSortOrder === 'priority_desc') {
            filtered.sort((a, b) => {
                const wA = priorityWeights[a.priority] || 2;
                const wB = priorityWeights[b.priority] || 2;
                if (wB !== wA) return wB - wA;
                return (a.is_completed ? 1 : 0) - (b.is_completed ? 1 : 0);
            });
        } else if (currentTodoSortOrder === 'due_date') {
            filtered.sort((a, b) => {
                const dA = (a.due_date || '9999') + (a.due_time || '99:99');
                const dB = (b.due_date || '9999') + (b.due_time || '99:99');
                return dA.localeCompare(dB);
            });
        } else if (currentTodoSortOrder === 'created_desc') {
            filtered.sort((a, b) => (b.created_at || '').localeCompare(a.created_at || ''));
        } else if (currentTodoSortOrder === 'alpha') {
            filtered.sort((a, b) => (a.title || '').localeCompare(b.title || ''));
        }

        if (countIndicator) {
            countIndicator.innerText = `${filtered.length} tarefa${filtered.length === 1 ? '' : 's'} (${todosList.filter(t => t.is_completed).length} concluídas)`;
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="ultra-liquid-glass-card p-8 text-center rounded-2xl font-mono space-y-2">
                    <span class="text-3xl block">📋</span>
                    <h4 class="text-sm font-bold text-white">Nenhuma tarefa encontrada</h4>
                    <p class="text-xs text-gray-300">Nenhum item corresponde ao filtro ou prioridade selecionada.</p>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(todo => {
            const grp = todoGroups.find(g => g.id === todo.group_id) || { title: 'Geral', color: '#38bdf8', emoji: '📋' };
            const priorityBadges = {
                'low': '<span class="text-[9px] px-2 py-0.5 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 font-mono">🌱 Baixa</span>',
                'normal': '<span class="text-[9px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">🟢 Normal</span>',
                'high': '<span class="text-[9px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-mono font-bold">⚡ Alta</span>',
                'urgent': '<span class="text-[9px] px-2 py-0.5 rounded-full bg-rose-500/25 text-rose-300 border border-rose-500/50 font-mono font-bold animate-pulse">🔥 Urgente</span>'
            };

            html += `
                <div class="ultra-liquid-glass-card p-3.5 sm:p-4 rounded-2xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4 ${todo.is_completed ? 'opacity-60' : 'hover:border-white/30 border-white/20'}">
                    <div class="flex items-start gap-3 flex-1 min-w-0">
                        <div class="pt-0.5 shrink-0">
                            <input type="checkbox" ${todo.is_completed ? 'checked' : ''} onchange="window.ControlEngine.toggleTodoComplete('${todo.id}')" class="w-4 h-4 rounded accent-emerald-500 cursor-pointer">
                        </div>
                        <div class="space-y-1 flex-1 min-w-0">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-sm font-bold break-words ${todo.is_completed ? 'line-through text-gray-400' : 'text-white'}">${escapeHtml(todo.title)}</span>
                                <span class="text-[9px] font-mono px-2 py-0.5 rounded-full whitespace-nowrap" style="background: ${grp.color}30; color: ${grp.color}; border: 1px solid ${grp.color}66;">
                                    ${grp.emoji} ${escapeHtml(grp.title)}
                                </span>
                                ${todo.is_notion_task ? '<span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-indigo-500/25 text-indigo-300 border border-indigo-500/40 font-bold whitespace-nowrap shadow-xs">📝 Notion</span>' : ''}
                                ${priorityBadges[todo.priority] || priorityBadges['normal']}
                            </div>
                            ${todo.description ? `<p class="text-xs text-gray-200 font-sans leading-relaxed break-words ${todo.is_completed ? 'line-through text-gray-400' : ''}">${escapeHtml(todo.description)}</p>` : ''}
                            <div class="flex items-center gap-2 text-[10px] font-mono text-gray-300 pt-0.5 flex-wrap">
                                ${todo.due_date ? `<span class="whitespace-nowrap">📅 ${formatDisplayDate(todo.due_date)}</span>` : ''}
                                ${todo.due_time ? `<span class="whitespace-nowrap">⏰ ${todo.due_time} (BRT)</span>` : ''}
                                ${todo.is_recurring && Array.isArray(todo.recurring_dates) && todo.recurring_dates.length > 0 ? `<span class="text-sky-300 bg-sky-500/20 px-2 py-0.5 rounded-full border border-sky-500/40 whitespace-nowrap" title="Datas: ${todo.recurring_dates.map(d => formatDisplayDate(d)).join(', ')}">🔁 Recorrente (${todo.recurring_dates.length} dias)</span>` : ''}
                                ${todo.has_alarm ? '<span class="text-amber-300 bg-amber-500/20 px-2 py-0.5 rounded-full border border-amber-500/40 whitespace-nowrap">🔔 Alarme Ativo + Email</span>' : ''}
                            </div>
                        </div>
                    </div>
                    <div class="flex items-center justify-end gap-2 shrink-0 pt-2 sm:pt-0 border-t border-white/10 sm:border-t-0 w-full sm:w-auto">
                        <button onclick="window.ControlEngine.openEditTodoModal('${todo.id}')" class="flex-1 sm:flex-initial min-h-[36px] sm:min-h-0 px-3 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white transition cursor-pointer text-xs flex items-center justify-center gap-1 active:scale-95" title="Editar Tarefa">
                            ✏️ <span>Editar</span>
                        </button>
                        <button onclick="window.ControlEngine.deleteTodo('${todo.id}')" class="min-h-[36px] min-w-[36px] p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 hover:text-white transition cursor-pointer text-xs flex items-center justify-center active:scale-95" title="Excluir Tarefa">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // ==========================================
    // RENDERIZAÇÃO: GRUPOS & LISTA DE LEMBRETES
    // ==========================================

    function renderReminderGroupFilterTabs() {
        const container = document.getElementById('reminder-group-filter-tabs');
        if (!container) return;

        let html = `
            <button onclick="window.ControlEngine.setFilterReminderGroup('all')" class="px-3.5 py-1.5 rounded-xl font-mono text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0 ${currentFilterReminderGroupId === 'all' ? 'bg-white text-black font-bold shadow-md' : 'bg-white/10 hover:bg-white/20 text-gray-200'}">
                <span>🌐</span>
                <span>Todos os Lembretes</span>
                <span class="text-[10px] px-1.5 py-0.2 rounded-full ${currentFilterReminderGroupId === 'all' ? 'bg-black/20 text-black' : 'bg-white/20 text-white'}">${remindersList.length}</span>
            </button>
        `;

        reminderGroups.forEach(g => {
            const count = remindersList.filter(r => r.group_id === g.id).length;
            const isSel = currentFilterReminderGroupId === g.id;
            html += `
                <button onclick="window.ControlEngine.setFilterReminderGroup('${g.id}')" class="px-3.5 py-1.5 rounded-xl font-mono text-xs transition cursor-pointer flex items-center gap-1.5 shrink-0 ${isSel ? 'text-black font-bold shadow-md' : 'bg-white/10 hover:bg-white/20 text-gray-200'}" style="${isSel ? `background: ${g.color};` : ''}">
                    <span>${g.emoji}</span>
                    <span>${g.title}</span>
                    <span class="text-[10px] px-1.5 py-0.2 rounded-full ${isSel ? 'bg-black/20 text-black' : 'bg-white/20 text-white'}">${count}</span>
                </button>
            `;
        });

        container.innerHTML = html;
    }

    function renderReminderGroupsUI() {
        const container = document.getElementById('reminder-groups-grid');
        if (!container) return;

        let html = '';
        reminderGroups.forEach(g => {
            const grpReminders = remindersList.filter(r => r.group_id === g.id);
            const activeCount = grpReminders.filter(r => r.is_active).length;
            const totalCount = grpReminders.length;

            html += `
                <div class="ultra-liquid-glass-card p-5 rounded-2xl sm:rounded-3xl transition-all duration-300 flex flex-col justify-between relative group overflow-hidden" style="border-color: ${g.color}55;">
                    <div class="absolute -top-10 -right-10 w-24 h-24 rounded-full blur-2xl pointer-events-none opacity-30" style="background: ${g.color};"></div>
                    <div>
                        <div class="flex items-center justify-between mb-3">
                            <div class="flex items-center gap-2.5">
                                <span class="w-10 h-10 rounded-xl flex items-center justify-center text-xl" style="background: ${g.color}30; border: 1px solid ${g.color}77;">
                                    ${g.emoji}
                                </span>
                                <div>
                                    <h4 class="text-sm font-bold text-white tracking-tight">${g.title}</h4>
                                    <span class="text-[10px] font-mono text-gray-300">${activeCount}/${totalCount} ativos</span>
                                </div>
                            </div>
                            <div class="flex items-center gap-1.5">
                                <button onclick="window.ControlEngine.openEditReminderGroupModal('${g.id}')" class="text-gray-200 hover:text-white p-1.5 rounded-lg bg-white/10 hover:bg-white/20 transition cursor-pointer text-xs" title="Editar Grupo">
                                    ✏️
                                </button>
                                <button onclick="window.ControlEngine.deleteReminderGroup('${g.id}')" class="text-rose-300 hover:text-white p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 transition cursor-pointer text-xs" title="Excluir Grupo e Lembretes">
                                    🗑️
                                </button>
                            </div>
                        </div>

                        <div class="space-y-2 max-h-48 overflow-y-auto pr-1">
                            ${grpReminders.map(r => `
                                <div class="p-2.5 rounded-xl bg-white/[0.05] border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-mono">
                                    <div class="flex items-center gap-2 truncate flex-1 min-w-0">
                                        <span class="text-sm shrink-0">${r.emoji || '🔔'}</span>
                                        <div class="truncate min-w-0 flex-1">
                                            <span class="text-white font-bold truncate block">${escapeHtml(r.title)}</span>
                                            <span class="text-[10px] text-gray-300 truncate block">${r.target_time} (BRT) ${r.target_date ? `• ${formatDisplayDate(r.target_date)}` : `• ${formatRecurrenceLabel(r.reminder_type)}`}</span>
                                        </div>
                                    </div>
                                    <div class="flex items-center justify-between sm:justify-end gap-1.5 shrink-0 pt-1 sm:pt-0 border-t border-white/5 sm:border-t-0">
                                        <div class="flex items-center gap-1">
                                            <button onclick="window.ControlEngine.openEditReminderModal('${r.id}')" class="text-[10px] px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer active:scale-95" title="Editar Lembrete">✏️</button>
                                            <button onclick="window.ControlEngine.testReminderAlarm('${r.id}')" class="text-[10px] px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-white cursor-pointer active:scale-95" title="Testar Som">🔔</button>
                                            <button onclick="window.ControlEngine.deleteReminder('${r.id}')" class="text-[10px] px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/40 text-rose-300 cursor-pointer active:scale-95" title="Excluir Lembrete">🗑️</button>
                                        </div>
                                        <div onclick="window.ControlEngine.toggleReminderActive('${r.id}')" class="toggle-switch-track ${r.is_active ? 'active' : ''} cursor-pointer scale-75 origin-right shrink-0" title="Ativar/Desativar">
                                            <div class="toggle-switch-thumb"></div>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                            ${grpReminders.length === 0 ? '<div class="text-[10px] font-mono text-gray-400 italic py-3 text-center">Nenhum lembrete neste grupo</div>' : ''}
                        </div>
                    </div>

                    <div class="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                        <button onclick="window.ControlEngine.openNewReminderModal('${g.id}')" class="text-[10px] font-mono font-bold px-3 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition flex items-center gap-1 cursor-pointer">
                            <span>➕</span>
                            <span>Novo Lembrete</span>
                        </button>
                        <button onclick="window.ControlEngine.setFilterReminderGroup('${g.id}')" class="text-[10px] font-mono hover:underline cursor-pointer" style="color: ${g.color};">
                            Ver todos ➔
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    function renderRemindersListUI() {
        const container = document.getElementById('control-reminders-list');
        if (!container) return;

        let filtered = remindersList;
        if (currentFilterReminderGroupId !== 'all') {
            filtered = remindersList.filter(r => r.group_id === currentFilterReminderGroupId);
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="ultra-liquid-glass-card p-8 text-center rounded-2xl font-mono space-y-2">
                    <span class="text-3xl block">⏰</span>
                    <h4 class="text-sm font-bold text-white">Nenhum lembrete programado</h4>
                    <p class="text-xs text-gray-300">Crie lembretes pontuais ou diários para receber notificações sonoras e emails automáticos.</p>
                </div>
            `;
            return;
        }

        let html = '';
        filtered.forEach(rem => {
            const grp = reminderGroups.find(g => g.id === rem.group_id) || { title: 'Geral', color: '#a855f7', emoji: '⏰' };

            html += `
                <div class="ultra-liquid-glass-card p-3.5 sm:p-4 rounded-2xl sm:rounded-3xl transition-all duration-300 flex flex-col sm:flex-row sm:items-center justify-between gap-3.5 sm:gap-4 ${rem.is_active ? 'hover:border-white/30 border-white/20' : 'opacity-60 border-white/10'} relative overflow-hidden group">
                    <div class="absolute -right-8 -top-8 w-28 h-28 rounded-full blur-2xl pointer-events-none opacity-20 transition-opacity" style="background: ${grp.color};"></div>

                    <!-- Informações do Lembrete -->
                    <div class="flex items-start sm:items-center gap-3 min-w-0 flex-1">
                        <span class="w-10 h-10 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center text-xl sm:text-2xl shrink-0 border border-white/10 shadow-inner" style="background: ${grp.color}20; color: ${grp.color};">
                            ${rem.emoji || '🔔'}
                        </span>
                        
                        <div class="space-y-1.5 min-w-0 flex-1">
                            <!-- Título e Switch Rápido Mobile -->
                            <div class="flex items-center justify-between gap-2">
                                <h4 class="text-sm sm:text-base font-bold text-white tracking-tight break-words min-w-0 flex-1">
                                    ${escapeHtml(rem.title)}
                                </h4>
                                <!-- Switch exclusivo para mobile no topo direito: fácil alcance com o polegar -->
                                <div class="sm:hidden flex items-center shrink-0">
                                    <div onclick="window.ControlEngine.toggleReminderActive('${rem.id}')" class="toggle-switch-track ${rem.is_active ? 'active' : ''} cursor-pointer scale-90 origin-right" title="Ativar/Desativar">
                                        <div class="toggle-switch-thumb"></div>
                                    </div>
                                </div>
                            </div>

                            <!-- Badges de Grupo e Recorrência (nowrap garante que palavras nunca se quebrem) -->
                            <div class="flex items-center gap-1.5 flex-wrap">
                                <span class="text-[9px] sm:text-[10px] font-mono px-2.5 py-0.5 rounded-full whitespace-nowrap inline-flex items-center gap-1 font-medium" style="background: ${grp.color}25; color: ${grp.color}; border: 1px solid ${grp.color}66;">
                                    <span>${grp.emoji}</span>
                                    <span>${escapeHtml(grp.title)}</span>
                                </span>
                                <span class="text-[9px] sm:text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 whitespace-nowrap inline-flex items-center gap-1 font-medium">
                                    <span>🔄</span>
                                    <span>${formatRecurrenceLabel(rem.reminder_type)}</span>
                                </span>
                            </div>

                            <!-- Observações opcionais -->
                            ${rem.notes ? `<p class="text-xs text-gray-300 font-sans leading-relaxed break-words pt-0.5">${escapeHtml(rem.notes)}</p>` : ''}

                            <!-- Chips de Horário e Data -->
                            <div class="flex items-center gap-2 flex-wrap text-[10px] sm:text-[11px] font-mono text-gray-300 pt-0.5">
                                <span class="inline-flex items-center gap-1 bg-white/[0.06] px-2 py-0.5 rounded-lg border border-white/10 whitespace-nowrap">
                                    <span>⏰</span> <span>${rem.target_time} (BRT)</span>
                                </span>
                                ${rem.target_date ? `
                                <span class="inline-flex items-center gap-1 bg-white/[0.06] px-2 py-0.5 rounded-lg border border-white/10 whitespace-nowrap">
                                    <span>📅</span> <span>${formatDisplayDate(rem.target_date)}</span>
                                </span>` : ''}
                            </div>
                        </div>
                    </div>

                    <!-- Barra de Ações: Ergonomia Touch no Mobile e Cluster no Desktop -->
                    <div class="flex items-center justify-between sm:justify-end gap-2 pt-2.5 sm:pt-0 border-t border-white/10 sm:border-t-0 shrink-0 w-full sm:w-auto">
                        <div class="flex items-center gap-2 flex-1 sm:flex-initial">
                            <button onclick="window.ControlEngine.openEditReminderModal('${rem.id}')" class="flex-1 sm:flex-initial min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-white font-mono text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 border border-white/10 active:scale-95 shadow-sm" title="Editar Lembrete">
                                <span>✏️</span> <span>Editar</span>
                            </button>
                            <button onclick="window.ControlEngine.testReminderAlarm('${rem.id}')" class="flex-1 sm:flex-initial min-h-[38px] px-3.5 py-1.5 rounded-xl bg-purple-500/20 hover:bg-purple-500/35 active:bg-purple-500/45 text-purple-200 font-mono text-xs font-semibold transition cursor-pointer flex items-center justify-center gap-1.5 border border-purple-500/30 active:scale-95 shadow-sm" title="Testar Alarme">
                                <span>🔔</span> <span>Testar</span>
                            </button>
                        </div>

                        <div class="flex items-center gap-2 shrink-0">
                            <!-- Toggle switch no Desktop -->
                            <div onclick="window.ControlEngine.toggleReminderActive('${rem.id}')" class="hidden sm:block toggle-switch-track ${rem.is_active ? 'active' : ''} cursor-pointer scale-90 origin-right" title="Ativar/Desativar">
                                <div class="toggle-switch-thumb"></div>
                            </div>
                            <!-- Botão Excluir -->
                            <button onclick="window.ControlEngine.deleteReminder('${rem.id}')" class="min-h-[38px] min-w-[38px] p-2 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 active:bg-rose-500/40 text-rose-300 hover:text-white transition cursor-pointer flex items-center justify-center border border-rose-500/30 active:scale-95 shadow-sm" title="Excluir Lembrete">
                                <span class="text-sm">🗑️</span>
                            </button>
                        </div>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    // ==========================================
    // MATRIZ SEMANAL DE DISTRIBUIÇÃO: TO-DO PERSONALS
    // ==========================================

            function renderTodoMatrixTableGridUI() {
        const thead = document.getElementById('todo-matrix-table-head');
        const tbody = document.getElementById('todo-matrix-table-body');
        if (!tbody) return;

        const nowBrt = getBrasiliaDate();
        const todayDayIdx = nowBrt.getDay(); // 0 = DOM, 1 = SEG ... 6 = SAB
        const timeStr = nowBrt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const timeIndicator = document.getElementById('todos-brasilia-time-indicator');
        if (timeIndicator) {
            timeIndicator.innerText = `Brasília ${timeStr} (BRT)`;
        }

        const totalActive = todosList.filter(t => !t.is_completed).length;
        const totalCompleted = todosList.filter(t => t.is_completed).length;
        const statsCounter = document.getElementById('todos-stats-counter');
        if (statsCounter) {
            statsCounter.innerText = `${todosList.length} tarefas (${totalActive} ativas, ${totalCompleted} concluídas)`;
        }

        const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

        // Datas da semana atual
        const startOfWeek = new Date(nowBrt);
        startOfWeek.setDate(startOfWeek.getDate() - todayDayIdx);
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);
            weekDates.push(formatISODate(d));
        }

        // 1. Cabeçalho de 7 colunas perfeitamente simétricas (sem coluna de turno)
        if (thead) {
            let headHtml = `<tr class="text-gray-300 font-mono text-xs uppercase tracking-widest">`;

            days.forEach((day, idx) => {
                const isToday = idx === todayDayIdx;
                const isPast = idx < todayDayIdx;
                const dateStr = weekDates[idx];
                const dayNum = dateStr ? parseInt(dateStr.split('-')[2], 10) : '';

                headHtml += `
                    <th class="p-1.5 sm:p-2 w-[14.28%] text-center">
                        <div class="h-[62px] min-h-[62px] px-2 rounded-2xl border transition-all flex flex-col items-center justify-center select-none ${
                            isToday 
                                ? 'bg-sky-500/20 border-sky-400/60 shadow-[0_0_20px_rgba(56,189,248,0.3)] ring-1 ring-sky-400/40' 
                                : isPast 
                                    ? 'bg-white/[0.02] border-white/5 opacity-60' 
                                    : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                        }">
                            <span class="font-bold text-xs tracking-wider flex items-center gap-1.5 ${isToday ? 'text-sky-300' : isPast ? 'text-gray-400' : 'text-white'}">
                                ${isToday ? '<span class="w-2 h-2 rounded-full bg-sky-400 animate-ping shrink-0"></span>' : ''}
                                ${day} ${dayNum ? `(${dayNum})` : ''}
                            </span>
                            <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold mt-1 ${
                                isToday 
                                    ? 'bg-sky-400/30 text-sky-100 border border-sky-400/60 shadow-sm animate-pulse' 
                                    : isPast 
                                        ? 'text-gray-500 opacity-60' 
                                        : 'text-emerald-400/90'
                            }">
                                ${isToday ? '✨ HOJE' : isPast ? 'Encerrado' : 'Próximo'}
                            </span>
                        </div>
                    </th>
                `;
            });
            headHtml += `</tr>`;
            thead.innerHTML = headHtml;
        }

        // 2. Corpo do Calendário Semanal (7 Colunas contínuas cronológicas sem quebra de turnos)
        let bodyHtml = `<tr>`;

        days.forEach((day, idx) => {
            const isToday = idx === todayDayIdx;
            const isPast = idx < todayDayIdx;
            const dayDateStr = weekDates[idx];

            const cellTodos = todosList.filter(t => {
                let dateMatches = false;
                if (t.due_date === dayDateStr) {
                    dateMatches = true;
                } else if (t.is_recurring && Array.isArray(t.recurring_dates) && t.recurring_dates.includes(dayDateStr)) {
                    dateMatches = true;
                } else if (!t.due_date && idx === todayDayIdx) {
                    dateMatches = true;
                }
                return dateMatches;
            }).sort((a, b) => {
                if (a.is_completed !== b.is_completed) return a.is_completed ? 1 : -1;
                return (a.due_time || '').localeCompare(b.due_time || '');
            });

            const activeInCell = cellTodos.filter(t => !t.is_completed).length;

            bodyHtml += `<td class="p-1.5 sm:p-2 align-top w-[14.28%] h-full">`;
            bodyHtml += `<div class="flex flex-col min-h-[360px] h-full justify-between p-2.5 rounded-2xl border transition-all ${
                isToday 
                    ? 'bg-sky-500/[0.08] border-sky-400/40 shadow-[0_0_20px_rgba(56,189,248,0.15)] ring-1 ring-sky-400/30' 
                    : isPast 
                        ? 'bg-white/[0.015] border-white/5 opacity-60 hover:opacity-100' 
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
            }">`;

            // Sub-cabeçalho da coluna com contagem de tarefas
            bodyHtml += `
                <div class="flex items-center justify-between pb-1.5 border-b border-white/10 text-[10px] font-mono text-gray-400">
                    <span class="font-bold ${isToday ? 'text-sky-300' : 'text-gray-300'}">${cellTodos.length} ${cellTodos.length === 1 ? 'tarefa' : 'tarefas'}</span>
                    <span class="text-emerald-300 font-bold">${activeInCell} ativas</span>
                </div>
            `;

            if (cellTodos.length > 0) {
                bodyHtml += `<div class="space-y-2 flex-1 flex flex-col pt-1.5">`;
                cellTodos.forEach(t => {
                    const grp = todoGroups.find(g => g.id === t.group_id) || { title: 'Geral', color: '#38bdf8', emoji: '📋' };
                    const accentColor = grp.color || '#38bdf8';
                    const priorityBadges = {
                        'low': '<span class="text-[8px] px-1.5 py-0.2 rounded-full bg-blue-500/20 text-blue-300 font-mono">🌱</span>',
                        'normal': '<span class="text-[8px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 font-mono">🟢</span>',
                        'high': '<span class="text-[8px] px-1.5 py-0.2 rounded-full bg-amber-500/20 text-amber-300 font-mono font-bold">⚡</span>',
                        'urgent': '<span class="text-[8px] px-1.5 py-0.2 rounded-full bg-rose-500/25 text-rose-300 font-mono font-bold animate-pulse">🔥</span>'
                    };

                    bodyHtml += `
                        <div class="group/card p-2.5 rounded-2xl border text-[11px] font-mono cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden backdrop-blur-md ${t.is_completed ? 'opacity-50' : ''}" style="background: linear-gradient(135deg, ${accentColor}25 0%, ${accentColor}10 100%); border-color: ${accentColor}45; box-shadow: 0 4px 15px -2px ${accentColor}20;">
                            <div class="flex items-start justify-between gap-1">
                                <span class="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-tight inline-block truncate max-w-[85px] shadow-xs" style="background: ${accentColor}35; color: ${accentColor}; border: 1px solid ${accentColor}50;">
                                    ${grp.emoji} ${escapeHtml(grp.title)}
                                </span>
                                <div class="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity" onclick="event.stopPropagation()">
                                    <button type="button" onclick="window.ControlEngine.toggleTodoComplete('${t.id}')" class="w-5 h-5 rounded-lg bg-black/40 hover:bg-emerald-500/40 text-gray-300 hover:text-emerald-200 transition flex items-center justify-center text-[10px]" title="${t.is_completed ? 'Reabrir' : 'Concluir'}">${t.is_completed ? '↺' : '✓'}</button>
                                    <button type="button" onclick="window.ControlEngine.openEditTodoModal('${t.id}')" class="w-5 h-5 rounded-lg bg-black/40 hover:bg-white/20 text-gray-300 hover:text-white transition flex items-center justify-center text-[10px]" title="Editar">✏️</button>
                                    <button type="button" onclick="window.ControlEngine.testTodoAlarm('${t.id}')" class="w-5 h-5 rounded-lg bg-black/40 hover:bg-amber-500/40 text-gray-300 hover:text-amber-200 transition flex items-center justify-center text-[10px]" title="Testar Alarme + Email">🔔</button>
                                    <button type="button" onclick="window.ControlEngine.deleteTodo('${t.id}')" class="w-5 h-5 rounded-lg bg-black/40 hover:bg-rose-500/40 text-gray-300 hover:text-rose-200 transition flex items-center justify-center text-[10px]" title="Excluir">🗑️</button>
                                </div>
                            </div>
                            <div class="font-bold text-white text-xs mt-1.5 truncate tracking-wide ${t.is_completed ? 'line-through text-gray-400' : ''}" title="${escapeHtml(t.title)}">${escapeHtml(t.title)}</div>
                            <div class="flex items-center gap-1 mt-1 flex-wrap">
                                ${t.due_time ? `<span class="text-[9.5px] font-mono text-gray-300 font-bold px-1.5 py-0.5 rounded-lg bg-black/30 border border-white/5">⏰ ${t.due_time}</span>` : ''}
                                ${priorityBadges[t.priority] || priorityBadges['normal']}
                                ${t.has_alarm ? '<span class="text-[8px] text-amber-300" title="Alarme Ativo">🔔</span>' : ''}
                            </div>
                        </div>
                    `;
                });
                bodyHtml += `</div>`;
                bodyHtml += `
                    <button type="button" onclick="window.ControlEngine.openNewTodoModal(null, '${dayDateStr}')" class="w-full py-1.5 mt-auto text-center text-[10px] text-gray-400 hover:text-white rounded-xl bg-white/[0.04] hover:bg-white/[0.1] transition cursor-pointer border border-white/10 flex items-center justify-center gap-1 font-mono font-bold" title="Adicionar tarefa em ${day}">+ Tarefa</button>
                `;
            } else {
                bodyHtml += `
                    <div onclick="window.ControlEngine.openNewTodoModal(null, '${dayDateStr}')" class="h-full min-h-[220px] w-full flex-1 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.04] rounded-xl transition cursor-pointer text-xs select-none border border-dashed border-white/10 hover:border-emerald-400/50 group/empty my-2" title="Clique para adicionar tarefa em ${day} (${dayDateStr})">
                        <span class="opacity-40 group-hover/empty:opacity-100 transition-opacity text-xl font-bold">＋</span>
                        <span class="text-[10px] font-mono opacity-0 group-hover/empty:opacity-80 transition-opacity mt-1">+ Tarefa</span>
                    </div>
                `;
            }

            bodyHtml += `</div></td>`;
        });

        bodyHtml += `</tr>`;
        tbody.innerHTML = bodyHtml;
    }

    function renderReminderMatrixTableGridUI() {
        const thead = document.getElementById('reminder-matrix-table-head');
        const tbody = document.getElementById('reminder-matrix-table-body');
        if (!tbody) return;

        const nowBrt = getBrasiliaDate();
        const todayDayIdx = nowBrt.getDay(); // 0 = DOM, 1 = SEG ... 6 = SAB
        const timeStr = nowBrt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const timeIndicator = document.getElementById('reminders-brasilia-time-indicator');
        if (timeIndicator) {
            timeIndicator.innerText = `Brasília ${timeStr} (BRT)`;
        }

        const totalActive = remindersList.filter(r => r.is_active).length;
        const statsCounter = document.getElementById('reminders-stats-counter');
        if (statsCounter) {
            statsCounter.innerText = `${remindersList.length} lembretes (${totalActive} ativos)`;
        }

        const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

        // Datas da semana atual
        const startOfWeek = new Date(nowBrt);
        startOfWeek.setDate(startOfWeek.getDate() - todayDayIdx);
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);
            weekDates.push(formatISODate(d));
        }

        // 1. Cabeçalho de 7 colunas perfeitamente simétricas (sem coluna de turno)
        if (thead) {
            let headHtml = `<tr class="text-gray-300 font-mono text-xs uppercase tracking-widest">`;

            days.forEach((day, idx) => {
                const isToday = idx === todayDayIdx;
                const isPast = idx < todayDayIdx;
                const dateStr = weekDates[idx];
                const dayNum = dateStr ? parseInt(dateStr.split('-')[2], 10) : '';

                headHtml += `
                    <th class="p-1.5 sm:p-2 w-[14.28%] text-center">
                        <div class="h-[62px] min-h-[62px] px-2 rounded-2xl border transition-all flex flex-col items-center justify-center select-none ${
                            isToday 
                                ? 'bg-purple-500/25 border-purple-400/60 shadow-[0_0_20px_rgba(168,85,247,0.3)] ring-1 ring-purple-400/40' 
                                : isPast 
                                    ? 'bg-white/[0.02] border-white/5 opacity-60' 
                                    : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                        }">
                            <span class="font-bold text-xs tracking-wider flex items-center gap-1.5 ${isToday ? 'text-purple-300' : isPast ? 'text-gray-400' : 'text-white'}">
                                ${isToday ? '<span class="w-2 h-2 rounded-full bg-purple-400 animate-ping shrink-0"></span>' : ''}
                                ${day} ${dayNum ? `(${dayNum})` : ''}
                            </span>
                            <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold mt-1 ${
                                isToday 
                                    ? 'bg-purple-400/30 text-purple-100 border border-purple-400/60 shadow-sm animate-pulse' 
                                    : isPast 
                                        ? 'text-gray-500 opacity-60' 
                                        : 'text-purple-300/90'
                            }">
                                ${isToday ? '✨ HOJE' : isPast ? 'Encerrado' : 'Próximo'}
                            </span>
                        </div>
                    </th>
                `;
            });
            headHtml += `</tr>`;
            thead.innerHTML = headHtml;
        }

        // 2. Corpo do Calendário Semanal (7 Colunas contínuas cronológicas sem quebra de turnos)
        let bodyHtml = `<tr>`;

        days.forEach((day, idx) => {
            const isToday = idx === todayDayIdx;
            const isPast = idx < todayDayIdx;
            const dayDateStr = weekDates[idx];

            const cellReminders = remindersList.filter(r => {
                let matchesDay = false;
                if (r.reminder_type === 'daily') {
                    matchesDay = true;
                } else if (r.day_of_week === day || r.day_of_week === 'ALL') {
                    matchesDay = true;
                } else if (r.target_date === dayDateStr) {
                    matchesDay = true;
                }
                return matchesDay;
            }).sort((a, b) => (a.target_time || '').localeCompare(b.target_time || ''));

            const activeInCell = cellReminders.filter(r => r.is_active).length;

            bodyHtml += `<td class="p-1.5 sm:p-2 align-top w-[14.28%] h-full">`;
            bodyHtml += `<div class="flex flex-col min-h-[360px] h-full justify-between p-2.5 rounded-2xl border transition-all ${
                isToday 
                    ? 'bg-purple-500/[0.08] border-purple-400/40 shadow-[0_0_20px_rgba(168,85,247,0.15)] ring-1 ring-purple-400/30' 
                    : isPast 
                        ? 'bg-white/[0.015] border-white/5 opacity-60 hover:opacity-100' 
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
            }">`;

            // Sub-cabeçalho da coluna com contagem de lembretes
            bodyHtml += `
                <div class="flex items-center justify-between pb-1.5 border-b border-white/10 text-[10px] font-mono text-gray-400">
                    <span class="font-bold ${isToday ? 'text-purple-300' : 'text-gray-300'}">${cellReminders.length} ${cellReminders.length === 1 ? 'lembrete' : 'lembretes'}</span>
                    <span class="text-purple-300 font-bold">${activeInCell} ativos</span>
                </div>
            `;

            if (cellReminders.length > 0) {
                bodyHtml += `<div class="space-y-2 flex-1 flex flex-col pt-1.5">`;
                cellReminders.forEach(r => {
                    const grp = reminderGroups.find(g => g.id === r.group_id) || { title: 'Geral', color: '#c084fc', emoji: '⏰' };
                    const accentColor = grp.color || '#c084fc';

                    bodyHtml += `
                        <div class="group/card p-2.5 rounded-2xl border text-[11px] font-mono cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden backdrop-blur-md ${!r.is_active ? 'opacity-50' : ''}" style="background: linear-gradient(135deg, ${accentColor}25 0%, ${accentColor}10 100%); border-color: ${accentColor}45; box-shadow: 0 4px 15px -2px ${accentColor}20;">
                            <div class="flex items-start justify-between gap-1">
                                <span class="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-tight inline-block truncate max-w-[85px] shadow-xs" style="background: ${accentColor}35; color: ${accentColor}; border: 1px solid ${accentColor}50;">
                                    ${grp.emoji} ${escapeHtml(grp.title)}
                                </span>
                                <div class="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity" onclick="event.stopPropagation()">
                                    <button type="button" onclick="window.ControlEngine.toggleReminderActive('${r.id}')" class="w-5 h-5 rounded-lg bg-black/40 hover:bg-purple-500/40 text-gray-300 hover:text-purple-200 transition flex items-center justify-center text-[10px]" title="${r.is_active ? 'Desativar' : 'Ativar'}">${r.is_active ? '✓' : '⏻'}</button>
                                    <button type="button" onclick="window.ControlEngine.openEditReminderModal('${r.id}')" class="w-5 h-5 rounded-lg bg-black/40 hover:bg-white/20 text-gray-300 hover:text-white transition flex items-center justify-center text-[10px]" title="Editar">✏️</button>
                                    <button type="button" onclick="window.ControlEngine.testReminderAlarm('${r.id}')" class="w-5 h-5 rounded-lg bg-black/40 hover:bg-amber-500/40 text-gray-300 hover:text-amber-200 transition flex items-center justify-center text-[10px]" title="Testar Alarme + Email">🔔</button>
                                    <button type="button" onclick="window.ControlEngine.deleteReminder('${r.id}')" class="w-5 h-5 rounded-lg bg-black/40 hover:bg-rose-500/40 text-gray-300 hover:text-rose-200 transition flex items-center justify-center text-[10px]" title="Excluir">🗑️</button>
                                </div>
                            </div>
                            <div class="font-bold text-white text-xs mt-1.5 truncate tracking-wide" title="${escapeHtml(r.title)}">${escapeHtml(r.title)}</div>
                            <div class="flex items-center gap-1 mt-1 flex-wrap">
                                <span class="text-[9.5px] font-mono text-purple-200 font-bold px-1.5 py-0.5 rounded-lg bg-black/30 border border-white/5">⏰ ${r.target_time || '08:00'}</span>
                                <span class="text-[8.5px] font-mono text-gray-300 px-1 py-0.2 rounded bg-white/10">${r.reminder_type === 'daily' ? 'Diário' : day}</span>
                                ${r.has_sound ? '<span class="text-[8px] text-amber-300" title="Alarme Sonoro Ativo">🔊</span>' : ''}
                            </div>
                        </div>
                    `;
                });
                bodyHtml += `</div>`;
                bodyHtml += `
                    <button type="button" onclick="window.ControlEngine.openNewReminderModal(null, '${dayDateStr}')" class="w-full py-1.5 mt-auto text-center text-[10px] text-gray-400 hover:text-white rounded-xl bg-white/[0.04] hover:bg-white/[0.1] transition cursor-pointer border border-white/10 flex items-center justify-center gap-1 font-mono font-bold" title="Adicionar lembrete em ${day}">+ Lembrete</button>
                `;
            } else {
                bodyHtml += `
                    <div onclick="window.ControlEngine.openNewReminderModal(null, '${dayDateStr}')" class="h-full min-h-[220px] w-full flex-1 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.04] rounded-xl transition cursor-pointer text-xs select-none border border-dashed border-white/10 hover:border-purple-400/50 group/empty my-2" title="Clique para adicionar lembrete em ${day} (${dayDateStr})">
                        <span class="opacity-40 group-hover/empty:opacity-100 transition-opacity text-xl font-bold">＋</span>
                        <span class="text-[10px] font-mono opacity-0 group-hover/empty:opacity-80 transition-opacity mt-1">+ Lembrete</span>
                    </div>
                `;
            }

            bodyHtml += `</div></td>`;
        });

        bodyHtml += `</tr>`;
        tbody.innerHTML = bodyHtml;
    }

    function renderEmailTemplatesMicroCards() {
        const container = document.getElementById('admin-email-templates-list');
        if (!container) return;

        let html = '';
        emailTemplates.forEach(tpl => {
            html += `
                <div class="p-3 rounded-2xl bg-white/[0.08] hover:bg-white/[0.14] border border-white/20 transition-all duration-300 flex items-center justify-between gap-3 cursor-pointer group shadow-sm" onclick="window.ControlEngine.openTemplateEditorModal('${tpl.id}')">
                    <div class="flex items-center gap-3 truncate flex-1">
                        <span class="w-9 h-9 rounded-xl flex items-center justify-center text-lg bg-purple-500/25 border border-purple-500/50 shrink-0">
                            ${tpl.emoji || '📝'}
                        </span>
                        <div class="truncate space-y-0.5">
                            <div class="flex items-center gap-2 flex-wrap">
                                <h4 class="text-xs font-bold text-white font-mono truncate">${tpl.title}</h4>
                                <span class="text-[9px] px-2 py-0.2 rounded-full bg-white/15 text-gray-200 border border-white/20 font-mono">
                                    ${formatRecurrenceLabel(tpl.recurrence_type || 'one_time')}
                                </span>
                                ${tpl.is_scheduled ? '<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/25 text-emerald-200 border border-emerald-500/50 font-mono">⏰ Agendado</span>' : ''}
                            </div>
                            <p class="text-[10px] text-gray-300 font-mono truncate">Assunto: ${tpl.subject}</p>
                        </div>
                    </div>

                    <div class="flex items-center gap-1.5 shrink-0" onclick="event.stopPropagation()">
                        <button onclick="window.ControlEngine.openTemplateEditorModal('${tpl.id}')" class="px-2.5 py-1.5 rounded-xl bg-white/15 hover:bg-white/25 text-white font-mono text-xs transition cursor-pointer flex items-center gap-1">
                            ✏️ <span>Editar</span>
                        </button>
                        <button onclick="window.ControlEngine.deleteTemplate('${tpl.id}')" class="p-1.5 rounded-xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 hover:text-white transition cursor-pointer text-xs" title="Excluir Modelo">
                            🗑️
                        </button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html || '<div class="text-center py-6 text-xs font-mono text-gray-300">Nenhum modelo cadastrado</div>';
    }

    // ==========================================
    // MARKDOWN EDITOR SPLIT VIEW MODAL (ESTILO DIARY & PURE GLASS)
    // ==========================================

    function openTemplateEditorModal(id) {
        currentEditingTemplate = emailTemplates.find(t => t.id === id) || null;
        if (!currentEditingTemplate) return;

        const modalTitle = document.getElementById('tpl-modal-header-title');
        const inputTitle = document.getElementById('tpl-editor-title');
        const inputSubject = document.getElementById('tpl-editor-subject');
        const textareaContent = document.getElementById('tpl-editor-content');
        const selectRecurrence = document.getElementById('tpl-editor-recurrence');
        const inputTargetDate = document.getElementById('tpl-editor-target-date');
        const inputTargetTime = document.getElementById('tpl-editor-target-time');
        const checkScheduled = document.getElementById('tpl-editor-is-scheduled');
        const btnDeleteTpl = document.getElementById('btn-delete-template-editor');

        currentSelectedEmoji = currentEditingTemplate.emoji || '📝';
        renderEmojiPicker('tpl-emoji-picker');

        const cleanContent = currentEditingTemplate.markdown_content ? currentEditingTemplate.markdown_content.replace(/\\n/g, '\n') : '';

        if (modalTitle) modalTitle.innerText = `Editar Modelo: ${currentEditingTemplate.title}`;
        if (inputTitle) inputTitle.value = currentEditingTemplate.title;
        if (inputSubject) inputSubject.value = currentEditingTemplate.subject;
        if (textareaContent) textareaContent.value = cleanContent;
        if (selectRecurrence) selectRecurrence.value = currentEditingTemplate.recurrence_type || 'one_time';
        if (inputTargetDate) inputTargetDate.value = currentEditingTemplate.target_date || formatISODate(getBrasiliaDate());
        if (inputTargetTime) inputTargetTime.value = currentEditingTemplate.target_time || '12:00';
        if (checkScheduled) checkScheduled.checked = !!currentEditingTemplate.is_scheduled;
        if (btnDeleteTpl) btnDeleteTpl.classList.remove('hidden');

        updateTemplateLivePreview();

        const modal = document.getElementById('control-template-editor-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function openNewTemplateModal() {
        currentEditingTemplate = {
            id: 'tpl_' + Date.now(),
            title: 'Novo Modelo de Email',
            emoji: '📝',
            template_type: 'custom',
            recurrence_type: 'one_time',
            is_scheduled: false,
            target_date: formatISODate(getBrasiliaDate()),
            target_time: '12:00',
            subject: '⚡ [PERSONAL OS] Meu Comunicado',
            markdown_content: '# ⚡ Meu Comunicado Personalizado\n\nOlá,\n\nEscreva sua mensagem em Markdown aqui...\n\n- Item 1\n- Item 2'
        };

        const modalTitle = document.getElementById('tpl-modal-header-title');
        const inputTitle = document.getElementById('tpl-editor-title');
        const inputSubject = document.getElementById('tpl-editor-subject');
        const textareaContent = document.getElementById('tpl-editor-content');
        const selectRecurrence = document.getElementById('tpl-editor-recurrence');
        const inputTargetDate = document.getElementById('tpl-editor-target-date');
        const inputTargetTime = document.getElementById('tpl-editor-target-time');
        const checkScheduled = document.getElementById('tpl-editor-is-scheduled');
        const btnDeleteTpl = document.getElementById('btn-delete-template-editor');

        currentSelectedEmoji = '📝';
        renderEmojiPicker('tpl-emoji-picker');

        if (modalTitle) modalTitle.innerText = 'Novo Modelo de Email';
        if (inputTitle) inputTitle.value = currentEditingTemplate.title;
        if (inputSubject) inputSubject.value = currentEditingTemplate.subject;
        if (textareaContent) textareaContent.value = currentEditingTemplate.markdown_content;
        if (selectRecurrence) selectRecurrence.value = 'one_time';
        if (inputTargetDate) inputTargetDate.value = currentEditingTemplate.target_date;
        if (inputTargetTime) inputTargetTime.value = '12:00';
        if (checkScheduled) checkScheduled.checked = false;
        if (btnDeleteTpl) btnDeleteTpl.classList.add('hidden');

        updateTemplateLivePreview();

        const modal = document.getElementById('control-template-editor-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function closeTemplateEditorModal() {
        const modal = document.getElementById('control-template-editor-modal');
        if (modal) modal.classList.add('hidden');
        currentEditingTemplate = null;
    }

    function updateTemplateLivePreview() {
        const textareaContent = document.getElementById('tpl-editor-content');
        const previewEl = document.getElementById('tpl-editor-preview');
        if (!textareaContent || !previewEl) return;

        const mdRaw = textareaContent.value || '';
        const cleanMd = mdRaw.replace(/\\n/g, '\n');
        previewEl.innerHTML = renderRichMarkdownToHtml(cleanMd);
    }

    function insertTemplateMarkdownSnippet(snippet) {
        const textarea = document.getElementById('tpl-editor-content');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const text = textarea.value;

        textarea.value = text.substring(0, start) + snippet + text.substring(end);
        textarea.focus();
        textarea.selectionStart = textarea.selectionEnd = start + snippet.length;
        updateTemplateLivePreview();
    }

    async function handleSaveTemplateEditor(e) {
        if (e) e.preventDefault();

        const inputTitle = document.getElementById('tpl-editor-title');
        const inputSubject = document.getElementById('tpl-editor-subject');
        const textareaContent = document.getElementById('tpl-editor-content');
        const selectRecurrence = document.getElementById('tpl-editor-recurrence');
        const inputTargetDate = document.getElementById('tpl-editor-target-date');
        const inputTargetTime = document.getElementById('tpl-editor-target-time');
        const checkScheduled = document.getElementById('tpl-editor-is-scheduled');

        const title = inputTitle ? inputTitle.value.trim() : 'Modelo';
        const subject = inputSubject ? inputSubject.value.trim() : 'Comunicado';
        const content = textareaContent ? textareaContent.value.replace(/\\n/g, '\n') : '';

        const tplData = {
            id: currentEditingTemplate ? currentEditingTemplate.id : ('tpl_' + Date.now()),
            title: title,
            subject: subject,
            markdown_content: content,
            emoji: currentSelectedEmoji,
            recurrence_type: selectRecurrence ? selectRecurrence.value : 'one_time',
            target_date: inputTargetDate ? inputTargetDate.value : null,
            target_time: inputTargetTime ? inputTargetTime.value : '12:00',
            is_scheduled: checkScheduled ? checkScheduled.checked : false,
            template_type: currentEditingTemplate?.template_type || 'custom',
            updated_at: new Date().toISOString()
        };

        const existingIdx = emailTemplates.findIndex(t => t.id === tplData.id);
        if (existingIdx >= 0) {
            emailTemplates[existingIdx] = { ...emailTemplates[existingIdx], ...tplData };
        } else {
            tplData.created_at = new Date().toISOString();
            emailTemplates.push(tplData);
        }

        saveLocalStorageBackup();
        renderEmailTemplatesMicroCards();

        const client = getSupabase();
        if (client) {
            await client.from('control_email_templates').upsert([tplData]);
        }

        if (window.showToast) window.showToast('✓ Modelo de email salvo com sucesso!');
        closeTemplateEditorModal();
    }

    async function deleteTemplate(id) {
        const targetId = id || (currentEditingTemplate ? currentEditingTemplate.id : null);
        if (!targetId) return;

        const confirmed = window.glassConfirm ? await window.glassConfirm('Deseja realmente excluir este modelo de email?', 'Excluir Modelo de Email', 'Excluir Modelo', 'Cancelar', true, '📧') : confirm('Deseja realmente excluir este modelo de email?');
        if (!confirmed) return;

        emailTemplates = emailTemplates.filter(t => t.id !== targetId);
        saveLocalStorageBackup();
        renderEmailTemplatesMicroCards();

        const client = getSupabase();
        if (client) {
            await client.from('control_email_templates').delete().eq('id', targetId);
        }
        if (window.showToast) window.showToast('🗑️ Modelo excluído permanentemente.');
        closeTemplateEditorModal();
    }

    // ==========================================
    // SISTEMA DE TAREFAS RECORRENTES & CALENDÁRIO MULTI-DIAS
    // ==========================================

    function toggleTodoRecurringCalendar(enabled) {
        const container = document.getElementById('todo-recurring-calendar-container');
        if (!container) return;
        if (enabled) {
            container.classList.remove('hidden');
            if (!todoModalCalendarDate) todoModalCalendarDate = getBrasiliaDate();
            renderTodoModalCalendar();
        } else {
            container.classList.add('hidden');
        }
    }

    function navigateTodoModalMonth(delta) {
        if (!todoModalCalendarDate) todoModalCalendarDate = getBrasiliaDate();
        todoModalCalendarDate.setMonth(todoModalCalendarDate.getMonth() + delta);
        renderTodoModalCalendar();
    }

    function toggleTodoRecurringDate(dayStr) {
        const idx = todoSelectedRecurringDates.indexOf(dayStr);
        if (idx >= 0) {
            todoSelectedRecurringDates.splice(idx, 1);
        } else {
            todoSelectedRecurringDates.push(dayStr);
        }
        renderTodoModalCalendar();
    }

    function quickSelectTodoDays(type) {
        if (!todoModalCalendarDate) todoModalCalendarDate = getBrasiliaDate();
        const year = todoModalCalendarDate.getFullYear();
        const month = todoModalCalendarDate.getMonth();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        if (type === 'clear') {
            todoSelectedRecurringDates = [];
        } else {
            for (let day = 1; day <= daysInMonth; day++) {
                const d = new Date(year, month, day);
                const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
                const weekday = d.getDay(); // 0 = Dom, 6 = Sáb
                const isWeekday = weekday >= 1 && weekday <= 5;
                const isWeekend = weekday === 0 || weekday === 6;

                if (type === 'month') {
                    if (!todoSelectedRecurringDates.includes(dayStr)) todoSelectedRecurringDates.push(dayStr);
                } else if (type === 'weekdays' && isWeekday) {
                    if (!todoSelectedRecurringDates.includes(dayStr)) todoSelectedRecurringDates.push(dayStr);
                } else if (type === 'weekend' && isWeekend) {
                    if (!todoSelectedRecurringDates.includes(dayStr)) todoSelectedRecurringDates.push(dayStr);
                }
            }
        }
        renderTodoModalCalendar();
    }

    function renderTodoModalCalendar() {
        const gridEl = document.getElementById('todo-modal-calendar-grid');
        const monthTitleEl = document.getElementById('todo-modal-calendar-month');
        const summaryEl = document.getElementById('todo-modal-selected-dates-summary');
        if (!gridEl) return;

        if (!todoModalCalendarDate) todoModalCalendarDate = getBrasiliaDate();

        const year = todoModalCalendarDate.getFullYear();
        const month = todoModalCalendarDate.getMonth();

        if (monthTitleEl) {
            monthTitleEl.innerText = `${MONTH_NAMES_FULL[month]} ${year}`;
        }

        const firstDayOfMonth = new Date(year, month, 1);
        const lastDayOfMonth = new Date(year, month + 1, 0);
        const daysInMonth = lastDayOfMonth.getDate();
        const startingDay = firstDayOfMonth.getDay();

        let html = '';

        // Células vazias anteriores ao primeiro dia
        for (let i = 0; i < startingDay; i++) {
            html += `<div class="h-8 rounded-lg opacity-10"></div>`;
        }

        const todayStr = formatISODate(getBrasiliaDate());

        for (let day = 1; day <= daysInMonth; day++) {
            const dayStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            const isSelected = todoSelectedRecurringDates.includes(dayStr);
            const isToday = dayStr === todayStr;

            html += `
                <button type="button" onclick="window.ControlEngine.toggleTodoRecurringDate('${dayStr}')" class="h-8 rounded-lg text-xs font-mono font-bold transition flex items-center justify-center cursor-pointer select-none relative ${
                    isSelected 
                        ? 'bg-sky-500 text-black font-black ring-2 ring-sky-300 shadow-[0_0_10px_rgba(56,189,248,0.5)] scale-105' 
                        : isToday
                            ? 'bg-white/20 text-amber-300 border border-amber-400/50'
                            : 'bg-white/5 hover:bg-white/15 text-gray-300 hover:text-white border border-white/5'
                }">
                    ${day}
                    ${isSelected ? '<span class="absolute -top-1 -right-1 text-[8px] leading-none bg-black text-sky-400 rounded-full px-0.5 font-bold">✓</span>' : ''}
                </button>
            `;
        }

        gridEl.innerHTML = html;

        if (summaryEl) {
            const count = todoSelectedRecurringDates.length;
            if (count === 0) {
                summaryEl.innerText = '0 datas selecionadas';
                summaryEl.className = 'text-gray-400';
            } else {
                summaryEl.innerText = `${count} data${count === 1 ? '' : 's'} selecionada${count === 1 ? '' : 's'}`;
                summaryEl.className = 'text-sky-300 font-bold';
            }
        }
    }

    // ==========================================
    // MODAIS DE TO-DO, LEMBRETES & GRUPOS
    // ==========================================

    function openNewTodoModal(groupId, defaultDate, defaultTime) {
        currentEditingTodo = null;
        const titleEl = document.getElementById('todo-modal-title');
        const inputTitle = document.getElementById('todo-input-title');
        const inputDesc = document.getElementById('todo-input-desc');
        const inputDate = document.getElementById('todo-input-date');
        const inputTime = document.getElementById('todo-input-time');
        const inputAlarm = document.getElementById('todo-input-alarm');
        const inputPriority = document.getElementById('todo-input-priority');
        const inputRecurring = document.getElementById('todo-input-recurring');
        const selectGroup = document.getElementById('todo-form-group');
        const btnDelete = document.getElementById('btn-delete-todo-modal');

        if (titleEl) titleEl.innerText = 'Nova Tarefa';
        if (inputTitle) inputTitle.value = '';
        if (inputDesc) inputDesc.value = '';
        if (inputDate) inputDate.value = defaultDate || formatISODate(getBrasiliaDate());
        if (inputTime) inputTime.value = defaultTime || '12:00';
        if (inputAlarm) inputAlarm.checked = true;
        if (inputPriority) inputPriority.value = 'normal';
        if (btnDelete) btnDelete.classList.add('hidden');

        // Reset de Recorrência
        todoSelectedRecurringDates = [];
        todoModalCalendarDate = getBrasiliaDate();
        if (inputRecurring) inputRecurring.checked = false;
        toggleTodoRecurringCalendar(false);

        if (selectGroup) {
            updateGroupDropdowns();
            if (groupId) selectGroup.value = groupId;
        }

        const modal = document.getElementById('control-todo-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function openEditTodoModal(id) {
        const todo = todosList.find(t => t.id === id);
        if (!todo) return;

        currentEditingTodo = todo;
        const titleEl = document.getElementById('todo-modal-title');
        const inputTitle = document.getElementById('todo-input-title');
        const inputDesc = document.getElementById('todo-input-desc');
        const inputDate = document.getElementById('todo-input-date');
        const inputTime = document.getElementById('todo-input-time');
        const inputAlarm = document.getElementById('todo-input-alarm');
        const inputPriority = document.getElementById('todo-input-priority');
        const inputRecurring = document.getElementById('todo-input-recurring');
        const selectGroup = document.getElementById('todo-form-group');
        const btnDelete = document.getElementById('btn-delete-todo-modal');

        if (titleEl) titleEl.innerText = 'Editar Tarefa';
        if (inputTitle) inputTitle.value = todo.title;
        if (inputDesc) inputDesc.value = todo.description || '';
        if (inputDate) inputDate.value = todo.due_date || '';
        if (inputTime) inputTime.value = todo.due_time || '12:00';
        if (inputAlarm) inputAlarm.checked = !!todo.has_alarm;
        if (inputPriority) inputPriority.value = todo.priority || 'normal';
        if (btnDelete) btnDelete.classList.remove('hidden');

        // Estado de Recorrência
        if (todo.is_recurring && Array.isArray(todo.recurring_dates) && todo.recurring_dates.length > 0) {
            todoSelectedRecurringDates = [...todo.recurring_dates];
            if (inputRecurring) inputRecurring.checked = true;
            toggleTodoRecurringCalendar(true);
        } else {
            todoSelectedRecurringDates = [];
            if (inputRecurring) inputRecurring.checked = false;
            toggleTodoRecurringCalendar(false);
        }

        if (selectGroup) {
            updateGroupDropdowns();
            selectGroup.value = todo.group_id;
        }

        const modal = document.getElementById('control-todo-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function closeTodoModal() {
        const modal = document.getElementById('control-todo-modal');
        if (modal) modal.classList.add('hidden');
        currentEditingTodo = null;
    }

    async function handleSaveTodoForm(e) {
        if (e) e.preventDefault();

        const inputTitle = document.getElementById('todo-input-title');
        const inputDesc = document.getElementById('todo-input-desc');
        const selectGroup = document.getElementById('todo-form-group');
        const inputDate = document.getElementById('todo-input-date');
        const inputTime = document.getElementById('todo-input-time');
        const inputAlarm = document.getElementById('todo-input-alarm');
        const inputPriority = document.getElementById('todo-input-priority');
        const inputRecurring = document.getElementById('todo-input-recurring');

        const title = inputTitle ? inputTitle.value.trim() : '';
        if (!title) { if (window.glassAlert) window.glassAlert('Informe o título da tarefa.', 'Campo Obrigatório', '⚠️'); else alert('Informe o título da tarefa.'); return; }

        const isRecurring = inputRecurring ? inputRecurring.checked : false;
        let recurringDates = isRecurring ? [...todoSelectedRecurringDates].sort() : [];
        if (isRecurring && recurringDates.length === 0 && inputDate && inputDate.value) {
            recurringDates = [inputDate.value];
        }

        const data = {
            title: title,
            description: inputDesc ? inputDesc.value.trim() : '',
            group_id: selectGroup ? selectGroup.value : (todoGroups[0] ? todoGroups[0].id : 'group_main'),
            due_date: inputDate && inputDate.value ? inputDate.value : null,
            due_time: inputTime && inputTime.value ? inputTime.value : null,
            has_alarm: inputAlarm ? inputAlarm.checked : false,
            priority: inputPriority ? inputPriority.value : 'normal',
            is_recurring: isRecurring,
            recurring_dates: recurringDates
        };

        if (currentEditingTodo) {
            await updateTodo(currentEditingTodo.id, data);
        } else {
            await createTodo(data);
        }

        closeTodoModal();
    }

    function openTodoGroupsManagerModal() {
        renderTodoGroupsManagerList();
        const modal = document.getElementById('control-groups-manager-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function closeTodoGroupsManagerModal() {
        const modal = document.getElementById('control-groups-manager-modal');
        if (modal) modal.classList.add('hidden');
    }

    function openEditTodoGroupModal(id) {
        currentEditingTodoGroup = todoGroups.find(g => g.id === id) || null;
        const titleEl = document.getElementById('group-modal-title');
        const inputTitle = document.getElementById('group-input-title');
        const inputDesc = document.getElementById('group-input-desc');
        const inputColor = document.getElementById('group-input-color');
        const btnDelete = document.getElementById('btn-delete-group-modal');

        if (titleEl) titleEl.innerText = currentEditingTodoGroup ? 'Editar Grupo de Tarefas' : 'Novo Grupo de Tarefas';
        if (inputTitle) inputTitle.value = currentEditingTodoGroup ? currentEditingTodoGroup.title : '';
        if (inputDesc) inputDesc.value = currentEditingTodoGroup ? currentEditingTodoGroup.description || '' : '';
        if (btnDelete) {
            if (currentEditingTodoGroup) btnDelete.classList.remove('hidden');
            else btnDelete.classList.add('hidden');
        }

        currentSelectedEmoji = currentEditingTodoGroup ? currentEditingTodoGroup.emoji : '🎯';
        renderEmojiPicker('group-emoji-picker');
        if (inputColor) inputColor.value = currentEditingTodoGroup ? currentEditingTodoGroup.color : '#38bdf8';

        const modal = document.getElementById('control-group-edit-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function closeEditTodoGroupModal() {
        const modal = document.getElementById('control-group-edit-modal');
        if (modal) modal.classList.add('hidden');
        currentEditingTodoGroup = null;
    }

    async function handleSaveTodoGroupForm(e) {
        if (e) e.preventDefault();
        const inputTitle = document.getElementById('group-input-title');
        const inputDesc = document.getElementById('group-input-desc');
        const inputColor = document.getElementById('group-input-color');

        const title = inputTitle ? inputTitle.value.trim() : '';
        if (!title) { if (window.glassAlert) window.glassAlert('Informe o nome do grupo.', 'Campo Obrigatório', '⚠️'); else alert('Informe o nome do grupo.'); return; }

        const data = {
            title: title,
            description: inputDesc ? inputDesc.value.trim() : '',
            emoji: currentSelectedEmoji,
            color: inputColor ? inputColor.value : '#38bdf8'
        };

        if (currentEditingTodoGroup) {
            await updateTodoGroup(currentEditingTodoGroup.id, data);
        } else {
            await createTodoGroup(data);
        }

        closeEditTodoGroupModal();
    }

    function renderTodoGroupsManagerList() {
        const container = document.getElementById('groups-manager-list');
        if (!container) return;

        let html = '';
        todoGroups.forEach(g => {
            const count = todosList.filter(t => t.group_id === g.id).length;
            html += `
                <div class="p-3.5 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-between text-xs font-mono">
                    <div class="flex items-center gap-2.5">
                        <span class="w-8 h-8 rounded-lg flex items-center justify-center text-base" style="background: ${g.color}30; border: 1px solid ${g.color}77;">
                            ${g.emoji}
                        </span>
                        <div>
                            <span class="font-bold text-white block">${g.title}</span>
                            <span class="text-[10px] text-gray-300">${count} tarefas vinculadas</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="window.ControlEngine.openEditTodoGroupModal('${g.id}')" class="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition cursor-pointer">
                            ✏️ Editar
                        </button>
                        <button onclick="window.ControlEngine.deleteTodoGroup('${g.id}')" class="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 transition cursor-pointer">
                            🗑️ Excluir
                        </button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    // ==========================================
    // MODAIS DE LEMBRETES
    // ==========================================

    function openNewReminderModal(groupId, defaultDate, defaultTime, defaultType, defaultDayOfWeek) {
        currentEditingReminder = null;
        const titleEl = document.getElementById('reminder-modal-title');
        const inputTitle = document.getElementById('reminder-input-title');
        const inputNotes = document.getElementById('reminder-input-notes');
        const inputDate = document.getElementById('reminder-input-date');
        const inputTime = document.getElementById('reminder-input-time');
        const inputType = document.getElementById('reminder-input-type');
        const inputColor = document.getElementById('reminder-input-color');
        const selectGroup = document.getElementById('reminder-form-group');
        const btnDelete = document.getElementById('btn-delete-reminder-modal');

        if (titleEl) titleEl.innerText = 'Novo Lembrete';
        if (inputTitle) inputTitle.value = '';
        if (inputNotes) inputNotes.value = '';
        if (inputDate) inputDate.value = defaultDate || formatISODate(getBrasiliaDate());
        if (inputTime) inputTime.value = defaultTime || '12:00';
        if (inputType) inputType.value = defaultType || 'one_time';
        if (btnDelete) btnDelete.classList.add('hidden');
        currentSelectedEmoji = '🔔';

        if (selectGroup) {
            updateGroupDropdowns();
            if (groupId) selectGroup.value = groupId;
        }

        renderEmojiPicker('reminder-emoji-picker');
        if (inputColor) inputColor.value = '#a855f7';

        const modal = document.getElementById('control-reminder-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function openEditReminderModal(id) {
        const rem = remindersList.find(r => r.id === id);
        if (!rem) return;

        currentEditingReminder = rem;
        const titleEl = document.getElementById('reminder-modal-title');
        const inputTitle = document.getElementById('reminder-input-title');
        const inputNotes = document.getElementById('reminder-input-notes');
        const inputDate = document.getElementById('reminder-input-date');
        const inputTime = document.getElementById('reminder-input-time');
        const inputType = document.getElementById('reminder-input-type');
        const inputColor = document.getElementById('reminder-input-color');
        const selectGroup = document.getElementById('reminder-form-group');
        const btnDelete = document.getElementById('btn-delete-reminder-modal');

        if (titleEl) titleEl.innerText = 'Editar Lembrete';
        if (inputTitle) inputTitle.value = rem.title;
        if (inputNotes) inputNotes.value = rem.notes || '';
        if (inputDate) inputDate.value = rem.target_date || '';
        if (inputTime) inputTime.value = rem.target_time || '12:00';
        if (inputType) inputType.value = rem.reminder_type || 'one_time';
        if (btnDelete) btnDelete.classList.remove('hidden');
        currentSelectedEmoji = rem.emoji || '🔔';

        if (selectGroup) {
            updateGroupDropdowns();
            selectGroup.value = rem.group_id;
        }

        renderEmojiPicker('reminder-emoji-picker');
        if (inputColor) inputColor.value = rem.color || '#a855f7';

        const modal = document.getElementById('control-reminder-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function closeReminderModal() {
        const modal = document.getElementById('control-reminder-modal');
        if (modal) modal.classList.add('hidden');
        currentEditingReminder = null;
    }

    async function handleSaveReminderForm(e) {
        if (e) e.preventDefault();
        const inputTitle = document.getElementById('reminder-input-title');
        const inputNotes = document.getElementById('reminder-input-notes');
        const inputType = document.getElementById('reminder-input-type');
        const inputDate = document.getElementById('reminder-input-date');
        const inputTime = document.getElementById('reminder-input-time');
        const inputColor = document.getElementById('reminder-input-color');
        const selectGroup = document.getElementById('reminder-form-group');

        const title = inputTitle ? inputTitle.value.trim() : '';
        if (!title) { if (window.glassAlert) window.glassAlert('Informe o título do lembrete.', 'Campo Obrigatório', '⚠️'); else alert('Informe o título do lembrete.'); return; }

        const data = {
            title: title,
            group_id: selectGroup ? selectGroup.value : (reminderGroups[0] ? reminderGroups[0].id : 'rem_grp_focus'),
            notes: inputNotes ? inputNotes.value.trim() : '',
            reminder_type: inputType ? inputType.value : 'one_time',
            target_date: inputDate && inputDate.value ? inputDate.value : null,
            target_time: inputTime && inputTime.value ? inputTime.value : '12:00',
            emoji: currentSelectedEmoji,
            color: inputColor ? inputColor.value : '#a855f7'
        };

        if (currentEditingReminder) {
            await updateReminder(currentEditingReminder.id, data);
        } else {
            await createReminder(data);
        }

        closeReminderModal();
    }

    function openReminderGroupsManagerModal() {
        renderReminderGroupsManagerList();
        const modal = document.getElementById('control-reminder-groups-manager-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function closeReminderGroupsManagerModal() {
        const modal = document.getElementById('control-reminder-groups-manager-modal');
        if (modal) modal.classList.add('hidden');
    }

    function openEditReminderGroupModal(id) {
        currentEditingReminderGroup = reminderGroups.find(g => g.id === id) || null;
        const titleEl = document.getElementById('rem-group-modal-title');
        const inputTitle = document.getElementById('rem-group-input-title');
        const inputColor = document.getElementById('rem-group-input-color');
        const btnDelete = document.getElementById('btn-delete-rem-group-modal');

        if (titleEl) titleEl.innerText = currentEditingReminderGroup ? 'Editar Grupo de Lembretes' : 'Novo Grupo de Lembretes';
        if (inputTitle) inputTitle.value = currentEditingReminderGroup ? currentEditingReminderGroup.title : '';
        if (btnDelete) {
            if (currentEditingReminderGroup) btnDelete.classList.remove('hidden');
            else btnDelete.classList.add('hidden');
        }

        currentSelectedEmoji = currentEditingReminderGroup ? currentEditingReminderGroup.emoji : '⏰';
        renderEmojiPicker('rem-group-emoji-picker');
        if (inputColor) inputColor.value = currentEditingReminderGroup ? currentEditingReminderGroup.color : '#a855f7';

        const modal = document.getElementById('control-reminder-group-edit-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function closeEditReminderGroupModal() {
        const modal = document.getElementById('control-reminder-group-edit-modal');
        if (modal) modal.classList.add('hidden');
        currentEditingReminderGroup = null;
    }

    async function handleSaveReminderGroupForm(e) {
        if (e) e.preventDefault();
        const inputTitle = document.getElementById('rem-group-input-title');
        const inputColor = document.getElementById('rem-group-input-color');

        const title = inputTitle ? inputTitle.value.trim() : '';
        if (!title) { if (window.glassAlert) window.glassAlert('Informe o nome do grupo de lembretes.', 'Campo Obrigatório', '⚠️'); else alert('Informe o nome do grupo de lembretes.'); return; }

        const data = {
            title: title,
            emoji: currentSelectedEmoji,
            color: inputColor ? inputColor.value : '#a855f7'
        };

        if (currentEditingReminderGroup) {
            await updateReminderGroup(currentEditingReminderGroup.id, data);
        } else {
            await createReminderGroup(data);
        }

        closeEditReminderGroupModal();
    }

    function renderReminderGroupsManagerList() {
        const container = document.getElementById('rem-groups-manager-list');
        if (!container) return;

        let html = '';
        reminderGroups.forEach(g => {
            const count = remindersList.filter(r => r.group_id === g.id).length;
            html += `
                <div class="p-3.5 rounded-xl bg-white/[0.08] border border-white/15 flex items-center justify-between text-xs font-mono">
                    <div class="flex items-center gap-2.5">
                        <span class="w-8 h-8 rounded-lg flex items-center justify-center text-base" style="background: ${g.color}30; border: 1px solid ${g.color}77;">
                            ${g.emoji}
                        </span>
                        <div>
                            <span class="font-bold text-white block">${g.title}</span>
                            <span class="text-[10px] text-gray-300">${count} lembretes vinculados</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <button onclick="window.ControlEngine.openEditReminderGroupModal('${g.id}')" class="px-2.5 py-1 rounded-lg bg-white/15 hover:bg-white/25 text-white transition cursor-pointer">
                            ✏️ Editar
                        </button>
                        <button onclick="window.ControlEngine.deleteReminderGroup('${g.id}')" class="px-2.5 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 transition cursor-pointer">
                            🗑️ Excluir
                        </button>
                    </div>
                </div>
            `;
        });
        container.innerHTML = html;
    }

    async function testTodoAlarm(id) {
        const todo = todosList.find(t => t.id === id);
        if (!todo) return;
        const grp = todoGroups.find(g => g.id === todo.group_id);

        triggerHeroicAlarm({
            title: `📋 [TESTE] Tarefa: ${todo.title}`,
            subtitle: grp ? grp.title : 'To-Do Personals',
            details: todo.description || 'Disparo imediato de alarme sonoro, tela cheia e notificação no Discord.',
            emoji: grp ? grp.emoji : '🎯',
            color: grp ? grp.color : '#38bdf8'
        });

        if (window.showToast) window.showToast('🔔 Alarme sonoro tocando + enviando para Discord...');

        await sendDiscordAlert({
            title: `📋 [TESTE PERSONAL OS] Tarefa: ${todo.title}`,
            message: todo.description || 'Disparo de teste de alarme de tarefa.',
            color: 0x38bdf8,
            fields: [
                { name: 'Prioridade', value: todo.priority || 'Normal', inline: true },
                { name: 'Grupo', value: grp ? grp.title : 'Geral', inline: true },
                { name: 'Prazo', value: `${todo.due_date || 'Sem data'} às ${todo.due_time || 'Sem hora'}`, inline: true }
            ]
        });
    }

    async function testReminderAlarm(id) {
        const rem = remindersList.find(r => r.id === id);
        if (!rem) return;
        const grp = reminderGroups.find(g => g.id === rem.group_id);

        triggerHeroicAlarm({
            title: `⏰ [TESTE] Lembrete: ${rem.title}`,
            subtitle: grp ? grp.title : 'Alarme de Demonstração',
            details: rem.notes || 'Este é o alarme sonoro com notificação no Discord.',
            emoji: rem.emoji || (grp ? grp.emoji : '🔔'),
            color: rem.color || (grp ? grp.color : '#a855f7')
        });

        if (window.showToast) window.showToast('🔔 Alarme sonoro tocando + enviando para Discord...');

        await sendDiscordAlert({
            title: `⏰ [TESTE PERSONAL OS] Lembrete: ${rem.title}`,
            message: rem.notes || 'Disparo de teste de alarme de lembrete.',
            color: 0xa855f7,
            fields: [
                { name: 'Grupo', value: grp ? grp.title : 'Geral', inline: true },
                { name: 'Horário', value: `${rem.target_time} BRT`, inline: true },
                { name: 'Recorrência', value: formatRecurrenceLabel(rem.reminder_type), inline: true }
            ]
        });
    }

    function testAlarmSound() {
        triggerHeroicAlarm({
            title: '🚨 Teste de Alarme do Sistema',
            subtitle: 'Alarme Sonoro & Notificação Heroica',
            details: 'O som amplificado em Loop e a sirene estão ativos. Toque ou clique em qualquer lugar para interromper.',
            emoji: '🚨',
            color: '#ec4899'
        });
        if (window.showToast) window.showToast('🚨 Alarme sonoro de teste ativado!');
    }

    // ==========================================
    // PAINEL ADMIN DO CONTROL
    // ==========================================

    function openControlAdminModal() {
        const inputRecipient = document.getElementById('admin-email-recipient');
        const inputApiKey = document.getElementById('admin-email-apikey');
        const checkNotifyHabit = document.getElementById('admin-email-notify-habit');
        const checkFreqDay = document.getElementById('admin-email-freq-day');
        const checkFreqWeek = document.getElementById('admin-email-freq-week');
        const checkFreqMonth = document.getElementById('admin-email-freq-month');
        const selectWeeklyDay = document.getElementById('admin-email-weekly-day');
        const inputWeeklyTime = document.getElementById('admin-email-weekly-time');
        const selectMonthlyDay = document.getElementById('admin-email-monthly-day');
        const inputMonthlyTime = document.getElementById('admin-email-monthly-time');
        const checkMorning = document.getElementById('admin-email-morning-briefing');
        const inputMorningTime = document.getElementById('admin-email-morning-time');

        if (inputRecipient) inputRecipient.value = emailSettings.recipient_email || 'demo@personal-os.io';
        if (inputApiKey) inputApiKey.value = emailSettings.resend_api_key || 'demo_resend_api_key_placeholder';
        if (checkNotifyHabit) checkNotifyHabit.checked = !!emailSettings.notify_on_habit_finish;
        
        const freqs = emailSettings.briefing_frequency || ['day'];
        if (checkFreqDay) checkFreqDay.checked = freqs.includes('day');
        if (checkFreqWeek) checkFreqWeek.checked = freqs.includes('week');
        if (checkFreqMonth) checkFreqMonth.checked = freqs.includes('month');

        if (selectWeeklyDay) selectWeeklyDay.value = emailSettings.weekly_briefing_day !== undefined ? emailSettings.weekly_briefing_day : 0;
        if (inputWeeklyTime) inputWeeklyTime.value = emailSettings.weekly_briefing_time || '23:55';
        if (selectMonthlyDay) selectMonthlyDay.value = emailSettings.monthly_briefing_day_type || 'last_day';
        if (inputMonthlyTime) inputMonthlyTime.value = emailSettings.monthly_briefing_time || '23:58';

        if (checkMorning) checkMorning.checked = !!emailSettings.morning_briefing_enabled;
        if (inputMorningTime) inputMorningTime.value = emailSettings.morning_briefing_time || '07:00';

        const checkMotivation = document.getElementById('admin-email-motivation-toggle');
        if (checkMotivation) checkMotivation.checked = emailSettings.motivation_enabled !== false;

        renderEmailTemplatesMicroCards();
        populateMotivationFormHabitsAndTemplates();
        renderMotivationRulesList();

        const modal = document.getElementById('control-admin-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function closeControlAdminModal() {
        const modal = document.getElementById('control-admin-modal');
        if (modal) modal.classList.add('hidden');
    }

    function setControlAdminTab(tab) {
        const panes = ['settings', 'habit', 'templates', 'motivacional'];
        panes.forEach(p => {
            const el = document.getElementById(`admin-tab-${p}-pane`);
            const btn = document.getElementById(`admin-btn-tab-${p}`);
            if (p === tab) {
                if (el) el.classList.remove('hidden');
                if (btn) { btn.classList.add('bg-white', 'text-black', 'font-bold'); btn.classList.remove('text-gray-200', 'text-gray-300'); }
            } else {
                if (el) el.classList.add('hidden');
                if (btn) { btn.classList.remove('bg-white', 'text-black', 'font-bold'); btn.classList.add('text-gray-300'); }
            }
        });

        if (tab === 'habit') {
            populateMotivationFormHabitsAndTemplates();
        }
        if (tab === 'motivacional') {
            populateMotivationFormHabitsAndTemplates();
            renderMotivationRulesList();
        }
    }

    async function saveControlAdminSettings(e) {
        if (e) e.preventDefault();

        const inputRecipient = document.getElementById('admin-email-recipient');
        const inputApiKey = document.getElementById('admin-email-apikey');
        const checkNotifyHabit = document.getElementById('admin-email-notify-habit');
        const checkMotivation = document.getElementById('admin-email-motivation-toggle');
        const checkFreqDay = document.getElementById('admin-email-freq-day');
        const checkFreqWeek = document.getElementById('admin-email-freq-week');
        const checkFreqMonth = document.getElementById('admin-email-freq-month');
        const selectWeeklyDay = document.getElementById('admin-email-weekly-day');
        const inputWeeklyTime = document.getElementById('admin-email-weekly-time');
        const selectMonthlyDay = document.getElementById('admin-email-monthly-day');
        const inputMonthlyTime = document.getElementById('admin-email-monthly-time');
        const checkMorning = document.getElementById('admin-email-morning-briefing');
        const inputMorningTime = document.getElementById('admin-email-morning-time');

        if (inputRecipient) emailSettings.recipient_email = inputRecipient.value.trim() || 'demo@personal-os.io';
        if (inputApiKey) {
            const keyVal = inputApiKey.value.trim();
            if (keyVal) {
                emailSettings.resend_api_key = keyVal;
            } else if (!emailSettings.resend_api_key) {
                emailSettings.resend_api_key = 'demo_resend_api_key_placeholder';
            }
        }
        if (checkNotifyHabit) emailSettings.notify_on_habit_finish = checkNotifyHabit.checked;
        if (checkMotivation) emailSettings.motivation_enabled = checkMotivation.checked;

        const freqs = [];
        if (checkFreqDay && checkFreqDay.checked) freqs.push('day');
        if (checkFreqWeek && checkFreqWeek.checked) freqs.push('week');
        if (checkFreqMonth && checkFreqMonth.checked) freqs.push('month');
        emailSettings.briefing_frequency = freqs;

        if (selectWeeklyDay) emailSettings.weekly_briefing_day = parseInt(selectWeeklyDay.value, 10);
        if (inputWeeklyTime) emailSettings.weekly_briefing_time = inputWeeklyTime.value.trim();
        if (selectMonthlyDay) emailSettings.monthly_briefing_day_type = selectMonthlyDay.value;
        if (inputMonthlyTime) emailSettings.monthly_briefing_time = inputMonthlyTime.value.trim();

        if (checkMorning) emailSettings.morning_briefing_enabled = checkMorning.checked;
        if (inputMorningTime) emailSettings.morning_briefing_time = inputMorningTime.value.trim();

        saveLocalStorageBackup();

        const client = getSupabase();
        if (client) {
            await client.from('control_email_settings').upsert([{
                id: 'default_settings',
                ...emailSettings,
                updated_at: new Date().toISOString()
            }]);
        }

        if (window.showToast) window.showToast('✓ Configurações salvas no Supabase!');
        closeControlAdminModal();
    }

    // ==========================================
    // SISTEMA DE EMAILS MOTIVACIONAIS (FINAL BOSS FEATURE)
    // ==========================================

    function toggleMotivationMaster(isActive) {
        emailSettings.motivation_enabled = !!isActive;
        saveLocalStorageBackup();
        const client = getSupabase();
        if (client) {
            client.from('control_email_settings').upsert([{
                id: 'default_settings',
                ...emailSettings,
                updated_at: new Date().toISOString()
            }]);
        }
        if (window.showToast) window.showToast(isActive ? '🔥 Emails Motivacionais Ativados!' : 'Emails Motivacionais Desativados.');
    }

    function populateMotivationFormHabitsAndTemplates() {
        const habitSelect = document.getElementById('mot-rule-habit-select');

        if (habitSelect) {
            let habits = [];
            if (window.HabitTracker && typeof window.HabitTracker.getHabits === 'function') {
                habits = window.HabitTracker.getHabits() || [];
            }
            let hHtml = `<option value="all" data-type="all">⚡ Todos os Hábitos do Sistema</option>`;
            habits.forEach(h => {
                const isBan = h.habit_type === 'ban';
                const tagType = isBan ? '🛑 Ban (Parar/Destruir)' : '🌱 Growth (Crescer/Foco)';
                hHtml += `<option value="${h.id}" data-type="${h.habit_type || 'growth'}">${h.emoji || '⚡'} ${h.title} (${tagType})</option>`;
            });
            habitSelect.innerHTML = hHtml;
        }

        renderTemplateDropdownOptions();
        onMotivationHabitChanged();
    }

    function renderTemplateDropdownOptions() {
        const tplSelect = document.getElementById('mot-rule-template-select');
        if (!tplSelect) return;

        let tHtml = '';
        emailTemplates.forEach(t => {
            tHtml += `<option value="${t.id}">${t.emoji || '📝'} ${t.title}</option>`;
        });
        tplSelect.innerHTML = tHtml || `<option value="tpl_mot_streak_growth">🔥 Motivacional: Streak</option>`;
    }

    function onMotivationHabitChanged() {
        const habitSelect = document.getElementById('mot-rule-habit-select');
        const condSelect = document.getElementById('mot-rule-condition');
        const tagTypeEl = document.getElementById('mot-rule-habit-tag-type');
        if (!habitSelect || !condSelect) return;

        const selOption = habitSelect.options[habitSelect.selectedIndex];
        const habitType = selOption ? selOption.getAttribute('data-type') : 'growth';

        if (tagTypeEl) {
            if (habitType === 'ban') {
                tagTypeEl.innerText = '🛑 Ban (Parar/Destruir)';
                tagTypeEl.className = 'text-[9px] font-mono px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 border border-rose-500/40';
            } else if (habitType === 'all') {
                tagTypeEl.innerText = '🌐 Todos os Hábitos';
                tagTypeEl.className = 'text-[9px] font-mono px-2 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40';
            } else {
                tagTypeEl.innerText = '🌱 Growth (Crescer/Foco)';
                tagTypeEl.className = 'text-[9px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40';
            }
        }

        if (habitType === 'ban') {
            condSelect.innerHTML = `
                <option value="streak_success" selected>🛡️ Domínio: X dias sem praticar (Dias Limpos / Sobriedade)</option>
                <option value="habit_broken">🚨 Recaída: Marcou como feito hoje (Praticou o vício)</option>
            `;
        } else {
            condSelect.innerHTML = `
                <option value="streak_success" selected>🔥 Sucesso: Manteve a sequência por X dias (Streak Positivo)</option>
                <option value="habit_broken">⚠️ Quebra de Hábito: Não concluiu / Deixou de marcar hoje</option>
                <option value="milestone_session">⚡ Sessão de Foco: Finalizou timer com sucesso</option>
            `;
        }

        onMotivationConditionChanged();
    }

    function onMotivationConditionChanged() {
        const habitSelect = document.getElementById('mot-rule-habit-select');
        const condSelect = document.getElementById('mot-rule-condition');
        const tplSelect = document.getElementById('mot-rule-template-select');
        const labelTpl = document.getElementById('mot-rule-template-label');
        if (!condSelect || !tplSelect) return;

        const selOption = habitSelect ? habitSelect.options[habitSelect.selectedIndex] : null;
        const habitType = selOption ? selOption.getAttribute('data-type') : 'growth';
        const cond = condSelect.value;

        if (cond === 'habit_broken') {
            if (labelTpl) labelTpl.innerHTML = `<span class="text-rose-300 font-bold">4. Modelo para QUEBRA / RECAÍDA *</span>`;
            if (habitType === 'ban') {
                if (emailTemplates.some(t => t.id === 'tpl_mot_broken_ban')) tplSelect.value = 'tpl_mot_broken_ban';
            } else {
                if (emailTemplates.some(t => t.id === 'tpl_mot_broken_growth')) tplSelect.value = 'tpl_mot_broken_growth';
            }
        } else if (cond === 'streak_success') {
            if (labelTpl) labelTpl.innerHTML = `<span class="text-emerald-300 font-bold">4. Modelo para SUCESSO / STREAK *</span>`;
            if (habitType === 'ban') {
                if (emailTemplates.some(t => t.id === 'tpl_mot_streak_ban')) tplSelect.value = 'tpl_mot_streak_ban';
            } else {
                if (emailTemplates.some(t => t.id === 'tpl_mot_streak_growth')) tplSelect.value = 'tpl_mot_streak_growth';
            }
        } else {
            if (labelTpl) labelTpl.innerHTML = `<span class="text-sky-300 font-bold">4. Modelo para SESSÃO CONCLUÍDA *</span>`;
            if (emailTemplates.some(t => t.id === 'tpl_mot_session_done')) tplSelect.value = 'tpl_mot_session_done';
        }
    }

    function updateMotivationFrequencyFields() {
        const freqSelect = document.getElementById('mot-rule-frequency');
        const daysWrapper = document.getElementById('mot-rule-days-wrapper');
        if (!freqSelect || !daysWrapper) return;

        if (freqSelect.value === 'custom_days') {
            daysWrapper.classList.remove('hidden');
        } else {
            daysWrapper.classList.add('hidden');
        }
    }

    async function saveMotivationRuleFromForm() {
        const habitSelect = document.getElementById('mot-rule-habit-select');
        const freqSelect = document.getElementById('mot-rule-frequency');
        const daysInput = document.getElementById('mot-rule-days-input');
        const conditionSelect = document.getElementById('mot-rule-condition');
        const tplSelect = document.getElementById('mot-rule-template-select');

        const habitId = habitSelect ? habitSelect.value : 'all';
        const frequency = freqSelect ? freqSelect.value : 'custom_days';
        const targetDays = daysInput ? Math.max(1, parseInt(daysInput.value, 10) || 1) : 1;
        const conditionType = conditionSelect ? conditionSelect.value : 'streak_success';
        const templateId = tplSelect ? tplSelect.value : (emailTemplates[0]?.id || 'tpl_mot_streak_growth');

        const newRule = {
            id: 'mot_rule_' + Date.now() + '_' + Math.random().toString(36).substr(2, 4),
            habit_id: habitId,
            frequency: frequency,
            target_days: targetDays,
            condition_type: conditionType,
            template_id: templateId,
            is_active: true,
            created_at: new Date().toISOString()
        };

        motivationRules.unshift(newRule);
        saveLocalStorageBackup();
        renderMotivationRulesList();

        const client = getSupabase();
        if (client) {
            await client.from('control_motivation_rules').insert([newRule]);
        }

        if (window.showToast) window.showToast('✓ Regra Motivacional cadastrada com sucesso!');
    }

    function renderMotivationRulesList() {
        const container = document.getElementById('admin-motivation-rules-list');
        const badgeEl = document.getElementById('mot-rules-count-badge');
        if (!container) return;

        if (badgeEl) badgeEl.innerText = `${motivationRules.length} regra${motivationRules.length === 1 ? '' : 's'}`;

        if (motivationRules.length === 0) {
            container.innerHTML = `<div class="text-[11px] font-mono text-gray-400 italic py-3 text-center">Nenhuma regra motivacional criada ainda.</div>`;
            return;
        }

        let habits = [];
        if (window.HabitTracker && typeof window.HabitTracker.getHabits === 'function') {
            habits = window.HabitTracker.getHabits() || [];
        }

        let html = '';
        motivationRules.forEach(rule => {
            let habitLabel = 'Todos os Hábitos';
            let habitEmoji = '⚡';
            if (rule.habit_id !== 'all') {
                const found = habits.find(h => h.id === rule.habit_id);
                if (found) {
                    habitLabel = found.title;
                    habitEmoji = found.emoji || '⚡';
                }
            }

            const tpl = emailTemplates.find(t => t.id === rule.template_id);
            const tplLabel = tpl ? tpl.title : 'Modelo Padrão';

            const condLabels = {
                'streak_success': `✓ Seguiu por ${rule.target_days} dia(s)`,
                'habit_broken': `✕ Quebrou o hábito / Recaída`,
                'milestone_session': `⚡ Concluiu sessão com sucesso`
            };

            const activeStyle = rule.is_active
                ? 'background:rgba(168,85,247,0.06);border:1px solid rgba(168,85,247,0.3);'
                : 'background:rgba(255,255,255,0.03);border:1px solid rgba(255,255,255,0.1);opacity:0.55;';

            html += `
                <div style="border-radius:14px;padding:10px 12px;${activeStyle}box-sizing:border-box;display:grid;grid-template-columns:1fr auto;align-items:center;gap:10px;">
                    <!-- COL 1: Info -->
                    <div style="min-width:0;overflow:hidden;">
                        <div style="display:flex;align-items:center;gap:6px;flex-wrap:wrap;margin-bottom:3px;">
                            <span style="font-size:16px;flex-shrink:0;">${habitEmoji}</span>
                            <span style="font-family:monospace;font-size:11px;font-weight:700;color:#fff;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:180px;">${habitLabel}</span>
                            <span style="font-family:monospace;font-size:9px;padding:2px 7px;border-radius:999px;background:rgba(168,85,247,0.2);color:#ddd6fe;border:1px solid rgba(168,85,247,0.35);white-space:nowrap;">${condLabels[rule.condition_type] || rule.condition_type}</span>
                        </div>
                        <span style="font-family:monospace;font-size:10px;color:#9ca3af;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;display:block;">📧 Modelo: ${tplLabel}</span>
                    </div>
                    <!-- COL 2: Ações (fixas) -->
                    <div style="display:flex;align-items:center;gap:6px;flex-shrink:0;">
                        <button type="button" onclick="window.ControlEngine.testMotivationRule('${rule.id}')" style="background:rgba(14,165,233,0.15);color:#7dd3fc;border:1px solid rgba(14,165,233,0.3);border-radius:8px;padding:4px 9px;font-size:10px;font-family:monospace;font-weight:700;cursor:pointer;white-space:nowrap;">▶ Testar</button>
                        <div onclick="window.ControlEngine.toggleMotivationRule('${rule.id}', ${!rule.is_active})" class="toggle-switch-track ${rule.is_active ? 'active' : ''}" style="cursor:pointer;flex-shrink:0;" title="${rule.is_active ? 'Desativar' : 'Ativar'}">
                            <div class="toggle-switch-thumb"></div>
                        </div>
                        <button type="button" onclick="window.ControlEngine.deleteMotivationRule('${rule.id}')" style="background:rgba(239,68,68,0.18);color:#fca5a5;border:1px solid rgba(239,68,68,0.3);border-radius:8px;padding:5px 7px;font-size:12px;cursor:pointer;flex-shrink:0;border:none;">🗑️</button>
                    </div>
                </div>
            `;
        });

        container.innerHTML = html;
    }

    async function toggleMotivationRule(ruleId, isActive) {
        const idx = motivationRules.findIndex(r => r.id === ruleId);
        if (idx === -1) return;
        motivationRules[idx].is_active = !!isActive;
        saveLocalStorageBackup();
        renderMotivationRulesList();

        const client = getSupabase();
        if (client) {
            await client.from('control_motivation_rules').update({ is_active: !!isActive }).eq('id', ruleId);
        }
        if (window.showToast) window.showToast(isActive ? '✓ Regra ativada!' : 'Regra desativada.');
    }

    async function deleteMotivationRule(ruleId) {
        const confirmed = window.glassConfirm ? await window.glassConfirm('Deseja realmente excluir esta regra motivacional?', 'Excluir Regra', 'Excluir Regra', 'Cancelar', true, '🎯') : confirm('Deseja realmente excluir esta regra motivacional?');
        if (!confirmed) return;
        motivationRules = motivationRules.filter(r => r.id !== ruleId);
        saveLocalStorageBackup();
        renderMotivationRulesList();

        const client = getSupabase();
        if (client) {
            await client.from('control_motivation_rules').delete().eq('id', ruleId);
        }
        if (window.showToast) window.showToast('🗑️ Regra motivacional excluída.');
    }

    async function testMotivationRule(ruleId) {
        const rule = motivationRules.find(r => r.id === ruleId);
        if (!rule) return;

        let habitTitle = 'Hábito de Teste';
        let isBan = false;
        if (rule.habit_id !== 'all') {
            const habits = window.HabitTracker?.getHabits() || [];
            const found = habits.find(h => h.id === rule.habit_id);
            if (found) {
                habitTitle = found.title;
                isBan = found.habit_type === 'ban';
            }
        }

        if (window.showToast) window.showToast(`🔥 Disparando teste de email motivacional...`);

        await evaluateMotivationRulesOnHabitEvent({
            id: rule.habit_id,
            title: habitTitle,
            habit_type: isBan ? 'ban' : 'growth'
        }, 'test', {
            streak: rule.target_days || 7,
            status: 'Teste de Validação Executiva'
        });
    }

    /**
     * Motor de Avaliação Inteligente de Regras Motivacionais
     * Trata estritamente a diferença comportamental de Growth vs Ban:
     * - Para Growth: Marcar = Vitória (Streak sobe). Não marcar = Quebra.
     * - Para Ban: NÃO marcar = Vitória (Sobriedade/dias limpos sobem). Marcar = Recaída/Fracasso no dia.
     */
    async function evaluateMotivationRulesOnHabitEvent(habit, eventType, extraData = {}) {
        if (!emailSettings.motivation_enabled) {
            console.log('⚡ Emails Motivacionais desativados globalmente.');
            return;
        }

        const isBan = habit.habit_type === 'ban';
        const streakCount = extraData.streak || 1;
        const now = getBrasiliaDate();
        const dateStr = formatDisplayDate(formatISODate(now));

        for (const rule of motivationRules) {
            if (!rule.is_active) continue;
            if (rule.habit_id !== 'all' && rule.habit_id !== habit.id) continue;

            let shouldTrigger = false;
            let statusText = 'Em Progresso';

            if (eventType === 'test') {
                shouldTrigger = true;
                statusText = 'Teste de Disparo';
            } else if (rule.condition_type === 'streak_success') {
                // Streak de sucesso batido
                if (!isBan && eventType === 'completed' && streakCount >= rule.target_days) {
                    shouldTrigger = true;
                    statusText = `${streakCount} dias consecutivos cumpridos`;
                } else if (isBan && eventType === 'sobriety_streak' && streakCount >= rule.target_days) {
                    shouldTrigger = true;
                    statusText = `${streakCount} dias de sobriedade e liberdade`;
                }
            } else if (rule.condition_type === 'habit_broken') {
                // Quebra / Recaída
                if (!isBan && eventType === 'missed') {
                    shouldTrigger = true;
                    statusText = 'Sequência interrompida';
                } else if (isBan && eventType === 'completed') {
                    // Para hábito Ban, clicar em concluir significa que realizou o vício (recaída)
                    shouldTrigger = true;
                    statusText = 'Ação prejudicial registrada hoje';
                }
            } else if (rule.condition_type === 'milestone_session') {
                if (eventType === 'session_done' || eventType === 'completed') {
                    shouldTrigger = true;
                    statusText = 'Sessão finalizada com alta performance';
                }
            }

            if (shouldTrigger) {
                const tpl = emailTemplates.find(t => t.id === rule.template_id) || emailTemplates[0];
                if (tpl) {
                    let subject = tpl.subject || `🔥 [PERSONAL OS] Notificação de Hábito: ${habit.title}`;
                    let content = tpl.markdown_content || `# ⚡ Atualização de Hábito: ${habit.title}`;

                    subject = subject
                        .replace(/{habit_title}/g, habit.title)
                        .replace(/{streak}/g, String(streakCount))
                        .replace(/{status}/g, statusText)
                        .replace(/{date}/g, dateStr);

                    content = content
                        .replace(/{habit_title}/g, habit.title)
                        .replace(/{streak}/g, String(streakCount))
                        .replace(/{status}/g, statusText)
                        .replace(/{date}/g, dateStr);

                    await sendDiscordAlert({
                        title: subject,
                        message: content,
                        color: 0x10b981
                    });
                }
            }
        }
    }

    // ==========================================
    // SUPER CALENDÁRIO GLASSMORPHISM & TIMELINE 360° (FEATURE COMPLETA)
    // ==========================================

    const WEEKDAY_NAMES_SHORT = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];
    const WEEKDAY_NAMES_FULL = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'];
    const MONTH_NAMES_FULL = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];

    function initControlCalendar() {
        if (!calendarCurrentDate) calendarCurrentDate = getBrasiliaDate();
        if (!selectedCalendarDateStr) selectedCalendarDateStr = formatISODate(calendarCurrentDate);
        renderControlCalendar();
    }

    function setCalendarViewMode(mode) {
        calendarViewMode = mode;
        const modes = ['1day', '3days', '5days', '7days', 'month'];
        modes.forEach(m => {
            const btn = document.getElementById(`cal-view-${m}`);
            if (btn) {
                if (m === mode) {
                    btn.className = 'px-2.5 py-1 rounded-lg bg-white text-black font-bold transition cursor-pointer shadow';
                } else {
                    btn.className = 'px-2.5 py-1 rounded-lg text-gray-300 hover:text-white transition cursor-pointer';
                }
            }
        });
        renderControlCalendar();
    }

    function navigateControlCalendar(delta) {
        if (!calendarCurrentDate) calendarCurrentDate = getBrasiliaDate();
        if (delta === 0) {
            navigateControlCalendarToToday();
            return;
        }
        if (calendarViewMode === '1day') {
            calendarCurrentDate.setDate(calendarCurrentDate.getDate() + delta);
            selectedCalendarDateStr = formatISODate(calendarCurrentDate);
        } else if (calendarViewMode === '3days') {
            calendarCurrentDate.setDate(calendarCurrentDate.getDate() + (delta * 3));
            selectedCalendarDateStr = formatISODate(calendarCurrentDate);
        } else if (calendarViewMode === '5days') {
            calendarCurrentDate.setDate(calendarCurrentDate.getDate() + (delta * 5));
            selectedCalendarDateStr = formatISODate(calendarCurrentDate);
        } else if (calendarViewMode === '7days') {
            calendarCurrentDate.setDate(calendarCurrentDate.getDate() + (delta * 7));
            selectedCalendarDateStr = formatISODate(calendarCurrentDate);
        } else {
            const currentYear = calendarCurrentDate.getFullYear();
            const targetMonth = calendarCurrentDate.getMonth() + delta;
            calendarCurrentDate = new Date(currentYear, targetMonth, 1);
            selectedCalendarDateStr = formatISODate(calendarCurrentDate);
        }
        renderControlCalendar();
    }

    function navigateControlCalendarToToday() {
        calendarCurrentDate = getBrasiliaDate();
        selectedCalendarDateStr = formatISODate(calendarCurrentDate);
        renderControlCalendar();
    }

    function setCalendarFilter(filter) {
        calendarFilter = filter;
        updateCalendarFilterPillsColors();
        renderControlCalendar();
    }

    function selectControlCalendarDay(dateStr) {
        selectedCalendarDateStr = dateStr;
        renderControlCalendar();
    }

    function renderControlCalendar() {
        const gridEl = document.getElementById('control-calendar-grid');
        const monthTitleEl = document.getElementById('control-calendar-current-month');
        const headerEl = document.getElementById('control-calendar-weekdays-header');
        if (!gridEl) return;

        if (!calendarCurrentDate) calendarCurrentDate = getBrasiliaDate();
        const todayObj = getBrasiliaDate();
        const todayStr = formatISODate(todayObj);

        // Lista de hábitos do HabitTracker
        const allHabits = (window.HabitTracker && typeof window.HabitTracker.getHabits === 'function')
            ? (window.HabitTracker.getHabits() || [])
            : [];

        let daysToRender = []; // { dateObj, dayStr, isOffset }
        let gridClass = 'grid grid-cols-7 gap-1.5 sm:gap-2';
        let headerHtml = '';

        if (calendarViewMode === '1day') {
            // MODO 1 DIA
            const dayObj = new Date(calendarCurrentDate);
            const dayStr = formatISODate(dayObj);
            daysToRender.push({ dateObj: dayObj, dayStr, isOffset: false });
            gridClass = 'grid grid-cols-1 gap-3';
            if (monthTitleEl) {
                monthTitleEl.innerText = `${formatDisplayDate(dayStr)} • ${WEEKDAY_NAMES_FULL[dayObj.getDay()]}`;
            }
            if (headerEl) {
                headerEl.className = 'hidden';
            }
        } else if (calendarViewMode === '3days') {
            // MODO 3 DIAS (Centralizado em calendarCurrentDate)
            const base = new Date(calendarCurrentDate);
            base.setDate(base.getDate() - 1);
            for (let i = 0; i < 3; i++) {
                const d = new Date(base);
                d.setDate(d.getDate() + i);
                daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            }
            gridClass = 'grid grid-cols-1 sm:grid-cols-3 gap-3';
            if (monthTitleEl) {
                monthTitleEl.innerText = `${formatDisplayDate(daysToRender[0].dayStr)} – ${formatDisplayDate(daysToRender[2].dayStr)}`;
            }
            if (headerEl) {
                headerEl.className = 'grid grid-cols-1 sm:grid-cols-3 gap-1 text-center font-mono text-[10px] sm:text-xs font-bold text-gray-400 uppercase py-1';
                headerEl.innerHTML = daysToRender.map(d => `<div>${WEEKDAY_NAMES_FULL[d.dateObj.getDay()]} (${d.dateObj.getDate()})</div>`).join('');
            }
        } else if (calendarViewMode === '5days') {
            // MODO 5 DIAS
            for (let i = 0; i < 5; i++) {
                const d = new Date(calendarCurrentDate);
                d.setDate(d.getDate() + i);
                daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            }
            gridClass = 'grid grid-cols-1 sm:grid-cols-5 gap-2';
            if (monthTitleEl) {
                monthTitleEl.innerText = `${formatDisplayDate(daysToRender[0].dayStr)} – ${formatDisplayDate(daysToRender[4].dayStr)}`;
            }
            if (headerEl) {
                headerEl.className = 'grid grid-cols-1 sm:grid-cols-5 gap-1 text-center font-mono text-[10px] sm:text-xs font-bold text-gray-400 uppercase py-1';
                headerEl.innerHTML = daysToRender.map(d => `<div>${WEEKDAY_NAMES_SHORT[d.dateObj.getDay()]} ${d.dateObj.getDate()}</div>`).join('');
            }
        } else if (calendarViewMode === '7days') {
            // MODO 7 DIAS (Semana de Domingo a Sábado)
            const startOfWeek = new Date(calendarCurrentDate);
            startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());
            for (let i = 0; i < 7; i++) {
                const d = new Date(startOfWeek);
                d.setDate(d.getDate() + i);
                daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            }
            gridClass = 'grid grid-cols-2 sm:grid-cols-7 gap-1.5 sm:gap-2';
            if (monthTitleEl) {
                monthTitleEl.innerText = `${formatDisplayDate(daysToRender[0].dayStr)} – ${formatDisplayDate(daysToRender[6].dayStr)}`;
            }
            if (headerEl) {
                headerEl.className = 'hidden sm:grid sm:grid-cols-7 gap-1 text-center font-mono text-[10px] sm:text-xs font-bold text-gray-400 uppercase py-1';
                headerEl.innerHTML = WEEKDAY_NAMES_SHORT.map((name, idx) => `
                    <div class="${idx === 0 ? 'text-rose-400' : idx === 6 ? 'text-sky-400' : ''}">${name} ${daysToRender[idx].dateObj.getDate()}</div>
                `).join('');
            }
        } else {
            // MODO 1 MÊS (Padrão Mensal Completo)
            const year = calendarCurrentDate.getFullYear();
            const month = calendarCurrentDate.getMonth();
            if (monthTitleEl) {
                monthTitleEl.innerText = `${MONTH_NAMES_FULL[month]} ${year}`;
            }
            if (headerEl) {
                headerEl.className = 'grid grid-cols-7 gap-1 text-center font-mono text-[10px] sm:text-xs font-bold text-gray-400 uppercase py-1';
                headerEl.innerHTML = `
                    <div class="text-rose-400">Dom</div>
                    <div>Seg</div>
                    <div>Ter</div>
                    <div>Qua</div>
                    <div>Qui</div>
                    <div>Sex</div>
                    <div class="text-sky-400">Sáb</div>
                `;
            }

            const firstDayOfMonth = new Date(year, month, 1);
            const lastDayOfMonth = new Date(year, month + 1, 0);
            const daysInMonth = lastDayOfMonth.getDate();
            const startingDay = firstDayOfMonth.getDay();

            for (let i = 0; i < startingDay; i++) {
                daysToRender.push({ isOffset: true });
            }
            for (let day = 1; day <= daysInMonth; day++) {
                const d = new Date(year, month, day);
                daysToRender.push({ dateObj: d, dayStr: formatISODate(d), isOffset: false });
            }
            gridClass = 'grid grid-cols-7 gap-1.5 sm:gap-2';
        }

        gridEl.className = gridClass;

        let html = '';

        daysToRender.forEach(item => {
            if (item.isOffset) {
                const offNum = item.dateObj ? item.dateObj.getDate() : '';
                html += `
                    <div class="min-h-[48px] sm:min-h-[96px] rounded-xl sm:rounded-2xl p-1 sm:p-2.5 border border-white/[0.04] bg-white/[0.01] opacity-25 flex flex-col justify-between select-none">
                        <span class="text-[11px] sm:text-xs font-mono font-bold text-gray-500">${offNum}</span>
                        <div class="h-1 sm:h-2"></div>
                    </div>
                `;
                return;
            }

            const dayStr = item.dayStr;
            const dayObj = item.dateObj;
            const dayNum = dayObj.getDate();
            const isToday = dayStr === todayStr;
            const isSelected = dayStr === selectedCalendarDateStr;

            // Dados do Dia
            const dayGoogleEvents = googleEventsList.filter(e => e.date === dayStr);
            const dayReminders = remindersList.filter(r => r.is_active && (r.target_date === dayStr || r.reminder_type === 'daily'));
            const dayTodos = todosList.filter(t => t.due_date === dayStr || (t.is_recurring && Array.isArray(t.recurring_dates) && t.recurring_dates.includes(dayStr)));
            const activeHabitsOnDate = allHabits.filter(h => dayStr >= (h.created_at ? h.created_at.slice(0, 10) : '2026-01-01'));
            const completedHabitsOnDate = activeHabitsOnDate.filter(h => Array.isArray(h.complete_days) && h.complete_days.includes(dayStr));
            const dayDiaryEntries = diaryEntriesList.filter(d => d.entry_date === dayStr);

            // 6. Rotina de Estudos (STUD)
            const dayOfWeekCode = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'][dayObj.getDay()];
            const dayStudies = studyBlocks.filter(b => b.is_active !== false && b.day_of_week === dayOfWeekCode);

            let visibleChips = [];

            // 1. Google (com Cor Oficial Sincronizada)
            if (calendarFilter === 'all' || calendarFilter === 'google') {
                dayGoogleEvents.forEach(ge => {
                    const col = GOOGLE_CALENDAR_COLORS[ge.colorId] || GOOGLE_CALENDAR_COLORS['7'];
                    visibleChips.push(`
                        <div class="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded truncate flex items-center gap-1 transition shadow-sm" style="background: ${col.hex}28; color: ${col.lightHex}; border: 1px solid ${col.hex}55;" title="Google [${escapeHtml(col.name)}]: ${escapeHtml(ge.title)}">
                            <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background: ${col.hex}; box-shadow: 0 0 6px ${col.hex};"></span>
                            <span class="truncate font-semibold">${ge.time ? escapeHtml(ge.time) + ' ' : ''}${escapeHtml(ge.title)}</span>
                        </div>
                    `);
                });
            }

            // 2. Lembretes (com a cor personalizada da sessão)
            const remCol = getSessionColor('reminders');
            if (calendarFilter === 'all' || calendarFilter === 'reminders') {
                dayReminders.forEach(r => {
                    visibleChips.push(`
                        <div onclick="event.stopPropagation(); window.ControlEngine.openEditReminderModal('${r.id}')" class="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded-lg transition flex items-center justify-between gap-1 shadow-xs cursor-pointer truncate" style="background: ${remCol}22; color: ${remCol}; border: 1px solid ${remCol}55; box-shadow: 0 0 8px ${remCol}15;" title="Lembrete: ${escapeHtml(r.title)}">
                            <span class="truncate flex items-center gap-1 font-semibold"><span>🟣</span> <span>${r.target_time ? r.target_time + ' ' : ''}${escapeHtml(r.title)}</span></span>
                            ${r.has_sound ? '<span class="text-[7px]">🔊</span>' : ''}
                        </div>
                    `);
                });
            }

            // 3. Tarefas (com a cor personalizada da sessão)
            const todoCol = getSessionColor('todos');
            if (calendarFilter === 'all' || calendarFilter === 'todos') {
                dayTodos.forEach(t => {
                    visibleChips.push(`
                        <div onclick="event.stopPropagation(); window.ControlEngine.openEditTodoModal('${t.id}')" class="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded-lg transition flex items-center justify-between gap-1 shadow-xs cursor-pointer truncate ${t.is_completed ? 'line-through opacity-60' : ''}" style="background: ${todoCol}22; color: ${todoCol}; border: 1px solid ${todoCol}55; box-shadow: 0 0 8px ${todoCol}15;" title="To-Do: ${escapeHtml(t.title)}">
                            <span class="truncate flex items-center gap-1 font-semibold"><span>🟢</span> <span>${t.due_time ? t.due_time + ' ' : ''}${escapeHtml(t.title)}</span></span>
                            <span class="text-[7px] font-bold">${t.is_completed ? '✓' : ''}</span>
                        </div>
                    `);
                });
            }

            // 4. Hábitos (com a cor personalizada da sessão)
            const habitCol = getSessionColor('habits');
            if (calendarFilter === 'all' || calendarFilter === 'habits') {
                if (activeHabitsOnDate.length > 0) {
                    const doneRatio = `${completedHabitsOnDate.length}/${activeHabitsOnDate.length}`;
                    const isAllDone = completedHabitsOnDate.length === activeHabitsOnDate.length && activeHabitsOnDate.length > 0;
                    visibleChips.push(`
                        <div class="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded truncate" style="background: ${habitCol}${isAllDone ? '35' : '18'}; color: ${habitCol}; border: 1px solid ${habitCol}${isAllDone ? '80' : '40'}; font-weight: ${isAllDone ? 'bold' : 'normal'};" title="Hábitos: ${doneRatio} concluídos">
                            ⚡ ${doneRatio} Hábitos
                        </div>
                    `);
                }
            }

            // 5. Diário
            const diaryCol = getSessionColor('cartas') || '#ec4899';
            if (calendarFilter === 'all' || calendarFilter === 'diary') {
                if (dayDiaryEntries.length > 0) {
                    visibleChips.push(`
                        <div class="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded truncate" style="background: ${diaryCol}22; color: ${diaryCol}; border: 1px solid ${diaryCol}55;" title="Diário: ${dayDiaryEntries.length} anotação(ões)">
                            📖 ${dayDiaryEntries.length} ${dayDiaryEntries.length === 1 ? 'nota' : 'notas'}
                        </div>
                    `);
                }
            }

            // 6. Rotina de Estudos (STUD - com a cor personalizada da sessão)
            const studyCol = getSessionColor('studies');
            if (calendarFilter === 'all' || calendarFilter === 'studies') {
                dayStudies.forEach(sb => {
                    const blockCol = sb.color || studyCol;
                    visibleChips.push(`
                        <div onclick="event.stopPropagation(); window.ControlEngine.openEditStudyBlockModal('${sb.id}')" class="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.5 rounded-lg transition flex items-center justify-between gap-1 shadow-xs cursor-pointer truncate" style="background: ${blockCol}22; color: ${blockCol}; border: 1px solid ${blockCol}55; box-shadow: 0 0 8px ${blockCol}15;" title="Estudos: ${escapeHtml(sb.title)} (${sb.start_time || '08:30'} - ${sb.end_time || '13:30'})">
                            <span class="truncate flex items-center gap-1 font-semibold"><span>🌐</span> <span>${sb.start_time ? sb.start_time + ' ' : ''}${escapeHtml(sb.title)}</span></span>
                            <span class="w-1.5 h-1.5 rounded-full shrink-0" style="background: ${blockCol}; box-shadow: 0 0 6px ${blockCol};"></span>
                        </div>
                    `);
                });
            }

            const isMonthView = calendarViewMode === 'month';
            const totalVisible = visibleChips.length;
            const maxChipsToShow = calendarViewMode === '1day' ? 8 : (calendarViewMode === '3days' ? 4 : 2);
            const displayedChips = visibleChips.slice(0, maxChipsToShow);
            const remainingCount = totalVisible - maxChipsToShow;

            // Micro-indicadores neon em linha única horizontal para mobile mensal
            const mobileNeonDots = `
                <div class="flex items-center justify-center gap-1 my-auto py-0.5 sm:hidden overflow-hidden max-w-full">
                    ${dayGoogleEvents.length > 0 ? `<span class="w-1.5 h-1.5 rounded-full shrink-0" style="background: #38bdf8; box-shadow: 0 0 5px #38bdf8;" title="Google: ${dayGoogleEvents.length}"></span>` : ''}
                    ${dayTodos.length > 0 ? `<span class="w-1.5 h-1.5 rounded-full shrink-0" style="background: #10b981; box-shadow: 0 0 5px #10b981;" title="Tarefas: ${dayTodos.length}"></span>` : ''}
                    ${dayReminders.length > 0 ? `<span class="w-1.5 h-1.5 rounded-full shrink-0" style="background: #a855f7; box-shadow: 0 0 5px #a855f7;" title="Lembretes: ${dayReminders.length}"></span>` : ''}
                    ${dayStudies.length > 0 ? `<span class="w-1.5 h-1.5 rounded-full shrink-0" style="background: #0ea5e9; box-shadow: 0 0 5px #0ea5e9;" title="Estudos: ${dayStudies.length}"></span>` : ''}
                    ${dayDiaryEntries.length > 0 ? `<span class="w-1.5 h-1.5 rounded-full shrink-0" style="background: #ec4899; box-shadow: 0 0 5px #ec4899;" title="Diário"></span>` : ''}
                    ${completedHabitsOnDate.length > 0 ? `<span class="w-1.5 h-1.5 rounded-full shrink-0" style="background: #f59e0b; box-shadow: 0 0 5px #f59e0b;" title="Hábitos"></span>` : ''}
                </div>
            `;

            html += `
                <div onclick="window.ControlEngine.selectControlCalendarDay('${dayStr}')" class="min-h-[48px] sm:min-h-[96px] h-full w-full max-w-full overflow-hidden box-border rounded-xl sm:rounded-2xl p-1 sm:p-2.5 border transition-all cursor-pointer flex flex-col justify-between select-none relative group ${
                    isSelected 
                        ? 'bg-purple-600/30 border-purple-400 ring-2 ring-purple-500/50 shadow-[0_0_20px_rgba(168,85,247,0.35)]' 
                        : isToday 
                            ? 'bg-white/15 border-white/40 ring-1 ring-white/40' 
                            : 'bg-white/[0.04] border-white/10 hover:bg-white/[0.09] hover:border-white/25'
                }">
                    <div class="flex items-center justify-between w-full">
                        <div class="flex items-center gap-1 min-w-0">
                            <span class="text-xs sm:text-sm font-mono font-bold ${isToday ? 'text-amber-300 font-black' : isSelected ? 'text-white' : 'text-gray-300'}">
                                ${dayNum}
                            </span>
                            ${calendarViewMode !== 'month' ? `<span class="text-[9px] font-mono text-gray-400 uppercase truncate">${WEEKDAY_NAMES_SHORT[dayObj.getDay()]}</span>` : ''}
                        </div>
                        <div class="hidden sm:flex items-center gap-1 shrink-0">
                            ${dayDiaryEntries.length > 0 ? '<span class="text-[9px]" title="Contém anotação no diário">📖</span>' : ''}
                            ${dayStudies.length > 0 ? '<span class="text-[9px]" title="Rotina de Estudos agendada">🌐</span>' : ''}
                            ${completedHabitsOnDate.length > 0 ? `<span class="text-[8px] font-mono px-1 py-0.1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">${completedHabitsOnDate.length}✓</span>` : ''}
                            ${isToday ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping"></span>' : ''}
                        </div>
                        ${isToday ? '<span class="w-1.5 h-1.5 rounded-full bg-amber-400 animate-ping sm:hidden"></span>' : ''}
                    </div>

                    <!-- Micro-indicadores no mobile para modo mensal -->
                    ${isMonthView ? mobileNeonDots : ''}

                    <!-- Chips de Eventos e Atividades (Visível no Desktop ou em Modos 1D/3D/5D/7D) -->
                    <div class="space-y-0.5 overflow-hidden my-1 ${isMonthView ? 'hidden sm:block' : 'block'}">
                        ${displayedChips.join('')}
                        ${remainingCount > 0 ? `<span class="text-[8px] font-mono text-gray-400 font-bold block truncate">+${remainingCount} mais</span>` : ''}
                    </div>

                    <!-- Rodapé Micro com Status (Apenas desktop no modo mensal, ou modos detalhados) -->
                    <div class="items-center justify-between text-[8px] font-mono text-gray-400 pt-0.5 border-t border-white/5 truncate ${isMonthView ? 'hidden sm:flex' : 'flex'}">
                        <span class="truncate">${dayGoogleEvents.length > 0 ? `🔵${dayGoogleEvents.length}` : ''} ${dayTodos.length > 0 ? `🟢${dayTodos.length}` : ''} ${dayReminders.length > 0 ? `🟣${dayReminders.length}` : ''}</span>
                        <span class="text-[7px] text-gray-400 uppercase shrink-0">${isToday ? 'Hoje' : ''}</span>
                    </div>
                </div>
            `;
        });

        gridEl.innerHTML = html;
        renderControlCalendarDayDetails(selectedCalendarDateStr);
    }

    let expanded360ItemIds = new Set();

    function toggle360ItemExpansion(id) {
        if (expanded360ItemIds.has(id)) {
            expanded360ItemIds.delete(id);
        } else {
            expanded360ItemIds.add(id);
        }
        renderControlCalendarDayDetails(selectedCalendarDateStr);
    }

    async function deleteGoogleEventFrom360(id) {
        const confirmed = window.glassConfirm ? await window.glassConfirm('Deseja excluir este compromisso do Google Agenda?', 'Excluir Compromisso', 'Excluir', 'Cancelar', true, '📅') : confirm('Deseja excluir este compromisso do Google Agenda?');
        if (!confirmed) return;
        googleEventsList = googleEventsList.filter(e => e.id !== id);
        saveLocalStorageBackup();
        renderControlCalendar();

        if (googleCalendarSettings.access_token) {
            try {
                const rawId = id.startsWith('gapi_') ? id.replace('gapi_', '') : id;
                if (!rawId.startsWith('opt_') && !rawId.startsWith('temp_')) {
                    await deleteGCalEventViaProxyOrDirect(rawId, googleCalendarSettings.access_token);
                }
            } catch (e) {
                console.error('[GCAL DELETE] Erro ao deletar no Google:', e);
            }
        }
        if (window.showToast) window.showToast('✓ Evento excluído do Google Agenda.');
        setTimeout(() => syncGoogleCalendar(true), 1000);
    }

    async function deleteDiaryEntryFrom360(id) {
        const confirmed = window.glassConfirm ? await window.glassConfirm('Deseja excluir permanentemente esta anotação do Diário?', 'Excluir Anotação', 'Excluir', 'Cancelar', true, '📓') : confirm('Deseja excluir permanentemente esta anotação do Diário?');
        if (!confirmed) return;
        diaryEntriesList = diaryEntriesList.filter(d => d.id !== id);
        saveLocalStorageBackup();
        renderControlCalendar();
        const client = getSupabase();
        if (client) {
            await client.from('diary_entries').delete().eq('id', id);
        }
        if (window.showToast) window.showToast('✓ Anotação do Diário excluída.');
    }

        function renderControlCalendarDayDetails(dateStr) {
        const detailsContainer = document.getElementById('control-calendar-day-details');
        if (!detailsContainer) return;

        const formatted = formatDisplayDate(dateStr);
        let dateObj;
        try {
            const parts = dateStr.split('-');
            dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        } catch (e) {
            dateObj = getBrasiliaDate();
        }
        const weekdayName = WEEKDAY_NAMES_FULL[dateObj.getDay()];
        const dayOfWeekCode = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'][dateObj.getDay()];

        // Dados Completos da Data
        const dayGoogleEvents = googleEventsList.filter(e => e.date === dateStr);
        const dayReminders = remindersList.filter(r => r.is_active && (r.target_date === dateStr || r.reminder_type === 'daily'));
        const dayTodos = todosList.filter(t => t.due_date === dateStr || (t.is_recurring && Array.isArray(t.recurring_dates) && t.recurring_dates.includes(dateStr)));
        const dayDiaryEntries = diaryEntriesList.filter(d => d.entry_date === dateStr);
        const dayStudies = studyBlocks.filter(b => b.is_active !== false && b.day_of_week === dayOfWeekCode);

        // Hábitos do HabitTracker
        const allHabits = (window.HabitTracker && typeof window.HabitTracker.getHabits === 'function')
            ? (window.HabitTracker.getHabits() || [])
            : [];
        const activeHabitsOnDate = allHabits.filter(h => dateStr >= (h.created_at ? h.created_at.slice(0, 10) : '2026-01-01'));
        const completedHabits = activeHabitsOnDate.filter(h => Array.isArray(h.complete_days) && h.complete_days.includes(dateStr));
        const pendingHabits = activeHabitsOnDate.filter(h => !Array.isArray(h.complete_days) || !h.complete_days.includes(dateStr));
        const habitSuccessRate = activeHabitsOnDate.length > 0 
            ? Math.round((completedHabits.length / activeHabitsOnDate.length) * 100) 
            : 0;

        // Cores dinâmicas de cada sessão para estilização viva da Visão 360°
        const habitColor = getSessionColor('habits');
        const todoColor = getSessionColor('todos');
        const remColor = getSessionColor('reminders');
        const studyColor = getSessionColor('studies');
        const diaryColor = getSessionColor('cartas') || '#ec4899';

        let html = `
            <!-- Topo do Card 360° -->
            <div class="flex items-center justify-between border-b border-white/15 pb-3 flex-wrap gap-2.5">
                <div class="space-y-1">
                    <div class="flex items-center gap-2 flex-wrap">
                        <span class="text-base sm:text-lg font-bold text-white font-mono flex items-center gap-2">
                            <span>📅</span> <span>Visão 360°: ${formatted}</span>
                        </span>
                        <span class="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 font-bold">
                            ${weekdayName}
                        </span>
                    </div>
                    <p class="text-[10px] font-mono text-gray-300">
                        Resumo integrado unificado • To-Do, Lembretes, Estudos, Google Agenda e Diário
                    </p>
                </div>

                <!-- Botões de Ação Imediata -->
                <div class="grid grid-cols-2 sm:flex sm:items-center gap-1.5 w-full sm:w-auto">
                    <button type="button" onclick="window.ControlEngine.syncEntireDayToGoogleCalendar('${dateStr}')" class="px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl bg-blue-500/20 hover:bg-blue-500/35 text-blue-200 border border-blue-500/40 font-mono text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-95 text-center truncate" title="Sincronizar todos os eventos e registros deste dia com o Google Agenda">
                        <span>📅</span> <span class="truncate">Google Sync</span>
                    </button>
                    <button type="button" onclick="window.ControlEngine.openNewStudyBlockModal('${dayOfWeekCode}', '08:30', '13:30')" class="px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl bg-sky-500/20 hover:bg-sky-500/30 text-sky-300 border border-sky-500/40 font-mono text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-95 text-center truncate" title="Adicionar Matéria de Estudo">
                        <span>🌐</span> <span class="truncate">+ Estudo</span>
                    </button>
                    <a href="diary.html" target="_self" class="px-2.5 sm:px-3 py-2 sm:py-1.5 rounded-xl bg-pink-500/20 hover:bg-pink-500/30 text-pink-300 border border-pink-500/40 font-mono text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 text-center truncate" title="Abrir Diário Pessoal">
                        <span>📖</span> <span class="truncate">Diário</span>
                    </a>
                    <button type="button" onclick="window.ControlEngine.openQuickCalendarEventModal('${dateStr}')" class="col-span-2 sm:col-span-1 px-3.5 py-2 sm:py-1.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-mono text-[11px] sm:text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer shadow active:scale-95">
                        <span>➕</span> <span>Adicionar Item</span>
                    </button>
                </div>
            </div>

            <!-- Grade Responsiva e Inteligente de 5 Cards Casados com as Cores das Sessões -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5 pt-2.5">
                
                <!-- 1. RESUMO DE HÁBITOS DO DIA -->
                <div class="p-3.5 rounded-2xl bg-white/[0.03] space-y-2.5 flex flex-col justify-between shadow-lg backdrop-blur-md w-full max-w-full overflow-hidden box-border" style="border: 1px solid ${habitColor}45; box-shadow: 0 8px 30px ${habitColor}12;">
                    <div>
                        <div class="flex items-center justify-between border-b border-white/10 pb-1.5">
                            <span class="text-[11px] font-mono font-bold text-amber-300 flex items-center gap-1">
                                <span>⚡</span> <span>Hábitos & Disciplina</span>
                            </span>
                            <span class="text-[9px] font-mono px-2 py-0.5 rounded-full ${habitSuccessRate >= 80 ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40' : 'bg-amber-500/20 text-amber-300 border border-amber-500/40'} font-bold">
                                ${completedHabits.length}/${activeHabitsOnDate.length} (${habitSuccessRate}%)
                            </span>
                        </div>

                        <!-- Barra de Progresso Neon -->
                        <div class="w-full bg-white/10 rounded-full h-1.5 my-2 overflow-hidden">
                            <div class="bg-gradient-to-r from-amber-400 to-emerald-400 h-full rounded-full transition-all duration-500" style="width: ${habitSuccessRate}%"></div>
                        </div>

                        <div class="space-y-2 max-h-56 overflow-y-auto pr-1">
                            ${
                                activeHabitsOnDate.length === 0
                                    ? `<div class="text-[10px] font-mono text-gray-400 p-2 rounded-xl bg-white/[0.02] italic">Nenhum hábito ativo nesta data.</div>`
                                    : activeHabitsOnDate.map(h => {
                                        const isDone = Array.isArray(h.complete_days) && h.complete_days.includes(dateStr);
                                        const itemId = `habit_${h.id}`;
                                        const isExp = expanded360ItemIds.has(itemId);
                                        return `
                                            <div class="rounded-xl border transition-all duration-300 overflow-hidden ${isDone ? 'bg-emerald-950/25 border-emerald-500/40' : 'bg-rose-950/20 border-rose-500/30'}">
                                                <div onclick="window.ControlEngine.toggle360ItemExpansion('${itemId}')" class="p-2.5 flex items-center justify-between gap-1.5 cursor-pointer hover:bg-white/[0.04] select-none">
                                                    <div class="flex items-center gap-1.5 min-w-0">
                                                        <span>${h.emoji || '⚡'}</span>
                                                        <span class="font-bold truncate text-[11px] ${isDone ? 'text-emerald-100' : 'text-rose-200'}">${h.title}</span>
                                                    </div>
                                                    <div class="flex items-center gap-1.5 shrink-0">
                                                        <span class="text-[9px] font-bold px-1.5 py-0.5 rounded-full ${isDone ? 'bg-emerald-500/30 text-emerald-200' : 'bg-rose-500/30 text-rose-200'}">
                                                            ${isDone ? '✓ Feito' : '✕ Pendente'}
                                                        </span>
                                                        <span class="text-[9px] text-gray-400 transition-transform duration-300 ${isExp ? 'rotate-180' : ''}">▼</span>
                                                    </div>
                                                </div>

                                                ${isExp ? `
                                                    <div class="p-2.5 pt-0 border-t border-white/10 space-y-2 text-[10px] font-mono text-gray-300 bg-black/20">
                                                        <div class="flex items-center justify-between text-[9px] pt-2 text-gray-400">
                                                            <span>🔥 Streak: <strong>${(h.streak || 0)} dias</strong></span>
                                                            <span>🎯 Meta: ${h.target_days_count || 1}x/${h.frequency || 'dia'}</span>
                                                        </div>
                                                        ${h.description ? `<p class="text-[9px] text-gray-300 bg-white/[0.03] p-1.5 rounded-lg border border-white/5 leading-relaxed">${h.description}</p>` : ''}
                                                        
                                                        <div class="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                                                            <button type="button" onclick="window.HabitTracker && window.HabitTracker.toggleHabitDay ? (window.HabitTracker.toggleHabitDay('${h.id}', '${dateStr}'), window.ControlEngine.renderControlCalendar()) : null" class="px-2 py-1 rounded-lg text-[9px] font-bold cursor-pointer transition ${isDone ? 'bg-amber-500/20 hover:bg-amber-500/30 text-amber-200' : 'bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-200'}">
                                                                ${isDone ? '↺ Desmarcar' : '✓ Concluir'}
                                                            </button>
                                                            <div class="flex items-center gap-1">
                                                                <button type="button" onclick="window.HabitTracker && window.HabitTracker.openEditHabitModal ? window.HabitTracker.openEditHabitModal('${h.id}') : (window.HabitTracker && window.HabitTracker.openHabitDetailModal ? window.HabitTracker.openHabitDetailModal('${h.id}') : null)" class="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 font-bold text-[9px] cursor-pointer transition flex items-center gap-1" title="Editar Hábito">
                                                                    <span>✏️</span> <span>Editar</span>
                                                                </button>
                                                                <button type="button" onclick="window.HabitTracker && window.HabitTracker.openDeleteConfirmation ? window.HabitTracker.openDeleteConfirmation('${h.id}') : null" class="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 font-bold text-[9px] cursor-pointer transition flex items-center gap-1" title="Excluir Hábito">
                                                                    <span>🗑️</span> <span>Excluir</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `;
                                    }).join('')
                            }
                        </div>
                    </div>

                    <a href="#section-habits" class="text-[9px] font-mono text-amber-300/80 hover:text-amber-200 flex items-center justify-center gap-1 pt-1.5 hover:underline">
                        <span>⚡ Abrir Habit Tracker OS</span>
                    </a>
                </div>

                <!-- 2. TAREFAS TO-DO DO DIA -->
                <div class="p-3.5 rounded-2xl bg-white/[0.03] space-y-2.5 flex flex-col justify-between shadow-lg backdrop-blur-md w-full max-w-full overflow-hidden box-border" style="border: 1px solid ${todoColor}45; box-shadow: 0 8px 30px ${todoColor}12;">
                    <div>
                        <div class="flex items-center justify-between border-b border-white/10 pb-1.5">
                            <span class="text-[11px] font-mono font-bold text-emerald-300 flex items-center gap-1">
                                <span>🟢</span> <span>Tarefas To-Do (${dayTodos.length})</span>
                            </span>
                            <span class="text-[9px] font-mono text-gray-400">
                                ${dayTodos.filter(t => t.is_completed).length} concluídas
                            </span>
                        </div>

                        <div class="space-y-2 max-h-56 overflow-y-auto pr-1 pt-1.5">
                            ${
                                dayTodos.length === 0 
                                    ? `<div class="text-[10px] font-mono text-gray-400 p-2.5 rounded-xl bg-white/[0.02] italic">Nenhuma tarefa agendada para este dia.</div>`
                                    : dayTodos.map(t => {
                                        const grp = todoGroups.find(g => g.id === t.group_id);
                                        const itemId = `todo_${t.id}`;
                                        const isExp = expanded360ItemIds.has(itemId);
                                        return `
                                            <div class="rounded-xl border border-emerald-500/30 bg-emerald-950/25 transition-all duration-300 overflow-hidden">
                                                <div onclick="window.ControlEngine.toggle360ItemExpansion('${itemId}')" class="p-2.5 flex items-center justify-between gap-1.5 cursor-pointer hover:bg-white/[0.04] select-none">
                                                    <div class="flex items-center gap-1.5 min-w-0">
                                                        <button type="button" onclick="event.stopPropagation(); window.ControlEngine.toggleTodoComplete('${t.id}')" class="text-[11px] cursor-pointer hover:scale-125 transition">
                                                            ${t.is_completed ? '✅' : '🟩'}
                                                        </button>
                                                        <span class="font-bold text-emerald-100 text-[11px] truncate ${t.is_completed ? 'line-through opacity-60' : ''}">${t.title}</span>
                                                    </div>
                                                    <div class="flex items-center gap-1.5 shrink-0">
                                                        <span class="text-[9px] text-emerald-300 font-bold px-1.5 py-0.5 rounded bg-emerald-500/20">${t.due_time || '12:00'}</span>
                                                        <span class="text-[9px] text-gray-400 transition-transform duration-300 ${isExp ? 'rotate-180' : ''}">▼</span>
                                                    </div>
                                                </div>

                                                ${isExp ? `
                                                    <div class="p-2.5 pt-0 border-t border-white/10 space-y-2 text-[10px] font-mono text-gray-300 bg-black/20">
                                                        <div class="flex items-center justify-between text-[9px] pt-2 text-gray-400">
                                                            <span>📁 Grupo: <strong>${grp ? grp.emoji + ' ' + grp.title : 'Geral'}</strong></span>
                                                            <span class="px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-300 font-bold uppercase text-[8px]">${t.priority || 'normal'}</span>
                                                        </div>
                                                        ${t.description ? `<p class="text-[9px] text-gray-300 bg-white/[0.03] p-1.5 rounded-lg border border-white/5 leading-relaxed">${t.description}</p>` : ''}

                                                        <div class="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                                                            <button type="button" onclick="window.ControlEngine.openGoogleCalendarDirectLink('${t.title}', '${dateStr}', '${t.due_time || '12:00'}', '${t.description || ''}')" class="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/30 text-sky-200 text-[9px] font-bold cursor-pointer transition flex items-center gap-0.5" title="Adicionar no Google">
                                                                <span>📅</span> <span>Google</span>
                                                            </button>
                                                            <div class="flex items-center gap-1">
                                                                <button type="button" onclick="window.ControlEngine.openEditTodoModal('${t.id}')" class="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 font-bold text-[9px] cursor-pointer transition flex items-center gap-1" title="Editar Tarefa">
                                                                    <span>✏️</span> <span>Editar</span>
                                                                </button>
                                                                <button type="button" onclick="window.ControlEngine.deleteTodo('${t.id}')" class="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 font-bold text-[9px] cursor-pointer transition flex items-center gap-1" title="Excluir Tarefa">
                                                                    <span>🗑️</span> <span>Excluir</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `;
                                    }).join('')
                            }
                        </div>
                    </div>

                    <button type="button" onclick="window.ControlEngine.openNewTodoModal()" class="text-[9px] font-mono text-emerald-300/80 hover:text-emerald-200 flex items-center justify-center gap-1 pt-1.5 hover:underline cursor-pointer">
                        <span>➕ Nova Tarefa</span>
                    </button>
                </div>

                <!-- 3. LEMBRETES CONTROL & GOOGLE AGENDA -->
                <div class="p-3.5 rounded-2xl bg-white/[0.03] space-y-2.5 flex flex-col justify-between shadow-lg backdrop-blur-md w-full max-w-full overflow-hidden box-border" style="border: 1px solid ${remColor}45; box-shadow: 0 8px 30px ${remColor}12;">
                    <div>
                        <div class="flex items-center justify-between border-b border-white/10 pb-1.5">
                            <span class="text-[11px] font-mono font-bold text-purple-300 flex items-center gap-1">
                                <span>🟣</span> <span>Lembretes & Google (${dayReminders.length + dayGoogleEvents.length})</span>
                            </span>
                            <span class="text-[9px] font-mono text-gray-400">
                                ${dayGoogleEvents.length} no Google
                            </span>
                        </div>

                        <div class="space-y-2 max-h-56 overflow-y-auto pr-1 pt-1.5">
                            ${
                                (dayReminders.length === 0 && dayGoogleEvents.length === 0)
                                    ? `<div class="text-[10px] font-mono text-gray-400 p-2.5 rounded-xl bg-white/[0.02] italic">Nenhum lembrete ou evento Google.</div>`
                                    : [
                                        ...dayGoogleEvents.map(ge => {
                                            const col = GOOGLE_CALENDAR_COLORS[ge.colorId] || GOOGLE_CALENDAR_COLORS['7'];
                                            const itemId = `ge_${ge.id}`;
                                            const isExp = expanded360ItemIds.has(itemId);
                                            return `
                                                <div class="rounded-xl border transition-all duration-300 overflow-hidden" style="background: ${col.hex}18; border-color: ${col.hex}45;">
                                                    <div onclick="window.ControlEngine.toggle360ItemExpansion('${itemId}')" class="p-2.5 flex items-center justify-between gap-1.5 cursor-pointer hover:bg-white/[0.04] select-none">
                                                        <div class="flex items-center gap-1.5 min-w-0">
                                                            <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background: ${col.hex}; box-shadow: 0 0 8px ${col.hex};"></span>
                                                            <span class="font-bold text-[11px] truncate" style="color: ${col.lightHex};">${ge.title}</span>
                                                        </div>
                                                        <div class="flex items-center gap-1.5 shrink-0">
                                                            <span class="text-[9px] font-bold px-1.5 py-0.5 rounded" style="background: ${col.hex}30; color: ${col.lightHex};">${ge.time || 'Dia Todo'}</span>
                                                            <span class="text-[9px] text-gray-400 transition-transform duration-300 ${isExp ? 'rotate-180' : ''}">▼</span>
                                                        </div>
                                                    </div>

                                                    ${isExp ? `
                                                        <div class="p-2.5 pt-0 border-t border-white/10 space-y-2 text-[10px] font-mono text-gray-300 bg-black/20">
                                                            <div class="flex items-center justify-between text-[9px] pt-2 text-gray-400">
                                                                <span class="font-semibold" style="color: ${col.lightHex};">🎨 Cor: ${col.name}</span>
                                                                <span>${ge.location ? '📍 ' + ge.location : 'Google Agenda'}</span>
                                                            </div>
                                                            ${ge.description ? `<p class="text-[9px] text-gray-300 bg-white/[0.03] p-1.5 rounded-lg border border-white/5 leading-relaxed">${ge.description}</p>` : ''}

                                                            <div class="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                                                                ${ge.htmlLink ? `
                                                                    <a href="${ge.htmlLink}" target="_blank" class="px-2 py-1 rounded-lg bg-blue-500/20 hover:bg-blue-500/30 text-blue-200 text-[9px] font-bold transition flex items-center gap-1">
                                                                        <span>📅</span> <span>Ver no Google</span>
                                                                    </a>
                                                                ` : '<div></div>'}
                                                                <div class="flex items-center gap-1 ml-auto">
                                                                    <button type="button" onclick="window.ControlEngine.openQuickCalendarEventModal('${dateStr}')" class="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 font-bold text-[9px] cursor-pointer transition flex items-center gap-1" title="Editar / Novo">
                                                                        <span>✏️</span> <span>Editar</span>
                                                                    </button>
                                                                    <button type="button" onclick="window.ControlEngine.deleteGoogleEventFrom360('${ge.id}')" class="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 font-bold text-[9px] cursor-pointer transition flex items-center gap-1" title="Excluir do Google">
                                                                        <span>🗑️</span> <span>Excluir</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            `;
                                        }),
                                        ...dayReminders.map(r => {
                                            const grp = reminderGroups.find(g => g.id === r.group_id);
                                            const itemId = `rem_${r.id}`;
                                            const isExp = expanded360ItemIds.has(itemId);
                                            return `
                                                <div class="rounded-xl border border-purple-500/30 bg-purple-950/30 transition-all duration-300 overflow-hidden">
                                                    <div onclick="window.ControlEngine.toggle360ItemExpansion('${itemId}')" class="p-2.5 flex items-center justify-between gap-1.5 cursor-pointer hover:bg-white/[0.04] select-none">
                                                        <div class="flex items-center gap-1.5 min-w-0">
                                                            <span>${r.emoji || '🔔'}</span>
                                                            <span class="font-bold text-purple-100 text-[11px] truncate">${r.title}</span>
                                                        </div>
                                                        <div class="flex items-center gap-1.5 shrink-0">
                                                            <span class="text-[9px] text-purple-300 font-bold px-1.5 py-0.5 rounded bg-purple-500/20">${r.target_time}</span>
                                                            <span class="text-[9px] text-gray-400 transition-transform duration-300 ${isExp ? 'rotate-180' : ''}">▼</span>
                                                        </div>
                                                    </div>

                                                    ${isExp ? `
                                                        <div class="p-2.5 pt-0 border-t border-white/10 space-y-2 text-[10px] font-mono text-gray-300 bg-black/20">
                                                            <div class="flex items-center justify-between text-[9px] pt-2 text-gray-400">
                                                                <span>📁 Grupo: <strong>${grp ? grp.emoji + ' ' + grp.title : 'Geral'}</strong></span>
                                                                <span class="px-1.5 py-0.5 rounded bg-purple-500/20 text-purple-300 font-bold uppercase text-[8px]">${r.reminder_type || 'one_time'}</span>
                                                            </div>
                                                            ${r.notes ? `<p class="text-[9px] text-gray-300 bg-white/[0.03] p-1.5 rounded-lg border border-white/5 leading-relaxed">${r.notes}</p>` : ''}

                                                            <div class="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                                                                <button type="button" onclick="window.ControlEngine.testReminderAlarm('${r.id}')" class="px-2 py-1 rounded-lg bg-purple-500/20 hover:bg-purple-500/35 text-purple-200 font-bold text-[9px] cursor-pointer transition flex items-center gap-1" title="Testar Alarme">
                                                                    <span>🔔</span> <span>Alarme</span>
                                                                </button>
                                                                <div class="flex items-center gap-1">
                                                                    <button type="button" onclick="window.ControlEngine.openEditReminderModal('${r.id}')" class="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 font-bold text-[9px] cursor-pointer transition flex items-center gap-1" title="Editar Lembrete">
                                                                        <span>✏️</span> <span>Editar</span>
                                                                    </button>
                                                                    <button type="button" onclick="window.ControlEngine.deleteReminder('${r.id}')" class="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 font-bold text-[9px] cursor-pointer transition flex items-center gap-1" title="Excluir Lembrete">
                                                                        <span>🗑️</span> <span>Excluir</span>
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    ` : ''}
                                                </div>
                                            `;
                                        })
                                    ].join('')
                            }
                        </div>
                    </div>

                    <button type="button" onclick="window.ControlEngine.openNewReminderModal()" class="text-[9px] font-mono text-purple-300/80 hover:text-purple-200 flex items-center justify-center gap-1 pt-1.5 hover:underline cursor-pointer">
                        <span>➕ Novo Lembrete</span>
                    </button>
                </div>

                <!-- 4. ROTINA DE ESTUDOS (STUD) [NOVO NA VISÃO 360°] -->
                <div class="p-3.5 rounded-2xl bg-white/[0.03] space-y-2.5 flex flex-col justify-between shadow-lg backdrop-blur-md w-full max-w-full overflow-hidden box-border" style="border: 1px solid ${studyColor}45; box-shadow: 0 8px 30px ${studyColor}12;">
                    <div>
                        <div class="flex items-center justify-between border-b border-white/10 pb-1.5">
                            <span class="text-[11px] font-mono font-bold text-sky-300 flex items-center gap-1">
                                <span>🌐</span> <span>Rotina de Estudos (${dayStudies.length})</span>
                            </span>
                            <span class="text-[9px] font-mono px-2 py-0.5 rounded-full bg-sky-500/20 text-sky-300 border border-sky-500/40 font-bold">
                                ${dayOfWeekCode}
                            </span>
                        </div>

                        <div class="space-y-2 max-h-56 overflow-y-auto pr-1 pt-1.5">
                            ${
                                dayStudies.length === 0
                                    ? `<div class="text-[10px] font-mono text-gray-400 p-2.5 rounded-xl bg-white/[0.02] italic">Nenhuma matéria agendada para ${weekdayName}.</div>`
                                    : dayStudies.map(sb => {
                                        const itemId = `study_${sb.id}`;
                                        const isExp = expanded360ItemIds.has(itemId);
                                        return `
                                            <div class="rounded-xl border border-sky-500/30 bg-sky-950/25 transition-all duration-300 overflow-hidden">
                                                <div onclick="window.ControlEngine.toggle360ItemExpansion('${itemId}')" class="p-2.5 flex items-center justify-between gap-1.5 cursor-pointer hover:bg-white/[0.04] select-none">
                                                    <div class="flex items-center gap-1.5 min-w-0">
                                                        <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background: ${sb.color || '#0ea5e9'}; box-shadow: 0 0 6px ${sb.color || '#0ea5e9'};"></span>
                                                        <span class="font-bold text-sky-100 text-[11px] truncate">${escapeHtml(sb.title)}</span>
                                                    </div>
                                                    <div class="flex items-center gap-1.5 shrink-0">
                                                        <span class="text-[9px] text-sky-300 font-bold px-1.5 py-0.5 rounded bg-sky-500/20">${sb.start_time || '08:30'} - ${sb.end_time || '13:30'}</span>
                                                        <span class="text-[9px] text-gray-400 transition-transform duration-300 ${isExp ? 'rotate-180' : ''}">▼</span>
                                                    </div>
                                                </div>

                                                ${isExp ? `
                                                    <div class="p-2.5 pt-0 border-t border-white/10 space-y-2 text-[10px] font-mono text-gray-300 bg-black/20">
                                                        <div class="flex items-center justify-between text-[9px] pt-2 text-gray-400">
                                                            <span>🏷️ Tag: <strong>${escapeHtml(sb.tag || sb.title)}</strong></span>
                                                            <span class="text-sky-300 font-bold">Google Prefix: STUD:</span>
                                                        </div>
                                                        ${sb.notes ? `<p class="text-[9px] text-gray-300 bg-white/[0.03] p-1.5 rounded-lg border border-white/5 leading-relaxed">${escapeHtml(sb.notes)}</p>` : ''}

                                                        <div class="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                                                            <button type="button" onclick="window.ControlEngine.syncStudyBlockToGoogleCalendar('${sb.id}', '${dateStr}')" class="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 text-[9px] font-bold cursor-pointer transition flex items-center gap-1" title="Enviar matéria ao Google Agenda">
                                                                <span>📅</span> <span>Google Agenda</span>
                                                            </button>
                                                            <button type="button" onclick="window.ControlEngine.openEditStudyBlockModal('${sb.id}')" class="px-2 py-1 rounded-lg bg-white/10 hover:bg-white/20 text-gray-200 font-bold text-[9px] cursor-pointer transition flex items-center gap-1" title="Editar Bloco de Estudo">
                                                                <span>✏️</span> <span>Editar</span>
                                                            </button>
                                                        </div>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `;
                                    }).join('')
                            }
                        </div>
                    </div>

                    <button type="button" onclick="window.ControlEngine.openNewStudyBlockModal('${dayOfWeekCode}', '08:30', '13:30')" class="text-[9px] font-mono text-sky-300/80 hover:text-sky-200 flex items-center justify-center gap-1 pt-1.5 hover:underline cursor-pointer">
                        <span>➕ Adicionar Matéria de Estudo</span>
                    </button>
                </div>

                <!-- 5. DIÁRIO PESSOAL & NOTAS (DIARY VAULT INTEGRATION) -->
                <div class="p-3.5 rounded-2xl bg-white/[0.03] space-y-2.5 flex flex-col justify-between shadow-lg backdrop-blur-md w-full max-w-full overflow-hidden box-border" style="border: 1px solid ${diaryColor}45; box-shadow: 0 8px 30px ${diaryColor}12;">
                    <div>
                        <div class="flex items-center justify-between border-b border-white/10 pb-1.5">
                            <span class="text-[11px] font-mono font-bold text-pink-300 flex items-center gap-1">
                                <span>📖</span> <span>Diário & Notas (${dayDiaryEntries.length})</span>
                            </span>
                            <span class="text-[9px] font-mono text-gray-400">
                                ${dayDiaryEntries.reduce((acc, cur) => acc + (cur.word_count || 0), 0)} palavras
                            </span>
                        </div>

                        <div class="space-y-2 max-h-56 overflow-y-auto pr-1 pt-1.5">
                            ${
                                dayDiaryEntries.length === 0
                                    ? `<div class="text-[10px] font-mono text-gray-400 p-2.5 rounded-xl bg-white/[0.02] italic">Nenhuma anotação registrada nesta data.</div>`
                                    : dayDiaryEntries.map(entry => {
                                        const itemId = `diary_${entry.id}`;
                                        const isExp = expanded360ItemIds.has(itemId);
                                        return `
                                            <div class="rounded-xl border border-pink-500/30 bg-pink-950/25 transition-all duration-300 overflow-hidden">
                                                <div onclick="window.ControlEngine.toggle360ItemExpansion('${itemId}')" class="p-2.5 flex items-center justify-between gap-1.5 cursor-pointer hover:bg-white/[0.04] select-none">
                                                    <div class="flex items-center gap-1.5 min-w-0">
                                                        <span class="text-sm">${entry.mood === 'happy' ? '😊' : entry.mood === 'focused' ? '⚡' : entry.mood === 'zen' ? '🧘' : '📝'}</span>
                                                        <span class="font-bold text-pink-100 text-[11px] truncate">${entry.title_preview || 'Anotação sem título'}</span>
                                                    </div>
                                                    <div class="flex items-center gap-1.5 shrink-0">
                                                        <span class="text-[9px] text-pink-300 font-bold px-1.5 py-0.5 rounded bg-pink-500/20">${entry.folder || 'journal'}</span>
                                                        <span class="text-[9px] text-gray-400 transition-transform duration-300 ${isExp ? 'rotate-180' : ''}">▼</span>
                                                    </div>
                                                </div>

                                                ${isExp ? `
                                                    <div class="p-2.5 pt-0 border-t border-white/10 space-y-2 text-[10px] font-mono text-gray-300 bg-black/20">
                                                        <div class="flex items-center justify-between text-[9px] pt-2 text-gray-400">
                                                            <span>📊 ${entry.word_count || 0} palavras</span>
                                                            <span>🔒 Protegido / Vault</span>
                                                        </div>
                                                        ${entry.preview ? `<p class="text-[9px] text-gray-300 bg-white/[0.03] p-1.5 rounded-lg border border-white/5 leading-relaxed line-clamp-3">${entry.preview}</p>` : ''}

                                                        <div class="flex items-center justify-between gap-1 pt-1 border-t border-white/10">
                                                            <a href="diary.html" target="_self" class="px-2 py-1 rounded-lg bg-pink-500/20 hover:bg-pink-500/35 text-pink-200 text-[9px] font-bold transition flex items-center gap-1">
                                                                <span>📖</span> <span>Abrir Diário</span>
                                                            </a>
                                                            <div class="flex items-center gap-1">
                                                                <a href="diary.html" target="_self" class="px-2 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 text-sky-200 font-bold text-[9px] transition flex items-center gap-1" title="Editar no Diário">
                                                                    <span>✏️</span> <span>Editar</span>
                                                                </a>
                                                                <button type="button" onclick="window.ControlEngine.deleteDiaryEntryFrom360('${entry.id}')" class="px-2 py-1 rounded-lg bg-rose-500/20 hover:bg-rose-500/35 text-rose-200 font-bold text-[9px] cursor-pointer transition flex items-center gap-1" title="Excluir Anotação">
                                                                    <span>🗑️</span> <span>Excluir</span>
                                                                </button>
                                                            </div>
                                                        </div>
                                                    </div>
                                                ` : ''}
                                            </div>
                                        `;
                                    }).join('')
                            }
                        </div>
                    </div>

                    <a href="diary.html" target="_blank" class="text-[9px] font-mono text-pink-300/80 hover:text-pink-200 flex items-center justify-center gap-1 pt-1.5 hover:underline">
                        <span>✍️ Escrever no Diário Pessoal</span>
                    </a>
                </div>

            </div>
        `;

        detailsContainer.innerHTML = html;
    }

    
    // =========================================================================
    // SINCRONIZAÇÃO AUTOMÁTICA COM GOOGLE AGENDA: ESTUDOS E TAREFAS
    // =========================================================================

    async function syncStudyBlockToGoogleCalendar(blockId, dateStr) {
        const block = studyBlocks.find(b => b.id === blockId);
        if (!block) return;

        const targetDate = dateStr || formatISODate(getBrasiliaDate());
        const title = `STUD: ${block.title}`;
        const description = `📚 ROTINA DE ESTUDOS — PERSONAL OS\n\n• Disciplina: ${block.title}\n• Tag: ${block.tag || 'Estudo'}\n• Horário Programado: ${block.start_time || '08:30'} às ${block.end_time || '13:30'}\n${block.notes ? '• Observações: ' + block.notes : ''}`;

        const studyAccent = block.color || getSessionColor('studies');
        const gcalColorId = getClosestGoogleColorId(studyAccent);

        const res = await createGoogleCalendarEvent({
            title: title,
            description: description,
            date: targetDate,
            time: block.start_time || '08:30',
            endTime: block.end_time || '13:30',
            colorId: gcalColorId
        });

        if (window.showToast) {
            window.showToast(`✓ Estudo "${block.title}" sincronizado com o Google Agenda!`);
        }
        return res;
    }

    async function syncEntireDayToGoogleCalendar(dateStr) {
        if (!dateStr) dateStr = formatISODate(getBrasiliaDate());
        let dateObj;
        try {
            const parts = dateStr.split('-');
            dateObj = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
        } catch (e) {
            dateObj = getBrasiliaDate();
        }
        const dayOfWeekCode = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'][dateObj.getDay()];

        const dayStudies = studyBlocks.filter(b => b.is_active !== false && b.day_of_week === dayOfWeekCode);
        const dayTodos = todosList.filter(t => t.due_date === dateStr);
        const dayReminders = remindersList.filter(r => r.is_active && (r.target_date === dateStr || r.reminder_type === 'daily'));

        let syncedCount = 0;

        // 1. Sincroniza Estudos
        for (const sb of dayStudies) {
            await syncStudyBlockToGoogleCalendar(sb.id, dateStr);
            syncedCount++;
        }

        // 2. Sincroniza Tarefas do dia
        for (const t of dayTodos) {
            await createGoogleCalendarEvent({
                title: `TASK: ${t.title}`,
                description: `🟢 TAREFA PERSONAL OS\n\nPrioridade: ${(t.priority || 'normal').toUpperCase()}\n${t.description ? 'Detalhes: ' + t.description : ''}`,
                date: dateStr,
                time: t.due_time || '10:00',
                endTime: '10:30',
                colorId: '2' // Sage / Verde
            });
            syncedCount++;
        }

        // 4. Sincroniza Lembretes do dia
        for (const r of dayReminders) {
            await createGoogleCalendarEvent({
                title: `REMINDER: ${r.title}`,
                description: `🟣 LEMBRETE PERSONAL OS\n\nHorário: ${r.target_time || '08:00'}\n${r.notes ? 'Notas: ' + r.notes : ''}`,
                date: dateStr,
                time: r.target_time || '08:00',
                endTime: '08:15',
                colorId: '3' // Grape / Roxo
            });
            syncedCount++;
        }

        if (window.showToast) {
            window.showToast(`🚀 ${syncedCount} itens do dia foram sincronizados com o Google Agenda!`);
        }
    }

    function getGCalProxyBaseUrl() {
        const isApkOrTauri = window.location.hostname === 'tauri.localhost' || 
                             window.location.protocol === 'tauri:' || 
                             typeof window.AndroidBridge !== 'undefined' ||
                             window.location.hostname === 'localhost' ||
                             window.location.hostname === '127.0.0.1';
        return isApkOrTauri 
            ? 'https://m-c-p-os-personal-os-1.vercel.app/api/gcal' 
            : '/api/gcal';
    }

    /**
     * Renovação Automática e Perpétua do Token Google Calendar (ultra rápido e sem bloquear)
     */
    async function refreshGoogleCalendarToken() {
        try {
            const refreshToken = (googleCalendarSettings && googleCalendarSettings.refresh_token) || 'demo_gcal_refresh_token_placeholder';
            if (!refreshToken) return false;

            console.log('[GCAL] Renovando access_token do Google Agenda...');
            let newAccessToken = null;
            let expiresIn = 3600;

            // 1. Tenta direto com Google OAuth2 Token Endpoint (ultra rápido ~200ms)
            try {
                const dRes = await fetch('https://oauth2.googleapis.com/token', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
                    body: new URLSearchParams({
                        client_id: googleCalendarSettings.client_id || GOOGLE_CLIENT_ID,
                        client_secret: 'demo_gcal_client_secret_placeholder',
                        refresh_token: refreshToken,
                        grant_type: 'refresh_token'
                    })
                });
                if (dRes.ok) {
                    const dData = await dRes.json();
                    if (dData && dData.access_token) {
                        newAccessToken = dData.access_token;
                        if (dData.expires_in) expiresIn = dData.expires_in;
                    }
                }
            } catch (de) {
                console.warn('[GCAL] Direct refresh falhou, tentando fallback proxy:', de);
            }

            // 2. Se falhar ou estiver em ambiente web com restrição, tenta via proxy Serverless Vercel
            if (!newAccessToken) {
                try {
                    const refreshProxyUrl = getGCalProxyBaseUrl() + '?action=refresh';
                    const pRes = await fetch(refreshProxyUrl, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            client_id: googleCalendarSettings.client_id || GOOGLE_CLIENT_ID,
                            refresh_token: refreshToken
                        })
                    });
                    if (pRes.ok) {
                        const pData = await pRes.json();
                        if (pData && pData.access_token) {
                            newAccessToken = pData.access_token;
                            if (pData.expires_in) expiresIn = pData.expires_in;
                        }
                    }
                } catch (e) {
                    console.warn('[GCAL] Proxy refresh falhou:', e);
                }
            }

            if (newAccessToken) {
                googleCalendarSettings.access_token = newAccessToken;
                googleCalendarSettings.token_expires_at = Date.now() + (expiresIn * 1000);
                googleCalendarSettings.refresh_token = refreshToken;
                googleCalendarSettings.last_synced_at = new Date().toISOString();
                saveLocalStorageBackup();

                // Atualiza em nuvem no Supabase de forma assíncrona (não bloqueia UI nem requisições)
                (async () => {
                    try {
                        const client = getSupabase();
                        if (client) {
                            const { data: cur } = await client.from('control_email_settings').select('settings').eq('id', 'default_settings').maybeSingle();
                            const s = (cur && cur.settings) || {};
                            s.google_calendar_settings = { ...googleCalendarSettings };
                            await client.from('control_email_settings').update({ settings: s }).eq('id', 'default_settings');
                        }
                    } catch (supErr) {
                        console.warn('[GCAL] Erro ao salvar novo token no Supabase:', supErr);
                    }
                })();

                console.log('[GCAL] ✓ Token Google Agenda renovado com sucesso!');
                return true;
            }
            return false;
        } catch (err) {
            console.error('[GCAL] Erro ao renovar token:', err);
            return false;
        }
    }

    async function fetchGCalEventsViaProxyOrDirect(timeMin, timeMax, accessToken) {
        // 1. Tenta direto na Google API v3 (ultra rápido ~300ms, sem proxy overhead)
        try {
            const directUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events' +
                '?timeMin=' + encodeURIComponent(timeMin) +
                '&timeMax=' + encodeURIComponent(timeMax) +
                '&singleEvents=true&orderBy=startTime&maxResults=250';
            const directRes = await fetch(directUrl, {
                headers: { 'Authorization': 'Bearer ' + accessToken }
            });
            if (directRes.ok) return await directRes.json();
            if (directRes.status === 401 || directRes.status === 403) {
                let errBody = {};
                try { errBody = await directRes.json(); } catch(e){}
                throw { status: directRes.status, message: errBody?.error?.message || directRes.statusText };
            }
        } catch (directErr) {
            if (directErr && (directErr.status === 401 || directErr.status === 403)) throw directErr;
            console.warn('[GCAL] Chamada direta falhou, tentando fallback via proxy:', directErr);
        }

        // 2. Fallback via proxy serverless Vercel
        const apiUrl = getGCalProxyBaseUrl() + '?action=events' +
            '&timeMin=' + encodeURIComponent(timeMin) +
            '&timeMax=' + encodeURIComponent(timeMax);
        const res = await fetch(apiUrl, {
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        if (res.ok) return await res.json();
        let errBody = {};
        try { errBody = await res.json(); } catch(e){}
        throw { status: res.status, message: errBody?.error?.message || res.statusText };
    }

    async function postGCalEventViaProxyOrDirect(payload, accessToken) {
        // 1. Tenta direto na Google API v3
        try {
            const directUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events';
            const directRes = await fetch(directUrl, {
                method: 'POST',
                headers: {
                    'Authorization': 'Bearer ' + accessToken,
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });
            if (directRes.ok) return await directRes.json();
            if (directRes.status === 401 || directRes.status === 403) {
                let errBody = {};
                try { errBody = await directRes.json(); } catch(e){}
                throw { status: directRes.status, message: errBody?.error?.message || directRes.statusText };
            }
        } catch (directErr) {
            if (directErr && (directErr.status === 401 || directErr.status === 403)) throw directErr;
            console.warn('[GCAL] Chamada direta create falhou, tentando fallback via proxy:', directErr);
        }

        // 2. Fallback via proxy serverless Vercel
        const apiUrl = getGCalProxyBaseUrl() + '?action=create';
        const res = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Authorization': 'Bearer ' + accessToken,
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(payload)
        });
        if (res.ok) return await res.json();
        let errBody = {};
        try { errBody = await res.json(); } catch(e){}
        throw { status: res.status, message: errBody?.error?.message || res.statusText };
    }

    async function deleteGCalEventViaProxyOrDirect(eventId, accessToken) {
        try {
            const apiUrl = getGCalProxyBaseUrl() + '?action=delete&eventId=' + encodeURIComponent(eventId);
            const res = await fetch(apiUrl, {
                method: 'DELETE',
                headers: { 'Authorization': 'Bearer ' + accessToken }
            });
            if (res.ok) return true;
        } catch (proxyErr) {
            console.warn('[GCAL] Proxy delete falhou, tentando Google API direta:', proxyErr);
        }

        const directUrl = 'https://www.googleapis.com/calendar/v3/calendars/primary/events/' + encodeURIComponent(eventId);
        const directRes = await fetch(directUrl, {
            method: 'DELETE',
            headers: { 'Authorization': 'Bearer ' + accessToken }
        });
        return directRes.ok;
    }

    function openGoogleCalendarConnectModal() {
        try {
            const inputUrl = document.getElementById('gcal-ical-url');
            const inputApiKey = document.getElementById('gcal-api-key');
            const inputClientId = document.getElementById('gcal-client-id');
            const inputRedirectUri = document.getElementById('gcal-redirect-uri');
            const inputToken = document.getElementById('gcal-access-token');
            const checkAutoSync = document.getElementById('gcal-auto-sync');
            const statusText = document.getElementById('modal-gcal-status-text');

            if (inputUrl) inputUrl.value = (googleCalendarSettings && googleCalendarSettings.ical_url) || '';
            if (inputApiKey) inputApiKey.value = (googleCalendarSettings && googleCalendarSettings.api_key) || '';
            if (inputClientId) inputClientId.value = (googleCalendarSettings && googleCalendarSettings.client_id) || GOOGLE_CLIENT_ID;
            if (inputRedirectUri) inputRedirectUri.value = (googleCalendarSettings && googleCalendarSettings.redirect_uri) || 'https://m-c-p-personal-os.vercel.app/oauth.html';
            if (inputToken) inputToken.value = (googleCalendarSettings && googleCalendarSettings.access_token) || '';
            if (checkAutoSync) checkAutoSync.checked = !googleCalendarSettings || googleCalendarSettings.auto_sync !== false;

            const eventsCount = Array.isArray(googleEventsList) ? googleEventsList.length : 0;
            const isConnected = !!(googleCalendarSettings && (googleCalendarSettings.access_token || googleCalendarSettings.ical_url || eventsCount > 0));
            if (statusText) {
                statusText.innerHTML = isConnected 
                    ? `<span class="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span> <span class="text-emerald-300 font-bold">Conectado (${eventsCount} eventos sincronizados)</span>`
                    : `<span class="w-2.5 h-2.5 rounded-full bg-gray-400"></span> <span>Não Conectado</span>`;
            }

            const modal = document.getElementById('control-google-calendar-modal');
            if (modal) {
                modal.classList.remove('hidden');
                modal.style.display = 'flex';
                modal.style.opacity = '1';
                modal.style.visibility = 'visible';
                modal.style.zIndex = '99999';
            } else {
                console.warn('Modal #control-google-calendar-modal não encontrado no DOM');
                if (window.showToast) window.showToast('Modal da Agenda não encontrado');
            }
        } catch(err) {
            console.error('Erro ao abrir modal Google Calendar:', err);
            if (window.showToast) window.showToast('Erro ao abrir modal: ' + err.message);
        }
    }

    function closeGoogleCalendarConnectModal() {
        try {
            const modal = document.getElementById('control-google-calendar-modal');
            if (modal) {
                modal.classList.add('hidden');
                modal.style.display = 'none';
            }
        } catch(e) {}
    }

    async function pullGCalSettingsFromCloud() {
        try {
            if (window.showToast) window.showToast('☁️ Buscando configurações do Google Agenda na nuvem...');
            const client = getSupabase();
            if (!client) {
                if (window.showToast) window.showToast('Supabase indisponível no momento.');
                return;
            }
            const { data, error } = await client.from('control_email_settings').select('settings').eq('id', 'default_settings').maybeSingle();
            if (error) throw error;
            if (data && data.settings && data.settings.google_calendar_settings) {
                googleCalendarSettings = { ...googleCalendarSettings, ...data.settings.google_calendar_settings };
                saveLocalStorageBackup();
                openGoogleCalendarConnectModal();
                if (window.showToast) window.showToast('✓ Google Agenda sincronizado da nuvem!');
                await syncGoogleCalendar();
            } else {
                if (window.showToast) window.showToast('Nenhuma configuração do Google Agenda encontrada na nuvem.');
            }
        } catch (e) {
            console.error('Erro ao buscar settings do Google Agenda da nuvem:', e);
            if (window.showToast) window.showToast('Erro ao puxar da nuvem: ' + e.message);
        }
    }

    async function saveGoogleCalendarSettings(e) {
        if (e) e.preventDefault();
        const inputUrl = document.getElementById('gcal-ical-url');
        const inputApiKey = document.getElementById('gcal-api-key');
        const inputClientId = document.getElementById('gcal-client-id');
        const inputRedirectUri = document.getElementById('gcal-redirect-uri');
        const inputToken = document.getElementById('gcal-access-token');
        const checkAutoSync = document.getElementById('gcal-auto-sync');

        googleCalendarSettings.ical_url = inputUrl ? inputUrl.value.trim() : '';
        googleCalendarSettings.api_key = inputApiKey ? inputApiKey.value.trim() : '';
        googleCalendarSettings.client_id = inputClientId ? inputClientId.value.trim() : GOOGLE_CLIENT_ID;
        googleCalendarSettings.redirect_uri = inputRedirectUri ? inputRedirectUri.value.trim() : '';
        if (inputToken && inputToken.value.trim()) {
            googleCalendarSettings.access_token = inputToken.value.trim();
            if (!googleCalendarSettings.token_expires_at || Date.now() > googleCalendarSettings.token_expires_at) {
                googleCalendarSettings.token_expires_at = Date.now() + 3600 * 1000;
            }
        }
        googleCalendarSettings.auto_sync = checkAutoSync ? checkAutoSync.checked : true;
        googleCalendarSettings.last_synced_at = new Date().toISOString();

        saveLocalStorageBackup();

        // Sincroniza configurações no Supabase para compartilhar entre Web e APK Mobile
        try {
            const client = getSupabase();
            if (client) {
                const { data: curData } = await client.from('control_email_settings').select('settings').eq('id', 'default_settings').maybeSingle();
                const curSettings = (curData && curData.settings) || {};
                await client.from('control_email_settings').update({
                    settings: {
                        ...curSettings,
                        google_calendar_settings: googleCalendarSettings
                    }
                }).eq('id', 'default_settings');
            }
        } catch (supErr) {
            console.warn('[GCAL] Falha ao persistir settings no Supabase:', supErr);
        }

        closeGoogleCalendarConnectModal();
        await syncGoogleCalendar();
        if (window.showToast) window.showToast('✓ Configurações do Google Agenda salvas com sucesso!');
    }

    /**
     * Autenticação Oficial do Google Calendar via OAuth 2.0 com /oauth.html como redirect_uri dedicado.
     * Suporta Android Nativo (abertura segura no navegador do sistema), Tauri Desktop e Web.
     */
    let cloudPollingInterval = null;

    function startCloudAuthPolling() {
        if (cloudPollingInterval) clearInterval(cloudPollingInterval);
        let attempts = 0;
        cloudPollingInterval = setInterval(async () => {
            attempts++;
            if (attempts > 40 || (googleCalendarSettings.access_token && googleCalendarSettings.token_expires_at > Date.now())) {
                clearInterval(cloudPollingInterval);
                cloudPollingInterval = null;
                return;
            }
            await checkPendingCloudAuth();
        }, 2000);
    }

    let isCheckingCloudAuth = false;
    async function checkPendingCloudAuth() {
        if (isCheckingCloudAuth) return;
        try {
            isCheckingCloudAuth = true;
            const client = getSupabase();
            if (!client) return;

            const { data } = await client.from('control_email_settings').select('settings').eq('id', 'default_settings').maybeSingle();
            if (data && data.settings && data.settings.google_calendar_settings) {
                const cloudSettings = data.settings.google_calendar_settings;
                let hasUpdate = false;

                if (cloudSettings.access_token && cloudSettings.access_token !== googleCalendarSettings.access_token) {
                    if (!cloudSettings.token_expires_at || Date.now() < cloudSettings.token_expires_at) {
                        googleCalendarSettings = { ...googleCalendarSettings, ...cloudSettings };
                        hasUpdate = true;
                    }
                } else if (cloudSettings.ical_url && cloudSettings.ical_url !== googleCalendarSettings.ical_url) {
                    googleCalendarSettings.ical_url = cloudSettings.ical_url;
                    hasUpdate = true;
                }

                if (hasUpdate) {
                    saveLocalStorageBackup();
                    closeGoogleCalendarConnectModal();
                    if (window.showToast) window.showToast('✓ Google Agenda conectado e sincronizado via nuvem!');
                    await syncGoogleCalendar(true);
                }
            }
        } catch (e) {
            console.warn('[GCAL CLOUD CHECK] Falha ao verificar nuvem:', e);
        } finally {
            isCheckingCloudAuth = false;
        }
    }

    function handleDeepLinkOAuth(urlStr) {
        if (!urlStr) return;
        try {
            console.log('[DEEP LINK OAUTH] Recebida URI de retorno:', urlStr);
            let token = null;
            let expiresIn = 3600;

            if (urlStr.includes('#')) {
                const hashPart = urlStr.split('#')[1];
                const params = new URLSearchParams(hashPart);
                token = params.get('access_token');
                if (params.get('expires_in')) expiresIn = parseInt(params.get('expires_in'), 10);
            } else if (urlStr.includes('?')) {
                const queryPart = urlStr.split('?')[1];
                const params = new URLSearchParams(queryPart);
                token = params.get('access_token');
                if (params.get('expires_in')) expiresIn = parseInt(params.get('expires_in'), 10);
            }

            if (token) {
                googleCalendarSettings.access_token = token;
                googleCalendarSettings.token_expires_at = Date.now() + expiresIn * 1000;
                googleCalendarSettings.last_synced_at = new Date().toISOString();
                saveLocalStorageBackup();
                closeGoogleCalendarConnectModal();
                if (window.showToast) window.showToast('✓ Google Agenda conectado com sucesso via App Link!');
                syncGoogleCalendar();
            }
        } catch (e) {
            console.error('[DEEP LINK OAUTH] Erro ao processar retorno:', e);
        }
    }

    async function testOrAuthGoogle() {
        const inputClientId = document.getElementById('gcal-client-id');
        const inputRedirect = document.getElementById('gcal-redirect-uri');
        const clientId = (inputClientId && inputClientId.value.trim() ? inputClientId.value.trim() : (googleCalendarSettings.client_id || GOOGLE_CLIENT_ID || '')).trim();
        if (!clientId) {
            if (window.glassAlert) window.glassAlert('Por favor, informe o Google Client ID nas configurações.', 'Google Agenda', '⚠️'); else alert('Por favor, informe o Google Client ID nas configurações.');
            return;
        }

        const isApkOrTauri = window.location.hostname === 'tauri.localhost' || 
                             window.location.protocol === 'tauri:' || 
                             typeof window.AndroidBridge !== 'undefined';
        const origin = isApkOrTauri ? 'https://m-c-p-personal-os.vercel.app' : window.location.origin;
        const redirectUri = (inputRedirect && inputRedirect.value.trim()) || googleCalendarSettings.redirect_uri || (origin + '/oauth.html');
        const scope = 'https://www.googleapis.com/auth/calendar.events https://www.googleapis.com/auth/calendar.readonly';
        
        const oauthUrl = 'https://accounts.google.com/o/oauth2/v2/auth?' +
            'client_id=' + encodeURIComponent(clientId) +
            '&redirect_uri=' + encodeURIComponent(redirectUri) +
            '&response_type=token' +
            '&scope=' + encodeURIComponent(scope) +
            '&include_granted_scopes=true' +
            '&prompt=consent';

        // 1. Android Nativo (APK) — Abre no Navegador Padrão do Sistema (Chrome/Samsung Internet)
        if (typeof window.AndroidBridge !== 'undefined' && typeof window.AndroidBridge.openExternalUrl === 'function') {
            if (window.showToast) window.showToast('🔑 Abrindo navegador seguro para conectar Google Agenda...');
            window.AndroidBridge.openExternalUrl(oauthUrl);
            startCloudAuthPolling();
            return;
        }

        // 2. Tauri Desktop
        if (window.__TAURI__ && window.__TAURI__.shell && typeof window.__TAURI__.shell.open === 'function') {
            if (window.showToast) window.showToast('🔑 Abrindo navegador para autorização...');
            window.__TAURI__.shell.open(oauthUrl);
            startCloudAuthPolling();
            return;
        }

        // 3. Web Desktop / Mobile Browser
        if (window.showToast) window.showToast('🔑 Abrindo janela de autorização do Google...');

        const popupWidth = 550;
        const popupHeight = 650;
        const left = Math.max(0, (window.screen.width / 2) - (popupWidth / 2));
        const top = Math.max(0, (window.screen.height / 2) - (popupHeight / 2));

        let authWindow = null;
        try {
            authWindow = window.open(
                oauthUrl,
                'MCPGoogleAuth',
                'width=' + popupWidth + ',height=' + popupHeight + ',top=' + top + ',left=' + left + ',scrollbars=yes'
            );
        } catch (e) {}

        if (!authWindow || authWindow.closed || typeof authWindow.closed === 'undefined') {
            window.location.href = oauthUrl;
        }
    }

    function setGCalQuickConfig(type) {
        const inputClientId = document.getElementById('gcal-client-id');
        const inputRedirect = document.getElementById('gcal-redirect-uri');
        if (!inputClientId || !inputRedirect) return;

        if (type === 'api-agenda') {
            inputClientId.value = 'demo-client-id.apps.googleusercontent.com';
            inputRedirect.value = 'https://m-c-p-personal-os.vercel.app/oauth.html';
            googleCalendarSettings.client_id = inputClientId.value;
            googleCalendarSettings.redirect_uri = inputRedirect.value;
            if (window.showToast) window.showToast('✅ Preset Google Cloud (api-agenda) carregado!');
        } else if (type === 'api-agenda-local') {
            inputClientId.value = 'demo-client-id.apps.googleusercontent.com';
            inputRedirect.value = 'http://localhost';
            googleCalendarSettings.client_id = inputClientId.value;
            googleCalendarSettings.redirect_uri = inputRedirect.value;
            if (window.showToast) window.showToast('✅ Preset Google Cloud (Localhost) carregado!');
        } else if (type === 'vercel-web') {
            inputClientId.value = 'demo-client-id.apps.googleusercontent.com';
            inputRedirect.value = 'https://m-c-p-personal-os.vercel.app/oauth.html';
            googleCalendarSettings.client_id = inputClientId.value;
            googleCalendarSettings.redirect_uri = inputRedirect.value;
            if (window.showToast) window.showToast('✅ Preset Vercel Web carregado!');
        } else if (type === 'keychain-gemini') {
            inputClientId.value = '1071006060591-tmhssin2h21lcre235vtolojh4g403ep.apps.googleusercontent.com';
            inputRedirect.value = 'https://m-c-p-personal-os.vercel.app/oauth.html';
            googleCalendarSettings.client_id = inputClientId.value;
            googleCalendarSettings.redirect_uri = inputRedirect.value;
            if (window.showToast) window.showToast('✅ Preset Keychain Google carregado!');
        }
        saveLocalStorageBackup();
    }

    function copyAndroidGoogleCloudInfo() {
        const text = `Package Name: com.mateuscelestino.personalos\nSHA-1: F3:4F:B6:A5:E9:92:C2:C6:F2:F3:07:EC:14:93:02:4B:A2:15:38:3D\nSHA-256: 08:24:DE:89:31:9B:97:7C:2B:29:B5:E5:0B:34:52:AD:CF:83:46:03:75:AD:6F:62:31:4A:D8:30:D8:04:2E:4A\nRedirect URIs:\n- https://m-c-p-personal-os.vercel.app/oauth.html\n- http://localhost`;
        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(text).then(() => {
                if (window.showToast) window.showToast('📋 Credenciais Android copiadas com sucesso!');
            }).catch(() => {
                prompt('Copie os dados para o Google Cloud Console:', text);
            });
        } else {
            prompt('Copie os dados para o Google Cloud Console:', text);
        }
    }

    async function disconnectGoogleCalendar() {
        const confirmed = window.glassConfirm ? await window.glassConfirm('Deseja desconectar sua conta Google Agenda do PERSONAL OS?', 'Desconectar Google Agenda', 'Desconectar', 'Cancelar', true, '🔌') : confirm('Deseja desconectar sua conta Google Agenda do PERSONAL OS?');
        if (!confirmed) return;
        googleCalendarSettings.access_token = null;
        googleCalendarSettings.token_expires_at = null;
        googleEventsList = [];
        saveLocalStorageBackup();
        // Remove do Supabase
        try {
            const client = getSupabase();
            if (client) {
                const { data: curData } = await client.from('control_email_settings').select('settings').eq('id', 'default_settings').maybeSingle();
                const curSettings = (curData && curData.settings) || {};
                curSettings.google_calendar_settings = googleCalendarSettings;
                await client.from('control_email_settings').update({ settings: curSettings }).eq('id', 'default_settings');
            }
        } catch(e) {}
        renderControlCalendar();
        if (window.showToast) window.showToast('Conta Google desconectada.');
        openGoogleCalendarConnectModal();
    }

    let isGCalSyncInProgress = false;

    /**
     * Sincronização com Google Calendar API v3 — com suporte a isSilent para auto-sync rápido
     */
    async function syncGoogleCalendar(isSilent = false) {
        if (isGCalSyncInProgress) {
            console.log('[GCAL] Sincronização já em andamento, ignorando chamada redundante.');
            return;
        }
        isGCalSyncInProgress = true;
        try {
            if (!isSilent && window.showToast) window.showToast('🔄 Sincronizando com o Google Agenda...');

        const badge = document.getElementById('google-sync-status-badge');
        let fetchedEvents = [];
        let apiError = null;

        // 1. Auto-renovação de Token: Se expirou, vai expirar em < 2min, ou não tem token mas tem refresh_token
        const isExpiring = googleCalendarSettings.token_expires_at && (Date.now() > (googleCalendarSettings.token_expires_at - 120000));
        const needsToken = !googleCalendarSettings.access_token && googleCalendarSettings.refresh_token;
        if (isExpiring || needsToken) {
            await refreshGoogleCalendarToken();
        }

        // Verifica se ainda está expirado e sem refresh_token
        if (googleCalendarSettings.access_token && googleCalendarSettings.token_expires_at) {
            if (Date.now() > googleCalendarSettings.token_expires_at) {
                const refreshed = await refreshGoogleCalendarToken();
                if (!refreshed) {
                    googleCalendarSettings.access_token = null;
                    googleCalendarSettings.token_expires_at = null;
                    saveLocalStorageBackup();
                    if (!isSilent && window.showToast) window.showToast('⚠️ Sessão Google expirada. Conecte novamente.');
                    if (badge) {
                        badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-yellow-400"></span><span class="text-yellow-300 font-bold">Token Expirado — Clique em Conectar</span>`;
                        badge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-yellow-500/20 text-yellow-300 border border-yellow-500/40 flex items-center gap-1';
                    }
                    return;
                }
            }
        }

        // Busca via proxy serverless ou direto na API v3 do Google (elimina falhas no APK e CORS)
        if (googleCalendarSettings.access_token) {
            try {
                const now = new Date();
                const timeMin = new Date(now.getFullYear(), now.getMonth() - 2, 1).toISOString();
                const timeMax = new Date(now.getFullYear(), now.getMonth() + 4, 1).toISOString();

                let data = null;
                try {
                    data = await fetchGCalEventsViaProxyOrDirect(timeMin, timeMax, googleCalendarSettings.access_token);
                } catch (firstErr) {
                    if (firstErr && (firstErr.status === 401 || String(firstErr.message).includes('401'))) {
                        console.warn('[GCAL SYNC] 401 recebido, renovando token e tentando novamente...');
                        const refreshed = await refreshGoogleCalendarToken();
                        if (refreshed && googleCalendarSettings.access_token) {
                            data = await fetchGCalEventsViaProxyOrDirect(timeMin, timeMax, googleCalendarSettings.access_token);
                        } else {
                            throw firstErr;
                        }
                    } else {
                        throw firstErr;
                    }
                }

                if (data && data.items && Array.isArray(data.items)) {
                    fetchedEvents = data.items.map(function(item) {
                        const start = (item.start && (item.start.dateTime || item.start.date)) || '';
                        const dateStr = start.substring(0, 10);
                        let timeStr = '';
                        if (start.includes('T')) {
                            timeStr = start.substring(11, 16);
                        }
                        return {
                            id: 'gapi_' + (item.id || Math.random().toString(36).substr(2, 6)),
                            title: item.summary || 'Compromisso sem Título',
                            description: item.description || '',
                            location: item.location || '',
                            date: dateStr,
                            time: timeStr,
                            colorId: item.colorId || '7',
                            htmlLink: item.htmlLink || '',
                            origin: 'google_api'
                        };
                    });
                }
            } catch (err) {
                if (err && err.status === 401) {
                    apiError = 'Token inválido/expirado (401). Conecte novamente.';
                } else if (err && err.status === 403) {
                    apiError = 'Acesso negado (403). Verifique se a Google Calendar API está ativada.';
                } else {
                    apiError = (err && err.message) || 'Erro de rede/sincronização';
                }
                console.error('[GCAL SYNC] Erro ao sincronizar eventos:', err);
                if (!isSilent && window.showToast) window.showToast('❌ GCal: ' + apiError);
            }
        }

        // Fallback / Método 1: iCal privado do Google Calendar
        if (fetchedEvents.length === 0 && googleCalendarSettings.ical_url) {
            try {
                let icsText = null;
                const icalUrl = googleCalendarSettings.ical_url.trim();

                const isApkOrTauri = window.location.hostname === 'tauri.localhost' || 
                                     window.location.protocol === 'tauri:' || 
                                     typeof window.AndroidBridge !== 'undefined';

                const proxyList = isApkOrTauri ? [
                    icalUrl,
                    'https://corsproxy.io/?url=' + encodeURIComponent(icalUrl),
                    'https://api.allorigins.win/raw?url=' + encodeURIComponent(icalUrl),
                    'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(icalUrl)
                ] : [
                    'https://corsproxy.io/?url=' + encodeURIComponent(icalUrl),
                    'https://api.allorigins.win/raw?url=' + encodeURIComponent(icalUrl),
                    'https://api.codetabs.com/v1/proxy?quest=' + encodeURIComponent(icalUrl),
                    icalUrl
                ];

                for (let i = 0; i < proxyList.length; i++) {
                    if (icsText) break;
                    try {
                        const res = await fetch(proxyList[i], { cache: 'no-store' });
                        if (res.ok) {
                            const txt = await res.text();
                            if (txt && txt.includes('BEGIN:VCALENDAR')) {
                                icsText = txt;
                                break;
                            }
                        }
                    } catch (pe) {}
                }

                if (icsText) {
                    const parsed = parseICS(icsText);
                    if (parsed && parsed.length > 0) {
                        fetchedEvents = parsed;
                    }
                }
            } catch (e) {
                console.warn('[GCAL iCAL] Erro ao processar feed iCal:', e);
            }
        }

        if (fetchedEvents.length > 0) {
            googleEventsList = fetchedEvents;
            saveLocalStorageBackup();
        }

        const total = googleEventsList.length;
        const hasToken = !!(googleCalendarSettings.access_token);
        const hasIcal = !!(googleCalendarSettings.ical_url);
        const isConnected = hasToken || hasIcal || total > 0;

        if (badge) {
            if (apiError && total === 0) {
                badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-red-400 animate-pulse"></span><span class="text-red-300 font-bold">Erro: ${apiError}</span>`;
                badge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-red-500/20 text-red-300 border border-red-500/40 flex items-center gap-1';
            } else if (isConnected) {
                badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span><span class="text-emerald-300 font-bold">Google Agenda: ${total} eventos</span>`;
                badge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 flex items-center gap-1';
            } else {
                badge.innerHTML = `<span class="w-2 h-2 rounded-full bg-gray-400"></span><span class="text-gray-300 font-bold">Google Agenda Desconectado</span>`;
                badge.className = 'px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-white/10 text-gray-300 border border-white/20 flex items-center gap-1';
            }
        }

        renderControlCalendar();
        if (!isSilent && (!apiError || total > 0)) {
            if (window.showToast) window.showToast('✓ Sincronização Google concluída: ' + total + ' eventos!');
        }
        } finally {
            isGCalSyncInProgress = false;
        }
    }

    /**
     * Cria evento na Google Calendar API com Render Otimista Instantâneo (0ms) e Suporte a Cor Oficial
     */
    async function createGoogleCalendarEvent(eventData) {
        const dateStr = eventData.date || formatISODate(getBrasiliaDate());
        const timeStr = eventData.time || '09:00';
        const notesStr = eventData.description || eventData.notes || '';
        const colorId = String(eventData.colorId || selectedQuickCalColorId || '7');

        // 1. INSERÇÃO OTIMISTA INSTANTÂNEA NO GLASS CALENDAR (0ms de latência percebida)
        const tempId = 'gapi_opt_' + Date.now();
        const tempEvent = {
            id: tempId,
            title: eventData.title,
            description: notesStr,
            date: dateStr,
            time: timeStr,
            colorId: colorId,
            origin: 'google_api'
        };
        googleEventsList.push(tempEvent);
        saveLocalStorageBackup();
        renderControlCalendar();

        // Tenta criar via proxy /api/gcal (se tiver token)
        if (googleCalendarSettings.access_token) {
            // Verifica expiração do token
            if (googleCalendarSettings.token_expires_at && Date.now() > googleCalendarSettings.token_expires_at) {
                googleCalendarSettings.access_token = null;
                googleCalendarSettings.token_expires_at = null;
                googleEventsList = googleEventsList.filter(e => e.id !== tempId);
                saveLocalStorageBackup();
                renderControlCalendar();
                if (window.showToast) window.showToast('⚠️ Token Google expirado. Clique em "Conectar Google Agenda" novamente.');
                return { success: false, method: 'token_expired' };
            }

            try {
                const startISO = dateStr + 'T' + timeStr + ':00';
                const endHour = eventData.endTime ? eventData.endTime.split(':')[0] : String((parseInt(timeStr.split(':')[0], 10) + 1) % 24).padStart(2, '0');
                const endMin = eventData.endTime ? (eventData.endTime.split(':')[1] || '00') : (timeStr.split(':')[1] || '00');
                const endISO = dateStr + 'T' + endHour + ':' + endMin + ':00';

                const payload = {
                    summary: eventData.title,
                    description: notesStr ? notesStr + '\n\n' + EMAIL_SIGNATURE : EMAIL_SIGNATURE,
                    colorId: colorId,
                    start: {
                        dateTime: startISO + '-03:00',
                        timeZone: 'America/Sao_Paulo'
                    },
                    end: {
                        dateTime: endISO + '-03:00',
                        timeZone: 'America/Sao_Paulo'
                    }
                };
                if (eventData.recurrence) {
                    payload.recurrence = Array.isArray(eventData.recurrence) ? eventData.recurrence : [eventData.recurrence];
                }

                const created = await postGCalEventViaProxyOrDirect(payload, googleCalendarSettings.access_token);
                if (created && (created.id || created.summary)) {
                    // Atualiza o ID do evento com o ID real da Google API
                    const idx = googleEventsList.findIndex(e => e.id === tempId);
                    if (idx !== -1) {
                        googleEventsList[idx].id = 'gapi_' + (created.id || tempId);
                        googleEventsList[idx].colorId = created.colorId || colorId;
                        googleEventsList[idx].htmlLink = created.htmlLink || '';
                        saveLocalStorageBackup();
                    }
                    if (window.showToast) window.showToast('✓ Evento sincronizado com o Google Agenda!');
                    // Auto-sync suave em background
                    setTimeout(() => syncGoogleCalendar(true), 1200);
                    return { success: true, event: created };
                } else {
                    // Desfaz a inserção otimista em caso de erro na API
                    googleEventsList = googleEventsList.filter(e => e.id !== tempId);
                    saveLocalStorageBackup();
                    renderControlCalendar();
                    if (window.showToast) window.showToast('⚠️ Não foi possível sincronizar o evento com o Google.');
                    return { success: false, method: 'google_api_failed' };
                }
            } catch (e) {
                googleEventsList = googleEventsList.filter(e => e.id !== tempId);
                saveLocalStorageBackup();
                renderControlCalendar();
                console.error('[GCAL CREATE] Erro de rede:', e);
                if (e && e.status === 401) {
                    googleCalendarSettings.access_token = null;
                    googleCalendarSettings.token_expires_at = null;
                    saveLocalStorageBackup();
                    if (window.showToast) window.showToast('⚠️ Token inválido (401). Reconecte o Google.');
                } else if (e && e.status === 403) {
                    if (window.showToast) window.showToast('❌ Acesso negado (403). Ative a Google Calendar API no Console.');
                } else {
                    if (window.showToast) window.showToast('❌ Erro ao criar evento: ' + (e.message || e));
                }
                return { success: false, method: 'error', error: e };
            }
        }

        // Sem token conectado: se for evento de estudo (STUD:), mantém na timeline 360 como plano de estudo sincronizado
        const isStudy = (eventData.title || '').startsWith('STUD:');
        if (isStudy) {
            const idx = googleEventsList.findIndex(e => e.id === tempId);
            if (idx !== -1) {
                googleEventsList[idx].origin = 'study_routine';
                googleEventsList[idx].colorId = colorId;
                saveLocalStorageBackup();
                renderControlCalendar();
            }
            if (window.showToast) window.showToast('✓ Bloco adicionado à Timeline 360°! Conecte o Google Agenda para sincronizar online.');
            return { success: true, method: 'local_study_timeline' };
        } else {
            googleEventsList = googleEventsList.filter(e => e.id !== tempId);
            saveLocalStorageBackup();
            renderControlCalendar();
            if (window.showToast) window.showToast('ℹ️ Conecte o Google Agenda para sincronizar eventos via API.');
            return { success: false, method: 'no_token' };
        }
    }

    /**
     * Parser ultra leve e robusto para arquivos iCalendar (.ics)
     */
    function parseICS(icsData) {
        if (!icsData) return [];
        const events = [];
        const lines = icsData.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n');
        let inEvent = false;
        let currentEvent = {};

        for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line === 'BEGIN:VEVENT') {
                inEvent = true;
                currentEvent = { origin: 'google_ical' };
            } else if (line === 'END:VEVENT') {
                inEvent = false;
                if (currentEvent.title && currentEvent.date) {
                    events.push(currentEvent);
                }
            } else if (inEvent) {
                if (line.startsWith('SUMMARY:')) {
                    currentEvent.title = line.substring(8).trim();
                } else if (line.startsWith('DESCRIPTION:')) {
                    currentEvent.description = line.substring(12).trim();
                } else if (line.startsWith('LOCATION:')) {
                    currentEvent.location = line.substring(9).trim();
                } else if (line.startsWith('DTSTART')) {
                    const colonIdx = line.indexOf(':');
                    if (colonIdx !== -1) {
                        const val = line.substring(colonIdx + 1).trim();
                        // Formatos: YYYYMMDD ou YYYYMMDDTHHMMSSZ
                        if (val.length >= 8) {
                            const y = val.substring(0, 4);
                            const m = val.substring(4, 6);
                            const d = val.substring(6, 8);
                            currentEvent.date = `${y}-${m}-${d}`;
                            if (val.includes('T') && val.length >= 13) {
                                const tIdx = val.indexOf('T');
                                const hh = val.substring(tIdx + 1, tIdx + 3);
                                const mm = val.substring(tIdx + 3, tIdx + 5);
                                currentEvent.time = `${hh}:${mm}`;
                            }
                        }
                    }
                }
            }
        }
        return events;
    }

    function onQuickCalTypeChanged() {
        const typeSelect = document.getElementById('quick-cal-type');
        const reminderWrapper = document.getElementById('quick-cal-reminder-group-wrapper');
        const todoWrapper = document.getElementById('quick-cal-todo-group-wrapper');
        const groupBox = document.getElementById('quick-cal-group-box');
        if (!typeSelect) return;

        const val = typeSelect.value;
        if (val === 'reminder') {
            if (groupBox) groupBox.classList.remove('hidden');
            if (reminderWrapper) reminderWrapper.classList.remove('hidden');
            if (todoWrapper) todoWrapper.classList.add('hidden');
        } else if (val === 'todo' || val === 'todo_and_google') {
            if (groupBox) groupBox.classList.remove('hidden');
            if (reminderWrapper) reminderWrapper.classList.add('hidden');
            if (todoWrapper) todoWrapper.classList.remove('hidden');
        } else {
            // google_event
            if (groupBox) groupBox.classList.add('hidden');
        }
    }

    function selectQuickCalColor(colorId) {
        selectedQuickCalColorId = String(colorId || '7');
        renderQuickCalColorPalette();
    }

    function renderQuickCalColorPalette() {
        const container = document.getElementById('quick-cal-color-palette');
        const nameEl = document.getElementById('quick-cal-selected-color-name');
        if (!container) return;

        const cur = GOOGLE_CALENDAR_COLORS[selectedQuickCalColorId] || GOOGLE_CALENDAR_COLORS['7'];
        if (nameEl) {
            nameEl.innerHTML = `${cur.dot} ${cur.name} ${cur.id === '7' ? '(Padrão)' : ''}`;
            nameEl.style.color = cur.lightHex;
        }

        let html = '';
        Object.keys(GOOGLE_CALENDAR_COLORS).forEach(cid => {
            const c = GOOGLE_CALENDAR_COLORS[cid];
            const isSel = cid === selectedQuickCalColorId;
            html += `
                <button type="button" onclick="window.ControlEngine.selectQuickCalColor('${cid}')" 
                    class="w-7 h-7 sm:w-8 sm:h-8 rounded-full transition-all flex items-center justify-center cursor-pointer relative ${isSel ? 'scale-115 ring-2 ring-white shadow-lg' : 'opacity-80 hover:opacity-100 hover:scale-105'}"
                    style="background: ${c.hex}; ${isSel ? `box-shadow: 0 0 12px ${c.hex};` : ''}"
                    title="${c.name}">
                    ${isSel ? '<span class="text-white text-xs font-bold drop-shadow">✓</span>' : ''}
                </button>
            `;
        });
        container.innerHTML = html;
    }

    function openQuickCalendarEventModal(prefillDate) {
        const inputTitle = document.getElementById('quick-cal-title');
        const inputDate = document.getElementById('quick-cal-date');
        const inputTime = document.getElementById('quick-cal-time');
        const inputNotes = document.getElementById('quick-cal-notes');
        const selReminderGroup = document.getElementById('quick-cal-reminder-group');
        const selTodoGroup = document.getElementById('quick-cal-todo-group');

        if (inputTitle) inputTitle.value = '';
        if (inputDate) inputDate.value = prefillDate || selectedCalendarDateStr || formatISODate(getBrasiliaDate());
        if (inputTime) inputTime.value = '09:00';
        if (inputNotes) inputNotes.value = '';

        // Popula grupos de lembretes
        if (selReminderGroup) {
            let rHtml = '';
            reminderGroups.forEach(g => {
                rHtml += `<option value="${g.id}">${g.emoji || '⏰'} ${g.title}</option>`;
            });
            selReminderGroup.innerHTML = rHtml || `<option value="rem_grp_main">⏰ Geral</option>`;
        }

        // Popula grupos de tarefas
        if (selTodoGroup) {
            let tHtml = '';
            todoGroups.forEach(g => {
                tHtml += `<option value="${g.id}">${g.emoji || '📋'} ${g.title}</option>`;
            });
            selTodoGroup.innerHTML = tHtml || `<option value="grp_main">📋 Geral</option>`;
        }

        // Renderiza paleta de cores
        renderQuickCalColorPalette();
        onQuickCalTypeChanged();

        const modal = document.getElementById('control-quick-calendar-event-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function closeQuickCalendarEventModal() {
        const modal = document.getElementById('control-quick-calendar-event-modal');
        if (modal) modal.classList.add('hidden');
    }

    async function handleSaveQuickCalendarEvent(e) {
        if (e) e.preventDefault();

        const inputTitle = document.getElementById('quick-cal-title');
        const inputDate = document.getElementById('quick-cal-date');
        const inputTime = document.getElementById('quick-cal-time');
        const selectType = document.getElementById('quick-cal-type');
        const selectReminderGroup = document.getElementById('quick-cal-reminder-group');
        const selectTodoGroup = document.getElementById('quick-cal-todo-group');
        const selectTodoPriority = document.getElementById('quick-cal-todo-priority');
        const inputNotes = document.getElementById('quick-cal-notes');

        const title = inputTitle ? inputTitle.value.trim() : '';
        const dateStr = inputDate ? inputDate.value : formatISODate(getBrasiliaDate());
        const timeStr = inputTime ? inputTime.value : '09:00';
        const type = selectType ? selectType.value : 'reminder';
        const reminderGroupId = selectReminderGroup ? selectReminderGroup.value : (reminderGroups[0]?.id || 'rem_grp_main');
        const todoGroupId = selectTodoGroup ? selectTodoGroup.value : (todoGroups[0]?.id || 'grp_main');
        const todoPriority = selectTodoPriority ? selectTodoPriority.value : 'normal';
        const notes = inputNotes ? inputNotes.value.trim() : '';
        const colorId = selectedQuickCalColorId || '7';

        if (!title) { if (window.glassAlert) window.glassAlert('Informe o título do compromisso / tarefa.', 'Campo Obrigatório', '⚠️'); else alert('Informe o título do compromisso / tarefa.'); return; }

        if (type === 'reminder') {
            await createReminder({
                title: title,
                group_id: reminderGroupId,
                target_date: dateStr,
                target_time: timeStr,
                notes: notes,
                reminder_type: 'one_time'
            });
            if (window.showToast) window.showToast('✓ Lembrete adicionado ao grupo selecionado!');
        } else if (type === 'todo') {
            await createTodo({
                title: title,
                group_id: todoGroupId,
                priority: todoPriority,
                due_date: dateStr,
                due_time: timeStr,
                description: notes,
                has_alarm: true
            });
            if (window.showToast) window.showToast('✓ Tarefa adicionada ao grupo de tarefas!');
        } else if (type === 'todo_and_google') {
            // Cria a Tarefa no grupo de Tasks E envia para o Google Calendar com a cor selecionada
            await createTodo({
                title: title,
                group_id: todoGroupId,
                priority: todoPriority,
                due_date: dateStr,
                due_time: timeStr,
                description: notes,
                has_alarm: true
            });
            await createGoogleCalendarEvent({
                title: title,
                date: dateStr,
                time: timeStr,
                notes: notes,
                colorId: colorId
            });
            if (window.showToast) window.showToast('✓ Tarefa criada no Personal OS E agendada no Google Calendar!');
        } else {
            // Criação exclusiva de Evento Google com a cor selecionada
            await createGoogleCalendarEvent({
                title: title,
                date: dateStr,
                time: timeStr,
                notes: notes,
                colorId: colorId
            });
        }

        closeQuickCalendarEventModal();
    }

    function openGoogleCalendarDirectLinkFromQuickForm() {
        const inputTitle = document.getElementById('quick-cal-title');
        const inputDate = document.getElementById('quick-cal-date');
        const inputTime = document.getElementById('quick-cal-time');
        const inputNotes = document.getElementById('quick-cal-notes');

        const title = inputTitle ? inputTitle.value.trim() : 'Compromisso PERSONAL OS';
        const dateStr = inputDate ? inputDate.value : formatISODate(getBrasiliaDate());
        const timeStr = inputTime ? inputTime.value : '09:00';
        const notes = inputNotes ? inputNotes.value.trim() : '';

        openGoogleCalendarDirectLink(title, dateStr, timeStr, notes);
    }

    /**
     * Abre a tela oficial do Google Calendar já pré-preenchida para adição em 1 clique
     */
    function openGoogleCalendarDirectLink(title, dateStr, timeStr, notes) {
        const cleanDate = (dateStr || formatISODate(getBrasiliaDate())).replace(/-/g, '');
        const cleanTime = (timeStr || '12:00').replace(/:/g, '') + '00';
        const startISO = `${cleanDate}T${cleanTime}`;

        // Duração padrão de 1 hora
        const endHours = String((parseInt(timeStr.split(':')[0], 10) + 1) % 24).padStart(2, '0');
        const endMins = timeStr.split(':')[1] || '00';
        const endISO = `${cleanDate}T${endHours}${endMins}00`;

        const url = `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent(title)}&dates=${startISO}/${endISO}&details=${encodeURIComponent(notes + '\n\n' + EMAIL_SIGNATURE)}&sf=true&output=xml`;
        window.open(url, '_blank');
    }

    async function sendTestEmailFromAdmin() {
        const inputRecipient = document.getElementById('admin-email-recipient');
        const recipient = (inputRecipient ? inputRecipient.value.trim() : '') || emailSettings.recipient_email || 'demo@personal-os.io';

        if (!emailSettings.resend_api_key) {
            emailSettings.resend_api_key = 'demo_resend_api_key_placeholder';
        }

        if (window.showToast) window.showToast('📧 Enviando email de teste via Resend...');

        const result = await sendResendEmail({
            to: recipient,
            subject: '⚡ [PERSONAL OS] Teste de Conexão Resend com Sucesso',
            markdown: `# 🚀 Conexão Resend Validada!\n\nOlá Mateus,\n\nSeu sistema **PERSONAL OS** está conectado com sucesso ao provedor **Resend**.\n\n- **Destinatário:** ${recipient}\n- **Fuso Horário:** Brasília (BRT)\n- **Status:** Operacional e Pronto para Disparos Automáticos`
        });

        if (result && result.success) {
            showToast('✅ Email de teste entregue com sucesso para: ' + recipient, 'success');
        }
    }

    async function testResendApiKey() {
        const inputKey = document.getElementById('admin-email-apikey');
        const inputRecipient = document.getElementById('admin-email-recipient');
        const btn = document.getElementById('btn-test-resend-api');

        let apiKey = inputKey ? inputKey.value.trim() : '';
        if (!apiKey && emailSettings.resend_api_key) {
            apiKey = emailSettings.resend_api_key;
            if (inputKey) inputKey.value = apiKey;
        }

        const recipient = (inputRecipient ? inputRecipient.value.trim() : '') || emailSettings.recipient_email || 'demo@personal-os.io';

        if (!apiKey || !apiKey.startsWith('re_')) {
            showToast('⚠️ Insira uma API Key válida do Resend (começa com re_)', 'warning');
            if (inputKey) inputKey.focus();
            return;
        }
        if (!recipient) {
            showToast('⚠️ Insira o email de destino antes de testar.', 'warning');
            return;
        }

        // Visual: loading
        if (btn) {
            btn.disabled = true;
            btn.innerHTML = '⏳ Testando...';
            btn.style.opacity = '0.7';
        }

        try {
            const response = await fetch(EDGE_FUNCTION_EMAIL_URL, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json', 
                    'apikey': SUPABASE_ANON_KEY,
                    'Authorization': `Bearer ${SUPABASE_ANON_KEY}` 
                },
                body: JSON.stringify({
                    api_key: apiKey,
                    apiKey: apiKey,
                    to: recipient,
                    from: `PERSONAL OS <onboarding@resend.dev>`,
                    subject: '✅ [PERSONAL OS] API Key Validada com Sucesso',
                    html: `<h2 style="font-family:monospace;">🔑 API Key Resend Verificada!</h2><p>Sua chave está funcionando corretamente.<br>O sistema PERSONAL OS está pronto para disparar emails automáticos.</p><hr><small>Enviado em: ${new Date().toLocaleString('pt-BR', {timeZone:'America/Sao_Paulo'})}</small>`
                })
            });

            const data = await response.json().catch(() => ({}));
            const isOk = response.ok && (data.success || data.id || data.data?.id);

            if (isOk) {
                // Sucesso: salva a key automaticamente
                emailSettings.resend_api_key = apiKey;
                saveLocalStorageBackup();

                if (btn) {
                    btn.innerHTML = '✅ API Válida!';
                    btn.style.background = 'rgba(16,185,129,0.25)';
                    btn.style.color = '#6ee7b7';
                    btn.style.borderColor = 'rgba(16,185,129,0.5)';
                    btn.style.opacity = '1';
                    setTimeout(() => {
                        btn.innerHTML = '🔑 Testar API';
                        btn.style.background = '';
                        btn.style.color = '';
                        btn.style.borderColor = '';
                        btn.disabled = false;
                    }, 3000);
                }
                showToast('✅ API Key válida! Email de confirmação enviado e chave salva.', 'success');
            } else {
                const errMsg = data.message || data.error || 'Chave inválida ou sem permissão';
                if (btn) {
                    btn.innerHTML = '❌ Falhou';
                    btn.style.background = 'rgba(239,68,68,0.2)';
                    btn.style.color = '#fca5a5';
                    btn.style.opacity = '1';
                    setTimeout(() => {
                        btn.innerHTML = '🔑 Testar API';
                        btn.style.background = '';
                        btn.style.color = '';
                        btn.disabled = false;
                    }, 3000);
                }
                showToast(`❌ Erro na API Key: ${errMsg}`, 'error');
            }
        } catch (err) {
            if (btn) {
                btn.innerHTML = '❌ Erro de Rede';
                btn.style.opacity = '1';
                setTimeout(() => { btn.innerHTML = '🔑 Testar API'; btn.disabled = false; }, 3000);
            }
            showToast('❌ Erro de conexão ao testar a API Key. Verifique sua internet.', 'error');
        }
    }

    // ==========================================
    // EMOJI PICKER CATEGORIZADO PADRONIZADO
    // ==========================================

    function setEmojiCategory(cat, containerId) {
        activeEmojiCategory = cat;
        renderEmojiPicker(containerId);
    }

    function renderEmojiPicker(containerId) {
        const el = document.getElementById(containerId);
        if (!el) return;

        const categories = [
            { id: 'foco', label: '⚡ Foco' },
            { id: 'ban', label: '🛑 Ban' },
            { id: 'rotina', label: '☀️ Rotina' },
            { id: 'riqueza', label: '💎 Riqueza' },
            { id: 'vibe', label: '🔥 Vibe' }
        ];

        let navHtml = `
            <div class="flex items-center gap-1 pb-2 overflow-x-auto hide-scrollbar w-full border-b border-white/15 mb-2">
                ${categories.map(c => `
                    <button type="button" onclick="window.ControlEngine.setEmojiCategory('${c.id}', '${containerId}')" class="px-3 py-1.5 rounded-xl text-xs font-mono whitespace-nowrap transition cursor-pointer ${activeEmojiCategory === c.id ? 'bg-white text-black font-bold shadow-md' : 'bg-white/10 hover:bg-white/20 text-gray-200'}">
                        ${c.label}
                    </button>
                `).join('')}
            </div>
        `;

        const activeList = EMOJI_COLLECTION[activeEmojiCategory] || EMOJI_COLLECTION.foco;

        let gridHtml = `<div class="grid grid-cols-8 sm:grid-cols-12 gap-1.5 max-h-40 overflow-y-auto pr-1">`;
        activeList.forEach(em => {
            const isSel = currentSelectedEmoji === em;
            gridHtml += `
                <button type="button" onclick="window.ControlEngine.selectEmoji('${em}', '${containerId}')" class="w-9 h-9 rounded-xl flex items-center justify-center text-lg hover:bg-white/25 transition cursor-pointer ${isSel ? 'bg-white/35 ring-2 ring-white scale-110 shadow-lg' : 'bg-white/[0.06]'}">
                    ${em}
                </button>
            `;
        });
        gridHtml += `</div>`;

        el.innerHTML = navHtml + gridHtml;
    }

    function selectEmoji(em, containerId) {
        currentSelectedEmoji = em;
        renderEmojiPicker(containerId);
    }

    // ==========================================
    // FORMATADORES & PARSER DE MARKDOWN DE ALTA FIDELIDADE
    // ==========================================

    function formatRecurrenceLabel(type) {
        const labels = {
            'one_time': 'Pontual (1x)',
            'once': 'Pontual (1x)',
            'daily': 'Diário',
            'weekly': 'Semanal',
            'monthly': 'Mensal',
            'bimonthly': 'Bimestral (2m)',
            'quarterly': 'Trimestral (3m)',
            'semiannual': 'Semestral (6m)',
            'annual': 'Anual (1 ano)'
        };
        return labels[type] || 'Pontual (1x)';
    }

    function updateGroupDropdowns() {
        const todoSel = document.getElementById('todo-form-group');
        if (todoSel) {
            todoSel.innerHTML = todoGroups.map(g => `<option value="${g.id}">${g.emoji} ${g.title}</option>`).join('');
        }

        const remSel = document.getElementById('reminder-form-group');
        if (remSel) {
            remSel.innerHTML = reminderGroups.map(g => `<option value="${g.id}">${g.emoji} ${g.title}</option>`).join('');
        }
    }

    function updateSidebarCounts() {
        const countEl = document.getElementById('sidebar-control-count');
        if (countEl) {
            const pendingTodos = todosList.filter(t => !t.is_completed).length;
            const activeReminders = remindersList.filter(r => r.is_active).length;
            countEl.innerText = `${pendingTodos} Tarefas • ${activeReminders} Lembretes`;
        }
    }

    function getBrasiliaDate() {
        try {
            const now = new Date();
            const brasiliaStr = now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
            return new Date(brasiliaStr);
        } catch (e) {
            return new Date();
        }
    }

    function formatISODate(d) {
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatDisplayDate(dateStr) {
        if (!dateStr) return '';
        const parts = dateStr.split('-');
        if (parts.length !== 3) return dateStr;
        return `${parts[2]}/${parts[1]}/${parts[0]}`;
    }

    function formatSecondsToDetailedDuration(secs) {
        if (!secs || secs <= 0) return '0s';
        const d = Math.floor(secs / 86400);
        const h = Math.floor((secs % 86400) / 3600);
        const m = Math.floor((secs % 3600) / 60);
        const s = secs % 60;
        const parts = [];
        if (d > 0) parts.push(`${d}d`);
        if (h > 0) parts.push(`${h}h`);
        if (m > 0) parts.push(`${m}m`);
        if (s > 0 || parts.length === 0) parts.push(`${s}s`);
        return parts.join(' ');
    }

    /**
     * Parser Markdown de Luxo para Preview e Envio de Email
     */
    function renderRichMarkdownToHtml(mdText) {
        if (!mdText || !String(mdText).trim()) {
            return '<div style="color:#71717a; text-align:center; padding:20px; font-style:italic;">Nenhum conteúdo para visualização. Escreva em Markdown para visualizar.</div>';
        }

        let clean = String(mdText).replace(/\\n/g, '\n');

        // Pré-processa callouts do GitHub: > [!NOTE], > [!TIP], > [!IMPORTANT], > [!WARNING], > [!CAUTION]
        clean = clean
            .replace(/^>\s*\[!NOTE\]\s*(.*)$/gim, '> ℹ️ **NOTA:** $1')
            .replace(/^>\s*\[!TIP\]\s*(.*)$/gim, '> 💡 **DICA:** $1')
            .replace(/^>\s*\[!IMPORTANT\]\s*(.*)$/gim, '> ⚡ **IMPORTANTE:** $1')
            .replace(/^>\s*\[!WARNING\]\s*(.*)$/gim, '> ⚠️ **ATENÇÃO:** $1')
            .replace(/^>\s*\[!CAUTION\]\s*(.*)$/gim, '> 🛑 **CUIDADO:** $1')
            .replace(/==(.*?)==/g, '<mark style="background: rgba(234,179,8,0.25); color: #fde047; padding: 2px 5px; border-radius: 4px;">$1</mark>');

        // Se a biblioteca marked estiver presente no navegador (suporta 100% dos códigos)
        if (typeof marked !== 'undefined') {
            try {
                if (typeof marked.setOptions === 'function') {
                    marked.setOptions({
                        gfm: true,
                        breaks: true
                    });
                }
                const parsedHtml = (typeof marked.parse === 'function') ? marked.parse(clean) : marked(clean);
                const sanitized = (typeof DOMPurify !== 'undefined' && typeof DOMPurify.sanitize === 'function') 
                    ? DOMPurify.sanitize(parsedHtml) 
                    : parsedHtml;
                return `
                    <div class="markdown-rendered space-y-2 leading-relaxed text-gray-200">
                        ${sanitized}
                    </div>
                `;
            } catch (err) {
                console.warn('Erro ao processar markdown com marked, usando fallback:', err);
            }
        }

        // Fallback procedural nativo de alta qualidade
        let lines = clean.split('\n');
        let htmlLines = [];
        let inList = false;

        for (let i = 0; i < lines.length; i++) {
            let line = lines[i].trim();

            if (line.startsWith('# ')) {
                if (inList) { htmlLines.push('</ul>'); inList = false; }
                htmlLines.push(`<h1 style="color: #ffffff; font-size: 20px; font-weight: 800; margin: 16px 0 10px 0; letter-spacing: -0.02em; border-bottom: 1px solid rgba(255,255,255,0.15); padding-bottom: 8px;">${formatInlineStyles(line.substring(2))}</h1>`);
            } else if (line.startsWith('## ')) {
                if (inList) { htmlLines.push('</ul>'); inList = false; }
                htmlLines.push(`<h2 style="color: #f4f4f5; font-size: 16px; font-weight: 700; margin: 14px 0 8px 0;">${formatInlineStyles(line.substring(3))}</h2>`);
            } else if (line.startsWith('### ')) {
                if (inList) { htmlLines.push('</ul>'); inList = false; }
                htmlLines.push(`<h3 style="color: #e4e4e7; font-size: 14px; font-weight: 600; margin: 12px 0 6px 0;">${formatInlineStyles(line.substring(4))}</h3>`);
            } else if (line.startsWith('- [ ] ') || line.startsWith('* [ ] ')) {
                if (inList) { htmlLines.push('</ul>'); inList = false; }
                htmlLines.push(`<div style="display:flex; align-items:center; gap:8px; margin:4px 0;"><input type="checkbox" disabled style="accent-color:#f59e0b;" /><span style="color:#e4e4e7;">${formatInlineStyles(line.substring(6))}</span></div>`);
            } else if (line.startsWith('- [x] ') || line.startsWith('* [x] ') || line.startsWith('- [X] ') || line.startsWith('* [X] ')) {
                if (inList) { htmlLines.push('</ul>'); inList = false; }
                htmlLines.push(`<div style="display:flex; align-items:center; gap:8px; margin:4px 0;"><input type="checkbox" checked disabled style="accent-color:#f59e0b;" /><span style="color:#71717a; text-decoration:line-through;">${formatInlineStyles(line.substring(6))}</span></div>`);
            } else if (line.startsWith('- ') || line.startsWith('* ')) {
                if (!inList) { htmlLines.push('<ul style="margin: 8px 0; padding-left: 20px; list-style-type: disc;">'); inList = true; }
                htmlLines.push(`<li style="color: #e4e4e7; margin-bottom: 4px; line-height: 1.6;">${formatInlineStyles(line.substring(2))}</li>`);
            } else if (line.startsWith('> ')) {
                if (inList) { htmlLines.push('</ul>'); inList = false; }
                htmlLines.push(`<blockquote style="border-left: 3px solid #38bdf8; background: rgba(56,189,248,0.1); padding: 10px 14px; border-radius: 0 10px 10px 0; margin: 12px 0; color: #d4d4d8; font-style: italic;">${formatInlineStyles(line.substring(2))}</blockquote>`);
            } else if (line.startsWith('---')) {
                if (inList) { htmlLines.push('</ul>'); inList = false; }
                htmlLines.push('<hr style="border: 0; border-top: 1px solid rgba(255,255,255,0.15); margin: 16px 0;">');
            } else if (line === '') {
                if (inList) { htmlLines.push('</ul>'); inList = false; }
                htmlLines.push('<div style="height: 6px;"></div>');
            } else {
                if (inList) { htmlLines.push('</ul>'); inList = false; }
                htmlLines.push(`<p style="color: #e4e4e7; margin: 4px 0; line-height: 1.65; font-size: 13px;">${formatInlineStyles(line)}</p>`);
            }
        }

        if (inList) { htmlLines.push('</ul>'); inList = false; }

        return `
            <div class="markdown-rendered space-y-2 leading-relaxed text-gray-200">
                ${htmlLines.join('')}
            </div>
        `;
    }

    function formatInlineStyles(str) {
        return str
            .replace(/\*\*(.*?)\*\*/g, '<strong style="color: #ffffff; font-weight: 700;">$1</strong>')
            .replace(/\*(.*?)\*/g, '<em style="color: #d4d4d8;">$1</em>')
            .replace(/~~(.*?)~~/g, '<del style="color: #71717a; text-decoration: line-through;">$1</del>')
            .replace(/`([^`]+)`/g, '<code style="background: rgba(255,255,255,0.15); padding: 2px 6px; border-radius: 6px; font-family: monospace; color: #38bdf8; font-size: 12px;">$1</code>');
    }

    // ==========================================
    // SISTEMA DE ROTINA DE ESTUDOS (NOTION & GOOGLE AGENDA)
    // ==========================================


    const STUDY_RRULE_MAP = {
        'SEG': 'MO',
        'TER': 'TU',
        'QUA': 'WE',
        'QUI': 'TH',
        'SEX': 'FR',
        'SAB': 'SA',
        'DOM': 'SU'
    };

    function escapeHtml(str) {
        if (!str) return '';
        return String(str)
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    /**
     * Calcula a próxima data correspondente a um dia da semana (SEG -> próxima segunda)
     */
    function getUpcomingDateForDayOfWeek(dayStr) {
        const dayMap = {
            'DOM': 0, 'SEG': 1, 'TER': 2, 'QUA': 3, 'QUI': 4, 'SEX': 5, 'SAB': 6, 'SÁB': 6
        };
        const targetDay = dayMap[dayStr.toUpperCase()] !== undefined ? dayMap[dayStr.toUpperCase()] : 1;
        const now = getBrasiliaDate();
        const currentDay = now.getDay();
        let diff = targetDay - currentDay;
        if (diff < 0) diff += 7;
        const targetDate = new Date(now);
        targetDate.setDate(now.getDate() + diff);
        return formatISODate(targetDate);
    }

    /**
     * Renders the 7 columns for each day of the week (Notion weekly schedule)
     */
    function renderStudyScheduleUI() {
        STUDY_DAYS_ORDER.forEach(day => {
            const container = document.getElementById(`study-day-cards-${day}`);
            const countBadge = document.getElementById(`study-count-${day}`);
            if (!container) return;

            const dayBlocks = studyBlocks
                .filter(b => b.day_of_week === day && b.is_active !== false)
                .sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));

            if (countBadge) countBadge.innerText = dayBlocks.length;

            if (dayBlocks.length === 0) {
                container.innerHTML = `
                    <div class="py-10 text-center font-mono text-xs text-gray-400 italic select-none opacity-80">
                        Livre
                    </div>
                `;
                return;
            }

            container.innerHTML = dayBlocks.map(b => {
                const accentColor = b.color || '#e67c73';
                return `
                    <div class="group relative rounded-xl p-3 border border-white/10 bg-white/[0.04] hover:bg-white/[0.09] transition shadow-sm space-y-2" style="border-left: 3.5px solid ${accentColor};">
                        <div class="flex items-start justify-between gap-1">
                            <span class="px-2 py-0.5 rounded text-[10px] font-mono font-bold tracking-tight inline-block" style="background: ${accentColor}25; color: ${accentColor}; border: 1px solid ${accentColor}40;">
                                ${escapeHtml(b.tag || b.title)}
                            </span>
                            <div class="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <button type="button" onclick="window.ControlEngine.openEditStudyBlockModal('${b.id}')" class="p-1 rounded text-gray-400 hover:text-white cursor-pointer transition text-xs" title="Editar Bloco">✏️</button>
                                <button type="button" onclick="window.ControlEngine.syncStudyBlockToGoogleCalendar('${b.id}')" class="p-1 rounded text-gray-400 hover:text-purple-300 cursor-pointer transition text-xs" title="Sincronizar no Google Agenda">📅</button>
                                <button type="button" onclick="window.ControlEngine.deleteStudyBlock('${b.id}')" class="p-1 rounded text-gray-400 hover:text-rose-400 cursor-pointer transition text-xs" title="Excluir Bloco">🗑️</button>
                            </div>
                        </div>

                        <div class="text-xs font-bold text-white tracking-tight leading-snug">
                            ${escapeHtml(b.title)}
                        </div>

                        <div class="space-y-0.5 text-[11px] font-mono font-bold">
                            <div class="text-gray-200">${b.start_time || '08:30'}</div>
                            <div class="text-gray-400">${b.end_time || '13:30'}</div>
                        </div>

                        ${b.notes ? `<div class="text-[10px] font-mono text-gray-400 truncate" title="${escapeHtml(b.notes)}">${escapeHtml(b.notes)}</div>` : ''}
                    </div>
                `;
            }).join('');
        });
    }

    /**
     * Renders the weekly matrix table with dynamic Brasília time status:
     * - Past days: dimmed, blurred slightly, desaturated (study-col-past)
     * - Today: pulsing glowing border & aura (study-col-today)
     * - Future days: clean, luminous glass (study-col-future)
     * - All 7 day columns have strictly identical widths (w-[12.71%])
     * - Smooth vertical expansion as items are added
     */
        function renderStudyTableGridUI() {
        const thead = document.getElementById('study-matrix-table-head');
        const tbody = document.getElementById('study-matrix-table-body');
        if (!tbody) return;

        const nowBrt = getBrasiliaDate();
        const todayDayIdx = nowBrt.getDay(); // 0 = DOM, 1 = SEG, 2 = TER, 3 = QUA, 4 = QUI, 5 = SEX, 6 = SAB
        const timeStr = nowBrt.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });

        const timeIndicator = document.getElementById('study-brasilia-time-indicator');
        if (timeIndicator) {
            timeIndicator.innerText = `Brasília ${timeStr} (BRT)`;
        }

        const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

        // Datas da semana atual
        const startOfWeek = new Date(nowBrt);
        startOfWeek.setDate(startOfWeek.getDate() - todayDayIdx);
        const weekDates = [];
        for (let i = 0; i < 7; i++) {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + i);
            weekDates.push(formatISODate(d));
        }

        // 1. Cabeçalho de 7 colunas perfeitamente simétricas (sem coluna de turno)
        if (thead) {
            let headHtml = `<tr class="text-gray-300 font-mono text-xs uppercase tracking-widest">`;

            days.forEach((day, idx) => {
                const isToday = idx === todayDayIdx;
                const isPast = idx < todayDayIdx;
                const dateStr = weekDates[idx];
                const dayNum = dateStr ? parseInt(dateStr.split('-')[2], 10) : '';

                headHtml += `
                    <th class="p-1.5 sm:p-2 w-[14.28%] text-center">
                        <div class="h-[62px] min-h-[62px] px-2 rounded-2xl border transition-all flex flex-col items-center justify-center select-none ${
                            isToday 
                                ? 'bg-sky-500/20 border-sky-400/60 shadow-[0_0_20px_rgba(56,189,248,0.3)] ring-1 ring-sky-400/40' 
                                : isPast 
                                    ? 'bg-white/[0.02] border-white/5 opacity-60' 
                                    : 'bg-white/[0.04] border-white/10 hover:border-white/20'
                        }">
                            <span class="font-bold text-xs tracking-wider flex items-center gap-1.5 ${isToday ? 'text-sky-300' : isPast ? 'text-gray-400' : 'text-white'}">
                                ${isToday ? '<span class="w-2 h-2 rounded-full bg-sky-400 animate-ping shrink-0"></span>' : ''}
                                ${day} ${dayNum ? `(${dayNum})` : ''}
                            </span>
                            <span class="px-2 py-0.5 rounded-full text-[9px] font-mono font-bold mt-1 ${
                                isToday 
                                    ? 'bg-sky-400/30 text-sky-100 border border-sky-400/60 shadow-sm animate-pulse' 
                                    : isPast 
                                        ? 'text-gray-500 opacity-60' 
                                        : 'text-emerald-400/90'
                            }">
                                ${isToday ? '✨ HOJE' : isPast ? 'Encerrado' : 'Próximo'}
                            </span>
                        </div>
                    </th>
                `;
            });
            headHtml += `</tr>`;
            thead.innerHTML = headHtml;
        }

        // 2. Corpo do Calendário Semanal (7 Colunas contínuas cronológicas sem quebra de turnos)
        let bodyHtml = `<tr>`;

        days.forEach((day, idx) => {
            const isToday = idx === todayDayIdx;
            const isPast = idx < todayDayIdx;

            const cellBlocks = studyBlocks.filter(b => {
                return b.day_of_week === day && b.is_active !== false;
            }).sort((a, b) => (a.start_time || '').localeCompare(b.start_time || ''));

            bodyHtml += `<td class="p-1.5 sm:p-2 align-top w-[14.28%] h-full">`;
            bodyHtml += `<div class="flex flex-col min-h-[360px] h-full justify-between p-2.5 rounded-2xl border transition-all ${
                isToday 
                    ? 'bg-sky-500/[0.08] border-sky-400/40 shadow-[0_0_20px_rgba(56,189,248,0.15)] ring-1 ring-sky-400/30' 
                    : isPast 
                        ? 'bg-white/[0.015] border-white/5 opacity-60 hover:opacity-100' 
                        : 'bg-white/[0.03] border-white/10 hover:border-white/20'
            }">`;

            // Sub-cabeçalho da coluna com contagem de matérias
            bodyHtml += `
                <div class="flex items-center justify-between pb-1.5 border-b border-white/10 text-[10px] font-mono text-gray-400">
                    <span class="font-bold ${isToday ? 'text-sky-300' : 'text-gray-300'}">${cellBlocks.length} ${cellBlocks.length === 1 ? 'matéria' : 'matérias'}</span>
                    <span class="text-[9px] opacity-60">${day}</span>
                </div>
            `;

            if (cellBlocks.length > 0) {
                bodyHtml += `<div class="space-y-2 flex-1 flex flex-col pt-1.5">`;
                cellBlocks.forEach(b => {
                    const accentColor = b.color || '#e67c73';
                    bodyHtml += `
                        <div onclick="window.ControlEngine.openEditStudyBlockModal('${b.id}')" class="group/card p-2.5 rounded-2xl border text-[11px] font-mono cursor-pointer transition-all duration-300 hover:scale-[1.02] hover:shadow-xl relative overflow-hidden backdrop-blur-md" style="background: linear-gradient(135deg, ${accentColor}25 0%, ${accentColor}10 100%); border-color: ${accentColor}45; box-shadow: 0 4px 15px -2px ${accentColor}20;" title="Clique para editar este bloco">
                            <div class="flex items-start justify-between gap-1">
                                <span class="px-2 py-0.5 rounded-full text-[9px] font-bold tracking-tight inline-block truncate max-w-[85px] shadow-xs" style="background: ${accentColor}35; color: ${accentColor}; border: 1px solid ${accentColor}50;">
                                    ${escapeHtml(b.tag || b.title)}
                                </span>
                                <div class="flex items-center gap-1 opacity-0 group-hover/card:opacity-100 transition-opacity" onclick="event.stopPropagation()">
                                    <button type="button" onclick="window.ControlEngine.openEditStudyBlockModal('${b.id}')" class="w-5 h-5 rounded-lg bg-black/40 hover:bg-white/20 text-gray-300 hover:text-white transition flex items-center justify-center text-[10px]" title="Editar">✏️</button>
                                    <button type="button" onclick="window.ControlEngine.syncStudyBlockToGoogleCalendar('${b.id}')" class="w-5 h-5 rounded-lg bg-black/40 hover:bg-purple-500/40 text-gray-300 hover:text-purple-200 transition flex items-center justify-center text-[10px]" title="Sincronizar no Google Agenda (STUD:)">📅</button>
                                    <button type="button" onclick="window.ControlEngine.deleteStudyBlock('${b.id}')" class="w-5 h-5 rounded-lg bg-black/40 hover:bg-rose-500/40 text-gray-300 hover:text-rose-200 transition flex items-center justify-center text-[10px]" title="Excluir">🗑️</button>
                                </div>
                            </div>
                            <div class="font-bold text-white text-xs mt-1.5 truncate tracking-wide" title="${escapeHtml(b.title)}">${escapeHtml(b.title)}</div>
                            <div class="text-[10px] font-mono text-gray-300 font-bold mt-1 px-2 py-0.5 rounded-lg bg-black/30 inline-block border border-white/5">⏰ ${b.start_time} - ${b.end_time}</div>
                        </div>
                    `;
                });
                bodyHtml += `</div>`;
                bodyHtml += `
                    <button type="button" onclick="window.ControlEngine.openNewStudyBlockModal('${day}')" class="w-full py-1.5 mt-auto text-center text-[10px] text-gray-400 hover:text-white rounded-xl bg-white/[0.04] hover:bg-white/[0.1] transition cursor-pointer border border-white/10 flex items-center justify-center gap-1 font-mono font-bold" title="Adicionar matéria em ${day}">+ Matéria</button>
                `;
            } else {
                bodyHtml += `
                    <div onclick="window.ControlEngine.openNewStudyBlockModal('${day}')" class="h-full min-h-[220px] w-full flex-1 flex flex-col items-center justify-center text-gray-500 hover:text-white hover:bg-white/[0.04] rounded-xl transition cursor-pointer text-xs select-none border border-dashed border-white/10 hover:border-sky-400/50 group/empty my-2" title="Clique para agendar matéria em ${day}">
                        <span class="opacity-40 group-hover/empty:opacity-100 transition-opacity text-xl font-bold">＋</span>
                        <span class="text-[10px] font-mono opacity-0 group-hover/empty:opacity-80 transition-opacity mt-1">+ Matéria</span>
                    </div>
                `;
            }

            bodyHtml += `</div></td>`;
        });

        bodyHtml += `</tr>`;
        tbody.innerHTML = bodyHtml;
    }

    function renderStudyGoogleColorPalette() {
        const container = document.getElementById('study-google-color-palette');
        if (!container) return;

        const currentId = String(studySettings.google_calendar_color_id || '4');

        container.innerHTML = Object.keys(GOOGLE_CALENDAR_COLORS).map(id => {
            const col = GOOGLE_CALENDAR_COLORS[id];
            const isSelected = id === currentId;
            return `
                <button type="button" onclick="window.ControlEngine.selectStudyGoogleCalendarColor('${id}')" class="p-2 rounded-xl flex flex-col items-center justify-center gap-1 transition cursor-pointer border ${isSelected ? 'ring-2 ring-white border-white scale-105 shadow-lg' : 'border-white/10 hover:border-white/30 bg-white/[0.03] hover:bg-white/[0.08]'}" style="${isSelected ? `background: ${col.hex}30;` : ''}">
                    <span class="w-5 h-5 rounded-full flex items-center justify-center text-xs shadow-inner" style="background: ${col.hex};">
                        ${isSelected ? '✓' : ''}
                    </span>
                    <span class="text-[10px] font-mono font-bold text-gray-200 truncate w-full text-center">${col.name}</span>
                </button>
            `;
        }).join('');
    }

    /**
     * Updates status badge, active color text and counters
     */
    function updateStudyStatusUI() {
        const statsEl = document.getElementById('study-stats-counter');
        const colorNameEl = document.getElementById('study-active-color-name');
        const autoSyncCheck = document.getElementById('study-auto-sync-checkbox');
        const gcalStatusBadge = document.getElementById('study-gcal-status-badge');

        if (statsEl) {
            const total = studyBlocks.filter(b => b.is_active !== false).length;
            statsEl.innerText = `${total} ${total === 1 ? 'bloco de estudo' : 'blocos de estudo'}`;
        }

        const activeCol = GOOGLE_CALENDAR_COLORS[studySettings.google_calendar_color_id] || GOOGLE_CALENDAR_COLORS['4'];
        if (colorNameEl) {
            colorNameEl.innerHTML = `Cor padrão Google: <span style="color: ${activeCol.hex}; font-weight: bold;">${activeCol.dot} ${activeCol.name}</span>`;
        }

        if (autoSyncCheck) {
            autoSyncCheck.checked = studySettings.auto_sync_gcal !== false;
        }

        if (gcalStatusBadge) {
            const isConnected = !!(googleCalendarSettings.access_token || googleEventsList.length > 0);
            if (isConnected) {
                gcalStatusBadge.innerHTML = `
                    <span class="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span class="text-emerald-300 font-bold">Google Conectado</span>
                `;
            } else {
                gcalStatusBadge.innerHTML = `
                    <button type="button" onclick="window.ControlEngine.openGoogleCalendarConnectModal()" class="px-2.5 py-1 rounded-lg bg-sky-500/20 hover:bg-sky-500/35 text-sky-300 border border-sky-500/30 transition cursor-pointer text-xs">
                        Conectar Google Agenda
                    </button>
                `;
            }
        }
    }

        function setStudyConfigTab(tab) {
        studyConfigActiveTab = tab;
        ['templates', 'analytics', 'bulk', 'gcal'].forEach(t => {
            const panel = document.getElementById(`study-cfg-panel-${t}`);
            const btn = document.getElementById(`tab-study-cfg-${t}`);
            if (panel) {
                if (t === tab) panel.classList.remove('hidden');
                else panel.classList.add('hidden');
            }
            if (btn) {
                if (t === tab) {
                    btn.className = 'px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-sky-600 text-white shadow-md ring-1 ring-white/30 whitespace-nowrap';
                } else {
                    btn.className = 'px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-white/10 text-gray-300 hover:bg-white/20 whitespace-nowrap';
                }
            }
        });

        if (tab === 'analytics') renderStudyAnalytics();
        if (tab === 'gcal') {
            renderStudyGoogleColorPalette();
            renderUniversalColorPicker('studies', 'study-universal-color-picker');
        }
    }

    function renderStudyConfigTemplatesSelector() {
        const container = document.getElementById('study-cfg-templates-selector');
        if (!container) return;

        const icons = { 'template_1': '🌟', 'template_2': '⚡', 'template_3': '🎯' };

        container.innerHTML = studyTemplates.map(t => {
            const isSelected = t.id === currentEditingTemplateSlotId;
            const icon = icons[t.id] || '📋';
            const isActiveWeek = t.id === activeStudyTemplateId;

            return `
                <button type="button" onclick="window.ControlEngine.selectStudyConfigTemplate('${t.id}')" class="p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-2 ${isSelected ? 'bg-purple-500/25 border-purple-500/70 ring-1 ring-purple-400 shadow-md' : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08]'}">
                    <div class="flex items-center gap-2 overflow-hidden">
                        <span class="text-base shrink-0">${icon}</span>
                        <div class="truncate">
                            <span class="text-xs font-mono font-bold text-white block truncate">${escapeHtml(t.name)}</span>
                            <span class="text-[9px] font-mono text-gray-400">${(t.blocks || []).length} matérias</span>
                        </div>
                    </div>
                    ${isActiveWeek ? '<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold shrink-0">Ativo</span>' : ''}
                </button>
            `;
        }).join('');
    }

    function selectStudyConfigTemplate(templateId) {
        currentEditingTemplateSlotId = templateId;
        const tpl = studyTemplates.find(t => t.id === templateId) || studyTemplates[0];

        renderStudyConfigTemplatesSelector();

        const titleEl = document.getElementById('study-cfg-selected-model-title');
        const descEl = document.getElementById('study-cfg-selected-model-desc');
        const inputName = document.getElementById('study-template-edit-name');
        const inputDesc = document.getElementById('study-template-edit-desc');
        const countEl = document.getElementById('study-template-blocks-count');

        if (titleEl) titleEl.innerText = tpl.name || 'Sem nome';
        if (descEl) descEl.innerText = tpl.description || 'Sem descrição';
        if (inputName) inputName.value = tpl.name || '';
        if (inputDesc) inputDesc.value = tpl.description || '';
        if (countEl) countEl.innerText = `${(tpl.blocks || []).length} matérias`;

        renderStudyTemplateBlocksList();
    }


    async function applySelectedTemplateFromConfig() {
        const slotId = currentEditingTemplateSlotId || 'template_1';
        closeStudyConfigModal();
        await applyStudyTemplate(slotId);
    }

    async function applyStudyTemplate(templateId) {
        const template = studyTemplates.find(t => t.id === templateId);
        if (!template) return;

        const blockCount = (template.blocks && Array.isArray(template.blocks)) ? template.blocks.length : 0;
        const confirmed = window.glassConfirm ? await window.glassConfirm(`Deseja pré-preencher toda a semana com o "${template.name}"?\nIsso substituirá a rotina atual pelas ${blockCount} matérias deste modelo.`, 'Aplicar Semana Modelo', 'Aplicar Modelo', 'Cancelar', false, '📚') : confirm(`Deseja pré-preencher toda a semana com o "${template.name}"?`);
        if (!confirmed) {
            return;
        }

        activeStudyTemplateId = templateId;

        // Clona os blocos do modelo com novos IDs únicos
        studyBlocks = (template.blocks || []).map((b, idx) => ({
            id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'stud_' + Date.now() + '_' + idx,
            title: b.title,
            day_of_week: b.day_of_week,
            start_time: b.start_time,
            end_time: b.end_time,
            tag: b.tag || b.title,
            color: b.color || '#e67c73',
            notes: b.notes || '',
            is_active: true,
            sort_order: idx + 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        }));

        saveLocalStorageBackup();
        renderStudyTableGridUI();
        renderStudyTemplatesBar();
        updateStudyStatusUI();

        // Persiste no Supabase
        const client = getSupabase();
        if (client) {
            try {
                await client.from('control_study_blocks').delete().neq('id', '00000000-0000-0000-0000-000000000000');
                if (studyBlocks.length > 0) {
                    await client.from('control_study_blocks').insert(studyBlocks);
                }
            } catch (err) {
                console.error('Erro ao sincronizar template com Supabase:', err);
            }
        }

        if (window.showToast) {
            window.showToast(`✓ Semana pré-preenchida com sucesso: ${template.name}!`);
        }
    }

    function renderStudyTemplateBlocksList() {
        const container = document.getElementById('study-template-blocks-list');
        if (!container) return;

        const tpl = studyTemplates.find(t => t.id === currentEditingTemplateSlotId);
        if (!tpl || !tpl.blocks || tpl.blocks.length === 0) {
            container.innerHTML = `
                <div class="p-6 text-center text-xs font-mono text-gray-500 rounded-xl border border-dashed border-white/10">
                    Nenhuma matéria neste modelo. Clique em "＋ Nova Matéria" ou "📥 Copiar da Semana Atual".
                </div>
            `;
            return;
        }

        const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

        container.innerHTML = tpl.blocks.map((b, idx) => `
            <div class="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
                <div class="flex items-center gap-2 flex-1">
                    <select onchange="window.ControlEngine.updateTemplateBlockField(${idx}, 'day_of_week', this.value)" class="input-glass rounded-lg px-2 py-1 text-[11px] font-bold text-sky-300 min-h-[30px] cursor-pointer">
                        ${days.map(d => `<option value="${d}" ${b.day_of_week === d ? 'selected' : ''}>${d}</option>`).join('')}
                    </select>
                    <input type="text" value="${escapeHtml(b.title)}" onchange="window.ControlEngine.updateTemplateBlockField(${idx}, 'title', this.value)" placeholder="Nome da matéria" class="input-glass rounded-lg px-2 py-1 text-xs text-white font-bold flex-1 min-h-[30px]" />
                    <input type="time" value="${b.start_time || '08:30'}" onchange="window.ControlEngine.updateTemplateBlockField(${idx}, 'start_time', this.value)" class="input-glass rounded-lg px-2 py-1 text-[11px] text-gray-200 min-h-[30px]" />
                    <span class="text-gray-500">-</span>
                    <input type="time" value="${b.end_time || '13:30'}" onchange="window.ControlEngine.updateTemplateBlockField(${idx}, 'end_time', this.value)" class="input-glass rounded-lg px-2 py-1 text-[11px] text-gray-200 min-h-[30px]" />
                </div>
                <button type="button" onclick="window.ControlEngine.removeBlockFromEditingTemplate(${idx})" class="p-1 text-gray-400 hover:text-rose-400 transition text-sm cursor-pointer" title="Remover matéria deste modelo">
                    ✕
                </button>
            </div>
        `).join('');
    }

    function updateTemplateBlockField(index, field, value) {
        const tpl = studyTemplates.find(t => t.id === currentEditingTemplateSlotId);
        if (!tpl || !tpl.blocks || !tpl.blocks[index]) return;
        tpl.blocks[index][field] = value;
    }

    function addBlockToEditingTemplate() {
        const tpl = studyTemplates.find(t => t.id === currentEditingTemplateSlotId);
        if (!tpl) return;
        if (!tpl.blocks) tpl.blocks = [];
        tpl.blocks.push({
            title: 'Nova Disciplina',
            day_of_week: 'SEG',
            start_time: '08:30',
            end_time: '12:30',
            tag: 'Estudo',
            color: '#e67c73',
            notes: ''
        });
        const countEl = document.getElementById('study-template-blocks-count');
        if (countEl) countEl.innerText = `${tpl.blocks.length} matérias`;
        renderStudyTemplateBlocksList();
    }

    function removeBlockFromEditingTemplate(index) {
        const tpl = studyTemplates.find(t => t.id === currentEditingTemplateSlotId);
        if (!tpl || !tpl.blocks) return;
        tpl.blocks.splice(index, 1);
        const countEl = document.getElementById('study-template-blocks-count');
        if (countEl) countEl.innerText = `${tpl.blocks.length} matérias`;
        renderStudyTemplateBlocksList();
    }

    async function copyCurrentWeekToEditingTemplate() {
        const tpl = studyTemplates.find(t => t.id === currentEditingTemplateSlotId);
        if (!tpl) return;
        const confirmed = window.glassConfirm ? await window.glassConfirm(`Deseja substituir as matérias do "${tpl.name}" pelas ${studyBlocks.length} matérias da semana atual?`, 'Substituir Matérias do Modelo', 'Substituir', 'Cancelar', false, '📥') : confirm(`Deseja substituir as matérias?`);
        if (!confirmed) return;

        tpl.blocks = studyBlocks.map(b => ({
            title: b.title,
            day_of_week: b.day_of_week,
            start_time: b.start_time,
            end_time: b.end_time,
            tag: b.tag || b.title,
            color: b.color || '#e67c73',
            notes: b.notes || ''
        }));

        const countEl = document.getElementById('study-template-blocks-count');
        if (countEl) countEl.innerText = `${tpl.blocks.length} matérias`;
        renderStudyTemplateBlocksList();

        if (window.showToast) {
            window.showToast('✓ Matérias da semana atual copiadas para o modelo. Clique em "Salvar Modelo".');
        }
    }

    async function saveEditingTemplateChanges() {
        const tpl = studyTemplates.find(t => t.id === currentEditingTemplateSlotId);
        if (!tpl) return;

        const inputName = document.getElementById('study-template-edit-name');
        const inputDesc = document.getElementById('study-template-edit-desc');

        if (inputName && inputName.value.trim()) tpl.name = inputName.value.trim();
        if (inputDesc) tpl.description = inputDesc.value.trim();
        tpl.updated_at = new Date().toISOString();

        saveLocalStorageBackup();
        renderStudyTemplatesBar();

        const client = getSupabase();
        if (client) {
            try {
                await client.from('control_study_templates').upsert(tpl);
            } catch (err) {
                console.error('Erro ao salvar template editado no Supabase:', err);
            }
        }

        if (window.showToast) {
            window.showToast(`✓ Modelo "${tpl.name}" salvo com sucesso!`);
        }
    }

    
    // =========================================================================
    // MÉTODOS DE CONFIGURAÇÃO E SEMANAS MODELO: TO-DO PERSONALS
    // =========================================================================

    function openTodoConfigModal() {
        const modal = document.getElementById('todo-config-modal');
        if (modal) modal.classList.remove('hidden');
        setTodoConfigTab(todoConfigActiveTab || 'templates');
        selectTodoConfigTemplate(currentEditingTodoTemplateSlotId || activeTodoTemplateId || 'todo_template_1');
        renderUniversalColorPicker('todos', 'todo-universal-color-picker');
    }

    function closeTodoConfigModal() {
        const modal = document.getElementById('todo-config-modal');
        if (modal) modal.classList.add('hidden');
    }

        function setTodoConfigTab(tab) {
        todoConfigActiveTab = tab;
        ['templates', 'analytics', 'bulk', 'colors'].forEach(t => {
            const panel = document.getElementById(`todo-cfg-panel-${t}`);
            const btn = document.getElementById(`tab-todo-cfg-${t}`);
            if (panel) {
                if (t === tab) panel.classList.remove('hidden');
                else panel.classList.add('hidden');
            }
            if (btn) {
                if (t === tab) {
                    btn.className = 'px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-emerald-600 text-white shadow-md ring-1 ring-white/30 whitespace-nowrap';
                } else {
                    btn.className = 'px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-white/10 text-gray-300 hover:bg-white/20 whitespace-nowrap';
                }
            }
        });

        if (tab === 'analytics') renderTodoAnalytics();
        if (tab === 'colors') renderUniversalColorPicker('todos', 'todo-universal-color-picker');
    }

    function renderTodoConfigTemplatesSelector() {
        const container = document.getElementById('todo-cfg-templates-selector');
        if (!container) return;

        const icons = { 'todo_template_1': '⚡', 'todo_template_2': '⚖️', 'todo_template_3': '🎯' };

        container.innerHTML = todoTemplates.map(t => {
            const isSelected = t.id === currentEditingTodoTemplateSlotId;
            const icon = icons[t.id] || '📋';
            const isActive = t.id === activeTodoTemplateId;

            return `
                <button type="button" onclick="window.ControlEngine.selectTodoConfigTemplate('${t.id}')" class="p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-2 ${isSelected ? 'bg-emerald-500/25 border-emerald-500/70 ring-1 ring-emerald-400 shadow-md' : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08]'}">
                    <div class="flex items-center gap-2 overflow-hidden">
                        <span class="text-base shrink-0">${icon}</span>
                        <div class="truncate">
                            <span class="text-xs font-mono font-bold text-white block truncate">${escapeHtml(t.name)}</span>
                            <span class="text-[9px] font-mono text-gray-400">${(t.blocks || []).length} tarefas</span>
                        </div>
                    </div>
                    ${isActive ? '<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono font-bold shrink-0">Ativo</span>' : ''}
                </button>
            `;
        }).join('');
    }

    function selectTodoConfigTemplate(templateId) {
        currentEditingTodoTemplateSlotId = templateId;
        if (!todoTemplates || !Array.isArray(todoTemplates) || todoTemplates.length === 0) {
            todoTemplates = [
                {
                    id: 'todo_template_1',
                    name: 'Modelo 1 — Semana Executiva & Sprint',
                    description: 'Rotina de alta entrega profissional com planejamento dominical, standups e blocos de código.',
                    color: '#10b981',
                    blocks: [
                        { title: 'Planejamento Estratégico Semanal', day_of_week: 'DOM', due_time: '19:00', priority: 'high' },
                        { title: 'Alinhamento de Metas & Prioridades', day_of_week: 'SEG', due_time: '09:00', priority: 'high' },
                        { title: 'Sprint Focus: Arquitetura & Backend', day_of_week: 'SEG', due_time: '14:30', priority: 'urgent' },
                        { title: 'Code Review & Testes de Integração', day_of_week: 'TER', due_time: '10:00', priority: 'normal' },
                        { title: 'Entrega de Features Principais', day_of_week: 'TER', due_time: '16:00', priority: 'high' }
                    ]
                },
                {
                    id: 'todo_template_2',
                    name: 'Modelo 2 — Rotina Equilibrada (Trabalho & Vida)',
                    description: 'Organização consistente balanceando obrigações, finanças, estudos e saúde.',
                    color: '#0ea5e9',
                    blocks: [
                        { title: 'Revisão Financeira Semanal', day_of_week: 'DOM', due_time: '20:00', priority: 'normal' },
                        { title: 'Definição de 3 Prioridades do Dia', day_of_week: 'SEG', due_time: '08:30', priority: 'high' },
                        { title: 'Execução de Demandas Administrativas', day_of_week: 'TER', due_time: '14:00', priority: 'normal' },
                        { title: 'Estudos & Leitura Técnica', day_of_week: 'QUA', due_time: '19:30', priority: 'normal' },
                        { title: 'Fechamento da Semana & Limpeza Inbox', day_of_week: 'SEX', due_time: '17:00', priority: 'low' }
                    ]
                },
                {
                    id: 'todo_template_3',
                    name: 'Modelo 3 — Foco Minimalista (Essencialismo)',
                    description: 'Apenas 1 grande entrega por dia para evitar sobrecarga e focar no que move o ponteiro.',
                    color: '#8b5cf6',
                    blocks: [
                        { title: 'A Única Coisa da Semana (High Impact)', day_of_week: 'SEG', due_time: '09:00', priority: 'urgent' },
                        { title: 'Entrega Principal Terça-Feira', day_of_week: 'TER', due_time: '10:00', priority: 'urgent' },
                        { title: 'Entrega Principal Quarta-Feira', day_of_week: 'QUA', due_time: '10:00', priority: 'urgent' },
                        { title: 'Entrega Principal Quinta-Feira', day_of_week: 'QUI', due_time: '10:00', priority: 'urgent' },
                        { title: 'Revisão Retrospectiva Semanal', day_of_week: 'SEX', due_time: '15:00', priority: 'high' }
                    ]
                }
            ];
        }
        let tpl = todoTemplates.find(t => t.id === templateId) || todoTemplates[0];
        if (!tpl) tpl = todoTemplates[0];

        renderTodoConfigTemplatesSelector();

        const titleEl = document.getElementById('todo-cfg-selected-model-title');
        const descEl = document.getElementById('todo-cfg-selected-model-desc');
        const inputName = document.getElementById('todo-template-edit-name');
        const inputDesc = document.getElementById('todo-template-edit-desc');
        const countEl = document.getElementById('todo-template-blocks-count');

        if (titleEl) titleEl.innerText = tpl.name || 'Sem nome';
        if (descEl) descEl.innerText = tpl.description || 'Sem descrição';
        if (inputName) inputName.value = tpl.name || '';
        if (inputDesc) inputDesc.value = tpl.description || '';
        if (countEl) countEl.innerText = `${(tpl.blocks || []).length} tarefas`;

        renderTodoTemplateBlocksList();
    }

    async function applySelectedTodoTemplateFromConfig() {
        const slotId = currentEditingTodoTemplateSlotId || 'todo_template_1';
        closeTodoConfigModal();
        await applyTodoTemplate(slotId);
    }

    async function applyTodoTemplate(templateId) {
        const template = todoTemplates.find(t => t.id === templateId);
        if (!template) return;

        const count = (template.blocks && Array.isArray(template.blocks)) ? template.blocks.length : 0;
        const confirmed = window.glassConfirm ? await window.glassConfirm(`Deseja pré-preencher a semana com o "${template.name}"?\nIsso adicionará as ${count} tarefas deste modelo à sua rotina.`, 'Aplicar Modelo de Tarefas', 'Aplicar Modelo', 'Cancelar', false, '📋') : confirm(`Deseja pré-preencher a semana?`);
        if (!confirmed) {
            return;
        }

        activeTodoTemplateId = templateId;

        // Calcular datas da semana atual
        const nowBrt = getBrasiliaDate();
        const startOfWeek = new Date(nowBrt);
        startOfWeek.setDate(startOfWeek.getDate() - nowBrt.getDay());
        const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
        const dateMap = {};
        days.forEach((day, idx) => {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + idx);
            dateMap[day] = formatISODate(d);
        });

        // Clona as tarefas do modelo
        const newTodos = (template.blocks || []).map((b, idx) => {
            const dueDate = dateMap[b.day_of_week] || formatISODate(nowBrt);
            return {
                id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'todo_' + Date.now() + '_' + idx,
                title: b.title,
                description: `Gerado a partir do ${template.name}`,
                due_date: dueDate,
                due_time: b.due_time || '10:00',
                priority: b.priority || 'normal',
                group_id: 'grp_work',
                is_completed: false,
                is_recurring: false,
                has_alarm: false,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
        });

        // Adiciona à lista
        todosList = [...newTodos, ...todosList];
        saveLocalStorageBackup();
        renderControlUI();
        renderTodoMatrixTableGridUI();
        if (typeof renderTodoCalendarGridUI === 'function') renderTodoCalendarGridUI();

        if (window.showToast) {
            window.showToast(`✓ Semana pré-preenchida com sucesso: ${template.name}!`);
        }
    }

    function renderTodoTemplateBlocksList() {
        const container = document.getElementById('todo-template-blocks-list');
        if (!container) return;

        const tpl = todoTemplates.find(t => t.id === currentEditingTodoTemplateSlotId);
        if (!tpl || !tpl.blocks || tpl.blocks.length === 0) {
            container.innerHTML = `
                <div class="p-6 text-center text-xs font-mono text-gray-500 rounded-xl border border-dashed border-white/10">
                    Nenhuma tarefa neste modelo. Clique em "＋ Nova Tarefa" ou "📥 Copiar da Semana Atual".
                </div>
            `;
            return;
        }

        const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
        const priorities = [
            { id: 'low', label: '🌱 Baixa' },
            { id: 'normal', label: '🟢 Normal' },
            { id: 'high', label: '⚡ Alta' },
            { id: 'urgent', label: '🔥 Urgente' }
        ];

        container.innerHTML = tpl.blocks.map((b, idx) => `
            <div class="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
                <div class="flex items-center gap-2 flex-1 flex-wrap sm:flex-nowrap">
                    <select onchange="window.ControlEngine.updateTodoTemplateBlockField(${idx}, 'day_of_week', this.value)" class="input-glass rounded-lg px-2 py-1 text-[11px] font-bold text-emerald-300 min-h-[30px] cursor-pointer">
                        ${days.map(d => `<option value="${d}" ${b.day_of_week === d ? 'selected' : ''}>${d}</option>`).join('')}
                    </select>
                    <input type="text" value="${escapeHtml(b.title)}" onchange="window.ControlEngine.updateTodoTemplateBlockField(${idx}, 'title', this.value)" placeholder="Título da tarefa" class="input-glass rounded-lg px-2 py-1 text-xs text-white font-bold flex-1 min-h-[30px]" />
                    <input type="time" value="${b.due_time || '09:00'}" onchange="window.ControlEngine.updateTodoTemplateBlockField(${idx}, 'due_time', this.value)" class="input-glass rounded-lg px-2 py-1 text-[11px] text-gray-200 min-h-[30px]" />
                    <select onchange="window.ControlEngine.updateTodoTemplateBlockField(${idx}, 'priority', this.value)" class="input-glass rounded-lg px-2 py-1 text-[11px] text-amber-300 min-h-[30px] cursor-pointer">
                        ${priorities.map(p => `<option value="${p.id}" ${b.priority === p.id ? 'selected' : ''}>${p.label}</option>`).join('')}
                    </select>
                </div>
                <button type="button" onclick="window.ControlEngine.removeBlockFromEditingTodoTemplate(${idx})" class="p-1 text-gray-400 hover:text-rose-400 transition text-sm cursor-pointer shrink-0" title="Remover tarefa deste modelo">
                    ✕
                </button>
            </div>
        `).join('');
    }

    function updateTodoTemplateBlockField(index, field, value) {
        const tpl = todoTemplates.find(t => t.id === currentEditingTodoTemplateSlotId);
        if (!tpl || !tpl.blocks || !tpl.blocks[index]) return;
        tpl.blocks[index][field] = value;
    }

    function addBlockToEditingTodoTemplate() {
        const tpl = todoTemplates.find(t => t.id === currentEditingTodoTemplateSlotId);
        if (!tpl) return;
        if (!tpl.blocks) tpl.blocks = [];
        tpl.blocks.push({
            title: 'Nova Tarefa Executiva',
            day_of_week: 'SEG',
            due_time: '10:00',
            priority: 'normal'
        });
        const countEl = document.getElementById('todo-template-blocks-count');
        if (countEl) countEl.innerText = `${tpl.blocks.length} tarefas`;
        renderTodoTemplateBlocksList();
    }

    function removeBlockFromEditingTodoTemplate(index) {
        const tpl = todoTemplates.find(t => t.id === currentEditingTodoTemplateSlotId);
        if (!tpl || !tpl.blocks) return;
        tpl.blocks.splice(index, 1);
        const countEl = document.getElementById('todo-template-blocks-count');
        if (countEl) countEl.innerText = `${tpl.blocks.length} tarefas`;
        renderTodoTemplateBlocksList();
    }

    async function copyCurrentWeekToEditingTodoTemplate() {
        const tpl = todoTemplates.find(t => t.id === currentEditingTodoTemplateSlotId);
        if (!tpl) return;
        const confirmed = window.glassConfirm ? await window.glassConfirm(`Deseja substituir as tarefas do "${tpl.name}" pelas ${todosList.length} tarefas atuais?`, 'Substituir Tarefas do Modelo', 'Substituir', 'Cancelar', false, '📥') : confirm(`Deseja substituir as tarefas?`);
        if (!confirmed) return;

        const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];

        tpl.blocks = todosList.map(t => {
            let dayOfWeek = 'SEG';
            if (t.due_date) {
                try {
                    const parts = t.due_date.split('-');
                    const d = new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2]));
                    dayOfWeek = days[d.getDay()];
                } catch(e) {}
            }
            return {
                title: t.title,
                day_of_week: dayOfWeek,
                due_time: t.due_time || '10:00',
                priority: t.priority || 'normal'
            };
        });

        const countEl = document.getElementById('todo-template-blocks-count');
        if (countEl) countEl.innerText = `${tpl.blocks.length} tarefas`;
        renderTodoTemplateBlocksList();

        if (window.showToast) {
            window.showToast('✓ Tarefas da semana atual copiadas para o modelo. Clique em "Salvar Modelo".');
        }
    }

    async function saveEditingTodoTemplateChanges() {
        const tpl = todoTemplates.find(t => t.id === currentEditingTodoTemplateSlotId);
        if (!tpl) return;

        const inputName = document.getElementById('todo-template-edit-name');
        const inputDesc = document.getElementById('todo-template-edit-desc');

        if (inputName && inputName.value.trim()) tpl.name = inputName.value.trim();
        if (inputDesc) tpl.description = inputDesc.value.trim();
        tpl.updated_at = new Date().toISOString();

        saveLocalStorageBackup();
        renderTodoConfigTemplatesSelector();

        if (window.showToast) {
            window.showToast(`✓ Modelo "${tpl.name}" salvo com sucesso!`);
        }
    }

    function renderTodoSessionColorPickerInConfig() {
        const container = document.getElementById('todo-session-color-picker-container');
        if (!container) return;
        const currentAccent = sessionAccentColors['todos'] || '#10b981';
        container.innerHTML = `
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
                ${SESSION_COLOR_PALETTES.map(p => {
                    const isSelected = p.hex.toLowerCase() === currentAccent.toLowerCase();
                    return `
                        <button type="button" onclick="window.ControlEngine.applySessionAccentColor('todos', '${p.hex}', '${p.name}'); renderTodoSessionColorPickerInConfig();" class="p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${isSelected ? 'ring-2 ring-white border-white bg-white/20' : 'border-white/10 hover:border-white/30 bg-white/[0.04]'}">
                            <span class="w-6 h-6 rounded-full shadow-inner border border-white/20" style="background: ${p.hex}"></span>
                            <span class="text-[9px] font-mono text-gray-300 truncate w-full">${p.name}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }

    // =========================================================================
    // MÉTODOS DE CONFIGURAÇÃO E SEMANAS MODELO: LEMBRETES & ALARMES
    // =========================================================================

    function openReminderConfigModal() {
        const modal = document.getElementById('reminder-config-modal');
        if (modal) modal.classList.remove('hidden');
        setReminderConfigTab(reminderConfigActiveTab || 'templates');
        selectReminderConfigTemplate(currentEditingReminderTemplateSlotId || activeReminderTemplateId || 'reminder_template_1');
        renderUniversalColorPicker('reminders', 'reminder-universal-color-picker');
    }

    function closeReminderConfigModal() {
        const modal = document.getElementById('reminder-config-modal');
        if (modal) modal.classList.add('hidden');
    }

        function setReminderConfigTab(tab) {
        reminderConfigActiveTab = tab;
        ['templates', 'analytics', 'bulk', 'colors'].forEach(t => {
            const panel = document.getElementById(`reminder-cfg-panel-${t}`);
            const btn = document.getElementById(`tab-reminder-cfg-${t}`);
            if (panel) {
                if (t === tab) panel.classList.remove('hidden');
                else panel.classList.add('hidden');
            }
            if (btn) {
                if (t === tab) {
                    btn.className = 'px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-purple-600 text-white shadow-md ring-1 ring-white/30 whitespace-nowrap';
                } else {
                    btn.className = 'px-3.5 py-2 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-white/10 text-gray-300 hover:bg-white/20 whitespace-nowrap';
                }
            }
        });

        if (tab === 'analytics') renderReminderAnalytics();
        if (tab === 'colors') renderUniversalColorPicker('reminders', 'reminder-universal-color-picker');
    }

    function renderReminderConfigTemplatesSelector() {
        const container = document.getElementById('reminder-cfg-templates-selector');
        if (!container) return;

        const icons = { 'reminder_template_1': '⏰', 'reminder_template_2': '🔔', 'reminder_template_3': '🧘' };

        container.innerHTML = reminderTemplates.map(t => {
            const isSelected = t.id === currentEditingReminderTemplateSlotId;
            const icon = icons[t.id] || '📋';
            const isActive = t.id === activeReminderTemplateId;

            return `
                <button type="button" onclick="window.ControlEngine.selectReminderConfigTemplate('${t.id}')" class="p-2.5 rounded-xl border text-left transition cursor-pointer flex items-center justify-between gap-2 ${isSelected ? 'bg-purple-500/25 border-purple-500/70 ring-1 ring-purple-400 shadow-md' : 'bg-white/[0.03] border-white/10 hover:bg-white/[0.08]'}">
                    <div class="flex items-center gap-2 overflow-hidden">
                        <span class="text-base shrink-0">${icon}</span>
                        <div class="truncate">
                            <span class="text-xs font-mono font-bold text-white block truncate">${escapeHtml(t.name)}</span>
                            <span class="text-[9px] font-mono text-gray-400">${(t.blocks || []).length} lembretes</span>
                        </div>
                    </div>
                    ${isActive ? '<span class="text-[9px] px-1.5 py-0.2 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/30 font-mono font-bold shrink-0">Ativo</span>' : ''}
                </button>
            `;
        }).join('');
    }

    function selectReminderConfigTemplate(templateId) {
        currentEditingReminderTemplateSlotId = templateId;
        if (!reminderTemplates || !Array.isArray(reminderTemplates) || reminderTemplates.length === 0) {
            reminderTemplates = [
                {
                    id: 'reminder_template_1',
                    name: 'Modelo 1 — Alta Performance & Rotina Saudável',
                    description: 'Lembretes de saúde, hidratação, suplementação e intervalos produtivos diários.',
                    color: '#c084fc',
                    blocks: [
                        { title: "Acordar & Copo d'Água + Sol Matinal", day_of_week: 'ALL', target_time: '07:00', has_sound: true },
                        { title: 'Tomar Creatina & Suplementação', day_of_week: 'ALL', target_time: '08:00', has_sound: true },
                        { title: 'Iniciar Bloco de Hiperfoco 01', day_of_week: 'SEG', target_time: '09:00', has_sound: true },
                        { title: 'Pausa Ativa: Caminhada 10min & Água', day_of_week: 'ALL', target_time: '11:00', has_sound: false },
                        { title: 'Almoço Saudável & Descanso Digestivo', day_of_week: 'ALL', target_time: '12:30', has_sound: false },
                        { title: 'Hiperfoco 02 & Encerrar Pendências', day_of_week: 'SEG', target_time: '14:30', has_sound: true },
                        { title: 'Caminhada & Descompressão Mental', day_of_week: 'SEG', target_time: '18:00', has_sound: true },
                        { title: 'Desconexão de Telas & Higiene do Sono', day_of_week: 'ALL', target_time: '22:00', has_sound: true }
                    ]
                },
                {
                    id: 'reminder_template_2',
                    name: 'Modelo 2 — Gestão e Reuniões de Trabalho',
                    description: 'Alarmes estratégicos para pontualidade em compromissos corporativos e checagem de mensagens.',
                    color: '#38bdf8',
                    blocks: [
                        { title: 'Checagem Rápida de Mensagens e E-mails', day_of_week: 'SEG', target_time: '08:45', has_sound: true },
                        { title: 'Reunião Diária de Alinhamento (Daily)', day_of_week: 'SEG', target_time: '10:00', has_sound: true },
                        { title: 'Follow-up de Projetos Críticos', day_of_week: 'SEG', target_time: '15:00', has_sound: true },
                        { title: 'Envio de Relatórios & Atualização de Status', day_of_week: 'SEX', target_time: '16:30', has_sound: true }
                    ]
                },
                {
                    id: 'reminder_template_3',
                    name: 'Modelo 3 — Equilíbrio Mental e Bem-Estar',
                    description: 'Pausas para respiração, postura correta, relaxamento dos olhos e meditação.',
                    color: '#34d399',
                    blocks: [
                        { title: 'Alongamento Matinal e Respiração Guiada', day_of_week: 'ALL', target_time: '07:30', has_sound: false },
                        { title: 'Corrigir Postura e Descansar a Vista (Regra 20-20-20)', day_of_week: 'ALL', target_time: '10:30', has_sound: false },
                        { title: 'Pausa para Hidratação (Garrafa 500ml)', day_of_week: 'ALL', target_time: '15:30', has_sound: true },
                        { title: 'Momento Offline: Leitura ou Meditação Noturna', day_of_week: 'ALL', target_time: '21:30', has_sound: false }
                    ]
                }
            ];
        }
        let tpl = reminderTemplates.find(t => t.id === templateId) || reminderTemplates[0];
        if (!tpl) tpl = reminderTemplates[0];

        renderReminderConfigTemplatesSelector();

        const titleEl = document.getElementById('reminder-cfg-selected-model-title');
        const descEl = document.getElementById('reminder-cfg-selected-model-desc');
        const inputName = document.getElementById('reminder-template-edit-name');
        const inputDesc = document.getElementById('reminder-template-edit-desc');
        const countEl = document.getElementById('reminder-template-blocks-count');

        if (titleEl) titleEl.innerText = tpl.name || 'Sem nome';
        if (descEl) descEl.innerText = tpl.description || 'Sem descrição';
        if (inputName) inputName.value = tpl.name || '';
        if (inputDesc) inputDesc.value = tpl.description || '';
        if (countEl) countEl.innerText = `${(tpl.blocks || []).length} lembretes`;

        renderReminderTemplateBlocksList();
    }

    async function applySelectedReminderTemplateFromConfig() {
        const slotId = currentEditingReminderTemplateSlotId || 'reminder_template_1';
        closeReminderConfigModal();
        await applyReminderTemplate(slotId);
    }

    async function applyReminderTemplate(templateId) {
        const template = reminderTemplates.find(t => t.id === templateId);
        if (!template) return;

        const count = (template.blocks && Array.isArray(template.blocks)) ? template.blocks.length : 0;
        const confirmed = window.glassConfirm ? await window.glassConfirm(`Deseja pré-preencher seus lembretes com o "${template.name}"?\nIsso carregará os ${count} lembretes deste modelo.`, 'Aplicar Modelo de Lembretes', 'Aplicar Modelo', 'Cancelar', false, '⏰') : confirm(`Deseja pré-preencher seus lembretes?`);
        if (!confirmed) {
            return;
        }

        activeReminderTemplateId = templateId;

        // Calcular datas da semana atual
        const nowBrt = getBrasiliaDate();
        const startOfWeek = new Date(nowBrt);
        startOfWeek.setDate(startOfWeek.getDate() - nowBrt.getDay());
        const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
        const dateMap = {};
        days.forEach((day, idx) => {
            const d = new Date(startOfWeek);
            d.setDate(d.getDate() + idx);
            dateMap[day] = formatISODate(d);
        });

        // Clona os lembretes do modelo
        const newReminders = (template.blocks || []).map((b, idx) => {
            const isDaily = b.day_of_week === 'ALL';
            const targetDate = isDaily ? null : (dateMap[b.day_of_week] || formatISODate(nowBrt));
            return {
                id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'rem_' + Date.now() + '_' + idx,
                title: b.title,
                target_date: targetDate,
                target_time: b.target_time || '08:00',
                day_of_week: b.day_of_week || 'ALL',
                reminder_type: isDaily ? 'daily' : 'weekly',
                is_active: true,
                has_sound: b.has_sound !== false,
                group_id: 'rem_grp_health',
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
        });

        remindersList = [...newReminders, ...remindersList];
        saveLocalStorageBackup();
        renderControlUI();
        renderReminderMatrixTableGridUI();
        if (typeof renderReminderCalendarGridUI === 'function') renderReminderCalendarGridUI();

        if (window.showToast) {
            window.showToast(`✓ Lembretes pré-preenchidos com sucesso: ${template.name}!`);
        }
    }

    function renderReminderTemplateBlocksList() {
        const container = document.getElementById('reminder-template-blocks-list');
        if (!container) return;

        const tpl = reminderTemplates.find(t => t.id === currentEditingReminderTemplateSlotId);
        if (!tpl || !tpl.blocks || tpl.blocks.length === 0) {
            container.innerHTML = `
                <div class="p-6 text-center text-xs font-mono text-gray-500 rounded-xl border border-dashed border-white/10">
                    Nenhum lembrete neste modelo. Clique em "＋ Novo Lembrete" ou "📥 Copiar da Semana Atual".
                </div>
            `;
            return;
        }

        const days = [
            { id: 'ALL', label: 'Diário (Todos os Dias)' },
            { id: 'DOM', label: 'Domingo' },
            { id: 'SEG', label: 'Segunda-feira' },
            { id: 'TER', label: 'Terça-feira' },
            { id: 'QUA', label: 'Quarta-feira' },
            { id: 'QUI', label: 'Quinta-feira' },
            { id: 'SEX', label: 'Sexta-feira' },
            { id: 'SAB', label: 'Sábado' }
        ];

        container.innerHTML = tpl.blocks.map((b, idx) => `
            <div class="p-2.5 rounded-xl bg-white/[0.03] border border-white/10 flex items-center justify-between gap-2 text-xs font-mono">
                <div class="flex items-center gap-2 flex-1 flex-wrap sm:flex-nowrap">
                    <select onchange="window.ControlEngine.updateReminderTemplateBlockField(${idx}, 'day_of_week', this.value)" class="input-glass rounded-lg px-2 py-1 text-[11px] font-bold text-purple-300 min-h-[30px] cursor-pointer">
                        ${days.map(d => `<option value="${d.id}" ${b.day_of_week === d.id ? 'selected' : ''}>${d.label}</option>`).join('')}
                    </select>
                    <input type="text" value="${escapeHtml(b.title)}" onchange="window.ControlEngine.updateReminderTemplateBlockField(${idx}, 'title', this.value)" placeholder="Título do lembrete" class="input-glass rounded-lg px-2 py-1 text-xs text-white font-bold flex-1 min-h-[30px]" />
                    <input type="time" value="${b.target_time || '08:00'}" onchange="window.ControlEngine.updateReminderTemplateBlockField(${idx}, 'target_time', this.value)" class="input-glass rounded-lg px-2 py-1 text-[11px] text-gray-200 min-h-[30px]" />
                    <button type="button" onclick="window.ControlEngine.updateReminderTemplateBlockField(${idx}, 'has_sound', !${b.has_sound !== false}); window.ControlEngine.renderReminderTemplateBlocksList();" class="px-2 py-1 rounded-lg border text-xs cursor-pointer ${b.has_sound !== false ? 'bg-purple-500/20 text-purple-300 border-purple-500/40' : 'bg-white/5 text-gray-500 border-white/10'}" title="Alternar Alarme Sonoro">
                        ${b.has_sound !== false ? '🔊 Som' : '🔇 Mudo'}
                    </button>
                </div>
                <button type="button" onclick="window.ControlEngine.removeBlockFromEditingReminderTemplate(${idx})" class="p-1 text-gray-400 hover:text-rose-400 transition text-sm cursor-pointer shrink-0" title="Remover lembrete deste modelo">
                    ✕
                </button>
            </div>
        `).join('');
    }

    function updateReminderTemplateBlockField(index, field, value) {
        const tpl = reminderTemplates.find(t => t.id === currentEditingReminderTemplateSlotId);
        if (!tpl || !tpl.blocks || !tpl.blocks[index]) return;
        tpl.blocks[index][field] = value;
    }

    function addBlockToEditingReminderTemplate() {
        const tpl = reminderTemplates.find(t => t.id === currentEditingReminderTemplateSlotId);
        if (!tpl) return;
        if (!tpl.blocks) tpl.blocks = [];
        tpl.blocks.push({
            title: 'Novo Lembrete Programado',
            day_of_week: 'ALL',
            target_time: '08:00',
            has_sound: true
        });
        const countEl = document.getElementById('reminder-template-blocks-count');
        if (countEl) countEl.innerText = `${tpl.blocks.length} lembretes`;
        renderReminderTemplateBlocksList();
    }

    function removeBlockFromEditingReminderTemplate(index) {
        const tpl = reminderTemplates.find(t => t.id === currentEditingReminderTemplateSlotId);
        if (!tpl || !tpl.blocks) return;
        tpl.blocks.splice(index, 1);
        const countEl = document.getElementById('reminder-template-blocks-count');
        if (countEl) countEl.innerText = `${tpl.blocks.length} lembretes`;
        renderReminderTemplateBlocksList();
    }

    async function copyCurrentWeekToEditingReminderTemplate() {
        const tpl = reminderTemplates.find(t => t.id === currentEditingReminderTemplateSlotId);
        if (!tpl) return;
        const confirmed = window.glassConfirm ? await window.glassConfirm(`Deseja substituir os lembretes do "${tpl.name}" pelos ${remindersList.length} lembretes atuais?`, 'Substituir Lembretes do Modelo', 'Substituir', 'Cancelar', false, '📥') : confirm(`Deseja substituir os lembretes?`);
        if (!confirmed) return;

        tpl.blocks = remindersList.map(r => ({
            title: r.title,
            day_of_week: r.reminder_type === 'daily' ? 'ALL' : (r.day_of_week || 'ALL'),
            target_time: r.target_time || '08:00',
            has_sound: r.has_sound !== false
        }));

        const countEl = document.getElementById('reminder-template-blocks-count');
        if (countEl) countEl.innerText = `${tpl.blocks.length} lembretes`;
        renderReminderTemplateBlocksList();

        if (window.showToast) {
            window.showToast('✓ Lembretes copiados para o modelo. Clique em "Salvar Modelo".');
        }
    }

    async function saveEditingReminderTemplateChanges() {
        const tpl = reminderTemplates.find(t => t.id === currentEditingReminderTemplateSlotId);
        if (!tpl) return;

        const inputName = document.getElementById('reminder-template-edit-name');
        const inputDesc = document.getElementById('reminder-template-edit-desc');

        if (inputName && inputName.value.trim()) tpl.name = inputName.value.trim();
        if (inputDesc) tpl.description = inputDesc.value.trim();
        tpl.updated_at = new Date().toISOString();

        saveLocalStorageBackup();
        renderReminderConfigTemplatesSelector();

        if (window.showToast) {
            window.showToast(`✓ Modelo "${tpl.name}" salvo com sucesso!`);
        }
    }

    function renderReminderSessionColorPickerInConfig() {
        const container = document.getElementById('reminder-session-color-picker-container');
        if (!container) return;
        const currentAccent = sessionAccentColors['reminders'] || '#c084fc';
        container.innerHTML = `
            <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
                ${SESSION_COLOR_PALETTES.map(p => {
                    const isSelected = p.hex.toLowerCase() === currentAccent.toLowerCase();
                    return `
                        <button type="button" onclick="window.ControlEngine.applySessionAccentColor('reminders', '${p.hex}', '${p.name}'); renderReminderSessionColorPickerInConfig();" class="p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${isSelected ? 'ring-2 ring-white border-white bg-white/20' : 'border-white/10 hover:border-white/30 bg-white/[0.04]'}">
                            <span class="w-6 h-6 rounded-full shadow-inner border border-white/20" style="background: ${p.hex}"></span>
                            <span class="text-[9px] font-mono text-gray-300 truncate w-full">${p.name}</span>
                        </button>
                    `;
                }).join('')}
            </div>
        `;
    }

    
    // =========================================================================
    // SELETOR UNIVERSAL DE CORES (ROBUSTO, COM PRESETS E COLOR PICKER LIVRE)
    // =========================================================================

    function renderUniversalColorPicker(sectionKey, containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        const currentHex = sessionAccentColors[sectionKey] || SESSION_DEFAULT_COLORS[sectionKey] || '#10b981';

        container.innerHTML = `
            <div class="space-y-3.5">
                <!-- Preview Ativo e Custom Picker -->
                <div class="p-3.5 rounded-2xl bg-white/[0.04] border border-white/15 flex items-center justify-between gap-3 flex-wrap">
                    <div class="flex items-center gap-3">
                        <span class="w-8 h-8 rounded-xl shadow-lg border-2 border-white/40 shrink-0 transition-transform duration-300 scale-105" id="${containerId}-preview-dot" style="background: ${currentHex};"></span>
                        <div>
                            <span class="text-xs font-mono font-bold text-white block">Cor Atual: <span id="${containerId}-preview-hex" class="text-emerald-300 uppercase">${currentHex}</span></span>
                            <span class="text-[10px] font-mono text-gray-400">Clique na paleta ou selecione qualquer cor hexadecimal</span>
                        </div>
                    </div>
                    <div class="flex items-center gap-2">
                        <input type="color" value="${currentHex}" onchange="window.ControlEngine.setUniversalColorCustom('${sectionKey}', this.value, '${containerId}')" class="w-9 h-9 rounded-xl border border-white/30 cursor-pointer bg-transparent" title="Abrir Seletor Livre de Cores" />
                        <button type="button" onclick="window.ControlEngine.resetUniversalColorDefault('${sectionKey}', '${containerId}')" class="px-2.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 font-mono text-xs cursor-pointer transition" title="Restaurar padrão">
                            ↺ Padrão
                        </button>
                    </div>
                </div>

                <!-- 18 Presets Vibrantes -->
                <div>
                    <label class="block text-[10px] font-mono text-gray-400 uppercase mb-2 font-bold">18 Tons Curados & Neons:</label>
                    <div class="grid grid-cols-3 sm:grid-cols-6 gap-2">
                        ${SESSION_COLOR_PRESETS.map(p => {
                            const isSelected = p.hex.toLowerCase() === currentHex.toLowerCase();
                            return `
                                <button type="button" onclick="window.ControlEngine.setUniversalColorCustom('${sectionKey}', '${p.hex}', '${containerId}')" class="p-2 rounded-xl border text-center transition cursor-pointer flex flex-col items-center gap-1.5 ${isSelected ? 'ring-2 ring-white border-white bg-white/20 scale-105 shadow-lg' : 'border-white/10 hover:border-white/30 bg-white/[0.04]'}">
                                    <span class="w-5 h-5 rounded-full shadow-inner border border-white/20" style="background: ${p.hex}"></span>
                                    <span class="text-[9px] font-mono text-gray-300 truncate w-full">${p.name}</span>
                                </button>
                            `;
                        }).join('')}
                    </div>
                </div>
            </div>
        `;
    }

    function setUniversalColorCustom(sectionKey, hex, containerId) {
        if (!hex || !hex.startsWith('#')) return;
        sessionAccentColors[sectionKey] = hex;
        applySessionAccentColor(sectionKey, hex, true);
        if (containerId) {
            renderUniversalColorPicker(sectionKey, containerId);
        }
        if (window.showToast) {
            window.showToast(`🎨 Cor de destaque atualizada para ${hex.toUpperCase()}!`);
        }
    }

    function resetUniversalColorDefault(sectionKey, containerId) {
        const def = SESSION_DEFAULT_COLORS[sectionKey] || '#10b981';
        setUniversalColorCustom(sectionKey, def, containerId);
    }

    // =========================================================================
    // MODAL INTELIGENTE: COPIAR SEMANA ATUAL COMO NOVO MODELO
    // =========================================================================

    let currentCopyWeekSection = 'studies';

    function openCopyWeekAsTemplateModal(sectionKey) {
        currentCopyWeekSection = sectionKey || 'studies';
        const modal = document.getElementById('copy-week-template-modal');
        if (!modal) return;

        const iconEl = document.getElementById('copy-week-modal-icon');
        const titleEl = document.getElementById('copy-week-modal-title');
        const subEl = document.getElementById('copy-week-modal-subtitle');
        const countBadge = document.getElementById('copy-week-items-count-badge');
        const previewList = document.getElementById('copy-week-items-preview-list');
        const slotSelect = document.getElementById('copy-week-destination-slot');
        const nameInput = document.getElementById('copy-week-template-name');
        const descInput = document.getElementById('copy-week-template-desc');

        const now = new Date();
        const dateStr = `${String(now.getDate()).padStart(2, '0')}/${String(now.getMonth() + 1).padStart(2, '0')}`;

        let items = [];
        let sectionName = 'Rotina de Estudos';
        let sectionIcon = '🌐';
        let templatesArray = studyTemplates;

        if (sectionKey === 'todos') {
            sectionName = 'To-Do Personals';
            sectionIcon = '⚡';
            templatesArray = todoTemplates;
            items = todosList.map(t => ({
                day: (t.due_date ? ['DOM','SEG','TER','QUA','QUI','SEX','SAB'][new Date(t.due_date + 'T12:00:00').getDay()] : 'SEG'),
                title: t.title,
                time: t.due_time || '10:00',
                detail: t.priority ? `Prioridade ${t.priority.toUpperCase()}` : ''
            }));
        } else if (sectionKey === 'reminders') {
            sectionName = 'Lembretes & Alarmes';
            sectionIcon = '⏰';
            templatesArray = reminderTemplates;
            items = remindersList.map(r => ({
                day: r.reminder_type === 'daily' ? 'DIÁRIO' : (r.day_of_week || 'ALL'),
                title: r.title,
                time: r.target_time || '08:00',
                detail: r.has_sound !== false ? '🔊 Com som' : '🔇 Silencioso'
            }));
        } else {
            // studies
            sectionName = 'Rotina de Estudos';
            sectionIcon = '🌐';
            templatesArray = studyTemplates;
            items = studyBlocks.filter(b => b.is_active !== false).map(b => ({
                day: b.day_of_week || 'SEG',
                title: b.title,
                time: `${b.start_time || '08:30'} - ${b.end_time || '13:30'}`,
                detail: b.tag || 'Estudo'
            }));
        }

        if (iconEl) iconEl.innerText = sectionIcon;
        if (titleEl) titleEl.innerText = `Copiar Semana: ${sectionName}`;
        if (subEl) subEl.innerText = `Salve os ${items.length} itens ativos para reutilizar como um modelo`;
        if (countBadge) countBadge.innerText = `${items.length} itens encontrados`;

        if (previewList) {
            if (items.length === 0) {
                previewList.innerHTML = '<div class="text-gray-500 italic p-2 text-center">Nenhum item ativo encontrado nesta semana.</div>';
            } else {
                previewList.innerHTML = items.slice(0, 15).map(item => `
                    <div class="flex items-center justify-between p-1.5 rounded-lg bg-white/[0.02] border border-white/5">
                        <div class="flex items-center gap-2 truncate">
                            <span class="px-1.5 py-0.5 rounded text-[9px] bg-white/10 text-sky-300 font-bold">${item.day}</span>
                            <span class="truncate text-white font-medium">${escapeHtml(item.title)}</span>
                        </div>
                        <span class="text-[9px] text-gray-400 shrink-0 ml-2">${item.time}</span>
                    </div>
                `).join('') + (items.length > 15 ? `<div class="text-[9px] text-gray-500 text-center pt-1">+ mais ${items.length - 15} itens...</div>` : '');
            }
        }

        if (slotSelect) {
            let options = `<option value="new" selected>🌟 Criar um NOVO Modelo Personalizado</option>`;
            templatesArray.forEach((t, idx) => {
                options += `<option value="${t.id}">Sobrescrever: ${escapeHtml(t.name)} (${(t.blocks || []).length} itens atuais)</option>`;
            });
            slotSelect.innerHTML = options;
        }

        if (nameInput) nameInput.value = `Semana Capturada — ${dateStr}`;
        if (descInput) descInput.value = `Modelo salvo automaticamente a partir da semana em ${dateStr}`;

        modal.classList.remove('hidden');
    }

    function closeCopyWeekAsTemplateModal() {
        const modal = document.getElementById('copy-week-template-modal');
        if (modal) modal.classList.add('hidden');
    }

    async function executeCopyWeekToTemplate(event) {
        if (event) event.preventDefault();

        const slot = document.getElementById('copy-week-destination-slot')?.value || 'new';
        const name = (document.getElementById('copy-week-template-name')?.value || 'Novo Modelo').trim();
        const desc = (document.getElementById('copy-week-template-desc')?.value || '').trim();

        if (currentCopyWeekSection === 'todos') {
            const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
            const blocks = todosList.map(t => {
                let day = 'SEG';
                if (t.due_date) {
                    try {
                        const parts = t.due_date.split('-');
                        day = days[new Date(parseInt(parts[0]), parseInt(parts[1])-1, parseInt(parts[2])).getDay()];
                    } catch(e){}
                }
                return {
                    title: t.title,
                    day_of_week: day,
                    due_time: t.due_time || '10:00',
                    priority: t.priority || 'normal'
                };
            });

            if (slot === 'new') {
                const newId = 'todo_template_' + Date.now();
                todoTemplates.push({ id: newId, name, description: desc, color: '#10b981', blocks });
                currentEditingTodoTemplateSlotId = newId;
            } else {
                const target = todoTemplates.find(t => t.id === slot);
                if (target) {
                    target.name = name;
                    target.description = desc;
                    target.blocks = blocks;
                    target.updated_at = new Date().toISOString();
                }
            }
            saveLocalStorageBackup();
            closeCopyWeekAsTemplateModal();
            openTodoConfigModal();
            if (window.showToast) window.showToast(`✓ Modelo de tarefas "${name}" salvo com ${blocks.length} itens!`);
        } else if (currentCopyWeekSection === 'reminders') {
            const blocks = remindersList.map(r => ({
                title: r.title,
                day_of_week: r.reminder_type === 'daily' ? 'ALL' : (r.day_of_week || 'ALL'),
                target_time: r.target_time || '08:00',
                has_sound: r.has_sound !== false
            }));

            if (slot === 'new') {
                const newId = 'reminder_template_' + Date.now();
                reminderTemplates.push({ id: newId, name, description: desc, color: '#8b5cf6', blocks });
                currentEditingReminderTemplateSlotId = newId;
            } else {
                const target = reminderTemplates.find(t => t.id === slot);
                if (target) {
                    target.name = name;
                    target.description = desc;
                    target.blocks = blocks;
                    target.updated_at = new Date().toISOString();
                }
            }
            saveLocalStorageBackup();
            closeCopyWeekAsTemplateModal();
            openReminderConfigModal();
            if (window.showToast) window.showToast(`✓ Modelo de lembretes "${name}" salvo com ${blocks.length} itens!`);
        } else {
            // studies
            const blocks = studyBlocks.filter(b => b.is_active !== false).map(b => ({
                title: b.title,
                day_of_week: b.day_of_week || 'SEG',
                start_time: b.start_time || '08:30',
                end_time: b.end_time || '13:30',
                tag: b.tag || b.title,
                color: b.color || '#e67c73',
                notes: b.notes || ''
            }));

            if (slot === 'new') {
                const newId = 'template_' + Date.now();
                studyTemplates.push({ id: newId, name, description: desc, color: '#0ea5e9', blocks });
                currentEditingTemplateSlotId = newId;
            } else {
                const target = studyTemplates.find(t => t.id === slot);
                if (target) {
                    target.name = name;
                    target.description = desc;
                    target.blocks = blocks;
                    target.updated_at = new Date().toISOString();
                }
            }
            saveLocalStorageBackup();
            closeCopyWeekAsTemplateModal();
            openStudyConfigModal();
            if (window.showToast) window.showToast(`✓ Modelo de estudos "${name}" salvo com ${blocks.length} matérias!`);
        }
    }

    // =========================================================================
    // INTELIGÊNCIA, LOAD BALANCE & ANALYTICS
    // =========================================================================

    function renderStudyAnalytics() {
        const container = document.getElementById('study-analytics-content');
        if (!container) return;

        const activeBlocks = studyBlocks.filter(b => b.is_active !== false);
        const days = ['DOM', 'SEG', 'TER', 'QUA', 'QUI', 'SEX', 'SAB'];
        const minutesPerDay = { 'DOM': 0, 'SEG': 0, 'TER': 0, 'QUA': 0, 'QUI': 0, 'SEX': 0, 'SAB': 0 };
        const subjectMinutes = {};

        activeBlocks.forEach(b => {
            const day = b.day_of_week || 'SEG';
            const sParts = (b.start_time || '08:00').split(':');
            const eParts = (b.end_time || '12:00').split(':');
            const sMin = parseInt(sParts[0], 10) * 60 + parseInt(sParts[1], 10);
            const eMin = parseInt(eParts[0], 10) * 60 + parseInt(eParts[1], 10);
            const diff = Math.max(0, eMin - sMin);
            minutesPerDay[day] = (minutesPerDay[day] || 0) + diff;
            subjectMinutes[b.title] = (subjectMinutes[b.title] || 0) + diff;
        });

        const totalMinutes = Object.values(minutesPerDay).reduce((a, b) => a + b, 0);
        const totalHours = (totalMinutes / 60).toFixed(1);
        const dailyAvg = (totalMinutes / 7 / 60).toFixed(1);

        let maxDay = 'SEG';
        let maxMin = 0;
        days.forEach(d => {
            if (minutesPerDay[d] > maxMin) {
                maxMin = minutesPerDay[d];
                maxDay = d;
            }
        });

        const isOverloaded = maxMin > 480; // > 8h

        container.innerHTML = `
            <!-- Cards de Métricas Principais -->
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <span class="text-[10px] font-mono text-gray-400 block uppercase">Carga Semanal Total</span>
                    <span class="text-lg sm:text-xl font-mono font-bold text-sky-300">${totalHours}h</span>
                    <span class="text-[9px] font-mono text-gray-400 block">${totalMinutes} minutos</span>
                </div>
                <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <span class="text-[10px] font-mono text-gray-400 block uppercase">Média Diária</span>
                    <span class="text-lg sm:text-xl font-mono font-bold text-emerald-400">${dailyAvg}h/dia</span>
                    <span class="text-[9px] font-mono text-gray-400 block">7 dias calculados</span>
                </div>
                <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <span class="text-[10px] font-mono text-gray-400 block uppercase">Dia Mais Intenso</span>
                    <span class="text-lg sm:text-xl font-mono font-bold text-purple-400">${maxDay}</span>
                    <span class="text-[9px] font-mono text-gray-400 block">${(maxMin/60).toFixed(1)}h alocadas</span>
                </div>
                <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <span class="text-[10px] font-mono text-gray-400 block uppercase">Disciplinas Ativas</span>
                    <span class="text-lg sm:text-xl font-mono font-bold text-amber-300">${Object.keys(subjectMinutes).length}</span>
                    <span class="text-[9px] font-mono text-gray-400 block">${activeBlocks.length} blocos</span>
                </div>
            </div>

            ${isOverloaded ? `
                <div class="p-3 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center gap-2.5 text-xs font-mono text-amber-200">
                    <span>⚠️</span>
                    <span><strong>Alerta de Sobrecarga:</strong> ${maxDay} possui mais de 8 horas programadas (${(maxMin/60).toFixed(1)}h). Recomenda-se redistribuir.</span>
                </div>
            ` : ''}

            <!-- Gráfico de Carga por Dia da Semana -->
            <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2">
                <span class="text-xs font-mono font-bold text-white uppercase block">Distribuição da Carga por Dia (Horas):</span>
                <div class="grid grid-cols-7 gap-1.5 text-center font-mono">
                    ${days.map(d => {
                        const h = (minutesPerDay[d] / 60).toFixed(1);
                        const pct = totalMinutes > 0 ? Math.round((minutesPerDay[d] / totalMinutes) * 100) : 0;
                        const barHeight = Math.max(12, Math.min(100, Math.round((minutesPerDay[d] / 480) * 100)));
                        return `
                            <div class="flex flex-col items-center gap-1">
                                <span class="text-[10px] text-gray-400 font-bold">${h}h</span>
                                <div class="w-full bg-white/5 rounded-t-lg h-24 flex items-end justify-center p-1">
                                    <div class="w-full rounded-t-md transition-all duration-500 ${minutesPerDay[d] > 360 ? 'bg-gradient-to-t from-purple-500 to-rose-500' : 'bg-gradient-to-t from-sky-600 to-cyan-400'}" style="height: ${barHeight}%;"></div>
                                </div>
                                <span class="text-[11px] font-bold text-white">${d}</span>
                                <span class="text-[8px] text-gray-500">${pct}%</span>
                            </div>
                        `;
                    }).join('')}
                </div>
            </div>
        `;
    }

    function renderTodoAnalytics() {
        const container = document.getElementById('todo-analytics-content');
        if (!container) return;

        const total = todosList.length;
        const completed = todosList.filter(t => t.is_completed).length;
        const pending = total - completed;
        const pct = total > 0 ? Math.round((completed / total) * 100) : 0;

        const urgent = todosList.filter(t => t.priority === 'urgent').length;
        const high = todosList.filter(t => t.priority === 'high').length;
        const normal = todosList.filter(t => !t.priority || t.priority === 'normal').length;
        const low = todosList.filter(t => t.priority === 'low').length;

        container.innerHTML = `
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <span class="text-[10px] font-mono text-gray-400 block uppercase">Total de Tarefas</span>
                    <span class="text-lg sm:text-xl font-mono font-bold text-white">${total}</span>
                    <span class="text-[9px] font-mono text-gray-400 block">Cadastradas</span>
                </div>
                <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <span class="text-[10px] font-mono text-gray-400 block uppercase">Concluídas</span>
                    <span class="text-lg sm:text-xl font-mono font-bold text-emerald-400">${completed}</span>
                    <span class="text-[9px] font-mono text-emerald-300 block">${pct}% de taxa</span>
                </div>
                <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <span class="text-[10px] font-mono text-gray-400 block uppercase">Pendentes</span>
                    <span class="text-lg sm:text-xl font-mono font-bold text-amber-300">${pending}</span>
                    <span class="text-[9px] font-mono text-gray-400 block">A realizar</span>
                </div>
                <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <span class="text-[10px] font-mono text-gray-400 block uppercase">Críticas / Urgentes</span>
                    <span class="text-lg sm:text-xl font-mono font-bold text-rose-400">${urgent + high}</span>
                    <span class="text-[9px] font-mono text-rose-300 block">${urgent} urgentes</span>
                </div>
            </div>

            <!-- Matriz de Prioridades -->
            <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/10 space-y-2.5">
                <span class="text-xs font-mono font-bold text-white uppercase block">Distribuição de Esforço por Prioridade:</span>
                <div class="space-y-2">
                    <div>
                        <div class="flex justify-between text-xs font-mono text-rose-300 mb-1"><span>🔥 Urgente</span><span>${urgent} (${total>0?Math.round(urgent/total*100):0}%)</span></div>
                        <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden"><div class="bg-rose-500 h-full rounded-full" style="width: ${total>0?(urgent/total*100):0}%"></div></div>
                    </div>
                    <div>
                        <div class="flex justify-between text-xs font-mono text-amber-300 mb-1"><span>⚡ Alta</span><span>${high} (${total>0?Math.round(high/total*100):0}%)</span></div>
                        <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden"><div class="bg-amber-500 h-full rounded-full" style="width: ${total>0?(high/total*100):0}%"></div></div>
                    </div>
                    <div>
                        <div class="flex justify-between text-xs font-mono text-emerald-300 mb-1"><span>🟢 Normal</span><span>${normal} (${total>0?Math.round(normal/total*100):0}%)</span></div>
                        <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden"><div class="bg-emerald-500 h-full rounded-full" style="width: ${total>0?(normal/total*100):0}%"></div></div>
                    </div>
                    <div>
                        <div class="flex justify-between text-xs font-mono text-gray-400 mb-1"><span>🌱 Baixa</span><span>${low} (${total>0?Math.round(low/total*100):0}%)</span></div>
                        <div class="w-full bg-white/10 rounded-full h-2 overflow-hidden"><div class="bg-gray-400 h-full rounded-full" style="width: ${total>0?(low/total*100):0}%"></div></div>
                    </div>
                </div>
            </div>
        `;
    }

    function renderReminderAnalytics() {
        const container = document.getElementById('reminder-analytics-content');
        if (!container) return;

        const total = remindersList.length;
        const daily = remindersList.filter(r => r.reminder_type === 'daily' || r.day_of_week === 'ALL').length;
        const weekly = total - daily;
        const withSound = remindersList.filter(r => r.has_sound !== false).length;
        const silent = total - withSound;

        container.innerHTML = `
            <div class="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
                <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <span class="text-[10px] font-mono text-gray-400 block uppercase">Total de Alarmes</span>
                    <span class="text-lg sm:text-xl font-mono font-bold text-white">${total}</span>
                    <span class="text-[9px] font-mono text-gray-400 block">Configurados</span>
                </div>
                <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <span class="text-[10px] font-mono text-gray-400 block uppercase">Rotina Diária</span>
                    <span class="text-lg sm:text-xl font-mono font-bold text-purple-400">${daily}</span>
                    <span class="text-[9px] font-mono text-gray-400 block">Disparam todos os dias</span>
                </div>
                <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <span class="text-[10px] font-mono text-gray-400 block uppercase">Alarme Sonoro</span>
                    <span class="text-lg sm:text-xl font-mono font-bold text-emerald-400">${withSound}</span>
                    <span class="text-[9px] font-mono text-gray-400 block">Com áudio ativo</span>
                </div>
                <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 text-center">
                    <span class="text-[10px] font-mono text-gray-400 block uppercase">Modo Silencioso</span>
                    <span class="text-lg sm:text-xl font-mono font-bold text-gray-400">${silent}</span>
                    <span class="text-[9px] font-mono text-gray-400 block">Notificação visual</span>
                </div>
            </div>

            <!-- Teste de Áudio do Alarme -->
            <div class="p-4 rounded-2xl bg-white/[0.02] border border-white/10 flex items-center justify-between gap-3 flex-wrap">
                <div>
                    <span class="text-xs font-mono font-bold text-white block">Sintetizador de Áudio do Alarme:</span>
                    <span class="text-[10px] font-mono text-gray-400">Verifique a reprodução sonora no seu dispositivo</span>
                </div>
                <button type="button" onclick="window.ControlEngine.playTestAlarmSound()" class="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/35 border border-purple-500/40 text-purple-200 font-mono text-xs font-bold transition cursor-pointer active:scale-95 flex items-center gap-2">
                    <span>🔔</span> <span>Testar Som do Alarme</span>
                </button>
            </div>
        `;
    }

    function playTestAlarmSound() {
        try {
            const ctx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();

            osc.type = 'sine';
            osc.frequency.setValueAtTime(880, ctx.currentTime);
            osc.frequency.exponentialRampToValueAtTime(1046.5, ctx.currentTime + 0.15);

            gain.gain.setValueAtTime(0.3, ctx.currentTime);
            gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);

            osc.connect(gain);
            gain.connect(ctx.destination);

            osc.start();
            osc.stop(ctx.currentTime + 0.45);
            if (window.showToast) window.showToast('🔔 Sinal sonoro de teste emitido!');
        } catch(e) {
            console.error('Erro ao tocar som de teste:', e);
        }
    }

    // =========================================================================
    // AÇÕES EM MASSA & FERRAMENTAS INTELIGENTES
    // =========================================================================

    function shiftScheduleTimes(sectionKey, deltaMinutes) {
        if (!deltaMinutes) return;

        function shiftTimeStr(tStr, delta) {
            if (!tStr || !tStr.includes(':')) return tStr;
            const parts = tStr.split(':');
            let m = parseInt(parts[0], 10) * 60 + parseInt(parts[1], 10) + delta;
            if (m < 0) m = 0;
            if (m > 1439) m = 1439;
            const h = String(Math.floor(m / 60)).padStart(2, '0');
            const min = String(m % 60).padStart(2, '0');
            return `${h}:${min}`;
        }

        if (sectionKey === 'todos') {
            todosList.forEach(t => {
                if (t.due_time) t.due_time = shiftTimeStr(t.due_time, deltaMinutes);
            });
            saveLocalStorageBackup();
            renderControlUI();
            renderTodoMatrixTableGridUI();
            if (typeof renderTodoCalendarGridUI === 'function') renderTodoCalendarGridUI();
        } else if (sectionKey === 'reminders') {
            remindersList.forEach(r => {
                if (r.target_time) r.target_time = shiftTimeStr(r.target_time, deltaMinutes);
            });
            saveLocalStorageBackup();
            renderControlUI();
            renderReminderMatrixTableGridUI();
            if (typeof renderReminderCalendarGridUI === 'function') renderReminderCalendarGridUI();
        } else if (sectionKey === 'studies') {
            studyBlocks.forEach(b => {
                if (b.start_time) b.start_time = shiftTimeStr(b.start_time, deltaMinutes);
                if (b.end_time) b.end_time = shiftTimeStr(b.end_time, deltaMinutes);
            });
            saveLocalStorageBackup();
            renderStudyScheduleUI();
            renderStudyTableGridUI();
            renderStudyAnalytics();
        }

        const sign = deltaMinutes > 0 ? `+${deltaMinutes}` : `${deltaMinutes}`;
        if (window.showToast) window.showToast(`⏱️ Horários deslocados em ${sign} minutos com sucesso!`);
    }

    async function clearCompletedTodos() {
        const count = todosList.filter(t => t.is_completed).length;
        if (count === 0) {
            if (window.showToast) window.showToast('ℹ️ Não há tarefas concluídas para limpar.');
            return;
        }
        const confirmed = window.glassConfirm ? await window.glassConfirm(`Deseja remover as ${count} tarefas marcadas como concluídas?`, 'Limpar Concluídas', 'Limpar', 'Cancelar', true, '🧹') : confirm(`Deseja remover as ${count} tarefas marcadas como concluídas?`);
        if (!confirmed) return;
        todosList = todosList.filter(t => !t.is_completed);
        saveLocalStorageBackup();
        renderControlUI();
        renderTodoMatrixTableGridUI();
        renderTodoAnalytics();
        if (typeof renderTodoCalendarGridUI === 'function') renderTodoCalendarGridUI();
        if (window.showToast) window.showToast(`✓ ${count} tarefas concluídas foram removidas!`);
    }

    function postponePendingTodosToTomorrow() {
        const now = getBrasiliaDate();
        const tomorrow = new Date(now);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = formatISODate(tomorrow);

        let count = 0;
        todosList.forEach(t => {
            if (!t.is_completed) {
                t.due_date = tomorrowStr;
                count++;
            }
        });

        saveLocalStorageBackup();
        renderControlUI();
        renderTodoMatrixTableGridUI();
        renderTodoAnalytics();
        if (typeof renderTodoCalendarGridUI === 'function') renderTodoCalendarGridUI();
        if (window.showToast) window.showToast(`⏩ ${count} tarefas pendentes adiadas para amanhã (${tomorrowStr})!`);
    }

    function toggleAllRemindersSound(activate) {
        remindersList.forEach(r => r.has_sound = !!activate);
        saveLocalStorageBackup();
        renderControlUI();
        renderReminderMatrixTableGridUI();
        renderReminderAnalytics();
        if (window.showToast) window.showToast(activate ? '🔊 Som ativado em todos os lembretes!' : '🔇 Todos os lembretes silenciados.');
    }

    async function resetSectionWeek(sectionKey) {
        const confirmed = window.glassConfirm ? await window.glassConfirm(`Tem certeza que deseja limpar todos os itens da semana ativa nesta seção?\nEsta ação não poderá ser desfeita.`, 'Limpar Semana Ativa', 'Limpar Tudo', 'Cancelar', true, '⚠️') : confirm(`Tem certeza que deseja limpar todos os itens?`);
        if (!confirmed) return;

        if (sectionKey === 'todos') {
            todosList = [];
            saveLocalStorageBackup();
            renderControlUI();
            renderTodoMatrixTableGridUI();
            renderTodoAnalytics();
            if (typeof renderTodoCalendarGridUI === 'function') renderTodoCalendarGridUI();
        } else if (sectionKey === 'reminders') {
            remindersList = [];
            saveLocalStorageBackup();
            renderControlUI();
            renderReminderMatrixTableGridUI();
            renderReminderAnalytics();
            if (typeof renderReminderCalendarGridUI === 'function') renderReminderCalendarGridUI();
        } else if (sectionKey === 'studies') {
            studyBlocks = [];
            saveLocalStorageBackup();
            renderStudyScheduleUI();
            renderStudyTableGridUI();
            renderStudyAnalytics();
        }

        if (window.showToast) window.showToast('🧹 Semana limpa com sucesso!');
    }

    async function exportTemplatesToClipboard(sectionKey) {
        let tpls = [];
        if (sectionKey === 'todos') tpls = todoTemplates;
        else if (sectionKey === 'reminders') tpls = reminderTemplates;
        else tpls = studyTemplates;

        const jsonStr = JSON.stringify(tpls, null, 2);
        try {
            await navigator.clipboard.writeText(jsonStr);
            if (window.showToast) window.showToast('📋 JSON dos modelos copiado para a área de transferência!');
        } catch (e) {
            if (window.glassPrompt) {
                await window.glassPrompt('JSON exportado dos seus modelos:', jsonStr, 'Exportar Modelos', '', 'Fechar', 'OK', '📦');
            }
        }
    }

    async function promptImportTemplates(sectionKey) {
        const raw = window.glassPrompt ? await window.glassPrompt('Cole o JSON dos modelos que deseja importar:', '', 'Importar Modelos', 'Cole aqui o JSON...', 'Importar', 'Cancelar', '📥') : prompt('Cole o JSON dos modelos que deseja importar:');
        if (!raw) return;

        try {
            const parsed = JSON.parse(raw);
            if (!Array.isArray(parsed)) throw new Error('Formato inválido: esperava uma lista de modelos.');

            if (sectionKey === 'todos') {
                todoTemplates = parsed;
                renderTodoConfigTemplatesSelector();
            } else if (sectionKey === 'reminders') {
                reminderTemplates = parsed;
                renderReminderConfigTemplatesSelector();
            } else {
                studyTemplates = parsed;
                renderStudyConfigTemplatesSelector();
            }

            saveLocalStorageBackup();
            if (window.showToast) window.showToast(`✓ ${parsed.length} modelos importados com sucesso!`);
        } catch(e) {
            if (window.glassAlert) window.glassAlert('Falha ao importar: ' + e.message, 'Erro de Importação', '⚠️'); else alert('Falha ao importar: ' + e.message);
        }
    }

    function addNewCustomTodoTemplate() {
        const id = 'todo_template_' + Date.now();
        const num = todoTemplates.length + 1;
        todoTemplates.push({
            id,
            name: `Modelo ${num} — Personalizado`,
            description: 'Novo modelo criado pelo usuário',
            color: '#10b981',
            blocks: []
        });
        selectTodoConfigTemplate(id);
    }

    function addNewCustomReminderTemplate() {
        const id = 'reminder_template_' + Date.now();
        const num = reminderTemplates.length + 1;
        reminderTemplates.push({
            id,
            name: `Modelo ${num} — Personalizado`,
            description: 'Novo modelo de lembretes criado pelo usuário',
            color: '#8b5cf6',
            blocks: []
        });
        selectReminderConfigTemplate(id);
    }

    function addNewCustomStudyTemplate() {
        const id = 'template_' + Date.now();
        const num = studyTemplates.length + 1;
        studyTemplates.push({
            id,
            name: `Modelo ${num} — Personalizado`,
            description: 'Novo modelo de estudos criado pelo usuário',
            color: '#0ea5e9',
            blocks: []
        });
        selectStudyConfigTemplate(id);
    }

    function duplicateCurrentTodoTemplate() {
        const current = todoTemplates.find(t => t.id === currentEditingTodoTemplateSlotId);
        if (!current) return;
        const newId = 'todo_template_' + Date.now();
        todoTemplates.push({
            id: newId,
            name: `${current.name} (Cópia)`,
            description: current.description,
            color: current.color,
            blocks: JSON.parse(JSON.stringify(current.blocks || []))
        });
        selectTodoConfigTemplate(newId);
        if (window.showToast) window.showToast('📑 Modelo duplicado com sucesso!');
    }

    function duplicateCurrentReminderTemplate() {
        const current = reminderTemplates.find(t => t.id === currentEditingReminderTemplateSlotId);
        if (!current) return;
        const newId = 'reminder_template_' + Date.now();
        reminderTemplates.push({
            id: newId,
            name: `${current.name} (Cópia)`,
            description: current.description,
            color: current.color,
            blocks: JSON.parse(JSON.stringify(current.blocks || []))
        });
        selectReminderConfigTemplate(newId);
        if (window.showToast) window.showToast('📑 Modelo duplicado com sucesso!');
    }

    function duplicateCurrentStudyTemplate() {
        const current = studyTemplates.find(t => t.id === currentEditingTemplateSlotId);
        if (!current) return;
        const newId = 'template_' + Date.now();
        studyTemplates.push({
            id: newId,
            name: `${current.name} (Cópia)`,
            description: current.description,
            color: current.color,
            blocks: JSON.parse(JSON.stringify(current.blocks || []))
        });
        selectStudyConfigTemplate(newId);
        if (window.showToast) window.showToast('📑 Modelo duplicado com sucesso!');
    }

    function openStudyConfigModal() {
        const modal = document.getElementById('study-config-modal');
        if (modal) modal.classList.remove('hidden');
        setStudyConfigTab(studyConfigActiveTab || 'templates');
        selectStudyConfigTemplate(currentEditingTemplateSlotId || activeStudyTemplateId || 'template_1');
        renderStudyGoogleColorPalette();
        renderUniversalColorPicker('studies', 'study-universal-color-picker');
        updateStudyStatusUI();
    }

    function renderStudyTemplatesBar() {
        renderStudyConfigTemplatesSelector();
    }

    function closeStudyConfigModal() {
        const modal = document.getElementById('study-config-modal');
        if (modal) modal.classList.add('hidden');
    }

    function toggleStudyConfigPanel() {
        openStudyConfigModal();
    }

    async function selectStudyGoogleCalendarColor(colorId) {
        studySettings.google_calendar_color_id = String(colorId);
        saveLocalStorageBackup();
        renderStudyGoogleColorPalette();
        updateStudyStatusUI();

        const client = getSupabase();
        if (client) {
            try {
                await client.from('control_study_settings').upsert({
                    id: 'default',
                    google_calendar_color_id: String(colorId),
                    prefix: studySettings.prefix || 'STUD: ',
                    auto_sync_gcal: studySettings.auto_sync_gcal !== false,
                    updated_at: new Date().toISOString()
                });
            } catch (err) {
                console.error('Erro ao salvar cor de estudos no Supabase:', err);
            }
        }

        const col = GOOGLE_CALENDAR_COLORS[colorId] || { name: 'Padrão' };
        if (window.showToast) window.showToast(`✓ Cor oficial do Google Agenda definida: ${col.name}`);
    }

    async function toggleStudyAutoSync(checked) {
        studySettings.auto_sync_gcal = !!checked;
        saveLocalStorageBackup();

        const client = getSupabase();
        if (client) {
            try {
                await client.from('control_study_settings').upsert({
                    id: 'default',
                    google_calendar_color_id: String(studySettings.google_calendar_color_id || '4'),
                    prefix: studySettings.prefix || 'STUD: ',
                    auto_sync_gcal: studySettings.auto_sync_gcal,
                    updated_at: new Date().toISOString()
                });
            } catch (err) {
                console.error('Erro ao salvar auto_sync de estudos no Supabase:', err);
            }
        }

        if (window.showToast) {
            window.showToast(checked ? '✓ Auto-sincronização com Google Agenda ativada' : 'ℹ️ Auto-sincronização desativada');
        }
    }

    function openNewStudyBlockModal(day, startTime, endTime) {
        currentEditingStudyBlock = null;
        const modal = document.getElementById('control-study-modal');
        const titleEl = document.getElementById('study-modal-title');
        const btnDelete = document.getElementById('btn-delete-study-modal');

        if (titleEl) titleEl.innerText = 'Novo Bloco de Estudo';
        if (btnDelete) btnDelete.classList.add('hidden');

        const inTitle = document.getElementById('study-input-title');
        const inDay = document.getElementById('study-input-day');
        const inStart = document.getElementById('study-input-start-time');
        const inEnd = document.getElementById('study-input-end-time');
        const inTag = document.getElementById('study-input-tag');
        const inColor = document.getElementById('study-input-color');
        const inNotes = document.getElementById('study-input-notes');
        const inSync = document.getElementById('study-input-sync-gcal');

        if (inTitle) inTitle.value = '';
        if (inDay) inDay.value = day || 'SEG';
        if (inStart) inStart.value = startTime || '08:30';
        if (inEnd) inEnd.value = endTime || '13:30';
        if (inTag) inTag.value = '';
        if (inColor) inColor.value = '#e67c73';
        if (inNotes) inNotes.value = '';
        if (inSync) inSync.checked = studySettings.auto_sync_gcal !== false;

        if (modal) {
            modal.classList.remove('hidden');
            setTimeout(() => inTitle && inTitle.focus(), 80);
        }
    }

    function openEditStudyBlockModal(id) {
        const block = studyBlocks.find(b => b.id === id);
        if (!block) return;

        currentEditingStudyBlock = block;
        const modal = document.getElementById('control-study-modal');
        const titleEl = document.getElementById('study-modal-title');
        const btnDelete = document.getElementById('btn-delete-study-modal');

        if (titleEl) titleEl.innerText = 'Editar Bloco de Estudo';
        if (btnDelete) btnDelete.classList.remove('hidden');

        const inTitle = document.getElementById('study-input-title');
        const inDay = document.getElementById('study-input-day');
        const inStart = document.getElementById('study-input-start-time');
        const inEnd = document.getElementById('study-input-end-time');
        const inTag = document.getElementById('study-input-tag');
        const inColor = document.getElementById('study-input-color');
        const inNotes = document.getElementById('study-input-notes');
        const inSync = document.getElementById('study-input-sync-gcal');

        if (inTitle) inTitle.value = block.title || '';
        if (inDay) inDay.value = block.day_of_week || 'SEG';
        if (inStart) inStart.value = block.start_time || '08:30';
        if (inEnd) inEnd.value = block.end_time || '13:30';
        if (inTag) inTag.value = block.tag || '';
        if (inColor) inColor.value = block.color || '#e67c73';
        if (inNotes) inNotes.value = block.notes || '';
        if (inSync) inSync.checked = true;

        if (modal) modal.classList.remove('hidden');
    }

    function closeStudyBlockModal() {
        const modal = document.getElementById('control-study-modal');
        if (modal) modal.classList.add('hidden');
        currentEditingStudyBlock = null;
    }

    async function handleSaveStudyBlockForm(event) {
        if (event) event.preventDefault();

        const title = (document.getElementById('study-input-title')?.value || '').trim();
        const day = document.getElementById('study-input-day')?.value || 'SEG';
        const startTime = document.getElementById('study-input-start-time')?.value || '08:30';
        const endTime = document.getElementById('study-input-end-time')?.value || '13:30';
        const tag = (document.getElementById('study-input-tag')?.value || title).trim();
        const color = document.getElementById('study-input-color')?.value || '#e67c73';
        const notes = (document.getElementById('study-input-notes')?.value || '').trim();
        const syncGcal = document.getElementById('study-input-sync-gcal')?.checked;

        if (!title) {
            if (window.glassAlert) window.glassAlert('Informe a matéria ou disciplina.', 'Campo Obrigatório', '⚠️'); else alert('Informe a matéria ou disciplina.');
            return;
        }

        const client = getSupabase();
        let savedBlock = null;

        if (currentEditingStudyBlock) {
            // Update
            const updated = {
                ...currentEditingStudyBlock,
                title,
                day_of_week: day,
                start_time: startTime,
                end_time: endTime,
                tag: tag || title,
                color,
                notes,
                updated_at: new Date().toISOString()
            };

            const idx = studyBlocks.findIndex(b => b.id === currentEditingStudyBlock.id);
            if (idx !== -1) studyBlocks[idx] = updated;
            savedBlock = updated;

            if (currentEditingStudyBlock.google_event_id && googleCalendarSettings.access_token) {
                try {
                    deleteGCalEventViaProxyOrDirect(currentEditingStudyBlock.google_event_id, googleCalendarSettings.access_token).catch(() => {});
                } catch (e) {}
            }

            if (client) {
                await client.from('control_study_blocks').update({
                    title,
                    day_of_week: day,
                    start_time: startTime,
                    end_time: endTime,
                    tag: tag || title,
                    color,
                    notes,
                    updated_at: new Date().toISOString()
                }).eq('id', currentEditingStudyBlock.id);
            }
        } else {
            // Insert
            const newBlock = {
                id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : 'stud_' + Date.now(),
                title,
                day_of_week: day,
                start_time: startTime,
                end_time: endTime,
                tag: tag || title,
                color,
                notes,
                is_active: true,
                sort_order: studyBlocks.length + 1,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            studyBlocks.push(newBlock);
            savedBlock = newBlock;

            if (client) {
                const { data } = await client.from('control_study_blocks').insert(newBlock).select().maybeSingle();
                if (data) {
                    const idx = studyBlocks.findIndex(b => b.id === newBlock.id);
                    if (idx !== -1) studyBlocks[idx] = data;
                    savedBlock = data;
                }
            }
        }

        saveLocalStorageBackup();
        renderStudyScheduleUI();
        renderStudyTableGridUI();
        updateStudyStatusUI();
        closeStudyBlockModal();

        if (window.showToast) window.showToast('✓ Bloco de estudo salvo com sucesso!');

        // Sincronização automática e imediata no Google Agenda
        syncStudyBlockToGoogleCalendar(savedBlock);
    }

    async function deleteStudyBlock(id) {
        if (!id && currentEditingStudyBlock) id = currentEditingStudyBlock.id;
        if (!id) return;

        const block = studyBlocks.find(b => b.id === id);
        const name = block ? block.title : 'este bloco';
        const confirmed = window.glassConfirm ? await window.glassConfirm(`Deseja realmente excluir o estudo "${name}"?`, 'Excluir Estudo', 'Excluir', 'Cancelar', true, '📚') : confirm(`Deseja realmente excluir o estudo "${name}"?`);
        if (!confirmed) return;

        if (block && block.google_event_id && googleCalendarSettings.access_token) {
            try {
                deleteGCalEventViaProxyOrDirect(block.google_event_id, googleCalendarSettings.access_token).catch(() => {});
            } catch (err) {}
        }

        studyBlocks = studyBlocks.filter(b => b.id !== id);
        saveLocalStorageBackup();
        renderStudyScheduleUI();
        renderStudyTableGridUI();
        updateStudyStatusUI();
        closeStudyBlockModal();

        const client = getSupabase();
        if (client) {
            try {
                await client.from('control_study_blocks').delete().eq('id', id);
            } catch (err) {
                console.error('Erro ao excluir bloco de estudo do Supabase:', err);
            }
        }

        if (window.showToast) window.showToast('🗑️ Bloco de estudo excluído.');
    }

    /**
     * Sincroniza um bloco específico com o Google Calendar com STUD: e a cor selecionada
     */
    async function syncStudyBlockToGoogleCalendar(blockOrId) {
        const block = typeof blockOrId === 'string' ? studyBlocks.find(b => b.id === blockOrId) : blockOrId;
        if (!block) return;

        const targetDateStr = getUpcomingDateForDayOfWeek(block.day_of_week);
        const prefix = studySettings.prefix || 'STUD: ';
        const eventTitle = `${prefix}${block.title}`;
        const colorId = String(studySettings.google_calendar_color_id || '4');
        const rruleDay = STUDY_RRULE_MAP[block.day_of_week] || 'MO';

        const payload = {
            title: eventTitle,
            date: targetDateStr,
            time: block.start_time || '08:30',
            endTime: block.end_time || '13:30',
            colorId: colorId,
            recurrence: ['RRULE:FREQ=WEEKLY;BYDAY=' + rruleDay],
            notes: `📚 Rotina de Estudos - Personal OS\n\nDisciplina: ${block.title}\nDia: ${STUDY_DAYS_LABEL[block.day_of_week] || block.day_of_week}\nHorário: ${block.start_time} às ${block.end_time}\n${block.notes ? `Observações:\n${block.notes}` : ''}\n\nPowered by M.C.P Personal OS.`
        };

        const res = await createGoogleCalendarEvent(payload);
        if (res && res.success) {
            if (res.event && res.event.id) {
                block.google_event_id = res.event.id;
                const client = getSupabase();
                if (client) {
                    await client.from('control_study_blocks').update({ google_event_id: res.event.id }).eq('id', block.id);
                }
            }
        }
        return res;
    }

    /**
     * Sincroniza em lote todos os estudos da semana com o Google Agenda com STUD: e a cor configurada
     */
    async function syncAllStudiesToGoogleCalendar() {
        const activeBlocks = studyBlocks.filter(b => b.is_active !== false);
        if (activeBlocks.length === 0) {
            if (window.showToast) window.showToast('ℹ️ Nenhum bloco de estudo para sincronizar.');
            return;
        }

        if (!googleCalendarSettings.access_token) {
            if (window.showToast) window.showToast('⚠️ Conecte o Google Agenda para sincronizar sua rotina.');
            openGoogleCalendarConnectModal();
            return;
        }

        if (window.showToast) window.showToast(`⏳ Sincronizando ${activeBlocks.length} estudos no Google Agenda...`);

        let count = 0;
        for (const block of activeBlocks) {
            const res = await syncStudyBlockToGoogleCalendar(block);
            if (res && res.success) count++;
        }

        if (window.showToast) {
            window.showToast(`✓ Sucesso! ${count} estudos sincronizados com prefixo STUD: e cor selecionada.`);
        }
    }

    // ==========================================
    // SESSÃO 1: TRIP (GESTÃO DE VIAGENS)
    // ==========================================

    function renderTripUI() {
        renderTripStats();
        syncTripViewModeButtons();
        renderTripCards();
    }

    function syncTripViewModeButtons() {
        const btnCards = document.getElementById('btn-trip-view-cards');
        const btnGallery = document.getElementById('btn-trip-view-gallery');
        const currentAccent = localStorage.getItem('mcp_accent_trip') || SESSION_DEFAULT_COLORS['trip'] || '#f59e0b';
        
        if (btnCards && btnGallery) {
            if (tripViewMode === 'cards') {
                btnCards.className = 'px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-white text-black shadow-md';
                btnCards.style.background = '';
                btnCards.style.color = '#000';
                btnCards.style.boxShadow = '';
                
                btnGallery.className = 'px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 text-gray-300 hover:text-white';
                btnGallery.style.background = '';
                btnGallery.style.color = '';
                btnGallery.style.boxShadow = '';
            } else {
                btnCards.className = 'px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 text-gray-300 hover:text-white';
                btnCards.style.background = '';
                btnCards.style.color = '';
                btnCards.style.boxShadow = '';

                btnGallery.className = 'px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 text-white shadow-lg';
                btnGallery.style.background = currentAccent;
                btnGallery.style.color = '#fff';
                btnGallery.style.boxShadow = `0 4px 15px -2px ${currentAccent}`;
            }
        }
    }

    function setTripViewMode(mode) {
        tripViewMode = mode;
        try { localStorage.setItem('mcp_trip_view_mode', mode); } catch (e) {}
        syncTripViewModeButtons();
        renderTripCards();
        if (window.showToast) {
            window.showToast(mode === 'gallery' ? '🖼️ Visualização por Galeria de Imagens ativada' : '🎴 Visualização por Cards de Planejamento ativada');
        }
    }

    function setTripCategoryFilter(category) {
        tripFilterCategory = category;
        const currentAccent = localStorage.getItem('mcp_accent_trip') || SESSION_DEFAULT_COLORS['trip'] || '#f59e0b';
        ['all', 'planned', 'wishlist', 'completed'].forEach(cat => {
            const btn = document.getElementById(`tab-trip-${cat}`);
            if (btn) {
                if (cat === category) {
                    btn.className = 'px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 text-white shadow-lg';
                    btn.style.background = currentAccent;
                    btn.style.boxShadow = `0 4px 15px -2px ${currentAccent}`;
                } else {
                    btn.className = 'px-3.5 py-1.5 rounded-xl font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 bg-white/10 text-gray-300 hover:bg-white/20 border border-white/10';
                    btn.style.background = '';
                    btn.style.boxShadow = '';
                }
            }
        });
        renderTripCards();
    }

    function renderTripStats() {
        const counterEl = document.getElementById('trip-stats-counter');
        const countdownEl = document.getElementById('trip-next-countdown');
        const plannedEl = document.getElementById('trip-stat-planned-count');
        const wishlistEl = document.getElementById('trip-stat-wishlist-count');
        const completedEl = document.getElementById('trip-stat-completed-count');
        const budgetEl = document.getElementById('trip-stat-total-budget');

        const plannedCount = trips.filter(t => t.category === 'planned').length;
        const wishlistCount = trips.filter(t => t.category === 'wishlist').length;
        const completedCount = trips.filter(t => t.category === 'completed').length;
        const totalBudget = trips.reduce((acc, t) => acc + (parseFloat(t.budget) || 0), 0);

        if (counterEl) counterEl.innerText = `${trips.length} ${trips.length === 1 ? 'viagem registrada' : 'viagens registradas'}`;
        if (plannedEl) plannedEl.innerText = plannedCount;
        if (wishlistEl) wishlistEl.innerText = wishlistCount;
        if (completedEl) completedEl.innerText = completedCount;
        if (budgetEl) budgetEl.innerText = `R$ ${totalBudget.toLocaleString('pt-BR', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

        // Próxima viagem mais recente planejada
        if (countdownEl) {
            const upcomingPlanned = trips
                .filter(t => t.category === 'planned' && t.start_date)
                .sort((a, b) => new Date(a.start_date) - new Date(b.start_date))[0];

            if (upcomingPlanned) {
                const now = getBrasiliaDate();
                const diffTime = new Date(upcomingPlanned.start_date) - now;
                const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                if (diffDays > 0) {
                    countdownEl.innerText = `Próximo embarque: ${upcomingPlanned.destination} (em ${diffDays} dias)`;
                } else if (diffDays === 0) {
                    countdownEl.innerText = `✈️ Embarque hoje para ${upcomingPlanned.destination}!`;
                } else {
                    countdownEl.innerText = `Em andamento: ${upcomingPlanned.destination}`;
                }
            } else {
                countdownEl.innerText = 'Nenhuma viagem planejada agendada';
            }
        }
    }

    function renderTripGalleryView(container, filteredTrips) {
        if (!container) return;

        if (filteredTrips.length === 0) {
            container.innerHTML = `
                <div class="p-12 text-center rounded-3xl border border-white/10 bg-white/[0.02]">
                    <span class="text-4xl block mb-2">🖼️</span>
                    <h4 class="text-sm font-mono font-bold text-white uppercase">Nenhuma galeria encontrada</h4>
                    <p class="text-xs font-mono text-gray-400 mt-1">Nenhuma viagem corresponde ao filtro selecionado.</p>
                </div>
            `;
            return;
        }

        const categoryBadges = {
            'planned': `<span class="px-3 py-1 rounded-full text-xs font-mono font-bold" style="background: color-mix(in srgb, var(--trip-accent, #f59e0b) 20%, transparent); color: var(--trip-accent, #f59e0b); border: 1px solid color-mix(in srgb, var(--trip-accent, #f59e0b) 35%, transparent);">✈️ Planejada</span>`,
            'wishlist': `<span class="px-3 py-1 rounded-full text-xs font-mono font-bold" style="background: color-mix(in srgb, var(--trip-accent, #f59e0b) 20%, transparent); color: var(--trip-accent, #f59e0b); border: 1px solid color-mix(in srgb, var(--trip-accent, #f59e0b) 35%, transparent);">🌟 Desejo</span>`,
            'completed': `<span class="px-3 py-1 rounded-full text-xs font-mono font-bold" style="background: color-mix(in srgb, var(--trip-accent, #f59e0b) 20%, transparent); color: var(--trip-accent, #f59e0b); border: 1px solid color-mix(in srgb, var(--trip-accent, #f59e0b) 35%, transparent);">🏆 Realizada</span>`
        };

        container.innerHTML = filteredTrips.map(t => {
            const photos = Array.isArray(t.photos) ? t.photos : [];
            const hasPhotos = photos.length > 0;

            return `
                <div class="trip-gallery-showcase-card p-6 sm:p-8 md:p-10 rounded-3xl border border-white/15 bg-black/40 backdrop-blur-2xl shadow-2xl space-y-6 transition-all duration-300 hover:border-white/25 relative overflow-hidden" style="border-top: 4px solid var(--trip-accent, #f59e0b);">
                    
                    <!-- CABEÇALHO GRANDE, MONUMENTAL E ESTÉTICO DA VIAGEM -->
                    <div class="flex items-start justify-between flex-wrap gap-4 border-b border-white/10 pb-6">
                        <div class="space-y-2.5 max-w-4xl">
                            <!-- Destino & Badges -->
                            <div class="flex items-center gap-2.5 flex-wrap">
                                <span class="px-3.5 py-1 rounded-full text-xs font-mono font-bold flex items-center gap-1.5 shadow-md" style="background: color-mix(in srgb, var(--trip-accent, #f59e0b) 20%, transparent); color: var(--trip-accent, #f59e0b); border: 1px solid color-mix(in srgb, var(--trip-accent, #f59e0b) 40%, transparent);">
                                    <span>📍</span>
                                    <span>${escapeHtml(t.destination)}</span>
                                </span>
                                ${categoryBadges[t.category] || ''}
                                ${t.start_date ? `
                                    <span class="px-3.5 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/15 text-gray-300 flex items-center gap-1.5">
                                        <span>📅</span>
                                        <span>${t.start_date.split('-').reverse().join('/')} ${t.end_date ? `➔ ${t.end_date.split('-').reverse().join('/')}` : ''}</span>
                                    </span>
                                ` : ''}
                                ${t.status ? `<span class="px-3 py-1 rounded-full text-xs font-mono bg-white/5 border border-white/10 text-gray-400 font-medium">${escapeHtml(t.status)}</span>` : ''}
                            </div>

                            <!-- TÍTULO GRANDE E ESTÉTICO -->
                            <h3 class="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-black text-white tracking-tight leading-tight drop-shadow-[0_2px_20px_rgba(0,0,0,0.7)] font-sans">
                                ${escapeHtml(t.title)}
                            </h3>

                            <!-- Descrição & Notas da Viagem -->
                            ${t.notes ? `
                                <p class="text-xs sm:text-sm font-mono text-gray-300/90 leading-relaxed pt-1 max-w-3xl">
                                    "${escapeHtml(t.notes)}"
                                </p>
                            ` : ''}
                        </div>

                        <!-- Ações Rápidas no Cabeçalho da Galeria -->
                        <div class="flex items-center gap-2 flex-wrap">
                            <span class="text-xs font-mono px-4 py-2 rounded-2xl bg-white/5 border border-white/15 text-amber-300 font-bold flex items-center gap-2 shadow-sm">
                                <span>📸</span>
                                <span>${photos.length} ${photos.length === 1 ? 'Foto' : 'Fotos'}</span>
                            </span>
                            <button type="button" onclick="window.ControlEngine.deleteTrip('${t.id}')" class="px-3.5 py-2 rounded-2xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 active:scale-95 shadow-sm" title="Excluir esta viagem">
                                <span>🗑️</span>
                                <span>Apagar</span>
                            </button>
                            <button type="button" onclick="window.ControlEngine.openEditTripModal('${t.id}')" class="px-3.5 py-2 rounded-2xl bg-white/10 hover:bg-white/20 border border-white/20 text-white font-mono text-xs font-bold transition cursor-pointer flex items-center gap-1.5 active:scale-95 shadow" title="Gerenciar fotos ou editar dados desta viagem">
                                <span>✏️</span>
                                <span>Editar</span>
                            </button>
                            <button type="button" onclick="window.ControlEngine.openTripVisualizerModal('${t.id}')" class="px-3.5 py-2 rounded-2xl font-mono text-xs font-bold transition flex items-center gap-1.5 cursor-pointer active:scale-95 text-white shadow-lg" style="background: var(--trip-accent, #f59e0b); box-shadow: 0 4px 15px -2px var(--trip-accent, #f59e0b);" title="Visualizar Detalhes 360°">
                                <span>👁️</span>
                                <span class="hidden sm:inline">Visualizar</span>
                            </button>
                        </div>
                    </div>

                    <!-- GALERIA DE IMAGENS ASSOCIADAS À TRIP -->
                    ${hasPhotos ? `
                        <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
                            ${photos.map((photo, pIdx) => `
                                <div class="group relative aspect-[4/3] rounded-2xl overflow-hidden bg-black/50 border border-white/15 shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-[1.03] hover:shadow-2xl hover:border-amber-400/60" onclick="window.ControlEngine.openMediaLightbox('${escapeHtml(photo.url)}', '${escapeHtml(t.destination)} — ${escapeHtml(t.title)} (${pIdx + 1}/${photos.length})')">
                                    <img src="${escapeHtml(photo.url)}" alt="${escapeHtml(photo.caption || t.title)}" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" loading="lazy" />
                                    <div class="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-between p-4">
                                        <div class="flex justify-end">
                                            <span class="w-8 h-8 rounded-full bg-black/70 border border-white/30 text-white flex items-center justify-center text-xs backdrop-blur-md shadow-lg">🔍</span>
                                        </div>
                                        <div class="space-y-1">
                                            <span class="text-xs font-mono font-bold text-white block truncate drop-shadow">${escapeHtml(photo.caption || `Foto ${pIdx + 1}`)}</span>
                                            <span class="text-[10px] font-mono text-amber-300 block font-semibold">📍 ${escapeHtml(t.destination)}</span>
                                        </div>
                                    </div>
                                </div>
                            `).join('')}
                        </div>
                    ` : `
                        <div class="p-10 text-center rounded-2xl border border-dashed border-white/15 bg-white/[0.01] space-y-3">
                            <span class="text-4xl block opacity-60">🖼️</span>
                            <div class="space-y-1">
                                <h4 class="text-sm font-mono font-bold text-white uppercase">Nenhuma foto adicionada para ${escapeHtml(t.destination)}</h4>
                                <p class="text-xs font-mono text-gray-400">Anexe fotos de alta resolução para compor a galeria desta viagem.</p>
                            </div>
                            <button type="button" onclick="window.ControlEngine.openEditTripModal('${t.id}')" class="px-4 py-2.5 rounded-2xl bg-amber-500/20 hover:bg-amber-500/35 border border-amber-500/40 text-amber-200 font-mono text-xs font-bold transition inline-flex items-center gap-2 cursor-pointer active:scale-95 shadow-lg">
                                <span>➕</span>
                                <span>Anexar Fotos à Viagem</span>
                            </button>
                        </div>
                    `}

                </div>
            `;
        }).join('');
    }

    function renderTripCards() {
        const container = document.getElementById('trip-cards-container');
        if (!container) return;

        let filtered = trips;
        if (tripFilterCategory !== 'all') {
            filtered = trips.filter(t => t.category === tripFilterCategory);
        }

        if (tripViewMode === 'gallery') {
            container.className = 'space-y-10 w-full';
            renderTripGalleryView(container, filtered);
            return;
        }

        container.className = 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5';

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="col-span-full p-12 text-center rounded-3xl border border-white/10 bg-white/[0.02]">
                    <span class="text-4xl block mb-2">✈️</span>
                    <h4 class="text-sm font-mono font-bold text-white uppercase">Nenhuma viagem encontrada</h4>
                    <p class="text-xs font-mono text-gray-400 mt-1">Clique em "Nova Viagem" para adicionar novos destinos.</p>
                </div>
            `;
            return;
        }

        container.innerHTML = filtered.map(t => {
            const isPlanned = t.category === 'planned';
            const isWishlist = t.category === 'wishlist';
            const isCompleted = t.category === 'completed';

            const budget = parseFloat(t.budget) || 0;
            const spent = parseFloat(t.spent) || 0;
            const pctSpent = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;

            const checklist = Array.isArray(t.checklist) ? t.checklist : [];
            const checklistDone = checklist.filter(c => c.done).length;

            const photos = Array.isArray(t.photos) ? t.photos : [];

            const categoryBadges = {
                'planned': `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold" style="background: color-mix(in srgb, var(--trip-accent, #f59e0b) 20%, transparent); color: var(--trip-accent, #f59e0b); border: 1px solid color-mix(in srgb, var(--trip-accent, #f59e0b) 35%, transparent);">✈️ Planejada</span>`,
                'wishlist': `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold" style="background: color-mix(in srgb, var(--trip-accent, #f59e0b) 20%, transparent); color: var(--trip-accent, #f59e0b); border: 1px solid color-mix(in srgb, var(--trip-accent, #f59e0b) 35%, transparent);">🌟 Desejo</span>`,
                'completed': `<span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold" style="background: color-mix(in srgb, var(--trip-accent, #f59e0b) 20%, transparent); color: var(--trip-accent, #f59e0b); border: 1px solid color-mix(in srgb, var(--trip-accent, #f59e0b) 35%, transparent);">🏆 Realizada</span>`
            };

            const priorityBadges = {
                'Alta': '<span class="text-[10px] font-mono text-rose-400">🔴 Alta</span>',
                'Média': '<span class="text-[10px] font-mono text-amber-400">🟡 Média</span>',
                'Baixa': '<span class="text-[10px] font-mono text-emerald-400">🟢 Baixa</span>'
            };

            return `
                <div class="p-5 rounded-3xl border border-white/15 bg-white/[0.03] hover:bg-white/[0.06] transition shadow-xl flex flex-col justify-between space-y-4 group backdrop-blur-xl relative overflow-hidden" style="border-top: 3.5px solid var(--trip-accent, #f59e0b);">
                    
                    <!-- Top: Badge de Categoria & Prioridade -->
                    <div class="flex items-center justify-between gap-2 flex-wrap">
                        <div class="flex items-center gap-2 flex-wrap">
                            ${categoryBadges[t.category] || ''}
                            ${t.priority ? priorityBadges[t.priority] || '' : ''}
                        </div>
                    </div>

                    <!-- Informações Principais: Destino & Título -->
                    <div class="space-y-1">
                        <div class="text-[11px] font-mono font-bold flex items-center gap-1" style="color: var(--trip-accent, #f59e0b);">
                            <span>📍</span>
                            <span>${escapeHtml(t.destination)}</span>
                        </div>
                        <h4 class="text-base font-bold text-white tracking-tight leading-snug">
                            ${escapeHtml(t.title)}
                        </h4>
                    </div>

                    <!-- Galeria de Fotos da Viagem (até 10 imagens) -->
                    ${photos.length > 0 ? `
                        <div class="space-y-1.5 pt-1 border-t border-white/10">
                            <div class="flex justify-between items-center text-[10px] font-mono text-gray-400">
                                <span class="flex items-center gap-1 font-bold" style="color: var(--trip-accent, #f59e0b);">
                                    <span>📸</span>
                                    <span>Fotos da Viagem (${photos.length}/10):</span>
                                </span>
                                <span class="text-[9px] text-gray-500 font-mono">Clique para zoom</span>
                            </div>
                            <div class="grid grid-cols-5 gap-1.5 rounded-2xl overflow-hidden p-1 bg-white/[0.02] border border-white/5">
                                ${photos.slice(0, 5).map((p, pIdx) => `
                                    <div class="relative aspect-square rounded-lg overflow-hidden cursor-pointer group/img" onclick="window.ControlEngine.openMediaLightbox('${escapeHtml(p.url)}', '${escapeHtml(t.destination)} — ${escapeHtml(t.title)}')">
                                        <img src="${escapeHtml(p.url)}" alt="Foto" class="w-full h-full object-cover group-hover/img:scale-110 transition duration-300" loading="lazy" />
                                        ${pIdx === 4 && photos.length > 5 ? `
                                            <div class="absolute inset-0 bg-black/70 backdrop-blur-xs flex items-center justify-center text-white font-mono font-bold text-xs">
                                                +${photos.length - 4}
                                            </div>
                                        ` : ''}
                                    </div>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Datas & Período -->
                    ${t.start_date ? `
                        <div class="p-2.5 rounded-xl bg-white/[0.02] border border-white/5 flex items-center justify-between text-xs font-mono text-gray-300">
                            <span class="flex items-center gap-1.5">
                                <span>📅</span>
                                <span>${t.start_date.split('-').reverse().join('/')} ${t.end_date ? `➔ ${t.end_date.split('-').reverse().join('/')}` : ''}</span>
                            </span>
                            <span class="text-[10px] text-gray-400">${t.status || ''}</span>
                        </div>
                    ` : ''}

                    <!-- Orçamento & Barra de Progresso (obedecendo a cor secundária) -->
                    ${budget > 0 ? `
                        <div class="space-y-1 text-xs font-mono">
                            <div class="flex justify-between text-[11px] text-gray-400">
                                <span>Orçamento: <strong class="text-white">R$ ${budget.toLocaleString('pt-BR')}</strong></span>
                                <span>Gasto: <strong class="${spent > budget ? 'text-rose-400' : ''}" style="${spent <= budget ? 'color: var(--trip-accent, #f59e0b);' : ''}">R$ ${spent.toLocaleString('pt-BR')}</strong></span>
                            </div>
                            <div class="w-full bg-white/10 rounded-full h-1.5 overflow-hidden">
                                <div class="h-1.5 rounded-full ${spent > budget ? 'bg-rose-500' : ''}" style="width: ${pctSpent}%; ${spent <= budget ? 'background: var(--trip-accent, #f59e0b); box-shadow: 0 0 10px var(--trip-accent, #f59e0b);' : ''}"></div>
                            </div>
                        </div>
                    ` : ''}

                    <!-- Checklist / Tarefas Rápidas -->
                    ${checklist.length > 0 ? `
                        <div class="space-y-1.5 pt-1 border-t border-white/10">
                            <div class="flex justify-between items-center text-[10px] font-mono text-gray-400">
                                <span>Checklist de Viagem:</span>
                                <span class="font-bold" style="color: var(--trip-accent, #f59e0b);">${checklistDone}/${checklist.length}</span>
                            </div>
                            <div class="space-y-1">
                                ${checklist.slice(0, 3).map((item, idx) => `
                                    <label class="flex items-center gap-2 text-xs font-mono cursor-pointer select-none text-gray-300">
                                        <input type="checkbox" ${item.done ? 'checked' : ''} onchange="window.ControlEngine.toggleTripChecklistItem('${t.id}', ${idx})" class="w-3.5 h-3.5 rounded bg-white/10 border-white/20" style="accent-color: var(--trip-accent, #f59e0b);" />
                                        <span class="${item.done ? 'line-through text-gray-500' : ''}">${escapeHtml(item.task)}</span>
                                    </label>
                                `).join('')}
                            </div>
                        </div>
                    ` : ''}

                    <!-- Anotações -->
                    ${t.notes ? `
                        <p class="text-[11px] font-mono text-gray-400 line-clamp-2 italic" title="${escapeHtml(t.notes)}">
                            "${escapeHtml(t.notes)}"
                        </p>
                    ` : ''}

                    <!-- Grade Exclusiva de 3 Botões de Ação: Apagar, Editar e Visualizar -->
                    <div class="grid grid-cols-3 gap-2 pt-2 border-t border-white/10 mt-auto">
                        <button type="button" onclick="window.ControlEngine.deleteTrip('${t.id}')" class="py-2.5 px-2 rounded-2xl bg-rose-500/15 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm" title="Apagar Viagem">
                            <span>🗑️</span>
                            <span>Apagar</span>
                        </button>
                        <button type="button" onclick="window.ControlEngine.openEditTripModal('${t.id}')" class="py-2.5 px-2 rounded-2xl bg-white/10 hover:bg-white/20 text-gray-200 border border-white/15 font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 shadow-sm" title="Editar Viagem">
                            <span>✏️</span>
                            <span>Editar</span>
                        </button>
                        <button type="button" onclick="window.ControlEngine.openTripVisualizerModal('${t.id}')" class="py-2.5 px-2 rounded-2xl font-mono text-xs font-bold transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 text-white shadow-lg" style="background: var(--trip-accent, #f59e0b); box-shadow: 0 4px 15px -2px var(--trip-accent, #f59e0b);" title="Visualizar Destino">
                            <span>👁️</span>
                            <span>Visualizar</span>
                        </button>
                    </div>

                </div>
            `;
        }).join('');
    }

    // Variável para gerenciar fotos em edição no modal de viagens (até 10)
    let currentTripPhotos = [];

    function renderTripModalPhotosGrid() {
        const container = document.getElementById('trip-modal-photos-grid');
        const counterEl = document.getElementById('trip-modal-photos-counter');
        if (!container) return;

        if (counterEl) counterEl.innerText = `${currentTripPhotos.length}/10 fotos`;

        if (currentTripPhotos.length === 0) {
            container.innerHTML = `
                <div class="col-span-full py-4 text-center text-[10px] font-mono text-gray-500 border border-dashed border-white/10 rounded-xl">
                    Nenhuma foto anexada. Faça upload ou adicione por URL (máx 10 fotos).
                </div>
            `;
            return;
        }

        container.innerHTML = currentTripPhotos.map((photo, idx) => `
            <div class="relative group rounded-xl overflow-hidden border border-white/15 bg-black/40 aspect-square">
                <img src="${escapeHtml(photo.url)}" alt="Foto ${idx+1}" class="w-full h-full object-cover group-hover:scale-105 transition cursor-pointer" onclick="window.ControlEngine.openMediaLightbox('${escapeHtml(photo.url)}', 'Foto da Viagem')" />
                <button type="button" onclick="window.ControlEngine.removeTripModalPhoto(${idx})" class="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/80 hover:bg-rose-600 text-white font-mono text-[10px] flex items-center justify-center transition cursor-pointer opacity-80 group-hover:opacity-100" title="Remover foto">✕</button>
            </div>
        `).join('');
    }

    async function handleUploadTripPhotos(event) {
        const files = Array.from(event.target.files || []);
        if (!files.length) return;

        const remainingSlots = 10 - currentTripPhotos.length;
        if (remainingSlots <= 0) {
            if (window.glassAlert) window.glassAlert('Limite máximo de 10 fotos por viagem atingido.', 'Limite de Fotos', '📸'); else alert('Limite máximo de 10 fotos por viagem atingido.');
            event.target.value = '';
            return;
        }

        const filesToUpload = files.slice(0, remainingSlots);

        for (let i = 0; i < filesToUpload.length; i++) {
            const file = filesToUpload[i];
            if (window.showToast) {
                window.showToast(`⚡ Comprimindo foto [${i + 1}/${filesToUpload.length}]: ${file.name}...`);
            }

            try {
                const ikRes = await window.imageKitUpload({
                    file: file,
                    fileName: `trip_${Date.now()}_${i}_${file.name}`,
                    folder: `/control-media/trips`
                });

                currentTripPhotos.push({
                    url: ikRes.url,
                    fileId: ikRes.fileId || null,
                    caption: file.name
                });
            } catch (err) {
                console.error('Erro no upload da foto de viagem:', err);
                if (window.showToast) window.showToast(`⚠️ Erro no upload: ${err.message}`);
            }
        }

        event.target.value = '';
        renderTripModalPhotosGrid();
        if (window.showToast) window.showToast(`✓ ${filesToUpload.length} foto(s) anexada(s) à viagem!`);
    }

    async function promptAddTripPhotoUrl() {
        if (currentTripPhotos.length >= 10) {
            if (window.glassAlert) await window.glassAlert('Limite máximo de 10 fotos por viagem atingido.', 'Limite Atingido', '📸');
            else if (window.glassAlert) window.glassAlert('Limite máximo de 10 fotos por viagem atingido.', 'Limite de Fotos', '📸'); else alert('Limite máximo de 10 fotos por viagem atingido.');
            return;
        }
        const url = window.glassPrompt 
            ? await window.glassPrompt('Cole a URL direta da imagem para anexar:', 'https://', 'Adicionar Foto à Viagem', 'https://...', 'Anexar Foto', 'Cancelar', '📸')
            : prompt('Cole a URL direta da imagem (https://...):');
        if (!url || !url.trim() || url.trim() === 'https://') return;

        currentTripPhotos.push({
            url: url.trim(),
            fileId: null,
            caption: 'Foto da Viagem'
        });
        renderTripModalPhotosGrid();
    }

    function removeTripModalPhoto(idx) {
        currentTripPhotos.splice(idx, 1);
        renderTripModalPhotosGrid();
    }

    // ==========================================
    // TRIP MARKDOWN EDITOR HELPER FUNCTIONS
    // ==========================================
    let tripNotesEditorMode = 'write';

    function setTripNotesEditorMode(mode) {
        tripNotesEditorMode = mode;
        const writeBtn = document.getElementById('trip-notes-tab-write');
        const prevBtn = document.getElementById('trip-notes-tab-preview');
        const toolbar = document.getElementById('trip-notes-toolbar');
        const writeCont = document.getElementById('trip-notes-write-container');
        const prevCont = document.getElementById('trip-notes-preview-container');
        const textarea = document.getElementById('trip-input-notes');

        if (mode === 'write') {
            if (writeBtn) {
                writeBtn.className = 'px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer bg-white text-black shadow-md';
            }
            if (prevBtn) {
                prevBtn.className = 'px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer text-gray-300 hover:text-white hover:bg-white/10';
            }
            if (toolbar) toolbar.classList.remove('hidden');
            if (writeCont) writeCont.classList.remove('hidden');
            if (prevCont) prevCont.classList.add('hidden');
        } else {
            if (writeBtn) {
                writeBtn.className = 'px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer text-gray-300 hover:text-white hover:bg-white/10';
            }
            if (prevBtn) {
                prevBtn.className = 'px-2.5 py-1 rounded-lg text-[10px] font-mono font-bold transition cursor-pointer bg-white text-black shadow-md';
            }
            if (toolbar) toolbar.classList.add('hidden');
            if (writeCont) writeCont.classList.add('hidden');
            if (prevCont) {
                prevCont.classList.remove('hidden');
                const rawMd = textarea ? textarea.value : '';
                prevCont.innerHTML = renderRichMarkdownToHtml(rawMd);
            }
        }
    }

    function handleTripNotesInput() {
        updateTripNotesCharCounter();
        const prevCont = document.getElementById('trip-notes-preview-container');
        if (prevCont && !prevCont.classList.contains('hidden')) {
            const textarea = document.getElementById('trip-input-notes');
            const rawMd = textarea ? textarea.value : '';
            prevCont.innerHTML = renderRichMarkdownToHtml(rawMd);
        }
    }

    function updateTripNotesCharCounter() {
        const counter = document.getElementById('trip-notes-char-counter');
        const textarea = document.getElementById('trip-input-notes');
        if (!counter || !textarea) return;
        const text = textarea.value || '';
        const chars = text.length;
        const words = text.trim() ? text.trim().split(/\s+/).length : 0;
        counter.innerText = `${chars} caracteres • ${words} palavras`;
    }

    function handleTripNotesKeydown(e) {
        const textarea = e.target;
        if (!textarea) return;

        // Tab: 2 espaços
        if (e.key === 'Tab') {
            e.preventDefault();
            const start = textarea.selectionStart;
            const end = textarea.selectionEnd;
            textarea.value = textarea.value.substring(0, start) + '  ' + textarea.value.substring(end);
            textarea.selectionStart = textarea.selectionEnd = start + 2;
            handleTripNotesInput();
            return;
        }

        // Ctrl / Cmd shortcuts
        if (e.ctrlKey || e.metaKey) {
            const k = e.key.toLowerCase();
            if (k === 'b') {
                e.preventDefault();
                insertTripMarkdown('bold');
            } else if (k === 'i') {
                e.preventDefault();
                insertTripMarkdown('italic');
            } else if (k === 'k') {
                e.preventDefault();
                insertTripMarkdown('link');
            }
        }
    }

    async function insertTripMarkdown(type) {
        const textarea = document.getElementById('trip-input-notes');
        if (!textarea) return;

        const start = textarea.selectionStart || 0;
        const end = textarea.selectionEnd || 0;
        const selected = textarea.value.substring(start, end);
        let replacement = '';

        switch (type) {
            case 'H1':
                replacement = `# ${selected || 'Título Principal'}\n`;
                break;
            case 'H2':
                replacement = `## ${selected || 'Subtítulo'}\n`;
                break;
            case 'H3':
                replacement = `### ${selected || 'Seção do Roteiro'}\n`;
                break;
            case 'bold':
                replacement = `**${selected || 'texto em negrito'}**`;
                break;
            case 'italic':
                replacement = `*${selected || 'texto em itálico'}*`;
                break;
            case 'strike':
                replacement = `~~${selected || 'texto tachado'}~~`;
                break;
            case 'highlight':
                replacement = `==${selected || 'destaque'}==`;
                break;
            case 'quote':
                replacement = `> ${selected || 'Citação ou observação importante'}\n`;
                break;
            case 'code':
                replacement = `\`${selected || 'código'}\``;
                break;
            case 'codeblock':
                replacement = `\`\`\`markdown\n${selected || '// Detalhes do roteiro'}\n\`\`\`\n`;
                break;
            case 'ul':
                replacement = `- ${selected || 'Item da lista'}\n- Item adicional\n`;
                break;
            case 'ol':
                replacement = `1. ${selected || 'Primeira etapa'}\n2. Segunda etapa\n`;
                break;
            case 'task':
                replacement = `- [ ] ${selected || 'Nova tarefa a realizar'}\n- [x] Tarefa já concluída\n`;
                break;
            case 'link':
                const url = window.glassPrompt ? await window.glassPrompt('Cole a URL do link:', 'https://', 'Inserir Link', 'https://...', 'Inserir', 'Cancelar', '🔗') : prompt('Cole a URL do link:', 'https://');
                if (url) {
                    replacement = `[${selected || 'Link'}](${url.trim()})`;
                } else {
                    return;
                }
                break;
            case 'table':
                replacement = `\n| Dia / Horário | Atividade | Local |\n| :--- | :--- | :--- |\n| Manhã (09:00) | Praia & Trilha | Joaquina |\n| Tarde (14:00) | Café & Co-working | Lagoa |\n| Noite (20:00) | Jantar | Centro |\n\n`;
                break;
            case 'alert':
                replacement = `\n> [!TIP]\n> ${selected || 'Levar protetor solar, câmera fotográfica e carregador portátil.'}\n\n`;
                break;
            case 'hr':
                replacement = `\n---\n`;
                break;
            default:
                break;
        }

        textarea.value = textarea.value.substring(0, start) + replacement + textarea.value.substring(end);
        textarea.focus();
        textarea.selectionStart = start + replacement.length;
        textarea.selectionEnd = start + replacement.length;
        handleTripNotesInput();
    }

    function openNewTripModal() {
        currentEditingTripId = null;
        currentTripPhotos = [];
        const modal = document.getElementById('trip-modal');
        const form = document.getElementById('trip-form');
        const titleEl = document.getElementById('trip-modal-title');
        const deleteBtn = document.getElementById('btn-delete-trip');

        if (form) form.reset();
        if (titleEl) titleEl.innerText = 'Nova Viagem';
        if (deleteBtn) deleteBtn.classList.add('hidden');
        setTripNotesEditorMode('write');
        updateTripNotesCharCounter();
        renderTripModalPhotosGrid();
        if (modal) modal.classList.remove('hidden');
    }

    function openEditTripModal(tripId) {
        currentEditingTripId = tripId;
        const trip = trips.find(t => t.id === tripId);
        if (!trip) return;

        currentTripPhotos = Array.isArray(trip.photos) ? [...trip.photos] : [];

        const modal = document.getElementById('trip-modal');
        const titleEl = document.getElementById('trip-modal-title');
        const deleteBtn = document.getElementById('btn-delete-trip');

        if (titleEl) titleEl.innerText = 'Editar Viagem';
        if (deleteBtn) deleteBtn.classList.remove('hidden');

        document.getElementById('trip-input-title').value = trip.title || '';
        document.getElementById('trip-input-destination').value = trip.destination || '';
        document.getElementById('trip-input-category').value = trip.category || 'planned';
        document.getElementById('trip-input-start-date').value = trip.start_date || '';
        document.getElementById('trip-input-end-date').value = trip.end_date || '';
        document.getElementById('trip-input-budget').value = trip.budget || '';
        document.getElementById('trip-input-spent').value = trip.spent || '';
        document.getElementById('trip-input-status').value = trip.status || 'Em Planejamento';
        document.getElementById('trip-input-priority').value = trip.priority || 'Média';
        document.getElementById('trip-input-notes').value = trip.notes || '';

        setTripNotesEditorMode('write');
        updateTripNotesCharCounter();
        renderTripModalPhotosGrid();
        if (modal) modal.classList.remove('hidden');
    }

    function closeTripModal() {
        const modal = document.getElementById('trip-modal');
        if (modal) modal.classList.add('hidden');
    }

    async function handleSaveTripForm(e) {
        e.preventDefault();

        const title = document.getElementById('trip-input-title').value.trim();
        const destination = document.getElementById('trip-input-destination').value.trim();
        const category = document.getElementById('trip-input-category').value;
        const start_date = document.getElementById('trip-input-start-date').value || null;
        const end_date = document.getElementById('trip-input-end-date').value || null;
        const budget = parseFloat(document.getElementById('trip-input-budget').value) || 0;
        const spent = parseFloat(document.getElementById('trip-input-spent').value) || 0;
        const status = document.getElementById('trip-input-status').value;
        const priority = document.getElementById('trip-input-priority').value;
        const notes = document.getElementById('trip-input-notes').value.trim();

        if (!title || !destination) return;

        let tripObj;
        if (currentEditingTripId) {
            const idx = trips.findIndex(t => t.id === currentEditingTripId);
            if (idx !== -1) {
                trips[idx] = {
                    ...trips[idx],
                    title,
                    destination,
                    category,
                    start_date,
                    end_date,
                    budget,
                    spent,
                    status,
                    priority,
                    notes,
                    photos: currentTripPhotos,
                    updated_at: new Date().toISOString()
                };
                tripObj = trips[idx];
            }
        } else {
            tripObj = {
                id: 'trip_' + Date.now(),
                title,
                destination,
                category,
                start_date,
                end_date,
                budget,
                spent,
                status,
                priority,
                notes,
                checklist: [],
                photos: currentTripPhotos,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };
            trips.unshift(tripObj);
        }

        saveLocalStorageBackup();
        renderTripUI();
        closeTripModal();

        const client = getSupabase();
        if (client && tripObj) {
            try {
                await client.from('control_trips').upsert(tripObj);
            } catch (err) {
                console.error('Erro ao salvar viagem no Supabase:', err);
            }
        }

        if (window.showToast) {
            window.showToast('✓ Viagem salva com sucesso!');
        }
    }

    async function deleteTrip(tripId) {
        if (!tripId) return;
        const confirmed = window.glassConfirm ? await window.glassConfirm('Deseja realmente excluir esta viagem?', 'Excluir Viagem', 'Excluir Viagem', 'Cancelar', true, '✈️') : confirm('Deseja realmente excluir esta viagem?');
        if (!confirmed) return;

        trips = trips.filter(t => t.id !== tripId);
        saveLocalStorageBackup();
        renderTripUI();
        closeTripModal();

        const client = getSupabase();
        if (client) {
            try {
                await client.from('control_trips').delete().eq('id', tripId);
            } catch (err) {
                console.error('Erro ao excluir viagem do Supabase:', err);
            }
        }

        if (window.showToast) window.showToast('✓ Viagem removida!');
    }

    async function toggleTripChecklistItem(tripId, itemIndex) {
        const trip = trips.find(t => t.id === tripId);
        if (!trip || !trip.checklist || !trip.checklist[itemIndex]) return;

        trip.checklist[itemIndex].done = !trip.checklist[itemIndex].done;
        saveLocalStorageBackup();
        renderTripUI();

        const client = getSupabase();
        if (client) {
            try {
                await client.from('control_trips').update({ checklist: trip.checklist, updated_at: new Date().toISOString() }).eq('id', tripId);
            } catch (e) {}
        }
    }

    async function markTripAsCompleted(tripId) {
        const trip = trips.find(t => t.id === tripId);
        if (!trip) return;

        trip.category = 'completed';
        trip.status = 'Realizada';
        saveLocalStorageBackup();
        renderTripUI();

        const client = getSupabase();
        if (client) {
            try {
                await client.from('control_trips').update({ category: 'completed', status: 'Realizada', updated_at: new Date().toISOString() }).eq('id', tripId);
            } catch (e) {}
        }

        if (window.showToast) window.showToast(`🏆 Parabéns! Viagem "${trip.title}" marcada como Realizada!`);
    }

    async function promoteWishlistToPlanned(tripId) {
        const trip = trips.find(t => t.id === tripId);
        if (!trip) return;

        trip.category = 'planned';
        trip.status = 'Em Planejamento';
        saveLocalStorageBackup();
        renderTripUI();

        const client = getSupabase();
        if (client) {
            try {
                await client.from('control_trips').update({ category: 'planned', status: 'Em Planejamento', updated_at: new Date().toISOString() }).eq('id', tripId);
            } catch (e) {}
        }

        if (window.showToast) window.showToast(`✈️ Destino "${trip.destination}" promovido para Viagens Planejadas!`);
    }

    // ==========================================
    // MODO VISUALIZER CINEMATOGRÁFICO DE VIAGENS (BOTÃO OLHO 👁️)
    // ==========================================
    let activeVisualizerTripId = null;
    let activeVisualizerPhotoIdx = 0;

    function openTripVisualizerModal(tripId) {
        const trip = trips.find(t => t.id === tripId);
        if (!trip) return;
        activeVisualizerTripId = tripId;
        activeVisualizerPhotoIdx = 0;

        const modal = document.getElementById('trip-visualizer-modal');
        if (!modal) return;

        // Header info
        const titleEl = document.getElementById('trip-vis-title');
        const destEl = document.getElementById('trip-vis-dest-badge');
        const catEl = document.getElementById('trip-vis-category-badge');
        const prioEl = document.getElementById('trip-vis-priority-badge');
        const editBtn = document.getElementById('trip-vis-edit-btn');

        if (titleEl) titleEl.innerText = trip.title;
        if (destEl) destEl.innerText = `📍 ${trip.destination || 'DESTINO'}`;

        const categoryBadges = {
            'planned': '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-amber-500/20 text-amber-300 border border-amber-500/30">✈️ Planejada</span>',
            'wishlist': '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/30">🌟 Desejo</span>',
            'completed': '<span class="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">🏆 Realizada</span>'
        };
        const priorityBadges = {
            'Alta': '<span class="px-2 py-0.5 rounded-full text-[10px] font-mono text-rose-300 bg-rose-500/10 border border-rose-500/20">🔴 Alta Prioridade</span>',
            'Média': '<span class="px-2 py-0.5 rounded-full text-[10px] font-mono text-amber-300 bg-amber-500/10 border border-amber-500/20">🟡 Média</span>',
            'Baixa': '<span class="px-2 py-0.5 rounded-full text-[10px] font-mono text-emerald-300 bg-emerald-500/10 border border-emerald-500/20">🟢 Baixa</span>'
        };

        if (catEl) catEl.innerHTML = categoryBadges[trip.category] || '';
        if (prioEl) prioEl.innerHTML = trip.priority ? priorityBadges[trip.priority] || '' : '';
        if (editBtn) {
            editBtn.onclick = () => {
                closeTripVisualizerModal();
                openEditTripModal(trip.id);
            };
        }

        // Render Photo Gallery
        renderTripVisGallery();

        // Dates & Status
        const datesEl = document.getElementById('trip-vis-dates-text');
        const statusEl = document.getElementById('trip-vis-status-badge');
        if (datesEl) {
            if (trip.start_date) {
                datesEl.innerText = `${trip.start_date.split('-').reverse().join('/')} ${trip.end_date ? `➔ ${trip.end_date.split('-').reverse().join('/')}` : ''}`;
            } else {
                datesEl.innerText = 'Datas a definir';
            }
        }
        if (statusEl) statusEl.innerText = trip.status || (trip.category === 'completed' ? 'Concluída' : 'Planejamento');

        // Budget
        const budget = parseFloat(trip.budget) || 0;
        const spent = parseFloat(trip.spent) || 0;
        const pctSpent = budget > 0 ? Math.min(Math.round((spent / budget) * 100), 100) : 0;
        const budgetVal = document.getElementById('trip-vis-budget-val');
        const spentVal = document.getElementById('trip-vis-spent-val');
        const budgetBar = document.getElementById('trip-vis-budget-bar');
        if (budgetVal) budgetVal.innerText = `R$ ${budget.toLocaleString('pt-BR')}`;
        if (spentVal) {
            spentVal.innerText = `R$ ${spent.toLocaleString('pt-BR')} (${pctSpent}%)`;
            spentVal.style.color = spent > budget ? '#f43f5e' : 'var(--trip-accent, #f59e0b)';
        }
        if (budgetBar) {
            budgetBar.style.width = `${pctSpent}%`;
            budgetBar.className = 'h-2 rounded-full transition-all duration-500';
            budgetBar.style.background = spent > budget ? '#f43f5e' : 'var(--trip-accent, #f59e0b)';
            budgetBar.style.boxShadow = spent > budget ? 'none' : '0 0 10px var(--trip-accent, #f59e0b)';
        }

        // Checklist / To-Do
        renderTripVisChecklist();

        // Notes / Markdown
        const notesBody = document.getElementById('trip-vis-notes-body');
        if (notesBody) {
            if (trip.notes && trip.notes.trim()) {
                notesBody.innerHTML = renderRichMarkdownToHtml(trip.notes);
            } else {
                notesBody.innerHTML = '<p class="text-gray-500 italic">Nenhuma anotação ou roteiro adicionado ainda. Clique em Editar para adicionar detalhes em Markdown.</p>';
            }
        }

        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden';
    }

    function closeTripVisualizerModal() {
        const modal = document.getElementById('trip-visualizer-modal');
        if (modal) modal.classList.add('hidden');
        document.body.style.overflow = '';
        activeVisualizerTripId = null;
    }

    function renderTripVisGallery() {
        const trip = trips.find(t => t.id === activeVisualizerTripId);
        if (!trip) return;
        const photos = Array.isArray(trip.photos) ? trip.photos : [];
        const heroImg = document.getElementById('trip-vis-hero-img');
        const heroEmpty = document.getElementById('trip-vis-hero-empty');
        const countBadge = document.getElementById('trip-vis-photo-count');
        const thumbsStrip = document.getElementById('trip-vis-thumbs-strip');
        const captionText = document.getElementById('trip-vis-caption-text');
        const fsBtn = document.getElementById('trip-vis-fullscreen-btn');
        const prevBtn = document.getElementById('trip-vis-prev-btn');
        const nextBtn = document.getElementById('trip-vis-next-btn');

        if (countBadge) countBadge.innerText = `${photos.length} fotos`;

        if (photos.length === 0) {
            if (heroImg) heroImg.classList.add('hidden');
            if (heroEmpty) heroEmpty.classList.remove('hidden');
            if (thumbsStrip) thumbsStrip.innerHTML = '';
            if (prevBtn) prevBtn.classList.add('hidden');
            if (nextBtn) nextBtn.classList.add('hidden');
            return;
        }

        if (heroEmpty) heroEmpty.classList.add('hidden');
        if (heroImg) {
            heroImg.classList.remove('hidden');
            if (activeVisualizerPhotoIdx >= photos.length) activeVisualizerPhotoIdx = 0;
            const currentPhoto = photos[activeVisualizerPhotoIdx];
            heroImg.src = currentPhoto.url;
            if (captionText) captionText.innerText = `Foto ${activeVisualizerPhotoIdx + 1} de ${photos.length}`;
            if (fsBtn) {
                fsBtn.onclick = () => {
                    openMediaLightbox(currentPhoto.url, `${trip.destination} — ${trip.title}`);
                };
            }
        }

        if (prevBtn) prevBtn.classList.toggle('hidden', photos.length <= 1);
        if (nextBtn) nextBtn.classList.toggle('hidden', photos.length <= 1);

        if (thumbsStrip) {
            thumbsStrip.innerHTML = photos.map((p, idx) => `
                <div onclick="window.ControlEngine.selectTripVisPhoto(${idx})" class="w-16 h-16 rounded-xl overflow-hidden cursor-pointer border-2 transition shrink-0 ${idx === activeVisualizerPhotoIdx ? 'border-amber-400 scale-105 shadow-lg' : 'border-white/10 opacity-60 hover:opacity-100'}">
                    <img src="${escapeHtml(p.url)}" alt="Thumb" class="w-full h-full object-cover" />
                </div>
            `).join('');
        }
    }

    function selectTripVisPhoto(idx) {
        activeVisualizerPhotoIdx = idx;
        renderTripVisGallery();
    }

    function navigateTripVisPhoto(dir) {
        const trip = trips.find(t => t.id === activeVisualizerTripId);
        if (!trip || !Array.isArray(trip.photos) || trip.photos.length === 0) return;
        activeVisualizerPhotoIdx = (activeVisualizerPhotoIdx + dir + trip.photos.length) % trip.photos.length;
        renderTripVisGallery();
    }

    function renderTripVisChecklist() {
        const trip = trips.find(t => t.id === activeVisualizerTripId);
        if (!trip) return;
        const checklist = Array.isArray(trip.checklist) ? trip.checklist : [];
        const container = document.getElementById('trip-vis-checklist-items');
        const counterEl = document.getElementById('trip-vis-checklist-count');
        const doneCount = checklist.filter(c => c.done).length;

        if (counterEl) counterEl.innerText = `${doneCount}/${checklist.length}`;

        if (!container) return;
        if (checklist.length === 0) {
            container.innerHTML = '<p class="text-[11px] text-gray-500 font-mono italic">Nenhum item no checklist. Adicione abaixo.</p>';
            return;
        }

        container.innerHTML = checklist.map((item, idx) => `
            <div class="flex items-center justify-between gap-2 p-2 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.05] transition">
                <label class="flex items-center gap-2.5 text-xs font-mono cursor-pointer select-none text-gray-200 flex-1">
                    <input type="checkbox" ${item.done ? 'checked' : ''} onchange="window.ControlEngine.toggleTripVisChecklistItem(${idx})" class="w-4 h-4 rounded text-amber-500 bg-white/10 border-white/20" />
                    <span class="${item.done ? 'line-through text-gray-500' : 'text-white'}">${escapeHtml(item.task)}</span>
                </label>
                <button type="button" onclick="window.ControlEngine.deleteTripVisChecklistItem(${idx})" class="text-gray-500 hover:text-rose-400 text-xs px-1" title="Excluir">✕</button>
            </div>
        `).join('');
    }

    function toggleTripVisChecklistItem(idx) {
        const trip = trips.find(t => t.id === activeVisualizerTripId);
        if (!trip || !Array.isArray(trip.checklist) || !trip.checklist[idx]) return;
        trip.checklist[idx].done = !trip.checklist[idx].done;
        saveTripToStorageAndSupabase(trip);
        renderTripVisChecklist();
        renderTripCards();
    }

    function addTripVisChecklistItem() {
        const input = document.getElementById('trip-vis-new-todo-input');
        if (!input) return;
        const task = input.value.trim();
        if (!task) return;
        const trip = trips.find(t => t.id === activeVisualizerTripId);
        if (!trip) return;
        if (!Array.isArray(trip.checklist)) trip.checklist = [];
        trip.checklist.push({ task: task, done: false });
        input.value = '';
        saveTripToStorageAndSupabase(trip);
        renderTripVisChecklist();
        renderTripCards();
    }

    function deleteTripVisChecklistItem(idx) {
        const trip = trips.find(t => t.id === activeVisualizerTripId);
        if (!trip || !Array.isArray(trip.checklist)) return;
        trip.checklist.splice(idx, 1);
        saveTripToStorageAndSupabase(trip);
        renderTripVisChecklist();
        renderTripCards();
    }

    async function saveTripToStorageAndSupabase(trip) {
        saveLocalStorageBackup();
        const client = getSupabase();
        if (client) {
            try {
                await client.from('control_trips').update({
                    checklist: trip.checklist,
                    notes: trip.notes,
                    spent: trip.spent,
                    status: trip.status,
                    updated_at: new Date().toISOString()
                }).eq('id', trip.id);
            } catch (err) {}
        }
    }

        // ==========================================
    // SISTEMA DE CORES SECUNDÁRIAS POR SESSION
    // ==========================================
    const SESSION_DEFAULT_COLORS = {
        'trip': '#f59e0b',
        'studies': '#0ea5e9',
        'reminders': '#8b5cf6',
        'todos': '#10b981',
        'habits': '#10b981',
        'cartas': '#ec4899',
        'pote-graca': '#10b981',
        'pote-desgraca': '#ef4444',
        'dreamboard': '#a855f7'
    };

    let sessionAccentColors = { ...SESSION_DEFAULT_COLORS };

    const SESSION_COLOR_PRESETS = [
        { name: 'Esmeralda', hex: '#10b981' },
        { name: 'Menta Neon', hex: '#00f59b' },
        { name: 'Ciano Cyber', hex: '#06b6d4' },
        { name: 'Azul Elétrico', hex: '#38bdf8' },
        { name: 'Azul Cobalto', hex: '#3b82f6' },
        { name: 'Índigo Royal', hex: '#6366f1' },
        { name: 'Violeta', hex: '#8b5cf6' },
        { name: 'Púrpura Neon', hex: '#a855f7' },
        { name: 'Magenta Cyber', hex: '#d946ef' },
        { name: 'Rosa Choque', hex: '#ec4899' },
        { name: 'Rose Neon', hex: '#f43f5e' },
        { name: 'Carmim Intenso', hex: '#ef4444' },
        { name: 'Coral Laranja', hex: '#f97316' },
        { name: 'Âmbar Dourado', hex: '#f59e0b' },
        { name: 'Ouro Radiante', hex: '#eab308' },
        { name: 'Lima Tóxico', hex: '#84cc16' },
        { name: 'Turquesa', hex: '#14b8a6' },
        { name: 'Grafite Titânio', hex: '#94a3b8' }
    ];

    const SESSION_COLOR_PALETTES = SESSION_COLOR_PRESETS;

    // =========================================================================
    // MAPEAMENTO DINÂMICO DE CORES DA SESSÃO -> GOOGLE CALENDAR API (COLORID)
    // =========================================================================

    const GCAL_COLOR_PALETTE_MAP = {
        '1':  { name: 'Lavanda', hex: '#7986cb', r: 121, g: 134, b: 203 },
        '2':  { name: 'Sálvia', hex: '#33b679', r: 51,  g: 182, b: 121 },
        '3':  { name: 'Uva', hex: '#8e24aa', r: 142, g: 36,  b: 170 },
        '4':  { name: 'Flamingo', hex: '#e67c73', r: 230, g: 124, b: 115 },
        '5':  { name: 'Banana', hex: '#f6bf26', r: 246, g: 191, b: 38  },
        '6':  { name: 'Tangerina', hex: '#f4511e', r: 244, g: 81,  b: 30  },
        '7':  { name: 'Pavão', hex: '#039be5', r: 3,   g: 155, b: 229 },
        '8':  { name: 'Grafite', hex: '#616161', r: 97,  g: 97,  b: 97  },
        '9':  { name: 'Mirtilo', hex: '#3f51b5', r: 63,  g: 81,  b: 181 },
        '10': { name: 'Manjericão', hex: '#0b8043', r: 11,  g: 128, b: 67  },
        '11': { name: 'Tomate', hex: '#d50000', r: 213, g: 0,   b: 0   }
    };

    function getClosestGoogleColorId(hexColor) {
        if (!hexColor || !hexColor.startsWith('#')) return '7';
        let hex = hexColor.trim();
        if (hex.length === 4) {
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
        }
        const r = parseInt(hex.slice(1, 3), 16) || 0;
        const g = parseInt(hex.slice(3, 5), 16) || 0;
        const b = parseInt(hex.slice(5, 7), 16) || 0;

        let closestId = '7';
        let minDistance = Infinity;

        Object.entries(GCAL_COLOR_PALETTE_MAP).forEach(([id, item]) => {
            const dr = (r - item.r) * 0.3;
            const dg = (g - item.g) * 0.59;
            const db = (b - item.b) * 0.11;
            const dist = dr * dr + dg * dg + db * db;
            if (dist < minDistance) {
                minDistance = dist;
                closestId = id;
            }
        });

        return closestId;
    }

    function getSessionColor(sectionKey, opacity = 1) {
        let key = sectionKey;
        let hex = (sessionAccentColors && sessionAccentColors[key])
            || (SESSION_DEFAULT_COLORS && SESSION_DEFAULT_COLORS[key])
            || '#0ea5e9';
        if (opacity === 1) return hex;
        let cleanHex = hex.trim();
        if (cleanHex.length === 4) {
            cleanHex = '#' + cleanHex[1] + cleanHex[1] + cleanHex[2] + cleanHex[2] + cleanHex[3] + cleanHex[3];
        }
        const r = parseInt(cleanHex.slice(1, 3), 16) || 14;
        const g = parseInt(cleanHex.slice(3, 5), 16) || 165;
        const b = parseInt(cleanHex.slice(5, 7), 16) || 233;
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    function updateCalendarFilterPillsColors() {
        const filters = ['all', 'google', 'reminders', 'todos', 'studies', 'habits', 'diary'];
        filters.forEach(f => {
            const btn = document.getElementById(`cal-filter-${f}`);
            if (!btn) return;
            if (f === 'all') {
                if (calendarFilter === 'all') {
                    btn.className = 'px-2.5 py-1 rounded-lg bg-white text-black font-bold cursor-pointer transition shadow-md';
                    btn.style = '';
                } else {
                    btn.className = 'px-2.5 py-1 rounded-lg bg-white/10 text-gray-300 border border-white/20 cursor-pointer transition';
                    btn.style = '';
                }
                return;
            }

            const color = f === 'google' ? '#38bdf8' : getSessionColor(f);
            const isActive = calendarFilter === f;

            if (isActive) {
                btn.className = 'px-2.5 py-1 rounded-lg font-bold cursor-pointer transition shadow-md';
                btn.style.background = color;
                btn.style.color = '#000000';
                btn.style.border = `1px solid ${color}`;
                btn.style.boxShadow = `0 0 16px ${color}88`;
            } else {
                btn.className = 'px-2.5 py-1 rounded-lg cursor-pointer transition font-mono';
                btn.style.background = `${color}18`;
                btn.style.color = color;
                btn.style.border = `1px solid ${color}45`;
                btn.style.boxShadow = 'none';
            }
        });
    }


    let activeColorConfigSessionKey = null;
    let tempSelectedColorHex = null;

    function initSessionAccentColors() {
        Object.keys(SESSION_DEFAULT_COLORS).forEach(key => {
            const savedColor = localStorage.getItem(`mcp_accent_${key}`) || SESSION_DEFAULT_COLORS[key];
            applySessionAccentColor(key, savedColor, false);
        });
    }

    function applySessionAccentColor(sessionKey, colorHex, save = true) {
        if (!sessionKey || !colorHex) return;
        sessionAccentColors[sessionKey] = colorHex;
        document.documentElement.style.setProperty(`--${sessionKey}-accent`, colorHex);

        let r = 16, g = 185, b = 129;
        try {
            r = parseInt(colorHex.slice(1, 3), 16);
            g = parseInt(colorHex.slice(3, 5), 16);
            b = parseInt(colorHex.slice(5, 7), 16);
        } catch(e){}
        document.documentElement.style.setProperty(`--${sessionKey}-accent-rgb`, `${r}, ${g}, ${b}`);

        if (save) {
            localStorage.setItem(`mcp_accent_${sessionKey}`, colorHex);
        }

        updateCalendarFilterPillsColors();

        // ==========================================
        // PROPAGAÇÃO INTELIGENTE POR SESSÃO
        // ==========================================

        // 1. TRIP
        if (sessionKey === 'trip') {
            const tripTag = document.getElementById('trip-header-tag');
            if (tripTag) tripTag.style.color = colorHex;
            const tripCountdown = document.getElementById('trip-next-countdown');
            if (tripCountdown) tripCountdown.style.color = colorHex;
            const tripStatsCounter = document.getElementById('trip-stats-counter');
            if (tripStatsCounter) tripStatsCounter.style.color = colorHex;

            ['trip-stat-planned-count', 'trip-stat-wishlist-count', 'trip-stat-completed-count', 'trip-stat-total-budget'].forEach(id => {
                const el = document.getElementById(id);
                if (el) el.style.color = colorHex;
            });

            document.querySelectorAll('.trip-accent-btn').forEach(btn => {
                btn.style.background = colorHex;
                btn.style.boxShadow = `0 4px 20px -2px ${colorHex}`;
            });

            setTripCategoryFilter(tripFilterCategory || 'all');
            renderTripCards();
        }

        // 3. ESTUDOS (STUD)
        if (sessionKey === 'studies') {
            renderStudyScheduleUI();
            renderStudyTableGridUI();
            updateStudyStatusUI();
        }

        // 4. LEMBRETES & ALARMES
        if (sessionKey === 'reminders') {
            renderRemindersListUI();
            renderReminderMatrixTableGridUI();
        }

        // 5. TO-DO PERSONALS
        if (sessionKey === 'todos') {
            renderTodosListUI();
            renderTodoMatrixTableGridUI();
        }

        // 6. HABIT TRACKER
        if (sessionKey === 'habits') {
            if (window.HabitTracker && typeof window.HabitTracker.renderHabits === 'function') {
                window.HabitTracker.renderHabits();
            }
        }

        // Casar cores em todas as representações do calendário geral e visão 360°
        renderControlCalendar();
        if (selectedCalendarDateStr) {
            renderControlCalendarDayDetails(selectedCalendarDateStr);
        }
    }

    function openSessionColorConfigModal(sessionKey, sessionName) {
        activeColorConfigSessionKey = sessionKey;
        const currentSaved = localStorage.getItem(`mcp_accent_${sessionKey}`) || SESSION_DEFAULT_COLORS[sessionKey] || '#8b5cf6';
        tempSelectedColorHex = currentSaved;

        const modal = document.getElementById('session-color-config-modal');
        const titleEl = document.getElementById('session-color-modal-title');
        const subEl = document.getElementById('session-color-modal-subtitle');
        const previewDot = document.getElementById('session-color-preview-dot');
        const previewHex = document.getElementById('session-color-preview-hex');
        const colorPicker = document.getElementById('session-color-picker-input');
        const colorText = document.getElementById('session-color-text-input');
        const presetsGrid = document.getElementById('session-color-presets-grid');

        if (titleEl) titleEl.innerText = `Personalizar Cor Secundária`;
        if (subEl) subEl.innerText = `Sessão: ${sessionName || sessionKey.toUpperCase()}`;
        if (previewDot) previewDot.style.background = currentSaved;
        if (previewHex) previewHex.innerText = currentSaved;
        if (colorPicker) colorPicker.value = currentSaved;
        if (colorText) colorText.value = currentSaved;

        if (presetsGrid) {
            presetsGrid.innerHTML = SESSION_COLOR_PRESETS.map(preset => `
                <button type="button" onclick="window.ControlEngine.selectSessionCustomColor('${preset.hex}', true)" class="flex flex-col items-center gap-1.5 p-2 rounded-xl bg-white/5 hover:bg-white/15 border transition cursor-pointer ${preset.hex.toLowerCase() === currentSaved.toLowerCase() ? 'border-white scale-105 shadow-lg' : 'border-white/10'}" title="${preset.name}">
                    <span class="w-6 h-6 rounded-full shadow-md" style="background: ${preset.hex}"></span>
                    <span class="text-[9px] text-gray-300 font-mono">${preset.name}</span>
                </button>
            `).join('');
        }

        if (modal) {
            modal.classList.remove('hidden');
            document.body.style.overflow = 'hidden';
        }
    }

    function selectSessionCustomColor(colorHex, shouldClose = false) {
        if (!colorHex || !colorHex.startsWith('#')) return;
        tempSelectedColorHex = colorHex;
        const previewDot = document.getElementById('session-color-preview-dot');
        const previewHex = document.getElementById('session-color-preview-hex');
        const colorPicker = document.getElementById('session-color-picker-input');
        const colorText = document.getElementById('session-color-text-input');

        if (previewDot) previewDot.style.background = colorHex;
        if (previewHex) previewHex.innerText = colorHex;
        if (colorPicker) colorPicker.value = colorHex;
        if (colorText) colorText.value = colorHex;

        if (activeColorConfigSessionKey) {
            applySessionAccentColor(activeColorConfigSessionKey, colorHex, true);
        }

        if (shouldClose) {
            if (window.showToast) window.showToast(`🎨 Cor de destaque aplicada com sucesso!`);
            closeSessionColorConfigModal();
        }
    }

    function saveSessionColorChoice() {
        if (activeColorConfigSessionKey && tempSelectedColorHex) {
            applySessionAccentColor(activeColorConfigSessionKey, tempSelectedColorHex, true);
            showToast(`🎨 Cor secundária salva para ${activeColorConfigSessionKey.toUpperCase()}!`);
        }
        closeSessionColorConfigModal();
    }

    function resetSessionColorToDefault() {
        if (!activeColorConfigSessionKey) return;
        const def = SESSION_DEFAULT_COLORS[activeColorConfigSessionKey] || '#8b5cf6';
        selectSessionCustomColor(def);
        applySessionAccentColor(activeColorConfigSessionKey, def, true);
        showToast(`🔄 Cor padrão restaurada!`);
        closeSessionColorConfigModal();
    }

    function closeSessionColorConfigModal() {
        const modal = document.getElementById('session-color-config-modal');
        if (modal) modal.classList.add('hidden');
        document.body.style.overflow = '';
        activeColorConfigSessionKey = null;
    }

    // ==============================================================================
    // NOTION TASKS & ALARMS SYNC ENGINE (OFICIAL PERSONAL OS — BIDIRECIONAL MÃO DUPLA)
    // ==============================================================================

    const NOTION_GROUP_ID = 'group_notion';
    const DEFAULT_NOTION_GROUP = {
        id: NOTION_GROUP_ID,
        title: 'Notion • Tasks & Alarmes',
        emoji: '📝',
        color: '#6366f1',
        description: 'Tarefas e alarmes sincronizados diretamente da sua página do Notion',
        sort_order: 3
    };

    const NOTION_REMINDER_GROUP_ID = 'rem_grp_notion';
    const DEFAULT_NOTION_REMINDER_GROUP = {
        id: NOTION_REMINDER_GROUP_ID,
        title: 'Notion • Tasks & Alarmes',
        emoji: '📝',
        color: '#6366f1'
    };

    let isSyncingNotion = false;

    function sanitizeReminderForSupabase(rem) {
        if (!rem) return {};
        return {
            id: rem.id,
            group_id: rem.group_id || null,
            title: rem.title || 'Lembrete',
            notes: rem.notes || '',
            emoji: rem.emoji || '🔔',
            color: rem.color || '#a855f7',
            reminder_type: rem.reminder_type || 'one_time',
            target_date: rem.target_date || null,
            target_time: rem.target_time || '12:00',
            day_of_week: Number(rem.day_of_week !== undefined ? rem.day_of_week : 0),
            is_active: rem.is_active !== undefined ? !!rem.is_active : true,
            created_at: rem.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }

    function sanitizeReminderUpdatesForSupabase(updates) {
        if (!updates) return {};
        const allowed = [
            'group_id', 'title', 'notes', 'emoji', 'color', 'reminder_type',
            'target_date', 'target_time', 'day_of_week', 'is_active',
            'last_triggered_at', 'updated_at', 'day_of_month', 'interval_minutes'
        ];
        const clean = {};
        for (const [k, v] of Object.entries(updates)) {
            if (allowed.includes(k)) clean[k] = v;
        }
        clean.updated_at = new Date().toISOString();
        return clean;
    }

    function sanitizeTodoForSupabase(todo) {
        if (!todo) return {};
        return {
            id: todo.id,
            group_id: todo.group_id || 'group_main',
            title: todo.title || 'Tarefa',
            description: todo.description || '',
            is_completed: !!todo.is_completed,
            priority: todo.priority || 'normal',
            due_date: todo.due_date || null,
            due_time: todo.due_time || null,
            has_alarm: !!todo.has_alarm,
            is_recurring: !!todo.is_recurring,
            recurring_dates: Array.isArray(todo.recurring_dates) ? todo.recurring_dates : [],
            alarm_triggered: !!todo.alarm_triggered,
            sort_order: Number(todo.sort_order || 0),
            created_at: todo.created_at || new Date().toISOString(),
            updated_at: new Date().toISOString()
        };
    }

    function safeSupabaseExec(builder) {
        if (!builder) return;
        try {
            if (typeof builder.then === 'function') {
                builder.then(
                    (res) => {
                        if (res && res.error) {
                            console.warn('[SUPABASE SAFE EXEC WARNING]', res.error.message || res.error);
                        }
                    },
                    (err) => {
                        console.warn('[SUPABASE SAFE EXEC REJECTION]', err);
                    }
                );
            }
        } catch (e) {
            console.warn('[SUPABASE SAFE EXEC ERROR]', e);
        }
    }

    function ensureNotionGroupExists() {
        if (!todoGroups.some(g => g.id === NOTION_GROUP_ID)) {
            todoGroups.push({ ...DEFAULT_NOTION_GROUP });
            saveLocalStorageBackup();
            renderTodoGroupsUI();
            renderTodoGroupFilterTabs();
            updateGroupDropdowns();

            const client = getSupabase();
            if (client) {
                safeSupabaseExec(client.from('control_todo_groups').upsert([{
                    id: NOTION_GROUP_ID,
                    title: 'Notion • Tasks & Alarmes',
                    emoji: '📝',
                    color: '#6366f1',
                    description: 'Tarefas e alarmes sincronizados diretamente da sua página do Notion',
                    sort_order: 3
                }]));
            }
        }
    }

    function ensureNotionReminderGroupExists() {
        if (!reminderGroups.some(g => g.id === NOTION_REMINDER_GROUP_ID)) {
            reminderGroups.push({ ...DEFAULT_NOTION_REMINDER_GROUP });
            saveLocalStorageBackup();
            renderReminderGroupsUI();
            updateGroupDropdowns();

            const client = getSupabase();
            if (client) {
                safeSupabaseExec(client.from('control_reminder_groups').upsert([{
                    id: NOTION_REMINDER_GROUP_ID,
                    title: 'Notion • Tasks & Alarmes',
                    emoji: '📝',
                    color: '#6366f1'
                }]));
            }
        }
    }

    async function callNotionProxy(endpointParams, method = 'GET', body = null) {
        const headers = { 'Content-Type': 'application/json' };
        if (notionSettings.token) {
            headers['Authorization'] = `Bearer ${notionSettings.token}`;
        }
        const options = { method, headers };
        if (body) options.body = JSON.stringify(body);

        let lastErr = null;

        // 1. Tenta endpoint relativo (/api/notion) — funciona em Web Vercel e no App macOS Nativo
        try {
            const res = await fetch(`/api/notion?${endpointParams}`, options);
            if (res.ok) return await res.json();
            const errData = await res.json().catch(() => ({}));
            if (errData && errData.error) lastErr = new Error(errData.error);
        } catch (e) {
            lastErr = e;
        }

        // 2. Fallback de Produção Vercel Direto (para plataformas sem proxy de scheme)
        const vercelHosts = [
            'https://m-c-p-os-personal-os-1.vercel.app',
            'https://m-c-p-personal-os.vercel.app'
        ];
        for (const host of vercelHosts) {
            try {
                const res = await fetch(`${host}/api/notion?${endpointParams}`, options);
                if (res.ok) return await res.json();
                const errData = await res.json().catch(() => ({}));
                if (errData && errData.error) throw new Error(errData.error);
            } catch (e) {
                if (!lastErr || lastErr.message === 'Load failed') lastErr = e;
            }
        }

        // 3. Fallback de Desenvolvimento Local (apenas se executando em servidor HTTP local)
        if (typeof window !== 'undefined' && window.location && window.location.protocol === 'http:' && window.location.hostname === 'localhost') {
            try {
                const res2 = await fetch(`http://localhost:5173/api/notion?${endpointParams}`, options);
                if (res2.ok) return await res2.json();
                const errData2 = await res2.json().catch(() => ({}));
                if (errData2 && errData2.error) throw new Error(errData2.error);
            } catch (e2) {
                if (!lastErr) lastErr = e2;
            }
        }

        throw lastErr || new Error('Não foi possível conectar ao endpoint /api/notion.');
    }

    async function testNotionConnection() {
        const statusEl = document.getElementById('notion-connection-status');
        if (statusEl) {
            statusEl.innerHTML = `<span class="text-amber-300 animate-pulse text-xs font-mono">Testando conexão com Notion...</span>`;
        }

        try {
            const res = await callNotionProxy('action=test');
            if (res && res.ok) {
                const botName = res.bot?.name || 'TASKS';
                const workspace = res.bot?.bot?.workspace_name || 'Workspace';
                const count = res.shared_count || 0;
                
                if (statusEl) {
                    statusEl.innerHTML = `
                        <div class="space-y-1 text-xs font-mono">
                            <span class="text-emerald-400 font-bold flex items-center gap-1.5">
                                <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                                🟢 Conectado: ${escapeHtml(botName)} (${escapeHtml(workspace)})
                            </span>
                            <span class="text-gray-300 block text-[11px]">
                                ${count > 0 ? `✓ ${count} página(s)/base(s) compartilhada(s) encontrada(s)` : '⚠️ Nenhuma página compartilhada ainda. No Notion, abra a página -> clique em "..." -> Conexões -> selecione TASKS.'}
                            </span>
                        </div>
                    `;
                }
                return res;
            } else {
                throw new Error(res.error || 'Falha ao validar token do Notion.');
            }
        } catch (err) {
            if (statusEl) {
                statusEl.innerHTML = `
                    <span class="text-rose-400 font-bold flex items-center gap-1.5 text-xs font-mono">
                        ❌ Erro: ${escapeHtml(err.message)}
                    </span>
                `;
            }
            return null;
        }
    }

    async function pushReminderToNotion(rem) {
        if (isSyncingNotion || !rem || !rem.title) return;

        let pageId = rem.notion_page_id;
        if (!pageId && rem.id && rem.id.startsWith('notion_rem_')) {
            const raw = rem.id.replace('notion_rem_', '');
            pageId = raw.length === 32
                ? `${raw.slice(0,8)}-${raw.slice(8,12)}-${raw.slice(12,16)}-${raw.slice(16,20)}-${raw.slice(20)}`
                : raw;
        }
        if (!pageId && rem.notes) {
            const match = rem.notes.match(/\[notion_id:\s*([a-f0-9-]+)\]/i);
            if (match) pageId = match[1];
        }

        try {
            if (pageId) {
                // Atualiza página existente no Notion
                await callNotionProxy('action=update_task', 'POST', {
                    page_id: pageId,
                    title: rem.title,
                    due_date: rem.target_date,
                    due_time: rem.target_time,
                    is_completed: !rem.is_active,
                    status: rem.is_active ? 'A fazer' : 'Concluída',
                    token: notionSettings.token
                });
            } else {
                // Cria nova tarefa no Notion
                const res = await callNotionProxy('action=create_task', 'POST', {
                    database_id: notionSettings.page_id || '3e28112a-6332-80c1-ba2c-ed849c99686e',
                    title: rem.title,
                    due_date: rem.target_date,
                    due_time: rem.target_time,
                    is_completed: !rem.is_active,
                    status: rem.is_active ? 'A fazer' : 'Concluída',
                    notes: rem.notes,
                    token: notionSettings.token
                });

                if (res && res.ok && res.id) {
                    rem.notion_page_id = res.id;
                    if (!rem.notes || !rem.notes.includes('[notion_id:')) {
                        rem.notes = (rem.notes ? rem.notes + ' ' : '') + `[notion_id: ${res.id}]`;
                    }
                    saveLocalStorageBackup();
                    const client = getSupabase();
                    if (client) {
                        safeSupabaseExec(client.from('control_reminders').update({ notes: rem.notes }).eq('id', rem.id));
                    }
                }
            }
        } catch (err) {
            console.warn('[NOTION REMINDER PUSH ERROR]', err.message);
        }
    }

    async function archiveReminderInNotion(rem) {
        if (!rem) return;
        let pageId = rem.notion_page_id;
        if (!pageId && rem.id && rem.id.startsWith('notion_rem_')) {
            const raw = rem.id.replace('notion_rem_', '');
            pageId = raw.length === 32
                ? `${raw.slice(0,8)}-${raw.slice(8,12)}-${raw.slice(12,16)}-${raw.slice(16,20)}-${raw.slice(20)}`
                : raw;
        }
        if (!pageId && rem.notes) {
            const match = rem.notes.match(/\[notion_id:\s*([a-f0-9-]+)\]/i);
            if (match) pageId = match[1];
        }

        if (pageId) {
            try {
                await callNotionProxy('action=delete_task', 'POST', {
                    page_id: pageId,
                    token: notionSettings.token
                });
            } catch (err) {
                console.warn('[NOTION REMINDER ARCHIVE ERROR]', err.message);
            }
        }
    }

    async function pushTodoToNotion(todo) {
        if (isSyncingNotion || !todo || !todo.title) return;

        let pageId = todo.notion_page_id;
        if (!pageId && todo.id && todo.id.startsWith('notion_page_')) {
            pageId = todo.id.replace('notion_page_', '');
        }

        try {
            if (pageId) {
                await callNotionProxy('action=update_task', 'POST', {
                    page_id: pageId,
                    block_id: todo.notion_block_id,
                    title: todo.title,
                    due_date: todo.due_date,
                    due_time: todo.due_time,
                    is_completed: !!todo.is_completed,
                    status: todo.is_completed ? 'Concluída' : 'A fazer',
                    token: notionSettings.token
                });
            } else {
                const res = await callNotionProxy('action=create_task', 'POST', {
                    database_id: notionSettings.page_id || '3e28112a-6332-80c1-ba2c-ed849c99686e',
                    title: todo.title,
                    due_date: todo.due_date,
                    due_time: todo.due_time,
                    is_completed: !!todo.is_completed,
                    status: todo.is_completed ? 'Concluída' : 'A fazer',
                    notes: todo.description || '',
                    token: notionSettings.token
                });

                if (res && res.ok && res.id) {
                    todo.notion_page_id = res.id;
                    saveLocalStorageBackup();
                    const client = getSupabase();
                    if (client) {
                        safeSupabaseExec(client.from('control_todos').update({
                            notion_page_id: res.id,
                            description: (todo.description ? todo.description + ' ' : '') + `[notion_id: ${res.id}]`
                        }).eq('id', todo.id));
                    }
                }
            }
        } catch (err) {
            console.warn('[NOTION TODO PUSH ERROR]', err.message);
        }
    }

    async function archiveTodoInNotion(todo) {
        if (!todo) return;
        const pageId = todo.notion_page_id || (todo.id && todo.id.startsWith('notion_page_') ? todo.id.replace('notion_page_', '') : null);
        if (pageId || todo.notion_block_id) {
            try {
                await callNotionProxy('action=delete_task', 'POST', {
                    page_id: pageId,
                    block_id: todo.notion_block_id,
                    token: notionSettings.token
                });
            } catch (err) {
                console.warn('[NOTION TODO ARCHIVE ERROR]', err.message);
            }
        }
    }

    async function exportAllRemindersToNotion() {
        if (!remindersList.length) {
            if (window.showToast) window.showToast('Nenhum lembrete para exportar.');
            return;
        }
        let count = 0;
        for (const rem of remindersList) {
            await pushReminderToNotion(rem);
            count++;
        }
        if (window.showToast) window.showToast(`✓ ${count} lembrete(s) sincronizado(s) no Notion!`);
    }

    async function syncNotionTasks(silent = false) {
        if (isSyncingNotion) return;
        isSyncingNotion = true;

        const btn = document.getElementById('btn-sync-notion-todos');
        const icon = document.getElementById('sync-notion-icon');
        const label = document.getElementById('sync-notion-label');
        
        const remBtn = document.getElementById('btn-sync-notion-reminders');
        const remIcon = document.getElementById('sync-notion-rem-icon');
        const remLabel = document.getElementById('sync-notion-rem-label');

        if (icon) icon.classList.add('animate-spin');
        if (remIcon) remIcon.classList.add('animate-spin');
        if (label) label.innerText = 'Sincronizando...';
        if (remLabel) remLabel.innerText = 'Sincronizando...';
        if (btn) btn.disabled = true;
        if (remBtn) remBtn.disabled = true;

        try {
            ensureNotionGroupExists();
            ensureNotionReminderGroupExists();

            const targetPageId = notionSettings.page_id || '3e28112a-6332-80c1-ba2c-ed849c99686e';
            const params = new URLSearchParams({
                action: 'fetch_tasks',
                page_id: targetPageId,
                token: notionSettings.token || ''
            });

            const res = await callNotionProxy(params.toString());
            
            if (!res || !res.ok) {
                if (res && res.needs_page_id) {
                    if (!silent) {
                        openNotionModal();
                        if (window.glassAlert) await window.glassAlert(res.message, 'Página do Notion Necessária', '📝');
                        else alert(res.message);
                    }
                    return;
                }
                throw new Error(res.error || 'Falha ao buscar tarefas do Notion.');
            }

            const notionTasks = res.tasks || [];
            let alarmsCount = 0;
            const client = getSupabase();
            const nowIso = new Date().toISOString();

            // ─────────────────────────────────────────────────────────────
            // 1. SINCRONIZAÇÃO EM ALARMES & LEMBRETES (control_reminders)
            // ─────────────────────────────────────────────────────────────
            for (const nTask of notionTasks) {
                const cleanPageId = (nTask.notion_page_id || '').replace(/-/g, '');
                const remIdx = remindersList.findIndex(r => 
                    (r.notion_page_id && r.notion_page_id === nTask.notion_page_id) ||
                    r.id === `notion_rem_${cleanPageId}` ||
                    (r.notes && nTask.notion_page_id && r.notes.includes(nTask.notion_page_id))
                );

                const taskTargetDate = nTask.due_date || formatISODate(getBrasiliaDate());
                const taskTargetTime = nTask.due_time || '10:00';
                const taskIsActive = !nTask.is_completed;
                if (taskIsActive && (nTask.due_date || nTask.due_time || nTask.has_alarm)) {
                    alarmsCount++;
                }

                if (remIdx !== -1) {
                    // Atualiza lembrete existente
                    remindersList[remIdx].title = nTask.title;
                    remindersList[remIdx].is_active = taskIsActive;
                    remindersList[remIdx].target_date = taskTargetDate;
                    remindersList[remIdx].target_time = taskTargetTime;
                    remindersList[remIdx].has_sound = true;
                    remindersList[remIdx].notion_page_id = nTask.notion_page_id;
                    remindersList[remIdx].updated_at = nowIso;

                    if (client) {
                        const cleanObj = sanitizeReminderUpdatesForSupabase({
                            title: nTask.title,
                            is_active: taskIsActive,
                            target_date: taskTargetDate,
                            target_time: taskTargetTime,
                            notes: remindersList[remIdx].notes
                        });
                        safeSupabaseExec(client.from('control_reminders').update(cleanObj).eq('id', remindersList[remIdx].id));
                    }
                } else {
                    // Cria novo lembrete com alarme habilitado
                    const newRem = {
                        id: `notion_rem_${cleanPageId || Date.now()}`,
                        group_id: NOTION_REMINDER_GROUP_ID,
                        title: nTask.title,
                        notes: `Sincronizado do Notion [notion_id: ${nTask.notion_page_id}]`,
                        emoji: '🔔',
                        color: '#6366f1',
                        reminder_type: 'one_time',
                        target_date: taskTargetDate,
                        target_time: taskTargetTime,
                        day_of_week: 0,
                        is_active: taskIsActive,
                        has_sound: true,
                        notion_page_id: nTask.notion_page_id,
                        created_at: nTask.created_at || nowIso,
                        updated_at: nowIso
                    };

                    remindersList.unshift(newRem);

                    if (client) {
                        const cleanInsert = sanitizeReminderForSupabase(newRem);
                        safeSupabaseExec(client.from('control_reminders').insert([cleanInsert]));
                    }
                }

                // ─────────────────────────────────────────────────────────────
                // 2. SINCRONIZAÇÃO EM TO-DOS (control_todos)
                // ─────────────────────────────────────────────────────────────
                const todoIdx = todosList.findIndex(t => 
                    t.id === nTask.id || 
                    (t.notion_block_id && t.notion_block_id === nTask.notion_block_id) ||
                    (t.notion_page_id && t.notion_page_id === nTask.notion_page_id)
                );

                if (todoIdx !== -1) {
                    todosList[todoIdx].title = nTask.title;
                    todosList[todoIdx].is_completed = !!nTask.is_completed;
                    if (nTask.due_date) todosList[todoIdx].due_date = nTask.due_date;
                    if (nTask.due_time) todosList[todoIdx].due_time = nTask.due_time;
                    todosList[todoIdx].has_alarm = true;
                    todosList[todoIdx].priority = nTask.priority || todosList[todoIdx].priority;
                    todosList[todoIdx].updated_at = nowIso;

                    if (client) {
                        safeSupabaseExec(client.from('control_todos').update({
                            title: nTask.title,
                            is_completed: !!nTask.is_completed,
                            due_date: nTask.due_date,
                            due_time: nTask.due_time,
                            has_alarm: true,
                            priority: nTask.priority,
                            updated_at: nowIso
                        }).eq('id', todosList[todoIdx].id));
                    }
                } else {
                    const newTodo = {
                        id: nTask.id || `notion_${Date.now()}_${Math.random().toString(36).substr(2, 4)}`,
                        title: nTask.title,
                        description: `Importado de: ${res.title || 'Notion'}`,
                        group_id: NOTION_GROUP_ID,
                        due_date: taskTargetDate,
                        due_time: taskTargetTime,
                        has_alarm: true,
                        priority: nTask.priority || 'normal',
                        is_completed: !!nTask.is_completed,
                        is_recurring: false,
                        recurring_dates: [],
                        alarm_triggered: false,
                        is_notion_task: true,
                        notion_block_id: nTask.notion_block_id || null,
                        notion_page_id: nTask.notion_page_id || null,
                        sort_order: todosList.length,
                        created_at: nTask.created_at || nowIso,
                        updated_at: nowIso
                    };

                    todosList.unshift(newTodo);

                    if (client) {
                        safeSupabaseExec(client.from('control_todos').insert([sanitizeTodoForSupabase(newTodo)]));
                    }
                }
            }

            // Atualiza estatísticas do Notion
            notionSettings.last_sync = new Date().toISOString();
            notionSettings.last_sync_count = notionTasks.length;
            notionSettings.last_alarms_count = alarmsCount;
            if (res.title) notionSettings.page_title = res.title;

            saveLocalStorageBackup();
            renderRemindersListUI();
            renderReminderGroupsUI();
            renderReminderMatrixTableGridUI();
            renderTodosListUI();
            renderTodoGroupsUI();
            renderTodoMatrixTableGridUI();
            renderControlCalendar();
            updateSidebarCounts();
            updateNotionModalStats();

            if (!silent && window.showToast) {
                window.showToast(`✓ Notion: ${notionTasks.length} tarefas sincronizadas com Alarmes & Lembretes!`);
            }
        } catch (err) {
            console.error('[NOTION SYNC ERROR]', err);
            if (!silent) {
                if (window.glassAlert) await window.glassAlert(`Falha ao sincronizar com Notion:\n${err.message}`, 'Erro de Sincronização', '⚠️');
                else alert(`Falha ao sincronizar: ${err.message}`);
            }
        } finally {
            isSyncingNotion = false;
            if (icon) icon.classList.remove('animate-spin');
            if (remIcon) remIcon.classList.remove('animate-spin');
            if (label) label.innerText = 'Notion Sync';
            if (remLabel) remLabel.innerText = 'Notion Sync';
            if (btn) btn.disabled = false;
            if (remBtn) remBtn.disabled = false;
        }
    }

    function openNotionModal() {
        const modal = document.getElementById('control-notion-modal');
        if (!modal) return;

        const tokenInput = document.getElementById('notion-input-token');
        const pageInput = document.getElementById('notion-input-page');
        const autoSyncCheckbox = document.getElementById('notion-input-autosync');
        const syncAlarmsCheckbox = document.getElementById('notion-input-alarms');

        if (tokenInput) tokenInput.value = notionSettings.token || '';
        if (pageInput) pageInput.value = notionSettings.page_id || '3e28112a-6332-80c1-ba2c-ed849c99686e';
        if (autoSyncCheckbox) autoSyncCheckbox.checked = !!notionSettings.auto_sync;
        if (syncAlarmsCheckbox) syncAlarmsCheckbox.checked = !!notionSettings.sync_alarms;

        updateNotionModalStats();
        testNotionConnection();

        modal.classList.remove('hidden');
    }

    function closeNotionModal() {
        const modal = document.getElementById('control-notion-modal');
        if (modal) modal.classList.add('hidden');
    }

    async function handleSaveNotionForm(e) {
        if (e) e.preventDefault();
        const tokenInput = document.getElementById('notion-input-token');
        const pageInput = document.getElementById('notion-input-page');
        const autoSyncCheckbox = document.getElementById('notion-input-autosync');
        const syncAlarmsCheckbox = document.getElementById('notion-input-alarms');

        if (tokenInput) notionSettings.token = tokenInput.value.trim() || '';
        if (pageInput) notionSettings.page_id = pageInput.value.trim() || '3e28112a-6332-80c1-ba2c-ed849c99686e';
        if (autoSyncCheckbox) notionSettings.auto_sync = autoSyncCheckbox.checked;
        if (syncAlarmsCheckbox) notionSettings.sync_alarms = syncAlarmsCheckbox.checked;

        saveLocalStorageBackup();
        if (window.showToast) window.showToast('Configurações do Notion salvas!');

        closeNotionModal();
        await syncNotionTasks(false);
    }

    function updateNotionModalStats() {
        const statsContainer = document.getElementById('notion-stats-container');
        if (!statsContainer) return;

        if (notionSettings.last_sync) {
            const d = new Date(notionSettings.last_sync);
            const timeStr = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
            const dateStr = d.toLocaleDateString('pt-BR');
            statsContainer.innerHTML = `
                <div class="p-3 rounded-2xl bg-white/[0.04] border border-white/10 flex items-center justify-between text-xs font-mono">
                    <div>
                        <span class="text-gray-400 block text-[10px]">Última Sincronização:</span>
                        <span class="text-white font-bold">${dateStr} às ${timeStr}</span>
                    </div>
                    <div class="text-right">
                        <span class="text-emerald-400 font-bold block">${notionSettings.last_sync_count} tarefas</span>
                        <span class="text-amber-300 text-[10px] font-bold">🔔 ${notionSettings.last_alarms_count} alarmes ativos</span>
                    </div>
                </div>
            `;
        } else {
            statsContainer.innerHTML = `
                <div class="p-3 rounded-2xl bg-white/[0.02] border border-white/5 text-center text-xs font-mono text-gray-400">
                    Nenhuma sincronização realizada ainda nesta sessão.
                </div>
            `;
        }
    }

    // ==========================================
    // EXPOSIÇÃO GLOBAL NA WINDOW
    // ==========================================

    window.ControlEngine = {
        init: initControl,
        // Métodos de Integração com Notion
        syncNotionTasks,
        pushReminderToNotion,
        pushTodoToNotion,
        exportAllRemindersToNotion,
        openNotionModal,
        closeNotionModal,
        handleSaveNotionForm,
        testNotionConnection,
        getNotionSettings: () => notionSettings,
        setFilterTodoGroup: (id) => { currentFilterTodoGroupId = id; renderTodoGroupFilterTabs(); renderTodosListUI(); },
        setFilterReminderGroup: (id) => { currentFilterReminderGroupId = id; renderReminderGroupFilterTabs(); renderRemindersListUI(); },
        toggleTodoComplete,
        deleteTodo,
        openNewTodoModal,
        openEditTodoModal,
        closeTodoModal,
        handleSaveTodoForm,
        toggleTodoRecurringCalendar,
        navigateTodoModalMonth,
        toggleTodoRecurringDate,
        quickSelectTodoDays,
        renderTodoModalCalendar,
        openTodoGroupsManagerModal,
        closeTodoGroupsManagerModal,
        openGroupsManagerModal: openTodoGroupsManagerModal,
        closeGroupsManagerModal: closeTodoGroupsManagerModal,
        openEditTodoGroupModal,
        closeEditTodoGroupModal,
        handleSaveTodoGroupForm,
        deleteTodoGroup,
        openNewReminderModal,
        openEditReminderModal,
        closeReminderModal,
        handleSaveReminderForm,
        openReminderGroupsManagerModal,
        closeReminderGroupsManagerModal,
        openEditReminderGroupModal,
        closeEditReminderGroupModal,
        handleSaveReminderGroupForm,
        deleteReminderGroup,
        toggleReminderActive,
        deleteReminder,
        testReminderAlarm,
        testTodoAlarm,
        testAlarmSound,
        renderTodoMatrixTableGridUI,
        renderReminderMatrixTableGridUI,
        setTodoViewMode,
        updateTodoViewModeUI,
        setTodoCalendarMode,
        navigateTodoCalendar,
        navigateTodoCalendarToToday,
        renderTodoCalendarGridUI,
        setReminderViewMode,
        updateReminderViewModeUI,
        setReminderCalendarMode,
        navigateReminderCalendar,
        navigateReminderCalendarToToday,
        renderReminderCalendarGridUI,
        openControlAdminModal,
        closeControlAdminModal,
        setControlAdminTab,
        saveControlAdminSettings,
        openTemplateEditorModal,
        openNewTemplateModal,
        closeTemplateEditorModal,
        updateTemplateLivePreview,
        insertTemplateMarkdownSnippet,
        handleSaveTemplateEditor,
        deleteTemplate,
        sendTestEmailFromAdmin,
        testResendApiKey,
        triggerHeroicAlarm,
        stopHeroicAlarm,
        testHeroicAlarm,
        notifyHabitCompletedEmail,
        triggerHabitsBriefingEmail,
        setEmojiCategory,
        selectEmoji,
        // Novas Exportações Motivacionais
        toggleMotivationMaster,
        updateMotivationFrequencyFields,
        onMotivationHabitChanged,
        onMotivationConditionChanged,
        saveMotivationRuleFromForm,
        toggleMotivationRule,
        deleteMotivationRule,
        testMotivationRule,
        evaluateMotivationRulesOnHabitEvent,
        checkMotivationRulesForHabit: evaluateMotivationRulesOnHabitEvent,
        // Novas Exportações Google Calendar & Timeline
        renderControlCalendar,
        setCalendarViewMode,
        navigateControlCalendar,
        navigateControlCalendarMonth: navigateControlCalendar,
        navigateControlCalendarToToday,
        setCalendarFilter,
        selectControlCalendarDay,
        openGoogleCalendarConnectModal,
        closeGoogleCalendarConnectModal,
        saveGoogleCalendarSettings,
        pullGCalSettingsFromCloud,
        checkPendingCloudAuth,
        handleDeepLinkOAuth,
        testOrAuthGoogle,
        setGCalQuickConfig,
        copyAndroidGoogleCloudInfo,
        disconnectGoogleCalendar,
        syncGoogleCalendar,
        createGoogleCalendarEvent,
        openQuickCalendarEventModal,
        closeQuickCalendarEventModal,
        handleSaveQuickCalendarEvent,
        selectQuickCalColor,
        renderQuickCalColorPalette,
        onQuickCalTypeChanged,
        setFilterTodoPriority,
        setTodoSortOrder,
        openGoogleCalendarDirectLinkFromQuickForm,
                getSessionColor,
        getClosestGoogleColorId,
        updateCalendarFilterPillsColors,
        syncStudyBlockToGoogleCalendar,
        syncEntireDayToGoogleCalendar,
        openGoogleCalendarDirectLink,
        toggle360ItemExpansion,
        deleteGoogleEventFrom360,
        deleteDiaryEntryFrom360,
        // Rotina de Estudos (Notion & Google Agenda)
        renderStudyScheduleUI,
        renderStudyTableGridUI,
        renderStudyGoogleColorPalette,
        updateStudyStatusUI,
        toggleStudyConfigPanel,
                        renderUniversalColorPicker,
        setUniversalColorCustom,
        resetUniversalColorDefault,
        openCopyWeekAsTemplateModal,
        closeCopyWeekAsTemplateModal,
        executeCopyWeekToTemplate,
        renderStudyAnalytics,
        renderTodoAnalytics,
        renderReminderAnalytics,
        playTestAlarmSound,
        shiftScheduleTimes,
        clearCompletedTodos,
        postponePendingTodosToTomorrow,
        toggleAllRemindersSound,
        resetSectionWeek,
        exportTemplatesToClipboard,
        promptImportTemplates,
        addNewCustomTodoTemplate,
        addNewCustomReminderTemplate,
        addNewCustomStudyTemplate,
        duplicateCurrentTodoTemplate,
        duplicateCurrentReminderTemplate,
        duplicateCurrentStudyTemplate,
        openTodoConfigModal,
        closeTodoConfigModal,
        setTodoConfigTab,
        renderTodoConfigTemplatesSelector,
        selectTodoConfigTemplate,
        applySelectedTodoTemplateFromConfig,
        applyTodoTemplate,
        renderTodoTemplateBlocksList,
        updateTodoTemplateBlockField,
        addBlockToEditingTodoTemplate,
        removeBlockFromEditingTodoTemplate,
        copyCurrentWeekToEditingTodoTemplate,
        saveEditingTodoTemplateChanges,
        openReminderConfigModal,
        closeReminderConfigModal,
        setReminderConfigTab,
        renderReminderConfigTemplatesSelector,
        selectReminderConfigTemplate,
        applySelectedReminderTemplateFromConfig,
        applyReminderTemplate,
        renderReminderTemplateBlocksList,
        updateReminderTemplateBlockField,
        addBlockToEditingReminderTemplate,
        removeBlockFromEditingReminderTemplate,
        copyCurrentWeekToEditingReminderTemplate,
        saveEditingReminderTemplateChanges,
        openStudyConfigModal,
        closeStudyConfigModal,
        setStudyConfigTab,
        renderStudyConfigTemplatesSelector,
        selectStudyConfigTemplate,
        applySelectedTemplateFromConfig,
        selectStudyGoogleCalendarColor,
        toggleStudyAutoSync,
        openNewStudyBlockModal,
        openEditStudyBlockModal,
        closeStudyBlockModal,
        handleSaveStudyBlockForm,
        deleteStudyBlock,
        syncStudyBlockToGoogleCalendar,
        syncAllStudiesToGoogleCalendar,
        // Semanas Modelo (3 Templates)
        renderStudyTemplatesBar,
        applyStudyTemplate,
        renderStudyTemplateBlocksList,
        updateTemplateBlockField,
        addBlockToEditingTemplate,
        removeBlockFromEditingTemplate,
        copyCurrentWeekToEditingTemplate,
        saveEditingTemplateChanges,
        getStudyBlocks: () => studyBlocks,
        getStudySettings: () => studySettings,
        getStudyTemplates: () => studyTemplates,
        // TRIP (Gestão de Viagens)
        renderTripUI,
        setTripCategoryFilter,
        setTripViewMode,
        getTripViewMode: () => tripViewMode,
        openNewTripModal,
        openEditTripModal,
        closeTripModal,
        handleSaveTripForm,
        deleteTrip,
        toggleTripChecklistItem,
        markTripAsCompleted,
        promoteWishlistToPlanned,
        handleUploadTripPhotos,
        promptAddTripPhotoUrl,
        removeTripModalPhoto,
        renderTripModalPhotosGrid,
        openTripVisualizerModal,
        closeTripVisualizerModal,
        selectTripVisPhoto,
        navigateTripVisPhoto,
        renderTripVisChecklist,
        toggleTripVisChecklistItem,
        addTripVisChecklistItem,
        deleteTripVisChecklistItem,
        setTripNotesEditorMode,
        handleTripNotesInput,
        handleTripNotesKeydown,
        insertTripMarkdown,
        renderRichMarkdownToHtml,
        getTrips: () => trips,
        // CORES SECUNDÁRIAS POR SESSION
        initSessionAccentColors,
        applySessionAccentColor,
        openSessionColorConfigModal,
        closeSessionColorConfigModal,
        selectSessionCustomColor,
        saveSessionColorChoice,
        resetSessionColorToDefault,
        checkStudyAlarmsPrecise,
        testStudyAlarm,
        // Visualizador Lightbox
        openMediaLightbox,
        closeMediaLightbox
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initControl);
    } else {
        initControl();
    }

})(window);
