import type { PitchTag } from './types';

export interface PitchQ {
  q: string;
  a: { tag: PitchTag; text: string }[];
}

export const TAG_ICON: Record<PitchTag, string> = {
  traction: '📈',
  buzz: '🔥',
  tech: '🧠',
  safety: '🛡️',
};

export const TAG_NAME: Record<PitchTag, string> = {
  traction: 'users',
  buzz: 'hype',
  tech: 'research',
  safety: 'safety',
};

export const PITCH_QS: PitchQ[] = [
  {
    q: 'So... what\'s the business model?',
    a: [
      { tag: 'buzz', text: 'Build AGI, then ask it.' },
      { tag: 'traction', text: 'Developers already love us.' },
      { tag: 'tech', text: 'Let me show you a demo.' },
    ],
  },
  {
    q: 'Why won\'t Google just crush you?',
    a: [
      { tag: 'tech', text: 'Our researchers are better.' },
      { tag: 'buzz', text: 'Because we\'re the good guys.' },
      { tag: 'safety', text: 'We\'re the ones who\'ll do it safely.' },
    ],
  },
  {
    q: 'How big could this get?',
    a: [
      { tag: 'buzz', text: 'Bigger than the internet.' },
      { tag: 'traction', text: 'Look at this user curve.' },
      { tag: 'safety', text: 'Big enough to need guardrails.' },
    ],
  },
  {
    q: 'What\'s your moat?',
    a: [
      { tag: 'tech', text: 'Compute + talent.' },
      { tag: 'traction', text: 'Our users and their data.' },
      { tag: 'buzz', text: 'Vibes. Immaculate vibes.' },
    ],
  },
  {
    q: 'Is it AGI yet?',
    a: [
      { tag: 'buzz', text: 'Feel the AGI.' },
      { tag: 'tech', text: 'Not yet. But look at this.' },
      { tag: 'safety', text: 'Not until it\'s safe.' },
    ],
  },
  {
    q: 'What keeps you up at night?',
    a: [
      { tag: 'safety', text: 'Getting alignment right.' },
      { tag: 'tech', text: 'Not enough GPUs.' },
      { tag: 'traction', text: 'Servers melting from demand.' },
    ],
  },
];

export function pickQuestions(n = 3): PitchQ[] {
  const pool = [...PITCH_QS];
  const out: PitchQ[] = [];
  while (out.length < n && pool.length) out.push(pool.splice(Math.floor(Math.random() * pool.length), 1)[0]);
  return out;
}
