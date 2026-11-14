#!/usr/bin/env python3
"""Export approved static masters without mirroring, repainting or recoloring.

Requires Pillow and NumPy. Run from any directory. Masters remain untouched.
Head-top landmarks are source-image coordinates, ordered fr/fl/br/bl. They
exclude spear/staff/bow tips when those rise above the character's head.
"""
import hashlib
import json
from pathlib import Path

import numpy as np
from PIL import Image

ROOT = Path(__file__).resolve().parent
DIRECTIONS = ('fr', 'fl', 'br', 'bl')
HEAD_TOPS = {
    'hero': (98, 54, 107, 99),
    'xuan-ruler': (15, 10, 8, 20),
    'bai-ruler': (10, 10, 26, 10),
    'zhu-ruler': (5, 5, 17, 17),
    'gui-ruler': (5, 20, 8, 8),
    'unhak': (30, 20, 20, 100),
    'dansim': (110, 80, 97, 97),
    'mukcheol': (55, 25, 35, 30),
    'seolhwa': (33, 24, 12, 25),
    'yeonbaek': (12, 20, 40, 35),
    'dogyeom': (15, 12, 10, 10),
    'hoyeon': (21, 51, 35, 25),
    'eunrang': (10, 55, 55, 20),
    'sayul': (25, 25, 20, 10),
    'biyeon': (10, 10, 10, 10),
    'hongyeom': (30, 40, 20, 20),
    'haerin': (10, 15, 100, 30),
    'heukcheol': (85, 75, 115, 5),
    'mujin': (40, 40, 25, 25),
    'baekryun': (2, 4, 12, 8),
}
CAVALRY = {'hoyeon', 'sayul', 'biyeon'}
# This sword extends below the boots: never use its tip as the foot anchor.
FOOT_OVERRIDES = {('gui-ruler', 'fr'): (612.5, 1184)}


def digest(path):
    return hashlib.sha256(path.read_bytes()).hexdigest()


def main():
    inventory = json.loads((ROOT / 'manifest.json').read_text())
    known_hashes = {row['file']: row['sha256'] for row in inventory['images']}
    records = []
    for name, head_tops in HEAD_TOPS.items():
        size = 384 if name in CAVALRY else 256
        margin = size // 32  # 8px infantry, 12px cavalry
        baseline = size - size // 16 - 1  # y=239 or y=359
        if name == 'gui-ruler':
            baseline = 223  # extra room below the boots for the lowered sword
        center_x = (size - 1) / 2
        poses = []
        for direction, head_top in zip(DIRECTIONS, head_tops):
            source = ROOT / name / f'{name}-{direction}.png'
            relative = source.relative_to(ROOT).as_posix()
            assert digest(source) == known_hashes[relative], source
            im = Image.open(source).convert('RGBA')
            alpha = np.asarray(im.getchannel('A'))
            visible = alpha >= 16
            ys, xs = np.where(visible)
            bbox = (int(xs.min()), int(ys.min()), int(xs.max()) + 1,
                    int(ys.max()) + 1)
            foot_y = bbox[3] - 1
            # The lowest solid band measures the support footprint, not the
            # center of the weapon/cape-inclusive image bounding box.
            band = (alpha[max(0, foot_y - 48):foot_y + 1] >= 128)
            cols = np.flatnonzero(band.any(axis=0))
            foot_x = (int(cols.min()) + int(cols.max())) / 2
            if (name, direction) in FOOT_OVERRIDES:
                foot_x, foot_y = FOOT_OVERRIDES[(name, direction)]
            body_height = foot_y - head_top
            assert body_height > 0
            poses.append((source, im, bbox, foot_x, foot_y, body_height,
                          head_top, direction))

        # A shared displayed head-to-foot height across all four poses.
        # Reduce that height for the WHOLE character if any pose's equipment
        # would otherwise touch the canvas, rather than crop that equipment.
        display_height = size * .84
        for _, _, box, ax, ay, body_height, _, _ in poses:
            constraints = (
                ((center_x - margin), ax - box[0] + 2),
                ((size - 1 - margin - center_x), box[2] - ax + 2),
                ((baseline - margin), ay - box[1] + 2),
                ((size - 1 - margin - baseline), box[3] - ay + 2),
            )
            for room, extent in constraints:
                if extent > 0:
                    display_height = min(display_height,
                                         room * body_height / extent)

        for source, im, box, ax, ay, body_height, head_top, direction in poses:
            scale = display_height / body_height
            tx = center_x - scale * ax
            ty = baseline - scale * ay
            # Premultiplied alpha avoids colored/dark fringes at transparent
            # edges. This is a scale+translation only, with no reflection.
            result = im.convert('RGBa').transform(
                (size, size), Image.Transform.AFFINE,
                (1 / scale, 0, -tx / scale, 0, 1 / scale, -ty / scale),
                resample=Image.Resampling.BICUBIC,
            ).convert('RGBA')
            dest = ROOT / 'exports' / name / f'{name}-{direction}.png'
            dest.parent.mkdir(parents=True, exist_ok=True)
            result.save(dest, optimize=True)
            a = np.asarray(result.getchannel('A'))
            yy, xx = np.where(a >= 16)
            outbox = [int(xx.min()), int(yy.min()), int(xx.max()) + 1,
                      int(yy.max()) + 1]
            assert result.mode == 'RGBA' and result.size == (size, size)
            assert a.min() == 0 and a.max() == 255
            assert min(outbox[:2]) >= margin - 1, dest
            assert outbox[2] <= size - margin + 1, dest
            assert outbox[3] <= size - margin + 1, dest
            if (name, direction) not in FOOT_OVERRIDES:
                assert abs((outbox[3] - 1) - baseline) <= 1, dest
            # Some props extend below the feet; verify the feet themselves
            # still meet their baseline within the central footprint area.
            assert (a[baseline-1:baseline+2, size//4:3*size//4] >= 16).any(), dest
            assert digest(source) == known_hashes[source.relative_to(ROOT).as_posix()]
            records.append({
                'name': name, 'direction': direction,
                'file': dest.relative_to(ROOT).as_posix(),
                'source': source.relative_to(ROOT).as_posix(),
                'size': [size, size], 'mode': result.mode,
                'sha256': digest(dest), 'source_sha256': digest(source),
                'source_visible_bbox_alpha16': list(box),
                'visible_bbox_alpha16': outbox,
                'source_head_top_y': head_top,
                'source_foot_anchor': [ax, ay],
                'target_foot_anchor': [center_x, baseline],
                'display_head_to_foot_height': round(display_height, 4),
                'scale': scale, 'translation': [tx, ty],
            })
    assert len(records) == 80
    (ROOT / 'exports' / 'manifest.json').write_text(json.dumps({
        'count': len(records), 'infantry_size': [256, 256],
        'cavalry_size': [384, 384], 'cavalry': sorted(CAVALRY),
        'measurement_alpha_threshold': 16,
        'method': 'Uniform scale and translation only; premultiplied-alpha bicubic sampling. '
                  'Shared head-to-foot height per character; footprint-centered anchor. '
                  'No mirroring, recoloring, repainting or walk frames.',
        'images': records,
    }, ensure_ascii=False, indent=2) + '\n')
    print('Exported 80 RGBA PNGs: 68 infantry 256x256, 12 cavalry 384x384.')
    print('All source SHA-256 hashes unchanged; dimensions, margins and baselines checked.')


if __name__ == '__main__':
    main()
