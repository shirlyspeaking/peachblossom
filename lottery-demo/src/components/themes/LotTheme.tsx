import { useEffect, useRef } from 'react';
import type { ThemeViewProps } from '../../lib/types';

export function LotTheme({
  items,
  remaining,
  phase,
  pendingWinners,
  onRevealDone,
}: ThemeViewProps) {
  const pool = remaining.length > 0 ? remaining : items;
  const sticks = pool.slice(0, 18);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
  }, [pendingWinners, phase]);

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'revealing') return undefined;
    const shakeTimer = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onRevealDone();
      }
    }, 2200);
    return () => window.clearTimeout(shakeTimer);
  }, [phase, pendingWinners, onRevealDone]);

  const revealed = phase === 'finished' || phase === 'revealing';
  const winnerName = pendingWinners[0]?.name ?? '？';

  return (
    <div className="theme theme-lot" data-phase={phase}>
      <div className={`lot-cylinder ${(phase === 'playing' || phase === 'revealing') ? 'is-shaking' : ''}`}>
        <div className="lot-rim" />
        <div className="lot-sticks" aria-hidden="true">
          {(sticks.length > 0 ? sticks : Array.from({ length: 8 }, (_, i) => ({ id: `s${i}`, name: '' }))).map(
            (person, i) => {
              const tilt = (i - (sticks.length || 8) / 2) * 3.2;
              return (
                <span
                  key={person.id}
                  className="lot-stick"
                  style={{
                    ['--stick' as string]: `${tilt}deg`,
                    transform: `rotate(${tilt}deg)`,
                    animationDelay: `${i * 40}ms`,
                  }}
                />
              );
            },
          )}
        </div>
        <div className={`lot-drawn ${revealed || phase === 'playing' ? 'is-up' : ''}`}>
          <span className="lot-drawn-text">{phase === 'playing' && !revealed ? '…' : winnerName}</span>
        </div>
      </div>
      <p className="theme-hint">
        {phase === 'playing' || phase === 'revealing' ? '竹籤搖動中…' : '搖筒抽籤，抽出中選之名'}
      </p>
    </div>
  );
}
