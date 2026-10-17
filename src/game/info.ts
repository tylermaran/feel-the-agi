import type { GameState } from './types';
import { num } from './format';

export interface ItemInfo {
  emoji: string;
  title: string;
  lines: string[];
  fact?: string;
  paper?: boolean;
}

export function itemInfo(id: string, s: GameState): ItemInfo | null {
  switch (id) {
    case 'paper':
      if (!s.flags.paper)
        return {
          emoji: '🚀',
          title: '"AGI or Bust" poster',
          lines: ['A motivational poster. For now.', 'Something big is coming in 2017...'],
          fact: 'Before 2017, language AI mostly meant RNNs reading one word at a time.',
        };
      return {
        emoji: '📄',
        title: 'Attention Is All You Need',
        paper: true,
        lines: [],
        fact: 'It became one of the most-cited papers of the 21st century.',
      };
    case 'whiteboard':
      return {
        emoji: '📋',
        title: 'The Master Plan',
        lines: ['1. Build AGI', '2. ???', '3. Benefit all of humanity'],
        fact: 'OpenAI\'s 2015 launch post: "unconstrained by a need to generate financial return."',
      };
    case 'boxes':
      return {
        emoji: '📦',
        title: 'Box labeled "AGI PARTS"',
        lines: ['Contents: 3 ethernet cables, a Raspberry Pi,', 'and a printed copy of the YC application.'],
      };
    case 'fridge':
      return {
        emoji: '🧃',
        title: 'The Fridge',
        lines: ['40 cans of LaCroix.', '1 Soylent. Nobody knows whose.'],
      };
    case 'pizza':
      return {
        emoji: '🍕',
        title: 'Pizza box (day 3)',
        lines: ['The official fuel of early AI research.'],
      };
    case 'dgx':
      return {
        emoji: '📦',
        title: 'NVIDIA DGX-1',
        lines: ['8 GPUs in one box. $129,000.', '"To Elon & the OpenAI Team! To the future of computing and humanity."'],
        fact: 'Jensen Huang hand-delivered the world\'s first DGX-1 to OpenAI in Aug 2016.',
      };
    case 'door':
      return {
        emoji: '🚪',
        title: 'Garage door',
        lines: ['Tap the 🗺️ Map button to head out.'],
      };
    case 'window':
      return {
        emoji: '🏙️',
        title: 'Mission District views',
        lines: ['Your new home: an old brick factory building.'],
        fact: 'OpenAI\'s real HQ was a converted trunk factory it shared with Neuralink.',
      };
    case 'dota':
      return {
        emoji: '🎮',
        title: 'Dota 2 poster',
        lines: ['Video games: the gym class of AI.'],
        fact: 'OpenAI Five played 180 years of Dota against itself every single day.',
      };
    case 'chart':
      return {
        emoji: '📈',
        title: '"AI and Compute" chart',
        lines: ['Compute for the biggest AI runs is exploding.'],
        fact: 'Since 2012 it doubled every ~3.4 months — far faster than Moore\'s Law.',
      };
    case 'warning':
      return {
        emoji: '⚠️',
        title: '"TOO DANGEROUS TO RELEASE"',
        lines: ['The best marketing sign ever printed.'],
        fact: 'GPT-2\'s famous sample: a story about unicorns discovered in the Andes.',
      };
    case 'espresso':
      return {
        emoji: '☕',
        title: 'Espresso machine',
        lines: ['Runs harder than the GPUs.'],
      };
    case 'trophy':
      return {
        emoji: '🏆',
        title: 'OpenAI Five trophy',
        lines: ['Beat OG, the reigning Dota 2 world champs.'],
        fact: 'April 2019 — the first AI to beat world champions at an esports game.',
      };
    case 'racks':
      return {
        emoji: '🗄️',
        title: 'Server racks',
        lines: [`${num(s.gpus)} GPUs humming.`, 'Buy more GPUs to light up more racks.'],
        fact: 'GPT-3 trained on NVIDIA V100 GPUs in a Microsoft data center.',
      };
    case 'scaling':
      return {
        emoji: '📉',
        title: 'Scaling Laws',
        lines: ['Straight lines on a log-log plot.', 'More compute → lower loss. Every time.'],
        fact: 'Jan 2020, by Jared Kaplan, Sam McCandlish, Dario Amodei and others.',
      };
    case 'plaque':
      return {
        emoji: '🏅',
        title: 'Supercomputer plaque',
        lines: ['285,000 CPU cores', '10,000 GPUs', '400 Gb/s per GPU server'],
        fact: 'Microsoft said it ranked among the top 5 supercomputers on Earth (2020).',
      };
    case 'cooling':
      return {
        emoji: '❄️',
        title: 'Cooling unit',
        lines: ['It is VERY loud in here.'],
        fact: 'Big AI data centers can drink millions of gallons of water for cooling.',
      };
    case 'api':
      return {
        emoji: '🌐',
        title: 'API dashboard',
        lines: [`${num(s.users)} developers & users`, 'Waitlist: very long.'],
      };
  }
  return null;
}

export interface Rival {
  name: string;
  leader: string;
  leaderRole?: string;
  org: string;
  blurb: string;
  fact: string;
}

export const RIVALS: Record<string, Rival> = {
  google: {
    name: 'Google Brain',
    leader: 'jeff',
    org: 'Google',
    blurb: 'Mountain View. Infinite money. Invented the Transformer.',
    fact: 'Its 2012 "cat neuron" learned to spot cats from YouTube on 16,000 CPU cores.',
  },
  deepmind: {
    name: 'DeepMind',
    leader: 'demis',
    org: 'DeepMind',
    blurb: 'London. Owned by Google since 2014. Loves games.',
    fact: 'Google bought DeepMind in 2014 for a reported ~$500M.',
  },
  fair: {
    name: 'Facebook AI Research',
    leader: 'yann',
    org: 'Facebook',
    blurb: 'Menlo Park. Open-sources everything. Very opinionated.',
    fact: 'FAIR launched in Dec 2013. Its PyTorch framework came out in 2016.',
  },
  msft: {
    name: 'Microsoft',
    leader: 'satya',
    org: 'Microsoft',
    blurb: 'Redmond. Has a cloud. Wants an AI partner.',
    fact: 'Microsoft tried to build its own AI assistant first: Cortana (2014).',
  },
  anthropic: {
    name: 'Anthropic',
    leader: 'dario',
    leaderRole: 'Anthropic CEO',
    org: 'Anthropic',
    blurb: 'San Francisco. Ex-OpenAI. Safety first. Your new rival.',
    fact: 'Founded in 2021 by Dario and Daniela Amodei and five other ex-OpenAI staff.',
  },
};
