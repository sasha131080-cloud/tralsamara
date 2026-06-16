import os

img_dir = os.path.join(os.path.dirname(__file__), 'img')

svgs = {
    'excavator-hitachi.svg': ('#1a3a5c', '#2d6a9f', 'Hitachi ZX200', 'Гусеничный экскаватор'),
    'excavator-jcb.svg': ('#1a4a3c', '#2d8a6f', 'JCB JS200W', 'Колёсный экскаватор'),
    'excavator-loader-jcb.svg': ('#5c3a1a', '#9f6a2d', 'JCB 4CX', 'Экскаватор-погрузчик'),
    'bulldozer-cat.svg': ('#3c1a3a', '#6f2d6a', 'Caterpillar D6R', 'Бульдозер'),
    'bulldozer-chtz.svg': ('#2a3a1a', '#5a7a2d', 'ЧТЗ Б10М', 'Бульдозер'),
    'dumper-kamaz.svg': ('#3a3a1a', '#7a7a2d', 'KамАЗ-65115', 'Самосвал'),
    'dumper-howo.svg': ('#3a1a1a', '#7a2d2d', 'HOWO 40т', 'Самосвал'),
    'crane-ks55713.svg': ('#1a2a3a', '#2d5a7a', 'КС-55713', 'Автокран 25т'),
    'crane-liebherr.svg': ('#1a1a3a', '#2d2d7a', 'Liebherr LTM 1055', 'Автокран 55т'),
    'trawl-40t.svg': ('#2a1a3a', '#5a2d7a', 'Трал 40т', 'Низкорамный'),
    'trawl-60t.svg': ('#3a1a2a', '#6a2d4a', 'Трал 60т', 'С аппарелями'),
    'loader-xcmg.svg': ('#1a3a2a', '#2d6a4a', 'XCMG ZL50', 'Фронтальный погрузчик'),
    'loader-manitou.svg': ('#2a3a2a', '#4a6a4a', 'Manitou', 'Телескопический погрузчик'),
}

for fname, (c1, c2, title, subtitle) in svgs.items():
    svg = f'''<svg xmlns="http://www.w3.org/2000/svg" width="800" height="600" viewBox="0 0 800 600">
  <defs>
    <linearGradient id="bg" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="{c1}"/>
      <stop offset="100%" stop-color="{c2}"/>
    </linearGradient>
    <linearGradient id="sh" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#ffffff" stop-opacity="0.1"/>
      <stop offset="100%" stop-color="#000000" stop-opacity="0.3"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#bg)"/>
  <rect width="800" height="600" fill="url(#sh)"/>
  <text x="400" y="300" font-family="Arial,sans-serif" font-size="36" font-weight="bold" fill="white" text-anchor="middle" dominant-baseline="middle">{title}</text>
  <text x="400" y="350" font-family="Arial,sans-serif" font-size="20" fill="rgba(255,255,255,0.7)" text-anchor="middle" dominant-baseline="middle">{subtitle}</text>
  <rect x="200" y="400" width="400" height="2" rx="1" fill="rgba(255,255,255,0.2)"/>
  <text x="400" y="430" font-family="Arial,sans-serif" font-size="13" fill="rgba(255,255,255,0.35)" text-anchor="middle" dominant-baseline="middle">ТралСамара — Спецтехника в аренду</text>
</svg>'''
    filepath = os.path.join(img_dir, fname)
    with open(filepath, 'w', encoding='utf-8') as f:
        f.write(svg)
    print(f'Created: {fname} | {title}')

print(f'\nAll {len(svgs)} SVG placeholders created in {img_dir}')
