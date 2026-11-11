#!/bin/bash
set -e

# ==============================================================================
# 🤖 MCP PERSONAL OS — ANDROID RELEASE APK BUILD SCRIPT (GALAXY S22 ULTRA)
# ==============================================================================
SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

export BUILD_TOOLS="/opt/homebrew/share/android-commandlinetools/build-tools/35.0.0"
export JAVA_HOME="/opt/homebrew/Cellar/openjdk@17/17.0.20.1/libexec/openjdk.jdk/Contents/Home"
export ANDROID_HOME="/opt/homebrew/share/android-commandlinetools"
export NDK_HOME="/opt/homebrew/share/android-commandlinetools/ndk/27.2.12479018"
export PATH="$JAVA_HOME/bin:$BUILD_TOOLS:$PATH"

echo "========================================================"
echo "🚀 Compilando APK Android Oficial para Galaxy S22 Ultra (ARM64)"
echo "========================================================"

# 1. Sincronizar frontend
node build.js

# 2. Build Tauri Android (Multi-ABI: aarch64 + armv7)
npx tauri android build --apk --target aarch64 armv7

# 3. Zipalign e assinatura
UNSIGNED_APK="src-tauri/gen/android/app/build/outputs/apk/universal/release/app-universal-release-unsigned.apk"
ALIGNED_APK="/tmp/mcp-os-aligned.apk"
FINAL_APK="McpPersonalOs_v1.0.0_Android_S22Ultra.apk"

rm -f "$ALIGNED_APK" "$FINAL_APK" "${FINAL_APK}.idsig"

echo "📦 Otimizando alinhamento (zipalign 4)..."
$BUILD_TOOLS/zipalign -v -p 4 "$UNSIGNED_APK" "$ALIGNED_APK"

echo "🔐 Assinando APK com release.keystore..."
$BUILD_TOOLS/apksigner sign \
    --ks release.keystore \
    --ks-pass pass:android \
    --ks-key-alias androidreleasekey \
    --key-pass pass:android \
    --out "$FINAL_APK" \
    "$ALIGNED_APK"

echo "🔍 Verificando integridade criptográfica da assinatura..."
$BUILD_TOOLS/apksigner verify --verbose "$FINAL_APK"

rm -f "$ALIGNED_APK"

echo "========================================================"
echo "✅ APK Android gerado e assinado com sucesso!"
ls -lh "$FINAL_APK"
echo "========================================================"

if [ "$1" == "--install" ] || [ "$1" == "-i" ]; then
    DEVICE_ID=$(adb devices | grep -w "device" | head -n 1 | awk '{print $1}')
    if [ -n "$DEVICE_ID" ]; then
        echo "📲 Instalando exclusivamente no perfil principal (User 0 - Proprietário) no dispositivo $DEVICE_ID..."
        adb -s "$DEVICE_ID" install -r --user 0 "$FINAL_APK"
        adb -s "$DEVICE_ID" shell "pm uninstall --user 10 com.mateuscelestino.personalos 2>/dev/null || true"
        adb -s "$DEVICE_ID" shell "pm uninstall --user 95 com.mateuscelestino.personalos 2>/dev/null || true"
        echo "🚀 Iniciando app no perfil principal..."
        adb -s "$DEVICE_ID" shell am start --user 0 -n com.mateuscelestino.personalos/.MainActivity
    fi
fi

