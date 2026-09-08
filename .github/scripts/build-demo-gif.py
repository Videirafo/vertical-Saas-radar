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
    # Quantize every frame consistently and disable GIF optimization below so
    # visually similar browser states are preserved as separate demo steps.
    frames.append(fitted.quantize(colors=128, method=Image.Quantize.MEDIANCUT))

frames[0].save(
    output,
    save_all=True,
    append_images=frames[1:],
    duration=[1400, 1500, 1700, 1500],
    loop=0,
    optimize=False,
    disposal=2,
)

with Image.open(output) as gif:
    if getattr(gif, 'n_frames', 1) != len(frames):
        raise SystemExit(f'expected {len(frames)} GIF frames, got {getattr(gif, "n_frames", 1)}')

print(f'wrote {output} ({output.stat().st_size} bytes, {len(frames)} frames)')
