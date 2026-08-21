import { useEffect, useMemo, useRef, useState, type CSSProperties } from 'react';
import type { ThemeViewProps } from '../../lib/types';

type ClawBeat = 'idle' | 'seek' | 'drop' | 'grab' | 'lift' | 'deliver' | 'celebrate';
type PlushKind = 'bear' | 'bunny' | 'chick' | 'cat' | 'fox';

const HATCH_X = 18;
const KINDS: PlushKind[] = ['bear', 'bunny', 'chick', 'cat', 'fox'];
const PLUSH_COLORS = [
  { body: '#ffb3c8', ear: '#ff8fab', blush: '#ff6b8a' },
  { body: '#b8e0ff', ear: '#89cff0', blush: '#5eb3e8' },
  { body: '#ffeaa7', ear: '#fdcb6e', blush: '#f0b429' },
  { body: '#c8f7dc', ear: '#95e1a8', blush: '#6bcb77' },
  { body: '#e8d5ff', ear: '#c9a0ff', blush: '#a66cff' },
  { body: '#ffd6c2', ear: '#ffb088', blush: '#ff8c5a' },
];

const HINT: Record<ClawBeat, string> = {
  idle: '街機娃娃機・下爪夾起中選之名',
  seek: '爪子對準中…',
  drop: '下爪中…',
  grab: '夾緊了！',
  lift: '夾起來了',
  deliver: '送往出獎口…',
  celebrate: '出獎口開啟',
};

function plushColor(index: number) {
  return PLUSH_COLORS[index % PLUSH_COLORS.length];
}

function plushKind(index: number): PlushKind {
  return KINDS[index % KINDS.length];
}

function prefersReducedMotion() {
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function Plushie({
  name,
  kind,
  body,
  ear,
  blush,
  taken,
  variant = 'pile',
  style,
}: {
  name: string;
  kind: PlushKind;
  body: string;
  ear: string;
  blush: string;
  taken?: boolean;
  variant?: 'pile' | 'held' | 'hatch';
  style?: CSSProperties;
}) {
  return (
    <div
      className={`cupi-plush cupi-plush--${kind} cupi-plush--${variant}${taken ? ' is-taken' : ''}`}
      style={{
        ...style,
        ['--plush-body' as string]: body,
        ['--plush-ear' as string]: ear,
        ['--plush-blush' as string]: blush,
      }}
    >
      <span className="cupi-plush-ear cupi-plush-ear--l" />
      <span className="cupi-plush-ear cupi-plush-ear--r" />
      {kind === 'chick' ? <span className="cupi-plush-beak" /> : null}
      <span className="cupi-plush-shine" />
      <span className="cupi-plush-face">
        <span className="cupi-plush-eye" />
        <span className="cupi-plush-eye" />
      </span>
      <span className="cupi-plush-blush cupi-plush-blush--l" />
      <span className="cupi-plush-blush cupi-plush-blush--r" />
      <span className="cupi-plush-name">{name}</span>
    </div>
  );
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
  const [beat, setBeat] = useState<ClawBeat>('idle');
  const [clawX, setClawX] = useState(50);
  const [dropY, setDropY] = useState(0);
  const doneRef = useRef(false);

  const winner = pendingWinners[0];
  const winnerIndex = plushies.findIndex((p) => p.id === winner?.id);
  const winnerColor = plushColor(winnerIndex >= 0 ? winnerIndex : 0);
  const winnerKind = plushKind(winnerIndex >= 0 ? winnerIndex : 0);
  const hanging = beat === 'grab' || beat === 'lift' || beat === 'deliver';
  const taken = beat === 'grab' || beat === 'lift' || beat === 'deliver' || beat === 'celebrate';
  const joystickTilt = beat === 'seek' && clawX > 52 ? 'right' : beat === 'seek' || beat === 'deliver' ? 'left' : 'idle';
  const buttonPressed = beat === 'drop' || beat === 'grab' || beat === 'lift';

  useEffect(() => {
    doneRef.current = false;
    setBeat('idle');
    setDropY(0);
    setClawX(50);
  }, [pendingWinners, phase]);

  useEffect(() => {
    if (phase !== 'playing' && phase !== 'revealing') return undefined;

    let targetIndex = plushies.findIndex((b) => b.id === winner?.id);
    if (targetIndex < 0) targetIndex = Math.floor(plushies.length / 2);
    const targetX = plushies.length <= 1 ? 50 : 16 + (targetIndex / Math.max(plushies.length - 1, 1)) * 68;

    if (prefersReducedMotion()) {
      setClawX(HATCH_X);
      setDropY(0);
      setBeat('celebrate');
      const doneTimer = window.setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          onRevealDone();
        }
      }, 420);
      return () => window.clearTimeout(doneTimer);
    }

    setClawX(26);
    setBeat('seek');
    const timers = [
      window.setTimeout(() => setClawX(targetX), 60),
      window.setTimeout(() => {
        setBeat('drop');
        setDropY(128);
      }, 780),
      window.setTimeout(() => setBeat('grab'), 1420),
      window.setTimeout(() => {
        setBeat('lift');
        setDropY(44);
      }, 1760),
      window.setTimeout(() => {
        setBeat('deliver');
        setClawX(HATCH_X);
      }, 2380),
      window.setTimeout(() => {
        setBeat('celebrate');
        setDropY(0);
      }, 3040),
      window.setTimeout(() => {
        if (!doneRef.current) {
          doneRef.current = true;
          onRevealDone();
        }
      }, 3720),
    ];

    return () => timers.forEach((id) => window.clearTimeout(id));
  }, [phase, pendingWinners, plushies, winner?.id, onRevealDone]);

  return (
    <div className="theme theme-claw" data-phase={phase} data-claw={beat}>
      <div className="cupi-cabinet">
        <div className="cupi-marquee">
          <div className="cupi-leds cupi-leds--top" aria-hidden="true">
            {Array.from({ length: 11 }, (_, i) => (
              <span key={i} className="cupi-led" style={{ ['--i' as string]: String(i) }} />
            ))}
          </div>
          <div className="cupi-marquee-row">
            <span className="cupi-star cupi-star--l" aria-hidden="true">★</span>
            <span className="cupi-marquee-text">桃籤娃娃機</span>
            <span className="cupi-star cupi-star--r" aria-hidden="true">★</span>
          </div>
        </div>

        <div className="cupi-body">
          <div className="cupi-side-lights" aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} className="cupi-led" style={{ ['--i' as string]: String(i) }} />
            ))}
          </div>

          <div className="cupi-glass">
            <div className="cupi-rail">
              <div className="cupi-rail-track" />
              <div
                className={`cupi-trolley is-${beat}`}
                style={{ transform: `translateX(${clawX}%)` }}
              >
                <div className="cupi-trolley-body" />
                <div className="cupi-cable" aria-hidden="true" />
                <div className="cupi-claw-cluster" style={{ transform: `translateY(${dropY}px)` }}>
                  <div className="cupi-swing">
                    <div className={`cupi-claw is-${beat}`}>
                      <span className="cupi-finger cupi-finger--l" />
                      <span className="cupi-finger cupi-finger--c" />
                      <span className="cupi-finger cupi-finger--r" />
                      <span className="cupi-palm" />
                    </div>
                    {hanging && winner ? (
                      <Plushie
                        name={winner.name}
                        kind={winnerKind}
                        body={winnerColor.body}
                        ear={winnerColor.ear}
                        blush={winnerColor.blush}
                        variant="held"
                      />
                    ) : null}
                  </div>
                </div>
              </div>
            </div>

            <div className="cupi-floor" />

            <div className="cupi-pile">
              {plushies.map((plush, i) => {
                const colors = plushColor(i);
                const left = plushies.length <= 1 ? 50 : 16 + (i / Math.max(plushies.length - 1, 1)) * 68;
                const bottom = 8 + (i % 4) * 11 + (i % 2) * 5;
                const rotate = -16 + (i % 5) * 8;
                const scale = 0.84 + (i % 3) * 0.08;
                const isTarget = winner?.id === plush.id && taken;

                return (
                  <Plushie
                    key={plush.id}
                    name={plush.name}
                    kind={plushKind(i)}
                    body={colors.body}
                    ear={colors.ear}
                    blush={colors.blush}
                    taken={isTarget}
                    style={{
                      left: `${left}%`,
                      bottom: `${bottom}%`,
                      zIndex: Math.round(bottom),
                      ['--plush-rot' as string]: `${rotate}deg`,
                      ['--plush-scale' as string]: String(scale),
                      ['--plush-delay' as string]: `${(i % 6) * 0.18}s`,
                    }}
                  />
                );
              })}
            </div>

            <div className={`cupi-hatch${beat === 'celebrate' ? ' is-open' : ''}`}>
              <span className="cupi-hatch-lip">出獎口</span>
              {beat === 'celebrate' && winner ? (
                <Plushie
                  name={winner.name}
                  kind={winnerKind}
                  body={winnerColor.body}
                  ear={winnerColor.ear}
                  blush={winnerColor.blush}
                  variant="hatch"
                />
              ) : null}
            </div>

            {beat === 'celebrate' ? (
              <div className="cupi-sparkles" aria-hidden="true">
                {Array.from({ length: 10 }, (_, i) => (
                  <span key={i} className="cupi-sparkle" style={{ ['--i' as string]: String(i) }} />
                ))}
              </div>
            ) : null}

            <div className="cupi-glass-shine" aria-hidden="true" />
          </div>

          <div className="cupi-side-lights" aria-hidden="true">
            {Array.from({ length: 7 }, (_, i) => (
              <span key={i} className="cupi-led cupi-led--lag" style={{ ['--i' as string]: String(i) }} />
            ))}
          </div>
        </div>

        <div className="cupi-panel">
          <div className={`cupi-joystick is-${joystickTilt}`} aria-hidden="true">
            <span className="cupi-joy-base" />
            <span className="cupi-stick" />
            <span className="cupi-knob" />
          </div>
          <div className="cupi-coin-slot" aria-hidden="true">
            <span />
            <em>COIN</em>
          </div>
          <div className={`cupi-go${buttonPressed ? ' is-pressed' : ''}`} aria-hidden="true">
            GET
          </div>
        </div>

        <div className="cupi-feet" aria-hidden="true">
          <span />
          <span />
        </div>
      </div>

      <p className="theme-hint">{HINT[beat]}</p>
    </div>
  );
}
