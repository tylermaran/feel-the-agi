import { useState } from 'react';
import type { GameState } from '../game/types';
import { canAfford, findCard, goalStatus } from '../game/engine';
import { money } from '../game/format';
import { FxChips } from './common';
import { sfx } from '../game/sfx';

export function CardTray({
  s,
  onPlay,
  onTrain,
  busy,
}: {
  s: GameState;
  onPlay: (id: string) => void;
  onTrain: () => void;
  busy: boolean;
}) {
  const [picked, setPicked] = useState<string | null>(null);
  const st = goalStatus(s);

  const play = (id: string) => {
    if (busy || picked) return;
    sfx('whoosh');
    setPicked(id);
    setTimeout(() => {
      onPlay(id);
      setPicked(null);
    }, 280);
  };

  return (
    <div className="tray">
      {st.ready ? (
        <button className="train-btn" onClick={() => (sfx('train'), onTrain())} disabled={busy}>
          🚀 TRAIN {st.g.model} <small>{money(st.g.cost)}</small>
        </button>
      ) : (
        <div className="tray-head">Pick your move this quarter</div>
      )}
      <div className="cards" key={s.q}>
        {s.hand.map((id, i) => {
          const c = findCard(s, id);
          if (!c) return null;
          const ok = canAfford(s, c);
          return (
            <button
              key={id}
              className={`card ${c.once ? 'special' : ''} ${picked === id ? 'picked' : ''} ${picked && picked !== id ? 'faded' : ''}`}
              style={{ animationDelay: `${i * 70}ms` }}
              disabled={!ok || busy}
              onClick={() => play(id)}
            >
              {c.once && <span className="card-star">★</span>}
              <span className="card-emoji">{c.emoji}</span>
              <span className="card-title">{c.title}</span>
              <FxChips fx={c.fx} small />
              {!ok && <span className="card-broke">Can't afford</span>}
            </button>
          );
        })}
      </div>
    </div>
  );
}

export function ActionBar({
  view,
  onToggleView,
  onHire,
  onGpus,
  onRaise,
  busy,
}: {
  view: 'map' | 'hq';
  onToggleView: () => void;
  onHire: () => void;
  onGpus: () => void;
  onRaise: () => void;
  busy: boolean;
}) {
  const b = (fn: () => void) => () => {
    sfx('tap');
    fn();
  };
  return (
    <nav className="actionbar">
      <button onClick={b(onToggleView)} disabled={busy}>
        <span>{view === 'map' ? '🏠' : '🗺️'}</span>
        {view === 'map' ? 'HQ' : 'Map'}
      </button>
      <button onClick={b(onHire)} disabled={busy}>
        <span>👩‍💻</span>Hire
      </button>
      <button onClick={b(onGpus)} disabled={busy}>
        <span>🖥️</span>GPUs
      </button>
      <button className="raise" onClick={b(onRaise)} disabled={busy}>
        <span>💰</span>Raise
      </button>
    </nav>
  );
}
