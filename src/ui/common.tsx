import { useState } from 'react';
import type { ReactNode } from 'react';
import { createPortal } from 'react-dom';
import type { Fx, Stat } from '../game/types';
import { money, num } from '../game/format';
import { sfx } from '../game/sfx';

export const ICON: Record<Stat, string> = {
  cash: '💵',
  eng: '👩‍💻',
  gpus: '🖥️',
  research: '🧠',
  hype: '🔥',
  users: '👥',
  safety: '🛡️',
};

const ORDER: Stat[] = ['cash', 'eng', 'gpus', 'research', 'users', 'hype', 'safety'];

export function fmtStat(k: Stat, v: number, sign = true) {
  if (k === 'cash') return money(v, sign);
  return num(v, sign);
}

export function FxChips({ fx, small }: { fx: Fx; small?: boolean }) {
  const keys = ORDER.filter((k) => fx[k]);
  if (!keys.length) return null;
  return (
    <div className={`chips ${small ? 'small' : ''}`}>
      {keys.map((k) => (
        <span key={k} className={`chip ${fx[k]! < 0 ? 'neg' : 'pos'}`}>
          {ICON[k]}
          {fmtStat(k, fx[k]!)}
        </span>
      ))}
    </div>
  );
}

export function Sheet({
  children,
  onClose,
  title,
  className,
  closable = true,
}: {
  children: ReactNode;
  onClose?: () => void;
  title?: ReactNode;
  className?: string;
  closable?: boolean;
}) {
  return (
    <div className="backdrop" onClick={closable ? onClose : undefined}>
      <div className={`sheet pixel-box ${className ?? ''}`} onClick={(e) => e.stopPropagation()}>
        {(title || (closable && onClose)) && (
          <div className="sheet-head">
            <div className="sheet-title">{title}</div>
            {closable && onClose && (
              <button
                className="x-btn"
                onClick={() => {
                  sfx('tap');
                  onClose();
                }}
                aria-label="Close"
              >
                ✕
              </button>
            )}
          </div>
        )}
        <div className="sheet-body">{children}</div>
      </div>
    </div>
  );
}

export function Btn({
  children,
  onClick,
  variant = 'primary',
  disabled,
  className,
  sound = 'tap',
}: {
  children: ReactNode;
  onClick?: () => void;
  variant?: 'primary' | 'secondary' | 'gold' | 'danger' | 'ghost';
  disabled?: boolean;
  className?: string;
  sound?: 'tap' | 'coin' | 'whoosh' | null;
}) {
  return (
    <button
      className={`btn btn-${variant} ${className ?? ''}`}
      disabled={disabled}
      onClick={() => {
        if (sound) sfx(sound);
        onClick?.();
      }}
    >
      {children}
    </button>
  );
}

export function FactButton({ title, text }: { title: string; text?: string }) {
  const [open, setOpen] = useState(false);
  if (!text) return null;
  return (
    <>
      <button
        className="fact-btn"
        aria-label={`Real history: ${title}`}
        onClick={(e) => {
          e.stopPropagation();
          sfx('tap');
          setOpen(true);
        }}
      >
        💡
      </button>
      {open &&
        createPortal(
          <div className="factpop-backdrop" onClick={() => setOpen(false)}>
            <div className="factpop pixel-box pop" onClick={(e) => e.stopPropagation()}>
              <div className="factpop-head">💡 {title}</div>
              <p>{text}</p>
              <Btn variant="secondary" onClick={() => setOpen(false)}>
                Got it
              </Btn>
            </div>
          </div>,
          document.body,
        )}
    </>
  );
}

export function Meter({ value, max = 100, color }: { value: number; max?: number; color: string }) {
  const pct = Math.max(0, Math.min(100, (value / max) * 100));
  return (
    <div className="meter">
      <div className="meter-fill" style={{ width: `${pct}%`, background: color }} />
    </div>
  );
}
