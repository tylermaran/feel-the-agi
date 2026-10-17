import { useEffect } from 'react';
import type { GameEvent, GameState } from '../game/types';
import { chapterOf } from '../game/engine';
import { PEOPLE } from '../game/people';
import { Portrait } from '../art/Sprite';
import { qLabel } from '../game/format';
import { Btn, Fact, FxChips } from './common';
import { sfx } from '../game/sfx';

export function EventModal({ s, ev, onChoose }: { s: GameState; ev: GameEvent; onChoose: (i: number) => void }) {
  useEffect(() => {
    sfx(ev.id === 'bailout' ? 'bad' : 'event');
  }, [ev.id]);
  const person = ev.portrait ? PEOPLE[ev.portrait] : null;
  const text = typeof ev.text === 'function' ? ev.text(s) : ev.text;
  return (
    <div className="backdrop center">
      <div className="event pixel-box pop">
        <div className="event-date">{qLabel(s.q)}</div>
        <div className="event-art">
          {person ? <Portrait look={person.look} size={84} /> : <span className="event-emoji">{ev.emoji}</span>}
          {person && <span className="event-badge">{ev.emoji}</span>}
        </div>
        <h2 className="event-title">{ev.title}</h2>
        <p className="event-text">{text}</p>
        {ev.fact && <Fact>{ev.fact}</Fact>}
        <div className="event-choices">
          {ev.choices.map((c, i) => {
            const fx =
              ev.id === 'bailout'
                ? { cash: chapterOf(s).econ.bailout - Math.min(0, s.cash) }
                : { ...(c.fx ?? {}), ...(c.run?.(s) ?? {}) };
            return (
              <Btn key={i} variant={i === 0 ? 'primary' : 'secondary'} onClick={() => onChoose(i)} className="choice">
                <span>{c.label}</span>
                <FxChips fx={fx} small />
              </Btn>
            );
          })}
        </div>
      </div>
    </div>
  );
}
