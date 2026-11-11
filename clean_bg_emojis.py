#!/usr/bin/env python3
"""
Remove todos os emojis do modal de backgrounds (#bg-modal e #universal-bg-modal)
nos arquivos index.html, diary.html, calendar.html, admin.html e time.html.
Substitui os ícones por micro-indicadores luminosos cibernéticos elegantes.
"""
import re
import os

DOT_COLORS = {
    'waves': 'bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]',
    '3d': 'bg-purple-400 shadow-[0_0_8px_rgba(192,132,252,0.8)]',
    'cyber': 'bg-emerald-400 shadow-[0_0_8px_rgba(52,211,153,0.8)]',
    'cinematic': 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
}

def clean_file(filepath):
    if not os.path.exists(filepath):
        return
    with open(filepath, 'r', encoding='utf-8') as f:
        content = f.read()

    original = content

    # 1. Limpeza de headers e filtros do modal
    content = content.replace('✨ 3D & Túnel', '3D & Túnel')
    content = content.replace('🌊 Fluidos & Ondas', 'Fluidos & Ondas')
    content = content.replace('⚡ Cyber & Laser', 'Cyber & Laser')
    content = content.replace('🌄 Cinemático', 'Cinemático')
    content = content.replace('Fixo 📌', 'Fixo')
    content = content.replace('Modo Rotativo 🔄', 'Modo Rotativo')
    content = content.replace('🛑 Pausar', 'Pausar')
    content = content.replace('⏱️ Transição:', 'Transição:')
    content = content.replace('🔍 Filtrar shader', 'Filtrar shader')
    content = content.replace('<span class="text-3xl block mb-2">🔍</span>', '<span class="w-8 h-8 rounded-full border border-white/20 flex items-center justify-center mx-auto mb-2 text-gray-400 font-mono text-sm">Ø</span>')

    # 2. Substituição dos emojis dentro dos botões de shader
    # Padrão: <button data-shader="..." data-category="CAT" ...> ... <span class="text-base sm:text-lg">EMOJI</span>
    def replace_button(match):
        btn_text = match.group(0)
        category_match = re.search(r'data-category="([^"]+)"', btn_text)
        cat = 'cyber'
        if category_match:
            cats = category_match.group(1).split()
            for c in cats:
                if c in DOT_COLORS:
                    cat = c
                    break
        dot_style = DOT_COLORS.get(cat, DOT_COLORS['cyber'])
        new_span = f'<span class="w-2.5 h-2.5 rounded-full {dot_style}"></span>'
        # Substitui o span com emoji
        btn_text = re.sub(r'<span class="text-base sm:text-lg">[^<]+</span>', new_span, btn_text)
        return btn_text

    pattern = re.compile(r'<button\s+data-shader="[^"]+"[^>]*>.*?</button>', re.DOTALL)
    content = pattern.sub(replace_button, content)

    # 3. Remover emojis em badges de status dinâmicos no JS se houver
    content = content.replace("badge.innerHTML = 'Fixo 📌';", "badge.innerHTML = 'Fixo';")
    content = content.replace("badge.innerHTML = 'Rotativo 🔄';", "badge.innerHTML = 'Rotativo';")

    if content != original:
        with open(filepath, 'w', encoding='utf-8') as f:
            f.write(content)
        print(f"✓ Limpeza de emojis concluída em: {filepath}")
    else:
        print(f"- Nenhuma alteração necessária em: {filepath}")

if __name__ == "__main__":
    files = [
        "/Users/mcp/.gemini/antigravity/scratch/m-c-p---os-personal-os/index.html",
        "/Users/mcp/.gemini/antigravity/scratch/m-c-p---os-personal-os/diary.html",
        "/Users/mcp/.gemini/antigravity/scratch/m-c-p---os-personal-os/calendar.html",
        "/Users/mcp/.gemini/antigravity/scratch/m-c-p---os-personal-os/admin.html"
    ]
    for fp in files:
        clean_file(fp)
