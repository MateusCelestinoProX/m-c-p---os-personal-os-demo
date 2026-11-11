/**
 * api/universal.js — Personal OS Universal API Handler
 * Suporta execução Serverless (Vercel) e nativa Node.js / Express / HTTP Server.
 * 
 * Headers requeridos:
 * Authorization: Bearer mcpos_ai_agent_universal_key_2026
 * 
 * Parâmetros de Consulta (Query Params):
 * ?scope=diary     → Status do diário (datas registradas, se hoje já escreveu, contagem de palavras)
 * ?scope=habits    → Hábitos ativos (growth e ban), status de hoje, streak e progresso diário
 * ?scope=todos     → Tarefas pendentes e concluídas do dia
 * ?scope=pomodoro  → Foco & Pomodoro 2 (sessão ativa, minutos de foco hoje, ciclos concluídos, histórico)
 * ?scope=all       → Resumo executivo consolidado de rotina de todo o ecossistema
 */

const SUPABASE_URL = process.env.SUPABASE_URL || 'https://kbqxzmyasstdvvbfymft.supabase.co';
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImticXh6bXlhc3N0ZHZ2YmZ5bWZ0Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODY3MTU5OTksImV4cCI6MjEwMjI5MTk5OX0.b9BVA-Uso6hoNc8Zhol8svV_JDV56j-FCjhUVaW5-8M';
const POMODORO_SUPABASE_URL = process.env.POMODORO_SUPABASE_URL || 'https://jfxxmhthwoggffrvkflv.supabase.co';
const POMODORO_SUPABASE_KEY = process.env.POMODORO_SUPABASE_KEY || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeHhtaHRod29nZ2ZmcnZrZmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MDUyOTEsImV4cCI6MjEwMzI4MTI5MX0.yBYGdnsV2i-QOXytEtNhRsTBez1AfA67q9ct-4-ZrEw';
const UNIVERSAL_KEY = process.env.UNIVERSAL_API_KEY || 'mcpos_ai_agent_universal_key_2026';

function getBrasiliaDateStr() {
    try {
        const now = new Date();
        const str = now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
        const bDate = new Date(str);
        const y = bDate.getFullYear();
        const m = String(bDate.getMonth() + 1).padStart(2, '0');
        const d = String(bDate.getDate()).padStart(2, '0');
        return `${y}-${m}-${d}`;
    } catch {
        return new Date().toISOString().slice(0, 10);
    }
}

async function supabaseFetch(endpoint) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const res = await fetch(url, {
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) {
        throw new Error(`Supabase HTTP ${res.status}: ${await res.text()}`);
    }
    return await res.json();
}

async function supabasePost(endpoint, data) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const res = await fetch(url, {
        method: 'POST',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        throw new Error(`Supabase HTTP ${res.status}: ${await res.text()}`);
    }
    return await res.json();
}

async function pomodoroFetch(endpoint) {
    try {
        const url = `${POMODORO_SUPABASE_URL}/rest/v1/${endpoint}`;
        const res = await fetch(url, {
            headers: {
                'apikey': POMODORO_SUPABASE_KEY,
                'Authorization': `Bearer ${POMODORO_SUPABASE_KEY}`,
                'Content-Type': 'application/json'
            }
        });
        if (res.ok) return await res.json();
    } catch (e) {}
    return await supabaseFetch(endpoint);
}

async function pomodoroPost(endpoint, data) {
    try {
        const url = `${POMODORO_SUPABASE_URL}/rest/v1/${endpoint}`;
        const res = await fetch(url, {
            method: 'POST',
            headers: {
                'apikey': POMODORO_SUPABASE_KEY,
                'Authorization': `Bearer ${POMODORO_SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
    } catch (e) {}
    return await supabasePost(endpoint, data);
}

async function supabasePatch(endpoint, data) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const res = await fetch(url, {
        method: 'PATCH',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json',
            'Prefer': 'return=representation'
        },
        body: JSON.stringify(data)
    });
    if (!res.ok) {
        throw new Error(`Supabase PATCH HTTP ${res.status}: ${await res.text()}`);
    }
    return await res.json();
}

async function supabaseDelete(endpoint) {
    const url = `${SUPABASE_URL}/rest/v1/${endpoint}`;
    const res = await fetch(url, {
        method: 'DELETE',
        headers: {
            'apikey': SUPABASE_ANON_KEY,
            'Authorization': `Bearer ${SUPABASE_ANON_KEY}`,
            'Content-Type': 'application/json'
        }
    });
    if (!res.ok) {
        throw new Error(`Supabase DELETE HTTP ${res.status}: ${await res.text()}`);
    }
    return true;
}

async function pomodoroPatch(endpoint, data) {
    try {
        const url = `${POMODORO_SUPABASE_URL}/rest/v1/${endpoint}`;
        const res = await fetch(url, {
            method: 'PATCH',
            headers: {
                'apikey': POMODORO_SUPABASE_KEY,
                'Authorization': `Bearer ${POMODORO_SUPABASE_KEY}`,
                'Content-Type': 'application/json',
                'Prefer': 'return=representation'
            },
            body: JSON.stringify(data)
        });
        if (res.ok) return await res.json();
    } catch (e) {}
    return await supabasePatch(endpoint, data);
}

// =========================================================================
// ⚡ MOTOR DE EXECUÇÃO DE AÇÕES INTERNAS DO SISTEMA (TUTOR AGENT CONTROL)
// =========================================================================
async function executeUniversalAction(actionName, params = {}) {
    const today = getBrasiliaDateStr();
    actionName = String(actionName || '').toLowerCase().trim();

    switch (actionName) {
        case 'start_pomodoro':
        case 'record_pomodoro': {
            const durationMinutes = Number(params.duration_minutes || params.minutes || params.duration) || 25;
            const durationMs = durationMinutes * 60000;
            const row = {
                id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : ('pomo_' + Date.now()),
                mode: params.mode || 'focus',
                action: 'focus_started',
                duration_ms: durationMs,
                duration_formatted: `${durationMinutes}m`,
                notes: params.notes || 'Ciclo de foco iniciado via Tutor AI',
                metadata: { source: 'tutor_agent', task_name: params.task_name || '' },
                created_at: new Date().toISOString()
            };
            const inserted = await pomodoroPost('time_os_history', row);
            return { success: true, action: 'start_pomodoro', duration_minutes: durationMinutes, notes: row.notes, inserted };
        }

        case 'stop_pomodoro': {
            const row = {
                id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : ('pomo_' + Date.now()),
                mode: 'focus',
                action: 'focus_completed',
                duration_ms: (Number(params.duration_minutes) || 0) * 60000,
                duration_formatted: `${Number(params.duration_minutes) || 0}m`,
                notes: params.notes || 'Ciclo de foco encerrado via Tutor AI',
                metadata: { source: 'tutor_agent' },
                created_at: new Date().toISOString()
            };
            const inserted = await pomodoroPost('time_os_history', row);
            return { success: true, action: 'stop_pomodoro', inserted };
        }

        case 'create_todo': {
            const todoRow = {
                id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : ('todo_' + Date.now()),
                title: params.title || 'Nova tarefa estratégica',
                description: params.description || '',
                is_completed: false,
                priority: params.priority || 'alta',
                due_date: params.due_date || today,
                due_time: params.due_time || null,
                has_alarm: Boolean(params.has_alarm),
                created_at: new Date().toISOString()
            };
            const inserted = await supabasePost('control_todos', todoRow);
            return { success: true, action: 'create_todo', todo: Array.isArray(inserted) ? inserted[0] : inserted };
        }

        case 'complete_todo': {
            let matchedId = params.id;
            let matchedTitle = params.title;
            if (!matchedId && params.title) {
                const todos = await supabaseFetch('control_todos?is_completed=eq.false&select=id,title&limit=30');
                const needle = String(params.title).toLowerCase().trim();
                const found = todos.find(t => t.title && t.title.toLowerCase().includes(needle));
                if (found) {
                    matchedId = found.id;
                    matchedTitle = found.title;
                }
            }
            if (matchedId) {
                const updated = await supabasePatch(`control_todos?id=eq.${encodeURIComponent(matchedId)}`, {
                    is_completed: true,
                    updated_at: new Date().toISOString()
                });
                return { success: true, action: 'complete_todo', id: matchedId, title: matchedTitle, updated };
            }
            return { success: false, action: 'complete_todo', error: 'Tarefa não encontrada ou já concluída.' };
        }

        case 'delete_todo': {
            let targetId = params.id;
            if (!targetId && params.title) {
                const todos = await supabaseFetch('control_todos?select=id,title&limit=50');
                const needle = String(params.title).toLowerCase().trim();
                const found = todos.find(t => t.title && t.title.toLowerCase().includes(needle));
                if (found) targetId = found.id;
            }
            if (targetId) {
                await supabaseDelete(`control_todos?id=eq.${encodeURIComponent(targetId)}`);
                return { success: true, action: 'delete_todo', id: targetId };
            }
            return { success: false, action: 'delete_todo', error: 'Tarefa para exclusão não encontrada.' };
        }

        case 'complete_habit': {
            const habits = await supabaseFetch('habits?select=id,title,complete_days,daily_progress&limit=50');
            let targetHabit = null;
            if (params.id) {
                targetHabit = habits.find(h => String(h.id) === String(params.id));
            } else if (params.title) {
                const needle = String(params.title).toLowerCase().trim();
                targetHabit = habits.find(h => h.title && h.title.toLowerCase().includes(needle));
            } else if (habits.length > 0) {
                targetHabit = habits.find(h => !(Array.isArray(h.complete_days) && h.complete_days.includes(today)));
            }

            if (targetHabit) {
                const completeDays = Array.isArray(targetHabit.complete_days) ? [...targetHabit.complete_days] : [];
                if (!completeDays.includes(today)) {
                    completeDays.push(today);
                }
                const dailyProgress = (targetHabit.daily_progress && typeof targetHabit.daily_progress === 'object') ? { ...targetHabit.daily_progress } : {};
                dailyProgress[today] = { completed: true, timestamp: new Date().toISOString() };
                const updated = await supabasePatch(`habits?id=eq.${encodeURIComponent(targetHabit.id)}`, {
                    complete_days: completeDays,
                    daily_progress: dailyProgress
                });
                return { success: true, action: 'complete_habit', id: targetHabit.id, habit: targetHabit.title, streak: completeDays.length, updated };
            }
            return { success: false, action: 'complete_habit', error: 'Hábito correspondente não encontrado.' };
        }

        case 'uncomplete_habit': {
            const habits = await supabaseFetch('habits?select=id,title,complete_days,daily_progress&limit=50');
            let targetHabit = null;
            if (params.id) {
                targetHabit = habits.find(h => String(h.id) === String(params.id));
            } else if (params.title) {
                const needle = String(params.title).toLowerCase().trim();
                targetHabit = habits.find(h => h.title && h.title.toLowerCase().includes(needle));
            }
            if (targetHabit) {
                const completeDays = (targetHabit.complete_days || []).filter(d => d !== today);
                const dailyProgress = { ...(targetHabit.daily_progress || {}) };
                delete dailyProgress[today];
                const updated = await supabasePatch(`habits?id=eq.${encodeURIComponent(targetHabit.id)}`, {
                    complete_days: completeDays,
                    daily_progress: dailyProgress
                });
                return { success: true, action: 'uncomplete_habit', id: targetHabit.id, habit: targetHabit.title, updated };
            }
            return { success: false, action: 'uncomplete_habit', error: 'Hábito não encontrado.' };
        }

        case 'create_habit': {
            const habitRow = {
                id: (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : ('habit_' + Date.now()),
                title: params.title || 'Novo Hábito de Excelência',
                description: params.description || '',
                emoji: params.emoji || '⚡',
                category: params.category || 'Geral',
                habit_type: params.habit_type || 'growth',
                engine_type: params.engine_type || 'free_timer',
                target_days: Number(params.target_days) || 40,
                complete_days: [],
                daily_progress: {},
                sort_order: 100,
                created_at: new Date().toISOString()
            };
            const inserted = await supabasePost('habits', habitRow);
            return { success: true, action: 'create_habit', habit: Array.isArray(inserted) ? inserted[0] : inserted };
        }

        case 'create_diary_entry': {
            const content = params.content || params.text || params.notes || '';
            const wordCount = content.split(/\s+/).filter(Boolean).length;
            const entryId = (typeof crypto !== 'undefined' && crypto.randomUUID) ? crypto.randomUUID() : ('d_' + Date.now());
            const diaryRow = {
                id: entryId,
                entry_date: params.date || today,
                title_preview: params.title || (content.length > 30 ? content.slice(0, 30) + '...' : 'Reflexão Estratégica'),
                encrypted_payload: Buffer.from(content || 'Registro do Tutor AI').toString('base64'),
                iv: '1234567890123456',
                salt: '1234567890123456',
                mood: params.mood || 'foco',
                tags: Array.isArray(params.tags) ? params.tags : ['tutor_ai', 'executivo'],
                folder: params.folder || 'Tutor AI',
                word_count: wordCount,
                created_at: new Date().toISOString()
            };
            let inserted;
            try {
                inserted = await pomodoroPost('diary_entries', diaryRow);
            } catch (e) {
                inserted = await supabasePost('diary_entries', diaryRow);
            }
            return { success: true, action: 'create_diary_entry', entry: Array.isArray(inserted) ? inserted[0] : inserted };
        }

        case 'navigate': {
            const validPages = ['pomodoro', 'diary', 'calendar', 'index', 'admin'];
            const targetPage = String(params.page || 'index').toLowerCase().replace('.html', '');
            return {
                success: true,
                action: 'navigate',
                page: validPages.includes(targetPage) ? targetPage : 'index',
                url: `${targetPage}.html`
            };
        }

        case 'set_theme': {
            return {
                success: true,
                action: 'set_theme',
                theme: params.theme || 'default'
            };
        }

        default:
            return { success: false, action: actionName, error: `Ação desconhecida: '${actionName}'` };
    }
}

async function handleScopeDiary(queryDate) {
    const today = getBrasiliaDateStr();
    const targetDate = queryDate || today;
    
    // Buscar entradas recentes de diário (tenta DB2 primeiro, fallback para DB1)
    let entries = [];
    try {
        entries = await pomodoroFetch('diary_entries?select=id,entry_date,title_preview,folder,mood,word_count,tags,created_at&order=entry_date.desc&limit=30');
    } catch (e) {
        entries = await supabaseFetch('diary_entries?select=id,entry_date,title_preview,folder,mood,word_count,tags,created_at&order=entry_date.desc&limit=30');
    }
    entries = Array.isArray(entries) ? entries : [];
    
    const writtenDates = Array.from(new Set(entries.map(e => e.entry_date))).filter(Boolean);
    const hasWrittenToday = writtenDates.includes(targetDate);
    const todayEntry = entries.find(e => e.entry_date === targetDate) || null;

    return {
        scope: 'diary',
        target_date: targetDate,
        has_written_today: hasWrittenToday,
        written_dates: writtenDates,
        total_recent_entries: entries.length,
        today_entry: todayEntry ? {
            id: todayEntry.id,
            title_preview: todayEntry.title_preview,
            word_count: todayEntry.word_count,
            folder: todayEntry.folder,
            mood: todayEntry.mood
        } : null,
        recent_entries_summary: entries.slice(0, 7).map(e => ({
            date: e.entry_date,
            title: e.title_preview,
            words: e.word_count,
            mood: e.mood
        }))
    };
}

async function handleScopeHabits() {
    const today = getBrasiliaDateStr();
    const habits = await supabaseFetch('habits?select=id,title,description,complete_days,target_days,habit_type,engine_type,category,emoji,daily_progress,created_at,sort_order&order=sort_order.asc');

    const completedToday = [];
    const pendingToday = [];
    const negativeHabits = []; // 'ban' habits

    habits.forEach(h => {
        const isCompletedToday = (h.complete_days && h.complete_days.includes(today)) ||
            (h.daily_progress && h.daily_progress[today] && h.daily_progress[today].completed);
        
        const habitSummary = {
            id: h.id,
            title: h.title,
            emoji: h.emoji || '⚡',
            habit_type: h.habit_type || 'growth',
            category: h.category || 'Geral',
            completed_today: !!isCompletedToday,
            streak_days: Array.isArray(h.complete_days) ? h.complete_days.length : 0,
            target_days: h.target_days || 40,
            engine_type: h.engine_type || 'free_timer'
        };

        if (h.habit_type === 'ban') {
            negativeHabits.push(habitSummary);
        }

        if (isCompletedToday) {
            completedToday.push(habitSummary);
        } else {
            pendingToday.push(habitSummary);
        }
    });

    const completionRatePercent = habits.length > 0 ? Math.round((completedToday.length / habits.length) * 100) : 0;
    const sortedByStreak = [...habits].sort((a, b) => {
        const streakA = Array.isArray(a.complete_days) ? a.complete_days.length : 0;
        const streakB = Array.isArray(b.complete_days) ? b.complete_days.length : 0;
        return streakB - streakA;
    });
    const streakLeader = sortedByStreak[0] ? {
        title: sortedByStreak[0].title,
        streak_days: Array.isArray(sortedByStreak[0].complete_days) ? sortedByStreak[0].complete_days.length : 0
    } : null;

    return {
        scope: 'habits',
        today,
        total_habits: habits.length,
        completed_today_count: completedToday.length,
        pending_today_count: pendingToday.length,
        completion_rate_percent: completionRatePercent,
        streak_leader: streakLeader,
        completed_today: completedToday,
        pending_today: pendingToday,
        negative_habits_to_avoid: negativeHabits
    };
}

async function handleScopeTrip() {
    const today = getBrasiliaDateStr();
    let trips = [];

    try {
        trips = await supabaseFetch('control_trips?select=*&order=start_date.asc');
    } catch {
        trips = [
            {
                id: 'trip_1',
                title: 'Florianópolis — Praia, Dunas & Trabalho Remoto',
                destination: 'Florianópolis, SC',
                category: 'planned',
                start_date: '2026-10-15',
                end_date: '2026-10-22',
                budget: 4500,
                spent: 1800,
                status: 'Confirmada',
                priority: 'Alta',
                notes: 'Hospedagem em frente à praia da Joaquina com Wi-Fi de alta velocidade para home office, pôr do sol nas dunas da Lagoa e trilha do Gravatá.',
                checklist: [
                    { task: 'Comprar passagens aéreas', done: true },
                    { task: 'Reservar Airbnb Joaquina', done: true },
                    { task: 'Aluguel de carro', done: false },
                    { task: 'Kit tech / adaptadores', done: true }
                ],
                photos: [
                    { url: 'https://images.unsplash.com/photo-1507525428034-b723cf961d3e?auto=format&fit=crop&w=1200&q=80', caption: 'Praia da Joaquina — Florianópolis' },
                    { url: 'https://images.unsplash.com/photo-1519046904884-53103b34b206?auto=format&fit=crop&w=1200&q=80', caption: 'Dunas e Mar Cristalino' }
                ]
            },
            {
                id: 'trip_2',
                title: 'Buenos Aires — Gastronomia, Tango & Cultura',
                destination: 'Buenos Aires, Argentina',
                category: 'planned',
                start_date: '2026-12-05',
                end_date: '2026-12-12',
                budget: 6200,
                spent: 900,
                status: 'Em Planejamento',
                priority: 'Média',
                notes: 'Roteiro em Palermo Soho e Recoleta, visita a livrarias históricas, cafés tradicionais e parrillas argentinas.',
                checklist: [
                    { task: 'Pesquisar hotéis em Palermo', done: true },
                    { task: 'Seguro viagem internacional', done: false },
                    { task: 'Câmbio e reservas de tango', done: false }
                ],
                photos: [
                    { url: 'https://images.unsplash.com/photo-1589909202802-8f4aadce1849?auto=format&fit=crop&w=1200&q=80', caption: 'Avenida 9 de Julio & Obelisco' }
                ]
            },
            {
                id: 'trip_3',
                title: 'Tóquio & Kyoto — Imersão Tecnológica & Templos Zen',
                destination: 'Japão',
                category: 'wishlist',
                start_date: '2027-04-10',
                end_date: '2027-04-25',
                budget: 22000,
                spent: 0,
                status: 'Lista de Desejos',
                priority: 'Alta',
                notes: 'Temporada das cerejeiras (Sakura), visitar Akihabara, Shinjuku, santuários de Fushimi Inari e jardins zen de Kyoto.',
                checklist: [],
                photos: []
            },
            {
                id: 'trip_4',
                title: 'Dolomitas & Alpes — Picos Dramáticos & Refúgios de Neve',
                destination: 'Itália & Suíça',
                category: 'wishlist',
                start_date: '2027-11-15',
                end_date: '2027-11-28',
                budget: 18000,
                spent: 0,
                status: 'Lista de Desejos',
                priority: 'Média',
                notes: 'Trilhas cênicas de outono/inverno nas Dolomitas, Lago di Braies e refúgios alpinos de alta montanha.',
                checklist: [],
                photos: []
            },
            {
                id: 'trip_5',
                title: 'Rio de Janeiro — Fim de Semana Copacabana & Arpoador',
                destination: 'Rio de Janeiro, RJ',
                category: 'completed',
                start_date: '2026-03-12',
                end_date: '2026-03-16',
                budget: 3000,
                spent: 2850,
                status: 'Realizada',
                priority: 'Baixa',
                notes: 'Viagem memorável, pôr do sol no Arpoador, caminhada na orla de Copacabana e Ipanema.',
                checklist: [{ task: 'Passagens', done: true }, { task: 'Hotel', done: true }],
                photos: []
            }
        ];
    }

    // Identificar viagens futuras e a mais próxima
    const upcomingTrips = trips.filter(t => t.end_date >= today && t.status !== 'Realizada');
    upcomingTrips.sort((a, b) => new Date(a.start_date) - new Date(b.start_date));

    const nextTrip = upcomingTrips[0] || null;
    let daysUntilDeparture = null;
    let isImminent = false;
    let pendingChecklist = [];
    let completedChecklist = [];

    if (nextTrip) {
        const todayDate = new Date(today + 'T00:00:00');
        const startDate = new Date(nextTrip.start_date + 'T00:00:00');
        const diffTime = startDate - todayDate;
        daysUntilDeparture = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
        isImminent = daysUntilDeparture <= 35 && daysUntilDeparture >= 0;

        if (Array.isArray(nextTrip.checklist)) {
            pendingChecklist = nextTrip.checklist.filter(c => !c.done);
            completedChecklist = nextTrip.checklist.filter(c => c.done);
        }
    }

    const totalBudget = trips.reduce((acc, t) => acc + (Number(t.budget) || 0), 0);
    const totalSpent = trips.reduce((acc, t) => acc + (Number(t.spent) || 0), 0);

    return {
        scope: 'trip',
        today,
        total_trips: trips.length,
        next_trip: nextTrip ? {
            id: nextTrip.id,
            title: nextTrip.title,
            destination: nextTrip.destination,
            start_date: nextTrip.start_date,
            end_date: nextTrip.end_date,
            days_until_departure: daysUntilDeparture,
            is_imminent: isImminent,
            status: nextTrip.status,
            priority: nextTrip.priority,
            budget: nextTrip.budget,
            spent: nextTrip.spent,
            notes: nextTrip.notes,
            pending_checklist_tasks: pendingChecklist,
            completed_checklist_tasks: completedChecklist,
            total_checklist_items: Array.isArray(nextTrip.checklist) ? nextTrip.checklist.length : 0
        } : null,
        upcoming_trips_count: upcomingTrips.length,
        upcoming_trips: upcomingTrips.map(t => ({
            id: t.id,
            title: t.title,
            destination: t.destination,
            start_date: t.start_date,
            end_date: t.end_date,
            status: t.status,
            priority: t.priority,
            budget: t.budget,
            spent: t.spent
        })),
        budget_summary: {
            total_budget: totalBudget,
            total_spent: totalSpent,
            balance: totalBudget - totalSpent
        }
    };
}

async function handleScopeTodos() {
    const today = getBrasiliaDateStr();
    const todos = await supabaseFetch('control_todos?select=id,title,description,is_completed,priority,due_date,due_time,has_alarm,created_at&order=created_at.desc&limit=50');
    
    const pending = todos.filter(t => !t.is_completed);
    const completed = todos.filter(t => t.is_completed);

    return {
        scope: 'todos',
        today,
        total_todos: todos.length,
        pending_count: pending.length,
        completed_count: completed.length,
        pending_tasks: pending.slice(0, 15),
        completed_tasks: completed.slice(0, 10)
    };
}

async function handleScopePomodoro(queryDate) {
    const today = queryDate || getBrasiliaDateStr();

    let sessions = [];
    let history = [];

    try {
        sessions = await pomodoroFetch('time_os_sessions?select=id,mode,started_at,state,paused_accum_ms,last_pause_at,updated_at&order=updated_at.desc&limit=10');
    } catch (e) {
        sessions = [];
    }

    try {
        history = await pomodoroFetch('time_os_history?select=id,mode,action,duration_ms,duration_formatted,notes,metadata,created_at&order=created_at.desc&limit=60');
    } catch (e) {
        history = [];
    }

    // Filtrar histórico de hoje
    const todayHistory = history.filter(h => {
        if (!h.created_at) return false;
        return h.created_at.startsWith(today);
    });

    const focusCompletedToday = todayHistory.filter(h => h.mode === 'focus' && (h.action === 'focus_completed' || h.action === 'complete'));
    const totalFocusMsToday = todayHistory
        .filter(h => h.mode === 'focus')
        .reduce((acc, h) => acc + (Number(h.duration_ms) || 0), 0);
    const totalBreakMsToday = todayHistory
        .filter(h => h.mode !== 'focus')
        .reduce((acc, h) => acc + (Number(h.duration_ms) || 0), 0);

    const activeSession = sessions.find(s => s.state === 'active') || sessions[0] || null;

    return {
        scope: 'pomodoro',
        today,
        status: activeSession ? (activeSession.state === 'active' ? 'running' : activeSession.state) : 'idle',
        active_mode: activeSession ? activeSession.mode : 'focus',
        active_session: activeSession,
        today_stats: {
            focus_minutes: Math.round(totalFocusMsToday / 60000),
            break_minutes: Math.round(totalBreakMsToday / 60000),
            completed_rounds: focusCompletedToday.length,
            total_events_today: todayHistory.length
        },
        recent_sessions: history.slice(0, 15).map(h => ({
            id: h.id,
            mode: h.mode,
            action: h.action,
            duration: h.duration_formatted,
            duration_minutes: Math.round((Number(h.duration_ms) || 0) / 60000),
            notes: h.notes,
            task: h.metadata && h.metadata.task_name ? h.metadata.task_name : null,
            created_at: h.created_at
        }))
    };
}

function parseRequestBody(req) {
    return new Promise((resolve) => {
        if (req.body && typeof req.body === 'object') return resolve(req.body);
        let bodyStr = '';
        req.on('data', chunk => { bodyStr += chunk; });
        req.on('end', () => {
            try {
                resolve(bodyStr ? JSON.parse(bodyStr) : {});
            } catch (e) {
                resolve({});
            }
        });
        req.on('error', () => resolve({}));
    });
}

async function universalHandler(req, res) {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Authorization, Content-Type');

    if (req.method === 'OPTIONS') {
        res.statusCode = 200;
        return res.end();
    }

    const authHeader = req.headers['authorization'] || '';
    const token = authHeader.replace(/^Bearer\s+/i, '').trim();

    if (token !== UNIVERSAL_KEY) {
        res.statusCode = 401;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.end(JSON.stringify({
            error: 'Não autorizado. Forneça o header: Authorization: Bearer mcpos_ai_agent_universal_key_2026'
        }));
    }

    const parsedUrl = new URL(req.url, `http://${req.headers.host || 'localhost'}`);
    const scope = (parsedUrl.searchParams.get('scope') || 'all').toLowerCase();
    const queryDate = parsedUrl.searchParams.get('date') || null;

    try {
        // --- TRATAMENTO DE REQUISIÇÕES POST (UNIVERSAL WRITE API) ---
        if (req.method === 'POST') {
            const body = await parseRequestBody(req);

            if (scope === 'pomodoro' || scope === 'focus' || scope === 'time') {
                const row = {
                    id: body.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "rec_" + Date.now()),
                    mode: body.mode || "focus",
                    action: body.action || "complete",
                    duration_ms: Number(body.duration_ms) || 0,
                    duration_formatted: body.duration_formatted || (Math.round((Number(body.duration_ms) || 0) / 60000) + "m"),
                    notes: body.notes || "Pomodoro registrado via Universal API",
                    metadata: body.metadata || { source: "universal_api" },
                    created_at: body.created_at || new Date().toISOString()
                };
                const inserted = await pomodoroPost('time_os_history', row);
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                return res.end(JSON.stringify({ success: true, scope: 'pomodoro', inserted }, null, 2));
            } else if (scope === 'todos') {
                const todoRow = {
                    title: body.title || 'Nova tarefa',
                    description: body.description || '',
                    is_completed: Boolean(body.is_completed),
                    priority: body.priority || 'media',
                    due_date: body.due_date || getBrasiliaDateStr(),
                    due_time: body.due_time || null,
                    has_alarm: Boolean(body.has_alarm),
                    created_at: new Date().toISOString()
                };
                const inserted = await supabasePost('control_todos', todoRow);
                res.statusCode = 201;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                return res.end(JSON.stringify({ success: true, scope: 'todos', inserted }, null, 2));
            } else if (scope === 'action' || scope === 'actions') {
                const actionName = body.action || body.type;
                const params = body.params || body;
                const result = await executeUniversalAction(actionName, params);
                res.statusCode = result.success ? 200 : 400;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                return res.end(JSON.stringify(result, null, 2));
            } else if (scope === 'habits') {
                const actionName = body.action === 'uncomplete' ? 'uncomplete_habit' : (body.action === 'complete' ? 'complete_habit' : 'create_habit');
                const result = await executeUniversalAction(actionName, body);
                res.statusCode = result.success ? 200 : 400;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                return res.end(JSON.stringify(result, null, 2));
            } else if (scope === 'diary') {
                const result = await executeUniversalAction('create_diary_entry', body);
                res.statusCode = result.success ? 201 : 400;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                return res.end(JSON.stringify(result, null, 2));
            } else {
                res.statusCode = 400;
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                return res.end(JSON.stringify({
                    error: `Escopo POST '${scope}' não suportado. Suportados: 'pomodoro', 'todos', 'habits', 'diary', 'action'.`
                }));
            }
        }

        // --- TRATAMENTO DE REQUISIÇÕES GET (UNIVERSAL READ API) ---
        let result = {};
        if (scope === 'diary') {
            result = await handleScopeDiary(queryDate);
        } else if (scope === 'habits') {
            result = await handleScopeHabits();
        } else if (scope === 'trip' || scope === 'trips') {
            result = await handleScopeTrip();
        } else if (scope === 'todos') {
            result = await handleScopeTodos();
        } else if (scope === 'pomodoro' || scope === 'focus' || scope === 'time') {
            result = await handleScopePomodoro(queryDate);
        } else if (scope === 'all') {
            const [diary, habits, trip, todos, pomodoro] = await Promise.all([
                handleScopeDiary(queryDate),
                handleScopeHabits(),
                handleScopeTrip(),
                handleScopeTodos(),
                handleScopePomodoro(queryDate)
            ]);
            result = {
                scope: 'all',
                generated_at: new Date().toISOString(),
                diary,
                habits,
                trip,
                todos,
                pomodoro
            };
        } else {
            res.statusCode = 400;
            res.setHeader('Content-Type', 'application/json; charset=utf-8');
            return res.end(JSON.stringify({
                error: `Scope '${scope}' inválido. Use 'diary', 'habits', 'trip', 'todos', 'pomodoro' ou 'all'.`
            }));
        }

        res.statusCode = 200;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.end(JSON.stringify(result, null, 2));
    } catch (err) {
        res.statusCode = 500;
        res.setHeader('Content-Type', 'application/json; charset=utf-8');
        return res.end(JSON.stringify({
            error: 'Erro interno ao processar escopo: ' + err.message
        }));
    }
}

module.exports = universalHandler;
module.exports.universalHandler = universalHandler;
module.exports.executeUniversalAction = executeUniversalAction;
module.exports.supabaseFetch = supabaseFetch;
module.exports.supabasePost = supabasePost;
module.exports.supabasePatch = supabasePatch;
module.exports.supabaseDelete = supabaseDelete;
