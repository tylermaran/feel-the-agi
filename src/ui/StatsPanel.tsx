import type { GameState } from '../game/types';
import { burn, chapterOf, hireCap, gpuCap, researchRate, runway } from '../game/engine';
import { PEOPLE } from '../game/people';
import { money, num, qLabel } from '../game/format';
import { NEWS } from '../game/chapters';
import { Meter, Sheet } from './common';

function Row({ k, v, cls }: { k: string; v: string; cls?: string }) {
  return (
    <div className={`row ${cls ?? ''}`}>
      <span>{k}</span>
      <b>{v}</b>
    </div>
  );
}

export function StatsPanel({ s, onClose }: { s: GameState; onClose: () => void }) {
  const ch = chapterOf(s);
  const b = burn(s);
  const rw = runway(s);
  const raised = s.rounds.reduce((a, r) => a + r.amount, 0);
  const lifetime = Object.values(s.spend).reduce((a, v) => a + v, 0);
  const spendItems: [string, number, string][] = [
    ['Salaries', s.spend.salaries, '#4cc9f0'],
    ['GPU purchases', s.spend.gpusCapex, '#76b900'],
    ['GPU power & ops', s.spend.gpuOps, '#3ddc97'],
    ['Hiring bonuses', s.spend.hiring, '#ff5c8a'],
    ['Rent', s.spend.rent, '#f4a261'],
    ['Model training', s.spend.training, '#ffd23f'],
    ['Big moves', s.spend.moves, '#b388ff'],
  ];
  const maxSpend = Math.max(1, ...spendItems.map((x) => x[1]));
  const lastQ = s.ledger.slice(-8);
  const maxQ = Math.max(1, ...lastQ.map((l) => l.salaries + l.gpuOps + l.rent));

  return (
    <Sheet title="📊 Company Dashboard" onClose={onClose} className="full">
      <section className="panel-sec">
        <div className="big-cash">{money(s.cash)}</div>
        <div className={`runway ${rw < 2 ? 'danger' : ''}`}>
          {rw === Infinity ? '♾️ Profitable!' : `⏳ Runway: ${rw.toFixed(1)} quarters`}
        </div>
      </section>

      <section className="panel-sec">
        <h3>💸 Burn per quarter</h3>
        <Row k={`Salaries (${s.eng} × ${money(ch.econ.salary)})`} v={`-${money(b.salaries)}`} cls="neg" />
        <Row k={`GPU ops (${num(s.gpus)} GPUs)`} v={`-${money(b.gpuOps)}`} cls="neg" />
        <Row k="Rent" v={b.rent ? `-${money(b.rent)}` : '$0 (thanks Greg)'} cls={b.rent ? 'neg' : ''} />
        {s.flags.api && <Row k={`API revenue (${num(s.users)} users)`} v={`+${money(b.revenue)}`} cls="pos" />}
        <Row k="Net per quarter" v={money(b.net, true)} cls={b.net < 0 ? 'neg total' : 'pos total'} />
        {lastQ.length > 1 && (
          <div className="bars">
            {lastQ.map((l) => {
              const tot = l.salaries + l.gpuOps + l.rent;
              return (
                <div key={l.q} className="bar-col">
                  <div className="bar" style={{ height: `${(tot / maxQ) * 100}%` }} />
                  <span>{qLabel(l.q).replace(' ', '\n')}</span>
                </div>
              );
            })}
          </div>
        )}
      </section>

      <section className="panel-sec">
        <h3>🧾 Lifetime spend · {money(lifetime)}</h3>
        {spendItems.map(([k, v, c]) => (
          <div key={k} className="spend-row">
            <span>{k}</span>
            <Meter value={v} max={maxSpend} color={c} />
            <b>{money(v)}</b>
          </div>
        ))}
      </section>

      <section className="panel-sec">
        <h3>💰 Fundraising · {money(raised)} raised</h3>
        {s.rounds
          .slice()
          .reverse()
          .map((r, i) => (
            <Row
              key={i}
              k={`${qLabel(r.q)} · ${r.who} (${r.kind})`}
              v={r.valuation ? `${money(r.amount)} @ ${money(r.valuation)}` : money(r.amount)}
              cls="pos"
            />
          ))}
      </section>

      <section className="panel-sec">
        <h3>👩‍💻 Team · {s.eng} people</h3>
        <div className="team-chips">
          {s.team
            .filter((id) => PEOPLE[id])
            .map((id) => (
              <span key={id} className="tchip">
                {PEOPLE[id].name}
              </span>
            ))}
          {s.eng > s.team.length && <span className="tchip dim">+{s.eng - s.team.length} engineers</span>}
        </div>
        <Row k="Hires available this quarter" v={`${hireCap(s)}`} />
      </section>

      <section className="panel-sec">
        <h3>🖥️ Compute · {num(s.gpus)} GPUs</h3>
        <Row k="Research speed (√ people × GPUs)" v={`🧠 +${researchRate(s)}/qtr`} />
        <Row k="NVIDIA allocation left" v={`${num(gpuCap(s))} GPUs`} />
        {s.models.map((m) => (
          <Row key={m.name} k={`🤖 ${m.name} · ${m.params} params · ${qLabel(m.q)}`} v={money(m.cost)} />
        ))}
      </section>

      <section className="panel-sec">
        <h3>👥 Users · {num(s.users)}</h3>
        <div className="team-chips">
          {s.products.length ? (
            s.products.map((p) => (
              <span key={p} className="tchip">
                {p}
              </span>
            ))
          ) : (
            <span className="tchip dim">No products yet</span>
          )}
        </div>
      </section>

      <section className="panel-sec">
        <h3>🔥 Hype & 🛡️ Safety</h3>
        <div className="spend-row">
          <span>Hype</span>
          <Meter value={s.hype} color="#ff7b39" />
          <b>{Math.round(s.hype)}</b>
        </div>
        <div className="spend-row">
          <span>Safety</span>
          <Meter value={s.safety} color="#4cc9f0" />
          <b>{Math.round(s.safety)}</b>
        </div>
        <p className="hint">Hype helps you hire and raise. Safety keeps certain people happy…</p>
      </section>

      <section className="panel-sec">
        <h3>🏁 Rival news</h3>
        {NEWS.filter((n) => n.q <= s.q)
          .slice(-3)
          .reverse()
          .map((n, i) => (
            <Row key={i} k={`${qLabel(n.q)} · ${n.text}`} v={n.org} />
          ))}
      </section>
    </Sheet>
  );
}
