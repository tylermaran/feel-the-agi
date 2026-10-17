import { CHAPTERS } from '../src/game/chapters';
import {
  burn,
  chapterOf,
  findCard,
  goalStatus,
  gpuCap,
  hireCap,
  newGame,
  offerFor,
  reducer,
  researchRate,
} from '../src/game/engine';
import { qLabel } from '../src/game/format';
import type { GameState } from '../src/game/types';

(globalThis as { localStorage?: unknown }).localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
};

function runway(s: GameState) {
  const n = -burn(s).net;
  return n <= 0 ? 99 : s.cash / n;
}

function play(strategy: 'balanced' | 'spendy', log = false) {
  let s = newGame();
  const out: string[] = [];
  for (let turn = 0; turn < 80; turn++) {
    while (s.queue.length) s = reducer(s, { type: 'choose', idx: 0 });
    if (s.flags.broke) return { out, result: `BROKE at ${qLabel(s.q)} ch${s.chapter + 1}` };
    const ch = chapterOf(s);
    if (s.flags[ch.completeFlag]) {
      out.push(`CH${ch.id + 1} done ${qLabel(s.q)} cash=${Math.round(s.cash / 1e6)}M eng=${s.eng} gpus=${s.gpus} users=${s.users}`);
      if (s.chapter === CHAPTERS.length - 1) return { out, result: 'FINISHED' };
      s = reducer(s, { type: 'nextChapter' });
      continue;
    }
    const minRunway = strategy === 'spendy' ? 1.5 : 3;
    const e = ch.econ;
    const g = ch.goal;
    if (!s.flags[g.flag]) {
      while (gpuCap(s) > 0 && s.gpus < g.gpus * 1.2) {
        const t = reducer(s, { type: 'buy', n: e.gpuPacks[1] });
        if (t === s || runway(t) < minRunway) break;
        s = t;
      }
      while (hireCap(s) > 0) {
        const t = reducer(s, { type: 'hire', n: 1 });
        if (t === s || runway(t) < minRunway) break;
        s = t;
      }
    }
    if (goalStatus(s).ready) {
      s = reducer(s, { type: 'train' });
      if (log) out.push(`${qLabel(s.q)} trained ${g.model}`);
      continue;
    }
    if (runway(s) < 2.5) {
      const inv = ch.investors.filter(
        (i) => (!i.needs || i.needs.every((f) => s.flags[f])) && (!i.blocks || i.blocks.every((f) => !s.flags[f])),
      )[0];
      const amount = offerFor(s, inv.check, 60, inv.id);
      s = reducer(s, { type: 'raise', id: inv.id, who: inv.name, amount, kind: inv.kind });
      if (log) out.push(`${qLabel(s.q)} raised ${amount} from ${inv.name}`);
      continue;
    }
    const best = [...s.hand].sort(
      (a, b) => (findCard(s, b)!.fx.research ?? 0) - (findCard(s, a)!.fx.research ?? 0),
    );
    const id = best.find((c) => (findCard(s, c)!.fx.cash ?? 0) + s.cash > 0) ?? best[0];
    s = reducer(s, { type: 'play', id });
    if (log)
      out.push(
        `${qLabel(s.q)} ch${s.chapter + 1} cash=${(s.cash / 1e6).toFixed(2)}M eng=${s.eng} gpu=${s.gpus} r=${Math.round(s.research)}/${g.research} (+${researchRate(s)}) hype=${s.hype} users=${s.users}`,
      );
  }
  return { out, result: 'TIMEOUT' };
}

const verbose = process.argv.includes('-v');
for (const strat of ['balanced', 'spendy'] as const) {
  const results: Record<string, number> = {};
  for (let i = 0; i < 200; i++) {
    const r = play(strat);
    results[r.result] = (results[r.result] ?? 0) + 1;
  }
  console.log(strat, results);
}
const sample = play('balanced', verbose);
console.log(sample.out.join('\n'));
console.log(sample.result);
