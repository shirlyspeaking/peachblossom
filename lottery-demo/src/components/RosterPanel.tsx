import type { Person } from '../lib/types';

type Props = {
  open: boolean;
  batchInput: string;
  onBatchChange: (value: string) => void;
  withoutReplacement: boolean;
  onWithoutReplacementChange: (value: boolean) => void;
  items: Person[];
  remaining: Person[];
  winners: Person[];
  error: string;
  onApply: () => void;
  onResetPool: () => void;
  onClose: () => void;
};

export function RosterPanel({
  open,
  batchInput,
  onBatchChange,
  withoutReplacement,
  onWithoutReplacementChange,
  items,
  remaining,
  winners,
  error,
  onApply,
  onResetPool,
  onClose,
}: Props) {
  return (
    <>
      <div
        className={`roster-backdrop ${open ? 'is-open' : ''}`}
        onClick={onClose}
        aria-hidden={!open}
      />
      <aside className={`roster-panel ${open ? 'is-open' : ''}`} aria-label="名單與設定">
        <div className="roster-head">
          <h2>名單與設定</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="關閉">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>

        <label className="field-label" htmlFor="roster-batch">
          名單（一人一行，可用逗號分隔）
        </label>
        <textarea
          id="roster-batch"
          className="roster-textarea"
          value={batchInput}
          onChange={(e) => onBatchChange(e.target.value)}
          rows={10}
          spellCheck={false}
        />

        <div className="roster-actions">
          <button type="button" className="btn btn-primary" onClick={onApply}>
            套用名單
          </button>
          <button type="button" className="btn btn-ghost" onClick={onResetPool}>
            重置未抽池
          </button>
        </div>

        <label className="check-row">
          <input
            type="checkbox"
            checked={withoutReplacement}
            onChange={(e) => onWithoutReplacementChange(e.target.checked)}
          />
          <span>不放回（已抽者不進下一輪）</span>
        </label>

        {error ? <p className="form-error">{error}</p> : null}

        <div className="roster-stats">
          <div>
            <strong>{items.length}</strong>
            <span>總人數</span>
          </div>
          <div>
            <strong>{remaining.length}</strong>
            <span>未抽</span>
          </div>
          <div>
            <strong>{winners.length}</strong>
            <span>已抽中</span>
          </div>
        </div>

        {winners.length > 0 ? (
          <div className="roster-winners">
            <h3>本場已抽中</h3>
            <p>{winners.map((w) => w.name).join('、')}</p>
          </div>
        ) : null}
      </aside>
    </>
  );
}
