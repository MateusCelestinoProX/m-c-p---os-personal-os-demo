# 🪟💎 Translucid OmniRoute

> Motor de injeção de **Vidro Cristalino Líquido (Crystal Liquid Glass & Apple Native Vibrancy)**, remoção total do quadriculado de fundo e aceleração **120 FPS ProMotion** para o **OmniRoute Desktop (macOS)**.

[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](LICENSE)
[![Platform: macOS](https://img.shields.io/badge/Platform-macOS%20(Apple%20Silicon%20%26%20Intel)-black.svg)](https://apple.com)
[![Electron: Native Glass](https://img.shields.io/badge/Electron-Vibrancy%20%26%20Alpha-emerald.svg)](https://electronjs.org)
[![Display: 120 FPS](https://img.shields.io/badge/ProMotion-120%20FPS%20Metal-purple.svg)](https://apple.com)

---

## 📖 Visão Geral

O **OmniRoute Desktop** é o gateway soberano de IA construído sobre **Electron + Next.js**. Por padrão de fábrica, sua interface inclui painéis escuros e uma grade quadriculada sobreposta (`body::before { background-image: linear-gradient(...) }`).

O **Translucid OmniRoute** é um motor de patch automatizado que:
1. Desbloqueia o canal Alpha nativo do macOS via **`NSVisualEffectView`** (`vibrancy: "under-window"`, `transparent: true`, `opacity: 0.94`).
2. **Elimina 100% da grade quadriculada de fundo**, deixando o vidro perfeitamente limpo e desobstruído.
3. Transforma os cards de provedores de IA (*HuggingFace*, *Hyperbolic*, *Ideogram*, *Mistral*, etc.) em **vidro líquido cristalino** com bordas finas iluminadas (`border: 1px solid rgba(255, 255, 255, 0.20)`).
4. Aplica **Branco Puro Reluzente (`#ffffff`)** com micro-sombra de alto relevo nos títulos e descrições, garantindo legibilidade nítida mesmo contra papéis de parede coloridos ou complexos.
5. Garante rolagem ultra-suave a **120 FPS (Apple ProMotion)** através de aceleração direta por GPU (`transform: translateZ(0)` e `contain: paint`).

---

## ⚡ Como Usar (Aplicação em 1 Comando)

Abra o Terminal nesta pasta e execute:

```bash
# 1. Conceda permissão de execução aos scripts
chmod +x *.sh

# 2. Aplique a transparência de vidro no OmniRoute
./apply-translucid-omniroute.sh
```

O script automaticamente:
* Encerra qualquer instância em execução do OmniRoute.
* Cria um backup de segurança em `/Applications/OmniRoute.app/Contents/Resources/app.asar.backup`.
* Desempacota o arquivo `app.asar`, injeta as diretivas no `main.js` e a folha de estilos de Crystal Glass no `preload.js`.
* Reempacota o pacote e reinicia o aplicativo instantaneamente com a interface de vidro ativa!

---

## 🔄 Como Restaurar para o Padrão de Fábrica

Se desejar retornar à versão original sólida do OmniRoute a qualquer momento:

```bash
./restore-original-omniroute.sh
```

---

## ❓ Perguntas Frequentes (FAQ)

### 1. Se eu desligar ou reiniciar o Mac, o visual volta ao padrão?
> **Não!** As alterações são gravadas de forma permanente no arquivo binário `app.asar` dentro de `/Applications/OmniRoute.app`. O efeito translúcido **permanece ativo e intacto indefinidamente**.

### 2. Se o OmniRoute for atualizado, o visual volta ao padrão?
> **Sim.** Quando o aplicativo recebe um update oficial, o instalador substitui o arquivo `app.asar`.
> **Solução:** Basta rodar novamente `./apply-translucid-omniroute.sh` para aplicar a transparência na nova versão em menos de **10 segundos**!

### 3. As rotas de IA, chaves e tokens são afetados?
> **Não, 100% intactos.** O patch atua exclusivamente nas camadas de apresentação visual (janela `BrowserWindow` do Electron e injeção de CSS no `preload.js`). Todas as rotas de balanceamento, chaves de API e proxies funcionam com performance máxima.

---

## 🛠️ O que foi modificado por debaixo dos panos:

### No Processo Principal do Electron (`main.js`):
```javascript
mainWindow = new BrowserWindow({
  transparent: true,
  backgroundColor: "#00000000",
  opacity: 0.94,
  titleBarStyle: "hiddenInset",
  trafficLightPosition: { x: 16, y: 16 },
  vibrancy: "under-window",
  visualEffectState: "active"
});
```

### Na Injeção do Preload (`preload.js`):
```css
/* Elimina a grade quadriculada e aplica vidro líquido */
body::before, body::after, [class*="grid"] {
  display: none !important;
  background-image: none !important;
}

[class*="card"], [class*="panel"], table {
  background: rgba(14, 18, 28, 0.55) !important;
  border: 1px solid rgba(255, 255, 255, 0.20) !important;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.35) !important;
  transform: translateZ(0);
}
```

---

## 📄 Licença

Distribuído sob a licença [MIT](LICENSE).
