import { memo, useMemo } from 'react';
import type { Look } from '../game/people';

export type Palette = Record<string, string>;

interface PxRect {
  x: number;
  y: number;
  w: number;
  c: string;
}

function buildRects(grid: string[], palette: Palette, outline?: string): PxRect[] {
  const h = grid.length;
  const w = Math.max(...grid.map((r) => r.length));
  const filled = (x: number, y: number) => {
    if (y < 0 || y >= h || x < 0) return false;
    const ch = grid[y][x];
    return ch !== undefined && ch !== '.' && ch !== ' ' && palette[ch] !== undefined;
  };
  const colorAt = (x: number, y: number): string | null => {
    if (filled(x, y)) return palette[grid[y][x]];
    if (
      outline &&
      (filled(x - 1, y) || filled(x + 1, y) || filled(x, y - 1) || filled(x, y + 1))
    )
      return outline;
    return null;
  };
  const rects: PxRect[] = [];
  const pad = outline ? 1 : 0;
  for (let y = -pad; y < h + pad; y++) {
    let run: PxRect | null = null;
    for (let x = -pad; x <= w + pad; x++) {
      const c = x < w + pad ? colorAt(x, y) : null;
      if (run && run.c === c) {
        run.w++;
        continue;
      }
      if (run) rects.push(run);
      run = c ? { x, y, w: 1, c } : null;
    }
  }
  return rects;
}

interface SpriteProps {
  grid: string[];
  palette: Palette;
  x?: number;
  y?: number;
  outline?: string;
  flip?: boolean;
  className?: string;
  onClick?: () => void;
}

export const Sprite = memo(function Sprite({
  grid,
  palette,
  x = 0,
  y = 0,
  outline,
  flip,
  className,
  onClick,
}: SpriteProps) {
  const rects = useMemo(() => buildRects(grid, palette, outline), [grid, palette, outline]);
  const w = Math.max(...grid.map((r) => r.length));
  const t = flip ? `translate(${x + w},${y}) scale(-1,1)` : `translate(${x},${y})`;
  return (
    <g transform={t} className={className} onClick={onClick}>
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={r.y} width={r.w} height={1} fill={r.c} />
      ))}
    </g>
  );
});

const BASE = [
  '..........',
  '...SSSS...',
  '..SSSSSS..',
  '..SSSSSS..',
  '..SESSES..',
  '..SSSSSS..',
  '...SMMS...',
  '....SS....',
  '..CCCCCC..',
  '.CCCCCCCC.',
  '.CCCCCCCC.',
  '.SCCCCCCS.',
  '..CCCCCC..',
  '..PPPPPP..',
  '..PP..PP..',
  '..BB..BB..',
];

const HAIR: Record<Look['style'], string[]> = {
  short: ['...HHHH...', '..HHHHHH..', '..HHHHHH..', '..H....H..'],
  buzz: ['..........', '...HHHH...', '..H....H..'],
  beard: [
    '...HHHH...',
    '..HHHHHH..',
    '..HHHHHH..',
    '..H....H..',
    '..........',
    '..H....H..',
    '..HHMMHH..',
    '...HHHH...',
  ],
  baldSides: ['..........', '..........', '..H....H..', '..H....H..', '..H....H..'],
  swept: ['.HHHHHH...', '..HHHHHHH.', '..HHHHHH..', '..H....H..'],
  messy: ['..H.HH.H..', '.HHHHHHHH.', '.HHHHHHHH.', '..H....H..'],
  curly: [
    '.HHHHHHHH.',
    'HHHHHHHHHH',
    'HHHHHHHHHH',
    'HH......HH',
    'H........H',
    'H........H',
  ],
  mop: ['..HHHHHH..', '.HHHHHHHH.', '.HHHHHHHH.', '.HHHHHHHH.', '.H......H.'],
  long: [
    '...HHHH...',
    '..HHHHHH..',
    '.HHHHHHHH.',
    '.HH....HH.',
    '.H......H.',
    '.H......H.',
    '.HH....HH.',
    '.HH....HH.',
    '.H......H.',
    '.H......H.',
  ],
  bob: [
    '...HHHH...',
    '..HHHHHH..',
    '.HHHHHHHH.',
    '.HH....HH.',
    '.H......H.',
    '.H......H.',
    '.HH....HH.',
  ],
};

const OUTFIT: Record<string, Record<number, string>> = {
  suit: { 8: '....WW....', 9: '....WW....', 10: '....WW....' },
  suitTie: { 8: '....WW....', 9: '....TT....', 10: '....TT....', 11: '....TT....' },
  vest: {
    8: '..VV..VV..',
    9: '.CVVCCVVC.',
    10: '.CVVCCVVC.',
    11: '.SVVVVVVS.',
    12: '..VVVVVV..',
  },
  hoodie: { 8: '..DDDDDD..', 9: '.C..W.W.C.' },
  leather: { 8: '..DCCCCD..', 9: '.CDCCCCDC.', 10: '.CCDCCDCC.' },
  sweater: { 12: '..DDDDDD..' },
};

function overlay(base: string[], top: Record<number, string> | string[]): string[] {
  const out = base.map((r) => r.split(''));
  const entries = Array.isArray(top) ? top.map((r, i) => [i, r] as const) : Object.entries(top).map(([k, r]) => [Number(k), r] as const);
  for (const [y, row] of entries) {
    for (let x = 0; x < row.length; x++) {
      if (row[x] !== '.') out[y][x] = row[x];
    }
  }
  return out.map((r) => r.join(''));
}

function shade(hex: string, amt: number): string {
  const n = parseInt(hex.slice(1), 16);
  const f = (v: number) => Math.max(0, Math.min(255, Math.round(v + amt)));
  const r = f((n >> 16) & 255);
  const g = f((n >> 8) & 255);
  const b = f(n & 255);
  return `#${((r << 16) | (g << 8) | b).toString(16).padStart(6, '0')}`;
}

const cache = new Map<string, { grid: string[]; palette: Palette }>();

export function buildCharacter(look: Look): { grid: string[]; palette: Palette } {
  const key = JSON.stringify(look);
  const hit = cache.get(key);
  if (hit) return hit;
  let grid = BASE;
  if (look.outfit && OUTFIT[look.outfit]) grid = overlay(grid, OUTFIT[look.outfit]);
  grid = overlay(grid, HAIR[look.style]);
  if (look.glasses) grid = overlay(grid, { 4: '.GLEGGELG.' });
  const palette: Palette = {
    S: look.skin,
    E: '#1a1423',
    M: '#a0524d',
    H: look.hair,
    C: look.shirt,
    D: look.accent ?? shade(look.shirt, -35),
    P: look.pants ?? '#2f3b52',
    B: look.shoes ?? '#2a2a2a',
    W: '#f4f4f4',
    T: look.accent ?? '#c0392b',
    G: '#2a2a33',
    L: '#cfe8ff',
    V: look.accent ?? '#444c5c',
  };
  const out = { grid, palette };
  cache.set(key, out);
  return out;
}

export const OUTLINE = '#120f1c';

export function Character({
  look,
  x = 0,
  y = 0,
  flip,
  bob = true,
  delay = 0,
  onClick,
}: {
  look: Look;
  x?: number;
  y?: number;
  flip?: boolean;
  bob?: boolean;
  delay?: number;
  onClick?: () => void;
}) {
  const { grid, palette } = buildCharacter(look);
  return (
    <g transform={`translate(${x},${y})`} onClick={onClick} className={onClick ? 'tappable' : undefined}>
      {onClick && <rect x={-3} y={-3} width={16} height={22} fill="transparent" />}
      <ellipse cx={5} cy={16.5} rx={5} ry={1.2} fill="rgba(0,0,0,0.35)" />
      <g className={bob ? 'bob' : undefined} style={{ animationDelay: `${delay}ms` }}>
        <Sprite grid={grid} palette={palette} outline={OUTLINE} flip={flip} />
      </g>
    </g>
  );
}

export function Portrait({ look, size = 64 }: { look: Look; size?: number }) {
  return (
    <svg
      viewBox="-2 -2 14 20"
      width={size * 0.7}
      height={size}
      shapeRendering="crispEdges"
      className="portrait"
    >
      <Character look={look} bob />
    </svg>
  );
}
