type Sound = 'tap' | 'coin' | 'bad' | 'event' | 'win' | 'train' | 'whoosh';

let ctx: AudioContext | null = null;
let muted = localStorage.getItem('aiarms.muted') === '1';

export const isMuted = () => muted;
export function setMuted(m: boolean) {
  muted = m;
  localStorage.setItem('aiarms.muted', m ? '1' : '0');
}

const NOTES: Record<Sound, [number, number][]> = {
  tap: [[660, 0.04]],
  coin: [
    [988, 0.07],
    [1319, 0.18],
  ],
  bad: [
    [220, 0.12],
    [165, 0.2],
  ],
  event: [
    [523, 0.08],
    [659, 0.08],
    [784, 0.12],
  ],
  win: [
    [523, 0.1],
    [659, 0.1],
    [784, 0.1],
    [1047, 0.3],
  ],
  train: [
    [262, 0.06],
    [330, 0.06],
    [392, 0.06],
    [523, 0.06],
  ],
  whoosh: [
    [880, 0.05],
    [440, 0.08],
  ],
};

export function sfx(name: Sound) {
  if (muted) return;
  try {
    ctx ??= new AudioContext();
    if (ctx.state === 'suspended') void ctx.resume();
    let t = ctx.currentTime;
    for (const [freq, dur] of NOTES[name]) {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = 'square';
      o.frequency.value = freq;
      g.gain.setValueAtTime(0.06, t);
      g.gain.exponentialRampToValueAtTime(0.001, t + dur);
      o.connect(g).connect(ctx.destination);
      o.start(t);
      o.stop(t + dur);
      t += dur * 0.9;
    }
  } catch {
    /* audio unavailable */
  }
}
