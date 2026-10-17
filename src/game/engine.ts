import { CHAPTERS } from './chapters';
import { BAILOUT, EVENTS } from './events';
import { clamp, qi, roundNice } from './format';
import type { Card, Choice, Fx, GameEvent, GameState, PitchTag } from './types';

export const chapterOf = (s: GameState) => CHAPTERS[s.chapter];

export function newGame(): GameState {
  const s: GameState = {
    v: 1,
    chapter: 0,
    q: qi(2015, 4),
    cash: 10_000_000,
    eng: 5,
    gpus: 4,
    research: 0,
    hype: 20,
    users: 0,
    safety: 30,
    team: ['sam', 'greg', 'ilya', 'elon', 'karpathy'],
    flags: {},
    flagQ: {},
    used: [],
    fired: [],
    queue: [],
    hand: [],
    models: [],
    rounds: [{ who: 'Elon Musk', kind: 'Donation', amount: 10_000_000, q: qi(2015, 4) }],
    ledger: [],
    spend: { salaries: 0, gpuOps: 0, rent: 0, gpusCapex: 0, hiring: 0, training: 0, moves: 0 },
    hiredQ: 0,
    boughtQ: 0,
    vcVisits: {},
    products: [],
    chapterStartQ: qi(2015, 4),
  };
  s.hand = drawHand(s);
  return enqueueEvents(s);
}

const hasAll = (s: GameState, flags?: string[]) => !flags || flags.every((f) => s.flags[f]);
const hasNone = (s: GameState, flags?: string[]) => !flags || flags.every((f) => !s.flags[f]);

export function eligibleCards(s: GameState): Card[] {
  return chapterOf(s).cards.filter(
    (c) =>
      !(c.once && s.used.includes(c.id)) &&
      (c.from === undefined || s.q >= c.from) &&
      (c.until === undefined || s.q <= c.until) &&
      hasAll(s, c.needs) &&
      hasNone(s, c.blocks),
  );
}

export function drawHand(s: GameState): string[] {
  const pool = eligibleCards(s).map((c) => ({ c, w: c.once ? 3 : 1 }));
  const hand: string[] = [];
  while (hand.length < 3 && pool.length) {
    const total = pool.reduce((a, p) => a + p.w, 0);
    let r = Math.random() * total;
    const i = pool.findIndex((p) => (r -= p.w) <= 0);
    hand.push(pool[i].c.id);
    pool.splice(i, 1);
  }
  return hand;
}

export const canAfford = (s: GameState, c: Card) => s.cash + Math.min(0, c.fx.cash ?? 0) >= 0;

export function findCard(s: GameState, id: string): Card | undefined {
  return chapterOf(s).cards.find((c) => c.id === id);
}

export function findEvent(id: string): GameEvent | undefined {
  return id === 'bailout' ? BAILOUT : EVENTS.find((e) => e.id === id);
}

export function researchRate(s: GameState): number {
  return Math.round(Math.sqrt(Math.max(0, s.eng) * Math.max(0, s.gpus)));
}

export function burn(s: GameState) {
  const e = chapterOf(s).econ;
  const salaries = s.eng * e.salary;
  const gpuOps = s.gpus * e.gpuOps;
  const rent = e.rent;
  const revenue = s.flags.api ? Math.round(s.users * e.arpu) : 0;
  return { salaries, gpuOps, rent, revenue, net: revenue - salaries - gpuOps - rent };
}

export function runway(s: GameState): number {
  const { net } = burn(s);
  if (net >= 0) return Infinity;
  return s.cash / -net;
}

export function hireCap(s: GameState): number {
  const e = chapterOf(s).econ;
  return Math.max(0, e.hireBase + Math.floor(s.hype / e.hirePerHype) - s.hiredQ);
}

export function gpuCap(s: GameState): number {
  return Math.max(0, chapterOf(s).econ.gpuCap - s.boughtQ);
}

export function goalStatus(s: GameState) {
  const g = chapterOf(s).goal;
  const trained = !!s.flags[g.flag];
  const unlocked = hasAll(s, g.needs);
  const researchOk = s.research >= g.research;
  const gpusOk = s.gpus >= g.gpus;
  const cashOk = s.cash >= g.cost;
  return { g, trained, unlocked, researchOk, gpusOk, cashOk, ready: !trained && unlocked && researchOk && gpusOk && cashOk };
}

function applyFx(s: GameState, fx: Fx): GameState {
  const g = chapterOf(s).goal;
  const n = { ...s };
  if (fx.cash) {
    n.cash += fx.cash;
    if (fx.cash < 0) n.spend = { ...n.spend, moves: n.spend.moves - fx.cash };
  }
  if (fx.eng) n.eng = Math.max(1, n.eng + fx.eng);
  if (fx.gpus) n.gpus = Math.max(0, n.gpus + fx.gpus);
  if (fx.research) n.research = Math.min(g.research, n.research + fx.research);
  if (fx.hype) n.hype = clamp(n.hype + fx.hype);
  if (fx.safety) n.safety = clamp(n.safety + fx.safety);
  if (fx.users) n.users = Math.max(0, n.users + fx.users);
  return n;
}

function setFlags(s: GameState, flags: string[]): GameState {
  if (!flags.length) return s;
  const flagQ = { ...(s.flagQ ?? {}) };
  for (const f of flags) if (!s.flags[f]) flagQ[f] = s.q;
  return { ...s, flags: { ...s.flags, ...Object.fromEntries(flags.map((f) => [f, true])) }, flagQ };
}

let reportSeq = 1;

export function enqueueEvents(s: GameState): GameState {
  const add = EVENTS.filter(
    (e) =>
      e.at <= s.q &&
      !s.fired.includes(e.id) &&
      !s.queue.includes(e.id) &&
      hasAll(s, e.needs) &&
      (!e.wait || (e.needs ?? []).every((f) => (s.flagQ?.[f] ?? s.q) < s.q)) &&
      hasNone(s, e.blocks) &&
      (e.minCh === undefined || s.chapter >= e.minCh) &&
      (e.maxCh === undefined || s.chapter <= e.maxCh),
  ).map((e) => e.id);
  if (!add.length) return s;
  return { ...s, queue: [...s.queue, ...add] };
}

export function endQuarter(s: GameState): GameState {
  const b = burn(s);
  const ch = chapterOf(s);
  const trained = !!s.flags[ch.goal.flag];
  const gain = trained ? 0 : researchRate(s);
  let n: GameState = {
    ...s,
    cash: s.cash + b.net,
    research: Math.min(ch.goal.research, s.research + gain),
    hype: clamp(s.hype - 3),
    spend: {
      ...s.spend,
      salaries: s.spend.salaries + b.salaries,
      gpuOps: s.spend.gpuOps + b.gpuOps,
      rent: s.spend.rent + b.rent,
    },
    ledger: [...s.ledger, { q: s.q, salaries: b.salaries, gpuOps: b.gpuOps, rent: b.rent, revenue: b.revenue }].slice(-40),
    q: s.q + 1,
    hiredQ: 0,
    boughtQ: 0,
  };
  if (n.users > 0) {
    const growth = (n.hype / 100) * 0.2 + (n.flags.api ? 0.08 : 0) - 0.04;
    n.users = Math.max(0, Math.round(n.users * (1 + growth)));
  }
  n.report = { id: reportSeq++, q: s.q, net: b.net, research: gain };
  if (n.cash < 0 && !n.queue.includes('bailout')) {
    if (!n.flags[`bail${n.chapter}`]) n.queue = ['bailout', ...n.queue];
    else n = setFlags(n, ['broke']);
  }
  n.hand = drawHand(n);
  n = enqueueEvents(n);
  return n;
}

export type Action =
  | { type: 'play'; id: string }
  | { type: 'hire'; n: number }
  | { type: 'buy'; n: number }
  | { type: 'choose'; idx: number }
  | { type: 'raise'; id: string; who: string; amount: number; valuation?: number; kind: string }
  | { type: 'train' }
  | { type: 'nextChapter' }
  | { type: 'freePlay' }
  | { type: 'load'; state: GameState };

export function reducer(s: GameState, a: Action): GameState {
  switch (a.type) {
    case 'load':
      return a.state;
    case 'play': {
      const card = findCard(s, a.id);
      if (!card || !s.hand.includes(a.id)) return s;
      if (!canAfford(s, card)) return s;
      let n = applyFx(s, card.fx);
      if (card.once) n.used = [...n.used, card.id];
      if (card.sets) n = setFlags(n, [card.sets]);
      if (card.product) n.products = [...n.products, card.product];
      n = endQuarter(n);
      return n;
    }
    case 'hire': {
      const e = chapterOf(s).econ;
      const k = Math.min(a.n, hireCap(s), Math.floor(s.cash / e.hireBonus));
      if (k <= 0) return s;
      return {
        ...s,
        eng: s.eng + k,
        cash: s.cash - k * e.hireBonus,
        hiredQ: s.hiredQ + k,
        spend: { ...s.spend, hiring: s.spend.hiring + k * e.hireBonus },
      };
    }
    case 'buy': {
      const e = chapterOf(s).econ;
      const k = Math.min(a.n, gpuCap(s), Math.floor(s.cash / e.gpuPrice));
      if (k <= 0) return s;
      return {
        ...s,
        gpus: s.gpus + k,
        cash: s.cash - k * e.gpuPrice,
        boughtQ: s.boughtQ + k,
        spend: { ...s.spend, gpusCapex: s.spend.gpusCapex + k * e.gpuPrice },
      };
    }
    case 'choose': {
      const id = s.queue[0];
      const ev = id && findEvent(id);
      if (!ev) return s;
      const choice: Choice | undefined = ev.choices[a.idx];
      if (!choice) return s;
      let n: GameState = { ...s, queue: s.queue.slice(1), fired: id === 'bailout' ? s.fired : [...s.fired, id] };
      let fx: Fx = { ...(choice.fx ?? {}), ...(choice.run?.(s) ?? {}) };
      if (id === 'bailout') {
        const amt = chapterOf(s).econ.bailout - Math.min(0, s.cash);
        fx = { cash: amt };
        n = setFlags(n, [`bail${s.chapter}`]);
      }
      n = applyFx(n, fx);
      if (choice.sets) n = setFlags(n, choice.sets);
      if (choice.join) n.team = [...n.team, ...choice.join.filter((p) => !n.team.includes(p))];
      if (choice.leave) n.team = n.team.filter((p) => !choice.leave!.includes(p));
      if (choice.round && fx.cash) n.rounds = [...n.rounds, { ...choice.round, amount: fx.cash, q: s.q }];
      return enqueueEvents(n);
    }
    case 'raise': {
      let n: GameState = {
        ...s,
        vcVisits: { ...s.vcVisits, [a.id]: (s.vcVisits[a.id] ?? 0) + 1 },
      };
      if (a.amount > 0) {
        n.cash += a.amount;
        n.hype = clamp(n.hype + 5);
        n.rounds = [...n.rounds, { who: a.who, kind: a.kind, amount: a.amount, valuation: a.valuation, q: s.q }];
      }
      return endQuarter(n);
    }
    case 'train': {
      const st = goalStatus(s);
      if (!st.ready) return s;
      const g = st.g;
      let n: GameState = {
        ...setFlags(s, [g.flag]),
        cash: s.cash - g.cost,
        models: [...s.models, { name: g.model, params: g.params, cost: g.cost, q: s.q }],
        products: [...s.products, g.model],
        hype: clamp(s.hype + 15),
        spend: { ...s.spend, training: s.spend.training + g.cost },
      };
      n = endQuarter(n);
      return n;
    }
    case 'nextChapter': {
      const next = CHAPTERS[s.chapter + 1];
      if (!next) return s;
      let n: GameState = {
        ...s,
        chapter: next.id,
        research: 0,
        team: [...s.team, ...next.joins.filter((p) => !s.team.includes(p))],
        eng: s.eng + next.joins.length,
        vcVisits: {},
        chapterStartQ: s.q,
        report: undefined,
      };
      n.hand = drawHand(n);
      n = enqueueEvents(n);
      return n;
    }
    case 'freePlay':
      return { ...s, freePlay: true };
  }
}

export function pitchScore(s: GameState, tag: PitchTag): number {
  const ch = chapterOf(s);
  switch (tag) {
    case 'traction':
      return Math.min(1, s.users / ch.econ.userBench);
    case 'buzz':
      return s.hype / 100;
    case 'tech':
      return Math.min(1, (s.research / ch.goal.research) * 0.6 + s.models.length * 0.15);
    case 'safety':
      return s.safety / 100;
  }
}

export function offerFor(s: GameState, check: number, interest: number, who: string): number {
  const visits = s.vcVisits[who] ?? 0;
  const mult = Math.max(0.5, Math.min(1.6, interest / 70));
  return roundNice((check * mult) / (1 + visits * 0.6));
}

const SAVE = 'aiarms.save.v1';
const CHECKPOINT = 'aiarms.checkpoint.v1';

export function save(s: GameState) {
  try {
    localStorage.setItem(SAVE, JSON.stringify({ ...s, report: undefined }));
  } catch {
    /* storage unavailable */
  }
}

export function saveCheckpoint(s: GameState) {
  try {
    localStorage.setItem(CHECKPOINT, JSON.stringify({ ...s, report: undefined }));
  } catch {
    /* storage unavailable */
  }
}

export function loadSave(): GameState | null {
  try {
    const raw = localStorage.getItem(SAVE);
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}

export function loadCheckpoint(): GameState | null {
  try {
    const raw = localStorage.getItem(CHECKPOINT);
    return raw ? (JSON.parse(raw) as GameState) : null;
  } catch {
    return null;
  }
}

export function clearSave() {
  localStorage.removeItem(SAVE);
  localStorage.removeItem(CHECKPOINT);
}
