import { useEffect, useMemo, useRef, useState } from 'react';
import type { ThemeViewProps } from '../../lib/types';

export function BlindBoxTheme({
  phase,
  pendingWinners,
  drawCount,
  onRevealDone,
}: ThemeViewProps) {
  const boxCount = Math.max(1, Math.min(drawCount, 6));
  const [opened, setOpened] = useState<number[]>([]);
  const doneRef = useRef(false);

  const boxes = useMemo(
    () =>
      Array.from({ length: boxCount }, (_, i) => ({
        id: i,
        name: pendingWinners[i]?.name ?? '？',
      })),
    [boxCount, pendingWinners],
  );

  useEffect(() => {
    doneRef.current = false;
    setOpened([]);
  }, [pendingWinners, phase]);

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'revealing') return undefined;

    const timers: number[] = [];
    boxes.forEach((_, i) => {
      timers.push(
        window.setTimeout(() => {
          setOpened((prev) => (prev.includes(i) ? prev : [...prev, i]));
        }, 500 + i * 420),
      );
    });

    timers.push(
      window.setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          onRevealDone();
        }
      }, 500 + boxes.length * 420 + 600),
    );

    return () => timers.forEach((t) => window.clearTimeout(t));
  }, [phase, pendingWinners, boxes, onRevealDone]);

  return (
    <div className="theme theme-blindbox" data-phase={phase}>
      <div className="blindbox-row">
        {boxes.map((box) => {
          const isOpen = opened.includes(box.id) || phase === 'finished';
          return (
            <div key={box.id} className={`blindbox ${isOpen ? 'is-open' : ''}`}>
              <div className="blindbox-lid" />
              <div className="blindbox-body">
                <span className="blindbox-mark">桃</span>
                <span className="blindbox-name">{isOpen ? box.name : '？'}</span>
              </div>
            </div>
          );
        })}
      </div>
      <p className="theme-hint">
        {phase === 'playing' || phase === 'revealing'
          ? '盲盒揭曉中…'
          : `將開啟 ${boxCount} 個盲盒（對應一次抽 ${drawCount} 人）`}
      </p>
    </div>
  );
}
