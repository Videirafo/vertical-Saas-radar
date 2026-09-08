from pathlib import Path
from PIL import Image, ImageDraw, ImageFont, ImageOps

frame_dir = Path('assets/demo/frames')
output = Path('assets/demo/vertical-saas-radar.gif')
files = sorted(frame_dir.glob('*.png'))
labels = ['Overview', 'Summary', 'Signals', 'Watchlist']

if len(files) != len(labels):
    raise SystemExit(f'expected {len(labels)} captured frames, got {len(files)}')

frames = []
font = ImageFont.load_default(size=18)

for path, label in zip(files, labels, strict=True):
    image = Image.open(path).convert('RGB')
    fitted = ImageOps.fit(image, (960, 600), method=Image.Resampling.LANCZOS)

    # A restrained step label makes the walkthrough understandable on its own
    # and guarantees that every verified browser state remains a distinct GIF frame.
    draw = ImageDraw.Draw(fitted)
    box = draw.textbbox((0, 0), label, font=font)
    width = box[2] - box[0]
    height = box[3] - box[1]
    x = 960 - width - 28
    y = 600 - height - 24
    draw.rounded_rectangle((x - 12, y - 8, x + width + 12, y + height + 8), radius=8, fill=(12, 14, 17))
    draw.text((x, y), label, font=font, fill=(242, 244, 247))

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
    actual_frames = getattr(gif, 'n_frames', 1)
    if actual_frames != len(frames):
        raise SystemExit(f'expected {len(frames)} GIF frames, got {actual_frames}')

print(f'wrote {output} ({output.stat().st_size} bytes, {len(frames)} frames)')
