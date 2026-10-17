import { Blink, Crowd, Hotspot, R } from './pixels';
import type { SceneProps } from './pixels';

const SLOTS = [
  { x: 58, y: 56 },
  { x: 34, y: 50 },
  { x: 78, y: 50 },
  { x: 20, y: 57 },
  { x: 92, y: 55 },
  { x: 44, y: 62 },
  { x: 72, y: 62 },
];

function Desk({ x, y, w }: { x: number; y: number; w: number }) {
  return (
    <>
      <R x={x} y={y} w={w} h={3} c="#8b5a2b" />
      <R x={x} y={y + 3} w={w} h={1} c="#5e3c1d" />
      <R x={x + 1} y={y + 4} w={2} h={10} c="#6b4423" />
      <R x={x + w - 3} y={y + 4} w={2} h={10} c="#6b4423" />
    </>
  );
}

function Crt({ x, y, on = true }: { x: number; y: number; on?: boolean }) {
  return (
    <>
      <R x={x} y={y} w={12} h={10} c="#cfc7b0" />
      <R x={x} y={y + 9} w={12} h={1} c="#a59f8a" />
      <R x={x + 1} y={y + 1} w={10} h={7} c={on ? '#0b3d2e' : '#222'} />
      {on && (
        <g className="flicker">
          <R x={x + 2} y={y + 2} w={6} h={1} c="#3ddc97" />
          <R x={x + 2} y={y + 4} w={4} h={1} c="#3ddc97" />
          <R x={x + 2} y={y + 6} w={7} h={1} c="#3ddc97" />
        </g>
      )}
      <R x={x + 4} y={y + 10} w={4} h={1} c="#8a8473" />
    </>
  );
}

function Tower({ x, y, lit, delay }: { x: number; y: number; lit: boolean; delay: number }) {
  return (
    <>
      <R x={x} y={y} w={6} h={12} c="#2b2b38" />
      <R x={x} y={y} w={1} h={12} c="#3d3d50" />
      <R x={x + 1} y={y + 2} w={4} h={1} c="#1a1a24" />
      <R x={x + 1} y={y + 4} w={4} h={1} c="#1a1a24" />
      {lit ? <Blink x={x + 4} y={y + 9} c="#3ddc97" delay={delay} /> : <R x={x + 4} y={y + 9} w={1} h={1} c="#444" />}
    </>
  );
}

export function GarageScene({ s, onItem, onPerson }: SceneProps) {
  const towers = 4;
  const litTowers = Math.min(towers, Math.ceil(Math.max(0, s.gpus - (s.flags.dgx ? 8 : 0)) / 1));
  return (
    <>
      <R x={-100} y={-120} w={328} h={176} c="#4f5d75" />
      {[-41, -32, -23, -14, -5, 13, 22, 31, 40, 49].map((y) => (
        <R key={y} x={-100} y={y} w={y < 0 ? 328 : 203} h={1} c="#47536b" />
      ))}
      <R x={-100} y={0} w={328} h={4} c="#2d3142" />
      <R x={-100} y={4} w={328} h={1} c="#3a3f55" />
      {[-60, -30, 158].map((x) => (
        <R key={x} x={x} y={-120} w={3} h={120} c="#3e4a60" />
      ))}

      <R x={-100} y={56} w={328} h={124} c="#5c5c70" />
      <R x={-100} y={56} w={328} h={2} c="#3e3e50" />
      <R x={20} y={67} w={6} h={1} c="#525265" />
      <R x={84} y={74} w={9} h={1} c="#525265" />
      <ellipse cx={66} cy={74} rx={9} ry={2} fill="#4c4c5e" />

      <g className="tappable" onClick={() => onItem('door')}>
        <R x={103} y={7} w={24} h={49} c="#2d3142" />
        <R x={104} y={8} w={22} h={45} c="#b8bccf" />
        {[13, 18, 23, 28, 33, 38, 43, 48].map((y) => (
          <R key={y} x={104} y={y} w={22} h={1} c="#8d92a8" />
        ))}
        <R x={113} y={50} w={4} h={1} c="#555" />
        <R x={104} y={53} w={22} h={3} c="#ffe8a3" />
      </g>
      <polygon points="104,58 126,58 128,68 100,68" fill="rgba(255,232,163,0.12)" />

      <R x={60} y={-120} w={1} h={131} c="#222" />
      <R x={59} y={11} w={3} h={3} c="#ffe066" />
      <circle cx={60.5} cy={13} r={12} fill="rgba(255,224,102,0.07)" className="glow" />

      <Hotspot x={5} y={12} w={22} h={16} onClick={() => onItem('whiteboard')}>
        <R x={5} y={12} w={22} h={16} c="#2d3142" />
        <R x={6} y={13} w={20} h={14} c="#f4f4f4" />
        <R x={8} y={15} w={6} h={1} c="#d1495b" />
        <R x={8} y={18} w={10} h={1} c="#3a86ff" />
        <R x={8} y={21} w={4} h={1} c="#3a86ff" />
        <R x={14} y={21} w={9} h={1} c="#2a9d8f" />
        <R x={8} y={24} w={7} h={1} c="#3a86ff" />
        <R x={19} y={15} w={5} h={4} c="#ffd23f" />
        <R x={6} y={27} w={20} h={1} c="#999" />
        <R x={9} y={26} w={3} h={1} c="#d1495b" />
      </Hotspot>

      <Hotspot x={32} y={9} w={14} h={19} onClick={() => onItem('paper')}>
        {s.flags.paper ? (
          <>
            <R x={32} y={9} w={14} h={19} c="#f7f3e8" />
            <R x={32} y={27} w={14} h={1} c="#cfc9b8" />
            <R x={34} y={11} w={10} h={1} c="#222" />
            <R x={35} y={13} w={8} h={1} c="#222" />
            <R x={34} y={15} w={10} h={1} c="#aaa" />
            <R x={35} y={17} w={3} h={3} c="#f4a261" />
            <R x={40} y={17} w={3} h={3} c="#f4a261" />
            <R x={37} y={21} w={4} h={2} c="#90caf9" />
            <R x={34} y={24} w={10} h={1} c="#bbb" />
            <R x={38} y={8} w={2} h={2} c="#d1495b" />
          </>
        ) : (
          <>
            <R x={32} y={9} w={14} h={19} c="#1d3557" />
            <R x={34} y={11} w={1} h={1} c="#fff" />
            <R x={43} y={13} w={1} h={1} c="#fff" />
            <R x={36} y={23} w={1} h={1} c="#fff" />
            <R x={38} y={12} w={2} h={8} c="#e63946" />
            <R x={37} y={18} w={4} h={2} c="#e63946" />
            <R x={38} y={13} w={2} h={2} c="#a8dadc" />
            <R x={38} y={20} w={2} h={2} c="#ffb703" className="blink" />
            <text x={39} y={26.5} fontSize={3} textAnchor="middle" fill="#ffd23f" className="px-text">
              AGI
            </text>
          </>
        )}
      </Hotspot>

      <R x={50} y={22} w={34} h={2} c="#7a5230" />
      <R x={52} y={24} w={1} h={3} c="#5e3c1d" />
      <R x={81} y={24} w={1} h={3} c="#5e3c1d" />
      <Hotspot x={52} y={13} w={30} h={9} onClick={() => onItem('boxes')}>
        <R x={52} y={16} w={8} h={6} c="#c8a165" />
        <R x={61} y={17} w={6} h={5} c="#b08850" />
        <R x={69} y={13} w={10} h={9} c="#c8a165" />
        <R x={71} y={16} w={6} h={2} c="#f4f4f4" />
        <R x={69} y={13} w={10} h={1} c="#a8803f" />
        <R x={80} y={18} w={2} h={4} c="#3ddc97" />
      </Hotspot>

      <Hotspot x={3} y={33} w={12} h={23} onClick={() => onItem('fridge')}>
        <R x={3} y={33} w={12} h={23} c="#d8dde6" />
        <R x={3} y={43} w={12} h={1} c="#a9b0bd" />
        <R x={13} y={36} w={1} h={5} c="#888" />
        <R x={13} y={46} w={1} h={6} c="#888" />
        <R x={5} y={36} w={3} h={3} c="#ff5c8a" />
        <R x={8} y={47} w={3} h={2} c="#4cc9f0" />
      </Hotspot>

      <Desk x={22} y={44} w={32} />
      <Desk x={58} y={44} w={32} />
      <Crt x={25} y={34} />
      <Crt x={62} y={34} />
      <Tower x={40} y={32} lit={litTowers > 0} delay={0} />
      <Tower x={47} y={32} lit={litTowers > 1} delay={300} />
      <Tower x={76} y={32} lit={litTowers > 2} delay={600} />
      <Tower x={83} y={32} lit={litTowers > 3} delay={150} />
      <R x={30} y={47} w={6} h={1} c="#ddd" />
      <R x={66} y={47} w={6} h={1} c="#ddd" />

      <Hotspot x={8} y={68} w={13} h={5} onClick={() => onItem('pizza')}>
        <R x={8} y={70} w={13} h={3} c="#c8a165" />
        <R x={9} y={68} w={12} h={2} c="#d9b57a" />
        <R x={12} y={69} w={2} h={1} c="#a8803f" />
        <R x={17} y={71} w={2} h={1} c="#d1495b" />
      </Hotspot>

      {s.flags.dgx && (
        <Hotspot x={106} y={62} w={16} h={9} onClick={() => onItem('dgx')}>
          <R x={106} y={62} w={16} h={9} c="#1a1a1a" />
          <R x={107} y={63} w={14} h={7} c="#c9a227" />
          <R x={107} y={65} w={14} h={1} c="#8a6d12" />
          <R x={107} y={67} w={14} h={1} c="#8a6d12" />
          <Blink x={120} y={69} c="#76b900" />
        </Hotspot>
      )}

      <Crowd s={s} slots={SLOTS} perGeneric={1} onPerson={onPerson} />
    </>
  );
}
