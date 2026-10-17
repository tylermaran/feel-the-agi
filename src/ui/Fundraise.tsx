import { useMemo, useState } from 'react';
import type { GameState, Investor, PitchTag } from '../game/types';
import { chapterOf, offerFor, pitchScore } from '../game/engine';
import { PEOPLE } from '../game/people';
import { Portrait } from '../art/Sprite';
import { money } from '../game/format';
import { TAG_ICON, TAG_NAME, pickQuestions } from '../game/pitch';
import { Btn, Meter, Sheet } from './common';
import { sfx } from '../game/sfx';

type Phase =
  | { k: 'pick' }
  | { k: 'pitch'; inv: Investor; round: number; interest: number; react?: { emoji: string; text: string; pts: number } }
  | { k: 'result'; inv: Investor; interest: number; offer: number; valuation?: number };

const THRESHOLD = 40;

export function Fundraise({
  s,
  onDone,
  onClose,
}: {
  s: GameState;
  onDone: (r: { id: string; who: string; amount: number; valuation?: number; kind: string }) => void;
  onClose: () => void;
}) {
  const [phase, setPhase] = useState<Phase>({ k: 'pick' });
  const qs = useMemo(() => pickQuestions(3), []);
  const investors = chapterOf(s).investors.filter(
    (i) => (!i.needs || i.needs.every((f) => s.flags[f])) && (!i.blocks || i.blocks.every((f) => !s.flags[f])),
  );

  if (phase.k === 'pick') {
    return (
      <Sheet title="🌲 Sand Hill Road" onClose={onClose}>
        <p className="hint center">Pitching takes the whole quarter. Pick wisely.</p>
        <div className="investors">
          {investors.map((inv) => {
            const visits = s.vcVisits[inv.id] ?? 0;
            return (
              <button
                key={inv.id}
                className="investor"
                onClick={() => {
                  sfx('tap');
                  setPhase({ k: 'pitch', inv, round: 0, interest: 0 });
                }}
              >
                <Portrait look={PEOPLE[inv.sprite].look} size={56} />
                <div className="inv-info">
                  <b>{inv.name}</b>
                  <span className="dim">{inv.org}</span>
                  <span className="inv-likes">
                    Likes {TAG_ICON[inv.likes]} {TAG_NAME[inv.likes]} · ~{money(inv.check)}
                  </span>
                  {visits > 0 && <span className="inv-tired">😮‍💨 Pitched {visits}x already</span>}
                </div>
              </button>
            );
          })}
        </div>
      </Sheet>
    );
  }

  if (phase.k === 'pitch') {
    const { inv, round, interest, react } = phase;
    const q = qs[round];
    const answer = (tag: PitchTag) => {
      if (react) return;
      const stat = pitchScore(s, tag);
      const pts = Math.round(8 + 22 * stat + (inv.likes === tag ? 10 : 0) + (Math.random() * 8 - 4));
      const r =
        pts >= 30
          ? { emoji: '😍', text: 'Love it!' }
          : pts >= 20
            ? { emoji: '🙂', text: 'Interesting…' }
            : pts >= 13
              ? { emoji: '😐', text: 'Hmm.' }
              : { emoji: '🥱', text: 'Not convinced.' };
      sfx(pts >= 20 ? 'coin' : 'bad');
      const next = Math.min(100, interest + pts);
      setPhase({ ...phase, interest: next, react: { ...r, pts } });
      setTimeout(() => {
        if (round + 1 < qs.length) {
          setPhase({ k: 'pitch', inv, round: round + 1, interest: next });
        } else {
          const offer = next >= THRESHOLD ? offerFor(s, inv.check, next, inv.id) : 0;
          const valuation = inv.kind === 'Equity' ? Math.round(offer / (0.08 + Math.random() * 0.07)) : undefined;
          sfx(offer ? 'win' : 'bad');
          setPhase({ k: 'result', inv, interest: next, offer, valuation });
        }
      }, 1100);
    };
    return (
      <Sheet title={`Pitching ${inv.name}`} closable={false}>
        <div className="pitch">
          <div className="pitch-vc">
            <Portrait look={PEOPLE[inv.sprite].look} size={96} />
            <div className="bubble">{react ? `${react.emoji} ${react.text}` : q.q}</div>
          </div>
          <div className="interest">
            <span>Interest</span>
            <Meter value={interest} color={interest >= THRESHOLD ? '#3ddc97' : '#ffd23f'} />
            <b>{interest}</b>
          </div>
          <div className="round-dots">
            {qs.map((_, i) => (
              <span key={i} className={i <= round ? 'on' : ''} />
            ))}
          </div>
          <div className="answers">
            {q.a.map((a) => (
              <Btn key={a.text} variant="secondary" disabled={!!react} onClick={() => answer(a.tag)} sound={null}>
                <span className="ans-tag">{TAG_ICON[a.tag]}</span> {a.text}
              </Btn>
            ))}
          </div>
          <p className="hint center">
            Answers are stronger when backed by your stats. {inv.name.split(' ')[0]} likes {TAG_ICON[inv.likes]}.
          </p>
        </div>
      </Sheet>
    );
  }

  const { inv, offer, valuation } = phase;
  return (
    <Sheet title={offer ? '📝 Term Sheet!' : '🚪 They passed'} closable={false}>
      <div className="result">
        <Portrait look={PEOPLE[inv.sprite].look} size={96} />
        {offer ? (
          <>
            <div className="offer">{money(offer)}</div>
            <div className="dim">
              {inv.kind}
              {valuation ? ` at a ${money(valuation)} valuation` : ''}
            </div>
            <Btn variant="gold" sound="coin" onClick={() => onDone({ id: inv.id, who: inv.name, amount: offer, valuation, kind: inv.kind })}>
              Sign it ✍️
            </Btn>
          </>
        ) : (
          <>
            <div className="bubble">"Keep us posted!" 🙃</div>
            <p className="hint center">Grow your users, hype or research — then try again.</p>
            <Btn variant="secondary" onClick={() => onDone({ id: inv.id, who: inv.name, amount: 0, kind: inv.kind })}>
              Back to work
            </Btn>
          </>
        )}
      </div>
    </Sheet>
  );
}
