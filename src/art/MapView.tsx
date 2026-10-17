import { memo } from 'react';
import type { ReactElement } from 'react';
import type { GameState } from '../game/types';
import { Sprite } from './Sprite';
import type { Palette } from './Sprite';

const GRID = [
  '~~~^^^^~~~~~~~~^^^^^',
  '~~~~^^~~~~~~~~~.^^^^',
  '~~...~~~~~~~~~~..^^^',
  '~.....~~~~~~~~~..^^^',
  '~......~~~~~~~~..^^^',
  '~......~~~~~~~~...^^',
  '~~.....~~~~~~~~...^^',
  '~~......~~~~~~~...^^',
  '~~~.....~~~~~~....^^',
  '~~~......~~~~~....^^',
  '~~~^.....~~~~~....^^',
  '~~~^^.....~~~~....^^',
  '~~~^^......~~~....^^',
  '~~~^^.......~~....^^',
  '~~~^^^........~...^^',
  '~~~^^^............^^',
  '~~~~^^^...........^^',
];

const T = 8;
const W = GRID[0].length * T;
const H = GRID.length * T;

export type LocKind = 'hq' | 'vc' | 'shop' | 'rival';

export interface Loc {
  id: string;
  label: string;
  c: number;
  r: number;
  kind: LocKind;
  hqChapter?: number;
  icon: { grid: string[]; palette: Palette };
}

const ICONS = {
  garage: {
    grid: ['...RR...', '..RRRR..', '.RRRRRR.', 'RRRRRRRR', '.WWWWWW.', '.WDDDDW.', '.WDDDDW.', '.WDDDDW.'],
    palette: { R: '#c1440e', W: '#f2e8cf', D: '#8d92a8' },
  },
  pioneer: {
    grid: ['BBBBBBBB', 'BYBBYBBY', 'BBBBBBBB', 'BYBBYBBY', 'BBBBBBBB', 'BYBBYBBY', 'BBBDDBBB', 'BBBDDBBB'],
    palette: { B: '#8e3b2f', Y: '#ffd23f', D: '#3b2420' },
  },
  azure: {
    grid: ['..WWW...', '.WWWWWW.', 'WWWWWWWW', 'WWWWWWWW', '.KKKKKK.', '.KGKGKK.', '.KKKKKK.', '........'],
    palette: { W: '#f4f4f4', K: '#262b40', G: '#3ddc97' },
  },
  sandhill: {
    grid: ['..GGG...', '...G....', '..GGGG..', '.GGYGGG.', 'GGYYYGGG', 'GGGYGGGG', '.GGYGGG.', '..GGGG..'],
    palette: { G: '#2d6a4f', Y: '#ffd23f' },
  },
  nvidia: {
    grid: ['.L.L.L.', 'LGGGGGL', '.GKKKG.', 'LGKGKGL', '.GKKKG.', 'LGGGGGL', '.L.L.L.'],
    palette: { G: '#76b900', K: '#1a1a1a', L: '#bbbbbb' },
  },
  google: {
    grid: ['BBBBRRRR', 'BWBBRWRR', 'BBBBRRRR', 'YYYYGGGG', 'YWYYGWGG', 'YYYYGGGG', 'YYYDDGGG', 'YYYDDGGG'],
    palette: { B: '#4285f4', R: '#ea4335', Y: '#fbbc05', G: '#34a853', W: '#ffffff', D: '#333333' },
  },
  fair: {
    grid: ['FFFFFFFF', 'FWFFWFFW', 'FFFFFFFF', 'FWFFWFFW', 'FFFFFFFF', 'FWFFWFFW', 'FFFDDFFF', 'FFFDDFFF'],
    palette: { F: '#3b5998', W: '#9ec5ff', D: '#1d2b4a' },
  },
  deepmind: {
    grid: ['...TT...', '..TTTT..', '.TT..TT.', 'TT.TT.TT', 'TT.TT.TT', '.TT..TT.', '..TTTT..', '...TT...'],
    palette: { T: '#4cc9f0' },
  },
  msft: {
    grid: ['RRR.GGG', 'RRR.GGG', 'RRR.GGG', '.......', 'BBB.YYY', 'BBB.YYY', 'BBB.YYY'],
    palette: { R: '#f25022', G: '#7fba00', B: '#00a4ef', Y: '#ffb900' },
  },
  anthropic: {
    grid: ['..OOOO..', '.OOOOOO.', 'OOOAAOOO', 'OOAOOAOO', 'OOAAAAOO', 'OOAOOAOO', 'OOOOOOOO', 'OOODDOOO'],
    palette: { O: '#d4a27f', A: '#1a1a1a', D: '#6b4423' },
  },
};

export const LOCS: Loc[] = [
  { id: 'garage', label: 'GARAGE', c: 3, r: 3, kind: 'hq', hqChapter: 0, icon: ICONS.garage },
  { id: 'pioneer', label: 'PIONEER', c: 5, r: 5, kind: 'hq', hqChapter: 1, icon: ICONS.pioneer },
  { id: 'azure', label: 'AZURE', c: 10, r: 1, kind: 'hq', hqChapter: 2, icon: ICONS.azure },
  { id: 'anthropic', label: 'ANTHROPIC', c: 3, r: 7, kind: 'rival', icon: ICONS.anthropic },
  { id: 'msft', label: 'MICROSOFT', c: 16, r: 1, kind: 'rival', icon: ICONS.msft },
  { id: 'deepmind', label: 'DEEPMIND', c: 1, r: 11, kind: 'rival', icon: ICONS.deepmind },
  { id: 'sandhill', label: 'SAND HILL', c: 4, r: 13, kind: 'vc', icon: ICONS.sandhill },
  { id: 'fair', label: 'FB AI', c: 9, r: 13, kind: 'rival', icon: ICONS.fair },
  { id: 'google', label: 'GOOGLE', c: 9, r: 15, kind: 'rival', icon: ICONS.google },
  { id: 'nvidia', label: 'NVIDIA', c: 14, r: 15, kind: 'shop', icon: ICONS.nvidia },
];

export function visibleLocs(s: GameState) {
  return LOCS.filter((l) => l.id !== 'anthropic' || s.flags.anthropic);
}

function hash(c: number, r: number) {
  return ((c * 73856093) ^ (r * 19349663)) >>> 0;
}

const isWater = (c: number, r: number) => (GRID[r]?.[c] ?? '~') === '~';

const Terrain = memo(function Terrain() {
  const out: ReactElement[] = [];
  GRID.forEach((row, r) => {
    [...row].forEach((ch, c) => {
      const x = c * T;
      const y = r * T;
      const h = hash(c, r);
      const k = `${c}-${r}`;
      if (ch === '~') {
        out.push(<rect key={k} x={x} y={y} width={T} height={T} fill="#2b59c3" />);
        if (h % 3 === 0)
          out.push(
            <rect
              key={k + 'w'}
              x={x + (h % 5)}
              y={y + ((h >> 3) % 6)}
              width={3}
              height={1}
              fill="#5a86e8"
              className="blink"
              style={{ animationDelay: `${h % 1500}ms` }}
            />,
          );
        return;
      }
      out.push(<rect key={k} x={x} y={y} width={T} height={T} fill={ch === '^' ? '#5a9e3a' : '#7ec850'} />);
      if (ch === '^') {
        const tx = x + 1 + (h % 3);
        const ty = y + 1 + ((h >> 2) % 2);
        out.push(
          <g key={k + 't'}>
            <rect x={tx + 1} y={ty} width={2} height={1} fill="#2d6a4f" />
            <rect x={tx} y={ty + 1} width={4} height={2} fill="#2d6a4f" />
            <rect x={tx + 1} y={ty + 3} width={2} height={1} fill="#6b4423" />
          </g>,
        );
      } else if (h % 4 === 0) {
        out.push(<rect key={k + 's'} x={x + (h % 6)} y={y + ((h >> 4) % 6)} width={1} height={1} fill="#6ab03e" />);
      }
      if (isWater(c - 1, r)) out.push(<rect key={k + 'l'} x={x} y={y} width={1} height={T} fill="#e9d8a6" />);
      if (isWater(c + 1, r)) out.push(<rect key={k + 'r'} x={x + T - 1} y={y} width={1} height={T} fill="#e9d8a6" />);
      if (isWater(c, r - 1)) out.push(<rect key={k + 'u'} x={x} y={y} width={T} height={1} fill="#e9d8a6" />);
      if (isWater(c, r + 1)) out.push(<rect key={k + 'd'} x={x} y={y + T - 1} width={T} height={1} fill="#e9d8a6" />);
    });
  });
  return (
    <>
      {out}
      <rect x={27} y={8} width={2} height={8} fill="#d1495b" />
      <rect x={26} y={9} width={4} height={1} fill="#d1495b" />
      <rect x={26} y={14} width={4} height={1} fill="#d1495b" />
      <rect x={56} y={36} width={64} height={1} fill="#c9ced6" />
      {[64, 80, 96, 112].map((x) => (
        <rect key={x} x={x} y={34} width={1} height={3} fill="#c9ced6" />
      ))}
    </>
  );
});

export function MapView({
  s,
  onLocation,
  interactive = true,
  fit = 'meet',
}: {
  s: GameState;
  onLocation?: (l: Loc) => void;
  interactive?: boolean;
  fit?: 'meet' | 'slice';
}) {
  const hqId = LOCS.find((l) => l.hqChapter === s.chapter)?.id;
  return (
    <svg viewBox={`0 0 ${W} ${H}`} className="map-svg" shapeRendering="crispEdges" preserveAspectRatio={`xMidYMid ${fit}`}>
      <Terrain />
      <g className="boat">
        <rect x={0} y={0} width={4} height={1} fill="#6b4423" />
        <rect x={1} y={-3} width={1} height={3} fill="#f4f4f4" />
        <rect x={2} y={-2} width={1} height={2} fill="#f4f4f4" />
      </g>
      <g className="plane">
        <rect x={0} y={0} width={5} height={1} fill="#f4f4f4" />
        <rect x={2} y={-1} width={1} height={3} fill="#f4f4f4" />
      </g>
      {visibleLocs(s).map((l) => {
        const x = l.c * T;
        const y = l.r * T;
        const locked = l.kind === 'hq' && (l.hqChapter ?? 0) > s.chapter;
        const isHq = l.id === hqId;
        const w = Math.max(...l.icon.grid.map((g) => g.length));
        return (
          <g
            key={l.id}
            className={interactive ? 'tappable map-loc' : undefined}
            onClick={interactive ? () => onLocation?.(l) : undefined}
            opacity={locked ? 0.45 : 1}
          >
            <rect x={x - 6} y={y - 8} width={20} height={20} fill="transparent" />
            <ellipse cx={x + 4} cy={y + 8.5} rx={5} ry={1.3} fill="rgba(0,0,0,0.3)" />
            <Sprite grid={l.icon.grid} palette={l.icon.palette} x={x + (8 - w) / 2} y={y} outline="#120f1c" />
            <text x={x + 4} y={y + 13.5} className="map-label" textAnchor="middle">
              {l.label}
            </text>
            {locked && (
              <text x={x + 4} y={y - 1.5} className="map-label" textAnchor="middle">
                🔒
              </text>
            )}
            {isHq && (
              <g className="hq-arrow">
                <rect x={x + 3} y={y - 6} width={3} height={2} fill="#ffd23f" />
                <rect x={x + 2} y={y - 4} width={5} height={1} fill="#ffd23f" />
                <rect x={x + 3} y={y - 3} width={3} height={1} fill="#ffd23f" />
                <rect x={x + 4} y={y - 2} width={1} height={1} fill="#ffd23f" />
              </g>
            )}
          </g>
        );
      })}
    </svg>
  );
}
