import type { GameState } from '../game/types';
import { itemInfo, RIVALS } from '../game/info';
import { PEOPLE, engLook } from '../game/people';
import { Portrait } from '../art/Sprite';
import { NEWS } from '../game/chapters';
import { qLabel } from '../game/format';
import { FactButton, Sheet } from './common';

export function ItemSheet({ id, s, onClose }: { id: string; s: GameState; onClose: () => void }) {
  const info = itemInfo(id, s);
  if (!info) return null;
  return (
    <Sheet
      title={
        <>
          {info.emoji} {info.title} <FactButton title={info.title} text={info.fact} />
        </>
      }
      onClose={onClose}
    >
      {info.paper ? (
        <div className="paper">
          <div className="paper-title">Attention Is All You Need</div>
          <div className="paper-authors">
            Vaswani · Shazeer · Parmar · Uszkoreit · Jones · Gomez · Kaiser · Polosukhin
          </div>
          <div className="paper-org">Google Brain · June 2017</div>
          <div className="paper-fig">
            <span>Inputs</span>→<span className="att">Attention ×6</span>→<span>Outputs</span>
          </div>
        </div>
      ) : (
        <div className="item-lines">
          {info.lines.map((l) => (
            <p key={l}>{l}</p>
          ))}
        </div>
      )}
    </Sheet>
  );
}

export function PersonSheet({ id, s, onClose }: { id: string; s: GameState; onClose: () => void }) {
  if (id === 'eng') {
    return (
      <Sheet title="👩‍💻 Engineer" onClose={onClose}>
        <div className="person">
          <Portrait look={engLook(s.q)} size={96} />
          <p className="quote">"Is the cluster down again?"</p>
        </div>
      </Sheet>
    );
  }
  const p = PEOPLE[id];
  if (!p) return null;
  return (
    <Sheet
      title={
        <>
          {p.name} <FactButton title={p.name} text={p.fact} />
        </>
      }
      onClose={onClose}
    >
      <div className="person">
        <Portrait look={p.look} size={96} />
        <div>
          <div className="role">{p.role}</div>
          <p className="quote">{p.quote}</p>
        </div>
      </div>
    </Sheet>
  );
}

export function RivalSheet({ id, s, onClose }: { id: string; s: GameState; onClose: () => void }) {
  const r = RIVALS[id];
  if (!r) return null;
  const leader = PEOPLE[r.leader];
  const latest = NEWS.filter((n) => n.org === r.org && n.q <= s.q).pop();
  return (
    <Sheet
      title={
        <>
          🏁 {r.name} <FactButton title={r.name} text={r.fact} />
        </>
      }
      onClose={onClose}
    >
      <div className="person">
        <Portrait look={leader.look} size={96} />
        <div>
          <div className="role">
            {leader.name} · {r.leaderRole ?? leader.role}
          </div>
          <p>{r.blurb}</p>
        </div>
      </div>
      {latest && (
        <div className="rival-news">
          <span className="dim">Latest · {qLabel(latest.q)}</span> {latest.text}
        </div>
      )}
    </Sheet>
  );
}
