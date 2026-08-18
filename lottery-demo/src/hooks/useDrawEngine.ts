import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import {
  DEFAULT_NAMES,
  STORAGE_KEY,
  createId,
  normalizePerson,
  parseNames,
  peopleFromNames,
  pickWinners,
} from '../lib/roster';
import type { DrawHistoryEntry, DrawPhase, Person, UiTheme } from '../lib/types';

export function useDrawEngine() {
  const [items, setItems] = useState<Person[]>([]);
  const [remaining, setRemaining] = useState<Person[]>([]);
  const [winners, setWinners] = useState<Person[]>([]);
  const [pendingWinners, setPendingWinners] = useState<Person[]>([]);
  const [drawCount, setDrawCount] = useState(1);
  const [withoutReplacement, setWithoutReplacement] = useState(true);
  const [phase, setPhase] = useState<DrawPhase>('idle');
  const [uiTheme, setUiTheme] = useState<UiTheme>('wheel');
  const [history, setHistory] = useState<DrawHistoryEntry[]>([]);
  const [batchInput, setBatchInput] = useState(DEFAULT_NAMES.join('\n'));
  const [error, setError] = useState('');
  const [rosterOpen, setRosterOpen] = useState(false);
  const [historyOpen, setHistoryOpen] = useState(false);

  const phaseRef = useRef(phase);
  const pendingRef = useRef(pendingWinners);
  const withoutRef = useRef(withoutReplacement);
  const themeRef = useRef(uiTheme);

  useEffect(() => {
    phaseRef.current = phase;
  }, [phase]);
  useEffect(() => {
    pendingRef.current = pendingWinners;
  }, [pendingWinners]);
  useEffect(() => {
    withoutRef.current = withoutReplacement;
  }, [withoutReplacement]);
  useEffect(() => {
    themeRef.current = uiTheme;
  }, [uiTheme]);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (!saved) {
      const defaults = peopleFromNames(DEFAULT_NAMES);
      setItems(defaults);
      setRemaining(defaults);
      return;
    }
    try {
      const parsed = JSON.parse(saved) as unknown[];
      if (Array.isArray(parsed) && parsed.length > 0) {
        const restored = parsed.map(normalizePerson).filter(Boolean) as Person[];
        if (restored.length > 0) {
          setItems(restored);
          setRemaining(restored);
          setBatchInput(restored.map((p) => p.name).join('\n'));
          return;
        }
      }
    } catch {
      localStorage.removeItem(STORAGE_KEY);
    }
    const defaults = peopleFromNames(DEFAULT_NAMES);
    setItems(defaults);
    setRemaining(defaults);
  }, []);

  useEffect(() => {
    if (items.length === 0) {
      localStorage.removeItem(STORAGE_KEY);
      return;
    }
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
  }, [items]);

  const pool = useMemo(
    () => (withoutReplacement ? remaining : items),
    [withoutReplacement, remaining, items],
  );

  const canDraw = pool.length > 0 && phase !== 'playing' && phase !== 'revealing';

  const applyRoster = useCallback((names: string[]) => {
    if (names.length === 0) {
      setError('清單中至少需要一位姓名。');
      return false;
    }
    const next = peopleFromNames(names);
    setItems(next);
    setRemaining(next);
    setWinners([]);
    setPendingWinners([]);
    setPhase('idle');
    setHistory([]);
    setDrawCount(1);
    setError('');
    setBatchInput(next.map((p) => p.name).join('\n'));
    return true;
  }, []);

  const replaceFromBatch = useCallback(() => {
    applyRoster(parseNames(batchInput));
  }, [applyRoster, batchInput]);

  const resetPool = useCallback(() => {
    setRemaining(items);
    setWinners([]);
    setPendingWinners([]);
    setPhase('idle');
    setError('');
  }, [items]);

  const startDraw = useCallback(() => {
    if (phaseRef.current === 'playing' || phaseRef.current === 'revealing') return;
    if (pool.length === 0) {
      setError(withoutReplacement ? '名單已抽完，請重置未抽池。' : '請先匯入名單。');
      return;
    }
    const picked = pickWinners(pool, drawCount);
    if (picked.length === 0) {
      setError('無法抽出結果。');
      return;
    }
    setError('');
    setPendingWinners(picked);
    setPhase('playing');
  }, [pool, withoutReplacement, drawCount]);

  const finishReveal = useCallback(() => {
    if (phaseRef.current !== 'playing' && phaseRef.current !== 'revealing') return;
    const current = pendingRef.current;
    if (current.length === 0) return;

    phaseRef.current = 'finished';
    setPhase('finished');
    setWinners((prev) => [...prev, ...current]);
    if (withoutRef.current) {
      const ids = new Set(current.map((p) => p.id));
      setRemaining((prev) => prev.filter((p) => !ids.has(p.id)));
    }
    setHistory((prev) =>
      [
        {
          id: createId(),
          at: Date.now(),
          winners: current,
          theme: themeRef.current,
        },
        ...prev,
      ].slice(0, 30),
    );
  }, []);

  const dismissResult = useCallback(() => {
    setPhase('idle');
    setPendingWinners([]);
  }, []);

  const changeTheme = useCallback((theme: UiTheme) => {
    setUiTheme(theme);
  }, []);

  return {
    items,
    remaining,
    winners,
    pendingWinners,
    drawCount,
    setDrawCount,
    withoutReplacement,
    setWithoutReplacement,
    phase,
    uiTheme,
    changeTheme,
    history,
    batchInput,
    setBatchInput,
    error,
    setError,
    rosterOpen,
    setRosterOpen,
    historyOpen,
    setHistoryOpen,
    pool,
    canDraw,
    replaceFromBatch,
    resetPool,
    startDraw,
    finishReveal,
    dismissResult,
  };
}
