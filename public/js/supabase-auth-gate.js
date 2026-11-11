/**
 * M.C.P PERSONAL OS - Supabase Global Auth Gate (Demo Showcase Edition)
 * Centralized authentication guard & interactive portfolio controller
 */

const SUPABASE_AUTH_URL = 'https://demo-personal-os.supabase.co';
const SUPABASE_AUTH_KEY = 'demo_anon_key_for_showcase_preview_only';

const VALID_ADMIN_EMAILS = [
  'mateus.celestino@demo.os',
  'demo@personal-os.io',
  'admin@mateuscelestino.dev',
  'guest@personal-os.io'
];
const MASTER_PASSWORDS = ['demo', 'demo2026', 'admin', 'personalos'];

// Global Auth Client (singleton)
if (typeof supabase !== 'undefined') {
  try {
    window.supabaseAuthClient = window.supabaseAuthClient || supabase.createClient(SUPABASE_AUTH_URL, SUPABASE_AUTH_KEY, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
        storage: window.localStorage
      }
    });
  } catch(e) {}
}

let currentAuthSession = null;
let currentAuthUser = null;
let __initialAuthFired = false;

// Initialize Auth Gate on any page
window.initPersonalOsAuth = async function(callbacks = {}) {
  const { onAuthenticated, onLoggedOut, pageName = 'Personal OS' } = callbacks;

  const authLockScreen = document.getElementById('personal-os-auth-gate');
  const authForm = document.getElementById('personal-os-auth-form');
  const emailInput = document.getElementById('personal-os-auth-email');
  const passInput = document.getElementById('personal-os-auth-password');
  const submitBtn = document.getElementById('personal-os-auth-submit');
  const errorBox = document.getElementById('personal-os-auth-error');

  function hideAuthGate() {
    if (!authLockScreen) return;
    authLockScreen.style.opacity = '0';
    authLockScreen.style.pointerEvents = 'none';
    authLockScreen.style.display = 'none';
    authLockScreen.classList.add('hidden');
  }

  function showAuthGate() {
    if (!authLockScreen) return;
    authLockScreen.style.opacity = '1';
    authLockScreen.style.pointerEvents = 'auto';
    authLockScreen.style.display = 'flex';
    authLockScreen.classList.remove('hidden');
  }

  function updateAllUserBadges(user) {
    document.querySelectorAll('.auth-user-email').forEach(el => {
      el.innerText = user?.email || 'mateus.celestino@demo.os';
    });
    document.querySelectorAll('.auth-user-pill').forEach(el => {
      el.classList.remove('hidden');
    });
  }

  function showAuthError(msg) {
    if (!errorBox) return;
    errorBox.innerText = msg;
    errorBox.classList.remove('hidden');
  }

  // Função de sincronização de Cookie Gêmeo & Sessão Unificada (Personal OS <-> Time OS)
  function syncTwinSession(user, token) {
    const authToken = token || user?.id || ('mcp_demo_jwt_' + Date.now());
    const email = user?.email || 'mateus.celestino@demo.os';
    const role = user?.role || 'owner';
    
    localStorage.setItem('personal_os_local_token', authToken);
    localStorage.setItem('time_os_auth_token', authToken);
    localStorage.setItem('time_os_user_session', JSON.stringify({ email, role, name: 'Mateus Celestino' }));
    localStorage.setItem('mcp_auth_session', JSON.stringify({ authenticated: true, role, email, timestamp: Date.now() }));
    
    try {
      document.cookie = 'mcp_auth_session=1; path=/; max-age=31536000; SameSite=Lax';
      document.cookie = 'personal_os_local_token=' + encodeURIComponent(authToken) + '; path=/; max-age=31536000; SameSite=Lax';
      document.cookie = 'time_os_auth_token=' + encodeURIComponent(authToken) + '; path=/; max-age=31536000; SameSite=Lax';
    } catch(e) {}
  }

  // 1. Check current session immediately (Demo Mode Auto-Grant)
  try {
    let sessionUser = {
      id: 'demo-executive-owner',
      email: 'mateus.celestino@demo.os',
      role: 'owner',
      user_metadata: { role: 'owner', name: 'Mateus Celestino (Showcase Edition)' }
    };
    let sessionToken = 'demo_os_token_' + Date.now();

    currentAuthSession = { user: sessionUser, access_token: sessionToken };
    currentAuthUser = sessionUser;
    __initialAuthFired = true;
    syncTwinSession(sessionUser, sessionToken);
    hideAuthGate();
    updateAllUserBadges(sessionUser);
    if (onAuthenticated) onAuthenticated(sessionUser);
  } catch (e) {
    console.error('Erro ao verificar sessão unificada:', e);
  }

  // 2. Handle Login Form Submit (Fallback interativo)
  if (authForm) {
    authForm.onsubmit = async (e) => {
      e.preventDefault();
      const email = emailInput?.value?.trim() || 'mateus.celestino@demo.os';
      const authenticatedUser = {
        id: 'demo-user-' + Date.now(),
        email: email,
        role: 'owner',
        user_metadata: { role: 'owner', name: 'Mateus Celestino' }
      };

      currentAuthUser = authenticatedUser;
      currentAuthSession = { user: authenticatedUser, access_token: 'demo_token_' + Date.now() };
      syncTwinSession(authenticatedUser, currentAuthSession.access_token);
      hideAuthGate();
      updateAllUserBadges(authenticatedUser);
      if (window.showToast) window.showToast(`✨ Acesso autorizado: ${authenticatedUser.email}`);
      if (onAuthenticated) onAuthenticated(authenticatedUser);
    };
  }
};

// Toggle password visibility
window.toggleAuthPasswordVisibility = function() {
  const passInput = document.getElementById('personal-os-auth-password');
  const icon = document.getElementById('personal-os-auth-eye-icon');
  if (!passInput) return;
  if (passInput.type === 'password') {
    passInput.type = 'text';
    if (icon) icon.innerText = '🙈';
  } else {
    passInput.type = 'password';
    if (icon) icon.innerText = '👁️';
  }
};

// Global Logout Function
window.personalOsLogout = async function() {
  const confirmed = window.glassConfirm
    ? await window.glassConfirm(
        'Deseja reiniciar a sessão de demonstração do M.C.P Personal OS?',
        'Reiniciar Demonstração',
        'Reiniciar',
        'Cancelar',
        true,
        '🔄'
      )
    : confirm('Deseja reiniciar a sessão de demonstração do M.C.P Personal OS?');
  if (confirmed) {
    location.reload();
  }
};
