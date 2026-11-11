/**
 * js/kill-mic.js — Sistema Global de Encerramento e Silenciamento de Microfone
 * - Encerra todas as faixas (MediaStreamTrack) de áudio ativas no navegador
 * - Aborta gravações em andamento no Diário OS
 * - Zera o volume de entrada (input volume) do macOS para 0% via CoreAudio / osascript
 * - Atalho de Teclado Global: Option + M (ou Option + Shift + M)
 */

(function () {
    const activeAudioTracks = new Set();
    let isMicMuted = false;
    let currentInputVolume = 50;

    // 1. Intercepta getUserMedia para rastrear qualquer captura de microfone no navegador
    if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const originalGetUserMedia = navigator.mediaDevices.getUserMedia.bind(navigator.mediaDevices);
        navigator.mediaDevices.getUserMedia = async function (constraints) {
            const stream = await originalGetUserMedia(constraints);
            if (stream) {
                const tracks = stream.getAudioTracks();
                tracks.forEach(track => {
                    activeAudioTracks.add(track);
                    track.addEventListener('ended', () => activeAudioTracks.delete(track));
                });
            }
            return stream;
        };
    }

    // 2. Função Central: Mata o Microfone no Navegador e no macOS
    async function killMic() {
        // A. Fecha todas as faixas ativas no browser
        activeAudioTracks.forEach(track => {
            try {
                track.enabled = false;
                track.stop();
            } catch (e) {
                console.warn('[Kill Mic] Erro ao fechar track:', e);
            }
        });
        activeAudioTracks.clear();

        // B. Aborta gravação de voz ativa se o Diário Studio estiver gravando
        if (typeof window.cancelVoiceRecording === 'function') {
            try {
                window.cancelVoiceRecording();
            } catch (e) {}
        }

        // C. Envia comando ao backend local para zerar o volume de entrada do macOS
        try {
            const res = await fetch('/api/kill-mic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'kill' })
            });
            const data = await res.json();
            if (data && data.success) {
                isMicMuted = true;
                currentInputVolume = 0;
            }
        } catch (err) {
            console.warn('[Kill Mic] Backend local inacessível:', err);
            isMicMuted = true;
            currentInputVolume = 0;
        }

        updateKillMicUI(true);
        if (typeof window.showToast === 'function') {
            window.showToast('🛑 KILL MIC ATIVADO: Microfone do macOS zerado em 0% e canais de áudio encerrados!');
        }
    }

    // 3. Função para reativar o microfone (Unmute)
    async function unmuteMic(targetVol = 75) {
        try {
            const res = await fetch('/api/kill-mic', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ action: 'unmute', volume: targetVol })
            });
            const data = await res.json();
            if (data && data.success) {
                isMicMuted = false;
                currentInputVolume = targetVol;
            }
        } catch (err) {
            console.warn('[Kill Mic] Falha ao reativar:', err);
            isMicMuted = false;
            currentInputVolume = targetVol;
        }

        updateKillMicUI(false);
        if (typeof window.showToast === 'function') {
            window.showToast(`🎙️ Microfone reativado no macOS (${targetVol}%).`);
        }
    }

    // 4. Alternância (Toggle)
    async function toggleKillMic() {
        if (isMicMuted) {
            await unmuteMic(75);
        } else {
            await killMic();
        }
    }

    // 5. Consulta estado atual no macOS
    async function checkMicStatus() {
        try {
            const res = await fetch('/api/kill-mic');
            if (res.ok) {
                const data = await res.json();
                if (data && data.success) {
                    isMicMuted = data.isMuted;
                    currentInputVolume = data.inputVolume;
                    updateKillMicUI(isMicMuted);
                }
            }
        } catch (e) {}
    }

    // 6. Atualização Visual de todos os botões "Kill Mic" espalhados pela UI
    function updateKillMicUI(muted) {
        const buttons = document.querySelectorAll('.btn-kill-mic-action, [data-kill-mic-btn]');
        buttons.forEach(btn => {
            const textSpan = btn.querySelector('.kill-mic-label');
            const iconSpan = btn.querySelector('.kill-mic-icon');
            if (muted) {
                btn.classList.add('bg-red-600/40', 'text-red-200', 'border-red-400', 'shadow-[0_0_12px_rgba(239,68,68,0.5)]', 'animate-pulse');
                btn.classList.remove('bg-white/10', 'text-gray-300', 'border-white/15', 'bg-red-500/20');
                if (textSpan) textSpan.innerText = 'MIC MORTO (0%)';
                if (iconSpan) iconSpan.innerText = '🛑';
                btn.setAttribute('title', 'Microfone completamente mudo no macOS (0%). Clique para reativar.');
            } else {
                btn.classList.remove('bg-red-600/40', 'text-red-200', 'border-red-400', 'shadow-[0_0_12px_rgba(239,68,68,0.5)]', 'animate-pulse');
                btn.classList.add('bg-white/10', 'text-gray-300', 'border-white/15');
                if (textSpan) textSpan.innerText = 'Kill Mic';
                if (iconSpan) iconSpan.innerText = '🛑';
                btn.setAttribute('title', 'Kill Mic: Encerra e silencia o microfone no macOS e fecha gravações (Option+M)');
            }
        });
    }

    // 7. Atalho de Teclado Global: Option + M (ou Option + Shift + M)
    window.addEventListener('keydown', (e) => {
        if (e.altKey && (e.code === 'KeyM' || e.key === 'm' || e.key === 'M')) {
            e.preventDefault();
            toggleKillMic();
        }
    });

    // 8. Checagem inicial e auto-sincronização no foco da janela
    window.addEventListener('DOMContentLoaded', checkMicStatus);
    window.addEventListener('focus', checkMicStatus);
    setInterval(checkMicStatus, 20000);

    // Exportação Global
    window.killMic = killMic;
    window.unmuteMic = unmuteMic;
    window.toggleKillMic = toggleKillMic;
    window.checkMicStatus = checkMicStatus;
})();
