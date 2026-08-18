import { useEffect, useMemo, useRef, useState } from 'react';
import type { ThemeViewProps } from '../../lib/types';

const PLUSH_COLORS = [
  { body: '#ffb3c8', ear: '#ff8fab', blush: '#ff6b8a' },
  { body: '#b8e0ff', ear: '#89cff0', blush: '#5eb3e8' },
  { body: '#ffeaa7', ear: '#fdcb6e', blush: '#f0b429' },
  { body: '#c8f7dc', ear: '#95e1a8', blush: '#6bcb77' },
  { body: '#e8d5ff', ear: '#c9a0ff', blush: '#a66cff' },
  { body: '#ffd6c2', ear: '#ffb088', blush: '#ff8c5a' },
];

function plushColor(index: number) {
  return PLUSH_COLORS[index % PLUSH_COLORS.length];
}

export function ClawTheme({
  items,
  remaining,
  phase,
  pendingWinners,
  onRevealDone,
}: ThemeViewProps) {
  const pool = remaining.length > 0 ? remaining : items;
  const plushies = useMemo(() => pool.slice(0, 10), [pool]);
  const [clawX, setClawX] = useState(50);
  const [dropping, setDropping] = useState(false);
  const [caught, setCaught] = useState(false);
  const [sparkle, setSparkle] = useState(false);
  const doneRef = useRef(false);

  useEffect(() => {
    doneRef.current = false;
    setDropping(false);
    setCaught(false);
    setSparkle(false);
    setClawX(50);
  }, [pendingWinners, phase]);

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'revealing') return undefined;

    const winner = pendingWinners[0];
    let targetIndex = plushies.findIndex((b) => b.id === winner?.id);
    if (targetIndex < 0) targetIndex = Math.floor(plushies.length / 2);
    const targetX = plushies.length <= 1 ? 50 : 14 + (targetIndex / Math.max(plushies.length - 1, 1)) * 72;

    setClawX(22);
    const moveTimer = window.setTimeout(() => setClawX(targetX), 80);
    const dropTimer = window.setTimeout(() => setDropping(true), 950);
    const catchTimer = window.setTimeout(() => {
      setCaught(true);
      setSparkle(true);
    }, 1750);
    const doneTimer = window.setTimeout(() => {
      if (!doneRef.current) {
        doneRef.current = true;
        onRevealDone();
      }
    }, 2800);

    return () => {
      window.clearTimeout(moveTimer);
      window.clearTimeout(dropTimer);
      window.clearTimeout(catchTimer);
      window.clearTimeout(doneTimer);
    };
  }, [phase, pendingWinners, plushies, onRevealDone]);

  const winnerName = pendingWinners[0]?.name;
  const winnerIndex = plushies.findIndex((p) => p.id === pendingWinners[0]?.id);
  const winnerColor = plushColor(winnerIndex >= 0 ? winnerIndex : 0);

  return (
    <div className="theme theme-claw" data-phase={phase}>
      <div className="cupi-cabinet">
        <div className="cupi-marquee">
          <span className="cupi-star cupi-star--l" aria-hidden="true">★</span>
          <span className="cupi-marquee-text">桃籤娃娃機</span>
          <span className="cupi-star cupi-star--r" aria-hidden="true">★</span>
        </div>

        <div className="cupi-body">
          <div className="cupi-glass">
            <div className="cupi-rail">
              <div className="cupi-rail-track" />
              <div
                className={`cupi-trolley ${dropping ? 'is-dropping' : ''} ${caught ? 'is-caught' : ''}`}
                style={{ left: `${clawX}%` }}
              >
                <div className="cupi-trolley-body" />
                <div className="cupi-cable" />
                <div className="cupi-claw">
                  <span className="cupi-claw-prong cupi-claw-prong--l" />
                  <span className="cupi-claw-prong cupi-claw-prong--c" />
                  <span className="cupi-claw-prong cupi-claw-prong--r" />
                  <span className="cupi-claw-face" aria-hidden="true">
                    {caught ? '^' : dropping ? 'o' : '·'}
                  </span>
                </div>
                {caught && winnerName ? (
                  <div className="cupi-caught-plush" style={{ ['--plush-body' as string]: winnerColor.body }}>
                    <span className="cupi-caught-ear cupi-caught-ear--l" style={{ background: winnerColor.ear }} />
                    <span className="cupi-caught-ear cupi-caught-ear--r" style={{ background: winnerColor.ear }} />
                    <span className="cupi-caught-name">{winnerName}</span>
                  </div>
                ) : null}
              </div>
            </div>

            <div className="cupi-floor" />

            <div className="cupi-pile">
              {plushies.map((plush, i) => {
                const colors = plushColor(i);
                const isTarget = pendingWinners[0]?.id === plush.id && (dropping || caught);
                const left = plushies.length <= 1 ? 50 : 14 + (i / Math.max(plushies.length - 1, 1)) * 72;
                const bottom = 6 + (i % 4) * 10 + (i % 2) * 4;
                const rotate = -18 + (i % 5) * 9;
                const scale = 0.82 + (i % 3) * 0.08;

                return (
                  <div
                    key={plush.id}
                    className={`cupi-plush ${isTarget && caught ? 'is-taken' : ''}`}
                    style={{
                      left: `${left}%`,
                      bottom: `${bottom}%`,
                      ['--plush-body' as string]: colors.body,
                      ['--plush-ear' as string]: colors.ear,
                      ['--plush-blush' as string]: colors.blush,
                      ['--plush-rot' as string]: `${rotate}deg`,
                      ['--plush-scale' as string]: String(scale),
                    }}
                  >
                    <span className="cupi-plush-ear cupi-plush-ear--l" />
                    <span className="cupi-plush-ear cupi-plush-ear--r" />
                    <span className="cupi-plush-face">
                      <span className="cupi-plush-eye" />
                      <span className="cupi-plush-eye" />
                    </span>
                    <span className="cupi-plush-name">{plush.name}</span>
                  </div>
                );
              })}
            </div>

            {sparkle ? (
              <div className="cupi-sparkles" aria-hidden="true">
                {Array.from({ length: 8 }, (_, i) => (
                  <span key={i} className="cupi-sparkle" style={{ ['--i' as string]: String(i) }} />
                ))}
              </div>
            ) : null}

            <div className="cupi-glass-shine" aria-hidden="true" />
          </div>
        </div>

        <div className="cupi-panel">
          <div className="cupi-joystick" aria-hidden="true">
            <span className="cupi-stick" />
            <span className="cupi-knob" />
          </div>
          <div className="cupi-coin-slot" aria-hidden="true">
            <span>投幣口</span>
          </div>
          <div className="cupi-btn" aria-hidden="true">START</div>
        </div>
      </div>

      <p className="theme-hint">
        {phase === 'playing' || phase === 'revealing'
          ? '爪子出動中…'
          : '可愛街機風格，下爪夾起中選之名'}
      </p>
    </div>
  );
}
