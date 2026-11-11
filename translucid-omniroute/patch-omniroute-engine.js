/**
 * patch-omniroute-engine.js — Translucid OmniRoute Engine (Permanent Dark Mode Edition)
 * Garante 100% que o OmniRoute permaneça SEMPRE no Modo Escuro (Dark Mode Fixo),
 * independente se o macOS estiver no Modo Claro ou Escuro.
 */
const fs = require('fs');
const path = require('path');

const targetDir = process.argv[2] || '/tmp/omniroute-translucid-build';

if (!targetDir || !fs.existsSync(targetDir)) {
  console.error('❌ Diretório extraído não fornecido ou inexistente:', targetDir);
  process.exit(1);
}

console.log('⚡ Injetando Modo Escuro Permanente + Zero Grid no OmniRoute em:', targetDir);

// =========================================================================
// 1. Modificar main.js (Electron NativeTheme Dark Lock + Janela Transparente)
// =========================================================================
const mainJsPath = path.join(targetDir, 'main.js');
if (fs.existsSync(mainJsPath)) {
  let mainJs = fs.readFileSync(mainJsPath, 'utf8');

  // Força nativeTheme.themeSource = "dark"
  if (!mainJs.includes('nativeTheme.themeSource = "dark"')) {
    mainJs = `const { nativeTheme: _omniNativeTheme } = require("electron");\ntry { _omniNativeTheme.themeSource = "dark"; } catch(e){}\n` + mainJs;
  }

  mainJs = mainJs.replace(
    /backgroundColor:\s*"#0a0a0a",/,
    `backgroundColor: "#00000000",
    transparent: true,
    hasShadow: true,
    opacity: 0.94,`
  );

  mainJs = mainJs.replace(
    /titleBarStyle:\s*"hiddenInset",\s*trafficLightPosition:\s*\{\s*x:\s*16,\s*y:\s*16\s*\}/,
    `titleBarStyle: "hiddenInset",
      trafficLightPosition: { x: 16, y: 16 },
      vibrancy: "under-window",
      visualEffectState: "active"`
  );

  fs.writeFileSync(mainJsPath, mainJs, 'utf8');
  console.log('✅ main.js configurado com nativeTheme dark.');
}

// =========================================================================
// 2. Modificar preload.js (Trava Rígida no Modo Escuro + Zero Grid)
// =========================================================================
const preloadJsPath = path.join(targetDir, 'preload.js');
if (fs.existsSync(preloadJsPath)) {
  let preloadJs = fs.readFileSync(preloadJsPath, 'utf8');

  // Limpa injeções antigas
  preloadJs = preloadJs.replace(/function installOmniLiquidGlass\(\)[\s\S]*?installOmniLiquidGlass\(\);/g, '');

  const permanentDarkGlass = `
function installOmniLiquidGlass() {
  const enforceDark = () => {
    if (!document.documentElement) return;
    document.documentElement.classList.add("dark");
    document.documentElement.classList.remove("light");
    document.documentElement.setAttribute("data-theme", "dark");
    document.documentElement.style.colorScheme = "dark";
    try {
      localStorage.setItem("theme", "dark");
      localStorage.setItem("omniroute-theme", "dark");
    } catch (e) {}
  };

  const attach = () => {
    enforceDark();
    if (!document.head || document.getElementById("omni-translucid-liquid-glass")) return;

    const style = document.createElement("style");
    style.id = "omni-translucid-liquid-glass";
    style.textContent = \`
      /* 🔒 FORÇA MODO ESCURO PERMANENTE EM TODAS AS CLASSES E TEMAS */
      :root, html, body, .light, [data-theme="light"], .dark, [data-theme="dark"] {
        color-scheme: dark !important;
        background: transparent !important;
        background-color: transparent !important;
        font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Display', 'Inter', sans-serif !important;
        -webkit-font-smoothing: antialiased;
        text-rendering: optimizeLegibility;

        /* Variáveis de Tema Escuro Forçadas Mesmo no Light Mode */
        --color-bg: transparent !important;
        --color-bg-primary: transparent !important;
        --color-surface: rgba(14, 18, 28, 0.55) !important;
        --color-card: rgba(14, 18, 28, 0.55) !important;
        --color-sidebar: rgba(10, 14, 22, 0.40) !important;
        --color-text-main: #ffffff !important;
        --color-text-primary: #ffffff !important;
        --color-text-muted: #e2e8f0 !important;
        --color-border: rgba(255, 255, 255, 0.18) !important;
      }

      /* 🚫 ELIMINAÇÃO TOTAL DA GRADE / QUADRICULADO DE FUNDO */
      body::before,
      body::after,
      #__next::before,
      #__next::after,
      main::before,
      main::after,
      [class*="grid"]::before,
      [class*="grid"]::after,
      [class*="grid-pattern"],
      [class*="bg-grid"] {
        display: none !important;
        content: none !important;
        background: none !important;
        background-image: none !important;
      }

      #__next, main, section {
        background-color: transparent !important;
        background: transparent !important;
      }

      /* Sidebar & Header Translúcidos com Vidro Cristalino */
      header, nav, aside {
        background: rgba(10, 14, 22, 0.40) !important;
        border-color: rgba(255, 255, 255, 0.14) !important;
        transform: translateZ(0);
      }

      /* Cards Ultra-Fluidos: Vidro Sedoso e Alta Densidade de Leitura */
      [class*="card"], [class*="panel"], [class*="border"], table {
        background: rgba(14, 18, 28, 0.55) !important;
        border: 1px solid rgba(255, 255, 255, 0.20) !important;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35), inset 0 1px 0 rgba(255, 255, 255, 0.12) !important;
        border-radius: 12px !important;
        transform: translateZ(0);
        contain: paint;
      }

      /* Tipografia em Alto Contraste Nítida */
      h1, h2, h3, h4, h5, h6, [class*="title"], [class*="font-semibold"], [class*="font-bold"] {
        color: #ffffff !important;
        font-weight: 700 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.85) !important;
      }

      p, span, label, td, th, a, div {
        color: #f1f5f9 !important;
        text-shadow: 0 1px 2px rgba(0, 0, 0, 0.75);
      }

      /* Inputs e Botões com Zero Lag */
      input, textarea, select {
        background-color: rgba(0, 0, 0, 0.45) !important;
        border: 1px solid rgba(255, 255, 255, 0.25) !important;
        color: #ffffff !important;
        transform: translateZ(0);
      }

      button, [role="button"], [class*="btn"] {
        background-color: rgba(255, 255, 255, 0.08) !important;
        border: 1px solid rgba(255, 255, 255, 0.20) !important;
        color: #ffffff !important;
        transform: translateZ(0);
        transition: background-color 0.15s ease, border-color 0.15s ease;
      }

      button:hover {
        background-color: rgba(255, 255, 255, 0.18) !important;
        border-color: rgba(255, 255, 255, 0.38) !important;
      }
    \`;
    document.head.appendChild(style);
  };

  if (document.readyState === "loading") {
    window.addEventListener("DOMContentLoaded", attach, { once: true });
  } else {
    attach();
  }
}
installOmniLiquidGlass();
`;

  preloadJs = permanentDarkGlass + '\n' + preloadJs;
  fs.writeFileSync(preloadJsPath, preloadJs, 'utf8');
  console.log('✅ preload.js atualizado com trava de Dark Mode Permanente.');
}

console.log('🎉 OmniRoute travado no Modo Escuro Permanente com sucesso!');
