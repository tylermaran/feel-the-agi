import { Blink, Crowd, Hotspot, R } from './pixels';
import type { SceneProps } from './pixels';

const SLOTS = [
  { x: 58, y: 57 },
  { x: 30, y: 50 },
  { x: 86, y: 50 },
  { x: 44, y: 61 },
  { x: 72, y: 61 },
  { x: 16, y: 58 },
  { x: 102, y: 57 },
  { x: 88, y: 67 },
];

function Win({ x }: { x: number }) {
  return (
    <>
      <R x={x} y={7} w={26} h={28} c="#2b2b38" />
      <R x={x + 1} y={8} w={24} h={26} c="#8ecae6" />
      <R x={x + 1} y={8} w={24} h={8} c="#a9d6ec" />
      <R x={x + 2} y={22} w={5} h={12} c="#5c677d" />
      <R x={x + 8} y={18} w={4} h={16} c="#4a5468" />
      <R x={x + 13} y={24} w={6} h={10} c="#5c677d" />
      <R x={x + 20} y={20} w={4} h={14} c="#4a5468" />
      <R x={x + 3} y={24} w={1} h={1} c="#ffd23f" />
      <R x={x + 9} y={21} w={1} h={1} c="#ffd23f" />
      <R x={x + 15} y={27} w={1} h={1} c="#ffd23f" />
      <R x={x + 21} y={23} w={1} h={1} c="#ffd23f" />
      <R x={x + 12} y={8} w={2} h={26} c="#2b2b38" />
      <R x={x + 1} y={20} w={24} h={1} c="#2b2b38" />
      <R x={x - 1} y={34} w={28} h={2} c="#6e2a22" />
    </>
  );
}

function Monitor({ x, y }: { x: number; y: number }) {
  return (
    <>
      <R x={x} y={y} w={11} h={7} c="#1a1a24" />
      <R x={x + 1} y={y + 1} w={9} h={5} c="#264c8c" />
      <g className="flicker">
        <R x={x + 2} y={y + 2} w={5} h={1} c="#9ad1ff" />
        <R x={x + 2} y={y + 4} w={3} h={1} c="#9ad1ff" />
      </g>
      <R x={x + 5} y={y + 7} w={1} h={1} c="#1a1a24" />
    </>
  );
}

export function OfficeScene({ s, onItem, onPerson }: SceneProps) {
  return (
    <>
      <defs>
        <pattern id="brick" width={8} height={8} patternUnits="userSpaceOnUse">
          <rect width={8} height={8} fill="#8e3b2f" />
          <rect y={3} width={8} height={1} fill="#6e2a22" />
          <rect y={7} width={8} height={1} fill="#6e2a22" />
          <rect x={0} y={0} width={1} height={3} fill="#6e2a22" />
          <rect x={4} y={4} width={1} height={3} fill="#6e2a22" />
          <rect x={2} y={1} width={1} height={1} fill="#a24a3b" />
          <rect x={6} y={5} width={1} height={1} fill="#a24a3b" />
        </pattern>
      </defs>
      <rect x={-100} y={-120} width={328} height={172} fill="url(#brick)" />
      <R x={-100} y={0} w={328} h={3} c="#3b2420" />
      {[-40, -80].map((y) => (
        <R key={y} x={-100} y={y} w={328} h={3} c="#3b2420" />
      ))}
      {[20, 64, 108].map((x) => (
        <g key={x}>
          <R x={x} y={-120} w={1} h={126} c="#222" />
          <R x={x - 2} y={6} w={5} h={2} c="#2b2b38" />
          <R x={x - 1} y={8} w={3} h={1} c="#ffe066" />
        </g>
      ))}

      <Hotspot x={4} y={7} w={26} h={28} onClick={() => onItem('window')} spark={false}>
        <Win x={4} />
      </Hotspot>
      <Win x={98} />

      <Hotspot x={36} y={9} w={13} h={17} onClick={() => onItem('paper')}>
        <R x={36} y={9} w={13} h={17} c="#3b2420" />
        <R x={37} y={10} w={11} h={15} c="#f7f3e8" />
        <R x={38} y={12} w={9} h={1} c="#222" />
        <R x={39} y={14} w={7} h={1} c="#222" />
        <R x={39} y={17} w={3} h={3} c="#f4a261" />
        <R x={43} y={17} w={3} h={3} c="#f4a261" />
        <R x={40} y={21} w={5} h={2} c="#90caf9" />
      </Hotspot>

      <Hotspot x={52} y={9} w={13} h={17} onClick={() => onItem('dota')}>
        <R x={52} y={9} w={13} h={17} c="#1a1a1a" />
        <R x={53} y={10} w={11} h={15} c="#7a1f1f" />
        <R x={56} y={13} w={5} h={5} c="#e63946" />
        <R x={57} y={14} w={3} h={3} c="#1a1a1a" />
        <R x={55} y={20} w={7} h={1} c="#ffd23f" />
        <R x={56} y={22} w={5} h={1} c="#ffd23f" />
      </Hotspot>

      <Hotspot x={68} y={9} w={24} h={16} onClick={() => onItem('chart')}>
        <R x={68} y={9} w={24} h={16} c="#111" />
        <R x={69} y={10} w={22} h={13} c="#0d1b2a" />
        <R x={70} y={21} w={20} h={1} c="#415a77" />
        <R x={70} y={11} w={1} h={10} c="#415a77" />
        {[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
          <R key={i} x={72 + i * 2} y={20 - i} w={2} h={1} c="#3ddc97" />
        ))}
        <Blink x={89} y={11} c="#ff5c8a" />
        <R x={79} y={23} w={2} h={2} c="#222" />
      </Hotspot>

      {s.flags.gpt2 && (
        <Hotspot x={39} y={29} w={22} h={8} onClick={() => onItem('warning')}>
          <R x={39} y={29} w={22} h={8} c="#111" />
          <R x={40} y={30} w={20} h={6} c="#ffd23f" />
          <R x={42} y={31} w={3} h={4} c="#111" />
          <R x={43} y={32} w={1} h={1} c="#ffd23f" />
          <R x={47} y={31} w={11} h={1} c="#111" />
          <R x={47} y={33} w={8} h={1} c="#111" />
        </Hotspot>
      )}

      <R x={-100} y={52} w={328} h={128} c="#9c6b3c" />
      {[57, 63, 70, 77, 85, 94, 104, 115].map((y) => (
        <R key={y} x={-100} y={y} w={328} h={1} c="#87592f" />
      ))}
      {[12, 40, 76, 104, 28, 60, 92, 118].map((x, i) => (
        <R key={i} x={x} y={i < 4 ? 52 : 63} w={1} h={i < 4 ? 5 : 7} c="#87592f" />
      ))}
      <R x={-100} y={52} w={328} h={1} c="#5e3c1d" />

      <Hotspot x={0} y={34} w={12} h={22} onClick={() => onItem('espresso')}>
        <R x={0} y={40} w={12} h={16} c="#5b5b6b" />
        <R x={0} y={40} w={12} h={1} c="#7c7c8c" />
        <R x={1} y={47} w={10} h={1} c="#44444f" />
        <R x={2} y={33} w={8} h={7} c="#c0c4cc" />
        <R x={3} y={34} w={6} h={2} c="#1a1a24" />
        <R x={5} y={37} w={2} h={2} c="#6b4423" />
        <Blink x={8} y={34} c="#ff5c8a" />
      </Hotspot>

      <R x={16} y={42} w={98} h={3} c="#d9c3a0" />
      <R x={16} y={45} w={98} h={1} c="#a8916d" />
      {[17, 50, 78, 111].map((x) => (
        <R key={x} x={x} y={46} w={2} h={10} c="#555" />
      ))}
      <Monitor x={20} y={35} />
      <Monitor x={36} y={35} />
      <Monitor x={78} y={35} />
      <Monitor x={94} y={35} />
      <R x={56} y={38} w={8} h={4} c="#e0e0e0" />
      <R x={57} y={39} w={6} h={2} c="#264c8c" />

      <R x={117} y={50} w={9} h={6} c="#b5651d" />
      <R x={116} y={38} w={4} h={12} c="#2d6a4f" />
      <R x={120} y={34} w={4} h={16} c="#40916c" />
      <R x={123} y={40} w={4} h={10} c="#2d6a4f" />

      <R x={6} y={66} w={14} h={7} c="#c1121f" />
      <R x={8} y={64} w={10} h={3} c="#e63946" />

      {s.flags.five && (
        <Hotspot x={108} y={61} w={10} h={12} onClick={() => onItem('trophy')}>
          <R x={108} y={68} w={10} h={5} c="#6b4423" />
          <R x={110} y={61} w={6} h={4} c="#ffd23f" />
          <R x={109} y={61} w={1} h={2} c="#ffd23f" />
          <R x={116} y={61} w={1} h={2} c="#ffd23f" />
          <R x={112} y={65} w={2} h={3} c="#e0b000" />
        </Hotspot>
      )}

      <Crowd s={s} slots={SLOTS} perGeneric={5} onPerson={onPerson} />
    </>
  );
}
