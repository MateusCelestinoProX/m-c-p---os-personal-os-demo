#!/usr/bin/env python3
"""
Gera todos os ícones e assets de marca oficiais para o M.C.P PERSONAL OS
a partir da imagem original de alta qualidade fornecida pelo usuário:
/Users/mcp/Downloads/Gemini_Generated_Image_adpc4jadpc4jadpc.jpeg
"""
import os
import math
import numpy as np
from PIL import Image, ImageDraw, ImageFilter

SOURCE_IMAGE_PATH = "/Users/mcp/Downloads/Gemini_Generated_Image_adpc4jadpc4jadpc.jpeg"
BASE_DIR = "/Users/mcp/.gemini/antigravity/scratch/m-c-p---os-personal-os"

def prepare_master_logo(source_path):
    """
    Carrega a imagem original, limpa vinhetas e artefatos de compressão no fundo
    garantindo branco 100% puro e enquadra o conteúdo (cubo + tipografia)
    com margem de respiro perfeita em um canvas quadrado 1024x1024.
    """
    if not os.path.exists(source_path):
        raise FileNotFoundError(f"Arquivo de logo original não encontrado em: {source_path}")

    im = Image.open(source_path).convert('RGB')
    arr = np.array(im, dtype=float)

    # Limpeza suave e contínua do fundo para branco puro (255, 255, 255)
    diff = arr.max(axis=2) - arr.min(axis=2)
    min_c = arr.min(axis=2)
    bg_mask = (diff < 40) & (min_c > 175)
    
    clean_arr = arr.copy()
    factor = np.clip((min_c - 175) / 45.0, 0.0, 1.0)
    for c in range(3):
        clean_arr[:, :, c] = np.where(bg_mask, clean_arr[:, :, c] * (1 - factor) + 255.0 * factor, clean_arr[:, :, c])

    clean_img = Image.fromarray(np.clip(clean_arr, 0, 255).astype(np.uint8))

    # Identificar bounding box do conteúdo vermelho
    red_mask = (clean_arr[:, :, 0] > 140) & (clean_arr[:, :, 1] < 100) & (clean_arr[:, :, 2] < 100)
    coords = np.argwhere(red_mask)
    y0, x0 = coords.min(axis=0)
    y1, x1 = coords.max(axis=0)
    content_w = x1 - x0
    content_h = y1 - y0
    cx = (x0 + x1) / 2.0
    cy = (y0 + y1) / 2.0

    # Canvas quadrado onde o conteúdo ocupa ~72% da altura (proporção ideal para ícones de app)
    square_size = int(max(content_w, content_h) / 0.72)
    half = square_size // 2

    canvas = Image.new('RGB', (square_size, square_size), (255, 255, 255))
    src_x0 = int(cx - half)
    src_y0 = int(cy - half)
    paste_x = 0
    paste_y = 0
    if src_x0 < 0:
        paste_x = -src_x0
        src_x0 = 0
    if src_y0 < 0:
        paste_y = -src_y0
        src_y0 = 0

    crop_part = clean_img.crop((src_x0, src_y0, min(src_x0 + square_size, clean_img.width), min(src_y0 + square_size, clean_img.height)))
    canvas.paste(crop_part, (paste_x, paste_y))

    # Master em alta resolução 1024x1024
    master_1024 = canvas.resize((1024, 1024), Image.Resampling.LANCZOS)
    return master_1024

def create_adaptive_foreground(master_img, size):
    """
    Gera o foreground para ícones adaptativos do Android:
    O conteúdo fica contido no círculo central de 66.6% (72dp/108dp) com fundo transparente.
    """
    fg_canvas = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    inner_size = int(size * 0.72)
    inner_icon = master_img.resize((inner_size, inner_size), Image.Resampling.LANCZOS).convert('RGBA')
    offset = (size - inner_size) // 2
    fg_canvas.paste(inner_icon, (offset, offset))
    return fg_canvas

def generate_all_icons():
    print(f"[*] Processando imagem original: {SOURCE_IMAGE_PATH}")
    master = prepare_master_logo(SOURCE_IMAGE_PATH)
    master_rgba = master.convert('RGBA')

    # 1. Tauri Icons
    tauri_icons_dir = os.path.join(BASE_DIR, "src-tauri", "icons")
    os.makedirs(tauri_icons_dir, exist_ok=True)

    tauri_sizes = [
        ("icon.png", 512),
        ("128x128.png", 128),
        ("128x128@2x.png", 256),
        ("32x32.png", 32),
        ("Square30x30Logo.png", 30),
        ("Square44x44Logo.png", 44),
        ("StoreLogo.png", 50),
        ("Square71x71Logo.png", 71),
        ("Square89x89Logo.png", 89),
        ("Square107x107Logo.png", 107),
        ("Square142x142Logo.png", 142),
        ("Square150x150Logo.png", 150),
        ("Square284x284Logo.png", 284),
        ("Square310x310Logo.png", 310)
    ]

    for filename, sz in tauri_sizes:
        resized = master_rgba.resize((sz, sz), Image.Resampling.LANCZOS)
        resized.save(os.path.join(tauri_icons_dir, filename), "PNG")
        print(f"  [Tauri] Gerado {filename} ({sz}x{sz})")

    # 2. Android Mipmaps
    res_dir = os.path.join(BASE_DIR, "src-tauri", "gen", "android", "app", "src", "main", "res")
    mipmap_configs = [
        ("mipmap-mdpi", 48, 108),
        ("mipmap-hdpi", 72, 162),
        ("mipmap-xhdpi", 96, 216),
        ("mipmap-xxhdpi", 144, 324),
        ("mipmap-xxxhdpi", 192, 432)
    ]

    for folder, icon_size, fg_size in mipmap_configs:
        target_folder = os.path.join(res_dir, folder)
        os.makedirs(target_folder, exist_ok=True)

        # Standard icon
        icon = master_rgba.resize((icon_size, icon_size), Image.Resampling.LANCZOS)
        icon.save(os.path.join(target_folder, "ic_launcher.png"), "PNG")

        # Round icon (Circular Mask)
        round_icon = Image.new('RGBA', (icon_size, icon_size), (0, 0, 0, 0))
        mask = Image.new('L', (icon_size, icon_size), 0)
        mask_draw = ImageDraw.Draw(mask)
        mask_draw.ellipse((0, 0, icon_size, icon_size), fill=255)
        round_icon.paste(icon, (0, 0), mask)
        round_icon.save(os.path.join(target_folder, "ic_launcher_round.png"), "PNG")

        # Adaptive Foreground (Safe zone for Samsung One UI & Android 13/14)
        fg_icon = create_adaptive_foreground(master_rgba, fg_size)
        fg_icon.save(os.path.join(target_folder, "ic_launcher_foreground.png"), "PNG")
        print(f"  [Android] Gerado {folder}: ic_launcher ({icon_size}x{icon_size}), round ({icon_size}x{icon_size}), foreground ({fg_size}x{fg_size})")

    # 3. Web & Brand Assets
    brand_dirs = [
        os.path.join(BASE_DIR, "assets", "brand"),
        os.path.join(BASE_DIR, "public", "assets", "brand")
    ]
    for bdir in brand_dirs:
        os.makedirs(bdir, exist_ok=True)
        master_rgba.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(bdir, "icon.png"), "PNG")
        master_rgba.resize((192, 192), Image.Resampling.LANCZOS).save(os.path.join(bdir, "icon-192.png"), "PNG")
        master_rgba.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(bdir, "icon-512.png"), "PNG")
        print(f"  [Brand] Assets atualizados em: {bdir}")

    print("[✓] Todos os ícones gerados com sucesso a partir da logo oficial original!")

if __name__ == "__main__":
    generate_all_icons()

