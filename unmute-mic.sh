#!/bin/bash
# unmute-mic.sh — Restaura o volume de entrada do microfone no macOS
TARGET_VOL=${1:-75}

osascript -e "set volume input volume ${TARGET_VOL}"
VOL=$(osascript -e 'input volume of (get volume settings)')

echo "🎙️ [UNMUTE MIC] Microfone do macOS reativado com sucesso!"
echo "Volume de entrada atual: ${VOL}%"
