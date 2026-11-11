/**
 * Glassmorphism Dialog System for Cartas para Mateus, Diário and Dreamboard
 * Replaces native browser alert, confirm, and prompt with ultra-clean, Apple-style glass modals.
 */

(function () {
    // Inject Dialog CSS
    const style = document.createElement('style');
    style.id = 'glass-dialog-styles';
    style.innerHTML = `
        .glass-dialog-overlay {
            position: fixed;
            inset: 0;
            z-index: 99999;
            background: radial-gradient(120% 120% at 50% 0%, rgba(10,10,16,0.55) 0%, rgba(0,0,0,0.74) 100%);
            backdrop-filter: blur(30px) saturate(185%) brightness(1.04);
            -webkit-backdrop-filter: blur(30px) saturate(185%) brightness(1.04);
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 1.25rem;
            opacity: 0;
            pointer-events: none;
            transition: opacity 0.25s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-dialog-overlay.active {
            opacity: 1;
            pointer-events: auto;
        }
        .glass-dialog-card {
            position: relative;
            overflow: hidden;
            background: linear-gradient(135deg, rgba(40, 40, 48, 0.52) 0%, rgba(12, 12, 18, 0.60) 100%);
            backdrop-filter: blur(42px) saturate(200%) brightness(1.12);
            -webkit-backdrop-filter: blur(42px) saturate(200%) brightness(1.12);
            border: 1px solid rgba(255, 255, 255, 0.20);
            border-radius: 1.75rem;
            box-shadow:
                0 32px 80px -24px rgba(0, 0, 0, 0.92),
                0 2px 8px rgba(0, 0, 0, 0.40),
                inset 0 1px 1.5px rgba(255, 255, 255, 0.40),
                inset 0 -26px 52px -34px rgba(255, 255, 255, 0.08);
            max-width: 440px;
            width: 100%;
            padding: 1.75rem;
            transform: scale(0.94) translateY(8px);
            transition: transform 0.35s cubic-bezier(0.16, 1, 0.3, 1);
            color: #f5f5f7;
            font-family: -apple-system, BlinkMacSystemFont, "Inter", sans-serif;
        }
        .glass-dialog-card::before {
            content: '';
            position: absolute;
            top: -60%;
            left: -30%;
            width: 160%;
            height: 220%;
            background: linear-gradient(140deg, rgba(255, 255, 255, 0.16) 0%, rgba(255, 255, 255, 0.05) 18%, rgba(255, 255, 255, 0) 42%);
            pointer-events: none;
            z-index: 0;
            transform: translateY(-8%);
            transition: transform 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }
        .glass-dialog-card::after {
            content: '';
            position: absolute;
            inset: 0;
            border-radius: inherit;
            padding: 1px;
            background: linear-gradient(135deg, rgba(255, 255, 255, 0.45) 0%, rgba(255, 255, 255, 0) 40%, rgba(255, 255, 255, 0) 62%, rgba(255, 255, 255, 0.14) 100%);
            -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            -webkit-mask-composite: xor;
            mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
            mask-composite: exclude;
            pointer-events: none;
            z-index: 0;
        }
        .glass-dialog-card > * {
            position: relative;
            z-index: 1;
        }
        .glass-dialog-overlay.active .glass-dialog-card {
            transform: scale(1) translateY(0);
        }
        .glass-dialog-overlay.active .glass-dialog-card::before {
            transform: translateY(4%);
        }
        .glass-dialog-input {
            width: 100%;
            background: rgba(255, 255, 255, 0.07);
            border: 1px solid rgba(255, 255, 255, 0.2);
            border-radius: 0.875rem;
            padding: 0.75rem 1rem;
            color: #ffffff;
            font-family: "SF Mono", monospace, sans-serif;
            font-size: 0.875rem;
            outline: none;
            transition: all 0.2s ease;
            box-sizing: border-box;
            margin-top: 1rem;
        }
        .glass-dialog-input:focus {
            background: rgba(0, 0, 0, 0.5);
            border-color: rgba(255, 255, 255, 0.55);
            box-shadow: 0 0 15px rgba(255, 255, 255, 0.15);
        }
        .glass-btn {
            font-family: "SF Mono", monospace, sans-serif;
            font-size: 0.75rem;
            font-weight: 700;
            text-transform: uppercase;
            letter-spacing: 0.05em;
            padding: 0.75rem 1.25rem;
            border-radius: 0.875rem;
            transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
            cursor: pointer;
            border: none;
        }
        .glass-btn-primary {
            background: #ffffff;
            color: #000000;
            box-shadow: 0 4px 15px rgba(255, 255, 255, 0.25);
        }
        .glass-btn-primary:hover {
            background: #e5e5e7;
            transform: translateY(-1px);
        }
        .glass-btn-danger {
            background: linear-gradient(135deg, #ef4444 0%, #b91c1c 100%);
            color: #ffffff;
            box-shadow: 0 4px 15px rgba(239, 68, 68, 0.35);
        }
        .glass-btn-danger:hover {
            filter: brightness(1.1);
            transform: translateY(-1px);
        }
        .glass-btn-secondary {
            background: rgba(255, 255, 255, 0.08);
            border: 1px solid rgba(255, 255, 255, 0.15);
            color: #d1d5db;
        }
        .glass-btn-secondary:hover {
            background: rgba(255, 255, 255, 0.16);
            color: #ffffff;
        }
    `;
    function ensureDialogDOM() {
        if (!document.getElementById('glass-dialog-styles')) {
            const head = document.head || document.getElementsByTagName('head')[0];
            if (head) head.appendChild(style);
        }

        let overlay = document.getElementById('glass-dialog-modal');
        if (!overlay && document.body) {
            overlay = document.createElement('div');
            overlay.id = 'glass-dialog-modal';
            overlay.className = 'glass-dialog-overlay';
            overlay.innerHTML = `
                <div class="glass-dialog-card" id="glass-dialog-box" onclick="event.stopPropagation()">
                    <div class="flex items-center gap-3 mb-3">
                        <div id="glass-dialog-icon-wrap" class="w-10 h-10 rounded-xl flex items-center justify-center text-xl bg-white/10 border border-white/20 shrink-0">
                            <span id="glass-dialog-icon">✨</span>
                        </div>
                        <div>
                            <h3 id="glass-dialog-title" class="text-base font-bold text-white tracking-tight leading-tight">Aviso</h3>
                            <span id="glass-dialog-subtitle" class="text-[10px] font-mono text-gray-400 uppercase tracking-widest block">Sistema</span>
                        </div>
                    </div>
                    <p id="glass-dialog-message" class="text-xs text-gray-300 leading-relaxed font-sans mt-2 break-words"></p>
                    <div id="glass-dialog-input-container" class="hidden">
                        <input type="text" id="glass-dialog-input-field" class="glass-dialog-input" />
                    </div>
                    <div id="glass-dialog-actions" class="flex items-center justify-end gap-2.5 mt-6 pt-4 border-t border-white/10">
                        <button type="button" id="glass-dialog-cancel-btn" class="glass-btn glass-btn-secondary hidden">Cancelar</button>
                        <button type="button" id="glass-dialog-confirm-btn" class="glass-btn glass-btn-primary">OK</button>
                    </div>
                </div>
            `;
            document.body.appendChild(overlay);
        }
        return overlay;
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureDialogDOM);
    } else {
        ensureDialogDOM();
    }

    function getDialogElements() {
        const overlay = ensureDialogDOM();
        return {
            overlay,
            titleEl: document.getElementById('glass-dialog-title'),
            msgEl: document.getElementById('glass-dialog-message'),
            iconEl: document.getElementById('glass-dialog-icon'),
            inputContainer: document.getElementById('glass-dialog-input-container'),
            inputField: document.getElementById('glass-dialog-input-field'),
            confirmBtn: document.getElementById('glass-dialog-confirm-btn'),
            cancelBtn: document.getElementById('glass-dialog-cancel-btn')
        };
    }

    let currentResolve = null;

    function closeDialog() {
        const { overlay, cancelBtn } = getDialogElements();
        if (overlay) overlay.classList.remove('active');
        document.removeEventListener('keydown', handleKeydown);
    }

    function handleKeydown(e) {
        const { cancelBtn, confirmBtn } = getDialogElements();
        if (e.key === 'Escape') {
            if (cancelBtn && !cancelBtn.classList.contains('hidden')) {
                cancelBtn.click();
            } else if (confirmBtn) {
                confirmBtn.click();
            }
        } else if (e.key === 'Enter' && e.target.tagName !== 'TEXTAREA') {
            e.preventDefault();
            if (confirmBtn) confirmBtn.click();
        }
    }

    /**
     * Shows a Glassmorphism Alert
     */
    window.glassAlert = function (message, title = 'Aviso', icon = '✨') {
        return new Promise((resolve) => {
            const { overlay, titleEl, msgEl, iconEl, inputContainer, cancelBtn, confirmBtn } = getDialogElements();
            if (!overlay) {
                alert(message);
                return resolve(true);
            }

            currentResolve = resolve;
            if (titleEl) titleEl.innerText = title;
            if (msgEl) msgEl.innerHTML = typeof message === 'string' ? message.replace(/\n/g, '<br>') : String(message);
            if (iconEl) iconEl.innerText = icon;

            if (inputContainer) inputContainer.classList.add('hidden');
            if (cancelBtn) cancelBtn.classList.add('hidden');
            if (confirmBtn) {
                confirmBtn.innerText = 'Entendido';
                confirmBtn.className = 'glass-btn glass-btn-primary';
                confirmBtn.onclick = () => {
                    closeDialog();
                    resolve(true);
                };
            }

            overlay.classList.add('active');
            document.addEventListener('keydown', handleKeydown);
        });
    };

    /**
     * Shows a Glassmorphism Confirm Dialog
     */
    window.glassConfirm = function (message, title = 'Confirmar Ação', confirmText = 'Confirmar', cancelText = 'Cancelar', isDanger = false, icon = '⚠️') {
        return new Promise((resolve) => {
            const { overlay, titleEl, msgEl, iconEl, inputContainer, cancelBtn, confirmBtn } = getDialogElements();
            if (!overlay) {
                const ok = confirm(message);
                return resolve(ok);
            }

            currentResolve = resolve;
            if (titleEl) titleEl.innerText = title;
            if (msgEl) msgEl.innerHTML = typeof message === 'string' ? message.replace(/\n/g, '<br>') : String(message);
            if (iconEl) iconEl.innerText = icon;

            if (inputContainer) inputContainer.classList.add('hidden');
            if (cancelBtn) {
                cancelBtn.classList.remove('hidden');
                cancelBtn.innerText = cancelText;
                cancelBtn.onclick = () => {
                    closeDialog();
                    resolve(false);
                };
            }

            if (confirmBtn) {
                confirmBtn.innerText = confirmText;
                confirmBtn.className = isDanger ? 'glass-btn glass-btn-danger' : 'glass-btn glass-btn-primary';
                confirmBtn.onclick = () => {
                    closeDialog();
                    resolve(true);
                };
            }

            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    closeDialog();
                    resolve(false);
                }
            };

            overlay.classList.add('active');
            document.addEventListener('keydown', handleKeydown);
        });
    };

    /**
     * Shows a Glassmorphism Prompt Dialog
     */
    window.glassPrompt = function (message, defaultValue = '', title = 'Entrada de Dados', placeholder = 'Digite aqui...', confirmText = 'Salvar', cancelText = 'Cancelar', icon = '✏️') {
        return new Promise((resolve) => {
            const { overlay, titleEl, msgEl, iconEl, inputContainer, inputField, cancelBtn, confirmBtn } = getDialogElements();
            if (!overlay) {
                const val = prompt(message, defaultValue);
                return resolve(val);
            }

            currentResolve = resolve;
            if (titleEl) titleEl.innerText = title;
            if (msgEl) msgEl.innerHTML = typeof message === 'string' ? message.replace(/\n/g, '<br>') : String(message);
            if (iconEl) iconEl.innerText = icon;

            if (inputContainer) inputContainer.classList.remove('hidden');
            if (inputField) {
                inputField.value = defaultValue || '';
                inputField.placeholder = placeholder;
            }

            if (cancelBtn) {
                cancelBtn.classList.remove('hidden');
                cancelBtn.innerText = cancelText;
                cancelBtn.onclick = () => {
                    closeDialog();
                    resolve(null);
                };
            }

            if (confirmBtn) {
                confirmBtn.innerText = confirmText;
                confirmBtn.className = 'glass-btn glass-btn-primary';
                confirmBtn.onclick = () => {
                    const val = inputField ? inputField.value : '';
                    closeDialog();
                    resolve(val);
                };
            }

            overlay.onclick = (e) => {
                if (e.target === overlay) {
                    closeDialog();
                    resolve(null);
                }
            };

            overlay.classList.add('active');
            document.addEventListener('keydown', handleKeydown);

            setTimeout(() => {
                if (inputField) {
                    inputField.focus();
                    inputField.select();
                }
            }, 100);
        });
    };

    // Global Safe Aliases & Overrides
    window.showConfirm = window.glassConfirm;
    window.showAlert = window.glassAlert;
    window.showPrompt = window.glassPrompt;

    // Redireciona window.alert para o Glass Dialog nativamente
    const nativeAlert = window.alert;
    window.alert = function (message) {
        if (typeof window.glassAlert === 'function') {
            window.glassAlert(message, 'M.C.P Personal OS', '✨');
        } else if (typeof nativeAlert === 'function') {
            nativeAlert(message);
        }
    };

})();

