import { Blink, Crowd, Hotspot, R } from './pixels';
import type { SceneProps } from './pixels';

const SLOTS = [
  { x: 58, y: 56 },
  { x: 32, y: 58 },
  { x: 84, y: 58 },
  { x: 46, y: 64 },
  { x: 70, y: 64 },
  { x: 20, y: 64 },
  { x: 96, y: 64 },
  { x: 58, y: 72 },
];

const RACK_X = [2, 16, 30, 84, 98, 112];
const LED = ['#3ddc97', '#4cc9f0', '#3ddc97', '#ffd23f'];

function Rack({ x, lit, i }: { x: number; lit: boolean; i: number }) {
  return (
    <>
      <R x={x} y={8} w={13} h={38} c={lit ? '#262b40' : '#1b1e2c'} />
      <R x={x} y={8} w={1} h={38} c={lit ? '#3a4060' : '#24283a'} />
      <R x={x + 12} y={8} w={1} h={38} c="#151827" />
      {[0, 1, 2, 3, 4, 5].map((u) => (
        <g key={u}>
          <R x={x + 2} y={10 + u * 6} w={9} h={4} c={lit ? '#1a1d2e' : '#15172a'} />
          {lit ? (
            <>
              <Blink x={x + 3} y={11 + u * 6} c={LED[(i + u) % 4]} delay={(i * 137 + u * 53) % 1000} />
              <Blink x={x + 5} y={11 + u * 6} c={LED[(i + u + 1) % 4]} delay={(i * 71 + u * 211) % 1000} />
              <R x={x + 7} y={12 + u * 6} w={3} h={1} c="#2f3552" />
            </>
          ) : (
            <R x={x + 3} y={11 + u * 6} w={1} h={1} c="#333" />
          )}
        </g>
      ))}
    </>
  );
}

export function DataCenterScene({ s, onItem, onPerson }: SceneProps) {
  const litRacks = Math.max(1, Math.min(6, Math.ceil(s.gpus / 1700)));
  return (
    <>
      <R x={-100} y={-120} w={328} h={168} c="#161a2b" />
      {[-90, -60, -30].map((y) => (
        <R key={y} x={-100} y={y} w={328} h={2} c="#1d2236" />
      ))}
      {[-20, -50].map((y) => (
        <R key={y} x={-100} y={y} w={328} h={2} c="#3a3f55" />
      ))}
      <R x={-100} y={0} w={328} h={3} c="#0d0f1a" />
      <R x={-100} y={3} w={328} h={2} c="#e9c46a" />
      {[10, 40, 70, 100].map((x) => (
        <R key={x} x={x} y={5} w={1} h={3} c="#b89b4f" />
      ))}

      <Hotspot x={2} y={8} w={41} h={38} onClick={() => onItem('racks')} spark={false}>
        {RACK_X.slice(0, 3).map((x, i) => (
          <Rack key={x} x={x} lit={i < litRacks} i={i} />
        ))}
      </Hotspot>
      <Hotspot x={84} y={8} w={41} h={38} onClick={() => onItem('racks')} spark={false}>
        {RACK_X.slice(3).map((x, i) => (
          <Rack key={x} x={x} lit={i + 3 < litRacks} i={i + 3} />
        ))}
      </Hotspot>

      <Hotspot x={47} y={9} w={34} h={20} onClick={() => onItem('scaling')}>
        <R x={47} y={9} w={34} h={20} c="#0a0a12" />
        <R x={48} y={10} w={32} h={18} c="#0d1b2a" />
        <R x={50} y={26} w={28} h={1} c="#415a77" />
        <R x={50} y={12} w={1} h={14} c="#415a77" />
        {Array.from({ length: 12 }, (_, i) => (
          <R key={i} x={52 + i * 2} y={13 + i} w={2} h={1} c="#ff5c8a" />
        ))}
        <Blink x={76} y={24} c="#ffd23f" w={2} h={2} />
      </Hotspot>

      <Hotspot x={52} y={32} w={24} h={8} onClick={() => onItem('plaque')}>
        <R x={52} y={32} w={24} h={8} c="#8a6d12" />
        <R x={53} y={33} w={22} h={6} c="#c9a227" />
        <R x={55} y={34} w={18} h={1} c="#6b520c" />
        <R x={57} y={36} w={14} h={1} c="#6b520c" />
      </Hotspot>

      <R x={-100} y={46} w={328} h={134} c="#11131f" />
      <rect x={-100} y={46} width={328} height={3} fill="rgba(76,201,240,0.18)" />
      {[54, 62, 70, 78, 86, 94, 102, 110].map((y) => (
        <R key={y} x={-100} y={y} w={328} h={1} c="#1b1f30" />
      ))}
      {[-80, -64, -48, -32, -16, 0, 16, 32, 48, 64, 80, 96, 112, 128, 144, 160, 176, 192, 208].map((x) => (
        <R key={x} x={x} y={46} w={1} h={134} c="#1b1f30" />
      ))}

      <Hotspot x={2} y={58} w={14} h={16} onClick={() => onItem('cooling')}>
        <R x={2} y={58} w={14} h={16} c="#8d99ae" />
        <R x={2} y={58} w={14} h={1} c="#adb5c4" />
        <circle cx={9} cy={66} r={5} fill="#2b2d42" />
        <g className="spin" style={{ transformOrigin: '9px 66px' }}>
          <R x={8.5} y={61.5} w={1} h={9} c="#adb5c4" />
          <R x={4.5} y={65.5} w={9} h={1} c="#adb5c4" />
        </g>
      </Hotspot>

      {s.flags.api && (
        <Hotspot x={110} y={56} w={14} h={18} onClick={() => onItem('api')}>
          <R x={113} y={66} w={8} h={8} c="#3a3f55" />
          <R x={110} y={56} w={14} h={10} c="#1a1a24" />
          <R x={111} y={57} w={12} h={8} c="#0b3d2e" />
          <g className="flicker">
            <R x={112} y={58} w={7} h={1} c="#3ddc97" />
            <R x={112} y={60} w={9} h={1} c="#3ddc97" />
            <R x={112} y={62} w={5} h={1} c="#3ddc97" />
          </g>
        </Hotspot>
      )}

      <Crowd s={s} slots={SLOTS} perGeneric={15} onPerson={onPerson} />
    </>
  );
}
