import type { GameState } from '../game/types';
import { chapterOf, gpuCap, hireCap, researchRate } from '../game/engine';
import { PEOPLE, engLook } from '../game/people';
import { Portrait } from '../art/Sprite';
import { money, num } from '../game/format';
import { Btn, Sheet } from './common';

function rateWith(s: GameState, eng: number, gpus: number) {
  return researchRate({ ...s, eng: s.eng + eng, gpus: s.gpus + gpus });
}

export function HireSheet({ s, onHire, onClose }: { s: GameState; onHire: (n: number) => void; onClose: () => void }) {
  const e = chapterOf(s).econ;
  const cap = hireCap(s);
  const afford = Math.floor(s.cash / e.hireBonus);
  const max = Math.min(cap, afford);
  const step = s.chapter === 2 ? 5 : 1;
  return (
    <Sheet title="👩‍💻 Recruiting" onClose={onClose}>
      <div className="shop-hero">
        <div className="candidates">
          {[0, 1, 2].map((i) => (
            <Portrait key={i} look={engLook(s.eng + i)} size={56} />
          ))}
        </div>
        <div className="shop-stats">
          <div>
            <b>{cap}</b> candidates this quarter
          </div>
          <div className="dim">More 🔥 hype = more candidates</div>
        </div>
      </div>
      <div className="shop-line">
        Signing bonus <b>{money(e.hireBonus)}</b> · Salary <b>{money(e.salary)}/qtr</b>
      </div>
      <div className="shop-line">
        🧠 Research: <b>+{researchRate(s)}</b> → <b className="pos">+{rateWith(s, Math.max(1, Math.min(step, max)), 0)}</b>/qtr
      </div>
      <div className="shop-btns">
        <Btn disabled={max < 1} onClick={() => onHire(Math.min(step, max))} sound="coin">
          Hire {Math.min(step, Math.max(1, max))}
        </Btn>
        <Btn variant="gold" disabled={max < 2} onClick={() => onHire(max)} sound="coin">
          Hire all ({max})
        </Btn>
      </div>
      {cap === 0 && <p className="hint">No more candidates this quarter. Play a card to advance.</p>}
      <p className="hint">Hiring doesn't end your turn.</p>
    </Sheet>
  );
}

export function GpuSheet({ s, onBuy, onClose }: { s: GameState; onBuy: (n: number) => void; onClose: () => void }) {
  const e = chapterOf(s).econ;
  const cap = gpuCap(s);
  const afford = Math.floor(s.cash / e.gpuPrice);
  const [a, b] = e.gpuPacks;
  return (
    <Sheet title="🟩 NVIDIA Store" onClose={onClose}>
      <div className="shop-hero">
        <Portrait look={PEOPLE.jensen.look} size={72} />
        <div className="shop-stats">
          <div className="quote">"{PEOPLE.jensen.quote.replace(/"/g, '')}"</div>
          <div className="dim">Allocation left: {num(cap)} GPUs</div>
        </div>
      </div>
      <div className="shop-line">
        <b>{money(e.gpuPrice)}</b> each · <b>{money(e.gpuOps)}</b>/qtr to run
      </div>
      <div className="shop-line">
        🧠 Research: <b>+{researchRate(s)}</b> → <b className="pos">+{rateWith(s, 0, Math.min(b, cap))}</b>/qtr
      </div>
      <div className="shop-btns">
        <Btn disabled={cap < a || afford < a} onClick={() => onBuy(a)} sound="coin">
          Buy {num(a)} · {money(a * e.gpuPrice)}
        </Btn>
        <Btn variant="gold" disabled={cap < b || afford < b} onClick={() => onBuy(b)} sound="coin">
          Buy {num(b)} · {money(b * e.gpuPrice)}
        </Btn>
      </div>
      <p className="hint">Buying GPUs doesn't end your turn.</p>
    </Sheet>
  );
}
