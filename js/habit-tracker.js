/**
 * M.C.P PERSONAL OS — HABIT TRACKER MASTER ENGINE
 * 
 * ATUALIZAÇÕES DEFINITIVAS:
 * 1. ZERO FALSOS VERMELHOS (DATA ZERO / CRIAÇÃO DO HÁBITO):
 *    - O sistema começa na data de criação do hábito. Dias anteriores NÃO são marcados como falhas.
 *    - Ícones do calendário renderizados fluidamente do início da célula até o fim (maximizar espaço).
 * 2. VISÃO DE TEMPO COM GRÁFICO EM PIZZA (DONUT CHART 3 CORES):
 *    - Disponível no Geral Dashboard para todo Free Timer:
 *      🟢 Cor 1 (Variável 1 - Ativo)
 *      🔴 Cor 2 (Variável 2 - Inativo)
 *      🟡 Cor 3 (Pausado - Âmbar #f59e0b)
 * 3. COLOR MAP EM 2 MODOS:
 *    - Goal Mode (perante a meta de dias 21, 40, 66, 90, 365d) vs 60d Cronológico com toggle individual.
 * 4. CENTRALIÇÃO TOTAL DO PAINEL GERAL NO MEIO DA TELA (VIEWPORT CENTER).
 */

(function (window) {
    'use strict';

    // Cliente Supabase e Estado Global
    let supabaseClient = null;
    let realtimeChannel = null;
    let habitsList = [];
    let activeFilter = 'all'; // 'all' | 'growth' | 'ban' | 'pending' | 'completed'
    let currentDetailHabitId = null;
    let currentEditingHabitId = null;
    let deletingHabitId = null;
    let currentTimePieHabitId = null;

    // Estado do Geral Dashboard & Calendário
    let dashboardCurrentPeriod = 'month'; // 'day' | 'week' | 'month' | 'quarter' | 'semester' | 'year'
    let dashboardCalendarDate = null;
    let dashboardSelectedDay = null;

    // Master Clock Engine Loop ID & Heartbeat
    let masterClockTickerId = null;
    let heartbeatIntervalId = null;

    // ==========================================
    // BIBLIOTECA GIGANTE DE EMOJIS (+250 EMOJIS WHATSAPP STYLE)
    // ==========================================
    const EMOJI_COLLECTION = {
        foco: [
            '⚡', '🧠', '💡', '🎯', '🚀', '💻', '📚', '✍️', '📖', '🔬', '🔭', '💼', '📊', '📈', '🎨', '🛠️', 
            '♟️', '🗝️', '🔍', '📝', '🖥️', '⌨️', '📡', '🌐', '🧭', '⚙️', '🧪', '📐', '⌛', '⏳', '⏰', '💎', 
            '👑', '🏛️', '🧩', '🕯️', '🖨️', '📁', '📂', '🗒️', '📅', '📌', '📎', '🔒', '🔓', '🔏', '🔑'
        ],
        ban: [
            '🛑', '🚫', '⛔', '📵', '🚭', '🔞', '🗑️', '💣', '🗡️', '🛡️', '⚔️', '🔒', '🔕', '🔇', '☣️', '⚠️', 
            '🚨', '❌', '✖️', '🩸', '🕸️', '⛓️', '🪓', '🪚', '🪤', '🕳️', '💀', '☠️', '🪫', '🔌', '📉', '💔', 
            '💥', '🔥', '🚯', '🚷', '🚳', '🚾', '🛑', '⛔', '🚫', '❌', '📛', '🔰'
        ],
        rotina: [
            '☀️', '🌅', '🌙', '🌌', '🪐', '🌕', '🌑', '🌲', '🌳', '🌴', '🌿', '🍀', '🍁', '🌊', '🏔️', '🌋', 
            '⚡', '⛈️', '❄️', '💨', '🌈', '🦅', '🐺', '🦁', '🐯', '🐉', '🕊️', '🦉', '🐝', '🌾', '🌻', '🌵', 
            '🐾', '🐬', '🐋', '🦈', '🐅', '🐆', '🦓', '🐘', '🦏', '🦛', '🐪', '🐫', '🦙', '🦒'
        ],
        riqueza: [
            '💰', '💵', '💳', '🪙', '💎', '🏦', '💹', '🏷️', '💸', '📈', '🥇', '👑', '💍', '🏛️', '🏰', '🛡️', 
            '🎲', '🎰', '🗝️', '📜', '🏆', '🎖️', '🏅', '⚜️', '🔮', '🧿', '⚓', '🏎️', '✈️', '🚀', '🚢', '🛥️', 
            '🚁', '🛳️', '🏎️', '🏍️', '🚘', '🚖', '🏢', '🏦', '🏨', '🏪', '🏭', '🗼'
        ],
        vibe: [
            '🔥', '✨', '🌟', '💫', '💥', '💢', '💯', '🔱', '⚜️', '🗿', '👁️', '🦾', '🦿', '🧘‍♂️', '🧙‍♂️', '🥷', 
            '👑', '🕶️', '🪐', '🛸', '🌌', '🧬', '🔮', '🖤', '🤍', '💚', '💙', '💜', '💛', '🧡', '🤍', '☯️', 
            '♾️', '🕊️', '🤖', '👾', '👽', '👻', '👺', '👹', '🎭', '🎪', '🎨', '🎬', '🎤', '🎧'
        ]
    };

    // Inicialização do Supabase Client
    function getClient() {
        if (!supabaseClient && window.client) {
            supabaseClient = window.client;
        } else if (!supabaseClient && window.supabase) {
            const url = 'https://jfxxmhthwoggffrvkflv.supabase.co';
            const key = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeHhtaHRod29nZ2ZmcnZrZmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MDUyOTEsImV4cCI6MjEwMzI4MTI5MX0.yBYGdnsV2i-QOXytEtNhRsTBez1AfA67q9ct-4-ZrEw';
            supabaseClient = window.supabase.createClient(url, key);
        }
        return supabaseClient;
    }

    // ==========================================
    // FUSO HORÁRIO OFICIAL DE BRASÍLIA (America/Sao_Paulo)
    // ==========================================

    function getBrasiliaDate() {
        try {
            const now = new Date();
            const brasiliaStr = now.toLocaleString("en-US", { timeZone: "America/Sao_Paulo" });
            return new Date(brasiliaStr);
        } catch (e) {
            return new Date();
        }
    }

    function getTodayString() {
        const d = getBrasiliaDate();
        const year = d.getFullYear();
        const month = String(d.getMonth() + 1).padStart(2, '0');
        const day = String(d.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function formatISODate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function parseISODate(dateStr) {
        if (!dateStr) return getBrasiliaDate();
        const [y, m, d] = dateStr.split('-').map(Number);
        return new Date(y, m - 1, d);
    }

    function formatDateDisplay(dateStr) {
        try {
            const date = parseISODate(dateStr);
            const meses = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
            const dia = date.getDate();
            const mes = meses[date.getMonth()];
            const ano = date.getFullYear();
            const hoje = getTodayString();
            
            if (dateStr === hoje) return `Hoje, ${dia} de ${mes} (Brasília)`;
            return `${dia} de ${mes}, ${ano}`;
        } catch (e) {
            return dateStr;
        }
    }

    function formatDateTimeDisplay(isoString) {
        if (!isoString) return '—';
        try {
            const d = new Date(isoString);
            const options = { 
                timeZone: 'America/Sao_Paulo',
                day: '2-digit', 
                month: '2-digit', 
                hour: '2-digit', 
                minute: '2-digit', 
                second: '2-digit' 
            };
            return d.toLocaleString('pt-BR', options) + ' (BRT)';
        } catch (e) {
            return isoString;
        }
    }

    function formatSecondsToHMS(totalSeconds) {
        const s = Math.max(0, Math.floor(totalSeconds || 0));
        const hours = Math.floor(s / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        const seconds = s % 60;

        const hh = String(hours).padStart(2, '0');
        const mm = String(minutes).padStart(2, '0');
        const ss = String(seconds).padStart(2, '0');

        return `${hh}:${mm}:${ss}`;
    }

    function formatSecondsToDetailedDuration(totalSeconds) {
        const s = Math.max(0, Math.floor(totalSeconds || 0));
        const weeks = Math.floor(s / (3600 * 24 * 7));
        const days = Math.floor((s % (3600 * 24 * 7)) / (3600 * 24));
        const hours = Math.floor((s % (3600 * 24)) / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        const seconds = s % 60;

        const parts = [];
        if (weeks > 0) parts.push(`${weeks} sem`);
        if (days > 0) parts.push(`${days}d`);
        if (hours > 0) parts.push(`${hours}h`);
        if (minutes > 0) parts.push(`${minutes}m`);
        if (seconds > 0 || parts.length === 0) parts.push(`${seconds}s`);

        return parts.join(' ');
    }

    function formatSecondsToShortLabel(totalSeconds) {
        const s = Math.max(0, Math.floor(totalSeconds || 0));
        const hours = Math.floor(s / 3600);
        const minutes = Math.floor((s % 3600) / 60);
        
        if (hours > 0 && minutes > 0) return `${hours}h ${minutes}m`;
        if (hours > 0) return `${hours}h`;
        if (minutes > 0) return `${minutes}m`;
        return `${s}s`;
    }

    function getDailyProgress(habit, dateStr = getTodayString()) {
        if (!habit.daily_progress || typeof habit.daily_progress !== 'object') {
            habit.daily_progress = {};
        }
        if (!habit.daily_progress[dateStr]) {
            habit.daily_progress[dateStr] = {
                count: 0,
                elapsed_seconds: 0,
                accumulated_seconds: 0,
                is_running: false,
                is_paused: false,
                last_start_time: null,
                completed: false
            };
        }
        return habit.daily_progress[dateStr];
    }

    function getHabitStartDate(habit) {
        if (habit.created_at) {
            try {
                return formatISODate(new Date(habit.created_at));
            } catch (e) {
                return getTodayString();
            }
        }
        return getTodayString();
    }

    function generateWeeks(daysCount = 63) {
        const today = getBrasiliaDate();
        const days = [];

        for (let i = daysCount - 1; i >= 0; i--) {
            const d = new Date(today);
            d.setDate(d.getDate() - i);
            const dateStr = formatISODate(d);
            days.push({
                date: dateStr,
                dayNumber: d.getDate(),
                isToday: dateStr === getTodayString()
            });
        }

        const weeks = [];
        for (let i = 0; i < days.length; i += 7) {
            weeks.push(days.slice(i, i + 7));
        }
        return weeks;
    }

    function isTodayCompleted(habit) {
        if (!habit) return false;
        const today = getTodayString();
        if (Array.isArray(habit.complete_days) && habit.complete_days.includes(today)) {
            return true;
        }
        const daily = getDailyProgress(habit, today);
        return !!daily.completed;
    }

    function calculateStreak(habit) {
        if (!habit || !Array.isArray(habit.complete_days) || habit.complete_days.length === 0) {
            return { current: 0, longest: 0 };
        }

        const sortedDates = [...new Set(habit.complete_days)].sort();
        const todayStr = getTodayString();
        const yesterday = getBrasiliaDate();
        yesterday.setDate(yesterday.getDate() - 1);
        const yesterdayStr = formatISODate(yesterday);

        let currentStreak = 0;
        let longestStreak = 0;
        let tempStreak = 0;

        for (let i = 0; i < sortedDates.length; i++) {
            if (i === 0) {
                tempStreak = 1;
            } else {
                const prev = parseISODate(sortedDates[i - 1]);
                const curr = parseISODate(sortedDates[i]);
                const diffDays = Math.round((curr - prev) / (1000 * 60 * 60 * 24));

                if (diffDays === 1) {
                    tempStreak++;
                } else if (diffDays > 1) {
                    tempStreak = 1;
                }
            }
            if (tempStreak > longestStreak) {
                longestStreak = tempStreak;
            }
        }

        let checkDate = getBrasiliaDate();
        const hasToday = sortedDates.includes(todayStr);
        const hasYesterday = sortedDates.includes(yesterdayStr);

        if (hasToday) {
            currentStreak = 1;
            checkDate.setDate(checkDate.getDate() - 1);
        } else if (hasYesterday) {
            currentStreak = 0;
            checkDate.setDate(checkDate.getDate() - 1);
        } else {
            currentStreak = 0;
        }

        if (hasToday || hasYesterday) {
            while (true) {
                const dateStr = formatISODate(checkDate);
                if (sortedDates.includes(dateStr)) {
                    if (dateStr !== todayStr) currentStreak++;
                    checkDate.setDate(checkDate.getDate() - 1);
                } else {
                    break;
                }
            }
        }

        if (currentStreak > longestStreak) {
            longestStreak = currentStreak;
        }

        return { current: currentStreak, longest: longestStreak };
    }

    function getCompletionRate(habit) {
        if (!habit) return 0;
        const total = (habit.complete_days || []).length;
        const target = habit.target_days || 40;
        return Math.min(100, Math.round((total / target) * 100));
    }

    function triggerCelebration(highlightColor = '#10b981') {
        if (typeof window.confetti === 'function') {
            window.confetti({
                particleCount: 70,
                spread: 60,
                origin: { y: 0.8 },
                colors: [highlightColor, '#ffffff', '#38bdf8', '#fbbf24', '#a855f7'],
                disableForReducedMotion: true
            });
        }
    }

    function showToast(message) {
        const toast = document.getElementById('toast');
        const toastText = document.getElementById('toast-text');
        if (toast && toastText) {
            toastText.innerText = message;
            toast.classList.remove('opacity-0', 'pointer-events-none');
            setTimeout(() => {
                toast.classList.add('opacity-0', 'pointer-events-none');
            }, 2200);
        }
    }

    // ==========================================
    // MASTER CLOCK TICKER DIGITAL OTIMIZADO (1s LOOP)
    // ==========================================

    function startMasterClockTicker() {
        if (masterClockTickerId) return;

        masterClockTickerId = setInterval(() => {
            const todayStr = getTodayString();
            const now = Date.now();

            habitsList.forEach(habit => {
                const daily = getDailyProgress(habit, todayStr);

                if (daily.is_running && daily.last_start_time) {
                    const diffSecs = Math.floor((now - daily.last_start_time) / 1000);
                    const baseAccum = daily.accumulated_seconds || 0;
                    daily.elapsed_seconds = baseAccum + Math.max(0, diffSecs);

                    if (habit.engine_type === 'goal_time') {
                        const goal = habit.goal_seconds || 3600;
                        if (daily.elapsed_seconds >= goal && !daily.completed) {
                            completeHabitToday(habit.id, true);
                            pauseTimer(habit.id);
                            return;
                        }
                    }

                    updateTimerDisplayInDOM(habit.id, daily.elapsed_seconds, habit.goal_seconds, habit.engine_type, habit);
                }
            });
        }, 1000);
    }

    function updateTimerDisplayInDOM(habitId, elapsedSecs, goalSecs, engineType, habit) {
        const timeStr = formatSecondsToHMS(elapsedSecs);

        const timerEl = document.getElementById(`timer-display-${habitId}`);
        if (timerEl) {
            timerEl.innerText = timeStr;
            if (engineType === 'free_timer' || engineType === 'progressive_time') {
                const var1Color = (habit && habit.variable1_color) ? habit.variable1_color : '#10b981';
                timerEl.style.color = var1Color;
            }
        }

        const barEl = document.getElementById(`timer-progress-bar-${habitId}`);
        if (barEl && engineType === 'goal_time' && goalSecs) {
            const pct = Math.min(100, Math.round((elapsedSecs / goalSecs) * 100));
            barEl.style.width = `${pct}%`;
        }

        if (currentDetailHabitId === habitId) {
            const modalTimerEl = document.getElementById('modal-timer-active-display');
            if (modalTimerEl) {
                modalTimerEl.innerText = timeStr;
            }
        }
    }

    // ==========================================
    // FREE TIMER & CRONÔMETRO CONTROLS
    // ==========================================

    function startTimer(habitId) {
        const habit = habitsList.find(h => h.id === habitId);
        if (!habit) return;

        const todayStr = getTodayString();
        const daily = getDailyProgress(habit, todayStr);

        const now = Date.now();
        const baseAccum = daily.accumulated_seconds || daily.elapsed_seconds || 0;

        daily.is_running = true;
        daily.is_paused = false;
        daily.last_start_time = now;
        daily.accumulated_seconds = baseAccum;
        daily.session_started_at_iso = new Date().toISOString();

        renderHabitsGrid();
        if (currentDetailHabitId === habitId) renderHabitDetailContent(habitId);

        saveHabitToSupabase(habit, false);
    }

    function pauseTimer(habitId) {
        const habit = habitsList.find(h => h.id === habitId);
        if (!habit) return;

        const todayStr = getTodayString();
        const daily = getDailyProgress(habit, todayStr);

        if (daily.is_running && daily.last_start_time) {
            const diffSecs = Math.floor((Date.now() - daily.last_start_time) / 1000);
            daily.elapsed_seconds = (daily.accumulated_seconds || 0) + diffSecs;
            daily.accumulated_seconds = daily.elapsed_seconds;

            if ((habit.engine_type === 'free_timer' || habit.engine_type === 'progressive_time') && diffSecs >= 5) {
                const startISO = daily.session_started_at_iso || new Date(daily.last_start_time).toISOString();
                recordFreeTimerSession(habit, startISO, new Date().toISOString(), diffSecs);
            }
        }

        daily.is_running = false;
        daily.is_paused = true;
        daily.last_start_time = null;
        daily.session_started_at_iso = null;

        renderHabitsGrid();
        if (currentDetailHabitId === habitId) renderHabitDetailContent(habitId);

        saveHabitToSupabase(habit, false);
    }

    async function finishFreeTimerSession(habitId) {
        const habit = habitsList.find(h => h.id === habitId);
        if (!habit) return;

        const todayStr = getTodayString();
        const daily = getDailyProgress(habit, todayStr);

        let sessionSecs = 0;
        let startISO = daily.session_started_at_iso || new Date().toISOString();

        if (daily.is_running && daily.last_start_time) {
            const diffSecs = Math.floor((Date.now() - daily.last_start_time) / 1000);
            sessionSecs = (daily.accumulated_seconds || 0) + diffSecs;
        } else {
            sessionSecs = daily.elapsed_seconds || daily.accumulated_seconds || 0;
        }

        // Grava a sessão no histórico antes de resetar o cronômetro
        if (sessionSecs > 0) {
            recordFreeTimerSession(habit, startISO, new Date().toISOString(), sessionSecs);
        }

        // Marca o hábito como concluído hoje no sistema
        if (!Array.isArray(habit.complete_days)) habit.complete_days = [];
        if (!habit.complete_days.includes(todayStr)) {
            habit.complete_days.push(todayStr);
        }
        daily.completed = true;

        // REINICIA O TIMER PARA ZERO
        daily.elapsed_seconds = 0;
        daily.accumulated_seconds = 0;
        daily.is_running = false;
        daily.is_paused = false;
        daily.last_start_time = null;
        daily.session_started_at_iso = null;

        const var1Name = habit.variable1_name || 'Ativo';
        const var1Color = habit.variable1_color || '#10b981';

        triggerCelebration(var1Color);
        showToast(`🏆 Free Timer Concluído & Reiniciado: ${var1Name} (${formatSecondsToDetailedDuration(sessionSecs)})!`);

        // Dispara Alarme Heroico na Tela Cheia se ControlEngine estiver ativo
        if (window.ControlEngine && window.ControlEngine.triggerHeroicAlarm) {
            window.ControlEngine.triggerHeroicAlarm({
                title: `🏆 Hábito Concluído: ${habit.title}`,
                subtitle: `Sessão de Foco ${var1Name} (${formatSecondsToDetailedDuration(sessionSecs)})`,
                details: 'Meta concluída e sincronizada na nuvem com sucesso.',
                emoji: habit.emoji || '⚡',
                color: var1Color
            });
        }

        // Dispara Email via Resend automaticamente
        if (window.ControlEngine && window.ControlEngine.notifyHabitCompletedEmail) {
            window.ControlEngine.notifyHabitCompletedEmail(habit, sessionSecs);
        }

        // Dispara Avaliação de Regras Motivacionais Inteligentes
        if (window.ControlEngine && window.ControlEngine.evaluateMotivationRulesOnHabitEvent) {
            const streak = calculateStreak(habit);
            window.ControlEngine.evaluateMotivationRulesOnHabitEvent(habit, 'session_done', {
                streak: streak.current,
                duration_seconds: sessionSecs,
                status: `Sessão de ${formatSecondsToDetailedDuration(sessionSecs)} concluída`
            });
        }

        renderAll();
        await saveHabitToSupabase(habit, false);
    }

    function resetTimer(habitId) {
        const habit = habitsList.find(h => h.id === habitId);
        if (!habit) return;

        const todayStr = getTodayString();
        const daily = getDailyProgress(habit, todayStr);
        daily.elapsed_seconds = 0;
        daily.accumulated_seconds = 0;
        daily.is_running = false;
        daily.is_paused = false;
        daily.last_start_time = null;
        daily.session_started_at_iso = null;
        
        saveHabitToSupabase(habit, false);
        renderHabitsGrid();
        if (currentDetailHabitId === habitId) renderHabitDetailContent(habitId);
        showToast(`🔄 Cronômetro reiniciado.`);
    }

    function recordFreeTimerSession(habit, startedAtISO, endedAtISO, durationSecs) {
        if (!habit.sessions_history || !Array.isArray(habit.sessions_history)) {
            habit.sessions_history = [];
        }

        const newSession = {
            id: 'sess_' + Date.now(),
            started_at: startedAtISO,
            ended_at: endedAtISO,
            duration_seconds: durationSecs,
            duration_formatted: formatSecondsToDetailedDuration(durationSecs)
        };

        habit.sessions_history.unshift(newSession);
        saveHabitToSupabase(habit, false);
    }

    function startRealtimeHeartbeat() {
        if (heartbeatIntervalId) clearInterval(heartbeatIntervalId);
        heartbeatIntervalId = setInterval(() => {
            const todayStr = getTodayString();
            habitsList.forEach(habit => {
                const daily = getDailyProgress(habit, todayStr);
                if (daily.is_running && daily.last_start_time) {
                    saveHabitToSupabase(habit, false);
                }
            });
        }, 20000);
    }

    // ==========================================
    // OPERAÇÕES DE CONCLUSÃO & ENGINES (TOUCH FRIENDLY)
    // ==========================================

    async function toggleToday(habitId) {
        const habit = habitsList.find(h => h.id === habitId);
        if (!habit) return;

        const today = getTodayString();
        if (!Array.isArray(habit.complete_days)) habit.complete_days = [];

        const isCompleted = habit.complete_days.includes(today);
        const highlightColor = habit.color || '#10b981';

        if (isCompleted) {
            habit.complete_days = habit.complete_days.filter(d => d !== today);
            getDailyProgress(habit, today).completed = false;
            showToast(`↩️ Hábito desmarcado hoje.`);

            if (window.ControlEngine && window.ControlEngine.evaluateMotivationRulesOnHabitEvent) {
                window.ControlEngine.evaluateMotivationRulesOnHabitEvent(habit, 'missed', { streak: 0 });
            }
        } else {
            habit.complete_days.push(today);
            getDailyProgress(habit, today).completed = true;
            triggerCelebration(highlightColor);
            showToast(`⚡ Hábito Concluído com Sucesso!`);

            if (window.ControlEngine && window.ControlEngine.evaluateMotivationRulesOnHabitEvent) {
                const streak = calculateStreak(habit);
                window.ControlEngine.evaluateMotivationRulesOnHabitEvent(habit, 'completed', { streak: streak.current });
            }
        }

        renderAll();
        await saveHabitToSupabase(habit);
    }

    async function incrementCount(habitId, delta = 1) {
        const habit = habitsList.find(h => h.id === habitId);
        if (!habit) return;

        const today = getTodayString();
        const daily = getDailyProgress(habit, today);
        const target = habit.target_count || 5;
        const highlightColor = habit.color || '#10b981';

        if (!Array.isArray(habit.complete_days)) habit.complete_days = [];

        daily.count = Math.max(0, (daily.count || 0) + delta);

        if (daily.count >= target) {
            daily.completed = true;
            if (!habit.complete_days.includes(today)) {
                habit.complete_days.push(today);
            }
            triggerCelebration(highlightColor);
            showToast(`🎉 Meta de contagem atingida: ${daily.count}/${target}!`);

            if (window.ControlEngine && window.ControlEngine.evaluateMotivationRulesOnHabitEvent) {
                const streak = calculateStreak(habit);
                window.ControlEngine.evaluateMotivationRulesOnHabitEvent(habit, 'completed', { streak: streak.current });
            }
        } else {
            daily.completed = false;
            habit.complete_days = habit.complete_days.filter(d => d !== today);
        }

        renderAll();
        await saveHabitToSupabase(habit);
    }

    async function completeHabitToday(habitId, triggerFx = true) {
        const habit = habitsList.find(h => h.id === habitId);
        if (!habit) return;

        const today = getTodayString();
        const highlightColor = habit.color || '#10b981';
        if (!Array.isArray(habit.complete_days)) habit.complete_days = [];

        if (!habit.complete_days.includes(today)) {
            habit.complete_days.push(today);
        }
        getDailyProgress(habit, today).completed = true;

        if (triggerFx) {
            triggerCelebration(highlightColor);
            showToast(`🏆 Meta Concluída com Sucesso: ${habit.title}!`);

            // Dispara Alarme Heroico na Tela Cheia se ControlEngine estiver ativo
            if (window.ControlEngine && window.ControlEngine.triggerHeroicAlarm) {
                window.ControlEngine.triggerHeroicAlarm({
                    title: `🏆 Meta Concluída: ${habit.title}`,
                    subtitle: `Hábito Diário Atingido!`,
                    details: 'Parabéns pela consistência e foco. O progresso foi sincronizado na nuvem.',
                    emoji: habit.emoji || '⚡',
                    color: highlightColor
                });
            }

            // Dispara Email via Resend automaticamente se habilitado
            if (window.ControlEngine && window.ControlEngine.notifyHabitCompletedEmail) {
                const todayProgress = getDailyProgress(habit, today);
                const elapsedSecs = todayProgress.elapsed_seconds || habit.goal_seconds || 0;
                window.ControlEngine.notifyHabitCompletedEmail(habit, elapsedSecs);
            }
        }

        renderAll();
        await saveHabitToSupabase(habit);
    }

    async function toggleHabitDay(habitId, dateStr) {
        const habit = habitsList.find(h => h.id === habitId);
        if (!habit) return;

        const highlightColor = habit.color || '#10b981';
        if (!Array.isArray(habit.complete_days)) habit.complete_days = [];

        const index = habit.complete_days.indexOf(dateStr);
        if (index > -1) {
            habit.complete_days.splice(index, 1);
            showToast(`📅 Dia ${formatDateDisplay(dateStr)} desmarcado.`);
        } else {
            habit.complete_days.push(dateStr);
            triggerCelebration(highlightColor);
            showToast(`📅 Dia ${formatDateDisplay(dateStr)} marcado como concluído!`);
        }

        renderAll();
        await saveHabitToSupabase(habit);
    }

    function toggleColormapMode(habitId, e) {
        if (e) e.stopPropagation();
        const habit = habitsList.find(h => h.id === habitId);
        if (!habit) return;

        habit.colormap_mode = (habit.colormap_mode === 'goal') ? 'chronological' : 'goal';
        const modeLabel = (habit.colormap_mode === 'goal') ? '🎯 Goal Mode (Meta)' : '🗓️ Chronological Mode (60d)';
        showToast(`Visualização: ${modeLabel}`);

        renderHabitsGrid();
        saveHabitToSupabase(habit, false);
    }

    // ==========================================
    // RENDERIZAÇÃO DO HERO COLOR MAP (GOAL MODE vs CHRONOLOGICAL MODE)
    // ==========================================

    function renderMiniHeatmap(habit, daysCount = 63) {
        const isGoalMode = habit.colormap_mode === 'goal';
        const isFreeTimer = habit.engine_type === 'free_timer' || habit.engine_type === 'progressive_time';
        const todayStr = getTodayString();
        const completeDays = habit.complete_days || [];
        const dailyToday = getDailyProgress(habit, todayStr);

        const var1Name = habit.variable1_name || 'Ativo';
        const var1Color = habit.variable1_color || '#10b981';
        const var2Name = habit.variable2_name || 'Inativo';
        const var2Color = habit.variable2_color || '#ef4444';
        const defaultHighlight = habit.color || '#10b981';

        // 1. GOAL MODE (PERANTE A META DE DIAS ESTIPULADA)
        if (isGoalMode) {
            const targetDays = habit.target_days || 40;
            const completedCount = completeDays.length;
            const columnsCount = Math.ceil(targetDays / 7);

            let html = `<div class="flex items-center justify-between gap-1 sm:gap-1.5 w-full overflow-x-auto hide-scrollbar" dir="ltr">`;

            for (let col = 0; col < columnsCount; col++) {
                html += `<div class="flex flex-col gap-1 sm:gap-1.5 shrink-0 flex-1">`;
                for (let row = 0; row < 7; row++) {
                    const dayIndex = col * 7 + row + 1;
                    if (dayIndex > targetDays) {
                        html += `<div class="h-3.5 sm:h-4 w-full rounded-md opacity-0 pointer-events-none"></div>`;
                        continue;
                    }

                    const isDone = dayIndex <= completedCount;
                    let activeStyle = '';
                    let cellClass = 'h-3.5 sm:h-4 w-full rounded-md transition-all duration-150 relative group cursor-pointer ';
                    let statusText = `Dia ${dayIndex} de ${targetDays}`;

                    if (isDone) {
                        const activeColor = isFreeTimer ? var1Color : defaultHighlight;
                        activeStyle = `background: ${activeColor}; box-shadow: 0 0 7px ${activeColor}99;`;
                        statusText += ` (✓ Conquistado)`;
                    } else {
                        cellClass += 'bg-white/10 hover:bg-white/20 ';
                        statusText += ` (🎯 Meta Pendente)`;
                    }

                    html += `
                        <div class="${cellClass}" style="${activeStyle}" title="${statusText}">
                        </div>
                    `;
                }
                html += `</div>`;
            }

            html += `</div>`;
            return html;
        }

        // 2. CHRONOLOGICAL MODE (ÚLTIMOS 60 DIAS)
        const weeks = generateWeeks(63);
        const startDateStr = getHabitStartDate(habit);

        let html = `<div class="flex items-center justify-between gap-1 sm:gap-1.5 w-full overflow-x-auto hide-scrollbar" dir="ltr">`;

        weeks.forEach(week => {
            html += `<div class="flex flex-col gap-1 sm:gap-1.5 shrink-0 flex-1">`;
            week.forEach(day => {
                const isCompleted = completeDays.includes(day.date);
                const isPast = day.date < todayStr;
                const isToday = day.date === todayStr;
                const isBeforeZero = day.date < startDateStr;
                const formattedDate = formatDateDisplay(day.date);
                
                let activeStyle = '';
                let cellClass = 'h-3.5 sm:h-4 w-full rounded-md transition-all duration-150 relative group cursor-pointer ';
                let statusText = '';

                if (isFreeTimer) {
                    if (isToday) {
                        if (dailyToday.is_running) {
                            activeStyle = `background: ${var1Color}; box-shadow: 0 0 8px ${var1Color};`;
                            statusText = `⚡ Rodando: ${var1Name}`;
                        } else if (dailyToday.is_paused) {
                            activeStyle = `background: #f59e0b; box-shadow: 0 0 6px #f59e0b;`;
                            statusText = `⏸ Pausado`;
                        } else if (isCompleted || dailyToday.completed) {
                            activeStyle = `background: ${var1Color}; box-shadow: 0 0 6px ${var1Color}88;`;
                            statusText = `✓ Concluído: ${var1Name}`;
                        } else {
                            activeStyle = `background: ${var2Color}; box-shadow: 0 0 6px ${var2Color}88;`;
                            statusText = `✕ Parado: ${var2Name}`;
                        }
                    } else if (isCompleted) {
                        activeStyle = `background: ${var1Color}; box-shadow: 0 0 6px ${var1Color}88;`;
                        statusText = `✓ Ativo: ${var1Name}`;
                    } else if (isBeforeZero) {
                        cellClass += 'bg-white/10 hover:bg-white/20 ';
                        statusText = 'Neutro (Antes do início)';
                    } else if (isPast) {
                        activeStyle = `background: ${var2Color}; box-shadow: 0 0 5px ${var2Color}88;`;
                        statusText = `✕ Parado: ${var2Name}`;
                    } else {
                        cellClass += 'bg-white/10 ';
                        statusText = 'Pendente';
                    }
                } else {
                    if (isCompleted) {
                        activeStyle = `background: ${defaultHighlight}; box-shadow: 0 0 6px ${defaultHighlight}88;`;
                        statusText = '✓ Concluído';
                    } else if (isBeforeZero) {
                        cellClass += 'bg-white/10 hover:bg-white/20 ';
                        statusText = 'Neutro (Antes do início)';
                    } else if (isPast) {
                        activeStyle = `background: #ef4444; box-shadow: 0 0 5px rgba(239, 68, 68, 0.7);`;
                        statusText = '✕ Não Concluído';
                    } else if (isToday) {
                        cellClass += 'bg-white/20 ring-1 ring-white/70 ';
                        statusText = '⚡ Hoje (Pendente)';
                    } else {
                        cellClass += 'bg-white/10 ';
                        statusText = 'Pendente';
                    }
                }

                html += `
                    <div class="${cellClass}" style="${activeStyle}" title="${formattedDate} — ${statusText}">
                    </div>
                `;
            });
            html += `</div>`;
        });

        html += `</div>`;
        return html;
    }

    function renderLargeHeatmap(habit, daysCount = 365) {
        const weeks = generateWeeks(daysCount);
        const completeDays = habit.complete_days || [];
        const isFreeTimer = habit.engine_type === 'free_timer' || habit.engine_type === 'progressive_time';
        const todayStr = getTodayString();
        const startDateStr = getHabitStartDate(habit);
        const dailyToday = getDailyProgress(habit, todayStr);

        const var1Name = habit.variable1_name || 'Ativo';
        const var1Color = habit.variable1_color || '#10b981';
        const var2Name = habit.variable2_name || 'Inativo';
        const var2Color = habit.variable2_color || '#ef4444';
        const defaultHighlight = habit.color || '#10b981';

        let html = `<div class="flex gap-1.5 items-center justify-start overflow-x-auto py-2 pr-2 hide-scrollbar -webkit-overflow-scrolling-touch" dir="ltr">`;

        weeks.forEach((week) => {
            html += `<div class="flex flex-col gap-1.5 shrink-0">`;
            week.forEach(day => {
                const isCompleted = completeDays.includes(day.date);
                const isPast = day.date < todayStr;
                const isToday = day.date === todayStr;
                const isBeforeZero = day.date < startDateStr;
                const formattedDate = formatDateDisplay(day.date);
                
                let activeStyle = '';
                let cellClass = 'w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-md transition-all duration-150 cursor-pointer flex items-center justify-center text-[8px] font-mono select-none active:scale-90 ';
                let statusText = '';

                if (isFreeTimer) {
                    if (isToday) {
                        if (dailyToday.is_running) {
                            cellClass += 'scale-105 ';
                            activeStyle = `background: ${var1Color}; color: #000; font-weight: bold; box-shadow: 0 0 8px ${var1Color};`;
                            statusText = `⚡ Rodando: ${var1Name}`;
                        } else if (dailyToday.is_paused) {
                            cellClass += 'scale-105 ';
                            activeStyle = `background: #f59e0b; color: #000; font-weight: bold; box-shadow: 0 0 7px #f59e0b;`;
                            statusText = `⏸ Pausado`;
                        } else if (isCompleted || dailyToday.completed) {
                            cellClass += 'scale-105 ';
                            activeStyle = `background: ${var1Color}; color: #000; font-weight: bold; box-shadow: 0 0 6px ${var1Color}99;`;
                            statusText = `✓ Concluído: ${var1Name}`;
                        } else {
                            activeStyle = `background: ${var2Color}; color: #fff; font-weight: bold; box-shadow: 0 0 6px ${var2Color}99;`;
                            statusText = `✕ Parado: ${var2Name}`;
                        }
                    } else if (isCompleted) {
                        cellClass += 'scale-105 ';
                        activeStyle = `background: ${var1Color}; color: #000; font-weight: bold; box-shadow: 0 0 6px ${var1Color}99;`;
                        statusText = `✓ Ativo: ${var1Name}`;
                    } else if (isBeforeZero) {
                        cellClass += 'bg-white/5 hover:bg-white/15 text-gray-500 ';
                        statusText = 'Neutro (Antes do Dia Zero)';
                    } else if (isPast) {
                        activeStyle = `background: ${var2Color}; color: #fff; font-weight: bold; box-shadow: 0 0 5px ${var2Color}99;`;
                        statusText = `✕ Parado: ${var2Name}`;
                    } else {
                        cellClass += 'bg-white/5 hover:bg-white/20 text-gray-400 ';
                        statusText = 'Pendente';
                    }
                } else {
                    if (isCompleted) {
                        cellClass += 'scale-105 ';
                        activeStyle = `background: ${defaultHighlight}; color: #000; font-weight: bold; box-shadow: 0 0 6px ${defaultHighlight}99;`;
                        statusText = '✓ Concluído';
                    } else if (isBeforeZero) {
                        cellClass += 'bg-white/5 hover:bg-white/15 text-gray-500 ';
                        statusText = 'Neutro (Antes do Dia Zero)';
                    } else if (isPast) {
                        activeStyle = `background: #ef4444; color: #fff; font-weight: bold; box-shadow: 0 0 5px rgba(239,68,68,0.7);`;
                        statusText = '✕ Não Concluído';
                    } else if (isToday) {
                        cellClass += 'bg-white/15 ring-2 ring-white/80 text-white ';
                        statusText = '⚡ Hoje (Pendente)';
                    } else {
                        cellClass += 'bg-white/5 hover:bg-white/20 text-gray-400 ';
                        statusText = 'Pendente';
                    }
                }

                html += `
                    <div class="${cellClass}" style="${activeStyle}" title="${formattedDate} — ${statusText}" onclick="window.HabitTracker.toggleHabitDay('${habit.id}', '${day.date}');">
                    </div>
                `;
            });
            html += `</div>`;
        });

        html += `</div>`;
        return html;
    }

    // ==========================================
    // RENDERIZAÇÃO DA GRADE DE CARTÕES NA HOME (HERO COLOR MAP)
    // ==========================================

    function renderHabitsGrid() {
        const container = document.getElementById('habits-grid-container');
        if (!container) return;

        let filtered = habitsList;
        if (activeFilter === 'growth') {
            filtered = habitsList.filter(h => h.habit_type !== 'ban');
        } else if (activeFilter === 'ban') {
            filtered = habitsList.filter(h => h.habit_type === 'ban');
        } else if (activeFilter === 'completed') {
            filtered = habitsList.filter(isTodayCompleted);
        } else if (activeFilter === 'pending') {
            filtered = habitsList.filter(h => !isTodayCompleted(h));
        }

        if (filtered.length === 0) {
            container.innerHTML = `
                <div class="col-span-full liquid-glass-panel p-8 sm:p-10 text-center rounded-2xl sm:rounded-3xl border border-white/15 space-y-4">
                    <span class="text-3xl block mb-2">⚡</span>
                    <h3 class="text-base font-bold text-white">Nenhum hábito com este filtro</h3>
                    <p class="text-xs font-mono text-gray-400 max-w-md mx-auto">
                        Crie novos hábitos para cultivar ou destruir e desenvolva disciplina inabalável.
                    </p>
                    <button onclick="window.HabitTracker.openNewHabitModal()" class="min-h-[44px] mt-3 px-5 py-2.5 bg-white text-black font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg cursor-pointer active:scale-95 touch-manipulation">
                        ➕ Criar Novo Hábito
                    </button>
                </div>
            `;
            return;
        }

        let html = '';

        filtered.forEach(habit => {
            const completedToday = isTodayCompleted(habit);
            const streak = calculateStreak(habit);
            const rate = getCompletionRate(habit);
            const isBan = habit.habit_type === 'ban';
            const highlightColor = habit.color || '#10b981';
            const emoji = habit.emoji || '⚡';
            const engine = habit.engine_type || 'todo';
            const isFreeTimer = engine === 'free_timer' || engine === 'progressive_time';
            const isGoalMode = habit.colormap_mode === 'goal';
            const daily = getDailyProgress(habit, getTodayString());
            const isRunning = !!daily.is_running;
            const isPaused = !!daily.is_paused;

            const var1Name = habit.variable1_name || 'Ativo';
            const var1Color = habit.variable1_color || '#10b981';
            const var2Name = habit.variable2_name || 'Inativo';
            const var2Color = habit.variable2_color || '#ef4444';

            let engineHtml = '';

            if (engine === 'todo') {
                engineHtml = `
                    <div class="pt-3 border-t border-white/10 flex items-center justify-between gap-2 touch-manipulation" onclick="event.stopPropagation()">
                        <button onclick="window.HabitTracker.toggleToday('${habit.id}')" class="flex-1 min-h-[44px] py-2.5 px-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer ${
                            completedToday 
                                ? 'bg-white/20 text-white border border-white/30 shadow-[0_0_12px_rgba(255,255,255,0.2)]'
                                : 'bg-white hover:bg-gray-200 text-black shadow-md active:scale-95'
                        }">
                            <span>${completedToday ? '✓ Concluído Hoje' : '⚡ Concluir Hoje'}</span>
                        </button>
                        <button onclick="window.HabitTracker.openHabitDetailModal('${habit.id}')" class="min-h-[44px] px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 hover:text-white border border-white/20 text-xs font-mono transition cursor-pointer" title="365 Vision">🔍 365</button>
                    </div>
                `;
            } else if (engine === 'count') {
                const targetCount = habit.target_count || 5;
                const currentCount = daily.count || 0;
                const countPct = Math.min(100, Math.round((currentCount / targetCount) * 100));

                engineHtml = `
                    <div class="space-y-3 pt-3 border-t border-white/10" onclick="event.stopPropagation()">
                        <div class="flex justify-between items-center text-xs font-mono">
                            <span class="text-gray-300">Meta de Repetições:</span>
                            <span class="text-white font-bold text-sm bg-white/10 px-2.5 py-0.5 rounded-lg border border-white/15">
                                ${currentCount} / ${targetCount}
                            </span>
                        </div>
                        <div class="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                            <div class="h-full rounded-full transition-all duration-300" style="width: ${countPct}%; background: ${highlightColor};"></div>
                        </div>
                        <div class="flex items-center gap-2 touch-manipulation">
                            <button onclick="window.HabitTracker.incrementCount('${habit.id}', -1)" class="min-h-[44px] min-w-[44px] rounded-xl bg-white/10 hover:bg-white/20 active:bg-white/30 text-gray-200 text-sm font-mono font-bold border border-white/15 transition cursor-pointer flex items-center justify-center">－</button>
                            <button onclick="window.HabitTracker.incrementCount('${habit.id}', 1)" class="flex-1 min-h-[44px] py-2 px-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer ${
                                completedToday 
                                    ? 'bg-white/20 text-white border border-white/30'
                                    : 'bg-white hover:bg-gray-200 text-black shadow-md active:scale-95'
                            }">
                                <span>＋ Contar (${currentCount + 1}/${targetCount})</span>
                            </button>
                            <button onclick="window.HabitTracker.openHabitDetailModal('${habit.id}')" class="min-h-[44px] px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-mono border border-white/15 cursor-pointer" title="365 Vision">🔍 365</button>
                        </div>
                    </div>
                `;
            } else if (engine === 'goal_time') {
                const goalSecs = habit.goal_seconds || 3600;
                const elapsedSecs = daily.elapsed_seconds || 0;
                const timerPct = Math.min(100, Math.round((elapsedSecs / goalSecs) * 100));

                engineHtml = `
                    <div class="space-y-3 pt-3 border-t border-white/10" onclick="event.stopPropagation()">
                        <div class="bg-black/30 p-3 rounded-2xl border border-white/15 flex flex-col items-center justify-center text-center relative overflow-hidden">
                            <div class="text-[10px] font-mono uppercase tracking-widest text-gray-400 flex items-center gap-1.5">
                                <span>🎯 META:</span>
                                <span class="text-white font-bold">${formatSecondsToHMS(goalSecs)} (${formatSecondsToShortLabel(goalSecs)})</span>
                            </div>

                            <div id="timer-display-${habit.id}" class="text-2xl font-bold font-mono tracking-tight text-white my-1 tabular-nums ${isRunning ? 'animate-pulse' : ''}">
                                ${formatSecondsToHMS(elapsedSecs)}
                            </div>

                            <div class="w-full h-1.5 bg-white/10 rounded-full overflow-hidden mt-1">
                                <div id="timer-progress-bar-${habit.id}" class="h-full rounded-full transition-all duration-300" style="width: ${timerPct}%; background: ${highlightColor};"></div>
                            </div>
                        </div>

                        <div class="flex items-center gap-2 touch-manipulation">
                            ${
                                isRunning
                                    ? `<button onclick="window.HabitTracker.pauseTimer('${habit.id}')" class="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-mono text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer flex items-center justify-center gap-1.5">⏸ Pausar</button>`
                                    : `<button onclick="window.HabitTracker.startTimer('${habit.id}')" class="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-white hover:bg-gray-200 active:scale-95 text-black font-mono text-xs font-bold uppercase tracking-wider transition shadow-md cursor-pointer flex items-center justify-center gap-1.5">▶ Iniciar Timer</button>`
                            }
                            <button onclick="window.HabitTracker.resetTimer('${habit.id}')" class="min-h-[44px] min-w-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white border border-white/15 text-xs font-mono transition cursor-pointer flex items-center justify-center" title="Reiniciar">🔄</button>
                            <button onclick="window.HabitTracker.openHabitDetailModal('${habit.id}')" class="min-h-[44px] px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-mono border border-white/15 cursor-pointer" title="365 Vision">🔍 365</button>
                        </div>
                    </div>
                `;
            } else if (isFreeTimer) {
                const elapsedSecs = daily.elapsed_seconds || 0;

                engineHtml = `
                    <div class="space-y-3 pt-3 border-t border-white/10" onclick="event.stopPropagation()">
                        
                        <!-- Dual Variable Header (Variável 1 vs Variável 2) -->
                        <div class="p-3 rounded-2xl border transition-all duration-200 bg-black/40 border-white/15 space-y-2">
                            <div class="flex items-center justify-between gap-1 text-[10px] font-mono">
                                <span class="px-2 py-0.5 rounded-md font-bold text-white flex items-center gap-1" style="background: ${var1Color}33; border: 1px solid ${var1Color}88;">
                                    <span class="w-1.5 h-1.5 rounded-full" style="background: ${var1Color};"></span>
                                    <span>${var1Name}</span>
                                </span>
                                <span class="px-2 py-0.5 rounded-md font-bold text-white flex items-center gap-1" style="background: ${var2Color}33; border: 1px solid ${var2Color}88;">
                                    <span class="w-1.5 h-1.5 rounded-full" style="background: ${var2Color};"></span>
                                    <span>${var2Name}</span>
                                </span>
                            </div>

                            <div class="flex flex-col items-center justify-center text-center py-1">
                                <div id="timer-display-${habit.id}" class="text-2xl font-bold font-mono tracking-tight tabular-nums transition-colors duration-200 ${isRunning ? 'animate-pulse' : ''}" style="color: ${isRunning ? var1Color : (isPaused ? '#f59e0b' : var2Color)};">
                                    ${formatSecondsToHMS(elapsedSecs)}
                                </div>
                                <span class="text-[10px] font-mono text-gray-400">
                                    ${isRunning ? `⚡ ${var1Name} Ativo` : (isPaused ? '⏸ Timer Pausado' : `✕ ${var2Name} (Inativo)`)}
                                </span>
                            </div>
                        </div>

                        <div class="space-y-2 touch-manipulation">
                            <div class="flex items-center gap-2">
                                ${
                                    isRunning
                                        ? `<button onclick="window.HabitTracker.pauseTimer('${habit.id}')" class="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-amber-500 hover:bg-amber-400 active:scale-95 text-black font-mono text-xs font-bold uppercase transition shadow-md cursor-pointer flex items-center justify-center">⏸ Pausar</button>`
                                        : `<button onclick="window.HabitTracker.startTimer('${habit.id}')" class="flex-1 min-h-[44px] py-2 px-3 rounded-xl bg-white hover:bg-gray-200 active:scale-95 text-black font-mono text-xs font-bold uppercase transition shadow-md cursor-pointer flex items-center justify-center">▶ Iniciar ${var1Name}</button>`
                                }
                                <button onclick="window.HabitTracker.resetTimer('${habit.id}')" class="min-h-[44px] min-w-[44px] rounded-xl bg-white/10 hover:bg-white/20 text-gray-300 text-xs font-mono cursor-pointer flex items-center justify-center" title="Reset">🔄</button>
                                <button onclick="window.HabitTracker.openHabitDetailModal('${habit.id}')" class="min-h-[44px] px-3.5 rounded-xl bg-white/10 hover:bg-white/20 text-gray-200 text-xs font-mono border border-white/15 cursor-pointer" title="365 Vision">🔍 365</button>
                            </div>

                            <button onclick="window.HabitTracker.finishFreeTimerSession('${habit.id}')" class="w-full min-h-[44px] py-2.5 px-3 rounded-xl font-mono text-xs font-bold uppercase tracking-wider transition shadow-md flex items-center justify-center gap-2 cursor-pointer active:scale-95" style="background: ${var1Color}33; border: 1px solid ${var1Color}88; color: ${var1Color};">
                                <span>⏹</span>
                                <span>Encerrar & Concluir ${var1Name}</span>
                            </button>
                        </div>
                    </div>
                `;
            }

            const engineBadge = {
                'todo': '🔘 To-Do',
                'count': `🔢 Count (${habit.target_count || 5}x)`,
                'goal_time': `⏱️ Goal (${formatSecondsToShortLabel(habit.goal_seconds || 3600)})`,
                'free_timer': '⏳ Free Timer',
                'progressive_time': '⏳ Free Timer'
            }[engine] || '🔘 To-Do';

            html += `
                <div class="liquid-glass-panel rounded-2xl sm:rounded-3xl p-4 sm:p-5 border border-white/20 hover:border-white/40 transition-all duration-200 flex flex-col justify-between group shadow-lg relative overflow-hidden" 
                     onclick="window.HabitTracker.openHabitDetailModal('${habit.id}')" 
                     style="cursor: pointer; background: rgba(20, 20, 25, 0.6); backdrop-filter: blur(14px); contain: layout style;">
                    
                    <div class="space-y-2.5 relative z-10">
                        <div class="flex items-center justify-between gap-2 flex-wrap">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="text-xl sm:text-2xl p-1.5 rounded-xl bg-white/10 border border-white/15 flex items-center justify-center leading-none">${emoji}</span>
                                <span class="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest px-2 py-0.5 rounded-full border ${
                                    isBan 
                                        ? 'bg-red-500/20 text-red-300 border-red-500/40' 
                                        : 'bg-emerald-500/20 text-emerald-300 border-emerald-500/40'
                                }">
                                    ${isBan ? '🛑 DESTRUIR' : '🌱 CULTIVAR'}
                                </span>

                                <span class="text-[9px] font-mono text-gray-300 bg-white/10 border border-white/15 px-2 py-0.5 rounded-full">
                                    ${engineBadge}
                                </span>
                            </div>
                            
                            <div class="flex items-center gap-1.5 touch-manipulation" onclick="event.stopPropagation()">
                                <div class="flex items-center gap-1 px-2 py-0.5 rounded-full bg-white/10 border border-white/15 text-[10px] sm:text-[11px] font-mono font-bold text-amber-300">
                                    <span>🔥</span>
                                    <span>${streak.current}d</span>
                                </div>
                                <button onclick="window.HabitTracker.openEditHabitModal('${habit.id}');" class="min-h-[34px] min-w-[34px] p-1 rounded-lg bg-white/10 hover:bg-white/25 active:bg-white/35 text-gray-200 hover:text-white text-xs font-mono transition cursor-pointer flex items-center justify-center" title="Editar">
                                    ✏️
                                </button>
                                <button onclick="window.HabitTracker.openDeleteConfirmation('${habit.id}');" class="min-h-[34px] min-w-[34px] p-1 rounded-lg bg-red-500/15 hover:bg-red-500/35 active:bg-red-500/45 text-red-300 hover:text-red-100 text-xs font-mono transition cursor-pointer flex items-center justify-center" title="Excluir">
                                    🗑️
                                </button>
                            </div>
                        </div>

                        <div>
                            <h3 class="text-base sm:text-lg font-bold text-white group-hover:text-gray-100 transition-colors line-clamp-1">
                                ${habit.title}
                            </h3>
                            <p class="text-xs text-gray-300 font-sans line-clamp-2 mt-0.5 leading-relaxed">
                                ${habit.description || 'Sem anotações cadastradas. Clique para ver 365 Vision.'}
                            </p>
                        </div>
                    </div>

                    <!-- HERO COLOR MAP COM SWITCHER INTERATIVO (GOAL MODE vs 60D CRONOLÓGICO) -->
                    <div class="my-3.5 p-3.5 sm:p-4 rounded-2xl bg-black/50 border border-white/20 shadow-[0_8px_30px_rgba(0,0,0,0.5)] relative z-10 space-y-2.5">
                        <div class="flex items-center justify-between text-xs font-mono flex-wrap gap-1.5">
                            <div class="flex items-center gap-1.5">
                                <span class="text-sm">📊</span>
                                <span class="text-white font-bold">COLOR MAP</span>
                            </div>
                            
                            <div class="flex items-center gap-1.5" onclick="event.stopPropagation()">
                                <button onclick="window.HabitTracker.toggleColormapMode('${habit.id}', event)" class="px-2 py-0.5 rounded-lg text-[10px] font-mono font-bold transition flex items-center gap-1 cursor-pointer active:scale-95 touch-manipulation ${
                                    isGoalMode 
                                        ? 'bg-purple-500/30 text-purple-200 border border-purple-400/50 shadow-[0_0_8px_rgba(168,85,247,0.3)]' 
                                        : 'bg-sky-500/30 text-sky-200 border border-sky-400/50 shadow-[0_0_8px_rgba(56,189,248,0.3)]'
                                }" title="Clique para alternar entre Goal Mode e 60 Dias Cronológico">
                                    <span>${isGoalMode ? `🎯 Goal (${habit.target_days || 40}d)` : '🗓️ 60d Crono'}</span>
                                    <span class="text-[8px] opacity-75">⇄</span>
                                </button>
                                <span class="text-xs font-mono font-bold text-emerald-300 bg-white/10 px-2 py-0.5 rounded-lg border border-white/15">
                                    ${rate}% (${(habit.complete_days || []).length}/${habit.target_days || 40}d)
                                </span>
                            </div>
                        </div>

                        <div class="w-full overflow-x-auto hide-scrollbar py-1">
                            ${renderMiniHeatmap(habit, 63)}
                        </div>
                    </div>

                    <div class="relative z-10">
                        ${engineHtml}
                    </div>

                </div>
            `;
        });

        container.innerHTML = html;
    }

    // ==========================================
    // RENDERIZAÇÃO DO MODAL DE DETALHES (365 VISION)
    // ==========================================

    function renderHabitDetailContent(habitId) {
        const habit = habitsList.find(h => h.id === habitId);
        if (!habit) return;

        currentDetailHabitId = habitId;
        const streak = calculateStreak(habit);
        const rate = getCompletionRate(habit);
        const isBan = habit.habit_type === 'ban';
        const highlightColor = habit.color || '#10b981';
        const emoji = habit.emoji || '⚡';
        const totalCompleted = (habit.complete_days || []).length;
        const isCompletedToday = isTodayCompleted(habit);
        const engine = habit.engine_type || 'todo';
        const isFreeTimer = engine === 'free_timer' || engine === 'progressive_time';
        const sessions = habit.sessions_history || [];

        const titleEl = document.getElementById('habit-detail-title');
        const catEl = document.getElementById('habit-detail-category');
        const streakCurEl = document.getElementById('habit-detail-streak-cur');
        const streakMaxEl = document.getElementById('habit-detail-streak-max');
        const totalDaysEl = document.getElementById('habit-detail-total-days');
        const rateEl = document.getElementById('habit-detail-rate');
        const progressbarEl = document.getElementById('habit-detail-progressbar');
        const heatmapContainer = document.getElementById('habit-detail-heatmap-container');
        const descEl = document.getElementById('habit-detail-description');
        const toggleBtn = document.getElementById('habit-detail-toggle-btn');
        const sessionsContainer = document.getElementById('habit-detail-sessions-container');

        if (titleEl) titleEl.innerText = `${emoji} ${habit.title}`;
        if (catEl) {
            catEl.innerText = `${isBan ? '🛑 DESTRUIR' : '🌱 CULTIVAR'} • ${habit.category || 'Geral'}`;
            catEl.className = isBan 
                ? 'text-[10px] font-mono font-bold uppercase tracking-widest text-red-300 bg-red-500/20 border border-red-500/40 px-2.5 py-0.5 rounded-full'
                : 'text-[10px] font-mono font-bold uppercase tracking-widest text-emerald-300 bg-emerald-500/20 border border-emerald-500/40 px-2.5 py-0.5 rounded-full';
        }
        if (streakCurEl) streakCurEl.innerText = `${streak.current} dias`;
        if (streakMaxEl) streakMaxEl.innerText = `${streak.longest} dias`;
        if (totalDaysEl) totalDaysEl.innerText = `${totalCompleted} / ${habit.target_days || 40} dias`;
        if (rateEl) rateEl.innerText = `${rate}%`;
        if (progressbarEl) {
            progressbarEl.style.width = `${rate}%`;
            progressbarEl.style.background = isFreeTimer ? (habit.variable1_color || '#10b981') : highlightColor;
        }
        if (heatmapContainer) {
            heatmapContainer.innerHTML = renderLargeHeatmap(habit, 365);
        }
        if (descEl) {
            descEl.innerHTML = (habit.description || 'Sem diretrizes cadastradas.').replace(/\n/g, '<br/>');
        }

        if (sessionsContainer) {
            if (isFreeTimer) {
                sessionsContainer.style.display = 'block';
                if (sessions.length === 0) {
                    sessionsContainer.innerHTML = `
                        <div class="p-3.5 rounded-2xl bg-black/20 border border-white/10 text-center text-xs font-mono text-gray-400">
                            Nenhuma sessão finalizada ainda. Inicie o Free Timer para registrar tempo.
                        </div>
                    `;
                } else {
                    let sessHtml = `
                        <div class="space-y-2">
                            <h4 class="text-xs font-mono font-bold text-sky-300 uppercase tracking-widest flex items-center justify-between">
                                <span>⏳ Sessões Gravadas (${sessions.length})</span>
                                <span class="text-[10px] text-gray-400">Supabase ☁️</span>
                            </h4>
                            <div class="max-h-48 overflow-y-auto space-y-2 pr-1 -webkit-overflow-scrolling-touch">
                    `;
                    sessions.forEach(sess => {
                        sessHtml += `
                            <div class="p-3 rounded-xl bg-black/30 border border-white/10 flex items-center justify-between text-xs font-mono">
                                <div>
                                    <div class="text-white font-bold text-sm text-sky-200">${sess.duration_formatted || formatSecondsToDetailedDuration(sess.duration_seconds)}</div>
                                    <div class="text-[10px] text-gray-400">Início: ${formatDateTimeDisplay(sess.started_at)}</div>
                                </div>
                                <div class="text-right">
                                    <span class="text-[10px] text-gray-400 block">Fim: ${formatDateTimeDisplay(sess.ended_at)}</span>
                                </div>
                            </div>
                        `;
                    });
                    sessHtml += `</div></div>`;
                    sessionsContainer.innerHTML = sessHtml;
                }
            } else {
                sessionsContainer.style.display = 'none';
            }
        }

        if (toggleBtn) {
            if (isCompletedToday) {
                toggleBtn.innerText = '✓ Hábito Concluído Hoje';
                toggleBtn.className = 'min-h-[44px] py-3 px-6 rounded-2xl bg-white/20 text-white font-mono font-bold text-xs uppercase tracking-wider border border-white/25 transition cursor-pointer active:scale-95 touch-manipulation';
            } else {
                toggleBtn.innerText = '⚡ Concluir Hábito Hoje';
                toggleBtn.className = 'min-h-[44px] py-3 px-6 rounded-2xl bg-white hover:bg-gray-200 text-black font-mono font-bold text-xs uppercase tracking-wider shadow-xl transition cursor-pointer active:scale-95 touch-manipulation';
            }
            toggleBtn.onclick = () => window.HabitTracker.toggleToday(habit.id);
        }
    }

    // ==========================================
    // GERAL DASHBOARD EXECUTIVO 360° & CALENDÁRIO COM DATA ZERO REAL
    // ==========================================

    function getPeriodDateRange(period) {
        const today = getBrasiliaDate();
        const endStr = getTodayString();
        let daysBack = 1;

        if (period === 'day') daysBack = 1;
        else if (period === 'week') daysBack = 7;
        else if (period === 'month') daysBack = 30;
        else if (period === 'quarter') daysBack = 90;
        else if (period === 'semester') daysBack = 180;
        else if (period === 'year') daysBack = 365;

        const startDate = new Date(today);
        startDate.setDate(startDate.getDate() - (daysBack - 1));
        const startStr = formatISODate(startDate);

        const dateList = [];
        for (let i = 0; i < daysBack; i++) {
            const d = new Date(startDate);
            d.setDate(d.getDate() + i);
            dateList.push(formatISODate(d));
        }

        return { startStr, endStr, daysBack, dateList };
    }

    function setDashboardPeriod(period) {
        dashboardCurrentPeriod = period;

        const tabs = document.querySelectorAll('.dashboard-period-tab');
        tabs.forEach(tab => {
            const p = tab.getAttribute('data-period');
            if (p === period) {
                tab.className = 'dashboard-period-tab min-h-[38px] px-3.5 py-1.5 rounded-xl font-mono text-xs cursor-pointer transition bg-white text-black font-bold border border-white/30 shadow-md shrink-0';
            } else {
                tab.className = 'dashboard-period-tab min-h-[38px] px-3.5 py-1.5 rounded-xl font-mono text-xs cursor-pointer transition border border-white/10 text-gray-300 hover:bg-white/10 shrink-0';
            }
        });

        renderGeneralDashboardModalContent();
    }

    function openGeneralDashboardModal() {
        const modal = document.getElementById('habits-general-dashboard-modal');
        if (modal) {
            modal.classList.remove('hidden');
            if (!dashboardCalendarDate) dashboardCalendarDate = getBrasiliaDate();
            if (!dashboardSelectedDay) dashboardSelectedDay = getTodayString();
            renderGeneralDashboardModalContent();
        }
    }

    function closeGeneralDashboardModal() {
        const modal = document.getElementById('habits-general-dashboard-modal');
        if (modal) modal.classList.add('hidden');
    }

    function renderGeneralDashboardModalContent() {
        const { dateList, daysBack } = getPeriodDateRange(dashboardCurrentPeriod);

        const periodLabels = {
            'day': 'Visão de Hoje (Brasília)',
            'week': 'Últimos 7 Dias',
            'month': 'Últimos 30 Dias (Mês)',
            'quarter': 'Últimos 90 Dias (Trimestre)',
            'semester': 'Últimos 180 Dias (Semestre)',
            'year': 'Últimos 365 Dias (Ano)'
        };

        const periodLabelEl = document.getElementById('dashboard-period-label');
        if (periodLabelEl) periodLabelEl.innerText = periodLabels[dashboardCurrentPeriod] || 'Período Atual';

        let totalPossibleOpportunities = habitsList.length * daysBack;
        let totalCompletedInPeriod = 0;
        let totalSecondsInPeriod = 0;
        let totalCountInPeriod = 0;

        const habitPerformanceList = habitsList.map(habit => {
            const completedCount = (habit.complete_days || []).filter(d => dateList.includes(d)).length;
            totalCompletedInPeriod += completedCount;

            let habitSeconds = 0;
            let habitCount = 0;

            if (habit.daily_progress) {
                dateList.forEach(dStr => {
                    const dp = habit.daily_progress[dStr];
                    if (dp) {
                        if (dp.elapsed_seconds) habitSeconds += dp.elapsed_seconds;
                        if (dp.count) habitCount += dp.count;
                    }
                });
            }

            totalSecondsInPeriod += habitSeconds;
            totalCountInPeriod += habitCount;

            const habitPeriodRate = daysBack > 0 ? Math.min(100, Math.round((completedCount / daysBack) * 100)) : 0;

            return {
                habit,
                completedCount,
                habitSeconds,
                habitCount,
                habitPeriodRate
            };
        });

        const overallPeriodRate = totalPossibleOpportunities > 0 
            ? Math.min(100, Math.round((totalCompletedInPeriod / totalPossibleOpportunities) * 100))
            : 0;

        const metricsContainer = document.getElementById('dashboard-period-metrics-container');
        if (metricsContainer) {
            metricsContainer.innerHTML = `
                <div class="ultra-liquid-glass-card p-3 sm:p-4 rounded-2xl border border-white/15 space-y-0.5">
                    <span class="text-[9px] sm:text-[10px] font-mono uppercase text-gray-300">Adesão no Período</span>
                    <div class="text-xl sm:text-2xl font-bold font-mono text-emerald-300">${overallPeriodRate}%</div>
                    <span class="text-[9px] sm:text-[10px] font-mono text-gray-400">${totalCompletedInPeriod} de ${totalPossibleOpportunities} metas</span>
                </div>

                <div class="ultra-liquid-glass-card p-3 sm:p-4 rounded-2xl border border-white/15 space-y-0.5">
                    <span class="text-[9px] sm:text-[10px] font-mono uppercase text-gray-300">Tempo Focado</span>
                    <div class="text-xl sm:text-2xl font-bold font-mono text-sky-300 line-clamp-1">${formatSecondsToDetailedDuration(totalSecondsInPeriod) || '0s'}</div>
                    <span class="text-[9px] sm:text-[10px] font-mono text-gray-400">Horas acumuladas</span>
                </div>

                <div class="ultra-liquid-glass-card p-3 sm:p-4 rounded-2xl border border-white/15 space-y-0.5">
                    <span class="text-[9px] sm:text-[10px] font-mono uppercase text-gray-300">Repetições em Count</span>
                    <div class="text-xl sm:text-2xl font-bold font-mono text-amber-300">${totalCountInPeriod}x</div>
                    <span class="text-[9px] sm:text-[10px] font-mono text-gray-400">Ações registradas</span>
                </div>

                <div class="ultra-liquid-glass-card p-3 sm:p-4 rounded-2xl border border-white/15 space-y-0.5">
                    <span class="text-[9px] sm:text-[10px] font-mono uppercase text-gray-300">Total de Hábitos</span>
                    <div class="text-xl sm:text-2xl font-bold font-mono text-purple-300">${habitsList.length}</div>
                    <span class="text-[9px] sm:text-[10px] font-mono text-gray-400">Boxes cadastrados</span>
                </div>
            `;
        }

        const breakdownList = document.getElementById('dashboard-habits-breakdown-list');
        if (breakdownList) {
            if (habitPerformanceList.length === 0) {
                breakdownList.innerHTML = `<div class="text-center text-xs font-mono text-gray-400 py-4">Nenhum hábito cadastrado.</div>`;
            } else {
                let html = '';
                habitPerformanceList.forEach(item => {
                    const h = item.habit;
                    const isFreeTimer = h.engine_type === 'free_timer' || h.engine_type === 'progressive_time';
                    const highlightColor = isFreeTimer ? (h.variable1_color || '#10b981') : (h.color || '#10b981');
                    const emoji = h.emoji || '⚡';
                    const isBan = h.habit_type === 'ban';
                    const isPassed = item.completedCount > 0;

                    const neonBadgeStyle = isPassed 
                        ? `background: rgba(16, 185, 129, 0.2); border: 1px solid rgba(16, 185, 129, 0.6); box-shadow: 0 0 8px rgba(16, 185, 129, 0.4);`
                        : `background: rgba(244, 63, 94, 0.2); border: 1px solid rgba(244, 63, 94, 0.6); box-shadow: 0 0 8px rgba(244, 63, 94, 0.4);`;

                    html += `
                        <div class="ultra-liquid-glass-card p-3 sm:p-3.5 rounded-2xl border border-white/15 hover:border-white/30 transition space-y-2">
                            <div class="flex items-center justify-between gap-2 flex-wrap text-xs font-mono">
                                <div class="flex items-center gap-2 flex-wrap">
                                    <span class="text-base px-2 py-0.5 rounded-lg text-white" style="${neonBadgeStyle}">${emoji}</span>
                                    <span class="font-bold text-white">${h.title}</span>
                                    <span class="text-[9px] px-2 py-0.5 rounded-full ${isBan ? 'bg-red-500/20 text-red-300 border border-red-500/30' : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'}">
                                        ${isBan ? '🛑 Ban' : '🌱 Growth'}
                                    </span>
                                </div>
                                <div class="flex items-center gap-2 text-[10px] sm:text-[11px] text-gray-300 flex-wrap">
                                    ${
                                        isFreeTimer 
                                            ? `<button onclick="window.HabitTracker.openTimeDistributionModal('${h.id}')" class="min-h-[30px] px-2.5 py-1 rounded-xl bg-purple-500/25 hover:bg-purple-500/40 text-purple-200 border border-purple-400/50 text-[10px] font-mono font-bold flex items-center gap-1 transition cursor-pointer active:scale-95 touch-manipulation shadow-md" title="Visão de Tempo (Gráfico em Pizza)">
                                                    <span>⏱️ Visão de Tempo</span>
                                               </button>`
                                            : ''
                                    }
                                    <span>${item.completedCount}/${daysBack}d</span>
                                    ${item.habitSeconds > 0 ? `<span class="text-sky-300">⏱️ ${formatSecondsToDetailedDuration(item.habitSeconds)}</span>` : ''}
                                    <span class="font-bold text-white bg-white/10 px-2 py-0.5 rounded-md">${item.habitPeriodRate}%</span>
                                </div>
                            </div>
                            <div class="w-full h-1.5 sm:h-2 bg-white/10 rounded-full overflow-hidden">
                                <div class="h-full rounded-full transition-all duration-300" style="width: ${item.habitPeriodRate}%; background: ${isPassed ? highlightColor : (h.variable2_color || '#ef4444')};"></div>
                            </div>
                        </div>
                    `;
                });
                breakdownList.innerHTML = html;
            }
        }

        renderCalendarMatrix();
        renderSelectedDayDetails();
    }

    function navigateCalendarMonth(delta) {
        if (!dashboardCalendarDate) dashboardCalendarDate = getBrasiliaDate();
        dashboardCalendarDate.setMonth(dashboardCalendarDate.getMonth() + delta);
        renderCalendarMatrix();
    }

    function selectCalendarDay(dateStr) {
        dashboardSelectedDay = dateStr;
        renderCalendarMatrix();
        renderSelectedDayDetails();
    }

    // ==========================================
    // RENDERIZAÇÃO DO CALENDÁRIO COM FLUIDEZ TOTAL & DATA ZERO
    // ==========================================

    function renderCalendarMatrix() {
        const matrixContainer = document.getElementById('dashboard-calendar-matrix-container');
        const titleEl = document.getElementById('dashboard-calendar-title');
        if (!matrixContainer) return;

        if (!dashboardCalendarDate) dashboardCalendarDate = getBrasiliaDate();

        const year = dashboardCalendarDate.getFullYear();
        const month = dashboardCalendarDate.getMonth();

        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        if (titleEl) titleEl.innerText = `${monthNames[month]} ${year}`;

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const daysInPrevMonth = new Date(year, month, 0).getDate();

        const todayStr = getTodayString();

        let html = `
            <div class="w-full select-none min-w-[320px]">
                <div class="grid grid-cols-7 gap-1 text-center font-mono text-[9px] sm:text-[10px] text-gray-400 uppercase tracking-widest pb-1.5 border-b border-white/10">
                    <div>Dom</div>
                    <div>Seg</div>
                    <div>Ter</div>
                    <div>Qua</div>
                    <div>Qui</div>
                    <div>Sex</div>
                    <div>Sáb</div>
                </div>

                <div class="grid grid-cols-7 gap-1 sm:gap-1.5 pt-1.5">
        `;

        for (let i = firstDayOfMonth - 1; i >= 0; i--) {
            const prevDayNum = daysInPrevMonth - i;
            html += `
                <div class="h-16 sm:h-20 rounded-xl bg-white/[0.02] border border-white/5 p-1 flex flex-col justify-between text-gray-600 opacity-20">
                    <span class="text-[9px] font-mono">${prevDayNum}</span>
                </div>
            `;
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const d = new Date(year, month, day);
            const dateStr = formatISODate(d);
            const isToday = dateStr === todayStr;
            const isSelected = dateStr === dashboardSelectedDay;
            const isPastOrToday = dateStr <= todayStr;

            // Hábitos que já estavam criados/ativos nesta data (Data Zero)
            const activeHabitsOnDate = habitsList.filter(h => dateStr >= getHabitStartDate(h));
            const completedHabitsOnDate = activeHabitsOnDate.filter(h => Array.isArray(h.complete_days) && h.complete_days.includes(dateStr));
            const completedCount = completedHabitsOnDate.length;

            let cellClass = 'h-16 sm:h-20 rounded-xl border p-1 sm:p-1.5 flex flex-col justify-between transition cursor-pointer relative overflow-hidden active:scale-95 touch-manipulation ';
            
            if (isSelected) {
                cellClass += 'bg-white/25 border-white text-white shadow-lg ring-2 ring-purple-400 ';
            } else if (isToday) {
                cellClass += 'bg-white/10 border-white/40 text-white ring-1 ring-white/60 ';
            } else if (completedCount > 0) {
                cellClass += 'bg-white/[0.06] hover:bg-white/15 border-white/15 text-gray-200 ';
            } else {
                cellClass += 'bg-black/20 hover:bg-white/[0.08] border-white/10 text-gray-400 ';
            }

            html += `
                <div class="${cellClass}" onclick="window.HabitTracker.selectCalendarDay('${dateStr}')">
                    <div class="flex justify-between items-center w-full">
                        <span class="text-[10px] sm:text-xs font-mono font-bold ${isToday ? 'text-emerald-300 font-black' : ''}">${day}</span>
                        ${completedCount > 0 ? `<span class="text-[8px] sm:text-[9px] font-mono px-1.5 py-0.1 rounded-full bg-emerald-500/25 text-emerald-300 border border-emerald-500/30 font-bold">${completedCount}</span>` : ''}
                    </div>

                    <!-- ÍCONES OCUPANDO FLUIDAMENTE DESDE O PRIMEIRO ESPAÇO ATÉ O FINAL -->
                    <div class="flex items-center justify-start gap-1 flex-wrap w-full max-h-9 sm:max-h-12 overflow-hidden py-0.5">
                        ${
                            activeHabitsOnDate.map(h => {
                                const isDone = Array.isArray(h.complete_days) && h.complete_days.includes(dateStr);
                                const emoji = h.emoji || '⚡';
                                
                                if (isDone) {
                                    return `
                                        <span class="px-1 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold shrink-0" 
                                              style="color: #6ee7b7; background: rgba(16, 185, 129, 0.25); border: 1px solid rgba(16, 185, 129, 0.7); box-shadow: 0 0 5px rgba(16, 185, 129, 0.5);" 
                                              title="${h.title}: Concluído">
                                            ${emoji}
                                        </span>
                                    `;
                                } else if (isPastOrToday) {
                                    return `
                                        <span class="px-1 py-0.5 rounded-md text-[10px] sm:text-[11px] font-bold shrink-0" 
                                              style="color: #fda4af; background: rgba(244, 63, 94, 0.25); border: 1px solid rgba(244, 63, 94, 0.7); box-shadow: 0 0 5px rgba(244, 63, 94, 0.4);" 
                                              title="${h.title}: Não Concluído">
                                            ${emoji}
                                        </span>
                                    `;
                                } else {
                                    return `
                                        <span class="px-1 py-0.5 rounded-md text-[10px] sm:text-[11px] opacity-30 text-gray-500 shrink-0" title="${h.title}">
                                            ${emoji}
                                        </span>
                                    `;
                                }
                            }).join('')
                        }
                    </div>
                </div>
            `;
        }

        html += `
                </div>
            </div>
        `;

        matrixContainer.innerHTML = html;
    }

    function renderSelectedDayDetails() {
        const detailsContainer = document.getElementById('dashboard-selected-day-details');
        if (!detailsContainer) return;

        const dateStr = dashboardSelectedDay || getTodayString();
        const formattedDate = formatDateDisplay(dateStr);

        // Apenas hábitos que existiam nesta data
        const activeHabitsOnDate = habitsList.filter(h => dateStr >= getHabitStartDate(h));
        const completedHabits = activeHabitsOnDate.filter(h => Array.isArray(h.complete_days) && h.complete_days.includes(dateStr));
        const pendingHabits = activeHabitsOnDate.filter(h => !Array.isArray(h.complete_days) || !h.complete_days.includes(dateStr));

        if (activeHabitsOnDate.length === 0) {
            detailsContainer.innerHTML = `
                <div class="p-3.5 text-center text-xs font-mono text-gray-400">
                    📅 Data anterior ao início do monitoramento (${formattedDate}). Nenhum hábito registrado nesta época.
                </div>
            `;
            return;
        }

        let html = `
            <div class="flex items-center justify-between border-b border-white/10 pb-2.5 flex-wrap gap-2">
                <div class="flex items-center gap-2">
                    <span class="text-xs sm:text-sm font-bold text-white font-mono">📅 Detalhes: ${formattedDate}</span>
                    <span class="text-[9px] sm:text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-bold">
                        ${completedHabits.length} de ${activeHabitsOnDate.length} concluídos
                    </span>
                </div>
                <span class="text-[9px] sm:text-[10px] font-mono text-gray-400">Brasília Sync</span>
            </div>

            <div class="grid grid-cols-1 md:grid-cols-2 gap-3 pt-2">
                
                <!-- LISTA DE CONCLUÍDOS -->
                <div class="space-y-2">
                    <div class="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase font-bold text-emerald-300">
                        <span class="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span>
                        <span>✓ CONCLUÍDOS NO DIA (${completedHabits.length})</span>
                    </div>

                    ${
                        completedHabits.length === 0 
                            ? `<div class="text-xs font-mono text-gray-500 p-3 bg-white/5 rounded-xl border border-white/10">Nenhum hábito concluído nesta data.</div>`
                            : completedHabits.map(h => {
                                const dp = h.daily_progress ? h.daily_progress[dateStr] : null;
                                const emoji = h.emoji || '⚡';
                                const isFreeTimer = h.engine_type === 'free_timer' || h.engine_type === 'progressive_time';
                                const var1Name = h.variable1_name || 'Ativo';
                                const var1Color = h.variable1_color || '#10b981';
                                return `
                                    <div class="p-3 rounded-xl border border-emerald-500/50 bg-emerald-950/30 text-emerald-100 flex items-center justify-between text-xs font-mono shadow-[0_0_12px_rgba(16,185,129,0.3)] ring-1 ring-emerald-400/50">
                                        <div class="flex items-center gap-2.5">
                                            <span class="text-base px-2 py-0.5 rounded-lg bg-emerald-500/30 border border-emerald-400/50">${emoji}</span>
                                            <span class="text-white font-bold tracking-tight line-clamp-1">${h.title}</span>
                                        </div>

                                        <div class="text-[9px] sm:text-[10px] font-mono px-2.5 py-0.5 rounded-full font-bold shrink-0" style="background: ${var1Color}33; border: 1px solid ${var1Color}88; color: ${var1Color};">
                                            ${dp && dp.elapsed_seconds ? `⏱️ ${formatSecondsToDetailedDuration(dp.elapsed_seconds)}` : (isFreeTimer ? `✓ ${var1Name}` : '✓ Cumprido')}
                                        </div>
                                    </div>
                                `;
                            }).join('')
                    }
                </div>

                <!-- LISTA DE NÃO CONCLUÍDOS / FALHAS COM VERMELHO PISCANTE FORTE -->
                <div class="space-y-2">
                    <div class="flex items-center gap-1.5 text-[10px] sm:text-[11px] font-mono uppercase font-bold text-rose-300">
                        <span class="w-2 h-2 rounded-full bg-rose-500 animate-ping"></span>
                        <span>✕ NÃO CONCLUÍDOS / FALHAS (${pendingHabits.length})</span>
                    </div>

                    ${
                        pendingHabits.length === 0 
                            ? `<div class="text-xs font-mono text-emerald-300 p-3 bg-emerald-500/10 rounded-xl border border-emerald-500/30">🎉 Todos os hábitos cumpridos com perfeição!</div>`
                            : pendingHabits.map(h => {
                                const emoji = h.emoji || '⚡';
                                const isFreeTimer = h.engine_type === 'free_timer' || h.engine_type === 'progressive_time';
                                const var2Name = h.variable2_name || 'Inativo';
                                const var2Color = h.variable2_color || '#ef4444';
                                return `
                                    <div class="p-3 rounded-xl border-2 border-red-500/70 bg-red-950/40 text-rose-100 flex items-center justify-between text-xs font-mono shadow-[0_0_16px_rgba(239,68,68,0.7)] ring-2 ring-red-500/50 animate-pulse">
                                        <div class="flex items-center gap-2.5">
                                            <span class="text-base px-2 py-0.5 rounded-lg bg-red-500/40 border border-red-400/60">${emoji}</span>
                                            <span class="text-white font-bold line-clamp-1">${h.title}</span>
                                        </div>

                                        <span class="text-[9px] sm:text-[10px] font-mono px-2.5 py-0.5 rounded-full font-black uppercase tracking-wider shrink-0" style="background: ${var2Color}44; border: 1px solid ${var2Color}; color: #fecdd3;">
                                            ${isFreeTimer ? `✕ ${var2Name}` : '✕ Não Cumprido'}
                                        </span>
                                    </div>
                                `;
                            }).join('')
                    }
                </div>

            </div>
        `;

        detailsContainer.innerHTML = html;
    }

    // ==========================================
    // VISÃO DE TEMPO: GRÁFICO EM PIZZA / DONUT CHART (3 CORES)
    // ==========================================

    function openTimeDistributionModal(habitId) {
        const habit = habitsList.find(h => h.id === habitId);
        if (!habit) return;

        currentTimePieHabitId = habitId;
        renderTimeDistributionModalContent(habit);

        const modal = document.getElementById('habit-time-pie-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function closeTimeDistributionModal() {
        const modal = document.getElementById('habit-time-pie-modal');
        if (modal) modal.classList.add('hidden');
        currentTimePieHabitId = null;
    }

    function renderTimeDistributionModalContent(habit) {
        const titleEl = document.getElementById('pie-modal-habit-title');
        const subtitleEl = document.getElementById('pie-modal-period-subtitle');
        const chartContainer = document.getElementById('pie-chart-svg-container');
        const legendContainer = document.getElementById('pie-chart-legend-container');
        const sessionsListEl = document.getElementById('pie-modal-sessions-list');

        const { dateList, daysBack } = getPeriodDateRange(dashboardCurrentPeriod);

        const periodLabels = {
            'day': 'Visão de Hoje',
            'week': 'Últimos 7 Dias',
            'month': 'Últimos 30 Dias (Mês)',
            'quarter': 'Últimos 90 Dias',
            'semester': 'Últimos 180 Dias',
            'year': 'Últimos 365 Dias'
        };

        const var1Name = habit.variable1_name || 'Ativo';
        const var1Color = habit.variable1_color || '#10b981';
        const var2Name = habit.variable2_name || 'Inativo';
        const var2Color = habit.variable2_color || '#ef4444';
        const var3Color = '#f59e0b'; // Amarelo Pausa

        if (titleEl) titleEl.innerText = `${habit.emoji || '⚡'} ${habit.title} — Visão de Tempo`;
        if (subtitleEl) subtitleEl.innerText = `${periodLabels[dashboardCurrentPeriod] || 'Período'} • 3 Possibilidades`;

        // Cálculo dos 3 tempos em segundos (soma de sessões gravadas + sessão atual em tempo real)
        let totalActiveSecs = 0;
        let totalPausedSecs = 0;

        if (habit.sessions_history && Array.isArray(habit.sessions_history)) {
            habit.sessions_history.forEach(sess => {
                if (sess.started_at) {
                    const sessDateStr = formatISODate(new Date(sess.started_at));
                    if (dateList.includes(sessDateStr)) {
                        totalActiveSecs += (sess.duration_seconds || 0);
                    }
                }
            });
        }

        // Soma progresso de hoje se o timer estiver rodando ou tiver segundos não encerrados
        const todayDaily = getDailyProgress(habit, getTodayString());
        if (todayDaily && todayDaily.elapsed_seconds) {
            const todaySessionsSecs = (habit.sessions_history || [])
                .filter(s => s.started_at && formatISODate(new Date(s.started_at)) === getTodayString())
                .reduce((acc, s) => acc + (s.duration_seconds || 0), 0);
            const liveDiff = Math.max(0, todayDaily.elapsed_seconds - todaySessionsSecs);
            totalActiveSecs += liveDiff;
        }

        // Tempo total do período para cálculo proporcional (dias desde a criação do hábito no período)
        const startDateStr = getHabitStartDate(habit);
        const activeDaysInPeriod = dateList.filter(d => d >= startDateStr && d <= getTodayString()).length || 1;
        const totalPeriodBudgetSecs = Math.max(activeDaysInPeriod * 86400, totalActiveSecs + 1);
        let totalInactiveSecs = Math.max(0, totalPeriodBudgetSecs - (totalActiveSecs + totalPausedSecs));

        const totalCalculatedSecs = totalActiveSecs + totalInactiveSecs + totalPausedSecs;
        
        let pActive = Math.round((totalActiveSecs / totalCalculatedSecs) * 100);
        if (totalActiveSecs > 0 && pActive === 0) pActive = 1; // Garante visibilidade mínima

        let pPaused = Math.round((totalPausedSecs / totalCalculatedSecs) * 100);
        let pInactive = Math.max(0, 100 - (pActive + pPaused));

        if (totalActiveSecs === 0 && totalPausedSecs === 0) {
            pInactive = 100;
        }

        // Renderização SVG do Donut / Pie Chart (Perímetro = 2 * PI * 40 = ~251.32)
        const C = 251.32;
        const dashActive = (pActive / 100) * C;
        const dashPaused = (pPaused / 100) * C;
        const dashInactive = (pInactive / 100) * C;

        const offsetActive = 0;
        const offsetPaused = -dashActive;
        const offsetInactive = -(dashActive + dashPaused);

        if (chartContainer) {
            chartContainer.innerHTML = `
                <svg viewBox="0 0 100 100" class="w-full h-full transform -rotate-90">
                    <!-- Fundo Neutro -->
                    <circle cx="50" cy="50" r="40" fill="transparent" stroke="rgba(255,255,255,0.05)" stroke-width="14"></circle>
                    
                    <!-- Fatia 2: Inativo (Vermelho) -->
                    <circle cx="50" cy="50" r="40" fill="transparent" 
                            stroke="${var2Color}" stroke-width="14" 
                            stroke-dasharray="${dashInactive} ${C - dashInactive}" 
                            stroke-dashoffset="${offsetInactive}"
                            style="transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); filter: drop-shadow(0 0 6px ${var2Color}88);"></circle>

                    <!-- Fatia 3: Pausado (Amarelo) -->
                    ${pPaused > 0 ? `
                        <circle cx="50" cy="50" r="40" fill="transparent" 
                                stroke="${var3Color}" stroke-width="14" 
                                stroke-dasharray="${dashPaused} ${C - dashPaused}" 
                                stroke-dashoffset="${offsetPaused}"
                                style="transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); filter: drop-shadow(0 0 6px ${var3Color}aa);"></circle>
                    ` : ''}

                    <!-- Fatia 1: Ativo (Verde) -->
                    ${pActive > 0 ? `
                        <circle cx="50" cy="50" r="40" fill="transparent" 
                                stroke="${var1Color}" stroke-width="14" 
                                stroke-dasharray="${dashActive} ${C - dashActive}" 
                                stroke-dashoffset="${offsetActive}"
                                style="transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1); filter: drop-shadow(0 0 8px ${var1Color});"></circle>
                    ` : ''}
                </svg>

                <div class="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none space-y-0.5">
                    <span class="text-3xl font-black font-mono tracking-tight" style="color: ${var1Color};">${pActive}%</span>
                    <span class="text-[10px] font-mono text-gray-300 font-bold uppercase tracking-wider">${var1Name}</span>
                    <span class="text-[9px] font-mono text-gray-500">${formatSecondsToDetailedDuration(totalActiveSecs) || '0s'}</span>
                </div>
            `;
        }

        if (legendContainer) {
            legendContainer.innerHTML = `
                <!-- Variável 1 (Cor & Nome Exatos do Usuário) -->
                <div class="ultra-liquid-glass-card p-3.5 rounded-2xl border flex flex-col justify-between space-y-1.5 transition-all shadow-sm" style="background: ${var1Color}18; border-color: ${var1Color}55;">
                    <div class="flex items-center gap-2 font-bold" style="color: ${var1Color};">
                        <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background: ${var1Color}; box-shadow: 0 0 8px ${var1Color};"></span>
                        <span class="line-clamp-1">${var1Name}</span>
                    </div>
                    <div class="text-lg font-bold font-mono text-white">${pActive}%</div>
                    <span class="text-[10px] text-gray-300 font-mono">${formatSecondsToDetailedDuration(totalActiveSecs) || '0s'}</span>
                </div>

                <!-- Variável 2 (Cor & Nome Exatos do Usuário) -->
                <div class="ultra-liquid-glass-card p-3.5 rounded-2xl border flex flex-col justify-between space-y-1.5 transition-all shadow-sm" style="background: ${var2Color}18; border-color: ${var2Color}55;">
                    <div class="flex items-center gap-2 font-bold" style="color: ${var2Color};">
                        <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background: ${var2Color}; box-shadow: 0 0 8px ${var2Color};"></span>
                        <span class="line-clamp-1">${var2Name}</span>
                    </div>
                    <div class="text-lg font-bold font-mono text-white">${pInactive}%</div>
                    <span class="text-[10px] text-gray-300 font-mono">${formatSecondsToDetailedDuration(totalInactiveSecs)}</span>
                </div>

                <!-- Pausa (Amarelo Exclusivo para Pausa) -->
                <div class="ultra-liquid-glass-card p-3.5 rounded-2xl border flex flex-col justify-between space-y-1.5 transition-all shadow-sm" style="background: ${var3Color}18; border-color: ${var3Color}55;">
                    <div class="flex items-center gap-2 font-bold" style="color: ${var3Color};">
                        <span class="w-2.5 h-2.5 rounded-full shrink-0" style="background: ${var3Color}; box-shadow: 0 0 8px ${var3Color};"></span>
                        <span class="line-clamp-1">Em Pausa</span>
                    </div>
                    <div class="text-lg font-bold font-mono text-white">${pPaused}%</div>
                    <span class="text-[10px] text-gray-300 font-mono">${formatSecondsToDetailedDuration(totalPausedSecs) || '0s'}</span>
                </div>
            `;
        }

        if (sessionsListEl) {
            const sessions = habit.sessions_history || [];
            if (sessions.length === 0) {
                sessionsListEl.innerHTML = `<div class="text-center text-xs font-mono text-gray-400 py-3">Nenhuma sessão gravada no histórico ainda.</div>`;
            } else {
                let sHtml = '';
                sessions.slice(0, 10).forEach(s => {
                    sHtml += `
                        <div class="ultra-liquid-glass-card p-2.5 rounded-xl border border-white/15 flex items-center justify-between text-xs font-mono">
                            <div>
                                <span class="font-bold text-sm" style="color: ${var1Color};">⏱️ ${s.duration_formatted || formatSecondsToDetailedDuration(s.duration_seconds)}</span>
                                <span class="text-[10px] text-gray-300 block">${formatDateTimeDisplay(s.started_at)}</span>
                            </div>
                            <span class="text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider" style="background: ${var1Color}25; border: 1px solid ${var1Color}66; color: ${var1Color};">
                                ${var1Name}
                            </span>
                        </div>
                    `;
                });
                sessionsListEl.innerHTML = sHtml;
            }
        }
    }

    // ==========================================
    // MODAIS DE CRIAÇÃO, EDIÇÃO, EXCLUSÃO & EMOJI PICKER
    // ==========================================

    function selectFormEmoji(emoji) {
        const emojiInput = document.getElementById('habit-form-emoji');
        if (emojiInput) emojiInput.value = emoji;
        const drawer = document.getElementById('habit-emoji-picker-drawer');
        if (drawer) drawer.classList.add('hidden');
    }

    function renderEmojiPickerGrid(category = 'all') {
        const gridContainer = document.getElementById('habit-emoji-grid-container');
        if (!gridContainer) return;

        let emojiList = [];
        if (category === 'all') {
            Object.values(EMOJI_COLLECTION).forEach(arr => {
                emojiList = emojiList.concat(arr);
            });
            emojiList = [...new Set(emojiList)];
        } else if (EMOJI_COLLECTION[category]) {
            emojiList = EMOJI_COLLECTION[category];
        }

        let html = '';
        emojiList.forEach(emoji => {
            html += `
                <button type="button" onclick="window.HabitTracker.selectFormEmoji('${emoji}')" class="min-h-[44px] min-w-[44px] p-1.5 rounded-xl hover:bg-white/20 active:bg-white/30 transition text-center cursor-pointer text-2xl flex items-center justify-center active:scale-95 touch-manipulation">
                    ${emoji}
                </button>
            `;
        });

        gridContainer.innerHTML = html;
    }

    function filterEmojiCategory(category) {
        const btns = document.querySelectorAll('.emoji-cat-btn');
        btns.forEach(btn => {
            const cat = btn.getAttribute('data-cat');
            if (cat === category) {
                btn.className = 'emoji-cat-btn min-h-[34px] px-2.5 py-1 rounded-lg bg-white/25 text-white font-bold cursor-pointer shrink-0';
            } else {
                btn.className = 'emoji-cat-btn min-h-[34px] px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 text-gray-300 cursor-pointer shrink-0';
            }
        });
        renderEmojiPickerGrid(category);
    }

    function openNewHabitModal() {
        currentEditingHabitId = null;
        const heading = document.getElementById('habit-form-heading');
        const formTitle = document.getElementById('habit-form-title');
        const formEmoji = document.getElementById('habit-form-emoji');
        const formType = document.getElementById('habit-form-type');
        const formEngine = document.getElementById('habit-form-engine');
        const formTarget = document.getElementById('habit-form-target');
        const formColormapMode = document.getElementById('habit-form-colormap-mode');
        const formCountTarget = document.getElementById('habit-form-target-count');
        const formGoalSeconds = document.getElementById('habit-form-goal-seconds');
        const formVar1Name = document.getElementById('habit-form-var1-name');
        const formVar1Color = document.getElementById('habit-form-var1-color');
        const formVar2Name = document.getElementById('habit-form-var2-name');
        const formVar2Color = document.getElementById('habit-form-var2-color');
        const formCat = document.getElementById('habit-form-category');
        const formColor = document.getElementById('habit-form-color');
        const formDesc = document.getElementById('habit-form-description');

        if (heading) heading.innerText = 'Novo Hábito';
        if (formTitle) formTitle.value = '';
        if (formEmoji) formEmoji.value = '⚡';
        if (formType) formType.value = 'growth';
        if (formEngine) formEngine.value = 'todo';
        if (formTarget) formTarget.value = '40';
        if (formColormapMode) formColormapMode.value = 'chronological';
        if (formCountTarget) formCountTarget.value = '5';
        if (formGoalSeconds) formGoalSeconds.value = '3600';
        if (formVar1Name) formVar1Name.value = 'Ativo';
        if (formVar1Color) formVar1Color.value = '#10b981';
        if (formVar2Name) formVar2Name.value = 'Inativo';
        if (formVar2Color) formVar2Color.value = '#ef4444';
        if (formCat) formCat.value = 'Saúde & Foco';
        if (formColor) formColor.value = '#10b981';
        if (formDesc) formDesc.value = '';

        updateEngineFormFields();
        renderEmojiPickerGrid('all');

        const modal = document.getElementById('habit-form-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function openEditHabitModal(habitId) {
        const id = habitId || currentDetailHabitId;
        const habit = habitsList.find(h => h.id === id);
        if (!habit) return;

        currentEditingHabitId = habit.id;
        const heading = document.getElementById('habit-form-heading');
        const formTitle = document.getElementById('habit-form-title');
        const formEmoji = document.getElementById('habit-form-emoji');
        const formType = document.getElementById('habit-form-type');
        const formEngine = document.getElementById('habit-form-engine');
        const formTarget = document.getElementById('habit-form-target');
        const formColormapMode = document.getElementById('habit-form-colormap-mode');
        const formCountTarget = document.getElementById('habit-form-target-count');
        const formGoalSeconds = document.getElementById('habit-form-goal-seconds');
        const formVar1Name = document.getElementById('habit-form-var1-name');
        const formVar1Color = document.getElementById('habit-form-var1-color');
        const formVar2Name = document.getElementById('habit-form-var2-name');
        const formVar2Color = document.getElementById('habit-form-var2-color');
        const formCat = document.getElementById('habit-form-category');
        const formColor = document.getElementById('habit-form-color');
        const formDesc = document.getElementById('habit-form-description');

        if (heading) heading.innerText = 'Editar Hábito';
        if (formTitle) formTitle.value = habit.title || '';
        if (formEmoji) formEmoji.value = habit.emoji || '⚡';
        if (formType) formType.value = habit.habit_type || 'growth';
        if (formEngine) formEngine.value = (habit.engine_type === 'progressive_time' || habit.engine_type === 'total_progressive_timer') ? 'free_timer' : (habit.engine_type || 'todo');
        if (formTarget) formTarget.value = habit.target_days || 40;
        if (formColormapMode) formColormapMode.value = habit.colormap_mode || 'chronological';
        if (formCountTarget) formCountTarget.value = habit.target_count || 5;
        if (formGoalSeconds) formGoalSeconds.value = habit.goal_seconds || 3600;
        if (formVar1Name) formVar1Name.value = habit.variable1_name || 'Ativo';
        if (formVar1Color) formVar1Color.value = habit.variable1_color || '#10b981';
        if (formVar2Name) formVar2Name.value = habit.variable2_name || 'Inativo';
        if (formVar2Color) formVar2Color.value = habit.variable2_color || '#ef4444';
        if (formCat) formCat.value = habit.category || 'Geral';
        if (formColor) formColor.value = habit.color || '#10b981';
        if (formDesc) formDesc.value = habit.description || '';

        updateEngineFormFields();
        renderEmojiPickerGrid('all');

        const modal = document.getElementById('habit-form-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function updateEngineFormFields() {
        const engineSelect = document.getElementById('habit-form-engine');
        const countWrap = document.getElementById('wrap-form-count-target');
        const goalWrap = document.getElementById('wrap-form-goal-seconds');
        const freeTimerWrap = document.getElementById('wrap-form-free-timer-vars');

        if (!engineSelect) return;
        const val = engineSelect.value;

        if (countWrap) {
            countWrap.style.display = (val === 'count') ? 'block' : 'none';
        }
        if (goalWrap) {
            goalWrap.style.display = (val === 'goal_time') ? 'block' : 'none';
        }
        if (freeTimerWrap) {
            freeTimerWrap.style.display = (val === 'free_timer' || val === 'progressive_time') ? 'block' : 'none';
        }
    }

    function closeHabitFormModal() {
        const modal = document.getElementById('habit-form-modal');
        if (modal) modal.classList.add('hidden');
    }

    function openHabitDetailModal(habitId) {
        const habit = habitsList.find(h => h.id === habitId);
        if (!habit) return;

        renderHabitDetailContent(habitId);
        const modal = document.getElementById('habit-detail-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function closeHabitDetailModal() {
        const modal = document.getElementById('habit-detail-modal');
        if (modal) modal.classList.add('hidden');
        currentDetailHabitId = null;
    }

    function openDeleteConfirmation(habitId) {
        const id = habitId || currentDetailHabitId;
        const habit = habitsList.find(h => h.id === id);
        if (!habit) return;

        deletingHabitId = habit.id;
        const daysCountEl = document.getElementById('habit-delete-days-count');
        const confirmInput = document.getElementById('habit-delete-confirm-input');
        const submitBtn = document.getElementById('habit-delete-submit-btn');

        if (daysCountEl) daysCountEl.innerText = (habit.complete_days || []).length;
        if (confirmInput) confirmInput.value = '';
        if (submitBtn) {
            submitBtn.disabled = true;
            submitBtn.className = 'flex-1 min-h-[44px] py-2.5 bg-red-950/50 text-red-300 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-not-allowed border border-red-500/30';
        }

        const modal = document.getElementById('habit-delete-modal');
        if (modal) modal.classList.remove('hidden');
    }

    function checkDeleteInput(value) {
        const submitBtn = document.getElementById('habit-delete-submit-btn');
        if (!submitBtn) return;

        if (value && value.trim().toUpperCase() === 'DELETE') {
            submitBtn.disabled = false;
            submitBtn.className = 'flex-1 min-h-[44px] py-2.5 bg-red-600 hover:bg-red-500 active:scale-95 text-white font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition shadow-lg cursor-pointer touch-manipulation';
        } else {
            submitBtn.disabled = true;
            submitBtn.className = 'flex-1 min-h-[44px] py-2.5 bg-red-950/50 text-red-300 font-mono font-bold text-xs uppercase tracking-wider rounded-xl transition cursor-not-allowed border border-red-500/30';
        }
    }

    function closeDeleteHabitModal() {
        const modal = document.getElementById('habit-delete-modal');
        if (modal) modal.classList.add('hidden');
        deletingHabitId = null;
    }

    async function executeConfirmedDelete() {
        if (!deletingHabitId) return;

        const idToDelete = deletingHabitId;
        closeDeleteHabitModal();
        closeHabitDetailModal();

        habitsList = habitsList.filter(h => h.id !== idToDelete);
        renderAll();

        try {
            const client = getClient();
            if (client) {
                const { error } = await client.from('habits').delete().eq('id', idToDelete);
                if (error) throw error;
            }
            showToast('🗑️ Hábito excluído com sucesso da nuvem.');
        } catch (err) {
            console.error('Erro ao excluir hábito no Supabase:', err);
            showToast('⚠️ Erro ao excluir hábito no banco.');
        }
    }

    async function handleHabitFormSubmit(e) {
        if (e) e.preventDefault();

        const formTitle = document.getElementById('habit-form-title');
        const formEmoji = document.getElementById('habit-form-emoji');
        const formType = document.getElementById('habit-form-type');
        const formEngine = document.getElementById('habit-form-engine');
        const formTarget = document.getElementById('habit-form-target');
        const formColormapMode = document.getElementById('habit-form-colormap-mode');
        const formCountTarget = document.getElementById('habit-form-target-count');
        const formGoalSeconds = document.getElementById('habit-form-goal-seconds');
        const formVar1Name = document.getElementById('habit-form-var1-name');
        const formVar1Color = document.getElementById('habit-form-var1-color');
        const formVar2Name = document.getElementById('habit-form-var2-name');
        const formVar2Color = document.getElementById('habit-form-var2-color');
        const formCat = document.getElementById('habit-form-category');
        const formColor = document.getElementById('habit-form-color');
        const formDesc = document.getElementById('habit-form-description');

        const title = formTitle ? formTitle.value.trim() : '';
        if (!title) {
            showToast('Por favor, informe o título do hábito.');
            return;
        }

        const emoji = formEmoji ? formEmoji.value.trim() || '⚡' : '⚡';
        const habitType = formType ? formType.value : 'growth';
        const engineType = formEngine ? formEngine.value : 'todo';
        const targetDays = formTarget ? parseInt(formTarget.value, 10) || 40 : 40;
        const colormapMode = formColormapMode ? formColormapMode.value : 'chronological';
        const targetCount = formCountTarget ? parseInt(formCountTarget.value, 10) || 5 : 5;
        const goalSeconds = formGoalSeconds ? parseInt(formGoalSeconds.value, 10) || 3600 : 3600;
        const var1Name = formVar1Name ? formVar1Name.value.trim() || 'Ativo' : 'Ativo';
        const var1Color = formVar1Color ? formVar1Color.value : '#10b981';
        const var2Name = formVar2Name ? formVar2Name.value.trim() || 'Inativo' : 'Inativo';
        const var2Color = formVar2Color ? formVar2Color.value : '#ef4444';
        const category = formCat ? formCat.value.trim() || 'Geral' : 'Geral';
        const color = formColor ? formColor.value : '#10b981';
        const description = formDesc ? formDesc.value.trim() : '';

        if (currentEditingHabitId) {
            const habit = habitsList.find(h => h.id === currentEditingHabitId);
            if (habit) {
                habit.title = title;
                habit.emoji = emoji;
                habit.habit_type = habitType;
                habit.engine_type = engineType;
                habit.target_days = targetDays;
                habit.colormap_mode = colormapMode;
                habit.target_count = targetCount;
                habit.goal_seconds = goalSeconds;
                habit.variable1_name = var1Name;
                habit.variable1_color = var1Color;
                habit.variable2_name = var2Name;
                habit.variable2_color = var2Color;
                habit.category = category;
                habit.color = color;
                habit.description = description;
                habit.updated_at = new Date().toISOString();

                await saveHabitToSupabase(habit);
                showToast('💾 Hábito atualizado no Supabase!');
            }
        } else {
            const newHabit = {
                id: window.crypto && window.crypto.randomUUID ? window.crypto.randomUUID() : `habit_${Date.now()}`,
                title: title,
                emoji: emoji,
                habit_type: habitType,
                engine_type: engineType,
                target_days: targetDays,
                colormap_mode: colormapMode,
                target_count: targetCount,
                goal_seconds: goalSeconds,
                variable1_name: var1Name,
                variable1_color: var1Color,
                variable2_name: var2Name,
                variable2_color: var2Color,
                category: category,
                color: color,
                description: description,
                complete_days: [],
                daily_progress: {},
                sessions_history: [],
                habit_view: true,
                sort_order: habitsList.length,
                created_at: new Date().toISOString(),
                updated_at: new Date().toISOString()
            };

            habitsList.unshift(newHabit);
            await saveHabitToSupabase(newHabit);
            showToast('⚡ Novo hábito sincronizado na nuvem!');
        }

        closeHabitFormModal();
        renderAll();
    }

    // ==========================================
    // REALTIME WEBSOCKET SUBSCRIPTION & SUPABASE API
    // ==========================================

    function setupRealtimeSubscription() {
        const client = getClient();
        if (!client || realtimeChannel) return;

        try {
            realtimeChannel = client
                .channel('realtime_habits_stream')
                .on(
                    'postgres_changes',
                    { event: '*', schema: 'public', table: 'habits' },
                    (payload) => {
                        handleRealtimeEvent(payload);
                    }
                )
                .subscribe((status) => {
                    if (status === 'SUBSCRIBED') {
                        console.log('⚡ Supabase Realtime WebSocket conectado para Habits!');
                    }
                });
        } catch (err) {
            console.warn('Erro ao configurar canal Realtime do Supabase:', err);
        }
    }

    function handleRealtimeEvent(payload) {
        const { eventType, new: newRecord, old: oldRecord } = payload;

        if (eventType === 'INSERT') {
            const exists = habitsList.some(h => h.id === newRecord.id);
            if (!exists) {
                habitsList.unshift(normalizeHabitData(newRecord));
                renderAll();
            }
        } else if (eventType === 'UPDATE') {
            const index = habitsList.findIndex(h => h.id === newRecord.id);
            if (index > -1) {
                const existing = habitsList[index];
                const normalized = normalizeHabitData(newRecord);
                const existingDaily = getDailyProgress(existing, getTodayString());

                if (existingDaily.is_running) {
                    existing.title = normalized.title;
                    existing.emoji = normalized.emoji;
                    existing.color = normalized.color;
                    existing.category = normalized.category;
                    existing.complete_days = normalized.complete_days;
                    existing.sessions_history = normalized.sessions_history;
                    existing.variable1_name = normalized.variable1_name;
                    existing.variable1_color = normalized.variable1_color;
                    existing.variable2_name = normalized.variable2_name;
                    existing.variable2_color = normalized.variable2_color;
                    existing.colormap_mode = normalized.colormap_mode;
                } else {
                    habitsList[index] = normalized;
                    renderAll();
                }
            }
        } else if (eventType === 'DELETE') {
            habitsList = habitsList.filter(h => h.id !== oldRecord.id);
            renderAll();
        }
    }

    function normalizeHabitData(h) {
        let engine = h.engine_type || 'todo';
        if (engine === 'progressive_time' || engine === 'total_progressive_timer') {
            engine = 'free_timer';
        }

        return {
            ...h,
            emoji: h.emoji || '⚡',
            complete_days: Array.isArray(h.complete_days) ? h.complete_days : [],
            daily_progress: (h.daily_progress && typeof h.daily_progress === 'object') ? h.daily_progress : {},
            sessions_history: Array.isArray(h.sessions_history) ? h.sessions_history : [],
            habit_type: h.habit_type || 'growth',
            engine_type: engine,
            target_days: h.target_days || 40,
            colormap_mode: h.colormap_mode || 'chronological',
            target_count: h.target_count || 5,
            goal_seconds: h.goal_seconds || 3600,
            variable1_name: h.variable1_name || 'Ativo',
            variable1_color: h.variable1_color || '#10b981',
            variable2_name: h.variable2_name || 'Inativo',
            variable2_color: h.variable2_color || '#ef4444',
            color: (h.color === '#ef4444' || h.color === 'red') ? '#f97316' : (h.color || '#10b981')
        };
    }

    // ==========================================
    // CARREGAMENTO & PERSISTÊNCIA DIRETA NA NUVEM
    // ==========================================

    function generateDemoHabits() {
        const today = getTodayString();
        const d = parseISODate(today);
        const pastDays = [];
        for (let i = 0; i < 45; i++) {
            const temp = new Date(d);
            temp.setDate(temp.getDate() - i);
            pastDays.push(formatISODate(temp));
        }

        return [
            {
                id: 'demo-habit-1',
                title: 'Deep Work & Arquitetura de Software',
                emoji: '⚡',
                habit_type: 'growth',
                engine_type: 'free_timer',
                target_days: 40,
                colormap_mode: 'chronological',
                target_count: 5,
                goal_seconds: 14400,
                variable1_name: 'Foco Profundo',
                variable1_color: '#10b981',
                variable2_name: 'Revisão/Pausa',
                variable2_color: '#f59e0b',
                category: 'Foco',
                color: '#10b981',
                description: '4 horas diárias de desenvolvimento arquitetural ininterrupto.',
                complete_days: pastDays.slice(0, 32),
                created_at: pastDays[44] + 'T08:00:00Z',
                habit_view: true
            },
            {
                id: 'demo-habit-2',
                title: 'Zero Distrações & Hiperfoco',
                emoji: '🛑',
                habit_type: 'ban',
                engine_type: 'todo',
                target_days: 60,
                colormap_mode: 'chronological',
                target_count: 1,
                goal_seconds: 0,
                category: 'Ban',
                color: '#f97316',
                description: 'Bloqueio total de feeds e notificações durante blocos de produção.',
                complete_days: pastDays.slice(0, 28),
                created_at: pastDays[40] + 'T08:00:00Z',
                habit_view: true
            },
            {
                id: 'demo-habit-3',
                title: 'Performance Física & Corrida 5km',
                emoji: '🏃',
                habit_type: 'growth',
                engine_type: 'todo',
                target_days: 66,
                colormap_mode: 'chronological',
                target_count: 1,
                goal_seconds: 3600,
                category: 'Rotina',
                color: '#06b6d4',
                description: 'Treino cardiovascular e musculação de alta intensidade.',
                complete_days: pastDays.slice(0, 35).filter((_, idx) => idx % 6 !== 0),
                created_at: pastDays[42] + 'T07:00:00Z',
                habit_view: true
            },
            {
                id: 'demo-habit-4',
                title: 'Leitura Técnica & Papers AGI / Sistemas',
                emoji: '📚',
                habit_type: 'growth',
                engine_type: 'free_timer',
                target_days: 30,
                colormap_mode: 'chronological',
                target_count: 1,
                goal_seconds: 2700,
                category: 'Foco',
                color: '#8b5cf6',
                description: 'Estudo aprofundado de documentação e engenharia distribuída.',
                complete_days: pastDays.slice(0, 24),
                created_at: pastDays[35] + 'T09:00:00Z',
                habit_view: true
            },
            {
                id: 'demo-habit-5',
                title: 'Biohacking & Hidratação 3.5L',
                emoji: '💧',
                habit_type: 'growth',
                engine_type: 'counter',
                target_days: 90,
                colormap_mode: 'chronological',
                target_count: 7,
                goal_seconds: 0,
                category: 'Saúde',
                color: '#3b82f6',
                description: 'Consumo metrificado de água mineral com eletrólitos.',
                complete_days: pastDays.slice(0, 40),
                created_at: pastDays[44] + 'T06:00:00Z',
                habit_view: true
            }
        ];
    }

    async function loadHabits() {
        try {
            const client = getClient();
            let data = null;
            if (client) {
                const res = await client
                    .from('habits')
                    .select('*')
                    .order('sort_order', { ascending: true })
                    .order('created_at', { ascending: false });
                data = res.data;
            }

            if (data && Array.isArray(data) && data.length > 0) {
                habitsList = data.map(normalizeHabitData);
            } else {
                habitsList = generateDemoHabits().map(normalizeHabitData);
            }

            startMasterClockTicker();
            startRealtimeHeartbeat();
            setupRealtimeSubscription();

            renderAll();
        } catch (err) {
            console.warn('Modo Demonstração: carregando hábitos seed de alta performance:', err);
            habitsList = generateDemoHabits().map(normalizeHabitData);
            startMasterClockTicker();
            renderAll();
        }
    }

    async function saveHabitToSupabase(habit, showNotification = false) {
        try {
            const client = getClient();
            if (!client) return;

            let engine = habit.engine_type || 'todo';
            if (engine === 'progressive_time' || engine === 'total_progressive_timer') {
                engine = 'free_timer';
            }

            const payload = {
                id: habit.id,
                title: habit.title,
                emoji: habit.emoji || '⚡',
                habit_type: habit.habit_type || 'growth',
                engine_type: engine,
                target_days: habit.target_days || 40,
                colormap_mode: habit.colormap_mode || 'chronological',
                target_count: habit.target_count || 5,
                goal_seconds: habit.goal_seconds || 3600,
                variable1_name: habit.variable1_name || 'Ativo',
                variable1_color: habit.variable1_color || '#10b981',
                variable2_name: habit.variable2_name || 'Inativo',
                variable2_color: habit.variable2_color || '#ef4444',
                category: habit.category || 'Geral',
                color: (habit.color === '#ef4444' || habit.color === 'red') ? '#f97316' : (habit.color || '#10b981'),
                description: habit.description || '',
                complete_days: habit.complete_days || [],
                daily_progress: habit.daily_progress || {},
                sessions_history: habit.sessions_history || [],
                habit_view: habit.habit_view !== undefined ? habit.habit_view : true,
                sort_order: habit.sort_order || 0,
                updated_at: new Date().toISOString()
            };

            const { error } = await client
                .from('habits')
                .upsert(payload, { onConflict: 'id' });

            if (error) throw error;

            if (showNotification) {
                showToast('☁️ Sincronizado na Nuvem Supabase.');
            }
        } catch (err) {
            console.error('Erro ao salvar hábito no Supabase:', err);
        }
    }

    function setFilter(filter) {
        activeFilter = filter;
        const btns = document.querySelectorAll('.habit-filter-btn');
        btns.forEach(btn => {
            const f = btn.getAttribute('data-filter');
            if (f === filter) {
                btn.className = 'habit-filter-btn min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white text-black font-bold border border-white/30 transition text-xs font-mono cursor-pointer shadow-md shrink-0';
            } else {
                btn.className = 'habit-filter-btn min-h-[38px] px-3.5 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 border border-white/10 transition text-xs font-mono cursor-pointer shrink-0';
            }
        });
        renderHabitsGrid();
    }

    function renderSidebarCount() {
        const countBadge = document.getElementById('sidebar-habits-count');
        if (countBadge) {
            const completed = habitsList.filter(isTodayCompleted).length;
            countBadge.innerText = `${habitsList.length} hábitos • ${completed} hoje`;
        }
    }

    function renderAll() {
        renderHabitsGrid();
        renderSidebarCount();
        if (currentDetailHabitId) {
            renderHabitDetailContent(currentDetailHabitId);
        }
        const generalModal = document.getElementById('habits-general-dashboard-modal');
        if (generalModal && !generalModal.classList.contains('hidden')) {
            renderGeneralDashboardModalContent();
        }
        if (currentTimePieHabitId) {
            const habit = habitsList.find(h => h.id === currentTimePieHabitId);
            if (habit) renderTimeDistributionModalContent(habit);
        }
    }

    // ==========================================
    // EXPOSIÇÃO GLOBAL
    // ==========================================
    window.HabitTracker = {
        loadHabits,
        getHabits: () => habitsList,
        setFilter,
        toggleToday,
        incrementCount,
        startTimer,
        pauseTimer,
        resetTimer,
        finishFreeTimerSession,
        toggleHabitDay,
        toggleColormapMode,
        openTimeDistributionModal,
        closeTimeDistributionModal,
        openNewHabitModal,
        openEditHabitModal,
        closeHabitFormModal,
        openHabitDetailModal,
        closeHabitDetailModal,
        openGeneralDashboardModal,
        closeGeneralDashboardModal,
        setDashboardPeriod,
        navigateCalendarMonth,
        selectCalendarDay,
        selectFormEmoji,
        filterEmojiCategory,
        renderEmojiPickerGrid,
        openDeleteConfirmation,
        checkDeleteInput,
        closeDeleteHabitModal,
        executeConfirmedDelete,
        handleHabitFormSubmit,
        updateEngineFormFields,
        calculateStreak,
        getCompletionRate,
        isTodayCompleted,
        getBrasiliaDate,
        getTodayString
    };

    // Auto Inicialização no DOM Ready
    document.addEventListener('DOMContentLoaded', () => {
        loadHabits();
    });

})(window);
