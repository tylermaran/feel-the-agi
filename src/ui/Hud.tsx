import { useEffect, useRef, useState } from 'react';
import type { GameState, Stat } from '../game/types';
import { CHAPTERS } from '../game/chapters';
import { goalStatus, researchRate, runway } from '../game/engine';
import { money, num, qLabel } from '../game/format';
import { FactButton, ICON, Meter, fmtStat } from './common';
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

function GoalBar({
  icon,
  label,
  value,
  max,
  ok,
  color,
  extra,
}: {
  icon: string;
  label: string;
  value: number;
  max: number;
  ok: boolean;
  color: string;
  extra?: string;
}) {
  return (
    <div className={`goal-bar ${ok ? 'ok' : ''}`}>
      <span className="goal-bar-label">
        {icon} {label}
      </span>
      <Meter value={value} max={max} color={ok ? '#3ddc97' : color} />
      <span className="goal-bar-val">
        {ok ? '✅' : `${num(value)}/${num(max)}`}
        {extra && !ok && <em>{extra}</em>}
      </span>
    </div>
  );
}

export function Objective({ s }: { s: GameState }) {
  const ch = CHAPTERS[s.chapter];
  const st = goalStatus(s);
  const g = st.g;
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
      <div className="goal-panel">
        <div className="goal-head">
          <span className="goal-tag">GOAL</span>
          {st.trained ? (
            <span className="goal-name done">
              {g.model} trained! {s.freePlay ? 'Free play' : 'Keep going'}
            </span>
          ) : (
            <span className="goal-name">
              Train {g.model}
              <small>{money(g.cost)}</small>
            </span>
          )}
          <FactButton
            title={g.model}
            text={`${g.fact} Real history: shipped in ${qLabel(g.histQ)}.`}
          />
        </div>
        {!st.trained && (
          <>
            {!st.unlocked && <div className="goal-locked">🔒 {g.lockedHint}</div>}
            <GoalBar
              icon="🧠"
              label="Research"
              value={Math.floor(s.research)}
              max={g.research}
              ok={st.researchOk}
              color="#b388ff"
              extra={`+${researchRate(s)}/qtr`}
            />
            <GoalBar icon="🖥️" label="GPUs" value={s.gpus} max={g.gpus} ok={st.gpusOk} color="#76b900" />
          </>
        )}
      </div>
    </div>
  );
}
