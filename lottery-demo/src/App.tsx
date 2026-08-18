import { useEffect } from 'react';
import { HistoryDrawer } from './components/HistoryDrawer';
import { ResultModal } from './components/ResultModal';
import { RosterPanel } from './components/RosterPanel';
import { ThemeStage } from './components/ThemeStage';
import { ThemeSwitcher } from './components/ThemeSwitcher';
import { useDrawEngine } from './hooks/useDrawEngine';
import { THEME_OPTIONS } from './lib/types';

function App() {
  const engine = useDrawEngine();
  const themeLabel = THEME_OPTIONS.find((t) => t.id === engine.uiTheme)?.label ?? '';
  const {
    phase,
    historyOpen,
    rosterOpen,
    canDraw,
    dismissResult,
    setHistoryOpen,
    setRosterOpen,
    startDraw,
  } = engine;

  useEffect(() => {
    const onKey = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        if (phase === 'finished') {
          dismissResult();
          return;
        }
        if (historyOpen) {
          setHistoryOpen(false);
          return;
        }
        if (rosterOpen) {
          setRosterOpen(false);
        }
        return;
      }
      if (event.key === 'Enter' && (event.metaKey || event.ctrlKey) && canDraw) {
        event.preventDefault();
        startDraw();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [
    phase,
    historyOpen,
    rosterOpen,
    canDraw,
    dismissResult,
    setHistoryOpen,
    setRosterOpen,
    startDraw,
  ]);

  return (
    <div className="app-shell">
      <header className="top-bar">
        <a className="back-link" href="../index.html">
          <i className="fa-solid fa-arrow-left" aria-hidden="true" />
          桃花源
        </a>
        <div className="brand-block">
          <p className="brand-eyebrow">Peachblossom</p>
          <h1 className="brand-title">桃籤・點名台</h1>
        </div>
        <div className="top-actions">
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => engine.setRosterOpen(true)}
          >
            <i className="fa-solid fa-users" aria-hidden="true" />
            名單
          </button>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => engine.setHistoryOpen(true)}
          >
            <i className="fa-solid fa-clock-rotate-left" aria-hidden="true" />
            紀錄
          </button>
        </div>
      </header>

      <div className="theme-bar">
        <ThemeSwitcher value={engine.uiTheme} onChange={engine.changeTheme} />
      </div>

      <main className="stage-wrap">
        <section className="stage" aria-label={`${themeLabel}抽籤舞台`}>
          <ThemeStage
            theme={engine.uiTheme}
            items={engine.items}
            remaining={engine.remaining}
            phase={engine.phase}
            pendingWinners={engine.pendingWinners}
            drawCount={engine.drawCount}
            onRequestStart={engine.startDraw}
            onRevealDone={engine.finishReveal}
          />
        </section>

        <aside className="side-rail" aria-label="狀態摘要">
          <div className="stat-card">
            <span>可抽</span>
            <strong>{engine.pool.length}</strong>
          </div>
          <div className="stat-card">
            <span>已中選</span>
            <strong>{engine.winners.length}</strong>
          </div>
          <div className="stat-card">
            <span>介面</span>
            <strong>{themeLabel}</strong>
          </div>
        </aside>
      </main>

      <footer className="bottom-bar">
        <label className="count-field">
          <span>一次抽</span>
          <input
            type="number"
            min={1}
            max={Math.max(1, engine.pool.length)}
            value={engine.drawCount}
            onChange={(e) => {
              const next = Number(e.target.value) || 1;
              engine.setDrawCount(Math.max(1, Math.min(next, Math.max(1, engine.pool.length))));
            }}
            disabled={engine.phase === 'playing' || engine.phase === 'revealing'}
          />
          <span>人</span>
        </label>

        <button
          type="button"
          className="btn btn-primary btn-draw"
          onClick={engine.startDraw}
          disabled={!engine.canDraw}
        >
          {engine.phase === 'playing' || engine.phase === 'revealing'
            ? '抽籤中…'
            : engine.phase === 'finished'
              ? '再抽一次'
              : '開始抽籤'}
        </button>

        <button type="button" className="btn btn-ghost" onClick={engine.resetPool}>
          重置未抽
        </button>
      </footer>

      {engine.error ? <p className="toast-error" role="alert">{engine.error}</p> : null}

      <RosterPanel
        open={engine.rosterOpen}
        batchInput={engine.batchInput}
        onBatchChange={engine.setBatchInput}
        withoutReplacement={engine.withoutReplacement}
        onWithoutReplacementChange={engine.setWithoutReplacement}
        items={engine.items}
        remaining={engine.remaining}
        winners={engine.winners}
        error={engine.error}
        onApply={engine.replaceFromBatch}
        onResetPool={engine.resetPool}
        onClose={() => engine.setRosterOpen(false)}
      />

      <HistoryDrawer
        open={engine.historyOpen}
        history={engine.history}
        onClose={() => engine.setHistoryOpen(false)}
      />

      <ResultModal
        open={engine.phase === 'finished'}
        phase={engine.phase}
        winners={engine.pendingWinners}
        onClose={engine.dismissResult}
      />
    </div>
  );
}

export default App;
