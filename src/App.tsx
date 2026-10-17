import { useEffect, useReducer, useState } from 'react';
import type { ReactNode } from 'react';
import type { GameState } from './game/types';
import { CHAPTERS } from './game/chapters';
import {
  clearSave,
  findEvent,
  loadCheckpoint,
  loadSave,
  newGame,
  reducer,
  save,
  saveCheckpoint,
} from './game/engine';
import { qLabel, money } from './game/format';
import { sfx } from './game/sfx';
import { GarageScene } from './art/Garage';
import { OfficeScene } from './art/Office';
import { DataCenterScene } from './art/DataCenter';
import { MapView } from './art/MapView';
import type { Loc } from './art/MapView';
import { Hud, Objective } from './ui/Hud';
import { ActionBar, CardTray } from './ui/CardTray';
import { EventModal } from './ui/EventModal';
import { StatsPanel } from './ui/StatsPanel';
import { GpuSheet, HireSheet } from './ui/Shops';
import { Fundraise } from './ui/Fundraise';
import { TrainSequence } from './ui/TrainSequence';
import { ItemSheet, PersonSheet, RivalSheet } from './ui/InfoSheets';
import { ChapterComplete, ChapterIntro, Finale, GameOver, IntroSlides, TitleScreen, VsScreen } from './ui/Screens';
import { Btn, Sheet } from './ui/common';

type Overlay =
  | { k: 'stats' }
  | { k: 'hire' }
  | { k: 'gpus' }
  | { k: 'raise' }
  | { k: 'item'; id: string }
  | { k: 'person'; id: string }
  | { k: 'rival'; id: string }
  | { k: 'msg'; title: string; text: string }
  | null;

const SCENE_BG: Record<string, string> = {
  garage: 'linear-gradient(#2d3142 50%, #5c5c70 50%)',
  office: 'linear-gradient(#3b2420 50%, #9c6b3c 50%)',
  datacenter: 'linear-gradient(#0d0f1a 50%, #11131f 50%)',
};

const TIP_KEY = 'aiarms.tip.v1';

export default function App() {
  const [screen, setScreen] = useState<'title' | 'intro' | 'game'>('title');
  const [s, dispatch] = useReducer(reducer, undefined, () => loadSave() ?? newGame());
  const [hasSave, setHasSave] = useState(() => !!loadSave());
  const [view, setView] = useState<'hq' | 'map'>('hq');
  const [overlay, setOverlay] = useState<Overlay>(null);
  const [training, setTraining] = useState(false);
  const [chapterIntro, setChapterIntro] = useState(false);
  const [vs, setVs] = useState(false);
  const [report, setReport] = useState<GameState['report'] | null>(null);
  const [tip, setTip] = useState(false);

  useEffect(() => {
    if (screen === 'game') save(s);
  }, [s, screen]);

  useEffect(() => {
    if (!s.report) return;
    setReport(s.report);
    const t = setTimeout(() => setReport(null), 2600);
    return () => clearTimeout(t);
  }, [s.report]);

  const ch = CHAPTERS[s.chapter];
  const close = () => setOverlay(null);

  const start = () => {
    clearSave();
    const g = newGame();
    dispatch({ type: 'load', state: g });
    saveCheckpoint(g);
    setView('hq');
    setScreen('intro');
  };

  if (screen === 'title') {
    return (
      <Shell>
        <TitleScreen
          hasSave={hasSave}
          onNew={start}
          onContinue={() => {
            setScreen('game');
          }}
        />
      </Shell>
    );
  }

  if (screen === 'intro') {
    return (
      <Shell>
        <IntroSlides
          onDone={() => {
            sfx('event');
            setScreen('game');
            setChapterIntro(true);
            setHasSave(true);
            if (!localStorage.getItem(TIP_KEY)) setTip(true);
          }}
        />
      </Shell>
    );
  }

  const broke = !!s.flags.broke;
  const complete = !!s.flags[ch.completeFlag] && s.queue.length === 0 && !training;
  const isFinalChapter = s.chapter === CHAPTERS.length - 1;

  if (broke) {
    return (
      <Shell>
        <GameOver
          onRetry={() => {
            const cp = loadCheckpoint();
            dispatch({ type: 'load', state: cp ?? newGame() });
            setChapterIntro(true);
          }}
          onNew={() => {
            clearSave();
            setHasSave(false);
            setScreen('title');
          }}
        />
      </Shell>
    );
  }

  if (vs) {
    return (
      <Shell>
        <VsScreen
          onDone={() => {
            sfx('win');
            setVs(false);
          }}
        />
      </Shell>
    );
  }

  if (complete && !s.freePlay) {
    if (isFinalChapter) {
      return (
        <Shell>
          <Finale
            s={s}
            onFree={() => {
              dispatch({ type: 'freePlay' });
              setView('map');
            }}
            onNew={() => {
              clearSave();
              setHasSave(false);
              setScreen('title');
            }}
          />
        </Shell>
      );
    }
    return (
      <Shell>
        <ChapterComplete
          s={s}
          onNext={() => {
            const n = reducer(s, { type: 'nextChapter' });
            dispatch({ type: 'load', state: n });
            saveCheckpoint(n);
            setView('hq');
            setReport(null);
            setChapterIntro(true);
          }}
        />
      </Shell>
    );
  }

  const ev = s.queue.length ? findEvent(s.queue[0]) : undefined;
  const busy = !!ev || training || chapterIntro || !!overlay;

  const onLocation = (l: Loc) => {
    sfx('tap');
    if (l.kind === 'hq') {
      if (l.hqChapter === s.chapter) setView('hq');
      else if ((l.hqChapter ?? 0) < s.chapter)
        setOverlay({ k: 'msg', title: `🏚️ ${l.label}`, text: 'Your old HQ. Rent was cheaper back then.' });
      else setOverlay({ k: 'msg', title: '🔒 Locked', text: `Unlocks in Chapter ${(l.hqChapter ?? 0) + 1}.` });
    } else if (l.kind === 'vc') setOverlay({ k: 'raise' });
    else if (l.kind === 'shop') setOverlay({ k: 'gpus' });
    else setOverlay({ k: 'rival', id: l.id });
  };

  const sceneProps = {
    s,
    onItem: (id: string) => {
      sfx('tap');
      if (id === 'door') setView('map');
      else setOverlay({ k: 'item', id });
    },
    onPerson: (id: string) => {
      sfx('tap');
      setOverlay({ k: 'person', id });
    },
  };

  return (
    <Shell>
      <div className="game">
        <Hud s={s} onOpen={() => setOverlay({ k: 'stats' })} />
        <Objective s={s} />
        <main className="viewport" style={{ background: view === 'map' ? '#2b59c3' : SCENE_BG[ch.hq] }}>
          {view === 'map' ? (
            <MapView s={s} onLocation={onLocation} />
          ) : (
            <svg viewBox="0 0 128 80" className="scene-svg" shapeRendering="crispEdges" overflow="visible" key={ch.hq}>
              {ch.hq === 'garage' && <GarageScene {...sceneProps} />}
              {ch.hq === 'office' && <OfficeScene {...sceneProps} />}
              {ch.hq === 'datacenter' && <DataCenterScene {...sceneProps} />}
            </svg>
          )}
          <div className="view-label">{view === 'map' ? '🗺️ Bay Area · tap a place' : `📍 ${ch.name}`}</div>
          {report && (
            <div className="report" key={report.id}>
              {qLabel(report.q)} done · 🧠+{report.research} · {money(report.net, true)}
            </div>
          )}
          {tip && !busy && (
            <button
              className="toast tip"
              onClick={() => {
                localStorage.setItem(TIP_KEY, '1');
                setTip(false);
              }}
            >
              👋 Pick a card to end the quarter. Tap people & things! ✕
            </button>
          )}
        </main>
        <CardTray
          s={s}
          busy={busy}
          onPlay={(id) => {
            setTip(false);
            localStorage.setItem(TIP_KEY, '1');
            dispatch({ type: 'play', id });
          }}
          onTrain={() => setTraining(true)}
        />
        <ActionBar
          view={view}
          busy={busy}
          onToggleView={() => setView(view === 'map' ? 'hq' : 'map')}
          onHire={() => setOverlay({ k: 'hire' })}
          onGpus={() => setOverlay({ k: 'gpus' })}
          onRaise={() => setOverlay({ k: 'raise' })}
        />

        {overlay?.k === 'stats' && <StatsPanel s={s} onClose={close} />}
        {overlay?.k === 'hire' && <HireSheet s={s} onClose={close} onHire={(n) => dispatch({ type: 'hire', n })} />}
        {overlay?.k === 'gpus' && <GpuSheet s={s} onClose={close} onBuy={(n) => dispatch({ type: 'buy', n })} />}
        {overlay?.k === 'raise' && (
          <Fundraise
            s={s}
            onClose={close}
            onDone={(r) => {
              close();
              dispatch({ type: 'raise', ...r });
            }}
          />
        )}
        {overlay?.k === 'item' && <ItemSheet id={overlay.id} s={s} onClose={close} />}
        {overlay?.k === 'person' && <PersonSheet id={overlay.id} s={s} onClose={close} />}
        {overlay?.k === 'rival' && <RivalSheet id={overlay.id} s={s} onClose={close} />}
        {overlay?.k === 'msg' && (
          <Sheet title={overlay.title} onClose={close}>
            <p className="item-lines">{overlay.text}</p>
            <Btn variant="secondary" onClick={close}>
              OK
            </Btn>
          </Sheet>
        )}

        {training && (
          <TrainSequence
            goal={ch.goal}
            onDone={() => {
              setTraining(false);
              dispatch({ type: 'train' });
            }}
          />
        )}

        {chapterIntro && !training && <ChapterIntro s={s} onDone={() => setChapterIntro(false)} />}

        {!chapterIntro && !training && ev && (
          <EventModal
            key={ev.id + s.q}
            s={s}
            ev={ev}
            onChoose={(i) => {
              if (ev.id === 'darioexit') setVs(true);
              dispatch({ type: 'choose', idx: i });
            }}
          />
        )}
      </div>
    </Shell>
  );
}

function Shell({ children }: { children: ReactNode }) {
  return <div className="shell">{children}</div>;
}
