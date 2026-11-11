#!/bin/bash
set -e

# ==============================================================================
# 🍏 MCP PERSONAL OS — NATIVE APPLE SILICON BUILD SCRIPT (SWIFT / APPKIT)
# ==============================================================================
# Compila o app nativo diretamente para arquitetura arm64 usando a toolchain oficial
# da Apple (swiftc + clang), com ícone Retina oficial e proxy local de mídias.
# ==============================================================================

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_ROOT="$(cd "$SCRIPT_DIR/.." && pwd)"
APP_NAME="McpPersonalOs"
BUILD_DIR="$PROJECT_ROOT/mac-native/build"
APP_BUNDLE="$BUILD_DIR/$APP_NAME.app"

echo "========================================================"
echo "🚀 Iniciando Compilação Nativa macOS (Apple Silicon ARM64)"
echo "📍 Projeto: $PROJECT_ROOT"
echo "========================================================"

# 1. Garantir que os arquivos web estejam atualizados na pasta public/
echo "📦 [1/6] Sincronizando assets de produção via build.js..."
cd "$PROJECT_ROOT"
node build.js

# 2. Criar esqueleto do pacote .app macOS
echo "📁 [2/6] Estruturando pacote $APP_NAME.app..."
rm -rf "$BUILD_DIR"
mkdir -p "$APP_BUNDLE/Contents/MacOS"
mkdir -p "$APP_BUNDLE/Contents/Resources/www"

# 3. Compilar código nativo (Catcher Objective-C + Swift com otimização -O para Apple Silicon)
echo "⚡ [3/6] Compilando binário nativo Swift + ObjC Exception Shield (-O arm64)..."
clang -c -O2 -target arm64-apple-macosx14.0 "$SCRIPT_DIR/Sources/ObjCExceptionCatcher.m" -o "$BUILD_DIR/ObjCExceptionCatcher.o"
swiftc -O \
    -target arm64-apple-macosx14.0 \
    "$SCRIPT_DIR/Sources"/*.swift \
    "$BUILD_DIR/ObjCExceptionCatcher.o" \
    -o "$APP_BUNDLE/Contents/MacOS/$APP_NAME"

# 4. Copiar metadados e ícone oficial Retina
echo "🎨 [4/6] Integrando Info.plist e ícone oficial Retina (.icns)..."
cp "$SCRIPT_DIR/Resources/Info.plist" "$APP_BUNDLE/Contents/Info.plist"
if [ -f "$SCRIPT_DIR/Resources/AppIcon.icns" ]; then
    cp "$SCRIPT_DIR/Resources/AppIcon.icns" "$APP_BUNDLE/Contents/Resources/AppIcon.icns"
    cp "$SCRIPT_DIR/Resources/AppIcon.icns" "$APP_BUNDLE/Contents/Resources/icon.icns"
elif [ -f "$SCRIPT_DIR/Resources/icon.icns" ]; then
    cp "$SCRIPT_DIR/Resources/icon.icns" "$APP_BUNDLE/Contents/Resources/AppIcon.icns"
    cp "$SCRIPT_DIR/Resources/icon.icns" "$APP_BUNDLE/Contents/Resources/icon.icns"
fi

# 5. Copiar frontend e mídias para dentro do bundle (Resources/www)
echo "🌐 [5/6] Empacotando core web, shaders WebGL e assets para Resources/www..."
cp -R "$PROJECT_ROOT/public"/* "$APP_BUNDLE/Contents/Resources/www/"

# 6. Assinatura com Entitlements de Rede e Ad-Hoc
echo "🔐 [6/6] Aplicando assinatura criptográfica com permissões de rede..."
codesign -s - --force --deep --entitlements "$SCRIPT_DIR/Resources/entitlements.plist" "$APP_BUNDLE"

echo "🔍 Verificando integridade da assinatura..."
codesign -vvv "$APP_BUNDLE"

# Atualizar cópia na raiz
rm -rf "$PROJECT_ROOT/$APP_NAME.app"
cp -R "$APP_BUNDLE" "$PROJECT_ROOT/$APP_NAME.app"

# Atualizar instalação oficial em /Applications se existir ou for padrão
if [ -d "/Applications" ]; then
    echo "📲 Atualizando /Applications/$APP_NAME.app..."
    rm -rf "/Applications/$APP_NAME.app"
    cp -R "$APP_BUNDLE" "/Applications/$APP_NAME.app"
    touch "/Applications/$APP_NAME.app"
    /System/Library/Frameworks/CoreServices.framework/Frameworks/LaunchServices.framework/Support/lsregister -f "/Applications/$APP_NAME.app" 2>/dev/null || true
fi

# Atualizar carimbo de data no bundle para forçar o Finder/Dock a invalidar caches antigos
touch "$PROJECT_ROOT/$APP_NAME.app"

echo "========================================================"
echo "✅ COMPILAÇÃO CONCLUÍDA COM SUCESSO!"
echo "📍 Aplicativo local: $PROJECT_ROOT/$APP_NAME.app"
echo "📍 Instalado em: /Applications/$APP_NAME.app"
echo "👉 Para abrir via terminal: open /Applications/$APP_NAME.app"
echo "========================================================"
