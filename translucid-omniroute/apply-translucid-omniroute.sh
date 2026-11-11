#!/usr/bin/env zsh
# ==============================================================================
# ✨ Translucid OmniRoute — Aplicador Automatizado de Crystal Liquid Glass
# ==============================================================================

set -e

APP_PATH="/Applications/OmniRoute.app"
RESOURCES_DIR="${APP_PATH}/Contents/Resources"
ASAR_FILE="${RESOURCES_DIR}/app.asar"
BACKUP_FILE="${RESOURCES_DIR}/app.asar.backup"
WORK_DIR="/tmp/omniroute-translucid-build"
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "🔮 [Translucid OmniRoute] Iniciando personalização Crystal Liquid Glass..."

if [ ! -d "$APP_PATH" ]; then
    echo "❌ Erro: OmniRoute.app não encontrado em /Applications."
    exit 1
fi

echo "🛑 Encerrando instâncias em execução do OmniRoute..."
killall "OmniRoute" 2>/dev/null || true
sleep 1

# Backup do app.asar original
if [ ! -f "$BACKUP_FILE" ]; then
    echo "📦 Criando backup original em: ${BACKUP_FILE}..."
    cp "$ASAR_FILE" "$BACKUP_FILE"
    echo "✅ Backup concluído."
else
    echo "ℹ️ Backup existente preservado em: ${BACKUP_FILE}"
fi

# Extração do ASAR
echo "📂 Extraindo app.asar do OmniRoute..."
rm -rf "$WORK_DIR"
npx --yes @electron/asar extract "$ASAR_FILE" "$WORK_DIR"

# Executar injeção
echo "💉 Injetando regras de Crystal Liquid Glass e Alto Contraste..."
node "${SCRIPT_DIR}/patch-omniroute-engine.js" "$WORK_DIR"

# Reempacotamento
echo "📦 Reempacotando app.asar..."
npx --yes @electron/asar pack "$WORK_DIR" "$ASAR_FILE"
rm -rf "$WORK_DIR"

echo "✨ [Sucesso!] OmniRoute agora possui interface Crystal Glass 100% translúcida com alta legibilidade!"
echo "🚀 Abrindo OmniRoute..."
open -a "$APP_PATH"
