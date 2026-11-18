from PIL import Image
import os

src_path = r'D:\Users\o1egk\.gemini\antigravity\brain\e49d7e25-6d9e-4e29-a1d0-be5303219f64\chess_coach_logo_1795016510035.jpg'
img = Image.open(src_path).convert('RGBA')

public_dir = r'D:\agravity\chess-coach\public'
os.makedirs(public_dir, exist_ok=True)
img.save(os.path.join(public_dir, 'chess-coach-logo.png'), 'PNG')
img.resize((256, 256), Image.Resampling.LANCZOS).save(os.path.join(public_dir, 'chess-coach-logo-256.png'), 'PNG')
img.resize((512, 512), Image.Resampling.LANCZOS).save(os.path.join(public_dir, 'chess-coach-logo-512.png'), 'PNG')
print('Public logos saved.')

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
    resized = img.resize((size, size), Image.Resampling.LANCZOS)
    resized.save(os.path.join(folder_path, 'ic_launcher.png'), 'PNG')
    resized.save(os.path.join(folder_path, 'ic_launcher_round.png'), 'PNG')
    fg_size = int(size * 108 / 48)
    resized_fg = img.resize((fg_size, fg_size), Image.Resampling.LANCZOS)
    resized_fg.save(os.path.join(folder_path, 'ic_launcher_foreground.png'), 'PNG')

print('Android mipmaps updated.')
