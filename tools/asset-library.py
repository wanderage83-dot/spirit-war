#!/usr/bin/env python3
"""Build the portable art catalogue, or pack images + catalogue with original paths."""
import argparse
import hashlib
import json
import re
import zipfile
from collections import Counter
from pathlib import Path
from PIL import Image

ROOT = Path(__file__).resolve().parent.parent
LIB = ROOT / 'asset-library'
FACTIONS = {'qing': '청룡', 'xuan': '현무', 'bai': '백호', 'zhu': '주작', 'gui': '귀왕'}
UNITS = {'shield': '방패병', 'bow': '궁병', 'spear': '창병', 'horse': '기병'}
DIRS = {'fr': '앞 오른쪽', 'fl': '앞 왼쪽', 'br': '뒤 오른쪽', 'bl': '뒤 왼쪽'}
CATEGORIES = {'hd': 'HD 전장 지형·건물', 'world': '천하도', 'undead': '망자군 병사',
              'portrait': '인물 초상', 'character': '인물 SD', 'pixel': '장수 도트·방향·걷기',
              'outfit': '진영 의상 변형', 'soldier': '일반 병사·방향·걷기',
              'story': '서막·대화 배경', 'terrain': '기존 지형', 'prop': '수레·소품', 'effect': '전투 효과'}
LABELS = {'ground': '흙바닥', 'road': '길', 'field': '들판', 'bush': '덤불', 'stone': '돌마당',
          'water': '수면', 'marsh': '습지', 'paddy': '논', 'hill': '고지', 'bank': '물가 돌',
          'cliff-top': '절벽 위 고원', 'cliff-face': '절벽 면', 'gorge': '협곡 바닥',
          'ridge': '능선 바위', 'canopy': '숲 수관', 'prop-willow': '버드나무',
          'prop-reeds': '갈대', 'prop-boulder': '이끼 바위', 'prop-bamboo-clump': '대숲',
          'house': '마을 집', 'keep': '본진', 'tower': '망루', 'wall': '성벽',
          'wall-corner': '성벽 모서리', 'facility-shield': '방패 훈련장',
          'facility-spear': '창 훈련장', 'facility-bow': '궁술 시설', 'facility-horse': '마구간',
          'supply-depot': '보급소', 'pass-gate': '관문', 'palisade': '목책',
          'outpost': '전진 거점', 'ghost-gate': '귀문', 'beacon': '봉화대', 'atlas': '담채 천하도'}


def image_paths():
    paths = [ROOT / (name + '.webp') for name in ['hero', *UNITS]]
    for folder in ['characters', 'portraits', 'terrain', 'story', 'fc', 'fx']:
        paths.extend(p for p in (ROOT / folder).rglob('*') if p.suffix.lower() in {'.png', '.webp', '.jpg', '.jpeg'})
    return sorted({p for p in paths if p.is_file()})


def build():
    people = json.loads((ROOT / 'ASSET_MANIFEST.json').read_text())
    by_path = {p[k]: p for p in people for k in ['portrait', 'sprite']}
    by_key = {Path(p['sprite']).stem: p for p in people}
    entries = []
    for p in image_paths():
        path = p.relative_to(ROOT).as_posix()
        parts = path.split('/')
        stem = p.stem
        key = parts[-2] if '/walk/' in path or '/dir/' in path else stem
        person = by_path.get(path) or by_key.get(key)
        category = ('outfit' if path.startswith('fc/') else 'hd' if path.startswith('terrain/hd/')
                    else 'world' if path.startswith('terrain/realm/') else 'undead' if '/soldier-gui/' in path
                    else 'soldier' if '/soldier-' in path or stem in UNITS and '/' not in path
                    else 'pixel' if '/pixel/' in path else 'portrait' if path.startswith('portraits/')
                    else 'prop' if '/props/' in path else 'character' if path.startswith('characters/') or stem == 'hero'
                    else 'story' if path.startswith('story/') else 'effect' if path.startswith('fx/') else 'terrain')
        faction = person.get('faction', '') if person else ''
        if category == 'undead':
            faction = 'gui'
        elif category == 'hd':
            faction = 'gui' if stem.startswith('gui-') else 'qing'
        kind = next((n for n in UNITS if re.search(r'(^|[/\-])' + n + r'([/\-]|$)', path)), '')
        direction = ''
        frame = None
        match = re.search(r'(?:^|-)(fr|fl|br|bl)(?:-(\d+))?$', stem)
        if match:
            direction, frame = match[1], int(match[2]) if match[2] else None
        elif category in {'character', 'pixel', 'outfit', 'soldier'} and not '/props/' in path:
            direction = 'fl' if key in {'gui-ruler', 'zhu-ruler'} else 'fr'
        name = person['name'] if person else UNITS.get(kind, stem)
        note = ''
        layout = None
        doc = 'ASSETS.md'
        if category == 'hd':
            stripped = re.sub(r'^(qing|gui|ally)-', '', stem)
            name = LABELS.get(stripped, stem)
            doc = 'terrain/hd/README.md'
            if '-prop-' in stem:
                layout = {'columns': 4, 'rows': 1, 'cell_width': 512, 'cell_height': 512, 'base_y_exclusive': 496}
                note = '같은 종류의 변형 4칸. 애니메이션 시트가 아닙니다.'
            elif stem == 'qing-cliff-face':
                note = '아랫선 약 32.71도. 목표 35.26도에 맞춘 각도·끝점 보정 필요.'
            elif stripped in {'ground', 'road', 'field', 'bush', 'stone', 'water', 'marsh', 'paddy', 'hill', 'bank', 'cliff-top', 'gorge', 'ridge', 'canopy'}:
                note = '위에서 본 바닥 타일. 게임에서 투영. 실제 배율에서 반복 경계 확인.'
            else:
                note = '세워 쓰는 등각 소품. 발밑 여백·기준점은 사용 문서 참고.'
        elif category == 'world':
            name, doc = '담채 천하도', 'terrain/realm/README.md'
        elif category == 'undead':
            name = '망자군 ' + UNITS[kind]
            doc = 'characters/soldier-gui/README.md'
            note = '생성 PNG 전달본' if '/raw/' in path else '게임용 WebP. 진영색을 덧입히지 않음.'
        elif category == 'effect':
            doc, note = 'fx/LICENSE-pixelfx.txt', 'pixelfx 렌더 효과. MIT 라이선스 동봉.'
        elif category == 'story':
            name = {'four-kingdoms': '서막 · 네 나라', 'undying-command': '서막 · 죽은 왕의 명령',
                    'departure': '서막 · 출정', 'dialogue-palace': '대화 · 왕성', 'dialogue-camp': '대화 · 진영',
                    'dialogue-field': '대화 · 들판', 'dialogue-forest': '대화 · 숲',
                    'dialogue-frontier': '대화 · 국경'}.get(stem, stem)
        if frame is not None:
            note = f'걷기 {frame}/4. 같은 이름·방향의 1~4번 파일을 함께 사용.'
        with Image.open(p) as im:
            w, h = im.size
            alpha = im.convert('RGBA').getchannel('A')
            transparent = alpha.getextrema()[0] < 255
            bbox = alpha.point(lambda a: 255 if a > 8 else 0).getbbox()
        entries.append({'path': path, 'name': name, 'category': category, 'faction': faction,
                        'width': w, 'height': h, 'format': p.suffix[1:].upper(), 'transparent': transparent,
                        'alpha_bbox': list(bbox) if bbox else None, 'bytes': p.stat().st_size,
                        'direction': direction, 'direction_name': DIRS.get(direction, ''), 'frame': frame,
                        'layout': layout, 'note': note, 'doc': doc,
                        'recent': category in {'hd', 'world', 'undead'},
                        'pixel': category == 'pixel' or category == 'hd' or '/pixel/' in path,
                        'sha256': hashlib.sha256(p.read_bytes()).hexdigest()})
    order = list(CATEGORIES)
    entries.sort(key=lambda e: (order.index(e['category']), e['name'], e['path']))
    content = json.dumps(entries, ensure_ascii=False, separators=(',', ':'))
    data = {'version': 1, 'image_count': len(entries), 'total_bytes': sum(e['bytes'] for e in entries),
            'asset_tree_sha256': hashlib.sha256(content.encode()).hexdigest(), 'categories': CATEGORIES,
            'factions': FACTIONS, 'assets': entries}
    LIB.mkdir(exist_ok=True)
    encoded = json.dumps(data, ensure_ascii=False, separators=(',', ':'))
    (LIB / 'catalog.json').write_text(encoded + '\n')
    (LIB / 'catalog.js').write_text('window.ASSET_LIBRARY=' + encoded + ';\n')
    print(json.dumps({'images': len(entries), 'MiB': round(data['total_bytes'] / 1048576, 2),
                      'categories': dict(Counter(e['category'] for e in entries))}, ensure_ascii=False))
    return data


def pack(data, output, collection):
    selected = [e for e in data['assets'] if collection == 'all' or e['recent']]
    files = {e['path'] for e in selected}
    files.update(['asset-library/index.html', 'asset-library/catalog.js', 'asset-library/catalog.json',
                  'asset-library/README.md', 'ASSET_MANIFEST.json', 'ASSETS.md', 'ART_REQUESTS.md',
                  'terrain/hd/README.md', 'terrain/hd/qing-second-manifest.json',
                  'terrain/hd/qing-third-manifest.json', 'terrain/realm/README.md',
                  'characters/soldier-gui/README.md', 'fx/LICENSE-pixelfx.txt', 'tools/asset-library.py'])
    dest = Path(output).resolve()
    if dest.is_relative_to(ROOT):
        raise SystemExit('ZIP은 저장소 밖 경로에 저장하세요. 예: /workspace/exports/spirit-war-art.zip')
    dest.parent.mkdir(parents=True, exist_ok=True)
    packed_data = {**data, 'image_count': len(selected), 'total_bytes': sum(e['bytes'] for e in selected),
                   'asset_tree_sha256': hashlib.sha256(json.dumps(selected, ensure_ascii=False, separators=(',', ':')).encode()).hexdigest(),
                   'assets': selected}
    with zipfile.ZipFile(dest, 'w', compression=zipfile.ZIP_DEFLATED, compresslevel=6) as z:
        for rel in sorted(files):
            if (ROOT / rel).is_file() and rel not in {'asset-library/catalog.js', 'asset-library/catalog.json'}:
                z.write(ROOT / rel, 'spirit-war-art/' + rel)
        encoded = json.dumps(packed_data, ensure_ascii=False, separators=(',', ':'))
        z.writestr('spirit-war-art/asset-library/catalog.json', encoded + '\n')
        z.writestr('spirit-war-art/asset-library/catalog.js', 'window.ASSET_LIBRARY=' + encoded + ';\n')
        z.writestr('spirit-war-art/OPEN-ME.txt', 'asset-library/index.html을 브라우저로 열면 됩니다. 파일 경로를 유지한 채 다른 프로젝트에 복사할 수 있습니다.\n')
    print(f'ZIP: {dest} ({dest.stat().st_size / 1048576:.2f} MiB, {len(selected)} images)')


if __name__ == '__main__':
    parser = argparse.ArgumentParser(description=__doc__)
    parser.add_argument('command', choices=['build', 'pack'])
    parser.add_argument('--collection', choices=['all', 'recent'], default='all')
    parser.add_argument('--output')
    args = parser.parse_args()
    if args.command == 'pack' and not args.output:
        parser.error('pack에는 --output ZIP경로가 필요합니다.')
    data = build()
    if args.command == 'pack':
        pack(data, args.output, args.collection)
