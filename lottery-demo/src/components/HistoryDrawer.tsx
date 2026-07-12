import type { DrawHistoryEntry } from '../lib/types';
import { THEME_OPTIONS } from '../lib/types';

type Props = {
  open: boolean;
  history: DrawHistoryEntry[];
  onClose: () => void;
};

function themeLabel(id: string) {
  return THEME_OPTIONS.find((t) => t.id === id)?.label ?? id;
}

export function HistoryDrawer({ open, history, onClose }: Props) {
  if (!open) return null;

  return (
    <div className="modal-backdrop" role="presentation" onClick={onClose}>
      <div
        className="history-drawer"
        role="dialog"
        aria-modal="true"
        aria-labelledby="history-title"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="roster-head">
          <h2 id="history-title">抽籤紀錄</h2>
          <button type="button" className="icon-btn" onClick={onClose} aria-label="關閉">
            <i className="fa-solid fa-xmark" aria-hidden="true" />
          </button>
        </div>
        {history.length === 0 ? (
          <p className="muted">尚無紀錄</p>
        ) : (
          <ul className="history-list">
            {history.map((entry) => (
              <li key={entry.id}>
                <div className="history-meta">
                  <span>{themeLabel(entry.theme)}</span>
                  <time dateTime={new Date(entry.at).toISOString()}>
                    {new Date(entry.at).toLocaleTimeString('zh-TW', {
                      hour: '2-digit',
                      minute: '2-digit',
                      second: '2-digit',
                    })}
                  </time>
                </div>
                <strong>{entry.winners.map((w) => w.name).join('、')}</strong>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
