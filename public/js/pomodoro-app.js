/**
 * XXX TIME — Motor Principal de Pomodoro Minimalista
 * Design: XXX OS Liquid Glassmorphism
 * Destaque: Neon Blood Sanguine Red (#ff1037)
 * Backgrounds: WebGL OGL Shaders & Wallpapers HD com Rotação por Categoria
 * Analytics & Sincronização: Time OS / Supabase Cloud & Local API
 * Core Timer: Pomatez
 * Integridade: Zero Mock Data (Métricas estritamente reais)
 */

// --- 1. CONFIGURAÇÃO SUPABASE & ENDPOINTS ---
const SUPABASE_CONFIG = {
  projectId: "jfxxmhthwoggffrvkflv",
  anonKey: "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImpmeHhtaHRod29nZ2ZmcnZrZmx2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODc3MDUyOTEsImV4cCI6MjEwMzI4MTI5MX0.yBYGdnsV2i-QOXytEtNhRsTBez1AfA67q9ct-4-ZrEw",
  get sessionsUrl() {
    return "https://" + this.projectId + ".supabase.co/rest/v1/time_os_sessions";
  },
  get historyUrl() {
    return "https://" + this.projectId + ".supabase.co/rest/v1/time_os_history";
  }
};

// --- 2. BANCO DE DADOS DE PLANOS DE FUNDO & SHADERS UNIVERSAIS ---
const VAST_WALLPAPERS_DB = [
  // 1. Shaders WebGL OGL Dinâmicos (13 Shaders)
  { id: "strands", type: "shader", category: "shaders", title: "Strands Neon", tag: "Shader OGL", thumb: "linear-gradient(135deg, #1e1b4b, #ff1037, #880012)" },
  { id: "softaurora", type: "shader", category: "shaders", title: "Soft Aurora Borealis", tag: "Shader OGL", thumb: "linear-gradient(135deg, #064e3b, #059669, #10b981)" },
  { id: "plasmawave", type: "shader", category: "shaders", title: "Plasma Wave", tag: "Shader OGL", thumb: "linear-gradient(135deg, #581c87, #a855f7, #ff1037)" },
  { id: "ferrofluid", type: "shader", category: "shaders", title: "Ferrofluid Magnético", tag: "Shader OGL", thumb: "linear-gradient(135deg, #111827, #374151, #e5e7eb)" },
  { id: "siderays", type: "shader", category: "shaders", title: "Side Rays Luminosos", tag: "Shader OGL", thumb: "linear-gradient(135deg, #78350f, #d97706, #ff1037)" },
  { id: "dither", type: "shader", category: "shaders", title: "Dither Wave Retro", tag: "Shader OGL", thumb: "linear-gradient(135deg, #831843, #db2777, #ff1037)" },
  { id: "lighttunnel", type: "shader", category: "shaders", title: "Light Tunnel Warp", tag: "Shader OGL", thumb: "linear-gradient(135deg, #4c1d95, #a855f7, #5227ff)" },
  { id: "darkveil", type: "shader", category: "shaders", title: "Dark Veil Mystic", tag: "Shader OGL", thumb: "linear-gradient(135deg, #0f172a, #1e293b, #475569)" },
  { id: "acidsquares", type: "shader", category: "shaders", title: "Acid Squares Grid", tag: "Shader OGL", thumb: "linear-gradient(135deg, #311042, #5227ff, #ff1037)" },
  { id: "webthreads", type: "shader", category: "shaders", title: "Web Threads Neural", tag: "Shader OGL", thumb: "linear-gradient(135deg, #3b0764, #5227ff, #ff9ffc)" },
  { id: "balatro", type: "shader", category: "shaders", title: "Balatro Hypnotic", tag: "Shader OGL", thumb: "linear-gradient(135deg, #7f1d1d, #de443b, #ff1037)" },
  { id: "moltenmetal", type: "shader", category: "shaders", title: "Molten Metal Chrome", tag: "Shader OGL", thumb: "linear-gradient(135deg, #1e1b4b, #5227ff, #ffffff)" },
  { id: "topography", type: "shader", category: "shaders", title: "Topography Contour", tag: "Shader OGL", thumb: "linear-gradient(135deg, #312e81, #5227ff, #ff9ffc)" },

  // 2. Gen X Soft Club Wallpapers HD (20 imagens)
  { id: "gnx_01", type: "static", category: "genx", title: "Soft Retro Nostalgia", tag: "Gen X", src: "assets/images/gallery/gen x soft club/05f22143098023a6978520a73a77637e.jpg" },
  { id: "gnx_02", type: "static", category: "genx", title: "Midnight Chill", tag: "Gen X", src: "assets/images/gallery/gen x soft club/142622f0d35efbffebc9b8a7995168dd.jpg" },
  { id: "gnx_03", type: "static", category: "genx", title: "Velvet Lounge", tag: "Gen X", src: "assets/images/gallery/gen x soft club/37c572ab0404204cb6f367c2a9f78a54.jpg" },
  { id: "gnx_04", type: "static", category: "genx", title: "Vapor Wave Dusk", tag: "Gen X", src: "assets/images/gallery/gen x soft club/3e3b1728d96b733b8f3bbf418021dd42.jpg" },
  { id: "gnx_05", type: "static", category: "genx", title: "Cassette Dreams", tag: "Gen X", src: "assets/images/gallery/gen x soft club/69b55c9be40f117fd5f076d27334d2cf.jpg" },
  { id: "gnx_06", type: "static", category: "genx", title: "Club Atmosphere", tag: "Gen X", src: "assets/images/gallery/gen x soft club/6e86f5937cb8ef54593b94952a59d5a1.jpg" },
  { id: "gnx_07", type: "static", category: "genx", title: "Neon Cyberpunk 90s", tag: "Gen X", src: "assets/images/gallery/gen x soft club/71acf6cb2cad2c986df87d817a06c33b.jpg" },
  { id: "gnx_08", type: "static", category: "genx", title: "Lo-Fi Sunset Walk", tag: "Gen X", src: "assets/images/gallery/gen x soft club/72859fb9ef398cd2a69777dc26d7d1d2.jpg" },
  { id: "gnx_09", type: "static", category: "genx", title: "City Light Reflections", tag: "Gen X", src: "assets/images/gallery/gen x soft club/73ba35d0e4557dacaeb9ffaab42cd635.jpg" },
  { id: "gnx_10", type: "static", category: "genx", title: "Moody Ambient", tag: "Gen X", src: "assets/images/gallery/gen x soft club/747c0ca848cc44632e4c94436348fe07.jpg" },
  { id: "gnx_11", type: "static", category: "genx", title: "Subtle Shadows", tag: "Gen X", src: "assets/images/gallery/gen x soft club/7b78f45b8a8f62b1cb9c7477d0b83f63.jpg" },
  { id: "gnx_12", type: "static", category: "genx", title: "Golden Haze", tag: "Gen X", src: "assets/images/gallery/gen x soft club/800c456fafbe63fae067663194fe47e9.jpg" },
  { id: "gnx_13", type: "static", category: "genx", title: "Urban Twilight", tag: "Gen X", src: "assets/images/gallery/gen x soft club/8f432d4e77f909f3abccb186f47ffff3.jpg" },
  { id: "gnx_14", type: "static", category: "genx", title: "Retro Discotheque", tag: "Gen X", src: "assets/images/gallery/gen x soft club/b1cd9d06a79b40e08ff9b945cd051aab.jpg" },
  { id: "gnx_15", type: "static", category: "genx", title: "Warm Nostalgic Room", tag: "Gen X", src: "assets/images/gallery/gen x soft club/b26f28a14964906204ec288ddf524432.jpg" },
  { id: "gnx_16", type: "static", category: "genx", title: "Analog Vibes", tag: "Gen X", src: "assets/images/gallery/gen x soft club/bbf00645951aa952366c3a446a07c990.jpg" },
  { id: "gnx_17", type: "static", category: "genx", title: "Neon Noir", tag: "Gen X", src: "assets/images/gallery/gen x soft club/c4058aae27b4310eb2c979cf9f6a817d.jpg" },
  { id: "gnx_18", type: "static", category: "genx", title: "Vintage Skyline", tag: "Gen X", src: "assets/images/gallery/gen x soft club/e82d7e3487abb787a3398210d02801c8.jpg" },
  { id: "gnx_19", type: "static", category: "genx", title: "Soft Cyber", tag: "Gen X", src: "assets/images/gallery/gen x soft club/f24ac251210bc82b90f9c33ce2438194.jpg" },
  { id: "gnx_20", type: "static", category: "genx", title: "Late Night Beats", tag: "Gen X", src: "assets/images/gallery/gen x soft club/f9f930471adfb299ae9ad2f9b319421b.jpg" },

  // 3. Flores & Natureza Wallpapers HD (8 imagens)
  { id: "flw_01", type: "static", category: "flowers", title: "Rosa Carmesim Profunda", tag: "Flores", src: "assets/images/gallery/flowers/59da96db902a205e9f90e651a4bcaa72.jpg" },
  { id: "flw_02", type: "static", category: "flowers", title: "Pétalas Rubras", tag: "Flores", src: "assets/images/gallery/flowers/797d233401eae1b36818abc988af10d4.jpg" },
  { id: "flw_03", type: "static", category: "flowers", title: "Jardim Celestial", tag: "Flores", src: "assets/images/gallery/flowers/7f15501be01e3225966e2ab7fe1b735a.jpg" },
  { id: "flw_04", type: "static", category: "flowers", title: "Flor de Lótus Noturna", tag: "Flores", src: "assets/images/gallery/flowers/8e7943acb3073ec2e112542af9fcc2c6.jpg" },
  { id: "flw_05", type: "static", category: "flowers", title: "Primavera Zen Suave", tag: "Flores", src: "assets/images/gallery/flowers/a7a3a081d906882bcf9068afc3894eee.jpg" },
  { id: "flw_06", type: "static", category: "flowers", title: "Orquídea Púrpura", tag: "Flores", src: "assets/images/gallery/flowers/b268e4783280047be44e09f1fca7dec6.jpg" },
  { id: "flw_07", type: "static", category: "flowers", title: "Florada Noturna", tag: "Flores", src: "assets/images/gallery/flowers/beb4c6ac11f067d61799142fe1a6e27d.jpg" },
  { id: "flw_08", type: "static", category: "flowers", title: "Botânica Minimal", tag: "Flores", src: "assets/images/gallery/flowers/e55174e6ec437489913f134318952c1e.jpg" },

  // 4. Minimal & Foco Wallpapers HD (10 imagens)
  { id: "foc_01", type: "static", category: "focus", title: "Katana da Mente", tag: "Foco", src: "assets/images/focus/0f8dd4fafc473e5191dabd993d09c87d.jpg" },
  { id: "foc_02", type: "static", category: "focus", title: "Minimal Monocromático", tag: "Foco", src: "assets/images/focus/1d72e3f39d87ac89a9086f995f50872a.webp" },
  { id: "foc_03", type: "static", category: "focus", title: "Arquitetura Linear", tag: "Foco", src: "assets/images/focus/2c2b84f961481917f64f98b41ee4c352.webp" },
  { id: "foc_04", type: "static", category: "focus", title: "Vazio Iluminado", tag: "Foco", src: "assets/images/focus/2fd5eac80af98d2586417f4d61e51cad.jpg" },
  { id: "foc_05", type: "static", category: "focus", title: "Consciência Pura", tag: "Foco", src: "assets/images/focus/3ccaee91ba77ef5fe1d9c6ffadc5b85c.jpg" },
  { id: "foc_06", type: "static", category: "focus", title: "Perspectiva Zen", tag: "Foco", src: "assets/images/focus/45272274c61f488fd78e6c5dac718aa4.webp" },
  { id: "foc_07", type: "static", category: "focus", title: "Lâmina Fiel", tag: "Foco", src: "assets/images/focus/66c44766cf68098caf6846b5da0071ca.jpg" },
  { id: "foc_08", type: "static", category: "focus", title: "Espaço Sóbrio", tag: "Foco", src: "assets/images/focus/a75da7a0b332859ceadf611cc99a4995.jpg" },
  { id: "foc_09", type: "static", category: "focus", title: "Silêncio Profundo", tag: "Foco", src: "assets/images/focus/a7e7d3db0eded5b79931cc190c57065f.webp" },
  { id: "foc_10", type: "static", category: "focus", title: "Geometria Pura", tag: "Foco", src: "assets/images/focus/e4eef837b7c66953b0105634ed172a2d.jpg" }
];

// --- 2.1. PRESETS CROMÁTICOS DO SISTEMA (8 PALETAS CURADAS) ---
const CHROMA_PRESETS = {
  sanguine: {
    name: "Neon Blood Sanguine",
    tag: "Padrão Oficial",
    primary: "#ff1037",
    primaryDark: "#880012",
    shortBreak: "#fb923c",
    shortBreakDark: "#ea580c",
    longBreak: "#34d399",
    longBreakDark: "#059669",
    glowPct: 45,
    glassSaturation: 180
  },
  violet: {
    name: "Cyber Violet",
    tag: "Sintético",
    primary: "#a855f7",
    primaryDark: "#581c87",
    shortBreak: "#38bdf8",
    shortBreakDark: "#0284c7",
    longBreak: "#34d399",
    longBreakDark: "#059669",
    glowPct: 50,
    glassSaturation: 180
  },
  cyan: {
    name: "Electric Cyan",
    tag: "Hiper-Foco",
    primary: "#06b6d4",
    primaryDark: "#0e7490",
    shortBreak: "#fb923c",
    shortBreakDark: "#ea580c",
    longBreak: "#10b981",
    longBreakDark: "#064e3b",
    glowPct: 45,
    glassSaturation: 180
  },
  emerald: {
    name: "Emerald Matrix",
    tag: "Zen & Calma",
    primary: "#10b981",
    primaryDark: "#064e3b",
    shortBreak: "#06b6d4",
    shortBreakDark: "#0e7490",
    longBreak: "#6366f1",
    longBreakDark: "#4338ca",
    glowPct: 45,
    glassSaturation: 175
  },
  amber: {
    name: "Solar Flare Amber",
    tag: "Energia Pura",
    primary: "#f59e0b",
    primaryDark: "#78350f",
    shortBreak: "#38bdf8",
    shortBreakDark: "#0284c7",
    longBreak: "#10b981",
    longBreakDark: "#064e3b",
    glowPct: 50,
    glassSaturation: 190
  },
  gold: {
    name: "Imperial Gold",
    tag: "Monarca",
    primary: "#eab308",
    primaryDark: "#713f12",
    shortBreak: "#f97316",
    shortBreakDark: "#c2410c",
    longBreak: "#14b8a6",
    longBreakDark: "#0f766e",
    glowPct: 45,
    glassSaturation: 185
  },
  sakura: {
    name: "Neon Sakura",
    tag: "Japonismo",
    primary: "#f43f5e",
    primaryDark: "#881337",
    shortBreak: "#a855f7",
    shortBreakDark: "#581c87",
    longBreak: "#06b6d4",
    longBreakDark: "#0e7490",
    glowPct: 48,
    glassSaturation: 180
  },
  titanium: {
    name: "Titanium Obsidian",
    tag: "Monocromo Minimal",
    primary: "#94a3b8",
    primaryDark: "#334155",
    shortBreak: "#38bdf8",
    shortBreakDark: "#0284c7",
    longBreak: "#10b981",
    longBreakDark: "#064e3b",
    glowPct: 35,
    glassSaturation: 160
  }
};

// --- 3. ESTADO GLOBAL DO APLICATIVO ---
const AppState = {
  config: {
    focus: 25,
    shortBreak: 5,
    longBreak: 15,
    interval: 4,
    soundEnabled: true,
    alarmSound: "ps2_startup",
    alarmVolume: 85,
    autoStart: false,
    dailyGoal: 8
  },
  bgSettings: {
    activeId: "strands",
    category: "shaders",
    blurPx: 0,
    dimPct: 20,
    dynamic: true,
    intervalSec: 10,
    timerId: null
  },
  chroma: {
    preset: "sanguine",
    primary: "#ff1037",
    primaryDark: "#880012",
    shortBreak: "#fb923c",
    shortBreakDark: "#ea580c",
    longBreak: "#34d399",
    longBreakDark: "#059669",
    glowPct: 45,
    glassSaturation: 180
  },
  mode: "focus",
  isRunning: false,
  timeLeft: 25 * 60,
  totalDuration: 25 * 60,
  currentRound: 1,
  timerId: null,
  lastTickTimestamp: null,

  activeSessionId: null,
  sessionStartTime: null,

  history: [],
  resumoViewType: "time",
  chartPeriod: "dias",

  isOnline: false,
  activeUserId: "user_" + (localStorage.getItem("xxx_user_id") || (() => {
    const id = Math.random().toString(36).substring(2, 9);
    localStorage.setItem("xxx_user_id", id);
    return id;
  })())
};

// --- 4. SINTETIZADOR & MOTOR DE ÁUDIO DO PERSONAL OS ---
class AudioSynthesizer {
  constructor() {
    this.ctx = null;
    this.alarmAudioBuffer = null;
    this.htmlAlarmAudio = null;
    this.currentSource = null;
    this.currentHtmlAudio = null;
    this.activeOscillators = [];
    this.isPlayingAlarm = false;
    this.initDone = false;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
    if (this.ctx && this.ctx.state === "suspended") {
      this.ctx.resume().catch(() => {});
    }
    if (!this.initDone) {
      this.initDone = true;
      this.loadAlarmBuffer();
      this.setupUnlockListeners();
    }
  }

  setupUnlockListeners() {
    const unlock = () => {
      if (this.ctx && this.ctx.state === "suspended") {
        this.ctx.resume().catch(() => {});
      }
      if (!this.alarmAudioBuffer) {
        this.loadAlarmBuffer();
      }
      if (!this.htmlAlarmAudio) {
        this.getHtmlAlarm();
      }
    };
    ['click', 'touchstart', 'keydown', 'mousedown'].forEach(evt => {
      document.addEventListener(evt, unlock, { once: false, passive: true });
    });
  }

  async loadAlarmBuffer() {
    try {
      const res = await fetch('assets/sounds/ps2_startup.mp3');
      if (res.ok) {
        const arrayBuf = await res.arrayBuffer();
        if (this.ctx) {
          this.ctx.decodeAudioData(arrayBuf, (decoded) => {
            this.alarmAudioBuffer = decoded;
          }, () => {});
        }
      }
    } catch (e) {
      // Fallback HTML5 Audio pronto
    }
  }

  getHtmlAlarm() {
    if (!this.htmlAlarmAudio && typeof Audio !== 'undefined') {
      try {
        this.htmlAlarmAudio = new Audio('assets/sounds/ps2_startup.mp3');
        this.htmlAlarmAudio.preload = 'auto';
      } catch (e) {}
    }
    return this.htmlAlarmAudio;
  }

  stopAlarm() {
    this.isPlayingAlarm = false;
    if (this.currentSource) {
      try {
        this.currentSource.stop();
        this.currentSource.disconnect();
      } catch (e) {}
      this.currentSource = null;
    }
    if (this.currentHtmlAudio) {
      try {
        this.currentHtmlAudio.pause();
        this.currentHtmlAudio.currentTime = 0;
      } catch (e) {}
      this.currentHtmlAudio = null;
    }
    if (this.activeOscillators && this.activeOscillators.length) {
      this.activeOscillators.forEach(osc => {
        try { osc.stop(); osc.disconnect(); } catch (e) {}
      });
      this.activeOscillators = [];
    }
    const btnPreview = document.getElementById("btn-preview-sound");
    if (btnPreview) btnPreview.textContent = "▶ Testar";
  }

  playAlarm(soundType = null) {
    if (!AppState.config.soundEnabled) return;
    this.stopAlarm();
    this.init();

    const type = soundType || AppState.config.alarmSound || 'ps2_startup';
    const volumeLevel = (AppState.config.alarmVolume !== undefined ? AppState.config.alarmVolume : 85) / 100;
    this.isPlayingAlarm = true;

    try {
      if (type === 'ps2_startup') {
        if (this.ctx && this.alarmAudioBuffer) {
          const comp = this.ctx.createDynamicsCompressor();
          comp.threshold.setValueAtTime(-12, this.ctx.currentTime);
          comp.knee.setValueAtTime(30, this.ctx.currentTime);
          comp.ratio.setValueAtTime(12, this.ctx.currentTime);
          comp.attack.setValueAtTime(0.003, this.ctx.currentTime);
          comp.release.setValueAtTime(0.25, this.ctx.currentTime);

          const gainNode = this.ctx.createGain();
          gainNode.gain.setValueAtTime(volumeLevel * 1.8, this.ctx.currentTime);

          const src = this.ctx.createBufferSource();
          src.buffer = this.alarmAudioBuffer;
          src.connect(gainNode);
          gainNode.connect(comp);
          comp.connect(this.ctx.destination);
          src.onended = () => {
            if (this.currentSource === src) {
              this.currentSource = null;
              this.isPlayingAlarm = false;
              const btn = document.getElementById("btn-preview-sound");
              if (btn) btn.textContent = "▶ Testar";
            }
          };
          src.start(0);
          this.currentSource = src;
        } else {
          const htmlAudio = this.getHtmlAlarm();
          if (htmlAudio) {
            htmlAudio.volume = Math.min(1.0, Math.max(0.1, volumeLevel));
            htmlAudio.currentTime = 0;
            const p = htmlAudio.play();
            if (p !== undefined) p.catch(() => {});
            this.currentHtmlAudio = htmlAudio;
            htmlAudio.onended = () => {
              this.isPlayingAlarm = false;
              const btn = document.getElementById("btn-preview-sound");
              if (btn) btn.textContent = "▶ Testar";
            };
          }
        }
      } else if (type === 'sino_tibetano') {
        this.playTibetanBell(volumeLevel);
      } else if (type === 'gongo_zen') {
        this.playZenGong(volumeLevel);
      } else {
        this.playSolfeggioChime(volumeLevel);
      }
    } catch (e) {
      console.warn('Erro ao tocar som de alarme Personal OS:', e);
    }
  }

  playTibetanBell(vol) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [528, 1056, 1584, 2112, 2640];
    const gains = [0.35, 0.20, 0.12, 0.08, 0.04];
    this.activeOscillators = [];

    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(f + (i * 1.5), now);
      gain.gain.setValueAtTime(gains[i] * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 4.5);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 4.5);
      this.activeOscillators.push(osc);
    });

    setTimeout(() => {
      this.isPlayingAlarm = false;
      const btn = document.getElementById("btn-preview-sound");
      if (btn) btn.textContent = "▶ Testar";
    }, 4500);
  }

  playZenGong(vol) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const freqs = [108, 110, 216, 324, 432];
    const gains = [0.45, 0.35, 0.25, 0.15, 0.08];
    this.activeOscillators = [];

    freqs.forEach((f, i) => {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      osc.type = i === 0 ? "triangle" : "sine";
      osc.frequency.setValueAtTime(f, now);
      gain.gain.setValueAtTime(gains[i] * vol, now);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 5.0);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 5.0);
      this.activeOscillators.push(osc);
    });

    setTimeout(() => {
      this.isPlayingAlarm = false;
      const btn = document.getElementById("btn-preview-sound");
      if (btn) btn.textContent = "▶ Testar";
    }, 5000);
  }

  playSolfeggioChime(vol) {
    if (!this.ctx) return;
    const now = this.ctx.currentTime;
    const osc = this.ctx.createOscillator();
    const gain = this.ctx.createGain();
    osc.type = "sine";
    osc.frequency.setValueAtTime(528, now);
    osc.frequency.exponentialRampToValueAtTime(880, now + 0.6);
    gain.gain.setValueAtTime(vol * 0.35, now);
    gain.gain.exponentialRampToValueAtTime(0.0001, now + 2.5);
    osc.connect(gain);
    gain.connect(this.ctx.destination);
    osc.start(now);
    osc.stop(now + 2.5);
    this.activeOscillators = [osc];

    setTimeout(() => {
      this.isPlayingAlarm = false;
      const btn = document.getElementById("btn-preview-sound");
      if (btn) btn.textContent = "▶ Testar";
    }, 2500);
  }

  playChime(type = "complete") {
    if (!AppState.config.soundEnabled) return;
    try {
      this.init();
      if (!this.ctx) return;
      const now = this.ctx.currentTime;

      if (type === "complete") {
        this.playAlarm();
      } else {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.type = "triangle";
        osc.frequency.setValueAtTime(320, now);
        gain.gain.setValueAtTime(0.05, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.08);
        osc.start(now);
        osc.stop(now + 0.08);
      }
    } catch (e) {}
  }
}
const soundEngine = new AudioSynthesizer();

// --- 5. MOTOR DE PLANOS DE FUNDO & ROTAÇÃO POR CATEGORIA ---
function getCategoryPool(category) {
  if (category === "shaders") return VAST_WALLPAPERS_DB.filter(w => w.type === "shader");
  if (category === "super_random") return VAST_WALLPAPERS_DB;
  return VAST_WALLPAPERS_DB.filter(w => w.category === category);
}

function getCategoryDisplayName(cat) {
  const map = {
    shaders: "Shaders WebGL",
    super_random: "Super Aleatório",
    focus: "Minimal & Foco",
    genx: "Gen X Soft Club",
    flowers: "Flores & Natureza"
  };
  return map[cat] || cat;
}

function initBackgroundSystem() {
  const savedBg = localStorage.getItem("xxx_bg_settings");
  if (savedBg) {
    try { AppState.bgSettings = { ...AppState.bgSettings, ...JSON.parse(savedBg) }; } catch (e) {}
  }

  applyBackgroundEffects();
  renderBgGallery(AppState.bgSettings.category || "shaders");

  const initialItem = VAST_WALLPAPERS_DB.find(w => w.id === AppState.bgSettings.activeId) || VAST_WALLPAPERS_DB[0];
  applyBackground(initialItem, false);

  const sliderBlur = document.getElementById("slider-bg-blur");
  const sliderDim = document.getElementById("slider-bg-dim");
  const sliderInterval = document.getElementById("slider-bg-interval");
  const toggleDynamic = document.getElementById("cfg-dynamic-bg-toggle");

  if (sliderBlur) {
    sliderBlur.value = AppState.bgSettings.blurPx;
    sliderBlur.addEventListener("input", (e) => {
      AppState.bgSettings.blurPx = parseInt(e.target.value);
      const valEl = document.getElementById("val-bg-blur");
      if (valEl) valEl.textContent = AppState.bgSettings.blurPx + "px";
      applyBackgroundEffects();
      saveBgSettings();
    });
  }

  if (sliderDim) {
    sliderDim.value = AppState.bgSettings.dimPct;
    sliderDim.addEventListener("input", (e) => {
      AppState.bgSettings.dimPct = parseInt(e.target.value);
      const valEl = document.getElementById("val-bg-dim");
      if (valEl) valEl.textContent = AppState.bgSettings.dimPct + "%";
      applyBackgroundEffects();
      saveBgSettings();
    });
  }

  if (sliderInterval) {
    sliderInterval.value = AppState.bgSettings.intervalSec;
    sliderInterval.addEventListener("input", (e) => {
      AppState.bgSettings.intervalSec = parseInt(e.target.value);
      const valEl = document.getElementById("val-bg-interval");
      if (valEl) valEl.textContent = AppState.bgSettings.intervalSec + "s";
      restartDynamicBgTimer();
      saveBgSettings();
    });
  }

  if (toggleDynamic) {
    toggleDynamic.checked = AppState.bgSettings.dynamic;
    toggleDynamic.addEventListener("change", (e) => {
      AppState.bgSettings.dynamic = e.target.checked;
      restartDynamicBgTimer();
      saveBgSettings();
      showToast(AppState.bgSettings.dynamic ? "Alternância de fundo ativada" : "Alternância de fundo pausada");
    });
  }

  if (AppState.bgSettings.dynamic) {
    restartDynamicBgTimer();
  }

  // Listener para botões de categorias com ativação imediata e rotação dinâmica
  document.querySelectorAll(".bg-cat-btn").forEach(btn => {
    btn.addEventListener("click", () => {
      const cat = btn.dataset.cat;
      selectBackgroundCategory(cat, btn);
    });
  });
}

function selectBackgroundCategory(cat, btnElement) {
  document.querySelectorAll(".bg-cat-btn").forEach(b => b.classList.remove("active"));
  if (btnElement) btnElement.classList.add("active");
  else {
    const foundBtn = document.querySelector(".bg-cat-btn[data-cat=\"" + cat + "\"]");
    if (foundBtn) foundBtn.classList.add("active");
  }

  AppState.bgSettings.category = cat;

  const pool = getCategoryPool(cat);
  if (pool.length > 0) {
    const isCurrentInPool = pool.some(w => w.id === AppState.bgSettings.activeId);
    if (!isCurrentInPool) {
      applyBackground(pool[0], false);
    }
  }

  // Ativa alternância dinâmica
  AppState.bgSettings.dynamic = true;
  const toggleDynamic = document.getElementById("cfg-dynamic-bg-toggle");
  if (toggleDynamic) toggleDynamic.checked = true;

  restartDynamicBgTimer();
  renderBgGallery(cat);
  saveBgSettings();
  showToast("Grupo selecionado: " + getCategoryDisplayName(cat) + " (Rotação a cada " + AppState.bgSettings.intervalSec + "s)");
}

function applyBackground(item, notify = true) {
  if (!item) return;
  AppState.bgSettings.activeId = item.id;

  const frameA = document.getElementById("bg-frame-a");
  const frameB = document.getElementById("bg-frame-b");
  const webglCtn = document.getElementById("bg-webgl-container");
  const groupCustom = document.getElementById("bg-group-custom");

  if (item.type === "shader") {
    if (groupCustom) groupCustom.style.display = "none";
    if (frameA) frameA.classList.remove("on");
    if (frameB) frameB.classList.remove("on");

    if (webglCtn) {
      webglCtn.style.display = "block";
      if (typeof window.renderWebGLBackground === "function") {
        window.renderWebGLBackground(item.id);
      } else {
        window.addEventListener("time_os_webgl_ready", () => {
          window.renderWebGLBackground(item.id);
        }, { once: true });
      }
    }
  } else {
    if (typeof window.stopWebGLBackground === "function") {
      window.stopWebGLBackground();
    }
    if (webglCtn) {
      webglCtn.style.display = "none";
      webglCtn.innerHTML = "";
    }
    if (groupCustom) groupCustom.style.display = "block";

    const currentOn = frameA && frameA.classList.contains("on") ? "a" : "b";
    const targetFrame = currentOn === "a" ? frameB : frameA;
    const oldFrame = currentOn === "a" ? frameA : frameB;

    if (targetFrame && oldFrame) {
      targetFrame.style.backgroundImage = "url(\"" + encodeURI(item.src) + "\")";
      targetFrame.classList.add("on");
      oldFrame.classList.remove("on");
    }
  }

  document.querySelectorAll(".bg-gallery-card").forEach(card => {
    card.classList.toggle("active", card.dataset.id === item.id);
  });

  saveBgSettings();
  if (notify) showToast("Fundo alterado: " + item.title);
}

function applyBackgroundEffects() {
  const vp = document.getElementById("bg-viewport");
  const veil = document.getElementById("ambient-veil");

  if (vp) {
    vp.style.filter = "blur(" + AppState.bgSettings.blurPx + "px)";
  }
  if (veil) {
    const dimAlpha = AppState.bgSettings.dimPct / 100;
    veil.style.background = "rgba(5, 7, 12, " + dimAlpha + ")";
  }
}

function renderBgGallery(category) {
  const container = document.getElementById("bg-gallery-grid-vast");
  if (!container) return;

  const items = getCategoryPool(category);

  container.innerHTML = items.map(item => {
    const isShader = item.type === "shader";
    const bgStyle = isShader ? "background: " + item.thumb + ";" : "background-image: url(\'" + encodeURI(item.src) + "\');";
    const isActive = item.id === AppState.bgSettings.activeId;

    return '<div class="bg-gallery-card ' + (isActive ? 'active' : '') + '" data-id="' + item.id + '" style="' + bgStyle + '">' +
      '<span class="bg-card-badge">' + item.tag + '</span>' +
      '<span class="bg-card-title">' + item.title + '</span>' +
      '</div>';
  }).join("");

  container.querySelectorAll(".bg-gallery-card").forEach(card => {
    card.addEventListener("click", () => {
      const bgId = card.dataset.id;
      const found = VAST_WALLPAPERS_DB.find(w => w.id === bgId);
      if (found) {
        applyBackground(found);
      }
    });
  });
}

function restartDynamicBgTimer() {
  if (AppState.bgSettings.timerId) {
    clearInterval(AppState.bgSettings.timerId);
    AppState.bgSettings.timerId = null;
  }
  if (!AppState.bgSettings.dynamic) return;

  const ms = Math.max(5, AppState.bgSettings.intervalSec || 10) * 1000;
  AppState.bgSettings.timerId = setInterval(() => {
    const pool = getCategoryPool(AppState.bgSettings.category);
    if (pool.length > 1) {
      const currentIdx = pool.findIndex(w => w.id === AppState.bgSettings.activeId);
      const nextIdx = (currentIdx + 1) % pool.length;
      applyBackground(pool[nextIdx], false);
    }
  }, ms);
}

function saveBgSettings() {
  const toSave = {
    activeId: AppState.bgSettings.activeId,
    category: AppState.bgSettings.category,
    blurPx: AppState.bgSettings.blurPx,
    dimPct: AppState.bgSettings.dimPct,
    dynamic: AppState.bgSettings.dynamic,
    intervalSec: AppState.bgSettings.intervalSec
  };
  localStorage.setItem("xxx_bg_settings", JSON.stringify(toSave));
}

// --- 5.1. CENTRAL CROMÁTICA DO SISTEMA (CONTROLE TOTAL E ELEGANTE DE CORES) ---
function hexToRgb(hex) {
  if (!hex) return null;
  let cleanHex = hex.replace("#", "").trim();
  if (cleanHex.length === 3) {
    cleanHex = cleanHex.split("").map(c => c + c).join("");
  }
  if (cleanHex.length !== 6) return null;
  const num = parseInt(cleanHex, 16);
  if (isNaN(num)) return null;
  return {
    r: (num >> 16) & 255,
    g: (num >> 8) & 255,
    b: num & 255
  };
}

function darkenHex(hex, factor = 0.5) {
  const rgb = hexToRgb(hex);
  if (!rgb) return "#000000";
  const r = Math.max(0, Math.floor(rgb.r * factor));
  const g = Math.max(0, Math.floor(rgb.g * factor));
  const b = Math.max(0, Math.floor(rgb.b * factor));
  return "#" + [r, g, b].map(x => x.toString(16).padStart(2, "0")).join("");
}

function updateSvgGradient(id, colorStart, colorEnd) {
  const grad = document.getElementById(id);
  if (!grad) return;
  const stops = grad.querySelectorAll("stop");
  if (stops.length >= 2) {
    stops[0].setAttribute("stop-color", colorStart);
    stops[1].setAttribute("stop-color", colorEnd);
  }
}

function applyModeChromaAccent(mode) {
  const root = document.documentElement;
  const chroma = AppState.chroma || CHROMA_PRESETS.sanguine;
  const ring = document.getElementById("ring-progress");
  const glowAlpha = (chroma.glowPct || 45) / 100;

  let activeColor = chroma.primary;
  let gradientId = "url(#ring-gradient-focus)";

  if (mode === "shortBreak") {
    activeColor = chroma.shortBreak;
    gradientId = "url(#ring-gradient-break)";
  } else if (mode === "longBreak") {
    activeColor = chroma.longBreak;
    gradientId = "url(#ring-gradient-long)";
  }

  const rgb = hexToRgb(activeColor);
  const glow = rgb ? ("rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + glowAlpha + ")") : ("rgba(255, 16, 55, " + glowAlpha + ")");

  root.style.setProperty("--current-accent", activeColor);
  root.style.setProperty("--current-glow", glow);

  if (ring) {
    ring.style.stroke = gradientId;
  }
}

function applyChromaTheme(themeUpdates, save = true) {
  if (!AppState.chroma) {
    AppState.chroma = { ...CHROMA_PRESETS.sanguine };
  }
  AppState.chroma = { ...AppState.chroma, ...themeUpdates };

  const chroma = AppState.chroma;
  const root = document.documentElement;
  const glowAlpha = (chroma.glowPct || 45) / 100;

  const primRgb = hexToRgb(chroma.primary);
  const primGlow = primRgb ? ("rgba(" + primRgb.r + ", " + primRgb.g + ", " + primRgb.b + ", " + glowAlpha + ")") : ("rgba(255, 16, 55, " + glowAlpha + ")");
  const primSoft = primRgb ? ("rgba(" + primRgb.r + ", " + primRgb.g + ", " + primRgb.b + ", 0.15)") : "rgba(255, 16, 55, 0.15)";
  const primDark = chroma.primaryDark || darkenHex(chroma.primary, 0.5);

  const shortDark = chroma.shortBreakDark || darkenHex(chroma.shortBreak, 0.6);
  const longDark = chroma.longBreakDark || darkenHex(chroma.longBreak, 0.6);

  // Variáveis CSS Principais
  root.style.setProperty("--accent-blood", chroma.primary);
  root.style.setProperty("--accent-blood-glow", primGlow);
  root.style.setProperty("--accent-blood-soft", primSoft);
  root.style.setProperty("--accent-blood-dark", primDark);
  root.style.setProperty("--accent-break", chroma.shortBreak);
  root.style.setProperty("--accent-long", chroma.longBreak);

  // Atualizar accent do modo ativo
  applyModeChromaAccent(AppState.mode);

  // Atualizar Gradientes SVG dos anéis do timer
  updateSvgGradient("ring-gradient-focus", chroma.primary, primDark);
  updateSvgGradient("ring-gradient-break", chroma.shortBreak, shortDark);
  updateSvgGradient("ring-gradient-long", chroma.longBreak, longDark);

  // Atualizar inputs e sliders da UI
  syncChromaInputsUI();

  // Atualizar palco de pré-visualização ao vivo
  updateChromaLivePreview();

  // Atualizar cards de preset na grade
  updateActivePresetCardUI();

  if (save) {
    saveChromaSettings();
  }
}

function syncChromaInputsUI() {
  const chroma = AppState.chroma;
  if (!chroma) return;

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  const setBg = (id, color) => {
    const el = document.getElementById(id);
    if (el) el.style.background = color;
  };
  const setText = (id, text) => {
    const el = document.getElementById(id);
    if (el) el.textContent = text;
  };

  setVal("picker-color-primary", chroma.primary);
  setVal("input-hex-primary", chroma.primary.toUpperCase());
  setBg("dot-color-primary", chroma.primary);

  setVal("picker-color-short", chroma.shortBreak);
  setVal("input-hex-short", chroma.shortBreak.toUpperCase());
  setBg("dot-color-short", chroma.shortBreak);

  setVal("picker-color-long", chroma.longBreak);
  setVal("input-hex-long", chroma.longBreak.toUpperCase());
  setBg("dot-color-long", chroma.longBreak);

  setVal("slider-glow-intensity", chroma.glowPct || 45);
  setText("val-glow-intensity", (chroma.glowPct || 45) + "%");

  setVal("slider-glass-saturation", chroma.glassSaturation || 180);
  setText("val-glass-saturation", (chroma.glassSaturation || 180) + "%");

  const activePreset = CHROMA_PRESETS[chroma.preset];
  setText("active-palette-name", activePreset ? activePreset.name : "Customizada");
}

function updateChromaLivePreview() {
  const chroma = AppState.chroma;
  if (!chroma) return;

  const miniDial = document.getElementById("preview-dial-circle");
  if (miniDial) {
    const rgb = hexToRgb(chroma.primary);
    const glow = rgb ? ("rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", " + ((chroma.glowPct || 45) / 100) + ")") : "rgba(255, 16, 55, 0.45)";
    miniDial.style.borderColor = chroma.primary;
    miniDial.style.boxShadow = "0 0 24px " + glow + ", inset 0 0 15px " + glow;
  }

  const samplePrimary = document.getElementById("preview-sample-primary");
  if (samplePrimary) {
    samplePrimary.style.background = chroma.primary;
    const rgb = hexToRgb(chroma.primary);
    const glow = rgb ? ("rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 0.35)") : "rgba(255, 16, 55, 0.35)";
    samplePrimary.style.boxShadow = "0 4px 14px " + glow;
  }

  const sampleBreak = document.getElementById("preview-sample-break");
  if (sampleBreak) {
    sampleBreak.style.borderColor = chroma.shortBreak;
    sampleBreak.style.color = chroma.shortBreak;
    const rgb = hexToRgb(chroma.shortBreak);
    sampleBreak.style.background = rgb ? ("rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 0.15)") : "rgba(251, 146, 60, 0.15)";
  }

  const sampleChip = document.getElementById("preview-sample-chip");
  if (sampleChip) {
    sampleChip.style.color = chroma.primary;
    sampleChip.style.borderColor = chroma.primary;
    const rgb = hexToRgb(chroma.primary);
    sampleChip.style.background = rgb ? ("rgba(" + rgb.r + ", " + rgb.g + ", " + rgb.b + ", 0.12)") : "rgba(255, 16, 55, 0.12)";
  }
}

function renderChromaPresetsGrid() {
  const container = document.getElementById("palette-presets-container");
  if (!container) return;

  container.innerHTML = Object.entries(CHROMA_PRESETS).map(([key, preset]) => {
    const isActive = AppState.chroma && AppState.chroma.preset === key;
    return '<div class="palette-preset-card ' + (isActive ? 'active' : '') + '" data-preset="' + key + '" title="' + preset.name + ' — ' + preset.tag + '">' +
      '<div class="preset-card-swatch" style="background: ' + preset.primary + '; box-shadow: 0 0 10px ' + preset.primary + '80;"></div>' +
      '<div class="preset-card-info">' +
        '<span class="preset-card-name">' + preset.name + '</span>' +
        '<span class="preset-card-hex">' + preset.primary + '</span>' +
      '</div>' +
    '</div>';
  }).join("");

  container.querySelectorAll(".palette-preset-card").forEach(card => {
    card.addEventListener("click", () => {
      const presetKey = card.dataset.preset;
      setChromaPreset(presetKey);
    });
  });
}

function updateActivePresetCardUI() {
  const container = document.getElementById("palette-presets-container");
  if (!container || !AppState.chroma) return;
  container.querySelectorAll(".palette-preset-card").forEach(card => {
    card.classList.toggle("active", card.dataset.preset === AppState.chroma.preset);
  });
}

function setChromaPreset(presetKey) {
  const preset = CHROMA_PRESETS[presetKey];
  if (!preset) return;

  applyChromaTheme({
    preset: presetKey,
    primary: preset.primary,
    primaryDark: preset.primaryDark,
    shortBreak: preset.shortBreak,
    shortBreakDark: preset.shortBreakDark,
    longBreak: preset.longBreak,
    longBreakDark: preset.longBreakDark,
    glowPct: preset.glowPct,
    glassSaturation: preset.glassSaturation
  }, true);

  soundEngine.playChime("tick");
  showToast("Paleta ativada: " + preset.name);
}

function resetChromaToDefault() {
  setChromaPreset("sanguine");
  showToast("Vermelho Sanguíneo Neon Restaurado!");
}

function loadStoredChromaSettings() {
  AppState.chroma = { ...CHROMA_PRESETS.sanguine };
  const stored = localStorage.getItem("xxx_chroma_theme");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      AppState.chroma = { ...AppState.chroma, ...parsed };
    } catch (e) {}
  }
}

function saveChromaSettings() {
  if (AppState.chroma) {
    localStorage.setItem("xxx_chroma_theme", JSON.stringify(AppState.chroma));
  }
}

function setupChromaEventListeners() {
  // Switcher de Abas do Modal de Fundos & Central Cromática
  const btnGalleryTab = document.getElementById("tab-btn-bg-gallery");
  const btnChromaTab = document.getElementById("tab-btn-bg-chroma");
  const paneGallery = document.getElementById("pane-bg-gallery");
  const paneChroma = document.getElementById("pane-bg-chroma");

  btnGalleryTab?.addEventListener("click", () => {
    btnGalleryTab.classList.add("active");
    btnChromaTab?.classList.remove("active");
    paneGallery?.classList.add("active");
    paneChroma?.classList.remove("active");
  });

  btnChromaTab?.addEventListener("click", () => {
    btnChromaTab.classList.add("active");
    btnGalleryTab?.classList.remove("active");
    paneChroma?.classList.add("active");
    paneGallery?.classList.remove("active");
    syncChromaInputsUI();
    updateChromaLivePreview();
  });

  // Color Pickers & Hex Inputs
  const handleColorChange = (key, hex) => {
    if (!hex || !/^#[0-9A-Fa-f]{6}$/.test(hex)) return;
    const updates = { preset: "custom" };
    updates[key] = hex;
    if (key === "primary") updates.primaryDark = darkenHex(hex, 0.5);
    if (key === "shortBreak") updates.shortBreakDark = darkenHex(hex, 0.6);
    if (key === "longBreak") updates.longBreakDark = darkenHex(hex, 0.6);
    applyChromaTheme(updates, true);
  };

  const wireColorPair = (pickerId, hexInputId, key) => {
    const picker = document.getElementById(pickerId);
    const hexInput = document.getElementById(hexInputId);

    picker?.addEventListener("input", (e) => {
      const val = e.target.value;
      if (hexInput) hexInput.value = val.toUpperCase();
      handleColorChange(key, val);
    });

    hexInput?.addEventListener("input", (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith("#")) val = "#" + val;
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        if (picker) picker.value = val;
        handleColorChange(key, val);
      }
    });

    hexInput?.addEventListener("blur", (e) => {
      let val = e.target.value.trim();
      if (!val.startsWith("#")) val = "#" + val;
      if (/^#[0-9A-Fa-f]{6}$/.test(val)) {
        e.target.value = val.toUpperCase();
      } else {
        if (AppState.chroma && AppState.chroma[key]) {
          e.target.value = AppState.chroma[key].toUpperCase();
        }
      }
    });
  };

  wireColorPair("picker-color-primary", "input-hex-primary", "primary");
  wireColorPair("picker-color-short", "input-hex-short", "shortBreak");
  wireColorPair("picker-color-long", "input-hex-long", "longBreak");

  // Sliders: Glow & Glass Saturation
  const sliderGlow = document.getElementById("slider-glow-intensity");
  const valGlow = document.getElementById("val-glow-intensity");
  sliderGlow?.addEventListener("input", (e) => {
    const val = parseInt(e.target.value) || 45;
    if (valGlow) valGlow.textContent = val + "%";
    applyChromaTheme({ glowPct: val }, true);
  });

  const sliderSat = document.getElementById("slider-glass-saturation");
  const valSat = document.getElementById("val-glass-saturation");
  sliderSat?.addEventListener("input", (e) => {
    const val = parseInt(e.target.value) || 180;
    if (valSat) valSat.textContent = val + "%";
    applyChromaTheme({ glassSaturation: val }, true);
  });

  // Botão Restaurar Vermelho Sanguíneo Oficial
  document.getElementById("btn-reset-chroma")?.addEventListener("click", () => {
    resetChromaToDefault();
  });

  // Botão Salvar Paleta
  document.getElementById("btn-apply-chroma")?.addEventListener("click", () => {
    saveChromaSettings();
    showToast("Paleta cromática salva com sucesso!");
  });
}

function initChromaSystem() {
  loadStoredChromaSettings();
  renderChromaPresetsGrid();
  applyChromaTheme(AppState.chroma, false);
  setupChromaEventListeners();
}

// --- 6. MOTOR DO CRONÔMETRO (POMATEZ CORE) ---
function initTimer() {
  loadStoredSettings();
  loadStoredHistory();
  initBackgroundSystem();
  initChromaSystem();
  setupEventListeners();
  initCloudSync();

  setMode("focus", false);
  updateControlsUI();
  updateTimerUI();
  updateTopClock();
  setInterval(updateTopClock, 1000);
}

function setMode(newMode, notify = true) {
  AppState.mode = newMode;
  stopTimer();

  let minutes = AppState.config.focus;
  if (newMode === "shortBreak") minutes = AppState.config.shortBreak;
  if (newMode === "longBreak") minutes = AppState.config.longBreak;

  AppState.timeLeft = minutes * 60;
  AppState.totalDuration = minutes * 60;

  document.querySelectorAll(".mode-pill").forEach(pill => {
    pill.classList.toggle("active", pill.dataset.mode === newMode);
  });

  const statusMap = {
    focus: "Pronto para focar",
    shortBreak: "Momento de respirar e relaxar",
    longBreak: "Pausa longa restauradora"
  };
  const statusEl = document.getElementById("session-status-text");
  if (statusEl) statusEl.textContent = statusMap[newMode];

  applyModeChromaAccent(newMode);

  updateTimerUI();
  updateControlsUI();
  broadcastActiveSession("ready");

  if (notify) {
    soundEngine.playChime("tick");
  }
}

function togglePlayPause() {
  soundEngine.init();
  soundEngine.stopAlarm();
  if (AppState.isRunning) {
    pauseTimer();
  } else {
    startTimer();
  }
}

function startTimer() {
  if (AppState.isRunning) return;
  soundEngine.stopAlarm();
  AppState.isRunning = true;
  AppState.lastTickTimestamp = Date.now();
  AppState.sessionStartTime = Date.now();
  AppState.activeSessionId = "sess_" + Date.now() + "_" + Math.random().toString(36).substr(2, 5);

  AppState.timerId = setInterval(tick, 1000);
  updateControlsUI();
  broadcastActiveSession("running");
  soundEngine.playChime("tick");

  const statusEl = document.getElementById("session-status-text");
  if (statusEl) {
    statusEl.textContent = AppState.mode === "focus" ? "Foco Total em Andamento" : "Pausa Ativa";
  }
}

function pauseTimer() {
  if (!AppState.isRunning) return;
  soundEngine.stopAlarm();
  AppState.isRunning = false;
  clearInterval(AppState.timerId);
  AppState.timerId = null;

  updateControlsUI();
  broadcastActiveSession("paused");

  const statusEl = document.getElementById("session-status-text");
  if (statusEl) statusEl.textContent = "Pausado";
}

function stopTimer() {
  AppState.isRunning = false;
  if (AppState.timerId) {
    clearInterval(AppState.timerId);
    AppState.timerId = null;
  }
  updateControlsUI();
}

function resetCurrentTimer() {
  stopTimer();
  soundEngine.stopAlarm();
  let minutes = AppState.config.focus;
  if (AppState.mode === "shortBreak") minutes = AppState.config.shortBreak;
  if (AppState.mode === "longBreak") minutes = AppState.config.longBreak;
  AppState.timeLeft = minutes * 60;
  updateTimerUI();
  showToast("Timer reiniciado.");
}

function skipPhase() {
  soundEngine.stopAlarm();
  soundEngine.playChime("tick");
  handlePhaseCompletion(false);
}

// Interrupção Ativa da Sessão de Foco por Break
function triggerBreakSession() {
  soundEngine.init();
  soundEngine.playChime("complete");

  // Se o timer estiver rodando em modo foco, calcula os segundos e anota
  if (AppState.isRunning && AppState.mode === "focus") {
    stopTimer();
    const elapsedMs = (AppState.totalDuration - AppState.timeLeft) * 1000;
    recordSessionHistory("focus", elapsedMs, false, {
      action: "interrupted_by_break",
      status: "Interrompido por Break",
      notes: "Sessão de foco interrompida manualmente pelo botão Break"
    });
    showToast("Sessão interrompida por Break. Registrado e sincronizado!");
  } else if (AppState.mode === "focus" && AppState.timeLeft < AppState.totalDuration) {
    // Se estiver pausado no meio do foco
    const elapsedMs = (AppState.totalDuration - AppState.timeLeft) * 1000;
    recordSessionHistory("focus", elapsedMs, false, {
      action: "interrupted_by_break",
      status: "Interrompido por Break",
      notes: "Sessão pausada finalizada pelo botão Break"
    });
    showToast("Tempo de foco registrado e sincronizado!");
  }

  // Transiciona para modo Pausa Curta
  setMode("shortBreak", true);
  triggerSystemNotification("Hora do Break!", "Sua sessão de foco foi registrada e sincronizada com sucesso. Relaxe um pouco!");

  if (AppState.config.autoStart) {
    setTimeout(startTimer, 600);
  }
}

function tick() {
  const now = Date.now();
  AppState.lastTickTimestamp = now;

  if (AppState.timeLeft > 0) {
    AppState.timeLeft--;
    updateTimerUI();
  } else {
    handlePhaseCompletion(true);
  }
}

function handlePhaseCompletion(isNatural = true) {
  stopTimer();

  const elapsedMs = (AppState.totalDuration - AppState.timeLeft) * 1000;
  recordSessionHistory(AppState.mode, elapsedMs, isNatural);

  soundEngine.playAlarm();

  if (AppState.mode === "focus") {
    if (AppState.currentRound >= AppState.config.interval) {
      AppState.currentRound = 1;
      setMode("longBreak", false);
      triggerSystemNotification("Ciclo Concluído!", "Parabéns! Hora de uma pausa longa restauradora.");
    } else {
      AppState.currentRound++;
      setMode("shortBreak", false);
      triggerSystemNotification("Pomodoro Concluído!", "Muito bem! Descanse por alguns minutos.");
    }
  } else {
    setMode("focus", false);
    triggerSystemNotification("Pausa Finalizada", "Hora de retomar o foco e a produtividade!");
  }

  const roundTag = document.getElementById("session-round-tag");
  if (roundTag) {
    roundTag.textContent = "Ciclo " + AppState.currentRound + " de " + AppState.config.interval;
  }

  if (AppState.config.autoStart) {
    setTimeout(startTimer, 1000);
  }
}

function updateTimerUI() {
  const mins = Math.floor(AppState.timeLeft / 60);
  const secs = AppState.timeLeft % 60;
  const timeStr = String(mins).padStart(2, "0") + ":" + String(secs).padStart(2, "0");

  const timerEl = document.getElementById("timer-display");
  if (timerEl) timerEl.textContent = timeStr;
  document.title = timeStr + " — " + getModeLabel(AppState.mode) + " | XXX TIME";

  const ring = document.getElementById("ring-progress");
  if (ring) {
    const totalCircumference = 2 * Math.PI * 150; // r=150 -> 942.48
    const progress = AppState.totalDuration > 0 ? (AppState.timeLeft / AppState.totalDuration) : 0;
    const offset = totalCircumference * (1 - progress);
    ring.style.strokeDashoffset = offset;
  }
}

function updateControlsUI() {
  const iconPlay = document.getElementById("icon-play");
  const iconPause = document.getElementById("icon-pause");
  const labelBtn = document.getElementById("label-play-pause");

  if (AppState.isRunning) {
    if (iconPlay) iconPlay.style.display = "none";
    if (iconPause) iconPause.style.display = "block";
    if (labelBtn) labelBtn.textContent = "Pausar";
  } else {
    if (iconPlay) iconPlay.style.display = "block";
    if (iconPause) iconPause.style.display = "none";
    if (labelBtn) labelBtn.textContent = AppState.timeLeft === AppState.totalDuration ? "Começar" : "Retomar";
  }
}

function getModeLabel(mode) {
  if (mode === "focus") return "Foco";
  if (mode === "shortBreak") return "Pausa Curta";
  if (mode === "longBreak") return "Pausa Longa";
  return "Pomodoro";
}

function updateTopClock() {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  const clockEl = document.getElementById("top-clock-display");
  if (clockEl) clockEl.textContent = timeStr;

  // Atualiza relógio do dashboard fullscreen em tempo real
  const dashClock = document.getElementById("dash-live-clock");
  if (dashClock) {
    dashClock.textContent = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  }
}

// --- 7. GRAVAÇÃO DE HISTÓRICO & SINCRO SUPABASE ---
function recordSessionHistory(mode, durationMs, completed = true, customOpts = {}) {
  if (durationMs < 1000) return; // Ignora pulsos instantâneos sem uso

  const action = customOpts.action || (completed ? "focus_completed" : "skipped");
  const status = customOpts.status || (completed ? "Concluído" : "Interrompido");
  const taskName = customOpts.notes || (action === "interrupted_by_break" ? "Sessão interrompida por Break" : (mode === "focus" ? "Sessão Pomodoro" : "Intervalo"));

  const record = {
    id: (typeof crypto !== "undefined" && crypto.randomUUID) ? crypto.randomUUID() : "rec_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4),
    mode: mode,
    duration_ms: durationMs,
    action: action,
    status: status,
    task_name: taskName,
    notes: taskName,
    created_at: new Date().toISOString(),
    user_id: AppState.activeUserId,
    metadata: {
      interrupted_by_break: action === "interrupted_by_break",
      round: AppState.currentRound,
      ...customOpts
    }
  };

  AppState.history.unshift(record);
  if (AppState.history.length > 500) AppState.history.pop();

  localStorage.setItem("xxx_time_history", JSON.stringify(AppState.history));
  syncRecordToSupabase(record);
  renderFullAnalytics();
}

// --- 8. DASHBOARD & ANALYTICS AVANÇADO (STRICT ZERO MOCK DATA) ---
function renderFullAnalytics() {
  calculateKPIs();
  renderResumoCards();
  renderSvgTrendChart();
  renderProductiveHoursGrid();
  renderTaskBreakdown();
  renderHeatmapGrid();
  renderFocusBreakRatio();
  renderCronogramaTimeline();
}

function calculateKPIs() {
  const records = AppState.history || [];
  const focusRecords = records.filter(r => r.mode === "focus");
  const completedFocus = focusRecords.filter(r => r.action === "focus_completed");
  const breakInterrupted = focusRecords.filter(r => r.action === "interrupted_by_break");

  const elTotalFocus = document.getElementById("kpi-total-focus-time");
  const elFocusToday = document.getElementById("val-focus-today");
  const elTotalSessions = document.getElementById("kpi-total-sessions-started");
  const elSessionsStatus = document.getElementById("kpi-sessions-status");
  const elTotalCompleted = document.getElementById("kpi-total-pomodoros");
  const elCompletionRate = document.getElementById("kpi-completion-rate");
  const elBreakInterrupted = document.getElementById("kpi-break-interruptions");
  const elBreakNote = document.getElementById("kpi-break-note");
  const elStreak = document.getElementById("kpi-streak-days");
  const elConsistency = document.getElementById("kpi-consistency-score");
  const elPeak = document.getElementById("kpi-peak-hour");
  const elPeriod = document.getElementById("kpi-peak-period");
  const elAvg = document.getElementById("kpi-daily-avg");

  // CASO DE USO ZERO MOCK: Se o usuário ainda não realizou sessões de foco
  if (focusRecords.length === 0) {
    if (elTotalFocus) elTotalFocus.textContent = "0min";
    if (elFocusToday) elFocusToday.textContent = "0min";
    if (elTotalSessions) elTotalSessions.textContent = "0";
    if (elSessionsStatus) elSessionsStatus.textContent = "0 iniciadas";
    if (elTotalCompleted) elTotalCompleted.textContent = "0";
    if (elCompletionRate) elCompletionRate.textContent = "0%";
    if (elBreakInterrupted) elBreakInterrupted.textContent = "0";
    if (elBreakNote) elBreakNote.textContent = "0 interrupções";
    if (elStreak) elStreak.textContent = "0 dias";
    if (elConsistency) elConsistency.textContent = "0%";
    if (elPeak) elPeak.textContent = "--:--";
    if (elPeriod) elPeriod.textContent = "Sem registros";
    if (elAvg) elAvg.textContent = "0min";
    return;
  }

  // 1. Tempo total e hoje
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];
  const totalFocusMins = Math.round(focusRecords.reduce((acc, r) => acc + (r.duration_ms || 0), 0) / 60000);
  const todayFocusMins = Math.round(focusRecords.filter(r => (r.created_at || "").split("T")[0] === todayStr).reduce((acc, r) => acc + (r.duration_ms || 0), 0) / 60000);

  const formatMinStr = (m) => m >= 60 ? Math.floor(m / 60) + "h " + (m % 60) + "m" : m + "min";
  if (elTotalFocus) elTotalFocus.textContent = formatMinStr(totalFocusMins);
  if (elFocusToday) elFocusToday.textContent = formatMinStr(todayFocusMins);

  // 2. Sessões iniciadas vs status
  const totalSessionsCount = focusRecords.length;
  if (elTotalSessions) elTotalSessions.textContent = totalSessionsCount;
  if (elSessionsStatus) elSessionsStatus.textContent = completedFocus.length + " completas, " + breakInterrupted.length + " breaks";

  // 3. Pomodoros 100% concluídos e taxa
  const completedCount = completedFocus.length;
  if (elTotalCompleted) elTotalCompleted.textContent = completedCount;
  const compRate = Math.round((completedCount / totalSessionsCount) * 100);
  if (elCompletionRate) elCompletionRate.textContent = compRate + "%";

  // 4. Interrupções por Break (Anotado e sincronizado)
  const breakCount = breakInterrupted.length;
  if (elBreakInterrupted) elBreakInterrupted.textContent = breakCount;
  if (elBreakNote) elBreakNote.textContent = breakCount > 0 ? "Anotado e sync" : "Zero interrupções";

  // 5. Streak & Consistência
  const uniqueDates = [...new Set(focusRecords.map(r => (r.created_at || "").split("T")[0]))].filter(Boolean).sort().reverse();
  let streak = 0;
  let checkDate = new Date();

  for (let i = 0; i < 30; i++) {
    const dStr = checkDate.toISOString().split("T")[0];
    if (uniqueDates.includes(dStr)) {
      streak++;
      checkDate.setDate(checkDate.getDate() - 1);
    } else if (i === 0 && !uniqueDates.includes(todayStr)) {
      checkDate.setDate(checkDate.getDate() - 1);
    } else {
      break;
    }
  }
  if (elStreak) elStreak.textContent = streak + " " + (streak === 1 ? "dia" : "dias");

  const activeDays = Math.max(1, uniqueDates.length);
  const dailyGoal = AppState.config.dailyGoal || 8;
  const consistencyScore = Math.min(100, Math.round((completedCount / (activeDays * dailyGoal)) * 100));
  if (elConsistency) elConsistency.textContent = consistencyScore + "%";

  // 6. Pico Produtivo
  const hourCounts = {};
  focusRecords.forEach(r => {
    const hour = new Date(r.created_at).getHours();
    hourCounts[hour] = (hourCounts[hour] || 0) + (r.duration_ms || 0);
  });
  let peakHour = null;
  let maxTime = 0;
  Object.keys(hourCounts).forEach(h => {
    if (hourCounts[h] > maxTime) {
      maxTime = hourCounts[h];
      peakHour = parseInt(h);
    }
  });

  if (peakHour !== null && maxTime > 0) {
    const peakStr = String(peakHour).padStart(2, "0") + "h - " + String((peakHour + 2) % 24).padStart(2, "0") + "h";
    const periodName = peakHour < 12 ? "Manhã" : (peakHour < 18 ? "Tarde" : "Noite");
    if (elPeak) elPeak.textContent = peakStr;
    if (elPeriod) elPeriod.textContent = periodName;
  } else {
    if (elPeak) elPeak.textContent = "--:--";
    if (elPeriod) elPeriod.textContent = "Sem registros";
  }

  const dailyAvgMins = Math.round(totalFocusMins / activeDays);
  if (elAvg) elAvg.textContent = formatMinStr(dailyAvgMins);
}

function renderResumoCards() {
  const isTime = AppState.resumoViewType === "time";
  const now = new Date();
  const todayStr = now.toISOString().split("T")[0];

  const startOfWeek = new Date(now);
  const day = startOfWeek.getDay();
  const diffToMon = (day === 0 ? -6 : 1) - day;
  startOfWeek.setDate(startOfWeek.getDate() + diffToMon);
  startOfWeek.setHours(0, 0, 0, 0);

  const focusRecords = AppState.history.filter(r => r.mode === "focus" && r.action === "focus_completed");

  let todayTotal = 0;
  let weekTotal = 0;
  let allTotal = 0;

  focusRecords.forEach(r => {
    const rDate = new Date(r.created_at);
    const rDayStr = r.created_at.split("T")[0];
    const val = isTime ? Math.round((r.duration_ms || 0) / 60000) : 1;

    if (rDayStr === todayStr) todayTotal += val;
    if (rDate >= startOfWeek) weekTotal += val;
    allTotal += val;
  });

  const formatVal = (v) => {
    if (!isTime) return v + " " + (v === 1 ? "sessão" : "sessões");
    if (v === 0) return "0min";
    if (v < 60) return v + "min";
    const h = Math.floor(v / 60);
    const m = v % 60;
    return m > 0 ? h + "h " + m + "m" : h + "h";
  };

  const elToday = document.getElementById("val-summary-today");
  const elWeek = document.getElementById("val-summary-week");
  const elMonth = document.getElementById("val-summary-month");

  if (elToday) elToday.textContent = formatVal(todayTotal);
  if (elWeek) elWeek.textContent = formatVal(weekTotal);
  if (elMonth) elMonth.textContent = formatVal(allTotal);
}

function renderSvgTrendChart() {
  const container = document.getElementById("svg-chart-container");
  if (!container) return;

  const records = AppState.history.filter(r => r.mode === "focus");
  const now = new Date();
  const period = AppState.chartPeriod || "dias";
  const numSteps = period === "meses" ? 6 : (period === "semanas" ? 4 : 7);

  const pointsData = [];

  for (let i = numSteps - 1; i >= 0; i--) {
    let label = "";
    let mins = 0;

    if (period === "dias") {
      const d = new Date(now);
      d.setDate(d.getDate() - i);
      const dayStr = d.toISOString().split("T")[0];
      const weekDays = ["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"];
      label = i === 0 ? "Hoje" : weekDays[d.getDay()];

      records.forEach(r => {
        if (r.created_at.split("T")[0] === dayStr) {
          mins += Math.round((r.duration_ms || 0) / 60000);
        }
      });
    } else if (period === "semanas") {
      label = "Sem " + (numSteps - i);
      const weekStart = new Date(now.getTime() - (i + 1) * 7 * 86400000);
      const weekEnd = new Date(now.getTime() - i * 7 * 86400000);

      records.forEach(r => {
        const d = new Date(r.created_at);
        if (d >= weekStart && d < weekEnd) {
          mins += Math.round((r.duration_ms || 0) / 60000);
        }
      });
    } else {
      const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const months = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];
      label = months[d.getMonth()];
      const mYear = d.getFullYear();
      const mMonth = d.getMonth();

      records.forEach(r => {
        const rd = new Date(r.created_at);
        if (rd.getFullYear() === mYear && rd.getMonth() === mMonth) {
          mins += Math.round((r.duration_ms || 0) / 60000);
        }
      });
    }

    pointsData.push({ label, mins });
  }

  const width = 640;
  const height = 170;
  const padX = 40;
  const padY = 24;

  const totalMinsRecorded = pointsData.reduce((acc, p) => acc + p.mins, 0);

  // CASO ZERO DADOS: Gráfico limpo com aviso e zero números inventados
  if (totalMinsRecorded === 0) {
    let emptyLabels = "";
    const stepX = (width - 2 * padX) / Math.max(1, pointsData.length - 1);
    pointsData.forEach((d, idx) => {
      const x = padX + idx * stepX;
      emptyLabels += '<text x="' + x + '" y="' + (height - 4) + '" text-anchor="middle" font-size="10.5" fill="rgba(255,255,255,0.3)" font-family="Inter">' + d.label + '</text>';
    });

    container.innerHTML = '<svg viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="none">' +
      '<line x1="' + padX + '" y1="' + (height - padY) + '" x2="' + (width - padX) + '" y2="' + (height - padY) + '" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>' +
      '<line x1="' + padX + '" y1="' + padY + '" x2="' + (width - padX) + '" y2="' + padY + '" stroke="rgba(255,255,255,0.04)" stroke-dasharray="4 4" stroke-width="1"/>' +
      '<text x="50%" y="45%" text-anchor="middle" fill="rgba(255,255,255,0.35)" font-size="12" font-family="var(--font-heading)">Nenhuma atividade registrada no período</text>' +
      emptyLabels +
      '</svg>';
    return;
  }

  const maxVal = Math.max(...pointsData.map(d => d.mins), 60);
  const stepX = (width - 2 * padX) / Math.max(1, pointsData.length - 1);
  const coords = pointsData.map((d, idx) => {
    const x = padX + idx * stepX;
    const y = height - padY - (d.mins / maxVal) * (height - 2 * padY);
    return { ...d, x, y };
  });

  const pathD = coords.reduce((acc, pt, i) => acc + (i === 0 ? "M" : "L") + " " + pt.x.toFixed(1) + "," + pt.y.toFixed(1) + " ", "");
  const areaD = pathD + " L " + coords[coords.length - 1].x + "," + (height - padY) + " L " + coords[0].x + "," + (height - padY) + " Z";

  const chartColor = (AppState.chroma && AppState.chroma.primary) || "#ff1037";
  let dotsHtml = "";
  let labelsHtml = "";

  coords.forEach(pt => {
    dotsHtml += '<circle cx="' + pt.x + '" cy="' + pt.y + '" r="4.5" fill="#0f172a" stroke="' + chartColor + '" stroke-width="2.5" ' +
      'data-label="' + pt.label + '" data-mins="' + pt.mins + '" ' +
      'onmouseenter="showDashFloatingTooltip(event, \'<b>\' + this.dataset.label + \'</b>: \' + this.dataset.mins + \' min\')" ' +
      'onmouseleave="hideDashFloatingTooltip()">' +
      '</circle>';
    labelsHtml += '<text x="' + pt.x + '" y="' + (height - 4) + '" text-anchor="middle" font-size="10.5" fill="rgba(255,255,255,0.45)" font-family="Inter">' + pt.label + '</text>';
  });

  container.innerHTML = '<svg viewBox="0 0 ' + width + ' ' + height + '" preserveAspectRatio="none">' +
    '<defs>' +
      '<linearGradient id="chartBloodArea" x1="0" y1="0" x2="0" y2="1">' +
        '<stop offset="0%" stop-color="' + chartColor + '" stop-opacity="0.38"/>' +
        '<stop offset="100%" stop-color="' + chartColor + '" stop-opacity="0.0"/>' +
      '</linearGradient>' +
    '</defs>' +
    '<line x1="' + padX + '" y1="' + (height - padY) + '" x2="' + (width - padX) + '" y2="' + (height - padY) + '" stroke="rgba(255,255,255,0.08)" stroke-width="1"/>' +
    '<path d="' + areaD + '" fill="url(#chartBloodArea)"/>' +
    '<path d="' + pathD + '" fill="none" stroke="' + chartColor + '" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"/>' +
    dotsHtml +
    labelsHtml +
    '</svg>';
}

function renderProductiveHoursGrid() {
  const container = document.getElementById("hours-capsules-container");
  if (!container) return;

  const records = AppState.history.filter(r => r.mode === "focus");
  const hourCounts = new Array(24).fill(0);

  records.forEach(r => {
    const d = new Date(r.created_at);
    const h = d.getHours();
    hourCounts[h] += Math.round((r.duration_ms || 0) / 60000);
  });

  const maxH = Math.max(...hourCounts, 1);
  const currentHour = new Date().getHours();

  let maxHour = null;
  let maxMin = 0;
  for (let h = 0; h < 24; h++) {
    if (hourCounts[h] > maxMin) {
      maxMin = hourCounts[h];
      maxHour = h;
    }
  }

  const peakLabel = document.getElementById("hourly-peak-label");
  if (peakLabel) {
    if (maxHour !== null && maxMin > 0) {
      peakLabel.textContent = "Pico: " + String(maxHour).padStart(2, "0") + "h às " + String((maxHour + 2) % 24).padStart(2, "0") + "h (" + maxMin + "m)";
    } else {
      peakLabel.textContent = "Sem registros";
    }
  }

  let html = "";
  for (let h = 0; h < 24; h++) {
    const mins = hourCounts[h];
    const isPeak = maxHour !== null && h === maxHour && mins > 0;
    const isCurrent = h === currentHour;
    const heightPx = mins > 0 ? Math.max(8, Math.round((mins / maxH) * 54)) : 5;
    const opacity = mins > 0 ? Math.max(0.4, Math.min(1, mins / maxH)) : (isCurrent ? 0.35 : 0.1);
    const tooltip = "⏰ " + String(h).padStart(2, "0") + ":00 • " + mins + " min de Foco";

    html += '<div class="hour-capsule ' + (isPeak ? "peak" : "") + ' ' + (isCurrent ? "current-hour" : "") + '" ' +
      'style="height: ' + heightPx + 'px; opacity: ' + opacity + ';" ' +
      'data-tooltip="' + tooltip + '" ' +
      'onmouseenter="showDashFloatingTooltip(event, this.dataset.tooltip)" ' +
      'onmouseleave="hideDashFloatingTooltip()">' +
      '</div>';
  }
  container.innerHTML = html;
}

function renderTaskBreakdown() {
  const container = document.getElementById("task-breakdown-container");
  if (!container) return;

  const records = AppState.history.filter(r => r.mode === "focus");
  const taskMap = {};
  let totalMins = 0;

  records.forEach(r => {
    const name = r.task_name || "Sessão Pomodoro";
    const mins = Math.round((r.duration_ms || 0) / 60000);
    totalMins += mins;
    if (!taskMap[name]) taskMap[name] = 0;
    taskMap[name] += mins;
  });

  const entries = Object.entries(taskMap);
  const totalCountEl = document.getElementById("tasks-total-count");
  if (totalCountEl) totalCountEl.textContent = entries.length + " Categorias";

  if (entries.length === 0) {
    container.innerHTML = '<div class="empty-task-note">Nenhuma categoria registrada ainda. Inicie um ciclo de foco para começar!</div>';
    return;
  }

  container.innerHTML = entries.map(([name, mins]) => {
    const pct = totalMins > 0 ? Math.round((mins / totalMins) * 100) : 100;
    return '<div class="task-item-row" data-tooltip="<b>' + name + '</b>: ' + mins + ' min (' + pct + '%)" ' +
      'onmouseenter="showDashFloatingTooltip(event, this.dataset.tooltip)" onmouseleave="hideDashFloatingTooltip()">' +
      '<div class="task-item-header">' +
        '<span>🎯 ' + name + '</span>' +
        '<span>' + mins + 'm <b style="color: var(--current-accent);">(' + pct + '%)</b></span>' +
      '</div>' +
      '<div class="task-item-bar-track">' +
        '<div class="task-item-bar-fill" style="width: ' + pct + '%;"></div>' +
      '</div>' +
    '</div>';
  }).join("");
}

function renderHeatmapGrid() {
  const container = document.getElementById("heatmap-dots-container");
  const monthsContainer = document.getElementById("heatmap-months-labels");
  if (!container) return;

  const records = AppState.history.filter(r => r.mode === "focus");
  const activityMap = {};
  records.forEach(r => {
    const dayKey = (r.created_at || "").split("T")[0];
    if (dayKey) activityMap[dayKey] = (activityMap[dayKey] || 0) + (r.duration_ms || 0);
  });

  const now = new Date();
  const numWeeks = 16;
  const currentDayOfWeek = now.getDay();
  const totalDays = (numWeeks - 1) * 7 + (currentDayOfWeek + 1);
  const startDate = new Date(now);
  startDate.setDate(startDate.getDate() - totalDays + 1);

  let html = "";
  const monthsSeen = {};
  const monthLabels = [];
  const monthShort = ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul", "Ago", "Set", "Out", "Nov", "Dez"];

  for (let w = 0; w < numWeeks; w++) {
    for (let d = 0; d < 7; d++) {
      const cellDate = new Date(startDate);
      cellDate.setDate(cellDate.getDate() + (w * 7 + d));

      if (cellDate > now) {
        html += '<div class="hm-cell level-0" style="opacity: 0.1; pointer-events: none;"></div>';
        continue;
      }

      const dayKey = cellDate.toISOString().split("T")[0];
      const mins = Math.round((activityMap[dayKey] || 0) / 60000);

      const mIdx = cellDate.getMonth();
      if (d === 0 && !monthsSeen[cellDate.getFullYear() + "-" + mIdx]) {
        monthsSeen[cellDate.getFullYear() + "-" + mIdx] = true;
        monthLabels.push(monthShort[mIdx]);
      }

      let level = 0;
      if (mins >= 120) level = 4;
      else if (mins >= 60) level = 3;
      else if (mins >= 25) level = 2;
      else if (mins > 0) level = 1;

      const tooltip = "📅 " + cellDate.getDate() + " de " + monthShort[mIdx] + " • " + mins + " min de foco";

      html += '<div class="hm-cell level-' + level + '" ' +
        'data-date="' + dayKey + '" ' +
        'data-tooltip="' + tooltip + '" ' +
        'onmouseenter="showDashFloatingTooltip(event, this.dataset.tooltip)" ' +
        'onmouseleave="hideDashFloatingTooltip()">' +
        '</div>';
    }
  }

  container.innerHTML = html;
  if (monthsContainer && monthLabels.length > 0) {
    monthsContainer.innerHTML = monthLabels.map(m => "<span>" + m + "</span>").join("");
  }
}

function renderFocusBreakRatio() {
  const focusRecords = AppState.history.filter(r => r.mode === "focus" && r.action === "focus_completed");
  const breakInterruptedRecords = AppState.history.filter(r => r.mode === "focus" && r.action === "interrupted_by_break");
  const shortBreakRecords = AppState.history.filter(r => r.mode === "shortBreak");
  const longBreakRecords = AppState.history.filter(r => r.mode === "longBreak");

  const focusMin = focusRecords.reduce((acc, r) => acc + Math.round((r.duration_ms || 0) / 60000), 0);
  const breakInterruptedMin = breakInterruptedRecords.reduce((acc, r) => acc + Math.round((r.duration_ms || 0) / 60000), 0);
  const shortBreakMin = shortBreakRecords.reduce((acc, r) => acc + Math.round((r.duration_ms || 0) / 60000), 0);
  const longBreakMin = longBreakRecords.reduce((acc, r) => acc + Math.round((r.duration_ms || 0) / 60000), 0);

  const totalMin = focusMin + breakInterruptedMin + shortBreakMin + longBreakMin;
  const focusPct = totalMin > 0 ? Math.round((focusMin / totalMin) * 100) : 0;
  const breakPct = totalMin > 0 ? (100 - focusPct) : 0;

  const elFocusMin = document.getElementById("ratio-focus-min");
  const elFocusPct = document.getElementById("ratio-focus-pct");
  const elBreakMin = document.getElementById("ratio-break-min");
  const elBreakPct = document.getElementById("ratio-break-pct");
  const elBadge = document.getElementById("ratio-efficiency-badge");

  if (elFocusMin) elFocusMin.textContent = focusMin + "min";
  if (elFocusPct) elFocusPct.textContent = focusPct + "% Foco";
  if (elBreakMin) elBreakMin.textContent = (breakInterruptedMin + shortBreakMin + longBreakMin) + "min";
  if (elBreakPct) elBreakPct.textContent = breakPct + "% Pausa/Break";
  if (elBadge) elBadge.textContent = focusPct + "% Eficiência";

  // Segmentos da Barra Multipartes
  const segFocus = document.getElementById("seg-focus");
  const segShort = document.getElementById("seg-short");
  const segLong = document.getElementById("seg-long");
  const segBreakInterrupt = document.getElementById("seg-break-interrupt");

  if (totalMin > 0) {
    const pFocus = (focusMin / totalMin) * 100;
    const pShort = (shortBreakMin / totalMin) * 100;
    const pLong = (longBreakMin / totalMin) * 100;
    const pBreakInt = (breakInterruptedMin / totalMin) * 100;

    if (segFocus) segFocus.style.width = pFocus + "%";
    if (segShort) segShort.style.width = pShort + "%";
    if (segLong) segLong.style.width = pLong + "%";
    if (segBreakInterrupt) segBreakInterrupt.style.width = pBreakInt + "%";
  } else {
    if (segFocus) segFocus.style.width = "0%";
    if (segShort) segShort.style.width = "0%";
    if (segLong) segLong.style.width = "0%";
    if (segBreakInterrupt) segBreakInterrupt.style.width = "0%";
  }

  const elDetailFocus = document.getElementById("ratio-detail-focus");
  const elDetailShort = document.getElementById("ratio-detail-short");
  const elDetailLong = document.getElementById("ratio-detail-long");
  const elDetailBreakInt = document.getElementById("ratio-detail-break-interrupt");

  if (elDetailFocus) elDetailFocus.textContent = focusMin + "m";
  if (elDetailShort) elDetailShort.textContent = shortBreakMin + "m";
  if (elDetailLong) elDetailLong.textContent = longBreakMin + "m";
  if (elDetailBreakInt) elDetailBreakInt.textContent = breakInterruptedMin + "m";
}

function renderCronogramaTimeline(filterQuery = null) {
  const container = document.getElementById("cronograma-timeline-list");
  if (!container) return;

  let records = AppState.history || [];
  if (filterQuery) {
    const q = filterQuery.toLowerCase().trim();
    records = records.filter(r => 
      (r.mode || "").toLowerCase().includes(q) || 
      (r.task_name || "").toLowerCase().includes(q) ||
      (r.status || "").toLowerCase().includes(q) ||
      (r.action || "").toLowerCase().includes(q)
    );
  }

  if (records.length === 0) {
    container.innerHTML = '<li class="cronograma-empty-state">' +
      '<div class="empty-icon">🍅</div>' +
      '<div class="empty-title">Nenhuma sessão registrada</div>' +
      '<div class="empty-desc">Inicie seu primeiro Pomodoro ou use o botão Break para registrar histórico.</div>' +
      '</li>';
    return;
  }

  container.innerHTML = records.slice(0, 80).map(r => {
    const mins = Math.round((r.duration_ms || 0) / 60000);
    const secs = Math.round(((r.duration_ms || 0) % 60000) / 1000);
    const durStr = mins > 0 ? (mins + " min" + (secs > 0 ? " " + secs + "s" : "")) : (secs + " seg");
    const date = new Date(r.created_at);
    const timeStr = date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

    let badgeClass = "focus-done";
    let badgeText = "Foco";

    if (r.action === "interrupted_by_break") {
      badgeClass = "interrupted-break";
      badgeText = "Break (Interrompido)";
    } else if (r.mode === "shortBreak") {
      badgeClass = "short-break";
      badgeText = "Pausa Curta";
    } else if (r.mode === "longBreak") {
      badgeClass = "long-break";
      badgeText = "Pausa Longa";
    }

    return '<li class="timeline-entry-item">' +
      '<div class="timeline-entry-left">' +
        '<span class="timeline-status-badge ' + badgeClass + '">' + badgeText + '</span>' +
        '<span class="timeline-entry-name">' + (r.task_name || 'Pomodoro') + '</span>' +
      '</div>' +
      '<div class="timeline-entry-right">' +
        '<span>' + timeStr + '</span>' +
        '<span class="timeline-entry-dur">' + durStr + '</span>' +
      '</div>' +
      '</li>';
  }).join("");
}

// Tooltip Flutuante
window.showDashFloatingTooltip = function(e, html) {
  const tt = document.getElementById("dash-floating-tooltip");
  if (!tt) return;
  tt.innerHTML = html;
  tt.style.left = (e.clientX + 12) + "px";
  tt.style.top = (e.clientY - 30) + "px";
  tt.style.opacity = "1";
};

window.hideDashFloatingTooltip = function() {
  const tt = document.getElementById("dash-floating-tooltip");
  if (tt) tt.style.opacity = "0";
};

// --- 9. SINCRONIZAÇÃO EM TEMPO REAL COM BACKEND SUPABASE (HERANÇA TIME-OS) ---
async function initCloudSync() {
  updateSyncIndicator(false, "Conectando...");
  try {
    const localRes = await fetch("/api/history").catch(() => null);
    if (localRes && localRes.ok) {
      const localData = await localRes.json();
      if (Array.isArray(localData.records) && localData.records.length > 0) {
        AppState.history = localData.records;
        localStorage.setItem("xxx_time_history", JSON.stringify(AppState.history));
        renderFullAnalytics();
      }
    }

    const res = await fetch(SUPABASE_CONFIG.sessionsUrl + "?select=id&limit=1", {
      method: "GET",
      headers: {
        "apikey": SUPABASE_CONFIG.anonKey,
        "Authorization": "Bearer " + SUPABASE_CONFIG.anonKey
      }
    }).catch(() => null);

    if (res && res.ok) {
      AppState.isOnline = true;
      updateSyncIndicator(true, "Supabase Online");
      pullCloudHistory();
    } else {
      AppState.isOnline = false;
      updateSyncIndicator(false, "Modo Local");
    }
  } catch (e) {
    AppState.isOnline = false;
    updateSyncIndicator(false, "Modo Offline");
  }
}

async function broadcastActiveSession(state = "running") {
  const payload = {
    mode: AppState.mode,
    started_at: new Date(AppState.sessionStartTime || Date.now()).toISOString(),
    state: state,
    paused_accum_ms: 0,
    updated_at: new Date().toISOString()
  };

  fetch("/api/session-state", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload)
  }).catch(() => {});

  if (!AppState.isOnline) return;

  try {
    const checkRes = await fetch(SUPABASE_CONFIG.sessionsUrl + "?mode=eq." + AppState.mode + "&select=id", {
      headers: {
        "apikey": SUPABASE_CONFIG.anonKey,
        "Authorization": "Bearer " + SUPABASE_CONFIG.anonKey
      }
    });

    if (checkRes.ok) {
      const existing = await checkRes.json();
      if (Array.isArray(existing) && existing.length > 0) {
        await fetch(SUPABASE_CONFIG.sessionsUrl + "?id=eq." + existing[0].id, {
          method: "PATCH",
          headers: {
            "apikey": SUPABASE_CONFIG.anonKey,
            "Authorization": "Bearer " + SUPABASE_CONFIG.anonKey,
            "Content-Type": "application/json"
          },
          body: JSON.stringify(payload)
        });
        return;
      }
    }

    await fetch(SUPABASE_CONFIG.sessionsUrl, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_CONFIG.anonKey,
        "Authorization": "Bearer " + SUPABASE_CONFIG.anonKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(payload)
    });
  } catch (e) {}
}

async function syncRecordToSupabase(record) {
  const formatDuration = (ms) => {
    const mins = Math.round(ms / 60000);
    return mins >= 60 ? Math.floor(mins / 60) + "h " + (mins % 60) + "m" : mins + "m";
  };

  const row = {
    id: record.id || (typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : "rec_" + Date.now()),
    mode: record.mode || "focus",
    action: record.action || "focus_completed",
    duration_ms: record.duration_ms || 0,
    duration_formatted: formatDuration(record.duration_ms || 0),
    notes: record.task_name || "Pomodoro [Ciclo " + AppState.currentRound + "]",
    metadata: { round: AppState.currentRound, task_name: record.task_name || "Foco de Alta Performance", user_id: AppState.activeUserId },
    created_at: record.created_at || new Date().toISOString()
  };

  fetch("/api/history", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(row)
  }).catch(() => {});

  if (!AppState.isOnline) return;

  try {
    await fetch(SUPABASE_CONFIG.historyUrl, {
      method: "POST",
      headers: {
        "apikey": SUPABASE_CONFIG.anonKey,
        "Authorization": "Bearer " + SUPABASE_CONFIG.anonKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify(row)
    });
  } catch (e) {}
}

async function pullCloudHistory() {
  if (!AppState.isOnline) return;
  try {
    const res = await fetch(SUPABASE_CONFIG.historyUrl + "?select=*&order=created_at.desc&limit=60", {
      headers: {
        "apikey": SUPABASE_CONFIG.anonKey,
        "Authorization": "Bearer " + SUPABASE_CONFIG.anonKey
      }
    });

    if (res.ok) {
      const cloudData = await res.json();
      if (Array.isArray(cloudData) && cloudData.length > 0) {
        const validUserCloudRecords = cloudData.filter(cr => {
          if (!cr || !cr.created_at) return false;
          if (cr.metadata && cr.metadata.user_id && cr.metadata.user_id !== AppState.activeUserId) return false;
          return true;
        });

        if (validUserCloudRecords.length > 0) {
          const localIds = new Set(AppState.history.map(h => h.id));
          validUserCloudRecords.forEach(cr => {
            if (!localIds.has(cr.id)) {
              AppState.history.push({
                id: cr.id,
                mode: cr.mode || "focus",
                duration_ms: cr.duration_ms || 1500000,
                action: cr.action || "focus_completed",
                status: "Concluído (Nuvem)",
                task_name: (cr.metadata && cr.metadata.task_name) || cr.notes || "Sessão Pomodoro",
                created_at: cr.created_at
              });
            }
          });
          AppState.history.sort((a, b) => new Date(b.created_at) - new Date(a.created_at));
          localStorage.setItem("xxx_time_history", JSON.stringify(AppState.history));
          renderFullAnalytics();
        }
      }
    }
  } catch (e) {}
}

function updateSyncIndicator(online, text) {
  const dot = document.querySelector(".status-live-dot");
  if (dot) {
    dot.style.background = online ? "#10b981" : "#fbbf24";
    dot.style.boxShadow = online ? "0 0 8px #10b981" : "0 0 8px #fbbf24";
  }
}

// --- 10. GERENCIADOR DE INTERFACE E EVENTOS ---
function setupEventListeners() {
  document.getElementById("btn-play-pause")?.addEventListener("click", togglePlayPause);
  document.getElementById("btn-reset")?.addEventListener("click", resetCurrentTimer);
  document.getElementById("btn-skip")?.addEventListener("click", skipPhase);
  document.getElementById("btn-break")?.addEventListener("click", triggerBreakSession);
  document.getElementById("btn-dash-break")?.addEventListener("click", triggerBreakSession);

  document.getElementById("mode-btn-focus")?.addEventListener("click", () => setMode("focus"));
  document.getElementById("mode-btn-short")?.addEventListener("click", () => setMode("shortBreak"));
  document.getElementById("mode-btn-long")?.addEventListener("click", () => setMode("longBreak"));

  // Dock Inferior
  document.getElementById("dock-btn-timer")?.addEventListener("click", () => {
    closeAllModals();
    setDockActive("dock-btn-timer");
  });

  document.getElementById("dock-btn-backgrounds")?.addEventListener("click", () => {
    openModal("modal-backgrounds");
    setDockActive("dock-btn-backgrounds");
  });

  document.getElementById("dock-btn-analytics")?.addEventListener("click", () => {
    openModal("modal-analytics");
    setDockActive("dock-btn-analytics");
    renderFullAnalytics();
  });

  document.getElementById("dock-btn-settings")?.addEventListener("click", () => {
    loadStoredSettings();
    openModal("modal-settings");
    setDockActive("dock-btn-settings");
  });

  // Fechar modais
  document.getElementById("btn-close-backgrounds")?.addEventListener("click", () => {
    closeAllModals();
    setDockActive("dock-btn-timer");
  });

  document.getElementById("btn-close-analytics")?.addEventListener("click", () => {
    closeAllModals();
    setDockActive("dock-btn-timer");
  });

  document.getElementById("btn-dash-back")?.addEventListener("click", () => {
    closeAllModals();
    setDockActive("dock-btn-timer");
  });

  document.getElementById("btn-close-settings")?.addEventListener("click", () => {
    closeAllModals();
    setDockActive("dock-btn-timer");
  });

  // Abas do Analytics
  document.getElementById("tab-btn-resumo")?.addEventListener("click", () => {
    document.getElementById("tab-btn-resumo")?.classList.add("active");
    document.getElementById("tab-btn-cronograma")?.classList.remove("active");
    document.getElementById("pane-analytics-resumo")?.classList.add("active");
    document.getElementById("pane-analytics-cronograma")?.classList.remove("active");
    renderFullAnalytics();
  });

  document.getElementById("tab-btn-cronograma")?.addEventListener("click", () => {
    document.getElementById("tab-btn-cronograma")?.classList.add("active");
    document.getElementById("tab-btn-resumo")?.classList.remove("active");
    document.getElementById("pane-analytics-cronograma")?.classList.add("active");
    document.getElementById("pane-analytics-resumo")?.classList.remove("active");
    renderCronogramaTimeline();
  });

  // Busca na linha do tempo
  document.getElementById("crono-search-input")?.addEventListener("input", (e) => {
    renderCronogramaTimeline(e.target.value);
  });

  // Forçar Sincronização
  document.getElementById("btn-sync-cloud")?.addEventListener("click", () => {
    showToast("Sincronizando com Supabase...");
    initCloudSync();
  });

  // Filtros de Resumo e Período do Gráfico
  document.getElementById("select-resumo-type")?.addEventListener("change", (e) => {
    AppState.resumoViewType = e.target.value;
    renderResumoCards();
  });

  document.getElementById("select-chart-period")?.addEventListener("change", (e) => {
    AppState.chartPeriod = e.target.value;
    renderSvgTrendChart();
  });

  // Salvar Ajustes
  document.getElementById("btn-save-settings")?.addEventListener("click", saveSettingsFromUI);

  // Volume do Alarme Slider
  const sliderAlarmVol = document.getElementById("cfg-alarm-volume");
  if (sliderAlarmVol) {
    sliderAlarmVol.addEventListener("input", (e) => {
      const v = parseInt(e.target.value);
      const valVol = document.getElementById("val-alarm-volume");
      if (valVol) valVol.textContent = v + "%";
      AppState.config.alarmVolume = v;
    });
  }

  // Testar Alarme
  const btnPreview = document.getElementById("btn-preview-sound");
  if (btnPreview) {
    btnPreview.addEventListener("click", () => {
      if (soundEngine.isPlayingAlarm) {
        soundEngine.stopAlarm();
        btnPreview.textContent = "▶ Testar";
      } else {
        const soundType = document.getElementById("cfg-alarm-sound")?.value || "ps2_startup";
        soundEngine.init();
        soundEngine.playAlarm(soundType);
        btnPreview.textContent = "⏹ Parar";
      }
    });
  }

  // Limpar Histórico Local e Remoto
  document.getElementById("btn-clear-history")?.addEventListener("click", () => {
    if (confirm("Limpar todo o histórico de sessões?")) {
      AppState.history = [];
      localStorage.removeItem("xxx_time_history");
      fetch("/api/history", { method: "DELETE" }).catch(() => {});
      renderFullAnalytics();
      showToast("Histórico limpo com sucesso.");
    }
  });

  // Teclas de Atalho (Espaço=Play/Pause, R=Reset, S=Skip, B=Break, Esc=Fechar)
  window.addEventListener("keydown", (e) => {
    if (e.target.tagName === "INPUT" || e.target.tagName === "SELECT") return;
    if (e.code === "Space") {
      e.preventDefault();
      togglePlayPause();
    } else if (e.key === "r" || e.key === "R") {
      e.preventDefault();
      resetCurrentTimer();
    } else if (e.key === "s" || e.key === "S") {
      e.preventDefault();
      skipPhase();
    } else if (e.key === "b" || e.key === "B") {
      e.preventDefault();
      triggerBreakSession();
    } else if (e.key === "Escape") {
      closeAllModals();
      setDockActive("dock-btn-timer");
    }
  });

  // Fechar modal ao clicar fora
  document.querySelectorAll(".modal-overlay, .dashboard-fullscreen-overlay").forEach(overlay => {
    overlay.addEventListener("click", (e) => {
      if (
        e.target === overlay || 
        e.target.classList?.contains("dash-fullscreen-inner") || 
        e.target.classList?.contains("dash-viewport-content")
      ) {
        closeAllModals();
        setDockActive("dock-btn-timer");
      }
    });
  });
}

function openModal(id) {
  closeAllModals();
  const modal = document.getElementById(id);
  if (modal) {
    modal.classList.add("open");
    modal.setAttribute("aria-hidden", "false");
  }
}

function closeAllModals() {
  document.querySelectorAll(".modal-overlay, .dashboard-fullscreen-overlay").forEach(m => {
    m.classList.remove("open");
    m.setAttribute("aria-hidden", "true");
  });
}

function setDockActive(btnId) {
  document.querySelectorAll(".dock-item").forEach(item => {
    item.classList.toggle("active", item.id === btnId);
  });
}

function loadStoredSettings() {
  const stored = localStorage.getItem("xxx_time_config");
  if (stored) {
    try { AppState.config = { ...AppState.config, ...JSON.parse(stored) }; } catch (e) {}
  }

  const setVal = (id, val) => {
    const el = document.getElementById(id);
    if (el) el.value = val;
  };
  setVal("cfg-focus", AppState.config.focus);
  setVal("cfg-short", AppState.config.shortBreak);
  setVal("cfg-long", AppState.config.longBreak);
  setVal("cfg-interval", AppState.config.interval);

  const sndToggle = document.getElementById("cfg-sound");
  if (sndToggle) sndToggle.checked = AppState.config.soundEnabled;

  const alarmSelect = document.getElementById("cfg-alarm-sound");
  if (alarmSelect) alarmSelect.value = AppState.config.alarmSound || "ps2_startup";

  const alarmVol = document.getElementById("cfg-alarm-volume");
  const valVol = document.getElementById("val-alarm-volume");
  if (alarmVol) {
    const vol = AppState.config.alarmVolume !== undefined ? AppState.config.alarmVolume : 85;
    alarmVol.value = vol;
    if (valVol) valVol.textContent = vol + "%";
  }

  const autoToggle = document.getElementById("cfg-auto-start");
  if (autoToggle) autoToggle.checked = AppState.config.autoStart;
}

function saveSettingsFromUI() {
  const getNum = (id, def) => parseInt(document.getElementById(id)?.value) || def;
  AppState.config.focus = getNum("cfg-focus", 25);
  AppState.config.shortBreak = getNum("cfg-short", 5);
  AppState.config.longBreak = getNum("cfg-long", 15);
  AppState.config.interval = getNum("cfg-interval", 4);
  AppState.config.soundEnabled = document.getElementById("cfg-sound")?.checked ?? true;
  AppState.config.alarmSound = document.getElementById("cfg-alarm-sound")?.value || "ps2_startup";
  AppState.config.alarmVolume = parseInt(document.getElementById("cfg-alarm-volume")?.value) || 85;
  AppState.config.autoStart = document.getElementById("cfg-auto-start")?.checked ?? false;

  localStorage.setItem("xxx_time_config", JSON.stringify(AppState.config));
  setMode(AppState.mode, false);
  closeAllModals();
  setDockActive("dock-btn-timer");
  showToast("Configurações salvas!");
}

function loadStoredHistory() {
  const stored = localStorage.getItem("xxx_time_history");
  if (stored) {
    try {
      const parsed = JSON.parse(stored);
      // Remove resquícios de dados mockados legados se houver
      AppState.history = Array.isArray(parsed) ? parsed.filter(r => r && r.created_at && !r.is_mock) : [];
    } catch (e) {
      AppState.history = [];
    }
  } else {
    AppState.history = [];
  }
}

function triggerSystemNotification(title, body) {
  if (!("Notification" in window)) {
    showToast(title + ": " + body);
    return;
  }
  if (Notification.permission === "granted") {
    new Notification(title, { body });
  } else if (Notification.permission !== "denied") {
    Notification.requestPermission().then(p => {
      if (p === "granted") new Notification(title, { body });
    });
  } else {
    showToast(title + ": " + body);
  }
}

function showToast(message) {
  const container = document.getElementById("toast-container");
  if (!container) return;
  const toast = document.createElement("div");
  toast.className = "toast";
  toast.textContent = message;
  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateY(8px) scale(0.95)";
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

document.addEventListener("DOMContentLoaded", () => {
  initTimer();

  // Integração com o Tutor Agent (disparo remoto/conversacional de foco)
  window.addEventListener('personalos:pomodoro_started', (e) => {
    if (typeof startTimer === 'function' && !AppState.isRunning) {
      startTimer();
      showToast("🥋 Pomodoro iniciado pelo Tutor AI!");
    }
  });

  const rawPomo = localStorage.getItem('personal_os_active_pomodoro');
  if (rawPomo) {
    try {
      const data = JSON.parse(rawPomo);
      if (data.running && (Date.now() - data.startedAt) < 60000) {
        setTimeout(() => {
          if (typeof startTimer === 'function' && !AppState.isRunning) {
            startTimer();
            showToast("🥋 Pomodoro iniciado pelo Tutor AI!");
          }
        }, 500);
      }
    } catch(e) {}
  }
});
