import { useEffect, useMemo, useRef } from 'react';
import type { Person, ThemeViewProps } from '../../lib/types';

type Petal = {
  id: string;
  name: string;
  x: number;
  y: number;
  rot: number;
  delay: number;
  size: number;
};

function buildPetals(pool: Person[]): Petal[] {
  const source = pool.length > 0 ? pool : [{ id: 'empty', name: '—' }];
  return source.slice(0, 16).map((person, i) => ({
    id: person.id,
    name: person.name,
    x: 8 + ((i * 17) % 84),
    y: 10 + ((i * 23) % 70),
    rot: (i * 47) % 360,
    delay: (i % 8) * 0.12,
    size: 56 + (i % 4) * 8,
  }));
}

export function PetalTheme({
  items,
  remaining,
  phase,
  pendingWinners,
  onRevealDone,
}: ThemeViewProps) {
  const pool = remaining.length > 0 ? remaining : items;
  const petals = useMemo(() => buildPetals(pool), [pool]);
  const doneRef = useRef(false);
  const winnerId = pendingWinners[0]?.id;

  useEffect(() => {
    doneRef.current = false;
  }, [pendingWinners, phase]);

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'revealing') return undefined;
    const timer = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onRevealDone();
      }
    }, 2800);
    return () => window.clearTimeout(timer);
  }, [phase, pendingWinners, onRevealDone]);

  const converging = phase === 'playing' || phase === 'revealing' || phase === 'finished';

  return (
    <div className="theme theme-petal" data-phase={phase}>
      <div className={`petal-field ${converging ? 'is-converging' : ''}`}>
        {petals.map((petal) => {
          const isWinner = winnerId === petal.id && converging;
          return (
            <div
              key={petal.id}
              className={`petal ${isWinner ? 'is-winner' : ''} ${converging && !isWinner ? 'is-fade' : ''}`}
              style={{
                left: `${petal.x}%`,
                top: `${petal.y}%`,
                width: petal.size,
                height: petal.size * 0.72,
                ['--rot' as string]: `${petal.rot}deg`,
                animationDelay: `${petal.delay}s`,
              }}
            >
              <span>{petal.name}</span>
            </div>
          );
        })}
      </div>
      <p className="theme-hint">
        {phase === 'playing' || phase === 'revealing' ? '花瓣聚攏中…' : '桃花飄舞，最終停落在中選者'}
      </p>
    </div>
  );
}
