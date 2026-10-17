import { useEffect, useState } from 'react';
import type { Goal } from '../game/types';
import { money } from '../game/format';
import { Btn, FactButton } from './common';
import { sfx } from '../game/sfx';

const DURATION = 3600;

export function TrainSequence({ goal, onDone }: { goal: Goal; onDone: () => void }) {
  const [t, setT] = useState(0);
  useEffect(() => {
    const start = performance.now();
    let raf = 0;
    const tick = () => {
      const p = Math.min(1, (performance.now() - start) / DURATION);
      setT(p);
      if (p < 1) raf = requestAnimationFrame(tick);
      else sfx('win');
    };
    raf = requestAnimationFrame(tick);
    const beeps = setInterval(() => sfx('tap'), 450);
    const stop = setTimeout(() => clearInterval(beeps), DURATION);
    return () => {
      cancelAnimationFrame(raf);
      clearInterval(beeps);
      clearTimeout(stop);
    };
  }, []);

  const pts = Array.from({ length: 40 }, (_, i) => {
    const x = i / 39;
    const y = 0.15 + 0.8 * Math.exp(-4 * x) + (Math.sin(i * 2.3) * 0.03) * (1 - x);
    return [4 + x * 92, 4 + (1 - y) * 52] as const;
  });
  const shown = pts.slice(0, Math.max(2, Math.ceil(t * pts.length)));
  const d = shown.map(([x, y], i) => `${i ? 'L' : 'M'}${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
  const loss = (4.2 - 2.4 * (1 - Math.exp(-4 * t))).toFixed(2);
  const done = t >= 1;

  return (
    <div className="backdrop center dark">
      <div className="train pixel-box pop">
        <div className="train-title">{done ? `✅ ${goal.model} IS ALIVE!` : `TRAINING ${goal.model}…`}</div>
        <div className="crt">
          <svg viewBox="0 0 100 60" preserveAspectRatio="none">
            {[15, 30, 45].map((y) => (
              <line key={y} x1={4} x2={96} y1={y} y2={y} stroke="#0f3d2e" strokeWidth={0.5} />
            ))}
            <path d={d} fill="none" stroke="#3ddc97" strokeWidth={1.5} />
          </svg>
          <div className="crt-loss">loss {loss}</div>
          <div className="crt-lines">
            {goal.trainLines.map((l, i) => (
              <div key={l} className={t > i * 0.3 ? 'on' : ''}>
                &gt; {l}
              </div>
            ))}
          </div>
        </div>
        <div className="train-bar">
          <div style={{ width: `${t * 100}%` }} />
        </div>
        {done && (
          <div className="train-done">
            <div className="model-card">
              <span>🤖 {goal.model}</span>
              <span>{goal.params} params</span>
              <span>{money(goal.cost)} compute</span>
              <FactButton title={goal.model} text={goal.fact} />
            </div>
            <Btn variant="gold" onClick={onDone} sound="coin">
              Ship it 🚀
            </Btn>
          </div>
        )}
      </div>
    </div>
  );
}
