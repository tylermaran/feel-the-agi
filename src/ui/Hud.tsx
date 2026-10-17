import { useEffect, useRef, useState } from 'react';
import type { GameState, Stat } from '../game/types';
import { CHAPTERS } from '../game/chapters';
import { goalStatus, researchRate, runway } from '../game/engine';
import { qLabel } from '../game/format';
import { ICON, fmtStat } from './common';
import { isMuted, setMuted, sfx } from '../game/sfx';

const HUD_STATS: Stat[] = ['cash', 'eng', 'gpus', 'users', 'hype', 'safety'];

export function Hud({ s, onOpen }: { s: GameState; onOpen: () => void }) {
  const prev = useRef<GameState>(s);
  const [deltas, setDeltas] = useState<{ k: Stat; d: number; id: number }[]>([]);

  useEffect(() => {
    const p = prev.current;
    prev.current = s;
    const ds = HUD_STATS.filter((k) => p[k] !== s[k]).map((k) => ({ k, d: s[k] - p[k], id: Math.random() }));
    if (!ds.length) return;
    setDeltas(ds);
    const t = setTimeout(() => setDeltas([]), 1600);
    return () => clearTimeout(t);
  }, [s]);

  const lowCash = runway(s) < 2;
  return (
    <button className="hud" onClick={() => (sfx('tap'), onOpen())} aria-label="Open stats">
      {HUD_STATS.map((k) => {
        const d = deltas.find((x) => x.k === k);
        return (
          <div key={k} className={`hud-stat ${k === 'cash' && lowCash ? 'danger' : ''}`}>
            <span className="hud-icon">{ICON[k]}</span>
            <span className="hud-val">{fmtStat(k, s[k], false)}</span>
            {d && (
              <span key={d.id} className={`hud-delta ${d.d < 0 ? 'neg' : 'pos'}`}>
                {fmtStat(k, d.d)}
              </span>
            )}
          </div>
        );
      })}
      <span className="hud-more">▾</span>
    </button>
  );
}

export function Objective({ s, onGoal }: { s: GameState; onGoal: () => void }) {
  const ch = CHAPTERS[s.chapter];
  const st = goalStatus(s);
  const [muted, setM] = useState(isMuted());
  return (
    <div className="objective">
      <div className="obj-top">
        <span className="obj-date">{qLabel(s.q)}</span>
        <span className="obj-ch">
          CH{ch.id + 1} · {ch.name.toUpperCase()}
        </span>
        <button
          className="mute"
          onClick={() => {
            setMuted(!muted);
            setM(!muted);
          }}
          aria-label="Toggle sound"
        >
          {muted ? '🔇' : '🔊'}
        </button>
      </div>
      <button className="obj-goal" onClick={() => (sfx('tap'), onGoal())}>
        {st.trained ? (
          <span className="obj-done">✅ {st.g.model} trained! {s.freePlay ? 'Free play' : 'Keep going…'}</span>
        ) : (
          <>
            <span className="obj-title">🎯 Train {st.g.model}</span>
            {!st.unlocked && <span className="pill locked">📄🔒</span>}
            <span className={`pill ${st.researchOk ? 'ok' : ''}`}>
              🧠 {Math.floor(s.research)}/{st.g.research}
              <em>+{researchRate(s)}</em>
            </span>
            <span className={`pill ${st.gpusOk ? 'ok' : ''}`}>
              🖥️ {fmtStat('gpus', s.gpus, false)}/{fmtStat('gpus', st.g.gpus, false)}
            </span>
          </>
        )}
      </button>
    </div>
  );
}
