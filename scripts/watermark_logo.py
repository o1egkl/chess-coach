from PIL import Image, ImageDraw, ImageFont
import os

src_path = r'D:\Users\o1egk\.gemini\antigravity\brain\e49d7e25-6d9e-4e29-a1d0-be5303219f64\chess_coach_logo_1795016510035.jpg'
img = Image.open(src_path).convert('RGBA')
w, h = img.size
print(f"Loaded image size: {w}x{h}")

# Create an overlay for subtle, stylish watermark
overlay = Image.new('RGBA', (w, h), (0, 0, 0, 0))
draw = ImageDraw.Draw(overlay)

# Watermark text
text = "by @o1egkl • github.com/o1egkl"

# Try loading a nice TrueType font from Windows Fonts
font_path = "C:/Windows/Fonts/arialbd.ttf"
if not os.path.exists(font_path):
    font_path = "C:/Windows/Fonts/segoeui.ttf"

font_size = int(w * 0.026)  # ~26px for 1024x1024
try:
    font = ImageFont.truetype(font_path, font_size)
except Exception:
    font = ImageFont.load_default()

# Measure text
bbox = draw.textbbox((0, 0), text, font=font)
text_w = bbox[2] - bbox[0]
text_h = bbox[3] - bbox[1]

# Position: bottom center or bottom right with a small stylish pill
margin_bottom = int(h * 0.05)
x = (w - text_w) // 2
y = h - margin_bottom - text_h

# Draw a sleek semi-transparent pill backdrop with emerald border
pill_pad_x = 18
pill_pad_y = 6
pill_bbox = [x - pill_pad_x, y - pill_pad_y, x + text_w + pill_pad_x, y + text_h + pill_pad_y]

# Semi-transparent dark pill background
draw.rounded_rectangle(pill_bbox, radius=12, fill=(15, 23, 42, 190), outline=(16, 185, 129, 140), width=2)

# Text in bright crisp emerald/cyan
draw.text((x, y), text, font=font, fill=(52, 211, 153, 230))

# Composite overlay
watermarked = Image.alpha_composite(img, overlay)

# Save high-res master
artifact_path = r'D:\Users\o1egk\.gemini\antigravity\brain\e49d7e25-6d9e-4e29-a1d0-be5303219f64\chess_coach_logo_watermarked.png'
watermarked.save(artifact_path, 'PNG')
print(f"Saved watermarked master to: {artifact_path}")

# Target 1: Public web directory
public_dir = r'D:\agravity\chess-coach\public'
os.makedirs(public_dir, exist_ok=True)
watermarked.save(os.path.join(public_dir, 'chess-coach-logo.png'), 'PNG')
watermarked.resize((256, 256), Image.Resampling.LANCZOS).save(os.path.join(public_dir, 'chess-coach-logo-256.png'), 'PNG')
watermarked.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(public_dir, 'chess-coach-logo-512.png'), 'PNG')
print("Public logos updated.")

# Target 2: Android Mipmaps
android_res = r'D:\agravity\chess-coach\android\app\src\main\res'
densities = {
    'mipmap-mdpi': 48,
    'mipmap-hdpi': 72,
    'mipmap-xhdpi': 96,
    'mipmap-xxhdpi': 144,
    'mipmap-xxxhdpi': 192
}

for folder, size in densities.items():
    folder_path = os.path.join(android_res, folder)
    os.makedirs(folder_path, exist_ok=True)
    resized = watermarked.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(os.path.join(folder_path, 'ic_launcher.png'), 'PNG')
    resized.save(os.path.join(folder_path, 'ic_launcher_round.png'), 'PNG')
    fg_size = int(size * 108 / 48)
    resized_fg = watermarked.resize((fg_size, fg_size), Image.Resampling.LANCZOS)
    resized_fg.save(os.path.join(folder_path, 'ic_launcher_foreground.png'), 'PNG')

print("Android mipmaps updated.")
