from pathlib import Path
from PIL import Image, ImageOps

frame_dir = Path('assets/demo/frames')
output = Path('assets/demo/vertical-saas-radar.gif')
files = sorted(frame_dir.glob('*.png'))

if len(files) < 4:
    raise SystemExit('expected at least four captured frames')

frames = []
for path in files:
    image = Image.open(path).convert('RGB')
    fitted = ImageOps.fit(image, (960, 600), method=Image.Resampling.LANCZOS)
    frames.append(fitted)

frames[0].save(
    output,
    save_all=True,
    append_images=frames[1:],
    duration=[1400, 1500, 1700, 1500],
    loop=0,
    optimize=True,
)

print(f'wrote {output} ({output.stat().st_size} bytes)')
