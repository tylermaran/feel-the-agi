export type HairStyle =
  | 'short'
  | 'beard'
  | 'baldSides'
  | 'swept'
  | 'messy'
  | 'curly'
  | 'mop'
  | 'long'
  | 'bob'
  | 'buzz';

export type Outfit = 'tee' | 'hoodie' | 'suit' | 'suitTie' | 'vest' | 'leather' | 'sweater';

export interface Look {
  skin: string;
  hair: string;
  style: HairStyle;
  shirt: string;
  accent?: string;
  pants?: string;
  shoes?: string;
  glasses?: boolean;
  outfit?: Outfit;
}

export interface Person {
  id: string;
  name: string;
  role: string;
  quote: string;
  fact: string;
  look: Look;
}

const SKIN = { light: '#f2c7a5', fair: '#f5d0b0', warm: '#e8b98f', tan: '#d9a27a', brown: '#b97a4f' };

export const PEOPLE: Record<string, Person> = {
  sam: {
    id: 'sam',
    name: 'Sam Altman',
    role: 'Co-chair · Chief Vibes Officer',
    quote: '"AI will probably most likely lead to the end of the world, but in the meantime, there\'ll be great companies."',
    fact: 'Ran Y Combinator at the same time. Dropped out of Stanford at 19 to start Loopt.',
    look: { skin: SKIN.light, hair: '#6b4a2b', style: 'short', shirt: '#3d6b4f', outfit: 'sweater', shoes: '#e8e8e8' },
  },
  greg: {
    id: 'greg',
    name: 'Greg Brockman',
    role: 'CTO · Writes All The Code',
    quote: '"I\'ll just ship it tonight."',
    fact: 'Ex-CTO of Stripe. OpenAI\'s very first office was literally his apartment.',
    look: { skin: '#f0c39b', hair: '#3b2a1e', style: 'beard', shirt: '#3a7bd5' },
  },
  ilya: {
    id: 'ilya',
    name: 'Ilya Sutskever',
    role: 'Research Director · AGI Whisperer',
    quote: '"Feel the AGI!"',
    fact: 'Co-created AlexNet (2012), the paper that kicked off the whole deep learning boom.',
    look: { skin: SKIN.light, hair: '#3a2f2a', style: 'baldSides', shirt: '#2b2b38', outfit: 'sweater' },
  },
  elon: {
    id: 'elon',
    name: 'Elon Musk',
    role: 'Co-chair · Chief Check Writer',
    quote: '"With artificial intelligence, we are summoning the demon."',
    fact: 'Was running Tesla AND SpaceX at the same time. Sleep: optional.',
    look: { skin: '#f0c39b', hair: '#2a211c', style: 'swept', shirt: '#1d1d24', outfit: 'suit', pants: '#1d1d24', shoes: '#111' },
  },
  karpathy: {
    id: 'karpathy',
    name: 'Andrej Karpathy',
    role: 'Research Scientist',
    quote: '"Gradient descent can write code better than you. I\'m sorry."',
    fact: 'His Stanford course CS231n taught a whole generation deep learning.',
    look: { skin: SKIN.light, hair: '#2b1d14', style: 'messy', shirt: '#e07a3f', outfit: 'hoodie' },
  },
  dario: {
    id: 'dario',
    name: 'Dario Amodei',
    role: 'Safety Lead → VP of Research',
    quote: '"Cool. Now how do we make sure it\'s safe?"',
    fact: 'Physics PhD from Princeton who studied real neural circuits before artificial ones.',
    look: { skin: SKIN.warm, hair: '#2b1d14', style: 'curly', shirt: '#5b7fbf', glasses: true },
  },
  alec: {
    id: 'alec',
    name: 'Alec Radford',
    role: 'Researcher · Quiet Genius',
    quote: '"..." *quietly invents GPT*',
    fact: 'Lead author of GPT-1 and GPT-2. Famously avoids the spotlight.',
    look: { skin: SKIN.fair, hair: '#e3c16f', style: 'mop', shirt: '#6c6c7c', outfit: 'hoodie' },
  },
  mira: {
    id: 'mira',
    name: 'Mira Murati',
    role: 'VP of Applied AI',
    quote: '"Let\'s put this in people\'s hands."',
    fact: 'Joined in 2018 after working on the Tesla Model X.',
    look: { skin: SKIN.warm, hair: '#2a1a14', style: 'long', shirt: '#c94f6d' },
  },
  daniela: {
    id: 'daniela',
    name: 'Daniela Amodei',
    role: 'VP of Safety & Policy',
    quote: '"We need a plan for this."',
    fact: 'Dario\'s sister. Previously at Stripe — just like Greg.',
    look: { skin: SKIN.light, hair: '#7a4b2a', style: 'long', shirt: '#7b5ea7' },
  },
  jensen: {
    id: 'jensen',
    name: 'Jensen Huang',
    role: 'NVIDIA CEO · Leather Jacket Enjoyer',
    quote: '"The more you buy, the more you save!"',
    fact: 'Co-founded NVIDIA in a Denny\'s booth in 1993.',
    look: { skin: '#e0b48a', hair: '#1c1c1c', style: 'short', shirt: '#1a1a1a', accent: '#4a4a4a', outfit: 'leather', pants: '#222' },
  },
  satya: {
    id: 'satya',
    name: 'Satya Nadella',
    role: 'Microsoft CEO',
    quote: '"Let\'s go deeper on Azure."',
    fact: 'Microsoft CEO since 2014. Turned the company into a cloud giant.',
    look: { skin: SKIN.brown, hair: '#555', style: 'buzz', shirt: '#23305a', accent: '#6a8fd8', outfit: 'suitTie', glasses: true, pants: '#23305a' },
  },
  demis: {
    id: 'demis',
    name: 'Demis Hassabis',
    role: 'DeepMind CEO',
    quote: '"Solve intelligence, then use it to solve everything else."',
    fact: 'Chess prodigy and video-game designer (Theme Park!) before AI.',
    look: { skin: SKIN.tan, hair: '#222', style: 'short', shirt: '#404a6b', outfit: 'sweater' },
  },
  jeff: {
    id: 'jeff',
    name: 'Jeff Dean',
    role: 'Google Brain Lead',
    quote: '"Compilers don\'t warn Jeff Dean. Jeff Dean warns compilers."',
    fact: 'Co-founded Google Brain in 2011. Its early net learned to spot cats in YouTube videos.',
    look: { skin: SKIN.light, hair: '#a8a8a8', style: 'short', shirt: '#5c8a3a' },
  },
  yann: {
    id: 'yann',
    name: 'Yann LeCun',
    role: 'Facebook AI Research',
    quote: '"Actually, you\'re all wrong."',
    fact: 'Pioneered convolutional neural nets in the 1980s. Loves a good online debate.',
    look: { skin: SKIN.light, hair: '#9a9a9a', style: 'short', shirt: '#2b3a5c', glasses: true },
  },
  reid: {
    id: 'reid',
    name: 'Reid Hoffman',
    role: 'LinkedIn Founder',
    quote: '"Blitzscale me, Sam."',
    fact: 'An early OpenAI donor and later a board member.',
    look: { skin: SKIN.light, hair: '#5a4636', style: 'short', shirt: '#4a7fbf', accent: '#444c5c', outfit: 'vest', glasses: true },
  },
  jessica: {
    id: 'jessica',
    name: 'Jessica Livingston',
    role: 'Y Combinator Co-founder',
    quote: '"Show me something real."',
    fact: 'Co-founded YC in 2005. One of OpenAI\'s launch donors.',
    look: { skin: SKIN.light, hair: '#8a5a3a', style: 'bob', shirt: '#e8a0b0' },
  },
  thiel: {
    id: 'thiel',
    name: 'Peter Thiel',
    role: 'Contrarian Investor',
    quote: '"What important truth do very few people agree with you on?"',
    fact: 'PayPal co-founder and Facebook\'s first outside investor.',
    look: { skin: SKIN.light, hair: '#c9a46a', style: 'short', shirt: '#2a2a3a', outfit: 'suit', pants: '#2a2a3a' },
  },
  holden: {
    id: 'holden',
    name: 'Holden Karnofsky',
    role: 'Open Philanthropy',
    quote: '"How exactly will you keep it safe?"',
    fact: 'Open Philanthropy granted OpenAI $30M in 2017 and Holden joined the board.',
    look: { skin: SKIN.light, hair: '#3a2a1e', style: 'short', shirt: '#6aa86a', glasses: true },
  },
  vinod: {
    id: 'vinod',
    name: 'Vinod Khosla',
    role: 'Khosla Ventures',
    quote: '"I like bets that are 90% likely to fail."',
    fact: 'Sun Microsystems co-founder. Khosla Ventures put $50M into OpenAI LP in 2019.',
    look: { skin: SKIN.brown, hair: '#e0e0e0', style: 'short', shirt: '#dfe7f2', accent: '#2f3b52', outfit: 'vest' },
  },
  sequoia: {
    id: 'sequoia',
    name: 'Pat the Partner',
    role: 'Sequoia Capital',
    quote: '"What\'s the DAU curve look like?"',
    fact: 'Sequoia backed Apple, Google and WhatsApp. A stylized partner, not a real one.',
    look: { skin: SKIN.warm, hair: '#333', style: 'short', shirt: '#ffffff', accent: '#2b4a2b', outfit: 'vest' },
  },
};

const ENG_HAIR = ['#2b1d14', '#6b4a2b', '#e3c16f', '#a33', '#111', '#7a4b2a'];
const ENG_STYLE: HairStyle[] = ['short', 'messy', 'mop', 'long', 'bob', 'curly'];
const ENG_SHIRT = ['#2a9d8f', '#e76f51', '#8338ec', '#3a86ff', '#ffbe0b', '#6c757d'];
const ENG_SKIN = [SKIN.light, SKIN.tan, SKIN.brown, SKIN.warm, '#8d5524', SKIN.fair];

export function engLook(i: number): Look {
  return {
    skin: ENG_SKIN[i % ENG_SKIN.length],
    hair: ENG_HAIR[(i * 5 + 1) % ENG_HAIR.length],
    style: ENG_STYLE[(i * 3 + 2) % ENG_STYLE.length],
    shirt: ENG_SHIRT[(i * 7 + 3) % ENG_SHIRT.length],
    outfit: i % 2 ? 'hoodie' : 'tee',
    glasses: i % 3 === 0,
  };
}
