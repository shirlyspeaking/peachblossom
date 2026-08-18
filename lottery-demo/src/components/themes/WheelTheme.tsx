import { useEffect, useRef } from 'react';
import type { ThemeViewProps } from '../../lib/types';

const WHEEL_COLORS = [
  '#f2a3a0',
  '#e8897a',
  '#d4a574',
  '#c9b896',
  '#a8c5a0',
  '#8bb8b0',
  '#9ab0c9',
  '#c4a8c0',
];

export function WheelTheme({
  items,
  remaining,
  phase,
  pendingWinners,
  onRevealDone,
}: ThemeViewProps) {
  const pool = remaining.length > 0 ? remaining : items;
  const display = pool.slice(0, 12);
  const segments = display.length > 0 ? display : [{ id: 'empty', name: '—' }];
  const wheelRef = useRef<HTMLDivElement>(null);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
  }, [pendingWinners, phase]);

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'revealing') return undefined;
    if (!pendingWinners[0] || !wheelRef.current) return undefined;

    const winner = pendingWinners[0];
    let index = segments.findIndex((s) => s.id === winner.id);
    if (index < 0) index = Math.floor(Math.random() * segments.length);

    const slice = 360 / segments.length;
    const target = 360 * 5 + (360 - index * slice - slice / 2);
    const el = wheelRef.current;
    el.style.transition = 'none';
    el.style.transform = 'rotate(0deg)';
    void el.offsetWidth;
    el.style.transition = 'transform 3.2s cubic-bezier(0.12, 0.75, 0.12, 1)';
    el.style.transform = `rotate(${target}deg)`;

    const timer = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onRevealDone();
      }
    }, 3300);

    return () => window.clearTimeout(timer);
  }, [phase, pendingWinners, segments, onRevealDone]);

  const gradient = segments
    .map((_, i) => {
      const start = (i / segments.length) * 360;
      const end = ((i + 1) / segments.length) * 360;
      const color = WHEEL_COLORS[i % WHEEL_COLORS.length];
      return `${color} ${start}deg ${end}deg`;
    })
    .join(', ');

  return (
    <div className="theme theme-wheel" data-phase={phase}>
      <div className="wheel-stage">
        <div className="wheel-pointer" aria-hidden="true" />
        <div
          ref={wheelRef}
          className="wheel-disk"
          style={{ background: `conic-gradient(${gradient})` }}
          role="img"
          aria-label="幸運轉盤"
        >
          {segments.map((person, i) => {
            const angle = ((i + 0.5) / segments.length) * 360;
            return (
              <span
                key={person.id}
                className="wheel-label"
                style={{ transform: `rotate(${angle}deg) translateY(-38%)` }}
              >
                <span style={{ transform: `rotate(${-angle}deg)` }}>{person.name}</span>
              </span>
            );
          })}
        </div>
      </div>
      <p className="theme-hint">
        {phase === 'playing' || phase === 'revealing'
          ? '轉盤轉動中…'
          : pool.length > 12
            ? `顯示前 12 位，共 ${pool.length} 人可抽`
            : '點擊下方開始，轉盤將停在中選者'}
      </p>
    </div>
  );
}
