"""Generate gendered photo pool placeholders (replace PNGs in public/candidates manually)."""

from __future__ import annotations

from pathlib import Path

from PIL import Image, ImageDraw, ImageFont

ROOT = Path(__file__).resolve().parents[1]
OUT = ROOT / "public" / "candidates"
SIZE = (240, 300)

FEMALE_VARIANTS = [
    {"bg": "#c97b84", "accent": "#8f4f58", "label": "MULHER 1"},
    {"bg": "#b88bb8", "accent": "#7a5a7a", "label": "MULHER 2"},
    {"bg": "#d4a088", "accent": "#9a6a55", "label": "MULHER 3"},
]

MALE_VARIANTS = [
    {"bg": "#6b8fae", "accent": "#3f5f78", "label": "HOMEM 1"},
    {"bg": "#6a9a8a", "accent": "#3f6a5c", "label": "HOMEM 2"},
    {"bg": "#8a8f6b", "accent": "#5c6040", "label": "HOMEM 3"},
]


def load_font(size: int) -> ImageFont.FreeTypeFont | ImageFont.ImageFont:
    for path in (
        "C:/Windows/Fonts/segoeui.ttf",
        "C:/Windows/Fonts/arial.ttf",
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
    ):
        try:
            return ImageFont.truetype(path, size)
        except OSError:
            continue
    return ImageFont.load_default()


def draw_silhouette(draw: ImageDraw.ImageDraw, accent: str, female: bool) -> None:
    cx, cy = SIZE[0] // 2, SIZE[1] // 2 - 10
    head_r = 34 if female else 36
    draw.ellipse((cx - head_r, cy - head_r - 28, cx + head_r, cy - head_r + 36), fill=accent)
    if female:
        draw.polygon(
            [(cx - 52, SIZE[1] - 24), (cx + 52, SIZE[1] - 24), (cx + 38, cy + 34), (cx - 38, cy + 34)],
            fill=accent,
        )
    else:
        draw.polygon(
            [(cx - 58, SIZE[1] - 24), (cx + 58, SIZE[1] - 24), (cx + 44, cy + 30), (cx - 44, cy + 30)],
            fill=accent,
        )


def render_placeholder(*, bg: str, accent: str, top_label: str, filename: str) -> Image.Image:
    img = Image.new("RGB", SIZE, bg)
    draw = ImageDraw.Draw(img)
    female = top_label.startswith("MULHER")
    draw_silhouette(draw, accent, female)

    title_font = load_font(18)
    sub_font = load_font(11)
    draw.rectangle((0, 0, SIZE[0], 34), fill=accent)
    draw.text((12, 8), top_label, fill="#f5f0e8", font=title_font)
    draw.rectangle((0, SIZE[1] - 28, SIZE[0], SIZE[1]), fill=accent)
    draw.text((12, SIZE[1] - 22), filename, fill="#f5f0e8", font=sub_font)
    draw.rectangle((0, 0, SIZE[0] - 1, SIZE[1] - 1), outline="#2a2622", width=2)
    return img


def main() -> None:
    OUT.mkdir(parents=True, exist_ok=True)

    for i, variant in enumerate(FEMALE_VARIANTS, start=1):
        filename = f"placeholder-female-{i:02d}.png"
        img = render_placeholder(
            bg=variant["bg"],
            accent=variant["accent"],
            top_label=variant["label"],
            filename=filename,
        )
        img.save(OUT / filename)

    for i, variant in enumerate(MALE_VARIANTS, start=1):
        filename = f"placeholder-male-{i:02d}.png"
        img = render_placeholder(
            bg=variant["bg"],
            accent=variant["accent"],
            top_label=variant["label"],
            filename=filename,
        )
        img.save(OUT / filename)

    print(f"Generated {len(FEMALE_VARIANTS) + len(MALE_VARIANTS)} pool placeholders in {OUT}")


if __name__ == "__main__":
    main()
