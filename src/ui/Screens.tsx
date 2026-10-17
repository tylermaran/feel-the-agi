import { useState } from 'react';
import type { GameState } from '../game/types';
import { CHAPTERS } from '../game/chapters';
import { PEOPLE } from '../game/people';
import { Character } from '../art/Sprite';
import { R } from '../art/pixels';
import { MapView } from '../art/MapView';
import { money, num, qLabel } from '../game/format';
import { Btn, FactButton } from './common';
import { newGame } from '../game/engine';

export function TitleScreen({ hasSave, onNew, onContinue }: { hasSave: boolean; onNew: () => void; onContinue: () => void }) {
  const [demo] = useState(newGame);
  return (
    <div className="screen title-screen">
      <div className="title-map">
        <MapView s={demo} interactive={false} fit="slice" />
      </div>
      <div className="title-content">
        <h1 className="logo">
          <span>AI</span>
          <span>ARMS</span>
          <span>RACE</span>
        </h1>
        <p className="tagline">A (mostly) true story of Silicon Valley</p>
        <svg viewBox="0 0 64 22" className="title-cast" shapeRendering="crispEdges">
          {['greg', 'sam', 'ilya', 'elon', 'karpathy'].map((id, i) => (
            <Character key={id} look={PEOPLE[id].look} x={2 + i * 12} y={3} delay={i * 180} flip={i > 2} />
          ))}
        </svg>
        <div className="title-btns">
          {hasSave && (
            <Btn variant="gold" onClick={onContinue} sound="coin">
              ▶ CONTINUE
            </Btn>
          )}
          <Btn variant={hasSave ? 'secondary' : 'gold'} onClick={onNew} sound="coin">
            {hasSave ? 'NEW GAME' : '▶ START'}
          </Btn>
        </div>
        <p className="disclaimer">A parody. Real people, wildly exaggerated. Facts are real-ish.</p>
      </div>
    </div>
  );
}

const SLIDES = [
  {
    when: 'July 2015 · Rosewood Hotel',
    text: 'A dinner on Sand Hill Road. One question: can anyone catch Google at AI?',
    cast: ['elon', 'sam', 'greg', 'ilya'],
    art: 'dinner',
  },
  {
    when: 'December 2015',
    text: 'OpenAI launches. $1 billion pledged. A nonprofit — "for all of humanity."',
    cast: ['sam', 'elon'],
    art: 'billion',
  },
  {
    when: 'Day One',
    text: 'You\'re Sam. You have a garage, four computers and a dream.',
    cast: ['sam'],
    art: 'garage',
  },
];

export function IntroSlides({ onDone }: { onDone: () => void }) {
  const [i, setI] = useState(0);
  const sl = SLIDES[i];
  const next = () => (i + 1 < SLIDES.length ? setI(i + 1) : onDone());
  return (
    <div className="screen intro" onClick={next}>
      <div className="intro-when" key={`w${i}`}>
        {sl.when}
      </div>
      <svg viewBox="0 0 80 44" className="intro-art" shapeRendering="crispEdges" key={`a${i}`}>
        <R x={0} y={0} w={80} h={44} c={sl.art === 'garage' ? '#4f5d75' : '#1b1a2e'} />
        {sl.art === 'dinner' && (
          <>
            <R x={0} y={30} w={80} h={14} c="#3b2420" />
            <R x={8} y={6} w={14} h={10} c="#2d3142" />
            <R x={9} y={7} w={12} h={8} c="#14213d" />
            <R x={58} y={6} w={14} h={10} c="#2d3142" />
            <R x={59} y={7} w={12} h={8} c="#14213d" />
            <R x={62} y={9} w={1} h={1} c="#fff" />
          </>
        )}
        {sl.art === 'billion' && (
          <>
            <text x={40} y={18} textAnchor="middle" className="px-text big-num">
              $1,000,000,000
            </text>
            <R x={0} y={34} w={80} h={10} c="#2d3142" />
          </>
        )}
        {sl.art === 'garage' && (
          <>
            <R x={0} y={32} w={80} h={12} c="#5c5c70" />
            <R x={50} y={6} w={26} h={26} c="#b8bccf" />
            {[10, 15, 20, 25].map((y) => (
              <R key={y} x={50} y={y} w={26} h={1} c="#8d92a8" />
            ))}
            <R x={50} y={29} w={26} h={3} c="#ffe8a3" />
            <R x={6} y={22} w={12} h={10} c="#cfc7b0" />
            <R x={7} y={23} w={10} h={7} c="#0b3d2e" />
            <R x={8} y={25} w={6} h={1} c="#3ddc97" className="blink" />
          </>
        )}
        {sl.cast.map((id, k) => {
          const n = sl.cast.length;
          const x = sl.art === 'garage' ? 30 : 40 - (n * 12) / 2 + k * 12 + 1;
          const y = sl.art === 'dinner' ? 16 : sl.art === 'garage' ? 18 : 20;
          return <Character key={id} look={PEOPLE[id].look} x={x} y={y} delay={k * 200} flip={k >= n / 2 && n > 1} />;
        })}
        {sl.art === 'dinner' && (
          <>
            <R x={12} y={27} w={56} h={5} c="#f4f4f4" />
            <R x={12} y={32} w={56} h={2} c="#c9c9c9" />
            <R x={15} y={34} w={2} h={8} c="#6b4423" />
            <R x={63} y={34} w={2} h={8} c="#6b4423" />
            <R x={20} y={26} w={5} h={1} c="#c9a227" />
            <R x={32} y={26} w={5} h={1} c="#c9a227" />
            <R x={44} y={26} w={5} h={1} c="#c9a227" />
            <R x={56} y={26} w={5} h={1} c="#c9a227" />
            <R x={39} y={23} w={2} h={4} c="#b5179e" />
            <R x={39.5} y={21} w={1} h={2} c="#ffd23f" className="blink" />
          </>
        )}
      </svg>
      <p className="intro-text" key={`t${i}`}>
        {sl.text}
      </p>
      <div className="intro-dots">
        {SLIDES.map((_, k) => (
          <span key={k} className={k === i ? 'on' : ''} />
        ))}
      </div>
      <div className="tap-hint">tap to continue &gt;</div>
    </div>
  );
}

export function ChapterComplete({ s, onNext }: { s: GameState; onNext: () => void }) {
  const ch = CHAPTERS[s.chapter];
  const model = s.models.find((m) => m.name === ch.goal.model);
  const diff = model ? ch.goal.histQ - model.q : 0;
  return (
    <div className="screen complete">
      <div className="complete-badge">CHAPTER {ch.id + 1} COMPLETE</div>
      <div className="trophy">🏆</div>
      <h2>{ch.goal.model} shipped!</h2>
      {model && (
        <div className={`history-check ${diff >= 0 ? 'pos' : 'neg'}`}>
          You: {qLabel(model.q)} · History: {qLabel(ch.goal.histQ)}
          <br />
          {diff > 0
            ? `🏎️ ${diff} quarter${diff > 1 ? 's' : ''} ahead of history!`
            : diff === 0
              ? '🎯 Right on schedule.'
              : `🐢 ${-diff} quarter${diff < -1 ? 's' : ''} behind history`}
        </div>
      )}
      <div className="complete-stats">
        <div>
          <span>💵</span>
          {money(s.cash)}
        </div>
        <div>
          <span>👩‍💻</span>
          {s.eng}
        </div>
        <div>
          <span>🖥️</span>
          {num(s.gpus)}
        </div>
        <div>
          <span>👥</span>
          {num(s.users)}
        </div>
      </div>
      <div className="teaser">Next up: {ch.nextTeaser}</div>
      <Btn variant="gold" onClick={onNext} sound="coin">
        Next chapter &gt;
      </Btn>
    </div>
  );
}

export function VsScreen({ onDone }: { onDone: () => void }) {
  return (
    <div className="screen vs" onClick={onDone}>
      <div className="vs-flash">A CHALLENGER APPEARS!</div>
      <div className="vs-row">
        <div className="vs-side left">
          <svg viewBox="-2 -2 14 20" shapeRendering="crispEdges">
            <Character look={PEOPLE.sam.look} />
          </svg>
          <span>SAM</span>
          <small>OpenAI</small>
        </div>
        <div className="vs-mid">VS</div>
        <div className="vs-side right">
          <svg viewBox="-2 -2 14 20" shapeRendering="crispEdges">
            <Character look={PEOPLE.dario.look} flip />
          </svg>
          <span>DARIO</span>
          <small>Anthropic</small>
        </div>
      </div>
      <div className="vs-sub">ANTHROPIC ENTERS THE RACE</div>
      <div className="tap-hint">tap to continue &gt;</div>
    </div>
  );
}

export function GameOver({ onRetry, onNew }: { onRetry: () => void; onNew: () => void }) {
  return (
    <div className="screen gameover">
      <div className="go-skull">💀</div>
      <h2>OUT OF CASH</h2>
      <p>Even AGI needs payroll.</p>
      <Btn variant="gold" onClick={onRetry}>
        Retry chapter
      </Btn>
      <Btn variant="secondary" onClick={onNew}>
        New game
      </Btn>
    </div>
  );
}

export function Finale({ s, onFree, onNew }: { s: GameState; onFree: () => void; onNew: () => void }) {
  const raised = s.rounds.reduce((a, r) => a + r.amount, 0);
  return (
    <div className="screen finale">
      <div className="complete-badge">CHAPTER 3 COMPLETE</div>
      <h2>
        The race is ON.{' '}
        <FactButton
          title="Anthropic"
          text="Anthropic launched in 2021 with $124M. Its first model would be named Claude."
        />
      </h2>
      <p className="finale-text">
        {s.safety >= 60
          ? 'Your safety cred kept most of the team. But Dario has a head start on "safe AI."'
          : 'Low safety score: a big chunk of your best researchers walked out with Dario.'}
      </p>
      <div className="complete-stats">
        <div>
          <span>🤖</span>
          {s.models.length} models
        </div>
        <div>
          <span>💰</span>
          {money(raised)}
        </div>
        <div>
          <span>👥</span>
          {num(s.users)}
        </div>
        <div>
          <span>🛡️</span>
          {Math.round(s.safety)}
        </div>
      </div>
      <div className="teaser big">
        TO BE CONTINUED…
        <br />
        <small>Chapter 4 · ChatGPT · Nov 30, 2022</small>
      </div>
      <Btn variant="gold" onClick={onFree}>
        Keep playing (free play)
      </Btn>
      <Btn variant="secondary" onClick={onNew}>
        New game
      </Btn>
    </div>
  );
}

export function ChapterIntro({ s, onDone }: { s: GameState; onDone: () => void }) {
  const ch = CHAPTERS[s.chapter];
  return (
    <div className="backdrop center">
      <div className="event pixel-box pop">
        <div className="event-date">
          CHAPTER {ch.id + 1} · {qLabel(s.q)}
        </div>
        <div className="event-art">
          <span className="event-emoji">{ch.intro.emoji}</span>
        </div>
        <h2 className="event-title">
          {ch.intro.title} <FactButton title={ch.intro.title} text={ch.intro.fact} />
        </h2>
        <p className="event-text">{ch.intro.text}</p>
        <div className="goal-preview">
          🎯 Goal: train <b>{ch.goal.model}</b> ({ch.goal.params} params)
        </div>
        {ch.joins.length > 0 && (
          <div className="joins">
            New faces: {ch.joins.map((j) => PEOPLE[j].name).join(', ')}
          </div>
        )}
        <Btn variant="gold" onClick={onDone} sound="coin">
          Let's go &gt;
        </Btn>
      </div>
    </div>
  );
}
