#!/bin/bash
# kill-mic.sh — Encerra e silencia completamente o microfone no macOS
# Zera o ganho de entrada (input volume) para 0 via CoreAudio

osascript -e 'set volume input volume 0'
VOL=$(osascript -e 'input volume of (get volume settings)')

echo "🛑 [KILL MIC] Microfone do macOS silenciado com sucesso!"
echo "Volume de entrada atual: ${VOL}% (Mudo total no sistema)"
