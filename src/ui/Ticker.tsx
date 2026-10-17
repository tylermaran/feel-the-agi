import { NEWS } from '../game/chapters';
import { qLabel } from '../game/format';
import type { GameState } from '../game/types';

export function Ticker({ s }: { s: GameState }) {
  const items = NEWS.filter((n) => n.q <= s.q).slice(-3).reverse();
  if (!items.length) return <div className="ticker"><span className="ticker-tag">NEWS</span><span className="ticker-quiet">All quiet in Silicon Valley…</span></div>;
  const text = items.map((n) => `${qLabel(n.q)} · ${n.org.toUpperCase()}: ${n.text}`).join('   ★   ');
  return (
    <div className="ticker">
      <span className="ticker-tag">NEWS</span>
      <div className="ticker-track">
        <span key={text} className="ticker-text">
          {text}   ★   {text}
        </span>
      </div>
    </div>
  );
}
