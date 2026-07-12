import { useEffect, useMemo, useRef, useState } from 'react';
import type { ThemeViewProps } from '../../lib/types';

export function ClawTheme({
  items,
  remaining,
  phase,
  pendingWinners,
  onRevealDone,
}: ThemeViewProps) {
  const pool = remaining.length > 0 ? remaining : items;
  const balls = useMemo(() => pool.slice(0, 10), [pool]);
  const [clawX, setClawX] = useState(50);
  const [dropping, setDropping] = useState(false);
  const [caught, setCaught] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    setDropping(false);
    setCaught(false);
    setClawX(50);
  }, [pendingWinners, phase]);

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'revealing') return undefined;

    const winner = pendingWinners[0];
    let targetIndex = balls.findIndex((b) => b.id === winner?.id);
    if (targetIndex < 0) targetIndex = Math.floor(balls.length / 2);
    const targetX = balls.length <= 1 ? 50 : 12 + (targetIndex / Math.max(balls.length - 1, 1)) * 76;

    setClawX(18);
    const moveTimer = window.setTimeout(() => setClawX(targetX), 80);
    const dropTimer = window.setTimeout(() => setDropping(true), 900);
    const catchTimer = window.setTimeout(() => setCaught(true), 1600);
    const doneTimer = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onRevealDone();
      }
    }, 2600);

    return () => {
      window.clearTimeout(moveTimer);
      window.clearTimeout(dropTimer);
      window.clearTimeout(catchTimer);
      window.clearTimeout(doneTimer);
    };
  }, [phase, pendingWinners, balls, onRevealDone]);

  const winnerName = pendingWinners[0]?.name;

  return (
    <div className="theme theme-claw" data-phase={phase}>
      <div className="claw-machine">
        <div className="claw-rail">
          <div
            className={`claw-arm ${dropping ? 'is-dropping' : ''} ${caught ? 'is-caught' : ''}`}
            style={{ left: `${clawX}%` }}
          >
            <div className="claw-cable" />
            <div className="claw-hand">
              <span className="claw-finger claw-finger--l" />
              <span className="claw-finger claw-finger--r" />
            </div>
            {caught && winnerName ? <div className="claw-prize">{winnerName}</div> : null}
          </div>
        </div>
        <div className="claw-pit">
          {balls.map((ball, i) => {
            const isTarget = pendingWinners[0]?.id === ball.id && (dropping || caught);
            return (
              <div
                key={ball.id}
                className={`claw-ball ${isTarget && caught ? 'is-taken' : ''}`}
                style={{
                  left: `${balls.length <= 1 ? 50 : 12 + (i / Math.max(balls.length - 1, 1)) * 76}%`,
                  bottom: `${10 + (i % 3) * 14}%`,
                }}
              >
                <span>{ball.name}</span>
              </div>
            );
          })}
        </div>
        <div className="claw-glass" aria-hidden="true" />
      </div>
      <p className="theme-hint">
        {phase === 'playing' || phase === 'revealing' ? '爪子下降中…' : '娃娃機下爪，夾起中選之名'}
      </p>
    </div>
  );
}
