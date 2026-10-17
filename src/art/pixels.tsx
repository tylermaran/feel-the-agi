import type { CSSProperties, ReactNode } from 'react';
import type { GameState } from '../game/types';
import { PEOPLE, engLook } from '../game/people';
import { Character } from './Sprite';

export function R({
  x,
  y,
  w,
  h,
  c,
  className,
  style,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  c: string;
  className?: string;
  style?: CSSProperties;
}) {
  return <rect x={x} y={y} width={w} height={h} fill={c} className={className} style={style} />;
}

export function Blink({ x, y, c, delay = 0, w = 1, h = 1 }: { x: number; y: number; c: string; delay?: number; w?: number; h?: number }) {
  return <rect x={x} y={y} width={w} height={h} fill={c} className="blink" style={{ animationDelay: `${delay}ms` }} />;
}

export function Sparkle({ x, y }: { x: number; y: number }) {
  return (
    <g className="sparkle" transform={`translate(${x},${y})`} pointerEvents="none">
      <rect x={1} y={0} width={1} height={3} fill="#ffd23f" />
      <rect x={0} y={1} width={3} height={1} fill="#ffd23f" />
    </g>
  );
}

export function Hotspot({
  x,
  y,
  w,
  h,
  onClick,
  children,
  spark = true,
}: {
  x: number;
  y: number;
  w: number;
  h: number;
  onClick: () => void;
  children?: ReactNode;
  spark?: boolean;
}) {
  return (
    <g className="hotspot" onClick={onClick}>
      {children}
      <rect x={x - 1} y={y - 1} width={w + 2} height={h + 2} fill="transparent" className="hot-outline" />
      {spark && <Sparkle x={x + w - 2} y={y - 2} />}
    </g>
  );
}

export interface SceneProps {
  s: GameState;
  onItem: (id: string) => void;
  onPerson: (id: string) => void;
}

export interface Slot {
  x: number;
  y: number;
}

export function Crowd({
  s,
  slots,
  perGeneric,
  onPerson,
}: {
  s: GameState;
  slots: Slot[];
  perGeneric: number;
  onPerson: (id: string) => void;
}) {
  const named = s.team.filter((id) => PEOPLE[id]);
  const placed: { key: string; id?: string; look: ReturnType<typeof engLook>; x: number; y: number; flip: boolean }[] = [];
  named.slice(0, slots.length).forEach((id, i) => {
    const sl = slots[i];
    placed.push({ key: id, id, look: PEOPLE[id].look, x: sl.x, y: sl.y, flip: sl.x > 64 });
  });
  const extraHeads = Math.max(0, s.eng - named.length);
  const generic = Math.min(slots.length - placed.length, Math.ceil(extraHeads / perGeneric));
  for (let i = 0; i < generic; i++) {
    const sl = slots[placed.length];
    placed.push({ key: `eng${i}`, look: engLook(i), x: sl.x, y: sl.y, flip: sl.x > 64 });
  }
  placed.sort((a, b) => a.y - b.y);
  return (
    <>
      {placed.map((p, i) => (
        <Character
          key={p.key}
          look={p.look}
          x={p.x}
          y={p.y}
          flip={p.flip}
          delay={(i * 230) % 900}
          onClick={() => onPerson(p.id ?? 'eng')}
        />
      ))}
    </>
  );
}
