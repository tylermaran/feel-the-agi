import type { GameState } from '../game/types';
import { itemInfo, RIVALS } from '../game/info';
import { PEOPLE, engLook } from '../game/people';
import { Portrait } from '../art/Sprite';
import { NEWS } from '../game/chapters';
import { goalStatus, researchRate } from '../game/engine';
import { money, num, qLabel } from '../game/format';
import { Btn, Fact, Meter, Sheet } from './common';

export function ItemSheet({ id, s, onClose }: { id: string; s: GameState; onClose: () => void }) {
  const info = itemInfo(id, s);
  if (!info) return null;
  return (
    <Sheet title={`${info.emoji} ${info.title}`} onClose={onClose}>
      {info.paper ? (
        <div className="paper">
          <div className="paper-title">Attention Is All You Need</div>
          <div className="paper-authors">
            Vaswani · Shazeer · Parmar · Uszkoreit · Jones · Gomez · Kaiser · Polosukhin
          </div>
          <div className="paper-org">Google Brain · Google Research · June 2017</div>
          <div className="paper-abs">
            <b>Abstract.</b> "We propose a new simple network architecture, the Transformer, based solely on attention
            mechanisms, dispensing with recurrence and convolutions entirely."
          </div>
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
      {info.fact && <Fact>{info.fact}</Fact>}
    </Sheet>
  );
}

export function PersonSheet({ id, s, onClose }: { id: string; s: GameState; onClose: () => void }) {
  if (id === 'eng') {
    return (
      <Sheet title="👩‍💻 Engineer" onClose={onClose}>
        <div className="person">
          <Portrait look={engLook(s.q)} size={96} />
          <div>
            <p className="quote">"Is the cluster down again?"</p>
            <p className="dim">One of your {s.eng} brilliant, slightly sleep-deprived people.</p>
          </div>
        </div>
      </Sheet>
    );
  }
  const p = PEOPLE[id];
  if (!p) return null;
  return (
    <Sheet title={p.name} onClose={onClose}>
      <div className="person">
        <Portrait look={p.look} size={96} />
        <div>
          <div className="role">{p.role}</div>
          <p className="quote">{p.quote}</p>
        </div>
      </div>
      <Fact>{p.fact}</Fact>
    </Sheet>
  );
}

export function RivalSheet({ id, s, onClose }: { id: string; s: GameState; onClose: () => void }) {
  const r = RIVALS[id];
  if (!r) return null;
  const leader = PEOPLE[r.leader];
  const news = NEWS.filter((n) => n.org === r.org && n.q <= s.q).slice(-3).reverse();
  return (
    <Sheet title={`🏁 ${r.name}`} onClose={onClose}>
      <div className="person">
        <Portrait look={leader.look} size={96} />
        <div>
          <div className="role">
            {leader.name} · {r.leaderRole ?? leader.role}
          </div>
          <p>{r.blurb}</p>
        </div>
      </div>
      {news.length > 0 && (
        <div className="rival-news">
          {news.map((n) => (
            <div key={n.text}>
              <span className="dim">{qLabel(n.q)}</span> {n.text}
            </div>
          ))}
        </div>
      )}
      <Fact>{r.fact}</Fact>
    </Sheet>
  );
}

export function GoalSheet({ s, onClose }: { s: GameState; onClose: () => void }) {
  const st = goalStatus(s);
  const g = st.g;
  return (
    <Sheet title={`🎯 Goal: Train ${g.model}`} onClose={onClose}>
      <div className="goal-rows">
        {g.needs && (
          <div className={`goal-row ${st.unlocked ? 'ok' : ''}`}>
            <span>{st.unlocked ? '✅' : '🔒'} Breakthrough</span>
            <span className="dim">{st.unlocked ? 'Transformer paper published' : g.lockedHint}</span>
          </div>
        )}
        <div className={`goal-row ${st.researchOk ? 'ok' : ''}`}>
          <span>🧠 Research</span>
          <Meter value={s.research} max={g.research} color="#b388ff" />
          <b>
            {Math.floor(s.research)}/{g.research}
          </b>
        </div>
        <div className={`goal-row ${st.gpusOk ? 'ok' : ''}`}>
          <span>🖥️ GPUs</span>
          <Meter value={s.gpus} max={g.gpus} color="#76b900" />
          <b>
            {num(s.gpus)}/{num(g.gpus)}
          </b>
        </div>
        <div className={`goal-row ${st.cashOk ? 'ok' : ''}`}>
          <span>💵 Training cost</span>
          <b>{money(g.cost)}</b>
        </div>
      </div>
      <p className="hint">
        Research grows each quarter by √(people × GPUs) = <b>+{researchRate(s)}</b>. Cards add bonus research.
      </p>
      <Fact>
        Real history: {g.model} ({g.params} params) shipped in {qLabel(g.histQ)}.
      </Fact>
      <Btn variant="secondary" onClick={onClose}>
        Got it
      </Btn>
    </Sheet>
  );
}
