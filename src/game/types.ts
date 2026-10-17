export type Stat = 'cash' | 'eng' | 'gpus' | 'research' | 'hype' | 'users' | 'safety';
export type Fx = Partial<Record<Stat, number>>;

export type PitchTag = 'traction' | 'buzz' | 'tech' | 'safety';

export interface Card {
  id: string;
  emoji: string;
  title: string;
  fx: Fx;
  fact?: string;
  once?: boolean;
  from?: number;
  until?: number;
  needs?: string[];
  blocks?: string[];
  sets?: string;
  product?: string;
}

export interface Choice {
  label: string;
  fx?: Fx;
  sets?: string[];
  join?: string[];
  leave?: string[];
  round?: { who: string; kind: string };
  run?: (s: GameState) => Fx;
}

export interface GameEvent {
  id: string;
  at: number;
  emoji: string;
  title: string;
  text: string | ((s: GameState) => string);
  fact?: string;
  portrait?: string;
  needs?: string[];
  blocks?: string[];
  minCh?: number;
  maxCh?: number;
  wait?: boolean;
  choices: Choice[];
}

export interface Investor {
  id: string;
  name: string;
  org: string;
  sprite: string;
  likes: PitchTag;
  check: number;
  kind: 'Donation' | 'Grant' | 'Equity' | 'Partnership';
  quip: string;
  needs?: string[];
  blocks?: string[];
}

export interface Goal {
  model: string;
  params: string;
  research: number;
  gpus: number;
  cost: number;
  flag: string;
  needs?: string[];
  lockedHint?: string;
  histQ: number;
  fact: string;
  trainLines: string[];
}

export interface Econ {
  salary: number;
  gpuPrice: number;
  gpuOps: number;
  rent: number;
  hireBonus: number;
  hireBase: number;
  hirePerHype: number;
  gpuCap: number;
  gpuPacks: number[];
  arpu: number;
  userBench: number;
  bailout: number;
}

export interface Chapter {
  id: number;
  name: string;
  place: string;
  hq: 'garage' | 'office' | 'datacenter';
  goal: Goal;
  econ: Econ;
  cards: Card[];
  investors: Investor[];
  completeFlag: string;
  intro: { emoji: string; title: string; text: string; fact?: string };
  joins: string[];
  nextTeaser: string;
}

export interface Model {
  name: string;
  params: string;
  cost: number;
  q: number;
}

export interface Round {
  who: string;
  kind: string;
  amount: number;
  valuation?: number;
  q: number;
}

export interface Ledger {
  q: number;
  salaries: number;
  gpuOps: number;
  rent: number;
  revenue: number;
}

export interface Spend {
  salaries: number;
  gpuOps: number;
  rent: number;
  gpusCapex: number;
  hiring: number;
  training: number;
  moves: number;
}

export interface Report {
  id: number;
  q: number;
  net: number;
  research: number;
}

export interface GameState {
  v: 1;
  chapter: number;
  q: number;
  cash: number;
  eng: number;
  gpus: number;
  research: number;
  hype: number;
  users: number;
  safety: number;
  team: string[];
  flags: Record<string, boolean>;
  flagQ: Record<string, number>;
  used: string[];
  fired: string[];
  queue: string[];
  hand: string[];
  models: Model[];
  rounds: Round[];
  ledger: Ledger[];
  spend: Spend;
  hiredQ: number;
  boughtQ: number;
  vcVisits: Record<string, number>;
  products: string[];
  report?: Report;
  chapterStartQ: number;
  freePlay?: boolean;
}
